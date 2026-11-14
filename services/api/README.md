# Moltivate backend foundation (`services/api/`)

A runnable FastAPI service covering the first slice of the off-chain core
loop: draft challenges, team membership, workout-session submission, and
scoreboard progress. See [architecture.md](../../architecture.md) for the
full proposed design this is a foundation for.

**This is not the production backend.** It has no wallet authentication, no
camera/video pipeline, no escrow, and talks to no on-chain program. Every
challenge, team, and session here is an off-chain database draft. Do not
represent anything returned by this API as a funded on-chain challenge, a
confirmed deposit, or a verified/oracle-signed result.

## What exists

- **Migrations** (`supabase/migrations/20261114000000_backend_foundation.sql`):
  `users`, `challenges`, `teams`, `team_members`, `workout_sessions`, written
  for Postgres/Supabase. `team_members` denormalizes `challenge_id` from its
  team via a trigger so "one team per challenge per user" is a plain unique
  constraint.
- **API** (`app/`): SQLAlchemy models mirroring the migration, Pydantic
  schemas (including the shared session contract), and FastAPI routers.
- **Shared session contract** (`app/schemas.py::WorkoutSessionContract`):
  `source`, `reps`, `trust_level`, `liveness_result`. `trust_level` is
  always derived server-side from `source` (`browser` -> `low`,
  `camera_upload` -> `unverified`) — a client can never assert its own trust
  level. `liveness_result` is a self-reported placeholder; nothing here runs
  real liveness detection yet, and a client-reported `pass` is never treated
  as proof. Run `python scripts/export_contract.py` after changing the
  pydantic model to refresh `packages/contracts/session-contract.json`.
- **Duplicate-session protection**: session submission requires an
  `Idempotency-Key` header, unique per `team_member_id`. Replaying the same
  key with the same payload returns the original session (idempotent);
  replaying it with a different payload returns `409`.
- **Numeric bounds and lamport transport**: `target_reps`, `team_size`, and
  `reps` are bounded to fit a Postgres `integer` column (0–2³¹-1); a larger
  value is a `422`, not a database error. `stake_lamports` is bounded to fit
  the `bigint` column (0–2⁶³-1) and is transported as a decimal string (both
  in requests and responses) rather than a JSON number, since JavaScript's
  `Number` can't exactly represent integers past 2⁵³-1.

## Routes

| Route | Behavior |
| --- | --- |
| `GET /health` | Liveness check |
| `POST /users` | **Dev-only** placeholder identity creation — not wallet auth (see Known gaps) |
| `POST /challenges`, `GET /challenges/{id}` | Create/read a draft challenge |
| `POST /challenges/{id}/teams` | Create a team inside a challenge |
| `POST /teams/{id}/members` | Join a team (enforces one team per challenge per user, and team size; the capacity check is concurrency-safe against overlapping joins) |
| `POST /team-members/{id}/sessions` | Submit a workout session (needs `Idempotency-Key` header) |
| `GET /challenges/{id}/scoreboard` | Per-team accepted reps (capped at `target_reps`) and completer counts |

## Local setup

Requires Python 3.11+.

```sh
cd services/api
python -m venv .venv
. .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest
uvicorn app.main:app --reload   # serves on http://127.0.0.1:8000
```

No external services, Docker, or secrets are required. The dev server
defaults to a local SQLite file (`moltivate_backend.db`, gitignored); set
`DATABASE_URL` to point at a real Postgres/Supabase instance instead. Tests
always use an isolated in-memory SQLite database regardless of
`DATABASE_URL`.

## Known gaps (not covered by this foundation)

- **No real authentication.** `POST /users` accepts any display name with no
  wallet signature, nonce, or session token. Building the real flow in
  architecture.md section 8 is separate follow-up work.
- **No escrow/chain integration.** `stake_lamports` on a challenge is a
  display figure; no deposit, settlement, or claim happens anywhere here.
- **No real verification worker.** `source`/`liveness_result` are
  self-reported; there is no MediaPipe pipeline, no uploaded video, and no
  independent confidence check behind `trust_level`.
- **SQLite tests don't exercise the Postgres trigger** that denormalizes
  `team_members.challenge_id`. The one-team-per-challenge rule is tested at
  the API layer (`crud.join_team`); the migration's trigger/constraint is an
  unverified backstop until a real Supabase/Postgres integration run checks
  it directly.
- **No authorization layer.** Any caller can read or write any challenge,
  team, or session by ID; there's no session-derived ownership check yet.
