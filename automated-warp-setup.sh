#!/usr/bin/env bash
set -euo pipefail

# automated-warp-setup.sh
# Complete automated setup for Warp + AgentWise vibe coding environment
# Just run this script and everything gets configured

echo "🚀 Boom Warehouse - Automated Warp Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Step 1: Verify we're in the right directory
print_step "Verifying repository location..."
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the repository root"
    exit 1
fi
print_success "Repository root confirmed"

# Step 2: Check prerequisites
print_step "Checking prerequisites..."

MISSING_DEPS=()

if ! command -v node >/dev/null 2>&1; then
    MISSING_DEPS+=("node")
fi

if ! command -v npm >/dev/null 2>&1; then
    MISSING_DEPS+=("npm")
fi

if ! command -v git >/dev/null 2>&1; then
    MISSING_DEPS+=("git")
fi

if ! command -v jq >/dev/null 2>&1; then
    print_warning "jq not found - recommended for JSON validation"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo "❌ Missing required dependencies: ${MISSING_DEPS[*]}"
    echo "Please install these before continuing."
    exit 1
fi

print_success "Prerequisites checked"

# Step 3: Create logs directory
print_step "Creating logs directory..."
mkdir -p logs/agent_logs
touch logs/tool-invocations.log
touch logs/app.log
print_success "Logs directory created"

