/**
 * Email Sender - Type-safe email sending utilities
 *
 * CRITICAL RULE - Reply-To Addresses:
 * ====================================
 * Reply-to ALWAYS uses the company's platform subdomain (mail.thorbis.com),
 * regardless of which email provider or sending method is used.
 *
 * Examples:
 * - FROM: notifications@acme.mail.thorbis.com → REPLY-TO: support@acme.mail.thorbis.com
 * - FROM: notifications@acme-plumbing.com (custom) → REPLY-TO: support@acme.mail.thorbis.com
 * - FROM: john@gmail.com (personal) → REPLY-TO: support@acme.mail.thorbis.com
 *
 * See: /docs/email/REPLY_TO_ARCHITECTURE.md for full details
 *
 * Features:
 * - Type-safe email sending with validation
 * - Development mode logging
 * - Error handling and logging
 * - Email logging to database
 * - Retry logic for failed sends
 * - Per-company rate limiting
 * - Deliverability monitoring
 */

"use server";

import { render } from "@react-email/components";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReactElement } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import { recordDeliveryEvent } from "./deliverability-monitor";
import type {
	EmailSendResult,
	EmailTemplate as EmailTemplateEnum,
} from "./email-types";
import { emailSendSchema } from "./email-types";
import {
	addToSuppressionList,
	checkSuppressionList,
	runPreSendChecks,
} from "./pre-send-checks";
import {
	checkRateLimit,
	getCompanyActiveDomain,
	incrementEmailCounter,
} from "./rate-limiter";
import { emailConfig, isResendConfigured, resend } from "./resend-client";

// =============================================================================
// MULTI-PROVIDER SUPPORT (Resend primary, Postmark fallback)
// =============================================================================
// Provider abstraction layer - handles automatic fallback when primary fails
import {
	sendEmailWithFallback,
	getProviderSetupInfo,
} from "./email-provider";

// Provider monitoring - tracks success rates, latency for both providers
import {
	recordSendSuccess,
	recordSendFailure,
	recordFallbackTriggered,
} from "./provider-monitor";

// Attachment type for email
type EmailAttachment = {
	filename: string;
	content: string; // Base64 encoded content
	contentType?: string;
};

