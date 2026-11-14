from datetime import datetime, timedelta

import pytest


@pytest.fixture()
def team_member(client, challenge):
    team = client.post(f"/challenges/{challenge['id']}/teams", json={"name": "Night Owls"}).json()
    member_user = client.post("/users", json={"display_name": "Priya"}).json()
    member = client.post(f"/teams/{team['id']}/members", json={"user_id": member_user["id"]}).json()
    return member


def _submit(client, team_member_id, idempotency_key, **body):
    body.setdefault("source", "browser")
    body.setdefault("reps", 10)
    return client.post(
        f"/team-members/{team_member_id}/sessions",
        json=body,
        headers={"Idempotency-Key": idempotency_key},
    )


def test_browser_source_gets_low_trust(client, team_member):
    response = _submit(client, team_member["id"], "key-1", source="browser", reps=10)
    assert response.status_code == 201
    body = response.json()
    assert body["trust_level"] == "low"
    assert body["status"] == "accepted"


def test_camera_source_gets_unverified_trust(client, team_member):
    response = _submit(client, team_member["id"], "key-1", source="camera_upload", reps=10)
    assert response.status_code == 201
    assert response.json()["trust_level"] == "unverified"


def test_failed_liveness_is_rejected(client, team_member):
    response = _submit(client, team_member["id"], "key-1", liveness_result="fail")
    assert response.status_code == 201
    assert response.json()["status"] == "rejected"


def test_repeating_idempotency_key_with_same_payload_is_idempotent(client, team_member):
    first = _submit(client, team_member["id"], "key-1", reps=10)
    second = _submit(client, team_member["id"], "key-1", reps=10)
    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["id"] == second.json()["id"]


def test_repeating_idempotency_key_with_different_payload_is_conflict(client, team_member):
    first = _submit(client, team_member["id"], "key-1", reps=10)
    assert first.status_code == 201

    second = _submit(client, team_member["id"], "key-1", reps=99)
    assert second.status_code == 409


def test_missing_idempotency_key_is_rejected(client, team_member):
    response = client.post(
        f"/team-members/{team_member['id']}/sessions",
        json={"source": "browser", "reps": 10},
    )
    assert response.status_code == 422


def test_session_for_unknown_team_member_is_404(client):
    response = _submit(client, "00000000-0000-0000-0000-000000000000", "key-1")
    assert response.status_code == 404


def test_reps_above_int32_is_rejected(client, team_member):
    # Regression test: a Postgres "integer" column can't hold this value;
    # it used to reach the database and raise an uncaught OverflowError/500
    # on SQLite instead of a clean validation error (audi-review PR #7,
    # finding 2).
    response = _submit(client, team_member["id"], "key-1", reps=2**31)
    assert response.status_code == 422


def test_created_at_has_an_explicit_utc_offset(client, team_member):
    # Regression test: SQLite strips tzinfo from DateTime values on
    # round-trip, so a response could come back as a naive timestamp a
    # client might misread as local time (audi-review PR #7, finding 4).
    response = _submit(client, team_member["id"], "key-1", reps=10)
    assert response.status_code == 201
    created_at = response.json()["created_at"]
    parsed = datetime.fromisoformat(created_at)
    assert parsed.tzinfo is not None
    assert parsed.utcoffset() == timedelta(0)
