"""Dev-only identity creation.

This is NOT wallet authentication. There is no signed-nonce challenge, no
session token, and no ownership check here — see architecture.md section 8
for the real plan (sign-in text bound to a nonce + wallet signature). Until
that exists, anyone can create a user record with any display name; do not
treat this endpoint as proof of who is making later requests.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter()


@router.post("/users", response_model=schemas.UserRead, status_code=201)
def create_user(data: schemas.UserCreate, db: Session = Depends(get_db)) -> schemas.UserRead:
    return crud.create_user(db, data)
