"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Deliverability Monitor for Multi-Tenant Email System
 *
 * Features:
 * - Track delivery events (delivered, bounced, complained)
 * - Update domain reputation scores
 * - Auto-suspend domains with poor reputation
 * - Generate deliverability reports
 */

export type DeliveryEventType =
	| "delivered"
	| "bounced"
	| "soft_bounce"
	| "complained"
	| "opened"
	| "clicked";

export interface DeliveryEvent {
	domainId: string;
	eventType: DeliveryEventType;
	emailId?: string;
	metadata?: Record<string, any>;
}

export interface DomainHealth {
	domainId: string;
	domain: string;
	reputationScore: number;
	bounceRate: number;
	complaintRate: number;
	deliveryRate: number;
	status: "healthy" | "warning" | "critical" | "suspended";
	totalEmailsSent: number;
	hardBounces: number;
	softBounces: number;
	complaints: number;
	lastHealthCheck: string | null;
}

/**
 * Record a delivery event and update domain metrics
 */
export async function recordDeliveryEvent(
	event: DeliveryEvent,
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createServiceSupabaseClient();

	// Use the database function to update reputation
	const { error } = await supabase.rpc("update_domain_reputation", {
		p_domain_id: event.domainId,
		p_event_type: event.eventType,
	});

	if (error) {
		console.error("Error recording delivery event:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

/**
 * Process Resend webhook events for deliverability tracking
 */
async function processResendWebhookEvent(webhookData: {
	type: string;
	data: {
		email_id?: string;
		from?: string;
		to?: string[];
		subject?: string;
		created_at?: string;
		[key: string]: any;
	};
}): Promise<{ success: boolean; error?: string }> {
	const supabase = await createServiceSupabaseClient();

	// Map Resend event types to our event types
	const eventTypeMap: Record<string, DeliveryEventType | null> = {
		"email.delivered": "delivered",
		"email.bounced": "bounced",
		"email.complained": "complained",
		"email.opened": "opened",
		"email.clicked": "clicked",
		// Soft bounces might come as delivery_delayed in some providers
		"email.delivery_delayed": "soft_bounce",
	};

	const eventType = eventTypeMap[webhookData.type];
	if (!eventType) {
		// Not a delivery event we track
		return { success: true };
	}

	// Extract domain from the "from" address
	const fromEmail = webhookData.data.from;
	if (!fromEmail) {
		return { success: true };
	}

	const domain = fromEmail.includes("@") ? fromEmail.split("@")[1] : fromEmail;

	// Look up the domain in our database
	const { data: domainRecord } = await supabase
		.from("company_email_domains")
		.select("id")
		.eq("domain_name", domain)
		.maybeSingle();

	if (!domainRecord) {
		// Domain not found in our system
		return { success: true };
	}

	// Record the event
	return recordDeliveryEvent({
		domainId: domainRecord.id,
		eventType,
		emailId: webhookData.data.email_id,
		metadata: webhookData.data,
	});
}

/**
 * Get domain health status
 */
async function getDomainHealth(
	domainId: string,
): Promise<DomainHealth | null> {
	const supabase = await createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("company_email_domains")
		.select(
			"id, domain_name, reputation_score, bounce_rate, total_emails_sent, hard_bounces, soft_bounces, spam_complaints, is_suspended, last_health_check",
		)
		.eq("id", domainId)
		.single();

	if (error || !data) {
		return null;
	}

	const totalEvents =
		data.total_emails_sent + data.hard_bounces + data.soft_bounces;
	const bounceRate =
		totalEvents > 0
			? ((data.hard_bounces + data.soft_bounces) / totalEvents) * 100
			: 0;
	const complaintRate =
		data.total_emails_sent > 0
			? (data.spam_complaints / data.total_emails_sent) * 100
			: 0;
	const deliveryRate =
		totalEvents > 0 ? (data.total_emails_sent / totalEvents) * 100 : 100;

	let status: DomainHealth["status"] = "healthy";
	if (data.is_suspended) {
		status = "suspended";
	} else if (
		data.reputation_score < 30 ||
		bounceRate > 10 ||
		complaintRate > 0.5
	) {
		status = "critical";
	} else if (
		data.reputation_score < 60 ||
		bounceRate > 5 ||
		complaintRate > 0.2
	) {
		status = "warning";
	}

	return {
		domainId: data.id,
		domain: data.domain_name,
		reputationScore: Number(data.reputation_score),
		bounceRate: Number(bounceRate.toFixed(2)),
		complaintRate: Number(complaintRate.toFixed(3)),
		deliveryRate: Number(deliveryRate.toFixed(2)),
		status,
		totalEmailsSent: data.total_emails_sent,
		hardBounces: data.hard_bounces,
		softBounces: data.soft_bounces,
		complaints: data.spam_complaints,
		lastHealthCheck: data.last_health_check,
	};
}

/**
 * Get all domains health for a company
 */
async function getCompanyDomainsHealth(
	companyId: string,
): Promise<DomainHealth[]> {
	const supabase = await createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("company_email_domains")
		.select(
			"id, domain_name, reputation_score, bounce_rate, total_emails_sent, hard_bounces, soft_bounces, spam_complaints, is_suspended, last_health_check",
		)
		.eq("company_id", companyId);

	if (error || !data) {
		return [];
	}

	return data.map((d) => {
		const totalEvents = d.total_emails_sent + d.hard_bounces + d.soft_bounces;
		const bounceRate =
			totalEvents > 0
				? ((d.hard_bounces + d.soft_bounces) / totalEvents) * 100
				: 0;
		const complaintRate =
			d.total_emails_sent > 0
				? (d.spam_complaints / d.total_emails_sent) * 100
				: 0;
		const deliveryRate =
			totalEvents > 0 ? (d.total_emails_sent / totalEvents) * 100 : 100;

		let status: DomainHealth["status"] = "healthy";
		if (d.is_suspended) {
			status = "suspended";
		} else if (
			d.reputation_score < 30 ||
			bounceRate > 10 ||
			complaintRate > 0.5
		) {
			status = "critical";
		} else if (
			d.reputation_score < 60 ||
			bounceRate > 5 ||
			complaintRate > 0.2
		) {
			status = "warning";
		}

		return {
			domainId: d.id,
			domain: d.domain_name,
			reputationScore: Number(d.reputation_score),
			bounceRate: Number(bounceRate.toFixed(2)),
			complaintRate: Number(complaintRate.toFixed(3)),
			deliveryRate: Number(deliveryRate.toFixed(2)),
			status,
			totalEmailsSent: d.total_emails_sent,
			hardBounces: d.hard_bounces,
			softBounces: d.soft_bounces,
			complaints: d.spam_complaints,
			lastHealthCheck: d.last_health_check,
		};
	});
}

/**
 * Run health check on all domains and update status
 */
async function runHealthCheckForAllDomains(): Promise<{
	checked: number;
	suspended: number;
	warnings: number;
}> {
	const supabase = await createServiceSupabaseClient();

	// Get all active domains
	const { data: domains } = await supabase
		.from("company_email_domains")
		.select(
			"id, reputation_score, hard_bounces, soft_bounces, spam_complaints, total_emails_sent",
		)
		.eq("is_suspended", false);

	if (!domains) {
		return { checked: 0, suspended: 0, warnings: 0 };
	}

	let suspended = 0;
	let warnings = 0;

	for (const domain of domains) {
		const totalEvents =
			domain.total_emails_sent + domain.hard_bounces + domain.soft_bounces;
		const bounceRate =
			totalEvents > 100
				? ((domain.hard_bounces + domain.soft_bounces) / totalEvents) * 100
				: 0;
		const complaintRate =
			domain.total_emails_sent > 100
				? (domain.spam_complaints / domain.total_emails_sent) * 100
				: 0;

		// Auto-suspend if reputation is critical
		if (domain.reputation_score < 20 || bounceRate > 15 || complaintRate > 1) {
			await supabase
				.from("company_email_domains")
				.update({
					is_suspended: true,
					suspension_reason: `Auto-suspended: Reputation ${domain.reputation_score}, Bounce rate ${bounceRate.toFixed(1)}%, Complaint rate ${complaintRate.toFixed(2)}%`,
					suspended_at: new Date().toISOString(),
					last_health_check: new Date().toISOString(),
				})
				.eq("id", domain.id);
			suspended++;
		} else if (
			domain.reputation_score < 50 ||
			bounceRate > 8 ||
			complaintRate > 0.3
		) {
			// Update health check timestamp for warning domains
			await supabase
				.from("company_email_domains")
				.update({ last_health_check: new Date().toISOString() })
				.eq("id", domain.id);
			warnings++;
		} else {
			// Healthy, just update timestamp
			await supabase
				.from("company_email_domains")
				.update({ last_health_check: new Date().toISOString() })
				.eq("id", domain.id);
		}
	}

	return {
		checked: domains.length,
		suspended,
		warnings,
	};
}

/**
 * Generate deliverability report for a domain
 */
async function generateDeliverabilityReport(domainId: string): Promise<{
	domain: string;
	period: { start: string; end: string };
	metrics: {
		totalSent: number;
		delivered: number;
		bounced: number;
		complained: number;
		deliveryRate: number;
		bounceRate: number;
		complaintRate: number;
	};
	reputation: {
		current: number;
		change: number;
		status: string;
	};
	recommendations: string[];
} | null> {
	const health = await getDomainHealth(domainId);
	if (!health) {
		return null;
	}

	const recommendations: string[] = [];

	if (health.bounceRate > 5) {
		recommendations.push(
			"High bounce rate detected. Clean your email list and remove invalid addresses.",
		);
	}

	if (health.complaintRate > 0.1) {
		recommendations.push(
			"Spam complaints detected. Ensure recipients have opted in and make unsubscribe easy.",
		);
	}

	if (health.reputationScore < 70) {
		recommendations.push(
			"Reputation score is below optimal. Reduce sending volume temporarily and focus on engagement.",
		);
	}

	if (health.status === "warning" || health.status === "critical") {
		recommendations.push(
			"Domain health is degraded. Review your email content and sending practices.",
		);
	}

	if (recommendations.length === 0) {
		recommendations.push(
			"Domain health is good. Continue monitoring and maintain current practices.",
		);
	}

	return {
		domain: health.domain,
		period: {
			start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
			end: new Date().toISOString(),
		},
		metrics: {
			totalSent: health.totalEmailsSent,
			delivered: health.totalEmailsSent - health.hardBounces,
			bounced: health.hardBounces + health.softBounces,
			complained: health.complaints,
			deliveryRate: health.deliveryRate,
			bounceRate: health.bounceRate,
			complaintRate: health.complaintRate,
		},
		reputation: {
			current: health.reputationScore,
			change: 0, // Would need historical data to calculate
			status: health.status,
		},
		recommendations,
	};
}
