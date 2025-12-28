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
