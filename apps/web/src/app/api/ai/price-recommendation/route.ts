/**
 * AI Price Recommendation API Route
 *
 * Recommends pricing for services based on:
 * - Industry standards
 * - Service type and complexity
 * - Location/market data
 * - Duration
 *
 * Powered by Google Gemini with structured output.
 */

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const PriceRecommendationSchema = z.object({
	suggestedPrice: z
		.number()
		.describe("Recommended price in dollars (not cents)"),
	priceRange: z.object({
		low: z.number().describe("Low end of typical price range"),
		high: z.number().describe("High end of typical price range"),
	}),
	confidence: z.number().min(0).max(100).describe("Confidence in recommendation"),
	reasoning: z.string().describe("Brief explanation of the pricing logic"),
	marketPosition: z
		.enum(["budget", "mid-market", "premium"])
		.describe("Where this price positions the business"),
});

export async function POST(req: Request) {
	try {
		const {
			serviceName,
			industry,
			duration,
			location,
			existingPrices,
		} = await req.json();

		if (!serviceName) {
			return Response.json(
				{ error: "Service name is required" },
				{ status: 400 },
			);
		}

		const contextParts: string[] = [];
		if (industry) contextParts.push(`Industry: ${industry}`);
		if (duration) contextParts.push(`Duration: ${duration} minutes`);
		if (location) contextParts.push(`Location: ${location}`);
		if (existingPrices?.length) {
			contextParts.push(
				`Other service prices: ${existingPrices.map((p: { name: string; price: string }) => `${p.name} ($${p.price})`).join(", ")}`,
			);
		}

		const prompt = `You are a pricing expert for field service businesses. Recommend a price for the following service.

Service: ${serviceName}
${contextParts.length > 0 ? `\nContext:\n${contextParts.join("\n")}` : ""}

Consider:
- Typical market rates for this type of service
- Labor costs and overhead
- Competitive positioning
- Value provided to customer

Provide a realistic, profitable price that's competitive in the market.`;

		const result = await generateObject({
			model: google("gemini-2.0-flash-exp"),
			schema: PriceRecommendationSchema,
			prompt,
			temperature: 0.3, // Lower for more consistent pricing
		});

		return Response.json(result.object);
	} catch (error) {
		console.error("Price Recommendation Error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
