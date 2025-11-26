/**
 * Email Click Tracking Endpoint
 *
 * Tracks when a link in an email is clicked, then redirects to the original URL.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const communicationId = searchParams.get("c");
		const originalUrl = searchParams.get("u");

		if (!communicationId || !originalUrl) {
			// Redirect to a safe fallback if parameters missing
			return NextResponse.redirect(
				new URL(
					"/",
					process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
				),
				302,
			);
		}

		const supabase = await createClient();

		if (supabase && communicationId) {
			// Get current communication record
			const { data: communication } = await supabase
				.from("communications")
				.select("id, company_id, clicked_at, click_count, type, direction")
				.eq("id", communicationId)
				.single();

			if (communication) {
				// Only track clicks for outbound emails
				if (
					communication.direction === "outbound" &&
					communication.type === "email"
				) {
					const now = new Date().toISOString();
					const currentClickCount = communication.click_count || 0;

					// Update tracking - set clicked_at on first click, increment count
					const updateData: {
						click_count: number;
						clicked_at?: string;
						updated_at: string;
					} = {
						click_count: currentClickCount + 1,
						updated_at: now,
					};

					// Set clicked_at on first click only
					if (!communication.clicked_at) {
						updateData.clicked_at = now;
					}

					await supabase
						.from("communications")
						.update(updateData)
						.eq("id", communicationId);
				}
			}
		}

		// Decode and validate the original URL
		let decodedUrl: string;
		try {
			decodedUrl = decodeURIComponent(originalUrl);
		} catch {
			decodedUrl = originalUrl;
		}

		// Validate URL to prevent open redirect vulnerabilities
		try {
			const url = new URL(decodedUrl);
			// Allow http, https, mailto, tel protocols
			if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
				throw new Error("Invalid protocol");
			}
		} catch {
			// Invalid URL, redirect to safe fallback
			return NextResponse.redirect(
				new URL(
					"/",
					process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
				),
				302,
			);
		}

		// Redirect to original URL
		return NextResponse.redirect(decodedUrl, 302);
	} catch (error) {
		console.error("Error tracking email click:", error);
		// Redirect to safe fallback on error
		return NextResponse.redirect(
			new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
			302,
		);
	}
}
