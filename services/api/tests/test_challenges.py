def test_create_and_read_challenge(client, user):
    create_response = client.post(
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
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["status"] == "draft"

    read_response = client.get(f"/challenges/{created['id']}")
    assert read_response.status_code == 200
    assert read_response.json() == created


def test_create_challenge_with_unknown_creator_is_404(client):
    response = client.post(
        "/challenges",
        json={
            "creator_id": "00000000-0000-0000-0000-000000000000",
            "title": "Pushup week",
            "exercise": "pushups",
            "target_reps": 50,
            "team_size": 2,
            "stake_lamports": 0,
        },
    )
    assert response.status_code == 404


def test_read_missing_challenge_is_404(client):
    response = client.get("/challenges/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_target_reps_must_be_positive(client, user):
    response = client.post(
        "/challenges",
        json={
            "creator_id": user["id"],
            "title": "Bad challenge",
            "exercise": "pushups",
            "target_reps": 0,
            "team_size": 2,
            "stake_lamports": 0,
        },
    )
    assert response.status_code == 422


def _challenge_payload(user, **overrides):
    payload = {
        "creator_id": user["id"],
        "title": "Bad challenge",
        "exercise": "pushups",
        "target_reps": 50,
        "team_size": 2,
        "stake_lamports": 0,
    }
    payload.update(overrides)
    return payload


def test_target_reps_above_int32_is_rejected(client, user):
    # Regression test: a value a Postgres "integer" column can't hold used to
    # reach create_challenge and raise an uncaught OverflowError/500 on
    # SQLite instead of a clean validation error (audi-review PR #7, finding 2).
    response = client.post("/challenges", json=_challenge_payload(user, target_reps=2**31))
    assert response.status_code == 422


def test_team_size_above_int32_is_rejected(client, user):
    response = client.post("/challenges", json=_challenge_payload(user, team_size=2**31))
    assert response.status_code == 422


def test_stake_lamports_above_bigint_is_rejected(client, user):
    response = client.post("/challenges", json=_challenge_payload(user, stake_lamports=2**63))
    assert response.status_code == 422


def test_stake_lamports_round_trips_losslessly_as_string(client, user):
    # Regression test: a stake beyond Number.MAX_SAFE_INTEGER (2**53-1) used
    # to come back as a JSON number, which JS clients can't represent exactly
    # (audi-review PR #7, finding 2). It must travel as a decimal string.
    large_amount = 9_007_199_254_740_993  # MAX_SAFE_INTEGER + 2
    response = client.post("/challenges", json=_challenge_payload(user, stake_lamports=large_amount))
    assert response.status_code == 201
    body = response.json()
    assert body["stake_lamports"] == str(large_amount)

    read_back = client.get(f"/challenges/{body['id']}")
    assert read_back.json()["stake_lamports"] == str(large_amount)


def test_stake_lamports_accepts_decimal_string_input(client, user):
    large_amount = 9_007_199_254_740_993
    response = client.post("/challenges", json=_challenge_payload(user, stake_lamports=str(large_amount)))
    assert response.status_code == 201
    assert response.json()["stake_lamports"] == str(large_amount)
