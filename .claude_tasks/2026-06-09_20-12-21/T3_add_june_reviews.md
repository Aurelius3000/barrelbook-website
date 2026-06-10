# Task 3: Add June Reviews

## Description

Add the two supplied App Store reviews to the homepage review grid, ordered newest-first.

## Decisions

- Add JackD_942 first because it is dated June 8, 2026.
- Add Djbindust second because it is dated June 3, 2026.
- Use a curated excerpt for the long JackD_942 review so the homepage grid stays scannable.
- Keep the shorter Djbindust review close to verbatim.
- Make `version` optional in the review footer because the screenshots do not show app versions.

## Planned Review Snippets

```text
BarrelBook Is the Whiskey Collection Tool I Didn't Know I Needed
JackD_942, Jun 8, 2026
```

```text
Well Thought Out
Djbindust, Jun 3, 2026
```

## Result

Added both reviews to `src/components/LandingPage.tsx` at the top of the homepage review grid. The JackD_942 review uses a curated excerpt focused on collection tracking, palate understanding, shelf management, and overall recommendation. The review footer now omits app version text when a review has no version supplied.
