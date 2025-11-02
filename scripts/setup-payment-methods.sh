#!/bin/bash

# Setup Payment Methods (Google Pay & Apple Pay)
# This script sets up the payment methods infrastructure

set -e

echo "🚀 Setting up Payment Methods (Google Pay & Apple Pay)"
echo ""

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check for required environment variables
if [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set"
    echo "   Please add it to your .env.local file"
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "⚠️  Warning: STRIPE_SECRET_KEY not set"
    echo "   Please add it to your .env.local file"
fi

echo "📦 Step 1: Applying database migration..."
echo ""

# Apply the migration
pnpm supabase db push

echo ""
echo "✅ Database migration applied successfully!"
echo ""

echo "📋 Step 2: Next steps to complete setup:"
echo ""
echo "1️⃣  Enable payment methods in Stripe Dashboard:"
echo "   → https://dashboard.stripe.com/settings/payment_methods"
echo "   → Enable: Cards, Link, PayPal (optional)"
echo ""

echo "2️⃣  Register your domain for Apple Pay:"
echo "   → https://dashboard.stripe.com/settings/payment_methods/apple_pay"
echo "   → Add both development and production domains"
echo "   → Download verification file"
echo "   → Place at: public/.well-known/apple-developer-merchantid-domain-association"
echo ""

echo "3️⃣  Test the integration:"
echo "   → Navigate to: /dashboard/settings/billing/payment-methods"
echo "   → Click 'Add Payment Method'"
echo "   → Test with Apple Pay or Google Pay"
echo ""

echo "4️⃣  Use test cards for testing:"
echo "   → Success: 4242 4242 4242 4242"
echo "   → Requires auth: 4000 0025 0000 3155"
echo "   → Declined: 4000 0000 0000 9995"
echo ""

echo "📚 For complete documentation, see:"
echo "   docs/GOOGLE_APPLE_PAY_IMPLEMENTATION.md"
echo ""

echo "✨ Setup complete! You can now accept Google Pay and Apple Pay payments."
echo ""
