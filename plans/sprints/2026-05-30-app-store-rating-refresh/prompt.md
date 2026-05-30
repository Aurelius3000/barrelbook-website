# App Store Rating Refresh Sprint Prompt

Update the stale homepage rating claim using the current App Store listing.

## Current Truth

- App Store listing showed `4.8` from `116 Ratings` on 2026-05-30.
- Existing website copy says `24 five-star ratings on the App Store`.

## Implementation Constraints

- Keep the App Store URL unchanged.
- Keep the star visual.
- Use exact values for structured data: `4.8` and `116`.
- Use durable public copy: `4.8 stars from 100+ App Store ratings`.
- Do not redesign the hero or reviews section.

## Verification Commands

```bash
npm run build

# After build/dev render, confirm generated output includes updated copy.
rg "4.8 stars from 100\\+ App Store ratings|reviewCount.*116|ratingValue.*4.8" .next src
```
