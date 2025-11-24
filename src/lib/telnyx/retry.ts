/**
 * Telnyx Retry Logic
 *
 * Implements exponential backoff with jitter and circuit breaker pattern
 * for resilient API calls to Telnyx.
 */

import { telnyxLogger } from "./logger";

// =============================================================================
// CONFIGURATION
// =============================================================================

export interface RetryConfig {
	maxRetries: number;
	baseDelayMs: number;
	maxDelayMs: number;
	jitterFactor: number; // 0-1, adds randomness to delay
	retryableStatusCodes: number[];
	retryableErrorCodes: string[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
	maxRetries: 5,
	baseDelayMs: 1000, // 1 second
	maxDelayMs: 32000, // 32 seconds max
	jitterFactor: 0.3, // 30% jitter
	retryableStatusCodes: [408, 429, 500, 502, 503, 504],
	retryableErrorCodes: [
		"ECONNRESET",
		"ETIMEDOUT",
		"ECONNREFUSED",
		"EPIPE",
		"ENOTFOUND",
		"ENETUNREACH",
		"EAI_AGAIN",
	],
};

// =============================================================================
// CIRCUIT BREAKER
// =============================================================================

export interface CircuitBreakerConfig {
	failureThreshold: number; // Failures before opening circuit
	resetTimeoutMs: number; // Time before trying again
	halfOpenRequests: number; // Requests to allow in half-open state
}

export const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
	failureThreshold: 5,
	resetTimeoutMs: 60000, // 1 minute
	halfOpenRequests: 3,
};

type CircuitState = "closed" | "open" | "half-open";

interface CircuitBreakerState {
	state: CircuitState;
	failures: number;
	lastFailureTime: number;
	halfOpenSuccesses: number;
	halfOpenFailures: number;
}

// Per-endpoint circuit breakers
const circuitBreakers = new Map<string, CircuitBreakerState>();

function getCircuitBreaker(endpoint: string): CircuitBreakerState {
	if (!circuitBreakers.has(endpoint)) {
		circuitBreakers.set(endpoint, {
			state: "closed",
			failures: 0,
			lastFailureTime: 0,
			halfOpenSuccesses: 0,
			halfOpenFailures: 0,
		});
	}
	return circuitBreakers.get(endpoint)!;
}

function updateCircuitState(
	endpoint: string,
	success: boolean,
	config: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER_CONFIG
): void {
	const breaker = getCircuitBreaker(endpoint);
	const now = Date.now();

	if (success) {
		if (breaker.state === "half-open") {
			breaker.halfOpenSuccesses++;
			if (breaker.halfOpenSuccesses >= config.halfOpenRequests) {
				// Enough successes, close the circuit
				breaker.state = "closed";
				breaker.failures = 0;
				breaker.halfOpenSuccesses = 0;
				breaker.halfOpenFailures = 0;
				telnyxLogger.info("Circuit breaker closed", { endpoint });
			}
		} else if (breaker.state === "closed") {
			// Reset failure count on success
			breaker.failures = 0;
		}
	} else {
		breaker.lastFailureTime = now;

		if (breaker.state === "half-open") {
			breaker.halfOpenFailures++;
			// Any failure in half-open reopens the circuit
			breaker.state = "open";
			breaker.halfOpenSuccesses = 0;
			breaker.halfOpenFailures = 0;
			telnyxLogger.warn("Circuit breaker reopened", { endpoint });
		} else if (breaker.state === "closed") {
			breaker.failures++;
			if (breaker.failures >= config.failureThreshold) {
				breaker.state = "open";
				telnyxLogger.error("Circuit breaker opened", {
					endpoint,
					failures: breaker.failures,
				});
			}
		}
	}
}

function canAttempt(
	endpoint: string,
	config: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER_CONFIG
): boolean {
	const breaker = getCircuitBreaker(endpoint);
	const now = Date.now();

	if (breaker.state === "closed") {
		return true;
	}

	if (breaker.state === "open") {
		// Check if reset timeout has passed
		if (now - breaker.lastFailureTime >= config.resetTimeoutMs) {
			breaker.state = "half-open";
			breaker.halfOpenSuccesses = 0;
			breaker.halfOpenFailures = 0;
			telnyxLogger.info("Circuit breaker half-open", { endpoint });
			return true;
		}
		return false;
	}

	// Half-open: allow limited requests
	return true;
}

// =============================================================================
// RETRY LOGIC
// =============================================================================

