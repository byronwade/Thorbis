/**
 * Telnyx Rate Limiter
 *
 * Implements token bucket algorithm with per-company and per-endpoint
 * rate limiting to prevent API rate limit errors.
 */

import { telnyxLogger } from "./logger";
import { sleep } from "./retry";

// =============================================================================
// TYPES
// =============================================================================

export interface RateLimitConfig {
	maxTokens: number; // Maximum tokens in bucket
	refillRate: number; // Tokens added per second
	refillInterval: number; // Milliseconds between refills
}

export interface RateLimitResult {
	allowed: boolean;
	remainingTokens: number;
	retryAfterMs?: number;
	waitTime?: number; // Time waited if queued
}

interface TokenBucket {
	tokens: number;
	lastRefill: number;
	queue: Array<{
		resolve: (result: RateLimitResult) => void;
		requestedAt: number;
	}>;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

// Default rate limits based on Telnyx API limits
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
	// General API: 100 requests per minute
	default: {
		maxTokens: 100,
		refillRate: 100 / 60, // ~1.67 tokens/second
		refillInterval: 1000,
	},
	// SMS: 1 message per second per number (aggregate)
	sms: {
		maxTokens: 60,
		refillRate: 1,
		refillInterval: 1000,
	},
	// Voice: more relaxed
	voice: {
		maxTokens: 30,
		refillRate: 0.5,
		refillInterval: 1000,
	},
	// Lookup: can be higher
	lookup: {
		maxTokens: 200,
		refillRate: 200 / 60,
		refillInterval: 1000,
	},
	// Webhook (incoming): protect against floods
	webhook: {
		maxTokens: 1000,
		refillRate: 100,
		refillInterval: 1000,
	},
};

// =============================================================================
// TOKEN BUCKET IMPLEMENTATION
// =============================================================================

class TokenBucketLimiter {
	private buckets = new Map<string, TokenBucket>();
	private processingQueue = new Map<string, boolean>();

	/**
	 * Get or create a bucket for a key
	 */
	private getBucket(key: string, config: RateLimitConfig): TokenBucket {
		if (!this.buckets.has(key)) {
			this.buckets.set(key, {
				tokens: config.maxTokens,
				lastRefill: Date.now(),
				queue: [],
			});
		}
		return this.buckets.get(key)!;
	}

	/**
	 * Refill tokens based on elapsed time
	 */
	private refillTokens(bucket: TokenBucket, config: RateLimitConfig): void {
		const now = Date.now();
		const elapsed = now - bucket.lastRefill;
		const intervalsElapsed = Math.floor(elapsed / config.refillInterval);

		if (intervalsElapsed > 0) {
			const tokensToAdd = intervalsElapsed * config.refillRate;
			bucket.tokens = Math.min(config.maxTokens, bucket.tokens + tokensToAdd);
			bucket.lastRefill = now;
		}
	}

	/**
	 * Process queued requests
	 */
	private async processQueue(key: string, config: RateLimitConfig): Promise<void> {
		if (this.processingQueue.get(key)) return;
		this.processingQueue.set(key, true);

		const bucket = this.getBucket(key, config);

		while (bucket.queue.length > 0) {
			this.refillTokens(bucket, config);

			if (bucket.tokens >= 1) {
				const request = bucket.queue.shift();
				if (request) {
					bucket.tokens -= 1;
					const waitTime = Date.now() - request.requestedAt;
					request.resolve({
						allowed: true,
						remainingTokens: bucket.tokens,
						waitTime,
					});
				}
			} else {
				// Calculate time until next token
				const timeUntilToken = config.refillInterval / config.refillRate;
				await sleep(Math.ceil(timeUntilToken));
			}
		}

		this.processingQueue.set(key, false);
	}

	/**
	 * Attempt to acquire a token (immediate, no queue)
	 */
	tryAcquire(key: string, config: RateLimitConfig = RATE_LIMIT_CONFIGS.default): RateLimitResult {
		const bucket = this.getBucket(key, config);
		this.refillTokens(bucket, config);

		if (bucket.tokens >= 1) {
			bucket.tokens -= 1;
			return {
				allowed: true,
				remainingTokens: bucket.tokens,
			};
		}

		// Calculate retry after
		const timeUntilToken = Math.ceil(config.refillInterval / config.refillRate);
		return {
			allowed: false,
			remainingTokens: 0,
			retryAfterMs: timeUntilToken,
		};
	}

