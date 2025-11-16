/**
 * Cron Job: Sync Bank Transactions
 *
 * Automatically syncs transactions from Plaid for all companies with
 * auto-import enabled. Runs daily at 2 AM.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-bank-transactions",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { NextResponse } from "next/server";
import { syncTransactions } from "@/actions/plaid";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
	// Verify cron secret for security
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 });
	}

	if (authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json({ error: "Failed to initialize Supabase client" }, { status: 500 });
		}

		// Get all companies with auto-sync enabled bank accounts
		const { data: accounts, error } = await supabase
			.from("finance_bank_accounts")
			.select("company_id")
			.eq("auto_import_transactions", true)
			.eq("is_active", true)
			.not("plaid_access_token_encrypted", "is", null);

		if (error) {
			return NextResponse.json({ error: "Failed to fetch accounts", details: error.message }, { status: 500 });
		}

		if (!accounts || accounts.length === 0) {
			return NextResponse.json({
				success: true,
				message: "No accounts to sync",
				synced: 0,
			});
		}

		// Get unique company IDs
		const companyIds = [...new Set(accounts.map((a) => a.company_id))];

		let totalSynced = 0;
		const results = [];

		// Sync transactions for each company
		for (const companyId of companyIds) {
			try {
				const result = await syncTransactions(companyId);

				if (result.success && result.data) {
					totalSynced += result.data.synced;
					results.push({
						companyId,
						success: true,
						synced: result.data.synced,
					});
				} else {
					results.push({
						companyId,
						success: false,
						error: result.success ? "Unknown error" : result.error || "Unknown error",
					});
				}
			} catch (error: any) {
    console.error("Error:", error);
				results.push({
					companyId,
					success: false,
					error: error.message,
				});
			}
		}

		return NextResponse.json({
			success: true,
			message: `Synced transactions for ${companyIds.length} companies`,
			totalSynced,
			results,
		});
	} catch (error: any) {
    console.error("Error:", error);
		return NextResponse.json(
			{
				error: "Sync failed",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
