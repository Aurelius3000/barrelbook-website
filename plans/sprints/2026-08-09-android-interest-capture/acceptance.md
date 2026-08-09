# Acceptance Criteria

## Proven locally

- [x] `/android` describes early-access notification, not an Android download.
- [x] The published Google Form, owned by `pete@petereilly.com`, requires validated email, 21+ confirmation, and affirmative marketing consent.
- [x] The Google Form is linked to a private named response Sheet owned by `pete@petereilly.com`.
- [x] The website hands off to the published Google Form and does not collect or send email addresses through its own API or analytics.
- [x] Desktop, tablet, and mobile browser coverage passes for the new flow.
- [x] The App Store CTA remains present and unchanged on the homepage; a clearly secondary `Join Android early access` button routes to `/android`, while the App Store badge is intentionally absent from `/android`.
- [x] The Android CTA clearly tells visitors that the short consent form opens in Google Forms.
- [x] Sitemap includes the new capture path; the current legal pages are unchanged.
- [x] TypeScript, lint, production build, focused Android suite, and full Playwright suite are required verification commands.

## Required before production approval

- [ ] Before any outreach, a proper email platform is configured and the export/import process uses only eligible, consented responses with unsubscribe handling.
- [ ] Any launch email has separate recipient, copy, and send approval.
- [ ] Production deployment is explicitly approved.
