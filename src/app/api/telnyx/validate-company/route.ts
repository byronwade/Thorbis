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
			industry,
			address,
			city,
			state,
			zip_code,
			phone,
			email,
			support_email,
			support_phone
		`,
		)
		.eq("id", companyId)
		.single();

	if (error || !company) {
		return NextResponse.json(
			{
				valid: false,
				error: `Company not found: ${error?.message || "Unknown error"}`,
				details: error,
			},
			{ status: 404 },
		);
	}

	// Check required fields for 10DLC
	const missing: string[] = [];

	if (!company.name) missing.push("Company name");
	if (!company.ein) missing.push("EIN (Tax ID)");
	if (!company.address) missing.push("Address");
	if (!company.city) missing.push("City");
	if (!company.state) missing.push("State");
	if (!company.zip_code) missing.push("ZIP code");
	if (!company.email && !company.support_email) missing.push("Email");
	if (!company.phone && !company.support_phone) missing.push("Phone");

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
