# Warp Workflows for Boom Warehouse

## Quick Import

1. Open Warp terminal
2. Press `Cmd+Shift+W` (or `Ctrl+Shift+W` on Windows/Linux)
3. Click "Import Workflow"
4. Select all `.json` files in this directory
5. Organize into folders:
   - Quick Actions: frontier, db-init
   - Workers: worker-control
   - (Add more as you create them)

## Available Workflows

### workflow_frontier.json
**Name**: boomware-frontier-health-check
**Purpose**: System health checks, API smoke tests
**Secrets**: FRONTIER_API_KEY, AGENTWISE_TOKEN

### workflow_db-init.json
**Name**: boomware-db-init
**Purpose**: Safe database initialization
**Secrets**: AGENTWISE_TOKEN

### workflow_worker-control.json
**Name**: boomware-worker-control
**Purpose**: Start/stop worker groups
**Secrets**: AGENTWISE_TOKEN

## Next Steps

1. Configure Warp secrets (Settings → Secrets)
2. Run health check workflow to test
3. Review docs/VIBE_CODING.md for setup tips
4. Start vibe session: `./scripts/start-vibe-session.sh`
