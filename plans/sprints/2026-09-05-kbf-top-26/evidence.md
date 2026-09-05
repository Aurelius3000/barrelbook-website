# Evidence

## Homepage menu: approved Sept. 5, 2026

Pete approved this ten-file change, tests, commit, and feature-branch push. No merge or production deploy is approved.

1. Remove the link below the homepage intro. Add `KBF 2026` to the homepage menu, pointing to `/releases/kbf-2026` in the same tab.
2. Add a compact Menu control on phones and tablets. Keep it opt-in for the homepage so other shared headers retain their current behavior. Support keyboard use, Escape, and closing after a menu link is chosen.
3. Preserve the App Store and Android buttons, their destinations, and their tracking. Leave KBF data, routes, photos, and all other pages unchanged.
4. Change only `SiteHeader.tsx`, `LandingPage.tsx`, `tests/homepage.spec.ts`, its five existing screenshot baselines, this evidence file, and the sprint README.
5. Run typecheck, lint, build, promo tests, and the browser suite. Review the five updated baselines and check phone, tablet, desktop, keyboard access, and narrow-screen fit. Commit the exact reviewed scope, push only `codex/kbf-release-radar`, and check the new protected preview.

Preflight: the feature branch is clean at `2464112079b6c37a4aacc24a69efaf15b09fc43b`, matching its remote. Main remains `a8acc0c6334336f49f3fb96fe296cdecf9c5014e`. Production remains Ready deployment `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2`, with main as its production branch. The original checkout's status and diff hashes match the prior check. No production setting changed.

### Local checks

- The homepage now has `KBF 2026` in its header menu. Phones and tablets use the Menu control. The intro link is removed. Other pages do not opt into the phone menu.
- `npx tsc --noEmit`, `npm run build`, and `npm run test:promo` passed. Build output contains 56 static pages. Full lint passed with 0 errors and 6 existing warnings in unchanged files; focused lint passed.
- The full browser suite passed: 31 tests, 8 expected skips. It covers keyboard access to KBF, Escape with focus return, closing after a link choice or focus leaves, outside clicks, resizing, and the existing Android tracking checks. All 15 paired download groups remain covered.
- Reviewed all five updated screenshot baselines. Browser checks also confirmed the menu at 320, 390, 834, 1024, and 1440 pixels. The automated sweep includes 640 pixels. No horizontal overflow or control overlap appeared. Phone menu targets are at least 44 pixels tall. Both desktop and phone menus open the 25-bottle radar.
- Compared `/scan`, `/collection`, `/store-picks`, and `/android` with the prior reviewed preview at 1440 pixels. Titles, canonical links, text, headings, links, media, and CTA counts match. None gained a KBF link or phone menu.
- Only `LandingPage.tsx` and `SiteHeader.tsx` changed in app source. KBF records, index, detail pages, sitemap, download components, tracking helpers, assets, packages, and route files are unchanged.
- Browser reports stay in ignored `output/playwright/kbf-home-menu/`. No generated report or local configuration belongs in the commit.

### Issues found and test limits

The first run caught rem-based touch targets below 44 pixels under the site's 14-pixel root font. They now use a fixed 44-pixel minimum. WebKit's default link-tab shortcut is Option-Tab, confirmed in an isolated browser check; the tests now use that shortcut. A resize check also exposed an event timing issue. The handler now reads the event's breakpoint state, and the test waits for the closed state before resizing back.

Later full runs reached a blocked third-party development script at `https://va.vercel-scripts.com/v1/script.debug.js`. WebKit reported HTTP 403; Chromium reported `net::ERR_BLOCKED_BY_ORB`. The homepage test records these two exact debug-script failures as `external-check-limit` annotations. All other console and request error checks remain active. No production script, analytics helper, event payload, or environment setting changed. Hosted script loading still needs a separate check; these tests do not prove analytics delivery.

Next: stage and review the exact ten-file scope, commit, push only the feature branch, and check its new protected preview. The Playwright workflow supplied browser and screenshot checks. The Vercel checklist keeps publishing preview-only.

