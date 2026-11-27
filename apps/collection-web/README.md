# BarrelBook collection web

The independent Next.js application for the private collection pilot at https://app.barrelbook.app/. It has its own package lock, TypeScript configuration, build, and hosting root at `apps/collection-web`.

## Baseline behavior

Existing users sign in with their linked Google or email/password method. Admission is checked server-side using Firebase Auth, App Check, and the configured pilot allowlist. Account and plan checks use the existing services.

Collection opens in Grid and offers a Table toggle, search, filters, sorting, pagination, bottle details, and private photo galleries with zoom. Want and Tried lists can open linked owned bottles. Ask B.B. supports collection questions, follow-ups, and linked-bottle navigation under the account's existing eligibility and required consent. Conversations remain in browser memory and clear on refresh or session change.

The production pilot is read-only. Bottle editing code supports the separately qualified local and staging paths, with environment and server guards. The deferred iPhone save compatibility work and broader editing rollout require their own release qualification. Home, friends/shared shelves, public shelf links, and adding bottles from uploaded photos are future work.

## Development and checks

Use Node 24.12 or newer within the Node 24 release line. Run the following from this directory.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
node scripts/test-ask-bb-browser.mjs
```

The optimized browser runner requires Playwright from the repository root. Install root dependencies with `npm ci` and install the browser with `npx playwright install chromium`. The runner uses controlled Firebase responses and synthetic identities. It checks Collection, Lists, Ask B.B., session isolation, error handling, and photo navigation without real accounts or paid model calls. Screenshots are written under ignored `.cache/ask-bb-browser/`.

The marketing root excludes this application's sources from its TypeScript and lint passes. Run its own `npm run lint` and `npm run build` at the repository root when checking integration.

## Environment and hosting

Copy the blank `.env.example` to an ignored local environment file and populate configuration from the approved Firebase web application for the target project. Hosted builds require Firebase App Check. The production pilot access route also requires the existing server-side origin, admission, and Workload Identity Federation environment settings. Keep filled environment files and credentials outside Git.

The app uses session-limited Firebase Auth persistence, memory-only Firestore caching, authenticated private photo blobs, and owner-scoped bottle readers. The marketing site and collection app have independent Vercel projects. A source import or pull request does not itself qualify a new production deployment.

## Emulator and staging utilities

The local emulator workflow uses Auth on 9409, Firestore on 9480, and Storage on 9499. Firebase CLI and Java 21+ are required.

```sh
firebase emulators:start --project demo-barrelbook-web --only auth,firestore,storage
node scripts/local-fixture.mjs --seed
npm run dev:emulator
npm run test:emulator
```

The default `npm run dev:emulator` preview is read-only and uses Alice's populated sample collection. Bottle details direct users to the iPhone app. For explicit local edit qualification, use `npm run dev:emulator -- --edit`. The launcher sets the local edit option explicitly for each run.

The fixture adapter reads the eight retained prototype bottle images under `plans/sprints/2026-10-24-web-collection/prototype/public/bottles/` and imports the canonical editing handler from a sibling `../BarrelBook/functions/bottleEdits.js` checkout. That backend dependency is required for the local edit demo. The optimized synthetic browser suite is self-contained within this repository.

The staging helpers (`dev:staging`, `build:staging`, `start:staging`) read an operator-provided ignored `.env.staging.local`. They require the previously approved staging project and localhost origin. Live configuration, native testing, backend deployments, and production changes need explicit approval.

The Git import and verification record is in [baseline.md](../../plans/sprints/2026-11-27-collection-app-baseline/baseline.md).

## Local review adjustment · November 27, 2026

Goal: use Alice's populated emulator account to review the read-only pilot interface.

Implemented: default local editing is disabled, with an explicit `--edit` option for edit qualification. Hosted edit rules retain their existing gates. The collection badge and bottle detail actions follow the selected mode.

Verified: typecheck and lint passed, all 135 unit tests passed, and the optimized synthetic browser suite passed. Browser review signed Alice into 103 sample records, confirmed Grid and Read-only access, confirmed the iPhone management message with no Edit action, and opened, zoomed, and closed a photo back to Grid. The edit transport tests exercise explicit opt-in and reject default, false, or invalid edit options before any request. Independent review found no remaining issue.

The existing Next.js dependency advisory appeared during startup/build; retry completed. The advisory remains recorded in the baseline verification note. Next: review the populated read-only interface for the redesign.
