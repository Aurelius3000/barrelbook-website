# BarrelBook website: agent instructions

The public marketing site for the BarrelBook iOS app, built with Next.js 16 (App Router), React 19, TypeScript and Tailwind, and hosted on Vercel. It turns visitors into App Store installs and handles deep links into the app. Treat it as production: links, promo codes and analytics have real campaigns behind them.

Personal Git and approval rules live in the user-level files (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`). This file covers only this repo.

## How to work

- Clear, contained changes (copy, a page section, a bug fix, a new promo page that follows an existing one): state the approach and proceed.
- Ask first for: a redesign, a new dependency, new third-party scripts or pixels, changes to analytics events, redirects, deep-link or app-association routes, or anything that changes what an existing public URL does.
- Merging to `main` deploys to production (Vercel Git integration). Every PR gets a Vercel preview; use it to check visible changes. Merging needs Pete's approval.

## Layout

- `src/app/`: routes. Public pages (`/`, `/support`, `/privacy`, `/terms`, `/store-picks`, `/android`, `/releases/kbf-2026`), promo pages (`/p/[slug]`, plus short redirect routes such as `/blackshirt`), and app hand-off pages (`/scan`, `/collection`, `/bottles/[id]`, `/gift/[token]`, `/w/[token]`).
- `src/app/apple-app-site-association/` and `src/app/.well-known/apple-app-site-association/`: universal-link files for the iOS app. Changing them can break links into the app.
- `src/lib/`: shared logic. Use these instead of adding new wiring: `app-store.ts` (store links), `cta-analytics.ts` (CTA events), `promo-campaigns.ts` (promo pages and codes), `deep-link-landing-pages.ts`, `apple-app-site-association.ts`, `kbf-releases.ts`, `android-interest.ts`.
- `src/components/`: shared UI.
- `vercel.json`: permanent redirects, including App Store offer-code links. Never change or remove an existing redirect without approval; printed materials and campaigns point at them.
- Legal pages keep dated versions (`/privacy/2025-09-17`, `/terms/2025-09-17`). Add a new dated version rather than editing an old one.

## Rules that protect conversions

- Keep App Store CTA destinations, promo codes, campaign slugs, query parameters and analytics event names unchanged unless the task is to change them.
- GA4 is installed once in `src/app/layout.tsx`. New pages inherit it; never add another snippet. Custom events go through `cta-analytics.ts`, for meaningful actions only.
- Keep deep-link fallbacks working: a visitor without the app must land on a useful page with an App Store link.
- Keep the existing dark, bourbon-toned look and existing components. Use lucide-react for icons. Do not redesign pages you were not asked to change.
- Secrets and environment values stay in Vercel or local `.env*` files (gitignored). Never put them in code or commits.

## Checks

Run before every PR, from the repo root:

- `npm run lint`
- `npm run build`
- `npm run test:promo` when promo pages, codes, redirects or app-association files change
- `npm run test:e2e` (Playwright, starts the dev server) when pages, links or layout change. Some tests compare screenshots; update snapshots only when the visual change is intended, and say so in the PR.

For visible changes, include before and after screenshots or the Vercel preview link in the PR.

## Optional tooling

`plans/ralph.sh` and the `plans/sprints/` sprint format are available for multi-step work when Pete asks for them. They are not required for normal changes.
