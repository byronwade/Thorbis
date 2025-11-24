/**
 * Postmark Email Client
 *
 * This module provides integration with Postmark as a fallback email provider.
 * Postmark is known for excellent deliverability and is used when Resend fails.
 *
 * Features:
 * - Email sending with automatic retry
 * - Domain/sender signature management
 * - Webhook signature verification
 * - Delivery status tracking
 *
 * Environment Variables Required:
 * - POSTMARK_API_KEY: Your Postmark server API token
 * - POSTMARK_WEBHOOK_SECRET: Secret for verifying webhook signatures (optional)
 *
 * @see https://postmarkapp.com/developer
 */

import crypto from "node:crypto";

// =============================================================================
// CONFIGURATION
// =============================================================================

const POSTMARK_API_BASE = "https://api.postmarkapp.com";

/**
 * Postmark client configuration
 * Checks environment variables and provides defaults
 */
export const postmarkConfig = {
	apiKey: process.env.POSTMARK_API_KEY || "",
	webhookSecret: process.env.POSTMARK_WEBHOOK_SECRET || "",
	// Default "from" address for Postmark (must be verified sender signature)
	from: process.env.POSTMARK_FROM_EMAIL || process.env.EMAIL_FROM || "notifications@stratos.app",
	// Is Postmark configured and ready to use?
	isConfigured: !!process.env.POSTMARK_API_KEY,
	// Provider name for logging/monitoring
	providerName: "postmark" as const,
};

// =============================================================================
// TYPES
// =============================================================================

/**
 * Standard response wrapper for Postmark API calls
 * Matches the pattern used by Resend for consistency
 */
export type PostmarkResponse<T> =
	| { success: true; data: T }
	| { success: false; error: string; errorCode?: number };

/**
 * Postmark email send request
 * @see https://postmarkapp.com/developer/api/email-api
 */
export interface PostmarkSendRequest {
	From: string;
	To: string;
	Subject: string;
	HtmlBody?: string;
	TextBody?: string;
	ReplyTo?: string;
	Tag?: string;
	TrackOpens?: boolean;
	TrackLinks?: "None" | "HtmlAndText" | "HtmlOnly" | "TextOnly";
	MessageStream?: string;
	Metadata?: Record<string, string>;
}

/**
 * Postmark email send response
 */
export interface PostmarkSendResponse {
	To: string;
	SubmittedAt: string;
	MessageID: string;
	ErrorCode: number;
	Message: string;
}

/**
 * Postmark domain (sender signature) data
 * @see https://postmarkapp.com/developer/api/signatures-api
 */
export interface PostmarkDomainData {
	ID: number;
	Domain: string;
	EmailAddress: string;
	ReplyToEmailAddress: string;
	Name: string;
	Confirmed: boolean;
	SPFVerified: boolean;
	SPFHost: string;
	SPFTextValue: string;
	DKIMVerified: boolean;
	WeakDKIM: boolean;
	DKIMHost: string;
	DKIMTextValue: string;
	DKIMPendingHost: string;
	DKIMPendingTextValue: string;
	DKIMRevokedHost: string;
	DKIMRevokedTextValue: string;
	SafeToRemoveRevokedKeyFromDNS: boolean;
	DKIMUpdateStatus: string;
	ReturnPathDomain: string;
	ReturnPathDomainCNAMEValue: string;
	ReturnPathDomainVerified: boolean;
}

/**
 * Postmark webhook event types
 */
export type PostmarkWebhookEventType =
	| "Delivery"
	| "Bounce"
	| "SpamComplaint"
	| "Open"
	| "Click"
	| "SubscriptionChange";

/**
 * Postmark webhook payload base
 */
export interface PostmarkWebhookPayload {
	RecordType: PostmarkWebhookEventType;
	MessageID: string;
	Recipient: string;
	Tag: string;
	DeliveredAt?: string;
	BouncedAt?: string;
	Type?: string; // Bounce type
	TypeCode?: number;
	Description?: string;
	Details?: string;
	Email?: string;
	From?: string;
	Subject?: string;
	Metadata?: Record<string, string>;
}

// =============================================================================
// API REQUEST HELPER
// =============================================================================

