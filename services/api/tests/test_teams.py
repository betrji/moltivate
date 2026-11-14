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
