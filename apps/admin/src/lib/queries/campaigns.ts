/**
 * Campaign Data Fetching Queries
 *
 * Server-side queries for email campaigns using React.cache() for deduplication.
 * These queries are used by Server Components and Server Actions.
 */

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { EmailCampaign, EmailCampaignSend, EmailCampaignLink } from "@/types/campaigns";

// ============================================================================
// Campaign Queries
// ============================================================================

/**
 * Get all campaigns with optional filtering
 */
export const getCampaigns = cache(async (options?: {
	status?: string;
	audienceType?: string;
	limit?: number;
	offset?: number;
}): Promise<EmailCampaign[]> => {
	const supabase = await createClient();

	let query = supabase
		.from("email_campaigns")
		.select("*")
		.order("created_at", { ascending: false });

	if (options?.status) {
		query = query.eq("status", options.status);
	}

	if (options?.audienceType) {
		query = query.eq("audience_type", options.audienceType);
	}

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	if (options?.offset) {
		query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Failed to fetch campaigns:", error);
		return [];
	}

	return (data || []).map(mapCampaignFromDb);
});

/**
 * Get a single campaign by ID with detailed stats
 */
export const getCampaignById = cache(async (id: string): Promise<EmailCampaign | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("email_campaigns")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Failed to fetch campaign:", error);
		return null;
	}

	return mapCampaignFromDb(data);
});

/**
 * Get campaign statistics aggregated from all campaigns
 */
export const getCampaignStats = cache(async (): Promise<{
	totalCampaigns: number;
	activeCampaigns: number;
	totalSent: number;
	totalDelivered: number;
	totalOpens: number;
	totalClicks: number;
	totalRevenue: number;
	avgOpenRate: number;
	avgClickRate: number;
}> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("email_campaigns")
		.select("status, sent_count, delivered_count, unique_opens, unique_clicks, revenue_attributed");

	if (error) {
		console.error("Failed to fetch campaign stats:", error);
		return {
			totalCampaigns: 0,
			activeCampaigns: 0,
			totalSent: 0,
			totalDelivered: 0,
			totalOpens: 0,
			totalClicks: 0,
			totalRevenue: 0,
			avgOpenRate: 0,
			avgClickRate: 0,
		};
	}

	const campaigns = data || [];
	const sentCampaigns = campaigns.filter((c) => c.status === "sent");

	const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
	const totalDelivered = sentCampaigns.reduce((sum, c) => sum + (c.delivered_count || 0), 0);
	const totalOpens = sentCampaigns.reduce((sum, c) => sum + (c.unique_opens || 0), 0);
	const totalClicks = sentCampaigns.reduce((sum, c) => sum + (c.unique_clicks || 0), 0);
	const totalRevenue = sentCampaigns.reduce((sum, c) => sum + Number(c.revenue_attributed || 0), 0);

	return {
		totalCampaigns: campaigns.length,
		activeCampaigns: campaigns.filter((c) => c.status === "sending" || c.status === "scheduled").length,
		totalSent,
		totalDelivered,
		totalOpens,
		totalClicks,
		totalRevenue,
		avgOpenRate: totalDelivered > 0 ? (totalOpens / totalDelivered) * 100 : 0,
		avgClickRate: totalDelivered > 0 ? (totalClicks / totalDelivered) * 100 : 0,
	};
});

// ============================================================================
// Campaign Sends Queries
// ============================================================================

/**
 * Get sends for a specific campaign
 */
const getCampaignSends = cache(async (
	campaignId: string,
	options?: {
		status?: string;
		limit?: number;
		offset?: number;
	}
): Promise<EmailCampaignSend[]> => {
	const supabase = await createClient();

	let query = supabase
		.from("email_campaign_sends")
		.select("*")
		.eq("campaign_id", campaignId)
		.order("sent_at", { ascending: false });

	if (options?.status) {
		query = query.eq("status", options.status);
	}

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Failed to fetch campaign sends:", error);
		return [];
	}

	return (data || []).map(mapSendFromDb);
});

/**
 * Get send statistics for a campaign
 */
const getCampaignSendStats = cache(async (campaignId: string): Promise<{
	total: number;
	pending: number;
	sent: number;
	delivered: number;
	opened: number;
	clicked: number;
	bounced: number;
	failed: number;
}> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("email_campaign_sends")
		.select("status")
		.eq("campaign_id", campaignId);

	if (error) {
		console.error("Failed to fetch send stats:", error);
		return { total: 0, pending: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, failed: 0 };
	}

	const sends = data || [];
	return {
		total: sends.length,
		pending: sends.filter((s) => s.status === "pending").length,
		sent: sends.filter((s) => s.status === "sent").length,
		delivered: sends.filter((s) => s.status === "delivered").length,
		opened: sends.filter((s) => s.status === "opened").length,
		clicked: sends.filter((s) => s.status === "clicked").length,
		bounced: sends.filter((s) => s.status === "bounced").length,
		failed: sends.filter((s) => s.status === "failed").length,
	};
});

// ============================================================================
// Campaign Links Queries
// ============================================================================

/**
 * Get link click data for a campaign
 */
export const getCampaignLinks = cache(async (campaignId: string): Promise<EmailCampaignLink[]> => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("email_campaign_links")
		.select("*")
		.eq("campaign_id", campaignId)
		.order("unique_clicks", { ascending: false });

	if (error) {
		console.error("Failed to fetch campaign links:", error);
		return [];
	}

	return (data || []).map((link) => ({
		id: link.id,
		campaignId: link.campaign_id,
		originalUrl: link.original_url,
		trackedUrl: link.tracking_url || "",
		linkText: link.link_text,
		totalClicks: link.total_clicks || 0,
		uniqueClicks: link.unique_clicks || 0,
		createdAt: link.created_at,
	}));
});

// ============================================================================
// Helpers
// ============================================================================

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

/**
 * Map database row to EmailCampaignSend type
 */
function mapSendFromDb(row: Record<string, unknown>): EmailCampaignSend {
	return {
		id: row.id as string,
		campaignId: row.campaign_id as string,
		recipientEmail: row.recipient_email as string,
		recipientName: row.recipient_name as string | undefined,
		recipientType: row.recipient_type as EmailCampaignSend["recipientType"],
		recipientId: row.recipient_id as string | undefined,
		status: row.status as EmailCampaignSend["status"],
		resendId: row.resend_id as string | undefined,
		sentAt: row.sent_at as string | undefined,
		deliveredAt: row.delivered_at as string | undefined,
		firstOpenedAt: row.first_opened_at as string | undefined,
		lastOpenedAt: row.last_opened_at as string | undefined,
		firstClickedAt: row.first_clicked_at as string | undefined,
		lastClickedAt: row.last_clicked_at as string | undefined,
		bouncedAt: row.bounced_at as string | undefined,
		complainedAt: row.complained_at as string | undefined,
		unsubscribedAt: row.unsubscribed_at as string | undefined,
		openCount: (row.open_count as number) || 0,
		clickCount: (row.click_count as number) || 0,
		linksClicked: ((row.links_clicked as string[]) || []).map((url) => ({ url, clickedAt: "", count: 1 })),
		errorMessage: row.error_message as string | undefined,
		errorCode: row.error_code as string | undefined,
		metadata: row.metadata as Record<string, unknown> | undefined,
		createdAt: row.created_at as string,
		updatedAt: row.updated_at as string,
	};
}
