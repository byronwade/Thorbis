/**
 * Customer Insights API Route
 *
 * Streams customer insights using generateObject with schema validation
 */

import { streamObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { customerInsightsSchema } from "@/lib/ai/structured-output";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { customerId, name, totalJobs, lastJobDate, totalRevenue, notes, recentInteractions } =
			await req.json();

		const result = streamObject({
			model: anthropic("claude-3-5-haiku-latest"),
			schema: customerInsightsSchema,
			prompt: `Analyze this customer and provide insights:

Customer ID: ${customerId || "Unknown"}
Customer: ${name || "Unknown Customer"}
Total Jobs: ${totalJobs || 0}
Last Job: ${lastJobDate || "Never"}
Total Revenue: $${totalRevenue || 0}
Notes: ${notes || "None"}
Recent Interactions: ${recentInteractions?.join(", ") || "None"}

Provide actionable insights including:
1. A brief summary of the customer relationship
2. Health score (0-100) based on engagement and revenue
3. Recommendations for improving the relationship
4. Any risks or concerns
5. Upsell or service opportunities
6. Suggested next steps`,
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error("Customer Insights Error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
