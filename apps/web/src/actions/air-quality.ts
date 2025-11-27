"use server";

/**
 * Air Quality Actions
 *
 * Server actions for fetching air quality data for company location
 */

import { airQualityService, type AirQuality } from "@/lib/services/air-quality-service";
import { createClient } from "@/lib/supabase/server";

export type AirQualityActionResult =
	| { success: true; data: AirQuality }
	| { success: false; error: string };

/**
 * Get air quality for current company's location
 */
export async function getCompanyAirQuality(): Promise<AirQualityActionResult> {
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

		// Fetch air quality data
		const airQualityData = await airQualityService.getAirQuality(
			company.lat,
			company.lon,
		);

		if (!airQualityData) {
			return { success: false, error: "Failed to fetch air quality data" };
		}

		return { success: true, data: airQualityData };
	} catch (_error) {
		return { success: false, error: "Failed to fetch air quality" };
	}
}
