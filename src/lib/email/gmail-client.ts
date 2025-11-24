/**
 * Gmail API Client (Company-Level / Multi-Tenant)
 *
 * This module provides Gmail API integration for companies that choose to
 * send emails through their own Gmail account instead of managed providers.
 *
 * Multi-Tenant Architecture:
 * - Each company can configure their own email provider
 * - Options: 'managed' (Resend/Postmark), 'gmail', or 'disabled'
 * - Gmail tokens stored per-company in company_gmail_tokens table
 *
 * Key Features:
 * - Send emails via company's Gmail API
 * - Automatic token refresh before expiration
 * - Token validation and error handling
 * - Integration with provider monitoring
 *
 * How It Works:
 * 1. Company admin connects Gmail via OAuth (grants gmail.send scope)
 * 2. Tokens stored in company_gmail_tokens table
 * 3. Before sending, we check/refresh tokens
 * 4. Use Gmail API to send email as company
 *
 * Rate Limits (Gmail API):
 * - Consumer accounts: 100 emails/day
 * - Google Workspace: 2,000 emails/day
 * - Per-minute limit: 100 messages
 *
 * Required Scopes:
 * - https://www.googleapis.com/auth/gmail.send
 *
 * Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID
 * - GOOGLE_CLIENT_SECRET: OAuth client secret
 *
 * @see https://developers.google.com/gmail/api/reference/rest
 */

"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Company email provider options
 */
export type CompanyEmailProvider = "managed" | "gmail" | "disabled";

/**
 * Gmail OAuth token data structure (company-level)
 */
export interface CompanyGmailTokenData {
	companyId: string;
	gmailEmail: string;
	gmailDisplayName?: string;
	accessToken: string;
	refreshToken: string;
	tokenExpiresAt: Date;
	isValid: boolean;
	scopes: string[];
	connectedBy?: string;
	connectedByName?: string;
}

/**
 * Result of sending an email via Gmail
 */
export interface GmailSendResult {
	success: boolean;
	messageId?: string;
	threadId?: string;
	error?: string;
	labelIds?: string[];
}

/**
 * Email data for Gmail sending
 */
export interface GmailEmailData {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
	replyTo?: string;
	cc?: string | string[];
	bcc?: string | string[];
	headers?: Record<string, string>;
}

/**
 * Token refresh response from Google
 */
interface GoogleTokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope?: string;
	refresh_token?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_API_URL = "https://gmail.googleapis.com/gmail/v1";
const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

// =============================================================================
// COMPANY EMAIL PROVIDER PREFERENCE
// =============================================================================

/**
 * Get company's email provider preference
 */
export async function getCompanyEmailProvider(
	companyId: string
): Promise<CompanyEmailProvider> {
	try {
		const supabase = await createServiceSupabaseClient();
		const { data } = await supabase
			.from("companies")
			.select("email_provider")
			.eq("id", companyId)
			.single();

		return (data?.email_provider as CompanyEmailProvider) || "managed";
	} catch (error) {
		console.error("[Gmail] Error getting company email provider:", error);
		return "managed";
	}
}

/**
 * Set company's email provider preference
 */
export async function setCompanyEmailProvider(
	companyId: string,
	provider: CompanyEmailProvider,
	updatedByUserId?: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// If switching to Gmail, verify tokens exist
		if (provider === "gmail") {
			const tokens = await getCompanyGmailTokens(companyId);
			if (!tokens || !tokens.isValid) {
				return {
					success: false,
					error: "Gmail is not connected. Please connect Gmail first.",
				};
			}
		}

		const supabase = await createServiceSupabaseClient();
		const { error } = await supabase
			.from("companies")
			.update({
				email_provider: provider,
				email_provider_updated_at: new Date().toISOString(),
				email_provider_updated_by: updatedByUserId || null,
			})
			.eq("id", companyId);

		if (error) {
			return { success: false, error: error.message };
		}

		console.log(`[Gmail] Company ${companyId} email provider set to: ${provider}`);
		return { success: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return { success: false, error: message };
	}
}

