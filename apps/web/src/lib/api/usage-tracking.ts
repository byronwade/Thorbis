/**
 * API Usage Tracking Utility
 *
 * Multi-tenant API usage tracking for external service calls.
 * Tracks calls, costs, response times, and errors per company.
 *
 * Usage:
 * ```typescript
 * import { trackApiUsage, withUsageTracking, checkApiQuota } from "@/lib/api/usage-tracking";
 *
 * // Manual tracking
 * await trackApiUsage({
 *   companyId: "uuid",
 *   apiName: "google_document_ai",
 *   endpoint: "process_invoice",
 *   isSuccess: true,
 *   responseTimeMs: 1500,
 *   costCents: 10
 * });
 *
 * // Wrapper function
 * const result = await withUsageTracking(
 *   companyId,
 *   "attom_property",
 *   "get_property",
 *   async () => attomService.getProperty(address),
 *   { costCents: 5 }
 * );
 *
 * // Check quota before calling
 * const quota = await checkApiQuota(companyId, "google_document_ai");
 * if (!quota.hasQuota) throw new Error("API quota exceeded");
 * ```
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// ============================================
// Types
// ============================================

export interface TrackApiUsageParams {
	companyId: string;
	apiName: string;
	endpoint: string;
	isSuccess?: boolean;
	responseTimeMs?: number;
	costCents?: number;
	errorMessage?: string | null;
}

export interface UsageTrackingOptions {
	costCents?: number;
	skipOnError?: boolean;
}

export interface ApiUsageRecord {
	api_name: string;
	endpoint: string;
	month_year: string;
	call_count: number;
	success_count: number;
	error_count: number;
	success_rate: number;
	estimated_cost_cents: number;
	avg_response_time_ms: number;
	last_called_at: string | null;
}

export interface ApiQuotaResult {
	api_name: string;
	endpoint: string;
	current_usage: number;
	monthly_limit: number | null;
	remaining: number | null;
	has_quota: boolean;
}

export interface ApiUsageSummary {
	month_year: string;
	total_calls: number;
	total_successes: number;
	total_errors: number;
	total_cost_cents: number;
	api_count: number;
}

// ============================================
// API Cost Configuration
// ============================================

/**
 * Estimated cost per API call in cents
 * These are approximations - actual costs depend on usage tier
 */
export const API_COSTS = {
	// Google Services
	google_document_ai: {
		process: 15, // ~$0.15 per page
		extract_text: 10,
		vendor_invoice: 15,
		equipment_warranty: 15,
		permit: 15,
		contract: 15,
		equipment_info: 10,
		receipt: 15,
	},
	google_maps: {
		geocode: 0.5, // $0.005 per request
		directions: 0.5,
		distance_matrix: 0.5,
		places_autocomplete: 0.3,
		places_details: 1.7,
		street_view: 0.7,
		static_map: 0.2,
	},
	google_ai: {
		gemini: 0.1, // Varies by tokens
		vision: 1.5,
		speech_to_text: 0.6, // Per 15 seconds
		text_to_speech: 1.6, // Per 1M characters
		natural_language: 0.1,
	},

	// Property Data
	attom_property: {
		profile: 5,
		valuation: 10,
		sales_history: 5,
		comparables: 10,
		service_report: 15,
	},
	shovels: {
		permits: 3,
		contractors: 3,
		hvac_history: 5,
		plumbing_history: 5,
	},

	// Risk Services
	walk_score: {
		score: 0.1, // Free tier available
		transit: 0.1,
		bike: 0.1,
	},
	crimeometer: {
		safety_score: 5,
		incidents: 10,
		stats: 5,
	},
	perilpulse: {
		report: 5,
		earthquakes: 2,
		weather_alerts: 0, // Free NOAA data
	},

	// Government (Free)
	fema_flood: {
		flood_zone: 0,
		property_data: 0,
	},
	census_bureau: {
		demographics: 0,
		housing: 0,
		income: 0,
	},
	fbi_crime: {
		state_stats: 0,
		safety_score: 0,
	},
} as const;

