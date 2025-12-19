"use server";

import { z } from "zod";
import { Resend } from "resend";
import { authRateLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { env } from "@stratos/config/env";
import WaitlistAdminNotificationEmail from "../../emails/templates/waitlist/admin-notification";
import WaitlistSubscriptionEmail from "../../emails/templates/waitlist/subscription-confirmation";

// Lazily initialize Resend client to avoid build-time errors
let _resend: Resend | null = null;
function getResend(): Resend | null {
	if (!env.resend.apiKey) {
		return null;
	}
	if (!_resend) {
		_resend = new Resend(env.resend.apiKey);
	}
	return _resend;
}

// Cache for audience ID (avoid repeated API calls)
let cachedAudienceId: string | null = null;

/**
 * Get or create the waitlist audience
 * Automatically discovers existing "Waitlist" audience or creates one
 */
async function getWaitlistAudienceId(): Promise<string | null> {
	// Return cached value if available
	if (cachedAudienceId) {
		return cachedAudienceId;
	}

	// Check env var first
	if (env.resend.waitlistAudienceId) {
		cachedAudienceId = env.resend.waitlistAudienceId;
		return cachedAudienceId;
	}

	// If no API key, skip Resend integration
	if (!env.resend.apiKey) {
		console.warn("[Waitlist] RESEND_API_KEY not set, skipping Resend contact creation");
		return null;
	}

	try {
		// List all audiences to find existing waitlist
		const resend = getResend();
		if (!resend) return null;
		const { data: audiences, error: listError } = await resend.audiences.list();

		if (listError) {
			console.error("Failed to list audiences:", listError);
			return null;
		}

		// Look for existing waitlist audience
		const waitlistAudience = audiences?.data?.find(
			(a) => a.name.toLowerCase().includes("waitlist")
		);

		if (waitlistAudience) {
			cachedAudienceId = waitlistAudience.id;
			return cachedAudienceId;
		}

		// Create new waitlist audience if none exists
		const { data: newAudience, error: createError } = await resend!.audiences.create({
			name: "Thorbis Waitlist",
		});

		if (createError) {
			console.error("Failed to create waitlist audience:", createError);
			return null;
		}

		cachedAudienceId = newAudience?.id || null;
		console.log("Created new waitlist audience:", cachedAudienceId);
		return cachedAudienceId;
	} catch (error) {
		console.error("Error getting waitlist audience:", error);
		return null;
	}
}

import { waitlistSchema } from "@/lib/validations/form-schemas";

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

		// Add contact to Resend audience for waitlist management
		let isNewSubscriber = true;
		let alreadySubscribedMessage = false;

		try {
			const audienceId = await getWaitlistAudienceId();

			if (audienceId) {
				// Parse name into first and last name
				const nameParts = validated.name.trim().split(/\s+/);
				const firstName = nameParts[0] || "";
				const lastName = nameParts.slice(1).join(" ") || "";

				// Attempt to create contact in Resend
				const resendClient = getResend();
				if (!resendClient) throw new Error("Resend not configured");
				const response = await resendClient.contacts.create({
					email: validated.email,
					firstName,
					lastName,
					unsubscribed: false,
					audienceId,
				});

				if (response.error) {
					// Check if error is due to duplicate email
					// Resend API returns errors like: "Contact already exists in this audience"
					const errorMessage = response.error.message || "";
					const errorCode = response.error.name || "";
					
					const isDuplicate = 
						errorMessage.toLowerCase().includes("already exists") ||
						errorMessage.toLowerCase().includes("duplicate") ||
						errorMessage.toLowerCase().includes("already subscribed") ||
						errorCode.toLowerCase().includes("duplicate") ||
						errorCode.toLowerCase().includes("conflict");

					if (isDuplicate) {
						isNewSubscriber = false;
						alreadySubscribedMessage = true;
						console.log(`[Waitlist] Email ${validated.email} already in waitlist audience`);
					} else {
						// Log other errors but don't fail the signup
						console.error("Failed to add waitlist subscriber to Resend:", {
							error: response.error,
							message: errorMessage,
							code: errorCode,
						});
					}
				} else {
					isNewSubscriber = true;
					console.log(`[Waitlist] Successfully added ${validated.email} to Resend audience (ID: ${response.data?.id})`);
				}
			}
		} catch (resendError) {
			// Log Resend error but don't fail the signup (emails will still be sent)
			console.error("Error adding contact to Resend audience:", resendError);
		}

		// Send subscription confirmation email via Resend (only for new subscriptions)
		if (isNewSubscriber) {
			try {
				if (!env.resend.apiKey) {
					console.warn(
						"[Waitlist] RESEND_API_KEY not set, skipping welcome email",
					);
				} else {
					const { render } = await import("@react-email/components");
					const html = await render(
						WaitlistSubscriptionEmail({
							name: validated.name,
							previewText: "Welcome to the Thorbis waitlist!",
						}),
					);

					const fromEmail =
						env.resend.fromEmail || "notifications@thorbis.com";
					const fromName =
						env.resend.fromName || "Thorbis";

					const emailClient = getResend();
					if (!emailClient) throw new Error("Resend not configured");
					const { data, error } = await emailClient.emails.send({
						from: `${fromName} <${fromEmail}>`,
						to: validated.email,
						subject: "Welcome to the Thorbis Waitlist! 🎉",
						html,
						tags: [{ name: "category", value: "waitlist" }],
					});

					if (error) {
						console.error(
							"[Waitlist] Failed to send welcome email via Resend:",
							error,
						);
					} else {
						console.log(
							`[Waitlist] Welcome email sent via Resend: ${data?.id}`,
						);
					}
				}
			} catch (emailError) {
				// Log email error but don't fail the signup
				console.error(
					"[Waitlist] Error sending welcome email:",
					emailError,
				);
			}
		}

		// Send admin notification email via Resend
		try {
			if (!env.resend.apiKey) {
				console.warn(
					"[Waitlist] RESEND_API_KEY not set, skipping admin notification",
				);
			} else {
				const { render } = await import("@react-email/components");
				const html = await render(
					WaitlistAdminNotificationEmail({
						userName: validated.name,
						userEmail: validated.email,
						previewText: "New waitlist signup",
					}),
				);

				const fromEmail = env.resend.fromEmail || "notifications@thorbis.com";
				const fromName = env.resend.fromName || "Thorbis";

				const adminEmailClient = getResend();
				if (!adminEmailClient) throw new Error("Resend not configured");
				const { data, error } = await adminEmailClient.emails.send({
					from: `${fromName} <${fromEmail}>`,
					to: "bcw1995@gmail.com",
					subject: `New Waitlist Signup: ${validated.name}`,
					html,
					tags: [{ name: "category", value: "waitlist-admin" }],
				});

				if (error) {
					console.error(
						"[Waitlist] Failed to send admin notification via Resend:",
						error,
					);
				} else {
					console.log(
						`[Waitlist] Admin notification sent via Resend: ${data?.id}`,
					);
				}
			}
		} catch (adminEmailError) {
			// Log admin email error but don't fail the signup
			console.error(
				"[Waitlist] Error sending admin notification:",
				adminEmailError,
			);
		}

		return {
			success: true,
			message: alreadySubscribedMessage
				? "You're already subscribed to the waitlist!"
				: "Successfully joined the waitlist!",
		};
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