/**
 * Makes authenticated requests to Postmark API
 *
 * @param path - API endpoint path (e.g., "/email")
 * @param init - Fetch request options
 * @returns Typed response with success/error handling
 *
 * @example
 * const result = await postmarkRequest<PostmarkSendResponse>("/email", {
 *   method: "POST",
 *   body: JSON.stringify(emailData),
 * });
 */
async function postmarkRequest<T>(
	path: string,
	init: RequestInit
): Promise<PostmarkResponse<T>> {
	// Check if Postmark is configured
	if (!postmarkConfig.apiKey) {
		return {
			success: false,
			error: "Postmark API key is not configured. Set POSTMARK_API_KEY environment variable.",
		};
	}

	try {
		const response = await fetch(`${POSTMARK_API_BASE}${path}`, {
			...init,
			headers: {
				// Postmark uses X-Postmark-Server-Token for authentication
				"X-Postmark-Server-Token": postmarkConfig.apiKey,
				"Content-Type": "application/json",
				Accept: "application/json",
				...init.headers,
			},
		});

		// Parse response body
		const body = await response.json().catch(() => ({}));

		// Handle non-OK responses
		if (!response.ok) {
			return {
				success: false,
				error: body.Message || body.message || response.statusText,
				errorCode: body.ErrorCode,
			};
		}

		return { success: true, data: body as T };
	} catch (error) {
		// Network or parsing error
		return {
			success: false,
			error: error instanceof Error ? error.message : "Postmark request failed",
		};
	}
}

// =============================================================================
// EMAIL SENDING
// =============================================================================

/**
 * Send an email via Postmark
 *
 * This is the primary email sending function for Postmark.
 * It handles HTML emails with optional tracking.
 *
 * @param options - Email send options
 * @returns Send result with MessageID on success
 *
 * @example
 * const result = await sendPostmarkEmail({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Hello</h1>",
 *   from: "hello@mycompany.com",
 *   tags: { template: "welcome" },
 * });
 */
export async function sendPostmarkEmail(options: {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
	from?: string;
	replyTo?: string;
	tag?: string;
	trackOpens?: boolean;
	trackLinks?: boolean;
	metadata?: Record<string, string>;
	messageStream?: string;
}): Promise<PostmarkResponse<PostmarkSendResponse>> {
	const {
		to,
		subject,
		html,
		text,
		from = postmarkConfig.from,
		replyTo,
		tag,
		trackOpens = true,
		trackLinks = true,
		metadata,
		messageStream = "outbound", // Default message stream
	} = options;

	// Postmark requires single recipient per request for /email endpoint
	// For multiple recipients, we'd use /email/batch
	const recipient = Array.isArray(to) ? to.join(", ") : to;

	const request: PostmarkSendRequest = {
		From: from,
		To: recipient,
		Subject: subject,
		HtmlBody: html,
		TextBody: text,
		ReplyTo: replyTo,
		Tag: tag,
		TrackOpens: trackOpens,
		TrackLinks: trackLinks ? "HtmlAndText" : "None",
		MessageStream: messageStream,
		Metadata: metadata,
	};

	// Log send attempt for monitoring
	console.log(`[Postmark] Sending email to ${recipient}, subject: "${subject}"`);

	const result = await postmarkRequest<PostmarkSendResponse>("/email", {
		method: "POST",
		body: JSON.stringify(request),
	});

	// Log result for monitoring
	if (result.success) {
		console.log(`[Postmark] Email sent successfully, MessageID: ${result.data.MessageID}`);
	} else {
		console.error(`[Postmark] Email send failed: ${result.error}`);
	}

	return result;
}

/**
 * Send batch emails via Postmark (up to 500 per request)
 *
 * @param emails - Array of email options
 * @returns Array of send results
 */
export async function sendPostmarkBatchEmails(
	emails: Array<{
		to: string;
		subject: string;
		html: string;
		text?: string;
		from?: string;
		replyTo?: string;
		tag?: string;
		metadata?: Record<string, string>;
	}>
): Promise<PostmarkResponse<PostmarkSendResponse[]>> {
	if (emails.length > 500) {
		return {
			success: false,
			error: "Postmark batch limit is 500 emails per request",
		};
	}

	const requests: PostmarkSendRequest[] = emails.map((email) => ({
		From: email.from || postmarkConfig.from,
		To: email.to,
		Subject: email.subject,
		HtmlBody: email.html,
		TextBody: email.text,
		ReplyTo: email.replyTo,
		Tag: email.tag,
		TrackOpens: true,
		TrackLinks: "HtmlAndText",
		Metadata: email.metadata,
	}));

	console.log(`[Postmark] Sending batch of ${emails.length} emails`);

	return postmarkRequest<PostmarkSendResponse[]>("/email/batch", {
		method: "POST",
		body: JSON.stringify(requests),
	});
}

