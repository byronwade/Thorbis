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
export async function getCompanyVerifiedDomain(
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
		.single();

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
 * Get the appropriate sending address for a specific email type
 */
export function getSendingAddress(
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
}) {
	// 1. Get company's verified domain
	const domain = await getCompanyVerifiedDomain(companyId);

	if (!domain) {
		throw new Error(
			`Company domain not verified. Please verify your email domain in settings before sending emails.`,
		);
	}

	// 2. Get appropriate sending address
	const fromAddress = getSendingAddress(domain, type, companyName);

	// 3. Use company's reply-to email if configured, otherwise use domain email
	const replyToAddress =
		replyTo || domain.reply_to_email || `office@${domain.full_domain}`;

	// 4. Send email via Resend
	try {
		const { data, error } = await resend.emails.send({
			from: fromAddress,
			to,
			subject,
			html,
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
export async function canCompanySendEmail(companyId: string): Promise<boolean> {
	const domain = await getCompanyVerifiedDomain(companyId);
	return domain !== null && domain.status === "verified";
}

/**
 * Get company's email sending status and instructions
 */
export async function getCompanyEmailStatus(companyId: string): Promise<{
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
