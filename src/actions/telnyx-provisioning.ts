"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { telnyxClient } from "@/lib/telnyx/client";
import { fixMessagingProfile } from "@/lib/telnyx/messaging-profile-setup";
import {
	type CompanyTelnyxSettingsRow,
	ensureCompanyTelnyxSetup,
	fetchCompanyTelnyxSettings,
	purchaseAdditionalNumbers,
} from "@/lib/telnyx/provision-company";

async function provisionCompanyTelnyx(companyId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Service unavailable" };
	}

	const result = await ensureCompanyTelnyxSetup({
		companyId,
		supabase,
	});

	if (result.success) {
		revalidatePath(`/dashboard/communication`);
	}

	return result;
}

async function purchaseCompanyPhoneNumbers(
	companyId: string,
	quantity: number,
	areaCode?: string,
) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Service unavailable" };
	}

	const result = await purchaseAdditionalNumbers({
		companyId,
		supabase,
		quantity,
		areaCode,
	});

	if (result.success) {
		revalidatePath(`/dashboard/communication`);
	}

	return result;
}

/**
 * Fix webhook URLs for a company's Telnyx configuration
 * Updates both messaging profile and call control application webhooks
 */
export async function fixCompanyTelnyxWebhooks(companyId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Service unavailable" };
	}

	try {
		const settings = await fetchCompanyTelnyxSettings(supabase, companyId);
		if (
			!settings ||
			!settings.messaging_profile_id ||
			!settings.call_control_application_id
		) {
			return {
				success: false,
				error: "Company Telnyx settings not found. Run provisioning first.",
			};
		}

		const changes: string[] = [];
		const CORRECT_WEBHOOK_URL = `https://thorbis.com/api/webhooks/telnyx?company=${companyId}`;

		// Fix messaging profile
		const messagingResult = await fixMessagingProfile(
			settings.messaging_profile_id,
			{
				webhookUrl: CORRECT_WEBHOOK_URL,
			},
		);

		if (messagingResult.success && messagingResult.fixed) {
			changes.push(...messagingResult.changes);
		} else if (!messagingResult.success) {
			return {
				success: false,
				error: `Failed to update messaging profile: ${messagingResult.error}`,
			};
		}

		// Fix call control application
		try {
			const callApp = await telnyxClient.callControlApplications.retrieve(
				settings.call_control_application_id,
			);
			const currentWebhook = (callApp.data as any)?.webhook_event_url;

			if (currentWebhook !== CORRECT_WEBHOOK_URL) {
				await telnyxClient.callControlApplications.update(
					settings.call_control_application_id,
					{
						webhook_event_url: CORRECT_WEBHOOK_URL,
						webhook_api_version: "2",
					},
				);
				changes.push(
					`Updated call control webhook URL to ${CORRECT_WEBHOOK_URL}`,
				);
				changes.push("Updated call control webhook API version to 2");
			}
		} catch (error: any) {
			return {
				success: false,
				error: `Failed to update call control application: ${error?.message || error}`,
			};
		}

		revalidatePath(`/dashboard/communication`);

		return {
			success: true,
			fixed: changes.length > 0,
			changes,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error?.message || "Failed to fix webhooks",
		};
	}
}

/**
 * Enable SMS/MMS on a company's phone number
 * Updates the phone number messaging settings using the correct Telnyx API
 */
export async function enablePhoneNumberMessaging(companyId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Service unavailable" };
	}

	try {
		const settings = await fetchCompanyTelnyxSettings(supabase, companyId);
		if (
			!settings ||
			!settings.default_outbound_phone_number_id ||
			!settings.messaging_profile_id
		) {
			return {
				success: false,
				error: "Company Telnyx settings incomplete. Run provisioning first.",
			};
		}

		// Use the messaging settings endpoint to enable messaging
		const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
		if (!TELNYX_API_KEY) {
			return { success: false, error: "TELNYX_API_KEY not configured" };
		}

		const response = await fetch(
			`https://api.telnyx.com/v2/phone_numbers/${settings.default_outbound_phone_number_id}/messaging`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${TELNYX_API_KEY}`,
				},
				body: JSON.stringify({
					messaging_profile_id: settings.messaging_profile_id,
				}),
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: `${response.status} ${JSON.stringify(data)}`,
			};
		}

		revalidatePath(`/dashboard/communication`);

		return {
			success: true,
			data: data.data,
			message: `Phone number ${settings.default_outbound_number} enabled for SMS/MMS`,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error?.message || "Failed to enable messaging on phone number",
		};
	}
}

export type { CompanyTelnyxSettingsRow };
