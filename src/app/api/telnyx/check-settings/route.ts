import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const companyId = searchParams.get("companyId");

	if (!companyId) {
		return NextResponse.json(
			{ ready: false, error: "companyId is required" },
			{ status: 400 },
		);
	}

	const supabase = await createClient();

	const { data: settings, error } = await supabase
		.from("company_telnyx_settings")
		.select("*")
		.eq("company_id", companyId)
		.single();

	if (error || !settings) {
		return NextResponse.json({
			ready: false,
			error: "Telnyx settings not found",
			issues: [
				"Company has not been provisioned with Telnyx",
				"Run ensureCompanyTelnyxSetup() to provision",
			],
		});
	}

	const issues: string[] = [];

	if (!settings.messaging_profile_id) {
		issues.push("Missing messaging profile ID");
	}
	if (!settings.call_control_application_id) {
		issues.push("Missing call control application ID");
	}
	if (!settings.default_outbound_number) {
		issues.push("Missing default outbound phone number");
	}
	if (settings.status !== "ready") {
		issues.push(`Settings status is "${settings.status}" (expected "ready")`);
	}

	if (issues.length > 0) {
		return NextResponse.json({
			ready: false,
			issues,
			settings,
		});
	}

	return NextResponse.json({
		ready: true,
		messagingProfileId: settings.messaging_profile_id,
		callControlAppId: settings.call_control_application_id,
		defaultNumber: settings.default_outbound_number,
		brandId: settings.ten_dlc_brand_id,
		campaignId: settings.ten_dlc_campaign_id,
		settings,
	});
}
