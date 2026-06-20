# Public Want List Mobile Preview Summary

## Files Modified
- `src/app/w/[token]/page.tsx`

## Overview
- Tightened mobile spacing for public Want-list item cards.
- Changed mobile cards to a compact row layout with smaller artwork.
- Removed brand/type from the visible card metadata while keeping the backend response parsing intact.
- Kept public notes under the bottle name.
- Moved target price into a compact right-side mobile tile.
- Vertically centered the bottle info stack against the artwork and target tile.
- Moved rank into a larger dedicated left column before the artwork.
- Rendered optional `ownerDisplayName` in the page eyebrow with a fallback to `Shared Want List`.
- Preserved the richer desktop card layout.

## Verification
- `npm run build` passed.
- Local HTML check confirmed the old `1792 • Bourbon` metadata line is absent while public note and target content still render.
- Comment-width screenshot captured at `output/playwright/public-want-comment-width-centered.png`.
- Left-rank variant screenshot captured at `output/playwright/public-want-comment-width-left-rank-large.png`.
- Owner-name preview screenshot captured at `output/playwright/public-want-owner-name-preview.png`.
- Local mock preview served at `http://127.0.0.1:3044/w/preview-token`.
- Screenshots captured:
  - `output/playwright/public-want-mobile-preview.png`
  - `output/playwright/public-want-comment-width-preview.png`
  - `output/playwright/public-want-desktop-preview.png`

## Next Steps
- Monitor the production public Want-list page during QA.
