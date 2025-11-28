/**
 * API Error Handler Utilities
 *
 * Helpers for consistent error responses in API routes
 */

import { NextResponse } from "next/server";
import { ActionError, ERROR_CODES } from "./action-error";

// ============================================================================
// Error Response Helpers
// ============================================================================

/**
 * Create standardized error response for API routes
 */
export function createErrorResponse(
	message: string,
	status: number = 500,
	details?: Record<string, unknown>,
): NextResponse {
	return NextResponse.json(
		{
			success: false,
			error: message,
			...(details && { details }),
		},
		{ status },
	);
}

/**
 * Create success response for API routes
 */
export function createSuccessResponse<T>(
	data: T,
	status: number = 200,
): NextResponse {
	return NextResponse.json({ success: true, data }, { status });
}

/**
 * Handle error and return appropriate API response
 */
export function handleApiError(error: unknown): NextResponse {
	// Handle ActionError
	if (error instanceof ActionError) {
		const status =
			error.code === ERROR_CODES.AUTH_FORBIDDEN ||
			error.code === ERROR_CODES.AUTH_UNAUTHORIZED
				? 401
				: error.code === ERROR_CODES.VALIDATION_FAILED
					? 400
					: error.code === ERROR_CODES.NOT_FOUND
						? 404
						: 500;

		return createErrorResponse(error.message, status, error.details);
	}

	// Handle standard errors
	if (error instanceof Error) {
		return createErrorResponse(
			process.env.NODE_ENV === "development"
				? error.message
				: "An unexpected error occurred",
			500,
		);
	}

	// Handle unknown errors
	return createErrorResponse("An unexpected error occurred", 500);
}