/**
 * Get estimated cost for an API call
 */
function getApiCost(apiName: string, endpoint: string): number {
	const apiCosts = API_COSTS[apiName as keyof typeof API_COSTS];
	if (!apiCosts) return 0;

	const endpointCost = apiCosts[endpoint as keyof typeof apiCosts];
	return typeof endpointCost === "number" ? endpointCost : 0;
}

// ============================================
// Core Functions
// ============================================

/**
 * Track an API usage event
 *
 * @param params - Usage tracking parameters
 * @returns The updated usage record or null if tracking failed
 */
async function trackApiUsage(
	params: TrackApiUsageParams,
): Promise<ApiUsageRecord | null> {
	const {
		companyId,
		apiName,
		endpoint,
		isSuccess = true,
		responseTimeMs = 0,
		costCents,
		errorMessage = null,
	} = params;

	try {
		const supabase = createServiceSupabaseClient();

		// Use provided cost or lookup from configuration
		const cost = costCents ?? getApiCost(apiName, endpoint);

		const { data, error } = await supabase.rpc("increment_api_usage", {
			p_company_id: companyId,
			p_api_name: apiName,
			p_endpoint: endpoint,
			p_is_success: isSuccess,
			p_response_time_ms: responseTimeMs,
			p_cost_cents: Math.round(cost),
			p_error_message: errorMessage,
		});

		if (error) {
			console.error("Failed to track API usage:", error);
			return null;
		}

		return data;
	} catch (error) {
		// Don't throw - tracking failures shouldn't break the main operation
		console.error("API usage tracking error:", error);
		return null;
	}
}

/**
 * Wrapper function that tracks API usage automatically
 *
 * @param companyId - The company ID
 * @param apiName - Name of the API service
 * @param endpoint - Specific endpoint/operation
 * @param operation - The async operation to execute
 * @param options - Additional tracking options
 * @returns The result of the operation
 */
export async function withUsageTracking<T>(
	companyId: string,
	apiName: string,
	endpoint: string,
	operation: () => Promise<T>,
	options: UsageTrackingOptions = {},
): Promise<T> {
	const startTime = Date.now();

	try {
		const result = await operation();
		const responseTimeMs = Date.now() - startTime;

		// Track successful call (don't await to avoid blocking)
		trackApiUsage({
			companyId,
			apiName,
			endpoint,
			isSuccess: true,
			responseTimeMs,
			costCents: options.costCents,
		}).catch((err) => console.error("Usage tracking failed:", err));

		return result;
	} catch (error) {
		const responseTimeMs = Date.now() - startTime;

		// Track failed call
		if (!options.skipOnError) {
			trackApiUsage({
				companyId,
				apiName,
				endpoint,
				isSuccess: false,
				responseTimeMs,
				costCents: 0, // Don't charge for errors
				errorMessage: error instanceof Error ? error.message : "Unknown error",
			}).catch((err) => console.error("Usage tracking failed:", err));
		}

		throw error;
	}
}

/**
 * Check if a company has remaining quota for an API
 *
 * @param companyId - The company ID
 * @param apiName - Name of the API service
 * @param endpoint - Specific endpoint (optional, checks all if not provided)
 * @returns Quota information
 */
export async function checkApiQuota(
	companyId: string,
	apiName: string,
	endpoint?: string,
): Promise<ApiQuotaResult | null> {
	try {
		const supabase = createServiceSupabaseClient();

		const { data, error } = await supabase.rpc("check_api_quota", {
			p_company_id: companyId,
			p_api_name: apiName,
			p_endpoint: endpoint || null,
		});

		if (error) {
			console.error("Failed to check API quota:", error);
			return null;
		}

		// Return first result or null if no data
		return Array.isArray(data) && data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error("API quota check error:", error);
		return null;
	}
}

