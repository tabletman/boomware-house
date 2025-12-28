#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="tools/run-agentwise.sh"
source "$(dirname "$0")/_helpers.sh"

DRY_RUN=0
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <agentwise-subcmd> [args...]" >&2
  usage_common
  exit 2
fi

if [ "$1" = "--dry-run" ]; then DRY_RUN=1; shift; fi

log_invocation "$SCRIPT_NAME" "$@"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "DRY RUN: agentwise $@"
  exit 0
fi

if command -v agentwise >/dev/null 2>&1; then
  exec agentwise "$@"
else
  echo "AgentWise CLI not found; please install or configure agentwise CLI. Failing." >&2
  exit 4
fi