// =============================================================================
// TOKEN MANAGEMENT (COMPANY-LEVEL)
// =============================================================================

/**
 * Get Gmail tokens for a company
 */
export async function getCompanyGmailTokens(
	companyId: string
): Promise<CompanyGmailTokenData | null> {
	try {
		const supabase = await createServiceSupabaseClient();

		const { data, error } = await supabase
			.from("company_gmail_tokens")
			.select("*")
			.eq("company_id", companyId)
			.maybeSingle();

		if (error || !data) {
			return null;
		}

		const tokenData: CompanyGmailTokenData = {
			companyId: data.company_id,
			gmailEmail: data.gmail_email,
			gmailDisplayName: data.gmail_display_name,
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			tokenExpiresAt: new Date(data.token_expires_at),
			isValid: data.is_valid,
			scopes: data.scopes || [GMAIL_SEND_SCOPE],
			connectedBy: data.connected_by,
			connectedByName: data.connected_by_name,
		};

		// Check if token needs refresh
		if (isTokenExpiringSoon(tokenData.tokenExpiresAt)) {
			console.log(`[Gmail] Token expiring soon for company ${companyId}, refreshing...`);
			const refreshed = await refreshCompanyGmailToken(companyId, tokenData.refreshToken);
			if (refreshed) {
				return refreshed;
			}
			console.warn("[Gmail] Token refresh failed, using existing token");
		}

		return tokenData;
	} catch (error) {
		console.error("[Gmail] Error getting company tokens:", error);
		return null;
	}
}

function isTokenExpiringSoon(expiresAt: Date): boolean {
	return expiresAt.getTime() - Date.now() < TOKEN_REFRESH_BUFFER_MS;
}

/**
 * Refresh Gmail OAuth token for a company
 */
