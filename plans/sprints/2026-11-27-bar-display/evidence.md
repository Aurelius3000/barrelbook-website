# Local review evidence, November 27, 2026

Tested from the isolated `codex/bar-display` worktree based on `5abd75e`. The preview at `http://127.0.0.1:4187` uses Auth, Firestore and Storage emulators for `demo-barrelbook-web`. Run the commands below from `apps/collection-web` with Node 24.

| Verification | Observed result |
| --- | --- |
| `npm run typecheck`, `npm run lint`, `npm run build` | Passed. The optimized local build contains the collection page, the existing pilot-access endpoint and the private display endpoint. |
| `npm test` and `npm run test:emulator` | 156 unit tests and 12 emulator tests passed. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-display-boundary.mjs --recover` | Chromium passed with Alice signed in on two tabs. A failed preview image held Start disabled. Bob could not recover Alice’s display. Alice could recover it only to sign-in. Bob’s separate Free account could then preview its own one-bottle shelf. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-display-boundary.mjs --webkit --expire` | WebKit passed the same two-tab handoff and refused shelf and photo access at expiry. A real active status response held in transit until after the cutoff did not unmask the existing guest screen. The delayed-response case also passed in Chromium. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-display-flow.mjs` and its `--webkit` variant | Both passed for Alice. Her open-only preview had 78 open records. The 103-bottle whole shelf had 11 desktop pages and three bottles on its last page. A separate eight-bottle flight exposed exactly its permitted fields. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-owner-library.mjs` and its `--webkit-smoke` variant | Passed the owner photo viewer and keyboard regressions, including focus return, zoom and the three Booker’s photographs. |

The privacy suite compared Alice’s bottle document versions before and after, checked direct Firestore denials for private records and display snapshots, and verified that an independent cookie-free browser context could not read the display. The walkthrough observed no owner reads or mutations while guests browsed. Five wrong PINs triggered a cooldown. In the expiry test, the actual server-issued expiry was within eight hours of activation, then only that test display’s deadline was shortened. This exercises the cutoff without an eight-hour wall-clock soak.

The first implementation used ordinary recovery auth and could enable Start after an image failed to load. Independent source review caught both before the guest screens were built. Recovery now uses a separate memory-only Firebase instance, and Start requires all included images to decode. A final review caught a late status response that could briefly reveal expired content. Both browsers passed the regression and the reviewer confirmed the fix.

## Local captures

- [Showcase in Chromium](../../../apps/collection-web/.cache/bar-display/chromium/showcase.png)
- [Full-HD browse in Chromium](../../../apps/collection-web/.cache/bar-display/chromium/browse-desktop.png)
- [Tablet browse in WebKit](../../../apps/collection-web/.cache/bar-display/webkit/browse-tablet.png)

The capture files live in the ignored worktree review directory. The browser scripts reproduce them.

## Before hosted enablement

Hosted Bar Display is disabled by default. Review the hosting identity’s least-privilege storage access and configure snapshot retention for the display-specific Firestore collection groups `webDisplaySessions`, `webDisplayPages` and `webDisplayPhotos` using `purgeAt`. The eight-hour access cutoff already runs in application code. Plan how to retire or isolate tabs running a version that predates the handoff, since those tabs cannot participate in its browser lock. Verify the real Apple/Google authentication flow and physical display fullscreen, wake lock and sleep/resume behavior on the intended device. These hosted and physical checks remain open.
