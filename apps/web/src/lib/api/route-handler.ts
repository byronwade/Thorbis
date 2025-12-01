/**
 * API Route Handler Framework
 *
 * Standardized API route handler that provides:
 * - Automatic authentication
 * - Company context retrieval
 * - Usage tracking integration
 * - Consistent error handling
 * - Request validation helpers
 *
 * Usage:
 * ```typescript
 * export const GET = createApiRouteHandler({
 *   auth: true,
 *   usageTracking: { apiName: "fbi_crime", endpointMap: FBI_CRIME_ENDPOINTS },
 *   handler: async ({ user, companyId, searchParams }) => {
 *     // Route logic here
 *   }
 * });
 * ```
 */

import { type NextRequest, NextResponse } from "next/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { withUsageTracking } from "@/lib/api/usage-tracking";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

// ============================================================================
// Types
// ============================================================================

export type RouteHandlerContext = {
	user: User;
	companyId: string;
	supabase: SupabaseClient;
	searchParams: URLSearchParams;
	request: NextRequest;
};

export type RouteHandler = (
	context: RouteHandlerContext,
) => Promise<Response | NextResponse>;

export type UsageTrackingConfig = {
	apiName: string;
	endpointMap: Record<string, string>;
	actionParam?: string; // Query param name for action (default: "action")
	costCents?: number;
	skipOnError?: boolean;
};

export type ApiRouteHandlerOptions = {
	/** Require authentication (default: true) */
	auth?: boolean;
	/** Usage tracking configuration */
	usageTracking?: UsageTrackingConfig;
	/** Custom error handler */
	onError?: (error: Error, context: RouteHandlerContext) => Response;
	/** Request handler */
	handler: RouteHandler;
};

// ============================================================================
// Route Handler Factory
// ============================================================================

/**
 * Create a standardized API route handler
 */
export function createApiRouteHandler(options: ApiRouteHandlerOptions) {
	const {
		auth = true,
		usageTracking,
		onError,
		handler,
	} = options;

	return async (request: NextRequest): Promise<Response> => {
		try {
			// Get Supabase client
			const supabase = await createClient();
			if (!supabase) {
				return NextResponse.json(
					{ error: "Database connection failed" },
					{ status: 500 },
				);
			}

			// Authenticate if required
			let user: User | null = null;
			if (auth) {
				const {
					data: { user: authUser },
				} = await supabase.auth.getUser();

				if (!authUser) {
					return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
				}

				user = authUser;
			}

			// Get company context if authenticated
			let companyId: string | null = null;
			if (auth && user) {
				companyId = await getActiveCompanyId();
				if (!companyId) {
					return NextResponse.json(
						{ error: "No active company selected" },
						{ status: 401 },
					);
				}
			}

			// Create handler context
			const context: RouteHandlerContext = {
				user: user!,
				companyId: companyId!,
				supabase,
				searchParams: request.nextUrl.searchParams,
				request,
			};

			// Execute handler with usage tracking if configured
			if (usageTracking && companyId) {
				const actionParam = usageTracking.actionParam || "action";
				const action = request.nextUrl.searchParams.get(actionParam) || "";
				const endpoint =
					usageTracking.endpointMap[action] || usageTracking.endpointMap[""];

				if (!endpoint) {
					return NextResponse.json(
						{ error: "Invalid action" },
						{ status: 400 },
					);
				}

				const result = await withUsageTracking(
					companyId,
					usageTracking.apiName,
					endpoint,
					async () => handler(context),
					{
						costCents: usageTracking.costCents,
						skipOnError: usageTracking.skipOnError,
					},
				);

				return result;
			}

			// Execute handler without usage tracking
			return await handler(context);
		} catch (error) {
			// Handle errors
			if (onError) {
				const supabase = await createClient();
				const user = supabase
					? (await supabase.auth.getUser()).data.user
					: null;
				const companyId = user ? await getActiveCompanyId() : null;

				if (supabase && user && companyId) {
					return onError(
						error instanceof Error ? error : new Error(String(error)),
						{
							user,
							companyId,
							supabase,
							searchParams: new URLSearchParams(),
							request,
						},
					);
				}
			}

			// Default error handling
			console.error("[API Route Handler] Error:", error);
			return NextResponse.json(
				{
					error:
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
				},
				{ status: 500 },
			);
		}
	};
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create error response
 */
export function createErrorResponse(
	message: string,
	status: number = 500,
	details?: Record<string, unknown>,
): NextResponse {
	return NextResponse.json(
		{
			error: message,
			...(details && { details }),
		},
		{ status },
	);
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
	data: T,
	status: number = 200,
): NextResponse {
	return NextResponse.json({ success: true, data }, { status });
}




