#!/usr/bin/env bash
# Adapter dispatcher. Selects an adapter based on RALPH_ADAPTER (defaults to
# claude_code) and forwards the sprint directory to it.
#
# Usage:
#   RALPH_ADAPTER=claude_code ./plans/run_agent.sh <sprint_dir>
#
set -euo pipefail

SPRINT_DIR="${1:-}"
ADAPTER="${RALPH_ADAPTER:-claude_code}"

if [[ -z "$SPRINT_DIR" ]]; then
  echo "Usage: $0 <sprint_dir>" >&2
  exit 1
fi

ADAPTER_SCRIPT="$(dirname "$0")/adapters/${ADAPTER}.sh"
if [[ ! -x "$ADAPTER_SCRIPT" ]]; then
  echo "Adapter not found or not executable: $ADAPTER_SCRIPT" >&2
  exit 1
fi

exec "$ADAPTER_SCRIPT" "$SPRINT_DIR"
