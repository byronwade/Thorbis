/**
 * Telnyx Custom Error Classes
 *
 * Provides typed error classes for different failure scenarios
 * with error codes, metadata, and retry information.
 */

// =============================================================================
// ERROR CODES
// =============================================================================

export enum TelnyxErrorCode {
	// Network errors
	NETWORK_ERROR = "TELNYX_NETWORK_ERROR",
	TIMEOUT = "TELNYX_TIMEOUT",
	CONNECTION_REFUSED = "TELNYX_CONNECTION_REFUSED",

	// Authentication errors
	INVALID_API_KEY = "TELNYX_INVALID_API_KEY",
	UNAUTHORIZED = "TELNYX_UNAUTHORIZED",
	FORBIDDEN = "TELNYX_FORBIDDEN",

	// Rate limiting
	RATE_LIMIT_EXCEEDED = "TELNYX_RATE_LIMIT_EXCEEDED",

	// Validation errors
	INVALID_PHONE_NUMBER = "TELNYX_INVALID_PHONE_NUMBER",
	INVALID_REQUEST = "TELNYX_INVALID_REQUEST",
	MISSING_REQUIRED_FIELD = "TELNYX_MISSING_REQUIRED_FIELD",

	// Resource errors
	NOT_FOUND = "TELNYX_NOT_FOUND",
	RESOURCE_CONFLICT = "TELNYX_RESOURCE_CONFLICT",

	// Provider errors
	PROVIDER_ERROR = "TELNYX_PROVIDER_ERROR",
	CARRIER_ERROR = "TELNYX_CARRIER_ERROR",
	DELIVERY_FAILED = "TELNYX_DELIVERY_FAILED",

	// Call-specific errors
	CALL_REJECTED = "TELNYX_CALL_REJECTED",
	CALL_BUSY = "TELNYX_CALL_BUSY",
	CALL_NO_ANSWER = "TELNYX_CALL_NO_ANSWER",
	CALL_FAILED = "TELNYX_CALL_FAILED",

	// SMS-specific errors
	SMS_DELIVERY_FAILED = "TELNYX_SMS_DELIVERY_FAILED",
	SMS_BLOCKED = "TELNYX_SMS_BLOCKED",
	SMS_SPAM_DETECTED = "TELNYX_SMS_SPAM_DETECTED",

	// Webhook errors
	WEBHOOK_VALIDATION_FAILED = "TELNYX_WEBHOOK_VALIDATION_FAILED",
	WEBHOOK_SIGNATURE_INVALID = "TELNYX_WEBHOOK_SIGNATURE_INVALID",
	WEBHOOK_TIMESTAMP_INVALID = "TELNYX_WEBHOOK_TIMESTAMP_INVALID",
	WEBHOOK_REPLAY_DETECTED = "TELNYX_WEBHOOK_REPLAY_DETECTED",

	// Circuit breaker
	CIRCUIT_BREAKER_OPEN = "TELNYX_CIRCUIT_BREAKER_OPEN",

	// Generic
	UNKNOWN_ERROR = "TELNYX_UNKNOWN_ERROR",
	INTERNAL_ERROR = "TELNYX_INTERNAL_ERROR",
}

// =============================================================================
// BASE ERROR CLASS
// =============================================================================

export interface TelnyxErrorMetadata {
	correlationId?: string;
	endpoint?: string;
	method?: string;
	statusCode?: number;
	companyId?: string;
	phoneNumber?: string;
	callControlId?: string;
	messageSid?: string;
	attempt?: number;
	retryable?: boolean;
	retryAfterMs?: number;
	originalError?: Error;
	telnyxErrorCode?: string;
	telnyxErrorDetail?: string;
	[key: string]: unknown;
}

export class TelnyxError extends Error {
	public readonly code: TelnyxErrorCode;
	public readonly metadata: TelnyxErrorMetadata;
	public readonly timestamp: Date;
	public readonly retryable: boolean;
	public readonly retryAfterMs?: number;

