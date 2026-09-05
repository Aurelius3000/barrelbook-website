# Evidence

## Local Git checkpoint review: Sept. 5, 2026

- Pete approved review and a local commit with “lets proceed.” This does not approve a push, PR, merge, or deploy.
- Reviewed and staged 18 named paths: five production files plus 13 sprint/reference files. The earlier prototype is kept as a design record, not public release data.
- Production files: `src/lib/kbf-releases.ts`, `src/components/ReleaseRadar.tsx`, `src/app/releases/kbf-2026/page.tsx`, `src/app/releases/kbf-2026/[slug]/page.tsx`, and `src/app/sitemap.ts`.
- Sprint files: the eight Markdown files at this folder's top level, plus `prototype/design-qa.md`, `prototype/index.html`, `prototype/release.html`, `prototype/releases.js`, and `prototype/styles.css`.
- No app code changed during this commit pass. Only these approval and handoff notes changed. The reviewed site behavior and earlier browser/build results below still apply.
- Fresh `npx tsc --noEmit`, `npm run test:promo`, and `git diff --cached --check` passed. Staged content matched the working files. A focused secret-pattern scan found no matches; no environment files, keys, screenshots, dependencies, or build files are staged.
- Staged data still matches all 25 active master slots, one open slot, and four parked records. Related links use active picks only. The seven existing sitemap entries are unchanged.
- No blocker found in this local review. Live stock, remaining TBD facts, and production parity still need the launch checks below. The Git parent is `a8acc0c`; this pass did not refresh remote refs or change that base.
- Keep the original dirty checkout in place. The commit belongs only on `codex/kbf-release-radar`. Check the branch log for the resulting commit ID.

## Approved master sync: Sept. 5, 2026

