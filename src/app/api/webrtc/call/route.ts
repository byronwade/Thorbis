/**
 * WebRTC Call Management API Route
 *
 * Handles call operations (make, answer, end) via the isolated service.
 * Safe to call - errors won't crash the main app.
 *
 * @route POST /api/webrtc/call
 */

import { NextRequest, NextResponse } from "next/server";
import { getWebRTCService } from "@/services/webrtc";
import { createClient } from "@/lib/supabase/server";

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
		const { action, phoneNumber, callId } = body;

		if (!action) {
			return NextResponse.json({ error: "Action required" }, { status: 400 });
		}

		// Get WebRTC service (safe - won't crash if unavailable)
		const service = getWebRTCService();

		if (!service || service.getStatus() !== "ready") {
			return NextResponse.json({ error: "WebRTC service not available" }, { status: 503 });
		}

		// Handle different actions
		switch (action) {
			case "make": {
				if (!phoneNumber) {
					return NextResponse.json({ error: "Phone number required" }, { status: 400 });
				}

				await service.makeCall(phoneNumber);

				return NextResponse.json({
					success: true,
					call: {
						id: `call-${Date.now()}`,
						phoneNumber,
						direction: "outgoing",
						status: "dialing",
					},
				});
			}

			case "end": {
				if (!callId) {
					return NextResponse.json({ error: "Call ID required" }, { status: 400 });
				}

				await service.endCall(callId);

				return NextResponse.json({
					success: true,
					message: "Call ended",
				});
			}

			case "answer": {
				if (!callId) {
					return NextResponse.json({ error: "Call ID required" }, { status: 400 });
				}

				await service.answerCall(callId);

				return NextResponse.json({
					success: true,
					message: "Call answered",
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		// Graceful error handling
		console.error("[WebRTC Call API] Error:", error);

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Call operation failed",
			},
			{ status: 500 }
		);
	}
}
