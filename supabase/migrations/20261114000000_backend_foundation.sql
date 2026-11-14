-- Backend foundation: off-chain draft records only.
-- A row here is NEVER a funded on-chain challenge, deposit, or payout.
-- Chain state (escrow, settlement, claims) remains the sole source of truth
-- for funds once the Anchor program exists; see architecture.md.

create extension if not exists pgcrypto;

create table users (
    id uuid primary key default gen_random_uuid(),
    display_name text not null check (char_length(display_name) between 1 and 80),
    created_at timestamptz not null default now()
);

create table challenges (
    id uuid primary key default gen_random_uuid(),
    creator_id uuid not null references users(id),
    title text not null check (char_length(title) between 1 and 120),
    exercise text not null check (char_length(exercise) between 1 and 40),
    target_reps integer not null check (target_reps > 0),
    team_size integer not null check (team_size > 0),
    stake_lamports bigint not null check (stake_lamports >= 0),
    status text not null default 'draft' check (status in ('draft', 'open')),
    created_at timestamptz not null default now()
);

comment on column challenges.stake_lamports is
    'Illustrative draft figure only. No deposit has been made until the Anchor program exists.';
comment on column challenges.status is
    'Off-chain draft lifecycle only (draft/open). Not the on-chain challenge state machine in architecture.md section 3.';

create table teams (
    id uuid primary key default gen_random_uuid(),
    challenge_id uuid not null references challenges(id) on delete cascade,
    name text not null check (char_length(name) between 1 and 60),
    created_at timestamptz not null default now(),
    unique (challenge_id, name)
);

create table team_members (
    id uuid primary key default gen_random_uuid(),
    team_id uuid not null references teams(id) on delete cascade,
    -- Denormalized from teams.challenge_id (kept in sync by the trigger
    -- below) so "one team per challenge per user" can be a plain unique
    -- constraint instead of a cross-table check that Postgres can't express.
    challenge_id uuid not null references challenges(id) on delete cascade,
    user_id uuid not null references users(id),
    joined_at timestamptz not null default now(),
    unique (team_id, user_id),
    unique (challenge_id, user_id)
);

create function set_team_member_challenge_id() returns trigger as $$
begin
    select challenge_id into new.challenge_id from teams where id = new.team_id;
    return new;
end;
$$ language plpgsql;

create trigger team_members_set_challenge_id
    before insert or update of team_id on team_members
    for each row execute function set_team_member_challenge_id();

create table workout_sessions (
    id uuid primary key default gen_random_uuid(),
    team_member_id uuid not null references team_members(id) on delete cascade,
    source text not null check (source in ('browser', 'camera_upload')),
    reps integer not null check (reps >= 0),
    trust_level text not null check (trust_level in ('low', 'unverified')),
    liveness_result text not null check (liveness_result in ('not_run', 'pass', 'fail')),
    status text not null check (status in ('accepted', 'rejected')),
    idempotency_key text not null check (char_length(idempotency_key) between 1 and 128),
    created_at timestamptz not null default now(),
    unique (team_member_id, idempotency_key)
);

comment on column workout_sessions.trust_level is
    'Server-derived from source, never client-supplied. browser -> low; camera_upload -> unverified (no MediaPipe verifier wired up yet).';
comment on column workout_sessions.liveness_result is
    'Self-reported placeholder until a real liveness/verification worker exists. Never treated as proof; see architecture.md section 8.';
