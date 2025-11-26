/**
 * Tracking Link API Route
 *
 * Public API for fetching tracking link data
 */

import { NextResponse } from "next/server";
import { getTrackingLinkByToken } from "@/lib/customer-tracking/generate-tracking-link";

export const dynamic = "force-dynamic";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ token: string }> },
) {
	const { token } = await params;

	if (!token || token.length < 8) {
		return NextResponse.json(
			{ error: "Invalid tracking token" },
			{ status: 400 },
		);
	}

	const trackingData = await getTrackingLinkByToken(token);

	if (!trackingData) {
		return NextResponse.json(
			{ error: "Tracking link not found or expired" },
			{ status: 404 },
		);
	}

	return NextResponse.json(trackingData);
}
