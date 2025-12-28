# Comprehensive Refactoring Prompt for ChatGPT 5.1 (o1)
## Boom Warehouse - Autonomous Software Development Command Center Setup

---

## 🎯 MISSION STATEMENT

You are tasked with refactoring the entire Boom Warehouse project to establish **Warp (warp.dev) as the autonomous software development command center**, following the strict architectural guidelines defined in `AGENTS.md` and `WARP.md`. Your goal is to transform this codebase into a system where:

- **Humans ideate and solve problems**
- **AI autonomously codes, tests, and deploys**
- **AgentWise orchestrates all autonomous work**
- **Warp serves as the command center UI**
- **Vibe coding is enabled** - frictionless, flow-state development with AI assistance

---

## 📋 PROJECT CONTEXT

### What is Boom Warehouse?
A modern e-commerce platform for used electronics/appliances with an **AI-powered autonomous multi-marketplace listing system**. The platform automatically:
- Analyzes product images using Claude 3.5 Sonnet vision AI
- Researches market prices from sold listings
- Optimizes pricing strategies (fast sale, balanced, maximize profit)
- Lists products across multiple platforms (eBay, Facebook, Mercari, etc.)
- Self-heals failed listings and adjusts prices over time

### Current Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Supabase (PostgreSQL), SQLite (autonomous listing inventory)
- **AI/ML**: Claude 3.5 Sonnet (Anthropic), GPT-4 Vision
- **Automation**: Playwright (browser automation)
- **APIs**: eBay Sell API, Anthropic Claude, remove.bg
- **Job Queues**: EventEmitter (future: BullMQ + Redis)
- **Payment**: Stripe
- **Media**: Cloudinary

### Infrastructure Already Created
The following files have been set up as part of the AgentWise/Warp infrastructure:

1. **Tools (Wrappers)** - `tools/`
   - `_helpers.sh` - Common helper functions (logging, token validation, argument masking)
   - `run-agentwise.sh` - AgentWise CLI wrapper
   - `run-bullmq.sh` - BullMQ job queue wrapper
   - `run-docker.sh` - Docker command wrapper

2. **Scripts** - `scripts/`
   - `warp-frontier-check.sh` - Health checks, GPU checks, SSH connectivity, Frontier API smoke tests
   - `setup-warp-env.sh` - Automated setup for Warp workflows and wrappers

3. **Warp Workflows** - `.warp/`
   - `workflow_frontier.json` - Health check workflow
   - `workflow_db-init.json` - Database initialization workflow
   - `workflow_worker-control.json` - Worker control workflow

---

## 📖 ARCHITECTURAL PRINCIPLES (from AGENTS.md & WARP.md)

### Core Principle: AgentWise as Orchestrator
- **AgentWise is the single authoritative orchestration hub** for all autonomous and semi-autonomous work
- All AI assistants, CLIs, and helper tools **MUST** accept tasks from AgentWise
- Direct human calls to automation in production workflows are **discouraged**
- Use AgentWise to dispatch, audit, and retry tasks

### Wrapper Contract
All tools MUST be invoked via signed wrapper scripts in `tools/` with this contract:
- **Input**: Single JSON argument (task payload) or STDIN JSON
- **Validation**: Wrapper checks `AGENTWISE_TOKEN` (environment) or signed token file before running
- **Output**: Wrapper returns JSON `{ success: bool, data: {...}, logs: "..." }`
- **Location**: `tools/run-*.sh`
- **Logging**: All invocations logged to `logs/tool-invocations.log`
- **Security**: Secrets masked in logs, no direct tool access

### Agent Roles (AgentWise-managed)
1. **VisionAgent** - Analyzes product images, outputs metadata (title, make/model, condition, categories)
2. **MarketIntelAgent** - Researches market (sold prices, comparable items)
3. **PriceOptimizerAgent** - Generates pricing strategy + price schedule (drops at day 7/14/21)
4. **ImageProcessorAgent** - Optimizes images per platform specs
5. **ListingExecutorAgent** - Creates listings + tracking IDs
6. **SwarmOrchestrator** - Coordinates agents, manages retries, rate-limits, logging

### Warp as Command Center
- **Purpose**: Central UI to run repo health checks, AgentWise tasks, worker control, model endpoint smoke tests, deploy operations
- **Principle**: AgentWise is the canonical executor; Warp triggers AgentWise wrappers
- **Rule**: Do NOT run external tools directly from Warp unless they call signed wrappers