Local build and QA passed. [Updated preview](http://127.0.0.1:4174/releases/kbf-2026).
No commit, push, merge, deploy, photo, or Meta change was made.

### Scope and result

- Pete approved the saved sync plan with “OK. let's adjust the website to reflect.”
- Updated the same five production files: `src/lib/kbf-releases.ts`, `src/components/ReleaseRadar.tsx`, `src/app/releases/kbf-2026/page.tsx`, `src/app/releases/kbf-2026/[slug]/page.tsx`, and `src/app/sitemap.ts`.
- The work stays in `codex/kbf-release-radar` at `/Users/petereilly2021/Projects/barrelbook-website-kbf-release-radar`. The original dirty checkout was not edited.
- The page now shows 25 named bottles in the exact master order and a separate open pick at 26. The old rank and tier fields, labels, and filter are gone.
- Retained 22 records. Added Phifer Pavitt LATE NIGHT, Jackson Purchase KBF, and Phifer Pavitt RESERVE. Parked Silk Velvet 140 hazmat, Dark Arts French oak, Thirty-One Lengths, and Dark Arts Oloroso. Silk Velvet 134 is active at no. 2.
- All 26 earlier detail URLs still work. The four parked pages show a banner and use noindex, follow. They stay out of active search, related links, ItemList markup, and the sitemap. The open pick has no page or result count.
- The active list has 9 Confirmed, 15 Reported, and 1 Watch. Sale plans are separate from post dates. Barrell stays only at no. 13; the fallback and flex slot remain unfilled.
- Sprint notes now reflect the completed sync. The prototype and earlier QA below remain history.

### Source decisions

- [Phifer Pavitt's brand press release](https://bevnet.com/pr/2026/09/01/phifer-pavitt-spirits-opens-late-night-and-reserve-for-public-sale-for-the-first-time) supports the two distinct bottles and festival sales. Both are Confirmed. The Thursday filter comes from that sale window, not the post plan. Exact sale hours, price, and KBF count stay TBD.
- [The Bourbon & Banter guide](https://www.bourbonbanter.com/the-ultimate-insiders-guide-to-the-2026-kentucky-bourbon-festival/) supports Jackson Purchase's cask-strength festival single barrel and the WhistlePig Vault name. Both stay Reported. Jackson's unknown specs and sale plan are visible.
- King of Kentucky's year remains unknown. No specs from another release were copied into it.
- Kept source-check dates separate from the roster update. New source checks use `2026-09-05T19:14:04Z`; retained facts keep their earlier dates. See `sources.md` for the checked facts and limits.

### Verification

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | Passed. |
| `npm run lint` | Passed with 0 errors and 6 warnings in unchanged files. |
| Focused ESLint on the five production files | Passed with no warnings. |
| `npm run build` | Passed, including a final build after the Jackson copy edit. All 29 detail pages are static. |
| `npm run test:promo` | Passed. |
| Data checks with Node type stripping | Exact match for all 25 master IDs and slots; open slot 26; 4 parked records; 87 active-only related links. |
| Invalid data checks | All 23 cases rejected: duplicate or missing slots, open-slot conflicts, bad slugs, sources, dates, status, days, and em dashes. |
| Desktop browser checks | All 34 checks passed for master order, filters, search, empty state, reset, metadata, and open-pick behavior. |
| Detail routes | All 29 return 200 with matching titles, canonical URLs, breadcrumbs, and 3 active related links each. All 26 earlier URLs remain usable. |
| Parked routes | All 4 show the parked banner and noindex, follow. |
| Invalid routes | Unknown bottle and fake flex URLs both return 404. |
| Sitemap and ItemList | 26 KBF sitemap URLs: index plus 25 active details. The 7 existing URLs remain. ItemList has exactly 25 named bottles. |
| Responsive and keyboard checks | All 13 checks passed. Index fits 320, 390, 768, 1024, and 1440 pixels. Skip link focuses main, focus outline is 2px, and phone filters work with the keyboard. |
| Every detail at phone and desktop widths | 87 checks passed across 320, 390, and 1440 pixels. No sideways scroll. |
| Application exceptions | None across the index and all 29 details. |
| Final file checks | `git diff --check` passed. Master table matches all 25 active IDs; all 19 local doc and screenshot links resolve. The five production files have no em dashes or trailing space. Git scope remains five production files plus sprint notes. |

Expected active filter counts: Thursday 2, Friday 4, Saturday 6, Sunday 6, Day TBD 17; Confirmed 9, Reported 15, Watch 1; KBF only 6, age 10+ 20, proof 120+ 11, age plus proof 9. Multi-day bottles can appear in more than one day filter. Unknown numbers do not match numeric filters.

Browser QA used the Playwright skill, its CLI, and a separate headless Chromium session named `kbfmaster`. The final local server uses port 4174. The user's other browser tabs were not used for tests.

### Screenshots reviewed

These local QA files are ignored by Git. They are not deploy assets.

- [Watchlist desktop](../../../output/playwright/kbf2026/master-watchlist-desktop.png), 1440 x 1024.
- [Open pick desktop](../../../output/playwright/kbf2026/master-open-pick-desktop.png), 1440 x 1024.
- [Watchlist phone](../../../output/playwright/kbf2026/master-watchlist-phone.png), 390 x 844.
- [Watchlist phone rows](../../../output/playwright/kbf2026/master-watchlist-phone-rows.png), 390 x 844.
- [Open pick phone](../../../output/playwright/kbf2026/master-open-pick-phone.png), 390 x 844.
- [New Phifer page desktop](../../../output/playwright/kbf2026/master-phifer-desktop.png), full page.
- [New Phifer page phone](../../../output/playwright/kbf2026/master-phifer-phone.png), full page.
- [Parked page desktop](../../../output/playwright/kbf2026/master-parked-desktop.png), full page.

### Known limits and next step

- Local Vercel Analytics still logs its expected script 404. The browser also logged a logo preload warning. The logo renders, and no app exception occurred. Existing analytics and logo loading were not changed to hide local warnings.
- King of Kentucky's year and other visible TBD facts still need source checks. The list does not prove live stock.
- Photos remain a separate pass with an exact bottle match and rights check. Meta posts and their approval state are unchanged.
- Review the preview and exact diff. Get separate approval before commit, push, or deploy. Recheck sources before launch. No automated monitor was created.

## Master match: Sept. 5, 2026

- Adopted Pete's latest list as `master-list.md`. It controls membership, social slots, parked picks, and approved swaps.
- Compared it with the current typed records: 22 matches, 3 new names, 4 parked records, and one open flex slot. Two matched names need a source check before public copy changes.
- New: Phifer Pavitt LATE NIGHT, Jackson Purchase KBF, and Phifer Pavitt RESERVE.
- Parked: Silk Velvet 140 hazmat, Dark Arts French oak, Dark Arts Oloroso, and Thirty-One Lengths. Silk Velvet 134 remains active at slot 2.
- Preserved the first four social slots and the proposed-lock state for later posts, as supplied by Pete. Meta state was not queried or changed.
- Flagged the Barrell fallback overlap at slots 9 and 13. No duplicate bottle or flex pick was added.
- Kept the social plan separate from bottle sale days. Saturday's Sugar Cane Rum post does not move its source-backed Sunday drop.
- Updated five sprint docs: master list, README, plan, loop, and this evidence file. No app code changed. No build was needed for this docs-only pass.
- Validation passed for all 26 slot numbers, 22 stable-ID matches, 3 new names, 4 parked entries, one flex slot, calendar dates, and doc links. Barrell appears once as a named pick. SHA-256 checks confirmed that all five production files stayed unchanged. `git diff --check` passed.
- The QA results below belong to the prior roster. They do not sign off the new roster before it is built and tested.

## Earlier build result: Sept. 5, 2026

The production build contains all 26 watchlist entries and a detail page for each one.
Local review: <http://127.0.0.1:4174/releases/kbf-2026>.
No commit, push, merge, or deploy was made in this build pass.

### Git scope

- Worktree: `/Users/petereilly2021/Projects/barrelbook-website-kbf-release-radar`.
- Branch: `codex/kbf-release-radar`.
- Base: fresh `origin/main` at `a8acc0c6334336f49f3fb96fe296cdecf9c5014e`.
- The original `barrelbook-website` checkout remains on its prior branch with its unrelated changes intact. No files from that dirty checkout were copied over except this approved sprint.
- Five production files changed: `src/lib/kbf-releases.ts`, `src/components/ReleaseRadar.tsx`, `src/app/releases/kbf-2026/page.tsx`, `src/app/releases/kbf-2026/[slug]/page.tsx`, and `src/app/sitemap.ts`.
- Sprint notes hold the approved plan, source context, and QA results. The prototype remains a visual reference only.
- No package, environment, Vercel, CTA, promo, deep-link, or analytics configuration changed.

### Content decisions

- Pete approved all 26 bottles. A named report is valid when the page labels it as Reported. This replaces the earlier source-ready-only gate recorded below.
- Source checks used KBF Distillers' Row, Larrikin's press release carried by The Bourbon Flight, Maker's Mark's 2026 specs, and Patrick Pho's Sept. 2 Bourbon & Banter guide.
- Labels: 7 Confirmed, 18 Reported, and 1 Watch. Each known spec links to its source. A confirmed bottle can still have reported facts or pending sale details.
- Keep King of Kentucky's release year and bottle sales unknown. The guide does not settle either point.
- Use 118.8 proof for the Oloroso pick. Separate its KBF specs from the guide's Dark Arts attribution.
- Larrikin's six barrels cover the full series, not each finish. Coal Pick's Sept. 8 reveal is not a sale day.
- Bluegrass weekend sales and Maker's Mark daily drops remain Reported. The three Larrikin sale days have a brand source.
- Keep unverified prices, counts, exact times, and booth locations as TBD. A festival pour does not prove bottle sales.
- Use short sentences and active voice. No em dashes appear in new page copy. No bottle photos were added.

### Checks run

| Check | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Passed. Lockfile unchanged. |
| `npx tsc --noEmit` | Passed, including a final check after source-label edits. |
| `npm run lint` | Passed with 0 errors and 6 warnings in unchanged files. |
| Focused ESLint on the five production files | Passed with no warnings. |
| `npm run build` | Passed twice. All 26 bottle pages are generated as static pages. |
| `npm run test:promo` | Passed. |
| `git diff --check` | Passed. |
| Data validation | 26 valid records. All 11 deliberately bad variants were rejected. |
| Local HTTP checks | All 27 URLs return 200. Unknown slug returns 404. Canonical URLs and JSON-LD are present. |
| Sitemap | All 27 KBF URLs plus the 7 existing URLs. |
| Final copy and evidence check | All five production files have no em dashes or trailing space. All five screenshot links resolve. Robots rules allow the new routes. |
| Desktop filter matrix | All 20 assertions passed. Counts, combined filters, search, and resets match the data. |
| Phone controls | Search, day filter, clear, and keyboard open/close passed. |
| Rendered detail pages | All 26 match their index title, have source sections and valid breadcrumbs, and link to 3 related bottles. No page exceptions. |
| Width checks | Index: 320, 390, 768, 1024, 1440. Every detail: 320, 390, 1440. No sideways scroll. |
| Keyboard and contrast | Skip link focuses main. Focus outline is 2px. The index text contrast check covered 405 text nodes; minimum ratio was 7.94:1. This is not a full accessibility audit. |

Data checks used Node's type stripping to import `src/lib/kbf-releases.ts` without changing package settings. Negative cases covered missing records, duplicate slugs, invalid ranks or statuses, missing check dates, bad source IDs, false Confirmed labels, conflicting or unknown sale days, and em dashes. Related-link checks covered all 78 links.

Browser QA used the Playwright CLI and installed Chromium. The initial default Chrome path was absent. An existing Chromium binary worked without an install. The visible browser changed pages during the first filter attempt, so final automated checks ran in a separate background session.

Expected filter counts: Friday 2, Saturday 4, Sunday 4, day TBD 20; Confirmed 7, Reported 18, Watch 1; top tier 18, second tier 8; KBF only 6, age 10+ 20, proof 120+ 13, age plus proof 10. Multi-day bottles appear on more than one day. Numeric filters exclude unknown values.

### Screenshots

Local QA files are under `output/playwright/kbf2026/`. Git ignores this folder. They are not deploy assets.

- [Watchlist desktop](../../../output/playwright/kbf2026/watchlist-desktop.png), 1440 x 1024.
- [Watchlist phone](../../../output/playwright/kbf2026/watchlist-mobile.png), 390 x 844.
- [Watchlist phone rows](../../../output/playwright/kbf2026/watchlist-mobile-rows.png), 390 x 844.
- [Bottle desktop](../../../output/playwright/kbf2026/detail-desktop.png), full page.
- [Bottle phone](../../../output/playwright/kbf2026/detail-mobile.png), full page.

### Known limits and follow-up

- Local Next.js does not serve `/_vercel/insights/script.js`, so the existing Vercel Analytics loader logs a local 404. No application exceptions occurred. Verify analytics on a Vercel preview before launch; do not remove the existing loader to hide this local warning.
- Existing lint warnings concern image tags in privacy/terms and fallback files, plus an unused disable comment in the shared Open Graph image. They are outside this change.
- No new App Store CTA, homepage link, correction form, event, or alert system was added.
- Review the local pages and exact diff. Recheck sources before publishing. Commit, push, and deploy still need approval.
- Choose an editor and update cadence. The build records check dates; it does not refresh sources on its own.

## Earlier prototype and source-pass history

The entries below describe the earlier state, before the all-26 build approval.

- 2026-09-05: Prototype initialized from the user-supplied Top 26 editorial watchlist.
- Release data is local mock data only. The intended source registry is KBF Distillers' Row, individual distillery announcements, and Bourbon Banter; primary source verification is required before publication.
- 2026-09-05: Browser-verified at 1440 x 1024 and 390 x 844. Day tabs, text search, tier/signal filters, clear behavior, detail navigation, and back links worked. Browser console had no warnings or errors.
- 2026-09-05: Fresh official KBF review confirms the Sept. 10–13 festival window and that Distillers’ Row barrel picks remain underway. This validates the confidence-aware model and blocks any claim that the data is final. Source: https://kybourbonfestival.com/distillers-row-series/
- 2026-09-05: Production plan drafted. No app code, public routes, assets, tracking, deployment, or content publishing was performed.
- 2026-09-05: Copied this sprint into the clean `codex/kbf-release-radar` worktree.
- 2026-09-05: Added `sources.md`. Seven records are source-ready. One is partial. Seventeen are on hold. One is a watch item.
- No public app files, routes, analytics, images, or deploy settings changed.