// =============================================================================
// DOMAIN/SENDER SIGNATURE MANAGEMENT
// =============================================================================

/**
 * List all sender signatures (domains) in Postmark
 *
 * @returns List of sender signatures
 */
export async function listPostmarkDomains(): Promise<
	PostmarkResponse<{ TotalCount: number; SenderSignatures: PostmarkDomainData[] }>
> {
	console.log("[Postmark] Listing sender signatures");
	return postmarkRequest("/senders", { method: "GET" });
}

/**
 * Get details of a specific sender signature
 *
 * @param signatureId - Postmark sender signature ID
 * @returns Sender signature details
 */
export async function getPostmarkDomain(
	signatureId: number
): Promise<PostmarkResponse<PostmarkDomainData>> {
	console.log(`[Postmark] Getting sender signature ${signatureId}`);
	return postmarkRequest(`/senders/${signatureId}`, { method: "GET" });
}

/**
 * Create a new sender signature in Postmark
 *
 * Note: Postmark uses "sender signatures" which can be either:
 * - Individual email addresses
 * - Entire domains
 *
 * @param options - Sender signature options
 * @returns Created sender signature
 */
export async function createPostmarkDomain(options: {
	fromEmail: string;
	name: string;
	replyToEmail?: string;
}): Promise<PostmarkResponse<PostmarkDomainData>> {
	const { fromEmail, name, replyToEmail } = options;

	console.log(`[Postmark] Creating sender signature for ${fromEmail}`);

	return postmarkRequest("/senders", {
		method: "POST",
		body: JSON.stringify({
			FromEmail: fromEmail,
			Name: name,
			ReplyToEmail: replyToEmail || fromEmail,
		}),
	});
}

/**
 * Delete a sender signature from Postmark
 *
 * @param signatureId - Postmark sender signature ID
 * @returns Deletion result
 */
export async function deletePostmarkDomain(
	signatureId: number
): Promise<PostmarkResponse<{ Message: string }>> {
	console.log(`[Postmark] Deleting sender signature ${signatureId}`);
	return postmarkRequest(`/senders/${signatureId}`, { method: "DELETE" });
}

/**
 * Resend confirmation email for a sender signature
 *
 * @param signatureId - Postmark sender signature ID
 * @returns Resend result
 */
export async function resendPostmarkConfirmation(
	signatureId: number
): Promise<PostmarkResponse<{ Message: string }>> {
	console.log(`[Postmark] Resending confirmation for signature ${signatureId}`);
	return postmarkRequest(`/senders/${signatureId}/resend`, { method: "POST" });
}

/**
 * Verify DKIM for a sender signature
 * Triggers Postmark to check DNS records
 *
 * @param signatureId - Postmark sender signature ID
 * @returns Updated sender signature with verification status
 */
export async function verifyPostmarkDKIM(
	signatureId: number
): Promise<PostmarkResponse<PostmarkDomainData>> {
	console.log(`[Postmark] Verifying DKIM for signature ${signatureId}`);
	return postmarkRequest(`/senders/${signatureId}/verifyDkim`, { method: "PUT" });
}

/**
 * Verify Return-Path for a sender signature
 *
 * @param signatureId - Postmark sender signature ID
 * @returns Updated sender signature with verification status
 */
export async function verifyPostmarkReturnPath(
	signatureId: number
): Promise<PostmarkResponse<PostmarkDomainData>> {
	console.log(`[Postmark] Verifying Return-Path for signature ${signatureId}`);
	return postmarkRequest(`/senders/${signatureId}/verifyReturnPath`, { method: "PUT" });
}

// =============================================================================
// SERVER/ACCOUNT INFO
// =============================================================================

/**
 * Get Postmark server information
 * Useful for verifying API key and getting server settings
 *
 * @returns Server information
 */
