# Summary

## Files Added / Modified

- Added `public/openai-approval/barrelbook-chatgpt-mcp-demo.mp4`.
- Modified `next.config.ts` to add `X-Robots-Tag: noindex, nofollow, noarchive` for `/openai-approval/:path*`.
- Modified `src/app/robots.ts` to disallow `/openai-approval/`.
- Added sprint files in `plans/sprints/2026-06-07-openai-mcp-video/`.
- Added task logs in `.claude_tasks/2026-06-07_11-52-11/`.

## Overview

The ChatGPT MCP demo video is available by direct link without adding a public page, navigation item, footer link, or sitemap entry. The approval-only path has both robots.txt exclusion and an `X-Robots-Tag` response header.

Hosted link:

```text
https://barrelbook-website-openai-mcp-video-4nubsyb5d.vercel.app/openai-approval/barrelbook-chatgpt-mcp-demo.mp4
```

Production path after merge/deploy:

```text
https://www.barrelbook.app/openai-approval/barrelbook-chatgpt-mcp-demo.mp4
```

## Verification

- `npm run lint` passed with four existing warnings unrelated to this change.
- `npm run build` passed.
- `npm run test:promo` passed.
- Local production server returned `200 OK`, `Content-Type: video/mp4`, and `X-Robots-Tag: noindex, nofollow, noarchive` for the direct MP4 path.
- Local robots output includes `Disallow: /openai-approval/`.
- Local sitemap and homepage output do not contain the approval path or MP4 filename.

## Next Recommended Steps

- Share the hosted deployment link with OpenAI for MCP approval.
- Merge/deploy the branch if the approval video should live under `www.barrelbook.app`.
