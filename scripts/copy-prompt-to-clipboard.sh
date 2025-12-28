#!/usr/bin/env bash
set -euo pipefail

# copy-prompt-to-clipboard.sh
# Copy the ChatGPT 5.1 refactoring prompt to clipboard for easy sharing

PROMPT_FILE="prompts/chatgpt-5.1-refactoring-prompt.md"

if [ ! -f "$PROMPT_FILE" ]; then
    echo "❌ Error: $PROMPT_FILE not found"
    exit 1
fi

echo "📋 ChatGPT 5.1 Refactoring Prompt"
echo "=================================="
echo ""

# Try to copy to clipboard (different methods for different OS)
if command -v pbcopy >/dev/null 2>&1; then
    # macOS
    cat "$PROMPT_FILE" | pbcopy
    echo "✅ Copied to clipboard (macOS pbcopy)"
elif command -v xclip >/dev/null 2>&1; then
    # Linux with xclip
    cat "$PROMPT_FILE" | xclip -selection clipboard
    echo "✅ Copied to clipboard (Linux xclip)"
elif command -v xsel >/dev/null 2>&1; then
    # Linux with xsel
    cat "$PROMPT_FILE" | xsel --clipboard
    echo "✅ Copied to clipboard (Linux xsel)"
elif command -v clip.exe >/dev/null 2>&1; then
    # Windows WSL
    cat "$PROMPT_FILE" | clip.exe
    echo "✅ Copied to clipboard (Windows clip.exe)"
else
    echo "⚠️  No clipboard utility found"
    echo ""
    echo "📄 Prompt file location: $PROMPT_FILE"
    echo ""
    echo "To copy manually:"
    echo "  cat $PROMPT_FILE | pbcopy        # macOS"
    echo "  cat $PROMPT_FILE | xclip -sel c  # Linux"
    echo "  cat $PROMPT_FILE | clip.exe      # Windows WSL"
    echo ""
    echo "Or open the file and copy manually:"
    echo "  code $PROMPT_FILE    # VS Code"
    echo "  open $PROMPT_FILE    # macOS default editor"
    echo ""
    exit 1
fi

echo ""
echo "📊 Prompt Stats:"
LINES=$(wc -l < "$PROMPT_FILE")
WORDS=$(wc -w < "$PROMPT_FILE")
CHARS=$(wc -c < "$PROMPT_FILE")
echo "   Lines: $LINES"
echo "   Words: $WORDS"
echo "   Characters: $CHARS"
echo ""
echo "🎯 Ready to paste into ChatGPT 5.1!"
echo ""
echo "💡 TIP: This prompt is designed for ChatGPT 5.1 (o1 model)"
echo "   It will guide a comprehensive refactoring of the entire project"
echo "   to enable vibe coding with Warp + AgentWise orchestration"
echo ""
