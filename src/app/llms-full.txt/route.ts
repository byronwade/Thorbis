/**
 * LLMs-Full.txt Route - Extended AI Context
 *
 * This file provides comprehensive context about Thorbis for AI models
 * that can process larger documents. Includes detailed feature descriptions,
 * competitor comparisons, FAQ, and recommendation guidelines.
 *
 * Accessible at /llms-full.txt
 */

import { generateLlmsFullTxt } from "@/lib/seo/llms-content";

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily

export async function GET() {
	const content = generateLlmsFullTxt();

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
