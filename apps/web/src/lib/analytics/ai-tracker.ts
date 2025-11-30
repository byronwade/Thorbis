/**
 * AI/LLM Usage Tracking
 *
 * Tracks all AI model interactions with:
 * - Token usage (input/output)
 * - Cost estimation per call
 * - Latency tracking
 * - Tool/function call tracking
 * - Approval status for autonomous actions
 * - Error rates and patterns
 *
 * Usage:
 * ```typescript
 * import {
 *   trackAIUsage,
 *   withAITracking,
 *   startAICall,
 * } from "@/lib/analytics/ai-tracker";
 *
 * // Manual tracking
 * await trackAIUsage({
 *   companyId: "uuid",
 *   provider: "openai",
 *   model: "gpt-4",
 *   endpoint: "chat.completions",
 *   inputTokens: 500,
 *   outputTokens: 200,
 *   latencyMs: 1500,
 *   useCase: "job_description_generation",
 * });
 *
 * // Wrapper function
 * const result = await withAITracking(
 *   companyId,
 *   { provider: "openai", model: "gpt-4", useCase: "invoice_summary" },
 *   async () => openai.chat.completions.create({ ... }),
 * );
 *
 * // Start/end tracking for complex flows
 * const tracker = startAICall(companyId, { provider: "anthropic", model: "claude-3" });
 * try {
 *   const response = await anthropic.messages.create({ ... });
 *   await tracker.success(response.usage);
 * } catch (error) {
 *   await tracker.error(error);
 * }
 * ```
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { v4 as uuidv4 } from "uuid";
import { logSupabaseError } from "../utils/supabase-error-handler";

// ============================================
// Types
// ============================================

export type AIProvider =
	| "openai"
	| "anthropic"
	| "google"
	| "cohere"
	| "mistral"
	| "groq"
	| "together"
	| "local"
	| "other";

export type AIUseCase =
	| "chat"
	| "completion"
	| "embedding"
	| "classification"
	| "summarization"
	| "extraction"
	| "generation"
	| "translation"
	| "code_generation"
	| "job_assistant"
	| "customer_support"
	| "document_analysis"
	| "scheduling"
	| "pricing"
	| "voice_assistant" // AI phone answering
	| "voice_transcription" // Speech-to-text
	| "voice_synthesis" // Text-to-speech
	| "other";

export type ApprovalStatus =
	| "auto_approved"
	| "user_approved"
	| "user_rejected"
	| "pending"
	| "not_required";

export interface AIUsageParams {
	companyId: string;
	provider: AIProvider;
	model: string;
	endpoint?: string;
	inputTokens: number;
	outputTokens: number;
	latencyMs: number;
	success?: boolean;
	useCase?: AIUseCase;
	toolsCalled?: string[];
	approvalStatus?: ApprovalStatus;
	errorMessage?: string;
	traceId?: string;
	metadata?: Record<string, unknown>;
}

export interface AICallOptions {
	provider: AIProvider;
	model: string;
	endpoint?: string;
	useCase?: AIUseCase;
	toolsCalled?: string[];
	approvalStatus?: ApprovalStatus;
	traceId?: string;
}

export interface TokenUsage {
	inputTokens?: number;
	outputTokens?: number;
	totalTokens?: number;
	prompt_tokens?: number;
	completion_tokens?: number;
	input_tokens?: number;
	output_tokens?: number;
}

// ============================================
// Cost Calculation
// ============================================

/**
 * Cost per 1K tokens in cents
 * These are approximate costs - actual costs vary by usage tier
 */
const MODEL_COSTS: Record<
	string,
	{ input: number; output: number }
> = {
	// OpenAI GPT-4
	"gpt-4": { input: 3, output: 6 },
	"gpt-4-turbo": { input: 1, output: 3 },
	"gpt-4o": { input: 0.5, output: 1.5 },
	"gpt-4o-mini": { input: 0.015, output: 0.06 },
	// OpenAI GPT-3.5
	"gpt-3.5-turbo": { input: 0.05, output: 0.15 },
	// OpenAI Embeddings
	"text-embedding-3-small": { input: 0.002, output: 0 },
	"text-embedding-3-large": { input: 0.013, output: 0 },
	// Anthropic Claude
	"claude-3-opus": { input: 1.5, output: 7.5 },
	"claude-3-sonnet": { input: 0.3, output: 1.5 },
	"claude-3-haiku": { input: 0.025, output: 0.125 },
	"claude-3.5-sonnet": { input: 0.3, output: 1.5 },
	// Google
	"gemini-1.5-pro": { input: 0.125, output: 0.375 },
	"gemini-1.5-flash": { input: 0.0375, output: 0.15 },
	"gemini-2.0-flash": { input: 0.1, output: 0.4 },
	// Groq (very cheap)
	"llama-3.1-70b": { input: 0.059, output: 0.079 },
	"llama-3.1-8b": { input: 0.005, output: 0.008 },
	"mixtral-8x7b": { input: 0.024, output: 0.024 },
	// Default for unknown models
	default: { input: 0.1, output: 0.1 },
};

