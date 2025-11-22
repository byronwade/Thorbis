/**
 * Chat API Route
 * Streaming chat completions with Vercel AI Gateway
 * Supports artifacts, tools, and enhanced context
 */

import { streamText, tool } from "ai";
import { z } from "zod";
import { createAIProvider } from "@/lib/ai";

export const maxDuration = 30;

// Example tools for the AI assistant
const createInvoiceTool = tool({
	description: "Create a new invoice for a customer",
	inputSchema: z.object({
		customerId: z.string().describe("The ID of the customer"),
		amount: z.number().describe("The invoice amount"),
		description: z.string().describe("Description of the invoice"),
		dueDate: z.string().optional().describe("Due date for the invoice"),
	}),
	execute: async ({ customerId, amount, description, dueDate }) => {
		// This would normally create an invoice in the database
		// For now, return a mock response
		return {
			id: `inv-${Date.now()}`,
			customerId,
			amount,
			description,
			dueDate: dueDate || new Date().toISOString(),
			status: "draft",
			createdAt: new Date().toISOString(),
		};
	},
});

const sendMessageTool = tool({
	description: "Send a text message to a phone number",
	inputSchema: z.object({
		phoneNumber: z.string().describe("The phone number to send to"),
		message: z.string().describe("The message content"),
	}),
	execute: async ({ phoneNumber, message }) => {
		// This would normally send via Telnyx or similar service
		return {
			id: `msg-${Date.now()}`,
			phoneNumber,
			message,
			status: "sent",
			sentAt: new Date().toISOString(),
		};
	},
});

const createDocumentTool = tool({
	description: "Create a new document or artifact (code, text, spreadsheet, etc.)",
	inputSchema: z.object({
		title: z.string().describe("The title of the document"),
		content: z.string().describe("The content of the document"),
		kind: z
			.enum(["text", "code", "image", "sheet"])
			.describe("The type of document"),
	}),
	execute: async ({ title, content, kind }) => {
		// This would normally save to database
		return {
			id: `doc-${Date.now()}`,
			title,
			content,
			kind,
			createdAt: new Date().toISOString(),
		};
	},
});

export async function POST(req: Request) {
	try {
		const { messages, model: requestedModel } = await req.json();

		if (!(messages && Array.isArray(messages))) {
			return Response.json({ error: "Messages are required" }, { status: 400 });
		}

		const model = createAIProvider(
			requestedModel ? { model: requestedModel } : undefined,
		);

		const result = streamText({
			model,
			messages,
			temperature: 0.7,
			tools: {
				createInvoice: createInvoiceTool,
				sendMessage: sendMessageTool,
				createDocument: createDocumentTool,
			},
			maxSteps: 5,
			system: `You are an AI assistant for a business management platform. You can help users with:
- Creating invoices and managing finances
- Sending text messages and communications
- Creating documents and artifacts
- Looking up customer information
- Scheduling appointments
- Generating reports
- And much more!

Be helpful, concise, and proactive. When you create artifacts or perform actions, explain what you're doing clearly.`,
		});

		return result.toTextStreamResponse();
	} catch (error) {
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
