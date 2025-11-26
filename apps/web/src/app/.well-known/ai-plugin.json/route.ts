/**
 * AI Plugin Manifest Route (ChatGPT Plugin Standard)
 *
 * This file provides a ChatGPT-compatible plugin manifest that helps
 * AI assistants understand how to interact with and recommend Thorbis.
 *
 * While the ChatGPT plugin ecosystem has evolved, this manifest remains
 * useful for AI discovery and provides structured metadata about the product.
 *
 * Accessible at /.well-known/ai-plugin.json
 */

import { generateAiPluginManifest } from "@/lib/seo/llms-content";

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily

export async function GET() {
	const manifest = generateAiPluginManifest();

	return new Response(JSON.stringify(manifest, null, 2), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
