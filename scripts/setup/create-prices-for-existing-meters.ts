/**
 * Create Prices for Existing Stripe Meters
 *
 * This script creates prices for meters that already exist in Stripe.
 * Run with: npx tsx scripts/create-prices-for-existing-meters.ts
 */

import { resolve } from "node:path";
import { config } from "dotenv";
import Stripe from "stripe";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const STRIPE_API_VERSION: Stripe.StripeConfig["apiVersion"] = "2025-01-27.acacia";
const METER_LIST_LIMIT = 20;
const PRODUCT_LIST_LIMIT = 20;
const PRICE_LIST_LIMIT = 10;
const CENTS_IN_DOLLAR = 100;
const PRICE_DECIMALS = 4;

type MeterPriceResult = {
	event_name: string;
	meter_id: string;
	product_id: string;
	price_id: string;
	amount: number;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
	throw new Error("STRIPE_SECRET_KEY is not defined in the environment");
}

// Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
	apiVersion: STRIPE_API_VERSION,
});

async function createPricesForMeters() {
	console.log("🚀 Creating prices for existing Stripe meters...\n");

	try {
		// Step 1: List all existing meters
		console.log("Step 1: Fetching existing meters...");
		const meters = await stripe.billing.meters.list({
			limit: METER_LIST_LIMIT,
		});
		console.log(`Found ${meters.data.length} meters\n`);

		// Step 2: List all existing products
		console.log("Step 2: Fetching existing products...");
		const allProducts = await stripe.products.list({
			limit: PRODUCT_LIST_LIMIT,
		});
		console.log(`Found ${allProducts.data.length} products\n`);

		const results: MeterPriceResult[] = [];

		// Step 3: For each meter, find matching product and create price
		for (const meter of meters.data) {
			try {
				console.log(`Processing meter: ${meter.display_name} (${meter.event_name})`);

				// Find matching product by name
				const productName = meter.display_name.replace("Thorbis ", "");
				let product = allProducts.data.find((p) => p.name === productName);

				// If no product found, create one
				if (product) {
					console.log(`  ✓ Using existing product: ${product.id}`);
				} else {
					console.log(`  Creating new product for ${productName}...`);
					product = await stripe.products.create({
						name: productName,
						description: meter.display_name,
					});
					console.log(`  ✅ Product created: ${product.id}`);
				}

				// Check if price already exists for this meter
				const existingPrices = await stripe.prices.list({
					product: product.id,
					limit: PRICE_LIST_LIMIT,
				});

				const meterPrice = existingPrices.data.find((priceItem) => priceItem.recurring?.meter === meter.id);

				if (meterPrice) {
					console.log(`  ✓ Price already exists: ${meterPrice.id}`);
					const formattedAmount = ((meterPrice.unit_amount || 0) / CENTS_IN_DOLLAR).toFixed(PRICE_DECIMALS);
					console.log(`    Amount: $${formattedAmount}`);
					results.push({
						event_name: meter.event_name,
						meter_id: meter.id,
						product_id: product.id,
						price_id: meterPrice.id,
						amount: meterPrice.unit_amount || 0,
					});
					console.log("");
					continue;
				}

				// Determine price based on event name
				const priceMap: Record<string, number> = {
					thorbis_team_members: 500, // $5.00
					thorbis_invoices: 15, // $0.15
					thorbis_estimates: 10, // $0.10
					thorbis_sms: 2, // $0.02
					thorbis_emails: 0.5, // $0.005
					thorbis_video_minutes: 5, // $0.05
					thorbis_phone_minutes: 2, // $0.02
					thorbis_storage_gb: 50, // $0.50
					thorbis_payments: 29, // $0.29
					thorbis_workflows: 10, // $0.10
					thorbis_api_calls: 0.1, // $0.001
				};

				const unitAmount = priceMap[meter.event_name] || 1;

				// Create price
				console.log(`  Creating price with amount: $${(unitAmount / CENTS_IN_DOLLAR).toFixed(PRICE_DECIMALS)}...`);
				const price = await stripe.prices.create({
					product: product.id,
					currency: "usd",
					recurring: {
						interval: "month",
						usage_type: "metered",
						meter: meter.id,
					},
					billing_scheme: "per_unit",
					unit_amount_decimal: unitAmount.toString(),
				});

				console.log(`  ✅ Price created: ${price.id}`);
				console.log(`    Amount: $${(unitAmount / CENTS_IN_DOLLAR).toFixed(PRICE_DECIMALS)}\n`);

				results.push({
					event_name: meter.event_name,
					meter_id: meter.id,
					product_id: product.id,
					price_id: price.id,
					amount: unitAmount,
				});
			} catch (error) {
				console.error(`  ❌ Error processing ${meter.display_name}:`, getErrorMessage(error));
				console.log("");
			}
		}

		console.log("\n✅ Price creation complete!\n");
		console.log("═══════════════════════════════════════\n");
		console.log("📋 Add these to your .env.local file:\n");
		console.log("# Usage-based price IDs");

		const envMapping: Record<string, string> = {
			thorbis_team_members: "STRIPE_PRICE_ID_TEAM_MEMBERS",
			thorbis_invoices: "STRIPE_PRICE_ID_INVOICES",
			thorbis_estimates: "STRIPE_PRICE_ID_ESTIMATES",
			thorbis_sms: "STRIPE_PRICE_ID_SMS",
			thorbis_emails: "STRIPE_PRICE_ID_EMAILS",
			thorbis_video_minutes: "STRIPE_PRICE_ID_VIDEO_MINUTES",
			thorbis_phone_minutes: "STRIPE_PRICE_ID_PHONE_MINUTES",
			thorbis_storage_gb: "STRIPE_PRICE_ID_STORAGE",
			thorbis_payments: "STRIPE_PRICE_ID_PAYMENTS",
			thorbis_workflows: "STRIPE_PRICE_ID_WORKFLOWS",
			thorbis_api_calls: "STRIPE_PRICE_ID_API_CALLS",
		};

		for (const result of results) {
			const envVar = envMapping[result.event_name];
			if (envVar) {
				console.log(`${envVar}=${result.price_id}`);
			}
		}

		console.log("\n");
		console.log("📊 Summary:");
		console.log(`  Total meters: ${meters.data.length}`);
		console.log(`  Prices created/found: ${results.length}`);
		console.log("\n");
	} catch (error) {
		console.error("❌ Script failed:", getErrorMessage(error));
		console.error("\nFull error:", error);
		process.exit(1);
	}
}

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

// Run the script
createPricesForMeters()
	.then(() => {
		console.log("✅ All done!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Script failed:", error);
		process.exit(1);
	});
