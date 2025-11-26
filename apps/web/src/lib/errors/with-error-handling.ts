/**
 * Error Handling Wrapper for Server Actions
 *
 * Provides consistent error handling, logging, and response formatting
 * for all Server Actions in the application.
 */

import { ZodError } from "zod";
import { ActionError, ERROR_CODES } from "./action-error";

// Re-export for convenience
export { ActionError, ERROR_CODES } from "./action-error";

/**
 * Standard Action Result Type
 *
 * All Server Actions should return this type for consistency
 */
export type ActionResult<T = void> =
	| {
			success: true;
			data: T;
			message?: string;
			error?: string;
	  }
	| {
			success: false;
			error: string;
			code?: string;
			details?: Record<string, any>;
	  };

/**
 * Wrap Server Action with Error Handling
 *
 * Automatically handles errors and returns a consistent ActionResult format.
 * Logs errors appropriately and provides detailed error information in development.
 *
 * @example
 * export async function createCustomer(data: CustomerInsert) {
 *   return withErrorHandling(async () => {
 *     const validated = customerInsertSchema.parse(data);
 *     const supabase = await createClient();
 *
 *     const { data: customer, error } = await supabase
 *       .from("customers")
 *       .insert(validated)
 *       .select()
 *       .single();
 *
 *     if (error) {
 *       throw new ActionError(error.message, ERROR_CODES.DB_QUERY_ERROR);
 *     }
 *
 *     return customer;
 *   });
 * }
 */
export async function withErrorHandling<T>(
	fn: () => Promise<T>,
): Promise<ActionResult<T>> {
	try {
		const data = await fn();
		return { success: true, data };
	} catch (error) {
		// Handle ActionError (our custom errors)
		if (error instanceof ActionError) {
			// Log authorization errors as warnings since they're expected in some cases
			// (e.g., user not part of a company, insufficient permissions)
			const isExpectedAuthError =
				error.code === ERROR_CODES.AUTH_FORBIDDEN ||
				error.code === ERROR_CODES.AUTH_UNAUTHORIZED;

			if (isExpectedAuthError) {
				// Only log in development, or as a warning
				if (process.env.NODE_ENV === "development") {
					console.debug(
						`[Auth] Expected auth error: ${error.code} - ${error.message}`,
					);
				}
			} else {
				console.error(`[Action Error] ${error.code}: ${error.message}`);
			}

			return {
				success: false,
				error: error.message,
				code: error.code,
				...(error.details && { details: error.details }),
			};
		}

		// Handle Zod validation errors
		if (error instanceof ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || "Validation failed",
				code: ERROR_CODES.VALIDATION_FAILED,
				details: {
					issues: error.issues.map((issue) => ({
						field: issue.path.join("."),
						message: issue.message,
					})),
				},
			};
		}

		// Handle standard JavaScript errors
		if (error instanceof Error) {
			return {
				success: false,
				error:
					process.env.NODE_ENV === "development"
						? error.message
						: "An unexpected error occurred",
				code: ERROR_CODES.INTERNAL_SERVER_ERROR,
			};
		}
		return {
			success: false,
			error: "An unexpected error occurred",
			code: ERROR_CODES.UNKNOWN_ERROR,
		};
	}
}

/**
 * Create a success result
 *
 * Helper to create consistent success responses
 */
function successResult<T>(data: T, message?: string): ActionResult<T> {
	return {
		success: true,
		data,
		...(message && { message }),
	};
}

/**
 * Create an error result
 *
 * Helper to create consistent error responses
 */
function errorResult(
	error: string,
	code?: string,
	details?: Record<string, any>,
): ActionResult<never> {
	return {
		success: false,
		error,
		...(code && { code }),
		...(details && { details }),
	};
}

/**
 * Assert Supabase client is available
 *
 * Helper to check if Supabase client exists and throw ActionError if not
 */
export function assertSupabase<T>(
	supabase: T | null | undefined,
): asserts supabase is T {
	if (!supabase) {
		throw new ActionError(
			"Database connection failed",
			ERROR_CODES.DB_CONNECTION_ERROR,
			500,
		);
	}
}

/**
 * Assert user is authenticated
 *
 * Helper to check authentication and throw ActionError if not authenticated
 */
export function assertAuthenticated(
	userId: string | undefined,
): asserts userId is string {
	if (!userId) {
		throw new ActionError(
			"You must be logged in to perform this action",
			ERROR_CODES.AUTH_UNAUTHORIZED,
			401,
		);
	}
}

/**
 * Assert resource exists
 *
 * Helper to check if resource exists and throw ActionError if not
 */
export function assertExists<T>(
	resource: T | null | undefined,
	resourceName: string,
): asserts resource is T {
	if (!resource) {
		throw new ActionError(
			`${resourceName} not found`,
			ERROR_CODES.DB_RECORD_NOT_FOUND,
			404,
		);
	}
}

/**
 * Assert user has permission
 *
 * Helper to check permissions and throw ActionError if not authorized
 */
function assertPermission(
	hasPermission: boolean,
	resourceName: string,
): asserts hasPermission {
	if (!hasPermission) {
		throw new ActionError(
			`You don't have permission to access this ${resourceName}`,
			ERROR_CODES.AUTH_FORBIDDEN,
			403,
		);
	}
}