export interface RetryError extends Error {
	statusCode?: number;
	errorCode?: string;
	retryable: boolean;
	attempts: number;
	lastError?: Error;
}

export function createRetryError(
	message: string,
	options: {
		statusCode?: number;
		errorCode?: string;
		retryable: boolean;
		attempts: number;
		lastError?: Error;
	}
): RetryError {
	const error = new Error(message) as RetryError;
	error.name = "RetryError";
	error.statusCode = options.statusCode;
	error.errorCode = options.errorCode;
	error.retryable = options.retryable;
	error.attempts = options.attempts;
	error.lastError = options.lastError;
	return error;
}

/**
 * Check if an error is retryable
 */
export function isRetryable(
	error: unknown,
	config: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
	if (!error) return false;

	// Check for network errors
	if (error instanceof Error) {
		const errorCode = (error as NodeJS.ErrnoException).code;
		if (errorCode && config.retryableErrorCodes.includes(errorCode)) {
			return true;
		}

		// Check for fetch/network errors
		if (
			error.message.includes("fetch failed") ||
			error.message.includes("network") ||
			error.message.includes("timeout") ||
			error.message.includes("ECONNRESET")
		) {
			return true;
		}
	}

	// Check for HTTP status codes
	if (typeof error === "object" && error !== null) {
		const statusCode = (error as { statusCode?: number; status?: number })
			.statusCode ||
			(error as { statusCode?: number; status?: number }).status;
		if (statusCode && config.retryableStatusCodes.includes(statusCode)) {
			return true;
		}
	}

	return false;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateDelay(
	attempt: number,
	config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
	// Exponential backoff: baseDelay * 2^attempt
	const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);

	// Cap at max delay
	const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);

	// Add jitter (randomness to spread out retries)
	const jitter = cappedDelay * config.jitterFactor * Math.random();

	return Math.floor(cappedDelay + jitter);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract Retry-After header value in milliseconds
 */
export function parseRetryAfter(response: Response): number | null {
	const retryAfter = response.headers.get("Retry-After");
	if (!retryAfter) return null;

	// Check if it's a number (seconds)
	const seconds = parseInt(retryAfter, 10);
	if (!isNaN(seconds)) {
		return seconds * 1000;
	}

	// Check if it's a date
	const date = Date.parse(retryAfter);
	if (!isNaN(date)) {
		return Math.max(0, date - Date.now());
	}

	return null;
}

// =============================================================================
// RETRY WRAPPER
// =============================================================================

export interface RetryOptions {
	endpoint?: string; // For circuit breaker tracking
	config?: Partial<RetryConfig>;
	circuitBreakerConfig?: Partial<CircuitBreakerConfig>;
	onRetry?: (attempt: number, error: Error, delayMs: number) => void;
	correlationId?: string;
}