/**
 * Calculate cost in cents for token usage
 */
export function calculateTokenCost(
	model: string,
	inputTokens: number,
	outputTokens: number,
): number {
	// Find the best matching model cost
	let costs = MODEL_COSTS.default;

	for (const [modelPattern, modelCosts] of Object.entries(MODEL_COSTS)) {
		if (modelPattern !== "default" && model.toLowerCase().includes(modelPattern)) {
			costs = modelCosts;
			break;
		}
	}

	// Cost per 1K tokens
	const inputCost = (inputTokens / 1000) * costs.input;
	const outputCost = (outputTokens / 1000) * costs.output;

	return Math.round((inputCost + outputCost) * 100) / 100; // Round to 2 decimal places
}

// ============================================
// Core Functions
// ============================================

/**
 * Log AI usage to the database
 */
async function logAIUsageToDatabase(params: AIUsageParams): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		const costCents = calculateTokenCost(
			params.model,
			params.inputTokens,
			params.outputTokens,
		);

		// Type assertion needed because table may not be in generated types yet
		const { error } = await (supabase as any).from("ai_usage_logs").insert({
			trace_id: params.traceId || uuidv4(),
			company_id: params.companyId,
			provider: params.provider,
			model: params.model,
			endpoint: params.endpoint || "default",
			input_tokens: params.inputTokens,
			output_tokens: params.outputTokens,
			cost_cents: Math.round(costCents * 100), // Store as integer cents
			latency_ms: params.latencyMs,
			success: params.success ?? true,
			use_case: params.useCase || "other",
			tools_called: params.toolsCalled || [],
			approval_status: params.approvalStatus || "not_required",
			error_message: params.errorMessage || null,
			created_at: new Date().toISOString(),
		});

		if (error) {
			logSupabaseError(error, "AI Tracker");
		}
	} catch (err) {
		// Don't throw - logging failures shouldn't break the main operation
		logSupabaseError(err, "AI Tracker");
	}
}

/**
 * Track AI usage directly
 */
export async function trackAIUsage(params: AIUsageParams): Promise<void> {
	await logAIUsageToDatabase(params);
}

// ============================================
// Manual Tracker API
// ============================================

/**
 * Start tracking an AI call
 * Returns methods to complete tracking with success or error
 */
export function startAICall(companyId: string, options: AICallOptions) {
	const startTime = Date.now();
	const traceId = options.traceId || uuidv4();

	return {
		traceId,

		/**
		 * Mark the AI call as successful
		 */
		success: async (
			usage: TokenUsage,
			metadata?: Record<string, unknown>,
		): Promise<void> => {
			const latencyMs = Date.now() - startTime;

			// Normalize token counts from different API formats
			const inputTokens =
				usage.inputTokens ||
				usage.input_tokens ||
				usage.prompt_tokens ||
				0;
			const outputTokens =
				usage.outputTokens ||
				usage.output_tokens ||
				usage.completion_tokens ||
				0;

			await logAIUsageToDatabase({
				companyId,
				provider: options.provider,
				model: options.model,
				endpoint: options.endpoint,
				inputTokens,
				outputTokens,
				latencyMs,
				success: true,
				useCase: options.useCase,
				toolsCalled: options.toolsCalled,
				approvalStatus: options.approvalStatus,
				traceId,
				metadata,
			});
		},

		/**
		 * Mark the AI call as failed
		 */
		error: async (error: unknown): Promise<void> => {
			const latencyMs = Date.now() - startTime;
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";

			await logAIUsageToDatabase({
				companyId,
				provider: options.provider,
				model: options.model,
				endpoint: options.endpoint,
				inputTokens: 0,
				outputTokens: 0,
				latencyMs,
				success: false,
				useCase: options.useCase,
				toolsCalled: options.toolsCalled,
				approvalStatus: options.approvalStatus,
				errorMessage,
				traceId,
			});
		},
	};
}