/**
 * Get usage statistics for a company
 *
 * @param companyId - The company ID
 * @param monthYear - Specific month (YYYY-MM) or null for current month
 * @returns Array of usage records
 */
async function getApiUsageStats(
	companyId: string,
	monthYear?: string,
): Promise<ApiUsageRecord[]> {
	try {
		const supabase = createServiceSupabaseClient();

		const { data, error } = await supabase.rpc("get_api_usage_stats", {
			p_company_id: companyId,
			p_month_year: monthYear || null,
		});

		if (error) {
			console.error("Failed to get API usage stats:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("API usage stats error:", error);
		return [];
	}
}

/**
 * Get usage summary across all APIs for a company
 *
 * @param companyId - The company ID
 * @param months - Number of months to include (default: 3)
 * @returns Array of monthly summaries
 */
async function getApiUsageSummary(
	companyId: string,
	months: number = 3,
): Promise<ApiUsageSummary[]> {
	try {
		const supabase = createServiceSupabaseClient();

		const { data, error } = await supabase.rpc("get_api_usage_summary", {
			p_company_id: companyId,
			p_months: months,
		});

		if (error) {
			console.error("Failed to get API usage summary:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("API usage summary error:", error);
		return [];
	}
}

// ============================================
// Helper Functions
// ============================================

/**
 * Create a tracked API client wrapper
 *
 * @param companyId - The company ID
 * @param apiName - Name of the API service
 * @returns Object with tracked methods
 *
 * @example
 * const trackedApi = createTrackedApiClient(companyId, "google_document_ai");
 * const result = await trackedApi.call("process_invoice", () => service.processInvoice(doc));
 */
function createTrackedApiClient(companyId: string, apiName: string) {
	return {
		call: <T>(
			endpoint: string,
			operation: () => Promise<T>,
			options?: UsageTrackingOptions,
		): Promise<T> => {
			return withUsageTracking(
				companyId,
				apiName,
				endpoint,
				operation,
				options,
			);
		},

		track: (
			endpoint: string,
			isSuccess: boolean,
			responseTimeMs?: number,
			errorMessage?: string,
		) => {
			return trackApiUsage({
				companyId,
				apiName,
				endpoint,
				isSuccess,
				responseTimeMs,
				errorMessage,
			});
		},

		checkQuota: (endpoint?: string) => {
			return checkApiQuota(companyId, apiName, endpoint);
		},
	};
}

/**
 * Middleware-style usage tracker for API routes
 *
 * @param companyId - The company ID
 * @param apiName - Name of the API service
 * @param endpoint - Specific endpoint
 * @returns Object with start/success/error methods
 *
 * @example
 * const tracker = apiUsageTracker(companyId, "attom_property", "get_profile");
 * tracker.start();
 * try {
 *   const result = await service.getProfile(address);
 *   tracker.success();
 *   return result;
 * } catch (error) {
 *   tracker.error(error);
 *   throw error;
 * }
 */
function apiUsageTracker(
	companyId: string,
	apiName: string,
	endpoint: string,
) {
	const startTime = Date.now();

	return {
		start: () => {
			// Optional: Could log start of operation
		},

		success: () => {
			const responseTimeMs = Date.now() - startTime;
			trackApiUsage({
				companyId,
				apiName,
				endpoint,
				isSuccess: true,
				responseTimeMs,
			}).catch((err) => console.error("Usage tracking failed:", err));
		},

		error: (error: unknown) => {
			const responseTimeMs = Date.now() - startTime;
			trackApiUsage({
				companyId,
				apiName,
				endpoint,
				isSuccess: false,
				responseTimeMs,
				costCents: 0,
				errorMessage: error instanceof Error ? error.message : "Unknown error",
			}).catch((err) => console.error("Usage tracking failed:", err));
		},
	};
}
