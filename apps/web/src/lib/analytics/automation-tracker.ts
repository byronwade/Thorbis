/**
 * Automation Usage Tracking
 *
 * Tracks Vercel serverless function executions and background jobs for billing.
 * Provider cost: $3/month per unit (~100K invocations)
 * Customer price: $9/month per unit (3x markup)
 *
 * Usage:
 * ```typescript
 * import { trackAutomationExecution, getAutomationUsage } from "@/lib/analytics/automation-tracker";
 *
 * // Track a function execution
 * await trackAutomationExecution({
 *   companyId: "uuid",
 *   executionType: "cron_job",
 *   functionName: "daily-report-generator",
 *   durationMs: 1500,
 * });
 *
 * // Get monthly usage
 * const usage = await getAutomationUsage(companyId, "2024-11");
 * ```
 */

import { AUTOMATION_PRICING } from "@/lib/billing/pricing";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Types
// ============================================

export type AutomationExecutionType =
	| "cron_job" // Scheduled tasks
	| "webhook" // Incoming webhooks
	| "background_job" // Async processing
	| "api_route" // API route handler
	| "edge_function" // Edge function
	| "realtime_handler" // Real-time event handler
	| "email_handler" // Email processing
	| "sms_handler" // SMS processing
	| "integration_sync" // Third-party integration sync
	| "report_generation" // Report generation
	| "bulk_operation" // Bulk data operations
	| "other";

export interface AutomationExecutionParams {
	companyId: string;
	executionType: AutomationExecutionType;
	functionName: string;
	durationMs: number;
	success?: boolean;
	errorMessage?: string;
	inputSize?: number; // Bytes
	outputSize?: number; // Bytes
	metadata?: Record<string, unknown>;
	traceId?: string;
}

export interface AutomationUsageSummary {
	companyId: string;
	monthYear: string;
	totalExecutions: number;
	totalDurationMs: number;
	avgDurationMs: number;
	successCount: number;
	errorCount: number;
	successRate: number;
	executionsByType: Record<string, number>;
	automationUnits: number; // Based on 100K invocations per unit
	providerCostCents: number;
	customerPriceCents: number;
}

// ============================================
// Cost Calculation
// ============================================

/**
 * Calculate automation units and costs
 * 1 unit = 100,000 invocations
 */
export function calculateAutomationCost(executions: number): {
	units: number;
	providerCostCents: number;
	customerPriceCents: number;
} {
	// Calculate units (round up to nearest 0.01)
	const units = Math.ceil((executions / AUTOMATION_PRICING.invocationsPerUnit) * 100) / 100;

	return {
		units,
		providerCostCents: Math.round(units * AUTOMATION_PRICING.providerCostPerMonth),
		customerPriceCents: Math.round(units * AUTOMATION_PRICING.customerPricePerMonth),
	};
}

// ============================================
// Tracking Functions
// ============================================

/**
 * Track an automation/function execution
 */
async function trackAutomationExecution(
	params: AutomationExecutionParams,
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		const now = new Date();
		const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

		const { error } = await supabase.from("automation_executions").insert({
			id: params.traceId || uuidv4(),
			company_id: params.companyId,
			month_year: monthYear,
			execution_type: params.executionType,
			function_name: params.functionName,
			duration_ms: params.durationMs,
			success: params.success ?? true,
			error_message: params.errorMessage || null,
			input_size_bytes: params.inputSize || 0,
			output_size_bytes: params.outputSize || 0,
			metadata: params.metadata || null,
			created_at: now.toISOString(),
		});

		if (error && !error.message.includes("does not exist")) {
			console.error("[Automation Tracker] Failed to log execution:", error.message);
		}

		// Also update the monthly aggregate
		await updateMonthlyAggregate(params.companyId, monthYear, params);
	} catch (err) {
		console.error("[Automation Tracker] Logging error:", err);
	}
}

/**
 * Update monthly aggregate for faster billing queries
 */