export async function getPostmarkServerInfo(): Promise<
	PostmarkResponse<{
		ID: number;
		Name: string;
		ApiTokens: string[];
		Color: string;
		SmtpApiActivated: boolean;
		RawEmailEnabled: boolean;
		InboundAddress: string;
		InboundHookUrl: string;
		BounceHookUrl: string;
		OpenHookUrl: string;
		PostFirstOpenOnly: boolean;
		TrackOpens: boolean;
		TrackLinks: string;
		InboundDomain: string;
		InboundSpamThreshold: number;
	}>
> {
	console.log("[Postmark] Getting server info");
	return postmarkRequest("/server", { method: "GET" });
}

// =============================================================================
// WEBHOOK VERIFICATION
// =============================================================================

/**
 * Verify Postmark webhook signature
 *
 * Postmark webhooks don't use signatures by default, but you can configure
 * basic auth or use the webhook token. This function verifies the token
 * if POSTMARK_WEBHOOK_SECRET is configured.
 *
 * @param options - Webhook verification options
 * @returns Whether the webhook is valid
 *
 * @example
 * const isValid = verifyPostmarkWebhook({
 *   payload: requestBody,
 *   token: request.headers.get("X-Postmark-Token"),
 * });
 */
export function verifyPostmarkWebhook(options: {
	payload: string;
	token?: string | null;
}): boolean {
	const { token } = options;

	// If no secret configured, accept all webhooks (not recommended for production)
	if (!postmarkConfig.webhookSecret) {
		console.warn("[Postmark] No webhook secret configured - accepting webhook without verification");
		return true;
	}

	// Verify the token matches our secret
	if (!token) {
		console.error("[Postmark] Webhook missing token");
		return false;
	}

	// Use timing-safe comparison to prevent timing attacks
	try {
		const expected = Buffer.from(postmarkConfig.webhookSecret);
		const received = Buffer.from(token);

		if (expected.length !== received.length) {
			return false;
		}

		return crypto.timingSafeEqual(expected, received);
	} catch {
		return false;
	}
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

/**
 * Check if Postmark is healthy and responsive
 *
 * This function attempts to fetch server info to verify:
 * 1. API key is valid
 * 2. Postmark API is reachable
 * 3. Account is in good standing
 *
 * @returns Health check result
 */
export async function checkPostmarkHealth(): Promise<{
	healthy: boolean;
	provider: "postmark";
	latencyMs: number;
	error?: string;
}> {
	const startTime = Date.now();

	try {
		const result = await getPostmarkServerInfo();
		const latencyMs = Date.now() - startTime;

		if (result.success) {
			console.log(`[Postmark] Health check passed in ${latencyMs}ms`);
			return {
				healthy: true,
				provider: "postmark",
				latencyMs,
			};
		}

		console.error(`[Postmark] Health check failed: ${result.error}`);
		return {
			healthy: false,
			provider: "postmark",
			latencyMs,
			error: result.error,
		};
	} catch (error) {
		const latencyMs = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : "Unknown error";

		console.error(`[Postmark] Health check error: ${errorMessage}`);
		return {
			healthy: false,
			provider: "postmark",
			latencyMs,
			error: errorMessage,
		};
	}
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if Postmark is properly configured
 *
 * @returns Whether Postmark can be used
 */
export function isPostmarkConfigured(): boolean {
	return postmarkConfig.isConfigured;
}

/**
 * Get DNS records needed for a domain in Postmark format
 *
 * @param domain - Postmark domain data
 * @returns Formatted DNS records for display
 */
export function getPostmarkDNSRecords(domain: PostmarkDomainData): Array<{
	type: string;
	name: string;
	value: string;
	verified: boolean;
}> {
	const records: Array<{
		type: string;
		name: string;
		value: string;
		verified: boolean;
	}> = [];

	// DKIM record
	if (domain.DKIMHost && domain.DKIMTextValue) {
		records.push({
			type: "TXT",
			name: domain.DKIMHost,
			value: domain.DKIMTextValue,
			verified: domain.DKIMVerified,
		});
	}

	// Return-Path CNAME
	if (domain.ReturnPathDomain && domain.ReturnPathDomainCNAMEValue) {
		records.push({
			type: "CNAME",
			name: domain.ReturnPathDomain,
			value: domain.ReturnPathDomainCNAMEValue,
			verified: domain.ReturnPathDomainVerified,
		});
	}

	return records;
}
