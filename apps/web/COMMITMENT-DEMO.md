# Commitment Stakes browser demo

Separate entry: `commitment.html`. The mission/download landing entry remains
`index.html`, untouched. This disposable browser surface does not decide the
final native-versus-mobile-web platform. It adds no runtime dependency.

From the repository root, build and serve using the existing commands:

```sh
npm run build
npm run preview
```

Open http://127.0.0.1:5173/commitment.html. Under project hosting, use the same
prefix as the landing page, for example `/moltivate/commitment.html`.

## Fixtures versus API

Default fixture mode has two teams and four named sample members. Each button
press creates a distinct fixed **simulated 10-rep session**, with a unique key.
It is a development fixture, never camera evidence or a replacement manual
counter. Fixture progress is in memory and resets on reload. There is no camera,
wallet, stake, settlement, payout or financial computation on this page.

Development API mode is explicitly selected in the connection disclosure. Supply
an existing API base, challenge UUID and **team-member UUID** (not a user UUID).
The page does not create users, challenges, teams or membership records. Do not
put credentials in the base URL. No external service is provisioned.

Inspected actual PR #7 source at
[`363512be88c43c137feb64a876d2f2ad49571d38`](https://github.com/betrji/moltivate/pull/7):
`services/api/app/schemas.py`, `routers/sessions.py`, `routers/challenges.py`,
`main.py`, plus PR diff business logic and README. The proposed routes in the
root architecture document were not used as the implemented API contract.

| Request | Actual contract consumed |
| --- | --- |
| `GET /challenges/{id}` | `id`, `title`, `exercise`, `target_reps`, `status` |
| `GET /challenges/{id}/scoreboard` | `challenge_id`, `target_reps`, teams with `team_id`, `name`, `completers`, members with `user_id`, `accepted_reps`, `completed` |
| `POST /team-members/{id}/sessions` | `Idempotency-Key`; body `{ "source": "browser", "reps": 10, "liveness_result": "not_run" }` |
| Session response | `id`, `team_member_id`, `source`, `reps`, `trust_level`, `liveness_result`, `status`, `created_at` |

The frontend **never submits trust_level**. The server derives it; the response
is shown with explicit simulated-input and non-verification language. PR #7's
accepted status is database acceptance, not independent workout verification.
All sessions from this page, including API submissions, are simulated input.
The API board displays server-reported accepted progress without inventing
member names, authenticated identity or funding. It makes no trust claim about
other sessions included in the API aggregate.

A fresh API attempt is saved to this tab's session storage **before** POST.
Timeout, network, HTTP, and invalid-response retries reuse its original key,
member, base and payload. Reload restores that unresolved attempt. Connection
changes are locked until a definitive accepted/rejected response. There is no
"discard and submit again" action for uncertain outcomes. Closing the tab loses
this recovery record; this is not durable production recovery. Check backend
records before resubmitting after losing the tab. A permanent conflict requires
backend investigation; no session-read/reconciliation endpoint exists yet.

An accepted/rejected response clears the attempt and refreshes the scoreboard
from the server. A refresh failure preserves the session feedback, marks any
shown board stale and offers Refresh without repeating the POST. API errors
never trigger fallback to fixtures. Failed initial loads prevent submission.

## Questions for Stephen (open, not silently resolved)

1. Can the roster contract provide team-member IDs and display names alongside
   user IDs, and bind the submitting member to the challenge? Today a developer
   must supply the member ID separately; the UI cannot establish that relationship
   from PR #7's read endpoints and does not claim it can.
2. What local same-origin routing or explicitly allowed development CORS origins
   should browser integration use? PR #7 has no CORS middleware. `/api` is only
   an editable input default; the static preview server has no API proxy. No
   live API connection or end-to-end integration is claimed.
3. Is PR #7's 100% target cap intended for this off-chain demo aggregate? The
   frontend renders that actual contract, without adopting it as Commitment
   Stakes settlement policy. Financial scoring remains outside this PR.

No message has been sent to Stephen; these questions are recorded for review.
Camera/CV integration, real-device behavior, authenticated ownership, financial
rules and devnet receipts remain separate gates. **The full demo gate does not
pass.**

## Validation and responsive evidence

Actually run on 14 November 2026 with available Node **22.13.1** (repository
requires Node 24, pins 24.22.1):

- `node --test tests/commitment-client.test.js`: **4 passed**, including exact
  API route/body/header shape, fixture duplicate protection and cap, error cases,
  invalid scoreboard handling and rejection of credential-bearing URLs.
- `node scripts/check.mjs`: passed (syntax only).
- `node scripts/build.mjs`: passed.
- `node scripts/verify-build.mjs`: passed (29 references).

Browser test source: `tests/e2e/commitment.spec.js`, using the existing desktop
1440×1000, mobile 390×844 and small-mobile 320×740 projects. Covers fixture
progress and landing navigation, keyboard submit, exact request/retry identity
across reload, fresh keys, concurrent-submit disabling, refreshed API progress,
409 conflicts, rejected sessions, loading and stale/error states, malformed
responses, safe rendering of team text, and horizontal overflow.

**Not run:** Playwright, real API integration, responsive visual inspection.
`npm.cmd ci --ignore-scripts` was blocked with EACCES fetching playwright-core
from the npm registry. Node 24 acquisition was also blocked. Computer Use was
not approved to access Google Chrome (no further reason supplied). No screenshots
were fabricated or copied from an older demo.

After dependencies and Node 24 are available, run:

```sh
node --test tests/commitment-client.test.js
npm run ci
```

The fixture browser test writes full-page responsive evidence to
`apps/web/commitment-evidence/desktop.png`, `mobile.png`, `small-mobile.png`.
These are **expected outputs, currently absent**. Review them before merging;
run `npm run build` again to include captured evidence in a local static artifact
if desired. The existing landing browser suite is retained unchanged. Unit
tests and syntax/build checks do not replace these browser checks.

## Bounded PR handoff

Suggested title: `feat(web): add separate Commitment Stakes browser demo`.

Exactly seven new source/documentation/test files belong to this change:

- `apps/web/commitment.html`
- `apps/web/commitment.css`
- `apps/web/commitment.js`
- `apps/web/commitment-client.js`
- `apps/web/COMMITMENT-DEMO.md`
- `tests/commitment-client.test.js`
- `tests/e2e/commitment.spec.js`

PR description: Adds a separate mobile-sized Commitment Stakes preview with
two fixture teams, member progress, simulated session feedback and an explicit
PR #7 API adapter. Preserves the landing entry. Retry keys and payloads survive
unresolved API attempts and tab reloads; server acceptance is followed by a
scoreboard refresh and never labeled workout verification. API mode needs
existing IDs and local browser routing/CORS coordination. No auth, camera,
wallet or financial integration is claimed. Four client tests and local syntax,
build and reference checks passed on Node 22; Playwright, Node 24 validation,
responsive screenshots and real API checks remain blocked as detailed above.

Publication is blocked: local Git branch creation cannot write `.git/refs`;
the GitHub connector's branch-creation action was rejected because it requires
approval and this session's approval policy is `never`. No remote branch,
commit or PR was created. All seven files remain local and untracked. Do not
include `.isolated/` or `dist/` when publishing. Open as a **draft** until the
missing browser evidence and integration checks are complete.
