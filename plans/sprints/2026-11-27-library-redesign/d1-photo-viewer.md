# D1 · Read-only bottle photo viewer

Proposed for local implementation and review, November 27, 2026. The review task is to find the red batch sticker on Alice’s Booker’s, read **125.7 proof** from the photograph, inspect the back label and return to the same place on the shelf. Run that task on a laptop and a phone.

## Experience

1. A photo or name in Grid or Table opens bottle Details. The large detail photo opens D1 on the currently selected photo. The detail Photos tab can also open D1 on its selected image.
2. On a laptop, fit the entire original photograph into the available height, preserve its aspect ratio and put Previous and Next outside the image. Show a visible Close button, bottle name and position such as “Photo 2 of 3”. The adjacent panel holds selectable thumbnails and known bottle facts. Use the existing text-size setting.
3. Below roughly 1000 CSS pixels, put the panel below the photo. Keep Close reachable and put Zoom in, Zoom out and Fit to screen directly below the image and before thumbnails and facts. Let the page scroll outside the image. At Fit, a narrow or short viewport must still leave usable space for the photo.
4. Previous, Next and the left/right keys wrap through multiple photos. Selecting a thumbnail opens that photo. Zoom buttons advance in 50-point steps from 100% to 400%. Wheel or pinch zooms around the pointer or fingers, and dragging pans the enlarged image. Fit and changing photos reset zoom and pan. Preserve browser zoom shortcuts. When the zoomed image has keyboard focus, arrow keys pan it and the labeled navigation buttons remain available to change photos.
5. Close or Escape returns to the selected photo in detail and focuses its opener. Back from detail restores the originating tile, row, list item or conversation reference and its prior context.

## What the data supports

The current web record supplies ordered image references, a primary index and bottle-level facts. Show **Cover photo** for the designated primary image and **Photo N** for other images, using their actual position. Use that same identity in the counter, thumbnail labels and accessible image description. Show available recorded facts under **About this bottle**. Omit missing fields and omit the facts section if none are available.

Keep automatic Front / Batch label / Back label classification, source-photo links for scanned fields, and owner corrections on the scan/client backlog. “On this label” requires a verifiable link from a field to the particular photo. Fixture filenames and photo order cannot supply that link. This milestone uses existing owner-authorized image reads. It requires no new data schema, backend, iOS release or guest access.

## Implementation sequence and scope

| Step | Work | Verification |
| --- | --- | --- |
| 1. Prepare Alice’s local review bottle | Use the three original JPEGs from the supplied handoff archive: bookers-1-front.jpg, bookers-2-batch.jpg and bookers-3-back.jpg. Seed them in that order under Alice’s existing Booker’s in emulator Storage. Set the front as cover and identify the fixture as Barry’s Batch 2025-01. Update its synthetic proof from 124.7 to 125.7 to match the red label. Keep the existing two-photo Blanton’s and the no-photo fixture for regressions. | Confirm three distinct, decodable originals through the signed-in reader. Check the front signature, red batch sticker and back barcode visually. Keep review images in test fixtures outside public web assets. |
| 2. Adapt the existing viewer | Reuse the authenticated Photo reader, selected image index, modal focus handling and zoom/pan geometry. Update responsive layout, accessible controls, fallback labels, fact display and single-image behavior. Limit photo styling to the viewer. | Run unit tests and exercise both entry points before capturing screenshots. |
| 3. Run browser and device checks | Extend the existing Alice runner. Reuse the synthetic Lists and Ask B.B. coverage for linked-detail returns. Capture the review evidence below. | Record each check as passed, failed or unverified, with the browser, device and viewport. |
| 4. Review locally | Present the laptop and phone evidence together with the runnable Alice preview. | Pete reviews image size, label readability and navigation before a separate staging decision. |

Expected implementation files under apps/collection-web include src/app/page.tsx, viewer styles in src/app/owner.css, src/lib/photo-viewer.ts, tests/photo-viewer.test.ts, scripts/local-fixture.mjs, scripts/test-owner-library.mjs and the three fixture JPEGs. Update tests/browser/ask-bb.mjs only where an existing assertion depends on a changed control. Record implementation results in the sprint evidence. This scope exceeds five files because fixture assets, viewer behavior and browser checks all need to travel together.

## Acceptance criteria and tests

| Area | Passing result |
| --- | --- |
| Entry and return | From both Grid and Table, clicking the thumbnail opens Details first. Opening the selected second image in Details starts D1 at 2 of 3. Closing returns to that same image and trigger. Leaving detail restores search/filter, scroll and focus to the originating bottle. Linked Want/Tried and synthetic Ask B.B. returns preserve the list or transcript and draft. |
| Image fidelity | At Fit, all four edges of each original are visible and the picture retains its aspect ratio. No arrow or badge covers label text. Zooming the second photo lets the reviewer read 125.7 on the sticker. Check the actual loaded pixels as well as the zoom status. Use an additional landscape image in geometry/layout tests. |
| Navigation and zoom | Exercise thumbnails, both wrap boundaries, arrow keys, buttons, wheel, pinch, pan and Fit. Confirm 100%, 150% and 400%, both limits, reset on image change and no stale image after rapid navigation. Scrolling the mobile facts panel or using browser zoom must not zoom the photograph. |
| Limited and unavailable photos | With one photo, show the image and zoom controls, omit arrows and thumbnail strip. With zero, Details explains the empty state and offers no active viewer entry. A failed or denied image has a readable unavailable state and allows navigation to another image or Close. |
| Accessibility and responsive layout | Check laptop at 1280×800 and 1440×900, phone portrait at 390×844, and a 320px width stress case. At all three reading sizes and 200% browser zoom, controls remain reachable without page-wide horizontal scrolling. Close and zoom controls have visible labels and at least 48px targets. Verify keyboard-only entry, focus trap, Escape and focus return. With VoiceOver, confirm the current photo and position are announced once and the active thumbnail is identifiable without color. |
| Read-only and private | No correction or upload action. Verify Alice can view her own originals and another owner’s image fails safely. Observe browser traffic during browsing for bottle/list writes or edit endpoints. Compare bottle/list document versions before and after. Use the existing signed-out/session-isolation tests. |
| Regression | Typecheck, lint, unit tests, emulator checks, optimized build and local browser suites pass. Existing Grid/Table detail entry, gallery return, Lists and Ask B.B. behavior remain covered. |

## Local review and evidence

- **Laptop:** Run the Alice walkthrough in Chromium and WebKit. Capture the whole front photo at Fit, the batch sticker zoomed until readable, and the back label. Include the controls and selected thumbnail in the screenshots.
- **Phone:** Run the same sequence in mobile WebKit at 390×844. Then use Safari on an available physical iPhone for tap, pinch, drag, portrait/landscape, Close and return. Use PVR3 if available, accessing the local fixture preview through a private development connection. No app installation is needed. Record responsive emulation and physical touch separately. If the phone cannot reach the private preview, report the physical check as pending.
- Save labeled laptop and phone captures and a short walkthrough under the existing local review output directory. Include command results, actual device/browser, and any unverified checks in the sprint evidence. Capture before/after fixture versions after seeding. Keep account sign-in out of recordings.
- From apps/collection-web run npm run typecheck, npm run lint, npm test, npm run test:emulator and npm run build. With the seeded local preview, run node scripts/test-owner-library.mjs and its --webkit-smoke variant. Run node scripts/test-ask-bb-browser.mjs with its controlled responses. Keep local review distinct from any later hosted staging test.

The local acceptance decision covers the owner viewer only. Staging and production deployments, live account changes, Bar Display and photo-data capture work each have their own scope.
