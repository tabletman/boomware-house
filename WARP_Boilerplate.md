# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Install & run locally
- Install dependencies (Node 18+): `npm install`
- Start Next.js dev server: `npm run dev` (serves the app on `http://localhost:3000`)

### Build, lint, and type-check
- Production build: `npm run build`
- Run production server (after build): `npm start`
- Lint (Next.js + ESLint): `npm run lint`
- Type-check TypeScript: `npm run type-check`

### Database migrations (Drizzle + Supabase)
The app uses Supabase Postgres via Drizzle.

- Ensure `DATABASE_URL` is configured in `.env.local`.
- Generate migrations from the current schema (using `drizzle.config.ts`):
  - `npm run db:generate`
- Apply migrations to the database:
  - `npm run db:migrate`

When adding new tables, follow the backend conventions described below, then re-run `db:generate` and `db:migrate` to keep the schema and database in sync.

### Remotion video tooling
There is a small Remotion setup under `src/remotion/`.

- Open Remotion Studio: `npm run video`
- Render the `ShowcaseVideo` composition to `out/video.mp4`:
  - `npm run render`

### Tests
There is currently **no test script** defined in `package.json`. If a test runner (e.g. Vitest/Jest) is added, update this section with the appropriate commands for running the full suite and individual tests.

---

## Architecture overview

### Frontend (Next.js App Router)
- Uses **Next.js 14 App Router** with React Server Components.
- Top-level layout: `app/layout.tsx`
  - Wraps the app with `ClerkProvider`, theme `Providers`, and `LayoutWrapper`.
  - On each request, if a Clerk `userId` exists, it:
    - Calls `getProfileByUserIdAction` to ensure the user has a profile row.
    - If none exists, fetches `currentUser` from Clerk to get the email.
    - Attempts to claim any **pending profile** created via the frictionless payment flow using `claimPendingProfile(userId, email)`.
    - If there is no pending profile, creates a new basic profile via `createProfileAction`.
  - Shows `PaymentStatusAlert` for authenticated users and mounts the global `Toaster`.
- Route groups:
  - `app/(marketing)/` – public marketing site, including the main landing page and pricing (`app/(marketing)/page.tsx`, `app/(marketing)/pricing/page.tsx`). Animated hero/features/reviews/CTA live in `app/(marketing)/components/`.
  - `app/(auth)/` – auth pages (`login`, `signup`) rendered inside `app/(auth)/layout.tsx`, which centers content on a simple background.
  - `app/dashboard/` – authenticated application UI. Uses its own `app/dashboard/layout.tsx` to:
    - Enforce authentication via Clerk `auth()` (redirects to `/login` if unauthenticated).
    - Fetch the user profile via `getProfileByUserId` (query layer). If none, redirects to `/signup`.
    - Run `checkExpiredSubscriptionCredits` to downgrade free users with an expired billing cycle back to free-tier credits and adjust status.
    - Render the sidebar navigation (`components/sidebar.tsx`) with the profile and user email, plus Whop monthly/yearly plan IDs from env.
    - Overlay key popups: `WelcomeMessagePopup`, `PaymentSuccessPopup`, and `CancellationPopup`.
  - `app/pay/page.tsx` – payment/upgrade entry point (integrates with Whop/Stripe flows).
- Shared components live in `components/`:
  - `components/ui/` – ShadCN UI primitives (button, card, dialog, form, etc.).
  - Layout and shell components like `layout-wrapper.tsx`, `dashboard-layout.tsx`, `sidebar.tsx`, header, popups, and payment-related alerts.
  - `components/utilities/providers.tsx` – central place for theme and other top-level React providers.

