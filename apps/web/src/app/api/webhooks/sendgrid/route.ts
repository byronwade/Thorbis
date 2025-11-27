/**
 * SendGrid Webhook Handler
 *
 * Handles incoming webhooks from SendGrid for:
 * - Email delivery status updates (delivered, bounced, deferred, dropped)
 * - Engagement tracking (opened, clicked)
 * - Spam reports and unsubscribes
 *
 * Security: Validates SendGrid webhook signature using ECDSA
 * Docs: https://docs.sendgrid.com/for-developers/tracking-events/event
 */

import crypto from "crypto";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import {
	handleBounceWebhook,
	handleComplaintWebhook,
} from "@/lib/email/email-sender";
import { SENDGRID_ADMIN_CONFIG } from "@/lib/email/sendgrid-client";

// =============================================================================
// TYPES
// =============================================================================

/**
 * SendGrid Event Webhook payload
 * https://docs.sendgrid.com/for-developers/tracking-events/event
 */
type SendGridEvent = {
	email: string;
	timestamp: number;
	event: SendGridEventType;
	sg_message_id: string;
	sg_event_id: string;
	// Custom tracking args (set when sending)
	communication_id?: string;
	company_id?: string;
	// Bounce/drop specific
	reason?: string;
	type?: string; // "bounce" type: "blocked", "bounced", "expired"
	bounce_classification?: string;
	// Click specific
	url?: string;
	// Open specific
	useragent?: string;
	ip?: string;
	// Category/tags
	category?: string[];
	// Marketing campaigns
	marketing_campaign_id?: number;
	marketing_campaign_name?: string;
	// Additional fields
	asm_group_id?: number;
	tls?: number;
	cert_error?: number;
	smtp_id?: string;
};

type SendGridEventType =
	| "processed"
	| "dropped"
	| "deferred"
	| "bounce"
	| "delivered"
	| "open"
	| "click"
	| "spamreport"
	| "unsubscribe"
	| "group_unsubscribe"
	| "group_resubscribe";

// =============================================================================
// SIGNATURE VERIFICATION
// =============================================================================

/**
 * Verify SendGrid webhook signature using ECDSA
 * https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features
 */
async function verifySendGridSignature(
	payload: string,
	signature: string | null,
	timestamp: string | null,
): Promise<boolean> {
	const webhookSecret = SENDGRID_ADMIN_CONFIG.webhookSecret;

	// Skip validation in development if no secret configured
	if (!webhookSecret) {
		console.warn("[SendGridWebhook] No webhook secret configured, skipping validation");
		return true;
	}

	if (!signature || !timestamp) {
		console.error("[SendGridWebhook] Missing signature or timestamp header");
		return false;
	}

	try {
		// SendGrid signature validation:
		// The signature is the ECDSA signature of: timestamp + payload
		const signedPayload = timestamp + payload;

		// Create verifier with the public key (webhook secret is the verification key)
		const verifier = crypto.createVerify("sha256");
		verifier.update(signedPayload);
		verifier.end();

		// Decode the base64 signature
		const signatureBuffer = Buffer.from(signature, "base64");

		// Verify using the webhook verification key
		return verifier.verify(
			{
				key: webhookSecret,
				dsaEncoding: "ieee-p1363",
			},
			signatureBuffer,
		);
	} catch (error) {
		console.error("[SendGridWebhook] Signature verification error:", error);
		// For simpler verification, just verify timestamp is recent
		const timestampNum = parseInt(timestamp, 10);
		const now = Math.floor(Date.now() / 1000);
		const fiveMinutes = 300;

		if (Math.abs(now - timestampNum) > fiveMinutes) {
			console.error("[SendGridWebhook] Timestamp too old");
			return false;
		}

		// If signature verification fails but timestamp is valid,
		// allow in development mode
		if (process.env.NODE_ENV !== "production") {
			console.warn("[SendGridWebhook] Skipping signature validation in development");
			return true;
		}

		return false;
	}
}

