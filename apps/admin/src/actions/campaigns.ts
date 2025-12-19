"use server";

/**
 * Campaign Server Actions
 *
 * Server-side actions for managing email marketing campaigns.
 * Handles CRUD operations, sending via Resend, scheduling, and analytics.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getWebReaderClient } from "@/lib/supabase/web-reader";
import { Resend } from "resend";
import type { CampaignDraft, EmailCampaign, AudienceFilter } from "@/types/campaigns";

// Lazy-load Resend client to avoid build-time errors when API key is not available
let _resend: Resend | null = null;
function getResend(): Resend | null {
	if (!_resend) {
		const apiKey = process.env.RESEND_API_KEY;
		if (!apiKey) {
			return null;
		}
		_resend = new Resend(apiKey);
	}
	return _resend;
}

// Platform email configuration
const PLATFORM_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "hello@thorbis.com";
const PLATFORM_FROM_NAME = process.env.RESEND_FROM_NAME || "Thorbis";

// ============================================================================
// Types
// ============================================================================

type ActionResult<T = void> = {
	success: boolean;
	data?: T;
	error?: string;
};

type CreateCampaignInput = CampaignDraft;

type UpdateCampaignInput = Partial<CampaignDraft> & {
	id: string;
};

type SendCampaignResult = {
	campaignId: string;
	recipientCount: number;
	estimatedCompletionTime: string;
};

type AudiencePreviewResult = {
	estimatedCount: number;
	sampleRecipients: {
		email: string;
		name?: string;
		type: string;
	}[];
};

// ============================================================================
// Campaign CRUD Actions
// ============================================================================

/**
 * Create a new campaign as a draft
 */
