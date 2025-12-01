#!/usr/bin/env tsx
/**
 * Send Test Email Script
 * 
 * Usage:
 *   tsx scripts/send-test-email.ts <email-address> [company-id]
 * 
 * Example:
 *   tsx scripts/send-test-email.ts test@example.com
 *   tsx scripts/send-test-email.ts test@example.com company-uuid-here
 */

import { sendTestEmail } from "../apps/web/src/actions/test-email";

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error("❌ Error: Email address is required");
		console.log("\nUsage:");
		console.log("  tsx scripts/send-test-email.ts <email-address> [company-id]");
		console.log("\nExample:");
		console.log("  tsx scripts/send-test-email.ts test@example.com");
		console.log("  tsx scripts/send-test-email.ts test@example.com company-uuid-here");
		process.exit(1);
	}

	const email = args[0];
	const companyId = args[1];

	console.log("📧 Sending test email via SendGrid...");
	console.log(`   To: ${email}`);
	if (companyId) {
		console.log(`   Company ID: ${companyId}`);
	} else {
		console.log(`   Mode: Admin SendGrid (or auto-detect company)`);
	}
	console.log("");

	try {
		const result = await sendTestEmail({
			to: email,
			companyId,
		});

		if (result.success) {
			console.log("✅ Test email sent successfully!");
			console.log(`   Message ID: ${result.messageId || "N/A"}`);
			console.log(`   Check your inbox at: ${email}`);
		} else {
			console.error("❌ Failed to send test email:");
			console.error(`   Error: ${result.error}`);
			process.exit(1);
		}
	} catch (error) {
		console.error("❌ Error sending test email:");
		console.error(error);
		process.exit(1);
	}
}

main();




