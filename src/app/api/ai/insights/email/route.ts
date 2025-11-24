/**
 * Email Draft API Route
 *
 * Generates professional email drafts
 */

import { streamObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { emailDraftSchema } from "@/lib/ai/structured-output";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { purpose, recipientName, recipientType, tone, additionalContext } =
			await req.json();

		const result = streamObject({
			model: anthropic("claude-3-5-haiku-latest"),
			schema: emailDraftSchema,
			prompt: `Draft a professional email:

Purpose: ${purpose || "General communication"}
Recipient: ${recipientName || "Customer"} (${recipientType || "customer"})
Tone: ${tone || "professional"}
Additional Context: ${additionalContext || "None"}

Create a well-structured email with:
1. Clear, relevant subject line
2. Professional greeting
3. Body that addresses the purpose
4. Appropriate closing
5. Suggested attachments if relevant
6. Follow-up date suggestion if appropriate`,
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error("Email Draft Error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
