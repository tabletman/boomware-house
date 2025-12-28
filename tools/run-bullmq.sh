#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="tools/run-bullmq.sh"
source "$(dirname "$0")/_helpers.sh"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <cmd> [options]" >&2
  usage_common
  exit 2
fi

CMD="$1"; shift
DRY_RUN=0
PAYLOAD_FILE=""
QUEUE=""
PRIORITY=5
RETRIES=3

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift;;
    --payload-file) PAYLOAD_FILE="$2"; shift 2;;
    --queue) QUEUE="$2"; shift 2;;
    --priority) PRIORITY="$2"; shift 2;;
    --retries) RETRIES="$2"; shift 2;;
    --help) usage_common; echo "Commands: enqueue, status"; exit 0;;
    *) echo "Unknown arg: $1" >&2; exit 2;;
  esac
done

log_invocation "$SCRIPT_NAME" "$CMD" "queue=$QUEUE" "payload=$PAYLOAD_FILE"

case "$CMD" in
  enqueue)
    if [ -z "$PAYLOAD_FILE" ]; then echo "--payload-file is required for enqueue" >&2; exit 2; fi
    if [ ! -f "$PAYLOAD_FILE" ]; then echo "Payload file $PAYLOAD_FILE not found" >&2; exit 2; fi
    if ! command -v jq >/dev/null 2>&1; then echo "jq required to validate payload JSON" >&2; fi
    if [ "$DRY_RUN" -eq 1 ]; then
      echo "DRY RUN: would enqueue payload to queue=$QUEUE priority=$PRIORITY retries=$RETRIES payload=$PAYLOAD_FILE"
      jq . "$PAYLOAD_FILE" || true
      exit 0
    fi
    # Actual enqueue implementation placeholder: expect a node script or app to perform enqueue
    if [ -x "scripts/enqueue-job.sh" ]; then
      ./scripts/enqueue-job.sh --queue "$QUEUE" --payload-file "$PAYLOAD_FILE" --priority "$PRIORITY" --retries "$RETRIES"
    else
      echo "No enqueue implementation found (scripts/enqueue-job.sh). Create one to actually enqueue jobs." >&2
      exit 3
    fi
  ;;
  status)
    if [ "$DRY_RUN" -eq 1 ]; then
      echo "DRY RUN: would query queue status for queue=$QUEUE"
      exit 0
    fi
    echo "Querying queue status is not implemented; add scripts/queue-status.sh to provide real status." >&2
    exit 3
  ;;
  *) echo "Unknown command: $CMD" >&2; exit 2;;
esac
