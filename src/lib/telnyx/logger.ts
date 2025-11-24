/**
 * Telnyx Structured Logger
 *
 * Provides structured JSON logging with PII redaction,
 * log levels, and correlation ID support.
 */

// =============================================================================
// TYPES
// =============================================================================

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
	correlationId?: string;
	endpoint?: string;
	companyId?: string;
	phoneNumber?: string;
	callControlId?: string;
	messageSid?: string;
	attempt?: number;
	delayMs?: number;
	latencyMs?: number;
	statusCode?: number;
	error?: string;
	[key: string]: unknown;
}

export interface LogEntry {
	timestamp: string;
	level: LogLevel;
	service: string;
	message: string;
	context?: LogContext;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

// Default to 'info' in production, 'debug' in development
const currentLogLevel: LogLevel =
	(process.env.TELNYX_LOG_LEVEL as LogLevel) ||
	(process.env.NODE_ENV === "production" ? "info" : "debug");

// PII patterns to redact
const PII_PATTERNS = [
	// Phone numbers (various formats)
	/\+?1?\d{10,15}/g,
	// Email addresses
	/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
];

// Fields that should be redacted
const SENSITIVE_FIELDS = [
	"phone",
	"phoneNumber",
	"phone_number",
	"from",
	"to",
	"fromNumber",
	"toNumber",
	"from_number",
	"to_number",
	"apiKey",
	"api_key",
	"authToken",
	"auth_token",
	"password",
	"secret",
	"token",
];

// =============================================================================
// PII REDACTION
// =============================================================================

/**
 * Mask a phone number, keeping last 4 digits
 */
function maskPhoneNumber(phone: string): string {
	const digits = phone.replace(/\D/g, "");
	if (digits.length < 4) return "****";
	return `***${digits.slice(-4)}`;
}

/**
 * Mask an email address
 */
function maskEmail(email: string): string {
	const [local, domain] = email.split("@");
	if (!domain) return "***@***";
	const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : "***";
	return `${maskedLocal}@${domain}`;
}

/**
 * Redact PII from a string
 */
function redactString(value: string): string {
	let result = value;

	// Redact phone numbers
	result = result.replace(/\+?1?\d{10,15}/g, (match) => maskPhoneNumber(match));

	// Redact email addresses
	result = result.replace(
		/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
		(match) => maskEmail(match)
	);

	return result;
}

/**
 * Recursively redact PII from an object
 */
function redactPII(obj: unknown, depth = 0): unknown {
	// Prevent infinite recursion
	if (depth > 10) return "[MAX_DEPTH]";

	if (obj === null || obj === undefined) {
		return obj;
	}

	if (typeof obj === "string") {
		return redactString(obj);
	}

	if (typeof obj === "number" || typeof obj === "boolean") {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => redactPII(item, depth + 1));
	}

	if (typeof obj === "object") {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			// Check if this is a sensitive field
			const isSensitive = SENSITIVE_FIELDS.some(
				(field) => key.toLowerCase().includes(field.toLowerCase())
			);

			if (isSensitive) {
				if (typeof value === "string") {
					// Mask the value
					if (value.includes("@")) {
						result[key] = maskEmail(value);
					} else if (/\d/.test(value)) {
						result[key] = maskPhoneNumber(value);
					} else {
						result[key] = "[REDACTED]";
					}
				} else {
					result[key] = "[REDACTED]";
				}
			} else {
				result[key] = redactPII(value, depth + 1);
			}
		}

		return result;
	}

	return obj;
}

// =============================================================================
// LOGGER CLASS
// =============================================================================

class TelnyxLogger {
	private service = "telnyx";
	private defaultContext: LogContext = {};

	/**
	 * Set default context for all log entries
	 */
	setDefaultContext(context: LogContext): void {
		this.defaultContext = { ...this.defaultContext, ...context };
	}

	/**
	 * Clear default context
	 */
	clearDefaultContext(): void {
		this.defaultContext = {};
	}

	/**
	 * Check if a log level should be output
	 */
	private shouldLog(level: LogLevel): boolean {
		return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
	}

