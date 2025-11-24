/**
 * Token Cleanup Cron Job
 *
 * Automatically removes invalid, expired, and orphaned Gmail OAuth tokens
 * to keep the database clean and prevent bloat.
 *
 * Cleanup Rules:
 * 1. Invalid tokens (sync_enabled = false) older than 30 days
 * 2. Tokens with failed refresh (no successful sync) older than 7 days
 * 3. Tokens for deleted team members (orphaned)
 * 4. Expired email accounts (status = 'inactive') older than 90 days
 *
 * Schedule: Daily at 3 AM
 * Vercel Cron: "0 3 * * *"
 *
 * Security: Requires CRON_SECRET
 *
 * @see /docs/email/SECURITY_AUDIT.md
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Invalid tokens older than this are deleted (30 days) */
const INVALID_TOKEN_RETENTION_DAYS = 30;

/** Never-synced tokens older than this are deleted (7 days) */
const UNSYNCED_TOKEN_RETENTION_DAYS = 7;

/** Inactive email accounts older than this are deleted (90 days) */
const INACTIVE_ACCOUNT_RETENTION_DAYS = 90;

// =============================================================================
// CLEANUP HANDLER
// =============================================================================

/**
 * GET /api/cron/cleanup-invalid-tokens
 *
 * Cleanup invalid and orphaned tokens.
 */
export async function GET(request: NextRequest) {
	const startTime = Date.now();
	console.log("[Token Cleanup] Starting scheduled cleanup");

	try {
		// Verify cron secret
		const authHeader = request.headers.get("authorization");
		const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

		if (!authHeader || authHeader !== expectedAuth) {
			console.error("[Token Cleanup] Unauthorized request");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = await createServiceSupabaseClient();
		let deletedTokens = 0;
		let deletedAccounts = 0;
		const errors: string[] = [];

		// =========================================================================
		// STEP 1: Delete invalid tokens (sync_enabled = false, >30 days old)
		// =========================================================================
		console.log("[Token Cleanup] Step 1: Cleaning invalid tokens...");

		const invalidCutoff = new Date();
		invalidCutoff.setDate(invalidCutoff.getDate() - INVALID_TOKEN_RETENTION_DAYS);

		const { data: invalidTokens, error: invalidError } = await supabase
			.from("user_gmail_tokens")
			.delete()
			.eq("sync_enabled", false)
			.lt("updated_at", invalidCutoff.toISOString())
			.select("id");

		if (invalidError) {
			errors.push(`Invalid tokens: ${invalidError.message}`);
			console.error("[Token Cleanup] Error deleting invalid tokens:", invalidError);
		} else {
			deletedTokens += invalidTokens?.length || 0;
			console.log(`[Token Cleanup] Deleted ${invalidTokens?.length || 0} invalid tokens`);
		}

		// =========================================================================
		// STEP 2: Delete never-synced tokens (>7 days old)
		// =========================================================================
		console.log("[Token Cleanup] Step 2: Cleaning never-synced tokens...");

		const unsyncedCutoff = new Date();
		unsyncedCutoff.setDate(unsyncedCutoff.getDate() - UNSYNCED_TOKEN_RETENTION_DAYS);

		const { data: unsyncedTokens, error: unsyncedError } = await supabase
			.from("user_gmail_tokens")
			.delete()
			.is("last_synced_at", null)
			.lt("created_at", unsyncedCutoff.toISOString())
			.select("id");

		if (unsyncedError) {
			errors.push(`Unsynced tokens: ${unsyncedError.message}`);
			console.error("[Token Cleanup] Error deleting unsynced tokens:", unsyncedError);
		} else {
			deletedTokens += unsyncedTokens?.length || 0;
			console.log(`[Token Cleanup] Deleted ${unsyncedTokens?.length || 0} never-synced tokens`);
		}

		// =========================================================================
		// STEP 3: Delete tokens for deleted team members (orphaned)
		// =========================================================================
		console.log("[Token Cleanup] Step 3: Cleaning orphaned tokens...");

		const { data: orphanedTokens, error: orphanedError } = await supabase
			.from("user_gmail_tokens")
			.delete()
			.not("team_member_id", "in", `(SELECT id FROM team_members)`)
			.select("id");

		if (orphanedError) {
			errors.push(`Orphaned tokens: ${orphanedError.message}`);
			console.error("[Token Cleanup] Error deleting orphaned tokens:", orphanedError);
		} else {
			deletedTokens += orphanedTokens?.length || 0;
			console.log(`[Token Cleanup] Deleted ${orphanedTokens?.length || 0} orphaned tokens`);
		}

		// =========================================================================
		// STEP 4: Delete inactive email accounts (>90 days old)
		// =========================================================================
		console.log("[Token Cleanup] Step 4: Cleaning inactive email accounts...");

		const inactiveCutoff = new Date();
		inactiveCutoff.setDate(inactiveCutoff.getDate() - INACTIVE_ACCOUNT_RETENTION_DAYS);

		const { data: inactiveAccounts, error: inactiveError } = await supabase
			.from("user_email_accounts")
			.delete()
			.eq("status", "inactive")
			.lt("updated_at", inactiveCutoff.toISOString())
			.select("id");

		if (inactiveError) {
			errors.push(`Inactive accounts: ${inactiveError.message}`);
			console.error("[Token Cleanup] Error deleting inactive accounts:", inactiveError);
		} else {
			deletedAccounts += inactiveAccounts?.length || 0;
			console.log(`[Token Cleanup] Deleted ${inactiveAccounts?.length || 0} inactive accounts`);
		}

		// =========================================================================
		// STEP 5: Delete email accounts for deleted team members
		// =========================================================================
		console.log("[Token Cleanup] Step 5: Cleaning orphaned email accounts...");

		const { data: orphanedAccounts, error: orphanedAccountsError } = await supabase
			.from("user_email_accounts")
			.delete()
			.not("user_id", "in", `(SELECT id FROM team_members)`)
			.select("id");

		if (orphanedAccountsError) {
			errors.push(`Orphaned accounts: ${orphanedAccountsError.message}`);
			console.error("[Token Cleanup] Error deleting orphaned accounts:", orphanedAccountsError);
		} else {
			deletedAccounts += orphanedAccounts?.length || 0;
			console.log(`[Token Cleanup] Deleted ${orphanedAccounts?.length || 0} orphaned accounts`);
		}

		// =========================================================================
		// SUMMARY
		// =========================================================================
		const duration = Date.now() - startTime;
		console.log(
			`[Token Cleanup] Completed: ${deletedTokens} tokens, ${deletedAccounts} accounts deleted (${duration}ms)`
		);

		return NextResponse.json({
			success: true,
			deletedTokens,
			deletedAccounts,
			errors,
			duration,
		});
	} catch (error) {
		console.error("[Token Cleanup] Unexpected error:", error);
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

/**
 * POST /api/cron/cleanup-invalid-tokens
 *
 * Manual trigger for testing.
 */
export async function POST(request: NextRequest) {
	return GET(request);
}
