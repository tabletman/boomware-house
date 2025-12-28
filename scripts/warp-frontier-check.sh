#!/usr/bin/env bash
set -euo pipefail

usage(){
  cat <<'USAGE'
Usage: warp-frontier-check.sh [--dry-run] [--output-json] [--verbose]
Performs system checks, optional GPU checks, SSH connectivity, and optional Frontier smoke test (requires FRONTIER_API_KEY).
USAGE
}

DRY_RUN=0
OUTPUT_JSON=0
VERBOSE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift;;
    --output-json) OUTPUT_JSON=1; shift;;
    --verbose) VERBOSE=1; shift;;
    --help) usage; exit 0;;
    *) echo "Unknown arg: $1" >&2; usage; exit 2;;
  esac
done

# load helpers if available
if [ -f "$(dirname "$0")/../tools/_helpers.sh" ]; then
  source "$(dirname "$0")/../tools/_helpers.sh"
fi

check_system(){
  echo "USER: $(whoami)"
  uname -a
  free -h || true
  df -h . || true
}

check_gpu(){
  if command -v nvidia-smi >/dev/null 2>&1; then
    nvidia-smi --query-gpu=index,name,memory.total,memory.used,utilization.gpu --format=csv,noheader,nounits || true
  else
    echo "nvidia-smi not found; skipping GPU checks"
  fi
}

check_ssh(){
  MAC_IP="${MAC_IP:-}"; MAC_USER="${MAC_USER:-}"
  if [ -z "$MAC_IP" ] || [ -z "$MAC_USER" ]; then
    echo "MAC_IP or MAC_USER not set; skipping SSH check"
    return
  fi
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "DRY RUN: would SSH to $MAC_USER@$MAC_IP"
    return
  fi
  if ssh -o ConnectTimeout=5 -p "${SSH_PORT:-22}" "$MAC_USER@$MAC_IP" 'echo OK && uname -a' >/dev/null 2>&1; then
    echo "SSH OK to $MAC_USER@$MAC_IP"
  else
    echo "SSH failed to $MAC_USER@$MAC_IP" >&2
  fi
}

frontier_smoke(){
  if [ -z "${FRONTIER_API_KEY:-}" ] || [ -z "${FRONTIER_API_URL:-}" ] || [ -z "${FRONTIER_MODEL:-}" ]; then
    echo "Frontier env not fully set; skipping Frontier smoke test"
    return
  fi
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "DRY RUN: would call Frontier at ${FRONTIER_API_URL}/v1/${FRONTIER_MODEL}/infer"
    return
  fi
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${FRONTIER_API_URL}/v1/${FRONTIER_MODEL}/infer" \
    -H "Authorization: Bearer ${FRONTIER_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{ "input": "health check" }' || true)
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  echo "HTTP status: $HTTP_CODE"
  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
    echo "Frontier response: $BODY"
  else
    echo "Frontier call failed or returned non-2xx; body: $BODY" >&2
  fi
}

# run checks
check_system
check_gpu
check_ssh
frontier_smoke

if [ "$OUTPUT_JSON" -eq 1 ]; then
  echo '{"status":"ok"}'
fi
