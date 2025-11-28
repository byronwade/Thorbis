/**
 * FBI Crime Data API Route
 *
 * Multi-tenant crime statistics and safety assessment API.
 * Tracks usage per company for billing and quota management.
 * Note: This API uses free government data but tracking is useful for analytics.
 */

import { type NextRequest, NextResponse } from "next/server";
import { withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { fbiCrimeService } from "@/lib/services/fbi-crime-service";
import { createClient } from "@/lib/supabase/server";
import { getEndpointName, isValidAction } from "@/lib/api/endpoint-maps";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const stateAbbr = searchParams.get("state");
		const year = searchParams.get("year");
		const action = searchParams.get("action") || "state-stats";

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

		// Use centralized endpoint mapping
		if (!isValidAction("fbi_crime", action)) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		const endpoint = getEndpointName("fbi_crime", action);
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		// Execute with usage tracking (free API but still track for analytics)
		const result = await withUsageTracking(
			companyId,
			"fbi_crime",
			endpoint,
			async () => {
				switch (action) {
					case "state-stats":
						if (!stateAbbr) {
							throw new Error("state required");
						}
						return await fbiCrimeService.getStateCrimeStats(
							stateAbbr,
							year ? parseInt(year) : undefined,
						);

					case "national-stats":
						return await fbiCrimeService.getNationalCrimeStats(
							year ? parseInt(year) : undefined,
						);

					case "trends": {
						if (!stateAbbr) {
							throw new Error("state required");
						}
						const category = searchParams.get("category") || "violent-crime";
						const years = searchParams.get("years");
						return await fbiCrimeService.getCrimeTrends(
							stateAbbr,
							category as never,
							years ? parseInt(years) : undefined,
						);
					}

					case "agencies":
						if (!stateAbbr) {
							throw new Error("state required");
						}
						return await fbiCrimeService.getAgenciesInState(stateAbbr);

					case "safety-report": {
						const location = searchParams.get("location");
						if (!location) {
							throw new Error("location required");
						}
						return await fbiCrimeService.getServiceAreaSafetyReport(location);
					}

					case "evening-safety":
						if (!stateAbbr) {
							throw new Error("state required");
						}
						return await fbiCrimeService.isEveningServiceSafe(stateAbbr);

					case "equipment-theft-risk":
						if (!stateAbbr) {
							throw new Error("state required");
						}
						return await fbiCrimeService.getEquipmentTheftRisk(stateAbbr);

					case "compare-areas": {
						const states = searchParams.get("states");
						if (!states) {
							throw new Error("states required (comma-separated)");
						}
						return await fbiCrimeService.compareServiceAreas(states.split(","));
					}

					default:
						throw new Error(`Unknown action: ${action}`);
				}
			},
			{ costCents: 0 },
		); // Free API

		if (!result) {
			return NextResponse.json({ error: "No data found" }, { status: 404 });
		}

		return NextResponse.json(result, {
			headers: {
				"Cache-Control":
					"public, s-maxage=86400, stale-while-revalidate=172800",
			},
		});
	} catch (error) {
		console.error("FBI Crime API error:", error);

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