	/**
	 * Format and output a log entry
	 */
	private log(level: LogLevel, message: string, context?: LogContext): void {
		if (!this.shouldLog(level)) return;

		const entry: LogEntry = {
			timestamp: new Date().toISOString(),
			level,
			service: this.service,
			message,
		};

		// Merge default context with provided context
		const fullContext = { ...this.defaultContext, ...context };

		if (Object.keys(fullContext).length > 0) {
			// Redact PII from context
			entry.context = redactPII(fullContext) as LogContext;
		}

		// Output as JSON in production, pretty print in development
		if (process.env.NODE_ENV === "production") {
			const output = JSON.stringify(entry);

			switch (level) {
				case "error":
					console.error(output);
					break;
				case "warn":
					console.warn(output);
					break;
				default:
					console.log(output);
			}
		} else {
			// Development: more readable format
			const contextStr = entry.context
				? ` ${JSON.stringify(entry.context, null, 2)}`
				: "";

			const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.service}]`;

			switch (level) {
				case "error":
					console.error(`${prefix} ${message}${contextStr}`);
					break;
				case "warn":
					console.warn(`${prefix} ${message}${contextStr}`);
					break;
				case "debug":
					console.debug(`${prefix} ${message}${contextStr}`);
					break;
				default:
					console.log(`${prefix} ${message}${contextStr}`);
			}
		}
	}

	/**
	 * Log at debug level
	 */
	debug(message: string, context?: LogContext): void {
		this.log("debug", message, context);
	}

	/**
	 * Log at info level
	 */
	info(message: string, context?: LogContext): void {
		this.log("info", message, context);
	}

	/**
	 * Log at warn level
	 */
	warn(message: string, context?: LogContext): void {
		this.log("warn", message, context);
	}

	/**
	 * Log at error level
	 */
	error(message: string, context?: LogContext): void {
		this.log("error", message, context);
	}

	/**
	 * Create a child logger with additional default context
	 */
	child(context: LogContext): TelnyxChildLogger {
		return new TelnyxChildLogger(this, context);
	}

	/**
	 * Log a request start
	 */
	logRequestStart(
		method: string,
		endpoint: string,
		context?: LogContext
	): { correlationId: string; startTime: number } {
		const correlationId =
			context?.correlationId ||
			`tlx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
		const startTime = Date.now();

		this.debug(`${method} ${endpoint} started`, {
			...context,
			correlationId,
			endpoint,
		});

		return { correlationId, startTime };
	}

	/**
	 * Log a request completion
	 */
	logRequestEnd(
		method: string,
		endpoint: string,
		statusCode: number,
		startTime: number,
		context?: LogContext
	): void {
		const latencyMs = Date.now() - startTime;

		const logFn = statusCode >= 400 ? this.warn.bind(this) : this.info.bind(this);

		logFn(`${method} ${endpoint} completed`, {
			...context,
			endpoint,
			statusCode,
			latencyMs,
		});
	}

	/**
	 * Log a request error
	 */
	logRequestError(
		method: string,
		endpoint: string,
		error: Error,
		startTime: number,
		context?: LogContext
	): void {
		const latencyMs = Date.now() - startTime;

		this.error(`${method} ${endpoint} failed`, {
			...context,
			endpoint,
			error: error.message,
			latencyMs,
		});
	}
}

/**
 * Child logger with inherited context
 */
class TelnyxChildLogger {
	constructor(
		private parent: TelnyxLogger,
		private context: LogContext
	) {}

	debug(message: string, context?: LogContext): void {
		this.parent.debug(message, { ...this.context, ...context });
	}

	info(message: string, context?: LogContext): void {
		this.parent.info(message, { ...this.context, ...context });
	}

	warn(message: string, context?: LogContext): void {
		this.parent.warn(message, { ...this.context, ...context });
	}

	error(message: string, context?: LogContext): void {
		this.parent.error(message, { ...this.context, ...context });
	}
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Singleton logger instance
 */
export const telnyxLogger = new TelnyxLogger();

/**
 * Create a request-scoped logger
 */
export function createRequestLogger(correlationId: string): TelnyxChildLogger {
	return telnyxLogger.child({ correlationId });
}

/**
 * Utility to redact PII from any object (exported for testing)
 */
export { redactPII };
