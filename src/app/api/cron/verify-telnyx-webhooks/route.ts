"use server";

/**
 * Cron Job: Verify Telnyx Webhooks & Messaging Links
 *
 * - Re-applies the production webhook URL to the call control application.
 * - Ensures the default messaging profile points at the same webhook.
 * - Scans phone numbers missing 10DLC metadata and re-runs campaign linking.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/verify-telnyx-webhooks",
 *     "schedule": "0 9 * * *"
 *   }]
 * }
 */

import { NextResponse } from "next/server";
import {
  ensureMessagingBranding,
  ensureMessagingCampaign,
} from "@/actions/messaging-branding";
import {
  TELNYX_CONFIG,
  telnyxClient,
} from "@/lib/telnyx/client";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getWebhookUrl() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.thorbis.com";
  return `${base.replace(/\/$/, "")}/api/webhooks/telnyx`;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET not configured");
    return NextResponse.json(
      { error: "Cron secret not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.error("Unauthorized cron request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = getWebhookUrl();
  const failoverUrl = process.env.TELNYX_WEBHOOK_FAILOVER_URL || null;

  try {
    const summary: Record<string, unknown> = {
      webhookUrl,
      voiceWebhookUpdated: false,
      messagingProfileUpdated: false,
      numbersChecked: 0,
      numbersLinked: 0,
    };

    if (TELNYX_CONFIG.connectionId) {
      try {
        const connection = await telnyxClient.callControlApplications.retrieve(
          TELNYX_CONFIG.connectionId
        );
        const currentUrl = connection.data?.webhook_event_url;
        const currentFailover = connection.data?.webhook_event_failover_url;
        const applicationName =
          connection.data?.application_name || "Thorbis Voice Control";

        if (currentUrl !== webhookUrl || currentFailover !== failoverUrl) {
          await telnyxClient.callControlApplications.update(
            TELNYX_CONFIG.connectionId,
            {
              application_name: applicationName,
              webhook_event_url: webhookUrl,
              webhook_event_failover_url: failoverUrl,
              webhook_api_version: "2",
            }
          );
          summary.voiceWebhookUpdated = true;
        }
      } catch (error) {
        console.error("Failed to verify call control webhook:", error);
      }
    } else {
      console.warn("TELNYX connection ID not configured");
    }

    if (TELNYX_CONFIG.messagingProfileId) {
      try {
        const profile = await telnyxClient.messagingProfiles.retrieve(
          TELNYX_CONFIG.messagingProfileId
        );
        const currentUrl = profile.data?.webhook_url;
        const currentFailover = profile.data?.webhook_failover_url;
        const profileName = profile.data?.name || "Thorbis Messaging";

        if (currentUrl !== webhookUrl || currentFailover !== failoverUrl) {
          await telnyxClient.messagingProfiles.update(
            TELNYX_CONFIG.messagingProfileId,
            {
              name: profileName,
              webhook_url: webhookUrl,
              webhook_failover_url: failoverUrl,
              webhook_api_version: "2",
            }
          );
          summary.messagingProfileUpdated = true;
        }
      } catch (error) {
        console.error("Failed to verify messaging profile webhook:", error);
      }
    } else {
      console.warn("TELNYX messaging profile ID not configured");
    }

    const serviceSupabase = await createServiceSupabaseClient();

    const { data: phoneNumbers, error: phoneError } = await serviceSupabase
      .from("phone_numbers")
      .select(
        "id, company_id, phone_number, telnyx_messaging_profile_id, metadata, status"
      )
      .is("deleted_at", null)
      .in("status", ["active", "pending", "porting"])
      .or(
        "telnyx_messaging_profile_id.is.null,metadata->>ten_dlc_campaign_id.is.null"
      )
      .limit(50);

    if (phoneError) {
      console.error("Failed to load phone numbers for Telnyx audit:", phoneError);
    } else if (phoneNumbers?.length) {
      summary.numbersChecked = phoneNumbers.length;

      // Get unique company IDs to ensure branding first
      const companyIds = [
        ...new Set(phoneNumbers.map((p) => p.company_id)),
      ];

      for (const companyId of companyIds) {
        try {
          await ensureMessagingBranding(companyId, {
            supabase: serviceSupabase,
          });
        } catch (error) {
          console.error(
            `Failed to ensure messaging branding for company ${companyId}:`,
            error
          );
        }
      }

      for (const phone of phoneNumbers) {
        try {
          const result = await ensureMessagingCampaign(
            phone.company_id,
            {
              id: phone.id,
              e164: phone.phone_number,
            },
            { supabase: serviceSupabase }
          );

          if (result.success) {
            summary.numbersLinked = (summary.numbersLinked as number) + 1;
          }
        } catch (error) {
          console.error(
            `Failed to ensure messaging campaign for phone ${phone.id}:`,
            error
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...summary,
    });
  } catch (error: any) {
    console.error("Telnyx webhook verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}

