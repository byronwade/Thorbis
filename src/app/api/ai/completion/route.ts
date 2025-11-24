/**
 * AI Completion API Route
 *
 * Provides text completions and autocomplete functionality
 */

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const maxDuration = 30;

const entityPrompts: Record<string, string> = {
	job: `Complete this job description or note professionally.
Keep it concise and relevant for field service work.
Only provide the completion text, no explanations.`,

	customer: `Complete this customer note or description.
Keep it professional and relevant for customer relationship management.
Only provide the completion text, no explanations.`,

	invoice: `Complete this invoice description or note.
Keep it professional and suitable for billing documentation.
Only provide the completion text, no explanations.`,

	estimate: `Complete this estimate description or note.
Keep it professional and suitable for service quoting.
Only provide the completion text, no explanations.`,

	default: `Complete this text professionally.
Keep it concise and relevant.
Only provide the completion text, no explanations.`,
};

export async function POST(req: Request) {
	try {
		const { prompt, entityType } = await req.json();

		if (!prompt || prompt.length < 5) {
			return Response.json(
				{ error: "Prompt too short" },
				{ status: 400 }
			);
		}

		const systemPrompt = entityPrompts[entityType] || entityPrompts.default;

		const result = streamText({
			model: anthropic("claude-3-5-haiku-latest"),
			system: systemPrompt,
			prompt: `Complete this text: "${prompt}"`,
			maxTokens: 150,
			temperature: 0.3, // Lower temperature for more consistent completions
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Completion Error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
