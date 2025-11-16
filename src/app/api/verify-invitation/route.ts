/**
 * Verify Invitation API Route
 *
 * Verifies an invitation token and returns invitation details
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const token = searchParams.get("token");

		if (!token) {
			return NextResponse.json({ valid: false, error: "No token provided" }, { status: 400 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json({ valid: false, error: "Database connection failed" }, { status: 500 });
		}

		// Look up invitation by token
		const { data: invitation, error } = await supabase
			.from("team_invitations")
			.select(
				`
        id,
        email,
        first_name,
        last_name,
        role,
        phone,
        expires_at,
        used_at,
        company_id,
        companies!inner(name)
      `
			)
			.eq("token", token)
			.is("used_at", null)
			.single();

		if (error || !invitation) {
			return NextResponse.json({ valid: false, error: "Invalid invitation token" }, { status: 404 });
		}

		// Check if expired
		if (new Date(invitation.expires_at) < new Date()) {
			return NextResponse.json({ valid: false, error: "Invitation has expired" }, { status: 410 });
		}

		// Get company name
		const companies = Array.isArray(invitation.companies) ? invitation.companies[0] : invitation.companies;

		return NextResponse.json({
			valid: true,
			invitation: {
				email: invitation.email,
				firstName: invitation.first_name,
				lastName: invitation.last_name,
				role: invitation.role,
				phone: invitation.phone,
				companyName: companies?.name || "Unknown Company",
			},
		});
	} catch (_error) {
		return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 });
	}
}
