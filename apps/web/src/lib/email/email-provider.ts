/**
 * Email Provider - SendGrid Only
 *
 * Single-provider email implementation using SendGrid (Twilio ecosystem).
 * No fallback providers - SendGrid is the only email provider.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    Email Provider Layer                         │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  1. Check company email provider preference                     │
 * │     ├─ Disabled → Return error                                  │
 * │     ├─ Gmail (if configured) → Send via Gmail                   │
 * │     └─ Managed (SendGrid) → Send via SendGrid                   │
 * │  2. Return result with tracking information                     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Usage:
 * ```typescript
 * import { sendEmailWithProvider } from "@/lib/email/email-provider";
 *
 * const result = await sendEmailWithProvider({
 *   companyId: "company-123",
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Hello</h1>",
 * });
 * ```
 */

import {
	checkCompanyGmailHealth,
	type GmailSendResult,
	getCompanyEmailProvider,
	getCompanyGmailTokens,
	isGmailIntegrationEnabled,
	sendCompanyGmailEmail,
} from "./gmail-client";
import {
	isAdminSendGridConfigured,
	isCompanySendGridConfigured,
	sendSendGridEmail,
	sendgridConfig,
} from "./sendgrid-client";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Supported email providers
 * - sendgrid: Primary managed provider (Twilio ecosystem)
 * - gmail: User's personal Gmail account (requires OAuth connection)
 */
export type EmailProvider = "sendgrid" | "gmail";

/**
 * Email send options - provider-agnostic interface
 */
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
	/** Company ID - required for multi-tenant setup */
	companyId: string;
	/** CC recipients */
	cc?: string | string[];
	/** BCC recipients */
	bcc?: string | string[];
	/** Email attachments */
	attachments?: EmailAttachment[];
}

/**
 * Result of sending an email
 */
export interface EmailProviderResult {
	/** Whether the email was sent successfully */
	success: boolean;
	/** The provider that sent the email */
	provider?: EmailProvider;
	/** Message ID from the provider */
	messageId?: string;
	/** Error message if failed */
	error?: string;
	/** Latency in milliseconds */
	latencyMs?: number;
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

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Provider configuration
 */
const providerConfig = {
	/** Primary provider - SendGrid (Twilio ecosystem) */
	primary: "sendgrid" as EmailProvider,
	/** Enable logging for debugging */
	enableLogging: true,
};

// =============================================================================
// PROVIDER AVAILABILITY
// =============================================================================

/**
 * Check if SendGrid is configured
 */
function isProviderConfigured(): boolean {
	return isAdminSendGridConfigured();
}

/**
 * Get list of configured providers
 */
function getConfiguredProviders(): EmailProvider[] {
	const providers: EmailProvider[] = [];

	if (isAdminSendGridConfigured()) {
		providers.push("sendgrid");
	}

	return providers;
}

// =============================================================================
// EMAIL SENDING
// =============================================================================

/**
 * Send email via SendGrid
 */
async function sendViaSendGrid(
	options: EmailSendOptions,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
	if (!isAdminSendGridConfigured()) {
		return { success: false, error: "SendGrid is not configured" };
	}

	try {
		const result = await sendSendGridEmail({
			companyId: options.companyId,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
			from: options.from, // From address is handled by sendSendGridEmail from database
			replyTo: options.replyTo,
			tags: options.tags,
			attachments: options.attachments?.map(att => ({
				filename: att.filename,
				content: att.content,
				type: att.contentType,
			})),
		});

		return result;
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "SendGrid send failed",
		};
	}
}

/**
 * Send email via Gmail (company's connected Gmail account)
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
 */