	constructor(
		message: string,
		code: TelnyxErrorCode = TelnyxErrorCode.UNKNOWN_ERROR,
		metadata: TelnyxErrorMetadata = {}
	) {
		super(message);
		this.name = "TelnyxError";
		this.code = code;
		this.metadata = metadata;
		this.timestamp = new Date();
		this.retryable = metadata.retryable ?? this.isRetryableCode(code);
		this.retryAfterMs = metadata.retryAfterMs;

		// Capture stack trace
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, TelnyxError);
		}
	}

	private isRetryableCode(code: TelnyxErrorCode): boolean {
		const retryableCodes = [
			TelnyxErrorCode.NETWORK_ERROR,
			TelnyxErrorCode.TIMEOUT,
			TelnyxErrorCode.CONNECTION_REFUSED,
			TelnyxErrorCode.RATE_LIMIT_EXCEEDED,
			TelnyxErrorCode.PROVIDER_ERROR,
			TelnyxErrorCode.INTERNAL_ERROR,
		];
		return retryableCodes.includes(code);
	}

	/**
	 * Convert to JSON for logging/serialization
	 */
	toJSON(): Record<string, unknown> {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			metadata: this.metadata,
			timestamp: this.timestamp.toISOString(),
			retryable: this.retryable,
			retryAfterMs: this.retryAfterMs,
			stack: this.stack,
		};
	}

	/**
	 * Create a user-friendly error message
	 */
	toUserMessage(): string {
		switch (this.code) {
			case TelnyxErrorCode.INVALID_PHONE_NUMBER:
				return "The phone number provided is invalid. Please check and try again.";
			case TelnyxErrorCode.RATE_LIMIT_EXCEEDED:
				return "Too many requests. Please wait a moment and try again.";
			case TelnyxErrorCode.CALL_BUSY:
				return "The number is busy. Please try again later.";
			case TelnyxErrorCode.CALL_NO_ANSWER:
				return "No answer. The call was not picked up.";
			case TelnyxErrorCode.SMS_BLOCKED:
				return "Message could not be delivered. The recipient may have blocked messages.";
			case TelnyxErrorCode.UNAUTHORIZED:
			case TelnyxErrorCode.INVALID_API_KEY:
				return "Authentication failed. Please contact support.";
			case TelnyxErrorCode.NETWORK_ERROR:
			case TelnyxErrorCode.TIMEOUT:
				return "Connection issue. Please try again.";
			default:
				return "An error occurred. Please try again or contact support.";
		}
	}
}

// =============================================================================
// SPECIALIZED ERROR CLASSES
// =============================================================================

/**
 * Network-related errors (connectivity, timeout, etc.)
 */
export class TelnyxNetworkError extends TelnyxError {
	constructor(message: string, metadata: TelnyxErrorMetadata = {}) {
		super(message, TelnyxErrorCode.NETWORK_ERROR, {
			...metadata,
			retryable: true,
		});
		this.name = "TelnyxNetworkError";
	}
}

/**
 * Timeout errors
 */
export class TelnyxTimeoutError extends TelnyxError {
	public readonly timeoutMs: number;

	constructor(
		message: string,
		timeoutMs: number,
		metadata: TelnyxErrorMetadata = {}
	) {
		super(message, TelnyxErrorCode.TIMEOUT, {
			...metadata,
			retryable: true,
		});
		this.name = "TelnyxTimeoutError";
		this.timeoutMs = timeoutMs;
	}
}

/**
 * Rate limit errors
 */
export class TelnyxRateLimitError extends TelnyxError {
	constructor(
		message: string,
		retryAfterMs: number,
		metadata: TelnyxErrorMetadata = {}
	) {
		super(message, TelnyxErrorCode.RATE_LIMIT_EXCEEDED, {
			...metadata,
			retryable: true,
			retryAfterMs,
		});
		this.name = "TelnyxRateLimitError";
	}
}