### Authentication and user profiles
- Authentication is handled by **Clerk** (`@clerk/nextjs`).
- Profiles are stored in the `profiles` table (`db/schema/profiles-schema.ts`) and accessed via Drizzle queries in `db/queries/profiles-queries.ts`.
- The profile model tracks:
  - `membership` (`free` or `pro`), `paymentProvider` (`stripe` or `whop`), and provider-specific IDs (`stripeCustomerId`, `whopUserId`, etc.).
  - Billing information (`billingCycleStart`, `billingCycleEnd`, `planDuration`).
  - Credits (`usageCredits`, `usedCredits`) and `nextCreditRenewal` (credits reset cycle, independent of billing cycle).
  - `status` (e.g. `active`, `canceled`, `payment_failed`).
- `db/db.ts` wires Drizzle to Postgres using `DATABASE_URL` and exposes `db` plus a `checkDatabaseConnection` helper used by webhooks to fail fast when the DB is unavailable.
- Dashboard layout enforces that only authenticated users with a valid profile can access `/dashboard` and related pages, and contains logic to downgrade credits for users whose billing cycle has ended but still have pro-level credits.

### Database layer (Drizzle + Supabase)
- Drizzle configuration: `drizzle.config.ts`
  - Schema entrypoint: `db/schema/index.ts` (re-exports all table schemas).
  - Migrations output directory: `db/migrations/`.
- Schema tables of interest:
  - `profilesTable` (`db/schema/profiles-schema.ts`): main user subscription/credits record. Includes Postgres enums for `membership` and `payment_provider`, and embeds Row Level Security policies in the migration SQL.
  - `pendingProfilesTable` (`db/schema/pending-profiles-schema.ts`): stores **unauthenticated purchases** (email-only) for the frictionless payment flow. Tracks email, Whop IDs, membership, credits, billing cycle data, claim status, and timestamps.
- Query modules:
  - `db/queries/profiles-queries.ts` implements create/read/update/delete and helper functions like `getUserPlanInfo`, plus fallbacks for looking up by `whopUserId` or email.
  - `db/queries/pending-profiles-queries.ts` manages pending profiles (create, lookup by email, mark as claimed, delete).
- **When adding new tables** (per `prompts/instructions/backend-instructions.md`):
  - Create a new schema file under `db/schema/`.
  - Export it from `db/schema/index.ts`.
  - Add it to the `schema` object in `db/db.ts` so Drizzle's typed client knows about it.
  - Add corresponding query helpers under `db/queries/`.
  - Regenerate and apply migrations with `npm run db:generate` and `npm run db:migrate`.

### Billing, credits, and Whop integration
The primary subscription system is built around **Whop** and a credit-based usage model.

- Webhook entrypoint: `app/api/whop/webhooks/route.ts`.
  - Uses `makeWebhookHandler()` from `@whop-apps/sdk` to respond to Whop events.
  - Calls `checkDatabaseConnection()` before processing to avoid Whop retries when the database is down; returns HTTP 200 with a warning payload even on internal errors.
  - Registers handlers for three event types:
    - `paymentSucceeded` → `handlePaymentSuccess` (in `utils/payment-handlers.ts`).
    - `paymentFailed` → `handlePaymentFailed` (in `utils/payment-handlers.ts`).
    - `membershipWentInvalid` → `handleMembershipChange` (in `utils/membership-handlers.ts`).

#### Plan metadata and constants
- `app/api/whop/webhooks/utils/constants.ts` defines:
  - `FREE_TIER_CREDITS` (5) and `PRO_TIER_CREDITS` (1000) per subscription cycle.
  - `CREDIT_RENEWAL_DAYS` (28), which controls how often credits reset.
  - `PATHS_TO_REVALIDATE` and `SUCCESS_PATHS`, which are used to revalidate key Next.js routes (`/dashboard`, `/notes`, `/`, `/api/user/status`, etc.).
- `plan-utils.ts` uses `WHOP_PLAN_ID_MONTHLY` and `WHOP_PLAN_ID_YEARLY` from env to classify a plan as `monthly` or `yearly`, and provides helpers for billing cycle calculations and timestamp conversion.

