/**
 * Code Review Workflow API
 */

import { codeReviewWorkflow, WorkflowEngine } from "@/lib/ai/workflows";

export const maxDuration = 60;

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { code, language, context } = body;

		if (!(code && language)) {
			return Response.json({ error: "Code and language are required" }, { status: 400 });
		}

		// Execute workflow
		const result = await WorkflowEngine.execute(codeReviewWorkflow, {
			code,
			language,
			context,
		});

		return Response.json(result);
	} catch (error) {
    console.error("Error:", error);
		return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
	}
}
