/**
 * Email Open Tracking Endpoint
 * 
 * Tracks when an email is opened by loading the tracking pixel.
 * This endpoint returns a 1x1 transparent GIF.
 */

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 1x1 transparent GIF (base64)
const TRANSPARENT_GIF = Buffer.from(
	"R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
	"base64"
);

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const communicationId = searchParams.get("c");

		if (!communicationId) {
			// Still return pixel even if no ID (to prevent broken images)
			return new NextResponse(TRANSPARENT_GIF, {
				headers: {
					"Content-Type": "image/gif",
					"Cache-Control": "no-cache, no-store, must-revalidate",
					"Pragma": "no-cache",
					"Expires": "0",
				},
			});
		}

		const supabase = await createClient();

		if (!supabase) {
			// Still return pixel even if database unavailable
			return new NextResponse(TRANSPARENT_GIF, {
				headers: {
					"Content-Type": "image/gif",
					"Cache-Control": "no-cache, no-store, must-revalidate",
				},
			});
		}

		// Get current communication record
		const { data: communication } = await supabase
			.from("communications")
			.select("id, company_id, opened_at, open_count, type, direction")
			.eq("id", communicationId)
			.single();

		if (!communication) {
			// Still return pixel even if communication not found
			return new NextResponse(TRANSPARENT_GIF, {
				headers: {
					"Content-Type": "image/gif",
					"Cache-Control": "no-cache, no-store, must-revalidate",
				},
			});
		}

		// Only track opens for outbound emails
		if (communication.direction !== "outbound" || communication.type !== "email") {
			return new NextResponse(TRANSPARENT_GIF, {
				headers: {
					"Content-Type": "image/gif",
					"Cache-Control": "no-cache, no-store, must-revalidate",
				},
			});
		}

		const now = new Date().toISOString();
		const currentOpenCount = communication.open_count || 0;

		// Update tracking - set opened_at on first open, increment count
		const updateData: {
			open_count: number;
			opened_at?: string;
			updated_at: string;
		} = {
			open_count: currentOpenCount + 1,
			updated_at: now,
		};

		// Set opened_at on first open only
		if (!communication.opened_at) {
			updateData.opened_at = now;
		}

		await supabase
			.from("communications")
			.update(updateData)
			.eq("id", communicationId);

		// Return 1x1 transparent GIF
		return new NextResponse(TRANSPARENT_GIF, {
			headers: {
				"Content-Type": "image/gif",
				"Cache-Control": "no-cache, no-store, must-revalidate",
				"Pragma": "no-cache",
				"Expires": "0",
			},
		});
	} catch (error) {
		console.error("Error tracking email open:", error);
		// Always return pixel even on error (to prevent broken images)
		return new NextResponse(TRANSPARENT_GIF, {
			headers: {
				"Content-Type": "image/gif",
				"Cache-Control": "no-cache, no-store, must-revalidate",
			},
		});
	}
}

