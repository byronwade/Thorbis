/**
 * PerilPulse Environmental Risk API Route
 *
 * Multi-tenant environmental hazard and natural disaster risk API.
 * Tracks usage per company for billing and quota management.
 * Note: Uses mix of free (USGS/NOAA) and paid data sources.
 */

import { type NextRequest, NextResponse } from "next/server";
import { checkApiQuota, withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { perilPulseService } from "@/lib/services/perilpulse-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");
		const address = searchParams.get("address");
		const action = searchParams.get("action") || "report";

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

		// Check quota for paid actions
		const paidActions = ["report", "property-assessment", "seasonal-plan"];
		if (paidActions.includes(action)) {
			const quota = await checkApiQuota(companyId, "perilpulse");
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
		}

		const latNum = parseFloat(lat);
		const lngNum = parseFloat(lng);

		// Map action to endpoint name for tracking
		const endpointMap: Record<string, string> = {
			earthquakes: "earthquakes",
			"weather-alerts": "weather_alerts",
			report: "environmental_report",
			"property-assessment": "property_assessment",
			"seasonal-plan": "seasonal_plan",
			"dispatch-safety": "dispatch_safety",
		};

		const endpoint = endpointMap[action];
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		// Determine cost based on action (some use free government data)
		const freeActions = ["earthquakes", "weather-alerts", "dispatch-safety"];
		const costCents = freeActions.includes(action) ? 0 : undefined;

		// Execute with usage tracking
		const result = await withUsageTracking(
			companyId,
			"perilpulse",
			endpoint,
			async () => {
				switch (action) {
					case "earthquakes": {
						const radiusKm = searchParams.get("radiusKm");
						const days = searchParams.get("days");
						const minMagnitude = searchParams.get("minMagnitude");
						return await perilPulseService.getRecentEarthquakes(
							latNum,
							lngNum,
							{
								radiusKm: radiusKm ? parseInt(radiusKm) : undefined,
								days: days ? parseInt(days) : undefined,
								minMagnitude: minMagnitude
									? parseFloat(minMagnitude)
									: undefined,
							},
						);
					}

					case "weather-alerts":
						return await perilPulseService.getWeatherAlerts(latNum, lngNum);

					case "report":
						return await perilPulseService.getEnvironmentalRiskReport(
							latNum,
							lngNum,
							address || undefined,
						);

					case "property-assessment":
						if (!address) {
							throw new Error("address required");
						}
						return await perilPulseService.getPropertyHazardAssessment(
							address,
							latNum,
							lngNum,
						);

					case "seasonal-plan":
						return await perilPulseService.getSeasonalServicePlan(
							latNum,
							lngNum,
						);

					case "dispatch-safety":
						return await perilPulseService.checkDispatchSafety(latNum, lngNum);

					default:
						throw new Error(`Unknown action: ${action}`);
				}
			},
			{ costCents },
		);

		if (!result) {
			return NextResponse.json({ error: "No data found" }, { status: 404 });
		}

		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
			},
		});
	} catch (error) {
		console.error("PerilPulse API error:", error);

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
