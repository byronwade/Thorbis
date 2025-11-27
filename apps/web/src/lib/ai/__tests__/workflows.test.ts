/**
 * AI Workflows Tests
 *
 * Tests for multi-step AI workflows using generateText
 * Verifies workflow definitions, steps, and execution patterns
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock the AI SDK generateText function
vi.mock("ai", () => ({
	generateText: vi.fn(),
}));

// Mock the AI config
vi.mock("../config", () => ({
	createAIProvider: vi.fn(() => "mocked-model"),
}));

// Import after mocks
import { generateText } from "ai";
import { createAIProvider } from "../config";
import { contentGenerationWorkflow } from "../workflows/content-generation";
import type {
	WorkflowDefinition,
	WorkflowStep,
	WorkflowContext,
	WorkflowStepResult,
	WorkflowResult,
	WorkflowStatus,
	AgentRole,
	AgentContext,
	AgentResult,
} from "../workflows/types";

const mockedGenerateText = vi.mocked(generateText);

// =============================================================================
// TYPE DEFINITION TESTS
// =============================================================================

describe("Workflow Types", () => {
	describe("WorkflowStatus", () => {
		it("should define all valid workflow statuses", () => {
			const validStatuses: WorkflowStatus[] = ["idle", "running", "completed", "error"];
			expect(validStatuses).toHaveLength(4);
		});
	});

	describe("WorkflowStep", () => {
		it("should define step with required properties", () => {
			const step: WorkflowStep<string, string> = {
				id: "test-step",
				name: "Test Step",
				description: "A test step",
				execute: async (input) => `processed: ${input}`,
			};

			expect(step.id).toBe("test-step");
			expect(step.name).toBe("Test Step");
			expect(typeof step.execute).toBe("function");
		});

		it("should allow optional description", () => {
			const stepWithoutDesc: WorkflowStep = {
				id: "minimal",
				name: "Minimal Step",
				execute: async () => null,
			};

			expect(stepWithoutDesc.description).toBeUndefined();
		});
	});

	describe("WorkflowContext", () => {
		it("should define context with required properties", () => {
			const context: WorkflowContext = {
				workflowId: "wf-123",
				history: [],
			};

			expect(context.workflowId).toBe("wf-123");
			expect(context.history).toEqual([]);
		});

		it("should allow optional properties", () => {
			const context: WorkflowContext = {
				workflowId: "wf-456",
				userId: "user-789",
				metadata: { key: "value" },
				history: [],
				signal: new AbortController().signal,
			};

			expect(context.userId).toBe("user-789");
			expect(context.metadata).toEqual({ key: "value" });
			expect(context.signal).toBeDefined();
		});
	});

	describe("WorkflowStepResult", () => {
		it("should define successful step result", () => {
			const result: WorkflowStepResult<string> = {
				stepId: "step-1",
				stepName: "First Step",
				status: "success",
				input: { data: "input" },
				output: "output data",
				startTime: new Date(),
				endTime: new Date(),
				duration: 100,
			};

			expect(result.status).toBe("success");
			expect(result.output).toBe("output data");
		});

		it("should define error step result", () => {
			const result: WorkflowStepResult = {
				stepId: "step-2",
				stepName: "Failed Step",
				status: "error",
				input: {},
				error: "Something went wrong",
				startTime: new Date(),
				endTime: new Date(),
				duration: 50,
			};

			expect(result.status).toBe("error");
			expect(result.error).toBe("Something went wrong");
		});
	});

	describe("WorkflowResult", () => {
		it("should define completed workflow result", () => {
			const result: WorkflowResult<{ content: string }> = {
				workflowId: "wf-123",
				status: "completed",
				steps: [],
				output: { content: "Final output" },
				startTime: new Date(),
				endTime: new Date(),
				duration: 5000,
			};

			expect(result.status).toBe("completed");
			expect(result.output?.content).toBe("Final output");
		});

		it("should define error workflow result", () => {
			const result: WorkflowResult = {
				workflowId: "wf-456",
				status: "error",
				steps: [],
				error: "Workflow failed",
				startTime: new Date(),
			};

			expect(result.status).toBe("error");
			expect(result.endTime).toBeUndefined();
		});
	});

	describe("WorkflowDefinition", () => {
		it("should define workflow with all properties", () => {
			const workflow: WorkflowDefinition<{ topic: string }, { content: string }> = {
				id: "test-workflow",
				name: "Test Workflow",
				description: "A test workflow",
				version: "1.0.0",
				steps: [],
				beforeAll: async () => {},
				afterAll: async (output) => output,
				onError: async () => {},
			};

			expect(workflow.id).toBe("test-workflow");
			expect(workflow.version).toBe("1.0.0");
		});
	});
});

// =============================================================================
// AGENT TYPES TESTS
// =============================================================================

describe("Agent Types", () => {
	describe("AgentRole", () => {
		it("should define all valid agent roles", () => {
			const validRoles: AgentRole[] = ["assistant", "researcher", "writer", "reviewer"];
			expect(validRoles).toHaveLength(4);
		});
	});

	describe("AgentContext", () => {
		it("should define agent context", () => {
			const context: AgentContext = {
				role: "researcher",
				goal: "Find information about HVAC systems",
				constraints: ["Use only reputable sources", "Focus on residential systems"],
				history: [],
				metadata: { source: "user-request" },
			};

			expect(context.role).toBe("researcher");
			expect(context.constraints).toHaveLength(2);
		});
	});

	describe("AgentResult", () => {
		it("should define agent result", () => {
			const result: AgentResult<string> = {
				role: "writer",
				output: "Generated content here",
				reasoning: "Based on research findings",
				confidence: 0.85,
				metadata: { wordCount: 500 },
			};

			expect(result.role).toBe("writer");
			expect(result.confidence).toBe(0.85);
		});
	});
});

// =============================================================================
// CONTENT GENERATION WORKFLOW TESTS
// =============================================================================

describe("Content Generation Workflow", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should have correct workflow metadata", () => {
		expect(contentGenerationWorkflow.id).toBe("content-generation");
		expect(contentGenerationWorkflow.name).toBe("Content Generation Workflow");
		expect(contentGenerationWorkflow.version).toBe("1.0.0");
	});

	it("should have description explaining the workflow", () => {
		expect(contentGenerationWorkflow.description).toContain("Multi-agent");
		expect(contentGenerationWorkflow.description).toContain("content");
	});

	it("should have 3 steps: research, draft, review", () => {
		expect(contentGenerationWorkflow.steps).toHaveLength(3);

		const stepIds = contentGenerationWorkflow.steps.map((s) => s.id);
		expect(stepIds).toContain("research");
		expect(stepIds).toContain("draft");
		expect(stepIds).toContain("review");
	});

	describe("Research Step", () => {
		it("should be the first step", () => {
			const researchStep = contentGenerationWorkflow.steps[0];
			expect(researchStep.id).toBe("research");
			expect(researchStep.name).toBe("Research Phase");
		});

		it("should call generateText with research prompt", async () => {
			const mockResearchResponse = JSON.stringify({
				keyPoints: ["Point 1", "Point 2"],
				sources: ["Source 1"],
				outline: "Detailed outline here",
			});

			mockedGenerateText.mockResolvedValueOnce({ text: mockResearchResponse } as never);

			const researchStep = contentGenerationWorkflow.steps[0];
			const result = await researchStep.execute(
				{ topic: "HVAC Maintenance", keywords: ["heating", "cooling"] },
				{ workflowId: "test", history: [] }
			);

			expect(mockedGenerateText).toHaveBeenCalledWith(
				expect.objectContaining({
					model: expect.anything(),
					prompt: expect.stringContaining("HVAC Maintenance"),
				})
			);

			expect(result).toHaveProperty("keyPoints");
			expect(result).toHaveProperty("outline");
		});

		it("should include keywords in prompt if provided", async () => {
			const mockResponse = JSON.stringify({
				keyPoints: [],
				sources: [],
				outline: "",
			});

			mockedGenerateText.mockResolvedValueOnce({ text: mockResponse } as never);

			const researchStep = contentGenerationWorkflow.steps[0];
			await researchStep.execute(
				{ topic: "Test Topic", keywords: ["keyword1", "keyword2"] },
				{ workflowId: "test", history: [] }
			);

			expect(mockedGenerateText).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringContaining("keyword1"),
				})
			);
		});
	});

	describe("Draft Step", () => {
		it("should be the second step", () => {
			const draftStep = contentGenerationWorkflow.steps[1];
			expect(draftStep.id).toBe("draft");
			expect(draftStep.name).toBe("Writing Phase");
		});

		it("should use research output to write content", async () => {
			const mockDraftResponse = JSON.stringify({
				title: "Article Title",
				content: "Full article content here with multiple paragraphs.",
				wordCount: 0,
			});

			mockedGenerateText.mockResolvedValueOnce({ text: mockDraftResponse } as never);

			const draftStep = contentGenerationWorkflow.steps[1];
			const researchOutput = {
				keyPoints: ["Key point 1", "Key point 2"],
				sources: ["Source A"],
				outline: "1. Introduction\n2. Main content\n3. Conclusion",
			};

			const context: WorkflowContext = {
				workflowId: "test",
				history: [
					{
						stepId: "research",
						stepName: "Research Phase",
						status: "success",
						input: { topic: "Test Topic", tone: "professional", length: "medium" },
						output: researchOutput,
						startTime: new Date(),
						endTime: new Date(),
						duration: 100,
					},
				],
			};

			const result = await draftStep.execute(researchOutput, context);

			expect(mockedGenerateText).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringContaining("Key point 1"),
				})
			);

			expect(result).toHaveProperty("title");
			expect(result).toHaveProperty("content");
		});

		it("should calculate word count", async () => {
			const mockDraftResponse = JSON.stringify({
				title: "Test",
				content: "One two three four five six seven eight nine ten",
				wordCount: 0,
			});

			mockedGenerateText.mockResolvedValueOnce({ text: mockDraftResponse } as never);

			const draftStep = contentGenerationWorkflow.steps[1];
			const result = await draftStep.execute(
				{ keyPoints: [], sources: [], outline: "" },
				{
					workflowId: "test",
					history: [
						{
							stepId: "research",
							stepName: "Research",
							status: "success",
							input: { topic: "Test" },
							output: {},
							startTime: new Date(),
							endTime: new Date(),
							duration: 100,
						},
					],
				}
			) as { wordCount: number };

			expect(result.wordCount).toBe(10);
		});
	});

	describe("Review Step", () => {
		it("should be the third step", () => {
			const reviewStep = contentGenerationWorkflow.steps[2];
			expect(reviewStep.id).toBe("review");
			expect(reviewStep.name).toBe("Review Phase");
		});

		it("should review and improve the draft", async () => {
			const mockReviewResponse = JSON.stringify({
				finalContent: "Improved content with better flow",
				suggestions: ["Add more examples", "Clarify technical terms"],
				score: 8,
			});

			mockedGenerateText.mockResolvedValueOnce({ text: mockReviewResponse } as never);

			const reviewStep = contentGenerationWorkflow.steps[2];
			const draftOutput = {
				title: "Draft Title",
				content: "Original draft content",
				wordCount: 100,
			};

			const result = await reviewStep.execute(draftOutput, {
				workflowId: "test",
				history: [],
			});

			expect(mockedGenerateText).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringContaining("Draft Title"),
				})
			);

			expect(result).toHaveProperty("finalContent");
			expect(result).toHaveProperty("suggestions");
			expect(result).toHaveProperty("score");
		});
	});

	describe("afterAll Hook", () => {
		it("should compile final output from all steps", async () => {
			const afterAll = contentGenerationWorkflow.afterAll;
			expect(afterAll).toBeDefined();

			if (afterAll) {
				const reviewOutput = {
					finalContent: "Final polished content",
					suggestions: [],
					score: 9,
				};

				const context: WorkflowContext = {
					workflowId: "test",
					history: [
						{
							stepId: "research",
							stepName: "Research",
							status: "success",
							input: { topic: "Test Topic" },
							output: { keyPoints: ["Point 1"], sources: [], outline: "Outline" },
							startTime: new Date(),
							endTime: new Date(),
							duration: 100,
						},
						{
							stepId: "draft",
							stepName: "Draft",
							status: "success",
							input: { keyPoints: [], sources: [], outline: "" },
							output: { title: "Draft", content: "Draft content", wordCount: 50 },
							startTime: new Date(),
							endTime: new Date(),
							duration: 200,
						},
						{
							stepId: "review",
							stepName: "Review",
							status: "success",
							input: {},
							output: reviewOutput,
							startTime: new Date(),
							endTime: new Date(),
							duration: 150,
						},
					],
				};

				const result = await afterAll(reviewOutput, context);

				expect(result).toHaveProperty("topic");
				expect(result).toHaveProperty("research");
				expect(result).toHaveProperty("draft");
				expect(result).toHaveProperty("review");
				expect(result).toHaveProperty("finalContent");
			}
		});
	});

	describe("onError Hook", () => {
		it("should have error handler defined", () => {
			expect(contentGenerationWorkflow.onError).toBeDefined();
		});
	});
});

// =============================================================================
// AI SDK INTEGRATION TESTS
// =============================================================================

describe("AI SDK Integration", () => {
	it("should use generateText from ai package", () => {
		expect(generateText).toBeDefined();
		expect(typeof generateText).toBe("function");
	});

	it("should use createAIProvider for model selection", () => {
		expect(createAIProvider).toBeDefined();
		expect(typeof createAIProvider).toBe("function");
	});

	it("should call generateText in each workflow step", async () => {
		// Reset mock
		mockedGenerateText.mockReset();

		const mockJsonResponse = JSON.stringify({
			keyPoints: [],
			sources: [],
			outline: "test",
		});

		mockedGenerateText.mockResolvedValue({ text: mockJsonResponse } as never);

		// Execute research step
		const researchStep = contentGenerationWorkflow.steps[0];
		await researchStep.execute({ topic: "Test" }, { workflowId: "test", history: [] });

		expect(mockedGenerateText).toHaveBeenCalledTimes(1);
	});

	it("should expect JSON responses from generateText", async () => {
		// All workflow steps expect JSON responses
		const mockJsonResponse = JSON.stringify({
			keyPoints: ["Point 1"],
			sources: ["Source 1"],
			outline: "Test outline",
		});

		mockedGenerateText.mockResolvedValueOnce({ text: mockJsonResponse } as never);

		const researchStep = contentGenerationWorkflow.steps[0];
		const result = await researchStep.execute(
			{ topic: "Test" },
			{ workflowId: "test", history: [] }
		);

		// Result should be parsed JSON
		expect(typeof result).toBe("object");
		expect(result).toHaveProperty("keyPoints");
	});
});

// =============================================================================
// WORKFLOW DEFINITION PATTERN TESTS
// =============================================================================

describe("Workflow Definition Pattern", () => {
	it("should follow WorkflowDefinition interface", () => {
		const requiredProperties = ["id", "name", "steps"];

		for (const prop of requiredProperties) {
			expect(contentGenerationWorkflow).toHaveProperty(prop);
		}
	});

	it("should have steps with consistent structure", () => {
		for (const step of contentGenerationWorkflow.steps) {
			expect(step).toHaveProperty("id");
			expect(step).toHaveProperty("name");
			expect(step).toHaveProperty("execute");
			expect(typeof step.execute).toBe("function");
		}
	});

	it("should have unique step IDs", () => {
		const stepIds = contentGenerationWorkflow.steps.map((s) => s.id);
		const uniqueIds = new Set(stepIds);
		expect(uniqueIds.size).toBe(stepIds.length);
	});

	it("should maintain step order for dependencies", () => {
		const steps = contentGenerationWorkflow.steps;

		// Research must be first (no dependencies)
		expect(steps[0].id).toBe("research");

		// Draft depends on research
		expect(steps[1].id).toBe("draft");

		// Review depends on draft
		expect(steps[2].id).toBe("review");
	});
});
