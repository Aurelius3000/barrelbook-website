# Evidence

## Baseline

- 2026-08-23: Remote `main` verified as `19694509f94d940e2c9c597fa5095233b2dc2557`.
- 2026-08-23: Clean worktree created at `/private/tmp/barrelbook-website-production-recovery` on `codex/restore-current-site-support-warning`.
- 2026-08-23: Current production identified as `dpl_A6HpXB8hnDf2B45SrCdjFcMGXQEX`; live homepage showed the stale `24 five-star ratings` treatment and `/android` returned 404.
- 2026-08-23: Canonical baseline contains the visible 4.8 rating treatment, structured review count 137, `/android`, and the Android early-access CTA.

## Implementation and verification

- Added the noindex `/support` route and copied `authentication-error-173.png`; source and recovery-copy SHA-256 values both equal `65f5c46e7f081eb0732d9a42f3c178a8ed503ea65bfb0230dffe2e7871de286d`.
- Patched the current-main homepage with the approved support notice and neutral lower-page Support link; preserved the 4.8 rating and Android early-access CTA.
- Added the footer Support link without replacing current-main footer content.
- Added focused homepage/support assertions plus responsive visual baselines.
- `git diff --check`: passed.
- `npx tsc --noEmit`: passed.
- Focused ESLint for the changed source/tests: passed.
- `npm run test:promo`: passed after replacing an invalid cross-worktree `node_modules` symlink with a local install.
- `npm run build`: passed; output includes `/android`, `/support`, legal routes, deep-link routes, AASA handlers, and public-list routes.
- Focused Playwright with snapshot refresh: 16 passed, 5 expected project skips.
- Full `npm run test:e2e`: 16 passed, 5 expected project skips. The sandbox initially blocked port 3000 with `EPERM`; the identical suite passed with local-port access.
- Desktop/mobile homepage and support snapshots were inspected; no header overlap, clipping, or horizontal overflow was found.
- Vercel preview deployment `dpl_7phXeQcBzdyPMAvTbksRPVv4nVdB` completed `Ready` with target `preview`: `https://barrelbook-website-3uyd2u355-pete-petereillycs-projects.vercel.app`.
- The Vercel build passed and enumerated 26 application routes, including `/android` and `/support`. Existing install-time audit output reported 12 dependency findings (1 low, 1 moderate, 9 high, 1 critical); these are pre-existing and did not block the build.
- Production aliases remain on `dpl_A6HpXB8hnDf2B45SrCdjFcMGXQEX`; no production deployment, alias change, Git push, PR, or merge was performed.

## Publication preflight

- GitHub keyring authentication is valid for active account `Aurelius3000` when the stale process-level credential override is absent; repository scope is available.
- No remote branch or existing PR named `codex/restore-current-site-support-warning` exists.
- The repository has no checked-in GitHub Actions workflows and `main` is not branch-protected; the PR should still wait for the Vercel status check before merge.
- Proposed commit subject: `fix(homepage): restore current site with support warning`.
- Proposed PR title: `Restore current website with 1.7.3 support warning`.
