# Commitment Stakes foundation (incomplete draft)

This Rust workspace, present as ordinary files in `programs/commitment-stakes/`,
begins the Commitment Stakes track. It is independent of the native-versus-mobile-web
decision. The recovery also adds a repository path guard and its Demo CI regression
checks; it leaves `apps/web` and deployment gating unchanged.

The source was recovered from PR #5's patch and compared byte-for-byte with the
existing local recovery checkout before edits. The bundle was preserved as opaque
bytes, never imported or executed. Only allowlisted source, manifests and docs were
copied. See [recovery evidence](docs/recovery.md) for provenance and limitations.
Future scaffolding must disable Git initialization and keep this workspace as
ordinary files in the parent repository.

**Not ready to merge or deploy.** Initialization and draft account definitions are
written but uncompiled. Enrollment, settlement, payouts and refunds are absent.
There is no fundable challenge version and no verified financial implementation.
No local-validator, devnet, device or CV integration has run.

## Source specification gate

Requested source: MVP attached to Slack thread `1794673082.957109`. The current
Slack connection returned no results for Moltivate, Chert or a Moltivate channel;
the attachment and exact numerical example could not be retrieved. The repository
baseline instead proposes equal stakes and full forfeiture, which is materially
different from the requested Commitment Stakes rules. Do not substitute it.

Before implementing join/settlement, attach the authoritative MVP and freeze:

- Exact weighted-loss formula and alpha meaning; individual and team targets.
- Rake basis and order, capped by forfeits; both-win bonus amount and pot-shortfall
  behavior; both-lose pot funding; winner weights and zero-weight handling.
- Enrollment bounds, stake bounds, time windows, incomplete roster and oracle
  timeout refunds; immutable rule version and evidence snapshot representation.
- Exact example inputs and expected integer outputs at alpha **2000 bps**, rake
  **300 bps** for mixed, both-lose and both-win outcomes.

The user explicitly selects a 150% contribution cap for this track, superseding
the older planning-document cap at 100%. `math.rs` expresses contributions in
half-workout units to preserve odd-target precision. Basis-point multiplication
uses `u128`; neither helper is a settlement engine.

## Toolchain and validation evidence

Checked 14 November 2026: `cargo`, `rustc`, `anchor` and `solana` are absent from
the available shell and user Cargo bin directory. The earlier recovered draft
also reported unavailable Docker/WSL execution; this recovery did not rerun them.
Shell GitHub network requests are blocked. The GitHub connector can read the
repository, but rejected branch creation because approval is unavailable in this
session. Local `.git` writes are denied too: the recovered files remain unstaged
on main, not committed to a clean branch. PR #5 has not been closed or modified.

The Anchor dependency is pinned to **0.32.1**, a documented stable release, with
its documented Solana **2.3.0** pairing. This is a conservative starting point,
not a claim to use the newest release. No TypeScript client generation is selected
yet. See [release notes](https://www.anchor-lang.com/docs/updates/release-notes/0-32-1)
and [Solana quick start](https://solana.com/docs/intro/quick-start).

There is no generated Cargo.lock or IDL because compilation is unavailable.
Resolve and commit the lockfile, compile the program, run Rust and transaction
tests, and publish the generated IDL/types before declaring the integration
contract usable. Do not hand-author a substitute IDL. The program ID in source is
a development placeholder, not an on-chain address. No Anchor deployment config
or deployment workflow is supplied in this draft.

Written Rust unit tests (not run) cover cap boundaries, odd-target precision,
maximum inputs, basis-point bounds and floor rounding. Still required: exact MVP
fixtures for all outcomes, conservation including pot/treasury changes, signer
and PDA substitution failures, enrollment atomicity, duplicate enrollment,
unauthorized/repeated settlement, refund conflicts, deadlines and overflow.

Devnet execution is permitted only after review and merge. No mainnet, real
money, paid infrastructure, private recordings or secrets are part of this work.
The oracle remains a trusted result authority, separate from upgrade authority.

See [draft account contract](docs/account-contract.md) and
[bounded Chert capability report](docs/chert-capability.md).
