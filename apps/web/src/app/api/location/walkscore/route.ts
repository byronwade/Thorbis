/**
 * Walk Score API Route
 *
 * Multi-tenant walkability, transit, and bike scores API.
 * Tracks usage per company for billing and quota management.
 */

import { type NextRequest, NextResponse } from "next/server";
import { checkApiQuota, withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { walkScoreService } from "@/lib/services/walk-score-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const address = searchParams.get("address");
		const lat = searchParams.get("lat");
		const lng = searchParams.get("lng");
		const action = searchParams.get("action") || "score";

		if (!address) {
			return NextResponse.json({ error: "address required" }, { status: 400 });
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
		const quota = await checkApiQuota(companyId, "walkscore");
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

		// Map action to endpoint name for tracking
		const endpointMap: Record<string, string> = {
			score: "walk_score",
			detailed: "detailed_scores",
			accessibility: "accessibility",
			"travel-difficulty": "travel_difficulty",
			neighborhood: "neighborhood",
			parking: "parking",
			compare: "compare_locations",
		};

		const endpoint = endpointMap[action];
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		const latNum = lat ? parseFloat(lat) : undefined;
		const lngNum = lng ? parseFloat(lng) : undefined;

		// Execute with usage tracking
		const result = await withUsageTracking(
			companyId,
			"walkscore",
			endpoint,
			async () => {
				switch (action) {
					case "score":
						return await walkScoreService.getWalkScore(address, latNum, lngNum);

					case "detailed":
						return await walkScoreService.getDetailedScores(
							address,
							latNum,
							lngNum,
						);

					case "accessibility":
						return await walkScoreService.analyzePropertyAccessibility(
							address,
							latNum,
							lngNum,
						);

					case "travel-difficulty":
						return await walkScoreService.estimateTravelDifficulty(address);

					case "neighborhood":
						return await walkScoreService.getNeighborhoodCharacter(address);

					case "parking":
						return await walkScoreService.getParkingRecommendations(address);

					case "compare": {
						const addresses = searchParams.get("addresses");
						if (!addresses) {
							throw new Error("addresses required (comma-separated)");
						}
						return await walkScoreService.compareLocations(
							addresses.split(","),
						);
					}

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
				"Cache-Control":
					"public, s-maxage=86400, stale-while-revalidate=172800",
			},
		});
	} catch (error) {
		console.error("Walk Score API error:", error);

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
