/**
 * Gmail API Client (Company-Level & Per-User / Multi-Tenant)
 *
 * CRITICAL: Reply-to addresses ALWAYS use the platform subdomain (mail.thorbis.com),
 * even when sending from personal Gmail. This ensures replies go to the company's
 * centralized inbox, not the personal Gmail account.
 *
 * Example:
 * - FROM: john@gmail.com (personal Gmail)
 * - REPLY-TO: support@acme-plumbing.mail.thorbis.com (platform subdomain)
 *
 * See: /docs/email/REPLY_TO_ARCHITECTURE.md for full details
 *
 * This module provides Gmail API integration at two levels:
 * 1. Company-Level: One Gmail account for the entire company (sending only)
 * 2. Per-User: Individual team member Gmail accounts (inbox access + sending)
 *
 * Multi-Tenant Architecture:
 * - Each company can configure their own email provider
 * - Options: 'managed' (Resend/Postmark), 'gmail', or 'disabled'
 * - Company tokens stored in company_gmail_tokens table
 * - Per-user tokens stored in user_gmail_tokens table
 *
 * Key Features:
 * - Send emails via company's Gmail API
 * - Per-user inbox access and synchronization
 * - Automatic token refresh before expiration
 * - Token validation and error handling
 * - Integration with provider monitoring
 *
 * How It Works (Company-Level):
 * 1. Company admin connects Gmail via OAuth (grants gmail.send scope)
 * 2. Tokens stored in company_gmail_tokens table
 * 3. Before sending, we check/refresh tokens
 * 4. Use Gmail API to send email as company
 *
 * How It Works (Per-User):
 * 1. Team member connects their Gmail via OAuth (grants gmail.readonly + gmail.send)
 * 2. Tokens stored in user_gmail_tokens table
 * 3. Background sync job fetches inbox emails every 5-10 minutes
 * 4. Emails stored in communications table with mailbox_owner_id
 * 5. Role-based permissions control who can see which emails
 *
 * Rate Limits (Gmail API):
 * - Consumer accounts: 100 emails/day
 * - Google Workspace: 2,000 emails/day
 * - Per-minute limit: 100 messages
 *
 * Required Scopes:
 * - Company: https://www.googleapis.com/auth/gmail.send
 * - Per-User: https://www.googleapis.com/auth/gmail.readonly, gmail.send
 *
 * Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID
 * - GOOGLE_CLIENT_SECRET: OAuth client secret
 *
 * @see https://developers.google.com/gmail/api/reference/rest
 */

"use server";

import {
	logAuditEvent,
	logGmailConnected,
	logGmailDisconnected,
	logSyncFailed,
	logTokenRefreshFailed,
} from "@/lib/email/audit-logger";
import {
	acquireSyncLock,
	checkApiRateLimit,
	checkSyncRateLimit,
	releaseSyncLock,
	validateSyncParams,
} from "@/lib/email/gmail-rate-limiter";
import { decryptToken, encryptToken } from "@/lib/email/token-encryption";
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

/**
 * Per-user Gmail token data structure
 */
export interface UserGmailTokenData {
	teamMemberId: string;
	emailAccountId: string;
	gmailEmail: string;
	accessToken: string;
	refreshToken: string;
	tokenExpiresAt: Date;
	scopes: string[];
	syncEnabled: boolean;
	lastSyncedAt?: Date;
}

/**
 * Gmail message from API
 */
export interface GmailMessage {
	id: string;
	threadId: string;
	labelIds: string[];
	snippet: string;
	payload: {
		headers: Array<{ name: string; value: string }>;
		parts?: Array<{
			mimeType: string;
			body: { data?: string; size: number };
			parts?: any[];
		}>;
		body?: { data?: string; size: number };
		mimeType: string;
	};
	internalDate: string;
	sizeEstimate: number;
}

/**
 * Parsed email message
 */
export interface ParsedGmailMessage {
	gmailMessageId: string;
	gmailThreadId: string;
	from: string;
	to: string[];
	cc?: string[];
	subject: string;
	textBody?: string;
	htmlBody?: string;
	receivedAt: Date;
	hasAttachments: boolean;
	labels: string[];
}