export async function refreshCompanyGmailToken(
	companyId: string,
	refreshToken: string
): Promise<CompanyGmailTokenData | null> {
	try {
		const clientId = process.env.GOOGLE_CLIENT_ID;
		const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			console.error("[Gmail] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
			return null;
		}

		const response = await fetch(GOOGLE_TOKEN_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refreshToken,
				grant_type: "refresh_token",
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[Gmail] Token refresh failed: ${response.status}`, errorText);
			if (response.status === 400 || response.status === 401) {
				await markCompanyTokenInvalid(companyId, `Refresh failed: ${response.status}`);
			}
			return null;
		}

		const tokenResponse: GoogleTokenResponse = await response.json();
		const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

		const supabase = await createServiceSupabaseClient();
		const { data, error } = await supabase
			.from("company_gmail_tokens")
			.update({
				access_token: tokenResponse.access_token,
				token_expires_at: expiresAt.toISOString(),
				...(tokenResponse.refresh_token && { refresh_token: tokenResponse.refresh_token }),
				is_valid: true,
				last_error: null,
			})
			.eq("company_id", companyId)
			.select("*")
			.single();

		if (error || !data) {
			console.error("[Gmail] Failed to update refreshed token:", error?.message);
			return null;
		}

		console.log(`[Gmail] Token refreshed for company ${companyId}`);

		return {
			companyId: data.company_id,
			gmailEmail: data.gmail_email,
			gmailDisplayName: data.gmail_display_name,
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			tokenExpiresAt: new Date(data.token_expires_at),
			isValid: data.is_valid,
			scopes: data.scopes || [GMAIL_SEND_SCOPE],
			connectedBy: data.connected_by,
			connectedByName: data.connected_by_name,
		};
	} catch (error) {
		console.error("[Gmail] Token refresh error:", error);
		return null;
	}
}

async function markCompanyTokenInvalid(companyId: string, reason: string): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		await supabase
			.from("company_gmail_tokens")
			.update({ is_valid: false, last_error: reason })
			.eq("company_id", companyId);
		console.log(`[Gmail] Marked token invalid for company ${companyId}: ${reason}`);
	} catch (error) {
		console.error("[Gmail] Failed to mark token invalid:", error);
	}
}

/**
 * Store Gmail OAuth tokens for a company
 */
export async function storeCompanyGmailTokens(
	companyId: string,
	gmailEmail: string,
	displayName: string | null,
	accessToken: string,
	refreshToken: string,
	expiresIn: number,
	scopes: string[],
	connectedByUserId?: string,
	connectedByName?: string
): Promise<{ success: boolean; error?: string }> {
	try {
		if (!scopes.includes(GMAIL_SEND_SCOPE)) {
			return { success: false, error: `Missing required scope: ${GMAIL_SEND_SCOPE}` };
		}

		const supabase = await createServiceSupabaseClient();
		const expiresAt = new Date(Date.now() + expiresIn * 1000);

		const { error } = await supabase.from("company_gmail_tokens").upsert(
			{
				company_id: companyId,
				gmail_email: gmailEmail,
				gmail_display_name: displayName,
				access_token: accessToken,
				refresh_token: refreshToken,
				token_expires_at: expiresAt.toISOString(),
				scopes,
				is_valid: true,
				last_error: null,
				connected_by: connectedByUserId || null,
				connected_by_name: connectedByName || null,
			},
			{ onConflict: "company_id" }
		);

		if (error) {
			console.error("[Gmail] Failed to store tokens:", error.message);
			return { success: false, error: error.message };
		}

		console.log(`[Gmail] Stored tokens for company ${companyId} (${gmailEmail})`);
		return { success: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return { success: false, error: message };
	}
}

/**
 * Disconnect Gmail from a company
 */
export async function disconnectCompanyGmail(
	companyId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		// Get token to revoke
		const { data: tokenData } = await supabase
			.from("company_gmail_tokens")
			.select("access_token")
			.eq("company_id", companyId)
			.single();

		// Delete from database
		const { error } = await supabase
			.from("company_gmail_tokens")
			.delete()
			.eq("company_id", companyId);

		if (error) {
			return { success: false, error: error.message };
		}

		// Reset to managed provider
		await setCompanyEmailProvider(companyId, "managed");

		// Revoke token with Google (best effort)
		if (tokenData?.access_token) {
			try {
				await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
					method: "POST",
				});
			} catch {
				console.warn("[Gmail] Token revocation request failed (non-critical)");
			}
		}

		console.log(`[Gmail] Disconnected Gmail for company ${companyId}`);
		return { success: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return { success: false, error: message };
	}
}

// =============================================================================
// EMAIL SENDING
// =============================================================================

/**
 * Send an email via company's Gmail
 */
export async function sendCompanyGmailEmail(
	companyId: string,
	emailData: GmailEmailData
): Promise<GmailSendResult> {
	try {
		const tokens = await getCompanyGmailTokens(companyId);
		if (!tokens) {
			return { success: false, error: "Gmail not connected for this company" };
		}

		if (!tokens.isValid) {
			return { success: false, error: `Gmail connection invalid: ${tokens.gmailEmail}` };
		}

		const mimeMessage = buildMimeMessage({
			from: tokens.gmailDisplayName
				? `${tokens.gmailDisplayName} <${tokens.gmailEmail}>`
				: tokens.gmailEmail,
			to: Array.isArray(emailData.to) ? emailData.to.join(", ") : emailData.to,
			subject: emailData.subject,
			html: emailData.html,
			text: emailData.text,
			replyTo: emailData.replyTo,
			cc: emailData.cc ? (Array.isArray(emailData.cc) ? emailData.cc.join(", ") : emailData.cc) : undefined,
			bcc: emailData.bcc ? (Array.isArray(emailData.bcc) ? emailData.bcc.join(", ") : emailData.bcc) : undefined,
			headers: emailData.headers,
		});

		const encodedMessage = base64UrlEncode(mimeMessage);

		const response = await fetch(`${GMAIL_API_URL}/users/me/messages/send`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ raw: encodedMessage }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMessage = errorData.error?.message || `Gmail API error: ${response.status}`;
			console.error(`[Gmail] Send failed: ${errorMessage}`);
			if (response.status === 401) {
				await markCompanyTokenInvalid(companyId, "Authentication failed");
			}
			return { success: false, error: errorMessage };
		}

		const result = await response.json();

		// Update last used timestamp
		const supabase = await createServiceSupabaseClient();
		await supabase
			.from("company_gmail_tokens")
			.update({ last_used_at: new Date().toISOString() })
			.eq("company_id", companyId);

		console.log(`[Gmail] Sent email for company ${companyId} (ID: ${result.id})`);

		return {
			success: true,
			messageId: result.id,
			threadId: result.threadId,
			labelIds: result.labelIds,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[Gmail] Send error:", message);
		return { success: false, error: message };
	}
}

// =============================================================================
// MIME MESSAGE BUILDING
// =============================================================================

interface MimeMessageParts {
	from: string;
	to: string;
	subject: string;
	html: string;
	text?: string;
	replyTo?: string;
	cc?: string;
	bcc?: string;
	headers?: Record<string, string>;
}

function buildMimeMessage(parts: MimeMessageParts): string {
	const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(7)}`;

	const lines: string[] = [
		`From: ${parts.from}`,
		`To: ${parts.to}`,
		`Subject: =?UTF-8?B?${Buffer.from(parts.subject).toString("base64")}?=`,
		"MIME-Version: 1.0",
	];

	if (parts.replyTo) lines.push(`Reply-To: ${parts.replyTo}`);
	if (parts.cc) lines.push(`Cc: ${parts.cc}`);
	if (parts.bcc) lines.push(`Bcc: ${parts.bcc}`);

	if (parts.headers) {
		for (const [key, value] of Object.entries(parts.headers)) {
			lines.push(`${key}: ${value}`);
		}
	}

	lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
	lines.push("");

	const textContent = parts.text || extractTextFromHtml(parts.html);
	lines.push(`--${boundary}`);
	lines.push("Content-Type: text/plain; charset=UTF-8");
	lines.push("Content-Transfer-Encoding: base64");
	lines.push("");
	lines.push(Buffer.from(textContent).toString("base64"));

	lines.push(`--${boundary}`);
	lines.push("Content-Type: text/html; charset=UTF-8");
	lines.push("Content-Transfer-Encoding: base64");
	lines.push("");
	lines.push(Buffer.from(parts.html).toString("base64"));

	lines.push(`--${boundary}--`);

	return lines.join("\r\n");
}

function extractTextFromHtml(html: string): string {
	return html
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function base64UrlEncode(str: string): string {
	return Buffer.from(str)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

/**
 * Check Gmail health for a company
 */
export async function checkCompanyGmailHealth(
	companyId: string,
	testApi: boolean = false
): Promise<{
	connected: boolean;
	email?: string;
	displayName?: string;
	tokenValid: boolean;
	tokenExpiresAt?: Date;
	apiHealthy?: boolean;
	connectedBy?: string;
	error?: string;
}> {
	try {
		const tokens = await getCompanyGmailTokens(companyId);

		if (!tokens) {
			return { connected: false, tokenValid: false };
		}

		const result = {
			connected: true,
			email: tokens.gmailEmail,
			displayName: tokens.gmailDisplayName,
			tokenValid: tokens.isValid,
			tokenExpiresAt: tokens.tokenExpiresAt,
			connectedBy: tokens.connectedByName,
			apiHealthy: undefined as boolean | undefined,
		};

		if (testApi && tokens.isValid) {
			try {
				const response = await fetch(`${GMAIL_API_URL}/users/me/profile`, {
					headers: { Authorization: `Bearer ${tokens.accessToken}` },
				});
				result.apiHealthy = response.ok;
			} catch {
				result.apiHealthy = false;
			}
		}

		return result;
	} catch (error) {
		return {
			connected: false,
			tokenValid: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

// =============================================================================
// INTEGRATION AVAILABILITY CHECK
// =============================================================================

/**
 * Check if Gmail integration is available (env vars configured)
 */
export async function isGmailIntegrationEnabled(): Promise<boolean> {
	return !!(
		process.env.GOOGLE_CLIENT_ID &&
		process.env.GOOGLE_CLIENT_SECRET &&
		process.env.NEXT_PUBLIC_APP_URL
	);
}
