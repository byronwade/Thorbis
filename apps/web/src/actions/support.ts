"use server";

/**
 * Support Actions
 *
 * Server actions for submitting support requests and contact forms.
 */

import { z } from "zod";
import { sendEmail } from "@/lib/email/email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { PlainTextEmail } from "@/emails/plain-text-email";
import { createClient } from "@/lib/supabase/server";

const supportRequestSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email address"),
	subject: z.string().min(1, "Subject is required").max(200),
	message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export type SupportRequestData = z.infer<typeof supportRequestSchema>;

/**
 * Submit a support request
 *
 * Sends an email to the support team and optionally logs to the database.
 */
export async function submitSupportRequest(data: SupportRequestData): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		// Validate the input
		const validated = supportRequestSchema.parse(data);

		// Build the email message for support team
		const emailMessage = `
New Support Request

From: ${validated.name}
Email: ${validated.email}
Subject: ${validated.subject}

Message:
${validated.message}

---
Submitted at: ${new Date().toISOString()}
		`.trim();

		// Get the support email from environment or use default
		const supportEmail = process.env.SUPPORT_EMAIL || "support@thorbis.com";

		// Send the support email
		const result = await sendEmail({
			to: supportEmail,
			subject: `[Support Request] ${validated.subject}`,
			template: PlainTextEmail({ message: emailMessage }),
			templateType: EmailTemplate.WELCOME, // Using a generic type since we don't have a support-specific one
			replyTo: validated.email,
			tags: [
				{ name: "type", value: "support-request" },
				{ name: "from_email", value: validated.email },
			],
			skipPreSendChecks: true, // System email, always send
		});

		if (!result.success) {
			console.error("Failed to send support email:", result.error);
			return {
				success: false,
				error: "Failed to send your message. Please try again later.",
			};
		}

		// Optionally log to database for tracking
		try {
			const supabase = await createClient();
			if (supabase) {
				await supabase.from("support_requests").insert({
					name: validated.name,
					email: validated.email,
					subject: validated.subject,
					message: validated.message,
					status: "new",
				});
			}
		} catch (dbError) {
			// Don't fail the request if database logging fails
			console.error("Failed to log support request to database:", dbError);
		}

		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || "Invalid form data",
			};
		}

		console.error("Support request error:", error);
		return {
			success: false,
			error: "An unexpected error occurred. Please try again later.",
		};
	}
}

/**
 * Submit feedback from the job help footer
 *
 * Simplified version that doesn't require authentication.
 */
export async function submitJobHelpFeedback(data: {
	name: string;
	email: string;
	subject: string;
	message: string;
}): Promise<{
	success: boolean;
	error?: string;
}> {
	// Prepend context to the subject
	const enhancedData = {
		...data,
		subject: `[Job Help] ${data.subject}`,
	};

	return submitSupportRequest(enhancedData);
}