/**
 * Execute a function with retry logic and circuit breaker
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	options: RetryOptions = {}
): Promise<T> {
	const config = { ...DEFAULT_RETRY_CONFIG, ...options.config };
	const circuitConfig = {
		...DEFAULT_CIRCUIT_BREAKER_CONFIG,
		...options.circuitBreakerConfig,
	};
	const endpoint = options.endpoint || "default";
	const correlationId = options.correlationId || generateCorrelationId();

	// Check circuit breaker
	if (!canAttempt(endpoint, circuitConfig)) {
		const error = createRetryError(
			`Circuit breaker open for endpoint: ${endpoint}`,
			{
				retryable: false,
				attempts: 0,
			}
		);
		telnyxLogger.warn("Request blocked by circuit breaker", {
			endpoint,
			correlationId,
		});
		throw error;
	}

	let lastError: Error | undefined;
	let attempt = 0;

	while (attempt <= config.maxRetries) {
		try {
			const result = await fn();

			// Success - update circuit breaker
			updateCircuitState(endpoint, true, circuitConfig);

			if (attempt > 0) {
				telnyxLogger.info("Request succeeded after retry", {
					endpoint,
					attempt,
					correlationId,
				});
			}

			return result;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));

			const retryable = isRetryable(error, config);

			telnyxLogger.warn("Request failed", {
				endpoint,
				attempt,
				retryable,
				error: lastError.message,
				correlationId,
			});

			// Update circuit breaker on failure
			updateCircuitState(endpoint, false, circuitConfig);

			// Don't retry if not retryable or max retries reached
			if (!retryable || attempt >= config.maxRetries) {
				throw createRetryError(
					`Request failed after ${attempt + 1} attempt(s): ${lastError.message}`,
					{
						retryable,
						attempts: attempt + 1,
						lastError,
						statusCode: (error as { statusCode?: number }).statusCode,
						errorCode: (error as { code?: string }).code,
					}
				);
			}

			// Calculate delay
			let delayMs = calculateDelay(attempt, config);

			// Check for Retry-After header (if error has response)
			if (
				typeof error === "object" &&
				error !== null &&
				"response" in error
			) {
				const response = (error as { response?: Response }).response;
				if (response) {
					const retryAfter = parseRetryAfter(response);
					if (retryAfter) {
						delayMs = Math.min(retryAfter, config.maxDelayMs);
					}
				}
			}

			// Call onRetry callback
			if (options.onRetry) {
				options.onRetry(attempt, lastError, delayMs);
			}

			telnyxLogger.info("Retrying request", {
				endpoint,
				attempt: attempt + 1,
				delayMs,
				correlationId,
			});

			await sleep(delayMs);
			attempt++;
		}
	}

	// Should never reach here, but just in case
	throw createRetryError(
		`Request failed after ${config.maxRetries + 1} attempts`,
		{
			retryable: false,
			attempts: config.maxRetries + 1,
			lastError,
		}
	);
}

// =============================================================================
// BULK RETRY (for rate-limited batch operations)
// =============================================================================

export interface BulkRetryOptions<T, R> {
	items: T[];
	operation: (item: T) => Promise<R>;
	concurrency?: number;
	retryOptions?: RetryOptions;
	onProgress?: (completed: number, total: number, failed: number) => void;
}

export interface BulkRetryResult<T, R> {
	successful: Array<{ item: T; result: R }>;
	failed: Array<{ item: T; error: Error }>;
}

/**
 * Process items in bulk with retry logic and concurrency control
 */
export async function withBulkRetry<T, R>(
	options: BulkRetryOptions<T, R>
): Promise<BulkRetryResult<T, R>> {
	const { items, operation, concurrency = 10, retryOptions, onProgress } = options;

	const successful: Array<{ item: T; result: R }> = [];
	const failed: Array<{ item: T; error: Error }> = [];
	let completed = 0;

	// Process in batches
	for (let i = 0; i < items.length; i += concurrency) {
		const batch = items.slice(i, i + concurrency);

		const results = await Promise.allSettled(
			batch.map(async (item) => {
				const result = await withRetry(
					() => operation(item),
					retryOptions
				);
				return { item, result };
			})
		);

		for (const result of results) {
			completed++;

			if (result.status === "fulfilled") {
				successful.push(result.value);
			} else {
				const item = batch[results.indexOf(result)];
				failed.push({
					item,
					error:
						result.reason instanceof Error
							? result.reason
							: new Error(String(result.reason)),
				});
			}
		}

		if (onProgress) {
			onProgress(completed, items.length, failed.length);
		}

		// Small delay between batches to avoid rate limiting
		if (i + concurrency < items.length) {
			await sleep(100);
		}
	}

	return { successful, failed };
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Generate a correlation ID for request tracking
 */
export function generateCorrelationId(): string {
	return `tlx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get circuit breaker status for monitoring
 */
export function getCircuitBreakerStatus(endpoint?: string): {
	endpoints: Record<string, CircuitBreakerState>;
	summary: {
		total: number;
		open: number;
		halfOpen: number;
		closed: number;
	};
} {
	const endpoints: Record<string, CircuitBreakerState> = {};

	if (endpoint) {
		const breaker = circuitBreakers.get(endpoint);
		if (breaker) {
			endpoints[endpoint] = breaker;
		}
	} else {
		circuitBreakers.forEach((state, ep) => {
			endpoints[ep] = state;
		});
	}

	const states = Object.values(endpoints);
	return {
		endpoints,
		summary: {
			total: states.length,
			open: states.filter((s) => s.state === "open").length,
			halfOpen: states.filter((s) => s.state === "half-open").length,
			closed: states.filter((s) => s.state === "closed").length,
		},
	};
}

/**
 * Reset circuit breaker for an endpoint (for testing/manual reset)
 */
export function resetCircuitBreaker(endpoint: string): void {
	circuitBreakers.delete(endpoint);
	telnyxLogger.info("Circuit breaker reset", { endpoint });
}

/**
 * Reset all circuit breakers
 */
export function resetAllCircuitBreakers(): void {
	circuitBreakers.clear();
	telnyxLogger.info("All circuit breakers reset");
}
