/**
 * Trial Expiry Enforcement Cron Job
 *
 * Safety net for when Stripe webhooks fail:
 * 1. Finds trials that should have expired but still show "trialing"
 * 2. Updates subscription status to "incomplete"
 * 3. Sends trial ended notification email
 *
 * Schedule: Hourly
 * Vercel Cron: "0 * * * *"
 *
 * Security: Requires CRON_SECRET
 */

import { type NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// HANDLER
// =============================================================================

/**
 * GET /api/cron/enforce-trial-expiry
 *
 * Check and enforce trial expiry status.
 */
export async function GET(request: NextRequest) {
	const startTime = Date.now();
	console.log("[Trial Enforcement] Starting scheduled check");

	try {
		// Verify cron secret
		const authHeader = request.headers.get("authorization");
		const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

		if (!authHeader || authHeader !== expectedAuth) {
			console.error("[Trial Enforcement] Unauthorized request");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = await createServiceSupabaseClient();
		const results = {
			expiredTrials: 0,
			syncedFromStripe: 0,
			errors: [] as string[],
		};

		// =========================================================================
		// STEP 1: Find expired trials that weren't updated
		// =========================================================================
		console.log("[Trial Enforcement] Finding expired trials...");

		const now = new Date().toISOString();

		const { data: expiredTrials, error: findError } = await supabase
			.from("companies")
			.select("id, name, owner_id, trial_ends_at, stripe_subscription_id")
			.eq("stripe_subscription_status", "trialing")
			.not("trial_ends_at", "is", null)
			.lt("trial_ends_at", now)
			.is("deleted_at", null);

		if (findError) {
			results.errors.push(`Find expired: ${findError.message}`);
			console.error("[Trial Enforcement] Error finding expired trials:", findError);
		} else if (expiredTrials && expiredTrials.length > 0) {
			console.log(`[Trial Enforcement] Found ${expiredTrials.length} expired trials`);

			for (const company of expiredTrials) {
				try {
					// Update status to incomplete (trial ended, no payment method)
					const { error: updateError } = await supabase
						.from("companies")
						.update({
							stripe_subscription_status: "incomplete",
							updated_at: new Date().toISOString(),
						})
						.eq("id", company.id);

					if (updateError) {
						results.errors.push(`Update ${company.id}: ${updateError.message}`);
						console.error(`[Trial Enforcement] Error updating ${company.name}:`, updateError);
					} else {
						results.expiredTrials++;
						console.log(`[Trial Enforcement] Expired trial for: ${company.name} (${company.id})`);

						// TODO: Send trial ended email
						// await sendTrialEndedEmail(company);
					}
				} catch (err) {
					const errorMsg = err instanceof Error ? err.message : "Unknown error";
					results.errors.push(`Process ${company.id}: ${errorMsg}`);
				}
			}
		} else {
			console.log("[Trial Enforcement] No expired trials found");
		}

		// =========================================================================
		// STEP 2: Sync subscription status from Stripe (for discrepancies)
		// =========================================================================
		// Note: This would require Stripe API calls which are more complex
		// For now, we just rely on webhooks + the safety net above
		// A full sync can be implemented in a separate cron job

		// =========================================================================
		// SUMMARY
		// =========================================================================
		const duration = Date.now() - startTime;
		console.log(
			`[Trial Enforcement] Completed: ${results.expiredTrials} trials expired (${duration}ms)`
		);

		return NextResponse.json({
			success: true,
			...results,
			duration,
		});
	} catch (error) {
		console.error("[Trial Enforcement] Unexpected error:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "An unexpected error occurred",
			},
			{ status: 500 }
		);
	}
}

/**
 * POST /api/cron/enforce-trial-expiry
 *
 * Manual trigger for testing.
 */
export async function POST(request: NextRequest) {
	return GET(request);
}
