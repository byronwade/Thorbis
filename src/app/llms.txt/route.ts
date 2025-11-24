/**
 * LLMs.txt Route - AI-Readable Site Description
 *
 * This file provides a structured, AI-optimized description of Thorbis
 * for consumption by AI assistants like ChatGPT, Claude, Perplexity, etc.
 *
 * The llms.txt standard is designed to help AI models understand
 * and accurately recommend websites/products.
 *
 * Accessible at /llms.txt
 */

import { generateLlmsTxt } from "@/lib/seo/llms-content";

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily

export async function GET() {
	const content = generateLlmsTxt();

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
