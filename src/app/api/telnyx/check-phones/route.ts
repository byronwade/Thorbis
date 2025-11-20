import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const companyId = searchParams.get("companyId");

	if (!companyId) {
		return NextResponse.json(
			{ hasPhones: false, error: "companyId is required" },
			{ status: 400 },
		);
	}

	const supabase = await createClient();

	const { data: phoneNumbers, error } = await supabase
		.from("phone_numbers")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	if (error) {
		return NextResponse.json(
			{
				hasPhones: false,
				error: "Failed to fetch phone numbers",
			},
			{ status: 500 },
		);
	}

	if (!phoneNumbers || phoneNumbers.length === 0) {
		return NextResponse.json({
			hasPhones: false,
			count: 0,
			numbers: [],
		});
	}

	return NextResponse.json({
		hasPhones: true,
		count: phoneNumbers.length,
		numbers: phoneNumbers.map((p) => ({
			id: p.id,
			phone_number: p.phone_number,
			formatted_number: p.formatted_number,
			status: p.status,
			features: p.features,
		})),
	});
}
