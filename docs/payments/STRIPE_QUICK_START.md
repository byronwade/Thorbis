# Stripe Billing - Quick Start Checklist

**Complete Stripe pay-as-you-go billing setup in 30-45 minutes**

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Supabase project with database access

## Step 1: Install Stripe (Already Done ✅)

```bash
pnpm add stripe @stripe/stripe-js
```

## Step 2: Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## Step 3: Create Products in Stripe

### Base Plan Product
1. Go to https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**
3. Fill in:
   - Name: `Thorbis Base Plan`
   - Description: `Monthly subscription for first organization`
   - Pricing model: `Recurring`
   - Billing period: `Monthly`
   - Price: `$29.00` (or your preferred base price)
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_`)

### Additional Organization Addon
1. Click **"+ Add product"** again
2. Fill in:
   - Name: `Additional Organization`
   - Description: `Add another organization to your account`
   - Pricing model: `Recurring`
   - Billing period: `Monthly`
   - Price: `$100.00`
3. Click **"Save product"**
4. **Copy the Price ID** (starts with `price_`)

## Step 4: Set Environment Variables

Create or update `.env.local`:

```env
# Stripe Keys (from Step 2)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs (from Step 3)
STRIPE_PRICE_ID_BASE_PLAN=price_...          # First price ID you copied
STRIPE_PRICE_ID_ADDITIONAL_ORG=price_...      # Second price ID you copied

# Site URL (for redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 5: Run Database Migration

```bash
# Apply the migration
NODE_ENV=production pnpm supabase migration up

# Or manually:
psql $DATABASE_URL -f supabase/migrations/20251031221444_add_stripe_billing.sql
```

## Step 6: Set Up Webhook (For Production)

**For local development, skip this step initially**

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Description: `Thorbis Subscription Events`
5. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Click **"Add endpoint"**
7. Click on the webhook you just created
8. Click **"Reveal"** next to "Signing secret"
9. Copy the secret (starts with `whsec_`)
10. Add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 7: Test It Out!

1. Start your dev server:
   ```bash
   pnpm dev
   ```

2. Login to your app

3. Click **"Add new business"** in the user menu

4. Fill out the organization form

5. Click **"Create Organization"**

6. You'll be redirected to Stripe Checkout

7. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

8. Complete checkout

9. You'll be redirected back to your app

10. Check `/dashboard/settings/subscriptions` to see your active subscription!

## Verify It Worked

### Check Database
```sql
-- Check user has Stripe customer ID
SELECT stripe_customer_id FROM users WHERE email = 'your@email.com';

-- Check company has subscription
SELECT
  name,
  stripe_subscription_status,
  stripe_subscription_id
FROM companies
WHERE stripe_subscription_status = 'active';
```

### Check Stripe Dashboard
1. Go to https://dashboard.stripe.com/test/customers
2. You should see a customer with your email
3. Click on the customer
4. You should see an active subscription

## Local Webhook Testing (Optional)

For testing webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger test events
stripe trigger checkout.session.completed
```

## What's Next?

- **Production Setup**: Repeat steps 2-6 with production keys from https://dashboard.stripe.com/apikeys
- **Customize Pricing**: Update product prices in Stripe Dashboard
- **Add Features**: Customize subscription features per plan
- **Monitor**: Watch subscriptions in Stripe Dashboard

## Common Issues

### "Stripe not configured" Error
→ Check that `STRIPE_SECRET_KEY` is set in `.env.local`
→ Restart your dev server after adding env variables

### Checkout Page Won't Load
→ Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
→ Check browser console for errors
→ Ensure price IDs are correct

### Subscription Not Created After Payment
→ Check that webhook is configured (production only)
→ For local dev, webhook updates won't work without Stripe CLI
→ Manually update database or use Stripe CLI forwarding

### "No billing account found" in Billing Portal
→ User doesn't have a Stripe customer yet
→ They need to complete checkout first
→ Check `stripe_customer_id` in users table

## Support Resources

- Stripe Testing Cards: https://stripe.com/docs/testing
- Stripe Webhooks Guide: https://stripe.com/docs/webhooks
- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
- Full Documentation: See `STRIPE_BILLING_SETUP.md`

## Quick Reference

```bash
# Start dev server
pnpm dev

# Run migration
NODE_ENV=production pnpm supabase migration up

# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed

# View logs
stripe logs tail
```

**You're all set! 🎉**

Users can now create organizations and subscribe with Stripe billing.
