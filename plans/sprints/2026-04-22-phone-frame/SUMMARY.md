# Sprint Summary — Phone Frame (2026-04-22)

**Status:** Complete — 6/6 items passing.

## Files added

- `src/components/PhoneFrame.tsx` — reusable pure-CSS iPhone silhouette. Outer dark bezel (`rounded-[2.75rem]` + `border-[#1f1f1f]` + `ring-1 ring-white/5` + `shadow-2xl`), inner screen (`rounded-[2.25rem]` + `overflow-hidden` + aspect ratio driven by `width`/`height` props), decorative Dynamic Island pill absolutely positioned at the top of the screen. Accepts `children`, `ariaLabel`, `className` (for outer width), `width`, `height`.

## Files modified

- `src/components/HeroVideo.tsx` — replaced the plain rounded-rectangle `<figure>` with `<PhoneFrame>`. Public API unchanged (src, poster, ariaLabel, width, height, className).
- `src/components/StoryVideo.tsx` — same treatment. `maxWidthClass` forwards to PhoneFrame's `className`. Default width tightened from `max-w-[300px] sm:max-w-[340px]` to `max-w-[280px] sm:max-w-[320px]` so all eight phones on the page share the same cap.
- `src/components/LandingPage.tsx`:
  - Imported `PhoneFrame`.
  - `StorySection` type: dropped the `centered` and `columns` fields — every image-based story section now renders through a single unified layout.
  - Story-section data: removed `columns: "grid-cols-1 sm:grid-cols-2"` from Scan and Collection sections; removed `centered: true` from Share (FRAME-004). All three sections now share the same layout.
  - Screenshot rendering (FRAME-005): replaced the `aspect-[9/19]` + plain `<figure>` wrapper with `<PhoneFrame>`. Layout is now `grid gap-8 grid-cols-1 sm:grid-cols-2 justify-items-center`, each screenshot capped at `max-w-[280px] sm:max-w-[320px]` (matching the StoryVideo default). Image uses `object-contain` so no app content is cropped — the source screenshots are 9:19 while the phone screen is 9:19.5, and any letterboxing is invisible against the black phone screen.

## High-level change

Every video and screenshot on the homepage now renders inside a recognizable iPhone silhouette (bezel + rounded inner screen + Dynamic Island), and they all share the same outer width. Previously the three story sections used three different widths (Scan/Collection filled the grid cell at ~480–500px, Share was capped at 360px, videos at 340px), which read as inconsistent. Now all eight phones on the page line up at `max-w-[280px] sm:max-w-[320px]`.

The `PhoneFrame` component is reusable — any future screenshot, video, or illustration can drop into it with one import.

## Verification

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (0 errors, 4 pre-existing warnings in unrelated files: `opengraph-image.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `ImageWithFallback.tsx`).
- `npm run build` — **not run in-session.** `.next/` is locked by the running `next dev` server on `localhost:3000`. Stop the dev server and run `npm run build` locally to confirm before deploying.

## Next recommended steps

1. **Reload `http://localhost:3000/`** — the dev server should hot-reload and all eight phones (1 hero + 2 videos + 6 screenshots — wait, actually 1 hero + 2 videos + 6 screenshots = 9 … actually 1 hero + 4 screenshots in Scan/Collection + 2 screenshots in Share + 2 videos = 9, no — it's 1 hero + 2 screenshots × 3 image-sections + 2 videos = 9 total) should now show the iPhone silhouette with the Dynamic Island pill.
2. **Visually QA at 375 / 768 / 1280 px.** Particularly watch:
   - Dynamic Island proportion — it's sized as a percentage of screen width (`h-[3%] w-[32%]` clamped at `min-h-[18px] max-h-[28px]`). If it looks too small or too big at any breakpoint, tweak the percentages in `PhoneFrame.tsx`.
   - Bezel thickness on mobile — the outer `p-[6px]` gives a 6px bezel on all four sides. At 280px wide on mobile that's ~2% of the width, which should read as a natural bezel.
   - Letterboxing on screenshots — if the source images don't quite fit the 9:19.5 phone aspect cleanly, there'll be a tiny band of black at top or bottom. Since the phone screen is already black, this should be invisible.
3. **Consider matching screenshot source aspect to frame** — the five 600×1219 and one 1300×2642 screenshots are all 9:19.025. If you want pixel-perfect screen fill with `object-cover`, re-export them at the 9:19.5 aspect (or whatever aspect PhoneFrame uses). Low priority; the current `object-contain` render is clean.
4. **Run `npm run build` locally** to confirm production compilation.
5. **Commit the work.** A single "WEB: phone frame sprint (2026-04-22)" commit is reasonable, or one per PRD item (FRAME-001..006) for a cleaner history.

## Artifacts

- PRD (source of truth): `plans/sprints/2026-04-22-phone-frame/prd.json`
- Progress log: `plans/sprints/2026-04-22-phone-frame/progress.txt`
- Sprint rules the agent followed: `plans/sprints/2026-04-22-phone-frame/prompt.md`