#### Authenticated Whop payments
- For **authenticated users** (who already have a Clerk account):
  - `handlePaymentSuccess` in `payment-handlers.ts`:
    - Uses `extractUserId` from `user-utils.ts` to pull the Clerk `userId` from webhook metadata or membership metadata.
    - Computes `billingCycleStart` / `billingCycleEnd` using provided renewal timestamps or `determinePlanType` as a fallback.
    - Sets `planDuration`, resets `usageCredits` to `PRO_TIER_CREDITS` and `usedCredits` to 0, updates `nextCreditRenewal`, marks `membership` as `pro` and `status` as `active`, and stores the Whop IDs.
    - Uses retry logic for profile updates, then calls `revalidateAfterPayment()` from `path-utils.ts` to refresh relevant pages.
  - `handlePaymentFailed` marks the user's profile `status` as `payment_failed`, first using `extractUserId` and then falling back to lookup by `whopUserId` if needed.

#### Frictionless payments ("Pay First, Create Account Later")
Unauthenticated purchases (email-only) are handled by a **separate frictionless flow**:

- `isFrictionlessPayment` in `frictionless-payment-handlers.ts` inspects webhook `metadata` and `membership_metadata` for an email and/or `isUnauthenticated` flag to decide if the event belongs to the frictionless path.
- When `handlePaymentSuccess` detects a frictionless payment:
  - It delegates to `handleFrictionlessPayment` in `frictionless-payment-handlers.ts`.
  - That function extracts the email and optional token from `membership_metadata` or `metadata`.
  - If a regular `profiles` row already exists for this email (and has a non-temporary `userId`), it updates that profile with the same PRO upgrade logic as the authenticated flow.
  - Otherwise, it calls `createOrUpdatePendingProfile` to write a **pending profile** into `pending_profiles` with:
    - Whop IDs, plan duration, billing cycle dates, credits, and token.
    - `claimed = false` and no `claimedByUserId` yet.
  - Afterward it revalidates relevant paths.
- Later, when the user signs up or signs in with Clerk using the same email, `claimPendingProfile` in `actions/whop-actions.ts`:
  - Checks if the user already has a PRO profile; if so, no-op.
  - Looks for a matching pending profile in `pending_profiles` (or, as a legacy fallback, a `profiles` row with a temporary ID).
  - If found, either:
    - **Merge flow** – updates an existing profile with all PRO-related data from the pending record, or
    - **Create flow** – creates a brand-new profile using the pending record's data.
  - Marks the pending profile as claimed via `markPendingProfileAsClaimed` but intentionally **does not delete it**, preserving it for analytics/auditing.
  - Revalidates `/`, `/notes`, and `/dashboard`.

#### Cancellations and downgrades
- `handleMembershipChange` in `membership-handlers.ts` handles cancellations (`membership.went_invalid` events):
  - Prefers a Clerk `userId` from metadata; if absent, falls back to looking up a profile by `whopUserId`.
  - Delegates to `handleMembershipCancellation`, which:
    - Directly updates the profile to `membership = "free"` and `status = "canceled"` with retry/timeout protection.
    - Leaves existing credits untouched so that dashboard logic can decide when and how to downgrade usage.
    - Calls `revalidateAfterCancellation()`.
- In the dashboard layout, `checkExpiredSubscriptionCredits` ensures that free users with an expired `billingCycleEnd` get their credits reset back to free-tier (5 credits) and status updated appropriately.

### Server actions layer
- Actions live in the root `actions/` directory, not under `app/`.
  - `actions/profiles-actions.ts` wraps profile operations (create/read/update/delete) and exposes `checkPaymentFailedAction` and `getUserPlanInfoAction` for UI components.
  - `actions/whop-actions.ts` contains Whop-related actions (`updateWhopCustomer`, `manageWhopMembershipStatusChange` as a legacy fallback, `canAccessPremiumFeatures`, and the frictionless `claimPendingProfile` flow).
- All actions are marked with `"use server"` and return typed results. The standard return signature is `ActionResult<T>` (from `types/actions/actions-types.ts`), which includes `isSuccess`, `message`, and optional `data`.
- When adding new actions, create a new file in `actions/` (e.g. `example-actions.ts`) and import from the appropriate queries.

