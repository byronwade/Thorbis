/**
 * Gemini (Generative Language) API Route
 *
 * Provides AI-powered text generation and analysis.
 *
 * POST /api/gemini
 * - action: "generate" | "chat" | "embed" | "job-description" | "analyze-estimate" | "draft-email" | "summarize" | "extract" | "recommendations"
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { googleGeminiService } from "@/lib/services/google-gemini-service";

const ModelSchema = z
	.enum([
		"gemini-1.5-pro",
		"gemini-1.5-flash",
		"gemini-1.5-flash-8b",
		"gemini-1.0-pro",
	])
	.optional();

const GenerationConfigSchema = z
	.object({
		temperature: z.number().min(0).max(2).optional(),
		topK: z.number().optional(),
		topP: z.number().optional(),
		maxOutputTokens: z.number().optional(),
		stopSequences: z.array(z.string()).optional(),
	})
	.optional();

const GenerateRequestSchema = z.object({
	action: z.literal("generate"),
	prompt: z.string().min(1),
	model: ModelSchema,
	config: GenerationConfigSchema,
	systemInstruction: z.string().optional(),
});

const ChatMessageSchema = z.object({
	role: z.enum(["user", "model"]),
	parts: z.array(z.object({ text: z.string() })),
});

const ChatRequestSchema = z.object({
	action: z.literal("chat"),
	messages: z.array(ChatMessageSchema),
	newMessage: z.string().min(1),
	model: ModelSchema,
	config: GenerationConfigSchema,
	systemInstruction: z.string().optional(),
});

const EmbedRequestSchema = z.object({
	action: z.literal("embed"),
	text: z.string().min(1),
	model: z.string().optional(),
	taskType: z.string().optional(),
});

const BatchEmbedRequestSchema = z.object({
	action: z.literal("batch-embed"),
	texts: z.array(z.string().min(1)).min(1).max(100),
	model: z.string().optional(),
	taskType: z.string().optional(),
});

const JobDescriptionRequestSchema = z.object({
	action: z.literal("job-description"),
	serviceType: z.string(),
	equipment: z.string().optional(),
	symptoms: z.string().optional(),
	customerNotes: z.string().optional(),
});

const AnalyzeEstimateRequestSchema = z.object({
	action: z.literal("analyze-estimate"),
	description: z.string(),
	lineItems: z.array(
		z.object({
			name: z.string(),
			price: z.number(),
			quantity: z.number(),
		}),
	),
	laborHours: z.number().optional(),
	totalAmount: z.number(),
});

const DraftEmailRequestSchema = z.object({
	action: z.literal("draft-email"),
	purpose: z.enum([
		"appointment_confirmation",
		"follow_up",
		"estimate_sent",
		"invoice_reminder",
		"thank_you",
	]),
	customerName: z.string(),
	companyName: z.string(),
	jobDetails: z.string().optional(),
	appointmentDate: z.string().optional(),
	amount: z.number().optional(),
});

const SummarizeRequestSchema = z.object({
	action: z.literal("summarize"),
	text: z.string().min(1),
	maxLength: z.number().optional(),
	format: z.enum(["bullets", "paragraph"]).optional(),
});

const ExtractRequestSchema = z.object({
	action: z.literal("extract"),
	text: z.string().min(1),
	fields: z.array(
		z.object({
			name: z.string(),
			type: z.string(),
			description: z.string(),
		}),
	),
});

const RecommendationsRequestSchema = z.object({
	action: z.literal("recommendations"),
	services: z.array(
		z.object({
			type: z.string(),
			date: z.string(),
			equipment: z.string().optional(),
		}),
	),
	equipmentAge: z.number().optional(),
	lastMaintenanceDate: z.string().optional(),
});

const CountTokensRequestSchema = z.object({
	action: z.literal("count-tokens"),
	text: z.string(),
	model: ModelSchema,
});

const GeminiRequestSchema = z.discriminatedUnion("action", [
	GenerateRequestSchema,
	ChatRequestSchema,
	EmbedRequestSchema,
	BatchEmbedRequestSchema,
	JobDescriptionRequestSchema,
	AnalyzeEstimateRequestSchema,
	DraftEmailRequestSchema,
	SummarizeRequestSchema,
	ExtractRequestSchema,
	RecommendationsRequestSchema,
	CountTokensRequestSchema,
]);

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!googleGeminiService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"Gemini service is not configured. Set GOOGLE_GEMINI_API_KEY or GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const validatedData = GeminiRequestSchema.parse(body);

		switch (validatedData.action) {
			case "generate": {
				const result = await googleGeminiService.generateContent(
					validatedData.prompt,
					{
						model: validatedData.model,
						config: validatedData.config,
						systemInstruction: validatedData.systemInstruction,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate content" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "chat": {
				const result = await googleGeminiService.chat(
					validatedData.messages,
					validatedData.newMessage,
					{
						model: validatedData.model,
						config: validatedData.config,
						systemInstruction: validatedData.systemInstruction,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to process chat" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "embed": {
				const result = await googleGeminiService.generateEmbedding(
					validatedData.text,
					{
						model: validatedData.model,
						taskType: validatedData.taskType,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate embedding" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "batch-embed": {
				const result = await googleGeminiService.batchEmbeddings(
					validatedData.texts,
					{
						model: validatedData.model,
						taskType: validatedData.taskType,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate batch embeddings" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { embeddings: result, count: result.length },
				});
			}

			case "job-description": {
				const result = await googleGeminiService.generateJobDescription({
					serviceType: validatedData.serviceType,
					equipment: validatedData.equipment,
					symptoms: validatedData.symptoms,
					customerNotes: validatedData.customerNotes,
				});

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate job description" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { description: result },
				});
			}

			case "analyze-estimate": {
				const result = await googleGeminiService.analyzeEstimate({
					description: validatedData.description,
					lineItems: validatedData.lineItems,
					laborHours: validatedData.laborHours,
					totalAmount: validatedData.totalAmount,
				});

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to analyze estimate" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "draft-email": {
				const result = await googleGeminiService.draftCustomerEmail({
					purpose: validatedData.purpose,
					customerName: validatedData.customerName,
					companyName: validatedData.companyName,
					jobDetails: validatedData.jobDetails,
					appointmentDate: validatedData.appointmentDate,
					amount: validatedData.amount,
				});

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to draft email" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "summarize": {
				const result = await googleGeminiService.summarizeText(
					validatedData.text,
					{
						maxLength: validatedData.maxLength,
						format: validatedData.format,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to summarize text" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: { summary: result } });
			}

			case "extract": {
				const result = await googleGeminiService.extractStructuredData(
					validatedData.text,
					{ fields: validatedData.fields },
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to extract data" },
						{ status: 500 },
					);
				}

				return NextResponse.json({ success: true, data: result });
			}

			case "recommendations": {
				const result = await googleGeminiService.generateServiceRecommendations(
					{
						services: validatedData.services,
						equipmentAge: validatedData.equipmentAge,
						lastMaintenanceDate: validatedData.lastMaintenanceDate,
					},
				);

				if (!result) {
					return NextResponse.json(
						{ error: "Failed to generate recommendations" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { recommendations: result },
				});
			}

			case "count-tokens": {
				const result = await googleGeminiService.countTokens(
					validatedData.text,
					validatedData.model,
				);

				if (result === null) {
					return NextResponse.json(
						{ error: "Failed to count tokens" },
						{ status: 500 },
					);
				}

				return NextResponse.json({
					success: true,
					data: { tokenCount: result },
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Gemini API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to process Gemini request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
