/**
 * WebRTC Service Status API Route
 *
 * Returns the current status of the isolated WebRTC service.
 * Safe to call - will never crash the main app even if service is down.
 *
 * @route GET /api/webrtc/status
 */

import { NextResponse } from "next/server";
import { getWebRTCService } from "@/services/webrtc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
	try {
		// Get service instance (safe - returns null if unavailable)
		const service = getWebRTCService();

		if (!service) {
			return NextResponse.json(
				{
					status: "unavailable",
					healthy: false,
					error: "WebRTC service not initialized",
				},
				{ status: 503 },
			);
		}

		// Get current status
		const status = service.getStatus();

		// Perform health check (safe - times out gracefully)
		const healthy = await service.healthCheck().catch(() => false);

		return NextResponse.json({
			status,
			healthy,
			timestamp: Date.now(),
		});
	} catch (error) {
		// Graceful error handling - don't crash the app
		console.error("[WebRTC Status API] Error:", error);

		return NextResponse.json(
			{
				status: "error",
				healthy: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