---

## 🔧 REFACTORING REQUIREMENTS

### Phase 1: Code Audit & Convention Documentation
1. **Analyze Existing Codebase**
   - Review all TypeScript/JavaScript files in `src/`, `app/`, `components/`, `lib/`, `actions/`, `db/`
   - Document current architectural patterns, naming conventions, error handling patterns
   - Identify direct tool invocations that bypass AgentWise
   - Map out agent workflows currently implemented
   - Document database schemas (Supabase + SQLite)

2. **Create Convention Manifest**
   - Document TypeScript conventions (strict mode, path aliases `@/*`)
   - Document React patterns (Server Components, Client Components, hooks usage)
   - Document Next.js patterns (App Router, API routes, middleware)
   - Document database patterns (Drizzle ORM, query organization)
   - Document error handling and logging patterns
   - Document testing patterns (if tests exist)

### Phase 2: AgentWise Integration
1. **Refactor Autonomous Listing Agents**
   - Ensure all 6 agents (Vision, MarketIntel, PriceOptimizer, ImageProcessor, ListingExecutor, SwarmOrchestrator) follow AgentWise patterns
   - Implement proper task acceptance from AgentWise dispatcher
   - Add retry logic, rate limiting, and comprehensive logging
   - Ensure all agent invocations go through `tools/run-agentwise.sh`

2. **Create Missing Wrappers**
   - `tools/run-droid.sh` - Wrapper for autonomous code generation tasks
   - `tools/run-db.sh` - Database migration/seed wrapper with `--dry-run` and `--confirm`
   - `tools/run-worker.sh` - Worker start/stop/status wrapper
   - `tools/run-claude.sh` - Claude API wrapper for vision/text tasks
   - `tools/run-ebay.sh` - eBay API wrapper
   - `tools/run-playwright.sh` - Playwright automation wrapper

3. **Implement Signed Token System**
   - Create `${HOME}/.agentwise_token` token file system
   - Implement token validation in all wrappers
   - Add token rotation mechanism
   - Document token management in `WARP.md`

4. **Enhance Logging System**
   - Ensure all wrappers log to `logs/tool-invocations.log` with timestamp, wrapper, actor, masked args
   - Add log rotation (daily, keep 30 days)
   - Create `logs/agent_logs/` for agent-specific logs
   - Implement structured JSON logging for machine parsing

### Phase 3: Database & Job Queue Refactoring
1. **BullMQ Integration**
   - Replace EventEmitter with BullMQ + Redis
   - Implement job queues: `image-processing`, `market-intel`, `listing-execution`, `price-updates`
   - Add job retry logic, priority handling, and rate limiting
   - Create job monitoring dashboard accessible via Warp

2. **Database Schema Standardization**
   - Ensure SQLite schema (`data/boomware.db`) follows conventions
   - Add missing indexes for performance
   - Implement proper foreign key constraints
   - Create migration system managed via `tools/run-db.sh`

3. **Add AgentWise Metadata Tables**
   - `agentwise_tasks` - Task queue managed by AgentWise
   - `agentwise_executions` - Execution history with success/failure/retry counts
   - `agentwise_locks` - Distributed locks for concurrent task prevention

### Phase 4: Warp Workflow Expansion
1. **Create Comprehensive Workflows**
   - `workflow_listing-pipeline.json` - Full autonomous listing workflow
   - `workflow_price-optimizer.json` - Scheduled price adjustments
   - `workflow_market-research.json` - Batch market analysis
   - `workflow_image-batch.json` - Batch image processing
   - `workflow_heal-failed.json` - Self-healing retry workflow
   - `workflow_analytics.json` - Generate sales/performance reports
   - `workflow_backup.json` - Database backup workflow
   - `workflow_deploy.json` - Deployment workflow (staging → production)

2. **Workflow Best Practices**
   - All workflows must use `--dry-run` first
   - All destructive actions require `--confirm` flag
   - All secrets sourced from Warp secrets (never in repo)
   - All workflows have rollback steps
   - All workflows log to dedicated log files

### Phase 5: CLI Refactoring
1. **Refactor Existing CLI** (presumably in `scripts/` or as npm scripts)
   - Ensure all CLI commands invoke AgentWise wrappers
   - Add `--dry-run` support to all commands
   - Standardize output format (JSON mode, human-readable mode)
   - Add progress indicators for long-running tasks

