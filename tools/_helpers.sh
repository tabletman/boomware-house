#!/usr/bin/env bash
set -euo pipefail

# helpers for wrappers: log_invocation, mask_args, ensure_agentwise_token
log_dir="logs"
mkdir -p "$log_dir"

mask_args() {
  # mask common secret-like args (very simple)
  printf '%s' "$@" | sed -E 's/(--?\w*(key|token|secret|pass)=[^[:space:]]+)/\1<redacted>/gi'
}

log_invocation() {
  local wrapper="$1"; shift
  local actor="${ACTOR:-local}"
  local args_masked
  args_masked=$(mask_args "$@")
  printf '%s %s %s %s\n' "$(date --iso-8601=seconds)" "$wrapper" "$actor" "$args_masked" >> "$log_dir/tool-invocations.log"
}

ensure_agentwise_token() {
  if [ -z "${AGENTWISE_TOKEN:-}" ]; then
    echo "ERROR: AGENTWISE_TOKEN is not set. Please set it in environment or in Warp/AgentWise secrets." >&2
    return 1
  fi
  return 0
}

usage_common() {
  cat <<'USAGE'
Common wrapper flags:
  --dry-run    : show what would be done without performing it
  --help       : show help
  --confirm    : perform destructive actions (explicit)
USAGE
}