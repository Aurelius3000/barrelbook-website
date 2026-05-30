# Sprint Prompt — Phone Frame (2026-04-22)

This sprint wraps all product media on the homepage in a consistent iPhone
silhouette. Read `plans/ralph_prompt.md` for the general RALPH loop; the
rules below override/supplement it for this sprint.

## Project context

- Next.js (App Router) + Tailwind. The homepage lives in
  `src/components/LandingPage.tsx` and is rendered by `src/app/page.tsx`.
- Dark theme: background `#0A0A0A`, accent (bourbon) `#D2691E`, existing
  bezel borders use `border-[#1f1f1f]`. Keep the palette.
- Existing HeroVideo/StoryVideo components wrap videos in a plain rounded
  rectangle. This sprint replaces that with a true phone silhouette.
- Screenshots are currently rendered with `aspect-[9/19]` + `object-contain`
  inside a plain `rounded-2xl` figure. FRAME-005 replaces that wrapper with
  `<PhoneFrame>`.

## Verification command

Run this from the repo root after each item:

```bash
npx tsc --noEmit 2>&1 | tail -20 && npm run lint 2>&1 | tail -20
```

`npm run build` cannot run in-session because the `next dev` server on
`localhost:3000` holds `.next/` locked. Skip it; document in SUMMARY.md.

Both commands must finish clean before marking an item `passes: true`.
Four pre-existing warnings in unrelated files (`opengraph-image.tsx`,
`privacy/page.tsx`, `terms/page.tsx`, `ImageWithFallback.tsx`) are OK.

## Domain rules

- **One device silhouette.** Every video and screenshot on the homepage
  should use the same PhoneFrame component. Do not fork the frame into
  per-section variants.
- **Preserve video attributes.** `autoPlay muted loop playsInline` with
  `preload="metadata"` and `poster` must remain on every `<video>`.
- **Preserve alt/aria labels.** Screenshots keep their alt text on the
  inner img; videos keep their aria-label on the PhoneFrame figure.
- **CSS-only mockup — no new runtime deps.** Do not introduce
  `marvel-devices.css`, `devices.css`, or similar. Pure Tailwind.
- **Accessibility.** The Dynamic Island pill is decorative. Give it
  `aria-hidden="true"`.
- **Gradual consistency.** Per CLAUDE.md, extract PhoneFrame because the
  pattern repeats 8+ times (2 videos + 6 screenshots).

## Out of scope

- Do not re-author source screenshot PNGs or videos.
- Do not change homepage copy, pricing, or FAQ content.
- Do not introduce new routes or metadata.
- Do not touch unrelated pages (privacy, terms, opengraph-image).

## Iteration ordering

Work in PRD priority order:

1. FRAME-001 (component) first — everything else depends on it.
2. FRAME-002, FRAME-003 (videos) next — lower-risk, proves the component.
3. FRAME-004 (normalize widths) before FRAME-005 so the screenshot grid
   is already consistent when we swap in PhoneFrame.
4. FRAME-005 (wrap screenshots).
5. FRAME-006 (verification + SUMMARY.md).
