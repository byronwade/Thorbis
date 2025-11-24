# Stripe Onboarding Billing Setup Guide

**Complete guide to setting up Stripe products and prices for onboarding payment collection.**

---

## 📋 Overview

This guide walks through creating all necessary Stripe products and prices to support the onboarding billing flow. These prices enable charging contractors for:

- Phone number porting fees
- New phone number purchase
- Gmail Workspace subscriptions
- Profit Rhino add-on
- Base platform subscription

---

## 🚀 Quick Setup (30 minutes)

### Step 1: Access Stripe Dashboard

1. Go to: https://dashboard.stripe.com/
2. Sign in with Thorbis Stripe account credentials
3. **IMPORTANT:** Ensure you're in **TEST MODE** (toggle in top-right)
   - Test mode first, then repeat for Production mode

---

### Step 2: Create Products

Navigate to: **Products** → **Add Product**

Create the following 6 products:

#### Product 1: Base Platform Subscription
```
Name: Thorbis Platform - Base Plan
Description: Core platform features including CRM, scheduling, unlimited users, and base communication features
Statement Descriptor: THORBIS PLATFORM
```

#### Product 2: Phone Number Porting
```
Name: Phone Number Porting
Description: One-time fee to port existing phone number from another carrier
Statement Descriptor: THORBIS PORTING
```

#### Product 3: New Phone Number Setup
```
Name: New Phone Number - Setup
Description: One-time setup fee for new phone number provisioning
Statement Descriptor: THORBIS PHONE
```

#### Product 4: New Phone Number Monthly
```
Name: New Phone Number - Monthly
Description: Monthly recurring charge for phone number service
Statement Descriptor: THORBIS PHONE
```

#### Product 5: Gmail Workspace
```
Name: Gmail Workspace (per user)
Description: Google Workspace Business Starter - Gmail, Drive (30GB), Calendar, Meet
Statement Descriptor: THORBIS GMAIL
```

#### Product 6: Profit Rhino Add-on
```
Name: Profit Rhino Financing
Description: Flat rate pricing tool and customer financing platform with prebuilt price books
Statement Descriptor: THORBIS PROFIT
```

---

### Step 3: Create Prices for Each Product

For each product created above, create a price:

#### Price 1: Base Platform ($200/month)
```
Product: Thorbis Platform - Base Plan
Pricing Model: Standard pricing
Price: $200.00 USD
Billing Period: Monthly
Usage Type: Licensed
```

#### Price 2: Phone Porting ($15 one-time)
```
Product: Phone Number Porting
Pricing Model: Standard pricing
Price: $15.00 USD
Billing Period: One time
```

#### Price 3: Phone Setup ($5 one-time)
```
Product: New Phone Number - Setup
Pricing Model: Standard pricing
Price: $5.00 USD
Billing Period: One time
```

#### Price 4: Phone Monthly ($2/month)
```
Product: New Phone Number - Monthly
Pricing Model: Standard pricing
Price: $2.00 USD
Billing Period: Monthly
Usage Type: Licensed
```

#### Price 5: Gmail Workspace ($6/user/month)
```
Product: Gmail Workspace (per user)
Pricing Model: Standard pricing
Price: $6.00 USD
Billing Period: Monthly
Usage Type: Licensed
```

#### Price 6: Profit Rhino ($149/month)
```
Product: Profit Rhino Financing
Pricing Model: Standard pricing
Price: $149.00 USD
Billing Period: Monthly
Usage Type: Licensed
```

---

### Step 4: Copy Price IDs

After creating each price:

1. Click on the price to view details
2. Copy the **Price ID** (format: `price_xxxxxxxxxxxxxxxxxxxx`)
3. Save to a temporary document

**You should have 6 price IDs:**
- `price_xxxx` - Base Platform (monthly)
- `price_xxxx` - Phone Porting (one-time)
- `price_xxxx` - Phone Setup (one-time)
- `price_xxxx` - Phone Monthly (recurring)
- `price_xxxx` - Gmail Workspace per user (monthly)
- `price_xxxx` - Profit Rhino (monthly)

---

### Step 5: Add Price IDs to Environment Variables

#### Development (.env.local)

Add the following to `/Users/byronwade/Stratos/.env.local`:

```bash
# ============================================================================
# STRIPE ONBOARDING BILLING PRICE IDS
# ============================================================================
# One-time charges
STRIPE_PRICE_ID_PHONE_PORTING="price_xxxxxxxxxxxxxxxxxxxx"
STRIPE_PRICE_ID_PHONE_NEW_NUMBER_SETUP="price_xxxxxxxxxxxxxxxxxxxx"

# Monthly recurring charges
# (STRIPE_PRICE_ID_BASE_PLAN already exists)
STRIPE_PRICE_ID_PHONE_NEW_NUMBER_MONTHLY="price_xxxxxxxxxxxxxxxxxxxx"
STRIPE_PRICE_ID_GMAIL_WORKSPACE_PER_USER="price_xxxxxxxxxxxxxxxxxxxx"
STRIPE_PRICE_ID_PROFIT_RHINO="price_xxxxxxxxxxxxxxxxxxxx"
```

#### Example Template (.env.example)

Add to `.env.example`:

