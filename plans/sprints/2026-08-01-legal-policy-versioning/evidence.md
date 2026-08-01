# Evidence

## Baseline

- Approved: August 1, 2026.
- Branch: `codex/update-legal-policies-20260801`.
- Initial base: local `main` at `8c9b5bc541718aa06395744b1261631268047790`.
- Final base: `origin/main` at `aff8e9232753a838fa7637c17c3968e17321dac3`. After explicit approval, `git rebase --autostash --onto origin/main main` removed the unrelated local-main video-creator-skill commit while preserving all policy and sprint changes.
- The primary checkout and broken `.worktrees/legal-amendments` registration were left untouched.
- The originally supplied July 18, 2026 policy pages were compared with the September 17, 2025 pages on `main` before implementation. On August 1, the publication date was updated to August 1, 2026 and future-facing feature language was qualified so processing begins only when the feature and its controls are available.

## Verification

- `npm ci`: passed. Reported 11 dependency audit findings (1 low, 1 moderate, 8 high, 1 critical); no dependency changes were made as part of this policy-only task.
- `npm run lint`: passed with 0 errors and 6 warnings. Four warnings are the existing legal-page `<img>` pattern copied into current and archived pages; two are unrelated pre-existing warnings.
- `npx tsc --noEmit`: passed. The first sandboxed attempt could not write `tsconfig.tsbuildinfo` in the sibling worktree; the approved rerun outside that restriction passed.
- `npm run build`: passed. Next.js statically generated `/terms`, `/privacy`, `/terms/2025-09-17`, and `/privacy/2025-09-17`.
- Playwright desktop verification at 1440x1000: both current pages rendered with their table of contents, correct dates, and prior-version links; viewport and document widths matched at 1440px.
- Playwright mobile verification at 390x844: both current pages rendered without horizontal overflow; viewport and document widths matched at 390px.
- Link verification: the current Terms and Privacy links navigated to the corresponding September 17, 2025 archives; both archives displayed an archive notice and current-version return link.
- Robots verification: both archive pages rendered `noindex, follow`.
- Browser console: only the expected local `/_vercel/insights/script.js` 404 from Vercel Analytics running outside Vercel; no policy-page errors.
- Temporary visual screenshots were inspected at `/private/tmp/barrelbook-terms-desktop.png`, `/private/tmp/barrelbook-privacy-desktop.png`, `/private/tmp/barrelbook-terms-mobile.png`, and `/private/tmp/barrelbook-privacy-mobile.png`. They are intentionally not part of the repository.

## Post-Rebase Verification

- `git rev-parse HEAD origin/main`: both resolved to `aff8e9232753a838fa7637c17c3968e17321dac3` before any policy commit.
- `git diff --check`: passed; all tracked and untracked policy/sprint files remained present after the approved autostash rebase.
- `npm run lint`: passed again with the same 0 errors and 6 documented warnings.
- `npx tsc --noEmit`: passed again.
- `npm run build`: passed again and statically generated all four policy routes.

## August 1 Policy Amendment

- The user approved changing both current policies to `Last Updated: August 1, 2026`.
- Future-facing capabilities now use conditional availability language, and Privacy states that feature-specific use or disclosure begins only after the feature and corresponding controls are available; opt-in processing begins only after consent.
- The September 17, 2025 archive pages were not changed.
- `git diff --check`: passed.
- `npm run lint`: passed with the same 0 errors and 6 documented warnings.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed and statically generated all four policy routes.
