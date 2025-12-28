# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## AgentWise Policy (must follow)
- AgentWise is the sole orchestrator for automation. Prefer invoking tasks via AgentWise commands rather than direct human/manual runs.
- External tools/CLIs should be invoked through signed wrappers under `tools/run-*.sh` that check `AGENTWISE_TOKEN` and log to `logs/tool-invocations.log`. If you need a new integration, add a wrapper instead of calling tools directly.
- Agents managed by AgentWise: VisionAgent, MarketIntelAgent, PriceOptimizerAgent, ImageProcessorAgent, ListingExecutorAgent; SwarmOrchestrator coordinates them.

## How to run / common commands
- Install deps (Node 18+): `npm install`
- Initialize local SQLite DB (creates `data/inventory.db`): `npm run db:init`
- Dev pipeline (CLI demo): `npm run dev`
- Watch mode for automated processing: `npm run watch`
- Build TypeScript: `npm run build`
- Start workers (requires Redis): `npm run worker:start`
- Metrics dashboard (emits metrics): `npm run metrics:dashboard`
- Clean BullMQ queue: `npm run clean:queue`
- CLI entry point (full pipeline / subcommands): `npm run cli -- <args>` e.g., `npm run cli -- list ./photos/item.jpg --platforms ebay --mock`

## Testing
- Full test script: `npm test` (runs `tsx tests/load-test.ts`)
- DB-focused tests: `npm run db:test`
- Image pipeline tests: `npm run img:test`
- Run a single spec directly: `npx tsx tests/agents/image-processor.test.ts`
- Playwright visual test (if needed): `npx playwright test tests/visual/landing-page.spec.ts`

## Environment & data
- Copy `.env.example` → `.env` and set at least `ANTHROPIC_API_KEY`; optional: `REMOVE_BG_API_KEY`, `EBAY_CLIENT_ID/SECRET`, `EBAY_SANDBOX`, Redis host/port.
- DB file lives in `data/inventory.db`; schema at `data/schema.sql`. Scripts assume working directory is repo root.
- Redis is required for BullMQ queues (`src/lib/queue/*`) and cache (`src/lib/cache/cache-manager.ts`). Without Redis, queue/worker commands will fail.
- eBay listing in production mode needs real policy IDs and credentials; `ListingExecutorAgent` supports `mockMode` to simulate listings.

## High-level architecture
- Core pipeline (CLI or AgentWise): image(s) → `OptimizedVisionAgent` (Claude vision) → `ImageProcessorAgent` (sharp, optional remove.bg) → `PriceOptimizerAgent` → `ListingExecutorAgent` (eBay API or mock) → `InventoryManagerAgent` (sqlite via sql.js) → metrics/cache/queue layers.
- Persistence: sqlite via `src/lib/db/client-sqljs.ts`, stored in `data/inventory.db`; typed models in `src/lib/db/types.ts`.
- Queues: BullMQ (`src/lib/queue/job-queue.ts`) with Redis backing; worker orchestration in `src/lib/queue/worker-pool.ts`.
- Caching: L1 LRU + L2 Redis (`src/lib/cache/cache-manager.ts`); reusable cache key helpers in the same file.
- Pricing: `src/lib/agents/price-optimizer.ts` computes strategy, thresholds, auction suggestion.
- Listing: `src/lib/agents/listing-executor.ts` builds payloads; eBay API client in `src/lib/platforms/ebay/`.
- CLI: `scripts/boomware-cli.ts` exposes analyze/list/batch/inventory/sales flows using the agents above; relies on `.env`.
- Initialization: `scripts/init-db.ts` seeds schema; `data/schema.sql` defines inventory/listings/price_history/etc.
- Tests: agent-level tests under `tests/agents/*` (sharp-based image assertions), load test at `tests/load-test.ts`, Playwright spec in `tests/visual/`.

## Project-specific cautions
- Run commands from `boomware-house/` (this directory); paths are relative to here.
- Queue/worker commands need a running Redis instance; otherwise they exit or hang.
- Image tests generate and delete temp files under `tests/agents/test-output`; ensure write permissions.
- eBay production calls will fail without valid policy IDs; use `--mock` during development.
