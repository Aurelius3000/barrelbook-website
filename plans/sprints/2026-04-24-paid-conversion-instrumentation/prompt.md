# Paid Conversion Instrumentation Upgrade

Implement the sprint described in `prd.json`.

Do not redesign pricing or paywall UX. Keep the existing Firestore `analytics_events` pipeline as the owned analytics source. Add privacy-safe conversion funnel events across iOS, backend StoreKit sync, and website App Store CTA attribution.

Preserve current purchase, entitlement, scan, and website navigation behavior.
