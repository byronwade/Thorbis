/**
 * Production Readiness Checks
 *
 * Validates that Telnyx is properly configured for production use.
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { validateTelnyxConfig } from "./config-validator";
import { verifyConnection } from "./connection-setup";
import { verifyMessagingProfile } from "./messaging-profile-setup";
import { checkWebhookHealth } from "./webhook-health";

export type ProductionReadinessStatus = {
	ready: boolean;
	envVars: {
		valid: boolean;
		errors: string[];
		warnings: string[];
	};
	connection: {
		configured: boolean;
		verified: boolean;
		issues: string[];
	};
	messagingProfile: {
		configured: boolean;
		verified: boolean;
		issues: string[];
	};
	phoneNumbers: {
		configured: boolean;
		count: number;
		issues: string[];
	};
	webhooks: {
		healthy: boolean;
		issues: string[];
		warnings: string[];
	};
	overall: {
		ready: boolean;
		summary: string;
		recommendations: string[];
	};
};

/**
 * Check production readiness
 */
export async function checkProductionReadiness(): Promise<ProductionReadinessStatus> {
	const status: ProductionReadinessStatus = {
		ready: false,
		envVars: {
			valid: false,
			errors: [],
			warnings: [],
		},
		connection: {
			configured: false,
			verified: false,
			issues: [],
		},
		messagingProfile: {
			configured: false,
			verified: false,
			issues: [],
		},
		phoneNumbers: {
			configured: false,
			count: 0,
			issues: [],
		},
		webhooks: {
			healthy: false,
			issues: [],
			warnings: [],
		},
		overall: {
			ready: false,
			summary: "",
			recommendations: [],
		},
	};

	// Check environment variables
	const envValidation = validateTelnyxConfig();
	status.envVars.valid = envValidation.valid;
	status.envVars.errors = envValidation.errors;
	status.envVars.warnings = envValidation.warnings;

	// Check connection
	if (envValidation.config.connectionId) {
		status.connection.configured = true;
		try {
			const connectionStatus = await verifyConnection();
			status.connection.verified = !connectionStatus.needsFix;
			status.connection.issues = connectionStatus.issues;
		} catch (error) {
			status.connection.issues.push(
				error instanceof Error ? error.message : "Failed to verify connection",
			);
		}
	} else {
		status.connection.issues.push("Connection ID is not configured");
	}

	// Check messaging profile
	if (envValidation.config.messagingProfileId) {
		status.messagingProfile.configured = true;
		try {
			const profileStatus = await verifyMessagingProfile();
			status.messagingProfile.verified = !profileStatus.needsFix;
			status.messagingProfile.issues = profileStatus.issues;
		} catch (error) {
			status.messagingProfile.issues.push(
				error instanceof Error
					? error.message
					: "Failed to verify messaging profile",
			);
		}
	} else {
		status.messagingProfile.issues.push("Messaging profile ID is not configured");
	}

	// Check phone numbers
	try {
		const supabase = await createServiceSupabaseClient();
		const { data: phoneNumbers, error } = await supabase
			.from("phone_numbers")
			.select("id")
			.is("deleted_at", null)
			.in("status", ["active", "pending"]);

		if (error) {
			status.phoneNumbers.issues.push(
				`Failed to query phone numbers: ${error.message}`,
			);
		} else {
			status.phoneNumbers.count = phoneNumbers?.length || 0;
			status.phoneNumbers.configured = (phoneNumbers?.length || 0) > 0;

			if (status.phoneNumbers.count === 0) {
				status.phoneNumbers.issues.push(
					"No phone numbers are configured. Purchase at least one phone number from Telnyx.",
				);
			}
		}
	} catch (error) {
		status.phoneNumbers.issues.push(
			error instanceof Error ? error.message : "Failed to check phone numbers",
		);
	}

	// Check webhook health
	try {
		const webhookStatus = await checkWebhookHealth();
		status.webhooks.healthy =
			webhookStatus.urlAccessible &&
			webhookStatus.signatureVerificationWorks &&
			webhookStatus.timestampValidationWorks &&
			webhookStatus.issues.length === 0;
		status.webhooks.issues = webhookStatus.issues;
		status.webhooks.warnings = webhookStatus.warnings;
	} catch (error) {
		status.webhooks.issues.push(
			error instanceof Error ? error.message : "Failed to check webhook health",
		);
	}

	// Determine overall readiness
	const allChecksPass =
		status.envVars.valid &&
		status.connection.configured &&
		status.connection.verified &&
		status.messagingProfile.configured &&
		status.messagingProfile.verified &&
		status.phoneNumbers.configured &&
		status.phoneNumbers.count > 0 &&
		status.webhooks.healthy;

	status.ready = allChecksPass;

	// Build recommendations
	const recommendations: string[] = [];

	if (!status.envVars.valid) {
		recommendations.push(
			"Fix environment variable configuration errors (see envVars.errors)",
		);
	}

	if (!status.connection.configured || !status.connection.verified) {
		recommendations.push(
			"Configure and verify connection ID in Telnyx Portal → Mission Control → Connections",
		);
	}

	if (!status.messagingProfile.configured || !status.messagingProfile.verified) {
		recommendations.push(
			"Configure and verify messaging profile in Telnyx Portal → Messaging → Profiles",
		);
	}

	if (!status.phoneNumbers.configured || status.phoneNumbers.count === 0) {
		recommendations.push(
			"Purchase at least one phone number with SMS and voice capabilities",
		);
	}

	if (!status.webhooks.healthy) {
		recommendations.push(
			"Fix webhook configuration issues (see webhooks.issues)",
		);
	}

	status.overall.recommendations = recommendations;
	status.overall.ready = allChecksPass;
	status.overall.summary = allChecksPass
		? "Production ready - All checks passed"
		: `Not production ready - ${recommendations.length} issue(s) need attention`;

	return status;
}

