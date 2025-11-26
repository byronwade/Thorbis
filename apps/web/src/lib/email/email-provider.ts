/**
 * Email Provider Abstraction Layer
 *
 * This module provides a unified interface for sending emails through multiple
 * providers (Resend and Postmark) with automatic fallback support.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    Email Provider Layer                         │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  1. Try Primary Provider (Resend)                               │
 * │     ├─ Success → Return result, log to monitor                  │
 * │     └─ Failure → Try Fallback                                   │
 * │  2. Try Fallback Provider (Postmark)                            │
 * │     ├─ Success → Return result, log to monitor                  │
 * │     └─ Failure → Return error with both provider failures       │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Features:
 * - Automatic fallback when primary provider fails
 * - Health monitoring for both providers
 * - Unified response format
 * - Comprehensive logging for debugging
 * - Provider-agnostic interface for email operations
 *
 * Usage:
 * ```typescript
 * import { sendEmailWithFallback } from "@/lib/email/email-provider";
 *
 * const result = await sendEmailWithFallback({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Hello</h1>",
 * });
 * ```
 */

import {
	type CompanyEmailProvider,
	checkCompanyGmailHealth,
	type GmailSendResult,
	getCompanyEmailProvider,
	getCompanyGmailTokens,
	isGmailIntegrationEnabled,
	sendCompanyGmailEmail,
} from "./gmail-client";
import {
	checkPostmarkHealth,
	isPostmarkConfigured,
	type PostmarkResponse,
	postmarkConfig,
	sendPostmarkEmail,
} from "./postmark-client";
import { emailConfig, isResendConfigured, resend } from "./resend-client";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Supported email providers
 * - resend: Primary managed provider (high deliverability, company branding)
 * - postmark: Fallback managed provider (automatic failover)
 * - gmail: User's personal Gmail account (requires OAuth connection)
 */
export type EmailProvider = "resend" | "postmark" | "gmail";

/**
 * Email send options - provider-agnostic interface
 */
/** Attachment type for email */
export interface EmailAttachment {
	filename: string;
	content: string; // Base64 encoded content
	contentType?: string;
}

export interface EmailSendOptions {
	/** Recipient email address(es) */
	to: string | string[];
	/** Email subject line */
	subject: string;
	/** HTML body content */
	html: string;
	/** Plain text body (optional, auto-generated if not provided) */
	text?: string;
	/** From address (uses provider default if not specified) */
	from?: string;
	/** Reply-to address */
	replyTo?: string;
	/** Tags for categorization and tracking */
	tags?: Record<string, string>;
	/** Communication ID for internal tracking */
	communicationId?: string;
	/** Company ID - required for checking company email provider preference */
	companyId?: string;
	/** CC recipients */
	cc?: string | string[];
	/** BCC recipients */
	bcc?: string | string[];
	/** Email attachments */
	attachments?: EmailAttachment[];
}

/**
 * Result of sending an email through the provider layer
 */
export interface EmailProviderResult {
	/** Whether the email was sent successfully */
	success: boolean;
	/** The provider that successfully sent the email */
	provider?: EmailProvider;
	/** Message ID from the provider */
	messageId?: string;
	/** Error message if failed */
	error?: string;
	/** Whether fallback was used */
	usedFallback?: boolean;
	/** Detailed results from each provider attempt */
	attempts: Array<{
		provider: EmailProvider;
		success: boolean;
		messageId?: string;
		error?: string;
		latencyMs: number;
	}>;
}

/**
 * Provider health status
 */
export interface ProviderHealthStatus {
	provider: EmailProvider;
	healthy: boolean;
	latencyMs: number;
	lastChecked: Date;
	error?: string;
}

/**
 * Combined health status for all providers
 */
