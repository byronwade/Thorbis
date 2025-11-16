/**
 * Quick setup - Create test company and data
 * DELETE AFTER TESTING
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

		// Check if user already has a company
		const { data: existingTeamMember } = await supabase
			.from("team_members")
			.select("company_id, companies(*)")
			.eq("user_id", user.id)
			.maybeSingle();

		if (existingTeamMember?.company_id) {
			return NextResponse.json({
				success: true,
				message: "Company already exists",
				company: existingTeamMember.companies,
				note: "You can now use the update address page",
			});
		}

		// Create a test company
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.insert({
				name: "Test Company",
				slug: `test-company-${Date.now()}`,
			})
			.select()
			.single();

		if (companyError) {
			return NextResponse.json({ error: "Failed to create company", details: companyError }, { status: 500 });
		}

		// Add user as team member
		const { data: teamMember, error: teamMemberError } = await supabase
			.from("team_members")
			.insert({
				company_id: company.id,
				user_id: user.id,
				role: "admin",
				status: "active",
			})
			.select()
			.single();

		if (teamMemberError) {
			return NextResponse.json({ error: "Failed to create team member", details: teamMemberError }, { status: 500 });
		}

		// Create a test customer
		const { data: customer, error: customerError } = await supabase
			.from("customers")
			.insert({
				company_id: company.id,
				type: "residential",
				first_name: "Byron",
				last_name: "Wade",
				email: "bcw1995@gmail.com",
				phone: "+1 (555) 123-4567",
				status: "active",
				created_by: user.id,
			})
			.select()
			.single();

		if (customerError) {
			// Don't fail - customer is optional
		}

		// Create a test property
		let property = null;
		if (customer) {
			const { data: prop, error: propertyError } = await supabase
				.from("properties")
				.insert({
					company_id: company.id,
					customer_id: customer.id,
					name: "Primary Residence",
					address: "165 Rock Building Lane",
					address2: null,
					city: "Talking Rock",
					state: "GA",
					zip_code: "30175",
					country: "USA",
					property_type: "residential",
					is_primary: true,
				})
				.select()
				.single();

			if (propertyError) {
				// TODO: Handle error case
			} else {
				property = prop;
			}
		}

		// Create a test job
		let job = null;
		if (customer && property) {
			const { data: testJob, error: jobError } = await supabase
				.from("jobs")
				.insert({
					company_id: company.id,
					customer_id: customer.id,
					property_id: property.id,
					title: "Test Job - Enrichment Demo",
					description: "This job will show operational intelligence",
					status: "scheduled",
					priority: "medium",
					job_type: "service",
					created_by: user.id,
				})
				.select()
				.single();

			if (jobError) {
				// TODO: Handle error case
			} else {
				job = testJob;
			}
		}

		return NextResponse.json({
			success: true,
			message: "Test company created successfully!",
			company: {
				id: company.id,
				name: company.name,
			},
			customer: customer
				? {
						id: customer.id,
						name: `${customer.first_name} ${customer.last_name}`,
					}
				: null,
			property: property
				? {
						id: property.id,
						address: `${property.address}, ${property.city}, ${property.state}`,
					}
				: null,
			job: job
				? {
						id: job.id,
						title: job.title,
					}
				: null,
			nextSteps: job
				? [
						"Your test company is ready!",
						`Go to: /dashboard/work/${job.id}`,
						"You should see the Operational Intelligence section with enrichment data!",
					]
				: [
						"Company created, but failed to create test job",
						"Go to /dashboard/admin/update-address to update properties",
						"Then create a job manually",
					],
		});
	} catch (error: any) {
    console.error("Error:", error);
		return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
	}
}
