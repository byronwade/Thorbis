/**
 * Admin API Route - Update ALL property addresses for testing enrichment
 * DELETE THIS FILE AFTER TESTING
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
		}

		// Get authenticated user
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Get user's company (try any status first)
		const { data: teamMembers } = await supabase
			.from("team_members")
			.select("company_id, status, role")
			.eq("user_id", user.id);

		if (!teamMembers || teamMembers.length === 0) {
			return NextResponse.json(
				{
					error: "No company found for user",
					hint: "Please complete onboarding first at /dashboard/welcome",
					userId: user.id,
				},
				{ status: 400 }
			);
		}

		// Use first company (prefer active status)
		const activeTeamMember = teamMembers.find((tm) => tm.status === "active");
		const companyId = activeTeamMember?.company_id || teamMembers[0].company_id;

		// Get all properties for this company
		const { data: allProperties, error: propertiesError } = await supabase
			.from("properties")
			.select("id, name, address, customer_id")
			.eq("company_id", companyId);

		if (propertiesError) {
			return NextResponse.json({ error: "Failed to fetch properties", details: propertiesError }, { status: 500 });
		}

		// New address data (without customer_id and company_id - they stay the same)
		const addressUpdate = {
			address: "165 Rock Building Lane",
			address2: null,
			city: "Talking Rock",
			state: "GA",
			zip_code: "30175",
			country: "USA",
			latitude: null, // Will be geocoded by enrichment
			longitude: null,
		};

		// Update all properties
		const { data: updatedProperties, error: updateError } = await supabase
			.from("properties")
			.update(addressUpdate)
			.eq("company_id", companyId)
			.select("id, name, address, city, state, customer_id");

		if (updateError) {
			return NextResponse.json({ error: "Failed to update properties", details: updateError }, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			message: `Successfully updated ${updatedProperties?.length || 0} properties!`,
			propertiesUpdated: updatedProperties?.length || 0,
			newAddress: "165 Rock Building Lane, Talking Rock, GA 30175",
			properties: updatedProperties?.slice(0, 10), // Return first 10 as sample
			note:
				updatedProperties && updatedProperties.length > 10
					? `Showing first 10 of ${updatedProperties.length} properties`
					: undefined,
		});
	} catch (error: any) {
    console.error("Error:", error: any);
		return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
	}
}
