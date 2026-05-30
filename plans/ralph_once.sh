#!/usr/bin/env bash
# Ralph single-iteration runner.
#
# Executes the agent exactly once on the sprint directory. Useful when you
# want to review the agent's work between iterations.
#
# Usage:
#   RALPH_AGENT_CMD=./plans/adapters/claude_code.sh \
#     ./plans/ralph_once.sh plans/sprints/YYYY-MM-DD-slug
#
set -euo pipefail

SPRINT_DIR="${1:-}"

if [[ -z "$SPRINT_DIR" || ! -d "$SPRINT_DIR" ]]; then
  echo "Usage: $0 <sprint_dir>" >&2
  exit 1
fi

if [[ -z "${RALPH_AGENT_CMD:-}" ]]; then
  echo "RALPH_AGENT_CMD must be set (e.g. ./plans/adapters/claude_code.sh)" >&2
  exit 1
fi

exec "$RALPH_AGENT_CMD" "$SPRINT_DIR"
