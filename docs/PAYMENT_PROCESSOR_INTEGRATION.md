# Payment Processor Integration Guide

## Overview

This system provides a multi-processor payment architecture that allows contractors to process high-value payments ($200k+) without being flagged or banned, similar to ServiceTitan's approach.

### Key Features

- **Multi-Processor Support**: Adyen, Plaid, ProfitStars (Jack Henry), and Stripe
- **Trust-Based Approval**: Dynamic trust scoring prevents false flags on legitimate payments
- **High-Value Payments**: No hard limits - payments up to $200,000+ based on trust score
- **Automatic Routing**: System automatically selects the best processor based on:
  - Payment amount
  - Payment channel (online, card-present, ACH, etc.)
  - Company configuration
  - Trust score

## Architecture

### Payment Flow

```
Invoice Payment Request
    ↓
Check Trust Score & Limits
    ↓
Select Payment Processor
    ├─ High-value (>$10k) → Adyen
    ├─ Card-present/Tap-to-Pay → Adyen
    ├─ ACH → Plaid/ProfitStars
    └─ Platform billing → Stripe
    ↓
Process Payment
    ↓
Record Transaction
    ↓
Update Trust Score
    ↓
Update Invoice Status
```

### Processor Selection Logic

1. **Adyen** (Recommended for contractor payments):
   - Payments > $10,000
   - Card-present payments
   - Tap-to-Pay on iPhone/Android
   - High-value online payments
   - No hard limits - trust-based

2. **Plaid**:
   - Bank account linking
   - ACH payment initiation
   - Account verification

3. **ProfitStars (Jack Henry)**:
   - ACH processing
   - Check processing
   - High-volume ACH transactions

4. **Stripe**:
   - **ONLY for platform billing** (subscriptions)
   - NOT for contractor invoice payments
   - Has limitations on high-value payments

## Trust Score System

### How It Works

The trust score (0-100) determines:
- Maximum payment amounts
- Whether approval is required
- Payment processing limits

### Score Calculation

```
Overall Score = 
  (Success Rate × 40%) +
  (Volume Factor × 30%) +
  (Account Age × 20%) +
  (Verification × 10%)
```

### Trust Score Tiers

- **90-100**: Trusted - Full access to configured limits
- **70-89**: Good - Up to 50% of max limit
- **50-69**: Moderate - Up to 25% of max limit
- **<50**: New/Low - Requires approval for payments > $100

### Factors That Increase Trust Score

- Successful payment history
- Higher payment volumes
- Account age (older = more trusted)
- Business verification
- Bank account verification
- Identity verification
- Low refund/chargeback rate

## Setup Instructions

### 1. Database Migration

Run the migration to create the necessary tables:

```bash
pnpm supabase migration up
```

This creates:
- `company_payment_processors` - Processor configurations
- `payment_processor_transactions` - Transaction records
- `payment_trust_scores` - Trust score tracking
- `payment_processor_webhooks` - Webhook event logs

### 2. Configure Adyen (Recommended)

#### Get Adyen Credentials