async function updateMonthlyAggregate(
	companyId: string,
	monthYear: string,
	params: AutomationExecutionParams,
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		// Use atomic increment via RPC or upsert with increment
		const { data: existing } = await supabase
			.from("automation_usage_monthly")
			.select("*")
			.eq("company_id", companyId)
			.eq("month_year", monthYear)
			.single();

		if (existing) {
			// Update existing record
			const newTotalExecutions = (existing.total_executions || 0) + 1;
			const newTotalDurationMs = (existing.total_duration_ms || 0) + params.durationMs;
			const newSuccessCount =
				(existing.success_count || 0) + (params.success !== false ? 1 : 0);
			const newErrorCount =
				(existing.error_count || 0) + (params.success === false ? 1 : 0);

			// Update execution type counts
			const executionsByType = existing.executions_by_type || {};
			executionsByType[params.executionType] =
				(executionsByType[params.executionType] || 0) + 1;

			const costs = calculateAutomationCost(newTotalExecutions);

			await supabase
				.from("automation_usage_monthly")
				.update({
					total_executions: newTotalExecutions,
					total_duration_ms: newTotalDurationMs,
					success_count: newSuccessCount,
					error_count: newErrorCount,
					executions_by_type: executionsByType,
					automation_units: costs.units,
					provider_cost_cents: costs.providerCostCents,
					customer_price_cents: costs.customerPriceCents,
					updated_at: new Date().toISOString(),
				})
				.eq("company_id", companyId)
				.eq("month_year", monthYear);
		} else {
			// Insert new record
			const costs = calculateAutomationCost(1);

			await supabase.from("automation_usage_monthly").insert({
				company_id: companyId,
				month_year: monthYear,
				total_executions: 1,
				total_duration_ms: params.durationMs,
				success_count: params.success !== false ? 1 : 0,
				error_count: params.success === false ? 1 : 0,
				executions_by_type: { [params.executionType]: 1 },
				automation_units: costs.units,
				provider_cost_cents: costs.providerCostCents,
				customer_price_cents: costs.customerPriceCents,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			});
		}
	} catch (err) {
		// Silently fail - individual executions are still tracked
		console.error("[Automation Tracker] Aggregate update error:", err);
	}
}

/**
 * Batch track multiple executions (more efficient for high-volume)
 */
async function trackAutomationExecutionsBatch(
	executions: AutomationExecutionParams[],
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		const now = new Date();
		const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

		const records = executions.map((params) => ({
			id: params.traceId || uuidv4(),
			company_id: params.companyId,
			month_year: monthYear,
			execution_type: params.executionType,
			function_name: params.functionName,
			duration_ms: params.durationMs,
			success: params.success ?? true,
			error_message: params.errorMessage || null,
			input_size_bytes: params.inputSize || 0,
			output_size_bytes: params.outputSize || 0,
			metadata: params.metadata || null,
			created_at: now.toISOString(),
		}));

		const { error } = await supabase.from("automation_executions").insert(records);

		if (error && !error.message.includes("does not exist")) {
			console.error("[Automation Tracker] Batch insert failed:", error.message);
		}
	} catch (err) {
		console.error("[Automation Tracker] Batch logging error:", err);
	}
}

// ============================================
// Query Functions
// ============================================

/**
 * Get automation usage summary for a month
 */
async function getAutomationUsage(
	companyId: string,
	monthYear?: string, // Format: "2024-11", defaults to current month
): Promise<AutomationUsageSummary> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		return createEmptySummary(companyId, monthYear || getCurrentMonthYear());
	}

	const targetMonth = monthYear || getCurrentMonthYear();

	try {
		// Try to get from monthly aggregate first (faster)
		const { data: aggregate, error: aggError } = await supabase
			.from("automation_usage_monthly")
			.select("*")
			.eq("company_id", companyId)
			.eq("month_year", targetMonth)
			.single();

		if (aggregate && !aggError) {
			return {
				companyId,
				monthYear: targetMonth,
				totalExecutions: aggregate.total_executions || 0,
				totalDurationMs: aggregate.total_duration_ms || 0,
				avgDurationMs:
					aggregate.total_executions > 0
						? Math.round(aggregate.total_duration_ms / aggregate.total_executions)
						: 0,
				successCount: aggregate.success_count || 0,
				errorCount: aggregate.error_count || 0,
				successRate:
					aggregate.total_executions > 0
						? Math.round(
								(aggregate.success_count / aggregate.total_executions) * 100,
							)
						: 0,
				executionsByType: aggregate.executions_by_type || {},
				automationUnits: aggregate.automation_units || 0,
				providerCostCents: aggregate.provider_cost_cents || 0,
				customerPriceCents: aggregate.customer_price_cents || 0,
			};
		}

		// Fall back to querying individual executions
		const { data: executions, error } = await supabase
			.from("automation_executions")
			.select("execution_type, duration_ms, success")
			.eq("company_id", companyId)
			.eq("month_year", targetMonth);

		if (error) {
			console.error("[Automation Tracker] Query failed:", error.message);
			return createEmptySummary(companyId, targetMonth);
		}

		if (!executions || executions.length === 0) {
			return createEmptySummary(companyId, targetMonth);
		}

		// Calculate summary
		const summary = {
			totalExecutions: executions.length,
			totalDurationMs: 0,
			successCount: 0,
			executionsByType: {} as Record<string, number>,
		};

		for (const exec of executions) {
			summary.totalDurationMs += exec.duration_ms || 0;
			if (exec.success) summary.successCount++;

			const type = exec.execution_type || "other";
			summary.executionsByType[type] = (summary.executionsByType[type] || 0) + 1;
		}

		const costs = calculateAutomationCost(summary.totalExecutions);

		return {
			companyId,
			monthYear: targetMonth,
			totalExecutions: summary.totalExecutions,
			totalDurationMs: summary.totalDurationMs,
			avgDurationMs: Math.round(summary.totalDurationMs / summary.totalExecutions),
			successCount: summary.successCount,
			errorCount: summary.totalExecutions - summary.successCount,
			successRate: Math.round((summary.successCount / summary.totalExecutions) * 100),
			executionsByType: summary.executionsByType,
			automationUnits: costs.units,
			providerCostCents: costs.providerCostCents,
			customerPriceCents: costs.customerPriceCents,
		};
	} catch (err) {
		console.error("[Automation Tracker] Usage query error:", err);
		return createEmptySummary(companyId, targetMonth);
	}
}

