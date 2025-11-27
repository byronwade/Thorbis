/**
 * External API Usage Tracker
 *
 * Tracks usage of external APIs (OpenAI, Stripe, Twilio, SendGrid, etc.)
 * and aggregates data into the api_usage_tracking table for the admin dashboard.
 *
 * Usage:
 * ```typescript
 * import { trackExternalApiCall } from "@/lib/analytics/external-api-tracker";
 *
 * // Before making an API call
 * const startTime = Date.now();
 *
 * // Make your API call
 * const response = await openai.chat.completions.create({ ... });
 *
 * // Track the usage
 * await trackExternalApiCall({
 *   apiName: "openai",
 *   endpoint: "chat.completions",
 *   companyId: "uuid",
 *   success: true,
 *   responseTimeMs: Date.now() - startTime,
 *   estimatedCostCents: 5, // optional
 * });
 * ```
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export interface ExternalApiCallParams {
	/** API service name (e.g., "openai", "stripe", "twilio") */
	apiName: string;
	/** API endpoint called (e.g., "chat.completions", "customers.create") */
	endpoint: string;
	/** Company ID making the call */
	companyId: string;
	/** Whether the call succeeded */
	success: boolean;
	/** Response time in milliseconds */
	responseTimeMs: number;
	/** Estimated cost in cents (optional) */
	estimatedCostCents?: number;
	/** Error message if failed (optional) */
	errorMessage?: string;
}

/**
 * Track an external API call and update the monthly aggregation
 *
 * Uses PostgreSQL UPSERT (ON CONFLICT) for atomic, race-condition-free updates.
 * Single query instead of SELECT + UPDATE/INSERT (2x faster).
 */
export async function trackExternalApiCall(
	params: ExternalApiCallParams
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		// Get current month in YYYY-MM format
		const monthYear = new Date().toISOString().slice(0, 7);
		const now = new Date().toISOString();

		// Use raw SQL for atomic UPSERT - prevents race conditions and is 2x faster
		const { error } = await supabase.rpc("upsert_api_usage_tracking", {
			p_company_id: params.companyId,
			p_api_name: params.apiName,
			p_endpoint: params.endpoint,
			p_month_year: monthYear,
			p_success: params.success,
			p_response_time_ms: params.responseTimeMs,
			p_cost_cents: params.estimatedCostCents || 0,
			p_error_message: params.success ? null : (params.errorMessage || null),
		});

		if (error) {
			console.error("[External API Tracker] Upsert failed:", error.message);
		}
	} catch (err) {
		// Don't throw - tracking failures shouldn't break the main operation
		console.error("[External API Tracker] Error:", err);
	}
}

/**
 * Higher-order function to wrap external API calls with tracking
 */
export function withExternalApiTracking<T>(
	apiName: string,
	endpoint: string,
	companyId: string,
	operation: () => Promise<T>,
	options?: { estimateCost?: (result: T) => number }
): Promise<T> {
	return (async () => {
		const startTime = Date.now();
		let success = false;
		let errorMessage: string | undefined;
		let result: T;

		try {
			result = await operation();
			success = true;
			return result;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw error;
		} finally {
			const responseTimeMs = Date.now() - startTime;

			// Track the call (don't await - fire and forget)
			trackExternalApiCall({
				apiName,
				endpoint,
				companyId,
				success,
				responseTimeMs,
				estimatedCostCents: success && options?.estimateCost ? options.estimateCost(result!) : undefined,
				errorMessage,
			}).catch(() => {});
		}
	})();
}

/**
 * Create a tracker instance for a specific API
 */
export function createApiTracker(apiName: string) {
	return {
		track: (
			endpoint: string,
			companyId: string,
			params: Omit<ExternalApiCallParams, "apiName" | "endpoint" | "companyId">
		) => trackExternalApiCall({ apiName, endpoint, companyId, ...params }),

		wrap: <T>(
			endpoint: string,
			companyId: string,
			operation: () => Promise<T>,
			options?: { estimateCost?: (result: T) => number }
		) => withExternalApiTracking(apiName, endpoint, companyId, operation, options),
	};
}

// Pre-configured trackers for common APIs
export const openaiTracker = createApiTracker("openai");
export const anthropicTracker = createApiTracker("anthropic");
export const stripeTracker = createApiTracker("stripe");
export const twilioTracker = createApiTracker("twilio");
export const sendgridTracker = createApiTracker("sendgrid");
export const googleMapsTracker = createApiTracker("google_maps");
export const googlePlacesTracker = createApiTracker("google_places");

export default {
	trackExternalApiCall,
	withExternalApiTracking,
	createApiTracker,
	openaiTracker,
	anthropicTracker,
	stripeTracker,
	twilioTracker,
	sendgridTracker,
	googleMapsTracker,
	googlePlacesTracker,
};
