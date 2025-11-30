/**
 * Production-Safe Error Logging Utility
 * 
 * Provides safe error logging that only logs in development mode
 * and can be extended to use proper error tracking services in production.
 */

/**
 * Log an error safely (only in development)
 */
export function logError(error: unknown, context?: string): void {
	if (process.env.NODE_ENV === "development") {
		const message = context ? `[${context}]` : "[Error]";
		if (error instanceof Error) {
			console.error(message, error.message, error);
		} else {
			console.error(message, error);
		}
	}
	// In production, you would send to error tracking service (e.g., Sentry)
	// Example: Sentry.captureException(error, { tags: { context } });
}

/**
 * Log a warning safely (only in development)
 */
export function logWarning(message: string, context?: string): void {
	if (process.env.NODE_ENV === "development") {
		const prefix = context ? `[${context}]` : "[Warning]";
		console.warn(prefix, message);
	}
}

/**
 * Log debug information (only in development)
 */
export function logDebug(message: string, data?: unknown): void {
	if (process.env.NODE_ENV === "development") {
		console.log("[Debug]", message, data);
	}
}

