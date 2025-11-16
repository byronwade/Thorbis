/**
 * HTTP Status Code Constants
 *
 * Centralized HTTP status codes to avoid magic numbers
 * and improve code readability.
 */

export const HTTP_STATUS = {
	// Success
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,

	// Client Errors
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	TOO_MANY_REQUESTS: 429,

	// Server Errors
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
} as const;

export const SEARCH_DEFAULTS = {
	LIMIT: 50,
	OFFSET: 0,
	MAX_RESULTS: 100,
} as const;

export const PAGINATION_DEFAULTS = {
	PAGE_SIZE: 20,
	MAX_PAGE_SIZE: 100,
	DEFAULT_PAGE: 1,
} as const;
