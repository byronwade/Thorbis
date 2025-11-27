/**
 * AI Provider Configuration
 *
 * Uses Groq as the exclusive AI provider.
 * Groq offers a free tier with generous limits and supports tool calling.
 *
 * Environment variables:
 * - GROQ_API_KEY: Free API key from https://console.groq.com
 */

import { createGroq } from "@ai-sdk/groq";

export type AIProvider = "groq";

export type AIConfig = {
	provider: AIProvider;
	model: string;
	gatewayUrl?: string;
	gatewayToken?: string;
};

/**
 * Get AI configuration from environment variables
 */
function getAIConfig(): AIConfig {
	const provider: AIProvider = "groq";
	const model = process.env.AI_MODEL || "llama-3.3-70b-versatile";
	const gatewayUrl = process.env.AI_GATEWAY_URL;
	const gatewayToken = process.env.AI_GATEWAY_TOKEN;

	return {
		provider,
		model,
		gatewayUrl,
		gatewayToken,
	};
}

/**
 * Create AI provider instance
 *
 * Uses Groq exclusively for all AI operations.
 * Groq supports tools and has a generous free tier.
 */
export function createAIProvider(config?: Partial<AIConfig>) {
	const fullConfig = { ...getAIConfig(), ...config };
	const groq = createGroq();
	return groq(fullConfig.model);
}

/**
 * Available models - Groq only
 *
 * All models are FREE on Groq with generous rate limits.
 * Get an API key at https://console.groq.com
 */
export const AVAILABLE_MODELS = {
	groq: [
		"llama-3.3-70b-versatile", // Best for tool calling, free tier
		"llama-3.1-70b-versatile",
		"llama-3.1-8b-instant", // Faster, lower latency
		"mixtral-8x7b-32768", // Good for long context
		"gemma2-9b-it", // Google's open model on Groq
	],
} as const;
