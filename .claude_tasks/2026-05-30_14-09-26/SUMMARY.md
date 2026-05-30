# Bottle Link Fallback Summary

## Files Added
- `src/app/bottles/[id]/page.tsx`
- `.claude_tasks/2026-05-30_14-09-26/T1_private_bottle_handoff_route.md`
- `.claude_tasks/2026-05-30_14-09-26/T2_bottle_universal_link_component.md`
- `.claude_tasks/2026-05-30_14-09-26/T3_bottle_tests_and_verification.md`

## Files Modified
- `src/lib/apple-app-site-association.ts`
- `scripts/test-promo-foundation.mjs`
- `plans/sprints/2026-05-30-bottle-link-fallback/prd.json`
- `plans/sprints/2026-05-30-bottle-link-fallback/progress.txt`

## Overview
- Added a private `/bottles/[id]` fallback page that opens `barrelbook://bottles/{encodedId}` and links to the App Store.
- Added noindex/nofollow metadata and Smart App Banner metadata for the bottle handoff.
- Added `/bottles/*` to the shared AASA payload while preserving existing universal-link components.
- Extended the smoke script to cover route rendering, deep-link encoding, AASA components, and sitemap exclusion.

## Verification
- `npm run lint` passed with existing warnings in unrelated files.
- `npm run build` passed.
- `npm run test:promo` passed.

## Next Steps
- Review the branch diff and open a PR.
- After the matching iOS route is available, test an owned bottle link on an iPhone with the updated app installed.
