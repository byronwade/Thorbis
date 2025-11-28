/**
 * Internal API Call Tracking System
 *
 * Tracks ALL internal API route calls with:
 * - Request/response timing
 * - User and company identification
 * - Error capture with stack traces
 * - Trace ID propagation for request correlation
 * - Async logging (non-blocking)
 *
 * Usage:
 * ```typescript
 * // Wrap an API route handler
 * import { withApiTracking } from "@/lib/analytics/api-call-tracker";
 *
 * export const GET = withApiTracking(async (request) => {
 *   return NextResponse.json({ data: "hello" });
 * });
 *
 * // Or use the manual tracker
 * import { trackApiCall, startApiCall } from "@/lib/analytics/api-call-tracker";
 *
 * export async function GET(request: Request) {
 *   const tracker = startApiCall(request);
 *   try {
 *     const data = await fetchData();
 *     return tracker.success(NextResponse.json(data));
 *   } catch (error) {
 *     return tracker.error(error);
 *   }
 * }
 * ```
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Types
// ============================================

export interface ApiCallMetadata {
	traceId: string;
	endpoint: string;
	method: string;
	userId?: string | null;
	companyId?: string | null;
	requestSize?: number;
	userAgent?: string | null;
	ipAddress?: string | null;
	referer?: string | null;
}

export interface ApiCallResult {
	responseStatus: number;
	latencyMs: number;
	responseSize?: number;
	errorCode?: string | null;
	errorMessage?: string | null;
	errorStack?: string | null;
}

export interface ApiCallLogEntry extends ApiCallMetadata, ApiCallResult {
	createdAt: Date;
}

// Request context for trace ID propagation
const requestContext = new Map<
	string,
	{ traceId: string; startTime: number }
>();

// ============================================
// Core Functions
// ============================================

/**
 * Generate or retrieve trace ID for request correlation
 */
function getOrCreateTraceId(request: Request): string {
	// Check for existing trace ID in headers
	const existingTraceId = request.headers.get("x-trace-id");
	if (existingTraceId) return existingTraceId;

	// Generate new trace ID
	return uuidv4();
}

/**
 * Extract user and company info from request
 * Uses service client for reliable auth info extraction
 */
async function extractUserInfo(
	request: Request,
): Promise<{ userId: string | null; companyId: string | null }> {
	try {
		const supabase = await createClient();
		if (!supabase) return { userId: null, companyId: null };

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return { userId: null, companyId: null };

		// Get company ID from user metadata or company_users table
		const companyId =
			(user.user_metadata?.company_id as string) ||
			(user.app_metadata?.company_id as string) ||
			null;

		return { userId: user.id, companyId };
	} catch {
		return { userId: null, companyId: null };
	}
}

/**
 * Log API call to database (async, non-blocking)
 */
async function logApiCallToDatabase(entry: ApiCallLogEntry): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		const { error } = await supabase.rpc("log_api_call", {
			p_endpoint: entry.endpoint,
			p_method: entry.method,
			p_user_id: entry.userId || null,
			p_company_id: entry.companyId || null,
			p_response_status: entry.responseStatus,
			p_latency_ms: entry.latencyMs,
			p_request_size: entry.requestSize || 0,
			p_response_size: entry.responseSize || 0,
			p_ip_address: entry.ipAddress || null,
			p_user_agent: entry.userAgent || null,
			p_error_code: entry.errorCode || null,
			p_error_message: entry.errorMessage || null,
			p_trace_id: entry.traceId,
		});

		if (error) {
			console.error("[API Tracker] Failed to log API call:", error.message);
		}
	} catch (err) {
		// Don't throw - logging failures shouldn't break the main request
		console.error("[API Tracker] Logging error:", err);
	}
}

/**
 * Extract endpoint path from request URL
 */
function extractEndpoint(request: Request): string {
	try {
		const url = new URL(request.url);
		return url.pathname;
	} catch {
		return "unknown";
	}
}

/**
 * Get IP address from request headers
 */
function extractIpAddress(request: Request): string | null {
	return (
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		null
	);
}

// ============================================
// Manual Tracker API
// ============================================

/**
 * Start tracking an API call manually
 * Returns an object with success/error methods to complete tracking
 */
