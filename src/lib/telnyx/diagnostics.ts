/**
 * Telnyx Diagnostics
 *
 * Comprehensive diagnostic tool for testing SMS and call functionality.
 */

import { validateCallConfig, validateSmsConfig } from "./config-validator";
import { verifyConnection } from "./connection-setup";
import { getDefaultMessagingProfile } from "./messaging-profile-fetcher";
import { verifyMessagingProfile } from "./messaging-profile-setup";
import {
	verifyPhoneNumber,
	verifySmsCapability,
	verifyVoiceCapability,
} from "./phone-number-setup";
import { checkWebhookHealth } from "./webhook-health";

export type DiagnosticResult = {
	success: boolean;
	component: string;
	message: string;
	details?: Record<string, unknown>;
	recommendations?: string[];
};

export type DiagnosticsReport = {
	timestamp: string;
	overall: {
		healthy: boolean;
		summary: string;
	};
	components: DiagnosticResult[];
	recommendations: string[];
};

/**
 * Run SMS diagnostics
 */
export async function diagnoseSms(
	phoneNumber?: string,
): Promise<DiagnosticsReport> {
	const components: DiagnosticResult[] = [];
	const recommendations: string[] = [];

	// Check SMS configuration
	const smsConfig = await validateSmsConfig();
	if (!smsConfig.valid) {
		const recs = [
			"Set TELNYX_API_KEY",
			"Set NEXT_PUBLIC_SITE_URL to a valid production URL",
		];

		// If we found a messaging profile, suggest it
		if (smsConfig.suggestedProfileId) {
			recs.push(
				`Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID=${smsConfig.suggestedProfileId} (found in your Telnyx account)`,
			);
		} else {
			recs.push(
				"Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID or run getDefaultMessagingProfile() to fetch it",
			);
		}

		components.push({
			success: false,
			component: "SMS Configuration",
			message: smsConfig.error || "SMS configuration is invalid",
			recommendations: recs,
		});
		recommendations.push(
			...(components[components.length - 1].recommendations || []),
		);
	} else {
		components.push({
			success: true,
			component: "SMS Configuration",
			message: "SMS configuration is valid",
		});
	}

	// Check messaging profile
	const messagingProfileStatus = await verifyMessagingProfile();
	if (messagingProfileStatus.needsFix) {
		// If profile doesn't exist, try to fetch available profiles
		const profileRecommendations = [
			"Run fixMessagingProfile() to auto-fix webhook URLs",
			"Verify messaging profile is enabled in Telnyx Portal",
		];

		if (!messagingProfileStatus.exists) {
			try {
				const profileResult = await getDefaultMessagingProfile();
				if (profileResult.success && profileResult.profile) {
					profileRecommendations.unshift(
						`Set TELNYX_DEFAULT_MESSAGING_PROFILE_ID=${profileResult.profile.id} (found "${profileResult.profile.name}" in your Telnyx account)`,
					);
				}
			} catch {
				// Ignore fetch errors
			}
		}

		components.push({
			success: false,
			component: "Messaging Profile",
			message: "Messaging profile has configuration issues",
			details: {
				issues: messagingProfileStatus.issues,
				hasWebhookUrl: messagingProfileStatus.hasWebhookUrl,
				isActive: messagingProfileStatus.isActive,
			},
			recommendations: profileRecommendations,
		});
		recommendations.push(
			...(components[components.length - 1].recommendations || []),
		);
	} else {
		components.push({
			success: true,
			component: "Messaging Profile",
			message: "Messaging profile is properly configured",
		});
	}

	// Check phone number if provided
	if (phoneNumber) {
		const smsCapability = await verifySmsCapability(phoneNumber);
		if (!smsCapability.hasSms) {
			components.push({
				success: false,
				component: "Phone Number SMS Capability",
				message: smsCapability.error || "Phone number does not support SMS",
				details: {
					phoneNumber,
				},
				recommendations: [
					"Verify phone number is purchased with SMS capability",
					"Ensure phone number is associated with a messaging profile",
					"Check phone number status in Telnyx Portal",
				],
			});
			recommendations.push(
				...(components[components.length - 1].recommendations || []),
			);
		} else {
			components.push({
				success: true,
				component: "Phone Number SMS Capability",
				message: `Phone number ${phoneNumber} supports SMS`,
				details: {
					phoneNumber,
				},
			});
		}
	}

	// Check webhook health
	const webhookStatus = await checkWebhookHealth();
	if (!webhookStatus.urlAccessible || webhookStatus.issues.length > 0) {
		components.push({
			success: false,
			component: "Webhook Health",
			message: "Webhook configuration has issues",
			details: {
				urlAccessible: webhookStatus.urlAccessible,
				signatureVerificationWorks: webhookStatus.signatureVerificationWorks,
				issues: webhookStatus.issues,
			},
			recommendations: [
				"Ensure webhook URL is publicly accessible",
				"Configure TELNYX_PUBLIC_KEY and TELNYX_WEBHOOK_SECRET",
			],
		});
		recommendations.push(
			...(components[components.length - 1].recommendations || []),
		);
	} else {
		components.push({
			success: true,
			component: "Webhook Health",
			message: "Webhooks are healthy",
		});
	}

	const allHealthy = components.every((c) => c.success);
	const summary = allHealthy
		? "SMS diagnostics passed - System is ready for SMS"
		: `SMS diagnostics failed - ${components.filter((c) => !c.success).length} issue(s) found`;

	return {
		timestamp: new Date().toISOString(),
		overall: {
			healthy: allHealthy,
			summary,
		},
		components,
		recommendations: [...new Set(recommendations)],
	};
}

