# 🚀 WARP SETUP - READY TO GO!

## ✅ What's Been Set Up

All the infrastructure for **Warp + AgentWise autonomous vibe coding** is now in place:

### 📁 Directory Structure
```
boomware-house/
├── .warp/                           # Warp workflows (import these!)
│   ├── workflow_frontier.json      # Health checks
│   ├── workflow_db-init.json       # Database setup
│   ├── workflow_worker-control.json # Worker management
│   └── README.md                    # Import instructions
├── tools/                           # AgentWise wrapper scripts
│   ├── _helpers.sh                 # Common functions
│   ├── run-agentwise.sh           # AgentWise wrapper
│   ├── run-bullmq.sh              # Queue wrapper
│   └── run-docker.sh              # Docker wrapper
├── scripts/                         # Utility scripts
│   ├── warp-frontier-check.sh     # System health check
│   ├── setup-warp-env.sh          # Environment setup
│   ├── start-vibe-session.sh      # 🎵 Start vibe coding!
│   ├── vibe-check.sh              # Comprehensive health check
│   ├── quick-ship.sh              # Test → Lint → Commit → Push
│   ├── show-prompt.sh             # Display refactoring prompt
│   └── copy-prompt-to-clipboard.sh # Copy prompt to clipboard
├── docs/                            # Documentation
│   ├── VIBE_CODING.md             # 📖 Complete vibe coding guide
│   └── WARP_SETUP.md              # Warp setup walkthrough
├── prompts/                         # AI prompts
│   └── chatgpt-5.1-refactoring-prompt.md  # 🤖 Give this to GPT-5.1!
├── logs/                            # Log files (auto-created)
│   ├── tool-invocations.log       # Wrapper audit logs
│   └── agent_logs/                # Agent-specific logs
├── automated-warp-setup.sh         # 🎯 Run this to set everything up
└── .env.example                    # Environment template
```

### 🎯 Quick Start (3 Steps)

#### 1. Run Automated Setup
```bash
./automated-warp-setup.sh
```
This script:
- ✅ Verifies prerequisites
- ✅ Creates log directories
- ✅ Makes all scripts executable
- ✅ Validates workflow JSON
- ✅ Installs dependencies
- ✅ Creates vibe coding scripts
- ✅ Tests wrapper scripts

#### 2. Import Warp Workflows
Open Warp terminal:
1. Press `Cmd+Shift+W` (or `Ctrl+Shift+W`)
2. Click "Import Workflow"
3. Select all files in `.warp/` directory
4. See `.warp/README.md` for details

#### 3. Start Vibe Session
```bash
./scripts/start-vibe-session.sh
```

🎉 **You're ready to vibe code!**

---

## 🤖 ChatGPT 5.1 Refactoring Prompt

Want AI to refactor your entire project for optimal vibe coding?

### View the Prompt
```bash
./scripts/show-prompt.sh
```

### Copy to Clipboard (if available)
```bash
./scripts/copy-prompt-to-clipboard.sh
```

### Or Manually
```bash
cat prompts/chatgpt-5.1-refactoring-prompt.md
```

Then paste into **ChatGPT 5.1 (o1 model)** and let it refactor everything!

---

## 📚 Documentation

### Essential Reads
1. **docs/VIBE_CODING.md** - Philosophy, setup, workflows, tips
2. **docs/WARP_SETUP.md** - Detailed Warp configuration
3. **AGENTS.md** - AgentWise architecture principles
4. **WARP.md** - Warp integration patterns

### Quick Reference
```bash
# Start vibe session
./scripts/start-vibe-session.sh

# Health check
./scripts/vibe-check.sh

# Quick ship (test + lint + commit + push)
./scripts/quick-ship.sh "feat: my awesome feature"

# System check
./scripts/warp-frontier-check.sh --dry-run

# Show refactoring prompt
./scripts/show-prompt.sh
```

---

## 🔐 Configuration Needed