export interface AllProvidersHealth {
	primary: ProviderHealthStatus | null;
	fallback: ProviderHealthStatus | null;
	recommendedProvider: EmailProvider | null;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Provider configuration
 * Determines which provider is primary and which is fallback
 */
export const providerConfig = {
	/** Primary provider - tried first */
	primary: "resend" as EmailProvider,
	/** Fallback provider - used if primary fails */
	fallback: "postmark" as EmailProvider,
	/** Enable automatic fallback on failure */
	enableFallback: true,
	/** Log all provider operations for monitoring */
	enableLogging: true,
	/** Retry count before falling back (0 = immediate fallback) */
	primaryRetries: 0,
};

// =============================================================================
// PROVIDER AVAILABILITY
// =============================================================================

/**
 * Check if a specific provider is configured and available
 *
 * @param provider - Provider to check
 * @returns Whether the provider is available
 */
export function isProviderConfigured(provider: EmailProvider): boolean {
	switch (provider) {
		case "resend":
			return isResendConfigured();
		case "postmark":
			return isPostmarkConfigured();
		default:
			return false;
	}
}

/**
 * Get list of all configured providers
 *
 * @returns Array of configured provider names
 */
export function getConfiguredProviders(): EmailProvider[] {
	const providers: EmailProvider[] = [];

	if (isResendConfigured()) {
		providers.push("resend");
	}

	if (isPostmarkConfigured()) {
		providers.push("postmark");
	}

	return providers;
}

/**
 * Get the best available provider
 * Returns primary if configured, otherwise fallback
 *
 * @returns Best available provider or null if none configured
 */
export function getBestAvailableProvider(): EmailProvider | null {
	if (isProviderConfigured(providerConfig.primary)) {
		return providerConfig.primary;
	}

	if (
		providerConfig.enableFallback &&
		isProviderConfigured(providerConfig.fallback)
	) {
		return providerConfig.fallback;
	}

	return null;
}

// =============================================================================
// EMAIL SENDING
// =============================================================================

/**
 * Send email via Resend
 *
 * @param options - Email options
 * @returns Send result
 */
async function sendViaResend(
	options: EmailSendOptions,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	if (!isResendConfigured() || !resend) {
		return { success: false, error: "Resend is not configured" };
	}

	try {
		// Build tags array for Resend
		const tags: Array<{ name: string; value: string }> = [];
		if (options.tags) {
			for (const [name, value] of Object.entries(options.tags)) {
				tags.push({ name, value });
			}
		}
		if (options.communicationId) {
			tags.push({ name: "communication_id", value: options.communicationId });
		}

		// Send via Resend
		const { data, error } = await resend.emails.send({
			from: options.from || emailConfig.from,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
			replyTo: options.replyTo,
			tags: tags.length > 0 ? tags : undefined,
		});

		if (error) {
			return { success: false, error: error.message || "Resend send failed" };
		}

		return { success: true, messageId: data?.id };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Resend send failed",
		};
	}
}

/**
 * Send email via Postmark
 *
 * @param options - Email options
 * @returns Send result
 */
async function sendViaPostmark(
	options: EmailSendOptions,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	if (!isPostmarkConfigured()) {
		return { success: false, error: "Postmark is not configured" };
	}

	try {
		// Convert tags to Postmark metadata format
		const metadata: Record<string, string> = { ...options.tags };
		if (options.communicationId) {
			metadata.communication_id = options.communicationId;
		}
		if (options.companyId) {
			metadata.company_id = options.companyId;
		}

		// Determine tag (Postmark only supports one tag per email)
		const tag = options.tags?.template || options.tags?.type || "transactional";

		// Send via Postmark
		const result = await sendPostmarkEmail({
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
			from: options.from || postmarkConfig.from,
			replyTo: options.replyTo,
			tag,
			metadata,
		});

		if (!result.success) {
			return { success: false, error: result.error };
		}

		return { success: true, messageId: result.data.MessageID };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Postmark send failed",
		};
	}
}

/**
 * Send email via Gmail (company's connected Gmail account)
 *
 * @param companyId - Company ID with connected Gmail
 * @param options - Email options
 * @returns Send result
 */
async function sendViaGmail(
	companyId: string,
	options: EmailSendOptions,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	try {
		const result = await sendCompanyGmailEmail(companyId, {
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
			replyTo: options.replyTo,
			cc: options.cc,
			bcc: options.bcc,
		});

		if (!result.success) {
			return { success: false, error: result.error };
		}

		return { success: true, messageId: result.messageId };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Gmail send failed",
		};
	}
}

/**
 * Check if Gmail is available for a company
 *
 * @param companyId - Company ID to check
 * @returns Whether Gmail is available and configured
 */
