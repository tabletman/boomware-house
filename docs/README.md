# Boom Warehouse — Documentation (Repo-centric)

Welcome to Boom Warehouse. This documentation focuses strictly on the repository: code, automation framework (AgentWise), Warp integration, and developer workflows. Hardware or workstation notes have been moved to docs/WORKSTATION.md — they are intentionally not part of this README.

Short summary
- Project: Boom Warehouse — e‑commerce storefront with an automated inventory/listing pipeline.
- Repo description: "Boom Warehouse - E‑commerce site with full inventory system."
- Primary languages: HTML (frontend), TypeScript (backend & agents)
- Orchestration: AgentWise coordinates automation; Warp is used as the local "command center".

Contents
- Quickstart
- Architecture & core components
- AgentWise policy & wrappers (must follow)
- Warp integration & workflows
- Scripts & tools (what was added)
- How to run & test locally
- CI & validation
- Knowledge graph & observability
- Contributing

Quickstart (clone and run)
1. Clone the repo:
   ```bash
   git clone https://github.com/tabletman/boomware-house.git
   cd boomware-house
   ```

2. Install dependencies (Node 18+ recommended):
   ```bash
   npm ci
   ```

3. Copy and secure environment:
   ```bash
   cp .env.example .env
   # Edit .env to add required keys (ANTHROPIC_API_KEY, etc.)
   chmod 600 .env
   ```

4. Initialize local DB:
   ```bash
   npm run db:init
   ```

5. Run dev/demo CLI:
   ```bash
   npm run dev
   ```

6. Worker queues (requires Redis):
   ```bash
   npm run worker:start
   ```

High-level architecture
- Orchestrator: AgentWise (canonical orchestrator). All automation should be invoked via AgentWise wrappers in tools/.
- Agents:
  - VisionAgent / OptimizedVisionAgent — vision + embedding tasks
  - ImageProcessorAgent — image processing (sharp, remove.bg)
  - PriceOptimizerAgent — pricing logic and thresholds
  - ListingExecutorAgent — builds and posts listings (eBay integrations or mock)
  - InventoryManagerAgent — SQLite-backed inventory manager
  - SwarmOrchestrator — schedules and coordinates worker tasks
- Persistence & infra:
  - SQLite at `data/inventory.db` (schema at `data/schema.sql`)
  - Queues: BullMQ (Redis-backed)
  - Caching: L1 LRU + L2 Redis
- CLI & entrypoints:
  - `scripts/boomware-cli.ts` — exposes analyze / list / batch / inventory flows

AgentWise policy (required)
- AgentWise is the single source of automation. Prefer AgentWise task invocations over human-run ad‑hoc scripts.
- All external tool invocations must go through signed wrappers under `tools/` (e.g., `tools/run-docker.sh`, `tools/run-bullmq.sh`). Wrappers MUST:
  - Validate `AGENTWISE_TOKEN` (or use AgentWise API auth).
  - Log each invocation to `logs/tool-invocations.log` (timestamped, masked args).
  - Support `--dry-run` and `--help`.
- Do not place secrets in repo files. Use environment variables, Warp secrets, or AgentWise secret store placeholders.

Warp integration & command center
- Warp is the developer command center. Workflows and scripts intended for Warp live under `.warp/` and `scripts/`.
- Key Warp artifacts added:
  - `.warp/workflow_frontier.json` — health-check & smoke-test workflow (import into Warp).
  - `scripts/warp-frontier-check.sh` — idempotent health + smoke test script (executable, includes dry-run & validations).
  - `scripts/setup-warp-env.sh` (installer) — sets up Warp artifacts and validates environment (created by the setup installer).
- After importing workflows into Warp, set required secrets (FRONTIER_API_KEY, AGENTWISE_TOKEN) in Warp's secret store.

