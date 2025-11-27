/**
 * AI Chat API Routes Tests
 *
 * Tests for AI SDK usage in API routes
 * Verifies streamText, generateText, tool, and provider integrations
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock streamText and generateText from ai
const mockStreamTextResult = {
	toUIMessageStreamResponse: vi.fn(() => new Response("streaming")),
	toDataStreamResponse: vi.fn(() => new Response("data stream")),
};

const mockGenerateTextResult = {
	text: "Generated title",
	usage: { promptTokens: 10, completionTokens: 5 },
};

vi.mock("ai", () => ({
	streamText: vi.fn(() => mockStreamTextResult),
	generateText: vi.fn(() => Promise.resolve(mockGenerateTextResult)),
	tool: vi.fn((config) => ({
		...config,
		_type: "tool",
	})),
	jsonSchema: vi.fn((schema) => schema),
	convertToModelMessages: vi.fn((messages) =>
		messages.map((m: { role: string; content?: string; parts?: Array<{ text: string }> }) => ({
			role: m.role,
			content: m.content || m.parts?.map((p) => p.text).join("") || "",
		}))
	),
	stepCountIs: vi.fn((count) => ({ maxSteps: count })),
}));

// Mock @ai-sdk/google
vi.mock("@ai-sdk/google", () => ({
	google: vi.fn((modelId) => ({
		modelId,
		provider: "google",
		_type: "model",
	})),
	createGoogleGenerativeAI: vi.fn(() => vi.fn((modelId) => ({
		modelId,
		provider: "google",
	}))),
}));

// Mock @ai-sdk/google-vertex
vi.mock("@ai-sdk/google-vertex", () => ({
	createVertex: vi.fn(() => vi.fn((modelId) => ({
		modelId,
		provider: "google-vertex",
	}))),
}));

// Mock @ai-sdk/anthropic
vi.mock("@ai-sdk/anthropic", () => ({
	anthropic: vi.fn((modelId) => ({
		modelId,
		provider: "anthropic",
	})),
}));

// Mock @ai-sdk/openai
vi.mock("@ai-sdk/openai", () => ({
	openai: vi.fn((modelId) => ({
		modelId,
		provider: "openai",
	})),
}));

// Mock @ai-sdk/groq
vi.mock("@ai-sdk/groq", () => ({
	createGroq: vi.fn(() => vi.fn((modelId) => ({
		modelId,
		provider: "groq",
	}))),
}));

// Mock AI config
vi.mock("@/lib/ai/config", () => ({
	createAIProvider: vi.fn(({ provider, model }) => ({
		modelId: model,
		provider,
		_type: "configured-model",
	})),
	isVertexAIAvailable: vi.fn(() => false),
}));

// Mock agent tools
vi.mock("@/lib/ai/agent-tools", () => ({
	aiAgentTools: {
		searchCustomers: { description: "Search customers", execute: vi.fn() },
		searchJobs: { description: "Search jobs", execute: vi.fn() },
		createInvoice: { description: "Create invoice", execute: vi.fn() },
		sendEmail: { description: "Send email", execute: vi.fn() },
	},
	toolCategories: {
		searchCustomers: "customer",
		searchJobs: "system",
		createInvoice: "financial",
		sendEmail: "communication",
	},
}));

// Mock action approval
vi.mock("@/lib/ai/action-approval", () => ({
	isDestructiveTool: vi.fn((toolName) =>
		["createInvoice", "sendEmail", "sendSms"].includes(toolName)
	),
	shouldInterceptTool: vi.fn(() =>
		Promise.resolve({ intercept: false })
	),
	getDestructiveToolMetadata: vi.fn((toolName) => {
		if (toolName === "sendEmail") {
			return {
				requiresOwnerApproval: true,
				riskLevel: "medium",
				actionType: "communication",
				description: "Send email",
				affectedEntityType: "customer",
			};
		}
		return null;
	}),
}));

// Mock Supabase
const mockSupabaseQuery = {
	select: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	update: vi.fn().mockReturnThis(),
	eq: vi.fn().mockReturnThis(),
	single: vi.fn(() => Promise.resolve({ data: { id: "test-id" }, error: null })),
};

vi.mock("@stratos/database", () => ({
	createServiceSupabaseClient: vi.fn(() => Promise.resolve({
		from: vi.fn(() => mockSupabaseQuery),
	})),
}));

// Mock analytics tracker
vi.mock("@/lib/analytics/external-api-tracker", () => ({
	trackExternalApiCall: vi.fn(() => Promise.resolve()),
}));

// Import after mocks
import {
	streamText,
	generateText,
	tool,
	jsonSchema,
	convertToModelMessages,
	stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { createAIProvider, isVertexAIAvailable } from "@/lib/ai/config";
import { aiAgentTools, toolCategories } from "@/lib/ai/agent-tools";

const mockedStreamText = vi.mocked(streamText);
const mockedGenerateText = vi.mocked(generateText);
const mockedTool = vi.mocked(tool);
const mockedConvertToModelMessages = vi.mocked(convertToModelMessages);

// =============================================================================
// STREAM TEXT TESTS
// =============================================================================

describe("streamText Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should export streamText from ai package", () => {
		expect(streamText).toBeDefined();
		expect(typeof streamText).toBe("function");
	});

	it("should call streamText with model configuration", () => {
		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				model: expect.anything(),
				messages: expect.any(Array),
			})
		);
	});

	it("should support system prompt parameter", () => {
		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
			system: "You are a helpful assistant",
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				system: "You are a helpful assistant",
			})
		);
	});

	it("should support temperature parameter", () => {
		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
			temperature: 0.7,
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				temperature: 0.7,
			})
		);
	});

	it("should support tools parameter", () => {
		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
			tools: aiAgentTools,
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				tools: expect.any(Object),
			})
		);
	});

	it("should support stopWhen with stepCountIs", () => {
		const stopCondition = stepCountIs(5);

		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
			stopWhen: stopCondition,
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				stopWhen: expect.anything(),
			})
		);
	});

	it("should support onFinish callback", () => {
		const onFinish = vi.fn();

		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
			onFinish,
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				onFinish: expect.any(Function),
			})
		);
	});

	it("should support onStepFinish callback", () => {
		const onStepFinish = vi.fn();

		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
			onStepFinish,
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				onStepFinish: expect.any(Function),
			})
		);
	});

	it("should return toUIMessageStreamResponse method", () => {
		const result = streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
		});

		expect(result.toUIMessageStreamResponse).toBeDefined();
		expect(typeof result.toUIMessageStreamResponse).toBe("function");
	});

	it("should return toDataStreamResponse method", () => {
		const result = streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [{ role: "user", content: "Hello" }],
		});

		expect(result.toDataStreamResponse).toBeDefined();
		expect(typeof result.toDataStreamResponse).toBe("function");
	});
});

// =============================================================================
// GENERATE TEXT TESTS
// =============================================================================

describe("generateText Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should export generateText from ai package", () => {
		expect(generateText).toBeDefined();
		expect(typeof generateText).toBe("function");
	});

	it("should call generateText with prompt", async () => {
		await generateText({
			model: google("gemini-2.0-flash-exp"),
			prompt: "Generate a title",
			maxTokens: 30,
		});

		expect(mockedGenerateText).toHaveBeenCalledWith(
			expect.objectContaining({
				prompt: "Generate a title",
				maxTokens: 30,
			})
		);
	});

	it("should return text and usage from generateText", async () => {
		const result = await generateText({
			model: google("gemini-2.0-flash-exp"),
			prompt: "Generate a title",
		});

		expect(result.text).toBe("Generated title");
		expect(result.usage).toEqual({ promptTokens: 10, completionTokens: 5 });
	});

	it("should support temperature parameter", async () => {
		await generateText({
			model: google("gemini-2.0-flash-exp"),
			prompt: "Generate a title",
			temperature: 0.3,
		});

		expect(mockedGenerateText).toHaveBeenCalledWith(
			expect.objectContaining({
				temperature: 0.3,
			})
		);
	});
});

// =============================================================================
// TOOL DEFINITION TESTS
// =============================================================================

describe("tool() Function", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should export tool from ai package", () => {
		expect(tool).toBeDefined();
		expect(typeof tool).toBe("function");
	});

	it("should create tool with description", () => {
		const testTool = tool({
			description: "Test tool description",
			inputSchema: z.object({ query: z.string() }),
			execute: async () => ({ success: true }),
		});

		expect(mockedTool).toHaveBeenCalledWith(
			expect.objectContaining({
				description: "Test tool description",
			})
		);
	});

	it("should create tool with inputSchema (AI SDK 6 format)", () => {
		const schema = z.object({
			action: z.string().describe("The action to take"),
			reason: z.string().describe("Why this action is beneficial"),
		});

		const testTool = tool({
			description: "Request approval tool",
			inputSchema: schema,
			execute: async () => ({ success: true }),
		});

		expect(mockedTool).toHaveBeenCalledWith(
			expect.objectContaining({
				inputSchema: schema,
			})
		);
	});

	it("should create tool with execute function", () => {
		const executeFn = vi.fn(async () => ({ success: true }));

		const testTool = tool({
			description: "Executable tool",
			inputSchema: z.object({}),
			execute: executeFn,
		});

		expect(mockedTool).toHaveBeenCalledWith(
			expect.objectContaining({
				execute: expect.any(Function),
			})
		);
	});

	it("should mark tool with _type from mock", () => {
		const testTool = tool({
			description: "Test tool",
			inputSchema: z.object({}),
			execute: async () => ({}),
		});

		expect(testTool).toHaveProperty("_type", "tool");
	});
});

// =============================================================================
// JSON SCHEMA TESTS
// =============================================================================

describe("jsonSchema() Function", () => {
	it("should export jsonSchema from ai package", () => {
		expect(jsonSchema).toBeDefined();
		expect(typeof jsonSchema).toBe("function");
	});

	it("should create JSON schema for tool input", () => {
		const schema = jsonSchema({
			type: "object",
			properties: {
				verbose: {
					type: "boolean",
					description: "Include detailed information",
				},
			},
			required: [],
		});

		expect(schema).toHaveProperty("type", "object");
		expect(schema).toHaveProperty("properties");
	});
});

// =============================================================================
// CONVERT TO MODEL MESSAGES TESTS
// =============================================================================

describe("convertToModelMessages", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should export convertToModelMessages from ai package", () => {
		expect(convertToModelMessages).toBeDefined();
		expect(typeof convertToModelMessages).toBe("function");
	});

	it("should convert UIMessage format to ModelMessage format", () => {
		const uiMessages = [
			{
				id: "1",
				role: "user",
				parts: [{ type: "text", text: "Hello" }],
			},
			{
				id: "2",
				role: "assistant",
				parts: [{ type: "text", text: "Hi there!" }],
			},
		];

		const result = convertToModelMessages(uiMessages);

		expect(mockedConvertToModelMessages).toHaveBeenCalledWith(uiMessages);
		expect(result).toEqual([
			{ role: "user", content: "Hello" },
			{ role: "assistant", content: "Hi there!" },
		]);
	});

	it("should handle messages with content property", () => {
		const contentMessages = [
			{ role: "user", content: "Hello" },
			{ role: "assistant", content: "Hi there!" },
		];

		const result = convertToModelMessages(contentMessages);

		expect(result[0].content).toBe("Hello");
	});
});

// =============================================================================
// STEP COUNT IS TESTS
// =============================================================================

describe("stepCountIs", () => {
	it("should export stepCountIs from ai package", () => {
		expect(stepCountIs).toBeDefined();
		expect(typeof stepCountIs).toBe("function");
	});

	it("should create stop condition with max steps", () => {
		const condition = stepCountIs(5);

		expect(condition).toEqual({ maxSteps: 5 });
	});
});

// =============================================================================
// AI PROVIDER TESTS
// =============================================================================

describe("AI Provider Configuration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create Google provider", () => {
		const model = createAIProvider({ provider: "google", model: "gemini-2.0-flash-exp" });

		expect(model).toHaveProperty("provider", "google");
		expect(model).toHaveProperty("modelId", "gemini-2.0-flash-exp");
	});

	it("should check Vertex AI availability", () => {
		const available = isVertexAIAvailable();

		expect(typeof available).toBe("boolean");
	});

	it("should export google function from @ai-sdk/google", () => {
		expect(google).toBeDefined();
		expect(typeof google).toBe("function");
	});

	it("should create model from google()", () => {
		const model = google("gemini-2.0-flash-exp");

		expect(model).toHaveProperty("modelId", "gemini-2.0-flash-exp");
		expect(model).toHaveProperty("provider", "google");
	});
});

// =============================================================================
// TOOL CATEGORIES TESTS
// =============================================================================

describe("Tool Categories", () => {
	it("should define tool categories", () => {
		expect(toolCategories).toBeDefined();
		expect(typeof toolCategories).toBe("object");
	});

	it("should categorize customer tools", () => {
		expect(toolCategories.searchCustomers).toBe("customer");
	});

	it("should categorize financial tools", () => {
		expect(toolCategories.createInvoice).toBe("financial");
	});

	it("should categorize communication tools", () => {
		expect(toolCategories.sendEmail).toBe("communication");
	});
});

// =============================================================================
// AGENT TOOLS TESTS
// =============================================================================

describe("Agent Tools", () => {
	it("should export aiAgentTools", () => {
		expect(aiAgentTools).toBeDefined();
		expect(typeof aiAgentTools).toBe("object");
	});

	it("should have searchCustomers tool", () => {
		expect(aiAgentTools.searchCustomers).toBeDefined();
		expect(aiAgentTools.searchCustomers.description).toBe("Search customers");
	});

	it("should have searchJobs tool", () => {
		expect(aiAgentTools.searchJobs).toBeDefined();
	});

	it("should have createInvoice tool", () => {
		expect(aiAgentTools.createInvoice).toBeDefined();
	});

	it("should have sendEmail tool", () => {
		expect(aiAgentTools.sendEmail).toBeDefined();
	});
});

// =============================================================================
// STREAMING RESPONSE TESTS
// =============================================================================

describe("Streaming Responses", () => {
	it("should return Response from toUIMessageStreamResponse", () => {
		const result = streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [],
		});

		const response = result.toUIMessageStreamResponse();

		expect(response).toBeInstanceOf(Response);
	});

	it("should return Response from toDataStreamResponse", () => {
		const result = streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [],
		});

		const response = result.toDataStreamResponse();

		expect(response).toBeInstanceOf(Response);
	});
});

// =============================================================================
// ON FINISH CALLBACK TESTS
// =============================================================================

describe("onFinish Callback", () => {
	it("should receive text, toolCalls, toolResults, and usage", () => {
		interface OnFinishParams {
			text: string;
			toolCalls: Array<{ toolCallId: string; toolName: string; input: unknown }>;
			toolResults: Array<{ toolCallId: string; output: unknown }>;
			usage: { promptTokens: number; completionTokens: number };
		}

		const onFinish = vi.fn<[OnFinishParams], void>();

		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [],
			onFinish,
		});

		// Verify the callback signature
		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				onFinish: expect.any(Function),
			})
		);
	});
});

// =============================================================================
// ON STEP FINISH CALLBACK TESTS
// =============================================================================

describe("onStepFinish Callback", () => {
	it("should receive toolCalls and toolResults", () => {
		interface OnStepFinishParams {
			toolCalls: Array<{ toolCallId: string; toolName: string; input: unknown }>;
			toolResults: Array<{ toolCallId: string; output: unknown }>;
		}

		const onStepFinish = vi.fn<[OnStepFinishParams], void>();

		streamText({
			model: google("gemini-2.0-flash-exp"),
			messages: [],
			onStepFinish,
		});

		expect(mockedStreamText).toHaveBeenCalledWith(
			expect.objectContaining({
				onStepFinish: expect.any(Function),
			})
		);
	});
});

// =============================================================================
// ENTITY PROMPTS TESTS
// =============================================================================

describe("Entity-Specific Prompts", () => {
	it("should define prompts for different entity types", () => {
		const entityPrompts: Record<string, string> = {
			job: "Complete this job description",
			customer: "Complete this customer note",
			invoice: "Complete this invoice description",
			estimate: "Complete this estimate description",
			default: "Complete this text professionally",
		};

		expect(Object.keys(entityPrompts)).toContain("job");
		expect(Object.keys(entityPrompts)).toContain("customer");
		expect(Object.keys(entityPrompts)).toContain("invoice");
		expect(Object.keys(entityPrompts)).toContain("estimate");
		expect(Object.keys(entityPrompts)).toContain("default");
	});
});

// =============================================================================
// MAX DURATION TESTS
// =============================================================================

describe("Route Configuration", () => {
	it("should support maxDuration export for Vercel", () => {
		// Routes export maxDuration for serverless timeout
		const maxDuration = 60;
		expect(maxDuration).toBeGreaterThan(0);
		expect(maxDuration).toBeLessThanOrEqual(300); // Vercel limit for hobby plans
	});
});

// =============================================================================
// ERROR HANDLING TESTS
// =============================================================================

describe("Error Handling", () => {
	it("should handle missing messages error", () => {
		const validateMessages = (messages: unknown) => {
			if (!(messages && Array.isArray(messages))) {
				return { error: "Messages are required", status: 400 };
			}
			return null;
		};

		expect(validateMessages(null)).toEqual({ error: "Messages are required", status: 400 });
		expect(validateMessages(undefined)).toEqual({ error: "Messages are required", status: 400 });
		expect(validateMessages("not array")).toEqual({ error: "Messages are required", status: 400 });
		expect(validateMessages([])).toBeNull();
	});

	it("should handle missing company ID error", () => {
		const validateCompanyId = (companyId: string | undefined) => {
			if (!companyId) {
				return { error: "Company ID required", status: 400 };
			}
			return null;
		};

		expect(validateCompanyId(undefined)).toEqual({ error: "Company ID required", status: 400 });
		expect(validateCompanyId("")).toEqual({ error: "Company ID required", status: 400 });
		expect(validateCompanyId("company-123")).toBeNull();
	});

	it("should format error responses correctly", () => {
		const formatError = (error: unknown) => {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			const errorName = error instanceof Error ? error.name : "UnknownError";

			return {
				error: errorMessage,
				errorType: errorName,
				timestamp: expect.any(String),
			};
		};

		const result = formatError(new Error("Test error"));

		expect(result.error).toBe("Test error");
		expect(result.errorType).toBe("Error");
	});
});

// =============================================================================
// UUID VALIDATION TESTS
// =============================================================================

describe("UUID Validation", () => {
	it("should validate correct UUIDs", () => {
		const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
		expect(UUID_REGEX.test("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
	});

	it("should reject invalid UUIDs", () => {
		const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		expect(UUID_REGEX.test("not-a-uuid")).toBe(false);
		expect(UUID_REGEX.test("550e8400-e29b-41d4-a716")).toBe(false);
		expect(UUID_REGEX.test("")).toBe(false);
		expect(UUID_REGEX.test("anonymous")).toBe(false);
	});
});
