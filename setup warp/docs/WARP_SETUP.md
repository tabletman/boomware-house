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
- A Warp workflow should include environment hints and steps. See `.warp/workflow_frontier.json` in the repo for an example (provided below in repo file blocks).

## Adding wrappers under `tools/`
All external tool invocations from automation should go through signed wrappers. Example wrapper header:
```bash
#!/usr/bin/env bash
set -euo pipefail
if [ -z "${AGENTWISE_TOKEN:-}" ]; then
  echo "AGENTWISE_TOKEN missing" >&2; exit 2
fi
# log invocation
mkdir -p logs
echo "$(date --iso-8601=seconds) $0 $*" >> logs/tool-invocations.log
# invoke the real tool (e.g., aws, gcloud, or custom CLI)
exec /usr/bin/env "$@"