### Backend conventions (from `prompts/instructions/backend-instructions.md`)
When building new backend features:

1. **New tables** go in a new schema file in `db/schema/` (e.g. `example-schema.ts`).
2. **Export** any new schemas in `db/schema/index.ts`.
3. **Add** new tables to the `schema` object in `db/db.ts`.
4. **New queries** go in a new file in `db/queries/` (e.g. `example-queries.ts`).
5. **Add new actions** to a new actions file in `actions/` (e.g. `example-actions.ts`).
6. **Use** the `ActionResult` type from `types/actions/actions-types.ts` for action return values.
7. After completing schema changes, generate and apply migrations using `npm run db:generate` and `npm run db:migrate`.
8. Data fetching should be done in server components and passed to client components as props.

### Frontend conventions (from `prompts/instructions/frontend-instructions.md`)
When building new frontend features:

1. **New components** go in `components/` at the root (not in `app/`), named like `example-component.tsx`, unless otherwise specified. Group related components into folders.
2. **New pages** go in `app/`.
3. **Use Next.js 14 App Router** patterns.
4. **All data fetching** should be done in server components and passed down as props.
5. **Client components** (that use `useState`, hooks, etc.) require `"use client"` at the top of the file.
6. **Import `useRouter`** from `next/navigation` (not `next/router`).

### Styling and UI
- Uses **Tailwind CSS** for styling, configured in `tailwind.config.ts` with a dark mode strategy and ShadCN theme variables.
- **ShadCN UI** components (`components/ui/`) provide accessible, composable primitives. Import these directly from `@/components/ui/`.
- **Framer Motion** (`framer-motion`) is used for animations, particularly in the marketing pages (see `app/(marketing)/components/` for animated hero, features, reviews, CTA).

### Environment variables (from README.md)
Create a `.env.local` file with:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://<user>:<password>@db.<project>.supabase.co:6543/postgres"

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Payments (Stripe - optional if using Whop exclusively)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PORTAL_LINK="https://billing.stripe.com/p/session/..."
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY="https://buy.stripe.com/..."
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY="https://buy.stripe.com/..."

# Payments (Whop)
WHOP_API_KEY="..."
WHOP_PLAN_ID_MONTHLY="..."
WHOP_PLAN_ID_YEARLY="..."
```

Keep `.env.local` **private** – never commit it to Git!

---

## Additional notes

### Deployment
- The app is designed to deploy on **Vercel**.
- Push code to GitHub, import the project in Vercel, and add the same environment variables from `.env.local` to the Vercel dashboard.
- Vercel will build and deploy automatically.

### Project structure
```
.
├── actions/           # Server actions
├── app/               # Next.js app router structure
├── components/        # UI components (ShadCN based)
├── db/                # Drizzle config & migrations
│   ├── schema/        # Table schemas
│   ├── queries/       # Reusable query files
│   └── migrations/    # Generated SQL migrations
├── lib/               # Utility helpers (utils.ts, stripe.ts, whop.ts)
├── types/             # TypeScript types
├── prompts/           # Internal instructions and docs
└── src/remotion/      # Remotion video compositions
```

### Key conventions
- **Components** – name files like `example-component.tsx`.
- **Actions** – name files like `example-actions.ts`.
- **Schema** – table schemas in `db/schema/`.
- **Queries** – reusable query files in `db/queries/`.

### Troubleshooting (from README.md)
- **Module not found** after install → delete `node_modules` and `package-lock.json`, then run `npm install` again.
- **Clerk fails locally** → ensure the publishable key starts with `pk_` and matches your Clerk instance's frontend API.
- **Supabase connection errors** → check `DATABASE_URL` format and that your IP is allowed if using direct connections.
- **Stripe webhooks not firing locally** → use `stripe listen` or a tunnelling tool like ngrok.

If none of these solve your problem, email **usecodespring@gmail.com** with logs and a description of the issue.
