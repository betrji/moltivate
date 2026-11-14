"""Workout session submission.

Every field here is untrusted client input except `trust_level`, which the
API derives from `source` server-side (see schemas.derive_trust_level).
Nothing in this router signs or submits an on-chain result, and no footage
is actually processed yet: `liveness_result` is a self-reported placeholder
until a real verifier worker exists.
"""

import uuid

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter()


@router.post(
    "/team-members/{team_member_id}/sessions",
    response_model=schemas.WorkoutSessionContract,
    status_code=201,
)
def submit_session(
    team_member_id: uuid.UUID,
    data: schemas.WorkoutSessionSubmission,
    idempotency_key: str = Header(..., alias="Idempotency-Key", min_length=1, max_length=128),
    db: Session = Depends(get_db),
) -> schemas.WorkoutSessionContract:
    return crud.submit_session(db, team_member_id, data, idempotency_key)
