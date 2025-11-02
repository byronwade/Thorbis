/**
 * Stripe Billing Portal Setup Script
 *
 * This script configures the Stripe billing portal so customers can
 * manage their subscriptions self-service.
 *
 * Run with: npx tsx scripts/setup-billing-portal.ts
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

async function setupBillingPortal() {
  console.log('🏪 Setting up Stripe Billing Portal...\n');

  try {
    // Check if a configuration already exists
    console.log('Checking for existing billing portal configurations...');
    const configurations = await stripe.billingPortal.configurations.list({ limit: 10 });

    if (configurations.data.length > 0 && configurations.data[0].active) {
      console.log('✅ Active billing portal configuration already exists!');
      console.log(`   Configuration ID: ${configurations.data[0].id}`);
      console.log(`   Created: ${new Date(configurations.data[0].created * 1000).toLocaleDateString()}`);
      console.log('\n📋 Current Features:');
      console.log(`   • Cancel subscriptions: ${configurations.data[0].features.subscription_cancel.enabled ? '✓' : '✗'}`);
      console.log(`   • Update payment method: ${configurations.data[0].features.payment_method_update.enabled ? '✓' : '✗'}`);
      console.log(`   • Invoice history: ${configurations.data[0].features.invoice_history.enabled ? '✓' : '✗'}`);
      console.log(`   • Customer update: ${configurations.data[0].features.customer_update.enabled ? '✓' : '✗'}`);
      console.log('\n✅ Billing portal is ready to use!');
      console.log('   Users can access it at: /dashboard/settings/billing');
      return;
    }

    // Create billing portal configuration
    console.log('Creating billing portal configuration...');
    const configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your Thorbis subscription',
      },
      features: {
        customer_update: {
          enabled: true,
          allowed_updates: ['email', 'address', 'phone', 'tax_id'],
        },
        invoice_history: {
          enabled: true,
        },
        payment_method_update: {
          enabled: true,
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'customer_service',
              'too_complex',
              'low_quality',
              'other',
            ],
          },
        },
      },
    });

    console.log('\n✅ Billing portal configuration created successfully!');
    console.log('═══════════════════════════════════════\n');
    console.log('Portal Details:');
    console.log(`  Configuration ID: ${configuration.id}`);
    console.log(`  Status: ${configuration.active ? 'Active' : 'Inactive'}`);
    console.log(`  Created: ${new Date(configuration.created * 1000).toLocaleDateString()}`);

    console.log('\n📋 Enabled Features:');
    console.log('  ✓ Customer can update email, address, phone, tax ID');
    console.log('  ✓ Customer can view invoice history');
    console.log('  ✓ Customer can update payment method');
    console.log('  ✓ Customer can cancel subscription (at period end)');

    console.log('\n🎉 Customers can now manage subscriptions at:');
    console.log('   /dashboard/settings/billing');

    console.log('\n📝 Next Steps:');
    console.log('1. Test the billing portal:');
    console.log('   - Create a test subscription');
    console.log('   - Visit /dashboard/settings/billing');
    console.log('   - Try updating payment method');
    console.log('   - Try canceling subscription');
    console.log('2. Customize portal at: https://dashboard.stripe.com/settings/billing/portal');
    console.log('\n');

  } catch (error: any) {
    console.error('❌ Error setting up billing portal:', error.message);

    if (error.message.includes('configuration has not been created')) {
      console.log('\n💡 Alternative Setup:');
      console.log('Configure manually at: https://dashboard.stripe.com/settings/billing/portal');
      console.log('\nRecommended Settings:');
      console.log('  ✓ Enable customer update (email, address, phone, tax ID)');
      console.log('  ✓ Enable invoice history');
      console.log('  ✓ Enable payment method update');
      console.log('  ✓ Enable subscription cancellation (at period end)');
      console.log('  ✓ Enable subscription updates');
    }

    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the script
setupBillingPortal()
  .then(() => {
    console.log('✅ Billing portal setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
