/**
 * Email Router - Determines which email system to use
 *
 * Two email systems:
 * 1. Thorbis Platform Emails - System notifications, auth, team invites
 * 2. Company Branded Emails - Customer communications, invoices, estimates
 *
 * This router ensures emails use the correct sender and branding.
 */
"use server";

import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { sendCompanyEmail } from "./company-domain-sender";
import { sendEmail } from "./email-sender";
import type { EmailTemplate } from "./email-types";

// Platform email options (Thorbis branding)
type PlatformEmailOptions = {
	category: "platform";
	to: string | string[];
	subject: string;
	template: ReactElement;
	templateType: EmailTemplate;
	replyTo?: string;
	tags?: { name: string; value: string }[];
};

// Company email options (Company branding)
type CompanyEmailOptions = {
	category: "company";
	companyId: string;
	companyName: string;
	to: string | string[];
	subject: string;
	template: ReactElement;
	templateType: EmailTemplate;
	emailType?:
		| "invoice"
		| "estimate"
		| "reminder"
		| "notification"
		| "marketing"
		| "general";
	replyTo?: string;
	tags?: { name: string; value: string }[];
};

type EmailOptions = PlatformEmailOptions | CompanyEmailOptions;

/**
 * Smart email router - Automatically uses correct email system
 *
 * Usage:
 * ```typescript
 * // Platform email (Thorbis)
 * await routeEmail({
 *   category: "platform",
 *   to: "user@example.com",
 *   subject: "Welcome to Thorbis",
 *   template: <WelcomeEmail />,
 *   templateType: "auth-welcome"
 * });
 *
 * // Company email (Branded)
 * await routeEmail({
 *   category: "company",
 *   companyId: "xxx",
 *   companyName: "ACME Plumbing",
 *   to: "customer@example.com",
 *   subject: "Invoice #1234",
 *   template: <InvoiceEmail />,
 *   templateType: "customer-invoice",
 *   emailType: "invoice"
 * });
 * ```
 */
export async function routeEmail(options: EmailOptions) {
	if (options.category === "platform") {
		// Use Thorbis platform email system
		return await sendEmail({
			to: options.to,
			subject: options.subject,
			template: options.template,
			templateType: options.templateType,
			replyTo: options.replyTo,
			tags: options.tags,
			fromOverride: "Thorbis <noreply@thorbis.com>", // Always use Thorbis domain
		});
	} else {
		// Use company branded email system
		const html = await render(options.template);

		return await sendCompanyEmail({
			companyId: options.companyId,
			companyName: options.companyName,
			type: options.emailType || "notification",
			to: options.to,
			subject: options.subject,
			html,
			replyTo: options.replyTo,
		});
	}
}

/**
 * Helper: Send platform email (Thorbis branding)
 */
export async function sendPlatformEmail(
	options: Omit<PlatformEmailOptions, "category">,
) {
	return routeEmail({ ...options, category: "platform" });
}

/**
 * Helper: Send company email (Company branding)
 */
export async function sendCompanyBrandedEmail(
	options: Omit<CompanyEmailOptions, "category">,
) {
	return routeEmail({ ...options, category: "company" });
}
