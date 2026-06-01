# Review Count 125 Refresh Sprint Prompt

Update the website's App Store review/rating count messaging using the user-provided current count.

## Current Truth

- User stated on 2026-06-01 that BarrelBook now has 126 App Store reviews.
- Public rounded messaging should say `125+`, replacing the stale `100+` claim.

## Implementation Constraints

- Keep the existing App Store URL unchanged.
- Keep the existing rating value unchanged unless the source code already ties it directly to review-count copy.
- Keep the existing visual design and layout unchanged.
- Update centralized constants rather than duplicating copy.
- If an exact structured-data review count exists, set it to `126`.
- Do not redesign the hero, rating link, reviews section, or app store badge.

## Verification Commands

```bash
npm run build

# Confirm refreshed public copy and exact structured data.
rg "125\\+|reviewCount.*126|APP_STORE_RATING_DISPLAY_COUNT" src .next

# Confirm stale rounded count is gone from App Store rating messaging.
rg "100\\+ App Store ratings|APP_STORE_RATING_DISPLAY_COUNT = \"100\\+\"" src .next
```

