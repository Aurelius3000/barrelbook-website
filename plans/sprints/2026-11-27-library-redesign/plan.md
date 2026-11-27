# BarrelBook web redesign
## Implementation plan and acceptance checklist · November 27, 2026

**First deliverable for Pete to review:** Open Alice’s local collection on a laptop, switch text size, browse the redesigned Library, open a B1 bottle detail, zoom a label, and return to the same bottle in the grid. Use real fixture photos and at least one long bottle name. Review this before staging. Bar Display has its own release decision.

| Milestone | Deliverable | Ready for the next step when |
| --- | --- | --- |
| R1 · Reading preferences | Responsive type, controls and account-scoped text size | Two browsers agree on the setting and two accounts remain independent |
| R2 · Library | Photo-led Grid, companion Table, summaries, filters and paging | Alice’s populated shelf and an empty shelf both pass browsing and accessibility checks |
| R3 · Bottle detail | B1 Spread, private gallery and return navigation | Collection, Lists and Ask B.B. each return to the correct place |
| R4 · Bar Display | Owner setup, rotating Showcase, Guest browse and controlled exit | A guest can browse the chosen shelf and the owner can recover the session on supported devices |
| Release | Separate owner-redesign and guest-display candidates | Each candidate has its own staging evidence, approval, production smoke and rollback target |

### Starting point and implementation boundaries

The collection app is under `apps/collection-web`. The baseline already has Grid/Table, search, sort, filters, owner-scoped photo reading, session checks, Want/Tried and Ask B.B. The current collection renderer reveals 48 records per step. The read model has quantity, status, proof, prices and photo references. Age statement and store-pick fields occur in the edit schema but are absent from the read model. Validate their canonical types against existing source and representative fixtures before using them.

Use the six handoff screens as references, the supplied palette and Apple system font, and reusable components in the web app. The canvas HTML depends on its own runtime. B1 is the selected detail. Keep Collection, Lists and Ask B.B. in pilot navigation. Bottle/list mutations, rating changes, pour logging, public sharing, new marketing routes and iOS changes remain separate workstreams. Bar Display targets free and paid members, subject to existing web admission during the pilot.

Before implementation, confirm the baseline PR and its exact commit. If still unmerged, agree the redesign branch base before starting a fresh implementation worktree. Keep the original marketing checkout and baseline PR separate from redesign work. Record the accepted plan, exact files and evidence in the implementation sprint. The complete design spans more than five files. Scope each implementation slice explicitly for approval, including any rules, backend or hosting work.

### R1 · Reading preferences

**Build.** Offer Standard, Large and Extra large with Large as the initial default. Use shared sizing variables and responsive layouts. Apply them across the owner’s Collection, Lists, Ask B.B., detail and related controls. Use the handoff’s type scale with readable body text of at least 17px on laptops, functional secondary text at least 15px, visible focus and 48px owner controls. Honor browser zoom and reduced motion.

Save only the selected enum to an owner-scoped web preference. Review the current storage rules and account-setting conventions before selecting a path. Prefer a narrow setting with field validation over granting general profile writes. Apply changes immediately. If saving fails, keep the chosen size for the session and offer an explicit retry with a visible unsaved state.

**Acceptance and tests**

- [ ] New account opens Large. All three settings work with keyboard and pointer and expose their selected state to assistive technology. A size change preserves the active tab, search and draft.
- [ ] Choose Extra large in browser A. Reload, then sign into the same account in a fresh browser B. Both show Extra large. An unrelated account with no preference opens Large. A late read from the first account cannot override the second.
- [ ] Unit and emulator tests cover missing and invalid values, denied access, failed save/retry and writes with unexpected fields. Anonymous users and a different UID cannot read or write the preference. Verify bottle and list data are unchanged.
- [ ] At 320 and 390 CSS pixels and at 200% desktop zoom, text wraps and controls remain reachable. At 1280×800 and 1440×900, verify hierarchy at each text size. Check focus, accessible names, contrast on the actual tile surfaces and no page-wide horizontal scroll.

### R2 · Library

**Build.** Keep Grid as the default, Table as a visible alternative, and existing search, advanced filters and sorting. Add single-select quick chips for All, Bourbon, Rye, Store picks, Unopened, Open and Five stars. Proposed behavior: All clears the quick chip within the selected collection scope. Archived records remain reachable through the existing status filter. Search and advanced filters narrow the selected result set. Present active restrictions together and offer Clear filters.

Start from the handoff’s Standard/Large/Extra large tile widths of 250/300/400px, name sizes of 19/23/28px, and photo heights of 230/280/340px. Allow a single tile to fit a narrower viewport. Use a 24px grid gap and a 1360px maximum content width. Give the full name first emphasis, then type, proof and status. Show readable rating or “Not rated yet,” a labeled secondary estimate, fill percentage, store-pick badge when recorded, quantity when greater than one, and a gallery count. Use the primary photo edge to edge and a quiet silhouette when unavailable.

