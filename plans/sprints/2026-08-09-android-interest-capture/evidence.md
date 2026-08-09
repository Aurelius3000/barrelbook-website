# Evidence

## 2026-08-09 Google Form/Sheet implementation

- Refreshed `origin/main`; implementation branch begins at `2339b6f`.
- Created clean sibling worktree `/Users/petereilly2021/Projects/barrelbook-website-android-interest-capture`; original dirty checkout was not changed.
- Google Forms editor verified `pete@petereilly.com`; the existing Drive connector remained on `pete@answerrocket.com` and was not used for creation.
- Created and published `BarrelBook for Android — Early Access` and a linked private response Sheet named `BarrelBook for Android — Early Access (Responses)` under `pete@petereilly.com`.
- Published responder-form inspection verified required email validation, required 21+ confirmation, required affirmative marketing consent, the privacy URL, and the confirmation message. Google account/email collection is disabled, so the respondent supplies only the email field in the form.
- `npm run build`: passed; output includes `/android` and no `/api/android-interest` route.
- `npx tsc --noEmit`: passed after the clean production build.
- `npx playwright test tests/android-interest.spec.ts`: 6 passed across desktop, tablet, and mobile projects.
- `npm run lint`: passed with six pre-existing warnings (one unused disable and five `no-img-element` warnings); no lint errors.
- `npm run test:e2e`: 12 passed, 3 expected responsive-project skips.
- `git diff --check`: passed.

## 2026-08-09 Android visitor-clarity refinement

- Visitor-perspective review found that the global App Store badge could send an Android visitor to the wrong store, and that the outgoing Google Forms transition was not explicit.
- `/android` now hides only the header's App Store badge; all other routes retain the shared header's existing default badge and analytics behavior.
- The primary CTA now reads `Continue to Google Form`, and the helper text states that the visitor will continue in Google Forms for email, age confirmation, and consent.
- `npx playwright test tests/android-interest.spec.ts`: 6 passed across desktop, tablet, and mobile projects.
- `npm run lint`: passed with the same six pre-existing warnings and no errors.
- `npm run build`: passed; output includes `/android`.
- Fresh local visual inspection passed: desktop and 390px-wide mobile show no App Store link on `/android`, preserve the early-access card, and display the explicit Google Form CTA.

## 2026-08-09 PR review follow-up

- `/android` header links now use homepage-qualified targets (`/#how-it-works`, `/#pricing`, and `/#download`) rather than dead page-local anchors.
- Homepage video-request suppression is limited to the known local headless cancellation or abort of a `/videos/*.mp4` request; other video failures remain test failures.
- `npm run test:e2e`: 12 passed, 3 expected responsive-project skips.
- `npm run lint`: passed with six pre-existing warnings and no errors.
- `npm run build`: passed; output includes `/android`.

## 2026-08-09 Homepage Android-interest button

- Replaced the low-visibility homepage text link with a secondary `Join Android early access` button directly below the primary App Store badge.
- The button routes to `/android` and records only the aggregate `android_interest_homepage_clicked` event with `homepage_download` placement.
- The App Store badge remains the visual primary action; the top header, Google Form, and legal pages are unchanged.
- `npx playwright test tests/homepage.spec.ts --update-snapshots`: 6 passed, 3 expected responsive-project skips; refreshed desktop, tablet, and mobile homepage baselines.
- `npm run test:e2e`: 12 passed, 3 expected responsive-project skips.
- `npm run lint`: passed with six pre-existing warnings and no errors.
- `npm run build`: passed; output includes `/android`.

## External verification pending

- The original Android-interest page shipped in PR #20 and Vercel marked its production deployment ready. This homepage-button follow-up remains local until separately reviewed and released.
- No real responder submission, campaign, or outbound email was sent.
- The current Terms and Privacy pages are intentionally unchanged. Deployment approval and the later email-platform/import/send decisions remain separate gates.