export async function createCampaign(
	input: CreateCampaignInput
): Promise<ActionResult<EmailCampaign>> {
	try {
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("email_campaigns")
			.insert({
				name: input.name,
				subject: input.subject,
				preview_text: input.previewText,
				template_id: input.templateId,
				template_data: input.templateData,
				html_content: input.htmlContent,
				plain_text_content: input.plainTextContent,
				audience_type: input.audienceType,
				audience_filter: input.audienceFilter,
				from_name: input.fromName || PLATFORM_FROM_NAME,
				from_email: input.fromEmail || PLATFORM_FROM_EMAIL,
				reply_to: input.replyTo,
				tags: input.tags || [],
				notes: input.notes,
				status: "draft",
				total_recipients: 0,
				sent_count: 0,
				delivered_count: 0,
				opened_count: 0,
				unique_opens: 0,
				clicked_count: 0,
				unique_clicks: 0,
				bounced_count: 0,
				complained_count: 0,
				unsubscribed_count: 0,
				failed_count: 0,
				revenue_attributed: 0,
				conversions_count: 0,
			})
			.select()
			.single();

		if (error) {
			console.error("Failed to create campaign:", error);
			return { success: false, error: "Failed to create campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");

		return {
			success: true,
			data: mapCampaignFromDb(data),
		};
	} catch (error) {
		console.error("Failed to create campaign:", error);
		return { success: false, error: "Failed to create campaign" };
	}
}

/**
 * Update an existing campaign
 */
async function updateCampaign(
	input: UpdateCampaignInput
): Promise<ActionResult<EmailCampaign>> {
	try {
		const supabase = await createClient();

		// Build update object with only provided fields
		const updateData: Record<string, unknown> = {
			updated_at: new Date().toISOString(),
		};

		if (input.name !== undefined) updateData.name = input.name;
		if (input.subject !== undefined) updateData.subject = input.subject;
		if (input.previewText !== undefined) updateData.preview_text = input.previewText;
		if (input.templateId !== undefined) updateData.template_id = input.templateId;
		if (input.templateData !== undefined) updateData.template_data = input.templateData;
		if (input.htmlContent !== undefined) updateData.html_content = input.htmlContent;
		if (input.plainTextContent !== undefined) updateData.plain_text_content = input.plainTextContent;
		if (input.audienceType !== undefined) updateData.audience_type = input.audienceType;
		if (input.audienceFilter !== undefined) updateData.audience_filter = input.audienceFilter;
		if (input.fromName !== undefined) updateData.from_name = input.fromName;
		if (input.fromEmail !== undefined) updateData.from_email = input.fromEmail;
		if (input.replyTo !== undefined) updateData.reply_to = input.replyTo;
		if (input.tags !== undefined) updateData.tags = input.tags;
		if (input.notes !== undefined) updateData.notes = input.notes;

		const { data, error } = await supabase
			.from("email_campaigns")
			.update(updateData)
			.eq("id", input.id)
			.select()
			.single();

		if (error) {
			console.error("Failed to update campaign:", error);
			return { success: false, error: "Failed to update campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");
		revalidatePath(`/dashboard/marketing/campaigns/${input.id}`);

		return {
			success: true,
			data: mapCampaignFromDb(data),
		};
	} catch (error) {
		console.error("Failed to update campaign:", error);
		return { success: false, error: "Failed to update campaign" };
	}
}

/**
 * Delete a draft campaign
 */
async function deleteCampaign(id: string): Promise<ActionResult> {
	try {
		const supabase = await createClient();

		// Only allow deleting drafts
		const { data: campaign } = await supabase
			.from("email_campaigns")
			.select("status")
			.eq("id", id)
			.single();

		if (campaign?.status !== "draft") {
			return { success: false, error: "Only draft campaigns can be deleted" };
		}

		const { error } = await supabase
			.from("email_campaigns")
			.delete()
			.eq("id", id);

		if (error) {
			console.error("Failed to delete campaign:", error);
			return { success: false, error: "Failed to delete campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");

		return { success: true };
	} catch (error) {
		console.error("Failed to delete campaign:", error);
		return { success: false, error: "Failed to delete campaign" };
	}
}

/**
 * Duplicate an existing campaign
 */
async function duplicateCampaign(id: string): Promise<ActionResult<EmailCampaign>> {
	try {
		const supabase = await createClient();

		// Fetch original campaign
		const { data: original, error: fetchError } = await supabase
			.from("email_campaigns")
			.select("*")
			.eq("id", id)
			.single();

		if (fetchError || !original) {
			return { success: false, error: "Campaign not found" };
		}

		// Create copy with reset stats
		const { data, error } = await supabase
			.from("email_campaigns")
			.insert({
				name: `${original.name} (Copy)`,
				subject: original.subject,
				preview_text: original.preview_text,
				template_id: original.template_id,
				template_data: original.template_data,
				html_content: original.html_content,
				plain_text_content: original.plain_text_content,
				audience_type: original.audience_type,
				audience_filter: original.audience_filter,
				from_name: original.from_name,
				from_email: original.from_email,
				reply_to: original.reply_to,
				tags: original.tags,
				notes: original.notes,
				status: "draft",
				total_recipients: 0,
				sent_count: 0,
				delivered_count: 0,
				opened_count: 0,
				unique_opens: 0,
				clicked_count: 0,
				unique_clicks: 0,
				bounced_count: 0,
				complained_count: 0,
				unsubscribed_count: 0,
				failed_count: 0,
				revenue_attributed: 0,
				conversions_count: 0,
			})
			.select()
			.single();

		if (error) {
			console.error("Failed to duplicate campaign:", error);
			return { success: false, error: "Failed to duplicate campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");

		return {
			success: true,
			data: mapCampaignFromDb(data),
		};
	} catch (error) {
		console.error("Failed to duplicate campaign:", error);
		return { success: false, error: "Failed to duplicate campaign" };
	}
}

// ============================================================================
// Campaign Sending Actions
// ============================================================================

/**
 * Send a campaign immediately
 */
export async function sendCampaign(id: string): Promise<ActionResult<SendCampaignResult>> {
	try {
		const supabase = await createClient();

		// Get campaign details
		const { data: campaign, error: fetchError } = await supabase
			.from("email_campaigns")
			.select("*")
			.eq("id", id)
			.single();

		if (fetchError || !campaign) {
			return { success: false, error: "Campaign not found" };
		}

		if (campaign.status !== "draft") {
			return { success: false, error: "Only draft campaigns can be sent" };
		}

		// Get recipients based on audience type
		const recipients = await getAudienceRecipients(campaign.audience_type, campaign.audience_filter);

		if (recipients.length === 0) {
			return { success: false, error: "No recipients found for this audience" };
		}

		// Update campaign status to sending
		await supabase
			.from("email_campaigns")
			.update({
				status: "sending",
				sending_started_at: new Date().toISOString(),
				total_recipients: recipients.length,
			})
			.eq("id", id);

		// Create send records for each recipient
		const sendRecords = recipients.map((recipient) => ({
			campaign_id: id,
			recipient_email: recipient.email,
			recipient_name: recipient.name,
			recipient_type: recipient.type,
			recipient_id: recipient.id,
			status: "pending",
		}));

		await supabase.from("email_campaign_sends").insert(sendRecords);

		// Send emails via Resend (batch processing)
		let sentCount = 0;
		let failedCount = 0;

		const resend = getResend();
		if (!resend) {
			return { success: false, error: "Email service not configured" };
		}

		for (const recipient of recipients) {
			try {
				const { data: sendResult, error: sendError } = await resend.emails.send({
					from: `${campaign.from_name} <${campaign.from_email}>`,
					to: recipient.email,
					subject: campaign.subject,
					html: campaign.html_content || `<p>${campaign.plain_text_content}</p>`,
					text: campaign.plain_text_content,
					replyTo: campaign.reply_to,
					tags: [
						{ name: "campaign_id", value: id },
						{ name: "recipient_type", value: recipient.type },
					],
				});

				if (sendError) {
					failedCount++;
					// Update send record with error
					await supabase
						.from("email_campaign_sends")
						.update({
							status: "failed",
							error_message: sendError.message,
							updated_at: new Date().toISOString(),
						})
						.eq("campaign_id", id)
						.eq("recipient_email", recipient.email);
				} else {
					sentCount++;
					// Update send record with Resend ID
					await supabase
						.from("email_campaign_sends")
						.update({
							status: "sent",
							resend_id: sendResult?.id,
							sent_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
						})
						.eq("campaign_id", id)
						.eq("recipient_email", recipient.email);
				}
			} catch (err) {
				failedCount++;
				console.error(`Failed to send to ${recipient.email}:`, err);
			}
		}

		// Update campaign with final stats
		await supabase
			.from("email_campaigns")
			.update({
				status: "sent",
				sent_at: new Date().toISOString(),
				completed_at: new Date().toISOString(),
				sent_count: sentCount,
				failed_count: failedCount,
			})
			.eq("id", id);

		revalidatePath("/dashboard/marketing/campaigns");
		revalidatePath(`/dashboard/marketing/campaigns/${id}`);

		return {
			success: true,
			data: {
				campaignId: id,
				recipientCount: recipients.length,
				estimatedCompletionTime: new Date().toISOString(),
			},
		};
	} catch (error) {
		console.error("Failed to send campaign:", error);
		return { success: false, error: "Failed to send campaign" };
	}
}

/**
 * Schedule a campaign for later
 */
export async function scheduleCampaign(
	id: string,
	scheduledFor: string
): Promise<ActionResult> {
	try {
		const supabase = await createClient();

		// Validate campaign is in draft status
		const { data: campaign } = await supabase
			.from("email_campaigns")
			.select("status, audience_type, audience_filter")
			.eq("id", id)
			.single();

		if (campaign?.status !== "draft") {
			return { success: false, error: "Only draft campaigns can be scheduled" };
		}

		// Get recipient count for the campaign
		const recipients = await getAudienceRecipients(campaign.audience_type, campaign.audience_filter);

		const { error } = await supabase
			.from("email_campaigns")
			.update({
				status: "scheduled",
				scheduled_for: scheduledFor,
				total_recipients: recipients.length,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id);

		if (error) {
			console.error("Failed to schedule campaign:", error);
			return { success: false, error: "Failed to schedule campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");
		revalidatePath(`/dashboard/marketing/campaigns/${id}`);

		return { success: true };
	} catch (error) {
		console.error("Failed to schedule campaign:", error);
		return { success: false, error: "Failed to schedule campaign" };
	}
}

/**
 * Cancel a scheduled campaign
 */
async function cancelScheduledCampaign(id: string): Promise<ActionResult> {
	try {
		const supabase = await createClient();

		const { error } = await supabase
			.from("email_campaigns")
			.update({
				status: "draft",
				scheduled_for: null,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.eq("status", "scheduled");

		if (error) {
			console.error("Failed to cancel scheduled campaign:", error);
			return { success: false, error: "Failed to cancel scheduled campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");
		revalidatePath(`/dashboard/marketing/campaigns/${id}`);

		return { success: true };
	} catch (error) {
		console.error("Failed to cancel scheduled campaign:", error);
		return { success: false, error: "Failed to cancel scheduled campaign" };
	}
}

/**
 * Pause a sending campaign
 */
async function pauseCampaign(id: string): Promise<ActionResult> {
	try {
		const supabase = await createClient();

		const { error } = await supabase
			.from("email_campaigns")
			.update({
				status: "paused",
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.eq("status", "sending");

		if (error) {
			console.error("Failed to pause campaign:", error);
			return { success: false, error: "Failed to pause campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");
		revalidatePath(`/dashboard/marketing/campaigns/${id}`);

		return { success: true };
	} catch (error) {
		console.error("Failed to pause campaign:", error);
		return { success: false, error: "Failed to pause campaign" };
	}
}

/**
 * Resume a paused campaign
 */
async function resumeCampaign(id: string): Promise<ActionResult> {
	try {
		const supabase = await createClient();

		const { error } = await supabase
			.from("email_campaigns")
			.update({
				status: "sending",
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.eq("status", "paused");

		if (error) {
			console.error("Failed to resume campaign:", error);
			return { success: false, error: "Failed to resume campaign" };
		}

		revalidatePath("/dashboard/marketing/campaigns");
		revalidatePath(`/dashboard/marketing/campaigns/${id}`);

		return { success: true };
	} catch (error) {
		console.error("Failed to resume campaign:", error);
		return { success: false, error: "Failed to resume campaign" };
	}
}

// ============================================================================
// Audience Actions
// ============================================================================

/**
 * Preview audience based on filters
 * Returns estimated count and sample recipients
 */
async function previewAudience(
	audienceType: string,
	filter?: AudienceFilter
): Promise<ActionResult<AudiencePreviewResult>> {
	try {
		const recipients = await getAudienceRecipients(audienceType, filter);

		return {
			success: true,
			data: {
				estimatedCount: recipients.length,
				sampleRecipients: recipients.slice(0, 5).map((r) => ({
					email: r.email,
					name: r.name,
					type: r.type,
				})),
			},
		};
	} catch (error) {
		console.error("Failed to preview audience:", error);
		return { success: false, error: "Failed to preview audience" };
	}
}

// ============================================================================
// Analytics Actions
// ============================================================================

/**
 * Get campaign analytics
 */
async function getCampaignAnalytics(id: string): Promise<ActionResult<{
	topLinks: { url: string; linkText: string; clicks: number; uniqueClicks: number }[];
	deviceBreakdown: { desktop: number; mobile: number; tablet: number };
	hourlyOpens: { hour: string; opens: number }[];
}>> {
	try {
		const supabase = await createClient();

		// Get link performance
		const { data: links } = await supabase
			.from("email_campaign_links")
			.select("*")
			.eq("campaign_id", id)
			.order("unique_clicks", { ascending: false })
			.limit(10);

		const topLinks = (links || []).map((link) => ({
			url: link.original_url,
			linkText: link.link_text || link.original_url,
			clicks: link.total_clicks || 0,
			uniqueClicks: link.unique_clicks || 0,
		}));

		// Get send metadata for device breakdown (from metadata JSONB)
		const { data: sends } = await supabase
			.from("email_campaign_sends")
			.select("metadata, first_opened_at")
			.eq("campaign_id", id)
			.not("first_opened_at", "is", null);

		// Calculate device breakdown from metadata
		let desktop = 0;
		let mobile = 0;
		let tablet = 0;

		(sends || []).forEach((send) => {
			const device = (send.metadata as Record<string, unknown>)?.device as string;
			if (device === "mobile") mobile++;
			else if (device === "tablet") tablet++;
			else desktop++;
		});

		const total = desktop + mobile + tablet || 1;
		const deviceBreakdown = {
			desktop: Math.round((desktop / total) * 100),
			mobile: Math.round((mobile / total) * 100),
			tablet: Math.round((tablet / total) * 100),
		};

		// Calculate hourly opens
		const hourlyMap: Record<string, number> = {};
		(sends || []).forEach((send) => {
			if (send.first_opened_at) {
				const hour = new Date(send.first_opened_at).getHours();
				const hourLabel = hour < 12 ? `${hour || 12} AM` : `${hour === 12 ? 12 : hour - 12} PM`;
				hourlyMap[hourLabel] = (hourlyMap[hourLabel] || 0) + 1;
			}
		});

		const hourlyOpens = Object.entries(hourlyMap)
			.map(([hour, opens]) => ({ hour, opens }))
			.sort((a, b) => {
				const parseHour = (h: string) => {
					const [num, period] = h.split(" ");
					return period === "PM" && num !== "12" ? parseInt(num) + 12 : parseInt(num);
				};
				return parseHour(a.hour) - parseHour(b.hour);
			});

		return {
			success: true,
			data: { topLinks, deviceBreakdown, hourlyOpens },
		};
	} catch (error) {
		console.error("Failed to get campaign analytics:", error);
		return { success: false, error: "Failed to get campaign analytics" };
	}
}

/**
 * Record a webhook event (open, click, bounce, etc.)
 * Called by Resend webhooks
 */
async function recordCampaignEvent(
	campaignId: string,
	recipientEmail: string,
	eventType: "delivered" | "opened" | "clicked" | "bounced" | "complained" | "unsubscribed",
	eventData?: Record<string, unknown>
): Promise<ActionResult> {
	try {
		const supabase = await createClient();
		const now = new Date().toISOString();

		// Update send record
		const updateData: Record<string, unknown> = {
			updated_at: now,
		};

		switch (eventType) {
			case "delivered":
				updateData.status = "delivered";
				updateData.delivered_at = now;
				break;
			case "opened":
				updateData.status = "opened";
				updateData.last_opened_at = now;
				// Increment open count
				await supabase.rpc("increment_campaign_send_open_count", {
					p_campaign_id: campaignId,
					p_recipient_email: recipientEmail,
				});
				break;
			case "clicked":
				updateData.status = "clicked";
				updateData.last_clicked_at = now;
				if (eventData?.url) {
					// Record link click
					await supabase.rpc("increment_campaign_link_click", {
						p_campaign_id: campaignId,
						p_url: eventData.url,
					});
				}
				break;
			case "bounced":
				updateData.status = "bounced";
				updateData.bounced_at = now;
				updateData.error_message = eventData?.reason as string;
				break;
			case "complained":
				updateData.status = "complained";
				updateData.complained_at = now;
				break;
			case "unsubscribed":
				updateData.unsubscribed_at = now;
				break;
		}

		await supabase
			.from("email_campaign_sends")
			.update(updateData)
			.eq("campaign_id", campaignId)
			.eq("recipient_email", recipientEmail);

		// Update aggregate campaign stats
		await updateCampaignStats(campaignId);

		return { success: true };
	} catch (error) {
		console.error("Failed to record campaign event:", error);
		return { success: false, error: "Failed to record campaign event" };
	}
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get recipients based on audience type and filter
 * Uses web database for users/companies (read-only access)
 * Uses admin database for email suppressions
 */
async function getAudienceRecipients(
	audienceType: string,
	filter?: AudienceFilter | null
): Promise<{ email: string; name?: string; type: string; id?: string }[]> {
	const adminDb = await createClient();
	const webDb = getWebReaderClient();
	const recipients: { email: string; name?: string; type: string; id?: string }[] = [];

	// Return empty if web database is not configured (for audience types that need it)
	if (!webDb && ["all_users", "all_companies", "segment"].includes(audienceType)) {
		console.warn("Web database reader not configured, returning empty recipients for:", audienceType);
		return recipients;
	}

	switch (audienceType) {
		case "waitlist": {
			// Get waitlist subscribers from admin database
			const { data: waitlistData } = await adminDb
				.from("waitlist")
				.select("id, email, name")
				.eq("status", "pending")
				.not("email", "is", null);

			recipients.push(...(waitlistData || []).map((w) => ({
				email: w.email,
				name: w.name || undefined,
				type: "waitlist",
				id: w.id,
			})));
			break;
		}

		case "all_users": {
			// Get all users from the WEB database (read-only)
			const { data: users } = await webDb!
				.from("users")
				.select("id, email, full_name")
				.not("email", "is", null) as { data: { id: string; email: string; full_name: string | null }[] | null };

			recipients.push(...(users || []).map((u) => ({
				email: u.email,
				name: u.full_name || undefined,
				type: "user",
				id: u.id,
			})));
			break;
		}

		case "all_companies": {
			// Get primary contacts from all companies in WEB database (read-only)
			const { data: companies } = await webDb!
				.from("companies")
				.select("id, email, name")
				.not("email", "is", null) as { data: { id: string; email: string; name: string | null }[] | null };

			recipients.push(...(companies || []).map((c) => ({
				email: c.email,
				name: c.name || undefined,
				type: "company",
				id: c.id,
			})));
			break;
		}

		case "custom": {
			// Use custom email list from filter
			if (filter?.customEmails) {
				recipients.push(...filter.customEmails.map((email) => ({
					email,
					type: "custom",
				})));
			}
			break;
		}

		case "segment": {
			// Filter users based on segment criteria from WEB database (read-only)
			type UserResult = { id: string; email: string; full_name: string | null; role: string | null };
			let query = webDb!.from("users").select("id, email, full_name, role");

			if (filter?.userRoles?.length) {
				query = query.in("role", filter.userRoles);
			}
			if (filter?.userStatuses?.length) {
				query = query.in("status", filter.userStatuses);
			}
			if (filter?.createdAfter) {
				query = query.gte("created_at", filter.createdAfter);
			}
			if (filter?.createdBefore) {
				query = query.lte("created_at", filter.createdBefore);
			}

			const { data: users } = await query.not("email", "is", null) as { data: UserResult[] | null };
			recipients.push(...(users || []).map((u) => ({
				email: u.email,
				name: u.full_name || undefined,
				type: "segment",
				id: u.id,
			})));
			break;
		}
	}

	// Apply exclusions from admin database
	if (filter?.excludeUnsubscribed || filter?.excludeBounced || filter?.excludeComplained) {
		// Get suppressed emails from admin database
		const { data: suppressions } = await adminDb
			.from("email_suppressions")
			.select("email, reason");

		const suppressedEmails = new Set(
			(suppressions || [])
				.filter((s) => {
					if (filter.excludeUnsubscribed && s.reason === "unsubscribed") return true;
					if (filter.excludeBounced && s.reason === "bounced") return true;
					if (filter.excludeComplained && s.reason === "complained") return true;
					return false;
				})
				.map((s) => s.email.toLowerCase())
		);

		return recipients.filter((r) => !suppressedEmails.has(r.email.toLowerCase()));
	}

	return recipients;
}


/**
 * Update aggregate campaign statistics
 */
async function updateCampaignStats(campaignId: string): Promise<void> {
	const supabase = await createClient();

	// Get counts from sends table
	const { data: stats } = await supabase
		.from("email_campaign_sends")
		.select("status")
		.eq("campaign_id", campaignId);

	if (!stats) return;

	const counts = {
		delivered_count: stats.filter((s) => ["delivered", "opened", "clicked"].includes(s.status)).length,
		opened_count: stats.filter((s) => ["opened", "clicked"].includes(s.status)).length,
		unique_opens: stats.filter((s) => ["opened", "clicked"].includes(s.status)).length,
		clicked_count: stats.filter((s) => s.status === "clicked").length,
		unique_clicks: stats.filter((s) => s.status === "clicked").length,
		bounced_count: stats.filter((s) => s.status === "bounced").length,
		complained_count: stats.filter((s) => s.status === "complained").length,
	};

	await supabase
		.from("email_campaigns")
		.update(counts)
		.eq("id", campaignId);
}

/**
 * Map database row to EmailCampaign type
 */
function mapCampaignFromDb(row: Record<string, unknown>): EmailCampaign {
	return {
		id: row.id as string,
		name: row.name as string,
		subject: row.subject as string,
		previewText: row.preview_text as string | undefined,
		templateId: row.template_id as string | undefined,
		templateData: row.template_data as Record<string, unknown> | undefined,
		htmlContent: row.html_content as string | undefined,
		plainTextContent: row.plain_text_content as string | undefined,
		status: row.status as EmailCampaign["status"],
		scheduledFor: row.scheduled_for as string | undefined,
		audienceType: row.audience_type as EmailCampaign["audienceType"],
		audienceFilter: row.audience_filter as EmailCampaign["audienceFilter"],
		totalRecipients: (row.total_recipients as number) || 0,
		sentCount: (row.sent_count as number) || 0,
		deliveredCount: (row.delivered_count as number) || 0,
		openedCount: (row.opened_count as number) || 0,
		uniqueOpens: (row.unique_opens as number) || 0,
		clickedCount: (row.clicked_count as number) || 0,
		uniqueClicks: (row.unique_clicks as number) || 0,
		bouncedCount: (row.bounced_count as number) || 0,
		complainedCount: (row.complained_count as number) || 0,
		unsubscribedCount: (row.unsubscribed_count as number) || 0,
		failedCount: (row.failed_count as number) || 0,
		revenueAttributed: Number(row.revenue_attributed || 0),
		conversionsCount: (row.conversions_count as number) || 0,
		fromName: row.from_name as string,
		fromEmail: row.from_email as string,
		replyTo: row.reply_to as string | undefined,
		tags: (row.tags as string[]) || [],
		notes: row.notes as string | undefined,
		createdAt: row.created_at as string,
		updatedAt: row.updated_at as string,
		sentAt: row.sent_at as string | undefined,
	};
}
