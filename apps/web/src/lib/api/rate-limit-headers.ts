/**
 * Rate Limit Response Headers
 *
 * Adds standard rate limiting headers to API responses so consumers
 * can see their limits and adjust their request patterns accordingly.
 *
 * Usage:
 * ```typescript
 * import { addRateLimitHeaders } from '@/lib/api/rate-limit-headers';
 *
 * export async function GET(request: NextRequest) {
 *   const { success, limit, remaining, reset, retryAfter } =
 *     await apiRateLimiter.limit(userIP);
 *
 *   if (!success) {
 *     return addRateLimitHeaders(
 *       NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 }),
 *       { limit, remaining, reset, retryAfter }
 *     );
 *   }
 *
 *   const data = await fetchData();
 *   return addRateLimitHeaders(
 *     NextResponse.json(data),
 *     { limit, remaining, reset }
 *   );
 * }
 * ```
 */

import { NextResponse } from "next/server";

export interface RateLimitInfo {
	limit: number; // Total requests allowed in window
	remaining: number; // Requests remaining
	reset: number; // Timestamp when limit resets (ms)
	retryAfter?: number; // Seconds to wait before retrying (when rate limited)
}

/**
 * Add rate limiting headers to a NextResponse
 *
 * Follows standard HTTP rate limiting headers:
 * - X-RateLimit-Limit: Maximum requests allowed
 * - X-RateLimit-Remaining: Requests remaining in current window
 * - X-RateLimit-Reset: Unix timestamp when the limit resets
 * - Retry-After: Seconds to wait (only when rate limited)
 *
 * @param response - NextResponse to add headers to
 * @param rateLimitInfo - Rate limit information
 * @returns Modified response with headers
 */
export function addRateLimitHeaders(
	response: NextResponse,
	rateLimitInfo: RateLimitInfo,
): NextResponse {
	const { limit, remaining, reset, retryAfter } = rateLimitInfo;

	// Add standard rate limit headers
	response.headers.set("X-RateLimit-Limit", limit.toString());
	response.headers.set("X-RateLimit-Remaining", Math.max(0, remaining).toString());
	response.headers.set("X-RateLimit-Reset", Math.floor(reset / 1000).toString()); // Convert to seconds

	// Add Retry-After header when rate limited
	if (retryAfter !== undefined && remaining === 0) {
		response.headers.set("Retry-After", retryAfter.toString());
	}

	return response;
}

/**
 * Create a rate limited error response
 *
 * Helper to create a 429 response with appropriate headers and message
 */
export function createRateLimitResponse(
	rateLimitInfo: RateLimitInfo,
	message?: string,
): NextResponse {
	const resetDate = new Date(rateLimitInfo.reset);
	const defaultMessage = `Too many requests. Please try again after ${resetDate.toLocaleTimeString()}.`;

	const response = NextResponse.json(
		{
			error: message || defaultMessage,
			retryAfter: rateLimitInfo.retryAfter,
			resetAt: resetDate.toISOString(),
		},
		{ status: 429 },
	);

	return addRateLimitHeaders(response, rateLimitInfo);
}