async function isCompanyGmailAvailable(companyId: string): Promise<boolean> {
	try {
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
 * Send email using the appropriate provider
 *
 * Provider Selection Logic (Multi-Tenant):
 * - If company preference = "disabled" → Return error
 * - If company preference = "gmail" AND valid Gmail tokens → Gmail
 * - Otherwise → SendGrid
 *
 * @param options - Email send options (companyId required)
 * @returns Result with success status
 */
export async function sendEmailWithFallback(
	options: EmailSendOptions,
): Promise<EmailProviderResult> {
	const startTime = Date.now();
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
		};
	}

	// Handle Gmail preference
	if (companyPreference === "gmail") {
		const gmailAvailable = await isCompanyGmailAvailable(options.companyId);

		if (gmailAvailable) {
			if (providerConfig.enableLogging) {
				console.log(
					`[EmailProvider] Company ${options.companyId} prefers Gmail, attempting Gmail send...`,
				);
			}

			const result = await sendViaGmail(options.companyId, options);
			const latencyMs = Date.now() - startTime;

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
					latencyMs,
				};
			}

			// Gmail failed - fall through to SendGrid
			if (providerConfig.enableLogging) {
				console.warn(
					`[EmailProvider] ✗ Gmail send failed in ${latencyMs}ms: ${result.error}`,
				);
				console.log("[EmailProvider] Falling back to SendGrid...");
			}
		} else {
			if (providerConfig.enableLogging) {
				console.log(
					`[EmailProvider] Company ${options.companyId} prefers Gmail but no valid tokens, using SendGrid`,
				);
			}
		}
	}

	// ==========================================================================
	// SENDGRID (Primary Provider)
	// ==========================================================================
	if (!isProviderConfigured()) {
		return {
			success: false,
			error: "SendGrid is not configured",
			latencyMs: Date.now() - startTime,
		};
	}

	if (providerConfig.enableLogging) {
		console.log(`[EmailProvider] Sending via SendGrid`);
	}

	const result = await sendViaSendGrid(options);
	const latencyMs = Date.now() - startTime;

	if (result.success) {
		if (providerConfig.enableLogging) {
			console.log(
				`[EmailProvider] ✓ SendGrid send succeeded in ${latencyMs}ms, messageId: ${result.messageId}`,
			);
		}

		return {
			success: true,
			provider: "sendgrid",
			messageId: result.messageId,
			latencyMs,
		};
	}

	if (providerConfig.enableLogging) {
		console.error(
			`[EmailProvider] ✗ SendGrid send failed in ${latencyMs}ms: ${result.error}`,
		);
	}

	return {
		success: false,
		error: result.error || "Failed to send email",
		latencyMs,
	};
}

// Alias for backward compatibility
const sendEmailWithProvider = sendEmailWithFallback;

// =============================================================================
// HEALTH CHECKS
// =============================================================================

/**
 * Check health of SendGrid provider
 */
async function checkSendGridHealth(): Promise<ProviderHealthStatus> {
	const startTime = Date.now();

	if (!isAdminSendGridConfigured()) {
		return {
			provider: "sendgrid",
			healthy: false,
			latencyMs: 0,
			lastChecked: new Date(),
			error: "SendGrid is not configured",
		};
	}

	try {
		// SendGrid API health check via scopes endpoint
		const response = await fetch("https://api.sendgrid.com/v3/scopes", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		const latencyMs = Date.now() - startTime;

		if (response.ok) {
			console.log(
				`[EmailProvider] SendGrid health check passed in ${latencyMs}ms`,
			);
			return {
				provider: "sendgrid",
				healthy: true,
				latencyMs,
				lastChecked: new Date(),
			};
		}

		const error = await response.text();
		console.error(`[EmailProvider] SendGrid health check failed: ${error}`);
		return {
			provider: "sendgrid",
			healthy: false,
			latencyMs,
			lastChecked: new Date(),
			error: `HTTP ${response.status}: ${error}`,
		};
	} catch (error) {
		const latencyMs = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		console.error(`[EmailProvider] SendGrid health check error: ${errorMessage}`);
		return {
			provider: "sendgrid",
			healthy: false,
			latencyMs,
			lastChecked: new Date(),
			error: errorMessage,
		};
	}
}

/**
 * Check health of all configured providers
 */
async function checkAllProvidersHealth(): Promise<{
	sendgrid: ProviderHealthStatus | null;
	recommendedProvider: EmailProvider | null;
}> {
	console.log("[EmailProvider] Checking SendGrid health...");

	const sendgridHealth = isProviderConfigured()
		? await checkSendGridHealth()
		: null;

	const recommendedProvider = sendgridHealth?.healthy ? "sendgrid" : null;

	console.log(
		`[EmailProvider] Health check complete. SendGrid: ${sendgridHealth?.healthy ? "healthy" : "unhealthy"}`,
	);

	return {
		sendgrid: sendgridHealth,
		recommendedProvider,
	};
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get display information about the email provider setup
 */
export function getProviderSetupInfo(): {
	configured: boolean;
	provider: EmailProvider;
	status: "configured" | "not_configured";
} {
	const configured = isProviderConfigured();

	return {
		configured,
		provider: "sendgrid",
		status: configured ? "configured" : "not_configured",
	};
}

/**
 * Log a summary of the current provider configuration
 */
function logProviderConfiguration(): void {
	const info = getProviderSetupInfo();

	console.log("=".repeat(60));
	console.log("[EmailProvider] Configuration Summary");
	console.log("=".repeat(60));
	console.log(
		`Provider: SendGrid (${info.configured ? "✓ configured" : "✗ not configured"})`,
	);
	console.log(`Status: ${info.status}`);
	console.log("=".repeat(60));
}
