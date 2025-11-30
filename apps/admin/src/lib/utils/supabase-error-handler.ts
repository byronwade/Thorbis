/**
 * Supabase Error Handler Utilities
 *
 * Handles errors from Supabase, including HTML error pages (522, 503, etc.)
 * that occur when the project is paused or unavailable.
 */

/**
 * Check if an error message contains HTML (indicating an error page response)
 */
export function isHtmlErrorResponse(error: unknown): boolean {
	if (!error) return false;

	let errorMessage: string;
	
	if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === "object" && error !== null && "message" in error) {
		errorMessage = String((error as { message: unknown }).message);
	} else {
		errorMessage = String(error);
	}

	// Check for common HTML indicators
	return (
		typeof errorMessage === "string" &&
		(errorMessage.includes("<!DOCTYPE html") ||
			errorMessage.includes("<html") ||
			errorMessage.includes("Connection timed out") ||
			errorMessage.includes("Error code 522") ||
			errorMessage.includes("Error code 503") ||
			errorMessage.includes("Cloudflare"))
	);
}

/**
 * Extract a concise error message from an error, handling HTML responses
 */
export function getConciseErrorMessage(
	error: unknown,
	context: string = "Supabase",
): string {
	if (!error) return "Unknown error";

	// Handle Error instances
	if (error instanceof Error) {
		const errorMessage = error.message;
		
		// If it's an HTML error response, return a user-friendly message
		if (isHtmlErrorResponse(error)) {
			if (errorMessage.includes("522")) {
				return "Connection timed out - Supabase project may be paused";
			}
			if (errorMessage.includes("503")) {
				return "Service temporarily unavailable";
			}
			return "Database connection error - service may be unavailable";
		}

		// For regular errors, return the message (truncated if too long)
		if (errorMessage.length > 200) {
			return `${errorMessage.substring(0, 200)}...`;
		}

		return errorMessage;
	}

	// Handle plain objects with a message property
	if (typeof error === "object" && error !== null && "message" in error) {
		const errorMessage = String((error as { message: unknown }).message);
		
		// If it's an HTML error response, return a user-friendly message
		if (isHtmlErrorResponse({ message: errorMessage })) {
			if (errorMessage.includes("522")) {
				return "Connection timed out - Supabase project may be paused";
			}
			if (errorMessage.includes("503")) {
				return "Service temporarily unavailable";
			}
			return "Database connection error - service may be unavailable";
		}

		// For regular errors, return the message (truncated if too long)
		if (errorMessage.length > 200) {
			return `${errorMessage.substring(0, 200)}...`;
		}

		return errorMessage;
	}

	// Fallback to string conversion
	const errorMessage = String(error);
	
	if (isHtmlErrorResponse({ message: errorMessage })) {
		if (errorMessage.includes("522")) {
			return "Connection timed out - Supabase project may be paused";
		}
		if (errorMessage.includes("503")) {
			return "Service temporarily unavailable";
		}
		return "Database connection error - service may be unavailable";
	}

	if (errorMessage.length > 200) {
		return `${errorMessage.substring(0, 200)}...`;
	}

	return errorMessage;
}

/**
 * Log an error with appropriate handling for HTML responses
 */
export function logSupabaseError(
	error: unknown,
	context: string,
	options: {
		level?: "error" | "warn";
		silent?: boolean;
	} = {},
): void {
	const { level = "error", silent = false } = options;

	if (silent) return;

	const conciseMessage = getConciseErrorMessage(error, context);
	const logMessage = `[${context}] ${conciseMessage}`;

	if (level === "warn") {
		console.warn(logMessage);
	} else {
		console.error(logMessage);
	}

	// Only log full error details in development (skip HTML errors)
	if (process.env.NODE_ENV === "development" && !isHtmlErrorResponse(error)) {
		console.error("[Full Error Details]:", error);
	}
}
