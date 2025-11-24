/**
 * Porting Status API Route
 *
 * Polls Telnyx API to get real-time status of phone number porting orders.
 * Used by PortingStatusTracker component to show progress.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortingOrderStatus } from "@/lib/telnyx/porting";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const orderId = searchParams.get("orderId");

		if (!orderId) {
			return NextResponse.json(
				{ success: false, error: "Order ID is required" },
				{ status: 400 }
			);
		}

		// Call Telnyx API to get porting status
		const result = await getPortingOrderStatus(orderId);

		if (!result.success) {
			return NextResponse.json(
				{ success: false, error: result.error || "Failed to fetch porting status" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			status: result.data?.status,
			focDate: result.data?.focDate,
			allVerified: result.data?.status === "ported",
		});
	} catch (error) {
		console.error("Porting status API error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
