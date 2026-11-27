# Existing member access

Approved scope: quiet web release for existing members. Require verified app and identity, an existing owner profile, existing feature eligibility, and read-only collection browsing. Production is gated on two distinct members and privacy verification on canonical staging. Preserve the previous deployment and original UID list for rollback.

Candidate is based on production web commit c5f9707. Deploy the collection app only. The default access mode is pilot; explicit members mode checks the authenticated owner's profile. Restore the prior production deployment for immediate rollback, and set the admission mode to pilot for later builds.

## Qualification in progress

Typecheck, lint, 165 unit and emulator tests, optimized build and synthetic browser regressions passed. Independent code review found no blocking admission or isolation issue. Staging uses the registered app at localhost:4182 with the staging project as the local ADC quota project. The initial Auth lookup failed closed without that setting; the authenticated test passed after correcting the staging launch environment.

Pete's staging Google session passed member admission with no UID allowlist configured. The app showed 297 records / 299 bottles and the owner's Want and Tried lists. A separate loopback-only QA harness used the ordinary Firestore and Storage clients with the member's session. All three owner reads succeeded and all three cross-account reads (bottles, lists, photo listing) returned the expected service permission errors. The reverse direction, clean account switch and production promotion await the second staging session. That registered and verified test member has an existing profile and an empty shelf.

Production rollback target verified Ready: dpl_3jKnWpTfn1ibosY5yVBYuXWPsNuK. Ask B.B. turn service askbbturn-00031-viy has its own configured web pilot UID list. Web membership alone does not expand that service's admission or change its plan, usage or consent controls.

## Staging release gate

The Account panel identified the second session as Test19. Collection showed 0 records and 0 bottles, and Lists showed “No lists yet.” Back returned to the empty collection. A full reload completed member admission and restored the same empty shelf. The previous populated session had cleared on sign-out. The second signed-in session was in the in-app browser.

With test19's session, all three owner operations succeeded (bottles, lists and photo listing), and the services explicitly denied the matching reads against Pete's account. All twelve permission outcomes across the two accounts matched expectations. Photo checks exercised listing permissions. The temporary QA page was retired after testing. The original staging build then served the collection at HTTP 200 and the QA path at HTTP 404.

## Production release

Promoted candidate e0fc65a as dpl_2XWSVa813EVMN1rKJ4uu9Zwi4p4b on app.barrelbook.app. Verified the production upload against the prior 24-file collection runtime manifest and the candidate Git tree. Checked production setting metadata before and after adding BARRELBOOK_WEB_ACCESS_MODE=members. The pilot UID setting and all other existing production setting metadata matched. Both the candidate and live domain passed the noindex page check (200), unsigned admission check (401), wrong-origin check (403), and private/no-store checks on those denials.

After promotion, a fresh load of Pete's signed-in production session showed the verified account and 310 records / 311 bottles, marked read-only. Lists displayed Want and Tried, and returning to Collection succeeded. The admission route showed successful 204 responses and the expected 401/403 checks during the smoke test. The two-account service permission checks ran on staging. Vercel's install audit reported 22 dependency findings (4 high, 17 moderate, 1 low) with the same package lock as the previous release.

Rollback: restore dpl_3jKnWpTfn1ibosY5yVBYuXWPsNuK to the production domain, set BARRELBOOK_WEB_ACCESS_MODE to pilot for subsequent builds, and verify admission with the retained pilot UID list.