// Email send options
type SendEmailOptions = {
	to: string | string[];
	subject: string;
	template: ReactElement;
	templateType: EmailTemplateEnum;
	/** Reply-to address. Optional override.
	 * If not provided, uses company's configured reply_to_email from company_email_domains table.
	 * If company hasn't configured one, defaults to support@{company-subdomain}.mail.thorbis.com
	 * This ensures replies always go to the same branded subdomain as FROM address (never custom domains) */
	replyTo?: string;
	tags?: { name: string; value: string }[];
	companyId?: string;
	communicationId?: string;
	fromOverride?: string;
	// CC/BCC recipients
	cc?: string | string[];
	bcc?: string | string[];
	// Attachments
	attachments?: EmailAttachment[];
	// Deliverability options
	isMarketingEmail?: boolean;
	skipPreSendChecks?: boolean; // For system emails that must go out
	textContent?: string; // Plain text version for spam scoring
	unsubscribeUrl?: string;
	listId?: string; // For List-Unsubscribe header
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
 * - Rate limiting per company/domain
 * - Deliverability tracking
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
	cc,
	bcc,
	attachments,
	isMarketingEmail = false,
	skipPreSendChecks = false,
	textContent = "",
	unsubscribeUrl,
	listId,
}: SendEmailOptions): Promise<EmailSendResult> {
	let activeDomainId: string | null = null;
	let companyReplyTo: string | null = null;
	let activeDomain: Awaited<ReturnType<typeof getCompanyActiveDomain>> = null;

	try {

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

		// Check if at least one email provider is configured
		// We support Resend (primary) and Postmark (fallback)
		const providerInfo = getProviderSetupInfo();
		if (providerInfo.status === "not_configured") {
			return {
				success: false,
				error:
					"Email service not configured. Please add RESEND_API_KEY or POSTMARK_API_KEY to environment variables.",
			};
		}
		console.log(
			`[EmailSender] Providers available: ${providerInfo.configuredProviders.join(", ")} (status: ${providerInfo.status})`
		);

		const supabase = await createClient();

		// Fetch company email domain to get reply-to configuration
		if (companyId) {
			activeDomain = await getCompanyActiveDomain(companyId);
			if (!activeDomain) {
				return {
					success: false,
					error: "No active email domain configured for this company. Please set up email in settings.",
				};
			}

			activeDomainId = activeDomain.domainId;

			// Set reply-to from company's domain configuration
			// If not set, construct default using the company's domain (e.g., support@acme.mail.thorbis.com)
			// This ensures all replies go to the same branded subdomain as the FROM address
			if (activeDomain.replyToEmail) {
				companyReplyTo = activeDomain.replyToEmail;
			} else {
				// Default to support@{company-domain}
				companyReplyTo = `support@${activeDomain.domain}`;
			}
		}

		// Determine final reply-to address
		// Priority: 1) Explicit replyTo parameter, 2) Company's configured reply-to, 3) None
		const finalReplyTo = replyTo || companyReplyTo || undefined;

		// Validate email data (now with proper reply-to)
		const validatedData = emailSendSchema.parse({
			to,
			subject,
			replyTo: finalReplyTo,
		});

		// Normalize recipient list
		const recipientEmails = Array.isArray(validatedData.to)
			? validatedData.to
			: [validatedData.to];

		// Check rate limits and run pre-send checks if companyId is provided
		if (companyId && activeDomainId) {

			// Check rate limit before incrementing
			const rateLimitCheck = await checkRateLimit(activeDomain.domainId);
			if (!rateLimitCheck.allowed) {
				return {
					success: false,
					error: rateLimitCheck.reason || "Rate limit exceeded",
				};
			}

			// Run pre-send deliverability checks (unless skipped for system emails)
			if (!skipPreSendChecks) {
				// Render template early to get HTML for spam check
				const preCheckHtml = await render(template);
				const plainText = textContent || extractTextFromHtml(preCheckHtml);

				const preSendResult = await runPreSendChecks(
					companyId,
					activeDomain.domainId,
					recipientEmails,
					subject,
					preCheckHtml,
					plainText,
					isMarketingEmail
				);

				// Block if there are critical errors
				if (!preSendResult.allowed) {
					return {
						success: false,
						error: `Deliverability check failed: ${preSendResult.errors.join("; ")}`,
						data: {
							spamScore: preSendResult.spamScore,
							warnings: preSendResult.warnings,
							suggestions: preSendResult.suggestions,
						},
					};
				}

				// Filter out suppressed recipients
				const activeRecipients = recipientEmails.filter((email) => {
					const status = preSendResult.recipientStatus?.find(
						(r) => r.email.toLowerCase() === email.toLowerCase()
					);
					return !status?.suppressed;
				});

				if (activeRecipients.length === 0) {
					return {
						success: false,
						error: "All recipients are on suppression list - no emails sent",
					};
				}

				// Update validated data with filtered recipients
				if (activeRecipients.length < recipientEmails.length) {
					validatedData.to = activeRecipients.length === 1
						? activeRecipients[0]
						: activeRecipients;
				}

				// Log warnings if any (but still send)
				if (preSendResult.warnings.length > 0) {
					console.warn("[Email Deliverability Warnings]", preSendResult.warnings);
				}
			} else {
				// Even for system emails, check suppression list
				const suppressions = await checkSuppressionList(companyId, recipientEmails);
				const activeRecipients = recipientEmails.filter((email) => {
					const status = suppressions.get(email.toLowerCase());
					return !status?.suppressed;
				});

				if (activeRecipients.length === 0) {
					return {
						success: false,
						error: "All recipients are on suppression list",
					};
				}

				if (activeRecipients.length < recipientEmails.length) {
					validatedData.to = activeRecipients.length === 1
						? activeRecipients[0]
						: activeRecipients;
				}
			}

			// Increment the counter (this also validates limits atomically)
			const incrementResult = await incrementEmailCounter(activeDomain.domainId);
			if (!incrementResult.allowed) {
				return {
					success: false,
					error: incrementResult.reason || "Rate limit exceeded",
				};
			}
		}

		// Determine from identity
		let fromAddress = fromOverride || emailConfig.from;
		if (companyId && supabase) {
			const override = await getCompanyEmailIdentity(supabase, companyId);
			if (override) {
				fromAddress = override;
			}
		}

		// Render template to HTML
		let html = await render(template);

		// Add email tracking if communicationId is provided
		if (communicationId) {
			const { addEmailTracking } = await import("./email-tracking");
			html = addEmailTracking(html, communicationId);
		}

		const sendTags = [
			...tags,
			{ name: "template", value: templateType },
			{ name: "environment", value: process.env.NODE_ENV || "development" },
		];

		if (communicationId) {
			sendTags.push({ name: "communication_id", value: communicationId });
		}

		// Add company_id tag for webhook suppression list tracking
		if (companyId) {
			sendTags.push({ name: "company_id", value: companyId });
		}

		// Build enhanced headers for better deliverability
		const emailHeaders: Record<string, string> = {
			// Precedence helps identify transactional vs marketing
			"X-Priority": "3", // Normal priority (1=High, 3=Normal, 5=Low)
			"X-Mailer": "Stratos Email System",
		};

		// Add List-Unsubscribe header for marketing emails (RFC 2369 compliance)
		if (isMarketingEmail && unsubscribeUrl) {
			emailHeaders["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
			emailHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
		}

		// Add List-Id for mailing lists (helps with filtering)
		if (listId) {
			emailHeaders["List-Id"] = listId;
		}

		// Auto-Submitted header for transactional/automated emails
		if (!isMarketingEmail) {
			emailHeaders["Auto-Submitted"] = "auto-generated";
			emailHeaders["Precedence"] = "bulk"; // Prevents auto-replies
		}

		// =======================================================================
		// SEND EMAIL VIA PROVIDER LAYER (Resend → Postmark fallback)
		// =======================================================================
		// Convert tags to Record format for provider layer
		const tagsRecord: Record<string, string> = {};
		for (const tag of sendTags) {
			tagsRecord[tag.name] = tag.value;
		}

		// Track timing for monitoring
		const sendStartTime = Date.now();

		// Send via provider layer (tries Resend first, then Postmark if Resend fails)
		const providerResult = await sendEmailWithFallback({
			to: validatedData.to,
			subject: validatedData.subject,
			html,
			text: textContent || extractTextFromHtml(html),
			from: fromAddress,
			replyTo: validatedData.replyTo,
			tags: tagsRecord,
			communicationId,
			companyId,
			cc,
			bcc,
			attachments,
		});

		const sendLatencyMs = Date.now() - sendStartTime;

		// =======================================================================
		// RECORD PROVIDER MONITORING EVENTS
		// =======================================================================
		// Track success/failure for each provider attempt (for health dashboard)
		for (const attempt of providerResult.attempts) {
			if (attempt.success) {
				await recordSendSuccess(
					attempt.provider,
					attempt.messageId || "",
					attempt.latencyMs,
					{
						companyId,
						domainId: activeDomainId || undefined,
						metadata: { template: templateType },
					}
				);
			} else {
				await recordSendFailure(
					attempt.provider,
					attempt.error || "Unknown error",
					attempt.latencyMs,
					{
						companyId,
						domainId: activeDomainId || undefined,
						metadata: { template: templateType },
					}
				);
			}
		}

		// Record if fallback was triggered
		if (providerResult.usedFallback && providerResult.success) {
			const primaryAttempt = providerResult.attempts.find((a) => a.provider === "resend");
			await recordFallbackTriggered(
				"resend",
				"postmark",
				primaryAttempt?.error || "Primary failed",
				{ companyId, metadata: { template: templateType } }
			);
			console.log(`[EmailSender] Used Postmark fallback after Resend failed: ${primaryAttempt?.error}`);
		}

		// =======================================================================
		// HANDLE RESULT
		// =======================================================================
		if (providerResult.success) {
			// SUCCESS: Email sent via one of the providers
			console.log(
				`[EmailSender] ✓ Email sent via ${providerResult.provider}${providerResult.usedFallback ? " (fallback)" : ""} in ${sendLatencyMs}ms`
			);

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
						message_id: providerResult.messageId,
						company_id: companyId || null,
						metadata: {
							template: templateType,
							tags: sendTags,
							provider: providerResult.provider,
							usedFallback: providerResult.usedFallback,
							latencyMs: sendLatencyMs,
						},
						sent_at: new Date().toISOString(),
					});
				}
			} catch (_logError) {
				// Don't throw - email was sent successfully even if logging failed
			}

			// Record delivered event for deliverability tracking
			// Note: This is an optimistic record; actual delivery confirmation comes via webhook
			if (activeDomainId) {
				try {
					await recordDeliveryEvent({
						domainId: activeDomainId,
						eventType: "delivered",
						emailId: providerResult.messageId,
						metadata: {
							template: templateType,
							provider: providerResult.provider,
						},
					});
				} catch (_deliverabilityError) {
					// Don't fail the overall operation
				}
			}

			return {
				success: true,
				data: {
					id: providerResult.messageId,
					message: `Email sent successfully via ${providerResult.provider}${providerResult.usedFallback ? " (fallback)" : ""}`,
				},
			};
		} else {
			// FAILURE: All providers failed
			console.error(`[EmailSender] ✗ All providers failed: ${providerResult.error}`);

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
						error_message: providerResult.error || "All providers failed",
						company_id: companyId || null,
						metadata: {
							template: templateType,
							tags: sendTags,
							attempts: providerResult.attempts,
							latencyMs: sendLatencyMs,
						},
						retry_count: 0,
						max_retries: 3,
						next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
					});
				}
			} catch (_logError) {}

			// Record bounce event for deliverability tracking
			if (activeDomainId) {
				try {
					await recordDeliveryEvent({
						domainId: activeDomainId,
						eventType: "bounced",
						metadata: {
							error: providerResult.error,
							template: templateType,
							attempts: providerResult.attempts.length,
						},
					});
				} catch (_deliverabilityError) {
					// Don't fail the overall operation
				}
			}

			return {
				success: false,
				error: providerResult.error || "Failed to send email (all providers failed)",
			};
		}
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
async function sendBatchEmails(
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
async function testEmailConfiguration(
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
	// Get company name first
	const { data: company } = await supabase
		.from("companies")
		.select("name")
		.eq("id", companyId)
		.single();

	const companyName = company?.name || "Notification";

	// Check company_email_domains table for active sending domain
	// Prioritizes custom domains over platform subdomains
	const { data: domain } = await supabase
		.from("company_email_domains")
		.select("domain_name, is_platform_subdomain")
		.eq("company_id", companyId)
		.eq("status", "verified")
		.eq("sending_enabled", true)
		.eq("is_suspended", false)
		.order("is_platform_subdomain", { ascending: true }) // Custom domains first
		.order("created_at", { ascending: false })
		.maybeSingle();

	if (domain?.domain_name) {
		// domain_name contains the full domain (e.g., company.mail.stratos.app or mail.custom.com)
		return formatFromAddress(companyName, `notifications@${domain.domain_name}`);
	}

	// Fallback: Check old communication_email_settings (legacy)
	const { data: settings } = await supabase
		.from("communication_email_settings")
		.select("smtp_from_email, smtp_from_name")
		.eq("company_id", companyId)
		.maybeSingle();

	if (settings?.smtp_from_email) {
		return formatFromAddress(settings.smtp_from_name, settings.smtp_from_email);
	}

	return null;
}

function formatFromAddress(name: string | null | undefined, email: string) {
	if (name?.trim()) {
		return `${name} <${email}>`;
	}
	return email;
}

/**
 * Extract plain text from HTML for spam scoring and multipart emails
 */
function extractTextFromHtml(html: string): string {
	// Remove script and style tags with their content
	let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
	text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

	// Replace block elements with newlines
	text = text.replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n");
	text = text.replace(/<(br|hr)\s*\/?>/gi, "\n");

	// Remove all remaining HTML tags
	text = text.replace(/<[^>]+>/g, " ");

	// Decode common HTML entities
	text = text
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&mdash;/gi, "—")
		.replace(/&ndash;/gi, "–");

	// Clean up whitespace
	text = text.replace(/\s+/g, " ").trim();
	text = text.replace(/\n\s*\n/g, "\n\n"); // Multiple newlines to double

	return text;
}

/**
 * Handle bounce webhook and add to suppression list
 */
export async function handleBounceWebhook(
	companyId: string,
	email: string,
	bounceType: "hard" | "soft",
	bounceReason?: string
): Promise<void> {
	// Import here to avoid circular dependency
	const { addToSuppressionList, addToGlobalBounceList } = await import("./pre-send-checks");

	// Add to company suppression list for hard bounces
	if (bounceType === "hard") {
		await addToSuppressionList(companyId, email, "bounce", bounceReason);
	}

	// Add to global bounce list (hard bounces only)
	await addToGlobalBounceList(email, bounceType, bounceReason);
}

/**
 * Handle complaint webhook (spam report) and add to suppression list
 */
export async function handleComplaintWebhook(
	companyId: string,
	email: string
): Promise<void> {
	const { addToSuppressionList } = await import("./pre-send-checks");

	// Always suppress on complaint - user marked as spam
	await addToSuppressionList(
		companyId,
		email,
		"complaint",
		"User reported email as spam"
	);
}