/**
 * Inbox sync result
 */
export interface InboxSyncResult {
	success: boolean;
	messagesFetched: number;
	messagesStored: number;
	errors: string[];
	lastSyncedAt: Date;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_API_URL = "https://gmail.googleapis.com/gmail/v1";
const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const GMAIL_MODIFY_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

// =============================================================================
// COMPANY EMAIL PROVIDER PREFERENCE
// =============================================================================

/**
 * Get company's email provider preference
 */
export async function getCompanyEmailProvider(
	companyId: string,
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
	updatedByUserId?: string,
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

		console.log(
			`[Gmail] Company ${companyId} email provider set to: ${provider}`,
		);
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
	companyId: string,
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
			console.log(
				`[Gmail] Token expiring soon for company ${companyId}, refreshing...`,
			);
			const refreshed = await refreshCompanyGmailToken(
				companyId,
				tokenData.refreshToken,
			);
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
	refreshToken: string,
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
			console.error(
				`[Gmail] Token refresh failed: ${response.status}`,
				errorText,
			);
			if (response.status === 400 || response.status === 401) {
				await markCompanyTokenInvalid(
					companyId,
					`Refresh failed: ${response.status}`,
				);
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
				...(tokenResponse.refresh_token && {
					refresh_token: tokenResponse.refresh_token,
				}),
				is_valid: true,
				last_error: null,
			})
			.eq("company_id", companyId)
			.select("*")
			.single();

