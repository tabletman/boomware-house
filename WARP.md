# WARP.md — Warp as Command Center for Boom Warehouse

Warp is the operator UI. AgentWise is the executor. Every action in Warp must flow through AgentWise-compliant wrappers (`tools/run-*.sh`) so we keep audit logs and secret hygiene.

Overview
- Purpose: run repo health checks, AgentWise tasks, Factory Droids (vibe coding), worker control, model smoke tests, and deploy operations from Warp.
- Principle: never bypass wrappers. Warp → `.warp/*.json` workflow → `tools/run-*.sh` (validates `AGENTWISE_TOKEN`, logs invocation, supports `--dry-run` / `--confirm`).

Immediate operator checklist (import & setup)
1) Import workflows (Warp → Workflows → Import):
   - `.warp/workflow_frontier.json`
   - `.warp/workflow_db-init.json`
   - `.warp/workflow_worker-control.json`
   - `.warp/workflow_droid-vibe.json` (Factory Droids / vibe coding)
2) Configure Warp secrets (placeholders only; do **not** store in repo):
   - AGENTWISE_TOKEN
   - FRONTIER_API_KEY
   - FACTORY_API_KEY
   - ANTHROPIC_API_KEY (if required)
   - EBAY_CLIENT_ID / EBAY_CLIENT_SECRET (if required)
3) Confirm wrappers exist and are executable:
   - `tools/run-bullmq.sh`, `tools/run-docker.sh`, `tools/run-droid.sh` (new), and any `tools/run-*.sh` wrappers.
4) Run health-checks (dry-run first):
   - `bash scripts/warp-frontier-check.sh --dry-run`
   - `./tools/run-droid.sh exec --prompt "vibe-code a Next.js + Tailwind landing page" --auto low --output-format text --dry-run`
5) Provide secrets when prompted by wrappers/workflows (Warp secrets UI or AgentWise secret store).

Factory AI Droids + Vibe coding (Factory-first, AgentWise-orchestrated)
- Skill location: `.factory/skills/vibe-coding/SKILL.md` (auto-discovered by Factory Droids).
- Wrapper: `tools/run-droid.sh` ensures AGENTWISE_TOKEN + FACTORY_API_KEY and logs to `logs/tool-invocations.log`.
- Workflow: `.warp/workflow_droid-vibe.json` runs a dry-run vibe prototype by default.
- Use cases: rapid web UI prototyping, landing pages, dashboards; keep AgentWise as orchestrator.
- Reference: Factory droid CLI reference (non-interactive + interactive): https://docs.factory.ai/reference/cli-reference.md

How Warp interacts with AgentWise
- `.warp/*.json` workflows call `tools/run-*.sh`, which validate tokens, mask args, log to `logs/tool-invocations.log`, then delegate to AgentWise/Droids.
- All destructive operations require `--confirm`; default to `--dry-run`.

Key workflows to import
- boomware-frontier-health-check (`.warp/workflow_frontier.json`)
  - Runs repo checks, GPU/SSH smoke tests, Frontier model ping.
  - Secrets: FRONTIER_API_KEY, AGENTWISE_TOKEN
- boomware-db-init (`.warp/workflow_db-init.json`)
  - Safe DB init/migration via `tools/run-db.sh` (`--confirm` for destructive).
  - Secrets: AGENTWISE_TOKEN
- boomware-worker-control (`.warp/workflow_worker-control.json`)
  - Start/stop worker groups via `tools/run-worker.sh`; monitor queues.
  - Secrets: AGENTWISE_TOKEN
- boomware-factory-vibe (`.warp/workflow_droid-vibe.json`)
  - Invokes Factory Droids (vibe-coding skill) through `tools/run-droid.sh` (dry-run default).
  - Secrets: FACTORY_API_KEY, AGENTWISE_TOKEN

Recommended Warp snippets
- Frontier smoke:
  ```bash
  curl -s -X POST "${FRONTIER_API_URL}/v1/${FRONTIER_MODEL}/infer" \
    -H "Authorization: Bearer ${FRONTIER_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{ "input": "health check" }' | jq -r '.output'
  ```
- Queue enqueue (dry-run):
  ```bash
  ./tools/run-bullmq.sh --dry-run enqueue --queue=image-processing --payload-file=payload.json
  ```
- Factory Droid vibe prototype (safe):
  ```bash
  ./tools/run-droid.sh exec --prompt "vibe-code a SvelteKit admin dashboard" --auto low --output-format text --dry-run
  ```

Proceed with development
- GPT‑5.1 Codex (AgentWise brain) may generate wrappers, `.warp/` workflows, scripts, docs (including this file) and run dry-run validations. Request secrets only when truly needed for privileged steps. AgentWise remains the orchestrator even when Factory Droids execute tasks.

Troubleshooting & common checks
- Check logs: `tail -n 20 logs/tool-invocations.log`
- Validate workflows: `jq . .warp/workflow_frontier.json` and `jq . .warp/workflow_droid-vibe.json`
- Wrapper syntax: `sh -n tools/run-bullmq.sh` and `sh -n tools/run-droid.sh`

Notes & security
- No secrets in repo. Use Warp secrets or AgentWise secret management.
- All wrapper logs are masked; keep `logs/` protected and rotated.

Attribution
- "Scaffolding assisted by tabletman + GPT‑5.1 Codex (AgentWise brain)"
