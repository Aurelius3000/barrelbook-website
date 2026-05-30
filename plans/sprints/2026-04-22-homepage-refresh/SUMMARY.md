# Sprint Summary — Homepage Refresh (2026-04-22)

**Status:** Complete — 14/14 items passing.

## Files added

- `src/components/HeroVideo.tsx` — phone-sized, silent looping video for the hero.
- `src/components/StoryVideo.tsx` — phone-sized, silent looping video for story sections.
- `public/video-posters/bottle-scanning.jpg` — poster frame for hero video.
- `public/video-posters/pick-a-pour.jpg` — poster frame for Tonight's Pour video.
- `public/video-posters/spotlight-flights.jpg` — poster frame for Spotlight & Flights video.

## Files modified

- `src/components/LandingPage.tsx`
  - Hero: 2-column grid at `lg+`, stacks on smaller viewports; left-aligned text, phone video on right.
  - Hero copy leads with bourbon specialization and folds in the "no barcodes / typing / spreadsheets" stance (WEB-003).
  - Social-proof row under the subhead: 5 bourbon stars + "24 five-star ratings on the App Store" linking to the App Store listing (WEB-005).
  - Removed the redundant Problem section (WEB-006).
  - Story-section data model now supports `screenshots` **or** `video`; pill bullets removed; screenshots trimmed to 2 per image-based section (WEB-007, WEB-008).
  - Two new video-based sections inserted into `storySections`: **Tonight's Pour** (Pick-a-Pour video, between Collection and Share) and **Spotlight & Flights** (closing the sequence) (WEB-009, WEB-010).
  - Callout blocks ("Built for bourbon details", "Your collection goes wherever you go") re-keyed from array index to `section.id` so they stay attached to Scan and Collection after the new sections were inserted.
  - Pricing cards: per-plan CTA button wired to the App Store (WEB-002); `inheritsFrom` field + "Everything in <prior tier>, plus:" line on Plus and Pro (WEB-011); added a clarifying comment on the existing `!isForever` guard in `PriceBlock` (WEB-012).
  - Download CTA copy updated to set iOS-only expectation: "Available on iPhone and iPad today. Android is on the roadmap." (WEB-013).
  - Footer copyright now dynamic: `© 2025–{new Date().getFullYear()} BarrelBook.` (WEB-015).

- `src/app/page.tsx`
  - Injects a SoftwareApplication JSON-LD block with `aggregateRating` (value 5, reviewCount 24), a free `Offer`, and the App Store URL (WEB-014).

## High-level change

The page now leads with the product (bourbon-specialized subhead + looping scan video + social proof) above the fold. The story sequence is tighter (2 screenshots per section, no repeated pills) and adds two feature beats driven by the new videos. Pricing finally has working CTAs and reads by deltas. SEO picks up structured data and the footer year takes care of itself.

## Verification

- `npx tsc --noEmit` — clean on every iteration.
- `npm run lint` — clean (0 errors, 4 pre-existing warnings in unrelated files: `opengraph-image.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `ImageWithFallback.tsx`).
- `npm run build` — **not run in-session.** The `.next` directory is locked by the running `next dev` server on `localhost:3000`, so production builds can't be triggered from the agent's sandbox. Stop the dev server and run `npm run build` locally to confirm before deploying.

## Next recommended steps

1. **Run `npm run build` locally** to confirm production compilation.
2. **Visually QA at 375 / 768 / 1280 px.** Particularly watch:
   - The hero video column size on `lg+` — it's capped at `max-w-[300px]` but may need tweaking depending on how the phone frame reads alongside the headline.
   - The Tonight's Pour and Spotlight & Flights videos for auto-play behavior on Safari iOS.
3. **Confirm the 24-rating figure stays current.** Both the hero social-proof row and the JSON-LD aggregateRating are hardcoded; surface them from a single source if you expect the count to drift.
4. **Commit the work.** A reasonable commit split (one per PRD item) would produce a clean history; a single "WEB: homepage refresh sprint (2026-04-22)" commit works too if you prefer.
5. **Consider follow-ups not in scope here:**
   - Re-source the hero phone video into a web-optimized MP4 (the `.mov` will ship but is larger than needed).
   - If store-pick counts / bottle counts / collector counts become available, wire them into the hero as additional social proof.
   - Add Plausible / GA events on the new pricing buttons so the conversion lift is measurable.

## Artifacts

- PRD (source of truth): `plans/sprints/2026-04-22-homepage-refresh/prd.json`
- Progress log: `plans/sprints/2026-04-22-homepage-refresh/progress.txt`
- Sprint rules the agent followed: `plans/sprints/2026-04-22-homepage-refresh/prompt.md`
