/**
 * Telnyx Configuration Validator
 *
 * Validates all required Telnyx environment variables and configuration.
 * Provides clear error messages for missing or invalid configuration.
 */

import { TELNYX_CONFIG } from "./client";

export type ValidationResult = {
	valid: boolean;
	errors: string[];
	warnings: string[];
	config: {
		apiKey: boolean;
		connectionId: boolean;
		messagingProfileId: boolean;
		webhookSecret: boolean;
		publicKey: boolean;
		siteUrl: boolean;
	};
};

function isLocalUrl(url: string): boolean {
	const lowered = url.toLowerCase();
	return (
		lowered.includes("localhost") ||
		lowered.includes("127.0.0.1") ||
		lowered.includes("0.0.0.0") ||
		lowered.endsWith(".local") ||
		lowered.includes("://local")
	);
}

function getBaseAppUrl(): string | undefined {
	const candidates = [
		process.env.NEXT_PUBLIC_SITE_URL,
		process.env.SITE_URL,
		process.env.NEXT_PUBLIC_APP_URL,
		process.env.APP_URL,
	];
	for (const candidate of candidates) {
		if (candidate && candidate.trim()) {
			const trimmed = candidate.trim();
			if (!isLocalUrl(trimmed)) {
				return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
			}
		}
	}

	const vercelUrl = process.env.VERCEL_URL;
	if (vercelUrl && !isLocalUrl(vercelUrl)) {
		return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
	}

	return undefined;
}

/**
 * Validate all Telnyx configuration
 */
export function validateTelnyxConfig(): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];
	const config = {
		apiKey: false,
		connectionId: false,
		messagingProfileId: false,
		webhookSecret: false,
		publicKey: false,
		siteUrl: false,
	};

	// Check API Key (required)
	if (!TELNYX_CONFIG.apiKey || TELNYX_CONFIG.apiKey.trim() === "") {
		errors.push(
			"TELNYX_API_KEY is not set. This is required for all Telnyx operations.",
		);
	} else if (TELNYX_CONFIG.apiKey.length < 20) {
		errors.push(
			"TELNYX_API_KEY appears to be invalid (too short). Get your API key from https://portal.telnyx.com",
		);
	} else {
		config.apiKey = true;
	}

	// Check Connection ID (required for voice calls)
	if (!TELNYX_CONFIG.connectionId || TELNYX_CONFIG.connectionId.trim() === "") {
		errors.push(
			"NEXT_PUBLIC_TELNYX_CONNECTION_ID is not set. This is required for phone calls. Get it from Telnyx Portal → Mission Control → Connections.",
		);
	} else {
		config.connectionId = true;
	}

	// Check Messaging Profile ID (required for SMS)
	if (
		!TELNYX_CONFIG.messagingProfileId ||
		TELNYX_CONFIG.messagingProfileId.trim() === ""
	) {
		errors.push(
			"TELNYX_DEFAULT_MESSAGING_PROFILE_ID or NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID is not set. This is required for SMS/MMS. Run getDefaultMessagingProfile() to fetch it automatically from Telnyx.",
		);
	} else {
		config.messagingProfileId = true;
	}

	// Check Webhook Secret (recommended for production)
	if (
		!TELNYX_CONFIG.webhookSecret ||
		TELNYX_CONFIG.webhookSecret.trim() === ""
	) {
		warnings.push(
			"TELNYX_WEBHOOK_SECRET is not set. Webhook signature verification will be disabled. Set this in production for security.",
		);
	} else {
		config.webhookSecret = true;
	}

	// Check Public Key (recommended for production)
	if (!TELNYX_CONFIG.publicKey || TELNYX_CONFIG.publicKey.trim() === "") {
		warnings.push(
			"TELNYX_PUBLIC_KEY is not set. Webhook signature verification may not work correctly. Get it from Telnyx Portal → API Keys.",
		);
	} else {
		config.publicKey = true;
	}

	// Check Site URL (required for webhooks)
	const siteUrl = getBaseAppUrl();
	if (!siteUrl) {
		errors.push(
			"NEXT_PUBLIC_SITE_URL or SITE_URL is not set to a valid production URL. This is required for webhook callbacks. Set it to your production domain (e.g., https://thorbis.co).",
		);
	} else if (isLocalUrl(siteUrl)) {
		const isProduction =
			process.env.VERCEL_ENV === "production" ||
			process.env.DEPLOYMENT_ENV === "production";
		if (isProduction) {
			errors.push(
				`Site URL is set to localhost (${siteUrl}) but you're in production. Set NEXT_PUBLIC_SITE_URL to your production domain.`,
			);
		} else {
			warnings.push(
				`Site URL is set to localhost (${siteUrl}). This will not work in production.`,
			);
		}
	} else {
		config.siteUrl = true;
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		config,
	};
}

/**
 * Validate configuration for SMS operations
 */
export async function validateSmsConfig(): Promise<{
	valid: boolean;
	error?: string;
	suggestedProfileId?: string;
}> {
	const validation = validateTelnyxConfig();

	if (!validation.config.apiKey) {
		return {
			valid: false,
			error: "TELNYX_API_KEY is required for SMS operations",
		};
	}

	if (!validation.config.messagingProfileId) {
		// Try to fetch messaging profile automatically
		try {
			const { getDefaultMessagingProfile } = await import(
				"./messaging-profile-fetcher"
			);
			const profileResult = await getDefaultMessagingProfile();

			if (profileResult.success && profileResult.profile) {
				return {
					valid: false,
					error:
						"TELNYX_DEFAULT_MESSAGING_PROFILE_ID is required for SMS operations.",
					suggestedProfileId: profileResult.profile.id,
				};
			}
		} catch {
			// If fetch fails, return generic error
		}

		return {
			valid: false,
			error:
				"TELNYX_DEFAULT_MESSAGING_PROFILE_ID is required for SMS operations. Run getDefaultMessagingProfile() to fetch it automatically from Telnyx.",
		};
	}

	if (!validation.config.siteUrl) {
		return {
			valid: false,
			error:
				"NEXT_PUBLIC_SITE_URL must be set to a valid production URL for SMS webhooks.",
		};
	}

	return { valid: true };
}

/**
 * Validate configuration for voice call operations
 */
export function validateCallConfig(): {
	valid: boolean;
	error?: string;
} {
	const validation = validateTelnyxConfig();

	if (!validation.config.apiKey) {
		return {
			valid: false,
			error: "TELNYX_API_KEY is required for phone calls",
		};
	}

	if (!validation.config.connectionId) {
		return {
			valid: false,
			error:
				"NEXT_PUBLIC_TELNYX_CONNECTION_ID is required for phone calls. Get it from Telnyx Portal → Mission Control → Connections.",
		};
	}

	if (!validation.config.siteUrl) {
		return {
			valid: false,
			error:
				"NEXT_PUBLIC_SITE_URL must be set to a valid production URL for call webhooks.",
		};
	}

	return { valid: true };
}

/**
 * Get formatted error message for display to users
 */
export function getFormattedErrorMessage(validation: ValidationResult): string {
	if (validation.valid) {
		return "";
	}

	const lines = ["Telnyx configuration errors:"];
	validation.errors.forEach((error, index) => {
		lines.push(`${index + 1}. ${error}`);
	});

	if (validation.warnings.length > 0) {
		lines.push("");
		lines.push("Warnings:");
		validation.warnings.forEach((warning, index) => {
			lines.push(`${index + 1}. ${warning}`);
		});
	}

	return lines.join("\n");
}