async function isCompanyGmailAvailable(companyId: string): Promise<boolean> {
	try {
		// Check if Gmail integration is enabled globally
		if (!(await isGmailIntegrationEnabled())) {
			return false;
		}

		const tokens = await getCompanyGmailTokens(companyId);
		return tokens !== null && tokens.isValid;
	} catch {
		return false;
	}
}

/**
 * Send email with automatic fallback
 *
 * This is the main function for sending emails. It:
 * 1. Checks company's email provider preference (managed vs gmail vs disabled)
 * 2. If disabled, returns error immediately
 * 3. If Gmail preferred and available, sends via Gmail
 * 4. Otherwise, tries the primary provider (Resend)
 * 5. If primary fails and fallback is enabled, tries Postmark
 * 6. Returns detailed results including all attempts
 *
 * Provider Selection Logic (Multi-Tenant):
 * - If company preference = "disabled" → Return error (company has email disabled)
 * - If company preference = "gmail" AND valid Gmail tokens exist → Gmail
 * - If company preference = "managed" OR Gmail unavailable → Resend → Postmark
 *
 * @param options - Email send options
 * @returns Result with success status and attempt details
 *
 * @example
 * const result = await sendEmailWithFallback({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Hello</h1>",
 *   tags: { template: "welcome" },
 *   companyId: "company-123", // Required for multi-tenant provider selection
 * });
 *
 * if (result.success) {
 *   console.log(`Sent via ${result.provider}, ID: ${result.messageId}`);
 * } else {
 *   console.error(`Failed: ${result.error}`);
 * }
 */
