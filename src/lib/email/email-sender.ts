/**
 * Email Sender - Type-safe email sending utilities
 *
 * Features:
 * - Type-safe email sending with validation
 * - Development mode logging
 * - Error handling and logging
 * - Email logging to database
 * - Retry logic for failed sends
 */

"use server";

import { render } from "@react-email/components";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReactElement } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type {
	EmailSendResult,
	EmailTemplate as EmailTemplateEnum,
} from "./email-types";
import { emailSendSchema } from "./email-types";
import { emailConfig, isResendConfigured, resend } from "./resend-client";

// Email send options
type SendEmailOptions = {
	to: string | string[];
	subject: string;
	template: ReactElement;
	templateType: EmailTemplateEnum;
	replyTo?: string;
	tags?: { name: string; value: string }[];
	companyId?: string;
	communicationId?: string;
	fromOverride?: string;
};

/**
 * Send email with React Email template
 *
 * Features:
 * - Validates email addresses
 * - Renders React Email template to HTML
 * - Sends via Resend
 * - Logs to database
 * - Development mode logging
 */
export async function sendEmail({
	to,
	subject,
	template,
	templateType,
	replyTo,
	tags = [],
	companyId,
	communicationId,
	fromOverride,
}: SendEmailOptions): Promise<EmailSendResult> {
	try {
		// Validate email data
		const validatedData = emailSendSchema.parse({
			to,
			subject,
			replyTo,
		});

		// In development, log email instead of sending
		if (emailConfig.isDevelopment) {
			return {
				success: true,
				data: {
					id: `dev-mode-${Date.now()}`,
					message: "Email logged in development mode (not actually sent)",
				},
			};
		}

		// Check if Resend is configured
		if (!(isResendConfigured() && resend)) {
			return {
				success: false,
				error:
					"Email service not configured. Please add RESEND_API_KEY to environment variables.",
			};
		}

		const supabase = await createClient();

		// Determine from identity
		let fromAddress = fromOverride || emailConfig.from;
		if (companyId && supabase) {
			const override = await getCompanyEmailIdentity(supabase, companyId);
			if (override) {
				fromAddress = override;
			}
		}

		// Render template to HTML
		const html = await render(template);

		const sendTags = [
			...tags,
			{ name: "template", value: templateType },
			{ name: "environment", value: process.env.NODE_ENV || "development" },
		];

		if (communicationId) {
			sendTags.push({ name: "communication_id", value: communicationId });
		}

		// Send email via Resend
		const { data, error } = await resend.emails.send({
			from: fromAddress,
			to: validatedData.to,
			subject: validatedData.subject,
			html,
			replyTo: validatedData.replyTo,
			tags: sendTags,
		});

		if (error) {
			// Log failed email to database for retry queue
			try {
				if (supabase) {
					await supabase.from("email_logs").insert({
						to: Array.isArray(validatedData.to)
							? validatedData.to.join(", ")
							: validatedData.to,
						from: fromAddress,
						subject: validatedData.subject,
						html_body: html,
						status: "failed",
						error_message: error.message || "Unknown error",
						metadata: { template: templateType, tags: sendTags },
						retry_count: 0,
						max_retries: 3,
						next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
					});
				}
			} catch (_logError) {}

			return {
				success: false,
				error: error.message || "Failed to send email",
			};
		}

		// Log successful email to database
		try {
			if (supabase) {
				await supabase.from("email_logs").insert({
					to: Array.isArray(validatedData.to)
						? validatedData.to.join(", ")
						: validatedData.to,
					from: fromAddress,
					subject: validatedData.subject,
					html_body: html,
					status: "sent",
					message_id: data?.id,
					metadata: { template: templateType, tags: sendTags },
					sent_at: new Date().toISOString(),
				});
			}
		} catch (_logError) {
			// Don't throw - email was sent successfully even if logging failed
		}

		return {
			success: true,
			data: {
				id: data?.id,
				message: "Email sent successfully",
			},
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || "Invalid email data",
			};
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send email",
		};
	}
}

/**
 * Send batch emails (up to 100 at once per Resend limits)
 *
 * Features:
 * - Validates batch size
 * - Sends multiple emails
 * - Returns results for each email
 */
export async function sendBatchEmails(
	emails: SendEmailOptions[],
): Promise<EmailSendResult[]> {
	if (emails.length > 100) {
		return [
			{
				success: false,
				error: "Cannot send more than 100 emails at once",
			},
		];
	}

	const results = await Promise.all(emails.map((email) => sendEmail(email)));

	return results;
}

/**
 * Test email configuration by sending a test email
 *
 * Features:
 * - Validates Resend configuration
 * - Sends test email to specified address
 * - Returns detailed error information
 */
export async function testEmailConfiguration(
	testEmailAddress: string,
): Promise<EmailSendResult> {
	try {
		const validatedEmail = emailSendSchema.shape.to.parse(testEmailAddress);

		if (!isResendConfigured()) {
			return {
				success: false,
				error: "Resend API key is not configured",
			};
		}

		// Create a simple test template
		const testTemplate = {
			type: "div",
			props: {
				children: [
					{
						type: "h1",
						props: { children: "Email Configuration Test" },
					},
					{
						type: "p",
						props: {
							children: "This is a test email from your Thorbis application.",
						},
					},
					{
						type: "p",
						props: {
							children:
								"If you received this, your email configuration is working correctly!",
						},
					},
				],
			},
		} as any;

		return await sendEmail({
			to: validatedEmail,
			subject: "Test Email - Thorbis Email Configuration",
			template: testTemplate,
			templateType: "welcome" as EmailTemplateEnum,
			tags: [{ name: "type", value: "test" }],
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: "Invalid email address",
			};
		}

		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Configuration test failed",
		};
	}
}

async function getCompanyEmailIdentity(
	supabase: SupabaseClient<Database>,
	companyId: string,
) {
	const { data: settings } = await supabase
		.from("communication_email_settings")
		.select("smtp_from_email, smtp_from_name")
		.eq("company_id", companyId)
		.maybeSingle();

	if (settings?.smtp_from_email) {
		return formatFromAddress(settings.smtp_from_name, settings.smtp_from_email);
	}

	const { data: domain } = await supabase
		.from("communication_email_domains")
		.select("domain")
		.eq("company_id", companyId)
		.eq("status", "verified")
		.order("last_verified_at", { ascending: false })
		.maybeSingle();

	if (domain?.domain) {
		return formatFromAddress("Notifications", `notifications@${domain.domain}`);
	}

	return null;
}

function formatFromAddress(name: string | null | undefined, email: string) {
	if (name?.trim()) {
		return `${name} <${email}>`;
	}
	return email;
}