/**
 * Get automation usage trend over multiple months
 */
async function getAutomationUsageTrend(
	companyId: string,
	months: number = 6,
): Promise<
	{
		monthYear: string;
		totalExecutions: number;
		automationUnits: number;
		customerPriceCents: number;
	}[]
> {
	const results: {
		monthYear: string;
		totalExecutions: number;
		automationUnits: number;
		customerPriceCents: number;
	}[] = [];

	const now = new Date();
	for (let i = months - 1; i >= 0; i--) {
		const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

		const usage = await getAutomationUsage(companyId, monthYear);
		results.push({
			monthYear,
			totalExecutions: usage.totalExecutions,
			automationUnits: usage.automationUnits,
			customerPriceCents: usage.customerPriceCents,
		});
	}

	return results;
}

/**
 * Get top functions by execution count
 */
async function getTopFunctions(
	companyId: string,
	monthYear?: string,
	limit: number = 10,
): Promise<
	{
		functionName: string;
		executionType: string;
		count: number;
		avgDurationMs: number;
		errorRate: number;
	}[]
> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) return [];

	const targetMonth = monthYear || getCurrentMonthYear();

	try {
		const { data, error } = await supabase
			.from("automation_executions")
			.select("function_name, execution_type, duration_ms, success")
			.eq("company_id", companyId)
			.eq("month_year", targetMonth);

		if (error || !data) {
			return [];
		}

		// Aggregate by function name
		const functionMap = new Map<
			string,
			{
				executionType: string;
				count: number;
				totalDuration: number;
				errorCount: number;
			}
		>();

		for (const exec of data) {
			const key = exec.function_name;
			const existing = functionMap.get(key) || {
				executionType: exec.execution_type,
				count: 0,
				totalDuration: 0,
				errorCount: 0,
			};

			existing.count++;
			existing.totalDuration += exec.duration_ms || 0;
			if (!exec.success) existing.errorCount++;

			functionMap.set(key, existing);
		}

		return Array.from(functionMap.entries())
			.map(([functionName, stats]) => ({
				functionName,
				executionType: stats.executionType,
				count: stats.count,
				avgDurationMs: Math.round(stats.totalDuration / stats.count),
				errorRate: Math.round((stats.errorCount / stats.count) * 100),
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit);
	} catch (err) {
		console.error("[Automation Tracker] Top functions query error:", err);
		return [];
	}
}

// ============================================
// Helper Functions
// ============================================

function getCurrentMonthYear(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function createEmptySummary(
	companyId: string,
	monthYear: string,
): AutomationUsageSummary {
	return {
		companyId,
		monthYear,
		totalExecutions: 0,
		totalDurationMs: 0,
		avgDurationMs: 0,
		successCount: 0,
		errorCount: 0,
		successRate: 0,
		executionsByType: {},
		automationUnits: 0,
		providerCostCents: 0,
		customerPriceCents: 0,
	};
}

// ============================================
// Wrapper for tracking function executions
// ============================================

/**
 * Wrap a function to automatically track its execution
 */
function withAutomationTracking<T>(
	companyId: string,
	functionName: string,
	executionType: AutomationExecutionType,
	fn: () => Promise<T>,
): Promise<T> {
	const startTime = Date.now();

	return fn()
		.then(async (result) => {
			const durationMs = Date.now() - startTime;
			await trackAutomationExecution({
				companyId,
				executionType,
				functionName,
				durationMs,
				success: true,
			});
			return result;
		})
		.catch(async (error) => {
			const durationMs = Date.now() - startTime;
			await trackAutomationExecution({
				companyId,
				executionType,
				functionName,
				durationMs,
				success: false,
				errorMessage: error instanceof Error ? error.message : "Unknown error",
			});
			throw error;
		});
}

// ============================================
// Exports
// ============================================

export default {
	trackAutomationExecution,
	trackAutomationExecutionsBatch,
	getAutomationUsage,
	getAutomationUsageTrend,
	getTopFunctions,
	calculateAutomationCost,
	withAutomationTracking,
};
