import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Resend Webhook Handler
 *
 * Handles email events from Resend:
 * - email.delivered
 * - email.opened
 * - email.clicked
 * - email.bounced
 * - email.complained
 *
 * To set up:
 * 1. Go to Resend Dashboard > Webhooks
 * 2. Add webhook URL: https://your-domain.com/api/webhooks/resend
 * 3. Select events: delivered, opened, clicked, bounced, complained
 * 4. Copy the signing secret and add to RESEND_WEBHOOK_SECRET env var
 */

// Resend webhook event types
type ResendEventType =
	| "email.sent"
	| "email.delivered"
	| "email.delivery_delayed"
	| "email.complained"
	| "email.bounced"
	| "email.opened"
	| "email.clicked";

interface ResendWebhookPayload {
	type: ResendEventType;
	created_at: string;
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject: string;
		created_at: string;
		// For click events
		click?: {
			link: string;
			timestamp: string;
		};
		// For bounce events
		bounce?: {
			message: string;
			type: string;
		};
		// Tags included with the email
		tags?: Array<{ name: string; value: string }>;
	};
}

export async function POST(request: NextRequest) {
	try {
		const payload: ResendWebhookPayload = await request.json();
		const { type, data } = payload;

		// Extract campaign_id from tags
		const campaignIdTag = data.tags?.find((tag) => tag.name === "campaign_id");
		const campaignId = campaignIdTag?.value;

		if (!campaignId) {
			// Not a campaign email, ignore
			return NextResponse.json({ received: true, message: "Not a campaign email" });
		}

		const supabase = await createClient();
		const recipientEmail = data.to[0]; // First recipient
		const now = new Date().toISOString();

		// Find the send record
		const { data: sendRecord } = await supabase
			.from("email_campaign_sends")
			.select("id, status, open_count, click_count, links_clicked, first_opened_at, first_clicked_at")
			.eq("campaign_id", campaignId)
			.eq("recipient_email", recipientEmail)
			.single();

		if (!sendRecord) {
			return NextResponse.json({ received: true, message: "Send record not found" });
		}

		// Handle different event types
		switch (type) {
			case "email.delivered": {
				// Update send record
				await supabase
					.from("email_campaign_sends")
					.update({
						status: "delivered",
						delivered_at: now,
						updated_at: now,
					})
					.eq("id", sendRecord.id);

				// Update campaign stats
				await supabase.rpc("increment_campaign_stat", {
					p_campaign_id: campaignId,
					p_field: "delivered_count",
				});
				break;
			}

			case "email.opened": {
				const isFirstOpen = sendRecord.status !== "opened" && sendRecord.status !== "clicked";

				// Update send record
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

				// Update campaign stats
				await supabase.rpc("increment_campaign_stat", {
					p_campaign_id: campaignId,
					p_field: "opened_count",
				});

				// Only increment unique opens if this is the first open
				if (isFirstOpen) {
					await supabase.rpc("increment_campaign_stat", {
						p_campaign_id: campaignId,
						p_field: "unique_opens",
					});
				}
				break;
			}

			case "email.clicked": {
				const clickedLink = data.click?.link || "";
				const isFirstClick = sendRecord.status !== "clicked";
				const linksClicked = sendRecord.links_clicked || [];
				const isNewLink = !linksClicked.includes(clickedLink);

				// Update send record
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

				// Update campaign stats
				await supabase.rpc("increment_campaign_stat", {
					p_campaign_id: campaignId,
					p_field: "clicked_count",
				});

				// Only increment unique clicks if this is the first click
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
						// Create new link record
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

			case "email.bounced": {
				// Update send record
				await supabase
					.from("email_campaign_sends")
					.update({
						status: "bounced",
						bounced_at: now,
						error_message: data.bounce?.message || "Email bounced",
						error_code: data.bounce?.type || "bounce",
						updated_at: now,
					})
					.eq("id", sendRecord.id);

				// Update campaign stats
				await supabase.rpc("increment_campaign_stat", {
					p_campaign_id: campaignId,
					p_field: "bounced_count",
				});
				break;
			}

			case "email.complained": {
				// Update send record
				await supabase
					.from("email_campaign_sends")
					.update({
						status: "complained",
						complained_at: now,
						updated_at: now,
					})
					.eq("id", sendRecord.id);

				// Update campaign stats
				await supabase.rpc("increment_campaign_stat", {
					p_campaign_id: campaignId,
					p_field: "complained_count",
				});
				break;
			}
		}

		return NextResponse.json({ received: true, event: type });
	} catch (error) {
		console.error("Resend webhook error:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 }
		);
	}
}

// Verify webhook signature (optional but recommended)
export async function GET() {
	return NextResponse.json({
		message: "Resend webhook endpoint",
		supported_events: [
			"email.delivered",
			"email.opened",
			"email.clicked",
			"email.bounced",
			"email.complained",
		],
	});
}
