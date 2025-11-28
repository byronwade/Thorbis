/**
 * Server Action Instrumentation Wrapper
 *
 * Tracks ALL server action executions with:
 * - Execution timing and duration
 * - User and company identification
 * - Input entity tracking (what was acted upon)
 * - Error capture with categorization
 * - Trace ID propagation for request correlation
 * - Async logging (non-blocking)
 *
 * Usage:
 * ```typescript
 * // Option 1: Wrap entire action with automatic tracking
 * import { withActionTracking } from "@/lib/analytics/action-tracker";
 *
 * export const createJob = withActionTracking(
 *   "jobs",
 *   async (formData: FormData) => {
 *     const job = await insertJob(formData);
 *     return { success: true, data: job };
 *   },
 *   { entityType: "job" }
 * );
 *
 * // Option 2: Manual tracking for complex actions
 * import { startActionExecution } from "@/lib/analytics/action-tracker";
 *
 * export async function updateJobStatus(jobId: string, status: string) {
 *   const tracker = await startActionExecution("updateJobStatus", "jobs", {
 *     entityType: "job",
 *     entityId: jobId,
 *   });
 *
 *   try {
 *     const result = await updateJob(jobId, { status });
 *     await tracker.success({ affectedCount: 1 });
 *     return result;
 *   } catch (error) {
 *     await tracker.error(error);
 *     throw error;
 *   }
 * }
 * ```
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Types
// ============================================

export type ActionCategory =
	| "jobs"
	| "invoices"
	| "estimates"
	| "payments"
	| "customers"
	| "properties"
	| "equipment"
	| "materials"
	| "contracts"
	| "appointments"
	| "team"
	| "vendors"
	| "communications"
	| "settings"
	| "auth"
	| "onboarding"
	| "reports"
	| "ai"
	| "other";

export interface ActionTrackingOptions {
	/** Type of entity being acted upon */
	entityType?: string;
	/** ID of the entity being acted upon */
	entityId?: string;
	/** Skip tracking for this action */
	skipTracking?: boolean;
	/** Custom trace ID (for correlation with API calls) */
	traceId?: string;
}

export interface ActionSuccessMetadata {
	/** Number of records affected by this action */
	affectedCount?: number;
	/** ID of created/updated entity */
	resultEntityId?: string;
	/** Additional metadata to log */
	metadata?: Record<string, unknown>;
}

export interface ActionExecutionLog {
	traceId: string;
	actionName: string;
	actionCategory: ActionCategory;
	userId: string | null;
	companyId: string | null;
	success: boolean;
	durationMs: number;
	inputEntityType: string | null;
	inputEntityId: string | null;
	affectedRecordsCount: number;
	errorType: string | null;
	errorMessage: string | null;
	errorStack: string | null;
	createdAt: Date;
}

// ============================================
// Core Functions
// ============================================

/**
 * Extract user and company info for action tracking
 */
async function extractUserContext(): Promise<{
	userId: string | null;
	companyId: string | null;
}> {
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
 * Get trace ID from headers (propagated from API call tracker)
 * Uses dynamic import to avoid bundling issues with client components
 */
async function getTraceIdFromHeaders(): Promise<string | null> {
	try {
		// Dynamic import to avoid client bundling issues
		const { headers } = await import("next/headers");
		const headersList = await headers();
		return headersList.get("x-trace-id");
	} catch {
		return null;
	}
}

/**
 * Log action execution to database (async, non-blocking)
 */
async function logActionToDatabase(entry: ActionExecutionLog): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		// Type assertion needed because RPC function may not be in generated types yet
		const { error } = await (supabase.rpc as any)("log_action_execution", {
			p_action_name: entry.actionName,
			p_action_category: entry.actionCategory,
			p_user_id: entry.userId,
			p_company_id: entry.companyId,
			p_success: entry.success,
			p_duration_ms: entry.durationMs,
			p_entity_type: entry.inputEntityType,
			p_entity_id: entry.inputEntityId,
			p_affected_count: entry.affectedRecordsCount,
			p_error_type: entry.errorType,
			p_error_message: entry.errorMessage,
			p_trace_id: entry.traceId,
		});

		if (error) {
			console.error("[Action Tracker] Failed to log action:", error.message);
		}
	} catch (err) {
		// Don't throw - logging failures shouldn't break the main action
		console.error("[Action Tracker] Logging error:", err);
	}
}

// ============================================
// Manual Tracker API
// ============================================

/**
 * Start tracking a server action execution manually
 * Returns an object with success/error methods to complete tracking
 */
