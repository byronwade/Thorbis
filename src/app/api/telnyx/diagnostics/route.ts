/**
 * Telnyx Diagnostics API Endpoint
 *
 * Admin endpoint for running comprehensive Telnyx diagnostics.
 * Requires authentication via CRON_SECRET or admin access.
 */

import { type NextRequest, NextResponse } from "next/server";
import {
	diagnoseCalls,
	diagnoseSms,
	runFullDiagnostics,
} from "@/lib/telnyx/diagnostics";
import { checkProductionReadiness } from "@/lib/telnyx/production-checks";

/**
 * GET /api/telnyx/diagnostics
 *
 * Run diagnostics based on query parameters:
 * - ?type=sms - SMS diagnostics only
 * - ?type=calls - Call diagnostics only
 * - ?type=full - Full diagnostics (default)
 * - ?phoneNumber=+1234567890 - Test specific phone number
 */
export async function GET(request: NextRequest) {
	try {
		// Check authentication
		const authHeader = request.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		// Allow access via cron secret or skip auth in development
		const isAuthorized =
			(cronSecret && authHeader === `Bearer ${cronSecret}`) ||
			process.env.NODE_ENV === "development";

		if (!isAuthorized) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const type = searchParams.get("type") || "full";
		const phoneNumber = searchParams.get("phoneNumber") || undefined;

		// Run diagnostics based on type
		let diagnosticsResult;

		switch (type) {
			case "sms":
				diagnosticsResult = await diagnoseSms(phoneNumber);
				break;
			case "calls":
				diagnosticsResult = await diagnoseCalls(phoneNumber);
				break;
			case "full":
			default:
				diagnosticsResult = await runFullDiagnostics(phoneNumber);
				break;
		}

		// Also run production readiness check
		const productionStatus = await checkProductionReadiness();

		return NextResponse.json({
			success: true,
			diagnostics: diagnosticsResult,
			productionReadiness: productionStatus,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

/**
 * POST /api/telnyx/diagnostics
 *
 * Run diagnostics with JSON body:
 * {
 *   "type": "sms" | "calls" | "full",
 *   "phoneNumber": "+1234567890" (optional)
 * }
 */
export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const authHeader = request.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		const isAuthorized =
			(cronSecret && authHeader === `Bearer ${cronSecret}`) ||
			process.env.NODE_ENV === "development";

		if (!isAuthorized) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const type = body.type || "full";
		const phoneNumber = body.phoneNumber || undefined;

		// Run diagnostics based on type
		let diagnosticsResult;

		switch (type) {
			case "sms":
				diagnosticsResult = await diagnoseSms(phoneNumber);
				break;
			case "calls":
				diagnosticsResult = await diagnoseCalls(phoneNumber);
				break;
			case "full":
			default:
				diagnosticsResult = await runFullDiagnostics(phoneNumber);
				break;
		}

		// Also run production readiness check
		const productionStatus = await checkProductionReadiness();

		return NextResponse.json({
			success: true,
			diagnostics: diagnosticsResult,
			productionReadiness: productionStatus,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
