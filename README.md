# Boom Warehouse E-Commerce + Autonomous Listing Platform


This is a general guideline. the below frameworks and technologies if they are conflicting with existing plan from Agent Wise and the boilerplate. Follow what agent-wise and the boilerplate code suggests first. 

A modern, full-stack e-commerce platform built for Boom Warehouse - a used electronics and appliances business in Warrensville Heights, OH.

**NEW:** Now with AI-powered autonomous multi-marketplace listing system that automatically identifies, prices, and lists products across eBay, Facebook Marketplace, instagram and others to follow. Starting with eBay and meta.

**🚀 NEW: Warp Command Center** - Set up Warp as your autonomous development command center with AgentWise orchestration. See [Warp Setup Guide](docs/WARP_SETUP.md) and [Refactoring Prompt](prompts/chatgpt-5.1-refactoring-prompt.md).

## Features

### 🤖 Autonomous Listing System (NEW!)

**Snap photos → AI analyzes → Smart pricing → Auto-list to 5+ marketplaces**

- **Vision AI**: Automatic product identification via Claude 3.5 Sonnet
- **Market Intelligence**: Real-time pricing from eBay sold listings
- **Smart Pricing**: 20% below market average for fast sales
- **Multi-Platform**: eBay (API) + Facebook/Mercari/Poshmark/OfferUp (automation)
- **Self-Healing**: Automatic retry of failed listings
- **Analytics**: Track sales performance across platforms
- **CLI Tools**: Command-line interface for batch processing
- **Cron Automation**: Hands-off operation with scheduled tasks

### 🏪 Core E-Commerce
- Complete product catalog with advanced filtering
- Professional condition grading system (Grade A-D)
- Serial number tracking for electronics
- Real-time inventory management
- Shopping cart and checkout system
- Order tracking and management

### 📱 Customer Experience
- Responsive design optimized for mobile
- Guest checkout capability
- Local pickup scheduling
- Delivery radius calculator
- Order tracking via email/SMS
- Customer account management

### 🔧 Admin Dashboard
- Comprehensive inventory management
- Barcode scanning integration
- Bulk product imports (CSV)
- Order fulfillment system
- Analytics and reporting
- Customer management

### 💳 Payment & Fulfillment
- Stripe payment processing
- Multiple payment methods
- Local pickup option
- Delivery scheduling
- Email notifications
- Receipt generation

### 🎨 Design & UX
- Modern, clean interface
- Condition-based product badges
- Dynamic pricing displays
- Image optimization with Cloudinary
- SEO-optimized pages
- Performance monitoring

## Tech Stack

### Autonomous Listing System
- **Vision AI**: Claude 3.5 Sonnet (Anthropic)
- **Browser Automation**: Playwright
- **Database**: SQLite (inventory) + Supabase (app data)
- **Image Processing**: Sharp + remove.bg API
- **APIs**: eBay Sell API, Anthropic Claude
- **Job Queues**: Node.js EventEmitter (future: BullMQ + Redis)

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - PostgreSQL database and authentication
- **Stripe** - Payment processing
- **Cloudinary** - Image management and optimization

### Infrastructure
- **Vercel** - Hosting and deployment
- **Cloudflare** - CDN and security
- **Google Analytics** - Analytics and tracking
- **Warp + AgentWise** - Autonomous development command center (NEW!)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Cloudinary account
- **Warp terminal** (for autonomous development) - Optional, see [Warp Setup Guide](docs/WARP_SETUP.md)
- **AgentWise CLI** (for autonomous development) - Optional: `npm i -g agentwise`

### Environment Setup

1. Clone the repository
```bash
git clone <repository-url>
cd boom-warehouse
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
- Supabase credentials
- Stripe keys
- Cloudinary settings
- Email configuration

### Database Setup

1. Create a new Supabase project
2. Run the database migrations:
```sql
-- Execute the contents of supabase/migrations/001_initial_schema.sql
-- Execute the contents of supabase/seed.sql for sample data
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Autonomous Listing CLI

```bash
# Analyze a product
npm run cli analyze ./photos/item.jpg

# List on eBay and Facebook
npm run cli list ./photos/item.jpg --platforms ebay,facebook

# Process entire folder
npm run cli batch ./photos/ --auto

# View inventory
npm run cli inventory

# Sales report
npm run cli sales --last 30

# Retry failed listings
npm run cli heal
```

