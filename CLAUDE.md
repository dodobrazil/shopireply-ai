# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ShopiReply AI** is an AI-powered customer reply generator for e-commerce sellers on Etsy, Shopify, Trendyol, Amazon, and Instagram. It uses OpenAI (or compatible) APIs to generate professional customer messages, product descriptions, SEO titles, review responses, and more. The app supports freemium pricing with Stripe integration (international) and manual payment fallback (for Turkish markets via iyzico/PayTR).

## Tech Stack

- **Framework**: Next.js 15.1.0 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19 with Radix UI components and shadcn/ui patterns
- **Styling**: Tailwind CSS 3.4 with custom animations
- **Database**: Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Auth**: Supabase Auth with middleware-based session management
- **AI Provider**: OpenAI SDK with environment-based configuration (supports compatible providers)
- **Payments**: Stripe for international payments; manual payment provider for manual/iyzico integration
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest with ts-jest for TypeScript support
- **Linting**: ESLint with next/core-web-vitals config
- **Icons**: Lucide React
- **i18n**: Custom React Context-based translations (EN/TR/Bilingual)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Run ESLint
npm run lint

# Type checking (without emitting)
npm run type-check

# Run tests
npm run test
```

## Project Structure

```
shopireply-ai/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # Server-side API endpoints
│   │   ├── generate/route.ts        # Core AI generation endpoint (auth + limit checking + DB save)
│   │   ├── stripe/                  # Payment webhook & checkout handlers
│   │   ├── admin/users/route.ts     # Admin user management
│   │   └── analytics/copy/route.ts  # Usage tracking
│   ├── dashboard/         # Protected user dashboard pages
│   │   ├── generate/      # Main generation interface
│   │   ├── history/       # Saved generations
│   │   └── settings/      # User profile & preferences
│   ├── admin/            # Admin panel (protected)
│   ├── (auth)/           # Auth pages (login, signup, forgot-password)
│   ├── (legal)/          # Public legal pages (terms, privacy, refund)
│   ├── examples/         # Public examples showcase
│   ├── launch-kit/       # Marketing assets
│   └── layout.tsx        # Root layout with LanguageProvider & Toaster
│
├── components/
│   ├── ui/               # Base Radix UI components (button, input, select, etc.)
│   ├── dashboard/        # Dashboard-specific components (header, sidebar)
│   ├── marketing/        # Landing page components (nav, hero, footer)
│   └── admin/            # Admin panel components
│
├── lib/
│   ├── ai/
│   │   └── provider.ts   # OpenAI client abstraction with prompt builders
│   │                      # - Supports 7 generation modes (customer_reply, product_description, etc.)
│   │                      # - Prompt engineering with brand voice injection
│   │                      # - Output parsing (handles multiple formats)
│   ├── payments/
│   │   ├── stripe.ts     # Stripe client initialization & plan mapping
│   │   └── manual.ts     # Placeholder for iyzico/PayTR integration
│   ├── supabase/
│   │   ├── server.ts     # Server-side Supabase client (with service role variant)
│   │   ├── client.ts     # Client-side Supabase client (browser)
│   │   └── middleware.ts # Session refresh middleware
│   ├── i18n/
│   │   └── translations.tsx # Language context + EN/TR strings
│   └── utils/
│       ├── limits.ts     # Plan tier logic (free: 10, starter: 500, pro: 2000 generations/month)
│       ├── validation.ts # Zod schemas for API request validation
│       └── utils.ts      # Helper utilities
│
├── types/
│   └── database.ts       # Full Supabase database type definitions (auto-generated)
│
├── hooks/
│   └── use-toast.ts      # Toast notification hook
│
├── supabase/
│   └── migrations/       # SQL migration files (001_schema, 002_rls_policies, 003_seed_data)
│
├── __tests__/           # Test files
├── public/              # Static assets (og-image.png, favicons, etc.)
├── middleware.ts        # Next.js middleware (session + auth checks)
├── tsconfig.json        # TypeScript config (strict mode, @ alias)
├── next.config.ts       # Next.js configuration (server actions, image remotePatterns)
├── tailwind.config.js   # Tailwind CSS theme (brand colors, animations)
├── jest.config.json     # Jest test configuration
├── .env.example         # Example environment variables
└── README.md            # Deployment & setup guide
```

## Architecture & Data Flow

### Generation Flow (Core)

1. **Client (generate/page.tsx)**
   - User selects mode, platform, tone, language
   - Inputs customer message or product description
   - Optional: Sets brand voice override
   - Submits to `/api/generate`

2. **API Route (/api/generate)**
   - Authenticates user via Supabase Auth
   - Fetches user profile (plan, limits, saved brand voice)
   - Validates request against `generateRequestSchema` (Zod)
   - Checks monthly generation limit (early return if exceeded)
   - Calls `generateWithAI()` with prompt engineering
   - Saves generation record to `generations` table
   - Increments `monthly_generation_count` in profiles table
   - Logs usage event to `usage_events` table
   - Returns 3 generated options + usage stats

3. **AI Provider (lib/ai/provider.ts)**
   - Builds system + user prompts with context injection:
     - Mode-specific instructions (customer_reply, product_description, etc.)
     - Tone guidance (friendly, professional, apologetic, etc.)
     - Platform context (Etsy, Shopify, Trendyol, etc.)
     - Language rules (EN, TR, or bilingual)
     - Brand voice personality (if provided)
   - Calls OpenAI SDK with temperature=0.8, max_tokens=2000
   - Parses response to extract 3 numbered options
   - Returns parsed outputs

### Database Schema

**profiles** (1 per user)
- Tracks plan (free/starter/pro), monthly usage, subscription status, brand voice preference

**generations** (1 per creation)
- Stores user input, mode, platform, tone, outputs, metadata
- Used for history/stats

**usage_events** (analytics)
- Tracks signup, generation_created, payment events for analytics

All tables have Row-Level Security (RLS) policies to prevent cross-user access.

### Authentication Flow

- Supabase Auth handles signup/login (email-based)
- `middleware.ts` refreshes session on every request
- Protected routes check `getUser()` from Supabase client
- Admin routes verify `email` against `ADMIN_EMAILS` env variable

### Payment Integration

**Stripe (if configured)**
- Webhook at `/api/stripe/webhook` syncs subscription status
- Checkout at `/api/stripe/checkout` creates Stripe sessions
- Plan limits are set on subscription completion

**Manual Payment (fallback)**
- If `STRIPE_SECRET_KEY` is absent, UI shows "Contact for subscription"
- `MANUAL_PAYMENT_CONTACT_EMAIL` and `MANUAL_PAYMENT_WHATSAPP` displayed
- Placeholder in `lib/payments/manual.ts` for iyzico/PayTR SDK integration

## Key Conventions

### Environment Variables

**Required**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-only)
- `AI_API_KEY` - OpenAI or compatible API key
- `AI_BASE_URL` - AI endpoint (default: OpenAI)
- `AI_MODEL` - Model name (default: gpt-4o-mini)

**Optional**
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER_MONTHLY`, `STRIPE_PRICE_PRO_MONTHLY` - Price IDs
- `MANUAL_PAYMENT_CONTACT_EMAIL`, `MANUAL_PAYMENT_WHATSAPP` - Fallback contact
- `ADMIN_EMAILS` - Comma-separated admin email list
- `NEXT_PUBLIC_APP_URL` - Production domain
- `NEXT_PUBLIC_APP_NAME` - Brand name (default: ShopiReply AI)

