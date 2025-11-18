/**
 * Fix Test Plumbing Company's Telnyx Webhook URLs
 *
 * This script fixes the webhook URL mismatch where the messaging profile
 * is configured with https://www.thorbis.com instead of https://thorbis.com
 */

import "dotenv/config";
import { fixMessagingProfile } from "../src/lib/telnyx/messaging-profile-setup";
import { telnyxClient } from "../src/lib/telnyx/client";

const TEST_COMPANY_MESSAGING_PROFILE_ID = "40019a7f-f653-40a2-beba-92b69b88715f";
const TEST_COMPANY_CALL_CONTROL_APP_ID = "2828119574191277880";
const CORRECT_WEBHOOK_URL = "https://thorbis.com/api/webhooks/telnyx";

async function main() {
  console.log("🔧 Fixing Test Plumbing Company Telnyx Webhook URLs...\n");

  // Fix messaging profile
  console.log("1. Fixing Messaging Profile Webhook URL...");
  console.log(`   Profile ID: ${TEST_COMPANY_MESSAGING_PROFILE_ID}`);
  console.log(`   Expected URL: ${CORRECT_WEBHOOK_URL}\n`);

  const messagingResult = await fixMessagingProfile(
    TEST_COMPANY_MESSAGING_PROFILE_ID,
    {
      webhookUrl: CORRECT_WEBHOOK_URL,
    }
  );

  if (messagingResult.success) {
    console.log("✅ Messaging Profile Updated:");
    if (messagingResult.fixed) {
      messagingResult.changes.forEach((change) => {
        console.log(`   - ${change}`);
      });
    } else {
      console.log("   - No changes needed (already correct)");
    }
  } else {
    console.error("❌ Failed to update messaging profile:");
    console.error(`   ${messagingResult.error}`);
  }

  // Fix call control application
  console.log("\n2. Fixing Call Control Application Webhook URL...");
  console.log(`   App ID: ${TEST_COMPANY_CALL_CONTROL_APP_ID}`);
  console.log(`   Expected URL: ${CORRECT_WEBHOOK_URL}\n`);

  try {
    const callApp = await telnyxClient.callControlApplications.retrieve(
      TEST_COMPANY_CALL_CONTROL_APP_ID
    );
    const currentWebhook = (callApp.data as any)?.webhook_event_url;

    if (currentWebhook !== CORRECT_WEBHOOK_URL) {
      await telnyxClient.callControlApplications.update(
        TEST_COMPANY_CALL_CONTROL_APP_ID,
        {
          webhook_event_url: CORRECT_WEBHOOK_URL,
          webhook_api_version: "2",
        }
      );
      console.log("✅ Call Control Application Updated:");
      console.log(`   - Updated webhook URL to ${CORRECT_WEBHOOK_URL}`);
      console.log("   - Updated webhook API version to 2");
    } else {
      console.log("✅ Call Control Application:");
      console.log("   - No changes needed (already correct)");
    }
  } catch (error: any) {
    console.error("❌ Failed to update call control application:");
    console.error(`   ${error?.message || error}`);
  }

  console.log("\n✅ Webhook URL fix complete!");
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