Scripts & tools (what's present / created)
- scripts/warp-frontier-check.sh — health checks: system, optional GPU, SSH connectivity to remote host, Frontier smoke test.
- scripts/setup-warp.sh (or setup-warp-env.sh) — idempotent installer that writes `.warp/` workflows, scripts, and optionally docs. Supports `--docs`, `--commit`, `--dry-run` flags.
- tools/run-*.sh — (templates expected) wrappers that validate AgentWise token, log invocations, support dry-run, and mask secrets. Add the following wrappers (recommended):
  - tools/run-bullmq.sh — enqueue / status wrappers for BullMQ
  - tools/run-docker.sh — wrap docker calls and mask credentials
  - tools/run-agentwise.sh — generic AgentWise API wrapper
- docs/GPT5_CODEX_PROMPT.md and docs/GPT5_AGENTWISE_PROMPT.md — model prompts for Codex / GPT-5.1 to act as AgentWise brain and produce artifacts.

How to run & test locally
- Quick health check:
  ```bash
  bash scripts/warp-frontier-check.sh --dry-run
  ```
- Run local unit & integration tests:
  ```bash
  npm test
  npm run db:test
  npm run img:test
  ```
- Playwright visual tests (optional):
  ```bash
  npx playwright test tests/visual/landing-page.spec.ts
  ```

CI & validations
- Recommended CI checks (GitHub Actions):
  - Run `npm ci` and test suite.
  - Lint and typecheck TypeScript.
  - Run `shellcheck` and `shfmt` on shell scripts (tools/ and scripts/).
  - Validate JSON files with `jq`.
- Provide a CI job that performs dry-run of wrapper scripts (`--dry-run`) to ensure wrappers parse correctly.

Knowledge graph & observability
- A generated JSON knowledge graph (docs/KNOWLEDGE_GRAPH.json) models the repo, agents, wrappers, queues and workflows.
- Telemetry recommendations:
  - Expose queue length, job latency, success/failure counts.
  - Emit wrapper invocation counts to a metrics collector (Prometheus or hosted metrics).
  - Aggregated logs to a centralized store (or local rotate in logs/).

Security & secrets
- Place API keys and tokens in:
  - Warp secrets (for Warp workflows)
  - AgentWise secret store (for wrappers)
  - Local `.env` with `chmod 600 .env` for local dev (not for production)
- Use placeholders in repo files: `<ANTHROPIC_API_KEY>`, `<AGENTWISE_TOKEN>`, `<FRONTIER_API_KEY>`, `<EBAY_CLIENT_ID>`

Contributing
- Open issues & PRs for feature work.
- Add tests when adding functionality; update `data/schema.sql` when DB schema changes.
- New automation tasks: add corresponding wrapper under `tools/` and add AgentWise task manifest; add tests that run wrappers in `--dry-run` mode.

Files of interest (quick list)
- scripts/warp-frontier-check.sh — health checks & smoke tests
- .warp/workflow_frontier.json — Warp workflow manifest (importable)
- scripts/boomware-cli.ts — CLI entrypoint
- src/lib/agents/* — agents implementations
- src/lib/queue/* — BullMQ adapters and workers
- data/inventory.db & data/schema.sql — data persistence
- tools/run-*.sh — AgentWise wrappers (must be present for production automation)
- docs/GPT5_AGENTWISE_PROMPT.md — codex/AgentWise brain prompt (guides model behavior)
- docs/KNOWLEDGE_GRAPH.json — knowledge graph (generated meta)

Where to find hardware/workstation notes
- Hardware and workstation-specific instructions were moved out of this README to:
  - docs/WORKSTATION.md
  - docs/POP_OS.md

Need anything committed?
- I can commit updated docs and scripts into the repo and create a branch for a PR. Tell me if you want me to:
  - (A) create the files only locally via a setup script you run in Warp (recommended)
  - (B) create a branch and open a PR (I will provide exact git commands and PR description; I will not push or open PR without your explicit confirmation)

Contact / next steps
- If you want, I will:
  - Generate or improve the wrapper templates in tools/ (recommended).
  - Produce the Warp installer (`scripts/setup-warp-env.sh`) that creates `.warp/` workflows and validates the environment.
  - Create the AgentWise prompt for GPT‑5.1 Codex tuned to build and maintain Boom Warehouse (if you'd like it tailored further with specific task lists, list them now).
