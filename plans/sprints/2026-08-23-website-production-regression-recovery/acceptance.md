# Acceptance Criteria

- [x] Homepage shows the support warning immediately below the fixed header with the approved copy and `/support` destination.
- [x] Homepage visibly shows `4.8` and `App Store rating`; visible and accessible UI contains no `24 five-star` copy.
- [x] Existing App Store badge destinations and click analytics are unchanged.
- [x] Existing `Join Android early access` CTA remains present and `/android` returns successfully.
- [x] `/support` returns successfully, emits `noindex, follow`, remains absent from the sitemap, and renders the authentication-error image.
- [x] Support instructions warn affected users with possibly unsynced changes to contact Support before deleting the app.
- [x] Footer and lower-homepage Support links work.
- [x] Privacy, terms, deep-link, promo, and AASA behavior remain unchanged.
- [x] Desktop, tablet, and mobile homepage layouts have no warning/header overlap or horizontal overflow.
- [x] TypeScript, focused lint, build, promo tests, focused Playwright, and full end-to-end tests pass.
- [x] Preview deployment reaches `Ready`; Vercel's production build succeeds and enumerates the expected `/android` and `/support` routes.
- [x] No production alias is changed without separate approval.
