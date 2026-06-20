# Public Want List Empty State

## Overview

Fixed the public Want-list page so valid active shares with zero recipient-visible bottles render as active empty lists instead of the neutral unavailable page.

## Files Changed

- `src/app/w/[token]/page.tsx`
- `plans/sprints/2026-06-14-public-want-list-empty-state/prd.json`
- `plans/sprints/2026-06-14-public-want-list-empty-state/progress.txt`
- `plans/sprints/2026-06-14-public-want-list-empty-state/prompt.md`

## Outcome

- Active shares with `items: []` now show list title, description, metadata, and a public empty state.
- Invalid, revoked, expired, and unavailable responses still use the existing neutral unavailable page.
- No public endpoint contract changes were made.

## Verification

- `git diff --check`
- `jq -e . plans/sprints/2026-06-14-public-want-list-empty-state/prd.json`
- `npm run build`
- Local browser smoke at `http://localhost:3042/w/NFBIxzxgQ3Ki53fWg1hJ5M1scE2urfCVjVK3SGo7iE8`

## Deployment

Requires website production deploy before `https://www.barrelbook.app/w/NFBIxzxgQ3Ki53fWg1hJ5M1scE2urfCVjVK3SGo7iE8` reflects this fix.