/**
 * Authentication/Authorization errors
 */
export class TelnyxAuthError extends TelnyxError {
	constructor(message: string, metadata: TelnyxErrorMetadata = {}) {
		const code = metadata.statusCode === 403
			? TelnyxErrorCode.FORBIDDEN
			: TelnyxErrorCode.UNAUTHORIZED;
		super(message, code, {
			...metadata,
			retryable: false,
		});
		this.name = "TelnyxAuthError";
	}
}

/**
 * Validation errors
 */
export class TelnyxValidationError extends TelnyxError {
	public readonly field?: string;
	public readonly validationDetails?: Record<string, string[]>;

	constructor(
		message: string,
		metadata: TelnyxErrorMetadata & {
			field?: string;
			validationDetails?: Record<string, string[]>;
		} = {}
	) {
		super(message, TelnyxErrorCode.INVALID_REQUEST, {
			...metadata,
			retryable: false,
		});
		this.name = "TelnyxValidationError";
		this.field = metadata.field;
		this.validationDetails = metadata.validationDetails;
	}
}

/**
 * Phone number validation errors
 */
export class TelnyxPhoneNumberError extends TelnyxError {
	public readonly phoneNumber: string;

	constructor(
		message: string,
		phoneNumber: string,
		metadata: TelnyxErrorMetadata = {}
	) {
		super(message, TelnyxErrorCode.INVALID_PHONE_NUMBER, {
			...metadata,
			phoneNumber,
			retryable: false,
		});
		this.name = "TelnyxPhoneNumberError";
		this.phoneNumber = phoneNumber;
	}
}

/**
 * Webhook validation errors
 */
export class TelnyxWebhookError extends TelnyxError {
	constructor(
		message: string,
		code: TelnyxErrorCode = TelnyxErrorCode.WEBHOOK_VALIDATION_FAILED,
		metadata: TelnyxErrorMetadata = {}
	) {
		super(message, code, {
			...metadata,
			retryable: false,
		});
		this.name = "TelnyxWebhookError";
	}
}

/**
 * Circuit breaker errors
 */
export class TelnyxCircuitBreakerError extends TelnyxError {
	public readonly endpoint: string;

	constructor(endpoint: string, metadata: TelnyxErrorMetadata = {}) {
		super(
			`Circuit breaker is open for endpoint: ${endpoint}`,
			TelnyxErrorCode.CIRCUIT_BREAKER_OPEN,
			{
				...metadata,
				endpoint,
				retryable: false,
			}
		);
		this.name = "TelnyxCircuitBreakerError";
		this.endpoint = endpoint;
	}
}

/**
 * Call-specific errors
 */
export class TelnyxCallError extends TelnyxError {
	public readonly callControlId?: string;

	constructor(
		message: string,
		code: TelnyxErrorCode,
		metadata: TelnyxErrorMetadata = {}
	) {
		super(message, code, metadata);
		this.name = "TelnyxCallError";
		this.callControlId = metadata.callControlId;
	}
}

/**
 * SMS-specific errors
 */
export class TelnyxSmsError extends TelnyxError {
	public readonly messageSid?: string;

	constructor(
		message: string,
		code: TelnyxErrorCode,
		metadata: TelnyxErrorMetadata = {}
	) {
		super(message, code, metadata);
		this.name = "TelnyxSmsError";
		this.messageSid = metadata.messageSid;
	}
}

// =============================================================================
// ERROR FACTORY
// =============================================================================

/**
 * Create appropriate error from HTTP response
 */
