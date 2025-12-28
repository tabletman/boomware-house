# WARP.md — Warp as Command Center for Boom Warehouse

This file documents how to use Warp (warp.dev) as the command center for Boom Warehouse. It is intended to be written/created by the project's AgentWise brain (GPT‑5.1 Codex) and to be imported alongside `.warp/` workflow files into the Warp app.

Overview
- Purpose: Use Warp as the central UI to run repo health checks, AgentWise tasks, worker control, model endpoint smoke tests, and deploy operations.
- Principle: AgentWise is the canonical executor. Warp is the command center that triggers AgentWise wrappers (tools/run-*.sh) and workflows. Do not run external tools directly from Warp unless they are calling the signed wrappers.

Immediate operator checklist (import & setup)
1. Import workflows
   - In Warp: Workflows → Import → select `.warp/*.json` files (e.g. `.warp/workflow_frontier.json`, `.warp/workflow_db-init.json`, `.warp/workflow_worker-control.json`).
2. Configure Warp secrets (DO NOT store secrets in repo)
   - Add the following secrets in Warp secret storage:
     - FRONTIER_API_KEY
     - AGENTWISE_TOKEN
     - ANTHROPIC_API_KEY (if required)
     - EBAY_CLIENT_ID / EBAY_CLIENT_SECRET (if required)
3. Confirm agentwise wrappers exist
   - Ensure `tools/run-*.sh` wrappers are present and executable. They should validate `AGENTWISE_TOKEN`, support `--dry-run`, and log invocations to `logs/tool-invocations.log`.
4. Run health-check (dry-run first)
   - In Warp open the imported workflow `boomware-frontier-health-check` and run it in `--dry-run` mode or use the terminal:
     ```bash
     bash scripts/warp-frontier-check.sh --dry-run
     ```
5. Provide secrets when requested
   - The AgentWise brain will create workflows and attempt dry-run checks. If any step requires secrets to proceed, the workflow or wrapper will pause and request the secret (Warp secrets or AgentWise secret store). Provide secrets via Warp's secret UI or AgentWise secret set commands.

How Warp interacts with AgentWise
- Workflows in `.warp/` call local wrapper scripts in `tools/` (e.g., `./tools/run-bullmq.sh enqueue ...`) which in turn validate `AGENTWISE_TOKEN`, log the invocation, and then call AgentWise APIs or run the desired command within the controlled environment.
- This design centralizes audit logs in `logs/tool-invocations.log` and prevents ad-hoc direct CLI calls.

Key workflows to import
- boomware-frontier-health-check (`.warp/workflow_frontier.json`)
  - Purpose: run repository health checks, GPU checks (if present), SSH connectivity smoke tests, and a Frontier model smoke test (if API key present).
  - Secrets required: FRONTIER_API_KEY, AGENTWISE_TOKEN
- boomware-db-init (`.warp/workflow_db-init.json`)
  - Purpose: safely initialize or migrate `data/inventory.db` using wrapper `tools/run-db.sh` (requires `--confirm` to perform destructive actions).
  - Secrets: AGENTWISE_TOKEN
- boomware-worker-control (`.warp/workflow_worker-control.json`)
  - Purpose: start/stop worker groups via `tools/run-worker.sh` and monitor job queues.
  - Secrets: AGENTWISE_TOKEN

Recommended Warp snippets
- frontier_call snippet:
  ```bash
  curl -s -X POST "${FRONTIER_API_URL}/v1/${FRONTIER_MODEL}/infer" \
    -H "Authorization: Bearer ${FRONTIER_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{ "input": "health check" }' | jq -r '.output'
  ```
- enqueue image job (via wrapper):
  ```bash
  ./tools/run-bullmq.sh --dry-run enqueue --queue=image-processing --payload-file=payload.json
  ```

Proceed with development
- The AgentWise brain (GPT‑5.1 Codex) is authorized to proceed with development: generate wrappers, `.warp/` workflows, scripts, and docs (including this `WARP.md`) and to run non‑destructive dry-run validations. It must use placeholders for secrets and request them only when needed for privileged actions. Operator will provide secrets via Warp secrets or AgentWise secret store when requested.

Troubleshooting & common checks
- If a workflow fails in Warp, inspect `logs/tool-invocations.log` for masked invocation records.
- Validate workflow JSON locally:
  ```bash
  jq . .warp/workflow_frontier.json
  ```
- Validate wrapper syntax:
  ```bash
  sh -n tools/run-bullmq.sh
  ./tools/run-bullmq.sh --dry-run --help
  ```

Notes & security
- Never store secret values in the repo. Use Warp secrets or AgentWise secret management.
- All wrapper logs should be rotated and protected; do not leak secrets in logs.

Attribution
- "Scaffolding assisted by tabletman + GPT‑5.1 Codex (AgentWise brain)"

End of WARP.md