/**
 * Run call diagnostics
 */
export async function diagnoseCalls(
	phoneNumber?: string,
): Promise<DiagnosticsReport> {
	const components: DiagnosticResult[] = [];
	const recommendations: string[] = [];

	// Check call configuration
	const callConfig = validateCallConfig();
	if (!callConfig.valid) {
		components.push({
			success: false,
			component: "Call Configuration",
			message: callConfig.error || "Call configuration is invalid",
			recommendations: [
				"Set TELNYX_API_KEY",
				"Set NEXT_PUBLIC_TELNYX_CONNECTION_ID",
				"Set NEXT_PUBLIC_SITE_URL to a valid production URL",
			],
		});
		recommendations.push(
			...(components[components.length - 1].recommendations || []),
		);
	} else {
		components.push({
			success: true,
			component: "Call Configuration",
			message: "Call configuration is valid",
		});
	}

	// Check connection
	const connectionStatus = await verifyConnection();
	if (connectionStatus.needsFix) {
		components.push({
			success: false,
			component: "Connection",
			message: "Connection has configuration issues",
			details: {
				issues: connectionStatus.issues,
				hasWebhookUrl: connectionStatus.hasWebhookUrl,
				isActive: connectionStatus.isActive,
			},
			recommendations: [
				"Run fixConnection() to auto-fix webhook URLs",
				"Verify connection is active in Telnyx Portal",
			],
		});
		recommendations.push(
			...(components[components.length - 1].recommendations || []),
		);
	} else {
		components.push({
			success: true,
			component: "Connection",
			message: "Connection is properly configured",
		});
	}

	// Check phone number if provided
	if (phoneNumber) {
		const voiceCapability = await verifyVoiceCapability(phoneNumber);
		if (!voiceCapability.hasVoice) {
			components.push({
				success: false,
				component: "Phone Number Voice Capability",
				message: voiceCapability.error || "Phone number does not support voice",
				details: {
					phoneNumber,
				},
				recommendations: [
					"Verify phone number is purchased with voice capability",
					"Ensure phone number is associated with a connection",
					"Check phone number status in Telnyx Portal",
				],
			});
			recommendations.push(
				...(components[components.length - 1].recommendations || []),
			);
		} else {
			components.push({
				success: true,
				component: "Phone Number Voice Capability",
				message: `Phone number ${phoneNumber} supports voice`,
				details: {
					phoneNumber,
				},
			});
		}
	}

	// Check webhook health
	const webhookStatus = await checkWebhookHealth();
	if (!webhookStatus.urlAccessible || webhookStatus.issues.length > 0) {
		components.push({
			success: false,
			component: "Webhook Health",
			message: "Webhook configuration has issues",
			details: {
				urlAccessible: webhookStatus.urlAccessible,
				signatureVerificationWorks: webhookStatus.signatureVerificationWorks,
				issues: webhookStatus.issues,
			},
			recommendations: [
				"Ensure webhook URL is publicly accessible",
				"Configure TELNYX_PUBLIC_KEY and TELNYX_WEBHOOK_SECRET",
			],
		});
		recommendations.push(
			...(components[components.length - 1].recommendations || []),
		);
	} else {
		components.push({
			success: true,
			component: "Webhook Health",
			message: "Webhooks are healthy",
		});
	}

	const allHealthy = components.every((c) => c.success);
	const summary = allHealthy
		? "Call diagnostics passed - System is ready for calls"
		: `Call diagnostics failed - ${components.filter((c) => !c.success).length} issue(s) found`;

	return {
		timestamp: new Date().toISOString(),
		overall: {
			healthy: allHealthy,
			summary,
		},
		components,
		recommendations: [...new Set(recommendations)],
	};
}

/**
 * Run full diagnostics (SMS + Calls)
 */
export async function runFullDiagnostics(phoneNumber?: string): Promise<{
	sms: DiagnosticsReport;
	calls: DiagnosticsReport;
	overall: {
		healthy: boolean;
		summary: string;
	};
}> {
	const [smsReport, callsReport] = await Promise.all([
		diagnoseSms(phoneNumber),
		diagnoseCalls(phoneNumber),
	]);

	const overallHealthy =
		smsReport.overall.healthy && callsReport.overall.healthy;
	const summary = overallHealthy
		? "All diagnostics passed - System is production ready"
		: "Some diagnostics failed - Review individual reports";

	return {
		sms: smsReport,
		calls: callsReport,
		overall: {
			healthy: overallHealthy,
			summary,
		},
	};
}
