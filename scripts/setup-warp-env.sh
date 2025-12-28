#!/usr/bin/env bash
set -euo pipefail

# setup-warp-env.sh -- create .warp workflows, ensure scripts and wrappers exist
BRANCH_PREFIX="chore/agentwise-warp-setup"
TS=$(date -u +%Y%m%dT%H%M%SZ)
BRANCH_NAME="${BRANCH_PREFIX}-${TS}"

usage(){
  cat <<'USAGE'
Usage: setup-warp-env.sh [--commit "message"] [--no-branch]
Creates .warp workflows and ensures wrapper templates exist. By default it creates a branch and stages files; use --commit to commit locally.
USAGE
}

COMMIT_MSG=""
NO_BRANCH=0
while [ $# -gt 0 ]; do
  case "$1" in
    --commit) shift; COMMIT_MSG="$1"; shift;;
    --no-branch) NO_BRANCH=1; shift;;
    --help) usage; exit 0;;
    *) echo "Unknown arg: $1" >&2; usage; exit 2;;
  esac
done

# preflight
if ! command -v git >/dev/null 2>&1; then echo "git required" >&2; exit 2; fi
if ! command -v jq >/dev/null 2>&1; then echo "Warning: jq not found; JSON validation disabled" >&2; fi

# create branch
if [ "$NO_BRANCH" -eq 0 ]; then
  git checkout -b "$BRANCH_NAME"
  echo "Created branch $BRANCH_NAME"
fi

# ensure tools/_helpers.sh exists
mkdir -p tools
if [ ! -f tools/_helpers.sh ]; then
  cat > tools/_helpers.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
log_dir="logs"
mkdir -p "$log_dir"
mask_args(){ printf '%s' "$@" | sed -E 's/(--?\w*(key|token|secret|pass)=[^[:space:]]+)/\1<redacted>/gi' ; }
log_invocation(){ local wrapper="$1"; shift; local actor="${ACTOR:-local}"; local args_masked; args_masked=$(mask_args "$@"); printf '%s %s %s %s\n' "$(date --iso-8601=seconds)" "$wrapper" "$actor" "$args_masked" >> "$log_dir/tool-invocations.log"; }
ensure_agentwise_token(){ if [ -z "${AGENTWISE_TOKEN:-}" ]; then echo "ERROR: AGENTWISE_TOKEN is not set." >&2; return 1; fi; }