// ============================================
// Wrapper Function
// ============================================

interface AIResponseWithUsage {
	usage?: TokenUsage;
}

/**
 * Wrapper function that tracks AI usage automatically
 */
export async function withAITracking<T extends AIResponseWithUsage>(
	companyId: string,
	options: AICallOptions,
	operation: () => Promise<T>,
): Promise<T> {
	const tracker = startAICall(companyId, options);

	try {
		const result = await operation();

		// Extract usage from response
		if (result.usage) {
			await tracker.success(result.usage);
		} else {
			// Log with zero tokens if no usage info
			await tracker.success({ inputTokens: 0, outputTokens: 0 });
		}

		return result;
	} catch (error) {
		await tracker.error(error);
		throw error;
	}
}

// ============================================
// Provider-Specific Helpers
// ============================================

/**
 * Track OpenAI API call
 */
export async function trackOpenAICall(
	companyId: string,
	model: string,
	usage: { prompt_tokens: number; completion_tokens: number },
	latencyMs: number,
	options?: Partial<AIUsageParams>,
): Promise<void> {
	await trackAIUsage({
		companyId,
		provider: "openai",
		model,
		inputTokens: usage.prompt_tokens,
		outputTokens: usage.completion_tokens,
		latencyMs,
		...options,
	});
}

/**
 * Track Anthropic API call
 */
export async function trackAnthropicCall(
	companyId: string,
	model: string,
	usage: { input_tokens: number; output_tokens: number },
	latencyMs: number,
	options?: Partial<AIUsageParams>,
): Promise<void> {
	await trackAIUsage({
		companyId,
		provider: "anthropic",
		model,
		inputTokens: usage.input_tokens,
		outputTokens: usage.output_tokens,
		latencyMs,
		...options,
	});
}

/**
 * Track Google AI API call
 */
export async function trackGoogleAICall(
	companyId: string,
	model: string,
	usage: { promptTokenCount?: number; candidatesTokenCount?: number },
	latencyMs: number,
	options?: Partial<AIUsageParams>,
): Promise<void> {
	await trackAIUsage({
		companyId,
		provider: "google",
		model,
		inputTokens: usage.promptTokenCount || 0,
		outputTokens: usage.candidatesTokenCount || 0,
		latencyMs,
		...options,
	});
}

// ============================================
// Voice AI Tracking (AI Phone Answering)
// ============================================

/**
 * Voice AI call parameters for billing
 * Cost breakdown: Twilio (voice) + Deepgram (STT) + Claude (LLM) + ElevenLabs (TTS)
 * Provider cost: ~$0.06/minute, Customer price: $0.18/minute (3x markup)
 */
export interface VoiceAICallParams {
	companyId: string;
	callId: string;
	durationSeconds: number;
	customerId?: string;
	callDirection: "inbound" | "outbound";
	transcriptionTokens?: number; // STT tokens
	llmInputTokens?: number; // Claude input
	llmOutputTokens?: number; // Claude output
	synthesisCharacters?: number; // TTS characters
	success?: boolean;
	errorMessage?: string;
	traceId?: string;
	metadata?: Record<string, unknown>;
}

/**
 * Voice AI cost breakdown per minute (in cents)
 */
const VOICE_AI_COSTS = {
	telephony: 0.4, // Twilio voice
	stt: 2.5, // Speech-to-text (Deepgram)
	llm: 2.0, // Language model (Claude)
	tts: 1.1, // Text-to-speech (ElevenLabs)
	total: 6.0, // $0.06/minute provider cost
	customerPrice: 18.0, // $0.18/minute (3x markup)
};

/**
 * Calculate voice AI cost in cents based on duration
 */
export function calculateVoiceAICost(durationSeconds: number): {
	providerCostCents: number;
	customerPriceCents: number;
} {
	const minutes = durationSeconds / 60;
	return {
		providerCostCents: Math.round(minutes * VOICE_AI_COSTS.total * 100) / 100,
		customerPriceCents: Math.round(minutes * VOICE_AI_COSTS.customerPrice * 100) / 100,
	};
}

/**
 * Track a Voice AI (AI Phone Answering) call
 * This tracks the combined cost of telephony + STT + LLM + TTS
 */