// =============================================================================
// POST HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();
		const headersList = await headers();

		// Get SendGrid signature headers
		const signature = headersList.get("x-twilio-email-event-webhook-signature");
		const timestamp = headersList.get("x-twilio-email-event-webhook-timestamp");

		// Validate signature in production
		if (process.env.NODE_ENV === "production") {
			const isValid = await verifySendGridSignature(body, signature, timestamp);
			if (!isValid) {
				console.error("[SendGridWebhook] Invalid request signature");
				return NextResponse.json(
					{ error: "Invalid signature" },
					{ status: 403 },
				);
			}
		}

		// Parse events - SendGrid sends an array of events
		const events: SendGridEvent[] = JSON.parse(body);

		if (!Array.isArray(events)) {
			console.error("[SendGridWebhook] Invalid payload format - expected array");
			return NextResponse.json(
				{ error: "Invalid payload format" },
				{ status: 400 },
			);
		}

		console.log(`[SendGridWebhook] Processing ${events.length} events`);

		const supabase = createServiceSupabaseClient();
		if (!supabase) {
			console.error("[SendGridWebhook] Failed to create Supabase client");
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 },
			);
		}

		// Process each event
		for (const event of events) {
			try {
				await processEvent(supabase, event);
			} catch (error) {
				console.error(`[SendGridWebhook] Error processing event:`, error);
				// Continue processing other events
			}
		}

		return NextResponse.json({ received: true, processed: events.length });
	} catch (error) {
		console.error("[SendGridWebhook] Error processing webhook:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// =============================================================================
// EVENT PROCESSING
// =============================================================================

async function processEvent(supabase: any, event: SendGridEvent) {
	const { sg_message_id, sg_event_id, event: eventType, email, timestamp } = event;

	console.log(`[SendGridWebhook] Processing ${eventType} event for ${email}`);

	// Get communication_id from custom args (set when sending)
	const communicationId = event.communication_id;
	const companyId = event.company_id;

	// Handle suppression events (bounces, spam reports)
	if (eventType === "bounce" || eventType === "spamreport") {
		await handleSuppressionEvent(supabase, event, companyId);
	}

	// If no communication_id, try to find by provider message ID
	let communication = null;
	if (communicationId) {
		const { data } = await supabase
			.from("communications")
			.select("id, open_count, click_count, opened_at, clicked_at")
			.eq("id", communicationId)
			.maybeSingle();
		communication = data;
	} else if (sg_message_id) {
		// SendGrid message IDs have format: <message-id>@domain.com
		// Extract just the message ID part
		const messageIdPart = sg_message_id.split("@")[0].replace("<", "");

		const { data } = await supabase
			.from("communications")
			.select("id, open_count, click_count, opened_at, clicked_at")
			.or(`provider_message_id.eq.${sg_message_id},provider_message_id.ilike.%${messageIdPart}%`)
			.maybeSingle();
		communication = data;
	}

	if (!communication) {
		console.log(`[SendGridWebhook] No communication found for message ${sg_message_id || communicationId}`);
		return;
	}

	// Insert event record
	await supabase.from("communication_email_events").insert({
		communication_id: communication.id,
		event_type: `email.${eventType}`,
		provider_event_id: sg_event_id,
		payload: event,
		occurred_at: new Date(timestamp * 1000).toISOString(),
	});

	// Update communication based on event type
	const updates: Record<string, unknown> = {
		provider_status: eventType,
		provider_metadata: event,
	};

	switch (eventType) {
		case "delivered":
			updates.status = "delivered";
			updates.delivered_at = new Date(timestamp * 1000).toISOString();
			break;

		case "bounce":
			updates.status = "bounced";
			updates.bounced_at = new Date(timestamp * 1000).toISOString();
			updates.bounce_reason = event.reason || event.bounce_classification;
			break;

		case "dropped":
			updates.status = "failed";
			updates.bounce_reason = event.reason || "Email dropped by SendGrid";
			break;

		case "deferred":
			updates.status = "queued";
			// Don't overwrite if already delivered
			break;

		case "spamreport":
			updates.status = "complained";
			updates.complained_at = new Date(timestamp * 1000).toISOString();
			break;

		case "open":
			const currentOpenCount = communication.open_count || 0;
			updates.open_count = currentOpenCount + 1;
			if (!communication.opened_at) {
				updates.opened_at = new Date(timestamp * 1000).toISOString();
			}
			break;

		case "click":
			const currentClickCount = communication.click_count || 0;
			updates.click_count = currentClickCount + 1;
			if (!communication.clicked_at) {
				updates.clicked_at = new Date(timestamp * 1000).toISOString();
			}
			// Store clicked URL in metadata
			if (event.url) {
				updates.provider_metadata = {
					...event,
					clicked_url: event.url,
				};
			}
			break;

		case "unsubscribe":
		case "group_unsubscribe":
			updates.status = "unsubscribed";
			break;

		case "processed":
			// Initial processing - email accepted by SendGrid
			if (updates.status !== "delivered") {
				updates.status = "sent";
			}
			break;
	}

	await supabase
		.from("communications")
		.update(updates)
		.eq("id", communication.id);

	console.log(`[SendGridWebhook] Updated communication ${communication.id} with ${eventType} event`);
}

// =============================================================================
// SUPPRESSION HANDLING
// =============================================================================

async function handleSuppressionEvent(
	supabase: any,
	event: SendGridEvent,
	companyId?: string,
) {
	const { email, event: eventType, reason, type: bounceType } = event;

	// Try to get company_id from event or lookup
	let effectiveCompanyId = companyId;

	if (!effectiveCompanyId && event.communication_id) {
		const { data: comm } = await supabase
			.from("communications")
			.select("company_id")
			.eq("id", event.communication_id)
			.single();
		effectiveCompanyId = comm?.company_id;
	}

	if (!effectiveCompanyId) {
		console.warn(`[SendGridWebhook] No company_id for suppression event, skipping`);
		return;
	}

	try {
		if (eventType === "bounce") {
			// Determine if hard or soft bounce
			const isHardBounce = bounceType === "blocked" || bounceType === "bounced";
			console.log(`[SendGridWebhook] Processing ${isHardBounce ? "hard" : "soft"} bounce for ${email}`);

			await handleBounceWebhook(
				effectiveCompanyId,
				email,
				isHardBounce ? "hard" : "soft",
				reason,
			);
		} else if (eventType === "spamreport") {
			console.log(`[SendGridWebhook] Processing spam report for ${email}`);
			await handleComplaintWebhook(effectiveCompanyId, email);
		}
	} catch (error) {
		console.error(`[SendGridWebhook] Failed to handle suppression for ${email}:`, error);
	}
}

// =============================================================================
// GET HANDLER (for webhook verification)
// =============================================================================

export async function GET(request: NextRequest) {
	// SendGrid may send a GET request to verify the webhook URL
	return NextResponse.json({ status: "ok", service: "sendgrid-webhook" });
}
