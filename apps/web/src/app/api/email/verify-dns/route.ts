/**
 * DNS Verification API Route
 *
 * Returns domain status from the database.
 * For SendGrid, domain authentication is configured via SendGrid dashboard.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

		// Get domain status from database
		const supabase = await createClient();
		const { data: domainData, error } = await supabase
			.from("company_email_domains")
			.select("id, domain_name, status, dns_records, is_platform_subdomain")
			.eq("domain_name", domain)
			.maybeSingle();

		if (error) {
			console.error("DNS verification API error:", error);
			return NextResponse.json(
				{ success: false, error: "Failed to fetch domain status" },
				{ status: 500 },
			);
		}

		if (!domainData) {
			return NextResponse.json(
				{ success: false, error: "Domain not found" },
				{ status: 404 },
			);
		}

		// Platform subdomains are always verified
		if (domainData.is_platform_subdomain) {
			return NextResponse.json({
				success: true,
				records: [],
				allVerified: true,
				isPlatformSubdomain: true,
				message: "Platform subdomain is automatically verified",
			});
		}

		// For custom domains, return stored DNS records
		const records = (domainData.dns_records || []) as Array<{
			type: string;
			name: string;
			value: string;
			verified?: boolean;
		}>;

		const allVerified = domainData.status === "verified";

		return NextResponse.json({
			success: true,
			records: records.map((record, index) => ({
				id: `${record.type.toLowerCase()}-${index}`,
				type: record.type,
				name: record.name,
				value: record.value,
				purpose: getPurposeLabel(record.type),
				verified: allVerified,
			})),
			allVerified,
			message: allVerified
				? "Domain is verified"
				: "Configure DNS records in SendGrid dashboard and update status here",
		});
	} catch (error) {
		console.error("DNS verification API error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Get purpose label for DNS record type
 */
function getPurposeLabel(type: string): string {
	const purposes: Record<string, string> = {
		TXT: "SPF - Authorizes sending",
		CNAME: "DKIM - Email signing",
		MX: "Email routing",
		DMARC: "DMARC - Policy",
	};
	return purposes[type] || "Email authentication";
}
