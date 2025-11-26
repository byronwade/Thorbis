/**
 * ATTOM Property Data API Route
 *
 * Multi-tenant property data API using ATTOM.
 * Provides comprehensive property data for service calls.
 * Tracks usage per company for billing and quota management.
 */

import { type NextRequest, NextResponse } from "next/server";
import { checkApiQuota, withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { attomPropertyService } from "@/lib/services/attom-property-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const address = searchParams.get("address");
		const address2 = searchParams.get("address2");
		const locality = searchParams.get("locality");
		const state = searchParams.get("state");
		const postal = searchParams.get("postal");
		const action = searchParams.get("action") || "profile";

		if (!(address && locality && state)) {
			return NextResponse.json(
				{ error: "Missing required parameters: address, locality, state" },
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

		// Check quota before processing
		const quota = await checkApiQuota(companyId, "attom_property");
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

		const addressParams = {
			address1: address,
			address2: address2 || undefined,
			locality,
			stateOrProvince: state,
			postalCode: postal || undefined,
		};

		// Map action to endpoint name for tracking
		const endpointMap: Record<string, string> = {
			profile: "profile",
			expanded: "expanded_profile",
			valuation: "valuation",
			"sales-history": "sales_history",
			tax: "tax_assessment",
			owner: "owner",
			"service-report": "service_report",
			"equipment-info": "equipment_info",
			"maintenance-info": "maintenance_info",
		};

		const endpoint = endpointMap[action];
		if (!endpoint) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		// Execute with usage tracking
		const result = await withUsageTracking(
			companyId,
			"attom_property",
			endpoint,
			async () => {
				switch (action) {
					case "profile":
						return await attomPropertyService.getPropertyByAddress(
							addressParams,
						);
					case "expanded":
						return await attomPropertyService.getExpandedProfile(addressParams);
					case "valuation":
						return await attomPropertyService.getValuation(addressParams);
					case "sales-history":
						return await attomPropertyService.getSalesHistory(addressParams);
					case "tax":
						return await attomPropertyService.getTaxAssessment(addressParams);
					case "owner":
						return await attomPropertyService.getOwner(addressParams);
					case "service-report":
						return await attomPropertyService.getServiceCallPropertyReport(
							addressParams,
						);
					case "equipment-info":
						return await attomPropertyService.getEquipmentRelevantInfo(
							addressParams,
						);
					case "maintenance-info":
						return await attomPropertyService.getMaintenanceRelevantInfo(
							addressParams,
						);
					default:
						throw new Error(`Unknown action: ${action}`);
				}
			},
		);

		if (!result) {
			return NextResponse.json(
				{ error: "Property not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
			},
		});
	} catch (error) {
		console.error("ATTOM API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