	/**
	 * Acquire a token, waiting in queue if necessary
	 */
	async acquire(
		key: string,
		config: RateLimitConfig = RATE_LIMIT_CONFIGS.default,
		maxWaitMs: number = 30000
	): Promise<RateLimitResult> {
		// Try immediate acquisition
		const immediate = this.tryAcquire(key, config);
		if (immediate.allowed) {
			return immediate;
		}

		// Queue the request
		const bucket = this.getBucket(key, config);

		return new Promise((resolve, reject) => {
			const requestedAt = Date.now();
			const timeoutId = setTimeout(() => {
				// Remove from queue on timeout
				const index = bucket.queue.findIndex((r) => r.requestedAt === requestedAt);
				if (index !== -1) {
					bucket.queue.splice(index, 1);
				}
				resolve({
					allowed: false,
					remainingTokens: 0,
					retryAfterMs: maxWaitMs,
				});
			}, maxWaitMs);

			bucket.queue.push({
				resolve: (result) => {
					clearTimeout(timeoutId);
					resolve(result);
				},
				requestedAt,
			});

			// Start processing queue
			this.processQueue(key, config);
		});
	}

	/**
	 * Get current bucket status
	 */
	getStatus(key: string, config: RateLimitConfig = RATE_LIMIT_CONFIGS.default): {
		tokens: number;
		maxTokens: number;
		queueLength: number;
		utilizationPercent: number;
	} {
		const bucket = this.getBucket(key, config);
		this.refillTokens(bucket, config);

		return {
			tokens: Math.floor(bucket.tokens),
			maxTokens: config.maxTokens,
			queueLength: bucket.queue.length,
			utilizationPercent: Math.round(((config.maxTokens - bucket.tokens) / config.maxTokens) * 100),
		};
	}

	/**
	 * Reset a bucket (for testing)
	 */
	reset(key: string): void {
		this.buckets.delete(key);
	}

	/**
	 * Reset all buckets
	 */
	resetAll(): void {
		this.buckets.clear();
	}
}

// =============================================================================
// RATE LIMITER INSTANCES
// =============================================================================

// Global rate limiter
const globalLimiter = new TokenBucketLimiter();

// Per-company rate limiters
const companyLimiters = new Map<string, TokenBucketLimiter>();

function getCompanyLimiter(companyId: string): TokenBucketLimiter {
	if (!companyLimiters.has(companyId)) {
		companyLimiters.set(companyId, new TokenBucketLimiter());
	}
	return companyLimiters.get(companyId)!;
}

// =============================================================================
// PUBLIC API
// =============================================================================

export type RateLimitEndpoint = keyof typeof RATE_LIMIT_CONFIGS;

/**
 * Check if a request is rate limited (immediate check, no queue)
 */
export function checkRateLimit(
	endpoint: RateLimitEndpoint = "default",
	companyId?: string
): RateLimitResult {
	const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;

	// Check global rate limit
	const globalKey = `global:${endpoint}`;
	const globalResult = globalLimiter.tryAcquire(globalKey, config);

	if (!globalResult.allowed) {
		telnyxLogger.warn("Global rate limit hit", {
			endpoint,
			retryAfterMs: globalResult.retryAfterMs,
		});
		return globalResult;
	}

	// Check per-company rate limit if provided
	if (companyId) {
		const companyLimiter = getCompanyLimiter(companyId);
		const companyResult = companyLimiter.tryAcquire(endpoint, config);

		if (!companyResult.allowed) {
			telnyxLogger.warn("Company rate limit hit", {
				endpoint,
				companyId,
				retryAfterMs: companyResult.retryAfterMs,
			});
			return companyResult;
		}
	}

	return globalResult;
}

/**
 * Acquire a rate limit token, waiting if necessary
 */
export async function acquireRateLimit(
	endpoint: RateLimitEndpoint = "default",
	companyId?: string,
	maxWaitMs: number = 30000
): Promise<RateLimitResult> {
	const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;

	// Acquire global token
	const globalKey = `global:${endpoint}`;
	const globalResult = await globalLimiter.acquire(globalKey, config, maxWaitMs);

	if (!globalResult.allowed) {
		return globalResult;
	}

	// Acquire per-company token if provided
	if (companyId) {
		const companyLimiter = getCompanyLimiter(companyId);
		const companyResult = await companyLimiter.acquire(endpoint, config, maxWaitMs);

		if (!companyResult.allowed) {
			return companyResult;
		}

		// Return the longer wait time
		return {
			...companyResult,
			waitTime: Math.max(globalResult.waitTime || 0, companyResult.waitTime || 0),
		};
	}

	return globalResult;
}

/**
 * Decorator function to rate limit async operations
 */