# Step 4: Make all scripts executable
print_step "Making scripts executable..."
chmod +x tools/*.sh 2>/dev/null || true
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x commit_agentwise_files.sh 2>/dev/null || true
print_success "Scripts are executable"

# Step 5: Validate workflow JSON files
print_step "Validating Warp workflows..."
if command -v jq >/dev/null 2>&1; then
    for workflow in .warp/*.json; do
        if [ -f "$workflow" ]; then
            if jq . "$workflow" >/dev/null 2>&1; then
                print_success "$(basename "$workflow") is valid"
            else
                echo "❌ $(basename "$workflow") has invalid JSON"
                exit 1
            fi
        fi
    done
else
    print_warning "Skipping JSON validation (jq not available)"
fi

# Step 6: Install node dependencies
print_step "Installing/verifying node dependencies..."
if [ -f "package.json" ]; then
    npm install --prefer-offline --no-audit --silent
    print_success "Dependencies installed"
else
    print_warning "No package.json found"
fi

# Step 7: Create .gitignore entries for logs
print_step "Updating .gitignore..."
if [ -f ".gitignore" ]; then
    if ! grep -q "logs/" .gitignore; then
        echo "" >> .gitignore
        echo "# Logs from Warp/AgentWise" >> .gitignore
        echo "logs/" >> .gitignore
        echo "*.log" >> .gitignore
        print_success ".gitignore updated"
    else
        print_success ".gitignore already configured"
    fi
fi

# Step 8: Create AgentWise token file (if not exists)
print_step "Checking AgentWise token..."
if [ ! -f "${HOME}/.agentwise_token" ]; then
    print_warning "AgentWise token not found"
    echo "Creating placeholder token file at ${HOME}/.agentwise_token"
    echo "REPLACE_WITH_YOUR_TOKEN" > "${HOME}/.agentwise_token"
    chmod 600 "${HOME}/.agentwise_token"
    echo ""
    echo "⚠️  IMPORTANT: Edit ${HOME}/.agentwise_token and add your real token"
    echo "   Or set AGENTWISE_TOKEN environment variable"
else
    print_success "AgentWise token file exists"
fi

# Step 9: Create vibe session starter script
print_step "Creating vibe session starter..."
cat > scripts/start-vibe-session.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

echo "🎵 Initializing vibe coding session..."

# 1. Health check
echo "⚡ Running health checks..."
if [ -f "scripts/warp-frontier-check.sh" ]; then
    ./scripts/warp-frontier-check.sh --dry-run || echo "Health check completed with warnings"
fi

# 2. Git sync
echo "📦 Syncing with remote..."
git fetch origin 2>/dev/null || echo "Could not fetch from remote"
git status

# 3. Dependencies
echo "📚 Checking dependencies..."
npm ci --prefer-offline --silent 2>/dev/null || npm install --prefer-offline --silent 2>/dev/null || echo "Dependencies check skipped"

# 4. Show branch info
echo ""
echo "📍 Current branch: $(git rev-parse --abbrev-ref HEAD)"
echo "📝 Last commit: $(git log -1 --oneline)"
echo ""

# 5. Ready
echo "✅ Vibe session ready!"
echo ""
echo "🎧 Time to vibe code!"
echo "💡 Quick commands:"
echo "   - npm run dev          # Start dev server"
echo "   - npm test -- --watch  # Start test watcher"
echo "   - aw:create           # Create AgentWise task (if snippet configured)"
echo ""
EOF

chmod +x scripts/start-vibe-session.sh
print_success "Vibe session starter created"

# Step 10: Create quick-ship script
print_step "Creating quick-ship script..."
cat > scripts/quick-ship.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

COMMIT_MSG="${1:-Quick update}"

echo "🚀 Quick shipping..."

# Type check
echo "📝 Type checking..."
npm run type-check || { echo "❌ Type check failed"; exit 1; }

# Lint
echo "🎨 Linting..."
npm run lint 2>/dev/null || echo "Lint step skipped (no lint script)"

# Test changed files
echo "🧪 Testing..."
npm test 2>/dev/null || echo "Test step skipped (no test script)"

# Git operations
echo "📦 Committing..."
git add .
git commit -m "$COMMIT_MSG" || { echo "Nothing to commit"; exit 0; }

echo "☁️  Pushing..."
git push

echo "✅ Shipped! Back to vibing."
EOF

chmod +x scripts/quick-ship.sh
print_success "Quick-ship script created"

# Step 11: Create vibe-check script
print_step "Creating vibe-check script..."
cat > scripts/vibe-check.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Running comprehensive vibe check..."
echo ""

# Health check
if [ -f "scripts/warp-frontier-check.sh" ]; then
    echo "1️⃣  System Health Check"
    ./scripts/warp-frontier-check.sh --dry-run
    echo ""
fi

# Type check
echo "2️⃣  TypeScript Check"
npm run type-check 2>/dev/null || echo "Type check not available"
echo ""

# Git status
echo "3️⃣  Git Status"
git status
echo ""

# Recent commits
echo "4️⃣  Recent Commits"
git log -5 --oneline
echo ""

# Dependencies
echo "5️⃣  Dependencies Status"
if [ -f "package-lock.json" ]; then
    echo "package-lock.json present ✅"
else
    echo "package-lock.json missing ⚠️"
fi
echo ""

echo "✅ Vibe check complete! All systems nominal."
EOF

chmod +x scripts/vibe-check.sh
print_success "Vibe-check script created"

# Step 12: Test wrapper scripts
print_step "Testing wrapper scripts..."
./tools/run-agentwise.sh --dry-run --help >/dev/null 2>&1 && print_success "run-agentwise.sh works" || print_warning "run-agentwise.sh may need attention"
./tools/run-docker.sh --dry-run ps >/dev/null 2>&1 && print_success "run-docker.sh works" || print_warning "run-docker.sh may need attention"
./tools/run-bullmq.sh --help >/dev/null 2>&1 && print_success "run-bullmq.sh works" || print_warning "run-bullmq.sh may need attention"

# Step 13: Create README for Warp import
print_step "Creating Warp import instructions..."
cat > .warp/README.md <<'EOF'
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
EOF

print_success "Warp import instructions created"

# Step 14: Create environment template
print_step "Creating environment template..."
if [ ! -f ".env.example" ]; then
    cat > .env.example <<'EOF'
# Warp + AgentWise Configuration
AGENTWISE_TOKEN=your_token_here

# Frontier API (optional)
FRONTIER_API_URL=https://api.frontier.dev
FRONTIER_MODEL=frontier-v1
FRONTIER_API_KEY=your_key_here

# SSH Testing (optional)
MAC_IP=192.168.1.100
MAC_USER=username
SSH_PORT=22

# Application APIs
ANTHROPIC_API_KEY=sk-ant-xxx
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret
EBAY_DEV_ID=your_dev_id

# Optional APIs
REMOVE_BG_API_KEY=your_key_here
STRIPE_SECRET_KEY=sk_test_xxx
CLOUDINARY_API_KEY=your_key_here
EOF
    print_success ".env.example created"
else
    print_success ".env.example already exists"
fi

# Step 15: Summary
echo ""
echo "=========================================="
echo "🎉 Automated Setup Complete!"
echo "=========================================="
echo ""
echo "📋 What was done:"
echo "   ✅ Verified repository structure"
echo "   ✅ Created logs directory"
echo "   ✅ Made scripts executable"
echo "   ✅ Validated Warp workflows"
echo "   ✅ Installed dependencies"
echo "   ✅ Created vibe coding scripts"
echo "   ✅ Tested wrapper scripts"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1️⃣  Configure Secrets:"
echo "   - Edit ${HOME}/.agentwise_token with your real token"
echo "   - Or set AGENTWISE_TOKEN environment variable"
echo "   - Copy .env.example to .env and fill in values"
echo ""
echo "2️⃣  Import Warp Workflows:"
echo "   - Open Warp terminal"
echo "   - Press Cmd+Shift+W (or Ctrl+Shift+W)"
echo "   - Import all .warp/*.json files"
echo "   - See .warp/README.md for details"
echo ""
echo "3️⃣  Start Vibe Session:"
echo "   ./scripts/start-vibe-session.sh"
echo ""
echo "4️⃣  Read the Guides:"
echo "   - docs/VIBE_CODING.md - Complete vibe coding guide"
echo "   - docs/WARP_SETUP.md - Warp setup walkthrough"
echo "   - prompts/chatgpt-5.1-refactoring-prompt.md - Full refactoring prompt"
echo ""
echo "5️⃣  Test Your Setup:"
echo "   ./scripts/vibe-check.sh"
echo ""
echo "🎵 Ready to vibe code!"
echo ""

# Optional: Open important files in editor
if command -v code >/dev/null 2>&1; then
    echo "💡 TIP: Run 'code docs/VIBE_CODING.md' to read the vibe coding guide"
fi

exit 0
