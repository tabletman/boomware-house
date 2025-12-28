#!/usr/bin/env bash
set -euo pipefail

# commit_agentwise_files.sh
# Usage:
#   chmod +x commit_agentwise_files.sh
#   ./commit_agentwise_files.sh
#
# This will:
# - checkout/create branch chore/agentwise-warp-setup-20251228T013000Z
# - backup existing files to *.bak.<ts>
# - write wrapper, script, and .warp workflow files
# - make scripts executable
# - git add, commit, and push the branch
#
# NOTE: You must have git push access and network/auth configured.

BRANCH="chore/agentwise-warp-setup-20251228T013000Z"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
COMMIT_MSG="chore: add AgentWise wrappers, Warp workflows, and setup installer"

files_to_create=(
  "tools/_helpers.sh"
  "tools/run-bullmq.sh"
  "tools/run-docker.sh"
  "tools/run-agentwise.sh"
  "scripts/warp-frontier-check.sh"
  "scripts/setup-warp-env.sh"
  ".warp/workflow_frontier.json"
  ".warp/workflow_db-init.json"
  ".warp/workflow_worker-control.json"
)

# Ensure repo root (script executed from repo root)
if [ ! -d ".git" ]; then
  echo "This script must be run from the repository root (where .git is)." >&2
  exit 2
fi

# Ensure working tree is clean to avoid accidental overwrites
if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: your git working tree is not clean. Please stash/commit changes or run with a clean working tree." >&2
  git status --porcelain
  read -p "Continue anyway? (y/N) " yn
  case "$yn" in
    [Yy]*) echo "Proceeding...";;
    *) echo "Aborting."; exit 1;;
  esac
fi

# Checkout or create branch
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

# Backup existing files (Option A: full-content backups)
backup_if_exists() {
  local f="$1"
  if [ -f "$f" ]; then
    local bak="${f}.bak.${TS}"
    mkdir -p "$(dirname "$bak")"
    cp -a "$f" "$bak"
    echo "Backed up $f -> $bak"
  fi
}

for f in "${files_to_create[@]}"; do
  backup_if_exists "$f"
done

# Create directories
mkdir -p tools scripts .warp

# Write files
cat > tools/_helpers.sh <<'EOF'
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
EOF

cat > tools/run-bullmq.sh <<'EOF'
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
EOF

cat > tools/run-docker.sh <<'EOF'
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
EOF

cat > tools/run-agentwise.sh <<'EOF'
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
EOF

cat > scripts/warp-frontier-check.sh <<'EOF'
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
EOF

cat > scripts/setup-warp-env.sh <<'EOF'
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
    cat > "$path" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
# TODO: review and customize this wrapper
source "$(dirname "$0")/_helpers.sh"

usage_common

echo "Template wrapper created; please edit the file to implement real behavior."
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
EOF

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

cat > .warp/workflow_db-init.json <<'EOF'
{
  "name": "boomware-db-init",
  "description": "Safely initialize or migrate the local SQLite DB (data/inventory.db) via AgentWise wrapper",
  "env": {},
  "steps": [
    { "name": "DB init (dry-run)", "cmd": "./tools/run-agentwise.sh --dry-run db:init" },
    { "name": "DB init (run)", "cmd": "./tools/run-agentwise.sh db:init --confirm" }
  ],
  "secrets": [ "AGENTWISE_TOKEN" ]
}
EOF

cat > .warp/workflow_worker-control.json <<'EOF'
{
  "name": "boomware-worker-control",
  "description": "Start/stop worker groups via the AgentWise wrappers",
  "env": {},
  "steps": [
    { "name": "Worker status (dry-run)", "cmd": "./tools/run-agentwise.sh --dry-run worker:status" },
    { "name": "Start workers", "cmd": "./tools/run-agentwise.sh worker:start --group default" },
    { "name": "Stop workers", "cmd": "./tools/run-agentwise.sh worker:stop --group default --confirm" }
  ],
  "secrets": [ "AGENTWISE_TOKEN" ]
}
EOF

# Make scripts executable
chmod +x tools/_helpers.sh tools/run-bullmq.sh tools/run-docker.sh tools/run-agentwise.sh scripts/warp-frontier-check.sh scripts/setup-warp-env.sh

# Git add and commit
git add "${files_to_create[@]}" .warp/workflow_frontier.json .warp/workflow_db-init.json .warp/workflow_worker-control.json || true

git commit -m "${COMMIT_MSG}" || echo "Nothing to commit (changes may already be staged)"

# Push branch to origin
git push -u origin "$(git rev-parse --abbrev-ref HEAD)"

echo "Done. Branch pushed: $(git rev-parse --abbrev-ref HEAD)"
