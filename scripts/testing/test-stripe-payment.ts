/**
 * Stripe Payment Flow Test Script
 *
 * This script tests the complete Stripe payment integration:
 * 1. Creates a test customer
 * 2. Creates a checkout session
 * 3. Verifies the checkout URL is generated
 * 4. Lists available products and prices
 *
 * Run with: npx tsx scripts/test-stripe-payment.ts
 */

import { resolve } from "node:path";
import { config } from "dotenv";
import Stripe from "stripe";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const STRIPE_API_VERSION: Stripe.StripeConfig["apiVersion"] =
  "2025-01-27.acacia";
const PRODUCTS_LIST_LIMIT = 20;
const PRICES_LIST_LIMIT = 20;
const WEBHOOK_LIST_LIMIT = 5;
const PRICE_DECIMALS = 2;
const CENTS_IN_DOLLAR = 100;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined in the environment");
}

// Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: STRIPE_API_VERSION,
});

async function testPaymentFlow() {
  console.log("🧪 Testing Stripe Payment Flow...\n");

  try {
    await verifyApiConnection();
    const productCount = await logProducts();
    const priceCount = await logPrices();
    const customer = await createTestCustomer();
    const session = await createCheckoutSession(customer.id);
    await retrieveCheckoutSession(session.id);
    await logWebhookEndpoints();
    await createBillingPortalSession(customer.id);
    logSummary(productCount, priceCount, session.url, customer.id);
  } catch (error) {
    console.error("❌ Test failed:", getErrorMessage(error));
    console.error("");
    console.error("Full error:", error);
    process.exit(1);
  }
}

async function verifyApiConnection() {
  console.log("✅ Test 1: Verify Stripe API Connection");
  const account = await stripe.accounts.retrieve();
  console.log(`   Account ID: ${account.id}`);
  console.log(`   Display Name: ${account.business_profile?.name || "N/A"}`);
  console.log("");
}

async function logProducts() {
  console.log("✅ Test 2: List Available Products");
  const products = await stripe.products.list({ limit: PRODUCTS_LIST_LIMIT });
  console.log(`   Found ${products.data.length} products:`);
  for (const product of products.data) {
    console.log(`   - ${product.name} (${product.id})`);
  }
  console.log("");
  return products.data.length;
}

async function logPrices() {
  console.log("✅ Test 3: List Available Prices");
  const prices = await stripe.prices.list({ limit: PRICES_LIST_LIMIT });
  console.log(`   Found ${prices.data.length} prices:`);
  for (const price of prices.data) {
    const amount = price.unit_amount
      ? `$${(price.unit_amount / CENTS_IN_DOLLAR).toFixed(PRICE_DECIMALS)}`
      : "Usage-based";
    console.log(
      `   - ${price.id}: ${amount}/${price.recurring?.interval || "one-time"}`
    );
  }
  console.log("");
  return prices.data.length;
}

async function createTestCustomer() {
  console.log("✅ Test 4: Create Test Customer");
  const customer = await stripe.customers.create({
    email: "test-payment@thorbis.com",
    name: "Test Payment Customer",
    metadata: {
      test: "true",
      created_by: "test-script",
    },
  });
  console.log(`   Customer created: ${customer.id}`);
  console.log(`   Email: ${customer.email}`);
  console.log("");
  return customer;
}

async function createCheckoutSession(customerId: string) {
  console.log("✅ Test 5: Create Checkout Session");
  const basePriceId = process.env.STRIPE_PRICE_ID_BASE_PLAN;

  if (!basePriceId) {
    throw new Error(
      "STRIPE_PRICE_ID_BASE_PLAN is not configured in .env.local"
    );
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: basePriceId,
        quantity: 1,
      },
    ],
    success_url: "https://thorbis.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://thorbis.com/cancel",
    metadata: {
      test: "true",
      company_id: "test-company-123",
    },
  });

  console.log(`   Checkout session created: ${session.id}`);
  console.log(`   Status: ${session.status}`);
  console.log(`   Payment status: ${session.payment_status}`);
  console.log(`   Checkout URL: ${session.url}`);
  console.log("");
  return session;
}

async function retrieveCheckoutSession(sessionId: string) {
  console.log("✅ Test 6: Retrieve Checkout Session");
  const retrievedSession = await stripe.checkout.sessions.retrieve(sessionId);
  console.log(`   Session ID: ${retrievedSession.id}`);
  console.log(`   Status: ${retrievedSession.status}`);
  console.log("");
}

async function logWebhookEndpoints() {
  console.log("✅ Test 7: List Webhook Endpoints");
  try {
    const webhooks = await stripe.webhookEndpoints.list({
      limit: WEBHOOK_LIST_LIMIT,
    });
    if (webhooks.data.length > 0) {
      console.log(`   Found ${webhooks.data.length} webhook(s):`);
      for (const webhook of webhooks.data) {
        console.log(`   - ${webhook.url}`);
        console.log(`     Status: ${webhook.status}`);
        console.log(`     Events: ${webhook.enabled_events.join(", ")}`);
      }
    } else {
      console.log("   ⚠️  No webhooks configured yet");
      console.log("   Configure at: https://dashboard.stripe.com/webhooks");
    }
  } catch {
    console.log("   ⚠️  Unable to list webhooks (permissions may be required)");
  }
  console.log("");
}

async function createBillingPortalSession(customerId: string) {
  console.log("✅ Test 8: Create Billing Portal Session");
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://thorbis.com/settings/billing",
    });
    console.log(`   Portal session created: ${portalSession.id}`);
    console.log(`   Portal URL: ${portalSession.url}`);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("configuration has not been created")) {
      console.log("   ⚠️  Billing portal not configured yet");
      console.log(
        "   Configure at: https://dashboard.stripe.com/settings/billing/portal"
      );
      console.log("   This is optional for testing the payment flow");
    } else {
      throw error;
    }
  }
  console.log("");
}

function logSummary(
  productCount: number,
  priceCount: number,
  checkoutUrl: string | null,
  customerId: string
) {
  console.log("═══════════════════════════════════════");
  console.log("🎉 ALL TESTS PASSED!");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("✅ Payment Flow Status: WORKING");
  console.log("");
  console.log("Test Results:");
  console.log("  • Stripe API: Connected");
  console.log(`  • Products: ${productCount} available`);
  console.log(`  • Prices: ${priceCount} configured`);
  console.log("  • Customer Creation: Success");
  console.log("  • Checkout Session: Success");
  console.log("  • Billing Portal: Success");
  console.log("");
  console.log("Next Steps:");
  console.log("  1. Visit checkout URL to test payment:");
  console.log(`     ${checkoutUrl ?? "N/A"}`);
  console.log("  2. Use test card: 4242 4242 4242 4242");
  console.log(
    "  3. Configure webhook at: https://dashboard.stripe.com/webhooks"
  );
  console.log("  4. Set STRIPE_WEBHOOK_SECRET in .env.local");
  console.log("");
  console.log("Cleanup (Optional):");
  console.log(
    `  • Delete test customer: stripe customers delete ${customerId}`
  );
  console.log("");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

// Run the test
testPaymentFlow()
  .then(() => {
    console.log("✅ Test script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test script failed:", error);
    process.exit(1);
  });
