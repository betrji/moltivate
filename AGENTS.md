# Moltivate contributor instructions

## Start here

This repository belongs to **Moltivate**, a mobile social fitness competition app. Read [readme.md](readme.md) for product intent and [architecture.md](architecture.md) for the proposed technical design before implementing changes.

The repository contains an implemented static browser frontend in `apps/web/` and planning documents for the native product. The Expo app, backend, verification service, and Solana program remain unimplemented. Distinguish decisions, proposals, implemented behavior, and verified behavior. Never describe a proposed service, unrun test, or simulated transaction as working production functionality.

Keep this filename as `AGENTS.md` so compatible coding agents can discover it. Add narrower instructions only when a component needs them; keep project-wide rules here.

## Product direction

- Use **Moltivate** as the product name and `moltivate` as the repository name.
- The product is a **mobile app**, targeting iPhone and Android. The separately requested website introduces it and offers an interactive browser preview; do not treat that preview as an implementation of the native app.
- The chosen hackathon track is **Entertainment**. Lead with social fitness competition and self-improvement.
- Preserve the brand line **“Put your money where your muscles are.”** Supporting copy includes “Are you Moltivated?” and “Stay Moltivated.”
- Keep the experience about showing up, contributing to a team, and keeping commitments. Avoid casino styling, promises of returns, and pressure to increase stakes.
- Use the selected `.club` identity when the exact registered hostname is provided. Do not invent DNS records, domain ownership, or a deployed URL.
- An avatar/evolution system is optional future scope. Do not copy Pokémon characters, names, artwork, or interfaces.

## Technical direction

The current website uses **HTML, CSS, and vanilla JavaScript ES modules** without runtime package dependencies. `<moltivate-demo>` and `<club-board>` are custom elements with scoped styles. The planned native/backend stack below remains unchanged.

| Component | Planned approach |
| --- | --- |
| Mobile | Expo + React Native + TypeScript |
| API | Python + FastAPI |
| Verification | A separate Python/MediaPipe worker |
| Hosting | Docker services on a Vultr CPU VM initially |
| Records | Supabase PostgreSQL |
| Media | Private object storage with temporary access |
| Escrow | Rust/Anchor program on Solana devnet |
| Settlement integration | A compatible TypeScript Anchor/Solana client in a dedicated service |

Keep video processing out of API request handlers. The mobile app captures evidence; the backend verifies and reports results; the Solana program controls deposited funds and enforces the financial rules.

