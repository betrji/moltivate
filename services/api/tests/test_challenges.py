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
