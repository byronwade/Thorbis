/**
 * DNS Verification API Route
 *
 * Verifies DNS records for custom email domains via Resend API.
 * Used by DNSVerificationTracker component to show real-time verification status.
 */

import { type NextRequest, NextResponse } from "next/server";
import { verifyDomainDNS } from "@/lib/email/resend-domains";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const domain = searchParams.get("domain");

		if (!domain) {
			return NextResponse.json(
				{ success: false, error: "Domain is required" },
				{ status: 400 },
			);
		}

		// Call Resend API to verify DNS records
		const result = await verifyDomainDNS(domain);

		if (!result.success) {
			return NextResponse.json(
				{ success: false, error: result.error || "Failed to verify DNS" },
				{ status: 500 },
			);
		}

		// Check if all records are verified
		const allVerified = result.records.every((record: any) => record.verified);

		return NextResponse.json({
			success: true,
			records: result.records,
			allVerified,
		});
	} catch (error) {
		console.error("DNS verification API error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
