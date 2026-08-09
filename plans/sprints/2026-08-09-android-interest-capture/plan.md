# Implementation Plan

## Lead contract

The published Google Form and its linked response Sheet are owned by
`pete@petereilly.com`. A valid response requires:

```text
Email address (required, Google Forms email validation)
21+ confirmation (required)
Affirmative consent for BarrelBook Android product updates (required)
Google Forms response timestamp
```

The website does not receive, proxy, log, or analyze the email address. It only
records aggregate `android_interest_form_view` and
`android_interest_form_opened` events with the page placement.

## Delivered website work

1. Public indexable `/android` page with early-access copy and metadata.
2. Accessible page-level handoff to the published Google Form, plus a Privacy Policy link and clear disclosure of the three required form confirmations.
3. Homepage secondary link to `/android`; the existing iOS badge remains intact.
4. The Google Form is published and linked to a private response Sheet under `pete@petereilly.com`; Google Forms receives the visitor&apos;s response directly.
5. No Customer.io, server-side lead API, email provider credentials, or Vercel rate-limit configuration is needed for this initial signal-collection phase.
6. Sitemap update only; the current legal pages remain untouched. Aggregate Vercel/GA event names are `android_interest_form_view` and `android_interest_form_opened`.

## Operational gates still outside code

1. Review the Google Form and response Sheet sharing state; keep the Sheet private to `pete@petereilly.com` unless access is explicitly needed.
2. Before outreach, configure a proper email platform and import only responses with both confirmations; respect unsubscribe and suppression handling there.
3. Separately approve any campaign, recipient manifest, message copy, send, and production deployment.
