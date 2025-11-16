import { streamText, tool } from "ai";
import { z } from "zod";
import { createAIProvider } from "@/lib/ai";

export const maxDuration = 30;

// Weather tool
const weatherTool = tool({
	description: "Get the current weather for a location",
	inputSchema: z.object({
		location: z.string().describe("The city and state, e.g. San Francisco, CA"),
	}),
	execute: async ({ location }) => {
		// Mock weather data
		return {
			location,
			temperature: 72,
			conditions: "Sunny",
			humidity: 45,
		};
	},
});

// Document creation tool
const createDocumentTool = tool({
	description: "Create a new document (code, text, or other artifact)",
	inputSchema: z.object({
		title: z.string().describe("The title of the document"),
		content: z.string().describe("The content of the document"),
		kind: z.enum(["text", "code", "image", "sheet"]).describe("The type of document"),
	}),
	execute: async ({ title, content, kind }) => {
		// This would normally save to database
		// For now, just return the document data
		return {
			id: `doc-${Date.now()}`,
			title,
			content,
			kind,
			createdAt: new Date().toISOString(),
		};
	},
});

export async function POST(request: Request) {
	try {
		const { messages, model = "gpt-4o" } = await request.json();

		// Determine provider based on model
		let provider: "openai" | "anthropic" | "google" = "openai";
		if (model.includes("claude")) {
			provider = "anthropic";
		} else if (model.includes("gemini")) {
			provider = "google";
		}

		// Create AI provider
		const aiModel = createAIProvider({
			provider,
			model,
		});

		// Stream the response with tools
		const result = await streamText({
			model: aiModel,
			messages,
			tools: {
				getWeather: weatherTool,
				createDocument: createDocumentTool,
			},
			temperature: 0.7,
		});

		return result.toTextStreamResponse();
	} catch (error) {
    console.error("Error:", error);
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "An error occurred",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}
