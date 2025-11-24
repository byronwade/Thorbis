# Onboarding Payment Flow Documentation

**Complete guide to the platform billing integration in the onboarding wizard.**

This document explains how contractors are charged for Thorbis platform subscriptions during onboarding, including phone services, Gmail Workspace, and add-ons like Profit Rhino.

---

## Table of Contents

1. [Overview](#overview)
2. [User Experience Flow](#user-experience-flow)
3. [Technical Architecture](#technical-architecture)
4. [Pricing Structure](#pricing-structure)
5. [Stripe Integration](#stripe-integration)
6. [Database Schema](#database-schema)
7. [Webhook Handling](#webhook-handling)
8. [Testing Guide](#testing-guide)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

The onboarding payment flow collects payment method information from new contractors during their initial setup. Payment is NOT charged immediately - instead, contractors enter a **14-day free trial**, and the first payment is processed automatically at the end of the trial period.

### What Gets Charged

**One-time Charges** (processed at trial end):
- Phone number porting: $15 per number
- New phone number setup: $5 per number

**Monthly Recurring Charges** (start after trial):
- Base platform subscription: $200/month
- Phone numbers: $2/month per number
- Gmail Workspace: $6/month per user
- Profit Rhino financing: $149/month (optional)

### Trial Period

- **Duration**: 14 days from payment method collection
- **Charges During Trial**: $0.00
- **First Charge**: At end of trial (one-time fees + first month subscription)
- **Cancellation**: Contractors can cancel anytime during trial with no charge

---

## User Experience Flow

### Step-by-Step Journey

```
1. Welcome Step
   ↓
2. Company Information
   ↓
3. Phone Setup (select porting/new numbers)
   → Pricing displayed: "$15 one-time" or "$5 setup + $2/month"
   → Count tracked in store: phonePortingCount, newPhoneNumberCount
   ↓
4. Email Setup (select Gmail Workspace)
   → Pricing displayed: "$6/user/month"
   → Input field: Number of Gmail users
   → Count tracked in store: gmailWorkspaceUsers
   ↓
5. Team Invitations
   ↓
6. Payment Setup Options
   ↓
7. **Payment Collection Step** (billing step)
   → Cost breakdown displayed:
     - One-time charges (porting + setup)
     - Monthly charges (base + phone + gmail + profit rhino)
     - Total due after trial
   → Trial notice: "14-day free trial, charged on [date]"
   → Payment method selection: Card or ACH
   → Security notice: PCI DSS Level 1 certified
   → Button: "Continue to secure checkout"
   ↓
8. Stripe Checkout (hosted page)
   → Contractor enters payment details
   → Stripe saves payment method
   → Stripe creates subscription with trial_end set to 14 days
   ↓
9. Success Page (after Stripe Checkout)
   → Confirmation: "Payment method saved!"
   → Trial info: "Your 14-day free trial has started"
   → What happens next:
     - No charge today
     - Charged automatically on [trial end date]
     - Cancel anytime before [trial end date]
   → Button: "Continue to dashboard"
   ↓
10. Complete Onboarding
    → Store payment data in database
    → Mark onboarding as complete
    → Redirect to dashboard
```

### Cancel Flow

If contractor clicks "Back" or closes Stripe Checkout:
```
Stripe Checkout → Cancel callback URL
                ↓
         Cancel Page
                ↓
         "Payment setup canceled"
         "You can try again anytime"
                ↓
         Button: "Back to onboarding"
```

---

## Technical Architecture

### File Structure

```
src/
├── lib/
│   ├── pricing/
│   │   └── onboarding-fees.ts          # Pricing logic (single source of truth)
│   └── onboarding/
│       └── onboarding-store.ts         # Zustand store with billing fields
├── components/
│   └── onboarding/
│       ├── onboarding-wizard.tsx       # Main wizard orchestrator
│       └── steps/
│           ├── phone-step.tsx          # Phone setup with pricing display
│           ├── email-step.tsx          # Email setup with Gmail pricing
│           └── payment-collection-step.tsx  # Payment collection UI
├── actions/
│   └── onboarding-billing.ts          # Server actions for Stripe API
├── app/
│   ├── (dashboard)/
│   │   └── onboarding/
│   │       └── payment/
│   │           ├── success/page.tsx   # Success callback
│   │           └── cancel/page.tsx    # Cancel callback
│   └── api/
│       └── webhooks/
│           └── stripe-platform/
│               └── route.ts           # Webhook event handler
└── docs/
    └── billing/
        ├── STRIPE_SETUP.md            # Stripe Dashboard setup guide
        └── ONBOARDING_PAYMENT_FLOW.md # This file
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Selections (Phone Step, Email Step)                 │
│    - phonePortingCount, newPhoneNumberCount                 │
│    - gmailWorkspaceUsers, profitRhinoEnabled                │
│    → Stored in Zustand onboarding store                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Payment Collection Step (Client Component)               │
│    - Reads store selections                                 │
│    - Calculates costs via calculateOnboardingCosts()        │
│    - Displays itemized breakdown                            │
│    - Triggers Stripe Checkout on button click               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Server Action: createOnboardingCheckoutSession()         │
│    - Validates Stripe price IDs exist                       │
│    - Gets/creates Stripe customer                           │
│    - Builds line items (subscriptions + one-time)           │
│    - Creates Stripe Checkout session with trial             │
│    - Returns checkoutUrl                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Stripe Checkout (External - Stripe Hosted)               │
│    - Contractor enters payment details                      │
│    - Stripe validates and saves payment method              │
│    - Stripe creates subscription with trial_end             │
│    - Redirects to success_url or cancel_url                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Success Callback Page                                    │
│    - Verifies session status via Stripe API                 │
│    - Saves payment data to database                         │
│    - Updates company record (payment_method_collected)      │
│    - Shows success message and trial details                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Complete Onboarding                                      │
│    - completeOnboardingWizard() server action               │
│    - Marks onboarding as complete                           │
│    - Redirects to dashboard                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Asynchronous: Stripe Webhooks                               │
│ (Processed after Stripe Checkout completes)                 │
│                                                              │
│ Events handled:                                             │
│ - checkout.session.completed                                │
│ - customer.subscription.created                             │
│ - customer.subscription.updated                             │
│ - customer.subscription.trial_will_end                      │
│ - invoice.payment_succeeded                                 │
│ - invoice.payment_failed                                    │
│ - customer.subscription.deleted                             │
│                                                              │
│ Each event updates companies table with subscription status │
└─────────────────────────────────────────────────────────────┘
```

---

## Pricing Structure

### Configuration File

**Location**: `/src/lib/pricing/onboarding-fees.ts`

This is the **single source of truth** for all pricing logic. All components, actions, and calculations reference this file.

**Key Constants**:
```typescript
export const PHONE_PORTING_FEE = 15.0;              // $15 one-time
export const PHONE_NEW_NUMBER_SETUP_FEE = 5.0;     // $5 one-time
export const PHONE_NEW_NUMBER_MONTHLY_FEE = 2.0;   // $2/month
export const GMAIL_WORKSPACE_PER_USER_FEE = 6.0;   // $6/month per user
export const PROFIT_RHINO_MONTHLY_FEE = 149.0;     // $149/month
export const BASE_PLATFORM_FEE = 200.0;            // $200/month
```

### Cost Calculation

**Function**: `calculateOnboardingCosts(selections)`

**Input**:
```typescript
{
  phonePortingCount: number;      // Number of numbers to port
  newPhoneNumberCount: number;    // Number of new numbers to purchase
  gmailWorkspaceUsers: number;    // Number of Gmail users
  profitRhinoEnabled: boolean;    // Profit Rhino add-on enabled?
}
```

**Output**:
```typescript
{
  oneTime: {
    phonePorting: number;    // Total porting fees
    phoneSetup: number;      // Total new number setup fees
    total: number;           // Sum of one-time charges
  },
  monthly: {
    basePlatform: number;    // Base subscription ($200)
    phoneNumbers: number;    // Monthly phone fees
    gmailWorkspace: number;  // Gmail Workspace fees
    profitRhino: number;     // Profit Rhino fee (if enabled)
    total: number;           // Sum of monthly charges
  },
  firstMonthTotal: number;   // oneTime.total + monthly.total
}
```

**Example Calculation**:
```typescript
// Contractor selections:
// - Porting 2 phone numbers
// - Purchasing 1 new phone number
// - Gmail for 3 users
// - Profit Rhino enabled

const costs = calculateOnboardingCosts({
  phonePortingCount: 2,
  newPhoneNumberCount: 1,
  gmailWorkspaceUsers: 3,
  profitRhinoEnabled: true
});

// Results:
costs = {
  oneTime: {
    phonePorting: 30,    // 2 × $15
    phoneSetup: 5,       // 1 × $5
    total: 35            // $30 + $5
  },
  monthly: {
    basePlatform: 200,   // Base fee
    phoneNumbers: 2,     // 1 × $2 (only new numbers)
    gmailWorkspace: 18,  // 3 × $6
    profitRhino: 149,    // $149 add-on
    total: 369           // $200 + $2 + $18 + $149
  },
  firstMonthTotal: 404   // $35 + $369
}

// Charged at trial end: $404.00
```

### Stripe Price ID Mapping

**Function**: `validateStripePriceIds()`

Ensures all required Stripe price IDs are configured in environment variables before creating checkout session.

**Required Environment Variables**:
```bash
STRIPE_PRICE_ID_PHONE_PORTING              # One-time: $15
STRIPE_PRICE_ID_PHONE_NEW_NUMBER_SETUP     # One-time: $5
STRIPE_PRICE_ID_PHONE_NEW_NUMBER_MONTHLY   # Recurring: $2/month
STRIPE_PRICE_ID_GMAIL_WORKSPACE_PER_USER   # Recurring: $6/month
STRIPE_PRICE_ID_PROFIT_RHINO               # Recurring: $149/month
STRIPE_PRICE_ID_BASE_PLAN                  # Recurring: $200/month (base platform)
```

---

## Stripe Integration

### Checkout Session Creation

**Server Action**: `createOnboardingCheckoutSession(params)`

**Process**:
```typescript
1. Validate all Stripe price IDs exist
   → If missing, return error with missing IDs

2. Get or create Stripe customer
   → Check if company has stripe_customer_id
   → If yes, use existing customer
   → If no, create new customer with company metadata

3. Build line items for subscription
   → Base platform subscription ($200/month)
   → Phone numbers ($2/month × count)
   → Gmail Workspace ($6/month × users)
   → Profit Rhino ($149/month if enabled)

4. Build line items for one-time charges
   → Phone porting ($15 × count)
   → New phone setup ($5 × count)

5. Combine all line items
   → Merge subscription + one-time into single array

6. Calculate trial end timestamp
   → Current time + 14 days
   → Convert to Unix timestamp (seconds)

7. Create Stripe Checkout Session
   → mode: "subscription"
   → payment_method_types: ["card", "us_bank_account"]
   → line_items: Combined array from step 5
   → subscription_data.trial_end: Trial timestamp from step 6
   → subscription_data.metadata: Company and team member IDs
   → success_url: /onboarding/payment/success?session_id={CHECKOUT_SESSION_ID}&company_id={id}
   → cancel_url: /onboarding/payment/cancel

8. Update database with Stripe customer ID
   → Save stripe_customer_id to companies table

9. Return checkout URL
   → Client redirects to Stripe Checkout page
```

**Key Configuration**:
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  mode: "subscription",
  payment_method_types: ["card", "us_bank_account"],
  line_items: allLineItems,
  subscription_data: {
    trial_end: trialEnd,  // Unix timestamp (14 days from now)
    metadata: {
      company_id: companyId,
      team_member_id: teamMemberId,
    },
  },
  success_url: `${baseUrl}/onboarding/payment/success?session_id={CHECKOUT_SESSION_ID}&company_id=${companyId}`,
  cancel_url: `${baseUrl}/onboarding/payment/cancel`,
});
```

### Trial Period Mechanics

**How Stripe Handles Trials**:

1. **During Trial** (Days 1-14):
   - Payment method saved but not charged
   - Subscription status: `trialing`
   - Access to platform: Full access

2. **Trial End** (Day 14):
   - Stripe automatically charges saved payment method
   - One-time charges + first month subscription
   - Invoice created and sent
   - If payment succeeds: subscription status → `active`
   - If payment fails: subscription status → `past_due`

3. **Trial End Notification** (Day 11):
   - Webhook: `customer.subscription.trial_will_end`
   - We receive event 3 days before trial ends
   - TODO: Send email notification to contractor

### Payment Methods Supported

**Card Payments**:
- Visa, Mastercard, American Express, Discover
- Instant validation and processing
- Saved for recurring billing

**ACH Bank Account** (US only):
- Direct debit from bank account
- Micro-deposit verification (1-2 business days)
- Lower processing fees than cards
- Saved for recurring billing

### Success Callback

**File**: `/src/app/(dashboard)/onboarding/payment/success/page.tsx`

**Process**:
```typescript
1. Extract query parameters
   → session_id: Stripe Checkout session ID
   → company_id: Company UUID

2. Verify session status with Stripe API
   → Call stripe.checkout.sessions.retrieve(session_id)
   → Ensure status = "complete"
   → Extract subscription and payment method IDs

3. Update company record
   → stripe_customer_id
   → stripe_payment_method_id
   → payment_method_collected = true
   → stripe_subscription_id
   → trial_ends_at (calculated from subscription.trial_end)

4. Display success message
   → "Payment method saved!"
   → "Your 14-day free trial has started"
   → Trial end date displayed
   → What happens next (bulleted list)
   → Continue button → /onboarding?step=complete
```

---

## Database Schema

### Companies Table Billing Fields

**New Columns** (added in migration: `add_onboarding_billing_fields`):

```sql
-- Stripe customer ID (links company to Stripe customer)
stripe_customer_id text

-- Saved payment method ID (card or ACH)
stripe_payment_method_id text

-- Payment method collected during onboarding
payment_method_collected boolean DEFAULT false

-- Stripe subscription ID for platform billing
stripe_subscription_id text

-- Subscription status (trialing, active, past_due, canceled)
stripe_subscription_status text

-- Trial end timestamp
trial_ends_at timestamptz

-- Subscription cancellation timestamp
subscription_canceled_at timestamptz

-- Most recent successful payment timestamp
last_payment_at timestamptz
```

**Indexes**:
```sql
-- For webhook lookups by customer ID
CREATE INDEX idx_companies_stripe_customer_id
  ON companies(stripe_customer_id);

-- For billing dashboard queries
CREATE INDEX idx_companies_stripe_subscription_status
  ON companies(stripe_subscription_status)
  WHERE stripe_subscription_status IS NOT NULL;
```

### Onboarding Store Fields

**Location**: `/src/lib/onboarding/onboarding-store.ts`

**Billing Fields**:
```typescript
// User selections (tracked during phone/email steps)
phonePortingCount: number;          // Number of phone numbers to port
newPhoneNumberCount: number;        // Number of new phone numbers to purchase
gmailWorkspaceUsers: number;        // Number of Gmail Workspace users
profitRhinoEnabled: boolean;        // Profit Rhino financing add-on

// Stripe payment data (saved after checkout)
stripeCustomerId: string | null;
stripePaymentMethodId: string | null;
paymentMethodCollected: boolean;
trialEndsAt: string | null;

// Company/user IDs (from auth context)
companyId: string | null;
teamMemberId: string | null;
```

---

## Webhook Handling

### Webhook Endpoint

**File**: `/src/app/api/webhooks/stripe-platform/route.ts`

**URL**: `https://yourdomain.com/api/webhooks/stripe-platform`

### Signature Verification

**CRITICAL**: Always verify webhook signatures to ensure events are from Stripe.

```typescript
const signature = req.headers.get("stripe-signature");
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

**Environment Variable Required**:
```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Events Handled

#### 1. `checkout.session.completed`

**Triggered**: Immediately after contractor completes Stripe Checkout

**Actions**:
- Extract `customer_id` and `subscription_id` from session
- Update companies table:
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `payment_method_collected = true`
  - `updated_at`

**Database Query**:
```typescript
await supabase
  .from("companies")
  .update({
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    payment_method_collected: true,
    updated_at: new Date().toISOString(),
  })
  .eq("id", companyId);
```

#### 2. `customer.subscription.created`

**Triggered**: When subscription is created (same time as checkout completion)

**Actions**:
- Update companies table:
  - `stripe_subscription_id`
  - `stripe_subscription_status`
  - `trial_ends_at`
  - `updated_at`

#### 3. `customer.subscription.updated`

**Triggered**: When subscription changes (e.g., trial ends, status changes)

**Actions**:
- Update companies table:
  - `stripe_subscription_status`
  - `updated_at`

**Common Status Changes**:
- `trialing` → `active` (trial ended, payment succeeded)
- `active` → `past_due` (payment failed)
- `past_due` → `canceled` (after retry attempts exhausted)

#### 4. `customer.subscription.deleted`

**Triggered**: When subscription is canceled

**Actions**:
- Update companies table:
  - `stripe_subscription_status = "canceled"`
  - `subscription_canceled_at`
  - `updated_at`

#### 5. `customer.subscription.trial_will_end`

**Triggered**: 3 days before trial ends (Day 11 of 14-day trial)

**Actions**:
- Log event
- TODO: Send email notification to contractor

**Email Content (to be implemented)**:
- Subject: "Your Thorbis trial ends in 3 days"
- Body: Reminder about trial end date and first charge
- Include link to cancel if needed

#### 6. `invoice.payment_succeeded`

**Triggered**: When payment is successfully processed

**Actions**:
- Update companies table:
  - `last_payment_at`
  - `updated_at`
- Log payment amount and currency

#### 7. `invoice.payment_failed`

**Triggered**: When payment fails (e.g., insufficient funds, card declined)

**Actions**:
- Log error
- TODO: Send payment failure notification email

**Email Content (to be implemented)**:
- Subject: "Payment failed for your Thorbis subscription"
- Body: Explain payment failure, how to update payment method
- Include link to billing settings

### Webhook Error Handling

**Best Practices**:

1. **Always return 200 OK**
   - Even if processing fails
   - Prevents Stripe from retrying unnecessarily

2. **Log all errors**
   - Console.error with event type and error message
   - Store in database for monitoring

3. **Idempotency**
   - Webhooks may be sent multiple times
   - Use upsert operations (insert or update)
   - Check if event already processed

4. **Retry Logic**
   - Stripe automatically retries failed webhooks
   - Up to 3 days of retries
   - Use exponential backoff

---

## Testing Guide

### Local Testing Setup

**1. Install Stripe CLI**
```bash
brew install stripe/stripe-cli/stripe
```

**2. Login to Stripe**
```bash
stripe login
```

**3. Forward webhooks to local server**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe-platform
```

**Output**:
```
> Ready! Your webhook signing secret is whsec_xxx (^C to quit)
```

**4. Copy webhook secret to .env.local**
```bash
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

### Test Scenarios

#### Scenario 1: Successful Payment Collection

```
1. Start dev server: pnpm dev
2. Start webhook forwarding: stripe listen --forward-to localhost:3000/api/webhooks/stripe-platform
3. Navigate to: http://localhost:3000/onboarding
4. Complete onboarding steps:
   - Select "Port existing number" (1 number)
   - Select "Gmail Workspace" (2 users)
   - Proceed to payment step
5. Verify cost breakdown:
   - One-time: $15 (porting)
   - Monthly: $212 ($200 base + $12 Gmail)
   - Total: $227
6. Click "Continue to secure checkout"
7. Use test card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
8. Complete Stripe Checkout
9. Verify redirect to success page
10. Check webhook events in Stripe CLI:
    - checkout.session.completed
    - customer.subscription.created
11. Check database:
    - stripe_customer_id populated
    - stripe_subscription_id populated
    - payment_method_collected = true
    - trial_ends_at = ~14 days from now
```

#### Scenario 2: Canceled Checkout

```
1-5. Same as Scenario 1
6. Click "Continue to secure checkout"
7. On Stripe Checkout page, click "Back" or close tab
8. Verify redirect to cancel page
9. Click "Back to onboarding"
10. Verify return to onboarding flow
```

#### Scenario 3: Trial End Simulation

**Use Stripe CLI to trigger event**:
```bash
stripe trigger customer.subscription.trial_will_end
```

**Verify**:
- Webhook received and logged
- Company record NOT updated (notification-only event)

#### Scenario 4: Payment Failure Simulation

**Use Stripe test card for declined payment**:
```
Card: 4000 0000 0000 0341
Result: Card declined (generic decline)
```

**Verify**:
- Subscription status changes to `past_due`
- Webhook `invoice.payment_failed` received
- Error logged

### Test Cards

**Successful Payments**:
```
4242 4242 4242 4242 - Visa (always succeeds)
5555 5555 5555 4444 - Mastercard (always succeeds)
3782 822463 10005   - American Express (always succeeds)
```

**Declined Payments**:
```
4000 0000 0000 0002 - Card declined (generic)
4000 0000 0000 9995 - Insufficient funds
4000 0000 0000 9987 - Card lost
4000 0000 0000 9979 - Card stolen
```

**ACH Testing**:
```
Account Number: 000123456789
Routing Number: 110000000 (succeeds)
Routing Number: 110000001 (fails - account closed)
```

---

## Troubleshooting

### Issue 1: "Missing Stripe price IDs" Error

**Symptom**: Error message when clicking "Continue to secure checkout"

**Cause**: Environment variables not configured

**Solution**:
1. Verify all required price IDs in `.env.local`:
   ```bash
   STRIPE_PRICE_ID_PHONE_PORTING="price_..."
   STRIPE_PRICE_ID_PHONE_NEW_NUMBER_SETUP="price_..."
   STRIPE_PRICE_ID_PHONE_NEW_NUMBER_MONTHLY="price_..."
   STRIPE_PRICE_ID_GMAIL_WORKSPACE_PER_USER="price_..."
   STRIPE_PRICE_ID_PROFIT_RHINO="price_..."
   STRIPE_PRICE_ID_BASE_PLAN="price_..."
   ```

2. Follow setup instructions in `/docs/billing/STRIPE_SETUP.md`

3. Restart dev server after updating environment variables

### Issue 2: Webhook Signature Verification Failed

**Symptom**: Webhook returns 400 error: "Invalid signature"

**Cause**: Incorrect webhook secret or body modification

**Solution**:
1. Verify webhook secret in `.env.local` matches Stripe CLI or Dashboard
2. Ensure webhook endpoint receives raw body (no JSON parsing before verification)
3. Check that `stripe-signature` header is present
4. For local testing, use Stripe CLI's webhook forwarding

### Issue 3: Payment Method Not Saved

**Symptom**: Success page shows "Payment method saved" but database has no stripe_customer_id

**Cause**: Webhook not processing or database update failing

**Solution**:
1. Check webhook logs:
   ```bash
   stripe logs tail
   ```

2. Verify webhook endpoint is accessible:
   ```bash
   curl -X POST https://yourdomain.com/api/webhooks/stripe-platform
   ```

3. Check database permissions:
   - Service role key configured?
   - RLS policies allow updates?

4. Inspect Stripe Dashboard → Webhooks → Event logs

### Issue 4: Trial Not Set Correctly

**Symptom**: Subscription created but trial_end is null or incorrect

**Cause**: trial_end timestamp not calculated correctly

**Solution**:
1. Verify trial calculation in `createOnboardingCheckoutSession()`:
   ```typescript
   const trialEnd = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;
   ```

2. Check Stripe Dashboard → Subscriptions:
   - Should show status: "Trialing"
   - Should show trial end date (14 days from creation)

3. Verify webhook `customer.subscription.created` populates `trial_ends_at`

### Issue 5: Cost Calculation Mismatch

**Symptom**: Total displayed in payment step doesn't match Stripe invoice

**Cause**: Pricing constants out of sync with Stripe prices

**Solution**:
1. Verify pricing constants in `/src/lib/pricing/onboarding-fees.ts`:
   ```typescript
   export const PHONE_PORTING_FEE = 15.0;
   export const PHONE_NEW_NUMBER_SETUP_FEE = 5.0;
   // etc.
   ```

2. Compare with Stripe Dashboard → Products:
   - Each price should match exactly
   - Check currency (USD assumed)
   - Verify one-time vs recurring

3. If mismatch, update constants and redeploy

### Issue 6: "Missing company or user information" Error

**Symptom**: Error when trying to start checkout

**Cause**: Auth context not providing companyId or teamMemberId

**Solution**:
1. Verify user is authenticated:
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   ```

2. Check onboarding store has IDs:
   ```typescript
   const { companyId, teamMemberId } = useOnboardingStore();
   ```

3. Ensure IDs are populated during onboarding start (after signup/login)

---

## Production Checklist

Before deploying to production, ensure:

- [ ] All Stripe products/prices created in **production** Stripe account
- [ ] Production price IDs added to environment variables
- [ ] Webhook endpoint configured in **production** Stripe Dashboard
- [ ] Webhook secret (production) added to environment variables
- [ ] Database migration applied to production database
- [ ] TypeScript types regenerated and committed
- [ ] Security advisors run (no critical issues)
- [ ] Tested full flow end-to-end in staging
- [ ] Tested webhook events (success, failure, cancellation)
- [ ] Tested trial end simulation (3 days before, at end)
- [ ] Verified payment method saves correctly
- [ ] Verified cost calculations match Stripe invoices
- [ ] Email notifications implemented (trial ending, payment failed)
- [ ] Monitoring/alerting configured for webhook failures
- [ ] Support documentation updated for contractors
- [ ] Cancellation flow documented for support team

---

## Related Documentation

- **Stripe Setup Guide**: `/docs/billing/STRIPE_SETUP.md`
- **Pricing Configuration**: `/src/lib/pricing/onboarding-fees.ts`
- **Onboarding Store**: `/src/lib/onboarding/onboarding-store.ts`
- **Webhook Handler**: `/src/app/api/webhooks/stripe-platform/route.ts`

---

## Support Contacts

- **Stripe Support**: https://support.stripe.com
- **Stripe Discord**: https://discord.gg/stripe
- **Thorbis Engineering**: engineering@thorbis.com

---

**Last Updated**: 2025-01-24
**Version**: 1.0
**Status**: Complete - Ready for Production
