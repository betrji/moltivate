"""Pydantic models, including the shared workout-session contract.

`WorkoutSessionContract` is the single source of truth for the session
shape other services (a future verifier worker, the mobile app) should
agree on. `scripts/export_contract.py` dumps its JSON Schema to
`packages/contracts/session-contract.json` so it can be consumed outside
this API; regenerate that file after changing this class instead of
hand-editing the JSON.
"""

import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class SessionSource(str, Enum):
    browser = "browser"
    camera_upload = "camera_upload"


class TrustLevel(str, Enum):
    """Server-derived from `SessionSource`; never accepted from a client."""

    low = "low"
    unverified = "unverified"


class LivenessResult(str, Enum):
    """Self-reported placeholder until a real liveness/verification worker
    exists (see architecture.md section 8). A client-reported `passed` is
    never treated as proof of a completed workout.
    """

    not_run = "not_run"
    passed = "pass"
    failed = "fail"


def derive_trust_level(source: SessionSource) -> TrustLevel:
    return TrustLevel.low if source is SessionSource.browser else TrustLevel.unverified


class SessionStatus(str, Enum):
    accepted = "accepted"
    rejected = "rejected"


class WorkoutSessionContract(BaseModel):
    """Shared contract for a submitted workout session."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    team_member_id: uuid.UUID
    source: SessionSource
    reps: int = Field(ge=0)
    trust_level: TrustLevel
    liveness_result: LivenessResult
    status: SessionStatus
    created_at: datetime


class WorkoutSessionSubmission(BaseModel):
    """What a client actually sends; trust_level is computed server-side."""

    source: SessionSource
    reps: int = Field(ge=0)
    liveness_result: LivenessResult = LivenessResult.not_run


class UserCreate(BaseModel):
    display_name: str = Field(min_length=1, max_length=80)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    display_name: str
    created_at: datetime


class ChallengeCreate(BaseModel):
    creator_id: uuid.UUID
    title: str = Field(min_length=1, max_length=120)
    exercise: str = Field(min_length=1, max_length=40)
    target_reps: int = Field(gt=0)
    team_size: int = Field(gt=0)
    stake_lamports: int = Field(ge=0)


class ChallengeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    creator_id: uuid.UUID
    title: str
    exercise: str
    target_reps: int
    team_size: int
    stake_lamports: int
    status: str
    created_at: datetime


class TeamCreate(BaseModel):
    name: str = Field(min_length=1, max_length=60)


class TeamRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    challenge_id: uuid.UUID
    name: str
    created_at: datetime


class TeamMemberCreate(BaseModel):
    user_id: uuid.UUID


class TeamMemberRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    team_id: uuid.UUID
    challenge_id: uuid.UUID
    user_id: uuid.UUID
    joined_at: datetime


class ScoreboardMember(BaseModel):
    user_id: uuid.UUID
    accepted_reps: int
    completed: bool


class ScoreboardTeam(BaseModel):
    team_id: uuid.UUID
    name: str
    members: list[ScoreboardMember]
    completers: int


class ScoreboardResponse(BaseModel):
    challenge_id: uuid.UUID
    target_reps: int
    teams: list[ScoreboardTeam]
