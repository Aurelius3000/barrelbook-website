# Collection app Git baseline

## Goal

Establish a reviewable source baseline for the existing collection app before redesign implementation.

## Source and scope

- Fresh base `origin/main` at `fa06887c783ba32bb9d26b49b70337160b752057`.
- Branch `codex/collection-app-baseline` in sibling worktree `barrelbook-website-collection-baseline`.
- Import the existing 49 app files from the verified November 15 backup `4fc55aa7ef601bf4a118ac09fd99a3fc71d71206`, which match the original checkout.
- Retain eight prototype bottle images referenced by the emulator and browser tests.
- Exclude the independent collection app from the root TypeScript and lint passes.
- Update the stale application README to describe Grid, Lists, Ask B.B., and the read-only pilot.
- Keep application runtime and tests byte-identical to the preserved baseline.

## Progress

The source import and local verification are complete. The draft PR is the review checkpoint before redesign work. All 199 recorded original checkout file hashes, its HEAD, and its dirty status match the pre-task fingerprint.

## Verification

Verified with Node 24.13.1.

- Collection `npm run typecheck` and `npm run lint` passed.
- Collection `npm test` passed 12 files and 131 tests.
- `node scripts/test-ask-bb-browser.mjs` passed its optimized build and synthetic browser acceptance suite, including Grid on opening and refresh, Table toggle, details/photos, linked Want/Tried bottles, Ask B.B., failure handling, and session isolation.
- Marketing root `npm run lint` passed with six warnings in unchanged source files. Marketing `npm run build` passed, generating 56 static pages.
- Staged whitespace checks passed outside the imported Firestore and Storage rule fixtures. Those unchanged fixtures retain 11 trailing-whitespace findings from the backup.
- The 48 imported app files other than the updated README match the backup byte-for-byte. Runtime source and tests have zero changes from that baseline.

The emulator-only integration suite was excluded by the existing `npm test` script. It requires the separate local Firebase emulator and backend setup. Live accounts were not part of these source-baseline checks.

## Existing dependency advisories

The initial collection build compiled and then stopped on a one-time Next.js security upgrade reminder. Repeating the command completed the build and browser suite with the reminder visible. A read-only `npm audit --json` reported 24 affected packages, including five high, 18 moderate, and one low. It reported Next.js 16.4.3 as affected with an available 16.4.6 update. The existing package manifests and lockfiles are imported unchanged. Dependency remediation needs review before a subsequent release.

An independent review found no blocking import issue and verified source equality, the exact 60-file scope, marketing isolation, and the original checkout fingerprint.

## Known local development dependency

The emulator edit adapter imports the canonical `bottleEdits.js` handler from the sibling BarrelBook backend repo. The eight photo inputs are included here. Emulator integration is a separate check requiring that backend, Firebase CLI, and Java.

## Next

Review the draft PR and dependency advisories. Approval to merge establishes the baseline on main before a separate redesign branch.
