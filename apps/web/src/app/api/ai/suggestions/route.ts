/**
 * AI Suggestions API Route
 *
 * Generates contextual suggestions for form fields.
 * Powered by Google Gemini with structured output.
 */

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const SuggestionsSchema = z.object({
	suggestions: z
		.array(z.string())
		.describe("Array of suggested text options"),
	confidence: z
		.array(z.number().min(0).max(100))
		.describe("Confidence score for each suggestion (0-100)"),
});

export async function POST(req: Request) {
	try {
		const { fieldType, systemPrompt, context, count = 3 } = await req.json();

		if (!fieldType || !systemPrompt) {
			return Response.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const prompt = `${systemPrompt}

${context ? `Context:\n${context}\n\n` : ""}Generate exactly ${count} suggestions. Each should be unique and professional.`;

		const result = await generateObject({
			model: google("gemini-2.0-flash-exp"),
			schema: SuggestionsSchema,
			prompt,
			temperature: 0.7, // Higher temperature for variety
		});

		return Response.json({
			suggestions: result.object.suggestions,
			confidence: result.object.confidence,
		});
	} catch (error) {
		console.error("Suggestions Error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
