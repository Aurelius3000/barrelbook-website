# Implementation sequence

1. Read the v3 handoff, C1–C3 in the ZIP, Alice’s seeded bottle records, the member-admission route, and the existing owner viewer. Use the local emulators throughout.
2. Build the server-side shelf projection, owner preview, immutable photo copies and session transitions. Verify the privacy boundary in Chromium and WebKit before implementing guest browsing. Reject unauthenticated owner access, isolate other accounts, clear both owner tabs, limit PIN attempts and enforce eight hours from activation.
3. Feed the showcase and shelf from the same read-only snapshot. Cover rotation, pause, category filters, paging, bottle facts and return to the selected bottle. Share the owner viewer’s zoom and keyboard behavior through a photo-rendering callback.
4. Re-run local browser privacy tests and owner regressions. Capture the 1920×1080 and 1024×768 views. Record local build and test results. Hosting, production settings, merging and deployment require separate authorization.
