# Quiet Catalog design QA

Source visual truth: `../../plans/sprints/2026-10-24-web-collection/assets/selected-grid-redesign-option-1.png` (displayed option 1).
Implementation: emulator at http://127.0.0.1:4180/; Alice, Active collection, Grid, default order, no selection.
Viewport: 1487 × 1058 CSS px. Both source and desktop browser captures are 1487 × 1058 pixels, density 1; no scaling required. Synthetic first four bottle identities match the source; subsequent collection records intentionally differ from generated concept. No private staging photos are stored in sprint assets.

## Comparison history

1. Opened source and `assets/grid-option-1-desktop.png` together in the same comparison input. Four columns, full square photos, natural title wrapping, proof/status grouping, ratings and conditional quantity, and aligned quiet detail footers follow the source.
   - [P2] Supporting typography was 14px and visibly smaller than the selected concept's readable metadata. Fix: desktop supporting text increased to 16px, with a consistent 16px Not rated state; mobile retains a deliberate compact scale. Status, producer, proof, quantity and details share the same body token. Resolved by the revised capture/comparison in iteration 2.
   - Expected constraints: environment banner, read-only badge, refresh control retained; Account/sign out remain in established navigation. These add 32px environment context above the collection. Actual stored photo crops/brand logo retained rather than generated replacements.

2. Revised source/implementation full-view comparison plus `assets/grid-option-1-captions-final.png` in the same input confirms readable 16px supporting text, consistent unrated state and natural title flow.
3. Real staging content revealed [P2] long producer/edition text wrapping into extra metadata lines and creating excess space under neighboring cards. Fix: keep the supporting caption on one ellipsized line, with full text in its native title and Details. Preserve unrestricted title wrapping. Resolved: final real staging capture verifies one-line producer captions and reduced row height.

## Fidelity surfaces

- Fonts: existing Arial/Helvetica/system sans matches the concept's neutral sans. 20px/26px semibold names, 16px/24px regular metadata; no reserved title/subtitle blank lines or oversized unrated state. Revised full-view and focused caption comparisons confirm this hierarchy.
- Spacing: square photos, four columns at desktop; 28px caption insets, 6/12/10/16px vertical grouping, bottom-aligned detail links. No card border or rounded container outline.
- Colors: near-black base and #101010 caption surface, white names, neutral secondary text, copper rating/action and existing semantic status dots.
- Images: existing real private image loading and square cover treatment retained. Source's generated images are visual references only, never collection data.
- Copy: names and metadata from canonical records; quantity shown above one; unknown values explicit. Fill stays in Details and Table.

## Final evidence and verification

- Full-view comparison: source and `../../plans/sprints/2026-10-24-web-collection/assets/grid-option-1-desktop-final.png` opened together after fixes. Matching viewport 1487 × 1058. The first four synthetic bottle identities match the source; original fixture crops are preserved. The operational banner/nav arrangement shifts the first photo down by about 40px; the source is an image-generated concept with slightly inconsistent column/photo geometry. Four equal square tracks and intentional operational context are accepted product constraints.
- Focused comparison: source captions reviewed together with `assets/grid-option-1-captions-final.png` (1400 × 255 crop of implementation at x44/y660). Readable 20px names and 16px supporting text, status dot, rating and details hierarchy; no oversized Not rated state. No actionable P0/P1/P2 differences remain.
- Final real data evidence (ignored/private): `.cache/staging-setup/grid-redesign-real-desktop-final.png` (1487 × 1058), `grid-redesign-real-mobile.png` (390 × 844), `grid-redesign-real-narrow.png` (320 × 740). Reopened all three for visual QA; mobile capture refreshed after actual photo load. Desktop still 32 Active records / 41 bottles. At 390: two columns, no horizontal overflow; at 320: one column, no horizontal overflow. The narrow screenshot shows the top of a taller single card; titles and details are reachable through normal scrolling.
- Real long producer text stays on one line with ellipsis/title tooltip; full text in Details. Names keep natural wrapping. Mobile uses 16px names / 13px metadata, narrow single-column uses 17px / 13px. No mobile mock was supplied; this is an intentional responsive adaptation.
- Interactions: known-name search and zero-result state; Opened filter contains only Opened cards; reset filters; Table/Grid keeps search; bottle Details and Back restore grid; all three photos and zoom to 150%; nested Escape dismissal. Rechecked real staging three-photo/zoom and Bernheim search (2 results).
- Browser console checked after final optimized reload and interaction sequence: no errors. Physical touch pinch remains outside this typography change's qualification.
- `npm run test`: 61 passed / 7 files. `npm run lint`, `npm run typecheck`, `npm run build:staging`: passed.

## Implementation checklist

- [x] Exact selected option 1 saved without replacing original.
- [x] Typography, spacing, colors, images and content checked against source.
- [x] P2 metadata size and long-caption findings fixed and captured again.
- [x] Existing private collection behavior checked in browser.
- [x] Optimized localhost staging preview rebuilt; no hosted deployment.

## Follow-up polish

No blocking visual findings. Real catalog content can be longer than the concept; natural title height and one-line producer captions intentionally accommodate it. No new routes, analytics or data/auth behavior changed.




## Local M3 UI addition

This is the ordinary production editor implementation under the approved M3 contract, not another image-to-code redesign. The accepted grid remains the visual foundation. Browser-rendered evidence: sprint `assets/m3-editor-desktop.png` (1440×1024), `m3-editor-mobile.png` (390×844), `m3-editor-narrow.png` (320×740), `m3-conflict-desktop.png` and `m3-uncertain-save-desktop.png`; all synthetic collection data, density 1. Opened captures for visual inspection.

- Typography: 25px editor heading, 15px sections, 13px labels, 15px inputs/16px phone. Neutral sans and copper focus/action treatment consistent with existing drawer.
- Spacing/layout: two-column fields except at 320px, where one column avoids overflow. Hero retained, seven form groups, sticky Save/Cancel. Confirmed page width equals viewport at 390/320 and controls remain reachable through vertical scrolling.
- Colors/tokens: existing near-black surfaces and copper, neutral labels; error borders/text and amber conflict panel remain distinct without replacing the core theme.
- Images/content: actual synthetic gallery photos retained and three-photo viewer tested; 33 canonical fields, no fabricated defaults, dates/zero/unrated/missing cases distinct. Plain-language recovery copy refined after uncertain-state capture.
- Interactions: validation focuses the failing quantity input; Cancel/Back keeps a dirty draft until explicit discard; alert-dialog Shift+Tab wraps and Escape keeps draft; conflict review preserves draft/current values; acknowledged save refreshes details; uncertain matching values do not show Saved. Account switch clears editor/draft.
- Normal final package lint/typecheck/build and tests pass; independent source review confirms no P0/P1/P2 findings. Intentional fault tests produced expected 503/connection errors, so those logs are not treated as app regressions. Fresh normal reload and editor opening produced no new console errors.

No actionable visual blocker in local M3. Full native browser unload-prompt text, physical devices and broader browsers remain release qualification items. The stale native writer and live staging mutation checks are explicitly outside this completed local slice.

final result: passed
