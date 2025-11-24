"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Email Usage Tracker for Multi-Tenant System
 *
 * Features:
 * - Per-company/domain usage tracking
 * - Automatic counter reset (hourly/daily)
 * - Suspension checking (for abuse prevention)
 * - Usage statistics
 *
 * Note: No rate limits enforced - unlimited sending allowed
 */

export interface RateLimitResult {
	allowed: boolean;
	reason?: string;
	emailsSentHour: number;
	emailsSentDay: number;
}

export interface DomainUsageStats {
	emailsSentToday: number;
	emailsSentThisHour: number;
	totalEmailsSent: number;
	reputationScore: number;
	isSuspended: boolean;
}

/**
 * Check if a domain can send an email (checks suspension only, no rate limits)
 */
export async function checkRateLimit(
	domainId: string
): Promise<RateLimitResult> {
	const supabase = await createServiceSupabaseClient();

	const { data: domain, error } = await supabase
		.from("company_email_domains")
		.select(
			"emails_sent_today, emails_sent_this_hour, is_suspended, suspension_reason, sending_enabled"
		)
		.eq("id", domainId)
		.single();

	if (error || !domain) {
		return {
			allowed: false,
			reason: "Domain not found",
			emailsSentHour: 0,
			emailsSentDay: 0,
		};
	}

	if (domain.is_suspended) {
		return {
			allowed: false,
			reason: `Domain suspended: ${domain.suspension_reason || "Unknown reason"}`,
			emailsSentHour: domain.emails_sent_this_hour || 0,
			emailsSentDay: domain.emails_sent_today || 0,
		};
	}

	if (!domain.sending_enabled) {
		return {
			allowed: false,
			reason: "Sending is disabled for this domain",
			emailsSentHour: domain.emails_sent_this_hour || 0,
			emailsSentDay: domain.emails_sent_today || 0,
		};
	}

	// No rate limits - always allow if not suspended
	return {
		allowed: true,
		emailsSentHour: domain.emails_sent_this_hour || 0,
		emailsSentDay: domain.emails_sent_today || 0,
	};
}

/**
 * Increment email counter for a domain (tracks usage, no limit enforcement)
 */
export async function incrementEmailCounter(
	domainId: string
): Promise<RateLimitResult> {
	const supabase = await createServiceSupabaseClient();

	// Check suspension first
	const { data: domain, error: checkError } = await supabase
		.from("company_email_domains")
		.select("is_suspended, suspension_reason, sending_enabled, emails_sent_today, emails_sent_this_hour")
		.eq("id", domainId)
		.single();

	if (checkError || !domain) {
		return {
			allowed: false,
			reason: "Domain not found",
			emailsSentHour: 0,
			emailsSentDay: 0,
		};
	}

	if (domain.is_suspended) {
		return {
			allowed: false,
			reason: `Domain suspended: ${domain.suspension_reason || "Unknown reason"}`,
			emailsSentHour: domain.emails_sent_this_hour || 0,
			emailsSentDay: domain.emails_sent_today || 0,
		};
	}

	if (!domain.sending_enabled) {
		return {
			allowed: false,
			reason: "Sending is disabled for this domain",
			emailsSentHour: domain.emails_sent_this_hour || 0,
			emailsSentDay: domain.emails_sent_today || 0,
		};
	}

	// Increment counters (for tracking purposes only)
	const { error: updateError } = await supabase
		.from("company_email_domains")
		.update({
			emails_sent_today: (domain.emails_sent_today || 0) + 1,
			emails_sent_this_hour: (domain.emails_sent_this_hour || 0) + 1,
			total_emails_sent: supabase.rpc ? undefined : undefined, // Will use trigger if available
		})
		.eq("id", domainId);

	if (updateError) {
		console.error("Error incrementing email counter:", updateError);
		// Still allow sending even if counter update fails
	}

	return {
		allowed: true,
		emailsSentHour: (domain.emails_sent_this_hour || 0) + 1,
		emailsSentDay: (domain.emails_sent_today || 0) + 1,
	};
}

/**
 * Get domain usage statistics
 */
export async function getDomainUsageStats(
	domainId: string
): Promise<DomainUsageStats | null> {
	const supabase = await createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("company_email_domains")
		.select(
			"emails_sent_today, emails_sent_this_hour, total_emails_sent, reputation_score, is_suspended"
		)
		.eq("id", domainId)
		.single();

	if (error || !data) {
		return null;
	}

	return {
		emailsSentToday: data.emails_sent_today || 0,
		emailsSentThisHour: data.emails_sent_this_hour || 0,
		totalEmailsSent: data.total_emails_sent || 0,
		reputationScore: data.reputation_score || 100,
		isSuspended: data.is_suspended || false,
	};
}

/**
 * Get company's active email domain for sending
 */
export async function getCompanyActiveDomain(companyId: string): Promise<{
	domainId: string;
	domain: string;
	isPlatformSubdomain: boolean;
} | null> {
	const supabase = await createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("company_email_domains")
		.select("id, domain_name, is_platform_subdomain")
		.eq("company_id", companyId)
		.eq("sending_enabled", true)
		.eq("is_suspended", false)
		.eq("status", "verified")
		.order("is_platform_subdomain", { ascending: true }) // Prefer custom domains
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (error || !data) {
		return null;
	}

	return {
		domainId: data.id,
		domain: data.domain_name,
		isPlatformSubdomain: data.is_platform_subdomain || false,
	};
}

/**
 * Suspend a domain (e.g., due to abuse or low reputation)
 */
export async function suspendDomain(
	domainId: string,
	reason: string
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createServiceSupabaseClient();

	const { error } = await supabase
		.from("company_email_domains")
		.update({
			is_suspended: true,
			suspension_reason: reason,
			suspended_at: new Date().toISOString(),
		})
		.eq("id", domainId);

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true };
}

/**
 * Unsuspend a domain
 */
export async function unsuspendDomain(
	domainId: string
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createServiceSupabaseClient();

	const { error } = await supabase
		.from("company_email_domains")
		.update({
			is_suspended: false,
			suspension_reason: null,
			suspended_at: null,
			// Reset reputation to minimum viable
			reputation_score: 50,
		})
		.eq("id", domainId);

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true };
}
