# Vibe Coding with Warp + AgentWise

## What is Vibe Coding?

**Vibe coding** is a development philosophy and practice that optimizes for **flow state**, **minimal friction**, and **AI-assisted productivity**. It's about creating an environment where:

- 🧠 **You think, AI codes** - Focus on problem-solving, let AI handle implementation
- ⚡ **Zero friction** - Everything is one command away
- 🎵 **Flow state** - Stay in the zone with minimal context switching
- 🤖 **Trust the agents** - Let AgentWise orchestrate, you guide
- 🎨 **Aesthetic matters** - Beautiful terminal = better code

When done right, vibe coding feels like **pair programming with an infinitely patient, infinitely knowledgeable teammate who never takes credit**.

---

## The Vibe Coding Stack

### Core Components
1. **Warp** - Command center terminal with AI built-in
2. **AgentWise** - Orchestration layer for autonomous agents
3. **GitHub Copilot** - Inline code suggestions
4. **Claude/GPT-4** - Architecture and refactoring guidance
5. **Your brain** - The most important component

### Why This Stack?
- **Warp**: Beautiful, fast, AI-native terminal with workflows
- **AgentWise**: Audit trail, orchestration, reliability
- **Multiple AIs**: Different tools for different tasks
- **Your judgment**: Final say on all decisions

---

## Setting Up Your Vibe Environment

### 1. Warp Installation & Configuration

#### Download & Install
```bash
# macOS
brew install --cask warp

# Or download from https://warp.dev
```

