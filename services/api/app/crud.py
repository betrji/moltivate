"""Business logic and validation. Routers translate these exceptions to
HTTP responses; nothing here knows about FastAPI.
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models, schemas


class NotFoundError(Exception):
    pass


class ConflictError(Exception):
    pass


def create_user(db: Session, data: schemas.UserCreate) -> models.User:
    user = models.User(display_name=data.display_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user(db: Session, user_id: uuid.UUID) -> models.User:
    user = db.get(models.User, user_id)
    if user is None:
        raise NotFoundError(f"user {user_id} not found")
    return user


def create_challenge(db: Session, data: schemas.ChallengeCreate) -> models.Challenge:
    get_user(db, data.creator_id)  # raises NotFoundError if the creator doesn't exist
    challenge = models.Challenge(
        creator_id=data.creator_id,
        title=data.title,
        exercise=data.exercise,
        target_reps=data.target_reps,
        team_size=data.team_size,
        stake_lamports=data.stake_lamports,
        status="draft",
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


def get_challenge(db: Session, challenge_id: uuid.UUID) -> models.Challenge:
    challenge = db.get(models.Challenge, challenge_id)
    if challenge is None:
        raise NotFoundError(f"challenge {challenge_id} not found")
    return challenge


def create_team(db: Session, challenge_id: uuid.UUID, data: schemas.TeamCreate) -> models.Team:
    get_challenge(db, challenge_id)
    team = models.Team(challenge_id=challenge_id, name=data.name)
    db.add(team)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError(f"team name '{data.name}' already exists in this challenge") from exc
    db.refresh(team)
    return team


def get_team(db: Session, team_id: uuid.UUID) -> models.Team:
    team = db.get(models.Team, team_id)
    if team is None:
        raise NotFoundError(f"team {team_id} not found")
    return team


def join_team(db: Session, team_id: uuid.UUID, data: schemas.TeamMemberCreate) -> models.TeamMember:
    team = get_team(db, team_id)
    get_user(db, data.user_id)
    challenge = get_challenge(db, team.challenge_id)

    existing_in_challenge = db.scalar(
        select(models.TeamMember).where(
            models.TeamMember.challenge_id == team.challenge_id,
            models.TeamMember.user_id == data.user_id,
        )
    )
    if existing_in_challenge is not None:
        raise ConflictError("user already belongs to a team in this challenge")

    current_size = db.scalar(
        select(func.count()).select_from(models.TeamMember).where(models.TeamMember.team_id == team_id)
    )
    if current_size is not None and current_size >= challenge.team_size:
        raise ConflictError(f"team '{team.name}' already has {challenge.team_size} members")

    member = models.TeamMember(team_id=team_id, challenge_id=team.challenge_id, user_id=data.user_id)
    db.add(member)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("user already belongs to a team in this challenge") from exc
    db.refresh(member)
    return member


def get_team_member(db: Session, team_member_id: uuid.UUID) -> models.TeamMember:
    member = db.get(models.TeamMember, team_member_id)
    if member is None:
        raise NotFoundError(f"team member {team_member_id} not found")
    return member


def _submission_matches(existing: models.WorkoutSession, data: schemas.WorkoutSessionSubmission) -> bool:
    return (
        existing.source == data.source.value
        and existing.reps == data.reps
        and existing.liveness_result == data.liveness_result.value
    )


def submit_session(
    db: Session,
    team_member_id: uuid.UUID,
    data: schemas.WorkoutSessionSubmission,
    idempotency_key: str,
) -> models.WorkoutSession:
    get_team_member(db, team_member_id)

    existing = db.scalar(
        select(models.WorkoutSession).where(
            models.WorkoutSession.team_member_id == team_member_id,
            models.WorkoutSession.idempotency_key == idempotency_key,
        )
    )
    if existing is not None:
        if _submission_matches(existing, data):
            return existing
        raise ConflictError("idempotency key reused with a different payload")

    trust_level = schemas.derive_trust_level(data.source)
    status = (
        schemas.SessionStatus.rejected
        if data.liveness_result == schemas.LivenessResult.failed
        else schemas.SessionStatus.accepted
    )

    session = models.WorkoutSession(
        team_member_id=team_member_id,
        source=data.source.value,
        reps=data.reps,
        trust_level=trust_level.value,
        liveness_result=data.liveness_result.value,
        status=status.value,
        idempotency_key=idempotency_key,
    )
    db.add(session)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        # Lost a race against a concurrent identical submission; re-check
        # rather than surface a spurious conflict.
        existing = db.scalar(
            select(models.WorkoutSession).where(
                models.WorkoutSession.team_member_id == team_member_id,
                models.WorkoutSession.idempotency_key == idempotency_key,
            )
        )
        if existing is not None and _submission_matches(existing, data):
            return existing
        raise ConflictError("idempotency key reused with a different payload") from exc
    db.refresh(session)
    return session


def build_scoreboard(db: Session, challenge_id: uuid.UUID) -> schemas.ScoreboardResponse:
    challenge = get_challenge(db, challenge_id)

    teams_payload: list[schemas.ScoreboardTeam] = []
    for team in sorted(challenge.teams, key=lambda t: t.name):
        members_payload: list[schemas.ScoreboardMember] = []
        completers = 0
        for member in team.members:
            accepted_reps = sum(s.reps for s in member.sessions if s.status == "accepted")
            capped_reps = min(accepted_reps, challenge.target_reps)
            completed = capped_reps >= challenge.target_reps
            if completed:
                completers += 1
            members_payload.append(
                schemas.ScoreboardMember(
                    user_id=member.user_id,
                    accepted_reps=capped_reps,
                    completed=completed,
                )
            )
        teams_payload.append(
            schemas.ScoreboardTeam(
                team_id=team.id,
                name=team.name,
                members=members_payload,
                completers=completers,
            )
        )

    return schemas.ScoreboardResponse(
        challenge_id=challenge.id,
        target_reps=challenge.target_reps,
        teams=teams_payload,
    )