For detailed CLI documentation, see the **Autonomous Listing** section below.

### Building for Production

```bash
npm run build
npm start
```

## Database Schema

The application uses a comprehensive PostgreSQL schema including:
- `products` - Product catalog with condition grading
- `categories` - Product categorization
- `orders` - Order management
- `customers` - Customer data
- `cart_items` - Shopping cart functionality
- `inventory_transactions` - Inventory tracking

## Key Features Implementation

### Condition Grading System
Products are graded A through D with:
- **Grade A**: Excellent condition, minimal wear
- **Grade B**: Good condition, light wear
- **Grade C**: Fair condition, noticeable wear
- **Grade D**: Poor cosmetic condition, fully functional

### Inventory Management
- Real-time stock tracking
- Reserved inventory for pending orders
- Automatic inventory adjustments
- Location-based organization
- Barcode scanning support

### Order Processing
- Automated order number generation
- Inventory reservation on order
- Email notifications
- Tracking number integration
- Local pickup scheduling

## Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Supabase Configuration
1. Set up Row Level Security policies
2. Configure database functions
3. Set up real-time subscriptions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software for Boom Warehouse.

---

## 🤖 Autonomous Listing System

### Quick Start

1. **Set up API keys**
   ```bash
   # Add to .env.local
   ANTHROPIC_API_KEY=sk-ant-xxx
   EBAY_APP_ID=your_app_id
   EBAY_CERT_ID=your_cert_id
   EBAY_DEV_ID=your_dev_id
   REMOVE_BG_API_KEY=your_api_key  # optional
   ```

2. **Analyze a product**
   ```bash
   npm run cli analyze ./photos/iphone.jpg --verbose
   ```

3. **Create listings**
   ```bash
   npm run cli list ./photos/iphone.jpg \
     --platforms ebay,facebook,mercari \
     --urgency balanced
   ```

### Agent Architecture

The system uses 6 specialized AI agents:

1. **VisionAgent** - Product identification via Claude vision
2. **MarketIntelAgent** - Price analysis from sold listings
3. **PriceOptimizerAgent** - Dynamic pricing strategies
4. **ImageProcessorAgent** - Photo optimization per platform
5. **ListingExecutorAgent** - Multi-marketplace posting
6. **SwarmOrchestrator** - Coordinates entire pipeline

### CLI Commands

```bash
# Analysis only (no listing)
npm run cli analyze <images...> [--verbose]

# Create listings
npm run cli list <images...> \
  --platforms ebay,facebook,mercari \
  --urgency fast_sale|balanced|maximize_profit

# Batch process folder
npm run cli batch <directory> \
  --platforms ebay,facebook \
  --concurrent 3 \
  --auto

# View inventory
npm run cli inventory \
  --status listed|sold \
  --limit 20

# Sales analytics
npm run cli sales --last 30

# Retry failed listings
npm run cli heal

# Sync statuses
npm run cli sync
```

### Pricing Strategies

- **Fast Sale**: 20th percentile (20% below market)
- **Balanced**: 5% below market mean
- **Maximize Profit**: 80th percentile
- Auto price drops at day 7, 14, 21

### Platform Support

| Platform | Method | Fee Structure |
|----------|--------|---------------|
| eBay | Official Sell API | 13.25% final value |
| Facebook | Playwright automation | 0% (local) / 5% (shipping) |
| Mercari | Playwright automation | 12.9% (10% + 2.9% payment) |
| Poshmark | Playwright automation | 20% flat |
| OfferUp | Playwright automation | 0% free |

### Cron Automation

Set up hands-off operation:

```bash
# Install cron jobs
crontab -e

# Add these lines:
0 */6 * * * cd /path/to/boomware-house && npm run cron:heal >> logs/heal.log 2>&1
0 9 * * * cd /path/to/boomware-house && npm run cron:prices >> logs/price-drops.log 2>&1
0 3 * * 0 cd /path/to/boomware-house && npm run cron:cleanup >> logs/cleanup.log 2>&1
0 8 * * * cd /path/to/boomware-house && npm run cron:metrics >> logs/metrics.log 2>&1
```