#### First-Time Setup
1. Open Warp
2. Sign in (required for AI features)
3. Set up Warp AI (Cmd/Ctrl + `)
4. Enable inline command suggestions

#### Theme & Appearance
For optimal vibe coding:

**Recommended Theme**: Tokyo Night Storm (or similar dark theme)
- Warp Settings → Appearance → Theme
- Look for themes with:
  - High contrast for readability
  - Muted colors to reduce eye strain
  - Distinct syntax highlighting

**Font Settings**:
```yaml
Font: JetBrains Mono (with ligatures)
Size: 13-14pt
Line height: 1.4
Letter spacing: 0
```

**Window Settings**:
```yaml
Transparency: 85-90%
Blur: 10-15%
Vibrancy: Medium
```

This creates "ambient awareness" - you can see what's behind Warp (docs, browser) without switching windows.

### 2. Import Workflows

Import all workflows from `.warp/` directory:

```bash
# In Warp, open Workflows panel
Cmd/Ctrl + Shift + W

# Click "Import Workflow"
# Navigate to: /path/to/boomware-house/.warp/
# Import all .json files
```

**Organize workflows by frequency**:
- ⭐ Star daily-use workflows
- 📁 Create folders: "Quick Actions", "Development", "AI Tasks", "Deployment"

### 3. Configure Keyboard Shortcuts

**Open Warp Settings → Keyboard Shortcuts**

#### Essential Shortcuts
```yaml
# Workflows (muscle memory is key)
Cmd+Shift+1: Run workflow "quick-test"
Cmd+Shift+2: Run workflow "quick-lint"
Cmd+Shift+3: Run workflow "quick-build"
Cmd+Shift+4: Run workflow "dev-server"

# AI assistance
Cmd+K Cmd+A: Ask Warp AI to explain command
Cmd+K Cmd+F: Ask Warp AI to find command
Cmd+K Cmd+R: Ask Warp AI for refactoring suggestions

# Quick blocks
Cmd+Shift+T: Start vibe session
Cmd+Shift+C: Run vibe check
Cmd+Shift+S: Quick ship (test, lint, commit, push)

# Navigation
Cmd+T: New tab
Cmd+W: Close tab
Cmd+1-9: Switch to tab 1-9
```

### 4. Set Up Warp Blocks

Warp Blocks are reusable command snippets. Create these for instant vibe coding:

#### "Start Vibe Session" Block
```bash
#!/usr/bin/env bash
# Initialize perfect dev environment
echo "🎵 Starting vibe session..."
git fetch origin && git status
npm ci --prefer-offline --silent
./scripts/warp-frontier-check.sh --dry-run
echo "✅ Environment ready. Time to vibe!"
npm run dev
```

#### "Vibe Check" Block
```bash
#!/usr/bin/env bash
# Comprehensive health check
echo "🔍 Running vibe check..."
./scripts/warp-frontier-check.sh --verbose
npm run type-check
npm test -- --silent --passWithNoTests
git status
echo "✅ All systems nominal. You're in the vibe zone."
```

#### "Quick Ship" Block
```bash
#!/usr/bin/env bash
# Test, lint, commit, push in one command
echo "🚀 Quick shipping..."
npm run type-check && \
npm run lint:fix && \
npm test -- --changed && \
git add . && \
git commit -m "${1:-Quick update}" && \
git push
echo "✅ Shipped! Back to vibing."
```

#### "AI Feature Flow" Block
```bash
#!/usr/bin/env bash
# Create feature with AI assistance
./tools/run-agentwise.sh task:create \
  --type feature \
  --description "$1" \
  --interactive
```

**To create blocks in Warp**:
1. Run a command
2. Click the "..." menu on the command output
3. "Save as Warp Block"
4. Give it a memorable name and keyboard shortcut

### 5. Warp Snippets

Snippets expand with Tab. Set these up in Warp Settings → Snippets:

```yaml
# AgentWise shortcuts
aw:create → ./tools/run-agentwise.sh task:create --type ${1:feature} --description "${2}"
aw:list → ./tools/run-agentwise.sh task:list --status ${1:pending}
aw:monitor → ./tools/run-agentwise.sh monitor

# Testing shortcuts
test:file → npm test -- ${1:path/to/test.ts} --watch
test:debug → node --inspect-brk node_modules/.bin/jest --runInBand ${1}
test:coverage → npm test -- --coverage --collectCoverageFrom="${1:src/**/*.ts}"

# Git shortcuts
git:feature → git checkout -b feature/${1:feature-name} && git push -u origin feature/${1:feature-name}
git:hotfix → git checkout -b hotfix/${1:issue-name}
git:sync → git fetch origin && git rebase origin/main

# Wrapper shortcuts
wrap:agent → ./tools/run-agentwise.sh --dry-run ${1:command}
wrap:queue → ./tools/run-bullmq.sh ${1:enqueue} --queue=${2:default} --payload-file=${3:job.json}
wrap:docker → ./tools/run-docker.sh --dry-run ${1:command}

# Debug shortcuts
debug:logs → tail -f logs/tool-invocations.log logs/app.log
debug:agent → tail -f logs/agent_logs/${1:agent-name}.log | jq -C .
debug:health → ./scripts/warp-frontier-check.sh --verbose

# Quick dev shortcuts
dev:start → npm run dev > logs/dev-server.log 2>&1 &
dev:stop → kill $(cat /tmp/boomware-dev.pid) && rm /tmp/boomware-dev.pid
dev:restart → dev:stop && dev:start
```

### 6. Warp Layouts

Save different layouts for different contexts:

#### Layout 1: Solo Dev Mode
```yaml
Name: Solo Dev
Panes:
  - Main (60% width): Dev server output (npm run dev)
  - Right split (40%): Test watcher (npm test -- --watch)
  - Bottom (30% height): Quick commands / Warp AI
```

#### Layout 2: AI Pair Programming
```yaml
Name: AI Pair
Panes:
  - Left (50%): Code/commands
  - Right (50%): AgentWise logs (./tools/run-agentwise.sh monitor)
  - Bottom: Warp AI for Q&A
```

#### Layout 3: Debug Mode
```yaml
Name: Debug
Panes:
  - Top-left: App logs (tail -f logs/app.log)
  - Top-right: Agent logs (tail -f logs/agent_logs/*.log)
  - Bottom-left: Interactive debugger
  - Bottom-right: Test runner
```

**To save a layout**:
1. Arrange panes how you like
2. Cmd/Ctrl + Shift + L → "Save Layout"
3. Give it a name and assign keyboard shortcut

---

## The Vibe Coding Workflow

### Morning Ritual (5 minutes)

```bash
# 1. Start vibe session
Cmd+Shift+T  # Or: ./scripts/start-vibe-session.sh

# 2. Review what happened overnight
git fetch origin
git log --since="yesterday" --oneline --graph --all

# 3. Check system health
Cmd+Shift+C  # Or: ./scripts/warp-frontier-check.sh

# 4. Review pending tasks
./tools/run-agentwise.sh task:list --status pending

# 5. Set intention
echo "Today I'm working on: [feature/bug/refactor]"
```

### Active Coding Flow

#### Feature Development
```bash
# 1. Create feature branch
git:feature new-marketplace-integration  # expands via snippet

# 2. Let AI generate scaffold
aw:create feature "Add Amazon marketplace integration"
# AgentWise creates:
# - Agent skeleton
# - Tests
# - Documentation
# - Wrappers if needed

# 3. Review AI output
git diff

# 4. Iterate in Warp AI
# Ask questions like:
# - "Explain the AmazonListingAgent implementation"
# - "How does this integrate with existing agents?"
# - "What tests should I add?"

# 5. Test as you go
test:file src/agents/amazon-listing-agent.test.ts  # runs in watch mode

# 6. Quick ship when ready
Cmd+Shift+S "feat: add Amazon marketplace integration"
```

#### Bug Fixing
```bash
# 1. Reproduce bug
npm test -- --testNamePattern="reproduces bug"

# 2. Ask AI to analyze
# In Warp AI: "Analyze this test failure" (paste output)

# 3. Let AgentWise suggest fix
./tools/run-agentwise.sh task:create \
  --type bugfix \
  --description "Fix eBay listing timeout issue" \
  --context "$(cat logs/error.log)"

# 4. Review and apply fix
git diff

# 5. Verify fix
npm test -- --testNamePattern="bug fix"

# 6. Ship it
Cmd+Shift+S "fix: resolve eBay listing timeout"
```

#### Refactoring
```bash
# 1. Ask AI for refactoring plan
# In Warp AI: "Suggest refactoring for src/agents/vision-agent.ts"

# 2. Create refactoring task
aw:create refactor "Refactor VisionAgent to use new Claude API"

# 3. Run in dry-run first
./tools/run-agentwise.sh task:run --id <task-id> --dry-run

# 4. Review proposed changes
git diff

# 5. Run tests
npm test -- src/agents/vision-agent.test.ts

# 6. Ship if tests pass
Cmd+Shift+S "refactor: modernize VisionAgent Claude API usage"
```

### Afternoon Check-in (5 minutes)

```bash
# 1. Health check
Cmd+Shift+C

# 2. Review what you shipped
git log --since="6 hours ago" --oneline

# 3. Check agent activity
./tools/run-agentwise.sh task:list --status completed --since=today

# 4. Quick commit of WIP
git add .
git commit -m "WIP: [description]"
git push
```

### Evening Wrap-up (5 minutes)

```bash
# 1. Ship any remaining work
Cmd+Shift+S "feat: [description]"

# 2. Set up overnight tasks
./tools/run-agentwise.sh task:create \
  --type analysis \
  --description "Analyze codebase for performance improvements" \
  --schedule overnight

# 3. Review metrics
./tools/run-agentwise.sh metrics --since=today

# 4. Clean up
npm run cleanup  # or whatever cleanup script exists

# 5. Stop dev server
dev:stop
```

---

## Advanced Vibe Techniques

### 1. AI Context Management

**Problem**: AI doesn't know your codebase structure.

**Solution**: Feed it context incrementally.

```bash
# Create AI context file
cat > /tmp/ai-context.md <<EOF
# Project: Boom Warehouse
## Current Task: Adding new marketplace integration
## Key Files:
$(ls -1 src/agents/)
## Recent Changes:
$(git log -5 --oneline)
## Test Status:
$(npm test -- --silent 2>&1 | tail -20)
EOF

# Use this context in Warp AI prompts
# "Based on the context in /tmp/ai-context.md, suggest..."
```

### 2. Flow State Protection

**Goal**: Stay in the zone for 2+ hour blocks.

**Tactics**:
1. **Block notifications**: Do not disturb mode
2. **Batch context switches**: Check Slack/email only at transitions
3. **Use ambient indicators**: Let Warp show status without interrupting
4. **Trust the AI**: Don't second-guess every suggestion
5. **Time-box reviews**: Set timer, review AI output for 10 mins max

### 3. Parallel AI Workflows

Run multiple AI tasks simultaneously:

```bash
# Terminal 1: AgentWise working on feature
./tools/run-agentwise.sh task:run --id feat-123

# Terminal 2: Claude analyzing architecture
# (In Warp AI): "Analyze the agent architecture and suggest improvements"

# Terminal 3: GitHub Copilot suggesting code in your editor

# You: Orchestrating all three, picking the best ideas
```

### 4. Vibe-Specific Aliases

Add to your shell config:

```bash
# Fast access to vibe scripts
alias vibe-start="./scripts/start-vibe-session.sh"
alias vibe-check="./scripts/warp-frontier-check.sh --verbose"
alias vibe-ship="./scripts/quick-ship.sh"

# Quick AgentWise access
alias aw="./tools/run-agentwise.sh"
alias aw-create="aw task:create"
alias aw-list="aw task:list"
alias aw-monitor="aw monitor"

# Dev server shortcuts
alias dev="npm run dev > logs/dev-server.log 2>&1 &"
alias test-watch="npm test -- --watch"

# Git shortcuts for vibing
alias gs="git status"
alias gf="git fetch origin"
alias gp="git push"
alias gc="git commit -m"
```

### 5. AI-Powered Code Review

Before shipping, get AI feedback:

```bash
# 1. Generate diff
git diff > /tmp/my-changes.diff

# 2. Ask Warp AI to review
# "Review this diff for potential issues: $(cat /tmp/my-changes.diff)"

# 3. Apply suggestions
# Make changes based on feedback

# 4. Re-review if major changes
# Repeat until confident
```

### 6. Vibe Metrics

Track your flow state:

```bash
# Create vibe metrics script
cat > scripts/vibe-metrics.sh <<'EOF'
#!/usr/bin/env bash
echo "🎵 Vibe Metrics"
echo "Commits today: $(git log --since='1 day ago' --oneline | wc -l)"
echo "Lines added: $(git diff --stat $(git log --since='1 day ago' --pretty=%H | tail -1)..HEAD | tail -1)"
echo "Tasks completed: $(./tools/run-agentwise.sh task:list --status completed --since=today --count)"
echo "Time in flow: [TODO: integrate with time tracking]"
EOF

chmod +x scripts/vibe-metrics.sh

# Run at end of day
./scripts/vibe-metrics.sh
```

---

## Common Vibe Killers & Solutions

### Problem: "AI suggested bad code"
**Solution**: 
- Always review AI output
- Run tests immediately
- Use `--dry-run` first
- Trust but verify

### Problem: "Too many context switches"
**Solution**:
- Use Warp layouts to avoid switching apps
- Enable ambient indicators
- Batch similar tasks
- Use snippets for repetitive commands

### Problem: "AI doesn't understand my codebase"
**Solution**:
- Create AI context files
- Use Warp AI with explicit context
- Reference specific files in prompts
- Build up AI understanding over time

### Problem: "Lost track of what AI is doing"
**Solution**:
- Always check logs: `tail -f logs/agent_logs/*.log`
- Use `./tools/run-agentwise.sh monitor`
- Review git diffs frequently
- Use `--dry-run` to preview

### Problem: "Interrupted mid-flow"
**Solution**:
- Quick WIP commit: `git add . && git commit -m "WIP" && git push`
- Leave a note for yourself: `echo "TODO: ..." >> TODO.md`
- Set Warp status: "In flow - back at 3pm"

---

## Vibe Coding Anti-Patterns

### ❌ Don't
1. **Blindly accept AI suggestions** - Always review and test
2. **Skip `--dry-run`** - Always preview before executing
3. **Ignore tests** - AI can break things
4. **Forget to commit** - Commit frequently, ship often
5. **Work without health checks** - Run vibe check regularly
6. **Over-engineer workflows** - Keep it simple, optimize later
7. **Fight the AI** - If it keeps suggesting something, consider why

### ✅ Do
1. **Trust but verify** - AI is smart but not infallible
2. **Test continuously** - Run tests in watch mode
3. **Commit frequently** - Small commits, ship often
4. **Use dry-run** - Preview before executing
5. **Stay in flow** - Batch interruptions
6. **Review before shipping** - Quick review, then ship
7. **Learn from AI** - Study its suggestions to improve

---

## Vibe Coding Philosophy

### The Three Principles

1. **Humans ideate, AI executes**
   - You: "Add Amazon marketplace integration"
   - AI: Implements agents, tests, docs, wrappers
   - You: Review, refine, ship

2. **Zero friction, infinite iteration**
   - Everything is one command away
   - No manual steps
   - Instant feedback
   - Rapid iteration

3. **Flow state is sacred**
   - Optimize for uninterrupted coding
   - Batch interruptions
   - Automate everything
   - Let AI handle busywork

### The Vibe Coding Mindset

**Think of AI as a junior developer who**:
- Never gets tired
- Never gets offended by feedback
- Always eager to help
- Needs clear instructions
- Makes mistakes sometimes
- Learns from corrections

**Your role is**:
- Architect and guide
- Code reviewer
- Quality gatekeeper
- Problem solver
- Final decision maker

### When You're in the Vibe Zone

You know you're in flow state when:
- ✅ You lose track of time
- ✅ Commands flow from muscle memory
- ✅ AI suggestions align with your thinking
- ✅ Tests pass on first try (or second)
- ✅ Commits happen naturally
- ✅ You're having fun

**Protect this state**. It's where the magic happens.

---

## Resources

- **Warp Documentation**: https://docs.warp.dev
- **AgentWise Docs**: See `AGENTS.md` and `WARP.md`
- **Flow State Research**: "Flow" by Mihaly Csikszentmihalyi
- **AI-Assisted Coding**: GitHub Copilot docs, Cursor docs

---

## Questions?

If you're not vibing yet:
1. Check your Warp setup: `./scripts/warp-frontier-check.sh`
2. Review this guide again
3. Try one workflow at a time
4. Give it a few days - muscle memory takes time
5. Customize to your preferences

**Remember**: Vibe coding is personal. These are guidelines, not rules. Find what works for you, then vibe. 🎵

---

*"The best code is written when you're not thinking about coding." - Ancient Developer Proverb (probably)*
