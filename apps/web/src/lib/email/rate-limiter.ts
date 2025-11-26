/**
 * Email Rate Limiter
 *
 * Implements per-domain rate limiting for email sending to:
 * - Prevent spam/abuse
 * - Protect domain reputation
 * - Enforce plan-based limits
 * - Track daily/hourly email quotas
 */

"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// TYPES
// =============================================================================

export interface RateLimitResult {
	allowed: boolean;
	reason?: string;
	remaining?: number;
	resetAt?: string;
}

export interface ActiveDomainInfo {
	domainId: string;
	domain: string;
	replyToEmail: string | null;
	dailyLimit: number;
	hourlyLimit: number;
	emailsSentToday: number;
	emailsSentThisHour: number;
}

// =============================================================================
// RATE LIMIT CONFIGURATION
// =============================================================================

// Default rate limits (can be overridden per domain/plan)
const DEFAULT_LIMITS = {
	daily: 1000, // 1000 emails per day per domain
	hourly: 100, // 100 emails per hour per domain
	perMinute: 10, // 10 emails per minute per domain
};

// In-memory cache for rate limit tracking (resets on server restart)
// For production, use Redis or database counters
const rateLimitCache = new Map<
	string,
	{
		count: number;
		windowStart: number;
	}
>();

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get the active email domain for a company
 *
 * Returns the verified, sending-enabled domain for the company,
 * prioritizing custom domains over platform subdomains.
 */
export async function getCompanyActiveDomain(
	companyId: string,
): Promise<ActiveDomainInfo | null> {
	const supabase = await createServiceSupabaseClient();

	// Query for the active sending domain
	const { data: domain, error } = await supabase
		.from("company_email_domains")
		.select(
			`
			id,
			domain_name,
			reply_to_email,
			daily_limit,
			hourly_limit,
			emails_sent_today,
			emails_sent_this_hour,
			is_platform_subdomain
		`,
		)
		.eq("company_id", companyId)
		.eq("status", "verified")
		.eq("sending_enabled", true)
		.eq("is_suspended", false)
		.order("is_platform_subdomain", { ascending: true }) // Custom domains first
		.order("created_at", { ascending: false })
		.maybeSingle();

	if (error) {
		console.error("Error fetching company email domain:", error);
		return null;
	}

	if (!domain) {
		return null;
	}

	return {
		domainId: domain.id,
		domain: domain.domain_name,
		replyToEmail: domain.reply_to_email,
		dailyLimit: domain.daily_limit || DEFAULT_LIMITS.daily,
		hourlyLimit: domain.hourly_limit || DEFAULT_LIMITS.hourly,
		emailsSentToday: domain.emails_sent_today || 0,
		emailsSentThisHour: domain.emails_sent_this_hour || 0,
	};
}

/**
 * Check if a domain has exceeded its rate limit
 *
 * This is a non-blocking check that doesn't increment counters.
 * Use incrementEmailCounter after successfully sending.
 */
export async function checkRateLimit(
	domainId: string,
): Promise<RateLimitResult> {
	const supabase = await createServiceSupabaseClient();

	// Get current domain stats
	const { data: domain, error } = await supabase
		.from("company_email_domains")
		.select(
			`
			daily_limit,
			hourly_limit,
			emails_sent_today,
			emails_sent_this_hour,
			is_suspended,
			daily_limit_reset_at,
			hourly_limit_reset_at
		`,
		)
		.eq("id", domainId)
		.single();

	if (error || !domain) {
		return {
			allowed: false,
			reason: "Domain not found or error fetching limits",
		};
	}

	// Check if domain is suspended
	if (domain.is_suspended) {
		return {
			allowed: false,
			reason: "Domain is suspended due to reputation issues",
		};
	}

	const dailyLimit = domain.daily_limit || DEFAULT_LIMITS.daily;
	const hourlyLimit = domain.hourly_limit || DEFAULT_LIMITS.hourly;
	const emailsSentToday = domain.emails_sent_today || 0;
	const emailsSentThisHour = domain.emails_sent_this_hour || 0;

	// Check daily limit
	if (emailsSentToday >= dailyLimit) {
		return {
			allowed: false,
			reason: `Daily email limit reached (${dailyLimit} emails/day)`,
			remaining: 0,
			resetAt: domain.daily_limit_reset_at || getNextMidnightUTC(),
		};
	}

	// Check hourly limit
	if (emailsSentThisHour >= hourlyLimit) {
		return {
			allowed: false,
			reason: `Hourly email limit reached (${hourlyLimit} emails/hour)`,
			remaining: 0,
			resetAt: domain.hourly_limit_reset_at || getNextHourUTC(),
		};
	}

	// Check per-minute limit (in-memory)
	const minuteKey = `${domainId}:minute`;
	const minuteWindow = getMinuteWindow();
	const minuteCache = rateLimitCache.get(minuteKey);

	if (minuteCache && minuteCache.windowStart === minuteWindow) {
		if (minuteCache.count >= DEFAULT_LIMITS.perMinute) {
			return {
				allowed: false,
				reason: `Rate limit: Too many emails per minute (${DEFAULT_LIMITS.perMinute}/min)`,
				remaining: 0,
			};
		}
	}

	return {
		allowed: true,
		remaining: Math.min(
			dailyLimit - emailsSentToday,
			hourlyLimit - emailsSentThisHour,
		),
	};
}

