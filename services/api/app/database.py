import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .models import Base

# Local/dev default is a file-based SQLite DB; point DATABASE_URL at a real
# Postgres/Supabase instance for anything beyond local development. No
# credentials are read from or written into this repository.
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./moltivate_backend.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