async function startActionExecution(
	actionName: string,
	category: ActionCategory,
	options: ActionTrackingOptions = {},
) {
	const startTime = Date.now();

	// Get trace ID from headers or options or generate new
	const existingTraceId = await getTraceIdFromHeaders();
	const traceId = options.traceId || existingTraceId || uuidv4();

	// Extract user context
	const userContext = await extractUserContext();

	return {
		traceId,

		/**
		 * Mark the action as successful
		 */
		success: async (metadata?: ActionSuccessMetadata): Promise<void> => {
			if (options.skipTracking) return;

			const durationMs = Date.now() - startTime;

			// Log asynchronously (don't await)
			logActionToDatabase({
				traceId,
				actionName,
				actionCategory: category,
				userId: userContext.userId,
				companyId: userContext.companyId,
				success: true,
				durationMs,
				inputEntityType: options.entityType || null,
				inputEntityId: options.entityId || null,
				affectedRecordsCount: metadata?.affectedCount || 1,
				errorType: null,
				errorMessage: null,
				errorStack: null,
				createdAt: new Date(),
			}).catch(() => {});
		},

		/**
		 * Mark the action as failed
		 */
		error: async (error: unknown): Promise<void> => {
			if (options.skipTracking) return;

			const durationMs = Date.now() - startTime;

			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			const errorStack = error instanceof Error ? error.stack : undefined;
			const errorType = error instanceof Error ? error.name : "UnknownError";

			// Log asynchronously (don't await)
			logActionToDatabase({
				traceId,
				actionName,
				actionCategory: category,
				userId: userContext.userId,
				companyId: userContext.companyId,
				success: false,
				durationMs,
				inputEntityType: options.entityType || null,
				inputEntityId: options.entityId || null,
				affectedRecordsCount: 0,
				errorType,
				errorMessage,
				errorStack: errorStack || null,
				createdAt: new Date(),
			}).catch(() => {});
		},
	};
}

// ============================================
// HOC Wrapper
// ============================================

type ActionResult<T> =
	| { success: true; data?: T; error?: never }
	| { success: false; error: string; data?: never };

type ServerAction<TInput, TOutput> = (
	input: TInput,
) => Promise<ActionResult<TOutput>>;

/**
 * Higher-order function to wrap server actions with automatic tracking
 *
 * @example
 * export const createJob = withActionTracking(
 *   "jobs",
 *   async (formData: FormData) => {
 *     const job = await insertJob(formData);
 *     return { success: true, data: job };
 *   },
 *   { entityType: "job" }
 * );
 */
function withActionTracking<TInput, TOutput>(
	category: ActionCategory,
	action: ServerAction<TInput, TOutput>,
	options: Omit<ActionTrackingOptions, "entityId"> = {},
): ServerAction<TInput, TOutput> {
	// Infer action name from function name or generate one
	const actionName = action.name || `${category}_action`;

	return async (input: TInput): Promise<ActionResult<TOutput>> => {
		const tracker = await startActionExecution(actionName, category, options);

		try {
			const result = await action(input);

			if (result.success) {
				await tracker.success();
			} else {
				await tracker.error(new Error(result.error || "Action failed"));
			}

			return result;
		} catch (error) {
			console.error(`[Action Error] ${actionName}:`, error);
			await tracker.error(error);

			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	};
}

/**
 * Create a tracked action wrapper for a specific category
 * Useful for creating category-specific wrappers
 *
 * @example
 * const withJobsTracking = createCategoryTracker("jobs");
 *
 * export const createJob = withJobsTracking(async (formData) => {
 *   const job = await insertJob(formData);
 *   return { success: true, data: job };
 * }, { entityType: "job" });
 */
function createCategoryTracker(category: ActionCategory) {
	return <TInput, TOutput>(
		action: ServerAction<TInput, TOutput>,
		options?: Omit<ActionTrackingOptions, "entityId">,
	): ServerAction<TInput, TOutput> => {
		return withActionTracking(category, action, options);
	};
}

// Pre-configured category trackers for common action types
const withJobsTracking = createCategoryTracker("jobs");
const withInvoicesTracking = createCategoryTracker("invoices");
const withEstimatesTracking = createCategoryTracker("estimates");
const withPaymentsTracking = createCategoryTracker("payments");
const withCustomersTracking = createCategoryTracker("customers");
const withPropertiesTracking = createCategoryTracker("properties");
const withEquipmentTracking = createCategoryTracker("equipment");
const withContractsTracking = createCategoryTracker("contracts");
const withTeamTracking = createCategoryTracker("team");
const withCommunicationsTracking =
	createCategoryTracker("communications");
const withSettingsTracking = createCategoryTracker("settings");
const withAuthTracking = createCategoryTracker("auth");
const withAITracking = createCategoryTracker("ai");

// ============================================
// Query Functions
// ============================================

/**
 * Get action execution statistics for a company
 */
export async function getActionStats(
	companyId: string,
	hours: number = 24,
): Promise<
	{
		action_name: string;
		action_category: string;
		total_executions: number;
		success_count: number;
		failure_count: number;
		avg_duration_ms: number;
		success_rate: number;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		// Type assertion needed because RPC function may not be in generated types yet
		const { data, error } = await (supabase.rpc as any)("get_action_stats", {
			p_company_id: companyId,
			p_hours: hours,
		});

		if (error) {
			console.error("[Action Tracker] Failed to get stats:", error.message);
			return [];
		}

		return data || [];
	} catch (err) {
		console.error("[Action Tracker] Stats query error:", err);
		return [];
	}
}

/**
 * Get recent action executions for debugging
 */
