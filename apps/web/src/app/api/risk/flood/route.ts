/**
 * FEMA Flood Data API Route
 *
 * Multi-tenant flood zone and risk data API.
 * Tracks usage per company for billing and quota management.
 * Note: This API uses free government data but tracking is useful for analytics.
 */

import { type NextRequest, NextResponse } from "next/server";
import { withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { femaFloodService } from "@/lib/services/fema-flood-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const address = searchParams.get("address");
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");
		const action = searchParams.get("action") || "zone";

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

		// Map action to endpoint name for tracking
		const endpointMap: Record<string, string> = {
			zone: "flood_zone",
			panel: "map_panel",
			community: "community_info",
			bfe: "base_flood_elevation",
			report: "flood_report",
			"property-data": "property_data",
			"equipment-compliance": "equipment_compliance",
			"estimate-considerations": "estimate_considerations",
			"insurance-discount": "insurance_discount",
		};

		const endpoint = endpointMap[action];
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		// Execute with usage tracking (free API but still track for analytics)
		const result = await withUsageTracking(
			companyId,
			"fema_flood",
			endpoint,
			async () => {
				switch (action) {
					case "zone":
						if (lat && lng) {
							return await femaFloodService.getFloodZoneByCoordinates(
								parseFloat(lat),
								parseFloat(lng),
							);
						} else if (address) {
							return await femaFloodService.getFloodZoneByAddress(address);
						} else {
							throw new Error("lat/lng or address required");
						}

					case "panel":
						if (!(lat && lng)) {
							throw new Error("lat and lng required");
						}
						return await femaFloodService.getFloodMapPanel(
							parseFloat(lat),
							parseFloat(lng),
						);

					case "community":
						if (!(lat && lng)) {
							throw new Error("lat and lng required");
						}
						return await femaFloodService.getCommunityInfo(
							parseFloat(lat),
							parseFloat(lng),
						);

					case "bfe":
						if (!(lat && lng)) {
							throw new Error("lat and lng required");
						}
						return await femaFloodService.getBaseFloodElevation(
							parseFloat(lat),
							parseFloat(lng),
						);

					case "report":
						if (!address) {
							throw new Error("address required");
						}
						return await femaFloodService.getFloodRiskReport(address);

					case "property-data":
						if (!address) {
							throw new Error("address required");
						}
						return await femaFloodService.getPropertyFloodData(address);

					case "equipment-compliance": {
						if (!address) {
							throw new Error("address required");
						}
						const elevation = searchParams.get("elevation");
						if (!elevation) {
							throw new Error("elevation required");
						}
						return await femaFloodService.checkEquipmentPlacementCompliance(
							address,
							parseFloat(elevation),
						);
					}

					case "estimate-considerations":
						if (!address) {
							throw new Error("address required");
						}
						return await femaFloodService.getEstimateFloodConsiderations(
							address,
						);

					case "insurance-discount":
						if (!address) {
							throw new Error("address required");
						}
						return await femaFloodService.checkFloodInsuranceDiscount(address);

					default:
						throw new Error(`Unknown action: ${action}`);
				}
			},
			{ costCents: 0 },
		); // Free API

		if (result === null || result === undefined) {
			return NextResponse.json({ error: "No data found" }, { status: 404 });
		}

		return NextResponse.json(result, {
			headers: {
				"Cache-Control":
					"public, s-maxage=86400, stale-while-revalidate=172800",
			},
		});
	} catch (error) {
		console.error("FEMA Flood API error:", error);

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
