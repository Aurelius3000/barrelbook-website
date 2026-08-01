# Approved Plan

1. Start from the clean local `main` baseline in a dedicated feature worktree.
2. Preserve the September 17, 2025 Terms and Privacy pages at dated archive routes.
3. Replace the canonical pages with the supplied policy content, updated August 1, 2026 and qualified so feature-specific processing begins only when the feature and its controls are available.
4. Add links from each current policy to its prior version and a current-version link from each archive.
5. Keep the footer and sitemap pointed at the canonical routes only.
6. Verify lint, TypeScript, production build, and all four routes in a browser.

## Files in scope

- `src/app/terms/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/2025-09-17/page.tsx`
- `src/app/privacy/2025-09-17/page.tsx`
- This sprint evidence folder

No analytics, CTA destinations, redirects, or existing canonical route names will change.
