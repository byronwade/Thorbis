#!/bin/bash

# Stripe Meters Creation Script
# Creates all 11 usage meters for Thorbis billing
# Run this script after installing Stripe CLI: brew install stripe/stripe-cli/stripe
# Login first: stripe login

echo "🚀 Creating 11 Stripe usage meters for Thorbis..."
echo ""

# Note: Unfortunately, Stripe CLI doesn't support creating meters via command line yet
# Meters must be created via Dashboard or API
# This script will output the curl commands you can run instead

echo "⚠️  Stripe CLI doesn't support meter creation yet."
echo "You have two options:"
echo ""
echo "Option 1: Use Stripe Dashboard (recommended - 10 minutes)"
echo "  Go to: https://dashboard.stripe.com/meters"
echo "  Click 'Create meter' 11 times with the configurations below"
echo ""
echo "Option 2: Use these curl commands (requires STRIPE_SECRET_KEY)"
echo ""

# Array of meter configurations
declare -a METERS=(
  "Thorbis Team Members|thorbis_team_members|last_during_period|Active team members with platform access"
  "Thorbis Customer Invoices|thorbis_invoices|count|Customer invoices sent"
  "Thorbis Price Quotes|thorbis_estimates|count|Price quotes and estimates sent"
  "Thorbis Text Messages|thorbis_sms|count|SMS messages sent to customers"
  "Thorbis Emails|thorbis_emails|count|Automated emails sent"
  "Thorbis Video Call Minutes|thorbis_video_minutes|sum|Video call minutes"
  "Thorbis Phone Call Minutes|thorbis_phone_minutes|sum|Phone call minutes"
  "Thorbis File Storage|thorbis_storage_gb|last_during_period|File storage in GB"
  "Thorbis Payments Collected|thorbis_payments|count|Credit card payments processed"
  "Thorbis Automated Actions|thorbis_workflows|count|Automated workflow executions"
  "Thorbis API Calls|thorbis_api_calls|count|API requests made"
)

echo "📋 Meter Configurations:"
echo "======================="
echo ""

# Loop through meters and create curl commands
for meter in "${METERS[@]}"; do
  IFS='|' read -r display_name event_name aggregation description <<< "$meter"

  echo "Meter: $display_name"
  echo "Event: $event_name"
  echo "Aggregation: $aggregation"
  echo ""

  # Create curl command
  cat << EOF
curl https://api.stripe.com/v1/billing/meters \\
  -u "\${STRIPE_SECRET_KEY}:" \\
  -d "display_name=$display_name" \\
  -d "event_name=$event_name" \\
  -d "default_aggregation[formula]=$aggregation"

EOF
  echo "---"
  echo ""
done

echo ""
echo "✅ To create all meters automatically:"
echo ""
echo "1. Export your Stripe secret key:"
echo "   export STRIPE_SECRET_KEY=sk_live_xxx"
echo ""
echo "2. Run each curl command above, or save this output and execute:"
echo "   bash create-stripe-meters.sh > meters.sh"
echo "   bash meters.sh"
echo ""
echo "3. Or use the Stripe Dashboard (fastest):"
echo "   https://dashboard.stripe.com/meters"
echo ""
