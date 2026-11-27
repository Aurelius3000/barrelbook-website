# Existing member access

Approved scope: quiet web release for existing members. Require verified app and identity, an existing owner profile, existing feature eligibility, and read-only collection browsing. Production is gated on two distinct members and privacy verification on canonical staging. Preserve the previous deployment and original UID list for rollback.

Candidate is based on production web commit c5f9707. Deploy the collection app only. The default access mode is pilot; explicit members mode checks the authenticated owner's profile. Restore the prior production deployment for immediate rollback, and set the admission mode to pilot for later builds.

## Qualification in progress

Typecheck, lint, 165 unit and emulator tests, optimized build and synthetic browser regressions passed. Independent code review found no blocking admission or isolation issue. Staging uses the registered app at localhost:4182 with the staging project as the local ADC quota project. The initial Auth lookup failed closed without that setting; the authenticated test passed after correcting the staging launch environment.

Pete's staging Google session passed member admission with no UID allowlist configured. The app showed 297 records / 299 bottles and the owner's Want and Tried lists. A separate loopback-only QA harness used the ordinary Firestore and Storage clients with the member's session. All three owner reads succeeded and all three cross-account reads (bottles, lists, photo listing) returned the expected service permission errors. The reverse direction, clean account switch and production promotion await the second staging session. That registered and verified test member has an existing profile and an empty shelf.

Production rollback target verified Ready: dpl_3jKnWpTfn1ibosY5yVBYuXWPsNuK. Ask B.B. turn service askbbturn-00031-viy has its own configured web pilot UID list. Web membership alone does not expand that service's admission or change its plan, usage or consent controls.
