/**
 * Gmail Inbox Sync Cron Job
 *
 * Automatically synchronizes Gmail inboxes for all team members with active
 * Gmail connections. This runs on a schedule (recommended: every hour).
 *
 * Vercel Cron Configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-gmail-inboxes",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 *
 * Schedule Format: "0 * * * *" = Every hour at minute 0
 * Alternative schedules:
 * - "0 0-23/2 * * *" = Every 2 hours
 * - "0-59/30 * * * *" = Every 30 minutes
 * - "0 9,17 * * *" = At 9am and 5pm daily
 *
 * Security:
 * - Requires CRON_SECRET environment variable
 * - Vercel automatically includes Authorization header
 * - Manual calls must include: Authorization: Bearer <CRON_SECRET>
 *
 * Response:
 * - 200: { success: true, syncedCount: number, errorCount: number, results: Array }
 * - 401: { error: "Unauthorized" }
 * - 500: { error: string }
 *
 * @see https://vercel.com/docs/cron-jobs
 */

import { type NextRequest, NextResponse } from "next/server";
import { syncUserInbox } from "@/lib/email/gmail-client";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// TYPES
// =============================================================================

interface SyncResult {
	teamMemberId: string;
	email: string;
	success: boolean;
	messagesFetched: number;
	messagesStored: number;
	error?: string;
}

// =============================================================================
// CRON JOB HANDLER
// =============================================================================

/**
 * GET /api/cron/sync-gmail-inboxes
 *
 * Sync all active Gmail inboxes for team members.
 * This endpoint is called automatically by Vercel Cron on a schedule.
 */
export async function GET(request: NextRequest) {
	const startTime = Date.now();
	console.log("[Gmail Sync Cron] Starting scheduled inbox sync");

	try {
		// Verify cron secret for security
		const authHeader = request.headers.get("authorization");
		const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

		if (!authHeader || authHeader !== expectedAuth) {
			console.error("[Gmail Sync Cron] Unauthorized request");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get all team members with active Gmail connections
		const supabase = await createServiceSupabaseClient();
		const { data: activeConnections, error: queryError } = await supabase
			.from("user_gmail_tokens")
			.select(
				`
				team_member_id,
				sync_enabled,
				team_members!inner(
					id,
					company_id,
					first_name,
					last_name
				),
				user_email_accounts!inner(
					email_address
				)
			`,
			)
			.eq("sync_enabled", true);

		if (queryError) {
			console.error("[Gmail Sync Cron] Database query error:", queryError);
			return NextResponse.json(
				{ error: "Failed to fetch active connections" },
				{ status: 500 },
			);
		}

		if (!activeConnections || activeConnections.length === 0) {
			console.log("[Gmail Sync Cron] No active Gmail connections found");
			return NextResponse.json({
				success: true,
				syncedCount: 0,
				errorCount: 0,
				results: [],
				duration: Date.now() - startTime,
			});
		}

		console.log(
			`[Gmail Sync Cron] Found ${activeConnections.length} active connections to sync`,
		);

		// Sync each inbox
		const results: SyncResult[] = [];
		let syncedCount = 0;
		let errorCount = 0;

		for (const connection of activeConnections) {
			const teamMember = connection.team_members;
			const email = connection.user_email_accounts.email_address;

			console.log(
				`[Gmail Sync Cron] Syncing inbox for ${teamMember.first_name} ${teamMember.last_name} (${email})`,
			);

			try {
				const syncResult = await syncUserInbox(
					teamMember.company_id,
					teamMember.id,
				);

				if (syncResult.success) {
					syncedCount++;
					results.push({
						teamMemberId: teamMember.id,
						email,
						success: true,
						messagesFetched: syncResult.messagesFetched,
						messagesStored: syncResult.messagesStored,
					});

					console.log(
						`[Gmail Sync Cron] ✓ Synced ${email}: ${syncResult.messagesFetched} fetched, ${syncResult.messagesStored} stored`,
					);
				} else {
					errorCount++;
					const errorMessage =
						syncResult.errors.length > 0
							? syncResult.errors[0]
							: "Unknown error";

					results.push({
						teamMemberId: teamMember.id,
						email,
						success: false,
						messagesFetched: 0,
						messagesStored: 0,
						error: errorMessage,
					});

					console.error(
						`[Gmail Sync Cron] ✗ Failed to sync ${email}:`,
						errorMessage,
					);
				}
			} catch (error) {
				errorCount++;
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";

				results.push({
					teamMemberId: teamMember.id,
					email,
					success: false,
					messagesFetched: 0,
					messagesStored: 0,
					error: errorMessage,
				});

				console.error(
					`[Gmail Sync Cron] ✗ Exception syncing ${email}:`,
					errorMessage,
				);
			}
		}

		const duration = Date.now() - startTime;
		console.log(
			`[Gmail Sync Cron] Completed: ${syncedCount} succeeded, ${errorCount} failed (${duration}ms)`,
		);

		return NextResponse.json({
			success: true,
			syncedCount,
			errorCount,
			results,
			duration,
		});
	} catch (error) {
		console.error("[Gmail Sync Cron] Unexpected error:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			},
			{ status: 500 },
		);
	}
}

// =============================================================================
// MANUAL TRIGGER (FOR TESTING)
// =============================================================================

/**
 * POST /api/cron/sync-gmail-inboxes
 *
 * Manually trigger inbox sync (for testing purposes).
 * Still requires CRON_SECRET for security.
 */
export async function POST(request: NextRequest) {
	return GET(request);
}
