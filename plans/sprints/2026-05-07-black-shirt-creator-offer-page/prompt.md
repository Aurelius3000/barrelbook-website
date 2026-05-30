# Black Shirt Creator Offer Page

Implement the sprint described in `prd.json`.

Work in `/Users/petereilly2021/Projects/barrelbook-website`. Use the existing promo campaign architecture rather than building an unrelated flow.

Create a bespoke Black Shirt Bourbon Society offer page using dark black, antique gold, warm barrel tones, ornamental borders, and co-branded BarrelBook treatment. The page should support Plus Annual and Pro Annual offer options for 20% off the first year.

Keep direct Apple redeem URLs out of public redirects. Raw Apple custom codes should be available only through a manual fallback or disclosure path, not as the primary CTA. Use the existing generic `barrelbook://promo/{slug}` handoff.

Add only website code plus setup documentation. Do not mutate App Store Connect, Firestore, or BarrelBook app code as part of this sprint.

Run:
- `npm run test:promo`
- `npm run lint`
- `npm run build`