2. **Create AgentWise CLI Integration**
   ```bash
   # Instead of direct CLI calls:
   npm run cli analyze ./photo.jpg
   
   # Should become:
   ./tools/run-agentwise.sh task:create --type analyze --input ./photo.jpg
   ```

### Phase 6: Warp Setup for Vibe Coding

This is a **critical phase** for enabling frictionless, flow-state development. Warp must be configured perfectly to support vibe coding.

#### 1. **Warp AI Integration**
   - Enable Warp AI (Cmd/Ctrl + `) for inline command suggestions
   - Configure AI model preferences (prefer GPT-4 or Claude for complex tasks)
   - Set up AI context awareness to understand project structure
   - Create custom AI prompts for common development tasks

#### 2. **Workflow Organization**
   Create workflow categories for different development modes:
   
   **🚀 Quick Actions** (Daily use, < 10 seconds)
   - `workflow_quick-test.json` - Run relevant tests for current file
   - `workflow_quick-lint.json` - Lint and fix current directory
   - `workflow_quick-build.json` - Fast incremental build
   - `workflow_quick-deploy-preview.json` - Deploy to preview environment
   
   **🔨 Development Flows** (Active coding, 1-5 minutes)
   - `workflow_dev-server.json` - Start dev server with hot reload
   - `workflow_dev-test-watch.json` - Run tests in watch mode
   - `workflow_dev-db-reset.json` - Reset local database with seed data
   - `workflow_dev-debug.json` - Start Node debugger with proper source maps
   
   **🤖 AI-Assisted Tasks** (Let AI do the work, 5-30 minutes)
   - `workflow_ai-feature.json` - Create new feature with AI guidance
   - `workflow_ai-refactor.json` - AI-guided refactoring
   - `workflow_ai-test-gen.json` - Generate tests for existing code
   - `workflow_ai-docs-gen.json` - Generate/update documentation
   
   **🔍 Analysis & Debugging** (Investigation mode)
   - `workflow_analyze-performance.json` - Profile and analyze performance
   - `workflow_analyze-dependencies.json` - Dependency tree analysis
   - `workflow_analyze-bundle.json` - Bundle size analysis
   - `workflow_debug-production.json` - Connect to production logs/metrics
   
   **📦 Deployment & Release** (Controlled releases)
   - `workflow_deploy-staging.json` - Deploy to staging
   - `workflow_deploy-production.json` - Deploy to production (with confirmations)
   - `workflow_release-prepare.json` - Prepare release (changelog, version bump)
   - `workflow_rollback.json` - Emergency rollback procedure

#### 3. **Custom Warp Blocks**
   Create reusable command blocks (Warp Blocks) for common patterns:
   
   ```yaml
   # .warp/blocks/vibe-coding-blocks.yaml
   blocks:
     - name: "Start Vibe Session"
       description: "Initialize perfect dev environment"
       commands:
         - git fetch origin
         - git status
         - npm ci --prefer-offline
         - ./scripts/warp-frontier-check.sh --dry-run
         - npm run dev
     
     - name: "AI Feature Flow"
       description: "Create feature with AI assistance"
       commands:
         - ./tools/run-agentwise.sh task:create --type feature --interactive
     
     - name: "Quick Ship"
       description: "Test, lint, commit, push in one command"
       commands:
         - npm run type-check
         - npm run lint:fix
         - npm test -- --changed
         - git add .
         - git commit -m "${COMMIT_MSG}"
         - git push
     
     - name: "Vibe Check"
       description: "Comprehensive health check"
       commands:
         - ./scripts/warp-frontier-check.sh --verbose
         - npm run type-check
         - npm run test -- --silent
         - echo "✅ All systems nominal. Ready to vibe."
   ```

#### 4. **Warp Themes & Appearance**
   Optimize visual environment for long coding sessions:
   - **Theme**: Use "Tokyo Night Storm" or custom theme with reduced eye strain
   - **Font**: JetBrains Mono or Fira Code (ligatures enabled) at 13-14pt
   - **Transparency**: 85-90% for ambient awareness
   - **Blur**: Subtle background blur for focus
   - **Prompt**: Minimal prompt with git branch, node version, and status indicators

#### 5. **Keyboard Shortcuts & Muscle Memory**
   Configure shortcuts for flow state:
   ```yaml
   # .warp/keybindings.yaml
   keybindings:
     # Workflow triggers (Cmd/Ctrl + Shift + Number)
     "cmd+shift+1": "run-workflow:quick-test"
     "cmd+shift+2": "run-workflow:quick-lint"
     "cmd+shift+3": "run-workflow:quick-build"
     "cmd+shift+4": "run-workflow:dev-server"
     
     # AI assistance (Cmd/Ctrl + K)
     "cmd+k cmd+a": "warp-ai:explain-command"
     "cmd+k cmd+f": "warp-ai:find-command"
     "cmd+k cmd+r": "warp-ai:refactor-suggestion"
     
     # Quick actions (Cmd/Ctrl + Shift + Letter)
     "cmd+shift+t": "open-block:Start Vibe Session"
     "cmd+shift+c": "open-block:Vibe Check"
     "cmd+shift+s": "open-block:Quick Ship"
   ```

#### 6. **Warp Snippets for Common Patterns**
   Create snippets for repetitive commands:
   ```yaml
   # .warp/snippets.yaml
   snippets:
     # AgentWise task creation
     - trigger: "aw:create"
       expansion: "./tools/run-agentwise.sh task:create --type ${1:feature} --description \"${2}\""
     
     # Wrapper invocations
     - trigger: "wrap:agent"
       expansion: "./tools/run-agentwise.sh --dry-run ${1:command}"
     
     - trigger: "wrap:queue"
       expansion: "./tools/run-bullmq.sh ${1:enqueue} --queue=${2:default} --payload-file=${3:job.json}"
     
     # Testing patterns
     - trigger: "test:file"
       expansion: "npm test -- ${1:path/to/test.ts} --watch"
     
     - trigger: "test:debug"
       expansion: "node --inspect-brk node_modules/.bin/jest --runInBand ${1}"
     
     # Git flow
     - trigger: "git:feature"
       expansion: |
         git checkout -b feature/${1:feature-name}
         git push -u origin feature/${1:feature-name}
     
     # Quick debugging
     - trigger: "debug:logs"
       expansion: "tail -f logs/tool-invocations.log logs/app.log"
     
     - trigger: "debug:agent"
       expansion: "tail -f logs/agent_logs/${1:agent-name}.log | jq -C ."
   ```

#### 7. **Warp Layouts for Different Contexts**
   Save layouts for different work modes:
   
   **Layout 1: Solo Dev Mode**
   - Main pane: Dev server output
   - Right split: Test runner in watch mode
   - Bottom split: Quick commands / AI chat
   
   **Layout 2: AI Pair Programming**
   - Left pane: Code editor (via Warp)
   - Right large pane: AgentWise orchestration logs
   - Bottom: Warp AI for questions and suggestions
   
   **Layout 3: Debug Mode**
   - Top left: Application logs (tail -f)
   - Top right: Agent logs (tail -f)
   - Bottom left: Interactive debugger
   - Bottom right: Quick test runner
   
   **Layout 4: Production Support**
   - Top: Production logs
   - Middle: Database query interface
   - Bottom: Quick deployment / rollback commands

#### 8. **Ambient Awareness Features**
   Configure notifications and ambient indicators:
   - **Workflow status**: Show workflow status in Warp status bar
   - **Build notifications**: Native notifications for build completion (success/failure)
   - **Test results**: Inline test results in command output with rich formatting
   - **Git status**: Persistent git status indicator in prompt
   - **Agent activity**: Live indicator when agents are working

#### 9. **Warp AI Context Configuration**
   Configure AI to understand your codebase:
   ```yaml
   # .warp/ai-context.yaml
   context:
     project_type: "Next.js 14 + TypeScript E-commerce Platform"
     key_technologies:
       - Next.js 14 (App Router)
       - TypeScript (strict mode)
       - Drizzle ORM
       - Tailwind CSS
       - AgentWise orchestration
     
     conventions:
       - "Always use @/* path aliases"
       - "Server Components by default, Client Components with 'use client'"
       - "All database queries via Drizzle ORM"
       - "All tool invocations via wrappers in tools/"
       - "All secrets from environment variables"
     
     helpful_commands:
       - "npm run dev - Start development server"
       - "npm run type-check - TypeScript validation"
       - "./tools/run-agentwise.sh - AgentWise wrapper"
       - "./scripts/warp-frontier-check.sh - Health check"
     
     common_tasks:
       - "Create new agent: Follow pattern in existing agents"
       - "Add workflow: Create JSON in .warp/, validate with jq"
       - "Add wrapper: Use tools/_helpers.sh, follow run-*.sh pattern"
   ```

#### 10. **Vibe Coding Session Initializer**
   Create a dedicated session starter:
   ```bash
   # scripts/start-vibe-session.sh
   #!/usr/bin/env bash
   set -euo pipefail
   
   echo "🎵 Initializing vibe coding session..."
   
   # 1. Health check
   echo "⚡ Running health checks..."
   ./scripts/warp-frontier-check.sh --dry-run
   
   # 2. Git sync
   echo "📦 Syncing with remote..."
   git fetch origin
   git status
   
   # 3. Dependencies
   echo "📚 Checking dependencies..."
   npm ci --prefer-offline --silent
   
   # 4. Start services
   echo "🚀 Starting development services..."
   # Start dev server in background
   npm run dev > logs/dev-server.log 2>&1 &
   DEV_PID=$!
   echo $DEV_PID > /tmp/boomware-dev.pid
   
   # Start test watcher in background
   npm test -- --watch > logs/test-watch.log 2>&1 &
   TEST_PID=$!
   echo $TEST_PID > /tmp/boomware-test.pid
   
   # 5. Open layout
   echo "🎨 Configuring Warp layout..."
   # (Warp API call to load "Solo Dev Mode" layout)
   
   # 6. Ready
   echo ""
   echo "✅ Vibe session ready!"
   echo "   Dev server: http://localhost:3000 (PID: $DEV_PID)"
   echo "   Test watcher: Running (PID: $TEST_PID)"
   echo "   Logs: logs/dev-server.log, logs/test-watch.log"
   echo ""
   echo "🎧 Time to vibe code! Use Cmd+Shift+T for quick actions."
   echo "💡 Type 'aw:create' to start an AI-assisted task."
   echo ""
   ```

#### 11. **Documentation in Warp**
   Add documentation workflows:
   ```json
   // .warp/workflow_docs-quick.json
   {
     "name": "boomware-docs-quick-reference",
     "description": "Quick reference for common development tasks",
     "steps": [
       { "name": "Show workflows", "cmd": "ls -1 .warp/*.json | xargs -n1 basename" },
       { "name": "Show wrappers", "cmd": "ls -1 tools/run-*.sh | xargs -n1 basename" },
       { "name": "Show agent roles", "cmd": "grep -A2 'Agent Roles' AGENTS.md" },
       { "name": "Show recent logs", "cmd": "tail -20 logs/tool-invocations.log" }
     ]
   }
   ```

#### 12. **Warp + IDE Integration**
   For developers who also use VS Code / Cursor:
   - Create tasks.json that mirrors Warp workflows
   - Share snippets between Warp and IDE
   - Use Warp for CLI/deployment, IDE for code editing
   - Configure Warp to open files in IDE: `code path/to/file.ts`

### Phase 7: Security & Secrets Management
1. **Audit Current Secret Handling**
   - Identify all API keys, tokens, credentials in code
   - Move all secrets to environment variables
   - Document required secrets in `WARP.md`
   - Create `.env.example` with placeholder values

2. **Implement Warp Secrets Integration**
   - Document how to set Warp secrets in `WARP.md`
   - Update all wrappers to source secrets from Warp or environment
   - Implement secret rotation capability
   - Add secret validation on startup

3. **Add Security Checks**
   - Implement wrapper authentication via `AGENTWISE_TOKEN`
   - Add rate limiting to prevent abuse
   - Implement audit logging for all privileged operations
   - Add IP whitelisting for production wrappers

### Phase 7: Security & Secrets Management
1. **Audit Current Secret Handling**
   - Identify all API keys, tokens, credentials in code
   - Move all secrets to environment variables
   - Document required secrets in `WARP.md`
   - Create `.env.example` with placeholder values

2. **Implement Warp Secrets Integration**
   - Document how to set Warp secrets in `WARP.md`
   - Update all wrappers to source secrets from Warp or environment
   - Implement secret rotation capability
   - Add secret validation on startup

3. **Add Security Checks**
   - Implement wrapper authentication via `AGENTWISE_TOKEN`
   - Add rate limiting to prevent abuse
   - Implement audit logging for all privileged operations
   - Add IP whitelisting for production wrappers

### Phase 8: Documentation & Developer Experience
1. **Update README.md**
   - Add "Autonomous Development with Warp" section
   - Document AgentWise setup and usage
   - Add workflow import instructions
   - Document wrapper development guidelines
   - **Add "Vibe Coding Setup" section** with quick start guide

2. **Create DEVELOPMENT.md**
   - Step-by-step onboarding for new developers
   - How to install AgentWise: `npm i -g agentwise`
   - How to configure Warp workflows
   - How to create new wrappers
   - How to test agents locally
   - Troubleshooting common issues
   - **Vibe coding best practices and tips**

3. **Create WRAPPER_GUIDE.md**
   - Template for creating new wrappers
   - Best practices for wrapper development
   - Testing wrappers with `--dry-run`
   - Logging and error handling patterns

4. **Update WARP.md**
   - Add newly created workflows
   - Document all available Warp secrets
   - Add troubleshooting section
   - Add Warp snippets for common tasks
   - **Add complete vibe coding configuration guide**

5. **Create VIBE_CODING.md** (NEW)
   - Philosophy of vibe coding with AI
   - Warp configuration walkthrough
   - Keyboard shortcuts reference
   - Workflow organization patterns
   - AI-assisted development tips
   - Flow state optimization techniques

### Phase 9: Testing & Validation
1. **Create Test Suite**
   - Unit tests for all agents
   - Integration tests for workflows
   - End-to-end tests for full listing pipeline
   - Wrapper validation tests

2. **Add Dry-Run Tests**
   - Test all wrappers in `--dry-run` mode
   - Validate all workflows in dry-run mode
   - Ensure no destructive actions occur in dry-run

3. **Create Health Check System**
   - Expand `warp-frontier-check.sh` to test all components
   - Add agent health checks
   - Add database connectivity checks
   - Add API endpoint checks (eBay, Claude, etc.)
   - Add queue health checks

### Phase 9: Testing & Validation
1. **Create Test Suite**
   - Unit tests for all agents
   - Integration tests for workflows
   - End-to-end tests for full listing pipeline
   - Wrapper validation tests

2. **Add Dry-Run Tests**
   - Test all wrappers in `--dry-run` mode
   - Validate all workflows in dry-run mode
   - Ensure no destructive actions occur in dry-run

3. **Create Health Check System**
   - Expand `warp-frontier-check.sh` to test all components
   - Add agent health checks
   - Add database connectivity checks
   - Add API endpoint checks (eBay, Claude, etc.)
   - Add queue health checks

### Phase 10: CI/CD Integration
1. **Create GitHub Actions Workflows**
   - `.github/workflows/health-check.yml` - Run health checks on PR
   - `.github/workflows/test.yml` - Run test suite
   - `.github/workflows/deploy.yml` - Deploy via Warp workflow
   - `.github/workflows/wrapper-validation.yml` - Validate all wrappers

2. **Add Pre-commit Hooks**
   - Validate wrapper syntax
   - Check for hardcoded secrets
   - Run TypeScript type checking
   - Run linting

---

## 🎨 CODE STYLE & CONVENTIONS

### TypeScript
- **Strict mode**: Always enabled (`strict: true`)
- **Path aliases**: Use `@/*` for imports (configured in `tsconfig.json`)
- **No `any` types**: Use proper types or `unknown` with type guards
- **Async/await**: Prefer over promises with `.then()`
- **Error handling**: Always use try-catch with proper error types

### Next.js Patterns
- **Server Components**: Default for pages/layouts
- **Client Components**: Only when needed (`'use client'` directive)
- **API Routes**: Use App Router API routes in `app/api/`
- **Metadata**: Export metadata from pages for SEO

### React Patterns
- **Hooks**: Use custom hooks for shared logic
- **Component naming**: PascalCase for components
- **Props**: Destructure with TypeScript interfaces
- **State management**: Use React hooks, consider Zustand for global state

### Database Patterns
- **Drizzle ORM**: Use for all database queries
- **Query organization**: Separate query files in `db/queries/`
- **Schema definition**: Define in `db/schema/`
- **Transactions**: Use for multi-step operations

### Error Handling
- **Wrapper errors**: Return JSON with `{ success: false, error: "message" }`
- **Agent errors**: Log to agent logs, emit events for SwarmOrchestrator
- **API errors**: Return proper HTTP status codes with error messages
- **Client errors**: Use toast notifications (Sonner)

### Logging
- **Wrapper logs**: `logs/tool-invocations.log` (masked secrets)
- **Agent logs**: `logs/agent_logs/{agent_name}.log` (structured JSON)
- **Application logs**: `logs/app.log` (structured JSON with timestamp, level, message, context)
- **Access logs**: `logs/access.log` (HTTP requests)

---

## 🚀 DELIVERABLES

### 1. Refactored Codebase
- All agents follow AgentWise patterns
- All tool invocations go through wrappers
- All secrets managed via environment/Warp secrets
- All workflows functional and tested

### 2. Complete Wrapper Set
- All wrappers in `tools/` directory
- All wrappers executable and tested
- All wrappers documented in `WRAPPER_GUIDE.md`

### 3. Expanded Warp Workflows
- All workflows in `.warp/` directory
- All workflows documented in `WARP.md`
- All workflows tested in dry-run mode
- **Vibe coding workflows** (Quick Actions, Development Flows, AI-Assisted Tasks, etc.)

### 4. Warp Vibe Coding Configuration
- Complete Warp setup for optimal developer experience
- Keyboard shortcuts configured for muscle memory
- Custom blocks for common patterns
- Snippets for repetitive commands
- Layouts for different work contexts
- AI context configuration
- Session initializer script
- Theme and appearance optimized for long sessions

### 5. Comprehensive Documentation
- `README.md` - Updated with Warp/AgentWise sections and vibe coding quick start
- `DEVELOPMENT.md` - New developer onboarding guide with vibe coding tips
- `WRAPPER_GUIDE.md` - Wrapper development guide
- `WARP.md` - Updated with all workflows, secrets, and vibe coding config
- `AGENTS.md` - Updated with implementation details
- **`VIBE_CODING.md`** - Complete guide to vibe coding with Warp + AI (NEW)

### 6. Testing Infrastructure
- Unit tests for agents
- Integration tests for workflows
- Health check system
- CI/CD workflows

### 7. Migration Guide
- Step-by-step guide to migrate from current system to AgentWise-managed system
- Rollback plan if issues arise
- Production deployment checklist

---

## ⚠️ CRITICAL CONSTRAINTS

### DO NOT
- ❌ Break existing functionality during refactoring
- ❌ Store secrets in code or config files committed to repo
- ❌ Create direct tool invocations that bypass AgentWise
- ❌ Remove existing features without discussion
- ❌ Change database schema without migrations
- ❌ Deploy to production without testing in dry-run mode

### ALWAYS
- ✅ Test in `--dry-run` mode first
- ✅ Validate JSON files before committing
- ✅ Mask secrets in logs
- ✅ Document new patterns in DEVELOPMENT.md
- ✅ Add error handling and retry logic
- ✅ Log all operations for audit trail
- ✅ Use TypeScript strict mode
- ✅ Write tests for critical paths

---

## 📊 SUCCESS CRITERIA

The refactoring is complete and successful when:

1. ✅ **All agents integrate with AgentWise**
   - No direct CLI tool calls
   - All agent invocations logged
   - All agents support retry and rate limiting

2. ✅ **All wrappers functional**
   - All wrappers validate `AGENTWISE_TOKEN`
   - All wrappers support `--dry-run`
   - All wrappers log to `logs/tool-invocations.log`
   - All wrappers return JSON output

3. ✅ **All Warp workflows operational**
   - All workflows can be imported to Warp
   - All workflows run successfully in dry-run mode
   - All workflows source secrets from Warp secrets
   - All workflows have rollback procedures

4. ✅ **Health checks pass**
   - `warp-frontier-check.sh` runs without errors
   - All APIs reachable (Claude, eBay, etc.)
   - All databases accessible
   - All queues operational

5. ✅ **Documentation complete**
   - All new patterns documented
   - All workflows documented in WARP.md
   - Developer onboarding guide created
   - Troubleshooting guide available

6. ✅ **Tests pass**
   - All unit tests pass
   - All integration tests pass
   - All workflows tested in dry-run
   - No security vulnerabilities

7. ✅ **Developer experience improved**
   - New developers can onboard in < 1 hour
   - Common tasks accessible via Warp workflows
   - Clear error messages and logs
   - Easy to debug and troubleshoot

---

## 🎯 AUTONOMOUS DEVELOPMENT VISION

After this refactoring, the development workflow should be:

### Human Developer Flow
1. **Ideate**: "We need to add support for listing on Amazon marketplace"
2. **Create Task**: Open Warp, run workflow to create AgentWise task
3. **AI Executes**: AgentWise dispatches agents to implement feature
4. **Review**: Human reviews PR generated by AI, provides feedback
5. **Deploy**: Human approves, Warp workflow deploys to production

### Example Autonomous Flow
```bash
# In Warp terminal
./tools/run-agentwise.sh task:create \
  --type feature \
  --description "Add Amazon marketplace listing support" \
  --requirements "Use Amazon MWS API, follow existing agent patterns" \
  --tests "Integration test with sandbox API"

# AgentWise orchestrates:
# 1. CodeAnalysisAgent - Analyzes existing marketplace integrations
# 2. ArchitectAgent - Designs Amazon integration following patterns
# 3. CodingAgent - Implements AmazonListingAgent
# 4. TestingAgent - Creates tests
# 5. DocumentationAgent - Updates docs
# 6. ReviewAgent - Self-reviews code
# 7. PRAgent - Creates pull request

# Human reviews PR, approves
# Warp workflow deploys to staging, runs tests, deploys to production
```

---

## 🔍 REFACTORING CHECKLIST

Use this checklist to track progress:

### Phase 1: Audit
- [ ] Analyze all TypeScript/JavaScript files
- [ ] Document current patterns and conventions
- [ ] Identify direct tool invocations
- [ ] Map existing agent workflows
- [ ] Document database schemas

### Phase 2: AgentWise Integration
- [ ] Refactor VisionAgent
- [ ] Refactor MarketIntelAgent
- [ ] Refactor PriceOptimizerAgent
- [ ] Refactor ImageProcessorAgent
- [ ] Refactor ListingExecutorAgent
- [ ] Refactor SwarmOrchestrator
- [ ] Create missing wrappers
- [ ] Implement token system
- [ ] Enhance logging

### Phase 3: Database & Queues
- [ ] Integrate BullMQ + Redis
- [ ] Standardize database schema
- [ ] Add AgentWise metadata tables
- [ ] Create migration system

### Phase 4: Warp Workflows
- [ ] Create listing pipeline workflow
- [ ] Create price optimizer workflow
- [ ] Create market research workflow
- [ ] Create image batch workflow
- [ ] Create heal-failed workflow
- [ ] Create analytics workflow
- [ ] Create backup workflow
- [ ] Create deploy workflow

### Phase 5: CLI Refactoring
- [ ] Refactor existing CLI commands
- [ ] Add dry-run support
- [ ] Standardize output format
- [ ] Integrate with AgentWise

### Phase 6: Security
- [ ] Audit secret handling
- [ ] Move secrets to environment
- [ ] Implement Warp secrets integration
- [ ] Add security checks

### Phase 7: Documentation
- [ ] Update README.md
- [ ] Create DEVELOPMENT.md
- [ ] Create WRAPPER_GUIDE.md
- [ ] Update WARP.md

### Phase 8: Testing
- [ ] Create test suite
- [ ] Add dry-run tests
- [ ] Create health check system

### Phase 9: CI/CD
- [ ] Create GitHub Actions workflows
- [ ] Add pre-commit hooks

---

## 📞 SUPPORT & QUESTIONS

If you need clarification on any aspect of this refactoring:

1. **Review existing files**:
   - Read `AGENTS.md` for AgentWise principles
   - Read `WARP.md` for Warp integration patterns
   - Review existing wrappers in `tools/`
   - Review existing workflows in `.warp/`

2. **Refer to examples**:
   - Wrapper example: `tools/run-bullmq.sh`
   - Helper functions: `tools/_helpers.sh`
   - Health check: `scripts/warp-frontier-check.sh`

3. **Follow patterns**:
   - All wrappers follow same structure
   - All workflows follow same schema
   - All agents follow same interface

---

## 🎓 LEARNING RESOURCES

- **AgentWise**: https://agentwise.dev (conceptual - adapt to this project)
- **Warp**: https://warp.dev
- **BullMQ**: https://docs.bullmq.io
- **Next.js**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **TypeScript**: https://typescriptlang.org/docs

---

## 🏁 FINAL NOTES

This is a **comprehensive refactoring** to establish a **new development paradigm** where:
- **AI does the coding**
- **Humans do the ideating and reviewing**
- **AgentWise orchestrates the work**
- **Warp provides the command center**

Take your time, follow the patterns established in `AGENTS.md` and `WARP.md`, test everything in dry-run mode first, and document as you go.

**The goal is not just to refactor code, but to establish a new way of building software autonomously while maintaining human oversight and control.**

Good luck! 🚀
