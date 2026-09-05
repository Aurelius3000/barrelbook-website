# Production implementation plan

## Current master update: website sync complete locally

Pete supplied a new master social list on Sept. 5. [master-list.md](master-list.md) records all slots and the match against the build. It now controls membership and order.

The match found 22 retained records, 3 new names, 4 parked records, and an open slot 26. These are 25 named bottles, not 26. The social order is not a quality rank or a sale schedule.

The approved code plan is in `master-list.md`. It covers the same five production files, keeps social slots separate from sale days, preserves existing bottle IDs, and avoids a duplicate Barrell fallback. Pete approved the website sync on Sept. 5. Implementation and local QA passed.

The build now has 25 active bottles, one open pick, and four parked detail pages. All 29 detail URLs work. Only active bottles enter filters, related links, the ItemList, and the sitemap. Public ranks and tier labels are gone. The two Phifer Pavitt entries have brand sources. Jackson Purchase and the WhistlePig Vault name use the guide and stay Reported. King of Kentucky's release year stays TBD.

The plan below records the earlier build. Its fixed count and rank/tier rules do not override the new master.

## Earlier approved build: all 26

Pete approved all 26 bottles as a watchlist, with a page for each bottle.
This replaces the first plan's primary-source-only launch gate.

1. Keep one typed record per bottle. Preserve the user's rank and tier.
2. Label KBF status as Confirmed, Reported, or Watch. Cite each known fact.
3. Show unknown facts as TBD. A reported drop day must keep its source label.
4. Build the index, search, day filters, and shared detail view from these records.
5. Add all 27 watchlist URLs to the sitemap. Add page metadata and list/breadcrumb markup.
6. Check the data during the build. Test filters, all detail routes, 404s, and mobile layout.

Files: `src/lib/kbf-releases.ts`, `src/components/ReleaseRadar.tsx`,
`src/app/releases/kbf-2026/page.tsx`, `src/app/releases/kbf-2026/[slug]/page.tsx`,
and `src/app/sitemap.ts`. Sprint docs hold the plan and QA results.

Copy: short sentences, active voice, plain words, no em dashes. Keep the approved layout.
Use existing brand assets and Tailwind styles. Use no bottle photos for this version.
Run typecheck, lint, build, promo checks, and browser checks. Prepare a local review.
Commit, push, merge, and deploy remain separate steps.

## Earlier build outcome

Build BarrelBook Release Radar at `/releases/kbf-2026`. Each of the 26 bottle pages shares a record with the watchlist. The list shows our picks, not every KBF release or live stock.

## Earlier build content rules

1. Keep the user's rank and tier. Use the source-backed bottle name.
2. Cite KBF, a brand, or a named report. Keep the source on each known fact.
3. Track the KBF status and sale-day status as separate claims.
4. Show gaps as TBD. Do not infer a price, count, sale time, or booth.
5. Keep bottle count and barrel count separate. A reveal date is not a sale day.
6. Use no bottle photos in this version. A later photo needs rights and an exact bottle match.

## Earlier build scope

1. Validate the 26 records at build time. Reject duplicate slugs or ranks, bad source links, missing check dates, bad status values, and conflicting days.
2. Build the two routes from shared data. Add page titles, descriptions, canonical URLs, and a real 404 for unknown slugs.
3. Keep the approved layout: rank, specs, source labels, day filters, search, updates, and related bottles.
4. Add the index and all 26 details to the sitemap. Use `ItemList` and `BreadcrumbList`. Make no stock or Offer claim.
5. Leave App Store CTAs, promo routes, deep links, and analytics unchanged.

## Launch follow-up

- Choose an editor and a source-check schedule through Sept. 13. This build does not create an automated monitor.
- Record each fact change, source, and UTC check date in the bottle record. Keep the edit history in Git.
- Recheck sources before launch. Update old facts and keep unresolved details visible.
- Review the exact Git diff before commit and push. Get separate approval for those steps and for deploy.
- Decide later on a correction link, homepage link, App Store CTA, and any new analytics. None are in this build.

## Verification for the current master

- Run `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm run test:promo`.
- Check valid data and deliberately bad records.
- Check the index and all 29 detail URLs, the 404, sitemap, page metadata, and structured data. Preserve all 26 earlier detail URLs. Keep the four parked pages out of the sitemap and mark them noindex, follow.
- Match all 25 active slots to the master. Check the explicit open slot, parked bank, neutral numbers, and absence of internal post times.
- Test filters alone and together. Check empty states, reset, keyboard controls, source links, and mobile widths.
- Save desktop and phone screenshots. Record results in `evidence.md`.

## Explicitly out of scope

- Global `/releases` taxonomy or future events such as BTAC.
- Live inventory, secondary pricing, checkout, reservations, maps, or pushed alerts.
- A Want List deep link, account-authenticated state, or user-generated rankings.
- Automated content scraping or content syndication.
