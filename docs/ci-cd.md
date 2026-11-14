# Demo CI/CD

The complete demo source is in `apps/web/`, including the phone interaction, Club leaderboard, logo, photography, and self-hosted fonts. `scripts/build.mjs` creates `dist/`; generated output is never committed. The native app and financial integrations remain separate future work.

## Current delivery and hosting

- **GitHub:** [betrji/moltivate](https://github.com/betrji/moltivate).
- **Private demo:** https://moltivate-club.betrji.chatgpt.site (ChatGPT sign-in required).
- **Automated delivery:** `.github/workflows/demo.yml` checks pull requests and every push to `main`. Successful runs attach a tested static-site artifact. `workflow_dispatch` also permits a manual run.
- **Automatic public deployment:** configured but disabled until `DEMO_DEPLOY_TARGET=github-pages` is explicitly set. Enabling it publishes a separate public demo; it does not change the private Site's audience.
- **Existing private Site deployment:** uses the supported Sites source/publication workflow. A GitHub push does not automatically update that private host. Do not store short-lived Sites write tokens in Actions or add a bypass token to the repository.

## Checks and reproducibility

Use the Node version in `.node-version` and the committed `package-lock.json`.

```sh
npm ci --ignore-scripts
npx --no-install playwright install --with-deps chromium
npm run ci
```

`npm run ci` runs syntax checks, builds the site, validates local assets/imports and anchors, and runs Playwright. The browser tests serve the built site at `/moltivate/` to catch subdirectory-hosting bugs. Desktop, 390px mobile, and 320px mobile projects cover asset loading, horizontal overflow, app availability, navigation, the join/workout/receipt phone flow, and Club search/sort/period/detail behavior. The desktop animation test also observes repeated SOL updates, exact settled numbers, pause, and resume. Reduced motion is the default for the other projects.

For ordinary preview without test dependencies:

```sh
npm run build
npm run preview
```

Open http://127.0.0.1:5173/. `PORT` and `BASE_PATH` can customize the local/CI preview. This loopback server is not a production server.

## Workflow guarantees

`npm run check` also checks the Git index for gitlinks, nested checkout paths,
recovery patches/bundles, generated output and known credential paths.
`node --test tests/repository.test.js` exercises the path guard. It does not scan
file contents for secrets. Review the staged summary before publishing because a
gitlink may fail checkout before CI can execute the guard.

The recovered Anchor foundation is under `programs/commitment-stakes/`.
Demo CI tests the browser frontend and repository layout, not Rust compilation or
financial correctness. See its README for the missing MVP and toolchain gates.

- The build artifact is uploaded only after all checks pass. It is named with the source commit and run attempt, and retained for 30 days.
- Test reports and failure traces are retained for 14 days, including failed runs.
- Pull requests never deploy and have read-only repository permissions. The workflow does not use `pull_request_target`.
- Optional deployment requires the successful checks job and uses that job's exact artifact rather than rebuilding.
- Only the deployment job receives `pages: write` and `id-token: write`. No personal access token or hosting secret is needed for Pages.
- Actions are pinned to commit SHAs. Dependabot proposes weekly npm and Actions updates.
- Superseded PR runs are cancelled; main/deployment runs are serialized rather than interrupted.

## Enable automatic GitHub Pages deployment

Only take these steps when a public demo is wanted:

1. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
2. In **Settings → Secrets and variables → Actions → Variables**, add repository variable `DEMO_DEPLOY_TARGET` with value `github-pages`.
3. Set the `github-pages` environment's deployment branch rule to `main`.
4. Run **Actions → Demo CI → Run workflow** on `main`, or push a change to `main`. The successful deployment job reports the exact Pages URL.

Remove the variable to stop future automatic Pages deployments; that does not unpublish an already deployed site. Public access and unpublishing are deliberate repository settings changes.

For the existing private host, continue publishing through Sites after validating the same commit. A Vultr deployment should be added only after its server, domain, HTTPS setup, and deployment authentication are configured; none are implied by this pipeline.

## Main protection and rollback

After the first run registers the check, configure a branch rule/ruleset for `main` requiring **Demo checks** and pull requests. Enable the "branch must be up to date" option if needed for the team's merge policy. This is a repository admin setting, not something the workflow file enforces by itself.

To roll back a code change, revert the offending commit through a pull request. The normal checks validate the revert and, when Pages is enabled, deploy it. Avoid force-pushing or bypassing failed checks. Artifacts identify their source SHA for inspection or delivery to another static host.

## References

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub workflow permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions)
- [Playwright CI](https://playwright.dev/docs/ci)