See [CRON_SETUP.md](./CRON_SETUP.md) for details.

### Database Schema (Autonomous Listing)

SQLite database (`data/boomware.db`) with:
- `inventory` - Product catalog with JSON data
- `listings` - Multi-platform listing tracking
- `price_history` - Price changes over time
- `market_cache` - Cached market research
- `agent_logs` - Swarm operation logs
- `scheduled_actions` - Auto price drops
- `platform_metrics` - Performance analytics

### Example Workflow

```typescript
// Complete pipeline
const orchestrator = new SwarmOrchestrator();

const result = await orchestrator.processAndList(
  ['./photos/iphone-front.jpg', './photos/iphone-back.jpg'],
  {
    platforms: ['ebay', 'facebook', 'mercari'],
    urgency: 'balanced',
    optimizeImages: true
  }
);

console.log(`Listed ${result.productName} on ${result.listings.length} platforms`);
```

### Testing

```bash
# Test inventory manager
tsx scripts/test-inventory-manager.ts

# Expected output:
✅ Created inventory item
✅ Created eBay listing
✅ Created Facebook listing
✅ Simulated success
✅ Simulated failure
✅ Tracked price history
✅ Processed sale: Net profit $550
✅ Generated sales analytics
✅ Tested failed listing recovery
✅ Search functionality works
✅ Database backup created
```

---

## 🎛️ Warp Command Center (Autonomous Development)

### Overview

This project now supports **autonomous software development** using Warp as a command center with AgentWise orchestration. This means:
- **Humans ideate and solve problems**
- **AI autonomously codes, tests, and deploys**
- **AgentWise orchestrates all autonomous work**
- **Warp provides the command center UI**

### Quick Setup

1. **Install Warp**: Download from [warp.dev](https://warp.dev)
2. **Install AgentWise**: `npm i -g agentwise`
3. **Import workflows**: In Warp, import all `.warp/*.json` files
4. **Configure secrets**: Add required secrets in Warp Settings → Secrets
5. **Run health check**: `./scripts/warp-frontier-check.sh --dry-run`

See complete setup guide: [docs/WARP_SETUP.md](docs/WARP_SETUP.md)

### Available Workflows

- **Health Check** (`.warp/workflow_frontier.json`) - System health, GPU checks, API smoke tests
- **Database Init** (`.warp/workflow_db-init.json`) - Safe database initialization
- **Worker Control** (`.warp/workflow_worker-control.json`) - Start/stop worker groups

### Wrapper Scripts

All tools are invoked via signed wrappers in `tools/` for security and audit logging:

```bash
# AgentWise wrapper
./tools/run-agentwise.sh --dry-run monitor

# BullMQ wrapper
./tools/run-bullmq.sh enqueue --queue=images --payload-file=job.json

# Docker wrapper
./tools/run-docker.sh ps
```

### Architecture Principles

- **AgentWise as Orchestrator**: All autonomous work flows through AgentWise
- **Wrapper Contract**: All tools invoked via signed wrappers with validation and logging
- **Security First**: Token validation, secret masking, audit logs
- **Dry-Run First**: All operations support `--dry-run` for safe testing

See detailed architecture: [AGENTS.md](AGENTS.md) and [WARP.md](WARP.md)

### Refactoring Guide

For a comprehensive guide to refactoring this project to follow AgentWise patterns:
- Read: [prompts/chatgpt-5.1-refactoring-prompt.md](prompts/chatgpt-5.1-refactoring-prompt.md)
- This prompt is designed for ChatGPT 5.1 (o1) to understand the entire architecture and implement autonomous development patterns

### Agent Swarm

The autonomous listing system uses 6 specialized agents:
1. **VisionAgent** - Product identification via Claude vision
2. **MarketIntelAgent** - Price analysis from market data
3. **PriceOptimizerAgent** - Dynamic pricing strategies
4. **ImageProcessorAgent** - Photo optimization per platform
5. **ListingExecutorAgent** - Multi-marketplace posting
6. **SwarmOrchestrator** - Coordinates all agents

All agents are managed by AgentWise for orchestration, retry logic, and audit logging.

---

## Support

For support and inquiries:
- Email: info@boomwarehouse.com
- Phone: (216) 555-0123
- Address: Warrensville Heights, OH