## Homepage link: preview passed on Sept. 5, 2026

Pete approved a homepage link, then the nine-file scope, tests, commit, and feature-branch push. Production remains out of scope.

Plan:

1. Add one `KBF 2026 Release Radar` link below the homepage intro. Use the existing brand colors, an arrow, and a clear keyboard focus state. Point to `/releases/kbf-2026` in the same tab.
2. Keep the existing App Store and Android button groups, destinations, and tracking. Add no analytics event. Leave all KBF data and routes unchanged.
3. Update `tests/homepage.spec.ts` to check the link and keyboard navigation. Review the five existing homepage screenshot baselines after refresh. Run typecheck, lint, build, promo tests, and the full browser suite. Check phone and desktop in the browser.
4. Change only nine files: `src/components/LandingPage.tsx`, the homepage test, its five existing screenshot baselines, this evidence file, and the sprint README. Review the exact staged diff, commit and push only `codex/kbf-release-radar`, then check the fresh preview. Stop before any merge or production deploy.

Preflight: clean feature branch at `07a72aa7a50853dd0485b25743b06163831ce348`, matching its remote. Main remains `a8acc0c6334336f49f3fb96fe296cdecf9c5014e`. Production remains Ready deployment `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2`. The original checkout's status and diff hashes match the prior recovery check.

The link is built and local checks pass. It sits below the intro copy, above the App Store rating. The existing button groups and their code remain intact. Only the new link text and destination differ in the homepage content comparison with the recovery preview.

- `npx tsc --noEmit`: passed.
- `npm run lint`: 0 errors, 6 existing warnings in unchanged files.
- `npm run build`: passed, 56 static pages.
- `npm run test:promo`: passed.
- Homepage test and screenshot refresh: 9 passed, 3 expected skips. All five refreshed images were reviewed.
- Full `npm run test:e2e` with the refreshed baselines: 25 passed, 5 expected skips. This includes keyboard navigation to the radar at desktop, tablet, and phone sizes, existing Android tracking tests, and all paired download links.
- Manual browser checks: the phone link opens the radar and shows 25 bottles. The homepage fits 320, 390, and 1440 pixels. Both download paths retain three homepage placements and their existing destinations. Phone and desktop screenshots were reviewed inline.
- KBF records, index, detail pages, sitemap, shared header, platform buttons, and tracking helpers are unchanged. No new event, source claim, image, or bottle was added.
- Browser reports and run artifacts stay in ignored `output/playwright/kbf-home-link/`. Test-only video hiding is unchanged. The live video renders in the local production build.

### Commit, preview, and handoff