export function withRateLimit<T>(
	fn: () => Promise<T>,
	options: {
		endpoint?: RateLimitEndpoint;
		companyId?: string;
		maxWaitMs?: number;
		correlationId?: string;
	} = {}
): Promise<T> {
	const { endpoint = "default", companyId, maxWaitMs = 30000, correlationId } = options;

	return new Promise(async (resolve, reject) => {
		try {
			const result = await acquireRateLimit(endpoint, companyId, maxWaitMs);

			if (!result.allowed) {
				const error = new Error(
					`Rate limit exceeded. Retry after ${result.retryAfterMs}ms`
				);
				(error as any).code = "RATE_LIMIT_EXCEEDED";
				(error as any).retryAfterMs = result.retryAfterMs;
				reject(error);
				return;
			}

			if (result.waitTime && result.waitTime > 100) {
				telnyxLogger.debug("Request waited for rate limit", {
					endpoint,
					companyId,
					waitTime: result.waitTime,
					correlationId,
				});
			}

			const response = await fn();
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Get rate limit status for monitoring
 */
export function getRateLimitStatus(
	endpoint?: RateLimitEndpoint,
	companyId?: string
): {
	global: Record<string, ReturnType<TokenBucketLimiter["getStatus"]>>;
	company?: Record<string, ReturnType<TokenBucketLimiter["getStatus"]>>;
} {
	const endpoints = endpoint
		? [endpoint]
		: (Object.keys(RATE_LIMIT_CONFIGS) as RateLimitEndpoint[]);

	const global: Record<string, ReturnType<TokenBucketLimiter["getStatus"]>> = {};

	for (const ep of endpoints) {
		const config = RATE_LIMIT_CONFIGS[ep];
		global[ep] = globalLimiter.getStatus(`global:${ep}`, config);
	}

	let company: Record<string, ReturnType<TokenBucketLimiter["getStatus"]>> | undefined;

	if (companyId) {
		const limiter = companyLimiters.get(companyId);
		if (limiter) {
			company = {};
			for (const ep of endpoints) {
				const config = RATE_LIMIT_CONFIGS[ep];
				company[ep] = limiter.getStatus(ep, config);
			}
		}
	}

	return { global, company };
}

/**
 * Reset rate limits (for testing)
 */
export function resetRateLimits(companyId?: string): void {
	if (companyId) {
		companyLimiters.delete(companyId);
	} else {
		globalLimiter.resetAll();
		companyLimiters.clear();
	}
}

// =============================================================================
// BULK OPERATION HELPER
// =============================================================================

export interface BulkRateLimitOptions {
	endpoint: RateLimitEndpoint;
	companyId?: string;
	batchSize?: number;
	batchDelayMs?: number;
}

/**
 * Process items in rate-limited batches
 */
export async function processBatchWithRateLimit<T, R>(
	items: T[],
	processor: (item: T) => Promise<R>,
	options: BulkRateLimitOptions
): Promise<Array<{ item: T; result?: R; error?: Error }>> {
	const { endpoint, companyId, batchSize = 10, batchDelayMs = 1000 } = options;

	const results: Array<{ item: T; result?: R; error?: Error }> = [];

	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize);

		// Process batch with rate limiting
		const batchResults = await Promise.all(
			batch.map(async (item) => {
				try {
					const result = await withRateLimit(
						() => processor(item),
						{ endpoint, companyId }
					);
					return { item, result };
				} catch (error) {
					return {
						item,
						error: error instanceof Error ? error : new Error(String(error)),
					};
				}
			})
		);

		results.push(...batchResults);

		// Delay between batches
		if (i + batchSize < items.length) {
			await sleep(batchDelayMs);
		}
	}

	return results;
}

// =============================================================================
// RATE LIMIT RESPONSE HANDLER
// =============================================================================

/**
 * Handle 429 response from Telnyx API
 */
export function handle429Response(response: Response): {
	retryAfterMs: number;
	shouldRetry: boolean;
} {
	const retryAfter = response.headers.get("Retry-After");

	let retryAfterMs = 60000; // Default 60 seconds

	if (retryAfter) {
		// Check if it's a number (seconds)
		const seconds = parseInt(retryAfter, 10);
		if (!isNaN(seconds)) {
			retryAfterMs = seconds * 1000;
		} else {
			// Try parsing as a date
			const date = Date.parse(retryAfter);
			if (!isNaN(date)) {
				retryAfterMs = Math.max(0, date - Date.now());
			}
		}
	}

	// Don't retry if wait is too long (> 5 minutes)
	const shouldRetry = retryAfterMs <= 300000;

	telnyxLogger.warn("Rate limit response received", {
		retryAfterMs,
		shouldRetry,
	});

	return { retryAfterMs, shouldRetry };
}
