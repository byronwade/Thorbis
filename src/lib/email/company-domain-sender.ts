/**
 * Company Domain Email Sender
 *
 * CRITICAL RULE - Reply-To Addresses:
 * ====================================
 * Reply-to ALWAYS uses the platform subdomain (mail.thorbis.com), regardless of:
 * - Which email provider is used (platform, custom domain, Gmail)
 * - What the FROM address is
 * - Whether they have a custom domain or not
 *
 * Examples:
 * - FROM: notifications@acme-plumbing.com (custom domain)
 *   REPLY-TO: support@acme-plumbing.mail.thorbis.com (platform subdomain)
 *
 * - FROM: john@gmail.com (personal Gmail)
 *   REPLY-TO: support@acme-plumbing.mail.thorbis.com (platform subdomain)
 *
 * - FROM: notifications@acme-plumbing.mail.thorbis.com (platform subdomain)
 *   REPLY-TO: support@acme-plumbing.mail.thorbis.com (same platform subdomain)
 *
 * Why?
 * - Centralizes all replies to one inbox per company
 * - Prevents replies going to custom domains or personal emails
 * - Each company controls their reply-to prefix (support@, help@, etc.)
 * - Stored in company_email_domains.reply_to_email
 */

import { Resend } from "resend";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

const resend = new Resend(process.env.RESEND_API_KEY);

type CompanyDomain = {
	id: string;
	domain_name: string;
	subdomain: string; // REQUIRED: Always use subdomain to prevent SPF conflicts
	full_domain: string;
	status: string;
	sending_addresses: Array<{
		type: string;
		email: string;
	}>;
	reply_to_email: string | null;
};

type EmailType =
	| "invoice"
	| "estimate"
	| "reminder"
	| "notification"
	| "marketing"
	| "general";

/**
 * Get the verified email domain for a company
 * Returns null if no domain is verified
 */
async function getCompanyVerifiedDomain(
	companyId: string,
): Promise<CompanyDomain | null> {
	const supabase = await createServiceSupabaseClient();

	if (!supabase) {
		return null;
	}

	const { data: domain } = await supabase
		.from("company_email_domains")
		.select("*")
		.eq("company_id", companyId)
		.eq("status", "verified")
		.eq("sending_enabled", true)
		.eq("is_suspended", false)
		.order("is_platform_subdomain", { ascending: true }) // Prefer custom domains for FROM
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (!domain) {
		return null;
	}

	// Construct full domain (subdomain is always required)
	const fullDomain = `${domain.subdomain}.${domain.domain_name}`;

	return {
		id: domain.id,
		domain_name: domain.domain_name,
		subdomain: domain.subdomain,
		full_domain: fullDomain,
		status: domain.status,
		sending_addresses: domain.sending_addresses || [],
		reply_to_email: domain.reply_to_email,
	};
}

/**
 * Get the company's platform subdomain for reply-to
 * Reply-to ALWAYS uses the platform subdomain (mail.thorbis.com)
 * This ensures replies are isolated per company, never using custom domains
 */
async function getCompanyPlatformReplyTo(
	companyId: string,
): Promise<string | null> {
	const supabase = await createServiceSupabaseClient();

	if (!supabase) {
		return null;
	}

	// Get the platform subdomain for this company
	const { data: platformDomain } = await supabase
		.from("company_email_domains")
		.select("domain_name, reply_to_email")
		.eq("company_id", companyId)
		.eq("is_platform_subdomain", true)
		.eq("status", "verified")
		.maybeSingle();

	if (!platformDomain) {
		return null;
	}

	// Use configured reply-to if set, otherwise default to support@
	if (platformDomain.reply_to_email) {
		return platformDomain.reply_to_email;
	}

	// Default: support@{company}.mail.thorbis.com
	return `support@${platformDomain.domain_name}`;
}

/**
 * Get the appropriate sending address for a specific email type
 */
function getSendingAddress(
	domain: CompanyDomain,
	type: EmailType,
	companyName: string,
): string {
	// Check if company has custom sending addresses configured
	const customAddress = domain.sending_addresses.find(
		(addr) => addr.type === type,
	);

	if (customAddress) {
		return `${companyName} <${customAddress.email}>`;
	}

	// Default sending addresses based on type
	const defaultEmail = `${type}@${domain.full_domain}`;
	return `${companyName} <${defaultEmail}>`;
}

