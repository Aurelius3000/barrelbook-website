# Review Count 125 Refresh Summary

## Files Added / Modified

- Added `.claude_tasks/2026-06-01_10-09-03/` task records and this summary.
- Added `plans/sprints/2026-06-01-review-count-125/` Ralph sprint records.
- Modified `src/lib/app-store.ts`.

## Overview

- Updated exact structured-data App Store review count from `116` to `126`.
- Updated rounded public App Store rating count from `100+` to `125+`.
- Preserved the App Store URL, rating value, rating-link component, homepage layout, and JSON-LD wiring.

## Verification

- `npm ci` was required in the fresh worktree before building.
- `npm run build` passed.
- Focused rendered-output checks confirmed:
  - source exact count is `126`
  - source display count is `125+`
  - rendered public copy uses `125+`
  - rendered aria label uses `125+`
  - rendered JSON-LD `reviewCount` is `126`
  - stale rendered `100+ App Store ratings` copy is absent

## Next Recommended Steps

- Push `codex/update-review-count-125` and open a small PR.
- Merge to `main` and allow Vercel to deploy production.
- Optionally address the existing npm audit findings separately from this copy update.
