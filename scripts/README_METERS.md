# Create Stripe Meters and Prices - Automated Setup

This script automatically creates all 11 usage meters, products, and prices in Stripe.

## Prerequisites

1. Stripe secret key in `.env.local`
2. `tsx` installed (for running TypeScript)

## Quick Start

Run this single command to create everything:

```bash
npx tsx scripts/create-meters-and-prices.ts
```

## What It Does

The script will:
1. ✅ Create 11 billing meters in Stripe
2. ✅ Create 11 products (one per meter)
3. ✅ Create 11 usage-based prices
4. ✅ Output all price IDs for `.env.local`

## Expected Output

```
🚀 Starting Stripe meters and prices creation...

Creating meter: Thorbis Team Members...
✅ Meter created: mtr_xxx
Creating product: Team Members...
✅ Product created: prod_xxx
Creating price...
✅ Price created: price_xxx
   Amount: $5.0000 per unit

... (repeats for all 11 meters)

✅ Setup complete!

📋 Summary:
===========

Add these to your .env.local file:

# Usage-based price IDs
STRIPE_PRICE_ID_TEAM_MEMBERS=price_xxx
STRIPE_PRICE_ID_INVOICES=price_xxx
STRIPE_PRICE_ID_ESTIMATES=price_xxx
STRIPE_PRICE_ID_SMS=price_xxx
STRIPE_PRICE_ID_EMAILS=price_xxx
STRIPE_PRICE_ID_VIDEO_MINUTES=price_xxx
STRIPE_PRICE_ID_PHONE_MINUTES=price_xxx
STRIPE_PRICE_ID_STORAGE=price_xxx
STRIPE_PRICE_ID_PAYMENTS=price_xxx
STRIPE_PRICE_ID_WORKFLOWS=price_xxx
STRIPE_PRICE_ID_API_CALLS=price_xxx
```

## Next Steps

1. **Copy the environment variables** from the output to `.env.local`
2. **Update checkout session code** in `/src/lib/stripe/server.ts`
3. **Configure webhook** (get signing secret from Stripe Dashboard)
4. **Test the flow** with a test checkout

## Meters Created

| Meter Name | Event Name | Aggregation | Price |
|------------|-----------|-------------|-------|
| Thorbis Team Members | `thorbis_team_members` | Last | $5.00/user |
| Thorbis Customer Invoices | `thorbis_invoices` | Count | $0.15/invoice |
| Thorbis Price Quotes | `thorbis_estimates` | Count | $0.10/quote |
| Thorbis Text Messages | `thorbis_sms` | Count | $0.02/text |
| Thorbis Emails | `thorbis_emails` | Count | $0.005/email |
| Thorbis Video Call Minutes | `thorbis_video_minutes` | Sum | $0.05/minute |
| Thorbis Phone Call Minutes | `thorbis_phone_minutes` | Sum | $0.02/minute |
| Thorbis File Storage | `thorbis_storage_gb` | Last | $0.50/GB |
| Thorbis Payments Collected | `thorbis_payments` | Count | $0.29/payment |
| Thorbis Automated Actions | `thorbis_workflows` | Count | $0.10/workflow |
| Thorbis API Calls | `thorbis_api_calls` | Count | $0.001/call |

## Troubleshooting

### "Stripe API key not found"
Make sure `STRIPE_SECRET_KEY` is set in `.env.local`

### "Module not found: stripe"
Run `pnpm add stripe`

### "tsx: command not found"
Run `pnpm add -D tsx`

### Need to delete meters?
Go to Stripe Dashboard > Billing > Meters and delete manually

## Verification

After running, verify in Stripe Dashboard:
- **Meters**: https://dashboard.stripe.com/meters
- **Products**: https://dashboard.stripe.com/products

---

**Estimated Time:** 2-3 minutes
**Difficulty:** Easy (one command)
