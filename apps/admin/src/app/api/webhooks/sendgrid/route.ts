import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * SendGrid Event Webhook Handler
 *
 * Handles email events from SendGrid:
 * - delivered
 * - open
 * - click
 * - bounce
 * - spamreport
 * - dropped
 * - deferred
 *
 * To set up:
 * 1. Go to SendGrid Dashboard > Settings > Mail Settings > Event Webhook
 * 2. Add webhook URL: https://your-domain.com/api/webhooks/sendgrid
 * 3. Select events: Delivered, Opens, Clicks, Bounces, Spam Reports
 * 4. Enable signed webhooks and add verification key to SENDGRID_WEBHOOK_VERIFICATION_KEY env var
 */

// SendGrid webhook event types
type SendGridEventType =
	| "processed"
	| "dropped"
	| "delivered"
	| "deferred"
	| "bounce"
	| "open"
	| "click"
	| "spamreport"
	| "unsubscribe"
	| "group_unsubscribe"
	| "group_resubscribe";

interface SendGridWebhookEvent {
	email: string;
	timestamp: number;
	event: SendGridEventType;
	sg_event_id: string;
	sg_message_id: string;
	// For click events
	url?: string;
	// For bounce events
	reason?: string;
	type?: string; // bounce type
	// Custom args (contains campaign_id, etc.)
	campaign_id?: string;
	[key: string]: unknown; // Allow custom args
}

export async function POST(request: NextRequest) {
	try {
		// SendGrid sends an array of events
		const events: SendGridWebhookEvent[] = await request.json();
		const supabase = await createClient();
		const now = new Date().toISOString();

		// Process each event
		for (const event of events) {
			const { email: recipientEmail, event: eventType, campaign_id: campaignId } = event;

			if (!campaignId) {
				// Not a campaign email, skip
				continue;
			}

			// Find the send record
			const { data: sendRecord } = await supabase
				.from("email_campaign_sends")
				.select("id, status, open_count, click_count, links_clicked, first_opened_at, first_clicked_at")
				.eq("campaign_id", campaignId)
				.eq("recipient_email", recipientEmail)
				.single();

			if (!sendRecord) {
				continue;
			}

			// Handle different event types
			switch (eventType) {
				case "delivered": {
					await supabase
						.from("email_campaign_sends")
						.update({
							status: "delivered",
							delivered_at: now,
							updated_at: now,
						})
						.eq("id", sendRecord.id);

					await supabase.rpc("increment_campaign_stat", {
						p_campaign_id: campaignId,
						p_field: "delivered_count",
					});
					break;
				}

				case "open": {
					const isFirstOpen = sendRecord.status !== "opened" && sendRecord.status !== "clicked";

					await supabase
						.from("email_campaign_sends")
						.update({
							status: sendRecord.status === "clicked" ? "clicked" : "opened",
							first_opened_at: sendRecord.first_opened_at || now,
							last_opened_at: now,
							open_count: (sendRecord.open_count || 0) + 1,
							updated_at: now,
						})
						.eq("id", sendRecord.id);

					await supabase.rpc("increment_campaign_stat", {
						p_campaign_id: campaignId,
						p_field: "opened_count",
					});

					if (isFirstOpen) {
						await supabase.rpc("increment_campaign_stat", {
							p_campaign_id: campaignId,
							p_field: "unique_opens",
						});
					}
					break;
				}

				case "click": {
					const clickedLink = event.url || "";
					const isFirstClick = sendRecord.status !== "clicked";
					const linksClicked = sendRecord.links_clicked || [];
					const isNewLink = !linksClicked.includes(clickedLink);

					await supabase
						.from("email_campaign_sends")
						.update({
							status: "clicked",
							first_clicked_at: sendRecord.first_clicked_at || now,
							last_clicked_at: now,
							click_count: (sendRecord.click_count || 0) + 1,
							links_clicked: isNewLink ? [...linksClicked, clickedLink] : linksClicked,
							updated_at: now,
						})
						.eq("id", sendRecord.id);

					await supabase.rpc("increment_campaign_stat", {
						p_campaign_id: campaignId,
						p_field: "clicked_count",
					});

					if (isFirstClick) {
						await supabase.rpc("increment_campaign_stat", {
							p_campaign_id: campaignId,
							p_field: "unique_clicks",
						});
					}

					// Update link click tracking
					if (clickedLink) {
						const { data: linkRecord } = await supabase
							.from("email_campaign_links")
							.select("id, total_clicks, unique_clicks")
							.eq("campaign_id", campaignId)
							.eq("original_url", clickedLink)
							.single();

						if (linkRecord) {
							await supabase
								.from("email_campaign_links")
								.update({
									total_clicks: (linkRecord.total_clicks || 0) + 1,
									unique_clicks: isNewLink
										? (linkRecord.unique_clicks || 0) + 1
										: linkRecord.unique_clicks,
								})
								.eq("id", linkRecord.id);
						} else {
							await supabase.from("email_campaign_links").insert({
								campaign_id: campaignId,
								original_url: clickedLink,
								total_clicks: 1,
								unique_clicks: 1,
							});
						}
					}
					break;
				}

				case "bounce": {
					await supabase
						.from("email_campaign_sends")
						.update({
							status: "bounced",
							bounced_at: now,
							error_message: event.reason || "Email bounced",
							error_code: event.type || "bounce",
							updated_at: now,
						})
						.eq("id", sendRecord.id);

					await supabase.rpc("increment_campaign_stat", {
						p_campaign_id: campaignId,
						p_field: "bounced_count",
					});
					break;
				}

				case "spamreport": {
					await supabase
						.from("email_campaign_sends")
						.update({
							status: "complained",
							complained_at: now,
							updated_at: now,
						})
						.eq("id", sendRecord.id);

					await supabase.rpc("increment_campaign_stat", {
						p_campaign_id: campaignId,
						p_field: "complained_count",
					});
					break;
				}

				case "dropped": {
					await supabase
						.from("email_campaign_sends")
						.update({
							status: "failed",
							error_message: event.reason || "Email dropped",
							updated_at: now,
						})
						.eq("id", sendRecord.id);
					break;
				}
			}
		}

		return NextResponse.json({ received: true, processed: events.length });
	} catch (error) {
		console.error("SendGrid webhook error:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 }
		);
	}
}

// Endpoint info
export async function GET() {
	return NextResponse.json({
		message: "SendGrid webhook endpoint",
		supported_events: [
			"delivered",
			"open",
			"click",
			"bounce",
			"spamreport",
			"dropped",
		],
	});
}
