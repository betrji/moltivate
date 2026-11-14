import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import get_db
from app.main import app
from app.models import Base


@pytest.fixture()
def client():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    engine.dispose()


@pytest.fixture()
def user(client):
    response = client.post("/users", json={"display_name": "Alex"})
    assert response.status_code == 201
    return response.json()


@pytest.fixture()
def challenge(client, user):
    response = client.post(
        "/challenges",
        json={
            "creator_id": user["id"],
            "title": "Pushup week",
            "exercise": "pushups",
            "target_reps": 50,
            "team_size": 2,
            "stake_lamports": 1_000_000,
        },
    )
    assert response.status_code == 201
    return response.json()
