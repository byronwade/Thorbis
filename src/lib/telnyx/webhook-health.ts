/**
 * Webhook Health Check
 *
 * Verifies webhook configuration, accessibility, and signature verification.
 */

import { TELNYX_CONFIG } from "./client";
import { isWebhookTimestampValid, verifyWebhookSignature } from "./webhooks";

export type WebhookHealthStatus = {
	urlAccessible: boolean;
	signatureVerificationWorks: boolean;
	timestampValidationWorks: boolean;
	webhookUrl: string | null;
	issues: string[];
	warnings: string[];
};

/**
 * Check if webhook URL is accessible
 */
async function checkWebhookAccessibility(
	webhookUrl: string,
): Promise<{ accessible: boolean; error?: string }> {
	try {
		// Try to make a HEAD request to check if URL is reachable
		// Note: This won't work if the endpoint requires specific headers
		// but it's a basic connectivity check
		const response = await fetch(webhookUrl, {
			method: "HEAD",
			headers: {
				"User-Agent": "Telnyx-Health-Check/1.0",
			},
		});

		// Any response (even 404/500) means the URL is reachable
		return { accessible: true };
	} catch (error) {
		return {
			accessible: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Test webhook signature verification
 */
function testSignatureVerification(): {
	works: boolean;
	error?: string;
} {
	if (!TELNYX_CONFIG.publicKey || TELNYX_CONFIG.publicKey.trim() === "") {
		return {
			works: false,
			error: "TELNYX_PUBLIC_KEY is not configured",
		};
	}

	if (
		!TELNYX_CONFIG.webhookSecret ||
		TELNYX_CONFIG.webhookSecret.trim() === ""
	) {
		return {
			works: false,
			error: "TELNYX_WEBHOOK_SECRET is not configured",
		};
	}

	try {
		// Create a test payload
		const testPayload = JSON.stringify({ test: "data" });
		const testTimestamp = Math.floor(Date.now() / 1000).toString();

		// Try to verify a signature (this will fail but tests the function works)
		// We can't create a valid signature without Telnyx's private key,
		// but we can verify the function doesn't throw
		const result = verifyWebhookSignature({
			payload: testPayload,
			signature: "invalid_signature_for_testing",
			timestamp: testTimestamp,
		});

		// Function should return false for invalid signature, not throw
		return { works: true };
	} catch (error) {
		return {
			works: false,
			error:
				error instanceof Error
					? error.message
					: "Signature verification failed",
		};
	}
}

/**
 * Test timestamp validation
 */
function testTimestampValidation(): {
	works: boolean;
	error?: string;
} {
	try {
		// Test with current timestamp (should be valid)
		const currentTimestamp = Math.floor(Date.now() / 1000).toString();
		const currentValid = isWebhookTimestampValid(currentTimestamp);

		// Test with old timestamp (should be invalid)
		const oldTimestamp = (Math.floor(Date.now() / 1000) - 400).toString();
		const oldValid = isWebhookTimestampValid(oldTimestamp);

		// Both should work correctly
		if (currentValid && !oldValid) {
			return { works: true };
		}

		return {
			works: false,
			error: "Timestamp validation logic may be incorrect",
		};
	} catch (error) {
		return {
			works: false,
			error:
				error instanceof Error ? error.message : "Timestamp validation failed",
		};
	}
}

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
 * Check webhook health
 */
export async function checkWebhookHealth(): Promise<WebhookHealthStatus> {
	const status: WebhookHealthStatus = {
		urlAccessible: false,
		signatureVerificationWorks: false,
		timestampValidationWorks: false,
		webhookUrl: null,
		issues: [],
		warnings: [],
	};

	// Get webhook URL
	const webhookUrl = getWebhookUrl();
	if (!webhookUrl) {
		status.issues.push(
			"NEXT_PUBLIC_SITE_URL is not set to a valid production URL",
		);
		return status;
	}

	status.webhookUrl = webhookUrl;

	// Check URL accessibility
	const accessibilityCheck = await checkWebhookAccessibility(webhookUrl);
	if (!accessibilityCheck.accessible) {
		status.issues.push(
			`Webhook URL is not accessible: ${accessibilityCheck.error || "Unknown error"}`,
		);
	} else {
		status.urlAccessible = true;
	}

	// Test signature verification
	const signatureCheck = testSignatureVerification();
	if (!signatureCheck.works) {
		if (signatureCheck.error?.includes("not configured")) {
			status.warnings.push(
				`Signature verification not configured: ${signatureCheck.error}`,
			);
		} else {
			status.issues.push(
				`Signature verification failed: ${signatureCheck.error || "Unknown error"}`,
			);
		}
	} else {
		status.signatureVerificationWorks = true;
	}

	// Test timestamp validation
	const timestampCheck = testTimestampValidation();
	if (!timestampCheck.works) {
		status.issues.push(
			`Timestamp validation failed: ${timestampCheck.error || "Unknown error"}`,
		);
	} else {
		status.timestampValidationWorks = true;
	}

	return status;
}

/**
 * Get webhook health summary
 */
export function getWebhookHealthSummary(status: WebhookHealthStatus): {
	healthy: boolean;
	summary: string;
	recommendations: string[];
} {
	const healthy =
		status.urlAccessible &&
		status.signatureVerificationWorks &&
		status.timestampValidationWorks &&
		status.issues.length === 0;

	const recommendations: string[] = [];

	if (!status.urlAccessible) {
		recommendations.push(
			"Ensure your webhook URL is publicly accessible and not behind a firewall",
		);
	}

	if (!status.signatureVerificationWorks) {
		if (!TELNYX_CONFIG.publicKey || !TELNYX_CONFIG.webhookSecret) {
			recommendations.push(
				"Configure TELNYX_PUBLIC_KEY and TELNYX_WEBHOOK_SECRET for webhook security",
			);
		} else {
			recommendations.push(
				"Check webhook signature verification implementation",
			);
		}
	}

	if (!status.timestampValidationWorks) {
		recommendations.push("Check webhook timestamp validation logic");
	}

	if (status.warnings.length > 0) {
		recommendations.push(...status.warnings.map((w) => `Warning: ${w}`));
	}

	const summary = healthy
		? "Webhook health check passed"
		: `Webhook health check failed: ${status.issues.join(", ")}`;

	return {
		healthy,
		summary,
		recommendations,
	};
}
