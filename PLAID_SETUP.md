# Plaid Bank Account Integration Setup

This document explains how to set up the Plaid integration for bank account aggregation.

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```bash
# Plaid Configuration
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_ENV=sandbox  # Options: sandbox, development, production

# Environment-specific secrets (the variable name must match PLAID_ENV)
PLAID_SECRET_SANDBOX=your_sandbox_secret_here          # Required for PLAID_ENV=sandbox
PLAID_SECRET_DEVELOPMENT=your_development_secret_here  # Required for PLAID_ENV=development
PLAID_SECRET_PRODUCTION=your_production_secret_here    # Required for PLAID_ENV=production

# For client-side (optional, defaults to PLAID_ENV)
NEXT_PUBLIC_PLAID_ENV=sandbox

# Cron Job Security
CRON_SECRET=your_random_secure_string_here

# Site URL (for Plaid redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Update for production
```

> **Important:** The secret variable name must match your `PLAID_ENV` setting. For example, if `PLAID_ENV=sandbox`, you must have `PLAID_SECRET_SANDBOX` defined.

## Getting Started with Plaid

### 1. Create a Plaid Account (Free for Testing!)

1. Go to [Plaid Dashboard](https://dashboard.plaid.com/signup)
2. Sign up for a free account
3. No credit card required for Sandbox environment

### 2. Get Your Credentials

1. After signing up, go to **Team Settings > Keys**
2. Copy your `client_id`
3. Copy your `sandbox` secret
4. Add both to `.env.local`

### 3. (Optional) Configure OAuth Redirect URI

By default, the integration uses Plaid's hosted Link flow (no redirect needed). If you want to use OAuth redirects:

1. Go to **Team Settings > API**
2. Find **Allowed redirect URIs**
3. Add: `http://localhost:3000/settings/finance/bank-accounts` (for local dev)
4. Add: `https://yourdomain.com/settings/finance/bank-accounts` (for production)
5. Uncomment the redirect_uri code in `src/actions/plaid.ts`

### 4. Testing with Sandbox

Plaid's Sandbox environment is **completely free** and provides fake bank data for testing:

**Test Bank Credentials:**
- Institution: Search for "First Platypus Bank" or "Chase"
- Username: `user_good`
- Password: `pass_good`
- MFA Code: `1234`

This will return test accounts with realistic transaction data.

### 4. Sandbox Limitations

The Sandbox environment allows you to:
- ✅ Test all Plaid Link flows
- ✅ Fetch account balances
- ✅ Retrieve up to 2 years of transaction history
- ✅ Test all account types (checking, savings, credit)
- ✅ Simulate various scenarios (good credentials, MFA, etc.)

**No costs or real bank connections required!**

### 5. Going to Production

When ready for production:

1. Go through Plaid's production approval process
2. This typically takes 1-2 business days
3. Pricing:
   - $0.10-0.30 per user/month (volume discounts available)
   - First 100 users often free
4. Update `PLAID_ENV=production` and add production secrets

## Features Implemented

### ✅ Bank Account Linking
- Secure OAuth-based connection via Plaid Link
- Automatic routing/account number retrieval
- Balance tracking

### ✅ Transaction Sync
- Automatic daily sync at 2 AM (configurable)
- Manual sync button in settings
- Up to 2 years of historical data
- Real-time balance updates

### ✅ Onboarding Integration
- Required bank account setup in Step 4
- Choice between "new" (coming soon) or "existing" (Plaid)
- Multiple account support

### ✅ Settings Integration
- "Connect via Plaid" button
- Transaction history view
- Search and filter transactions
- Export to CSV

### ✅ Security
- Tokens encrypted at rest (TODO: implement encryption)
- RLS policies on all tables
- Company-scoped access
- Secure cron job endpoint

## Database Migrations

Run the migration to create necessary tables:

\`\`\`bash
# The migration is already created at:
# supabase/migrations/20251112000000_add_bank_transactions.sql

# Apply it with:
supabase db push
\`\`\`

## Testing the Integration

### 1. Start Development Server
\`\`\`bash
pnpm dev
\`\`\`

### 2. Complete Onboarding
- Create a new company
- Get to Step 4: Bank Account Setup
- Choose "Use Existing Bank Account"
- Click "Connect Bank Account"
- Use Plaid Sandbox credentials above

### 3. View Transactions
- Go to Settings > Finance > Bank Accounts
- Click on a linked account
- View transaction history
- Try search, filter, and CSV export

### 4. Test Sync
- Click "Sync Now" to manually trigger sync
- Transactions should update

### 5. Test Cron Job (Local)
\`\`\`bash
# Set CRON_SECRET in .env.local
CRON_SECRET=test_secret_123

# Then call the endpoint:
curl -H "Authorization: Bearer test_secret_123" \\
  http://localhost:3000/api/cron/sync-bank-transactions
\`\`\`

## Production Deployment

### Vercel Configuration

The `vercel.json` file is already configured to run the cron job daily at 2 AM:

\`\`\`json
{
  "crons": [{
    "path": "/api/cron/sync-bank-transactions",
    "schedule": "0 2 * * *"
  }]
}
\`\`\`

### Environment Variables on Vercel

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add all the Plaid variables listed above
4. Add `CRON_SECRET` (generate a secure random string)
5. Redeploy

## Troubleshooting

### "PLAID_CLIENT_ID is not defined"
- Make sure `.env.local` has `PLAID_CLIENT_ID=...`
- Restart your dev server after adding env vars

### "Invalid credentials" in Plaid Link
- Ensure you're using Sandbox test credentials
- Try "user_good" / "pass_good"
- Check that `PLAID_ENV=sandbox`

### Transactions not syncing
- Check that `auto_import_transactions` is `true` in the database
- Verify the cron job ran (check Vercel logs)
- Try manual sync button

### "Failed to create Plaid Link token"
- Check your Plaid secrets are correct
- Verify your Plaid account is active
- Check Plaid Dashboard for errors

## Cost Breakdown

### Free Tier (Sandbox)
- ✅ Unlimited testing
- ✅ All features available
- ✅ No credit card required
- ✅ Perfect for development

### Production
- ~$0.10-0.30 per user/month
- First 100 users often free
- Volume discounts available
- Only charged for active connections

## Support

- Plaid Documentation: https://plaid.com/docs/
- Plaid Support: support@plaid.com
- Slack Community: https://plaid.com/slack

## Next Steps

1. ✅ Add environment variables
2. ✅ Test in Sandbox
3. 🔄 Implement token encryption (use @supabase/vault or similar)
4. 🔄 Add statement storage (optional)
5. 🔄 Apply for Plaid production access when ready

