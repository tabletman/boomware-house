# AGENTS.md — Boom Warehouse (AgentWise as Orchestrator)

Core Principle
--------------
AgentWise is the single authoritative orchestration hub for all autonomous and semi-autonomous work in this repository.
All AI assistants, CLIs, or helper tools must accept tasks from AgentWise. Direct human calls to automation in production
workflows are discouraged — use AgentWise to dispatch, audit, and retry tasks.

Quick Start
-----------
1. Install AgentWise: `npm i -g agentwise`
2. Start monitor: `agentwise monitor`
3. Use AgentWise to create tasks: `agentwise /create "analyze images and list product #SKU123"`

Agent Roles (AgentWise-managed)
-------------------------------
- VisionAgent (AgentWise-managed)
  - Input: product images
  - Output: product metadata (title, make/model, condition, suggested categories)
- MarketIntelAgent (AgentWise-managed)
  - Input: product metadata
  - Output: market research (sold prices, comparable items)
- PriceOptimizerAgent (AgentWise-managed)
  - Input: market intel + inventory constraints
  - Output: suggested price + price schedule (drops at day 7/14/21)
- ImageProcessorAgent (AgentWise-managed)
  - Input: product images + platform specs
  - Output: optimized images per platform
- ListingExecutorAgent (AgentWise-managed)
  - Input: prepared listing package
  - Output: created listings + tracking IDs
- SwarmOrchestrator (AgentWise core)
  - Coordinates above agents, manages retries, rate-limits, and logging

How AgentWise Should Invoke External Tools
------------------------------------------
Rule: AgentWise invokes tools via signed wrapper scripts under tools/ (not direct human invocation).
This enforces authentication, logging, and a uniform interface.

Wrapper contract:
- Input: single JSON argument (task payload) or STDIN JSON
- Validation: wrapper checks AGENTWISE_TOKEN (environment) or a one-time signed token file before running
- Output: wrapper returns JSON { success: bool, data: {...}, logs: "..." }
- Location: tools/run-*.sh (examples below)

AgentWise -> Wrapper -> Tool examples
- AgentWise command example (shell):
  bash tools/run-droid.sh '{"task":"implement product route","files":["src/api/products.ts"]}'
- AgentWise will parse the wrapper JSON response and record action in agent_logs.

Wrapper Implementation Examples
-------------------------------
(Place these in `tools/`):

tools/run-droid.sh
```bash
#!/usr/bin/env bash
set -euo pipefail
AGENTWISE_TOKEN_FILE="${HOME}/.agentwise_token"
if [ ! -f "${AGENTWISE_TOKEN_FILE}" ]; then
  echo '{"success":false,"error":"No agentwise token"}'
  exit 1
fi
# minimal check (wrapper)
PAYLOAD="$1"
echo "[$(date -u)] run-droid invoked by AgentWise; payload: $PAYLOAD" >> logs/tool-invocations.log
# Example invocation of droid CLI (change as needed)
# droid command must be invoked by AgentWise policy
# droid do --payload "$PAYLOAD"
# Simulate return
echo "{\"success\":true,\"data\":{\"message\":\"Droid executed (simulated)\"}}"