1. Sign up for [Adyen for Platforms](https://www.adyen.com/platform-payments)
2. Complete KYC/onboarding
3. Get your:
   - Account ID
   - API Key
   - Merchant Account ID
   - Webhook credentials

#### Configure in Thorbis

```typescript
// Use the payment processor configuration action
await configurePaymentProcessor({
  processorType: "adyen",
  adyenAccountId: "YOUR_ACCOUNT_ID",
  adyenApiKey: "YOUR_API_KEY",
  adyenMerchantAccount: "YOUR_MERCHANT_ACCOUNT",
  adyenLiveMode: false, // Start with test mode
  maxPaymentAmount: 20000000, // $200,000 in cents
  requiresApprovalAbove: 10000000, // $100,000 in cents
});
```

### 3. Configure Plaid (For ACH)

#### Get Plaid Credentials

1. Sign up for [Plaid](https://plaid.com)
2. Get your:
   - Client ID
   - Secret Key
   - Environment (sandbox/development/production)

#### Configure in Thorbis

```typescript
await configurePaymentProcessor({
  processorType: "plaid",
  plaidClientId: "YOUR_CLIENT_ID",
  plaidSecret: "YOUR_SECRET",
  plaidEnvironment: "sandbox", // Start with sandbox
});
```

### 4. Configure ProfitStars (Optional - For ACH/Checks)

#### Get ProfitStars Credentials

1. Contact ProfitStars/Jack Henry
2. Get your:
   - Merchant ID
   - API Key
   - Routing Number

#### Configure in Thorbis

```typescript
await configurePaymentProcessor({
  processorType: "profitstars",
  profitstarsMerchantId: "YOUR_MERCHANT_ID",
  profitstarsApiKey: "YOUR_API_KEY",
  profitstarsRoutingNumber: "YOUR_ROUTING_NUMBER",
});
```

## Usage

### Process Invoice Payment

```typescript
import { processInvoicePayment } from "@/actions/invoice-payments-v2";

// Process payment - automatically routes to appropriate processor
const result = await processInvoicePayment({
  invoiceId: "invoice-id",
  paymentMethodId: "payment-method-id",
  channel: "online", // or "card_present", "tap_to_pay", "ach"
});

if (result.requiresApproval) {
  // Show approval UI
} else if (result.success) {
  // Payment processed successfully
}
```

### Check Payment Approval Requirements

```typescript
import { checkPaymentApproval } from "@/actions/invoice-payments-v2";

const approval = await checkPaymentApproval(invoiceId, amount);

if (approval.requiresApproval) {
  // Show approval workflow
}
```

### Get Trust Score

```typescript
import { getTrustScore } from "@/actions/payment-processors";

const { trustScore } = await getTrustScore();
console.log(`Trust Score: ${trustScore.overall_score}`);
console.log(`Max Payment: $${trustScore.max_payment_amount / 100}`);
```

## High-Value Payment Handling

### Automatic Routing

The system automatically routes high-value payments to Adyen:

```typescript
// Payment > $10,000 automatically uses Adyen
await processInvoicePayment({
  invoiceId: "invoice-id",
  amount: 200000, // $200,000
  channel: "online",
});
// → Automatically routes to Adyen
```

### Trust-Based Limits

Payments are allowed based on trust score:

- **Trust Score 90+**: Up to configured max ($200k default)
- **Trust Score 70-89**: Up to $100k
- **Trust Score 50-69**: Up to $50k
- **Trust Score <50**: Requires approval for > $100

### Approval Workflow

For payments requiring approval:

1. System checks trust score
2. If approval required, returns `requiresApproval: true`
3. Show approval UI to admin/finance manager
4. After approval, process payment normally

## Webhook Handling

### Adyen Webhooks

Create a webhook endpoint at `/api/webhooks/adyen`:

```typescript
// src/app/api/webhooks/adyen/route.ts
import { AdyenProcessor } from "@/lib/payments/processors/adyen";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("adyen-signature");

  // Verify webhook
  const processor = new AdyenProcessor(config);
  if (!processor.verifyWebhook(payload, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(payload);

  // Handle event
  if (event.eventCode === "AUTHORISATION") {
    // Update payment status
  }

  return new Response("OK");
}
```

## Security Considerations

### Encryption

**IMPORTANT**: API keys and secrets should be encrypted before storing in the database.

```typescript
// TODO: Implement encryption
// Use Supabase Vault or similar for encryption
const encrypted = await encrypt(apiKey);
```

### Environment Variables

Add to `.env.local`:

```env
# Adyen (if using)
ADYEN_API_KEY=your_adyen_api_key
ADYEN_ACCOUNT_ID=your_account_id

# Plaid (if using)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENVIRONMENT=sandbox

# ProfitStars (if using)
PROFITSTARS_MERCHANT_ID=your_merchant_id
PROFITSTARS_API_KEY=your_api_key
```

## Best Practices

### 1. Start with Test Mode

Always configure processors in test/sandbox mode first:

```typescript
{
  adyenLiveMode: false,
  plaidEnvironment: "sandbox",
}
```

### 2. Build Trust Score Gradually

- Start with smaller payments
- Build payment history
- Verify business and bank accounts
- Trust score increases over time

### 3. Monitor Trust Score

Regularly check trust scores and adjust limits:

```typescript
const { trustScore } = await getTrustScore();
if (trustScore.overall_score > 80) {
  // Increase max payment amount
}
```

### 4. Use Appropriate Processor

- **Contractor payments** → Adyen (high-value, no limits)
- **Platform billing** → Stripe (subscriptions only)
- **ACH payments** → Plaid + ProfitStars
- **Card-present** → Adyen

## Troubleshooting

### Payment Requires Approval

**Problem**: Payment returns `requiresApproval: true`

**Solution**: 
- Check trust score
- Verify payment amount is within limits
- Complete business/bank verification
- Build payment history with smaller amounts first

### No Processor Configured

**Problem**: Error "No payment processor configured"

**Solution**:
1. Go to Settings → Payment Processors
2. Configure Adyen (recommended) or another processor
3. Complete KYC/onboarding
4. Activate processor

### High-Value Payment Flagged

**Problem**: Payment flagged even with high trust score

**Solution**:
- Check processor configuration
- Verify trust score is actually high (check database)
- Ensure payment amount is within configured limits
- Contact support if issue persists

## Migration from Stripe-Only

If you're currently using Stripe for all payments:

1. **Keep Stripe** for platform billing (subscriptions)
2. **Add Adyen** for contractor invoice payments
3. **Update payment flows** to use `processInvoicePayment` from `invoice-payments-v2.ts`
4. **Migrate existing customers** to new processor as needed

## Support

For issues or questions:
- Check trust score in dashboard
- Review processor configuration
- Check webhook logs
- Contact support with transaction IDs

## References

- [Adyen for Platforms](https://www.adyen.com/platform-payments)
- [Plaid Documentation](https://plaid.com/docs)
- [ProfitStars/Jack Henry](https://www.jackhenry.com)
- ServiceTitan Payment Architecture (reference implementation)


