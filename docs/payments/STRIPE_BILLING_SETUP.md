# Thorbis Stripe Billing Integration - Pay-As-You-Go Model

This document explains the complete Stripe billing integration for Thorbis with usage-based pricing.

## Overview

Thorbis uses a **pay-as-you-go pricing model** with a $100/month base fee plus usage-based charges:

- **Base Fee**: $100/month (platform access)
- **Usage Charges**: Billed in arrears based on actual usage
- **Billing Cycle**: Monthly (1st of each month)
- **Payment Processing**: Secure payment handling via Stripe Checkout
- **Multi-Organization Support**: Additional organizations add $100/month each

### Pricing Breakdown

| Service | Price |
|---------|-------|
| **Monthly Platform Fee** | $100.00 |
| Team Members | $5.00 per user |
| Customer Invoices | $0.15 per invoice |
| Price Quotes/Estimates | $0.10 per quote |
| Text Messages (SMS) | $0.02 per text |
| Emails Sent | $0.005 per email |
| Video Calls | $0.05 per minute |
| Phone Calls | $0.02 per minute |
| File Storage | $0.50 per GB |
| Payments Collected | $0.29 + 2.9% per transaction |
| Automated Actions | $0.10 per workflow |
| API Calls | $0.001 per call |

## Architecture

### Database Schema

```sql
-- Users table
ALTER TABLE users
ADD COLUMN stripe_customer_id TEXT UNIQUE;

-- Companies table
ALTER TABLE companies
ADD COLUMN stripe_subscription_id TEXT UNIQUE,
ADD COLUMN stripe_subscription_status TEXT,
ADD COLUMN subscription_current_period_start TIMESTAMPTZ,
ADD COLUMN subscription_current_period_end TIMESTAMPTZ,
ADD COLUMN subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE,
ADD COLUMN trial_ends_at TIMESTAMPTZ;
```

### Key Components

1. **Server-side Utilities** (`/src/lib/stripe/server.ts`)
   - Stripe API client initialization
   - Customer creation and retrieval
   - Checkout session creation
   - Billing portal session creation
   - Subscription management (cancel, reactivate)

2. **Client-side Utilities** (`/src/lib/stripe/client.ts`)
   - Lazy-loaded Stripe.js client
   - Singleton pattern for optimal performance

3. **Server Actions** (`/src/actions/billing.ts`)
   - `createOrganizationCheckoutSession()` - Start subscription for new org
   - `createBillingPortal()` - Access Stripe billing portal
   - `getCompanySubscriptionStatus()` - Get subscription details
   - `cancelCompanySubscription()` - Cancel at period end
   - `reactivateCompanySubscription()` - Remove cancellation

4. **Webhook Handler** (`/src/app/api/webhooks/stripe/route.ts`)
   - Processes Stripe webhook events
   - Updates database based on subscription changes
   - Handles checkout completion, subscription updates, payments

