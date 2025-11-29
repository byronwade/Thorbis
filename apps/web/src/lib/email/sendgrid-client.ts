/**
 * SendGrid Client Configuration
 *
 * Multi-tenant SendGrid client that retrieves credentials per-company.
 * Uses API keys stored in company_twilio_settings table (since SendGrid is owned by Twilio).
 *
 * Environment variables are used for global admin operations.
 * Per-company credentials are stored in company_twilio_settings.sendgrid_api_key
 */

import { MailService, type MailDataRequired } from "@sendgrid/mail";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { env } from "@stratos/config/env";

// Global SendGrid config (for admin operations only)
// Note: For multi-tenant operations, use company-specific settings from database
export const SENDGRID_ADMIN_CONFIG = {
	apiKey: env.resend.apiKey || undefined, // Note: SendGrid uses Resend API key in this codebase
	webhookSecret: env.resend.webhookSecret || undefined,
	// defaultFrom removed - use company-specific from addresses from database
	defaultFromName: env.resend.fromName || "Thorbis",
};

// SendGrid client cache (keyed by company ID)
const clientCache = new Map<string, MailService>();

/**
 * Company SendGrid settings from database
 */
export type CompanySendGridSettings = {
	company_id: string;
	sendgrid_api_key: string | null;
	sendgrid_from_email: string | null;
	sendgrid_from_name: string | null;
};

/**
 * Get SendGrid settings for a company
 */
async function getCompanySendGridSettings(
	companyId: string,
): Promise<CompanySendGridSettings | null> {
	const supabase = createServiceSupabaseClient();
	if (!supabase) return null;

	const { data, error } = await supabase
		.from("company_twilio_settings")
		.select("company_id, sendgrid_api_key, sendgrid_from_email, sendgrid_from_name")
		.eq("company_id", companyId)
		.eq("is_active", true)
		.single();

	if (error || !data) {
		console.error(`Failed to get SendGrid settings for company ${companyId}:`, error);
		return null;
	}

	return data as CompanySendGridSettings;
}

/**
 * Create SendGrid client for a company
 */
async function createSendGridClient(
	companyId: string,
): Promise<MailService | null> {
	// Check cache first
	const cached = clientCache.get(companyId);
	if (cached) return cached;

	const settings = await getCompanySendGridSettings(companyId);
	if (!settings || !settings.sendgrid_api_key) {
		console.error(
			`No SendGrid API key found for company ${companyId}. Please configure SendGrid in Settings > Communications > Email Provider.`,
		);
		return null;
	}

	// Create an isolated client per company to avoid cross-tenant leakage
	const client = new MailService();
	client.setApiKey(settings.sendgrid_api_key);

	clientCache.set(companyId, client);

	return client;
}

/**
 * Clear cached client for a company (use when credentials change)
 */
function clearSendGridClientCache(companyId: string): void {
	clientCache.delete(companyId);
}

/**
 * Create admin SendGrid client (uses environment variables)
 * Only use for global operations, not per-company
 */
export function createAdminSendGridClient(): MailService | null {
	if (!SENDGRID_ADMIN_CONFIG.apiKey) {
		console.error("Admin SendGrid credentials not configured");
		return null;
	}

	const client = new MailService();
	client.setApiKey(SENDGRID_ADMIN_CONFIG.apiKey);
	return client;
}

/**
 * Check if SendGrid is configured for admin use
 */
export function isAdminSendGridConfigured(): boolean {
	return !!SENDGRID_ADMIN_CONFIG.apiKey;
}

/**
 * Check if company has SendGrid configured
 */
export async function isCompanySendGridConfigured(companyId: string): Promise<boolean> {
	const settings = await getCompanySendGridSettings(companyId);
	return !!(settings?.sendgrid_api_key);
}

// Email configuration
// Note: 'from' is now company-specific and retrieved from database
export const sendgridConfig = {
	// from removed - use company-specific from addresses from database via getCompanyEmailIdentity
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
	appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
};

/**
 * Send email via SendGrid (multi-tenant)
 */
