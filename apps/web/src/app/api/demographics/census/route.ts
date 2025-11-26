/**
 * Census Bureau API Route
 *
 * Multi-tenant demographics, income, and housing data API.
 * Tracks usage per company for analytics.
 * Note: This API uses free government data but tracking is useful for analytics.
 */

import { type NextRequest, NextResponse } from "next/server";
import { withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { censusBureauService } from "@/lib/services/census-bureau-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const address = searchParams.get("address");
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");
		const zipCode = searchParams.get("zipCode");
		const action = searchParams.get("action") || "demographics";

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
			demographics: "demographics",
			housing: "housing_data",
			income: "income_data",
			geography: "geography",
			geocode: "geocode",
			"market-analysis": "market_analysis",
			"zip-profile": "zip_profile",
			"income-estimate": "income_estimate",
			"expansion-analysis": "expansion_analysis",
		};

		const endpoint = endpointMap[action];
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		// Execute with usage tracking (free API but still track for analytics)
		const result = await withUsageTracking(
			companyId,
			"census_bureau",
			endpoint,
			async () => {
				switch (action) {
					case "demographics":
						if (!(lat && lng)) {
							throw new Error("lat and lng required");
						}
						return await censusBureauService.getDemographics(
							parseFloat(lat),
							parseFloat(lng),
						);

					case "housing":
						if (!(lat && lng)) {
							throw new Error("lat and lng required");
						}
						return await censusBureauService.getHousingData(
							parseFloat(lat),
							parseFloat(lng),
						);

					case "income":
						if (!(lat && lng)) {
							throw new Error("lat and lng required");
						}
						return await censusBureauService.getIncomeData(
							parseFloat(lat),
							parseFloat(lng),
						);

					case "geography":
						if (!(lat && lng)) {
							throw new Error("lat and lng required");
						}
						return await censusBureauService.getGeographyFromCoordinates(
							parseFloat(lat),
							parseFloat(lng),
						);

					case "geocode":
						if (!address) {
							throw new Error("address required");
						}
						return await censusBureauService.geocodeAddress(address);

					case "market-analysis":
						if (!address) {
							throw new Error("address required");
						}
						return await censusBureauService.analyzeServiceMarket(address);

					case "zip-profile":
						if (!zipCode) {
							throw new Error("zipCode required");
						}
						return await censusBureauService.getServiceAreaProfile(zipCode);

					case "income-estimate":
						if (!address) {
							throw new Error("address required");
						}
						return await censusBureauService.getCustomerIncomeEstimate(address);

					case "expansion-analysis": {
						const zipCodes = searchParams.get("zipCodes");
						if (!zipCodes) {
							throw new Error("zipCodes required (comma-separated)");
						}
						return await censusBureauService.analyzeExpansionOpportunities(
							zipCodes.split(","),
						);
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
		console.error("Census API error:", error);

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
