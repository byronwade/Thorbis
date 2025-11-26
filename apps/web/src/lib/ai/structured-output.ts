/**
 * Structured Output Generation
 *
 * Type-safe structured data generation using AI SDK's generateObject and streamObject
 * For generating insights, reports, and structured data from AI
 */

import { google } from "@ai-sdk/google";
import { generateObject, streamObject } from "ai";
import { z } from "zod";

// Google Gemini models for structured output generation
const geminiFlash = google("gemini-2.0-flash-exp");
const geminiPro = google("gemini-1.5-pro");

/**
 * Insight schemas for different types of AI-generated insights
 */

// Customer insights
export const customerInsightsSchema = z.object({
	summary: z.string().describe("Brief summary of customer relationship"),
	healthScore: z.number().min(0).max(100).describe("Customer health score"),
	recommendations: z
		.array(z.string())
		.describe("Recommended actions for this customer"),
	risks: z.array(z.string()).describe("Potential risks or concerns"),
	opportunities: z
		.array(z.string())
		.describe("Upsell or service opportunities"),
	lastInteraction: z
		.string()
		.optional()
		.describe("Last significant interaction"),
	nextSteps: z.array(z.string()).describe("Suggested next steps"),
});

// Job analysis
export const jobAnalysisSchema = z.object({
	complexity: z
		.enum(["low", "medium", "high"])
		.describe("Job complexity level"),
	estimatedDuration: z.number().describe("Estimated duration in minutes"),
	requiredSkills: z.array(z.string()).describe("Skills needed for this job"),
	potentialIssues: z.array(z.string()).describe("Potential challenges"),
	recommendedTechnicians: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				score: z.number(),
				reason: z.string(),
			}),
		)
		.describe("Recommended technicians with reasons"),
	materialsNeeded: z
		.array(
			z.object({
				item: z.string(),
				quantity: z.number(),
				estimated: z.boolean(),
			}),
		)
		.optional(),
});

// Schedule optimization
export const scheduleOptimizationSchema = z.object({
	recommendations: z.array(
		z.object({
			type: z.enum(["swap", "reschedule", "assign", "alert"]),
			description: z.string(),
			impact: z.enum(["high", "medium", "low"]),
			jobIds: z.array(z.string()),
			suggestedTime: z.string().optional(),
			suggestedTechnician: z.string().optional(),
		}),
	),
	efficiencyScore: z.number().min(0).max(100),
	travelTimeMinutes: z.number(),
	utilizationPercent: z.number(),
	gaps: z.array(
		z.object({
			technicianId: z.string(),
			startTime: z.string(),
			duration: z.number(),
		}),
	),
});

// Financial summary
export const financialSummarySchema = z.object({
	revenue: z.object({
		total: z.number(),
		trend: z.enum(["up", "down", "stable"]),
		percentChange: z.number(),
	}),
	outstandingBalance: z.number(),
	overdueInvoices: z.number(),
	averagePaymentDays: z.number(),
	topRevenueServices: z.array(
		z.object({
			service: z.string(),
			revenue: z.number(),
			count: z.number(),
		}),
	),
	recommendations: z.array(z.string()),
	alerts: z.array(
		z.object({
			type: z.enum(["warning", "info", "success"]),
			message: z.string(),
		}),
	),
});

// Email draft
export const emailDraftSchema = z.object({
	subject: z.string(),
	body: z.string(),
	tone: z.enum(["professional", "friendly", "urgent", "formal"]),
	suggestedAttachments: z.array(z.string()).optional(),
	followUpDate: z.string().optional(),
});

// Message response suggestions
export const responseSuggestionsSchema = z.object({
	suggestions: z.array(
		z.object({
			text: z.string(),
			tone: z.enum(["professional", "friendly", "concise"]),
			context: z.string().optional(),
		}),
	),
	sentiment: z.enum(["positive", "neutral", "negative", "urgent"]),
	customerIntent: z.string(),
	recommendedAction: z.string().optional(),
});

/**
 * Type exports
 */
export type CustomerInsights = z.infer<typeof customerInsightsSchema>;
export type JobAnalysis = z.infer<typeof jobAnalysisSchema>;
export type ScheduleOptimization = z.infer<typeof scheduleOptimizationSchema>;
export type FinancialSummary = z.infer<typeof financialSummarySchema>;
export type EmailDraft = z.infer<typeof emailDraftSchema>;
export type ResponseSuggestions = z.infer<typeof responseSuggestionsSchema>;

/**
 * Generate customer insights
 *
 * @param customerData - Customer data to analyze
 * @returns Structured customer insights
 *
 * @example
 * ```ts
 * const insights = await generateCustomerInsights({
 *   name: "John Doe",
 *   totalJobs: 15,
 *   lastJobDate: "2024-01-15",
 *   totalRevenue: 5000,
 * });
 *
 * console.log(insights.healthScore); // 85
 * console.log(insights.recommendations); // ["Schedule annual maintenance", ...]
 * ```
 */
export async function generateCustomerInsights(customerData: {
	name: string;
	totalJobs?: number;
	lastJobDate?: string;
	totalRevenue?: number;
	notes?: string;
	recentInteractions?: string[];
}): Promise<CustomerInsights> {
	const { object } = await generateObject({
		model: geminiFlash, // Use faster model for insights
		schema: customerInsightsSchema,
		prompt: `Analyze this customer and provide insights:
Customer: ${customerData.name}
Total Jobs: ${customerData.totalJobs || 0}
Last Job: ${customerData.lastJobDate || "Never"}
Total Revenue: $${customerData.totalRevenue || 0}
Notes: ${customerData.notes || "None"}
Recent Interactions: ${customerData.recentInteractions?.join(", ") || "None"}

Provide actionable insights, recommendations, and identify any risks or opportunities.`,
	});

	return object;
}

