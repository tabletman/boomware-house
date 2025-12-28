# Warp Setup Guide for Boom Warehouse

## Overview

This guide walks you through setting up Warp as your command center for autonomous software development with AgentWise orchestration.

## Prerequisites

1. **Warp Terminal**: Download from [warp.dev](https://warp.dev)
2. **AgentWise CLI**: Install globally
   ```bash
   npm i -g agentwise
   ```
3. **Required Tools**:
   - Git
   - Node.js 18+
   - Docker (optional, for containerized workflows)
   - jq (for JSON validation)

## Quick Start

### 1. Import Warp Workflows

In Warp:
1. Open Workflows panel (Cmd/Ctrl + Shift + W)
2. Click "Import Workflow"
3. Navigate to `.warp/` directory in this repo
4. Import all `.json` workflow files:
   - `workflow_frontier.json` - Health checks and smoke tests
   - `workflow_db-init.json` - Database initialization
   - `workflow_worker-control.json` - Worker management

### 2. Configure Secrets

In Warp Settings → Secrets, add the following:

**Required Secrets:**
- `AGENTWISE_TOKEN` - Your AgentWise authentication token
- `ANTHROPIC_API_KEY` - Claude API key (for vision AI)
- `EBAY_CLIENT_ID` - eBay API client ID
- `EBAY_CLIENT_SECRET` - eBay API client secret
- `EBAY_DEV_ID` - eBay developer ID

**Optional Secrets:**
- `FRONTIER_API_KEY` - Frontier model API key (if using)
- `FRONTIER_API_URL` - Frontier API endpoint
- `FRONTIER_MODEL` - Frontier model name
- `MAC_IP` - Mac machine IP for SSH checks
- `MAC_USER` - Mac machine username
- `REMOVE_BG_API_KEY` - Background removal API key
- `STRIPE_SECRET_KEY` - Stripe payment API key
- `CLOUDINARY_API_KEY` - Cloudinary media API key

### 3. Run Health Check

Test your setup:

```bash
# From repo root
./scripts/warp-frontier-check.sh --dry-run
```

Expected output:
```
USER: <your-username>
Linux <hostname> ...
nvidia-smi not found; skipping GPU checks
MAC_IP or MAC_USER not set; skipping SSH check
Frontier env not fully set; skipping Frontier smoke test
```

Or run via Warp workflow:
1. Open "boomware-frontier-health-check" workflow
2. Click "Run"
3. Review output

### 4. Verify Wrapper Scripts

Test that all wrappers are functional:

```bash
# Test AgentWise wrapper
./tools/run-agentwise.sh --dry-run --help

# Test BullMQ wrapper
./tools/run-bullmq.sh --help

# Test Docker wrapper
./tools/run-docker.sh --dry-run --help
```

## Available Workflows

### 🏥 Health Check Workflow
**File**: `.warp/workflow_frontier.json`  
**Name**: boomware-frontier-health-check  
**Purpose**: System health checks, GPU detection, SSH connectivity, Frontier API smoke tests

**Usage:**
```bash
# Via workflow in Warp UI
# OR via terminal:
bash scripts/warp-frontier-check.sh --dry-run --verbose
```

### 🗄️ Database Init Workflow
**File**: `.warp/workflow_db-init.json`  
**Name**: boomware-db-init  
**Purpose**: Safely initialize or migrate SQLite database

**Usage:**
```bash
# Dry-run first
./tools/run-agentwise.sh --dry-run db:init

# Then actual run (requires --confirm)
./tools/run-agentwise.sh db:init --confirm
```

### ⚙️ Worker Control Workflow
**File**: `.warp/workflow_worker-control.json`  
**Name**: boomware-worker-control  
**Purpose**: Start, stop, and monitor worker groups

**Usage:**
```bash
# Check worker status
./tools/run-agentwise.sh --dry-run worker:status

# Start workers
./tools/run-agentwise.sh worker:start --group default

# Stop workers (requires --confirm)
./tools/run-agentwise.sh worker:stop --group default --confirm
```

## Wrapper Scripts Reference

All wrapper scripts are in `tools/` and follow the AgentWise wrapper contract:

### Common Flags
- `--dry-run` - Show what would be done without executing
- `--help` - Show usage information
- `--confirm` - Explicitly confirm destructive actions

### Available Wrappers

#### `run-agentwise.sh`
Wrapper for AgentWise CLI commands.

```bash
./tools/run-agentwise.sh <subcmd> [args...]
./tools/run-agentwise.sh --dry-run monitor
./tools/run-agentwise.sh task:create --type analyze
```

#### `run-bullmq.sh`
Wrapper for BullMQ job queue operations.

```bash
./tools/run-bullmq.sh enqueue --queue=image-processing --payload-file=job.json
./tools/run-bullmq.sh status --queue=listing-execution
```

#### `run-docker.sh`
Wrapper for Docker commands.

```bash
./tools/run-docker.sh --dry-run ps
./tools/run-docker.sh compose up -d
```

## Logging

All wrapper invocations are logged to `logs/tool-invocations.log` with:
- Timestamp (ISO 8601)
- Wrapper name
- Actor (user/agent)
- Masked arguments (secrets redacted)

**View logs:**
```bash
tail -f logs/tool-invocations.log
```

**Log format:**
```
2025-12-28T04:48:32+00:00 tools/run-agentwise.sh local worker:status
2025-12-28T04:49:15+00:00 tools/run-bullmq.sh agentwise enqueue queue=image-processing payload=job.json
```

## Security Best Practices

1. **Never commit secrets** - Use Warp secrets or environment variables
2. **Always test with --dry-run first** - Especially for destructive operations
3. **Use --confirm for destructive actions** - Prevents accidental data loss
4. **Rotate AGENTWISE_TOKEN regularly** - Create token file at `~/.agentwise_token`
5. **Review logs periodically** - Check `logs/tool-invocations.log` for suspicious activity

## Troubleshooting

### Wrapper returns "AGENTWISE_TOKEN not set"
Create token file:
```bash
echo "your-token-here" > ~/.agentwise_token
chmod 600 ~/.agentwise_token
```

Or set environment variable:
```bash
export AGENTWISE_TOKEN="your-token-here"
```

### Workflow fails to import in Warp
Validate JSON syntax:
```bash
jq . .warp/workflow_frontier.json
```

### Health check fails
Check that secrets are configured in Warp:
1. Open Warp Settings → Secrets
2. Verify all required secrets are present
3. Run health check in verbose mode:
   ```bash
   ./scripts/warp-frontier-check.sh --dry-run --verbose
   ```

### Command not found errors
Ensure scripts are executable:
```bash
chmod +x tools/*.sh scripts/*.sh
```

## Advanced Usage

### Creating Custom Workflows

1. Create new workflow file in `.warp/`:
```json
{
  "name": "my-custom-workflow",
  "description": "Description of workflow",
  "env": {
    "VAR_NAME": "<value or placeholder>"
  },
  "steps": [
    { "name": "Step 1", "cmd": "./tools/run-agentwise.sh ..." }
  ],
  "secrets": ["SECRET_KEY"]
}
```

2. Validate JSON:
```bash
jq . .warp/workflow_custom.json
```

3. Import to Warp via UI

### Creating Custom Wrappers

Follow the template in `tools/_helpers.sh`. New wrapper checklist:

- [ ] Source `_helpers.sh` for common functions
- [ ] Validate `AGENTWISE_TOKEN` if needed
- [ ] Support `--dry-run` flag
- [ ] Support `--help` flag
- [ ] Log invocation with `log_invocation()`
- [ ] Mask secrets with `mask_args()`
- [ ] Return JSON output
- [ ] Make executable: `chmod +x tools/run-myapp.sh`

See `prompts/chatgpt-5.1-refactoring-prompt.md` for detailed wrapper development guide.

## Next Steps

1. **Read the refactoring prompt**: `prompts/chatgpt-5.1-refactoring-prompt.md`
2. **Review AGENTS.md**: Understand AgentWise principles
3. **Review WARP.md**: Understand Warp integration patterns
4. **Test workflows**: Run each workflow in dry-run mode
5. **Explore the codebase**: Understand existing agent implementations

## Resources

- [AgentWise Documentation](https://agentwise.dev) (conceptual)
- [Warp Documentation](https://docs.warp.dev)
- [BullMQ Documentation](https://docs.bullmq.io)
- [Project README](../README.md)

---

**Questions?** Review `WARP.md` for detailed troubleshooting or check `logs/tool-invocations.log` for audit trail.