```bash
# ============================================================================
# STRIPE ONBOARDING BILLING PRICE IDS
# ============================================================================
# Onboarding payment collection requires these price IDs.
# Create products/prices in Stripe Dashboard following /docs/billing/STRIPE_SETUP.md

# One-time charges
STRIPE_PRICE_ID_PHONE_PORTING=""           # $15 one-time
STRIPE_PRICE_ID_PHONE_NEW_NUMBER_SETUP=""  # $5 one-time

# Monthly recurring charges
STRIPE_PRICE_ID_PHONE_NEW_NUMBER_MONTHLY="" # $2/month per number
STRIPE_PRICE_ID_GMAIL_WORKSPACE_PER_USER="" # $6/month per user
STRIPE_PRICE_ID_PROFIT_RHINO=""             # $149/month
```

---

### Step 6: Verify Configuration

Run the validation function:

```typescript
import { validateStripePriceIds } from '@/lib/pricing/onboarding-fees';

const validation = validateStripePriceIds();
if (!validation.isValid) {
  console.error('Missing price IDs:', validation.missing);
  // Fix: Add missing IDs to .env.local
} else {
  console.log('✅ All Stripe price IDs configured correctly');
}
```

---

### Step 7: Configure Webhooks

#### Development (Stripe CLI)

For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local development server
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe-platform
```

Save the webhook signing secret:
```bash
# Add to .env.local
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxx"
```

#### Production

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **Add Endpoint**
3. **Endpoint URL:** `https://your-domain.com/api/webhooks/stripe-platform`
4. **Listen to:** Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add Endpoint**
6. Copy **Signing Secret** (format: `whsec_xxxxxxxxxxxxxxxxxxxx`)
7. Add to production environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxx"
   ```

---

## 🔍 Verification Checklist

### Product Creation
- [ ] 6 products created in Stripe Dashboard
- [ ] Each product has correct name and description
- [ ] Statement descriptors set (shows on customer statements)

### Price Configuration
- [ ] Base Platform: $200/month recurring
- [ ] Phone Porting: $15 one-time
- [ ] Phone Setup: $5 one-time
- [ ] Phone Monthly: $2/month recurring
- [ ] Gmail Workspace: $6/user/month recurring
- [ ] Profit Rhino: $149/month recurring

### Environment Variables
- [ ] 6 price IDs added to `.env.local`
- [ ] Price IDs added to `.env.example` (empty)
- [ ] `validateStripePriceIds()` returns `isValid: true`
- [ ] Webhook secret configured (dev and/or prod)

### Test Mode vs Production
- [ ] Test mode products/prices created first
- [ ] Test mode price IDs in dev environment
- [ ] Production mode products/prices created separately
- [ ] Production price IDs in production environment
- [ ] **NEVER** use production prices in test mode or vice versa

---

## 💳 Pricing Summary

| Product | Type | Amount | Billing |
|---------|------|--------|---------|
| **Base Platform** | Subscription | $200.00 | Monthly |
| **Phone Porting** | One-time | $15.00 | Immediate |
| **Phone Setup** | One-time | $5.00 | Immediate |
| **Phone Monthly** | Subscription | $2.00 | Monthly |
| **Gmail Workspace** | Subscription | $6.00 | Per user/month |
| **Profit Rhino** | Subscription | $149.00 | Monthly |

**Example Total (7-tech team with Gmail & Profit Rhino):**
- Upfront (1 ported + 1 new number): $20 ($15 + $5)
- Monthly (after 14-day trial): $381 ($200 + $2 + $42 + $149)

---

## 🔧 Troubleshooting

### Issue: "Price not found" error

**Cause:** Price ID in environment doesn't match Stripe Dashboard

**Solution:**
1. Check price ID in `.env.local`
2. Go to Stripe Dashboard → Products
3. Click on product → copy correct price ID
4. Update `.env.local`
5. Restart dev server

---

### Issue: "Invalid API key" error

**Cause:** Wrong Stripe mode (test vs live) or missing/incorrect API key

**Solution:**
1. Check `STRIPE_SECRET_KEY` in `.env.local`
2. Verify key starts with:
   - `sk_test_` for test mode
   - `sk_live_` for production
3. Ensure test mode keys use test mode prices (and vice versa)

---

### Issue: Webhook not receiving events

**Cause:** Webhook endpoint not configured or signing secret incorrect

**Solution (Development):**
```bash
# Restart Stripe CLI listener
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe-platform

# Copy new signing secret to .env.local
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxx"

# Restart dev server
pnpm dev
```

**Solution (Production):**
1. Check webhook endpoint in Stripe Dashboard
2. Verify URL is correct
3. Test endpoint with "Send test webhook" button
4. Check webhook signing secret matches production env

---

## 📚 Related Documentation

- [Onboarding Payment Flow](./ONBOARDING_PAYMENT_FLOW.md) - Complete payment integration guide
- [Pricing Configuration](/src/lib/pricing/onboarding-fees.ts) - Fees and calculations
- [Stripe Documentation](https://stripe.com/docs) - Official Stripe docs
- [Stripe Products & Prices](https://stripe.com/docs/products-prices/overview) - Product model guide
- [Stripe Webhooks](https://stripe.com/docs/webhooks) - Webhook integration guide

---

## ✅ Setup Complete!

After completing all steps:
1. **Test Mode:** Create test checkout session with test card
2. **Verify:** Check Stripe Dashboard for test payment
3. **Production:** Repeat steps 2-5 for production mode
4. **Deploy:** Set production environment variables
5. **Monitor:** Watch first few real onboarding payments closely

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth Required: `4000 0025 0000 3155`

🎉 **Stripe is now configured for onboarding billing!**
