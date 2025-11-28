/**
 * AI Tracing Service - OpenTelemetry-style trace and span management
 * Based on industry best practices from Langfuse, Datadog, and Grafana
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export type SpanType =
	| "llm_call"
	| "tool_execution"
	| "retrieval"
	| "embedding"
	| "user_input"
	| "system"
	| "agent_step"
	| "memory_operation";

export type SpanStatus =
	| "running"
	| "completed"
	| "failed"
	| "cancelled"
	| "timeout";

export interface TraceContext {
	traceId: string;
	companyId: string;
	userId?: string;
	chatId?: string;
}

export interface SpanData {
	spanName: string;
	spanType: SpanType;
	parentSpanId?: string;
	modelId?: string;
	modelProvider?: string;
	inputTokens?: number;
	outputTokens?: number;
	inputCostCents?: number;
	outputCostCents?: number;
	temperature?: number;
	maxTokens?: number;
	topP?: number;
	promptTemplateId?: string;
	promptVersion?: string;
	inputPreview?: string;
	outputPreview?: string;
	fullInput?: Record<string, unknown>;
	fullOutput?: Record<string, unknown>;
	toolName?: string;
	toolCategory?: string;
	toolParams?: Record<string, unknown>;
	toolResult?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
	tags?: string[];
}

export interface SpanEvent {
	eventType: string;
	eventName: string;
	level?: "debug" | "info" | "warn" | "error" | "critical";
	message?: string;
	attributes?: Record<string, unknown>;
	exceptionType?: string;
	exceptionMessage?: string;
	exceptionStack?: string;
	durationMs?: number;
}

// Cost per 1M tokens (in cents) - update as pricing changes
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
	"claude-3-5-sonnet-20241022": { input: 300, output: 1500 },
	"claude-3-opus-20240229": { input: 1500, output: 7500 },
	"claude-3-haiku-20240307": { input: 25, output: 125 },
	"gpt-4-turbo": { input: 1000, output: 3000 },
	"gpt-4o": { input: 500, output: 1500 },
	"gpt-3.5-turbo": { input: 50, output: 150 },
};

/**
 * Generate a new trace ID
 */
function generateTraceId(): string {
	return crypto.randomUUID();
}

/**
 * Create a new trace context
 */
function createTraceContext(
	companyId: string,
	options?: { userId?: string; chatId?: string },
): TraceContext {
	return {
		traceId: generateTraceId(),
		companyId,
		userId: options?.userId,
		chatId: options?.chatId,
	};
}

/**
 * Calculate cost from token counts
 */
function calculateCost(
	modelId: string,
	inputTokens: number,
	outputTokens: number,
): { inputCostCents: number; outputCostCents: number } {
	const costs = MODEL_COSTS[modelId] || { input: 300, output: 1500 }; // Default to Sonnet pricing
	return {
		inputCostCents: (inputTokens / 1_000_000) * costs.input,
		outputCostCents: (outputTokens / 1_000_000) * costs.output,
	};
}

/**
 * Start a new span
 */
async function startSpan(
	context: TraceContext,
	data: SpanData,
): Promise<string> {
	const supabase = createServiceSupabaseClient();
	const spanId = crypto.randomUUID();

	const { error } = await supabase.from("ai_traces").insert({
		id: spanId,
		trace_id: context.traceId,
		company_id: context.companyId,
		user_id: context.userId,
		chat_id: context.chatId,
		span_name: data.spanName,
		span_type: data.spanType,
		parent_span_id: data.parentSpanId,
		model_id: data.modelId,
		model_provider: data.modelProvider,
		input_tokens: data.inputTokens || 0,
		output_tokens: data.outputTokens || 0,
		input_cost_cents: data.inputCostCents || 0,
		output_cost_cents: data.outputCostCents || 0,
		temperature: data.temperature,
		max_tokens: data.maxTokens,
		top_p: data.topP,
		prompt_template_id: data.promptTemplateId,
		prompt_version: data.promptVersion,
		input_preview: data.inputPreview?.substring(0, 1000),
		output_preview: data.outputPreview?.substring(0, 1000),
		full_input: data.fullInput,
		full_output: data.fullOutput,
		tool_name: data.toolName,
		tool_category: data.toolCategory,
		tool_params: data.toolParams,
		tool_result: data.toolResult,
		metadata: data.metadata || {},
		tags: data.tags || [],
		status: "running",
		started_at: new Date().toISOString(),
	});

	if (error) {
		console.error("Failed to start span:", error);
		throw error;
	}

	return spanId;
}

/**
 * End a span with results
 */