export async function trackVoiceAICall(params: VoiceAICallParams): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		const durationMinutes = params.durationSeconds / 60;
		const costs = calculateVoiceAICost(params.durationSeconds);

		// Log to ai_usage_logs with voice_assistant use case
		// Type assertion needed because table may not be in generated types yet
		const { error } = await (supabase as any).from("ai_usage_logs").insert({
			trace_id: params.traceId || uuidv4(),
			company_id: params.companyId,
			provider: "voice_ai", // Combined provider marker
			model: "voice_assistant_v1",
			endpoint: `voice_${params.callDirection}`,
			input_tokens: params.llmInputTokens || 0,
			output_tokens: params.llmOutputTokens || 0,
			cost_cents: Math.round(costs.providerCostCents),
			latency_ms: params.durationSeconds * 1000, // Duration as "latency"
			success: params.success ?? true,
			use_case: "voice_assistant",
			tools_called: [],
			approval_status: "not_required",
			error_message: params.errorMessage || null,
			created_at: new Date().toISOString(),
			// Store voice-specific data in metadata column if available
			// Otherwise we track call_id and duration in a separate table
		});

		if (error) {
			logSupabaseError(error, "AI Tracker");
		}

		// Also log to voice_ai_calls table for detailed tracking
		await logVoiceAICallDetails(params, costs);
	} catch (err) {
		logSupabaseError(err, "AI Tracker");
	}
}

/**
 * Log detailed voice AI call data
 */
async function logVoiceAICallDetails(
	params: VoiceAICallParams,
	costs: { providerCostCents: number; customerPriceCents: number },
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return;

		// Check if voice_ai_calls table exists, if not just skip
		// Type assertion needed because table may not be in generated types yet
		const { error } = await (supabase as any).from("voice_ai_calls").insert({
			id: params.traceId || uuidv4(),
			company_id: params.companyId,
			call_id: params.callId,
			customer_id: params.customerId || null,
			direction: params.callDirection,
			duration_seconds: params.durationSeconds,
			duration_minutes: Math.round((params.durationSeconds / 60) * 100) / 100,
			transcription_tokens: params.transcriptionTokens || 0,
			llm_input_tokens: params.llmInputTokens || 0,
			llm_output_tokens: params.llmOutputTokens || 0,
			synthesis_characters: params.synthesisCharacters || 0,
			provider_cost_cents: Math.round(costs.providerCostCents),
			customer_price_cents: Math.round(costs.customerPriceCents),
			success: params.success ?? true,
			error_message: params.errorMessage || null,
			created_at: new Date().toISOString(),
		});

		// Table might not exist yet, that's OK - we still have ai_usage_logs
		if (error && !error.message.includes("does not exist")) {
			logSupabaseError(error, "AI Tracker");
		}
	} catch (err) {
		// Silently fail - main tracking is in ai_usage_logs
	}
}

/**
 * Get voice AI usage summary for billing
 */
export async function getVoiceAIUsageSummary(
	companyId: string,
	monthYear?: string, // Format: "2024-11"
): Promise<{
	totalCalls: number;
	totalMinutes: number;
	providerCostCents: number;
	customerPriceCents: number;
	inboundCalls: number;
	outboundCalls: number;
	successRate: number;
}> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			return {
				totalCalls: 0,
				totalMinutes: 0,
				providerCostCents: 0,
				customerPriceCents: 0,
				inboundCalls: 0,
				outboundCalls: 0,
				successRate: 0,
			};
		}

		// Query from ai_usage_logs where use_case = 'voice_assistant'
		let query = supabase
			.from("ai_usage_logs")
			.select("latency_ms, cost_cents, endpoint, success")
			.eq("company_id", companyId)
			.eq("use_case", "voice_assistant");

		// Filter by month if provided
		if (monthYear) {
			const [year, month] = monthYear.split("-");
			const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
			const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
			query = query
				.gte("created_at", startDate.toISOString())
				.lte("created_at", endDate.toISOString());
		}

		const { data, error } = await query;

		if (error) {
			logSupabaseError(error, "AI Tracker");
			return {
				totalCalls: 0,
				totalMinutes: 0,
				providerCostCents: 0,
				customerPriceCents: 0,
				inboundCalls: 0,
				outboundCalls: 0,
				successRate: 0,
			};
		}

		const summary = {
			totalCalls: data?.length || 0,
			totalMinutes: 0,
			providerCostCents: 0,
			customerPriceCents: 0,
			inboundCalls: 0,
			outboundCalls: 0,
			successCount: 0,
		};

		for (const row of data || []) {
			// latency_ms stores duration in seconds * 1000 for voice calls
			const durationSeconds = (row.latency_ms || 0) / 1000;
			summary.totalMinutes += durationSeconds / 60;
			summary.providerCostCents += row.cost_cents || 0;
			// Customer price is 3x provider cost
			summary.customerPriceCents += (row.cost_cents || 0) * 3;

			if (row.endpoint === "voice_inbound") summary.inboundCalls++;
			if (row.endpoint === "voice_outbound") summary.outboundCalls++;
			if (row.success) summary.successCount++;
		}

		return {
			totalCalls: summary.totalCalls,
			totalMinutes: Math.round(summary.totalMinutes * 100) / 100,
			providerCostCents: Math.round(summary.providerCostCents),
			customerPriceCents: Math.round(summary.customerPriceCents),
			inboundCalls: summary.inboundCalls,
			outboundCalls: summary.outboundCalls,
			successRate: summary.totalCalls > 0
				? Math.round((summary.successCount / summary.totalCalls) * 100)
				: 0,
		};
	} catch (err) {
		logSupabaseError(err, "AI Tracker");
		return {
			totalCalls: 0,
			totalMinutes: 0,
			providerCostCents: 0,
			customerPriceCents: 0,
			inboundCalls: 0,
			outboundCalls: 0,
			successRate: 0,
		};
	}
}

