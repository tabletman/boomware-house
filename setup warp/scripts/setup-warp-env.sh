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
EOF
  chmod +x tools/_helpers.sh
  echo "Wrote tools/_helpers.sh"
fi

# create wrapper templates if missing
for w in run-bullmq.sh run-docker.sh run-agentwise.sh; do
  path="tools/$w"
  if [ ! -f "$path" ]; then
    cat > "$path" <<EOF
#!/usr/bin/env bash
set -euo pipefail
# TODO: review and customize this wrapper
source "$(dirname "$0")/_helpers.sh"

usage_common

echo "Template wrapper created; please edit $path to implement real behavior."
EOF
    chmod +x "$path"
    echo "Created template $path (please review and customize)"
  fi
done

# create .warp directory and workflows
mkdir -p .warp
cat > .warp/workflow_frontier.json <<'EOF'
{
  "name": "boomware-frontier-health-check",
  "description": "Health check and smoke-test across repo + Frontier endpoint. Uses scripts/warp-frontier-check.sh",
  "env": {
    "FRONTIER_API_URL": "<FRONTIER_API_URL>",
    "FRONTIER_MODEL": "<FRONTIER_MODEL>",
    "FRONTIER_API_KEY": "<set_in_warp_secrets>",
    "MAC_IP": "<MAC_IP>",
    "MAC_USER": "<MAC_USER>",
    "SSH_PORT": "22"
  },
  "steps": [
    { "name": "Repo status", "cmd": "git status --porcelain; git rev-parse --abbrev-ref HEAD || true" },
    { "name": "Install node deps (if needed)", "cmd": "npm ci --prefer-offline || npm install --no-audit --prefer-offline" },
    { "name": "DB init (safe)", "cmd": "npm run db:init || echo 'db:init failed or already initialized'" },
    { "name": "Run warp-frontier-check", "cmd": "bash scripts/warp-frontier-check.sh --dry-run" }
  ],
  "secrets": [ "FRONTIER_API_KEY", "AGENTWISE_TOKEN" ]
}
EOF

# basic validations
if command -v jq >/dev/null 2>&1; then jq . .warp/workflow_frontier.json >/dev/null && echo "workflow_frontier.json valid" || echo "workflow_frontier.json invalid"; fi

# stage files
git add .warp/workflow_frontier.json tools/_helpers.sh scripts/warp-frontier-check.sh tools/run-bullmq.sh tools/run-docker.sh tools/run-agentwise.sh || true

if [ -n "$COMMIT_MSG" ]; then
  git commit -m "$COMMIT_MSG"
  echo "Committed with message: $COMMIT_MSG"
else
  echo "Files staged. Run: git commit -m \"<message>\" to commit, or re-run with --commit \"message\""
fi

# summary
echo "Setup complete. Branch: $(git rev-parse --abbrev-ref HEAD)"