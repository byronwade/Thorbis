/**
 * AI Provider Configuration
 * Supports OpenAI, Anthropic, and Google with Vercel AI Gateway
 */

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export type AIProvider = "openai" | "anthropic" | "google";

export type AIConfig = {
  provider: AIProvider;
  model: string;
  gatewayUrl?: string;
  gatewayToken?: string;
};

/**
 * Get AI configuration from environment variables
 */
export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || "openai") as AIProvider;
  const model = process.env.AI_MODEL || getDefaultModel(provider);
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
 * Get default model for provider
 */
function getDefaultModel(provider: AIProvider): string {
  switch (provider) {
    case "openai":
      return "gpt-4o";
    case "anthropic":
      return "claude-3-5-sonnet-20241022";
    case "google":
      return "gemini-2.0-flash-exp";
    default:
      return "gpt-4o";
  }
}

/**
 * Create AI provider instance with optional gateway routing
 */
export function createAIProvider(config?: Partial<AIConfig>) {
  const fullConfig = { ...getAIConfig(), ...config };
  const { provider, gatewayUrl, gatewayToken } = fullConfig;

  // Base configuration for gateway
  const _baseConfig =
    gatewayUrl && gatewayToken
      ? {
          baseURL: `${gatewayUrl}/v1`,
          headers: {
            Authorization: `Bearer ${gatewayToken}`,
          },
        }
      : {};

  switch (provider) {
    case "openai":
      return openai(fullConfig.model);
    case "anthropic":
      return anthropic(fullConfig.model);
    case "google":
      return google(fullConfig.model);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Create provider-specific client for direct API access
 */
export function createProviderClient(provider?: AIProvider) {
  const selectedProvider = provider || getAIConfig().provider;
  const config = getAIConfig();

  const _gatewayConfig =
    config.gatewayUrl && config.gatewayToken
      ? {
          baseURL: `${config.gatewayUrl}/v1`,
          headers: {
            Authorization: `Bearer ${config.gatewayToken}`,
          },
        }
      : {};

  switch (selectedProvider) {
    case "openai":
      return openai;
    case "anthropic":
      return anthropic;
    case "google":
      return google;
    default:
      throw new Error(`Unsupported provider: ${selectedProvider}`);
  }
}

/**
 * Available models by provider
 */
export const AVAILABLE_MODELS = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
  anthropic: [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  google: ["gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"],
} as const;
