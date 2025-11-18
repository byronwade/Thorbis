/**
 * Telnyx Setup Helper Actions
 *
 * Server actions to help with Telnyx configuration setup.
 */

"use server";

import {
	getDefaultMessagingProfile,
	listMessagingProfiles,
} from "@/lib/telnyx/messaging-profile-fetcher";

/**
 * Get available messaging profiles from Telnyx
 *
 * This action fetches all messaging profiles from your Telnyx account
 * to help you configure TELNYX_DEFAULT_MESSAGING_PROFILE_ID
 */
export async function getAvailableMessagingProfiles() {
	try {
		const result = await listMessagingProfiles();

		if (!result.success) {
			return {
				success: false,
				error: result.error || "Failed to fetch messaging profiles",
			};
		}

		return {
			success: true,
			profiles: result.profiles || [],
			recommendation:
				result.profiles && result.profiles.length > 0
					? `Found ${result.profiles.length} messaging profile(s). Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID to one of these IDs.`
					: "No messaging profiles found. Create one in Telnyx Portal → Messaging → Profiles.",
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch messaging profiles",
		};
	}
}

/**
 * Get the recommended default messaging profile
 *
 * Returns the first enabled profile, or first profile if none are enabled.
 * Use this to automatically configure TELNYX_DEFAULT_MESSAGING_PROFILE_ID
 */
export async function getRecommendedMessagingProfile() {
	try {
		const result = await getDefaultMessagingProfile();

		if (!result.success) {
			return {
				success: false,
				error: result.error || "Failed to get default messaging profile",
				recommendation: result.recommendation,
			};
		}

		return {
			success: true,
			profile: result.profile,
			recommendation:
				result.recommendation ||
				`Use this profile ID: ${result.profile?.id}. Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID=${result.profile?.id}`,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to get default messaging profile",
		};
	}
}
