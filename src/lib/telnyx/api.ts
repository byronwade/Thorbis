/**
 * Telnyx API Client
 *
 * Production-ready API client with:
 * - Configurable timeouts
 * - Automatic retries with exponential backoff
 * - Rate limiting
 * - Circuit breaker protection
 * - Structured logging
 * - Metrics collection
 */

import "server-only";

import { telnyxLogger } from "./logger";
import { withRetry, generateCorrelationId, type RetryOptions } from "./retry";
import { withRateLimit, type RateLimitEndpoint } from "./rate-limiter";
import {
	createErrorFromResponse,
	createErrorFromException,
	TelnyxError,
	TelnyxTimeoutError,
} from "./errors";
import { startRequestTimer } from "./metrics";

// =============================================================================
// CONFIGURATION
// =============================================================================

const TELNYX_BASE_URL = "https://api.telnyx.com/v2";
const TELNYX_PUBLIC_BASE_URL = "https://api.telnyx.com";

// Timeout configuration by operation type
export const TIMEOUT_CONFIG = {
	default: 30000, // 30 seconds
	sms: 10000, // 10 seconds
	voice: 30000, // 30 seconds
	lookup: 5000, // 5 seconds
	webhook: 2000, // 2 seconds
	balance: 5000, // 5 seconds
} as const;

export type TimeoutType = keyof typeof TIMEOUT_CONFIG;

// =============================================================================
// TYPES
// =============================================================================

export interface TelnyxRequestOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: Record<string, unknown>;
	timeout?: number;
	timeoutType?: TimeoutType;
	rateLimitEndpoint?: RateLimitEndpoint;
	companyId?: string;
	correlationId?: string;
	skipRetry?: boolean;
	skipRateLimit?: boolean;
	retryOptions?: Partial<RetryOptions>;
}

export interface TelnyxResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	errorCode?: string;
	correlationId?: string;
	latencyMs?: number;
}

// =============================================================================
// CORE REQUEST FUNCTION
// =============================================================================

/**
 * Make an authenticated request to the Telnyx API
 * with full production features (retry, rate limit, timeout, metrics)
 */
export async function telnyxRequest<TResponse>(
	path: string,
	options: TelnyxRequestOptions = {}
): Promise<TelnyxResponse<TResponse>> {
	const {
		method = "GET",
		body,
		timeout,
		timeoutType = "default",
		rateLimitEndpoint = "default",
		companyId,
		correlationId = generateCorrelationId(),
		skipRetry = false,
		skipRateLimit = false,
		retryOptions = {},
	} = options;

	const apiKey = process.env.TELNYX_API_KEY;
	if (!apiKey) {
		return {
			success: false,
			error: "TELNYX_API_KEY is not configured",
			errorCode: "CONFIG_ERROR",
			correlationId,
		};
	}

	// Build request URL
	const hasProtocol = /^https?:\/\//i.test(path);
	const normalizedPath =
		hasProtocol || path.startsWith("/") ? path : `/${path}`;
	const requestUrl = hasProtocol
		? normalizedPath
		: normalizedPath.startsWith("/public/")
			? `${TELNYX_PUBLIC_BASE_URL}${normalizedPath}`
			: `${TELNYX_BASE_URL}${normalizedPath}`;

	// Determine timeout
	const effectiveTimeout = timeout || TIMEOUT_CONFIG[timeoutType];

	// Log request start
	telnyxLogger.debug("API request started", {
		correlationId,
		endpoint: path,
		method,
		companyId,
	});

	// Start metrics timer
	const timer = startRequestTimer(path, method, companyId, correlationId);

	// Create the actual fetch function
	const executeFetch = async (): Promise<TelnyxResponse<TResponse>> => {
		const startTime = Date.now();

		// Create AbortController for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

		try {
			const response = await fetch(requestUrl, {
				method,
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
					"X-Correlation-ID": correlationId,
				},
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal,
				// Enable keep-alive for connection reuse
				keepalive: true,
			});

			clearTimeout(timeoutId);

			const latencyMs = Date.now() - startTime;

			// Parse response
			const payload = (await response.json().catch(() => ({}))) as
				| {
						data?: TResponse;
						errors?: Array<{ detail?: string; code?: string }>;
				  }
				| undefined;

			if (!response.ok) {
				// Record failure metric
				timer.end(response.status, false);

				// Create typed error
				const error = createErrorFromResponse(response.status, payload, {
					correlationId,
					endpoint: path,
					method,
					companyId,
				});

				telnyxLogger.warn("API request failed", {
					correlationId,
					endpoint: path,
					statusCode: response.status,
					error: error.message,
					latencyMs,
				});

				// Throw to trigger retry if retryable
				if (error.retryable) {
					throw error;
				}

				return {
					success: false,
					error: error.message,
					errorCode: error.code,
					correlationId,
					latencyMs,
				};
			}

			// Record success metric
			timer.end(response.status, true);

			// Telnyx API sometimes wraps response in "data", sometimes returns directly
			const responseData = payload?.data || payload;

			telnyxLogger.debug("API request completed", {
				correlationId,
				endpoint: path,
				statusCode: response.status,
				latencyMs,
			});

			return {
				success: true,
				data: responseData as TResponse,
				correlationId,
				latencyMs,
			};
		} catch (error) {
			clearTimeout(timeoutId);

			const latencyMs = Date.now() - startTime;

			// Handle timeout
			if (error instanceof Error && error.name === "AbortError") {
				timer.end(0, false);

				const timeoutError = new TelnyxTimeoutError(
					`Request timed out after ${effectiveTimeout}ms`,
					effectiveTimeout,
					{ correlationId, endpoint: path, method }
				);

				telnyxLogger.error("API request timed out", {
					correlationId,
					endpoint: path,
					timeoutMs: effectiveTimeout,
					latencyMs,
				});

				throw timeoutError; // Throw to trigger retry
			}

			// Handle TelnyxError (already processed)
			if (error instanceof TelnyxError) {
				throw error;
			}

			// Handle network/other errors
			timer.end(0, false);

			const wrappedError = createErrorFromException(error, {
				correlationId,
				endpoint: path,
				method,
			});

			telnyxLogger.error("API request error", {
				correlationId,
				endpoint: path,
				error: wrappedError.message,
				latencyMs,
			});

			throw wrappedError;
		}
	};

	// Apply rate limiting and retry logic
	try {
		let fetchFn = executeFetch;

		// Wrap with retry logic if not skipped
		if (!skipRetry) {
			const originalFn = fetchFn;
			fetchFn = () =>
				withRetry(originalFn, {
					endpoint: path,
					correlationId,
					config: retryOptions.config,
					onRetry: (attempt, error, delayMs) => {
						telnyxLogger.info("Retrying request", {
							correlationId,
							endpoint: path,
							attempt,
							delayMs,
							error: error.message,
						});
					},
				});
		}

		// Wrap with rate limiting if not skipped
		if (!skipRateLimit) {
			const fnWithRetry = fetchFn;
			fetchFn = () =>
				withRateLimit(fnWithRetry, {
					endpoint: rateLimitEndpoint,
					companyId,
					correlationId,
				});
		}

		return await fetchFn();
	} catch (error) {
		// Convert any remaining errors to response format
		if (error instanceof TelnyxError) {
			return {
				success: false,
				error: error.message,
				errorCode: error.code,
				correlationId,
			};
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			correlationId,
		};
	}
}

