# Local review evidence, November 27, 2026

Tested from the isolated `codex/bar-display` worktree based on `5abd75e`. The preview at `http://127.0.0.1:4187` uses Auth, Firestore and Storage emulators for `demo-barrelbook-web`. Run the commands below from `apps/collection-web` with Node 24.

| Verification | Observed result |
| --- | --- |
| `npm run typecheck`, `npm run lint`, `npm run build` | Passed. The optimized local build contains the collection page, the existing pilot-access endpoint and the private display endpoint. |
| `npm test` and `npm run test:emulator` | 158 unit tests and 12 emulator tests passed. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-display-boundary.mjs --recover` | Chromium passed with Alice signed in on two tabs. A failed preview image held Start disabled. Bob could not recover Alice’s display. Alice could recover it only to sign-in. Bob’s separate Free account could then preview its own one-bottle shelf. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-display-boundary.mjs --webkit --expire` | WebKit passed the same two-tab handoff and refused shelf and photo access at expiry. A real active status response held in transit until after the cutoff did not unmask the existing guest screen. The delayed-response case also passed in Chromium. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-display-flow.mjs` and its `--webkit` variant | Both passed for Alice. Her open-only preview had 78 open records. The 103-bottle whole shelf had 11 desktop pages and three bottles on its last page. A separate eight-bottle flight exposed exactly its permitted fields. |
| `BB_LOCAL_WEB_PORT=4187 node scripts/test-owner-library.mjs` and its `--webkit-smoke` variant | Passed the owner photo viewer and keyboard regressions, including focus return, zoom and the three Booker’s photographs. |

The privacy suite compared Alice’s bottle document versions before and after, checked direct Firestore denials for private records and display snapshots, and verified that an independent cookie-free browser context could not read the display. The walkthrough observed no owner reads or mutations while guests browsed. Five wrong PINs triggered a cooldown. In the expiry test, the actual server-issued expiry was within eight hours of activation, then only that test display’s deadline was shortened. This exercises the cutoff without an eight-hour wall-clock soak.

The first implementation used ordinary recovery auth and could enable Start after an image failed to load. Independent source review caught both before the guest screens were built. Recovery now uses a separate memory-only Firebase instance, and Start requires all included images to decode. A final review caught a late status response that could briefly reveal expired content. Both browsers passed the regression and the reviewer confirmed the fix.

Both Chromium and WebKit verified the compact setup (including a 474-pixel viewport), keyboard interval selection, Weller at Fit and after zoom reset, and Booker’s three-photo viewer. Enlarge and Close/Escape returned to the same paused bottle. Booker’s fact card showed its release, age and bottle size. Both engines verified that excluding type, warehouse and tags removed them from the flight payload, and hiding type removed Bourbon and Rye filters. Unit tests exercised private fields, older clients and hidden fields in generated titles for unnamed legacy bottles.

## Showcase and thumbnail verification, November 28

The local display flow passed in Chromium and WebKit at 1366 × 768 and 1024 × 768. Each run opened William Larue Weller and Booker’s Barry’s Batch, checked that the showcase photo and actions fit the viewport, and exercised keyboard navigation, pause, zoom, Fit and focus return. Booker’s had three image-only buttons with accessible names and a selected indicator. The checks measure the decoded thumbnails on screen to catch a WebKit sizing regression. Weller opened directly to its single photo.

Run `scripts/test-display-flow.mjs` with Node and `BB_LOCAL_WEB_PORT=4187`. The default is Chromium at laptop size. Use `--webkit` for WebKit and `--tablet` for 1024 × 768. The script saves captures separately for each browser and size.

- [Booker’s borderless showcase on a Chromium laptop](assets/bookers-showcase.png)
- [Booker’s image-only photo selection on a WebKit tablet](assets/bookers-thumbnails.png)

## Local captures

- [Setup](assets/setup.png)
- [Weller at Fit](assets/weller-fit.png)
- [Booker’s bottle details](assets/bookers-details.png)
- [Booker’s batch label at 150%](assets/bookers-batch.png)

- [Showcase in Chromium](assets/showcase.png)
- [Full-HD browse in Chromium](assets/browse-desktop.png)
- [Tablet browse in WebKit](assets/browse-tablet.png)

These captures are included for PR review. The browser scripts reproduce them in the local review directory.

## Before hosted enablement

Hosted Bar Display is disabled by default. Review the hosting identity’s least-privilege storage access and configure snapshot retention for the display-specific Firestore collection groups `webDisplaySessions`, `webDisplayPages` and `webDisplayPhotos` using `purgeAt`. The eight-hour access cutoff already runs in application code. Plan how to retire or isolate tabs running a version that predates the handoff, since those tabs cannot participate in its browser lock. Verify the real Apple/Google authentication flow and physical display fullscreen, wake lock and sleep/resume behavior on the intended device. These hosted and physical checks remain open.
