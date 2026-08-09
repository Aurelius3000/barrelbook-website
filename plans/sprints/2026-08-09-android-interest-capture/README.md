# Android Interest Capture

**Status:** Google Form and private response Sheet created under `pete@petereilly.com`; website implementation and production release remain separately approval-gated.

**Outcome:** A visitor follows the website&apos;s Android early-access path to a published Google Form. Responses are retained in a private Google Sheet without changing iOS acquisition.

## Scope and boundaries

- The published Google Form requires email validation, 21+ confirmation, and affirmative Android-update consent; its linked response Sheet is owned by `pete@petereilly.com`.
- The website records only aggregate form-view/form-open events; it never sends email address data to website analytics.
- Existing App Store links, App Store analytics, and deep-link behavior remain unchanged.
- No campaign, confirmation, launch email, push, SMS, or webhook is activated by this work.
- The original dirty checkout remains untouched. This implementation is on clean branch `codex/android-interest-capture` from `origin/main` at `2339b6f`.

See [plan.md](plan.md), [acceptance.md](acceptance.md), and [evidence.md](evidence.md).
