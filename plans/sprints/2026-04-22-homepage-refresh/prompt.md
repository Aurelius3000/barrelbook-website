# Sprint Prompt — Homepage Refresh (2026-04-22)

This sprint refreshes the BarrelBook homepage. Read `plans/ralph_prompt.md`
for the general RALPH loop. The rules below override or supplement it for
this sprint.

## Project context

- Next.js (App Router) + Tailwind. The homepage lives in
  `src/components/LandingPage.tsx` and is rendered by `src/app/page.tsx`.
- Dark theme: background `#0A0A0A`, accent (bourbon) `#D2691E`.
- Icons from `lucide-react`. Images from `next/image`.
- Videos live in `/public`. Reference them from JSX with URL-encoded
  paths (e.g. `/Bottle%20Scanning%202-14-26.mov`), matching how existing
  image assets are referenced.
- `ImageWithFallback` exists at `src/components/figma/ImageWithFallback.tsx`
  for images; there is no video equivalent yet — create one if needed.

## Verification command

Run this from the repo root after each item:

```bash
npm run build 2>&1 | tail -40 && npm run lint 2>&1 | tail -40
```

Both must finish without errors before marking an item `passes: true`.

If the dev server is handy, also load `http://localhost:3000/` and visually
confirm no layout regressions at 375px, 768px, 1280px widths.

## Domain rules

- **Do not remove App Store links.** Every CTA path must still ultimately
  surface the App Store URL
  `https://apps.apple.com/us/app/barrelbook-whiskey-catalog/id6751737898`.
- **Do not fabricate review numbers.** Current truth: 24 five-star ratings.
  Use that number verbatim in WEB-005 and WEB-014.
- **Preserve the bourbon accent pattern.** The orange `#D2691E` accent on
  headline fragments is a brand signature; preserve it wherever present.
- **Performance-first video.** Videos must be `autoPlay muted loop playsInline`
  with `preload="metadata"` and a `poster` where feasible. They must not
  block LCP.
- **Accessibility.** Interactive controls (new pricing buttons, video
  wrappers) must be keyboard-accessible and include visible focus rings.
  Videos should carry an `aria-label` describing what they show since they
  are decorative-but-informative.
- **Gradual consistency.** Per CLAUDE.md, only extract a component when the
  same UI would otherwise be duplicated 3+ times. HeroVideo and StoryVideo
  are justified because the video pattern repeats across three sections.

## Out of scope

- Do not refactor unrelated views (promo pages, gift flows, etc.).
- Do not introduce new runtime dependencies unless essential and noted in
  the commit message.
- Do not change routing or metadata beyond what the items require.

## Iteration ordering

Work in PRD priority order. Ties break by document order. Specifically:

1. Priority 1 bugs first (WEB-002, WEB-012).
2. Hero refresh next (WEB-003 → WEB-006 → WEB-004 → WEB-005). WEB-003
   must precede WEB-006 so the hero absorbs the Problem-section copy
   before the section is deleted.
3. Story-section cleanup (WEB-008 → WEB-007) before introducing the new
   video-based sections (WEB-009, WEB-010), so the new sections inherit
   the cleaned-up pattern.
4. Polish items (WEB-011, WEB-013, WEB-014, WEB-015) last.