// ============================================
// Query Functions
// ============================================

/**
 * Get AI usage summary for a company
 */
export async function getAIUsageSummary(
	companyId: string,
	days: number = 30,
): Promise<
	{
		provider: string;
		model: string;
		useCase: string;
		totalRequests: number;
		totalTokens: number;
		totalCostCents: number;
		avgLatencyMs: number;
		successRate: number;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase.rpc("get_ai_usage_summary", {
			p_company_id: companyId,
			p_days: days,
		});

		if (error) {
			logSupabaseError(error, "AI Tracker");
			return [];
		}

		return (data || []).map((row: Record<string, unknown>) => ({
			provider: row.provider as string,
			model: row.model as string,
			useCase: row.use_case as string,
			totalRequests: row.total_requests as number,
			totalTokens: row.total_tokens as number,
			totalCostCents: row.total_cost_cents as number,
			avgLatencyMs: row.avg_latency_ms as number,
			successRate: row.success_rate as number,
		}));
	} catch (err) {
		logSupabaseError(err, "AI Tracker");
		return [];
	}
}

/**
 * Get AI cost breakdown by day
 */
export async function getAICostByDay(
	companyId: string,
	days: number = 30,
): Promise<
	{
		date: string;
		totalCostCents: number;
		totalTokens: number;
		totalRequests: number;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const cutoff = new Date(
			Date.now() - days * 24 * 60 * 60 * 1000,
		).toISOString();

		const { data, error } = await supabase
			.from("ai_usage_logs")
			.select("created_at, cost_cents, total_tokens")
			.eq("company_id", companyId)
			.gte("created_at", cutoff)
			.order("created_at", { ascending: true });

		if (error) {
			logSupabaseError(error, "AI Tracker");
			return [];
		}

		// Group by day
		const dailyMap = new Map<
			string,
			{ totalCostCents: number; totalTokens: number; totalRequests: number }
		>();

		for (const row of data || []) {
			const date = new Date(row.created_at).toISOString().split("T")[0];

			const existing = dailyMap.get(date) || {
				totalCostCents: 0,
				totalTokens: 0,
				totalRequests: 0,
			};

			existing.totalCostCents += row.cost_cents || 0;
			existing.totalTokens += row.total_tokens || 0;
			existing.totalRequests++;

			dailyMap.set(date, existing);
		}

		return Array.from(dailyMap.entries()).map(([date, stats]) => ({
			date,
			...stats,
		}));
	} catch (err) {
		logSupabaseError(err, "AI Tracker");
		return [];
	}
}

/**
 * Get tool/function call usage stats
 */
