/**
 * Chat API Route
 * Streaming chat completions with Vercel AI Gateway
 */

import { streamText } from "ai";
import { createAIProvider } from "@/lib/ai";

export async function POST(req: Request) {
	try {
		const { messages, model: requestedModel } = await req.json();

		if (!(messages && Array.isArray(messages))) {
			return Response.json({ error: "Messages are required" }, { status: 400 });
		}

		const model = createAIProvider(requestedModel ? { model: requestedModel } : undefined);

		const result = streamText({
			model,
			messages,
			temperature: 0.7,
		});

		return result.toTextStreamResponse();
	} catch (error) {
    console.error("Error:", error);
		return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
	}
}
