# Environment Variables Documentation

## Overview

This document describes the environment variable naming conventions and configuration for the Thorbis application.

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`

3. Never commit `.env.local` to version control

## Naming Conventions

### Prefixes

- **`NEXT_PUBLIC_*`** - Variables that need to be accessible in the browser
  - Example: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - These are embedded in the client-side bundle
  - **Security**: Never put secrets in `NEXT_PUBLIC_*` variables

- **No prefix** - Server-side only variables
  - Example: `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - These are only accessible in server-side code (API routes, Server Components, Server Actions)
  - **Security**: These values are never exposed to the browser

### Naming Format

All environment variables should follow these rules:

1. **UPPERCASE_SNAKE_CASE** - All caps with underscores
   - ✅ `STRIPE_SECRET_KEY`
   - ❌ `stripeSecretKey` or `stripe-secret-key`

2. **Descriptive Names** - Clear purpose without being verbose
   - ✅ `STRIPE_WEBHOOK_SECRET`
   - ❌ `STRIPE_WH_SEC` or `STRIPE_WEBHOOK_SECRET_KEY_FOR_PRODUCTION`

3. **Service Prefixes** - Group related variables with service name
   - ✅ `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_BASE_PLAN`
   - ❌ `SECRET_KEY`, `WEBHOOK_SECRET`, `BASE_PLAN_PRICE_ID`

4. **Consistent Suffixes** - Use standard suffixes
   - `*_KEY` - API keys and secrets
   - `*_URL` - Endpoint URLs
   - `*_ID` - Identifiers
   - `*_SECRET` - Webhook secrets and tokens
   - `*_ENV` - Environment specifiers (sandbox, production)

## Required vs Optional Variables

### Required Variables

These variables MUST be set for the application to function:

**Application**
- `NODE_ENV` - Node environment (development, production, test)
- `NEXT_PUBLIC_APP_ENV` - Application environment
- `NEXT_PUBLIC_SITE_URL` - Site URL for redirects

**Database (Supabase)**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `DATABASE_URL` - PostgreSQL connection string

**Payments (Stripe)**
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_PRICE_ID_*` - All price IDs for subscription tiers

**Communications (Telnyx)**
- `TELNYX_API_KEY` - Telnyx API key
- `NEXT_PUBLIC_TELNYX_CONNECTION_ID` - WebRTC connection ID

**Email (Resend)**
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Sender email address

**Banking (Plaid)**
- `PLAID_CLIENT_ID` - Plaid client ID
- `PLAID_SECRET` - Plaid secret key
- `PLAID_ENV` - Plaid environment (sandbox, production)

### Optional Variables

These variables enable additional features:

**AI Providers**
- `OPENAI_API_KEY` - OpenAI/ChatGPT integration
- `ANTHROPIC_API_KEY` - Anthropic/Claude integration
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI integration

**Maps & Location**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - Google Places autocomplete

**Data Enrichment**
- `HUNTER_API_KEY` - Email verification
- `RENTCAST_API_KEY` - Property valuation data

**Security**
- `CRON_SECRET` - Cron job authentication
- `INVITATION_SECRET` - Team invitation tokens

## Environment-Specific Configuration

### Local Development

```bash
NODE_ENV="development"
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
PLAID_ENV="sandbox"
STRIPE_SECRET_KEY="sk_test_..." # Use test keys
```

### Production

```bash
NODE_ENV="production"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
PLAID_ENV="production"
STRIPE_SECRET_KEY="sk_live_..." # Use live keys
```

## Security Best Practices

### DO ✅

1. **Keep secrets in `.env.local`** - Never commit to version control
2. **Use different keys for development and production**
3. **Rotate keys regularly** - Especially after team member changes
4. **Use least privilege** - Only grant necessary permissions
5. **Monitor usage** - Track API key usage for anomalies
6. **Use `NEXT_PUBLIC_*` only when necessary** - Minimize client-side exposure
7. **Validate environment variables** - Check they exist at runtime
8. **Use TypeScript for type safety** - Define env variable types
9. **Document all variables** - Keep `.env.example` up to date
10. **Use secret managers in production** - Vercel, AWS Secrets Manager, etc.

### DON'T ❌

1. **Never commit `.env.local`** - Always in `.gitignore`
2. **Never put secrets in `NEXT_PUBLIC_*`** - They're exposed to browser
3. **Never hardcode secrets** - Always use environment variables
4. **Never share production keys** - Use separate keys per environment
5. **Never log secrets** - Redact in logging/error messages
6. **Never use production keys in development** - Keep environments separate
7. **Never push keys to frontend** - Keep server-only variables server-only
8. **Don't use overly generic names** - `API_KEY` is too vague
9. **Don't skip validation** - Always check required variables exist
10. **Don't reuse keys across services** - One compromised key shouldn't expose all

## Variable Groups

### Application Settings
Controls core application behavior and environment configuration.

**Variables:**
- `NODE_ENV`
- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_SITE_URL`

