/**
 * Postmark Webhook Handler
 *
 * This endpoint receives webhook events from Postmark for email delivery tracking.
 * It processes events like deliveries, bounces, spam complaints, and opens.
 *
 * Webhook Events Handled:
 * - Delivery: Email successfully delivered
 * - Bounce: Email bounced (hard or soft)
 * - SpamComplaint: Recipient marked email as spam
 * - Open: Email was opened (if tracking enabled)
 * - Click: Link in email was clicked (if tracking enabled)
 *
 * Security:
 * - Verifies webhook token if POSTMARK_WEBHOOK_SECRET is configured
 * - Validates payload structure
 *
 * Setup in Postmark:
 * 1. Go to Servers → [Your Server] → Settings → Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/postmark
 * 3. Select events: Delivery, Bounce, Spam Complaint, Open, Click
 * 4. Set webhook token to match POSTMARK_WEBHOOK_SECRET
 *
 * @see https://postmarkapp.com/developer/webhooks/webhooks-overview
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { verifyPostmarkWebhook, type PostmarkWebhookPayload } from "@/lib/email/postmark-client";
import { recordDeliveryEvent } from "@/lib/email/deliverability-monitor";
import { recordProviderEvent } from "@/lib/email/provider-monitor";
import { addToSuppressionList } from "@/lib/email/pre-send-checks";

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

/**
 * POST /api/webhooks/postmark
 *
 * Handles incoming Postmark webhook events
 */