5. **UI Components**
   - `SubscriptionCard` - Display subscription details per organization
   - `OrganizationCreationWizard` - Integrated with Stripe checkout
   - Subscriptions page - Manage all org subscriptions

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm add stripe @stripe/stripe-js
```

### 2. Environment Variables

Add to your `.env.local`:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret (get from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_ID_BASE_PLAN=price_...
STRIPE_PRICE_ID_ADDITIONAL_ORG=price_...

# Site URL for redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Create Stripe Products & Prices

In your Stripe Dashboard (https://dashboard.stripe.com):

#### Base Plan Product
1. Go to Products → Create Product
2. Name: "Thorbis Base Plan"
3. Pricing: Recurring → Monthly
4. Add price (e.g., $29/month)
5. Copy the Price ID → Set as `STRIPE_PRICE_ID_BASE_PLAN`

#### Additional Organization Product
1. Create another product
2. Name: "Additional Organization"
3. Pricing: Recurring → Monthly → $100/month
4. Copy the Price ID → Set as `STRIPE_PRICE_ID_ADDITIONAL_ORG`

### 4. Run Database Migration

```bash
# Apply the Stripe billing migration
pnpm supabase migration up
```

Or manually run:
```bash
psql $DATABASE_URL < supabase/migrations/20251031221444_add_stripe_billing.sql
```

### 5. Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret → Set as `STRIPE_WEBHOOK_SECRET`

## User Flow

### Creating First Organization

1. User clicks "Add new business" in user menu
2. Fills out organization creation form
3. Acknowledges pricing (no fee for first org)
4. Submits form
5. **Organization created in database**
6. **Redirected to Stripe Checkout**
7. Enters payment details
8. Completes checkout
9. Stripe webhook updates database with subscription
10. Redirected back to dashboard

### Creating Additional Organization

Same flow, but:
- User sees "$100/month" warning
- Must check acknowledgment box
- Checkout includes both base plan + $100 addon
- Stripe charges accordingly

### Managing Subscriptions

Users can:
- View all organization subscriptions at `/dashboard/settings/subscriptions`
- See subscription status (active, trial, past due, canceled)
- Access Stripe billing portal to:
  - Update payment method
  - View invoices
  - Download receipts
- Cancel subscription (access until period end)
- Reactivate canceled subscription

## Webhook Event Processing

### `checkout.session.completed`
- Triggered when user completes payment
- Updates company record with subscription details
- Sets status to "active" or "trialing"

### `customer.subscription.updated`
- Triggered on subscription changes
- Updates billing period dates
- Updates status (active, past_due, etc.)
- Updates cancellation flags

### `customer.subscription.deleted`
- Triggered when subscription fully ends
- Marks subscription as "canceled"
- Removes cancellation flag

### `invoice.payment_succeeded`
- Triggered on successful payment
- Ensures subscription status is "active"

### `invoice.payment_failed`
- Triggered on payment failure
- Updates status to "past_due"

## Security Considerations

1. **Webhook Signature Verification**
   - All webhook requests are verified using `stripe.webhooks.constructEvent()`
   - Prevents unauthorized database updates

2. **Server-side Only**
   - All Stripe secret key operations are server-side
   - Client only has publishable key (safe for public)

3. **RLS Policies**
   - Database access controlled by Supabase RLS
   - Users can only access their own organizations

4. **Owner-only Actions**
   - Only organization owners can cancel/reactivate
   - Verified server-side before processing

## Testing

### Test Cards (Stripe Test Mode)

```
# Success
4242 4242 4242 4242

# Decline
4000 0000 0000 0002

# Requires 3D Secure
4000 0025 0000 3155
```

### Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## Monitoring

### Check Subscription Status

```typescript
// In any server component or action
import { getCompanySubscriptionStatus } from "@/actions/billing";

const result = await getCompanySubscriptionStatus(companyId);
if (result.success) {
  console.log(result.data.stripe_subscription_status);
}
```

### View Stripe Dashboard

- Events log: https://dashboard.stripe.com/events
- Subscriptions: https://dashboard.stripe.com/subscriptions
- Customers: https://dashboard.stripe.com/customers

## Pricing Model Details

```
First Organization:
  Base Plan: $X/month (set in Stripe)

Additional Organizations (each):
  Base Plan: $X/month
  + Additional Org Fee: $100/month
  = Total: $(X + 100)/month per additional org

Example with 3 organizations:
  Org 1: $X/month (base only)
  Org 2: $(X + 100)/month
  Org 3: $(X + 100)/month
  Total: $(3X + 200)/month
```

## Troubleshooting

### Subscription Not Created After Checkout

1. Check Stripe Dashboard → Events for webhook delivery
2. Verify webhook secret is correct
3. Check server logs for webhook processing errors
4. Ensure database migration ran successfully

### "No billing account found" Error

1. Verify user has `stripe_customer_id` in database
2. Check that customer exists in Stripe Dashboard
3. Ensure Stripe API keys are configured correctly

### Payment Failed

1. User will see status change to "past_due"
2. Stripe automatically retries failed payments
3. User can update payment method in billing portal
4. Webhook will update status back to "active" on success

## Support

For Stripe-related issues:
- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Webhook Testing: https://stripe.com/docs/webhooks/test

For implementation questions:
- Review code in `/src/lib/stripe/`
- Check server actions in `/src/actions/billing.ts`
- Inspect webhook handler at `/src/app/api/webhooks/stripe/route.ts`
