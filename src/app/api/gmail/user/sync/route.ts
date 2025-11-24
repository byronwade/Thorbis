/**
 * Per-User Gmail Manual Sync API
 *
 * Allows team members to manually trigger inbox synchronization.
 * This fetches recent messages from Gmail and stores them in the database.
 *
 * POST /api/gmail/user/sync
 *
 * Response:
 * - 200: { success: true, messagesFetched: number, messagesStored: number, lastSyncedAt: string }
 * - 401: { error: "Not authenticated" }
 * - 404: { error: "Gmail not connected" }
 * - 500: { error: string }
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserInbox } from "@/lib/email/gmail-client";

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

		// Get team member info
		const { data: teamMember, error: memberError } = await supabase
			.from("team_members")
			.select("id, company_id")
			.eq("user_id", user.id)
			.single();

		if (memberError || !teamMember) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		// Check if Gmail is connected
		const { data: gmailToken } = await supabase
			.from("user_gmail_tokens")
			.select("id")
			.eq("team_member_id", teamMember.id)
			.maybeSingle();

		if (!gmailToken) {
			return NextResponse.json(
				{ error: "Gmail not connected" },
				{ status: 404 }
			);
		}

		// Sync inbox
		console.log(`[Gmail User Sync] Starting manual sync for team member ${teamMember.id}`);
		const result = await syncUserInbox(teamMember.company_id, teamMember.id);

		if (!result.success) {
			return NextResponse.json(
				{
					error:
						result.errors.length > 0
							? result.errors[0]
							: "Failed to sync inbox",
				},
				{ status: 500 }
			);
		}

		console.log(
			`[Gmail User Sync] Sync completed: ${result.messagesFetched} fetched, ${result.messagesStored} stored`
		);

		return NextResponse.json({
			success: true,
			messagesFetched: result.messagesFetched,
			messagesStored: result.messagesStored,
			lastSyncedAt: result.lastSyncedAt.toISOString(),
		});
	} catch (error) {
		console.error("[Gmail User Sync] Unexpected error:", error);
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
