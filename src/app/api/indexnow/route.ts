/**
 * IndexNow API Route
 *
 * Instantly notify Bing, Yandex, and other search engines when content changes.
 * This speeds up indexing significantly - especially important since Bing
 * feeds data to ChatGPT and other AI systems.
 *
 * Usage: POST /api/indexnow with { urls: string[] }
 *
 * @see https://www.indexnow.org/
 */

import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "thorbis2024indexnowkey";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";

// IndexNow endpoints - submit to one, all participating engines get notified
const INDEXNOW_ENDPOINTS = [
	"https://api.indexnow.org/indexnow",
	"https://www.bing.com/indexnow",
];

type IndexNowRequest = {
	urls: string[];
};

/**
 * Submit URLs to IndexNow for instant indexing
 */
export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as IndexNowRequest;
		const { urls } = body;

		if (!urls || !Array.isArray(urls) || urls.length === 0) {
			return NextResponse.json(
				{ error: "urls array is required" },
				{ status: 400 }
			);
		}

		// Limit to 10,000 URLs per request (IndexNow limit)
		const limitedUrls = urls.slice(0, 10000);

		// Normalize URLs to full paths
		const fullUrls = limitedUrls.map((url) =>
			url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`
		);

		const payload = {
			host: new URL(SITE_URL).hostname,
			key: INDEXNOW_KEY,
			keyLocation: `${SITE_URL}/indexnow-key.txt`,
			urlList: fullUrls,
		};

		// Submit to IndexNow (only need one endpoint - they share data)
		const response = await fetch(INDEXNOW_ENDPOINTS[0], {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify(payload),
		});

		if (response.ok || response.status === 202) {
			return NextResponse.json({
				success: true,
				message: `Submitted ${fullUrls.length} URLs to IndexNow`,
				urls: fullUrls,
			});
		}

		const errorText = await response.text();
		return NextResponse.json(
			{
				success: false,
				error: `IndexNow returned ${response.status}: ${errorText}`,
			},
			{ status: response.status }
		);
	} catch (error) {
		console.error("IndexNow submission error:", error);
		return NextResponse.json(
			{ error: "Failed to submit to IndexNow" },
			{ status: 500 }
		);
	}
}

/**
 * GET handler for manual URL submission via query param
 * Usage: GET /api/indexnow?url=/blog/my-post
 */
export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");

	if (!url) {
		return NextResponse.json(
			{
				message: "IndexNow API endpoint",
				usage: {
					POST: "POST /api/indexnow with { urls: string[] }",
					GET: "GET /api/indexnow?url=/path/to/page",
				},
				key: INDEXNOW_KEY,
				keyLocation: `${SITE_URL}/indexnow-key.txt`,
			},
			{ status: 200 }
		);
	}

	// Redirect to POST handler
	const fullUrl = url.startsWith("http")
		? url
		: `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;

	const payload = {
		host: new URL(SITE_URL).hostname,
		key: INDEXNOW_KEY,
		keyLocation: `${SITE_URL}/indexnow-key.txt`,
		urlList: [fullUrl],
	};

	try {
		const response = await fetch(INDEXNOW_ENDPOINTS[0], {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify(payload),
		});

		if (response.ok || response.status === 202) {
			return NextResponse.json({
				success: true,
				message: `Submitted ${fullUrl} to IndexNow`,
			});
		}

		return NextResponse.json(
			{ success: false, error: `IndexNow returned ${response.status}` },
			{ status: response.status }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to submit to IndexNow" },
			{ status: 500 }
		);
	}
}