**Proposed summary definitions.** Keep shelf totals stable while filtering and label the filtered count separately. For shelf totals use the active inventory status convention, explicitly documenting whether finished stock is counted. Proposed inventory totals count Opened and Unopened units. Count bottles and store picks by quantity. Sum known per-bottle secondary estimates × quantity. Show valuation coverage when partial and “No estimates yet” when none exist. Paging counts collection records because each record occupies one tile. Use explicit units where those counts differ.

**Acceptance and tests**

- [ ] At Large on a 1280×800 laptop, the first row of bottle photos is visible without scrolling. Compare a long name and an unrated bottle beside a priced bottle. Names wrap fully, prices remain secondary and no blank bands surround portrait photos.
- [ ] Grid and Table return the same IDs and ordering for the same query, chips and advanced filters. Exercise each chip, existing sort, combined filters, clear, zero results, incomplete loading, collection load failure/retry, and a genuinely empty shelf. Confirm “Open” maps to the stored Opened status.
- [ ] Check 0, 1, 24, 25, 48 and 49 matches. Initially reveal up to 24. Each press reveals the next 24 or the remainder, once each. Report “Showing X of Y” using matching records after loading completes. Search finds a match beyond the first rendered page. Preserve paging and scroll when returning from detail.
- [ ] Use fixtures with quantity >1, missing prices, null and zero values, legacy records, a store pick, archived/finished records, and photos that fail to load. Unit tests verify each summary against a hand-calculated result. Open a gallery from a tile to confirm the uncropped image is available.

### R3 · B1 bottle detail and return

**Build.** On wide screens put the primary photo and gallery entry on the left, with title, labeled Proof/Age/ABV/Est. value facts and supporting sections on the right. Stack in reading order on narrow screens. Prefer recorded age statements, including nonnumeric ones. Calculate US ABV from proof and show estimate versus MSRP only with valid inputs and a positive MSRP. Display rating, fill and owner notes as read-only. Retain “Manage bottle details in the iPhone app.” Use a visible Back control named for the originating surface.

**Acceptance and tests**

- [ ] A 100-proof bottle shows 50% ABV. A $172 estimate and $100 MSRP show +72%. Test below-MSRP and equal values, missing or zero MSRP, missing proof, unrated bottles, zero fill and long notes. Missing data never becomes a fabricated zero or a prompt to edit.
- [ ] Exercise zero, one and multiple photos, a non-first primary photo, portrait/landscape images, and a missing or inaccessible image. Every available photo opens with a correct count. Next, Previous, zoom and close work with the existing supported inputs. Closing the viewer restores the detail and focus.
- [ ] Enter from a filtered, expanded Grid, a sorted Table, Want, Tried and an Ask B.B. reference. Test visible Back and browser Back. Restore the list or grid position and triggering control, or the chat transcript, draft and position. Check the unavailable state for a deleted or inaccessible reference.
- [ ] Inspect browser requests across the complete flow. Opening details, viewing photos, and pressing Back issue no bottle/list writes or edit-service calls. Read back disposable fixtures before and after. Reuse existing Ask B.B. consent/access behavior and mocked answers in regression checks.

**Local review gate.** Capture the Library and B1 at Standard, Large and Extra large, plus a narrow layout. Record a short Alice walkthrough showing a long name, a multi-photo bottle, zoom, and return. Pete reviews the hierarchy and laptop density here. R1–R3 can ship together while R4 is still in development.

### R4 · Bar Display

**R4a · Guest access design and setup.** Establish a guest session with only the chosen bottles, allowed photo access and display fields. Define the owner-to-guest transition, expiry, revocation and recovery before wiring the Showcase. Confirm how the existing Firebase owner session and other app tabs are handled on a shared browser profile. A hidden navigation bar or a PIN dialog over an active owner workspace is insufficient. The promise covers BarrelBook access on the supported display setup. Device-wide kiosk lockdown requires a managed device. If isolation needs a new service, rules or session lifecycle, submit that exact design and file scope for approval before building it.

| Setup setting | Choices | Proposed default |
| --- | --- | --- |
| Shelf | Whole eligible shelf, opened only, hand-selected flight | Whole eligible shelf |
| Estimated prices and values | Hidden / Shown | Hidden |
| Owner ratings | Shown / Hidden | Shown |
| Rotation | 8 / 12 / 30 seconds | 12 seconds |
| Exit | Needs my PIN / Anyone | Needs my PIN |

Proposed defaults to confirm: set the PIN per display during setup, use owner reauthentication for forgotten-PIN recovery, and keep personal notes private. Omit archived and finished bottles in the first guest release. Preview the chosen settings before Start. A flight has an explicit bottle picker and requires at least one eligible selection. “Anyone” may end a display but should land on a signed-out or owner-authentication screen before private access.

