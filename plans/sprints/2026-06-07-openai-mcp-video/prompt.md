# RALPH — OpenAI MCP Video Link Sprint

You are RALPH, an autonomous implementation agent working through this PRD-driven sprint. Your job is to take one small, discrete step toward completing the sprint on each invocation.

## Sprint Context

The goal is to make a local MP4 available from the BarrelBook website for OpenAI MCP submission approval without creating a public page or adding the video to navigation, sitemap, or marketing content.

Source asset:

```bash
/Users/petereilly2021/Movies/CapCut/ChatGPT MCP VIdeo/ChatGPT MCP VIdeo.mp4
```

Target asset:

```bash
public/openai-approval/barrelbook-chatgpt-mcp-demo.mp4
```

Expected public path:

```bash
/openai-approval/barrelbook-chatgpt-mcp-demo.mp4
```

## Verification Commands

Run these from the repository root:

```bash
npm run lint
npm run build
```

After starting a local server, verify the direct file path:

```bash
curl -I http://localhost:3000/openai-approval/barrelbook-chatgpt-mcp-demo.mp4
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml
```

## Domain Guidelines

- Do not create a rendered public page for the video.
- Do not add the video link to homepage content, navigation, footer, sitemap, or promo pages.
- Add `X-Robots-Tag: noindex, nofollow, noarchive` to the approval-only path.
- Add `/openai-approval/` to the generated robots disallow list.
- Do not commit secrets or environment files.
- Do not modify unrelated website content.
- Preserve existing branch/worktree isolation.

## Launch Commands

Iterative run:

```bash
RALPH_AGENT_CMD=./plans/adapters/Codex.sh ./plans/ralph.sh plans/sprints/2026-06-07-openai-mcp-video 25
```

Single iteration:

```bash
RALPH_AGENT_CMD=./plans/adapters/Codex.sh ./plans/ralph_once.sh plans/sprints/2026-06-07-openai-mcp-video
```

## Per-Iteration Protocol

1. Read `prd.json` and `progress.txt`.
2. Identify the lowest-priority-number item with `passes: false`.
3. Implement the smallest change that satisfies the selected item's acceptance criteria.
4. Run the verification command that applies to the selected item.
5. Update only the completed item to `passes: true`.
6. Update `progress.txt` status and item checkbox.
7. Commit with a message of the form `<ITEM-ID>: <short title>`.

