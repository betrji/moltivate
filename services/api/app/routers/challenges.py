"""Challenge drafts.

A row created here is a database draft only. It is not a published
on-chain challenge, and `stake_lamports` is an illustrative figure until
the Anchor program in architecture.md section 6 exists and a deposit is
confirmed on-chain.
"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter()


@router.post("/challenges", response_model=schemas.ChallengeRead, status_code=201)
def create_challenge(data: schemas.ChallengeCreate, db: Session = Depends(get_db)) -> schemas.ChallengeRead:
    return crud.create_challenge(db, data)


@router.get("/challenges/{challenge_id}", response_model=schemas.ChallengeRead)
def read_challenge(challenge_id: uuid.UUID, db: Session = Depends(get_db)) -> schemas.ChallengeRead:
    return crud.get_challenge(db, challenge_id)


@router.post("/challenges/{challenge_id}/teams", response_model=schemas.TeamRead, status_code=201)
def create_team(
    challenge_id: uuid.UUID, data: schemas.TeamCreate, db: Session = Depends(get_db)
) -> schemas.TeamRead:
    return crud.create_team(db, challenge_id, data)


@router.get("/challenges/{challenge_id}/scoreboard", response_model=schemas.ScoreboardResponse)
def read_scoreboard(challenge_id: uuid.UUID, db: Session = Depends(get_db)) -> schemas.ScoreboardResponse:
    return crud.build_scoreboard(db, challenge_id)
