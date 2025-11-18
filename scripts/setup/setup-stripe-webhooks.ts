/**
 * Stripe Webhook Setup Script
 *
 * This script creates a webhook endpoint in Stripe and configures it
 * to receive subscription-related events.
 *
 * Run with: npx tsx scripts/setup-stripe-webhooks.ts
 */

import { resolve } from "node:path";
import { config } from "dotenv";
import Stripe from "stripe";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const STRIPE_API_VERSION: Stripe.StripeConfig["apiVersion"] =
	"2025-01-27.acacia";
const WEBHOOK_LIST_LIMIT = 100;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
	throw new Error("STRIPE_SECRET_KEY is not defined in the environment");
}

// Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
	apiVersion: STRIPE_API_VERSION,
});

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

async function setupWebhook() {
	console.log("🔗 Setting up Stripe Webhook Endpoint...\n");

	try {
		// Get the webhook URL from environment or use a placeholder
		const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL
			? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/stripe`
			: "https://yourdomain.com/api/webhooks/stripe";

		console.log(`Webhook URL: ${webhookUrl}\n`);

		// Check for existing webhooks at this URL
		console.log("Checking for existing webhooks...");
		const existingEndpoints = await stripe.webhookEndpoints.list({
			limit: WEBHOOK_LIST_LIMIT,
		});

		const matchingEndpoint = existingEndpoints.data.find(
			(endpointItem) =>
				endpointItem.url === webhookUrl && endpointItem.status === "enabled",
		);

		if (matchingEndpoint) {
			console.log("✅ Active webhook already exists!");
			console.log(`   Endpoint ID: ${matchingEndpoint.id}`);
			console.log(`   Status: ${matchingEndpoint.status}`);
			console.log(`   Events: ${matchingEndpoint.enabled_events.join(", ")}`);
			console.log("\n⚠️  To view the signing secret:");
			console.log(
				`   1. Go to: https://dashboard.stripe.com/webhooks/${matchingEndpoint.id}`,
			);
			console.log('   2. Click "Click to reveal" next to Signing secret');
			console.log("   3. Copy the secret (starts with whsec_)");
			console.log("   4. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_...");
			return;
		}

		// Create webhook endpoint
		console.log("Creating new webhook endpoint...");
		const endpoint = await stripe.webhookEndpoints.create({
			url: webhookUrl,
			enabled_events: [
				"checkout.session.completed",
				"customer.subscription.created",
				"customer.subscription.updated",
				"customer.subscription.deleted",
				"invoice.payment_succeeded",
				"invoice.payment_failed",
				"invoice.finalized",
			],
			description: "Thorbis Subscription Events",
			api_version: STRIPE_API_VERSION,
		});

		console.log("\n✅ Webhook endpoint created successfully!");
		console.log("═══════════════════════════════════════\n");
		console.log("Webhook Details:");
		console.log(`  Endpoint ID: ${endpoint.id}`);
		console.log(`  URL: ${endpoint.url}`);
		console.log(`  Status: ${endpoint.status}`);
		console.log(`  API Version: ${endpoint.api_version}`);
		console.log("\nEnabled Events:");
		for (const event of endpoint.enabled_events) {
			console.log(`  ✓ ${event}`);
		}

		console.log("\n🔐 IMPORTANT: Signing Secret");
		console.log("═══════════════════════════════════════\n");
		console.log("⚠️  The signing secret is only shown ONCE during creation.");
		console.log("Add this to your .env.local file:\n");
		console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}\n`);

		console.log("📝 Next Steps:");
		console.log("1. Copy the STRIPE_WEBHOOK_SECRET above to .env.local");
		console.log("2. Deploy your webhook handler to production");
		console.log(
			"3. Test webhook delivery at: https://dashboard.stripe.com/webhooks",
		);
		console.log("\n");
	} catch (error) {
		console.error("❌ Error setting up webhook:", getErrorMessage(error));
		console.error("\nFull error:", error);
		process.exit(1);
	}
}

// Run the script
setupWebhook()
	.then(() => {
		console.log("✅ Webhook setup complete!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Script failed:", error);
		process.exit(1);
	});
