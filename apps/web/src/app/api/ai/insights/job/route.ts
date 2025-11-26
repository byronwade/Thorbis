/**
 * Job Analysis API Route
 *
 * Streams job analysis for complexity, duration, and technician recommendations
 * Powered by Google Gemini
 */

import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { jobAnalysisSchema } from "@/lib/ai/structured-output";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { description, jobType, customerHistory, equipmentDetails, urgency } =
			await req.json();

		const result = streamObject({
			model: google("gemini-2.0-flash-exp"),
			schema: jobAnalysisSchema,
			prompt: `Analyze this job request and provide detailed analysis:

Job Description: ${description || "No description provided"}
Job Type: ${jobType || "General Service"}
Urgency: ${urgency || "normal"}
Equipment: ${equipmentDetails || "Not specified"}
Customer History: ${customerHistory?.join("\n") || "No history"}

Provide:
1. Complexity assessment (low/medium/high)
2. Estimated duration in minutes
3. Required skills for this job
4. Potential issues to watch for
5. Recommended technicians (if applicable)
6. Materials/parts that might be needed`,
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error("Job Analysis Error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
