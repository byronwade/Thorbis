/**
 * CrimeoMeter Real-time Crime Data API Route
 *
 * Multi-tenant real-time crime incidents and safety scores API.
 * Tracks usage per company for billing and quota management.
 */

import { type NextRequest, NextResponse } from "next/server";
import { checkApiQuota, withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { crimeoMeterService } from "@/lib/services/crimeometer-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");
		const address = searchParams.get("address");
		const action = searchParams.get("action") || "safety";

		if (!(lat && lng)) {
			return NextResponse.json(
				{ error: "lat and lng required" },
				{ status: 400 },
			);
		}

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

		// Check quota before processing (paid API)
		const quota = await checkApiQuota(companyId, "crimeometer");
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

		const latNum = parseFloat(lat);
		const lngNum = parseFloat(lng);

		// Map action to endpoint name for tracking
		const endpointMap: Record<string, string> = {
			incidents: "incidents",
			safety: "safety_score",
			report: "safety_report",
			"service-call": "service_call_safety",
			"evening-check": "evening_check",
			"rank-locations": "rank_locations",
			"upsell-opportunities": "upsell_opportunities",
		};

		const endpoint = endpointMap[action];
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		// Execute with usage tracking
		const result = await withUsageTracking(
			companyId,
			"crimeometer",
			endpoint,
			async () => {
				switch (action) {
					case "incidents": {
						const radius = searchParams.get("radius");
						const startDate = searchParams.get("startDate");
						const endDate = searchParams.get("endDate");
						const limit = searchParams.get("limit");
						return await crimeoMeterService.getCrimeIncidents(latNum, lngNum, {
							radius: radius ? parseInt(radius) : undefined,
							startDate: startDate || undefined,
							endDate: endDate || undefined,
							limit: limit ? parseInt(limit) : undefined,
						});
					}

					case "safety":
						return await crimeoMeterService.getSafetyScore(latNum, lngNum);

					case "report": {
						const reportRadius = searchParams.get("radius");
						return await crimeoMeterService.getLocationSafetyReport(
							latNum,
							lngNum,
							reportRadius ? parseInt(reportRadius) : undefined,
						);
					}

					case "service-call":
						if (!address) {
							throw new Error("address required for service-call action");
						}
						return await crimeoMeterService.getServiceCallSafety(
							address,
							latNum,
							lngNum,
						);

					case "evening-check":
						return await crimeoMeterService.isEveningAppointmentSafe(
							latNum,
							lngNum,
						);

					case "rank-locations": {
						const locations = searchParams.get("locations");
						if (!locations) {
							throw new Error("locations required (JSON array)");
						}
						try {
							const parsedLocations = JSON.parse(locations);
							return await crimeoMeterService.rankLocationsBySafety(
								parsedLocations,
							);
						} catch {
							throw new Error("Invalid locations JSON");
						}
					}

					case "upsell-opportunities":
						return await crimeoMeterService.getSecurityUpsellOpportunities(
							latNum,
							lngNum,
						);

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
		console.error("CrimeoMeter API error:", error);

		// Handle validation errors differently
		if (
			error instanceof Error &&
			(error.message.includes("required") || error.message.includes("Invalid"))
		) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