/**
 * Stream job analysis for real-time updates
 *
 * @param jobDescription - Job description and context
 * @returns AsyncIterable of partial job analysis
 *
 * @example
 * ```tsx
 * const { partialObjectStream } = await streamJobAnalysis({
 *   description: "HVAC repair - unit not cooling",
 *   customerHistory: ["Previous AC repair 6 months ago"],
 * });
 *
 * for await (const partial of partialObjectStream) {
 *   console.log(partial.complexity); // Updates as it streams
 * }
 * ```
 */
export async function streamJobAnalysis(jobDescription: {
	description: string;
	jobType?: string;
	customerHistory?: string[];
	equipmentDetails?: string;
	urgency?: "low" | "normal" | "high" | "emergency";
}) {
	return streamObject({
		model: geminiPro,
		schema: jobAnalysisSchema,
		prompt: `Analyze this job request and provide detailed analysis:

Job Description: ${jobDescription.description}
Job Type: ${jobDescription.jobType || "General Service"}
Urgency: ${jobDescription.urgency || "normal"}
Equipment: ${jobDescription.equipmentDetails || "Not specified"}
Customer History: ${jobDescription.customerHistory?.join("\n") || "No history"}

Provide:
1. Complexity assessment
2. Time estimate
3. Required skills
4. Potential issues to watch for
5. Best technician recommendations`,
	});
}

/**
 * Generate schedule optimization suggestions
 *
 * @param scheduleData - Current schedule data
 * @returns Schedule optimization recommendations
 */
export async function generateScheduleOptimization(scheduleData: {
	date: string;
	jobs: Array<{
		id: string;
		time: string;
		duration: number;
		technicianId: string;
		location?: string;
	}>;
	technicians: Array<{
		id: string;
		name: string;
		skills: string[];
		location?: string;
	}>;
}): Promise<ScheduleOptimization> {
	const { object } = await generateObject({
		model: geminiFlash,
		schema: scheduleOptimizationSchema,
		prompt: `Optimize this schedule for ${scheduleData.date}:

Jobs:
${scheduleData.jobs
	.map(
		(j) =>
			`- ${j.id}: ${j.time}, ${j.duration}min, Tech: ${j.technicianId}, Location: ${j.location || "Unknown"}`,
	)
	.join("\n")}

Technicians:
${scheduleData.technicians.map((t) => `- ${t.name} (${t.id}): Skills: ${t.skills.join(", ")}, Location: ${t.location || "Unknown"}`).join("\n")}

Provide optimization recommendations to:
1. Minimize travel time
2. Maximize technician utilization
3. Balance workload
4. Identify any scheduling conflicts or gaps`,
	});

	return object;
}

/**
 * Generate financial summary
 *
 * @param financialData - Financial data to analyze
 * @returns Financial summary with recommendations
 */
export async function generateFinancialSummary(financialData: {
	totalRevenue: number;
	previousPeriodRevenue?: number;
	outstandingBalance: number;
	overdueInvoices: number;
	recentPayments?: Array<{ amount: number; daysToPayment: number }>;
	topServices?: Array<{ name: string; revenue: number; count: number }>;
}): Promise<FinancialSummary> {
	const { object } = await generateObject({
		model: geminiFlash,
		schema: financialSummarySchema,
		prompt: `Analyze this financial data and provide summary:

Current Period Revenue: $${financialData.totalRevenue}
Previous Period Revenue: $${financialData.previousPeriodRevenue || "N/A"}
Outstanding Balance: $${financialData.outstandingBalance}
Overdue Invoices: ${financialData.overdueInvoices}
Recent Payments: ${financialData.recentPayments?.length || 0} payments
Top Services: ${financialData.topServices?.map((s) => s.name).join(", ") || "N/A"}

Provide:
1. Revenue analysis with trend
2. Cash flow health assessment
3. Recommendations for improvement
4. Any alerts or concerns`,
	});

	return object;
}

/**
 * Generate email draft
 *
 * @param context - Email context
 * @returns Structured email draft
 */
export async function generateEmailDraft(context: {
	purpose: string;
	recipientName: string;
	recipientType: "customer" | "vendor" | "team";
	tone?: "professional" | "friendly" | "urgent" | "formal";
	additionalContext?: string;
}): Promise<EmailDraft> {
	const { object } = await generateObject({
		model: geminiFlash,
		schema: emailDraftSchema,
		prompt: `Draft an email for:

Purpose: ${context.purpose}
Recipient: ${context.recipientName} (${context.recipientType})
Tone: ${context.tone || "professional"}
Additional Context: ${context.additionalContext || "None"}

Create a well-structured email with appropriate subject line.`,
	});

	return object;
}

/**
 * Stream response suggestions for incoming messages
 *
 * @param message - Incoming message to respond to
 * @returns AsyncIterable of response suggestions
 */
export async function streamResponseSuggestions(message: {
	content: string;
	senderName?: string;
	senderType?: "customer" | "vendor" | "team";
	conversationHistory?: string[];
}) {
	return streamObject({
		model: geminiFlash,
		schema: responseSuggestionsSchema,
		prompt: `Generate response suggestions for this message:

From: ${message.senderName || "Unknown"} (${message.senderType || "customer"})
Message: "${message.content}"

Previous conversation:
${message.conversationHistory?.slice(-3).join("\n") || "No history"}

Provide:
1. 2-3 response suggestions with different tones
2. Sentiment analysis of the incoming message
3. Customer intent
4. Recommended action if any`,
	});
}