/**
 * Increment the email counter after successfully sending
 *
 * This atomically increments the counters and validates limits.
 * Should be called after checkRateLimit and before actually sending.
 */
export async function incrementEmailCounter(
	domainId: string,
): Promise<RateLimitResult> {
	const supabase = await createServiceSupabaseClient();

	// Use a database function for atomic increment and validation
	// This prevents race conditions in high-concurrency scenarios
	const { data, error } = await supabase.rpc("increment_email_counter", {
		p_domain_id: domainId,
	});

	if (error) {
		// If the RPC doesn't exist, fall back to manual increment
		if (error.code === "PGRST202" || error.message.includes("function")) {
			return await incrementEmailCounterFallback(domainId);
		}

		console.error("Error incrementing email counter:", error);
		return {
			allowed: false,
			reason: error.message,
		};
	}

	// Handle RPC result
	if (data && typeof data === "object") {
		const result = data as {
			allowed: boolean;
			reason?: string;
			remaining?: number;
		};
		return {
			allowed: result.allowed,
			reason: result.reason,
			remaining: result.remaining,
		};
	}

	// Default: allowed if no error
	return { allowed: true };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Fallback increment method when RPC function doesn't exist
 */
async function incrementEmailCounterFallback(
	domainId: string,
): Promise<RateLimitResult> {
	const supabase = await createServiceSupabaseClient();

	// Get current counts
	const { data: domain, error: fetchError } = await supabase
		.from("company_email_domains")
		.select(
			"emails_sent_today, emails_sent_this_hour, daily_limit, hourly_limit",
		)
		.eq("id", domainId)
		.single();

	if (fetchError || !domain) {
		return {
			allowed: false,
			reason: "Domain not found",
		};
	}

	const dailyLimit = domain.daily_limit || DEFAULT_LIMITS.daily;
	const hourlyLimit = domain.hourly_limit || DEFAULT_LIMITS.hourly;

	// Check limits before incrementing
	if ((domain.emails_sent_today || 0) >= dailyLimit) {
		return {
			allowed: false,
			reason: "Daily limit reached",
		};
	}

	if ((domain.emails_sent_this_hour || 0) >= hourlyLimit) {
		return {
			allowed: false,
			reason: "Hourly limit reached",
		};
	}

	// Increment counters
	const { error: updateError } = await supabase
		.from("company_email_domains")
		.update({
			emails_sent_today: (domain.emails_sent_today || 0) + 1,
			emails_sent_this_hour: (domain.emails_sent_this_hour || 0) + 1,
		})
		.eq("id", domainId);

	if (updateError) {
		console.error("Error updating email counters:", updateError);
		return {
			allowed: false,
			reason: updateError.message,
		};
	}

	// Update in-memory per-minute counter
	const minuteKey = `${domainId}:minute`;
	const minuteWindow = getMinuteWindow();
	const minuteCache = rateLimitCache.get(minuteKey);

	if (minuteCache && minuteCache.windowStart === minuteWindow) {
		minuteCache.count++;
	} else {
		rateLimitCache.set(minuteKey, {
			count: 1,
			windowStart: minuteWindow,
		});
	}

	return {
		allowed: true,
		remaining: Math.min(
			dailyLimit - (domain.emails_sent_today || 0) - 1,
			hourlyLimit - (domain.emails_sent_this_hour || 0) - 1,
		),
	};
}

/**
 * Get the current minute window (for per-minute rate limiting)
 */
function getMinuteWindow(): number {
	return Math.floor(Date.now() / 60000);
}

/**
 * Get the next midnight UTC timestamp
 */
function getNextMidnightUTC(): string {
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
	tomorrow.setUTCHours(0, 0, 0, 0);
	return tomorrow.toISOString();
}

/**
 * Get the next hour UTC timestamp
 */
function getNextHourUTC(): string {
	const now = new Date();
	const nextHour = new Date(now);
	nextHour.setUTCHours(nextHour.getUTCHours() + 1, 0, 0, 0);
	return nextHour.toISOString();
}

// =============================================================================
// RESET FUNCTIONS (for cron jobs)
// =============================================================================

/**
 * Reset daily email counters (should be called by cron at midnight UTC)
 */
export async function resetDailyCounters(): Promise<{
	success: boolean;
	error?: string;
}> {
	const supabase = await createServiceSupabaseClient();

	const { error } = await supabase
		.from("company_email_domains")
		.update({
			emails_sent_today: 0,
			daily_limit_reset_at: getNextMidnightUTC(),
		})
		.neq("id", ""); // Update all rows

	if (error) {
		console.error("Error resetting daily counters:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}

/**
 * Reset hourly email counters (should be called by cron every hour)
 */
export async function resetHourlyCounters(): Promise<{
	success: boolean;
	error?: string;
}> {
	const supabase = await createServiceSupabaseClient();

	const { error } = await supabase
		.from("company_email_domains")
		.update({
			emails_sent_this_hour: 0,
			hourly_limit_reset_at: getNextHourUTC(),
		})
		.neq("id", ""); // Update all rows

	if (error) {
		console.error("Error resetting hourly counters:", error);
		return { success: false, error: error.message };
	}

	return { success: true };
}
