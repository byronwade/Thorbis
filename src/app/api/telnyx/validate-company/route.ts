import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const companyId = searchParams.get("companyId");

	if (!companyId) {
		return NextResponse.json(
			{ valid: false, error: "companyId is required" },
			{ status: 400 },
		);
	}

	const supabase = await createClient();

	const { data: company, error } = await supabase
		.from("companies")
		.select(
			`
			id,
			name,
			ein,
			website,
			business_type,
			street_address,
			city,
			state,
			zip_code,
			country,
			primary_contact_first_name,
			primary_contact_last_name,
			primary_contact_email,
			primary_contact_phone,
			primary_contact_job_title
		`,
		)
		.eq("id", companyId)
		.single();

	if (error || !company) {
		return NextResponse.json(
			{
				valid: false,
				error: "Company not found",
			},
			{ status: 404 },
		);
	}

	// Check required fields for 10DLC
	const missing: string[] = [];

	if (!company.name) missing.push("Company name");
	if (!company.ein) missing.push("EIN");
	if (!company.street_address) missing.push("Street address");
	if (!company.city) missing.push("City");
	if (!company.state) missing.push("State");
	if (!company.zip_code) missing.push("ZIP code");
	if (!company.primary_contact_first_name)
		missing.push("Primary contact first name");
	if (!company.primary_contact_last_name)
		missing.push("Primary contact last name");
	if (!company.primary_contact_email) missing.push("Primary contact email");
	if (!company.primary_contact_phone) missing.push("Primary contact phone");

	if (missing.length > 0) {
		return NextResponse.json({
			valid: false,
			error: "Company data is incomplete",
			missing,
			company,
		});
	}

	return NextResponse.json({
		valid: true,
		company,
	});
}
