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
from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, PlainSerializer

# Postgres "integer" columns (see supabase/migrations) are 4-byte signed;
# bound anything stored in one so out-of-range input is a 422, not a
# database OverflowError/500.
MAX_INT32 = 2**31 - 1

# Columns typed `bigint` (8-byte signed), e.g. stake_lamports, top out here.
MAX_LAMPORTS = 2**63 - 1


def _coerce_lamports(value: object) -> object:
    if isinstance(value, str):
        if not value.isdigit():
            raise ValueError("stake_lamports must be a non-negative integer")
        return int(value)
    return value


# JavaScript `Number` can't exactly represent integers past 2**53-1, so a
# plain JSON number would silently lose precision for large lamport
# amounts. Accept either a JSON integer or a decimal string, and always
# serialize as a string so JS clients round-trip the exact value.
Lamports = Annotated[
    int,
    BeforeValidator(_coerce_lamports),
    Field(ge=0, le=MAX_LAMPORTS),
    PlainSerializer(lambda value: str(value), return_type=str),
]


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
    reps: int = Field(ge=0, le=MAX_INT32)
    trust_level: TrustLevel
    liveness_result: LivenessResult
    status: SessionStatus
    created_at: datetime


class WorkoutSessionSubmission(BaseModel):
    """What a client actually sends; trust_level is computed server-side."""

    source: SessionSource
    reps: int = Field(ge=0, le=MAX_INT32)
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
    target_reps: int = Field(gt=0, le=MAX_INT32)
    team_size: int = Field(gt=0, le=MAX_INT32)
    stake_lamports: Lamports


class ChallengeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    creator_id: uuid.UUID
    title: str
    exercise: str
    target_reps: int
    team_size: int
    stake_lamports: Lamports
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
