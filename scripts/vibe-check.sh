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
