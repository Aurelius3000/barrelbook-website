# T1 Private Bottle Handoff Route

## Description
Add a private website fallback route at `/bottles/[id]` that hands users off to the BarrelBook iOS app without exposing bottle data on the web.

## Decisions
- Keep the page generic and private: no bottle data fetches, no account lookups, and no displayed bottle metadata.
- Trim the route parameter before use and URL-encode it for outbound deep links.
- Return a 404 for an empty trimmed ID.
- Reuse shared App Store constants from `src/lib/app-store.ts`.
- Emit noindex/nofollow metadata and a Smart App Banner app argument pointing at the encoded bottle deep link.

## Test Notes
- Route rendering and deep-link href coverage will be added in the lightweight promo foundation test script.

## Implementation Notes
- Added `src/app/bottles/[id]/page.tsx`.
- The page trims IDs, rejects empty values with `notFound()`, and encodes the ID for `barrelbook://bottles/{id}`.
- The page uses generic app-handoff copy only and does not fetch or render bottle data.
- Metadata uses `robots: { index: false, follow: false }` and Smart App Banner app arguments.
