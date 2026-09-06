# KBF 2026 Release Radar

Status: live on Sept. 6, 2026. PR #24 merged as `fdc7f19`. Vercel built production from that exact commit. Live route, menu, sitemap, app-association, and Google Analytics receipt checks passed. The pre-launch build, promo checks, typecheck, and 31 browser tests passed, with 8 expected skips. Only the real iPhone handoff check remains.

The live site shows Pete's 25 named bottles in master order, with slot 26 open. Four parked bottles keep their detail pages. The original checkout and its unrelated edits remain untouched.

Branch: `codex/kbf-release-radar`, based on `origin/main` at `a8acc0c`.
Worktree: `/Users/petereilly2021/Projects/barrelbook-website-kbf-release-radar`.
The original checkout and its unrelated edits remain in place.

[Live KBF radar](https://www.barrelbook.app/releases/kbf-2026) | [Live homepage](https://www.barrelbook.app/) | [Release PR](https://github.com/Aurelius3000/barrelbook-website/pull/24) | [Reviewed preview](https://barrelbook-website-q2i56h45c-pete-petereillycs-projects.vercel.app/) | [Master list and match-up](master-list.md) | [Plan](plan.md) | [QA and changed files](evidence.md)

## Goal

Build a useful KBF release page. It should show what we know, state what we do not know, and link to the source.

## Source of truth

[master-list.md](master-list.md) is the master for selected bottles, social slots, parked entries, and swaps. It replaces the old roster and tiers. Lucy's bank belongs to this one plan.

The typed records in `src/lib/kbf-releases.ts` drive the list and all 29 detail pages. They hold bottle facts and source-backed sale days. Social slots do not overwrite those days. [sources.md](sources.md) records the source checks.

The active list has 9 Confirmed, 15 Reported, and 1 Watch. The sync retained 22 records, added 3, and parked 4. List numbers are not quality ranks. The open pick has no bottle page and does not count as a search result.

The prototype stays here as a visual reference. It is not production content.

## Rules

- Cite KBF, brand, and named press sources. Mark reported facts as reported.
- Show unknown details as TBD.
- Do not use a product image without rights to use it.
- Do not add a Want List link or new KBF analytics event. The approved recovery restores existing live-site Android events only.

## Next step

Check an existing app link on a real iPhone. Desktop and phone-size browser checks pass, but they cannot prove that iOS opens the installed app. Google Analytics Realtime shows receipt for the live radar and LATE NIGHT detail page. These are QA visits, not a launch metric.

Keep future website changes based on fresh main. Production is deployment `dpl_6BX5RpYFtYYWZxKv2oWvqhUNnx8A` from merge commit `fdc7f190ccdf250d1f9eb46e8b86976fa0bbcbfc`. It used the existing production settings. No preview was promoted. No credential, environment, access, package, or app-source change was made during launch. The final QA receipt is a docs-only follow-up on the feature branch; it does not trigger another production build.

Keep `dpl_Baw2jeR53uJrANbfEUEAbY5FdSH2` as the rollback reference. A rollback needs approval. Meta and photos remain separate steps. Slot 26 and the Barrell fallback need an approved pick or swap. Source checks and updates are manual; no monitor or posting schedule was created.
