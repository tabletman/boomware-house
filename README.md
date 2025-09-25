# Boom Warehouse E-Commerce Platform

A modern, full-stack e-commerce platform built for Boom Warehouse - a used electronics and appliances business in Warrensville Heights, OH.

## Features

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

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Cloudinary account

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

## Support

For support and inquiries:
- Email: info@boomwarehouse.com
- Phone: (216) 555-0123
- Address: Warrensville Heights, OH
