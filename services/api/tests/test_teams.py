import threading

from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker

from app import crud, models, schemas


def _create_team(client, challenge_id, name):
    return client.post(f"/challenges/{challenge_id}/teams", json={"name": name})


def _create_user(client, display_name):
    return client.post("/users", json={"display_name": display_name}).json()


def test_create_team_and_join(client, challenge):
    team = _create_team(client, challenge["id"], "Night Owls").json()
    second_user = _create_user(client, "Priya")

    response = client.post(f"/teams/{team['id']}/members", json={"user_id": second_user["id"]})
    assert response.status_code == 201
    member = response.json()
    assert member["team_id"] == team["id"]
    assert member["challenge_id"] == challenge["id"]


def test_duplicate_team_name_in_same_challenge_is_conflict(client, challenge):
    assert _create_team(client, challenge["id"], "Night Owls").status_code == 201
    response = _create_team(client, challenge["id"], "Night Owls")
    assert response.status_code == 409


def test_user_cannot_join_two_teams_in_same_challenge(client, challenge):
    team_a = _create_team(client, challenge["id"], "Night Owls").json()
    team_b = _create_team(client, challenge["id"], "Early Birds").json()
    member = _create_user(client, "Priya")

    first_join = client.post(f"/teams/{team_a['id']}/members", json={"user_id": member["id"]})
    assert first_join.status_code == 201

    second_join = client.post(f"/teams/{team_b['id']}/members", json={"user_id": member["id"]})
    assert second_join.status_code == 409


def test_team_cannot_exceed_challenge_team_size(client, challenge):
    # fixture challenge has team_size == 2
    team = _create_team(client, challenge["id"], "Night Owls").json()
    first = _create_user(client, "Priya")
    second = _create_user(client, "Sam")
    third = _create_user(client, "Jo")

    assert client.post(f"/teams/{team['id']}/members", json={"user_id": first["id"]}).status_code == 201
    assert client.post(f"/teams/{team['id']}/members", json={"user_id": second["id"]}).status_code == 201

    overflow = client.post(f"/teams/{team['id']}/members", json={"user_id": third["id"]})
    assert overflow.status_code == 409


def test_concurrent_joins_cannot_exceed_team_capacity(tmp_path):
    # Regression test: overlapping join requests used to each read the member
    # count before either insert landed, so two could both pass a team_size=1
    # capacity check and both commit (audi-review PR #7, finding 1). A shared
    # in-memory StaticPool connection can't exercise this honestly (SQLite's
    # DBAPI connection isn't safe for literally-simultaneous threads), so this
    # uses a real file-backed database with one real connection per thread,
    # matching how independent requests actually hit SQLite in production.
    engine = create_engine(f"sqlite:///{tmp_path / 'concurrency.db'}", connect_args={"timeout": 30})
    models.Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    setup_db = SessionLocal()
    creator = crud.create_user(setup_db, schemas.UserCreate(display_name="Creator"))
    challenge = crud.create_challenge(
        setup_db,
        schemas.ChallengeCreate(
            creator_id=creator.id,
            title="Solo slot",
            exercise="pushups",
            target_reps=10,
            team_size=1,
            stake_lamports=0,
        ),
    )
    team_id = crud.create_team(setup_db, challenge.id, schemas.TeamCreate(name="Only Slot")).id
    joiner_ids = [
        crud.create_user(setup_db, schemas.UserCreate(display_name=f"Joiner {i}")).id for i in range(8)
    ]
    setup_db.close()

    outcomes: list[str] = []
    outcomes_lock = threading.Lock()
    barrier = threading.Barrier(len(joiner_ids))

    def attempt(user_id):
        db = SessionLocal()
        barrier.wait()  # maximize the chance every thread races the same window
        try:
            crud.join_team(db, team_id, schemas.TeamMemberCreate(user_id=user_id))
            outcome = "joined"
        except crud.ConflictError:
            outcome = "conflict"
        finally:
            db.close()
        with outcomes_lock:
            outcomes.append(outcome)

    threads = [threading.Thread(target=attempt, args=(user_id,)) for user_id in joiner_ids]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

    assert outcomes.count("joined") == 1
    assert outcomes.count("conflict") == len(joiner_ids) - 1

    verify_db = SessionLocal()
    final_count = verify_db.scalar(
        select(func.count()).select_from(models.TeamMember).where(models.TeamMember.team_id == team_id)
    )
    assert final_count == 1
    verify_db.close()
