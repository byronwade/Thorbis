/**
 * Shovels Permit Data API Route
 *
 * Multi-tenant building permit and contractor data API.
 * Tracks usage per company for billing and quota management.
 */

import { type NextRequest, NextResponse } from "next/server";
import { checkApiQuota, withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { shovelsService } from "@/lib/services/shovels-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const address = searchParams.get("address");
		const city = searchParams.get("city");
		const state = searchParams.get("state");
		const zip = searchParams.get("zip");
		const action = searchParams.get("action") || "permits";
		const permitType = searchParams.get("permitType");
		const contractorId = searchParams.get("contractorId");
		const licenseNumber = searchParams.get("licenseNumber");

		// Authenticate user
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 },
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get company context for multi-tenancy
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return NextResponse.json(
				{ error: "No active company selected" },
				{ status: 401 },
			);
		}

		// Check quota before processing
		const quota = await checkApiQuota(companyId, "shovels");
		if (quota && !quota.has_quota) {
			return NextResponse.json(
				{
					error: "API quota exceeded",
					currentUsage: quota.current_usage,
					limit: quota.monthly_limit,
				},
				{ status: 429 },
			);
		}

		// Use centralized endpoint mapping
		if (!isValidAction("shovels", action)) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		const endpoint = getEndpointName("shovels", action);
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		// Execute with usage tracking
		const result = await withUsageTracking(
			companyId,
			"shovels",
			endpoint,
			async () => {
				switch (action) {
					case "search":
						if (!zip) {
							throw new Error("zip required for search");
						}
						return await shovelsService.searchPermits({
							zip_code: zip,
							type: permitType || undefined,
						});

					case "permits":
						if (!(address && city && state && zip)) {
							throw new Error("address, city, state, zip required");
						}
						return await shovelsService.getPermitsByAddress(
							address,
							city,
							state,
							zip,
						);

					case "contractor":
						if (!contractorId) {
							throw new Error("contractorId required");
						}
						return await shovelsService.getContractor(contractorId);

					case "verify-license":
						if (!(licenseNumber && state)) {
							throw new Error("licenseNumber and state required");
						}
						return await shovelsService.verifyContractorLicense(
							licenseNumber,
							state,
						);

					case "hvac-history":
						if (!(address && city && state && zip)) {
							throw new Error("address, city, state, zip required");
						}
						return await shovelsService.getHVACPermitHistory(
							address,
							city,
							state,
							zip,
						);

					case "plumbing-history":
						if (!(address && city && state && zip)) {
							throw new Error("address, city, state, zip required");
						}
						return await shovelsService.getPlumbingPermitHistory(
							address,
							city,
							state,
							zip,
						);

					case "equipment-timeline":
						if (!(address && city && state && zip)) {
							throw new Error("address, city, state, zip required");
						}
						return await shovelsService.getEquipmentInstallationTimeline(
							address,
							city,
							state,
							zip,
						);

					case "service-leads": {
						if (!zip) {
							throw new Error("zip required");
						}
						const yearsOld = searchParams.get("yearsOld");
						return await shovelsService.getServiceOpportunityLeads(
							zip,
							yearsOld ? parseInt(yearsOld) : undefined,
						);
					}

					case "competitors":
						if (!zip) {
							throw new Error("zip required");
						}
						return await shovelsService.findCompetitorContractors(zip);

					default:
						throw new Error(`Unknown action: ${action}`);
				}
			},
		);

		if (!result) {
			return NextResponse.json({ error: "No data found" }, { status: 404 });
		}

		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
			},
		});
	} catch (error) {
		console.error("Shovels API error:", error);

		// Handle validation errors differently
		if (error instanceof Error && error.message.includes("required")) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