/**
 * Send email using company's verified domain
 * This is the PRIMARY function for ALL email sending in the platform
 */
export async function sendCompanyEmail({
	companyId,
	companyName,
	type = "notification",
	to,
	subject,
	html,
	text,
	replyTo,
	attachments,
	communicationId,
}: {
	companyId: string;
	companyName: string;
	type?: EmailType;
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
	replyTo?: string;
	attachments?: Array<{
		filename: string;
		content: string;
	}>;
	communicationId?: string;
}) {
	// 1. Get company's verified domain (for FROM address)
	const domain = await getCompanyVerifiedDomain(companyId);

	if (!domain) {
		throw new Error(
			`Company domain not verified. Please verify your email domain in settings before sending emails.`,
		);
	}

	// 2. Get appropriate sending address
	const fromAddress = getSendingAddress(domain, type, companyName);

	// 3. Get reply-to from platform subdomain (NEVER custom domain)
	// Reply-to ALWAYS uses mail.thorbis.com, even when FROM uses a custom domain
	// This ensures all replies are centralized to the company's platform subdomain
	const platformReplyTo = await getCompanyPlatformReplyTo(companyId);
	const replyToAddress = replyTo || platformReplyTo || `support@${domain.full_domain}`;

	// 4. Add email tracking if communicationId is provided
	let trackedHtml = html;
	if (communicationId) {
		const { addEmailTracking } = await import("./email-tracking");
		trackedHtml = addEmailTracking(html, communicationId);
	}

	// 5. Send email via Resend
	try {
		const { data, error } = await resend.emails.send({
			from: fromAddress,
			to,
			subject,
			html: trackedHtml,
			text,
			replyTo: replyToAddress,
			attachments,
		});

		if (error) {
			throw new Error(`Failed to send email: ${error.message}`);
		}

		return { success: true, messageId: data?.id };
	} catch (error) {
		console.error("Email send error:", error);
		throw error;
	}
}

/**
 * Check if company can send emails (has verified domain)
 */
async function canCompanySendEmail(companyId: string): Promise<boolean> {
	const domain = await getCompanyVerifiedDomain(companyId);
	return domain !== null && domain.status === "verified";
}

/**
 * Get company's email sending status and instructions
 */
async function getCompanyEmailStatus(companyId: string): Promise<{
	canSend: boolean;
	domain?: CompanyDomain;
	message: string;
}> {
	const supabase = await createServiceSupabaseClient();

	if (!supabase) {
		return {
			canSend: false,
			message: "Database connection failed",
		};
	}

	const { data: domain } = await supabase
		.from("company_email_domains")
		.select("*")
		.eq("company_id", companyId)
		.single();

	if (!domain) {
		return {
			canSend: false,
			message:
				"No email domain configured. Please add and verify your email domain in Settings → Email Domain.",
		};
	}

	// Subdomain is always required
	const fullDomain = `${domain.subdomain}.${domain.domain_name}`;

	if (domain.status === "verified") {
		return {
			canSend: true,
			domain: {
				id: domain.id,
				domain_name: domain.domain_name,
				subdomain: domain.subdomain,
				full_domain: fullDomain,
				status: domain.status,
				sending_addresses: domain.sending_addresses || [],
				reply_to_email: domain.reply_to_email,
			},
			message: `Ready to send from ${fullDomain}`,
		};
	}

	if (domain.status === "pending" || domain.status === "verifying") {
		return {
			canSend: false,
			domain: {
				id: domain.id,
				domain_name: domain.domain_name,
				subdomain: domain.subdomain,
				full_domain: fullDomain,
				status: domain.status,
				sending_addresses: domain.sending_addresses || [],
				reply_to_email: domain.reply_to_email,
			},
			message: `Email domain ${fullDomain} is pending verification. Please add the required DNS records to verify.`,
		};
	}

	return {
		canSend: false,
		domain: {
			id: domain.id,
			domain_name: domain.domain_name,
			subdomain: domain.subdomain,
			full_domain: fullDomain,
			status: domain.status,
			sending_addresses: domain.sending_addresses || [],
			reply_to_email: domain.reply_to_email,
		},
		message: `Email domain verification failed. Please check your DNS records or contact support.`,
	};
}
