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
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { TELNYX_CONFIG, telnyxClient } from "@/lib/telnyx/client";
import { fixConnection } from "@/lib/telnyx/connection-setup";
import { fixMessagingProfile } from "@/lib/telnyx/messaging-profile-setup";
import { fixPhoneNumber } from "@/lib/telnyx/phone-number-setup";

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
		return NextResponse.json(
			{ error: "Cron secret not configured" },
			{ status: 500 },
		);
	}

	if (authHeader !== `Bearer ${cronSecret}`) {
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
			numbersFixed: 0,
			connectionFixed: false,
			messagingProfileFixed: false,
			errors: [] as string[],
		};

		// Auto-fix connection webhook configuration
		if (TELNYX_CONFIG.connectionId) {
			try {
				const fixResult = await fixConnection(TELNYX_CONFIG.connectionId, {
					webhookUrl,
					webhookFailoverUrl: failoverUrl || undefined,
				});

				if (fixResult.success && fixResult.fixed) {
					summary.connectionFixed = true;
					summary.voiceWebhookUpdated = true;
				} else if (fixResult.error) {
					(summary.errors as string[]).push(
						`Connection fix failed: ${fixResult.error}`,
					);
				}
			} catch (error) {
				(summary.errors as string[]).push(
					`Connection verification error: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		} else {
			(summary.errors as string[]).push(
				"Connection ID is not configured",
			);
		}

		// Auto-fix messaging profile webhook configuration
		if (TELNYX_CONFIG.messagingProfileId) {
			try {
				const fixResult = await fixMessagingProfile(
					TELNYX_CONFIG.messagingProfileId,
					{
						webhookUrl,
						webhookFailoverUrl: failoverUrl || undefined,
					},
				);

				if (fixResult.success && fixResult.fixed) {
					summary.messagingProfileFixed = true;
					summary.messagingProfileUpdated = true;
				} else if (fixResult.error) {
					(summary.errors as string[]).push(
						`Messaging profile fix failed: ${fixResult.error}`,
					);
				}
			} catch (error) {
				(summary.errors as string[]).push(
					`Messaging profile verification error: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		} else {
			(summary.errors as string[]).push(
				"Messaging profile ID is not configured",
			);
		}

		const serviceSupabase = await createServiceSupabaseClient();

		const { data: phoneNumbers, error: phoneError } = await serviceSupabase
			.from("phone_numbers")
			.select(
				"id, company_id, phone_number, telnyx_messaging_profile_id, metadata, status",
			)
			.is("deleted_at", null)
			.in("status", ["active", "pending", "porting"])
			.or(
				"telnyx_messaging_profile_id.is.null,metadata->>ten_dlc_campaign_id.is.null",
			)
			.limit(50);

		if (phoneError) {
			// TODO: Handle error case
		} else if (phoneNumbers?.length) {
			summary.numbersChecked = phoneNumbers.length;

			// Get unique company IDs to ensure branding first
			const companyIds = [...new Set(phoneNumbers.map((p) => p.company_id))];

			for (const companyId of companyIds) {
				try {
					await ensureMessagingBranding(companyId, {
						supabase: serviceSupabase,
					});
				} catch (_error) {}
			}

			for (const phone of phoneNumbers) {
				try {
					// First, try to auto-fix phone number configuration
					const fixResult = await fixPhoneNumber(phone.phone_number);
					if (fixResult.success && fixResult.fixed) {
						summary.numbersFixed = (summary.numbersFixed as number) + 1;
					}

					// Then ensure messaging campaign is linked
					const result = await ensureMessagingCampaign(
						phone.company_id,
						{
							id: phone.id,
							e164: phone.phone_number,
						},
						{ supabase: serviceSupabase },
					);

					if (result.success) {
						summary.numbersLinked = (summary.numbersLinked as number) + 1;
					}
				} catch (error) {
					(summary.errors as string[]).push(
						`Phone number ${phone.phone_number} processing error: ${error instanceof Error ? error.message : "Unknown error"}`,
					);
				}
			}
		}

		return NextResponse.json({
			success: true,
			...summary,
		});
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Verification failed", details: error.message },
			{ status: 500 },
		);
	}
}