function startApiCall(request: Request) {
	const startTime = Date.now();
	const traceId = getOrCreateTraceId(request);
	const endpoint = extractEndpoint(request);
	const method = request.method;

	// Store context for potential nested tracking
	const contextKey = `${endpoint}-${startTime}`;
	requestContext.set(contextKey, { traceId, startTime });

	// Extract metadata synchronously
	const userAgent = request.headers.get("user-agent");
	const ipAddress = extractIpAddress(request);
	const referer = request.headers.get("referer");

	// Estimate request size from content-length
	const requestSize = parseInt(
		request.headers.get("content-length") || "0",
		10,
	);

	// Start async user info extraction
	const userInfoPromise = extractUserInfo(request);

	return {
		traceId,

		/**
		 * Mark the API call as successful
		 */
		success: async (response: NextResponse): Promise<NextResponse> => {
			const latencyMs = Date.now() - startTime;
			const { userId, companyId } = await userInfoPromise;

			// Add trace ID to response headers
			response.headers.set("x-trace-id", traceId);

			// Log asynchronously (don't await)
			logApiCallToDatabase({
				traceId,
				endpoint,
				method,
				userId,
				companyId,
				requestSize,
				userAgent,
				ipAddress,
				referer,
				responseStatus: response.status,
				latencyMs,
				responseSize: 0, // Would need to serialize to get size
				createdAt: new Date(),
			}).catch(() => {});

			// Cleanup context
			requestContext.delete(contextKey);

			return response;
		},

		/**
		 * Mark the API call as failed
		 */
		error: async (
			error: unknown,
			status: number = 500,
		): Promise<NextResponse> => {
			const latencyMs = Date.now() - startTime;
			const { userId, companyId } = await userInfoPromise;

			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			const errorStack = error instanceof Error ? error.stack : undefined;
			const errorCode =
				error instanceof Error ? error.name : "INTERNAL_SERVER_ERROR";

			// Log asynchronously (don't await)
			logApiCallToDatabase({
				traceId,
				endpoint,
				method,
				userId,
				companyId,
				requestSize,
				userAgent,
				ipAddress,
				referer,
				responseStatus: status,
				latencyMs,
				errorCode,
				errorMessage,
				errorStack,
				createdAt: new Date(),
			}).catch(() => {});

			// Cleanup context
			requestContext.delete(contextKey);

			// Return error response
			const response = NextResponse.json(
				{ error: errorMessage, traceId },
				{ status },
			);
			response.headers.set("x-trace-id", traceId);

			return response;
		},
	};
}

// ============================================
// HOC Wrapper
// ============================================

type RouteHandler = (
	request: NextRequest,
	context?: { params: Promise<Record<string, string>> },
) => Promise<NextResponse> | NextResponse;

/**
 * Higher-order function to wrap API route handlers with automatic tracking
 *
 * @example
 * export const GET = withApiTracking(async (request) => {
 *   const data = await fetchData();
 *   return NextResponse.json(data);
 * });
 */
function withApiTracking(handler: RouteHandler): RouteHandler {
	return async (request, context) => {
		const tracker = startApiCall(request);

		try {
			const response = await handler(request, context);
			return await tracker.success(response);
		} catch (error) {
			console.error("[API Error]", error);
			return await tracker.error(error);
		}
	};
}

// ============================================
// Batch Tracking for High-Frequency Endpoints
// ============================================

interface BatchEntry {
	entry: ApiCallLogEntry;
	timestamp: number;
}

class ApiCallBatcher {
	private batch: BatchEntry[] = [];
	private flushInterval: NodeJS.Timeout | null = null;
	private readonly maxBatchSize = 100;
	private readonly flushIntervalMs = 5000; // 5 seconds

	constructor() {
		this.startFlushInterval();
	}

	add(entry: ApiCallLogEntry) {
		this.batch.push({ entry, timestamp: Date.now() });

		// Flush immediately if batch is full
		if (this.batch.length >= this.maxBatchSize) {
			this.flush();
		}
	}

	private startFlushInterval() {
		if (typeof window === "undefined") {
			// Server-side: use setInterval
			this.flushInterval = setInterval(() => {
				this.flush();
			}, this.flushIntervalMs);
		}
	}

	async flush() {
		if (this.batch.length === 0) return;

		const entries = [...this.batch];
		this.batch = [];

		try {
			const supabase = await createServiceSupabaseClient();
			if (!supabase) return;

			// Insert all entries in a single transaction
			const { error } = await supabase.from("api_call_logs").insert(
				entries.map(({ entry }) => ({
					trace_id: entry.traceId,
					endpoint: entry.endpoint,
					method: entry.method,
					user_id: entry.userId,
					company_id: entry.companyId,
					response_status: entry.responseStatus,
					latency_ms: entry.latencyMs,
					request_size_bytes: entry.requestSize || 0,
					response_size_bytes: entry.responseSize || 0,
					user_agent: entry.userAgent,
					ip_address: entry.ipAddress,
					referer: entry.referer,
					error_code: entry.errorCode,
					error_message: entry.errorMessage,
					created_at: entry.createdAt.toISOString(),
				})),
			);

			if (error) {
				console.error("[API Tracker] Batch insert failed:", error.message);
			}
		} catch (err) {
			console.error("[API Tracker] Batch flush error:", err);
		}
	}

