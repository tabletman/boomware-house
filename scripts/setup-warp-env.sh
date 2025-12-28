#!/bin/bash

# Warp Environment Setup Script
# This script sets up the Warp environment and creates necessary configurations

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WARP_DIR="$PROJECT_ROOT/warp"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Warp environment...${NC}"

# Create warp directory if it doesn't exist
if [ ! -d "$WARP_DIR" ]; then
  mkdir -p "$WARP_DIR"
  echo -e "${GREEN}Created warp directory${NC}"
fi

# Create scripts directory if it doesn't exist
if [ ! -d "$SCRIPTS_DIR" ]; then
  mkdir -p "$SCRIPTS_DIR"
  echo -e "${GREEN}Created scripts directory${NC}"
fi

# Parse command line arguments
COMMIT_MESSAGE=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --commit)
      COMMIT_MESSAGE="$2"
      shift 2
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Check if git is initialized
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo -e "${RED}Git is not initialized in $PROJECT_ROOT${NC}"
  exit 1
fi

# Stage and commit changes if commit message is provided
if [ -n "$COMMIT_MESSAGE" ]; then
  cd "$PROJECT_ROOT"
  
  # Check if there are changes to commit
  if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}Staging changes...${NC}"
    git add -A
    
    echo -e "${YELLOW}Creating commit with message: $COMMIT_MESSAGE${NC}"
    git commit -m "$COMMIT_MESSAGE" -m "Co-Authored-By: Warp <agent@warp.dev>"
    
    echo -e "${GREEN}Changes committed successfully${NC}"
  else
    echo -e "${YELLOW}No changes to commit${NC}"
  fi
fi

echo -e "${GREEN}Warp environment setup complete!${NC}"