export function createErrorFromResponse(
	statusCode: number,
	body: unknown,
	metadata: TelnyxErrorMetadata = {}
): TelnyxError {
	const errorBody = body as {
		errors?: Array<{ code?: string; title?: string; detail?: string }>;
		error?: string;
		message?: string;
	};

	const errorDetail = errorBody?.errors?.[0]?.detail ||
		errorBody?.error ||
		errorBody?.message ||
		"Unknown error";

	const telnyxErrorCode = errorBody?.errors?.[0]?.code;

	const fullMetadata = {
		...metadata,
		statusCode,
		telnyxErrorCode,
		telnyxErrorDetail: errorDetail,
	};

	switch (statusCode) {
		case 400:
			return new TelnyxValidationError(errorDetail, fullMetadata);

		case 401:
			return new TelnyxAuthError("Invalid API key or unauthorized", fullMetadata);

		case 403:
			return new TelnyxAuthError("Access forbidden", fullMetadata);

		case 404:
			return new TelnyxError("Resource not found", TelnyxErrorCode.NOT_FOUND, {
				...fullMetadata,
				retryable: false,
			});

		case 409:
			return new TelnyxError("Resource conflict", TelnyxErrorCode.RESOURCE_CONFLICT, {
				...fullMetadata,
				retryable: false,
			});

		case 429:
			const retryAfter = parseInt(
				(body as { retry_after?: string })?.retry_after || "60",
				10
			) * 1000;
			return new TelnyxRateLimitError(
				"Rate limit exceeded",
				retryAfter,
				fullMetadata
			);

		case 500:
		case 502:
		case 503:
		case 504:
			return new TelnyxError(
				"Telnyx service error",
				TelnyxErrorCode.PROVIDER_ERROR,
				{
					...fullMetadata,
					retryable: true,
				}
			);

		default:
			return new TelnyxError(errorDetail, TelnyxErrorCode.UNKNOWN_ERROR, fullMetadata);
	}
}

/**
 * Create error from network/fetch error
 */
export function createErrorFromException(
	error: unknown,
	metadata: TelnyxErrorMetadata = {}
): TelnyxError {
	if (error instanceof TelnyxError) {
		return error;
	}

	const originalError = error instanceof Error ? error : new Error(String(error));
	const errorCode = (originalError as NodeJS.ErrnoException).code;

	const fullMetadata = {
		...metadata,
		originalError,
	};

	// Check for specific error types
	if (originalError.name === "AbortError" || originalError.message.includes("timeout")) {
		return new TelnyxTimeoutError(
			"Request timed out",
			metadata.timeout as number || 30000,
			fullMetadata
		);
	}

	if (
		errorCode === "ECONNRESET" ||
		errorCode === "ECONNREFUSED" ||
		errorCode === "ENOTFOUND" ||
		errorCode === "ENETUNREACH" ||
		originalError.message.includes("fetch failed") ||
		originalError.message.includes("network")
	) {
		return new TelnyxNetworkError(
			`Network error: ${originalError.message}`,
			fullMetadata
		);
	}

	return new TelnyxError(
		originalError.message,
		TelnyxErrorCode.UNKNOWN_ERROR,
		fullMetadata
	);
}

// =============================================================================
// ERROR UTILITIES
// =============================================================================

/**
 * Check if an error is a TelnyxError
 */
export function isTelnyxError(error: unknown): error is TelnyxError {
	return error instanceof TelnyxError;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
	if (error instanceof TelnyxError) {
		return error.retryable;
	}

	// Check for network errors
	if (error instanceof Error) {
		const errorCode = (error as NodeJS.ErrnoException).code;
		const retryableErrorCodes = [
			"ECONNRESET",
			"ETIMEDOUT",
			"ECONNREFUSED",
			"EPIPE",
			"ENOTFOUND",
			"ENETUNREACH",
			"EAI_AGAIN",
		];
		if (errorCode && retryableErrorCodes.includes(errorCode)) {
			return true;
		}
	}

	return false;
}

/**
 * Wrap an error to ensure it's a TelnyxError
 */
export function wrapError(
	error: unknown,
	metadata: TelnyxErrorMetadata = {}
): TelnyxError {
	if (error instanceof TelnyxError) {
		// Merge metadata
		return new TelnyxError(error.message, error.code, {
			...error.metadata,
			...metadata,
		});
	}

	return createErrorFromException(error, metadata);
}