	stop() {
		if (this.flushInterval) {
			clearInterval(this.flushInterval);
			this.flushInterval = null;
		}
		// Final flush
		this.flush();
	}
}

// Singleton batcher instance
let batcher: ApiCallBatcher | null = null;

function getBatcher(): ApiCallBatcher {
	if (!batcher) {
		batcher = new ApiCallBatcher();
	}
	return batcher;
}

/**
 * Log API call using batched writes (for high-frequency endpoints)
 * Useful for endpoints like health checks that are called frequently
 */
function logApiCallBatched(entry: ApiCallLogEntry): void {
	getBatcher().add(entry);
}

// ============================================
// Query Functions
// ============================================

/**
 * Get API call statistics for a company
 */
export async function getApiCallStats(
	companyId: string,
	hours: number = 24,
): Promise<
	{
		endpoint: string;
		total_calls: number;
		success_count: number;
		error_count: number;
		avg_latency_ms: number;
		p95_latency_ms: number;
		error_rate: number;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase.rpc("get_api_call_stats", {
			p_company_id: companyId,
			p_hours: hours,
		});

		if (error) {
			console.error("[API Tracker] Failed to get stats:", error.message);
			return [];
		}

		return data || [];
	} catch (err) {
		console.error("[API Tracker] Stats query error:", err);
		return [];
	}
}

/**
 * Get recent API calls for debugging
 */
async function getRecentApiCalls(
	companyId: string,
	limit: number = 50,
): Promise<ApiCallLogEntry[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("api_call_logs")
			.select("*")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("[API Tracker] Failed to get recent calls:", error.message);
			return [];
		}

		return (data || []).map((row) => ({
			traceId: row.trace_id,
			endpoint: row.endpoint,
			method: row.method,
			userId: row.user_id,
			companyId: row.company_id,
			requestSize: row.request_size,
			userAgent: row.user_agent,
			ipAddress: row.ip_address,
			referer: row.referer,
			responseStatus: row.response_status,
			latencyMs: row.latency_ms,
			responseSize: row.response_size,
			errorCode: row.error_code,
			errorMessage: row.error_message,
			errorStack: row.error_stack,
			createdAt: new Date(row.created_at),
		}));
	} catch (err) {
		console.error("[API Tracker] Recent calls query error:", err);
		return [];
	}
}

/**
 * Get slow API calls (for performance monitoring)
 */
export async function getSlowApiCalls(
	companyId: string,
	thresholdMs: number = 1000,
	limit: number = 20,
): Promise<ApiCallLogEntry[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("api_call_logs")
			.select("*")
			.eq("company_id", companyId)
			.gte("latency_ms", thresholdMs)
			.order("latency_ms", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("[API Tracker] Failed to get slow calls:", error.message);
			return [];
		}

		return (data || []).map((row) => ({
			traceId: row.trace_id,
			endpoint: row.endpoint,
			method: row.method,
			userId: row.user_id,
			companyId: row.company_id,
			requestSize: row.request_size,
			userAgent: row.user_agent,
			ipAddress: row.ip_address,
			referer: row.referer,
			responseStatus: row.response_status,
			latencyMs: row.latency_ms,
			responseSize: row.response_size,
			errorCode: row.error_code,
			errorMessage: row.error_message,
			errorStack: row.error_stack,
			createdAt: new Date(row.created_at),
		}));
	} catch (err) {
		console.error("[API Tracker] Slow calls query error:", err);
		return [];
	}
}

/**
 * Get API error rates by endpoint
 */
async function getApiErrorRates(
	companyId: string,
	hours: number = 24,
): Promise<
	{
		endpoint: string;
		total_calls: number;
		error_count: number;
		error_rate: number;
		common_errors: string[];
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase.rpc("get_api_error_rates", {
			p_company_id: companyId,
			p_hours: hours,
		});

		if (error) {
			console.error("[API Tracker] Failed to get error rates:", error.message);
			return [];
		}

		return data || [];
	} catch (err) {
		console.error("[API Tracker] Error rates query error:", err);
		return [];
	}
}

// ============================================
// Exports
// ============================================

export default {
	withApiTracking,
	startApiCall,
	getOrCreateTraceId,
	getApiCallStats,
	getRecentApiCalls,
	getSlowApiCalls,
	getApiErrorRates,
	logApiCallBatched,
};