async function endSpan(
	spanId: string,
	companyId: string,
	result: {
		status: SpanStatus;
		outputTokens?: number;
		outputCostCents?: number;
		outputPreview?: string;
		fullOutput?: Record<string, unknown>;
		toolResult?: Record<string, unknown>;
		errorType?: string;
		errorMessage?: string;
		errorStack?: string;
		durationMs?: number;
		timeToFirstTokenMs?: number;
	},
): Promise<void> {
	const supabase = createServiceSupabaseClient();
	const endedAt = new Date().toISOString();

	const { error } = await supabase
		.from("ai_traces")
		.update({
			status: result.status,
			ended_at: endedAt,
			duration_ms: result.durationMs,
			time_to_first_token_ms: result.timeToFirstTokenMs,
			output_tokens: result.outputTokens,
			output_cost_cents: result.outputCostCents,
			output_preview: result.outputPreview?.substring(0, 1000),
			full_output: result.fullOutput,
			tool_result: result.toolResult,
			error_type: result.errorType,
			error_message: result.errorMessage,
			error_stack: result.errorStack,
		})
		.eq("id", spanId)
		.eq("company_id", companyId);

	if (error) {
		console.error("Failed to end span:", error);
	}
}

/**
 * Record a span event
 */
async function recordSpanEvent(
	spanId: string,
	traceId: string,
	companyId: string,
	event: SpanEvent,
): Promise<void> {
	const supabase = createServiceSupabaseClient();

	const { error } = await supabase.from("ai_span_events").insert({
		span_id: spanId,
		trace_id: traceId,
		company_id: companyId,
		event_type: event.eventType,
		event_name: event.eventName,
		level: event.level || "info",
		message: event.message,
		attributes: event.attributes,
		exception_type: event.exceptionType,
		exception_message: event.exceptionMessage,
		exception_stack: event.exceptionStack,
		duration_ms: event.durationMs,
		timestamp: new Date().toISOString(),
	});

	if (error) {
		console.error("Failed to record span event:", error);
	}
}

/**
 * Get trace summary for a conversation
 */
async function getTraceSummary(
	companyId: string,
	traceId: string,
): Promise<{
	totalTokens: number;
	totalCostCents: number;
	totalDurationMs: number;
	spanCount: number;
	errorCount: number;
}> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_traces")
		.select(
			"input_tokens, output_tokens, input_cost_cents, output_cost_cents, duration_ms, status",
		)
		.eq("company_id", companyId)
		.eq("trace_id", traceId);

	if (error || !data) {
		return {
			totalTokens: 0,
			totalCostCents: 0,
			totalDurationMs: 0,
			spanCount: 0,
			errorCount: 0,
		};
	}

	return {
		totalTokens: data.reduce(
			(sum, s) => sum + (s.input_tokens || 0) + (s.output_tokens || 0),
			0,
		),
		totalCostCents: data.reduce(
			(sum, s) => sum + (s.input_cost_cents || 0) + (s.output_cost_cents || 0),
			0,
		),
		totalDurationMs: data.reduce((sum, s) => sum + (s.duration_ms || 0), 0),
		spanCount: data.length,
		errorCount: data.filter(
			(s) => s.status === "failed" || s.status === "timeout",
		).length,
	};
}

/**
 * Get daily metrics for a company
 */
async function getDailyMetrics(
	companyId: string,
	date: Date,
): Promise<{
	totalTraces: number;
	totalTokens: number;
	totalCostCents: number;
	avgLatencyMs: number;
	errorRate: number;
	topTools: Array<{ tool: string; count: number }>;
}> {
	const supabase = createServiceSupabaseClient();
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const { data, error } = await supabase
		.from("ai_traces")
		.select(
			"trace_id, input_tokens, output_tokens, input_cost_cents, output_cost_cents, duration_ms, status, tool_name",
		)
		.eq("company_id", companyId)
		.gte("created_at", startOfDay.toISOString())
		.lte("created_at", endOfDay.toISOString());

	if (error || !data) {
		return {
			totalTraces: 0,
			totalTokens: 0,
			totalCostCents: 0,
			avgLatencyMs: 0,
			errorRate: 0,
			topTools: [],
		};
	}

	const uniqueTraces = new Set(data.map((d) => d.trace_id)).size;
	const totalTokens = data.reduce(
		(sum, s) => sum + (s.input_tokens || 0) + (s.output_tokens || 0),
		0,
	);
	const totalCost = data.reduce(
		(sum, s) => sum + (s.input_cost_cents || 0) + (s.output_cost_cents || 0),
		0,
	);
	const durations = data
		.filter((s) => s.duration_ms)
		.map((s) => s.duration_ms!);
	const avgLatency =
		durations.length > 0
			? durations.reduce((a, b) => a + b, 0) / durations.length
			: 0;
	const errors = data.filter(
		(s) => s.status === "failed" || s.status === "timeout",
	).length;
	const errorRate = data.length > 0 ? (errors / data.length) * 100 : 0;

	// Count tool usage
	const toolCounts: Record<string, number> = {};
	data
		.filter((s) => s.tool_name)
		.forEach((s) => {
			toolCounts[s.tool_name!] = (toolCounts[s.tool_name!] || 0) + 1;
		});
	const topTools = Object.entries(toolCounts)
		.map(([tool, count]) => ({ tool, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	return {
		totalTraces: uniqueTraces,
		totalTokens,
		totalCostCents: totalCost,
		avgLatencyMs: Math.round(avgLatency),
		errorRate: Math.round(errorRate * 100) / 100,
		topTools,
	};
}
