# GitHub Copilot Instructions - Boom Warehouse

## Project Overview

Boom Warehouse is a full-stack e-commerce platform for used electronics and appliances with an AI-powered autonomous multi-marketplace listing system. The project enables automated product identification, pricing, and listing across multiple platforms (eBay, Facebook Marketplace, etc.).

## Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, React 18
- **Styling**: Tailwind CSS with Radix UI component primitives
- **Backend**: Next.js API routes, Server Actions
- **Database**: PostgreSQL via Drizzle ORM
- **Authentication**: Clerk for user management
- **Payment Processing**: Stripe and Whop integrations
- **AI/ML**: Claude 3.5 Sonnet (Anthropic) for vision analysis
- **Automation**: Playwright for browser automation
- **Orchestration**: AgentWise for autonomous task coordination

## Tech Stack

### Core Dependencies
- Next.js 14 (App Router)
- TypeScript 5
- React 18
- Tailwind CSS
- Drizzle ORM
- Clerk (Authentication)
- Stripe (Payments)
- Radix UI (Components)
- Zod (Validation)
- React Hook Form

### Development Tools
- ESLint (Linting)
- TypeScript compiler
- Remotion (Video rendering)

## Project Structure

```
/app                  # Next.js App Router pages
  /(auth)            # Authentication routes
  /(marketing)       # Marketing pages
  /api               # API routes
  /dashboard         # Dashboard pages
  /pay               # Payment pages
/actions             # Server Actions
/components          # React components
  /ui                # Reusable UI components
/db                  # Database layer
  /schema            # Drizzle schema definitions
  /queries           # Database queries
/lib                 # Utility functions
/types               # TypeScript type definitions
/prompts             # AI prompt templates
/docs                # Documentation
```

## Code Standards

### TypeScript
- **Strict mode enabled**: All code must pass TypeScript strict checks
- Use explicit types for function parameters and return values
- Avoid `any` type; use `unknown` if type is truly unknown
- Use type imports: `import type { Type } from 'module'`
- Path aliases: Use `@/` for root imports (e.g., `@/components/ui/button`)

### React & Next.js
- Use React Server Components by default
- Add `'use client'` directive only when needed (client-side interactivity, hooks, browser APIs)
- Use Server Actions for mutations (in `/actions` directory)
- Follow Next.js App Router conventions
- Use `async/await` for data fetching in Server Components

### Naming Conventions
- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`)

### Component Structure
```tsx
// 1. Imports (grouped: React, Next.js, third-party, local)
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

// 2. Type definitions
type Props = {
  userId: string
}

// 3. Component
export function Component({ userId }: Props) {
  // Component logic
  return (
    // JSX
  )
}
```

### Styling
- Use Tailwind utility classes
- Follow existing Tailwind configuration in `tailwind.config.ts`
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Prefer Radix UI components for complex UI patterns

### Database
- Use Drizzle ORM for all database operations
- Schema definitions in `/db/schema`
- Query functions in `/db/queries`
- Always use prepared statements
- Handle errors gracefully with try-catch

### Forms & Validation
- Use React Hook Form for form state management
- Use Zod schemas for validation
- Server-side validation in Server Actions
- Client-side validation for UX

## Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Database
```bash
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
```

### Video/Media
```bash
npm run video        # Start Remotion studio
npm run render       # Render video output
```

## Authentication & Authorization

- Authentication handled by Clerk
- Use `@clerk/nextjs` hooks and components
- Protect routes with Clerk middleware (see `middleware.ts`)
- Check user permissions before sensitive operations
- Store user preferences in database profiles table

## Payment Processing

- Stripe for standard payments
- Whop for subscription/membership management
- Always validate webhooks with signature verification
- Handle payment states: pending, succeeded, failed
- Store payment records in database

## AgentWise Orchestration

**Important**: AgentWise is the single authoritative orchestration hub for autonomous work.

### Principles
1. All AI assistants and automation tools accept tasks from AgentWise
2. Direct human calls to automation in production are discouraged
3. Tools must be invoked via signed wrapper scripts in `tools/` directory
4. All wrappers validate `AGENTWISE_TOKEN` before execution
5. Wrappers log to `logs/tool-invocations.log`

### Agent Roles
- **VisionAgent**: Product identification from images
- **MarketIntelAgent**: Market research and pricing analysis
- **PriceOptimizerAgent**: Dynamic pricing strategies
- **ImageProcessorAgent**: Image optimization per platform
- **ListingExecutorAgent**: Multi-platform listing creation
- **SwarmOrchestrator**: Coordinates all agents

### Tool Wrapper Contract
```bash
# Input: JSON payload
# Validation: Check AGENTWISE_TOKEN
# Output: JSON { success: bool, data: {...}, logs: "..." }
# Location: tools/run-*.sh
```

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Validate all inputs**: Use Zod schemas
3. **Sanitize user content**: Prevent XSS attacks
4. **Verify webhooks**: Check signatures for Stripe/Whop
5. **Rate limiting**: Implement for API routes
6. **HTTPS only**: Enforce secure connections
7. **Token validation**: Always verify AgentWise tokens in wrappers
8. **Audit logging**: Log privileged operations to `logs/`

## Error Handling

- Use try-catch blocks for async operations
- Return structured error responses: `{ success: false, error: 'message' }`
- Log errors appropriately (avoid logging sensitive data)
- Provide user-friendly error messages
- Use toast notifications for user feedback (Sonner)

## Testing Guidelines

- Test critical business logic
- Test payment and authentication flows
- Test database operations
- Mock external API calls
- Run type checks before committing: `npm run type-check`

## Environment Variables

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `ANTHROPIC_API_KEY` (for AI features)
- `EBAY_APP_ID`, `EBAY_CERT_ID`, `EBAY_DEV_ID` (for eBay integration)
- `AGENTWISE_TOKEN` (for orchestration)

## Git Workflow

1. Work in feature branches
2. Write descriptive commit messages
3. Run `npm run lint` and `npm run type-check` before committing
4. Keep commits focused and atomic
5. Reference issue numbers in commits

## AI-Powered Features

### Autonomous Listing System
- Uses Claude 3.5 Sonnet for product identification
- Integrates with eBay API and browser automation
- Stores inventory in SQLite database
- Tracks listings across multiple platforms
- Implements retry logic for failed operations

### CLI Commands
```bash
npm run cli analyze <images>        # Analyze product
npm run cli list <images>            # Create listings
npm run cli batch <directory>        # Batch process
npm run cli inventory                # View inventory
npm run cli sales --last 30          # Sales report
npm run cli heal                     # Retry failed listings
```

## Performance Considerations

- Use Next.js Image component for optimized images
- Implement proper caching strategies
- Lazy load components when appropriate
- Minimize client-side JavaScript
- Use React Server Components for data fetching
- Optimize database queries (indexes, prepared statements)

## Accessibility

- Use semantic HTML
- Ensure keyboard navigation works
- Provide ARIA labels where needed
- Test with screen readers
- Maintain color contrast ratios
- Use Radix UI for accessible primitives

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Clerk Documentation](https://clerk.com/docs)
- [AGENTS.md](../AGENTS.md) - AgentWise orchestration details
- [WARP.md](../WARP.md) - Warp command center setup

## Additional Notes

- Follow existing patterns in the codebase
- When in doubt, prioritize AgentWise and boilerplate code patterns
- Maintain consistency with the established architecture
- Document complex logic with inline comments
- Keep components small and focused
- Prefer composition over inheritance
- Use TypeScript's type system to prevent runtime errors
