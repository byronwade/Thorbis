import { convertToModelMessages, streamText, tool } from "ai";
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
		kind: z
			.enum(["text", "code", "image", "sheet"])
			.describe("The type of document"),
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
		const { messages, model = "llama-3.3-70b-versatile" } = await request.json();

		// Create Groq AI provider (free tier)
		const aiModel = createAIProvider({
			provider: "groq",
			model,
		});

		// AI SDK v5: Convert UIMessage[] (from client) to ModelMessage[] (for streamText)
		const modelMessages = convertToModelMessages(messages);

		// Stream the response with tools
		const result = await streamText({
			model: aiModel,
			messages: modelMessages,
			tools: {
				getWeather: weatherTool,
				createDocument: createDocumentTool,
			},
			temperature: 0.7,
		});

		// AI SDK v5: Use toUIMessageStreamResponse for full-featured streaming with tools
		return result.toUIMessageStreamResponse();
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "An error occurred",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
