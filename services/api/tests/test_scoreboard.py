def _join(client, team_id, display_name):
    user = client.post("/users", json={"display_name": display_name}).json()
    member = client.post(f"/teams/{team_id}/members", json={"user_id": user["id"]}).json()
    return member


def _submit(client, team_member_id, idempotency_key, reps, source="browser"):
    return client.post(
        f"/team-members/{team_member_id}/sessions",
        json={"source": source, "reps": reps},
        headers={"Idempotency-Key": idempotency_key},
    )


def test_scoreboard_caps_reps_at_target_and_counts_completers(client, challenge):
    # fixture challenge: target_reps=50, team_size=2
    team_a = client.post(f"/challenges/{challenge['id']}/teams", json={"name": "Night Owls"}).json()
    team_b = client.post(f"/challenges/{challenge['id']}/teams", json={"name": "Early Birds"}).json()

    a1 = _join(client, team_a["id"], "Priya")
    a2 = _join(client, team_a["id"], "Sam")
    b1 = _join(client, team_b["id"], "Jo")

    # a1 completes and then does extra reps, which must not raise the cap
    _submit(client, a1["id"], "a1-1", reps=30)
    _submit(client, a1["id"], "a1-2", reps=40)
    # a2 never submits a session
    # b1 falls short of the target
    _submit(client, b1["id"], "b1-1", reps=20)

    response = client.get(f"/challenges/{challenge['id']}/scoreboard")
    assert response.status_code == 200
    body = response.json()
    assert body["target_reps"] == 50

    by_name = {team["name"]: team for team in body["teams"]}
    assert by_name["Night Owls"]["completers"] == 1
    a1_entry = next(m for m in by_name["Night Owls"]["members"] if m["user_id"] == a1["user_id"])
    assert a1_entry["accepted_reps"] == 50
    assert a1_entry["completed"] is True
    a2_entry = next(m for m in by_name["Night Owls"]["members"] if m["user_id"] == a2["user_id"])
    assert a2_entry["accepted_reps"] == 0
    assert a2_entry["completed"] is False

    assert by_name["Early Birds"]["completers"] == 0


def test_scoreboard_for_unknown_challenge_is_404(client):
    response = client.get("/challenges/00000000-0000-0000-0000-000000000000/scoreboard")
    assert response.status_code == 404