// =============================================================================
// CONVENIENCE METHODS
// =============================================================================

/**
 * GET request
 */
export async function telnyxGet<T>(
	path: string,
	options: Omit<TelnyxRequestOptions, "method" | "body"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, { ...options, method: "GET" });
}

/**
 * POST request
 */
export async function telnyxPost<T>(
	path: string,
	body: Record<string, unknown>,
	options: Omit<TelnyxRequestOptions, "method" | "body"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, { ...options, method: "POST", body });
}

/**
 * PUT request
 */
export async function telnyxPut<T>(
	path: string,
	body: Record<string, unknown>,
	options: Omit<TelnyxRequestOptions, "method" | "body"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, { ...options, method: "PUT", body });
}

/**
 * PATCH request
 */
export async function telnyxPatch<T>(
	path: string,
	body: Record<string, unknown>,
	options: Omit<TelnyxRequestOptions, "method" | "body"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, { ...options, method: "PATCH", body });
}

/**
 * DELETE request
 */
export async function telnyxDelete<T>(
	path: string,
	options: Omit<TelnyxRequestOptions, "method" | "body"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, { ...options, method: "DELETE" });
}

// =============================================================================
// SPECIALIZED REQUESTS
// =============================================================================

/**
 * SMS-specific request with appropriate timeout and rate limiting
 */
export async function telnyxSmsRequest<T>(
	path: string,
	options: Omit<TelnyxRequestOptions, "timeoutType" | "rateLimitEndpoint"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, {
		...options,
		timeoutType: "sms",
		rateLimitEndpoint: "sms",
	});
}

/**
 * Voice-specific request with appropriate timeout and rate limiting
 */
export async function telnyxVoiceRequest<T>(
	path: string,
	options: Omit<TelnyxRequestOptions, "timeoutType" | "rateLimitEndpoint"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, {
		...options,
		timeoutType: "voice",
		rateLimitEndpoint: "voice",
	});
}

/**
 * Lookup-specific request with appropriate timeout
 */
export async function telnyxLookupRequest<T>(
	path: string,
	options: Omit<TelnyxRequestOptions, "timeoutType" | "rateLimitEndpoint"> = {}
): Promise<TelnyxResponse<T>> {
	return telnyxRequest<T>(path, {
		...options,
		timeoutType: "lookup",
		rateLimitEndpoint: "lookup",
	});
}
