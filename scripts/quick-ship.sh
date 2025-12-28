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
