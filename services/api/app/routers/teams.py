import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter()


@router.post("/teams/{team_id}/members", response_model=schemas.TeamMemberRead, status_code=201)
def join_team(
    team_id: uuid.UUID, data: schemas.TeamMemberCreate, db: Session = Depends(get_db)
) -> schemas.TeamMemberRead:
    return crud.join_team(db, team_id, data)
