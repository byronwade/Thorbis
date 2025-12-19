/**
 * Short URL Redirect Route
 *
 * Handles redirects for shortened URLs
 * GET /s/[code] - Redirects to the original URL
 */

import { type NextRequest, NextResponse } from "next/server";
import { resolveShortUrl } from "@/lib/services/url-shortener";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ code: string }> }
) {
	const { code } = await params;

	if (!code || code.length < 4 || code.length > 12) {
		return NextResponse.redirect(new URL("/", _request.url));
	}

	const result = await resolveShortUrl(code, true);

	if (!result.success || !result.originalUrl) {
		// If expired, show a specific message
		if (result.expired) {
			return new NextResponse(
				`<html>
					<head>
						<title>Link Expired</title>
						<style>
							body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
							.container { text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 400px; }
							h1 { color: #333; margin-bottom: 16px; }
							p { color: #666; margin-bottom: 24px; }
							a { color: #0066cc; text-decoration: none; }
						</style>
					</head>
					<body>
						<div class="container">
							<h1>Link Expired</h1>
							<p>This link has expired and is no longer available.</p>
							<a href="/">Go to homepage</a>
						</div>
					</body>
				</html>`,
				{
					status: 410,
					headers: { "Content-Type": "text/html" },
				}
			);
		}

		// Not found
		return NextResponse.redirect(new URL("/", _request.url));
	}

	// Redirect to the original URL
	return NextResponse.redirect(result.originalUrl);
}
