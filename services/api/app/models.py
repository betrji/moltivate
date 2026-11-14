import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Uuid,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    __table_args__ = (CheckConstraint("length(display_name) between 1 and 80"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    display_name: Mapped[str] = mapped_column(String(80), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)


class Challenge(Base):
    """An off-chain draft only. Never a funded on-chain challenge or deposit."""

    __tablename__ = "challenges"
    __table_args__ = (
        CheckConstraint("target_reps > 0"),
        CheckConstraint("team_size > 0"),
        CheckConstraint("stake_lamports >= 0"),
        CheckConstraint("status in ('draft', 'open')"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    creator_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    exercise: Mapped[str] = mapped_column(String(40), nullable=False)
    target_reps: Mapped[int] = mapped_column(Integer, nullable=False)
    team_size: Mapped[int] = mapped_column(Integer, nullable=False)
    stake_lamports: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(10), nullable=False, default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    teams: Mapped[list["Team"]] = relationship(back_populates="challenge", cascade="all, delete-orphan")


class Team(Base):
    __tablename__ = "teams"
    __table_args__ = (UniqueConstraint("challenge_id", "name"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    challenge_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("challenges.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(60), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    challenge: Mapped[Challenge] = relationship(back_populates="teams")
    members: Mapped[list["TeamMember"]] = relationship(back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"
    __table_args__ = (
        UniqueConstraint("team_id", "user_id"),
        # Backstop against double enrollment in the same challenge. The API
        # layer is what actually enforces "one team per challenge per user"
        # (see crud.join_team); this constraint only catches a stray direct
        # insert that bypasses it.
        UniqueConstraint("challenge_id", "user_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("teams.id"), nullable=False)
    challenge_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("challenges.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("users.id"), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    team: Mapped[Team] = relationship(back_populates="members")
    sessions: Mapped[list["WorkoutSession"]] = relationship(back_populates="team_member", cascade="all, delete-orphan")


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"
    __table_args__ = (
        CheckConstraint("reps >= 0"),
        CheckConstraint("source in ('browser', 'camera_upload')"),
        CheckConstraint("trust_level in ('low', 'unverified')"),
        CheckConstraint("liveness_result in ('not_run', 'pass', 'fail')"),
        CheckConstraint("status in ('accepted', 'rejected')"),
        UniqueConstraint("team_member_id", "idempotency_key"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    team_member_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("team_members.id"), nullable=False)
    source: Mapped[str] = mapped_column(String(20), nullable=False)
    reps: Mapped[int] = mapped_column(Integer, nullable=False)
    trust_level: Mapped[str] = mapped_column(String(20), nullable=False)
    liveness_result: Mapped[str] = mapped_column(String(10), nullable=False)
    status: Mapped[str] = mapped_column(String(10), nullable=False)
    idempotency_key: Mapped[str] = mapped_column(String(128), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    team_member: Mapped[TeamMember] = relationship(back_populates="sessions")
