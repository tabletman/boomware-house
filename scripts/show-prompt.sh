#!/usr/bin/env bash
set -euo pipefail

# show-prompt.sh
# Display the refactoring prompt in the terminal for easy viewing/copying

PROMPT_FILE="prompts/chatgpt-5.1-refactoring-prompt.md"

if [ ! -f "$PROMPT_FILE" ]; then
    echo "❌ Error: $PROMPT_FILE not found"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📋 CHATGPT 5.1 REFACTORING PROMPT FOR BOOM WAREHOUSE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Stats:"
echo "   Lines: $(wc -l < "$PROMPT_FILE")"
echo "   Words: $(wc -w < "$PROMPT_FILE")"
echo "   Size: $(du -h "$PROMPT_FILE" | cut -f1)"
echo ""
echo "📁 Location: $PROMPT_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Display the prompt
cat "$PROMPT_FILE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📋 END OF PROMPT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Next Steps:"
echo "   1. Copy this entire output"
echo "   2. Open ChatGPT 5.1 (o1 model)"
echo "   3. Paste the prompt"
echo "   4. Let AI refactor your entire project for vibe coding!"
echo ""
echo "💡 Or view the file directly:"
echo "   cat $PROMPT_FILE"
echo "   code $PROMPT_FILE"
echo ""
