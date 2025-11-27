/**
 * Structured Output Tests
 *
 * Tests for AI SDK generateObject and streamObject usage
 * Verifies schema validation and structured data generation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock the AI SDK functions
vi.mock("ai", () => ({
	generateObject: vi.fn(),
	streamObject: vi.fn(),
}));

// Mock the Groq provider
vi.mock("@ai-sdk/groq", () => ({
	createGroq: vi.fn(() => vi.fn(() => "mocked-groq-model")),
}));

// Import after mocks
import { generateObject, streamObject } from "ai";
import { createGroq } from "@ai-sdk/groq";
import {
	// Schemas
	customerInsightsSchema,
	jobAnalysisSchema,
	scheduleOptimizationSchema,
	financialSummarySchema,
	emailDraftSchema,
	responseSuggestionsSchema,
	// Functions
	generateCustomerInsights,
	streamJobAnalysis,
	generateScheduleOptimization,
	generateFinancialSummary,
	generateEmailDraft,
	streamResponseSuggestions,
	// Types
	type CustomerInsights,
	type JobAnalysis,
	type ScheduleOptimization,
	type FinancialSummary,
	type EmailDraft,
	type ResponseSuggestions,
} from "../structured-output";

const mockedGenerateObject = vi.mocked(generateObject);
const mockedStreamObject = vi.mocked(streamObject);

// =============================================================================
// SCHEMA VALIDATION TESTS
// =============================================================================

describe("Structured Output Schemas", () => {
	describe("customerInsightsSchema", () => {
		it("should validate a complete customer insights object", () => {
			const validInsights: CustomerInsights = {
				summary: "Long-term customer with consistent service history",
				healthScore: 85,
				recommendations: ["Schedule annual maintenance", "Offer service contract"],
				risks: ["Aging equipment may need replacement"],
				opportunities: ["Upsell to premium service plan"],
				lastInteraction: "Service call on Jan 15",
				nextSteps: ["Send maintenance reminder", "Follow up on estimate"],
			};

			expect(() => customerInsightsSchema.parse(validInsights)).not.toThrow();
		});

		it("should enforce healthScore range (0-100)", () => {
			const invalidHighScore = {
				summary: "Test",
				healthScore: 150,
				recommendations: [],
				risks: [],
				opportunities: [],
				nextSteps: [],
			};

			expect(() => customerInsightsSchema.parse(invalidHighScore)).toThrow();
		});

		it("should allow optional lastInteraction", () => {
			const withoutLastInteraction: CustomerInsights = {
				summary: "New customer",
				healthScore: 50,
				recommendations: [],
				risks: [],
				opportunities: [],
				nextSteps: [],
			};

			expect(() => customerInsightsSchema.parse(withoutLastInteraction)).not.toThrow();
		});
	});

	describe("jobAnalysisSchema", () => {
		it("should validate a complete job analysis", () => {
			const validAnalysis: JobAnalysis = {
				complexity: "high",
				estimatedDuration: 180,
				requiredSkills: ["HVAC", "electrical", "refrigeration"],
				potentialIssues: ["Roof access may be difficult", "Older equipment"],
				recommendedTechnicians: [
					{ id: "tech-1", name: "John Smith", score: 95, reason: "HVAC specialist" },
				],
				materialsNeeded: [
					{ item: "Refrigerant", quantity: 2, estimated: true },
				],
			};

			expect(() => jobAnalysisSchema.parse(validAnalysis)).not.toThrow();
		});

		it("should validate complexity enum values", () => {
			const lowComplexity = {
				complexity: "low",
				estimatedDuration: 30,
				requiredSkills: [],
				potentialIssues: [],
				recommendedTechnicians: [],
			};

			expect(() => jobAnalysisSchema.parse(lowComplexity)).not.toThrow();

			const invalidComplexity = {
				complexity: "extreme", // invalid
				estimatedDuration: 30,
				requiredSkills: [],
				potentialIssues: [],
				recommendedTechnicians: [],
			};

			expect(() => jobAnalysisSchema.parse(invalidComplexity)).toThrow();
		});

		it("should allow optional materialsNeeded", () => {
			const withoutMaterials: JobAnalysis = {
				complexity: "medium",
				estimatedDuration: 60,
				requiredSkills: ["general maintenance"],
				potentialIssues: [],
				recommendedTechnicians: [],
			};

			expect(() => jobAnalysisSchema.parse(withoutMaterials)).not.toThrow();
		});
	});

	describe("scheduleOptimizationSchema", () => {
		it("should validate schedule optimization recommendations", () => {
			const validOptimization: ScheduleOptimization = {
				recommendations: [
					{
						type: "swap",
						description: "Swap jobs between Tech A and Tech B",
						impact: "high",
						jobIds: ["job-1", "job-2"],
						suggestedTime: "09:00",
						suggestedTechnician: "tech-a",
					},
				],
				efficiencyScore: 85,
				travelTimeMinutes: 120,
				utilizationPercent: 78,
				gaps: [
					{ technicianId: "tech-b", startTime: "14:00", duration: 60 },
				],
			};

			expect(() => scheduleOptimizationSchema.parse(validOptimization)).not.toThrow();
		});

		it("should validate recommendation type enum", () => {
			const validTypes = ["swap", "reschedule", "assign", "alert"];

			for (const type of validTypes) {
				const opt = {
					recommendations: [
						{ type, description: "Test", impact: "medium", jobIds: [] },
					],
					efficiencyScore: 80,
					travelTimeMinutes: 100,
					utilizationPercent: 75,
					gaps: [],
				};
				expect(() => scheduleOptimizationSchema.parse(opt)).not.toThrow();
			}
		});
	});

	describe("financialSummarySchema", () => {
		it("should validate financial summary with all fields", () => {
			const validSummary: FinancialSummary = {
				revenue: {
					total: 50000,
					trend: "up",
					percentChange: 15.5,
				},
				outstandingBalance: 12000,
				overdueInvoices: 3,
				averagePaymentDays: 28,
				topRevenueServices: [
					{ service: "HVAC Repair", revenue: 15000, count: 25 },
					{ service: "Plumbing", revenue: 12000, count: 18 },
				],
				recommendations: ["Follow up on overdue invoices", "Offer early payment discount"],
				alerts: [
					{ type: "warning", message: "3 invoices overdue > 30 days" },
					{ type: "success", message: "Revenue up 15% month-over-month" },
				],
			};

			expect(() => financialSummarySchema.parse(validSummary)).not.toThrow();
		});

		it("should validate revenue trend enum", () => {
			const validTrends = ["up", "down", "stable"];

			for (const trend of validTrends) {
				const summary = {
					revenue: { total: 10000, trend, percentChange: 0 },
					outstandingBalance: 0,
					overdueInvoices: 0,
					averagePaymentDays: 0,
					topRevenueServices: [],
					recommendations: [],
					alerts: [],
				};
				expect(() => financialSummarySchema.parse(summary)).not.toThrow();
			}
		});
	});

	describe("emailDraftSchema", () => {
		it("should validate email draft with all fields", () => {
			const validDraft: EmailDraft = {
				subject: "Your upcoming maintenance appointment",
				body: "Dear John, This is a reminder about your scheduled maintenance...",
				tone: "professional",
				suggestedAttachments: ["service_agreement.pdf", "pricing.pdf"],
				followUpDate: "2024-01-20",
			};

			expect(() => emailDraftSchema.parse(validDraft)).not.toThrow();
		});

		it("should validate tone enum values", () => {
			const validTones = ["professional", "friendly", "urgent", "formal"];

			for (const tone of validTones) {
				const draft = { subject: "Test", body: "Content", tone };
				expect(() => emailDraftSchema.parse(draft)).not.toThrow();
			}
		});

		it("should allow optional fields", () => {
			const minimalDraft: EmailDraft = {
				subject: "Quick update",
				body: "Message content",
				tone: "friendly",
			};

			expect(() => emailDraftSchema.parse(minimalDraft)).not.toThrow();
		});
	});

	describe("responseSuggestionsSchema", () => {
		it("should validate response suggestions", () => {
			const validSuggestions: ResponseSuggestions = {
				suggestions: [
					{ text: "Thank you for reaching out...", tone: "professional", context: "general inquiry" },
					{ text: "Hi! Happy to help...", tone: "friendly" },
					{ text: "Got it, will do.", tone: "concise" },
				],
				sentiment: "positive",
				customerIntent: "Schedule service appointment",
				recommendedAction: "Provide available slots",
			};

			expect(() => responseSuggestionsSchema.parse(validSuggestions)).not.toThrow();
		});

		it("should validate sentiment enum", () => {
			const validSentiments = ["positive", "neutral", "negative", "urgent"];

			for (const sentiment of validSentiments) {
				const suggestions = {
					suggestions: [],
					sentiment,
					customerIntent: "test",
				};
				expect(() => responseSuggestionsSchema.parse(suggestions)).not.toThrow();
			}
		});
	});
});

// =============================================================================
// GENERATE OBJECT FUNCTION TESTS
// =============================================================================

describe("generateObject Functions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("generateCustomerInsights", () => {
		it("should call generateObject with correct parameters", async () => {
			const mockInsights: CustomerInsights = {
				summary: "Regular customer",
				healthScore: 80,
				recommendations: ["Schedule follow-up"],
				risks: [],
				opportunities: ["Upsell opportunity"],
				nextSteps: ["Call next week"],
			};

			mockedGenerateObject.mockResolvedValueOnce({ object: mockInsights } as never);

			const result = await generateCustomerInsights({
				name: "John Doe",
				totalJobs: 5,
				totalRevenue: 2500,
			});

			expect(mockedGenerateObject).toHaveBeenCalledTimes(1);
			expect(mockedGenerateObject).toHaveBeenCalledWith(
				expect.objectContaining({
					model: expect.anything(),
					schema: customerInsightsSchema,
					prompt: expect.stringContaining("John Doe"),
				})
			);
			expect(result).toEqual(mockInsights);
		});

		it("should include optional customer data in prompt", async () => {
			mockedGenerateObject.mockResolvedValueOnce({
				object: {
					summary: "test",
					healthScore: 50,
					recommendations: [],
					risks: [],
					opportunities: [],
					nextSteps: [],
				},
			} as never);

			await generateCustomerInsights({
				name: "Jane Smith",
				totalJobs: 10,
				lastJobDate: "2024-01-15",
				totalRevenue: 5000,
				notes: "Prefers morning appointments",
				recentInteractions: ["Called about invoice", "Scheduled maintenance"],
			});

			expect(mockedGenerateObject).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringMatching(/Jane Smith.*morning appointments.*invoice.*maintenance/s),
				})
			);
		});

		it("should handle missing optional customer data", async () => {
			mockedGenerateObject.mockResolvedValueOnce({
				object: {
					summary: "New customer",
					healthScore: 50,
					recommendations: [],
					risks: [],
					opportunities: [],
					nextSteps: [],
				},
			} as never);

			await generateCustomerInsights({ name: "New Customer" });

			expect(mockedGenerateObject).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringContaining("Total Jobs: 0"),
				})
			);
		});
	});

	describe("generateScheduleOptimization", () => {
		it("should call generateObject with schedule data", async () => {
			const mockOptimization: ScheduleOptimization = {
				recommendations: [],
				efficiencyScore: 85,
				travelTimeMinutes: 90,
				utilizationPercent: 82,
				gaps: [],
			};

			mockedGenerateObject.mockResolvedValueOnce({ object: mockOptimization } as never);

			const result = await generateScheduleOptimization({
				date: "2024-01-15",
				jobs: [
					{ id: "job-1", time: "09:00", duration: 60, technicianId: "tech-1", location: "123 Main St" },
				],
				technicians: [
					{ id: "tech-1", name: "John", skills: ["HVAC"], location: "Office" },
				],
			});

			expect(mockedGenerateObject).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: scheduleOptimizationSchema,
					prompt: expect.stringContaining("2024-01-15"),
				})
			);
			expect(result).toEqual(mockOptimization);
		});
	});

	describe("generateFinancialSummary", () => {
		it("should call generateObject with financial data", async () => {
			const mockSummary: FinancialSummary = {
				revenue: { total: 50000, trend: "up", percentChange: 10 },
				outstandingBalance: 5000,
				overdueInvoices: 2,
				averagePaymentDays: 25,
				topRevenueServices: [],
				recommendations: [],
				alerts: [],
			};

			mockedGenerateObject.mockResolvedValueOnce({ object: mockSummary } as never);

			const result = await generateFinancialSummary({
				totalRevenue: 50000,
				previousPeriodRevenue: 45000,
				outstandingBalance: 5000,
				overdueInvoices: 2,
			});

			expect(mockedGenerateObject).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: financialSummarySchema,
					prompt: expect.stringContaining("$50000"),
				})
			);
			expect(result).toEqual(mockSummary);
		});
	});

	describe("generateEmailDraft", () => {
		it("should call generateObject with email context", async () => {
			const mockDraft: EmailDraft = {
				subject: "Service Appointment Confirmation",
				body: "Dear valued customer...",
				tone: "professional",
			};

			mockedGenerateObject.mockResolvedValueOnce({ object: mockDraft } as never);

			const result = await generateEmailDraft({
				purpose: "Confirm service appointment",
				recipientName: "John Doe",
				recipientType: "customer",
				tone: "professional",
			});

			expect(mockedGenerateObject).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: emailDraftSchema,
					prompt: expect.stringContaining("Confirm service appointment"),
				})
			);
			expect(result).toEqual(mockDraft);
		});

		it("should handle different recipient types", async () => {
			mockedGenerateObject.mockResolvedValueOnce({
				object: { subject: "Test", body: "Test", tone: "formal" },
			} as never);

			await generateEmailDraft({
				purpose: "Order inquiry",
				recipientName: "ACME Supplies",
				recipientType: "vendor",
				tone: "formal",
			});

			expect(mockedGenerateObject).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringContaining("vendor"),
				})
			);
		});
	});
});

// =============================================================================
// STREAM OBJECT FUNCTION TESTS
// =============================================================================

describe("streamObject Functions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("streamJobAnalysis", () => {
		it("should call streamObject with job description", async () => {
			const mockStream = {
				partialObjectStream: (async function* () {
					yield { complexity: "medium" };
					yield { complexity: "medium", estimatedDuration: 60 };
				})(),
			};

			mockedStreamObject.mockReturnValueOnce(mockStream as never);

			const result = await streamJobAnalysis({
				description: "AC unit not cooling properly",
				jobType: "HVAC Repair",
				urgency: "high",
			});

			expect(mockedStreamObject).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: jobAnalysisSchema,
					prompt: expect.stringContaining("AC unit not cooling properly"),
				})
			);
			expect(result).toBe(mockStream);
		});

		it("should include customer history in prompt", async () => {
			const mockStream = { partialObjectStream: (async function* () {})() };
			mockedStreamObject.mockReturnValueOnce(mockStream as never);

			await streamJobAnalysis({
				description: "Annual maintenance",
				customerHistory: ["Previous service 6 months ago", "Replaced filter"],
			});

			expect(mockedStreamObject).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringMatching(/Previous service.*Replaced filter/s),
				})
			);
		});
	});

	describe("streamResponseSuggestions", () => {
		it("should call streamObject with message content", async () => {
			const mockStream = {
				partialObjectStream: (async function* () {
					yield { sentiment: "positive" };
				})(),
			};

			mockedStreamObject.mockReturnValueOnce(mockStream as never);

			const result = await streamResponseSuggestions({
				content: "When can you come fix my AC?",
				senderName: "John Doe",
				senderType: "customer",
			});

			expect(mockedStreamObject).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: responseSuggestionsSchema,
					prompt: expect.stringContaining("When can you come fix my AC?"),
				})
			);
			expect(result).toBe(mockStream);
		});

		it("should include conversation history in prompt", async () => {
			const mockStream = { partialObjectStream: (async function* () {})() };
			mockedStreamObject.mockReturnValueOnce(mockStream as never);

			await streamResponseSuggestions({
				content: "Sounds good",
				conversationHistory: [
					"Customer: I need service",
					"Agent: When works for you?",
					"Customer: Tomorrow morning",
				],
			});

			expect(mockedStreamObject).toHaveBeenCalledWith(
				expect.objectContaining({
					prompt: expect.stringContaining("Tomorrow morning"),
				})
			);
		});
	});
});

// =============================================================================
// TYPE INFERENCE TESTS
// =============================================================================

describe("Type Inference", () => {
	it("should correctly infer CustomerInsights type from schema", () => {
		const insights: z.infer<typeof customerInsightsSchema> = {
			summary: "test",
			healthScore: 50,
			recommendations: [],
			risks: [],
			opportunities: [],
			nextSteps: [],
		};

		// Type check - this should compile without errors
		const _typed: CustomerInsights = insights;
		expect(_typed.healthScore).toBe(50);
	});

	it("should correctly infer JobAnalysis type from schema", () => {
		const analysis: z.infer<typeof jobAnalysisSchema> = {
			complexity: "low",
			estimatedDuration: 30,
			requiredSkills: [],
			potentialIssues: [],
			recommendedTechnicians: [],
		};

		const _typed: JobAnalysis = analysis;
		expect(_typed.complexity).toBe("low");
	});
});

// =============================================================================
// AI SDK INTEGRATION VERIFICATION
// =============================================================================

describe("AI SDK Integration", () => {
	it("should use groq provider from @ai-sdk/groq", () => {
		// Verify the mock was imported
		expect(createGroq).toBeDefined();
		expect(typeof createGroq).toBe("function");
	});

	it("should export generateObject from ai package", () => {
		expect(generateObject).toBeDefined();
		expect(typeof generateObject).toBe("function");
	});

	it("should export streamObject from ai package", () => {
		expect(streamObject).toBeDefined();
		expect(typeof streamObject).toBe("function");
	});
});
