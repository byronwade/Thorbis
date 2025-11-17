/**
 * Rate Limiting Utilities
 *
 * Provides rate limiting for authentication and API endpoints to prevent:
 * - Brute force password attacks
 * - Account enumeration
 * - Email spam/flooding
 * - DDoS attacks
 *
 * Implementation:
 * - Uses in-memory LRU cache for development/small scale
 * - Can be easily swapped with Redis/Upstash for production
 * - Sliding window algorithm for accurate rate limiting
 * - Per-identifier tracking (email, IP, user ID)
 */

// Simple in-memory rate limiter using LRU cache
// For production, replace with @upstash/ratelimit + @upstash/redis
class InMemoryRateLimiter {
	private requests: Map<string, { count: number; resetAt: number; requests: number[] }>;
	private readonly maxRequests: number;
	private readonly windowMs: number;

	constructor(maxRequests: number, windowMs: number) {
		this.requests = new Map();
		this.maxRequests = maxRequests;
		this.windowMs = windowMs;

		// Cleanup old entries every minute
		setInterval(() => this.cleanup(), 60_000);
	}

	async limit(identifier: string): Promise<{
		success: boolean;
		limit: number;
		remaining: number;
		reset: number;
	}> {
		const now = Date.now();
		const key = identifier;

		let record = this.requests.get(key);

		// Initialize if doesn't exist
		if (!record) {
			record = {
				count: 0,
				resetAt: now + this.windowMs,
				requests: [],
			};
			this.requests.set(key, record);
		}

		// Remove requests outside the sliding window
		record.requests = record.requests.filter((timestamp) => timestamp > now - this.windowMs);

		// Check if limit exceeded
		if (record.requests.length >= this.maxRequests) {
			return {
				success: false,
				limit: this.maxRequests,
				remaining: 0,
				reset: Math.min(...record.requests) + this.windowMs,
			};
		}

		// Add new request
		record.requests.push(now);
		record.count = record.requests.length;

		return {
			success: true,
			limit: this.maxRequests,
			remaining: this.maxRequests - record.count,
			reset: now + this.windowMs,
		};
	}

	private cleanup() {
		const now = Date.now();
		for (const [key, record] of this.requests.entries()) {
			record.requests = record.requests.filter((timestamp) => timestamp > now - this.windowMs);
			if (record.requests.length === 0) {
				this.requests.delete(key);
			}
		}
	}

	reset(identifier: string) {
		this.requests.delete(identifier);
	}

	clear() {
		this.requests.clear();
	}
}

// Rate limiter instances for different operations
const authRateLimiterInstance = new InMemoryRateLimiter(
	5, // 5 requests
	15 * 60 * 1000 // per 15 minutes
);

const apiRateLimiterInstance = new InMemoryRateLimiter(
	100, // 100 requests
	60 * 1000 // per 1 minute
);

const passwordResetRateLimiterInstance = new InMemoryRateLimiter(
	3, // 3 requests
	60 * 60 * 1000 // per 1 hour
);

/**
 * Auth Rate Limiter
 *
 * Use for: Sign in, Sign up, OAuth
 * Limit: 5 requests per 15 minutes per identifier
 */
export const authRateLimiter = {
	limit: (identifier: string) => authRateLimiterInstance.limit(identifier),
	reset: (identifier: string) => authRateLimiterInstance.reset(identifier),
};

/**
 * API Rate Limiter
 *
 * Use for: General API endpoints
 * Limit: 100 requests per minute per identifier
 */
export const apiRateLimiter = {
	limit: (identifier: string) => apiRateLimiterInstance.limit(identifier),
	reset: (identifier: string) => apiRateLimiterInstance.reset(identifier),
};

/**
 * Password Reset Rate Limiter
 *
 * Use for: Password reset requests
 * Limit: 3 requests per hour per identifier
 */
export const passwordResetRateLimiter = {
	limit: (identifier: string) => passwordResetRateLimiterInstance.limit(identifier),
	reset: (identifier: string) => passwordResetRateLimiterInstance.reset(identifier),
};

/**
 * Rate Limit Error
 */
export class RateLimitError extends Error {
	constructor(
		message: string,
		public limit: number,
		public remaining: number,
		public reset: number
	) {
		super(message);
		this.name = "RateLimitError";
	}
}

/**
 * Check Rate Limit
 *
 * Throws RateLimitError if rate limit exceeded.
 *
 * @param identifier - Unique identifier (email, IP, user ID)
 * @param limiter - Rate limiter instance to use
 */
export async function checkRateLimit(
	identifier: string,
	limiter: typeof authRateLimiter = apiRateLimiter
): Promise<void> {
	const { success, limit, remaining, reset } = await limiter.limit(identifier);

	if (!success) {
		const resetDate = new Date(reset);
		throw new RateLimitError(
			`Too many requests. Please try again after ${resetDate.toLocaleTimeString()}.`,
			limit,
			remaining,
			reset
		);
	}
}

/**
 * Get Client IP Address
 *
 * Extracts IP from request headers for rate limiting.
 * Supports various proxy headers.
 */
export function getClientIP(request: Request): string {
	const headers = new Headers(request.headers);

	// Check common proxy headers
	const forwarded = headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}

	const realIP = headers.get("x-real-ip");
	if (realIP) {
		return realIP;
	}

	const cfIP = headers.get("cf-connecting-ip"); // Cloudflare
	if (cfIP) {
		return cfIP;
	}

	// Fallback to unknown
	return "unknown";
}

/**
 * Production Setup Instructions
 *
 * For production, replace in-memory limiter with Redis:
 *
 * 1. Install dependencies:
 *    ```bash
 *    pnpm add @upstash/ratelimit @upstash/redis
 *    ```
 *
 * 2. Update this file:
 *    ```typescript
 *    import { Ratelimit } from "@upstash/ratelimit";
 *    import { Redis } from "@upstash/redis";
 *
 *    const redis = new Redis({
 *      url: process.env.UPSTASH_REDIS_REST_URL!,
 *      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
 *    });
 *
 *    export const authRateLimiter = new Ratelimit({
 *      redis,
 *      limiter: Ratelimit.slidingWindow(5, "15 m"),
 *      analytics: true,
 *      prefix: "ratelimit:auth",
 *    });
 *    ```
 *
 * 3. Add environment variables:
 *    ```
 *    UPSTASH_REDIS_REST_URL=https://...
 *    UPSTASH_REDIS_REST_TOKEN=...
 *    ```
 */