### 1. AgentWise Token
```bash
# Edit this file with your real token
nano ~/.agentwise_token

# Or set environment variable
export AGENTWISE_TOKEN="your-token-here"
```

### 2. Environment Variables
```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

Required variables:
- `AGENTWISE_TOKEN` - AgentWise authentication
- `ANTHROPIC_API_KEY` - Claude API (for vision AI)
- `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_DEV_ID` - eBay API

Optional variables:
- `FRONTIER_API_KEY`, `FRONTIER_API_URL`, `FRONTIER_MODEL` - Frontier API
- `MAC_IP`, `MAC_USER` - SSH testing
- `REMOVE_BG_API_KEY` - Background removal
- `STRIPE_SECRET_KEY` - Stripe payments
- `CLOUDINARY_API_KEY` - Media storage

### 3. Warp Secrets
In Warp Settings → Secrets, add:
- `AGENTWISE_TOKEN`
- `FRONTIER_API_KEY` (optional)
- `ANTHROPIC_API_KEY`
- `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_DEV_ID`

---

## 🎵 Vibe Coding Workflow

### Morning (5 min)
```bash
./scripts/start-vibe-session.sh  # Initialize environment
./scripts/vibe-check.sh           # Verify everything works
```

### Active Coding
```bash
npm run dev                       # Start dev server
npm test -- --watch               # Test watcher

# Use Warp AI (Cmd+`) for inline help
# Use AgentWise for autonomous tasks
./tools/run-agentwise.sh task:create --type feature --description "..."
```

### Before Break
```bash
./scripts/quick-ship.sh "WIP: progress on feature X"
```

### End of Day
```bash
./scripts/quick-ship.sh "feat: complete feature X"
./scripts/vibe-check.sh           # Final health check
```

---

## 🧪 Testing Your Setup

### 1. Health Check
```bash
./scripts/warp-frontier-check.sh --dry-run
```

Expected: System info, checks pass (or skip with warnings)

### 2. Vibe Check
```bash
./scripts/vibe-check.sh
```

Expected: All checks green, recent commits shown

### 3. Wrapper Test
```bash
./tools/run-agentwise.sh --dry-run --help
./tools/run-docker.sh --dry-run ps
```

Expected: Dry-run output, no errors

### 4. Start Vibe Session
```bash
./scripts/start-vibe-session.sh
```

Expected: Health checks pass, git status shown, ready message

---

## 🆘 Troubleshooting

### "AGENTWISE_TOKEN not set"
```bash
echo "your-token-here" > ~/.agentwise_token
chmod 600 ~/.agentwise_token
```

### "Workflow import fails in Warp"
```bash
jq . .warp/workflow_frontier.json  # Validate JSON
```

### "Scripts not executable"
```bash
chmod +x tools/*.sh scripts/*.sh
```

### "Dependencies missing"
```bash
npm install --prefer-offline
```

---

## 🎯 Next Steps

1. ✅ **Run automated setup** - `./automated-warp-setup.sh`
2. ✅ **Configure secrets** - Edit `~/.agentwise_token` and `.env`
3. ✅ **Import Warp workflows** - `Cmd+Shift+W` in Warp
4. ✅ **Read vibe coding guide** - `docs/VIBE_CODING.md`
5. ✅ **Start vibe session** - `./scripts/start-vibe-session.sh`
6. 🤖 **Optional: AI refactor** - Give `prompts/chatgpt-5.1-refactoring-prompt.md` to GPT-5.1

---

## 🎵 Ready to Vibe Code!

Everything is set up. Just:

```bash
./scripts/start-vibe-session.sh
```

Then open your editor, start coding, and let AI handle the rest.

**Humans ideate. AI codes. Warp orchestrates.**

🚀 Let's go!

---

## 📞 Support

- **Vibe Coding Guide**: `docs/VIBE_CODING.md`
- **Warp Setup**: `docs/WARP_SETUP.md`
- **Architecture**: `AGENTS.md`, `WARP.md`
- **Logs**: `logs/tool-invocations.log`

---

*Built with ❤️ for flow-state development*