Consult the [official Solana quick start](https://solana.com/docs/intro/quick-start) and relevant primary documentation when implementing blockchain features. Recheck current package names and compatibility; do not mix incompatible Solana client generations. Pin compatible dependencies in lockfiles and record the reason for that choice.

Validate wallet and camera behavior on physical devices. Handle Android and iOS wallet flows separately. An emulator, mocked signature, or Expo Go preview does not establish that the full mobile integration works.

## Working on the current frontend

- Edit `apps/web/` as the source of truth. `dist/` is generated; rebuild it rather than editing it directly.
- Use Node.js 24 from `.node-version`. `npm run check` checks syntax; `npm run build` recreates `dist/`; `npm run check:build` validates static references; `npm run preview` serves a local preview. For the full browser suite, use `npm ci --ignore-scripts`, install Playwright Chromium, then `npm run ci`. Runtime secrets are not required. Keep `package-lock.json` committed and do not claim syntax checks alone cover interactions.
- Preserve `.github/workflows/demo.yml` deployment gating: PRs never deploy, Pages is opt-in through `DEMO_DEPLOY_TARGET=github-pages`, and the tested artifact is reused. Never commit Sites credentials or bypass tokens. See [CI/CD](docs/ci-cd.md) before changing delivery or hosting.
- Preserve the self-hosted fonts and their license/source files in `apps/web/assets/fonts/`. Keep the editorial headings, readable interface type, and handwritten accents distinct.
- Keep sample activity and simulated SOL figures visibly labeled. The frontend does not access a camera, wallet, application API, database, or network payout service. Do not suggest otherwise in status messages or documentation.
- Keep App Store availability honest: the current button opens a coming-soon dialog. Do not invent a store listing, waitlist signup, or successful subscription.
- Preserve keyboard navigation, focus states, modal Escape behavior, responsive layouts, and reduced-motion behavior. Verify the phone's playback controls and Club search/filter/sort/detail flows after relevant changes.
- The website's completion bars show fixture workout progress; Club reward totals reflect the selected sample period. Keep that distinction visible rather than implying a current challenge payout.
- A successful `npm run check` establishes syntax only. Report browser interaction checks separately, and do not substitute frontend simulation for native-device or devnet verification.

## Implementation workflow

Keep Anchor source as ordinary tracked files under `programs/commitment-stakes/`.
Disable nested Git initialization when scaffolding. Never stage `.isolated/`,
recovery patches/bundles, build output, validator ledgers, wallets or keypairs.
Review `git diff --cached --summary` for mode 160000 before publishing: a gitlink
can fail Actions checkout before the repository guard can run. `npm run check`
rejects tracked gitlinks and prohibited paths; this is not a secret content scanner.

1. Inspect the current files, repository instructions, and existing conventions before editing. Do not assume the proposed directory layout already exists.
2. Choose the smallest complete increment that advances the core loop: connect, join/deposit, record, verify, score, settle, claim.
3. State reasonable implementation assumptions and proceed with routine reversible work. Ask only when an unresolved product decision materially changes behavior or financial rules.
4. Resolve and version scoring, eligibility, payout, deadline, and refund rules before implementing escrow. Changes must never silently rewrite an already-funded challenge.
5. Keep unrelated work intact. Avoid broad refactors or extra infrastructure without a demonstrated need.
6. Update affected documentation and setup instructions alongside code. Only document commands that exist and have been checked.
7. Report what changed, what was actually tested, and any concrete limitation.

Use conventional component boundaries when scaffolding, as specified in the architecture. Keep API schemas, generated contract types, and scoring rules synchronized. Do not hand-edit generated IDLs as a substitute for changing and rebuilding the program.

## Financial correctness

- Default development and demos to **Solana devnet with test SOL**. Mainnet and real funds require a separately requested, reviewed release.
- Never collect a user's seed phrase or private key. Wallet approvals happen in the wallet.
- Use integer lamports and checked arithmetic throughout. Do not calculate payouts using floating point or JavaScript `Number` beyond its safe range; serialize large integers explicitly.
- Treat an RPC submission response as pending. Verify transaction success and resulting on-chain state before recognizing a deposit, payout, or refund.
- Make deposit and enrollment atomic. Enforce participant/team limits, unique enrollment, fixed rules, and deadlines in the program.
- Verify signer, account ownership, PDA seeds, challenge identity, participant identity, and state on every instruction.
- Reject duplicate settlement, double claims/refunds, unauthorized result submission, and settlement after refund activation. A refund and payout must never both be claimable for the same stake.
- Reconcile uncertain transaction outcomes before rebuilding or resubmitting. Persist signatures and idempotency identifiers.
- Enforce conservation of deposited funds. Specify rounding, ties, empty results, incomplete rosters, and settlement timeouts before coding happy-path payouts.
- Keep the result authority and upgrade authority explicit. Do not call backend-verified results fully trustless or claim that program rules can never change while upgrade authority exists.

## Verification, authentication, and data

- Wallet authentication must verify a signed, expiring, single-use challenge bound to the app, wallet, and session. A supplied wallet address alone is not authentication.
- Enforce authorization server-side for challenges, teams, uploads, results, and administrative actions.
- Treat camera files and client-supplied rep counts, clocks, exercise labels, and scores as untrusted input.
- Issue server-bound workout sessions; enforce deadlines, upload limits, content validation, duplicate detection, and bounded processing/retries.
- Record verifier version, exercise rules, accepted counts, and rejection reasons. Retry processing idempotently; do not credit one session twice.
- Low-confidence footage must not silently count as a completed workout. Explain how to retry within the challenge rules.
- MediaPipe pose estimation is a measurement input, not a medical assessment or proof of identity/liveness. Describe anti-cheat limitations honestly.
- Keep raw video, pose data, authentication tokens, and personal details off-chain. Public transaction receipts should expose only the minimum necessary competition data.
- Keep uploads private, use scoped temporary URLs, and implement a defined deletion policy. Do not log media access tokens or use real user recordings in fixtures without permission.
- Keep backend database credentials, settlement signer material, and service secrets out of the mobile bundle and repository. Add redacted environment examples and appropriate ignore rules when scaffolding.

## UX expectations

Make the next action and current state obvious. Distinguish wallet approval, transaction pending, confirmation, recording, upload, verification, rejection, settlement, and claim states. Preserve progress through backgrounding and interrupted connectivity where possible.

Show the network, stake amount, rules, deadlines, and refund conditions before a deposit. Show each member's contribution so team results are understandable. Respect camera consent and offer a clear denied-permission state. Cap score contribution at the commitment target; avoid incentives for unlimited repetitions or escalating spending.

## Verification expectations

Run checks appropriate to the change and report their actual results. A documentation-only change needs consistency/link review, not an invented application test suite. Once implemented, prioritize:

- **Contract tests:** authority/account validation, enrollment atomicity, deadlines, incomplete-enrollment/settlement-timeout refunds, ties, zero scores, rounding, overflow, conservation of funds, duplicate settlement, and duplicate or conflicting claims.
- **Backend tests:** auth nonce expiry/replay, access control, upload validation, job retries, duplicate session credit, score calculation, cutoff windows, and RPC reconciliation.
- **Device checks:** camera denial, unsupported/poor recordings, upload interruption, wallet rejection, app background/resume, link callback validation, wrong network, and pending transaction recovery.
- **End-to-end demo:** two teams create and fund a challenge, complete accepted workouts, settle, claim, and independently inspect devnet receipts; demonstrate a refund scenario too.

Use mocks for isolated tests, but label them. They do not replace one real devnet integration run and real-device wallet/camera verification before claiming the demo works.
