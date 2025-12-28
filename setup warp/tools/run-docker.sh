#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="tools/run-docker.sh"
source "$(dirname "$0")/_helpers.sh"

DRY_RUN=0
if [ "$#" -eq 0 ]; then
  echo "Usage: $0 [--dry-run] docker-args..." >&2
  usage_common
  exit 2
fi

if [ "$1" = "--dry-run" ]; then DRY_RUN=1; shift; fi

log_invocation "$SCRIPT_NAME" "docker" "$@"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "DRY RUN: docker $@"
  exit 0
fi

# Execute docker with provided args
if command -v docker >/dev/null 2>&1; then
  exec docker "$@"
else
  echo "ERROR: docker not found on PATH" >&2
  exit 3
fi