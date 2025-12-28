#!/usr/bin/env bash
# setup_warp_files.sh
# Create Warp workflow JSON, scripts, and docs for Boom Warehouse.
# Usage:
#   ./scripts/setup_warp_files.sh            # creates files only
#   ./scripts/setup_warp_files.sh --commit   # create files and create a git commit
#   ./scripts/setup_warp_files.sh --commit --push  # commit and push to current branch
set -euo pipefail

COMMIT=false
PUSH=false

for arg in "$@"; do
  case "$arg" in
    --commit) COMMIT=true ;;
    --push) PUSH=true ;;
    *) echo "Unknown arg: $arg"; exit 2 ;;
  esac
done

mkdir -p .warp scripts docs

# Write .warp/workflow_frontier.json
cat > .warp/workflow_frontier.json <<'JSON_EOF'
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
    {
      "name": "Repo status",
      "cmd": "git status --porcelain; git rev-parse --abbrev-ref HEAD || true"
    },
    {
      "name": "Install node deps (if needed)",
      "cmd": "npm ci --prefer-offline || npm install --no-audit --prefer-offline"
    },
    {
      "name": "DB init (safe)",
      "cmd": "npm run db:init || echo 'db:init failed or already initialized'"
    },
    {
      "name": "Run warp-frontier-check",
      "cmd": "bash scripts/warp-frontier-check.sh"
    }
  ],
  "secrets": [
    "FRONTIER_API_KEY",
    "AGENTWISE_TOKEN"
  ]
}
JSON_EOF

# Write scripts/warp-frontier-check.sh
cat > scripts/warp-frontier-check.sh <<'SH_EOF'
#!/usr/bin/env bash
# warp-frontier-check.sh -- health check + Frontier smoke test
# Idempotent checks for system, connectivity to Mac, and Frontier endpoint.
set -euo pipefail

FRONTIER_API_URL="${FRONTIER_API_URL:-<FRONTIER_API_URL>}"
FRONTIER_MODEL="${FRONTIER_MODEL:-<FRONTIER_MODEL>}"
FRONTIER_API_KEY="${FRONTIER_API_KEY:-}"
MAC_IP="${MAC_IP:-<MAC_IP>}"
MAC_USER="${MAC_USER:-<MAC_USER>}"
SSH_PORT="${SSH_PORT:-22}"

echo "=== Basic system info ==="
echo "USER: $(whoami)"
uname -a
free -h || true
df -h . || true

echo
echo "=== GPU (if present) ==="
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=index,name,memory.total,memory.used,utilization.gpu --format=csv,noheader,nounits || true
else
  echo "nvidia-smi not found; skipping GPU checks"
fi

echo
echo "=== SSH test to Mac (${MAC_IP}) ==="
if [ -n "${MAC_IP}" ] && [ "${MAC_IP}" != "<MAC_IP>" ]; then
  if ssh -o ConnectTimeout=5 -p "${SSH_PORT}" "${MAC_USER}@${MAC_IP}" 'echo OK; uname -a' >/dev/null 2>&1; then
    echo "SSH OK to ${MAC_USER}@${MAC_IP}"
  else
    echo "SSH failed to ${MAC_USER}@${MAC_IP}" >&2 || true
  fi
else
  echo "MAC_IP not set; skipping SSH test"
fi

echo
if [ -n "${FRONTIER_API_KEY}" ] && [ "${FRONTIER_API_KEY}" != "<FRONTIER_API_KEY>" ]; then
  echo "=== Frontier smoke test ==="
  set +e
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${FRONTIER_API_URL}/v1/${FRONTIER_MODEL}/infer" \
    -H "Authorization: Bearer ${FRONTIER_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{ "input": "health check" }' || true)
  set -e
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  echo "HTTP status: $HTTP_CODE"
  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
    echo "Frontier response: $BODY"
  else
    echo "Frontier call failed or returned non-2xx; body: $BODY" >&2
  fi
else
  echo "FRONTIER_API_KEY not set; skipping Frontier test"
fi

echo
echo "=== Done ==="
SH_EOF

chmod +x scripts/warp-frontier-check.sh

# Write docs/WARP_SETUP.md (Markdown)
cat > docs/WARP_SETUP.md <<'MD_EOF'
# Warp — Setup, Workflows, and Command Center Integration

This document explains how to set up Warp as the command center for Boom Warehouse, how to add scripts and Warp Workflows, and how to connect Warp to AgentWise wrappers and repo CLI.

## Goals
- Make Warp the central place to run: repo health checks, AgentWise tasks, worker control, model endpoint tests, and deployment tasks.
- Ensure Warp workflows are idempotent and secure (no secrets in plaintext).

## Recommended layout (in repo)
- scripts/warp-frontier-check.sh — health + smoke test script
- tools/run-*.sh — AgentWise wrappers (validate `AGENTWISE_TOKEN`)
- .warp/workflows/*.json — Warp workflow definitions

## Example Warp assistant prompt (paste into Warp AI assistant)
You are a Warp assistant for Boom Warehouse. Behave as a shell-native assistant. When asked for an action:
1. Provide a one-line summary.
2. Provide the minimal ready-to-run command in a fenced block.
3. Provide diagnostics and safety checks next (whoami, disk, nvidia-smi, ping).
4. For actions requiring secrets, show how to set them as Warp secrets or in `.env` (permissions 600) and never echo secret values.

Placeholders:
- <FRONTIER_API_URL> — model endpoint
- <FRONTIER_MODEL> — model id
- <FRONTIER_API_KEY> — secret
- <MAC_IP>, <MAC_USER>, <SSH_PORT>

## Example Warp Workflow JSON
- A Warp workflow should include environment hints and steps. See `.warp/workflow_frontier.json` in the repo for an example.

## Adding wrappers under `tools/`
All external tool invocations from automation should go through signed wrappers. Example wrapper header:
```bash
#!/usr/bin/env bash
set -euo pipefail
if [ -z "${AGENTWISE_TOKEN:-}" ]; then
  echo "AGENTWISE_TOKEN missing" >&2; exit 2
fi
mkdir -p logs
echo "$(date --iso-8601=seconds) $0 $*" >> logs/tool-invocations.log
exec /usr/bin/env "$@"