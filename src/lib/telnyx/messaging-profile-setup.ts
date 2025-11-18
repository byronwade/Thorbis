/**
 * Messaging Profile Setup & Verification
 *
 * Verifies messaging profile configuration and can auto-update webhook URLs.
 */

import { TELNYX_CONFIG, telnyxClient } from "./client";

export type MessagingProfileStatus = {
	exists: boolean;
	isActive: boolean;
	hasWebhookUrl: boolean;
	webhookUrl: string | null;
	webhookFailoverUrl: string | null;
	webhookApiVersion: string | null;
	needsFix: boolean;
	issues: string[];
};

export type MessagingProfileFixResult = {
	success: boolean;
	fixed: boolean;
	error?: string;
	changes: string[];
};

function getWebhookUrl(): string | undefined {
	const candidates = [
		process.env.NEXT_PUBLIC_SITE_URL,
		process.env.SITE_URL,
		process.env.NEXT_PUBLIC_APP_URL,
		process.env.APP_URL,
	];
	for (const candidate of candidates) {
		if (candidate && candidate.trim()) {
			const trimmed = candidate.trim();
			const isLocal =
				trimmed.includes("localhost") ||
				trimmed.includes("127.0.0.1") ||
				trimmed.includes("0.0.0.0");
			if (!isLocal) {
				const normalized = trimmed.startsWith("http")
					? trimmed
					: `https://${trimmed}`;
				return `${normalized.replace(/\/+$/, "")}/api/webhooks/telnyx`;
			}
		}
	}
	return undefined;
}

/**
 * Verify messaging profile configuration
 */
export async function verifyMessagingProfile(
	messagingProfileId?: string,
): Promise<MessagingProfileStatus> {
	const profileId = messagingProfileId || TELNYX_CONFIG.messagingProfileId;

	const status: MessagingProfileStatus = {
		exists: false,
		isActive: false,
		hasWebhookUrl: false,
		webhookUrl: null,
		webhookFailoverUrl: null,
		webhookApiVersion: null,
		needsFix: false,
		issues: [],
	};

	if (!profileId || profileId.trim() === "") {
		status.issues.push("Messaging profile ID is not configured");
		status.needsFix = true;
		return status;
	}

	try {
		const profile = await telnyxClient.messagingProfiles.retrieve(profileId);
		const profileData = profile.data as any;

		if (!profileData) {
			status.issues.push(
				`Messaging profile ${profileId} not found in Telnyx`,
			);
			status.needsFix = true;
			return status;
		}

		status.exists = true;
		status.isActive = profileData.enabled !== false;
		status.webhookUrl = profileData.webhook_url || null;
		status.webhookFailoverUrl = profileData.webhook_failover_url || null;
		status.webhookApiVersion = profileData.webhook_api_version || null;

		// Check webhook URL
		const expectedWebhookUrl = getWebhookUrl();
		if (!expectedWebhookUrl) {
			status.issues.push(
				"NEXT_PUBLIC_SITE_URL is not set to a valid production URL",
			);
			status.needsFix = true;
		} else if (!status.webhookUrl || status.webhookUrl !== expectedWebhookUrl) {
			status.issues.push(
				`Webhook URL is not set correctly. Expected: ${expectedWebhookUrl}, Current: ${status.webhookUrl || "none"}`,
			);
			status.needsFix = true;
		} else {
			status.hasWebhookUrl = true;
		}

		// Check webhook API version
		if (status.webhookApiVersion !== "2") {
			status.issues.push(
				`Webhook API version should be "2", but is "${status.webhookApiVersion || "not set"}"`,
			);
			status.needsFix = true;
		}

		// Check if profile is active
		if (!status.isActive) {
			status.issues.push("Messaging profile is not enabled");
			status.needsFix = true;
		}

		return status;
	} catch (error: any) {
		if (error?.statusCode === 404) {
			status.issues.push(
				`Messaging profile ${profileId} not found in Telnyx`,
			);
		} else {
			status.issues.push(
				error?.message || "Failed to retrieve messaging profile",
			);
		}
		status.needsFix = true;
		return status;
	}
}

/**
 * Auto-fix messaging profile configuration
 */
export async function fixMessagingProfile(
	messagingProfileId?: string,
	options?: {
		webhookUrl?: string;
		webhookFailoverUrl?: string;
	},
): Promise<MessagingProfileFixResult> {
	const profileId = messagingProfileId || TELNYX_CONFIG.messagingProfileId;
	const changes: string[] = [];

	if (!profileId || profileId.trim() === "") {
		return {
			success: false,
			fixed: false,
			error: "Messaging profile ID is not configured",
			changes: [],
		};
	}

	try {
		// Get current status
		const status = await verifyMessagingProfile(profileId);
		if (!status.needsFix) {
			return {
				success: true,
				fixed: false,
				changes: [],
			};
		}

		// Get expected webhook URL
		const expectedWebhookUrl =
			options?.webhookUrl || getWebhookUrl();
		if (!expectedWebhookUrl) {
			return {
				success: false,
				fixed: false,
				error:
					"NEXT_PUBLIC_SITE_URL must be set to a valid production URL to configure webhooks",
				changes: [],
			};
		}

		// Prepare update
		const updateData: Record<string, unknown> = {};

		// Fix webhook URL
		if (status.webhookUrl !== expectedWebhookUrl) {
			updateData.webhook_url = expectedWebhookUrl;
			changes.push(
				`Updated webhook URL to ${expectedWebhookUrl}`,
			);
		}

		// Fix webhook failover URL
		const expectedFailoverUrl = options?.webhookFailoverUrl ||
			process.env.TELNYX_WEBHOOK_FAILOVER_URL ||
			null;
		if (status.webhookFailoverUrl !== expectedFailoverUrl) {
			updateData.webhook_failover_url = expectedFailoverUrl;
			if (expectedFailoverUrl) {
				changes.push(
					`Updated webhook failover URL to ${expectedFailoverUrl}`,
				);
			} else {
				changes.push("Removed webhook failover URL");
			}
		}

		// Fix webhook API version
		if (status.webhookApiVersion !== "2") {
			updateData.webhook_api_version = "2";
			changes.push("Updated webhook API version to 2");
		}

		// Fix profile enabled status
		if (!status.isActive) {
			updateData.enabled = true;
			changes.push("Enabled messaging profile");
		}

		// Apply updates if needed
		if (Object.keys(updateData).length > 0) {
			await telnyxClient.messagingProfiles.update(profileId, updateData);
		}

		return {
			success: true,
			fixed: changes.length > 0,
			changes,
		};
	} catch (error: any) {
		return {
			success: false,
			fixed: false,
			error: error?.message || "Failed to update messaging profile",
			changes,
		};
	}
}

/**
 * Get messaging profile details
 */
export async function getMessagingProfileDetails(
	messagingProfileId?: string,
): Promise<{
	success: boolean;
	data?: any;
	error?: string;
}> {
	const profileId = messagingProfileId || TELNYX_CONFIG.messagingProfileId;

	if (!profileId || profileId.trim() === "") {
		return {
			success: false,
			error: "Messaging profile ID is not configured",
		};
	}

	try {
		const profile = await telnyxClient.messagingProfiles.retrieve(profileId);
		return {
			success: true,
			data: profile.data,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error?.message || "Failed to retrieve messaging profile",
		};
	}
}

