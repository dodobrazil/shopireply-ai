# ShopiReply AI

> AI-powered customer reply generator for Etsy, Shopify, Trendyol, Amazon, and Instagram sellers.

**Turn messy customer messages into professional replies in 10 seconds.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/shopireply-ai)

---

## Quick Start

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- An [OpenAI API key](https://platform.openai.com) (or compatible provider)

### 1. Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/shopireply-ai.git
cd shopireply-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials (see below)
# Then start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### 2. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Note your **Project URL** and **Anon key** from Settings → API
3. Note your **Service role key** (keep this secret!)
4. In your Supabase dashboard → SQL Editor, run the migration files in order:

```sql
-- Step 1: Run migrations/001_initial_schema.sql
-- Step 2: Run migrations/002_rls_policies.sql
-- Step 3 (optional): Run migrations/003_seed_data.sql
```

5. In Supabase → Authentication → Email Templates, customize if needed
6. In Supabase → Authentication → URL Configuration:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/dashboard`

---

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

#### Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

AI_API_KEY=sk-your-openai-key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

#### Optional (Stripe - for international payments)
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
```

**Note:** If Stripe keys are absent, the app automatically shows "Contact for subscription" flow.

#### Optional (Turkish payments - iyzico/PayTR)
```env
MANUAL_PAYMENT_CONTACT_EMAIL=billing@yourdomain.com
MANUAL_PAYMENT_WHATSAPP=+90XXXXXXXXXX
```

See `lib/payments/manual.ts` for the placeholder interface to replace with real iyzico/PayTR SDK.

#### Admin Access
```env
ADMIN_EMAILS=admin@yourdomain.com,another@admin.com
```

---

### 4. Run Migrations

In Supabase SQL Editor, run in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_seed_data.sql` (optional, for admin utilities)

---

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or use the Vercel dashboard:
1. Import your GitHub repository
2. Add all environment variables in Vercel dashboard
3. Deploy

---

### 6. Configure Custom Domain

1. In Vercel dashboard → Domains → Add your domain
2. Update `NEXT_PUBLIC_APP_URL` to your domain
3. In Supabase → Auth → URL Configuration, update to your domain

---

### 7. Configure Payment

#### Stripe (International)
1. Create account at [stripe.com](https://stripe.com)
2. Create products and recurring prices for Starter ($9.99/mo) and Pro ($19.99/mo)
3. Copy price IDs to `.env`
4. Set up webhook at `https://yourdomain.com/api/stripe/webhook`
5. Subscribe to events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

#### iyzico/PayTR (Turkey)
1. Open `lib/payments/manual.ts`
2. Replace the `initiateManualPayment` placeholder with real iyzico/PayTR SDK code
3. Add your API keys to `.env`
4. The payment flow will automatically activate when `MANUAL_PAYMENT_CONTACT_EMAIL` is set

---

### 8. First 10 Customer Acquisition Steps

**Goal: $100 MRR (10-11 users at $9.99/month)**

1. **Find weak listings**: Search Etsy for products in your niche. Filter by sellers with generic/broken English descriptions.

2. **Send DM with value**: Copy a seller's bad description, run it through ShopiReply AI, send them the improved version for free. Use the DM templates in the `/launch-kit` page.

3. **Target Turkish sellers**: Search Instagram hashtags like #etsyturkiye, #etsysatici, #handmadeturkiye. These sellers are most likely to struggle with English.

4. **Post before/after**: Share before/after examples on Twitter/X, Instagram, and relevant subreddits (r/Etsy, r/shopify, r/EtsySellers).

5. **Offer 7-day free trial**: Add a special code in your DMs. Manually upgrade them in the `/admin` panel for 7 days.

6. **Facebook groups**: Post in Etsy seller groups, Shopify merchant communities. Be helpful, not spammy.

7. **Collect testimonials**: After first users get value, ask them for a screenshot testimonial. Use these on your landing page.

8. **SEO content**: Write 2-3 blog posts targeting keywords like "Etsy customer reply template" or "how to write professional Etsy messages".

9. **Referral**: Offer first 5 users a referral link that gives 1 month free for each paid referral.

10. **Convert**: At 10 free users actively using the product, personally follow up with each one. The conversion rate from engaged free → paid should be 30-50%.

**Milestone tracker:**
- Week 1: 20 signups, 100 generations
- Week 2: 5 paid users ($50 MRR)
- Week 4: 10 paid users ($100 MRR) 

---

## Project Structure

```
shopireply-ai/
├── app/
│   ├── api/          # API routes (generate, stripe, admin)
│   ├── dashboard/    # Protected dashboard pages
│   ├── admin/        # Admin panel (protected)
│   ├── examples/     # Public examples page
│   ├── launch-kit/   # Marketing assets (admin only)
│   └── (legal)/      # Terms, Privacy, Refund
├── components/
│   ├── ui/           # Base UI components (shadcn-compatible)
│   ├── dashboard/    # Dashboard-specific components
│   ├── marketing/    # Landing page components
│   └── admin/        # Admin components
├── lib/
│   ├── ai/           # AI provider abstraction
│   ├── payments/     # Stripe + manual payment providers
│   ├── supabase/     # Database clients
│   ├── i18n/         # TR/EN translations
│   └── utils/        # Validation, limits, helpers
├── types/
│   └── database.ts   # Full TypeScript types for DB schema
└── supabase/
    └── migrations/   # SQL migration files
```

---

## Development

```bash
npm run dev         # Start development server
npm run build       # Production build
npm run lint        # Run ESLint
npm run type-check  # TypeScript check
npm run test        # Run unit tests
```

---

## Vercel Deployment Checklist

- [ ] All required env vars set in Vercel dashboard
- [ ] Supabase migrations run
- [ ] Supabase auth URLs updated to production domain
- [ ] AI provider key configured and tested
- [ ] Stripe products and prices created (if using Stripe)
- [ ] Stripe webhook configured
- [ ] Admin email set in ADMIN_EMAILS
- [ ] Custom domain configured
- [ ] Test signup → dashboard → generate flow
- [ ] Test payment flow (Stripe test mode first)
- [ ] Check mobile responsiveness
- [ ] Verify RLS policies are working (can't access other users' data)

---

## Complete Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | | Supabase service role key (server only) |
| `AI_API_KEY` | | OpenAI or compatible API key |
| `AI_BASE_URL` | Optional | AI endpoint (default: OpenAI) |
| `AI_MODEL` | Optional | Model name (default: gpt-4o-mini) |
| `STRIPE_SECRET_KEY` | Optional | Enables Stripe checkout |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe client key |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhook verification |
| `STRIPE_PRICE_STARTER_MONTHLY` | Optional | Stripe price ID for Starter |
| `STRIPE_PRICE_PRO_MONTHLY` | Optional | Stripe price ID for Pro |
| `MANUAL_PAYMENT_CONTACT_EMAIL` | Optional | Fallback payment contact |
| `MANUAL_PAYMENT_WHATSAPP` | Optional | WhatsApp for manual payment |
| `ADMIN_EMAILS` | Optional | Comma-separated admin emails |
| `NEXT_PUBLIC_APP_URL` | Optional | Production URL |
| `NEXT_PUBLIC_APP_NAME` | Optional | App name (default: ShopiReply AI) |

---

## License

MIT — Build, modify, and sell however you like.
