"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { resend } from "@/lib/email/resend-client";
import { authRateLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import WaitlistAdminNotificationEmail from "../../emails/templates/waitlist/admin-notification";
import WaitlistSubscriptionEmail from "../../emails/templates/waitlist/subscription-confirmation";

const waitlistSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name is too long"),
	email: z.string().email("Invalid email address"),
});

type WaitlistResult = {
	success: boolean;
	error?: string;
	message?: string;
};

/**
 * Join Waitlist - Subscribe user to Resend audience
 *
 * Features:
 * - Validates email and name with Zod
 * - Rate limits requests
 * - Checks Resend API to detect if email is already subscribed
 * - Always adds contact to Resend audience (for broadcast emails)
 * - Returns user-friendly success/error messages
 * - Sends welcome email only for new subscriptions
 *
 * How duplicate detection works:
 * - Attempts to create contact in Resend via resend.contacts.create()
 * - Resend API returns an error if the email already exists in the audience
 * - We catch and parse the error to detect duplicates
 * - If duplicate: returns success with "already subscribed" message (no email sent)
 * - If new: creates contact and sends welcome email
 *
 * Note: All waitlist subscribers are added to an audience so you can send
 * broadcast emails to everyone on the waitlist via Resend.
 */
export async function joinWaitlist(
	formData: FormData,
): Promise<WaitlistResult> {
	try {
		const rawData = {
			name: (formData.get("name") as string) ?? "",
			email: (formData.get("email") as string) ?? "",
		};

		const validated = waitlistSchema.parse(rawData);

		// Rate limit check
		await checkRateLimit(validated.email, authRateLimiter);

		if (!resend) {
			return {
				success: false,
				error: "Email service is not configured. Please try again later.",
			};
		}

		// Get audience ID from environment variable
		// Priority: RESEND_WAITLIST_AUDIENCE_ID > RESEND_AUDIENCE_ID > default to "Waitlist" audience
		// Defaults to the dedicated Waitlist audience created in Resend
		const audienceId =
			process.env.RESEND_WAITLIST_AUDIENCE_ID ||
			process.env.RESEND_AUDIENCE_ID ||
			"085a8004-43c1-4042-8b1b-feadbbcda483"; // Default to "Waitlist" audience

		try {
			// Check if contact already exists in Resend by attempting to get it
			// Resend doesn't have a direct "get by email" endpoint, so we try to create
			// and handle the duplicate error. This is the standard approach.
			const contactParams: {
				email: string;
				firstName?: string;
				lastName?: string;
				unsubscribed: boolean;
				audienceId: string;
			} = {
				email: validated.email,
				firstName: validated.name.split(" ")[0] || validated.name,
				lastName: validated.name.split(" ").slice(1).join(" ") || undefined,
				unsubscribed: false,
				audienceId, // Always include audienceId so users can receive emails
			};

			const { data, error } = await resend.contacts.create(contactParams);

			if (error) {
				console.error("Failed to add contact to Resend:", error);

				// Check if it's a duplicate/already exists error
				// Resend returns specific error codes/messages for duplicates
				const errorMessage = error.message?.toLowerCase() || "";
				const errorCode = error.name?.toLowerCase() || "";

				const isDuplicate =
					errorMessage.includes("already exists") ||
					errorMessage.includes("duplicate") ||
					errorMessage.includes("already in") ||
					errorMessage.includes("already subscribed") ||
					errorCode.includes("duplicate") ||
					errorCode.includes("conflict") ||
					// Check for common Resend error patterns
					errorMessage.includes("contact with this email") ||
					errorMessage.includes("email already");

				if (isDuplicate) {
					// User is already subscribed - return success but don't send email
					return {
						success: true,
						message: "You're already on the waitlist!",
					};
				}

				// Other error - return failure
				return {
					success: false,
					error: "Failed to join waitlist. Please try again.",
				};
			}

			// Send subscription confirmation email (only for new subscriptions)
			try {
				await sendEmail({
					to: validated.email,
					subject: "Welcome to the Thorbis Waitlist! 🎉",
					template: WaitlistSubscriptionEmail({
						name: validated.name,
						previewText: "Welcome to the Thorbis waitlist!",
					}),
					templateType: EmailTemplate.WAITLIST_SUBSCRIPTION,
					tags: [{ name: "category", value: "waitlist" }],
				});
			} catch (emailError) {
				// Log email error but don't fail the signup
				console.error(
					"Failed to send waitlist confirmation email:",
					emailError,
				);
			}

			// Send admin notification email
			try {
				await sendEmail({
					to: "bcw1995@gmail.com",
					subject: `New Waitlist Signup: ${validated.name}`,
					template: WaitlistAdminNotificationEmail({
						userName: validated.name,
						userEmail: validated.email,
						previewText: "New waitlist signup",
					}),
					templateType: EmailTemplate.WAITLIST_ADMIN_NOTIFICATION,
					tags: [{ name: "category", value: "waitlist-admin" }],
				});
			} catch (adminEmailError) {
				// Log admin email error but don't fail the signup
				console.error(
					"Failed to send admin notification email:",
					adminEmailError,
				);
			}

			return {
				success: true,
				message: "Successfully joined the waitlist!",
			};
		} catch (error) {
			console.error("Error adding contact to Resend:", error);

			// Check if it's a duplicate error (caught exception)
			if (error instanceof Error) {
				const errorMessage = error.message.toLowerCase();
				const isDuplicate =
					errorMessage.includes("already exists") ||
					errorMessage.includes("duplicate") ||
					errorMessage.includes("already in") ||
					errorMessage.includes("already subscribed") ||
					errorMessage.includes("contact with this email") ||
					errorMessage.includes("email already");

				if (isDuplicate) {
					// Don't send email if already subscribed
					return {
						success: true,
						message: "You're already on the waitlist!",
					};
				}
			}

			return {
				success: false,
				error: "Failed to join waitlist. Please try again.",
			};
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || "Validation error",
			};
		}

		console.error("Waitlist signup error:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Unable to join waitlist. Please try again.",
		};
	}
}
