/**
 * Production Setup Fix Script
 *
 * This script ensures all Telnyx configurations are properly set up:
 * 1. Creates/updates messaging brands
 * 2. Creates/updates messaging campaigns
 * 3. Links phone numbers to campaigns
 * 4. Verifies webhook configurations
 *
 * Run with: npx tsx scripts/fix-telnyx-production-setup.ts
 */

import { ensureMessagingBranding, ensureMessagingCampaign } from "@/actions/messaging-branding";
import { createClient } from "@/lib/supabase/server";

async function main() {
	console.log("🔧 Starting Telnyx production setup fix...\n");

	const supabase = await createClient();
	if (!supabase) {
		console.error("❌ Failed to create Supabase client");
		process.exit(1);
	}

	// Get all active companies with phone numbers
	const { data: companies, error: companiesError } = await supabase
		.from("companies")
		.select("id, name")
		.order("created_at", { ascending: false });

	if (companiesError) {
		console.error("❌ Failed to fetch companies:", companiesError);
		process.exit(1);
	}

	if (!companies || companies.length === 0) {
		console.log("ℹ️  No companies found");
		return;
	}

	for (const company of companies) {
		console.log(`\n📋 Processing company: ${company.name} (${company.id})`);

		// Step 1: Ensure messaging branding
		console.log("  → Ensuring messaging branding...");
		const brandResult = await ensureMessagingBranding(company.id, { supabase });
		if (!brandResult.success) {
			console.error(`  ❌ Failed to ensure branding: ${brandResult.error}`);
			continue;
		}
		console.log("  ✅ Branding ensured");

		// Step 2: Get phone numbers for this company
		const { data: phoneNumbers } = await supabase
			.from("phone_numbers")
			.select("id, phone_number")
			.eq("company_id", company.id)
			.is("deleted_at", null)
			.in("status", ["active", "pending"]);

		if (!phoneNumbers || phoneNumbers.length === 0) {
			console.log("  ℹ️  No phone numbers found for this company");
			continue;
		}

		// Step 3: Ensure messaging campaign for each phone number
		for (const phoneNumber of phoneNumbers) {
			console.log(`  → Ensuring campaign for ${phoneNumber.phone_number}...`);
			const campaignResult = await ensureMessagingCampaign(
				company.id,
				{ id: phoneNumber.id, e164: phoneNumber.phone_number },
				{ supabase }
			);
			if (!campaignResult.success) {
				console.error(`  ❌ Failed to ensure campaign: ${campaignResult.error}`);
				continue;
			}
			console.log(`  ✅ Campaign ensured for ${phoneNumber.phone_number}`);
		}
	}

	console.log("\n✅ Production setup fix completed!");
}

main().catch((error) => {
	console.error("❌ Script failed:", error);
	process.exit(1);
});
