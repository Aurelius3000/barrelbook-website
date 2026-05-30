#!/usr/bin/env bash
# Claude Code CLI adapter for RALPH.
#
# Invokes the `claude` CLI with the sprint context as a single prompt. The
# CLI is expected to be on PATH (install docs:
# https://docs.claude.com/en/docs/claude-code/overview).
#
# Usage (called by ralph.sh / ralph_once.sh):
#   ./plans/adapters/claude_code.sh <sprint_dir>
#
# Environment:
#   CLAUDE_BIN       override the `claude` binary (default: claude)
#   CLAUDE_MODEL     optional model override passed via --model
#   CLAUDE_EXTRA     extra args forwarded to claude (space-separated)
#
set -euo pipefail

SPRINT_DIR="${1:-}"
if [[ -z "$SPRINT_DIR" || ! -d "$SPRINT_DIR" ]]; then
  echo "Usage: $0 <sprint_dir>" >&2
  exit 1
fi

CLAUDE_BIN="${CLAUDE_BIN:-claude}"
if ! command -v "$CLAUDE_BIN" >/dev/null 2>&1; then
  echo "Claude Code CLI not found on PATH as '$CLAUDE_BIN'." >&2
  echo "Install: https://docs.claude.com/en/docs/claude-code/overview" >&2
  exit 127
fi

GENERIC_PROMPT="$(dirname "$0")/../ralph_prompt.md"
SPRINT_PROMPT="$SPRINT_DIR/prompt.md"
PRD_FILE="$SPRINT_DIR/prd.json"
PROGRESS_FILE="$SPRINT_DIR/progress.txt"

# Build the prompt the agent sees this iteration.
read -r -d '' PROMPT <<EOF || true
You are RALPH. Read the files below and perform exactly ONE iteration of the
sprint loop as described in the generic prompt. Follow the sprint-specific
prompt's verification command and constraints. Do not bundle multiple items.

=== GENERIC PROMPT (plans/ralph_prompt.md) ===
$(cat "$GENERIC_PROMPT")

=== SPRINT PROMPT ($SPRINT_PROMPT) ===
$(cat "$SPRINT_PROMPT")

=== CURRENT PRD ($PRD_FILE) ===
$(cat "$PRD_FILE")

=== CURRENT PROGRESS ($PROGRESS_FILE) ===
$(cat "$PROGRESS_FILE")

Sprint directory (absolute path on this machine): $(cd "$SPRINT_DIR" && pwd)
Repo root: $(cd "$SPRINT_DIR/../../.." && pwd)

Begin.
EOF

ARGS=(--print --permission-mode acceptEdits)
if [[ -n "${CLAUDE_MODEL:-}" ]]; then
  ARGS+=(--model "$CLAUDE_MODEL")
fi
if [[ -n "${CLAUDE_EXTRA:-}" ]]; then
  # shellcheck disable=SC2206
  EXTRA_ARGS=(${CLAUDE_EXTRA})
  ARGS+=("${EXTRA_ARGS[@]}")
fi

printf '%s' "$PROMPT" | "$CLAUDE_BIN" "${ARGS[@]}"