- Committed the nine reviewed files as `efc5921faa3400843a6efaa34b3aba2c52f79929`, `feat(releases): link KBF radar from homepage`. Exact staged contents, whitespace, and focused secret-pattern checks passed. All 18 local doc links resolved. No local config or generated report was staged.
- Pushed only `codex/kbf-release-radar`. Vercel's Git integration created Ready preview `dpl_J8J7uuxVMJcVmSpoqgZn2eYPDtYX` for that exact commit and project. It has no production target.
- [Reviewed homepage preview](https://barrelbook-website-eiwysckys-pete-petereillycs-projects.vercel.app/). Normal sign-in worked in the existing browser. No auth bypass, access change, or manual deploy was used.
- Hosted checks passed at 390 and 1440 pixels: the link opens `/releases/kbf-2026` in the same tab with 25 bottles and one open pick. The hosted homepage matches the local build's text, headings, links, metadata, media, and CTA counts. There is no horizontal overflow at 1440 pixels and no old support warning.
- Reviewed the hosted phone and desktop screenshots. The homepage retains three App Store badges and three Android waitlist badges. The inspected radar logs have no errors or warnings. The browser viewport was reset, and the tab was left on the new homepage.
- Postflight: production remains Ready deployment `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2`; remote main remains `a8acc0c6334336f49f3fb96fe296cdecf9c5014e`. The original checkout's status and diff hashes still match preflight. The feature branch was clean and matched its remote after the source push.
- This follow-up receipt changes only the two approved sprint notes. Its reviewed app source remains `efc5921`. The Vercel checklist kept publishing preview-only; Playwright supplied keyboard, layout, screenshot, and regression checks.

Next: Pete's preview review. No merge or production deploy is approved. Bottle facts were not rechecked in this link-only pass. Existing source-freshness, live analytics, and real iPhone handoff checks remain launch gates.

## Recovery preview passed: Sept. 5, 2026

The confirmed production mismatch is fixed in the feature branch. Production and main remain untouched. Stop for Pete's review; no merge or production deploy is approved.

- Recovery commit: `950b351518c726a9a2686f09995a5c66f2a217f6`, `fix(site): recover live Android CTA changes before KBF`.
- Reviewed and committed 21 exact paths: seven production files, two tests, five existing test snapshots, and seven sprint notes. Staged contents matched working files. Whitespace and focused secret-pattern checks passed. All 19 local doc links resolved. No environment files, local config, generated reports, or unrelated source entered the commit.
- Pushed only `codex/kbf-release-radar`. The Git integration created the preview; no manual upload, project relink, or production command was used.
- [Reviewed KBF preview](https://barrelbook-website-eq83pfle4-pete-petereillycs-projects.vercel.app/releases/kbf-2026). Deployment `dpl_5krR4YUJ267ScdPxRBnR3kf3kYe9` is Ready. Its project, branch, and full Git SHA match the recovery commit. It has no production target.
- Normal sign-in carried over in the existing browser. No auth bypass, cookie export, share token, environment change, or protection change was used.

### Fresh hosted checks

| Check | Result |
| --- | --- |
| Existing site parity | All 12 pages match the live captures for title, canonical, visible text, headings, links, media, and CTA counts. No sideways scroll. Home has 3 paired badges; scan, collection, and store picks have 4 each. The old prominent warning is absent. |
| Master and metadata | Exact 25 slots in order, one open pick with no link, ItemList of 25, and the production canonical URL. |
| Detail pages | All 29 pass on the new deployment: title, canonical, known facts, gaps, sources, check date, and 3 active related links each. All fit the 532-pixel view. All four parked pages retain their banner and noindex, follow. |
| Phone filters | All six day counts pass. Search returns Phifer Pavitt 2, MAKERS 1, and parked Thirty-One 0. Status counts are 9 Confirmed, 15 Reported, and 1 Watch. Combined age/proof returns 9. Clear all restores 25 and the open pick. |
| Visual review | Reviewed the phone KBF index and desktop homepage inline. The phone homepage matches live at 390 pixels. The desktop homepage and KBF index fit 1440 pixels. Browser viewport reset; the tab remains on the reviewed KBF page. |
| Scripts and logs | One Vercel Analytics script on the KBF page. No errors or warnings in the inspected KBF logs. Google Analytics stays absent under the existing preview scope; no setting changed. |

All earlier local tests still apply to this exact source. Event payload tests use local capture, not analytics dashboard receipt. Real iPhone handoff, production event receipt, hosted sitemap XML, and source freshness remain the limits described below. No form, offer, gift, or App Store action was submitted during hosted QA.

### Preservation and handoff

- Production postflight: Ready deployment `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2`, unchanged before and after the feature push. Retain it as the rollback reference.
- Remote main remains `a8acc0c6334336f49f3fb96fe296cdecf9c5014e`. The feature branch matched its remote and was clean after the source push.
- The original dirty checkout's status, staged diff, and unstaged diff hashes match preflight. No branch switch, reset, stash, merge, PR, or production deploy was made.
- The five KBF source files remain unchanged. Photos, Meta posts, bottle facts, and the open pick remain outside this recovery.
- Generated test reports were preserved under ignored `output/playwright/kbf-recovery-reports.QzcX45/`. They are not release assets.
- This five-file follow-up QA receipt changes sprint notes only. Its reviewed source is commit `950b351`; later docs-only branch builds do not change that app source.
- The Vercel deploy checklist kept all publishing preview-only and preserved normal sign-in. The Playwright workflow supplied local test and screenshot checks; the existing browser supplied signed-in parity evidence.

## Approved recovery: local checks passed on Sept. 5, 2026

Pete approved recovery, tests, commit, and feature-branch push with "proceed." Main and production remain out of scope. The full plan and file list are in `plan.md`.

- Starting KBF commit: `6202bb4`. The five dirty sprint notes at preflight were from this task; no app code was dirty before recovery.
- Fresh Vercel preflight: live deployment remains `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2`, Ready. The project still uses main for production.
- Recovered the seven production files and two tests from successful Aug. 23 patches. Matched the saved final diff and file list. Failed attempts were skipped. Historical commands were read as data, not run. No local Vercel configuration, environment file, or old sprint file was copied.
- Source record: saved session `01a02f0a-3548-7360-9924-045c40b659dc`, Aug. 23. Recovery includes the final badge styling, grouping selectors, and tracking tests, not just the first patch.
- The five KBF source files are byte-for-byte unchanged from `6202bb4`. Promo, gift, support, AASA, layout, package, and environment files are unchanged.

### Local verification

| Check | Result |
| --- | --- |
| Typecheck and focused ESLint | Passed; no focused lint warnings. |
| Full lint | Passed: 0 errors, 6 pre-existing warnings in unchanged files. |
| Production build | Passed: 56 static pages, including all 29 KBF details. |
| Promo tests | Passed. |
| Browser tests without snapshots | 22 passed, 5 expected skips. |
| Homepage baseline refresh | 6 passed, 3 expected skips. All five changed images reviewed at desktop, tablet, and phone sizes. |
| Full browser tests with snapshots | 22 passed, 5 expected skips. |
| Live/local page comparison | All 12 pages match: home, scan, collection, store picks, Android, support, privacy, terms, and four promo pages. Compared title, canonical, text, headings, links, images, videos, and CTA counts. Only the image deployment cache key was ignored. |
| Responsive comparison | The four main pages match live at 1440 pixels with no sideways scroll. The homepage also matches at 390 pixels. All 12 pages fit the default 532-pixel view. |
| KBF smoke check | Exact 25 master slots, one open slot, expected title, and no sideways scroll at 1440 pixels. All five KBF files match the earlier tested commit. |
| Whitespace | `git diff --check` passed. |

The restored tests capture events locally. They check all 15 paired CTA groups across four pages and retain the homepage download event without double-counting. No live form, offer, App Store, or gift action was submitted. These tests do not prove analytics dashboard receipt.

The standalone Playwright CLI could not load its uncached package because of sandbox DNS. No dependency was installed. The repository's browser suite passed; manual parity checks used the existing browser. Reviewed screenshots appeared inline. Generated HTML reports stay local and are not staged.

The later source commit and hosted preview checks above close this local checkpoint. No merge or production deploy is approved.

## Historical launch blocker: live-only changes missing from Git

The KBF pages pass, but this branch is not safe to launch yet. A final live comparison found production changes that are absent from current main and this preview.

| Homepage behavior | Live production | KBF preview |
| --- | --- | --- |
| Android waitlist badges | 3 links labeled Join the BarrelBook Android waitlist | No matching badges; one older Join Android early access link |
| Prominent 1.7.3 warning | Removed | Present |
| App Store destination | App ID `6751737898` | Same |

- Verified both homepages in the browser. This is current UI evidence, not a conclusion from old notes alone.
- Vercel metadata for live deployment `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2` reports branch `codex/android-waitlist-platform-parity`, base SHA `a8acc0c6334336f49f3fb96fe296cdecf9c5014e`, and `gitDirty: 1`. This confirms that its uploaded source included uncommitted changes.
- Remote main still points to that base SHA. The local parity branch also points to it. The KBF commit sits directly above that base. A clean branch and a matching main revision did not capture the extra files used for the live deploy.
- Current KBF source lacks `PlatformDownloadCtas` and `android_waitlist_cta_clicked`; `LandingPage.tsx` still contains the old warning and single Android link.
- The prior release record identifies `/private/tmp/barrelbook-website-android-waitlist-parity` as the upload source. That folder remains, but its Git link and `src/components/PlatformDownloadCtas.tsx` are absent. Do not assume that folder is a complete recovery source. Recover and inspect the full change set before copying anything.
- Launching this preview unchanged would undo at least the two live UI fixes above. The full live-only diff still needs review, including its tracking and tests.

Proposed next scope at discovery, since approved by Pete:

1. Recover and review the source changes used for the current live deployment. Preserve existing worktrees and all KBF work.
2. Add the live homepage, Android CTA, and tracking fixes to `codex/kbf-release-radar`. Restore their tests. This exceeds the current five-file KBF scope and affects conversion code, so it requires approval.
3. Run typecheck, lint, build, promo and browser tests. Commit and push only the reviewed files if approved. Check a fresh preview against both production and the KBF master before requesting any merge or launch.

No production change, code fix, new commit, push, PR, or merge was made after finding this blocker. The earlier hosted results below remain valid for the KBF feature itself.

## Signed-in hosted page QA: Sept. 5, 2026

- Pete completed normal Vercel sign-in. Checked the existing preview in the signed-in browser. No cookie export, auth bypass, access change, or new deploy was used.
- The preview still serves commit `6202bb42131b4665be040933a6567c868469f9ca` from `codex/kbf-release-radar`. Deployment `dpl_9SdR1UeJX74kj7bzGwgayQLC18Tz` remains Ready.

| Hosted check | Result |
| --- | --- |
| Master list | All 25 named bottles match the master order. Slot 26 is separate and has no link. ItemList has 25 entries. Canonical URL uses `www.barrelbook.app`. |
| Sale-day filters | Passed: Thu 2, Fri 4, Sat 6, Sun 6, Day TBD 17, All 25. The open pick is hidden during filtering. |
| Search | Passed: Silk Velvet 1, Dark Arts 2, Phifer Pavitt 2, MAKERS 1, cuvee 1, Thirty-One Lengths 0. The empty state and Show all 25 reset work. |
| Other filters | Passed: Confirmed 9, Reported 15, Watch 1; KBF only 6, age 10+ 20, proof 120+ 11, age plus proof 9. Clear all restores the full list. Desktop search also passed. |
| Detail pages | All 29 render with the expected title, canonical URL, check date, known facts, gaps, sources, and BreadcrumbList. Each has 3 active related links, 87 in total. |
| Parked pages | All 4 show the parked banner and `noindex, follow`. They stay out of active search and related links. |
| Missing pages | Fake flex and unknown bottle URLs show the 404 page and noindex. This browser check confirms rendering, not the HTTP status. Local HTTP checks passed earlier. |
| Phone and desktop | Index has no sideways scroll at 320, 390, and 1440 pixels. All 25 active details fit 1440; all 4 parked pages and the 3 new details fit 390. Mobile filters work. The skip link focuses `radar-content`. |
| New bottle facts | The two Phifer pages retain distinct ages, proofs, and finishes. Sale hours stay TBD. Jackson Purchase keeps unknown age and numeric proof visible. |
| Existing pages and links | Home, scan, collection, Android, and the FNF and Bourbon Trail promo pages render. `/fnf` and `/thebourbontrail` reach their existing `/p/` routes. App Store links still use app ID `6751737898`. Android retains its Google Form link. |
| Gift fallback | A dummy test path renders the gift page, correct app link, and `noindex, nofollow`. No user gift token was used. No App Store, redeem, app-open, or form-submit control was clicked. |

Screenshots were reviewed inline for the phone index and filters, desktop index and first detail page, and a parked phone page. No new screenshot files were added. The browser viewport was reset, and the tab was left on the KBF index.

### Tracking and test limits

- The KBF page has one Vercel Analytics script element. No warnings or errors appeared in the inspected KBF browser logs. The logo renders and reports a loaded image. This does not prove event receipt in an analytics dashboard.
- Google Analytics does not load on this branch. A read-only settings check explains why: `NEXT_PUBLIC_GA_MEASUREMENT_ID` applies to production, development, and the `codex/website-redesign` preview branch only. It does not apply to `codex/kbf-release-radar`. No environment values were printed or saved, and no setting changed.
- `BARRELBOOK_AASA_APP_IDS` is production-only. Actual iPhone universal-link handoff and analytics event delivery remain launch checks. Existing tracking helpers, CTA destinations, and app-association source code are unchanged.
- The browser refused `/sitemap.xml` with `net::ERR_BLOCKED_BY_CLIENT`. Hosted XML was not verified. The same code passed the earlier local sitemap check. No alternate access method or protection bypass was used.
- Bottle sources were not rechecked in this hosted QA pass. Visible TBD facts and live stock remain source-check work before launch. Photos and Meta posts remain separate.

### Postflight and handoff

- Remote main remains `a8acc0c6334336f49f3fb96fe296cdecf9c5014e`; the feature branch remains `6202bb4`. Production remains Ready deployment `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2`, unchanged from the pre-push check.
- Only the five already-dirty sprint notes changed: README, acceptance, evidence, loop, and master-list. No app code changed. No new commit, push, PR, merge, or production deploy was made.
- `git diff --check` passed, and all 18 local links in the five notes resolve. No rebuild was needed for these docs-only edits. The index is empty; the notes remain uncommitted.
- The Vercel deploy checklist kept hosted QA separate from production approval and preserved preview protection. The final production comparison then found the launch blocker above. Resolve it under an approved expanded scope before preparing a merge or launch.

## Feature-branch push and protected preview: Sept. 5, 2026

- Pete approved pushing the feature branch and preparing a Vercel preview with “yes.” No PR, merge, or production deploy was requested.
- Pushed `6202bb42131b4665be040933a6567c868469f9ca` to `origin/codex/kbf-release-radar` with `git push -u origin codex/kbf-release-radar`.
- Remote `main` remained `a8acc0c6334336f49f3fb96fe296cdecf9c5014e` before and after the push. The reviewed commit is based on that same main revision.
- Checked the live Vercel project before pushing: `barrelbook-website`, project `prj_INbcZxxkEQg6O4CqkLEptDE3K1qp`, team `team_HnY2wuONsG0zAfCLX8of7yUJ`. Its Git link is `Aurelius3000/barrelbook-website`; production branch is `main`.
- The existing Git integration created one preview for the push. No separate CLI upload, project creation, project relink, environment change, or access-setting change was needed.
- Preview: [KBF watchlist](https://barrelbook-website-848wt6j74-pete-petereillycs-projects.vercel.app/releases/kbf-2026). [Vercel deployment](https://vercel.com/pete-petereillycs-projects/barrelbook-website/9SdR1UeJX74kj7bzGwgayQLC18Tz).
- Deployment ID: `dpl_9SdR1UeJX74kj7bzGwgayQLC18Tz`. Vercel inspect reports target Preview and status Ready. The deployment API confirms the correct project, Git branch, and exact commit SHA. GitHub's Vercel status is Success.
- A read-only request to the KBF preview returned HTTP 302 to Vercel SSO. The in-app browser reached the Vercel login page. This confirms that protection is active, not that the KBF page works after sign-in.
- Hosted checks are pending: list/detail rendering, filters, existing route behavior, App Store links, and analytics. The earlier local checks passed. Normal Vercel sign-in is needed to finish the hosted checks. No auth bypass, shared-access link, or security change was used.
- Production postflight passed: `www.barrelbook.app` still points to Ready deployment `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2`, the same deployment recorded before the push.
- The branch was clean and matched its remote after the push. These follow-up sprint notes are local and uncommitted. No app code changed in this pass.
- Tooling note: sandbox DNS blocked the first Git read, and the Vercel CLI updater hit a cache-write restriction. Approved network reads worked. No CLI update was installed. The Vercel deploy skill kept the release scoped to a preview; Playwright page checks remain behind the sign-in step.

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