### Prompt Engineering Pattern (lib/ai/provider.ts)

- System prompt contains role, context, tone, language, brand voice
- Mode-specific instructions vary by task type
- Critical rule: always generate exactly 3 labeled options
- User prompt is simple: context + request for 3 options
- Output parsing handles multiple formats: "Option 1:", "Version 1:", numbered lists, or paragraph splitting

### Validation & Type Safety

- All API requests validated with Zod schemas (generateRequestSchema, profileUpdateSchema)
- Database types auto-generated from Supabase schema in `types/database.ts`
- Path alias `@/*` points to root for clean imports

### Error Handling

- API errors return meaningful messages with HTTP status codes
- AI provider errors caught separately (missing API key, rate limits)
- Graceful fallbacks: generation saved even if DB update fails
- Client-side toasts for user feedback

### UI Patterns

- shadcn/ui components + Radix UI primitives
- Tailwind CSS with custom brand colors (262° hue, purple)
- Dark mode support via Radix UI class-based system
- Custom animations: fade-in, slide-in, shimmer, pulse
- Responsive grid layouts for dashboard & landing page

## Deployment Notes

- Deploy to Vercel (optimized for Next.js)
- All env vars must be set in Vercel dashboard
- Supabase RLS policies must be enforced for security
- Stripe webhook URL must point to `<domain>/api/stripe/webhook`
- Test payment flow in Stripe test mode before production
- Consider rate limiting on `/api/generate` for free tier

## Testing Strategy

- Jest configured for TypeScript files in `__tests__/` or `*.test.ts`
- Test environment is Node (not jsdom) by default
- Module name mapper supports `@/` alias resolution

## Common Modifications

**Add a new generation mode**
1. Add mode to `GenerationMode` union in `lib/ai/provider.ts`
2. Add schema validation in `lib/utils/validation.ts`
3. Add translations in `lib/i18n/translations.tsx`
4. Add prompt template in `buildPrompt()` function
5. Update UI in `app/dashboard/generate/page.tsx` (modes list)

**Change AI provider**
- Modify `createAIClient()` in `lib/ai/provider.ts`
- Ensure client has `.chat.completions.create()` method
- Adjust prompt/response parsing if needed

**Adjust plan limits**
- Update `PLAN_LIMITS` in `lib/utils/limits.ts`
- Update Stripe price IDs in `.env`
- Migrations required for existing users

**Add new database table**
- Create migration in `supabase/migrations/`
- Generate types by running Supabase CLI
- Update `types/database.ts`
- Add RLS policies in migration