### Supabase (Database & Auth)
PostgreSQL database and authentication via Supabase.

**Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `DATABASE_URL`
- `POSTGRES_*` (connection details)

### Stripe (Payments)
Payment processing, subscriptions, and usage-based billing.

**Variables:**
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_*` (12 price IDs)

### Telnyx (Communications)
VoIP calling, SMS, and WebRTC functionality.

**Variables:**
- `TELNYX_API_KEY`
- `TELNYX_PUBLIC_KEY`
- `TELNYX_WEBHOOK_SECRET`
- `NEXT_PUBLIC_TELNYX_CONNECTION_ID`

### Resend (Email)
Transactional email delivery.

**Variables:**
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_FROM_NAME`

### Plaid (Banking)
Bank account connections and financial data.

**Variables:**
- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV`

### AI Providers
Large language model integrations.

**Variables:**
- `AI_PROVIDER`
- `AI_MODEL`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `AI_GATEWAY_URL`
- `AI_GATEWAY_TOKEN`

### Google Services
Maps, Places, and other Google APIs.

**Variables:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACES_API_KEY`

### Data Enrichment
Third-party data providers for enrichment.

**Variables:**
- `HUNTER_API_KEY` (email verification)
- `RENTCAST_API_KEY` (property data)

### Security
Application security and authentication.

**Variables:**
- `CRON_SECRET`
- `INVITATION_SECRET`

## Validation

### Runtime Validation

Always validate required environment variables at application startup:

```typescript
// lib/env.ts
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

// Usage
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const stripeKey = getEnvVar('STRIPE_SECRET_KEY');
```

### TypeScript Type Safety

Define environment variable types:

```typescript
// env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Application
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
      NEXT_PUBLIC_SITE_URL: string;

      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;

      // Stripe
      STRIPE_SECRET_KEY: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;

      // ... other variables
    }
  }
}

export {};
```

## Troubleshooting

### Variable Not Found

**Problem:** `undefined` when accessing environment variable

**Solutions:**
1. Check variable exists in `.env.local`
2. Restart development server after adding new variables
3. For client variables, ensure `NEXT_PUBLIC_` prefix
4. Verify no typos in variable name

### Variable Not Accessible in Browser

**Problem:** Server-side variable is `undefined` in client code

**Solution:** Add `NEXT_PUBLIC_` prefix if variable needs browser access. **Warning:** Never expose secrets!

### Build-Time vs Runtime

**Important:** Environment variables are embedded at build time for static pages. For dynamic values, use:

1. Server Components (always runtime)
2. API Routes (always runtime)
3. Server Actions (always runtime)

**Don't use client-side `process.env` for runtime config** - it's replaced at build time.

## Getting API Keys

### Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy Project URL and anon/public key

### Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API Keys
3. Copy Publishable key and Secret key
4. For webhooks: Developers → Webhooks → Add endpoint

### Telnyx
1. Go to [Telnyx Portal](https://portal.telnyx.com)
2. API Keys → Create New Key
3. For WebRTC: Mission Control → Connections

### Resend
1. Go to [Resend](https://resend.com)
2. API Keys → Create API Key
3. Configure sender domain

### Plaid
1. Go to [Plaid Dashboard](https://dashboard.plaid.com)
2. Team Settings → Keys
3. Copy client_id and secrets

## Migration from Old Variables

If migrating from an older version with different variable names:

### Removed/Consolidated Variables

These duplicates were removed in favor of single source of truth:

- ❌ `SUPABASE_URL` → ✅ Use `NEXT_PUBLIC_SUPABASE_URL`
- ❌ `SUPABASE_ANON_KEY` → ✅ Use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `PLAID_SECRET_SANDBOX` → ✅ Use `PLAID_SECRET` with `PLAID_ENV=sandbox`

## Support

For issues with environment variables:

1. Check this documentation
2. Review `.env.example` for correct format
3. Verify all required variables are set
4. Check the application logs for specific error messages
5. Ensure development server was restarted after changes

## Changelog

### 2025-01-16
- Complete reorganization of `.env.local` with clear grouping
- Removed duplicate variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- Added comprehensive inline documentation
- Created detailed `.env.example` with all variables
- Established clear naming conventions
- Documented security best practices
