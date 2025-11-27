"use server";

/**
 * Traffic Actions
 *
 * Server actions for fetching traffic data for company service area
 */

import { trafficService, type TrafficData } from "@/lib/services/traffic-service";
import { createClient } from "@/lib/supabase/server";

export type TrafficActionResult =
	| { success: true; data: TrafficData }
	| { success: false; error: string };

/**
 * Get traffic conditions for current company's service area
 */
export async function getCompanyTraffic(): Promise<TrafficActionResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.order("updated_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		let companyId = teamMember?.company_id;

		// Try owned company
		if (!companyId) {
			const { data: ownedCompany } = await supabase
				.from("companies")
				.select("id")
				.eq("owner_id", user.id)
				.limit(1)
				.maybeSingle();

			if (ownedCompany) {
				companyId = ownedCompany.id;
			}
		}

		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		// Get company location
		const { data: company } = await supabase
			.from("companies")
			.select("lat, lon")
			.eq("id", companyId)
			.single();

		if (!(company?.lat && company.lon)) {
			return { success: false, error: "Company location not set" };
		}

		// Fetch traffic data
		const trafficData = await trafficService.getTrafficIncidents(
			company.lat,
			company.lon,
		);

		if (!trafficData) {
			return { success: false, error: "Failed to fetch traffic data" };
		}

		return { success: true, data: trafficData };
	} catch (_error) {
		return { success: false, error: "Failed to fetch traffic data" };
	}
}