**R4b · Showcase and browse.** Design for 1920×1080 and adapt to a 1024px landscape tablet. Showcase has a spotlight, up to six thumbnails, Pause/Resume, and entry to Browse. Picking a thumbnail pauses on that bottle. Browse offers Everything, Bourbon, Rye, Store picks, Open to pour and Five stars, Previous/Next paging and a dismissible fact card. Hide Five stars when ratings are hidden. Target ten tiles per page on a full-HD display and fewer on tablet to preserve 64px touch targets. Proposed inactivity timeout is 60 seconds in Browse. Honor reduced motion by starting paused and accept deliberate user playback. Full screen and wake lock are enhancements with a usable fallback.

**Acceptance and tests**

- [ ] With admitted free and paid fixtures, test preview/start for every setting, a single bottle, no eligible bottles, and a selected flight. Categories, counts, photos, thumbnails and fact cards use the same shelf and visibility rules. Notes, location, conversation history and out-of-scope bottles are absent from guest responses. Hidden prices and ratings cannot be inferred from filtering, labels or order.
- [ ] Test rotation with a controlled clock at 8, 12 and 30 seconds. Pause holds the bottle across multiple intervals. Thumbnail selection pauses. Resume advances once. Browsing resets the inactivity timer on touch and keyboard input. At the agreed timeout return to Showcase. Starting/stopping twice does not double the timer.
- [ ] Verify first/last pages, a partial page, every filter, empty results, tapping a fact card and closing back to the triggering tile. At full HD and 1024×768 all controls fit with no clipping or hover dependency. Verify on a touch device as well as with keyboard.
- [ ] In PIN mode exercise normal exit, incorrect PIN, retry limiting, correct PIN and signed-in-owner recovery. Check Back, Forward, refresh, Escape from full screen, another tab, direct owner URLs, expired/revoked access and sign-out. Private data and owner actions require restored owner authorization. Guest photo access ends according to the approved session lifetime.
- [ ] Test unavailable/denied full screen and wake lock, background/resume, connection loss and photo failure. Show accessible status and recover without revealing an owner page. No PIN, reusable owner credential or private guest payload appears in URLs, analytics, diagnostic logs or guest-accessible persistent caches.

### Verification, evidence and rollout

| Layer | What I will run | Evidence required |
| --- | --- | --- |
| Unit and service contracts | Extend collection, records, photo-viewer, lists, session and services suites. Add focused preference, summary and kiosk state tests as those features land. | Command output, deterministic fixtures and expected counts |
| Emulator | Use the documented local Firebase setup. Run existing owner-isolation tests and new preference/guest-scope cases with two owners and a signed-out session. | Allow/deny results and unchanged bottle/list fixtures |
| Optimized browser | Reuse the existing Ask B.B. runner. Add redesign scenarios against the optimized app for desktop, mobile, return paths, keyboard, failures and guest mode. | Browser results, selected screenshots and a short walkthrough |
| Accessibility and devices | Review tab order, visible focus, dialog dismissal and focus restoration, status announcements with VoiceOver, browser zoom, reduced motion and contrast. Exercise owner browsing in desktop Chrome and Safari and guest browsing on a touch tablet. | Device/browser versions and observed results. Distinguish physical devices from emulation. |
| Staging | Verify the exact candidate, both sign-in methods where configured, identity isolation, cross-browser preference sync, linked collection bottles, gallery and chat continuity. For R4, use consenting test accounts and the proposed guest access model. | Commit/deployment IDs, results by environment, redacted evidence and outstanding constraints |
| Production | After separate approval, deploy only the collection app to the existing pilot. Smoke-test authorized entry, Grid, Table, Lists, detail, photos, return and Ask B.B. access. Qualify guest setup/exit separately before making Bar Display available. | Candidate and rollback deployment IDs, production smoke and pilot audience verification |

From `apps/collection-web`, use Node 24 in the supported range and run:

```sh
npm run typecheck
npm run lint
npm test
npm run test:emulator
npm run build
node scripts/test-ask-bb-browser.mjs
```

Start the documented emulators and local fixture services before emulator checks. The existing browser runner uses controlled responses. Run the new redesign browser coverage explicitly and record its entry command in the sprint. Use staging for real integration checks. Any live paid Ask B.B. turn needs a current allowance. A provider unavailable in staging is an outstanding check for an environment where it is enabled.

Before each release, verify the diff contains the approved app and infrastructure paths, identify the previous deploy and run regression checks for any shared configuration touched, including the marketing homepage and Plans route. Keep kiosk enablement separate so an owner redesign rollback does not depend on changing admission. For broken admission, private-data exposure, incorrect owner writes or broken core navigation, stop rollout and restore the prior verified candidate through the approved process. If a guest service ships, verify its independent revoke/disable path. Save sanitized evidence and distinguish local, simulated, staging and live observations. Mark any failed, skipped or unverified required check as open.

**Approval sequence.** First approve the local owner experience and proposed data/display defaults. Review Alice’s Library and B1 together. Then approve staging and, after candidate review, the pilot rollout. Schedule Bar Display’s access design and device qualification as a separate milestone. No iOS release is required for the proposed owner redesign.
