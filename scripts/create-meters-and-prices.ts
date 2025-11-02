/**
 * Stripe Meters and Prices Setup Script
 *
 * This script creates all 11 usage meters and their corresponding products/prices
 * Run with: npx tsx scripts/create-meters-and-prices.ts
 */

import Stripe from 'stripe';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

// Meter configurations
const meterConfigs = [
  {
    display_name: 'Thorbis Team Members',
    event_name: 'thorbis_team_members',
    aggregation: 'last',
    product_name: 'Team Members',
    product_description: 'Active team members with platform access',
    price_amount: 500, // $5.00 in cents
  },
  {
    display_name: 'Thorbis Customer Invoices',
    event_name: 'thorbis_invoices',
    aggregation: 'count',
    product_name: 'Customer Invoices',
    product_description: 'Invoices sent to customers',
    price_amount: 15, // $0.15 in cents
  },
  {
    display_name: 'Thorbis Price Quotes',
    event_name: 'thorbis_estimates',
    aggregation: 'count',
    product_name: 'Price Quotes',
    product_description: 'Price quotes and estimates sent',
    price_amount: 10, // $0.10 in cents
  },
  {
    display_name: 'Thorbis Text Messages',
    event_name: 'thorbis_sms',
    aggregation: 'count',
    product_name: 'Text Messages (SMS)',
    product_description: 'SMS messages sent to customers',
    price_amount: 2, // $0.02 in cents
  },
  {
    display_name: 'Thorbis Emails',
    event_name: 'thorbis_emails',
    aggregation: 'count',
    product_name: 'Emails Sent',
    product_description: 'Automated emails sent to customers',
    price_amount: 0.5, // $0.005 in cents (Stripe will handle this)
  },
  {
    display_name: 'Thorbis Video Call Minutes',
    event_name: 'thorbis_video_minutes',
    aggregation: 'sum',
    product_name: 'Video Call Minutes',
    product_description: 'Video call minutes for consultations and meetings',
    price_amount: 5, // $0.05 in cents
  },
  {
    display_name: 'Thorbis Phone Call Minutes',
    event_name: 'thorbis_phone_minutes',
    aggregation: 'sum',
    product_name: 'Phone Call Minutes',
    product_description: 'Phone call minutes through the platform',
    price_amount: 2, // $0.02 in cents
  },
  {
    display_name: 'Thorbis File Storage',
    event_name: 'thorbis_storage_gb',
    aggregation: 'last',
    product_name: 'File Storage',
    product_description: 'Secure cloud storage for files and documents',
    price_amount: 50, // $0.50 in cents
  },
  {
    display_name: 'Thorbis Payments Collected',
    event_name: 'thorbis_payments',
    aggregation: 'count',
    product_name: 'Payments Collected',
    product_description: 'Credit card payments processed',
    price_amount: 29, // $0.29 in cents
  },
  {
    display_name: 'Thorbis Automated Actions',
    event_name: 'thorbis_workflows',
    aggregation: 'count',
    product_name: 'Automated Workflows',
    product_description: 'Automated workflow and task executions',
    price_amount: 10, // $0.10 in cents
  },
  {
    display_name: 'Thorbis API Calls',
    event_name: 'thorbis_api_calls',
    aggregation: 'count',
    product_name: 'API Calls',
    product_description: 'API requests made to the platform',
    price_amount: 0.1, // $0.001 in cents
  },
];

async function createMetersAndPrices() {
  console.log('🚀 Starting Stripe meters and prices creation...\n');

  const results = [];

  for (const config of meterConfigs) {
    try {
      console.log(`Creating meter: ${config.display_name}...`);

      // Create meter
      const meter = await stripe.billing.meters.create({
        display_name: config.display_name,
        event_name: config.event_name,
        default_aggregation: {
          formula: config.aggregation as any,
        },
      });

      console.log(`✅ Meter created: ${meter.id}`);

      // Create product
      console.log(`Creating product: ${config.product_name}...`);
      const product = await stripe.products.create({
        name: config.product_name,
        description: config.product_description,
      });

      console.log(`✅ Product created: ${product.id}`);

      // Create price
      console.log(`Creating price...`);
      const price = await stripe.prices.create({
        product: product.id,
        currency: 'usd',
        recurring: {
          interval: 'month',
          usage_type: 'metered',
          meter: meter.id,
        },
        billing_scheme: 'per_unit',
        unit_amount_decimal: config.price_amount.toString(),
      } as any);

      console.log(`✅ Price created: ${price.id}`);
      console.log(`   Amount: $${(config.price_amount / 100).toFixed(4)} per unit\n`);

      results.push({
        meter_id: meter.id,
        product_id: product.id,
        price_id: price.id,
        event_name: config.event_name,
        price_amount: config.price_amount,
      });

    } catch (error: any) {
      console.error(`❌ Error creating ${config.display_name}:`, error.message);
      console.error('   Full error:', error);
    }
  }

  console.log('\n✅ Setup complete!\n');
  console.log('📋 Summary:');
  console.log('===========\n');

  // Generate .env additions
  console.log('Add these to your .env.local file:\n');
  console.log('# Usage-based price IDs');

  const envMapping: Record<string, string> = {
    'thorbis_team_members': 'STRIPE_PRICE_ID_TEAM_MEMBERS',
    'thorbis_invoices': 'STRIPE_PRICE_ID_INVOICES',
    'thorbis_estimates': 'STRIPE_PRICE_ID_ESTIMATES',
    'thorbis_sms': 'STRIPE_PRICE_ID_SMS',
    'thorbis_emails': 'STRIPE_PRICE_ID_EMAILS',
    'thorbis_video_minutes': 'STRIPE_PRICE_ID_VIDEO_MINUTES',
    'thorbis_phone_minutes': 'STRIPE_PRICE_ID_PHONE_MINUTES',
    'thorbis_storage_gb': 'STRIPE_PRICE_ID_STORAGE',
    'thorbis_payments': 'STRIPE_PRICE_ID_PAYMENTS',
    'thorbis_workflows': 'STRIPE_PRICE_ID_WORKFLOWS',
    'thorbis_api_calls': 'STRIPE_PRICE_ID_API_CALLS',
  };

  results.forEach((result) => {
    const envVar = envMapping[result.event_name];
    if (envVar) {
      console.log(`${envVar}=${result.price_id}`);
    }
  });

  console.log('\n');
  console.log('📊 All meters and prices:');
  console.log('========================\n');
  results.forEach((result) => {
    console.log(`Event: ${result.event_name}`);
    console.log(`  Meter ID: ${result.meter_id}`);
    console.log(`  Product ID: ${result.product_id}`);
    console.log(`  Price ID: ${result.price_id}`);
    console.log(`  Amount: $${(result.price_amount / 100).toFixed(4)}`);
    console.log('');
  });
}

// Run the script
createMetersAndPrices()
  .then(() => {
    console.log('✅ All done! Copy the environment variables above to your .env.local file.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