export async function sendEmailWithFallback(
	options: EmailSendOptions,
): Promise<EmailProviderResult> {
	const attempts: EmailProviderResult["attempts"] = [];
	const recipient = Array.isArray(options.to)
		? options.to.join(", ")
		: options.to;

	// Log the send attempt
	if (providerConfig.enableLogging) {
		console.log(
			`[EmailProvider] Sending email to ${recipient}, subject: "${options.subject}"`,
		);
	}

	// ==========================================================================
	// COMPANY EMAIL PROVIDER CHECK (Multi-Tenant)
	// ==========================================================================
	// Each company (tenant) can choose:
	// - 'managed': Use our Resend/Postmark providers
	// - 'gmail': Use their connected Gmail account
	// - 'disabled': Email is disabled for this company
	if (options.companyId) {
		const companyPreference = await getCompanyEmailProvider(options.companyId);

		// Handle disabled - company has turned off email
		if (companyPreference === "disabled") {
			if (providerConfig.enableLogging) {
				console.log(
					`[EmailProvider] Company ${options.companyId} has email disabled`,
				);
			}

			return {
				success: false,
				error: "Email is disabled for this company",
				usedFallback: false,
				attempts: [],
			};
		}

		// Handle Gmail preference
		if (companyPreference === "gmail") {
			const gmailAvailable = await isCompanyGmailAvailable(options.companyId);

			if (gmailAvailable) {
				const startTime = Date.now();

				if (providerConfig.enableLogging) {
					console.log(
						`[EmailProvider] Company ${options.companyId} prefers Gmail, attempting Gmail send...`,
					);
				}

				const result = await sendViaGmail(options.companyId, options);
				const latencyMs = Date.now() - startTime;

				attempts.push({
					provider: "gmail",
					success: result.success,
					messageId: result.messageId,
					error: result.error,
					latencyMs,
				});

				if (result.success) {
					if (providerConfig.enableLogging) {
						console.log(
							`[EmailProvider] ✓ Gmail send succeeded in ${latencyMs}ms, messageId: ${result.messageId}`,
						);
					}

					return {
						success: true,
						provider: "gmail",
						messageId: result.messageId,
						usedFallback: false,
						attempts,
					};
				}

				// Gmail failed - fall through to managed providers
				if (providerConfig.enableLogging) {
					console.warn(
						`[EmailProvider] ✗ Gmail send failed in ${latencyMs}ms: ${result.error}`,
					);
					console.log("[EmailProvider] Falling back to managed providers...");
				}
			} else {
				if (providerConfig.enableLogging) {
					console.log(
						`[EmailProvider] Company ${options.companyId} prefers Gmail but no valid tokens, using managed providers`,
					);
				}
			}
		}
	}

	// ==========================================================================
	// MANAGED PROVIDERS: Primary (Resend) → Fallback (Postmark)
	// ==========================================================================

	// ==========================================================================
	// ATTEMPT 1: Primary Provider (Resend)
	// ==========================================================================
	if (isProviderConfigured(providerConfig.primary)) {
		const startTime = Date.now();

		if (providerConfig.enableLogging) {
			console.log(
				`[EmailProvider] Trying primary provider: ${providerConfig.primary}`,
			);
		}

		const result =
			providerConfig.primary === "resend"
				? await sendViaResend(options)
				: await sendViaPostmark(options);

		const latencyMs = Date.now() - startTime;

		attempts.push({
			provider: providerConfig.primary,
			success: result.success,
			messageId: result.messageId,
			error: result.error,
			latencyMs,
		});

		// If primary succeeded, return immediately
		if (result.success) {
			if (providerConfig.enableLogging) {
				console.log(
					`[EmailProvider] ✓ Primary provider succeeded in ${latencyMs}ms, messageId: ${result.messageId}`,
				);
			}

			return {
				success: true,
				provider: providerConfig.primary,
				messageId: result.messageId,
				usedFallback: false,
				attempts,
			};
		}

		// Primary failed
		if (providerConfig.enableLogging) {
			console.warn(
				`[EmailProvider] ✗ Primary provider failed in ${latencyMs}ms: ${result.error}`,
			);
		}
	} else {
		if (providerConfig.enableLogging) {
			console.warn(
				`[EmailProvider] Primary provider (${providerConfig.primary}) not configured`,
			);
		}
	}

	// ==========================================================================
	// ATTEMPT 2: Fallback Provider (Postmark)
	// ==========================================================================
	if (
		providerConfig.enableFallback &&
		isProviderConfigured(providerConfig.fallback)
	) {
		const startTime = Date.now();

		if (providerConfig.enableLogging) {
			console.log(
				`[EmailProvider] Trying fallback provider: ${providerConfig.fallback}`,
			);
		}

		const result =
			providerConfig.fallback === "postmark"
				? await sendViaPostmark(options)
				: await sendViaResend(options);

		const latencyMs = Date.now() - startTime;

		attempts.push({
			provider: providerConfig.fallback,
			success: result.success,
			messageId: result.messageId,
			error: result.error,
			latencyMs,
		});

		// If fallback succeeded, return
		if (result.success) {
			if (providerConfig.enableLogging) {
				console.log(
					`[EmailProvider] ✓ Fallback provider succeeded in ${latencyMs}ms, messageId: ${result.messageId}`,
				);
			}

			return {
				success: true,
				provider: providerConfig.fallback,
				messageId: result.messageId,
				usedFallback: true,
				attempts,
			};
		}

		// Fallback also failed
		if (providerConfig.enableLogging) {
			console.error(
				`[EmailProvider] ✗ Fallback provider also failed in ${latencyMs}ms: ${result.error}`,
			);
		}
	} else if (providerConfig.enableFallback) {
		if (providerConfig.enableLogging) {
			console.warn(
				`[EmailProvider] Fallback provider (${providerConfig.fallback}) not configured`,
			);
		}
	}

	// ==========================================================================
	// ALL PROVIDERS FAILED
	// ==========================================================================
	const errors = attempts.map((a) => `${a.provider}: ${a.error}`).join("; ");

	if (providerConfig.enableLogging) {
		console.error(`[EmailProvider] ✗ All providers failed: ${errors}`);
	}

	return {
		success: false,
		error: `All email providers failed. ${errors}`,
		usedFallback: attempts.length > 1,
		attempts,
	};
}

// =============================================================================
// HEALTH CHECKS
// =============================================================================

/**
 * Check health of Resend provider
 *
 * @returns Health status
 */
