/**
 * WebRTC Credential Generation API Route
 *
 * Generates WebRTC credentials via the isolated service.
 * Safe to call - errors won't crash the main app.
 *
 * @route POST /api/webrtc/credential
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWebRTCService } from "@/services/webrtc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		// Verify authentication
		const supabase = await createClient();
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse request body
		const body = await request.json();
		const { username, ttl } = body;

		if (!username) {
			return NextResponse.json({ error: "Username required" }, { status: 400 });
		}

		// Get WebRTC service (safe - won't crash if unavailable)
		const service = getWebRTCService();

		if (!service || service.getStatus() !== "ready") {
			return NextResponse.json(
				{ error: "WebRTC service not available" },
				{ status: 503 },
			);
		}

		// Generate credential via isolated service
		const credential = await service.generateCredential(username, ttl);

		return NextResponse.json({
			success: true,
			credential,
		});
	} catch (error) {
		// Graceful error handling
		console.error("[WebRTC Credential API] Error:", error);

		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to generate credential",
			},
			{ status: 500 },
		);
	}
}
