#!/usr/bin/env bash
# Ralph iterative sprint runner.
#
# Runs the agent repeatedly on a sprint directory until every PRD item
# is marked passes=true, or until max_iters is reached.
#
# Usage:
#   RALPH_AGENT_CMD=./plans/adapters/claude_code.sh \
#     ./plans/ralph.sh plans/sprints/YYYY-MM-DD-slug [max_iters]
#
set -euo pipefail

SPRINT_DIR="${1:-}"
MAX_ITERS="${2:-25}"

if [[ -z "$SPRINT_DIR" || ! -d "$SPRINT_DIR" ]]; then
  echo "Usage: $0 <sprint_dir> [max_iters]" >&2
  exit 1
fi

if [[ -z "${RALPH_AGENT_CMD:-}" ]]; then
  echo "RALPH_AGENT_CMD must be set (e.g. ./plans/adapters/claude_code.sh)" >&2
  exit 1
fi

PRD_FILE="$SPRINT_DIR/prd.json"
if [[ ! -f "$PRD_FILE" ]]; then
  echo "prd.json not found in $SPRINT_DIR" >&2
  exit 1
fi

all_pass() {
  python3 - <<PY
import json, sys
prd = json.load(open("$PRD_FILE"))
items = prd.get("items", [])
if not items:
    sys.exit(1)
sys.exit(0 if all(bool(i.get("passes")) for i in items) else 1)
PY
}

summarize() {
  python3 - <<PY
import json
prd = json.load(open("$PRD_FILE"))
items = prd.get("items", [])
done = sum(1 for i in items if i.get("passes"))
print(f"Progress: {done}/{len(items)} items passing")
for i in items:
    mark = "x" if i.get("passes") else " "
    print(f"  [{mark}] {i.get('id')}: {i.get('title')}")
PY
}

echo "Sprint: $SPRINT_DIR"
summarize
echo

for ((i = 1; i <= MAX_ITERS; i++)); do
  if all_pass; then
    echo "=== All PRD items pass. Sprint complete. ==="
    summarize
    exit 0
  fi
  echo "=== Ralph iteration $i / $MAX_ITERS ==="
  "$RALPH_AGENT_CMD" "$SPRINT_DIR" || {
    echo "Agent exited non-zero on iteration $i" >&2
  }
  echo
  summarize
  echo
done

if all_pass; then
  echo "=== All PRD items pass. Sprint complete. ==="
  summarize
  exit 0
fi

echo "Ralph finished $MAX_ITERS iterations without all items passing." >&2
summarize
exit 2