async function getRecentActions(
	companyId: string,
	limit: number = 50,
): Promise<ActionExecutionLog[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		// Type assertion to avoid excessive type instantiation depth
		const { data, error } = await (supabase as any)
			.from("action_executions")
			.select("*")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error(
				"[Action Tracker] Failed to get recent actions:",
				error.message,
			);
			return [];
		}

		return (data || []).map((row: any) => ({
			traceId: row.trace_id,
			actionName: row.action_name,
			actionCategory: row.action_category as ActionCategory,
			userId: row.user_id,
			companyId: row.company_id,
			success: row.success,
			durationMs: row.duration_ms,
			inputEntityType: row.input_entity_type,
			inputEntityId: row.input_entity_id,
			affectedRecordsCount: row.affected_records_count,
			errorType: row.error_type,
			errorMessage: row.error_message,
			errorStack: row.error_stack,
			createdAt: new Date(row.created_at),
		}));
	} catch (err) {
		console.error("[Action Tracker] Recent actions query error:", err);
		return [];
	}
}

/**
 * Get failed actions for error monitoring
 */
export async function getFailedActions(
	companyId: string,
	hours: number = 24,
	limit: number = 50,
): Promise<ActionExecutionLog[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

		// Type assertion to avoid excessive type instantiation depth
		const { data, error } = await (supabase as any)
			.from("action_executions")
			.select("*")
			.eq("company_id", companyId)
			.eq("success", false)
			.gte("created_at", cutoff)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error(
				"[Action Tracker] Failed to get failed actions:",
				error.message,
			);
			return [];
		}

		return (data || []).map((row: any) => ({
			traceId: row.trace_id,
			actionName: row.action_name,
			actionCategory: row.action_category as ActionCategory,
			userId: row.user_id,
			companyId: row.company_id,
			success: row.success,
			durationMs: row.duration_ms,
			inputEntityType: row.input_entity_type,
			inputEntityId: row.input_entity_id,
			affectedRecordsCount: row.affected_records_count,
			errorType: row.error_type,
			errorMessage: row.error_message,
			errorStack: row.error_stack,
			createdAt: new Date(row.created_at),
		}));
	} catch (err) {
		console.error("[Action Tracker] Failed actions query error:", err);
		return [];
	}
}

/**
 * Get slow actions for performance monitoring
 */
async function getSlowActions(
	companyId: string,
	thresholdMs: number = 2000,
	limit: number = 20,
): Promise<ActionExecutionLog[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		// Type assertion to avoid excessive type instantiation depth
		const { data, error } = await (supabase as any)
			.from("action_executions")
			.select("*")
			.eq("company_id", companyId)
			.gte("duration_ms", thresholdMs)
			.order("duration_ms", { ascending: false })
			.limit(limit);

		if (error) {
			console.error(
				"[Action Tracker] Failed to get slow actions:",
				error.message,
			);
			return [];
		}

		return (data || []).map((row: any) => ({
			traceId: row.trace_id,
			actionName: row.action_name,
			actionCategory: row.action_category as ActionCategory,
			userId: row.user_id,
			companyId: row.company_id,
			success: row.success,
			durationMs: row.duration_ms,
			inputEntityType: row.input_entity_type,
			inputEntityId: row.input_entity_id,
			affectedRecordsCount: row.affected_records_count,
			errorType: row.error_type,
			errorMessage: row.error_message,
			errorStack: row.error_stack,
			createdAt: new Date(row.created_at),
		}));
	} catch (err) {
		console.error("[Action Tracker] Slow actions query error:", err);
		return [];
	}
}

/**
 * Get action volume by category over time
 */
export async function getActionVolumeByCategory(
	companyId: string,
	days: number = 7,
): Promise<
	{
		category: string;
		date: string;
		total: number;
		success: number;
		failed: number;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const cutoff = new Date(
			Date.now() - days * 24 * 60 * 60 * 1000,
		).toISOString();

		// Type assertion to avoid excessive type instantiation depth
		const { data, error } = await (supabase as any)
			.from("action_executions")
			.select("action_category, created_at, success")
			.eq("company_id", companyId)
			.gte("created_at", cutoff);

		if (error) {
			console.error(
				"[Action Tracker] Failed to get volume by category:",
				error.message,
			);
			return [];
		}

		// Group by category and date
		const grouped = new Map<
			string,
			{ total: number; success: number; failed: number }
		>();

		for (const row of data || []) {
			const date = new Date(row.created_at).toISOString().split("T")[0];
			const key = `${row.action_category}-${date}`;

			const existing = grouped.get(key) || {
				total: 0,
				success: 0,
				failed: 0,
			};
			existing.total++;
			if (row.success) {
				existing.success++;
			} else {
				existing.failed++;
			}
			grouped.set(key, existing);
		}

		return Array.from(grouped.entries()).map(([key, value]) => {
			const [category, date] = key.split("-");
			return { category, date, ...value };
		});
	} catch (err) {
		console.error("[Action Tracker] Volume by category query error:", err);
		return [];
	}
}

// ============================================
// Exports
// ============================================

export default {
	withActionTracking,
	startActionExecution,
	createCategoryTracker,
	getActionStats,
	getRecentActions,
	getFailedActions,
	getSlowActions,
	getActionVolumeByCategory,
};