export async function sendSendGridEmail(params: {
	companyId: string;
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
	from?: string;
	replyTo?: string;
	tags?: Record<string, string>;
	attachments?: Array<{
		filename: string;
		content: string; // Base64
		type?: string;
	}>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
	const { companyId, to, subject, html, text, from, replyTo, tags, attachments } = params;

	const client = await createSendGridClient(companyId);
	if (!client) {
		return {
			success: false,
			error: "SendGrid not configured for this company. Please add a SendGrid API key in your company settings (Settings > Communications > Email Provider).",
		};
	}

	const settings = await getCompanySendGridSettings(companyId);
	// Get from email from company settings or company_email_domains (multi-tenant)
	let fromEmail = settings?.sendgrid_from_email;
	if (!fromEmail) {
		// Fallback to company_email_domains if not in twilio_settings
		const supabase = createServiceSupabaseClient();
		if (supabase) {
			const { data: domain } = await supabase
				.from("company_email_domains")
				.select("domain_name, subdomain")
				.eq("company_id", companyId)
				.eq("status", "verified")
				.eq("sending_enabled", true)
				.order("is_platform_subdomain", { ascending: true })
				.limit(1)
				.maybeSingle();
			if (domain) {
				fromEmail = `notifications@${domain.subdomain}.${domain.domain_name}`;
			}
		}
	}
	// Final fallback only for admin/system emails (should rarely be used)
	const fromEmailFinal = fromEmail || "noreply@thorbis.com";
	const fromName = SENDGRID_ADMIN_CONFIG.defaultFromName;
	const fromAddress = from || `${fromName} <${fromEmailFinal}>`;

	try {
		const msg: MailDataRequired = {
			to: Array.isArray(to) ? to : [to],
			from: fromAddress,
			subject,
			html,
			text: text || "",
		};

		if (replyTo) {
			msg.replyTo = replyTo;
		}

		// Add custom args for tracking
		if (tags) {
			msg.customArgs = tags;
		}

		// Add attachments
		if (attachments && attachments.length > 0) {
			msg.attachments = attachments.map(att => ({
				filename: att.filename,
				content: att.content,
				type: att.type || "application/octet-stream",
				disposition: "attachment" as const,
			}));
		}

		const [response] = await client.send(msg);

		// SendGrid returns message ID in x-message-id header
		const messageId = response.headers["x-message-id"] as string | undefined;

		return {
			success: true,
			messageId: messageId || `sg-${Date.now()}`,
		};
	} catch (error: any) {
		console.error("SendGrid send error:", error);

		// Extract error message from SendGrid error response
		const errorMessage = error?.response?.body?.errors?.[0]?.message
			|| error?.message
			|| "Failed to send email";

		return {
			success: false,
			error: errorMessage,
		};
	}
}

/**
 * Send batch emails via SendGrid (multi-tenant)
 */
async function sendSendGridBatchEmails(params: {
	companyId: string;
	emails: Array<{
		to: string;
		subject: string;
		html: string;
		text?: string;
		customArgs?: Record<string, string>;
	}>;
	from?: string;
}): Promise<{ success: boolean; count: number; error?: string }> {
	const { companyId, emails, from } = params;

	const client = await createSendGridClient(companyId);
	if (!client) {
		return { success: false, count: 0, error: "SendGrid not configured" };
	}

	const settings = await getCompanySendGridSettings(companyId);
	// Get from email from company settings or company_email_domains (multi-tenant)
	let fromEmail = settings?.sendgrid_from_email;
	if (!fromEmail) {
		// Fallback to company_email_domains if not in twilio_settings
		const supabase = createServiceSupabaseClient();
		if (supabase) {
			const { data: domain } = await supabase
				.from("company_email_domains")
				.select("domain_name, subdomain")
				.eq("company_id", companyId)
				.eq("status", "verified")
				.eq("sending_enabled", true)
				.order("is_platform_subdomain", { ascending: true })
				.limit(1)
				.maybeSingle();
			if (domain) {
				fromEmail = `notifications@${domain.subdomain}.${domain.domain_name}`;
			}
		}
	}
	// Final fallback only for admin/system emails (should rarely be used)
	const fromEmailFinal = fromEmail || "noreply@thorbis.com";
	const fromName = SENDGRID_ADMIN_CONFIG.defaultFromName;
	const fromAddress = from || `${fromName} <${fromEmailFinal}>`;

	try {
		const messages: MailDataRequired[] = emails.map(email => ({
			to: email.to,
			from: fromAddress,
			subject: email.subject,
			html: email.html,
			text: email.text || "",
			customArgs: email.customArgs,
		}));

		await client.send(messages);

		return {
			success: true,
			count: emails.length,
		};
	} catch (error: any) {
		console.error("SendGrid batch send error:", error);
		return {
			success: false,
			count: 0,
			error: error?.message || "Failed to send batch emails",
		};
	}
}
