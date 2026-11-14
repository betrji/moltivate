# PR #5 recovery evidence

Inspected 14 November 2026. Main at inspection was
`b272c1933cf4e49faecf24b676fc3a7941bae735`; PR #5 head was
`63d0011fe17f77b5b5fc87563763f93efeda86ff`.
PR #4 had no changed files. PR #5 still had mode 160000 at
`.isolated/commitment-stakes` and two recovery artifacts.

The existing local Git object database retains PR #5's head. Both artifacts were
copied byte-for-byte to ignored `.isolated/recovery-evidence/`, without loading
the bundle into Git, checking it out, running its contents, or applying the patch.
No new preservation ref could be created because `.git` is read-only here.
The original local nested checkouts and remote PR #5 are untouched.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| Recovery patch | 26650 | `13fb4c8b8e33df13029afa8484ba9caaa445a6eca08e8a181b425302eebb4aea` |
| Opaque bundle | 10950 | `753f8e2475849048c63db01334736eacd99902b779a42f332dd61bdb6cf289de` |

Ten allowlisted new text files were reconstructed from added lines in the patch,
then compared with the existing local `.isolated/ci-repair/` copies after CRLF
normalization. All matched before subsequent edits. The local evidence manifest
records the original per-file SHA-256 values. Recovered paths:

- Eight files under `programs/commitment-stakes/`: ignore file, workspace Cargo
  manifest, README, account contract, historical Chert report, program Cargo
  manifest, `lib.rs`, and `math.rs`.
- `scripts/check-repository.mjs` and `tests/repository.test.js`.

Only known source/configuration/documentation paths were read. No keypairs,
wallet files or environment secrets were copied or displayed. Bundle contents
were not inspected, so this is no assertion that the bundle is secret-free.
Never commit the preserved artifacts. No nested `.git` exists in the recovered
program workspace. Existing ignored recovery checkouts are deliberately retained.

The working tree began clean apart from `.isolated/`. The recovered files remain
ordinary, **untracked** files because Git metadata writes are denied. Branch
creation through the GitHub connector was also rejected: approval was required
but this session's approval policy is `never`. No PR or remote changes were made.

## Requirements still missing

PR #4's assignment references the MVP attached to Slack thread
`1794673082.957109`. Public Slack searches for Commitment Stakes and Moltivate
returned no results. The patch contains no exact worked example or full payout
policy. Alpha 2000 bps, rake 300 bps and a 150% cap alone do not determine weighted
losses, rake basis, win criteria, bonus or shortfall behavior. Do not invent these
financial rules or label a replacement fixture the exact MVP example.

Initialize/account definitions and math helpers are recovered source, not verified
on-chain behavior. Join, settlement, payouts, refunds, generated IDL, lockfile and
transaction tests remain missing. Chert access is unrelated to these blockers.

## Checks run in this recovery

Using available Node 24.19.0 (the repository pins 24.22.1):

- `node --test tests/repository.test.js`: 3 passed.
- `node scripts/check.mjs`: repository index guard and 13 syntax checks passed.
- `node scripts/build.mjs`: passed.
- `node scripts/verify-build.mjs`: 20 asset/import references and anchors passed.

The index guard checks the current index; newly recovered files cannot be staged
in this session. These checks do not establish browser interaction coverage,
Rust compilation, generated IDL validity, validator execution or devnet behavior.
There is no fresh Demo CI run because no branch or PR could be published.

`npm ci --ignore-scripts --fetch-retries=0 --fetch-timeout=10000` failed with
EACCES fetching `playwright-core` from the npm registry. The installed npm launcher
used system Node 22.13.1 despite the PATH override; the four checks above invoked
the available Node 24 binary explicitly. Browser dependencies were not installed,
so Playwright interaction tests did not run. No lockfile was changed.