		if (error || !data) {
			console.error(
				"[Gmail] Failed to update refreshed token:",
				error?.message,
			);
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

async function markCompanyTokenInvalid(
	companyId: string,
	reason: string,
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		await supabase
			.from("company_gmail_tokens")
			.update({ is_valid: false, last_error: reason })
			.eq("company_id", companyId);
		console.log(
			`[Gmail] Marked token invalid for company ${companyId}: ${reason}`,
		);
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
	connectedByName?: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		if (!scopes.includes(GMAIL_SEND_SCOPE)) {
			return {
				success: false,
				error: `Missing required scope: ${GMAIL_SEND_SCOPE}`,
			};
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
			{ onConflict: "company_id" },
		);

		if (error) {
			console.error("[Gmail] Failed to store tokens:", error.message);
			return { success: false, error: error.message };
		}

		console.log(
			`[Gmail] Stored tokens for company ${companyId} (${gmailEmail})`,
		);
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
	companyId: string,
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
				await fetch(
					`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`,
					{
						method: "POST",
					},
				);
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
	emailData: GmailEmailData,
): Promise<GmailSendResult> {
	try {
		const tokens = await getCompanyGmailTokens(companyId);
		if (!tokens) {
			return { success: false, error: "Gmail not connected for this company" };
		}

		if (!tokens.isValid) {
			return {
				success: false,
				error: `Gmail connection invalid: ${tokens.gmailEmail}`,
			};
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
			cc: emailData.cc
				? Array.isArray(emailData.cc)
					? emailData.cc.join(", ")
					: emailData.cc
				: undefined,
			bcc: emailData.bcc
				? Array.isArray(emailData.bcc)
					? emailData.bcc.join(", ")
					: emailData.bcc
				: undefined,
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
			const errorMessage =
				errorData.error?.message || `Gmail API error: ${response.status}`;
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

		console.log(
			`[Gmail] Sent email for company ${companyId} (ID: ${result.id})`,
		);

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
	testApi: boolean = false,
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
// PER-USER TOKEN MANAGEMENT
// =============================================================================

/**
 * Get Gmail tokens for a specific team member
 */
export async function getUserGmailTokens(
	teamMemberId: string,
): Promise<UserGmailTokenData | null> {
	try {
		const supabase = await createServiceSupabaseClient();

		const { data, error } = await supabase
			.from("user_gmail_tokens")
			.select("*, user_email_accounts!inner(email_address)")
			.eq("team_member_id", teamMemberId)
			.eq("sync_enabled", true)
			.maybeSingle();

		if (error || !data) {
			return null;
		}

		// Decrypt tokens before using (CRITICAL SECURITY)
		const decryptedAccessToken = decryptToken(data.access_token);
		const decryptedRefreshToken = decryptToken(data.refresh_token);

		const tokenData: UserGmailTokenData = {
			teamMemberId: data.team_member_id,
			emailAccountId: data.user_email_account_id,
			gmailEmail: data.user_email_accounts.email_address,
			accessToken: decryptedAccessToken,
			refreshToken: decryptedRefreshToken,
			tokenExpiresAt: new Date(data.token_expiry),
			scopes: data.scopes || [],
			syncEnabled: data.sync_enabled,
			lastSyncedAt: data.last_synced_at
				? new Date(data.last_synced_at)
				: undefined,
		};

		// Check if token needs refresh
		if (isTokenExpiringSoon(tokenData.tokenExpiresAt)) {
			console.log(
				`[Gmail] Token expiring soon for user ${teamMemberId}, refreshing...`,
			);
			const refreshed = await refreshUserGmailToken(
				teamMemberId,
				tokenData.refreshToken,
			);
			if (refreshed) {
				return refreshed;
			}
			console.warn("[Gmail] User token refresh failed, using existing token");
		}

		return tokenData;
	} catch (error) {
		console.error("[Gmail] Error getting user tokens:", error);
		return null;
	}
}

/**
 * Refresh Gmail OAuth token for a team member
 */
export async function refreshUserGmailToken(
	teamMemberId: string,
	refreshToken: string,
): Promise<UserGmailTokenData | null> {
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
			console.error(
				`[Gmail] User token refresh failed: ${response.status}`,
				errorText,
			);

			// Log token refresh failure for audit trail
			await logTokenRefreshFailed(
				teamMemberId,
				"Unknown", // Gmail email not available here
				`Token refresh failed: ${response.status} - ${errorText}`,
			);

			if (response.status === 400 || response.status === 401) {
				await markUserTokenInvalid(
					teamMemberId,
					`Refresh failed: ${response.status}`,
				);
			}
			return null;
		}

		const tokenResponse: GoogleTokenResponse = await response.json();
		const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

		// Encrypt refreshed tokens before storing (CRITICAL SECURITY)
		const encryptedAccessToken = encryptToken(tokenResponse.access_token);
		const encryptedRefreshToken = tokenResponse.refresh_token
			? encryptToken(tokenResponse.refresh_token)
			: undefined;

		const supabase = await createServiceSupabaseClient();
		const { data, error } = await supabase
			.from("user_gmail_tokens")
			.update({
				access_token: encryptedAccessToken,
				token_expiry: expiresAt.toISOString(),
				...(encryptedRefreshToken && { refresh_token: encryptedRefreshToken }),
			})
			.eq("team_member_id", teamMemberId)
			.select("*, user_email_accounts!inner(email_address)")
			.single();

		if (error || !data) {
			console.error(
				"[Gmail] Failed to update refreshed user token:",
				error?.message,
			);
			return null;
		}

		console.log(`[Gmail] User token refreshed for team member ${teamMemberId}`);

		// Decrypt tokens for return (already encrypted in DB)
		const decryptedAccessToken = decryptToken(data.access_token);
		const decryptedRefreshToken = decryptToken(data.refresh_token);

		return {
			teamMemberId: data.team_member_id,
			emailAccountId: data.user_email_account_id,
			gmailEmail: data.user_email_accounts.email_address,
			accessToken: decryptedAccessToken,
			refreshToken: decryptedRefreshToken,
			tokenExpiresAt: new Date(data.token_expiry),
			scopes: data.scopes || [],
			syncEnabled: data.sync_enabled,
			lastSyncedAt: data.last_synced_at
				? new Date(data.last_synced_at)
				: undefined,
		};
	} catch (error) {
		console.error("[Gmail] User token refresh error:", error);
		return null;
	}
}

async function markUserTokenInvalid(
	teamMemberId: string,
	reason: string,
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		await supabase
			.from("user_gmail_tokens")
			.update({ sync_enabled: false })
			.eq("team_member_id", teamMemberId);
		console.log(
			`[Gmail] Disabled sync for team member ${teamMemberId}: ${reason}`,
		);
	} catch (error) {
		console.error("[Gmail] Failed to mark user token invalid:", error);
	}
}

/**
 * Store Gmail OAuth tokens for a team member
 */
export async function storeUserGmailTokens(
	teamMemberId: string,
	emailAccountId: string,
	accessToken: string,
	refreshToken: string,
	expiresIn: number,
	scopes: string[],
): Promise<{ success: boolean; error?: string }> {
	try {
		if (
			!scopes.includes(GMAIL_READONLY_SCOPE) &&
			!scopes.includes(GMAIL_MODIFY_SCOPE)
		) {
			return {
				success: false,
				error: `Missing required scope: ${GMAIL_READONLY_SCOPE} or ${GMAIL_MODIFY_SCOPE}`,
			};
		}

		const supabase = await createServiceSupabaseClient();
		const expiresAt = new Date(Date.now() + expiresIn * 1000);

		// Encrypt tokens before storing (CRITICAL SECURITY)
		const encryptedAccessToken = encryptToken(accessToken);
		const encryptedRefreshToken = encryptToken(refreshToken);

		const { error } = await supabase.from("user_gmail_tokens").upsert(
			{
				team_member_id: teamMemberId,
				user_email_account_id: emailAccountId,
				access_token: encryptedAccessToken,
				refresh_token: encryptedRefreshToken,
				token_expiry: expiresAt.toISOString(),
				scopes,
				sync_enabled: true,
				last_synced_at: null,
			},
			{ onConflict: "user_email_account_id" },
		);

		if (error) {
			console.error("[Gmail] Failed to store user tokens:", error.message);
			return { success: false, error: error.message };
		}

		console.log(
			`[Gmail] Stored encrypted tokens for team member ${teamMemberId}`,
		);
		return { success: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return { success: false, error: message };
	}
}

/**
 * Disconnect Gmail for a team member
 */
export async function disconnectUserGmail(
	teamMemberId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		// Get token to revoke
		const { data: tokenData } = await supabase
			.from("user_gmail_tokens")
			.select("access_token")
			.eq("team_member_id", teamMemberId)
			.single();

		// Delete from database
		const { error } = await supabase
			.from("user_gmail_tokens")
			.delete()
			.eq("team_member_id", teamMemberId);

		if (error) {
			return { success: false, error: error.message };
		}

		// Revoke token with Google (best effort)
		if (tokenData?.access_token) {
			try {
				await fetch(
					`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`,
					{
						method: "POST",
					},
				);
			} catch {
				console.warn(
					"[Gmail] User token revocation request failed (non-critical)",
				);
			}
		}

		console.log(`[Gmail] Disconnected Gmail for team member ${teamMemberId}`);
		return { success: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return { success: false, error: message };
	}
}

// =============================================================================
// INBOX FETCHING
// =============================================================================

/**
 * Fetch inbox messages for a team member
 */
export async function fetchUserInbox(
	teamMemberId: string,
	maxResults: number = 50,
	pageToken?: string,
): Promise<{
	messages: GmailMessage[];
	nextPageToken?: string;
	error?: string;
}> {
	try {
		const tokens = await getUserGmailTokens(teamMemberId);
		if (!tokens) {
			return { messages: [], error: "Gmail not connected for this user" };
		}

		// Build query parameters
		const params = new URLSearchParams({
			maxResults: maxResults.toString(),
			q: "in:inbox", // Only fetch inbox messages
			...(pageToken && { pageToken }),
		});

		// List messages
		const listResponse = await fetch(
			`${GMAIL_API_URL}/users/me/messages?${params}`,
			{
				headers: { Authorization: `Bearer ${tokens.accessToken}` },
			},
		);

		if (!listResponse.ok) {
			const errorText = await listResponse.text();
			console.error(
				`[Gmail] Inbox fetch failed: ${listResponse.status}`,
				errorText,
			);
			return { messages: [], error: `API error: ${listResponse.status}` };
		}

		const listData = await listResponse.json();
		const messageIds = listData.messages || [];
		const messages: GmailMessage[] = [];

		// Fetch full message details for each message
		for (const msgRef of messageIds) {
			const msgResponse = await fetch(
				`${GMAIL_API_URL}/users/me/messages/${msgRef.id}`,
				{
					headers: { Authorization: `Bearer ${tokens.accessToken}` },
				},
			);

			if (msgResponse.ok) {
				const msgData = await msgResponse.json();
				messages.push(msgData);
			}
		}

		return {
			messages,
			nextPageToken: listData.nextPageToken,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[Gmail] Inbox fetch error:", message);
		return { messages: [], error: message };
	}
}

/**
 * Parse Gmail message to structured format
 */
function parseGmailMessage(message: GmailMessage): ParsedGmailMessage {
	const headers = message.payload.headers;
	const getHeader = (name: string) =>
		headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ||
		"";

	const from = getHeader("From");
	const to = getHeader("To")
		.split(",")
		.map((e) => e.trim())
		.filter(Boolean);
	const cc = getHeader("Cc")
		?.split(",")
		.map((e) => e.trim())
		.filter(Boolean);
	const subject = getHeader("Subject");

	// Extract body content
	let textBody: string | undefined;
	let htmlBody: string | undefined;

	const extractBody = (part: any): void => {
		if (part.mimeType === "text/plain" && part.body?.data) {
			textBody = Buffer.from(part.body.data, "base64").toString("utf-8");
		} else if (part.mimeType === "text/html" && part.body?.data) {
			htmlBody = Buffer.from(part.body.data, "base64").toString("utf-8");
		}

		if (part.parts) {
			part.parts.forEach(extractBody);
		}
	};

	if (message.payload.parts) {
		message.payload.parts.forEach(extractBody);
	} else if (message.payload.body?.data) {
		// Single part message
		if (message.payload.mimeType === "text/plain") {
			textBody = Buffer.from(message.payload.body.data, "base64").toString(
				"utf-8",
			);
		} else if (message.payload.mimeType === "text/html") {
			htmlBody = Buffer.from(message.payload.body.data, "base64").toString(
				"utf-8",
			);
		}
	}

	return {
		gmailMessageId: message.id,
		gmailThreadId: message.threadId,
		from,
		to,
		cc,
		subject,
		textBody,
		htmlBody,
		receivedAt: new Date(parseInt(message.internalDate)),
		hasAttachments:
			message.payload.parts?.some(
				(p) => p.body.size > 0 && p.mimeType.startsWith("attachment/"),
			) || false,
		labels: message.labelIds,
	};
}

/**
 * Store Gmail message in communications table
 */
export async function storeGmailMessage(
	companyId: string,
	teamMemberId: string,
	emailAccountId: string,
	parsedMessage: ParsedGmailMessage,
): Promise<{ success: boolean; communicationId?: string; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		// Check if message already exists
		const { data: existing } = await supabase
			.from("communications")
			.select("id")
			.eq("gmail_message_id", parsedMessage.gmailMessageId)
			.maybeSingle();

		if (existing) {
			return { success: true, communicationId: existing.id };
		}

		// Extract customer email from "from" field
		const fromEmail =
			parsedMessage.from.match(/<(.+?)>/)?.[1] || parsedMessage.from;

		// Try to find customer by email
		const { data: customer } = await supabase
			.from("customers")
			.select("id")
			.eq("company_id", companyId)
			.eq("email", fromEmail)
			.maybeSingle();

		// Insert communication
		const { data: communication, error } = await supabase
			.from("communications")
			.insert({
				company_id: companyId,
				type: "email",
				direction: "inbound",
				status: "received",
				from_address: fromEmail,
				to_address: parsedMessage.to[0] || "",
				subject: parsedMessage.subject,
				body: parsedMessage.htmlBody || parsedMessage.textBody || "",
				customer_id: customer?.id || null,
				mailbox_owner_id: teamMemberId,
				email_account_id: emailAccountId,
				visibility_scope: "private", // Personal inbox emails default to private
				gmail_message_id: parsedMessage.gmailMessageId,
				gmail_thread_id: parsedMessage.gmailThreadId,
			})
			.select("id")
			.single();

		if (error) {
			console.error("[Gmail] Failed to store message:", error.message);
			return { success: false, error: error.message };
		}

		return { success: true, communicationId: communication.id };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return { success: false, error: message };
	}
}

/**
 * Sync inbox for a team member
 */
export async function syncUserInbox(
	companyId: string,
	teamMemberId: string,
): Promise<InboxSyncResult> {
	const startTime = new Date();
	let messagesFetched = 0;
	let messagesStored = 0;
	const errors: string[] = [];
	let syncLock: ReturnType<typeof acquireSyncLock> = null;

	try {
		// Check rate limit before syncing (CRITICAL SAFEGUARD)
		const rateLimitCheck = checkSyncRateLimit(teamMemberId);
		if (!rateLimitCheck.allowed) {
			await logAuditEvent(
				"sync_rate_limited",
				{
					teamMemberId,
					retryAfter: rateLimitCheck.retryAfter,
				},
				"warning",
			);

			return {
				success: false,
				messagesFetched: 0,
				messagesStored: 0,
				errors: [rateLimitCheck.reason || "Rate limit exceeded"],
				lastSyncedAt: startTime,
			};
		}

		// Acquire sync lock to prevent concurrent syncs
		syncLock = acquireSyncLock(teamMemberId);
		if (!syncLock) {
			return {
				success: false,
				messagesFetched: 0,
				messagesStored: 0,
				errors: [
					"Could not acquire sync lock - another sync may be in progress",
				],
				lastSyncedAt: startTime,
			};
		}

		await logAuditEvent("sync_started", { teamMemberId }, "info");

		const tokens = await getUserGmailTokens(teamMemberId);
		if (!tokens) {
			return {
				success: false,
				messagesFetched: 0,
				messagesStored: 0,
				errors: ["Gmail not connected"],
				lastSyncedAt: startTime,
			};
		}

		// Fetch messages since last sync (or all if never synced)
		let pageToken: string | undefined;
		let hasMore = true;

		while (hasMore) {
			const { messages, nextPageToken, error } = await fetchUserInbox(
				teamMemberId,
				50,
				pageToken,
			);

			if (error) {
				errors.push(error);
				break;
			}

			messagesFetched += messages.length;

			// Store each message
			for (const message of messages) {
				const parsed = parseGmailMessage(message);
				const { success, error: storeError } = await storeGmailMessage(
					companyId,
					teamMemberId,
					tokens.emailAccountId,
					parsed,
				);

				if (success) {
					messagesStored++;
				} else if (storeError) {
					errors.push(storeError);
				}
			}

			// Continue to next page if available
			pageToken = nextPageToken;
			hasMore = !!nextPageToken && messages.length > 0;
		}

		// Update last synced timestamp
		const supabase = await createServiceSupabaseClient();
		await supabase
			.from("user_gmail_tokens")
			.update({ last_synced_at: startTime.toISOString() })
			.eq("team_member_id", teamMemberId);

		console.log(
			`[Gmail] Synced ${messagesStored}/${messagesFetched} messages for team member ${teamMemberId}`,
		);

		// Log successful sync
		await logAuditEvent(
			"sync_completed",
			{
				teamMemberId,
				syncMessageCount: messagesStored,
			},
			"info",
		);

		return {
			success: errors.length === 0,
			messagesFetched,
			messagesStored,
			errors,
			lastSyncedAt: startTime,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		errors.push(message);

		// Log failed sync
		await logAuditEvent(
			"sync_failed",
			{
				teamMemberId,
				error: message,
			},
			"error",
		);

		return {
			success: false,
			messagesFetched,
			messagesStored,
			errors,
			lastSyncedAt: startTime,
		};
	} finally {
		// Always release sync lock (CRITICAL)
		if (syncLock) {
			releaseSyncLock(syncLock);
		}
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
