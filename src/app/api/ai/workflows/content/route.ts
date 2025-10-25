/**
 * Content Generation Workflow API
 */

import { contentGenerationWorkflow, WorkflowEngine } from "@/lib/ai/workflows";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, tone, length, keywords } = body;

    if (!topic) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    // Execute workflow
    const result = await WorkflowEngine.execute(contentGenerationWorkflow, {
      topic,
      tone: tone || "professional",
      length: length || "medium",
      keywords: keywords || [],
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
