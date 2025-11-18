/**
 * Messaging Profile Fetcher
 *
 * Fetches messaging profiles from Telnyx API to help with configuration.
 */

import { telnyxClient } from "./client";

export type MessagingProfile = {
	id: string;
	name: string;
	enabled: boolean;
	webhook_url: string | null;
	webhook_failover_url: string | null;
	webhook_api_version: string | null;
};

export type ListMessagingProfilesResult = {
	success: boolean;
	profiles?: MessagingProfile[];
	error?: string;
};

/**
 * List all messaging profiles from Telnyx
 */
export async function listMessagingProfiles(): Promise<ListMessagingProfilesResult> {
	try {
		const response = await telnyxClient.messagingProfiles.list();
		const profiles = (response.data || []) as any[];

		const formattedProfiles: MessagingProfile[] = profiles.map((profile) => ({
			id: profile.id,
			name: profile.name || "Unnamed Profile",
			enabled: profile.enabled !== false,
			webhook_url: profile.webhook_url || null,
			webhook_failover_url: profile.webhook_failover_url || null,
			webhook_api_version: profile.webhook_api_version || null,
		}));

		return {
			success: true,
			profiles: formattedProfiles,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error?.message || "Failed to list messaging profiles",
		};
	}
}

/**
 * Get the default messaging profile (first enabled profile, or first profile if none enabled)
 */
export async function getDefaultMessagingProfile(): Promise<{
	success: boolean;
	profile?: MessagingProfile;
	error?: string;
	recommendation?: string;
}> {
	const result = await listMessagingProfiles();

	if (!result.success || !result.profiles) {
		return {
			success: false,
			error: result.error || "Failed to fetch messaging profiles",
		};
	}

	if (result.profiles.length === 0) {
		return {
			success: false,
			error: "No messaging profiles found in Telnyx account",
			recommendation:
				"Create a messaging profile in Telnyx Portal → Messaging → Profiles",
		};
	}

	// Prefer enabled profiles
	const enabledProfiles = result.profiles.filter((p) => p.enabled);
	const selectedProfile =
		enabledProfiles.length > 0 ? enabledProfiles[0] : result.profiles[0];

	let recommendation: string | undefined;
	if (result.profiles.length > 1) {
		recommendation = `Found ${result.profiles.length} messaging profiles. Using "${selectedProfile.name}" (ID: ${selectedProfile.id}). To use a different profile, set TELNYX_DEFAULT_MESSAGING_PROFILE_ID to the desired profile ID.`;
	}

	return {
		success: true,
		profile: selectedProfile,
		recommendation,
	};
}

/**
 * Get messaging profile by ID
 */
export async function getMessagingProfileById(profileId: string): Promise<{
	success: boolean;
	profile?: MessagingProfile;
	error?: string;
}> {
	try {
		const response = await telnyxClient.messagingProfiles.retrieve(profileId);
		const profileData = response.data as any;

		if (!profileData) {
			return {
				success: false,
				error: `Messaging profile ${profileId} not found`,
			};
		}

		const profile: MessagingProfile = {
			id: profileData.id,
			name: profileData.name || "Unnamed Profile",
			enabled: profileData.enabled !== false,
			webhook_url: profileData.webhook_url || null,
			webhook_failover_url: profileData.webhook_failover_url || null,
			webhook_api_version: profileData.webhook_api_version || null,
		};

		return {
			success: true,
			profile,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error?.message || "Failed to retrieve messaging profile",
		};
	}
}