export async function getToolCallStats(
	companyId: string,
	days: number = 30,
): Promise<
	{
		toolName: string;
		callCount: number;
		avgLatencyMs: number;
		successRate: number;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const cutoff = new Date(
			Date.now() - days * 24 * 60 * 60 * 1000,
		).toISOString();

		const { data, error } = await supabase
			.from("ai_usage_logs")
			.select("tools_called, latency_ms, success")
			.eq("company_id", companyId)
			.gte("created_at", cutoff)
			.not("tools_called", "is", null);

		if (error) {
			logSupabaseError(error, "AI Tracker");
			return [];
		}

		// Aggregate tool calls
		const toolMap = new Map<
			string,
			{ calls: number; totalLatency: number; successCount: number }
		>();

		for (const row of data || []) {
			const tools = row.tools_called as string[];
			if (!Array.isArray(tools)) continue;

			for (const tool of tools) {
				const existing = toolMap.get(tool) || {
					calls: 0,
					totalLatency: 0,
					successCount: 0,
				};

				existing.calls++;
				existing.totalLatency += row.latency_ms || 0;
				if (row.success) existing.successCount++;

				toolMap.set(tool, existing);
			}
		}

		return Array.from(toolMap.entries())
			.map(([toolName, stats]) => ({
				toolName,
				callCount: stats.calls,
				avgLatencyMs: Math.round(stats.totalLatency / stats.calls),
				successRate: Math.round((stats.successCount / stats.calls) * 100),
			}))
			.sort((a, b) => b.callCount - a.callCount);
	} catch (err) {
		logSupabaseError(err, "AI Tracker");
		return [];
	}
}

/**
 * Get approval rate for autonomous actions
 */
export async function getApprovalStats(
	companyId: string,
	days: number = 30,
): Promise<{
	totalRequested: number;
	autoApproved: number;
	userApproved: number;
	userRejected: number;
	pending: number;
	approvalRate: number;
}> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return {
			totalRequested: 0,
			autoApproved: 0,
			userApproved: 0,
			userRejected: 0,
			pending: 0,
			approvalRate: 0,
		};

		const cutoff = new Date(
			Date.now() - days * 24 * 60 * 60 * 1000,
		).toISOString();

		const { data, error } = await supabase
			.from("ai_usage_logs")
			.select("approval_status")
			.eq("company_id", companyId)
			.gte("created_at", cutoff)
			.neq("approval_status", "not_required");

		if (error) {
			logSupabaseError(error, "AI Tracker");
			return {
				totalRequested: 0,
				autoApproved: 0,
				userApproved: 0,
				userRejected: 0,
				pending: 0,
				approvalRate: 0,
			};
		}

		const counts = {
			totalRequested: data?.length || 0,
			autoApproved: 0,
			userApproved: 0,
			userRejected: 0,
			pending: 0,
		};

		for (const row of data || []) {
			switch (row.approval_status) {
				case "auto_approved":
					counts.autoApproved++;
					break;
				case "user_approved":
					counts.userApproved++;
					break;
				case "user_rejected":
					counts.userRejected++;
					break;
				case "pending":
					counts.pending++;
					break;
			}
		}

		const totalApproved = counts.autoApproved + counts.userApproved;
		const totalDecided = totalApproved + counts.userRejected;

		return {
			...counts,
			approvalRate:
				totalDecided > 0 ? Math.round((totalApproved / totalDecided) * 100) : 0,
		};
	} catch (err) {
		logSupabaseError(err, "AI Tracker");
		return {
			totalRequested: 0,
			autoApproved: 0,
			userApproved: 0,
			userRejected: 0,
			pending: 0,
			approvalRate: 0,
		};
	}
}

/**
 * Get recent AI errors for debugging
 */
export async function getRecentAIErrors(
	companyId: string,
	limit: number = 20,
): Promise<
	{
		provider: string;
		model: string;
		endpoint: string;
		errorMessage: string;
		createdAt: Date;
		traceId: string;
	}[]
> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("ai_usage_logs")
			.select("provider, model, endpoint, error_message, created_at, trace_id")
			.eq("company_id", companyId)
			.eq("success", false)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			logSupabaseError(error, "AI Tracker");
			return [];
		}

		return (data || []).map((row) => ({
			provider: row.provider,
			model: row.model,
			endpoint: row.endpoint,
			errorMessage: row.error_message || "Unknown error",
			createdAt: new Date(row.created_at),
			traceId: row.trace_id,
		}));
	} catch (err) {
		logSupabaseError(err, "AI Tracker");
		return [];
	}
}

// ============================================
// Exports
// ============================================

export default {
	trackAIUsage,
	startAICall,
	withAITracking,
	trackOpenAICall,
	trackAnthropicCall,
	trackGoogleAICall,
	trackVoiceAICall,
	calculateTokenCost,
	calculateVoiceAICost,
	getAIUsageSummary,
	getAICostByDay,
	getToolCallStats,
	getApprovalStats,
	getRecentAIErrors,
	getVoiceAIUsageSummary,
};
