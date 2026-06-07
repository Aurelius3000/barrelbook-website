# Task 5: Verify direct link

## Description

Verify that the direct asset URL works locally and that the video is not exposed through the sitemap or public navigation.

## Decisions

- Use `npm run lint` and `npm run build`.
- Use targeted local checks against the static URL and generated routes.

## Code Snippets

Verification passed:

```text
npm run lint
npm run build
npm run test:promo
```

Local production server check:

```text
GET /openai-approval/barrelbook-chatgpt-mcp-demo.mp4 -> 200 OK
Content-Type: video/mp4
X-Robots-Tag: noindex, nofollow, noarchive
```

Discovery checks:

```text
robots.txt contains Disallow: /openai-approval/
sitemap.xml does not contain openai-approval or barrelbook-chatgpt-mcp-demo
homepage HTML does not contain openai-approval or barrelbook-chatgpt-mcp-demo
```

Notes:

```text
npm run lint passed with four existing warnings unrelated to this change.
npm ci reported existing audit warnings: 4 moderate, 5 high.
```
