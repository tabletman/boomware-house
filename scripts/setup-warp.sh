#!/bin/bash

# Warp Setup Script
# This script sets up the necessary Warp configuration for this project

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WARP_DIR="$PROJECT_ROOT/warp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Warp configuration...${NC}"

# Create warp directory if it doesn't exist
if [ ! -d "$WARP_DIR" ]; then
  mkdir -p "$WARP_DIR"
  echo -e "${GREEN}Created warp directory${NC}"
fi

# Create WARP.md file if it doesn't exist
if [ ! -f "$WARP_DIR/WARP.md" ]; then
  echo -e "${YELLOW}Creating WARP.md file...${NC}"
  
  cat > "$WARP_DIR/WARP.md" << 'EOF'
# Warp Configuration

This document outlines the Warp configuration for the boomware-house project.

## Environment Setup

This project uses a custom environment configuration to ensure that Warp agents have all the necessary tools and dependencies to work with the codebase.

### Environment Details

- **Docker Image**: node:18-alpine
- **Dependencies**: Node.js, npm, Git
- **Setup Commands**: 
  - `npm install`
  - `npm run build`

### Integration Setup

#### GitHub Integration
To enable Warp agents to create pull requests and interact with the repository:

```bash
warp integration create github --environment <ENV_ID>
```

#### Slack Integration
To enable triggering Warp agents from Slack:

```bash
warp integration create slack --environment <ENV_ID>
```

## Workflow Configuration

The following workflows are configured for this project:

1. **Feature Development**: Agents can create new features based on requirements
2. **Bug Fixes**: Agents can identify and fix issues in the codebase
3. **Code Refactoring**: Agents can improve code structure and organization
4. **Documentation Updates**: Agents can update and improve project documentation

## Agent Permissions

Warp agents are configured with the following permissions:
- Read and write access to all code
- Ability to create and modify files
- Ability to run tests and build commands
- Ability to create pull requests
- Ability to install dependencies

## Usage

To use Warp with this project:

1. Set up the environment using the provided scripts
2. Configure the necessary integrations
3. Trigger agents from Slack, Linear, or the terminal

For more information on Warp integrations, see the [Warp Integrations Documentation](https://docs.warp.dev/integrations).
EOF

  echo -e "${GREEN}Created WARP.md file${NC}"
else
  echo -e "${YELLOW}WARP.md file already exists${NC}"
fi

# Create workflows directory
if [ ! -d "$WARP_DIR/workflows" ]; then
  mkdir -p "$WARP_DIR/workflows"
  echo -e "${GREEN}Created workflows directory${NC}"
fi

echo -e "${GREEN}Warp setup complete!${NC}"