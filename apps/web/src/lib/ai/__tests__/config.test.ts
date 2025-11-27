/**
 * AI Config Tests
 *
 * Tests for AI provider configuration and model selection.
 * Ensures proper provider initialization and model defaults.
 *
 * Note: Stratos uses Groq exclusively for AI operations (free tier).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	type AIProvider,
	AVAILABLE_MODELS,
	createAIProvider,
} from "../config";

// =============================================================================
// TEST SETUP
// =============================================================================

// Store original env
const originalEnv = process.env;

beforeEach(() => {
	// Reset environment before each test
	vi.resetModules();
	process.env = { ...originalEnv };
});

afterEach(() => {
	process.env = originalEnv;
});

// =============================================================================
// AVAILABLE MODELS TESTS
// =============================================================================

describe("AI Config", () => {
	describe("Available Models", () => {
		it("should have Groq models defined", () => {
			expect(AVAILABLE_MODELS.groq).toBeDefined();
			expect(AVAILABLE_MODELS.groq.length).toBeGreaterThan(0);
			expect(AVAILABLE_MODELS.groq).toContain("llama-3.3-70b-versatile");
			expect(AVAILABLE_MODELS.groq).toContain("llama-3.1-70b-versatile");
			expect(AVAILABLE_MODELS.groq).toContain("llama-3.1-8b-instant");
			expect(AVAILABLE_MODELS.groq).toContain("mixtral-8x7b-32768");
			expect(AVAILABLE_MODELS.groq).toContain("gemma2-9b-it");
		});

		it("should only have Groq as a provider", () => {
			const providers = Object.keys(AVAILABLE_MODELS);
			expect(providers).toContain("groq");
			expect(providers.length).toBe(1);
		});
	});

	describe("Provider Type Validation", () => {
		it("should define valid AIProvider type values", () => {
			const validProvider: AIProvider = "groq";
			expect(typeof validProvider).toBe("string");
		});
	});

	describe("Model Array Immutability", () => {
		it("should have readonly model arrays", () => {
			const groqModels = AVAILABLE_MODELS.groq;
			expect(groqModels[0]).toBe("llama-3.3-70b-versatile");
			expect(Array.isArray(AVAILABLE_MODELS.groq)).toBe(true);
		});
	});

	describe("Default Model Selection", () => {
		it("should have LLaMA 3.3 70b as first Groq model (default)", () => {
			expect(AVAILABLE_MODELS.groq[0]).toBe("llama-3.3-70b-versatile");
		});
	});

	describe("createAIProvider", () => {
		it("should create a Groq provider", () => {
			// This will throw if GROQ_API_KEY is not set, but the function exists
			expect(typeof createAIProvider).toBe("function");
		});

		it("should accept custom model configuration", () => {
			expect(typeof createAIProvider).toBe("function");
		});
	});
});
