# Vercel deployment handoff

Written 2026-11-15 for the app team. Main includes PR #23 at ee126f3. The app is still local; no Vercel project or public app URL has been verified. This checklist supersedes stale deployment-status notes in apps/app/DEPLOYMENT.md.

## 1. Import the app

1. The teammate who will own hosting signs into https://vercel.com/new and selects the intended account/team.
2. Connect GitHub and import betrji/moltivate. If it is missing, grant the Vercel GitHub integration access to that repository.
3. Use project name moltivate-app (or an available name), framework Next.js, Root Directory apps/app, production branch main, Node.js 24.x.
4. Use npm ci as the install command and npm run build as the build command. Leave Output Directory on the Next.js default. Do not select apps/web or use the root static-site build.
5. Add the environment variables below for Production before building. Configure Preview separately with appropriate test credentials if needed.
6. Deploy. Record the production URL and deployed Git SHA. If environment variables change later, redeploy; public variables are embedded at build time.

## 2. Environment variables

Copy existing working values privately from Stephen's local app configuration or the team's secret store. Do not paste values in chat, this document, GitHub, or screenshots. Keep current devnet oracle identity; do not create a replacement wallet just to deploy.

| Name | Value/source |
| --- | --- |
| NEXT_PUBLIC_SOLANA_NETWORK | devnet (app currently hardcodes devnet) |
| NEXT_PUBLIC_SOLANA_RPC_URL | Existing devnet RPC, or https://api.devnet.solana.com |
| NEXT_PUBLIC_SUPABASE_URL | Existing Supabase project URL |
| SUPABASE_SERVICE_ROLE_KEY | Existing server-side Supabase service role key |
| NEXT_PUBLIC_ORACLE_PUBKEY | Public key matching the existing backend oracle |
| ORACLE_SECRET_KEY | Existing matching oracle secret, in the JSON byte-array format expected by lib/oracle.ts; server-only |
| WORKOUT_INGEST_SECRET | Existing trusted-ingest shared secret; server-only |
| LIVE_COACH_BASE_URL | https://worker.staymoltivated.club |
| LIVE_COACH_KEY_ID | Existing command signing key ID (VM provisioned as v1; verify current configuration) |
| LIVE_COACH_SECRET | Matching VM command signing secret; server-only |
| LIVE_COACH_EVENT_KEY_ID | Agreed event signing key ID |
| LIVE_COACH_EVENT_SECRET | Separate event signing secret shared with the VM sender; never reuse the command secret |

NEXT_PUBLIC_SUPABASE_ANON_KEY is present in .env.example but is not read by the current app code. It is not a substitute for the server service-role key. Never add NEXT_PUBLIC_ to any server secret. LiveKit, Chert, and OpenAI keys stay on Vultr; the web app does not need them.

The backend owner must verify the existing Supabase migrations, including 20261115020000_vision_events.sql, are applied to the intended database. Do not reset the database or blindly rerun old migrations.

## 3. Check the deployed app

- Open /, /coach, /club, and /challenges/new on the production URL. Confirm the new design and no browser/server errors.
- Verify wallet connection on a physical phone using the supported Phantom browser path. Desktop browser mocks do not prove iPhone behavior.
- Confirm existing challenges and results load with the intended wallet and Supabase configuration.
- Exercise only devnet/test SOL flows. Missing oracle configuration blocks challenge creation by design.
- Inspect Vercel function logs for missing environment variables or missing database tables. Do not print keys or request authentication headers.
- Keep app-linked FaceTime marked pending until pairing, authorization, and final result storage are verified. A green build does not prove those integrations work.

## 4. Connect VM callbacks and marketing

Backend receiver: https://<actual-app-domain>/api/vision/events.

VM owner sets MOLTIVATE_CALLBACK_URL to that URL and configures MOLTIVATE_EVENT_KEY_ID/MOLTIVATE_EVENT_SECRET to match Vercel's LIVE_COACH_EVENT_KEY_ID/LIVE_COACH_EVENT_SECRET. Follow docs/live/RESULT_SENDER.md for the outbox service and signed delivery tests. Sender code is in main; deployment/enabling and verified caller pairing remain separate prerequisites. The receiver currently stores events, not completed workout rows. Coordinate that mapping with Stephen. Counts remain experimental and payout-ineligible.

After the actual app URL passes checks, set MOLTIVATE_DEMO_URL for the marketing build to that HTTPS URL. GitHub Actions reads the repository variable of the same name. Rebuild and publish the marketing site through its existing Sites host at staymoltivated.club. A GitHub push alone does not publish that host. Until then, links retain the embedded demo. Leave the existing marketing and worker DNS records intact; a custom app domain is optional after the initial vercel.app deployment works.

## 5. Teammate completion record

- Hosting owner/team and project URL:
- Production app URL and Git SHA:
- Environment variable names configured (no values):
- Database migration confirmation:
- Phone/wallet checks completed:
- VM callback test and result-storage status:
- Marketing link publication status:
- Previous working Vercel deployment for rollback:

If a release fails, restore the previously verified Vercel deployment. Do not rotate the oracle or undo database migrations as a UI rollback.

## Evidence already available

PR #23 merged after all GitHub checks passed. Local app lint/build and mocked browser checks passed, including four viewport widths, totals updates, rank changes, outage recovery, camera denial, and reduced motion. Marketing tests passed 34, with 8 intentional skips. No production Vercel or physical-phone app test has been claimed.

Official references: https://vercel.com/docs/git and https://vercel.com/docs/builds/configure-a-build.
