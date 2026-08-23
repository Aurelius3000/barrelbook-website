# Approved Recovery Plan

1. Start from verified remote `main` commit `1969450` in a clean worktree.
2. Add the existing noindex `/support` route and authentication-error image.
3. Patch the current homepage and footer with the approved 1.7.3 support entry points; do not replace either file with a stale version.
4. Preserve the 4.8 App Store rating treatment, Android early-access flow, legal routes, deep links, AASA behavior, App Store destinations, and analytics.
5. Add focused homepage/support regressions and refresh responsive snapshots.
6. Run TypeScript, lint, build, promo, focused Playwright, and full end-to-end validation.
7. Produce and verify a Vercel preview. Production alias changes remain separately approval-gated.