export async function POST(request: NextRequest) {
	console.log("[Postmark Webhook] Received webhook request");

	try {
		// Get raw body for signature verification
		const rawBody = await request.text();

		// Get webhook token from headers (if configured in Postmark)
		const webhookToken = request.headers.get("X-Postmark-Token");

		// Verify webhook authenticity
		const isValid = verifyPostmarkWebhook({
			payload: rawBody,
			token: webhookToken,
		});

		if (!isValid) {
			console.error("[Postmark Webhook] Invalid webhook signature");
			return NextResponse.json(
				{ error: "Invalid webhook signature" },
				{ status: 401 }
			);
		}

		// Parse the payload
		let payload: PostmarkWebhookPayload;
		try {
			payload = JSON.parse(rawBody);
		} catch {
			console.error("[Postmark Webhook] Invalid JSON payload");
			return NextResponse.json(
				{ error: "Invalid JSON payload" },
				{ status: 400 }
			);
		}

		// Log the event type
		console.log(
			`[Postmark Webhook] Processing ${payload.RecordType} event for message ${payload.MessageID}`
		);

		// Record webhook received event for monitoring
		await recordProviderEvent({
			provider: "postmark",
			eventType: "webhook_received",
			messageId: payload.MessageID,
			metadata: {
				recordType: payload.RecordType,
				recipient: payload.Recipient,
			},
		});

		// Process based on event type
		switch (payload.RecordType) {
			case "Delivery":
				await handleDelivery(payload);
				break;

			case "Bounce":
				await handleBounce(payload);
				break;

			case "SpamComplaint":
				await handleSpamComplaint(payload);
				break;

			case "Open":
				await handleOpen(payload);
				break;

			case "Click":
				await handleClick(payload);
				break;

			default:
				console.log(
					`[Postmark Webhook] Unhandled event type: ${payload.RecordType}`
				);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error(
			"[Postmark Webhook] Error processing webhook:",
			error instanceof Error ? error.message : "Unknown error"
		);

		// Return 200 to prevent Postmark from retrying
		// Log the error for investigation
		return NextResponse.json({ received: true, error: "Processing error" });
	}
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * Handle delivery event - email successfully delivered
 */
async function handleDelivery(payload: PostmarkWebhookPayload) {
	console.log(
		`[Postmark Webhook] Delivery confirmed for ${payload.Recipient}`
	);

	const supabase = await createServiceSupabaseClient();

	// Update email_logs if we can find the message
	if (payload.MessageID) {
		const { error } = await supabase
			.from("email_logs")
			.update({
				status: "delivered",
				delivered_at: payload.DeliveredAt || new Date().toISOString(),
				metadata: supabase.rpc ? undefined : undefined, // Will merge in app code
			})
			.eq("message_id", payload.MessageID);

		if (error) {
			console.warn(
				`[Postmark Webhook] Could not update email_logs: ${error.message}`
			);
		}
	}

	// Record deliverability event
	const domainId = await getDomainIdFromMetadata(payload.Metadata);
	if (domainId) {
		await recordDeliveryEvent({
			domainId,
			eventType: "delivered",
			emailId: payload.MessageID,
			metadata: {
				provider: "postmark",
				recipient: payload.Recipient,
			},
		});
	}
}

/**
 * Handle bounce event - email could not be delivered
 */
async function handleBounce(payload: PostmarkWebhookPayload) {
	console.log(
		`[Postmark Webhook] Bounce for ${payload.Recipient}: ${payload.Type} (${payload.Description})`
	);

	const supabase = await createServiceSupabaseClient();

	// Determine if this is a hard bounce (permanent) or soft bounce (temporary)
	const isHardBounce =
		payload.Type === "HardBounce" ||
		payload.TypeCode === 1 ||
		payload.Type === "BadEmailAddress";

	// Update email_logs
	if (payload.MessageID) {
		await supabase
			.from("email_logs")
			.update({
				status: "bounced",
				error_message: `${payload.Type}: ${payload.Description}`,
				bounced_at: payload.BouncedAt || new Date().toISOString(),
			})
			.eq("message_id", payload.MessageID);
	}

	// For hard bounces, add to suppression list
	if (isHardBounce && payload.Recipient) {
		const companyId = payload.Metadata?.company_id;
		if (companyId) {
			await addToSuppressionList(
				companyId,
				payload.Recipient,
				"hard_bounce",
				`Postmark: ${payload.Type} - ${payload.Description}`
			);
			console.log(
				`[Postmark Webhook] Added ${payload.Recipient} to suppression list (hard bounce)`
			);
		}
	}

	// Record deliverability event
	const domainId = await getDomainIdFromMetadata(payload.Metadata);
	if (domainId) {
		await recordDeliveryEvent({
			domainId,
			eventType: "bounced",
			emailId: payload.MessageID,
			metadata: {
				provider: "postmark",
				recipient: payload.Recipient,
				bounceType: payload.Type,
				description: payload.Description,
				isHardBounce,
			},
		});
	}
}

/**
 * Handle spam complaint - recipient marked email as spam
 */
async function handleSpamComplaint(payload: PostmarkWebhookPayload) {
	console.log(
		`[Postmark Webhook] Spam complaint from ${payload.Recipient}`
	);

	const supabase = await createServiceSupabaseClient();

	// Update email_logs
	if (payload.MessageID) {
		await supabase
			.from("email_logs")
			.update({
				status: "spam_complaint",
				error_message: "Recipient marked as spam",
			})
			.eq("message_id", payload.MessageID);
	}

	// Add to suppression list (spam complaints should never be emailed again)
	if (payload.Recipient) {
		const companyId = payload.Metadata?.company_id;
		if (companyId) {
			await addToSuppressionList(
				companyId,
				payload.Recipient,
				"spam_complaint",
				"Postmark: Recipient marked email as spam"
			);
			console.log(
				`[Postmark Webhook] Added ${payload.Recipient} to suppression list (spam complaint)`
			);
		}
	}

	// Record deliverability event (spam complaints heavily impact reputation)
	const domainId = await getDomainIdFromMetadata(payload.Metadata);
	if (domainId) {
		await recordDeliveryEvent({
			domainId,
			eventType: "complained",
			emailId: payload.MessageID,
			metadata: {
				provider: "postmark",
				recipient: payload.Recipient,
			},
		});
	}
}

/**
 * Handle open event - email was opened
 */
async function handleOpen(payload: PostmarkWebhookPayload) {
	console.log(`[Postmark Webhook] Email opened by ${payload.Recipient}`);

	const supabase = await createServiceSupabaseClient();

	// Update email_logs with open tracking
	if (payload.MessageID) {
		// Get current metadata and increment open count
		const { data: log } = await supabase
			.from("email_logs")
			.select("metadata")
			.eq("message_id", payload.MessageID)
			.maybeSingle();

		const currentMetadata = (log?.metadata as Record<string, unknown>) || {};
		const openCount = (currentMetadata.openCount as number) || 0;

		await supabase
			.from("email_logs")
			.update({
				metadata: {
					...currentMetadata,
					openCount: openCount + 1,
					lastOpenedAt: new Date().toISOString(),
				},
			})
			.eq("message_id", payload.MessageID);
	}

	// Record deliverability event
	const domainId = await getDomainIdFromMetadata(payload.Metadata);
	if (domainId) {
		await recordDeliveryEvent({
			domainId,
			eventType: "opened",
			emailId: payload.MessageID,
			metadata: {
				provider: "postmark",
				recipient: payload.Recipient,
			},
		});
	}
}

/**
 * Handle click event - link in email was clicked
 */
async function handleClick(payload: PostmarkWebhookPayload) {
	console.log(`[Postmark Webhook] Link clicked by ${payload.Recipient}`);

	const supabase = await createServiceSupabaseClient();

	// Update email_logs with click tracking
	if (payload.MessageID) {
		const { data: log } = await supabase
			.from("email_logs")
			.select("metadata")
			.eq("message_id", payload.MessageID)
			.maybeSingle();

		const currentMetadata = (log?.metadata as Record<string, unknown>) || {};
		const clickCount = (currentMetadata.clickCount as number) || 0;

		await supabase
			.from("email_logs")
			.update({
				metadata: {
					...currentMetadata,
					clickCount: clickCount + 1,
					lastClickedAt: new Date().toISOString(),
				},
			})
			.eq("message_id", payload.MessageID);
	}

	// Record deliverability event
	const domainId = await getDomainIdFromMetadata(payload.Metadata);
	if (domainId) {
		await recordDeliveryEvent({
			domainId,
			eventType: "clicked",
			emailId: payload.MessageID,
			metadata: {
				provider: "postmark",
				recipient: payload.Recipient,
			},
		});
	}
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract domain ID from webhook metadata
 * We include domain_id in the metadata when sending emails
 */
async function getDomainIdFromMetadata(
	metadata?: Record<string, string>
): Promise<string | null> {
	if (metadata?.domain_id) {
		return metadata.domain_id;
	}

	// Try to find domain from company_id
	if (metadata?.company_id) {
		const supabase = await createServiceSupabaseClient();
		const { data } = await supabase
			.from("company_email_domains")
			.select("id")
			.eq("company_id", metadata.company_id)
			.eq("sending_enabled", true)
			.limit(1)
			.maybeSingle();

		return data?.id || null;
	}

	return null;
}

// =============================================================================
// GET HANDLER (for webhook verification)
// =============================================================================

/**
 * GET /api/webhooks/postmark
 *
 * Health check endpoint for webhook configuration
 */
export async function GET() {
	return NextResponse.json({
		status: "ok",
		provider: "postmark",
		message: "Postmark webhook endpoint is active",
		timestamp: new Date().toISOString(),
	});
}
