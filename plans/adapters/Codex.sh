#!/usr/bin/env bash
# Codex CLI adapter for RALPH.
#
# Usage (called by ralph.sh / ralph_once.sh):
#   ./plans/adapters/Codex.sh <sprint_dir>
#
# Environment:
#   CODEX_BIN       override the `codex` binary (default: codex)
#   CODEX_MODEL     optional model override passed via --model
#   CODEX_EXTRA     extra args forwarded to codex (space-separated)
#
set -euo pipefail

SPRINT_DIR="${1:-}"
if [[ -z "$SPRINT_DIR" || ! -d "$SPRINT_DIR" ]]; then
  echo "Usage: $0 <sprint_dir>" >&2
  exit 1
fi

CODEX_BIN="${CODEX_BIN:-codex}"
if ! command -v "$CODEX_BIN" >/dev/null 2>&1; then
  echo "Codex CLI not found on PATH as '$CODEX_BIN'." >&2
  exit 127
fi

GENERIC_PROMPT="$(dirname "$0")/../ralph_prompt.md"
SPRINT_PROMPT="$SPRINT_DIR/prompt.md"
PRD_FILE="$SPRINT_DIR/prd.json"
PROGRESS_FILE="$SPRINT_DIR/progress.txt"
REPO_ROOT="$(cd "$SPRINT_DIR/../../.." && pwd)"

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
Repo root: $REPO_ROOT

Begin.
EOF

ARGS=(exec --sandbox danger-full-access --cd "$REPO_ROOT")
if [[ -n "${CODEX_MODEL:-}" ]]; then
  ARGS+=(--model "$CODEX_MODEL")
fi
if [[ -n "${CODEX_EXTRA:-}" ]]; then
  # shellcheck disable=SC2206
  EXTRA_ARGS=(${CODEX_EXTRA})
  ARGS+=("${EXTRA_ARGS[@]}")
fi

printf '%s' "$PROMPT" | "$CODEX_BIN" "${ARGS[@]}" -
