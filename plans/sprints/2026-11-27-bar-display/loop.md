# Repeat local review

Use the collection app’s Node 24 runtime, the loopback emulators and the existing Alice fixture. With `BB_LOCAL_WEB_PORT=4187 npm run dev:emulator` running, use that same port for each browser test. Inspect the generated screenshots under `apps/collection-web/.cache/bar-display/`. Keep any further change local until Pete authorizes the next Git or hosting action. If the account, fixture count or origin differs, record the discrepancy before interpreting results.