/**
 * Get production readiness summary for display
 */
export function getProductionReadinessSummary(
	status: ProductionReadinessStatus,
): string {
	const lines: string[] = [];

	lines.push("=== Telnyx Production Readiness Check ===");
	lines.push("");

	if (status.ready) {
		lines.push("✅ PRODUCTION READY");
		lines.push("");
		lines.push("All systems are properly configured:");
		lines.push(`- Environment variables: ✅ Valid`);
		lines.push(
			`- Connection: ✅ Configured and verified (${status.connection.verified ? "active" : "inactive"})`,
		);
		lines.push(
			`- Messaging Profile: ✅ Configured and verified (${status.messagingProfile.verified ? "active" : "inactive"})`,
		);
		lines.push(`- Phone Numbers: ✅ ${status.phoneNumbers.count} configured`);
		lines.push(
			`- Webhooks: ✅ Healthy (accessible, signature verification working)`,
		);
	} else {
		lines.push("❌ NOT PRODUCTION READY");
		lines.push("");
		lines.push("Issues found:");

		if (!status.envVars.valid) {
			lines.push("");
			lines.push("Environment Variables:");
			status.envVars.errors.forEach((error) => {
				lines.push(`  ❌ ${error}`);
			});
			status.envVars.warnings.forEach((warning) => {
				lines.push(`  ⚠️  ${warning}`);
			});
		}

		if (!status.connection.configured || !status.connection.verified) {
			lines.push("");
			lines.push("Connection:");
			status.connection.issues.forEach((issue) => {
				lines.push(`  ❌ ${issue}`);
			});
		}

		if (
			!status.messagingProfile.configured ||
			!status.messagingProfile.verified
		) {
			lines.push("");
			lines.push("Messaging Profile:");
			status.messagingProfile.issues.forEach((issue) => {
				lines.push(`  ❌ ${issue}`);
			});
		}

		if (!status.phoneNumbers.configured || status.phoneNumbers.count === 0) {
			lines.push("");
			lines.push("Phone Numbers:");
			status.phoneNumbers.issues.forEach((issue) => {
				lines.push(`  ❌ ${issue}`);
			});
		}

		if (!status.webhooks.healthy) {
			lines.push("");
			lines.push("Webhooks:");
			status.webhooks.issues.forEach((issue) => {
				lines.push(`  ❌ ${issue}`);
			});
			status.webhooks.warnings.forEach((warning) => {
				lines.push(`  ⚠️  ${warning}`);
			});
		}

		lines.push("");
		lines.push("Recommendations:");
		status.overall.recommendations.forEach((rec, index) => {
			lines.push(`  ${index + 1}. ${rec}`);
		});
	}

	return lines.join("\n");
}

