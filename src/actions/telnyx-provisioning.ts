"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
	ensureCompanyTelnyxSetup,
	purchaseAdditionalNumbers,
	type CompanyTelnyxSettingsRow,
	fetchCompanyTelnyxSettings,
} from "@/lib/telnyx/provision-company";
import { fixMessagingProfile } from "@/lib/telnyx/messaging-profile-setup";
import { telnyxClient } from "@/lib/telnyx/client";

export async function provisionCompanyTelnyx(companyId: string) {
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

export async function purchaseCompanyPhoneNumbers(
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
		if (!settings || !settings.messaging_profile_id || !settings.call_control_application_id) {
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
			}
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
				settings.call_control_application_id
			);
			const currentWebhook = (callApp.data as any)?.webhook_event_url;

			if (currentWebhook !== CORRECT_WEBHOOK_URL) {
				await telnyxClient.callControlApplications.update(
					settings.call_control_application_id,
					{
						webhook_event_url: CORRECT_WEBHOOK_URL,
						webhook_api_version: "2",
					}
				);
				changes.push(`Updated call control webhook URL to ${CORRECT_WEBHOOK_URL}`);
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

export type { CompanyTelnyxSettingsRow };
