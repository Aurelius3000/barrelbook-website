# T3 Bottle Tests And Verification

## Description
Extend lightweight website checks for the new bottle fallback route and AASA component, then run local verification.

## Decisions
- Extend `scripts/test-promo-foundation.mjs` instead of introducing a new test runner.
- Verify a rendered sample route, expected deep link, App Store CTA, AASA `/bottles/*`, and sitemap exclusion.
- Run lint, production build, and the promo foundation test before finalizing.

## Test Notes
- Commands planned: `npm run lint`, `npm run build`, and `npm run test:promo`.

## Implementation Notes
- Extended `scripts/test-promo-foundation.mjs` to verify `/bottles/testBottle123`, encoded bottle IDs, App Store CTA, Smart App Banner app argument, sitemap exclusion, and all expected AASA components.
- Adjusted the bottle route normalization to decode once before trimming and re-encoding outbound deep links.

## Verification
- `npm run lint` passed with existing warnings in unrelated files.
- `npm run build` passed.
- `npm run test:promo` passed.
