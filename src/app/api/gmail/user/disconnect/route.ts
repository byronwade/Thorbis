/**
 * Per-User Gmail Disconnection API
 *
 * Allows team members to disconnect their personal Gmail accounts.
 * This revokes tokens with Google and removes them from the database.
 *
 * POST /api/gmail/user/disconnect
 *
 * Response:
 * - 200: { success: true, message: string }
 * - 401: { error: "Not authenticated" }
 * - 404: { error: "Gmail not connected" }
 * - 500: { error: string }
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { disconnectUserGmail } from "@/lib/email/gmail-client";
import { logGmailDisconnected } from "@/lib/email/audit-logger";

export async function POST() {
	try {
		// Get current user from Supabase session
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Get team member info with user name
		const { data: teamMember, error: memberError } = await supabase
			.from("team_members")
			.select("id, company_id, user:users!inner(email)")
			.eq("user_id", user.id)
			.single();

		if (memberError || !teamMember) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		// Get Gmail email before disconnecting
		const { data: gmailData } = await supabase
			.from("user_email_accounts")
			.select("email_address")
			.eq("user_id", teamMember.id)
			.eq("email_type", "gmail_oauth")
			.maybeSingle();

		// Disconnect Gmail
		const result = await disconnectUserGmail(teamMember.id);

		if (!result.success) {
			return NextResponse.json(
				{ error: result.error || "Failed to disconnect Gmail" },
				{ status: 500 }
			);
		}

		// Log disconnection for audit trail
		await logGmailDisconnected(
			teamMember.id,
			teamMember.user.email || "Unknown",
			gmailData?.email_address || "Unknown",
			teamMember.company_id
		);

		return NextResponse.json({
			success: true,
			message: "Gmail disconnected successfully",
		});
	} catch (error) {
		console.error("[Gmail User Disconnect] Unexpected error:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 }
		);
	}
}