async function checkResendHealth(): Promise<ProviderHealthStatus> {
	const startTime = Date.now();

	if (!isResendConfigured() || !resend) {
		return {
			provider: "resend",
			healthy: false,
			latencyMs: 0,
			lastChecked: new Date(),
			error: "Resend is not configured",
		};
	}

	try {
		// Resend doesn't have a dedicated health endpoint
		// We'll list domains as a health check (lightweight operation)
		const response = await fetch("https://api.resend.com/domains", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		const latencyMs = Date.now() - startTime;

		if (response.ok) {
			console.log(
				`[EmailProvider] Resend health check passed in ${latencyMs}ms`,
			);
			return {
				provider: "resend",
				healthy: true,
				latencyMs,
				lastChecked: new Date(),
			};
		}

		const error = await response.text();
		console.error(`[EmailProvider] Resend health check failed: ${error}`);
		return {
			provider: "resend",
			healthy: false,
			latencyMs,
			lastChecked: new Date(),
			error: `HTTP ${response.status}: ${error}`,
		};
	} catch (error) {
		const latencyMs = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		console.error(`[EmailProvider] Resend health check error: ${errorMessage}`);
		return {
			provider: "resend",
			healthy: false,
			latencyMs,
			lastChecked: new Date(),
			error: errorMessage,
		};
	}
}

/**
 * Check health of all configured providers
 *
 * @returns Health status for all providers
 */
export async function checkAllProvidersHealth(): Promise<AllProvidersHealth> {
	console.log("[EmailProvider] Checking health of all providers...");

	const results: AllProvidersHealth = {
		primary: null,
		fallback: null,
		recommendedProvider: null,
	};

	// Check primary (Resend)
	if (isProviderConfigured("resend")) {
		results.primary = await checkResendHealth();
	}

	// Check fallback (Postmark)
	if (isProviderConfigured("postmark")) {
		const postmarkHealth = await checkPostmarkHealth();
		results.fallback = {
			provider: "postmark",
			healthy: postmarkHealth.healthy,
			latencyMs: postmarkHealth.latencyMs,
			lastChecked: new Date(),
			error: postmarkHealth.error,
		};
	}

	// Determine recommended provider based on health
	if (results.primary?.healthy) {
		results.recommendedProvider = "resend";
	} else if (results.fallback?.healthy) {
		results.recommendedProvider = "postmark";
	}

	console.log(
		`[EmailProvider] Health check complete. Primary: ${results.primary?.healthy ? "healthy" : "unhealthy"}, Fallback: ${results.fallback?.healthy ? "healthy" : "unhealthy"}, Recommended: ${results.recommendedProvider || "none"}`,
	);

	return results;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get display information about the email provider setup
 *
 * @returns Provider setup summary
 */
export function getProviderSetupInfo(): {
	primaryConfigured: boolean;
	fallbackConfigured: boolean;
	fallbackEnabled: boolean;
	configuredProviders: EmailProvider[];
	status:
		| "fully_configured"
		| "primary_only"
		| "fallback_only"
		| "not_configured";
} {
	const primaryConfigured = isProviderConfigured(providerConfig.primary);
	const fallbackConfigured = isProviderConfigured(providerConfig.fallback);
	const configuredProviders = getConfiguredProviders();

	let status:
		| "fully_configured"
		| "primary_only"
		| "fallback_only"
		| "not_configured";

	if (primaryConfigured && fallbackConfigured) {
		status = "fully_configured";
	} else if (primaryConfigured) {
		status = "primary_only";
	} else if (fallbackConfigured) {
		status = "fallback_only";
	} else {
		status = "not_configured";
	}

	return {
		primaryConfigured,
		fallbackConfigured,
		fallbackEnabled: providerConfig.enableFallback,
		configuredProviders,
		status,
	};
}

/**
 * Log a summary of the current provider configuration
 * Useful for debugging and startup diagnostics
 */
export function logProviderConfiguration(): void {
	const info = getProviderSetupInfo();

	console.log("=".repeat(60));
	console.log("[EmailProvider] Configuration Summary");
	console.log("=".repeat(60));
	console.log(
		`Primary Provider: ${providerConfig.primary} (${info.primaryConfigured ? "✓ configured" : "✗ not configured"})`,
	);
	console.log(
		`Fallback Provider: ${providerConfig.fallback} (${info.fallbackConfigured ? "✓ configured" : "✗ not configured"})`,
	);
	console.log(`Fallback Enabled: ${info.fallbackEnabled ? "Yes" : "No"}`);
	console.log(`Status: ${info.status}`);
	console.log(
		`Configured Providers: ${info.configuredProviders.join(", ") || "none"}`,
	);
	console.log("=".repeat(60));
}
