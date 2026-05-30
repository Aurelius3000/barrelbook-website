# Sprint Summary — Homepage Tweaks (2026-04-22)

**Status:** Complete — 6/6 items passing.

## Files added

- `public/video-posters/shared-shelves.jpg` — ffmpeg-extracted poster for the new SharedShelves video (108 KB, 1080×2336).

## Files modified

- `src/components/LandingPage.tsx`
  - **Screenshot wrapper reverted** (TWEAK-001): the screenshot-grid branch no longer uses `PhoneFrame`. Screenshots render in a plain `rounded-2xl` figure with a subtle `border-[#1f1f1f]` and a `bg-black` inner `aspect-[9/19]` container holding the `ImageWithFallback`. Removed the unused `PhoneFrame` import.
  - **`StorySection.columns` re-introduced** as an optional override; default is `grid-cols-1 sm:grid-cols-2`. Grid is also `justify-items-center` so screenshots align regardless of column count.
  - **Scan section** (TWEAK-002): added `App Scan WLW4.png` on the right; `columns: "grid-cols-1 sm:grid-cols-3"`.
  - **Collection section** (TWEAK-003): inserted `App Scan Blantons3.png` in the middle between Blantons2 and Blantons4; `columns: "grid-cols-1 sm:grid-cols-3"`.
  - **Share section** (TWEAK-005): swapped the `screenshots: [Catalog1, Blantons Details]` for a `video` block pointing at `/SharedShelves.mov` with `/video-posters/shared-shelves.jpg` poster. Title updated to **"Share the shelf worth showing off."** and description to **"Build your shelf in private, publish when you're ready, and let friends browse the bottles that define your collection."** Section `id` stays `share`.

## High-level change

The homepage now reads as a cleaner stack: screenshots are bare (no phone silhouette), videos keep the phone silhouette. Scan and Collection each show three screenshots at tablet+ (stacking to one column on mobile), restoring the visual density that got trimmed in WEB-007. The Share section is no longer a screenshot grid — it's a third Shared Shelves product video, sitting alongside Tonight's Pour and Spotlight & Flights.

Longer Shared Shelves copy you supplied (feature blocks, closing CTA, secondary CTA) is reserved for a future standalone `/shared-shelves` page. The homepage uses only the condensed headline + subhead variant.

## Verification

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (0 errors; 4 pre-existing warnings in unrelated files remain).
- `npm run build` — **not run in-session.** `.next/` is locked by the running `next dev` on :3000.

## Next recommended steps

1. **Reload `http://localhost:3000/`** — dev server should hot-reload. You'll see:
   - Scan section with 3 photos (WLW / WLW3 / WLW4).
   - Collection section with 3 photos (Blantons2 / Blantons3 / Blantons4).
   - Share section now playing the SharedShelves video in a phone silhouette.
   - All non-video screenshots in plain rounded containers (no Dynamic Island).
2. **Visually QA at 375 / 768 / 1280 px.** Particular things to watch:
   - At `sm:grid-cols-3`, the three screenshots share each row; at narrow tablet widths (640–700px) they may feel tight — if so, bump to `md:grid-cols-3` (768px+) instead.
   - The SharedShelves video is 28 MB `.mov` — same story as the other `.mov` files. Consider re-encoding to MP4 (`libx264` + `aac`) for smaller file size + better iOS Safari compatibility.
3. **Consider building `/shared-shelves`** as a follow-up sprint using the longer copy you pasted — Hero (headline + subhead + two CTAs), Why section, 6 feature blocks, closing section + final CTA. I can scaffold that as its own PRD whenever you're ready.
4. **Run `npm run build` locally** before deploying.
5. **Commit.** Natural split: one commit per TWEAK item, or a single "WEB: homepage tweaks (2026-04-22) — unwrap screenshots, restore 3rd photos, add Shared Shelves video" commit.

## Artifacts

- PRD: `plans/sprints/2026-04-22-homepage-tweaks/prd.json`
- Progress log: `plans/sprints/2026-04-22-homepage-tweaks/progress.txt`
- Sprint rules: `plans/sprints/2026-04-22-homepage-tweaks/prompt.md`
