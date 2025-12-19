/**
 * Incomplete Onboarding Cleanup Cron Job
 *
 * Automatically cleans up:
 * 1. Companies that started onboarding but never completed (30+ days old)
 * 2. Expired team invitations (30+ days past expiry)
 * 3. Orphaned company memberships
 *
 * Schedule: Daily at 4 AM
 * Vercel Cron: "0 4 * * *"
 *
 * Security: Requires CRON_SECRET
 */

import { type NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Incomplete companies older than this are soft deleted (30 days) */
const INCOMPLETE_COMPANY_RETENTION_DAYS = 30;

/** Expired invitations older than this are deleted (30 days) */
const EXPIRED_INVITATION_RETENTION_DAYS = 30;

/** Soft deleted companies older than this are hard deleted (90 days) */
const HARD_DELETE_RETENTION_DAYS = 90;

// =============================================================================
// CLEANUP HANDLER
// =============================================================================

/**
 * GET /api/cron/cleanup-incomplete-onboarding
 *
 * Cleanup incomplete onboarding data.
 */
export async function GET(request: NextRequest) {
	const startTime = Date.now();
	console.log("[Onboarding Cleanup] Starting scheduled cleanup");

	try {
		// Verify cron secret
		const authHeader = request.headers.get("authorization");
		const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

		if (!authHeader || authHeader !== expectedAuth) {
			console.error("[Onboarding Cleanup] Unauthorized request");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = await createServiceSupabaseClient();
		const results = {
			softDeletedCompanies: 0,
			hardDeletedCompanies: 0,
			deletedInvitations: 0,
			deletedMemberships: 0,
			errors: [] as string[],
		};

		// =========================================================================
		// STEP 1: Soft delete incomplete companies (30+ days old)
		// =========================================================================
		console.log("[Onboarding Cleanup] Step 1: Soft deleting incomplete companies...");

		const incompleteCutoff = new Date();
		incompleteCutoff.setDate(incompleteCutoff.getDate() - INCOMPLETE_COMPANY_RETENTION_DAYS);

		// Find incomplete companies without real data
		const { data: incompleteCompanies, error: findError } = await supabase
			.from("companies")
			.select("id, name")
			.is("deleted_at", null)
			.eq("stripe_subscription_status", "incomplete")
			.lt("created_at", incompleteCutoff.toISOString());

		if (findError) {
			results.errors.push(`Find incomplete: ${findError.message}`);
			console.error("[Onboarding Cleanup] Error finding incomplete companies:", findError);
		} else if (incompleteCompanies && incompleteCompanies.length > 0) {
			// Check each company for real data before deleting
			for (const company of incompleteCompanies) {
				// Check if company has any jobs
				const { count: jobCount } = await supabase
					.from("jobs")
					.select("id", { count: "exact", head: true })
					.eq("company_id", company.id)
					.is("deleted_at", null);

				// Check if company has any customers
				const { count: customerCount } = await supabase
					.from("customers")
					.select("id", { count: "exact", head: true })
					.eq("company_id", company.id)
					.is("deleted_at", null);

				// Only soft delete if no real data
				if ((jobCount || 0) === 0 && (customerCount || 0) === 0) {
					const { error: deleteError } = await supabase
						.from("companies")
						.update({ deleted_at: new Date().toISOString() })
						.eq("id", company.id);

					if (deleteError) {
						results.errors.push(`Soft delete ${company.id}: ${deleteError.message}`);
					} else {
						results.softDeletedCompanies++;
						console.log(`[Onboarding Cleanup] Soft deleted company: ${company.name} (${company.id})`);
					}
				}
			}
		}

		console.log(`[Onboarding Cleanup] Soft deleted ${results.softDeletedCompanies} incomplete companies`);

		// =========================================================================
		// STEP 2: Hard delete companies that were soft deleted 90+ days ago
		// =========================================================================
		console.log("[Onboarding Cleanup] Step 2: Hard deleting old soft-deleted companies...");

		const hardDeleteCutoff = new Date();
		hardDeleteCutoff.setDate(hardDeleteCutoff.getDate() - HARD_DELETE_RETENTION_DAYS);

		// Call the database function for this (cascades properly)
		const { data: hardDeleteResult, error: hardDeleteError } = await supabase
			.rpc("mark_incomplete_companies_for_cleanup", {
				p_days_old: HARD_DELETE_RETENTION_DAYS,
			});

		if (hardDeleteError) {
			results.errors.push(`Hard delete: ${hardDeleteError.message}`);
			console.error("[Onboarding Cleanup] Error hard deleting companies:", hardDeleteError);
		} else {
			results.hardDeletedCompanies = hardDeleteResult || 0;
			console.log(`[Onboarding Cleanup] Hard deleted ${results.hardDeletedCompanies} companies`);
		}

		// =========================================================================
		// STEP 3: Delete expired team invitations
		// =========================================================================
		console.log("[Onboarding Cleanup] Step 3: Cleaning expired invitations...");

		const { data: cleanupResult, error: cleanupError } = await supabase
			.rpc("cleanup_expired_invitations", {
				p_days_old: EXPIRED_INVITATION_RETENTION_DAYS,
			});

		if (cleanupError) {
			results.errors.push(`Expired invitations: ${cleanupError.message}`);
			console.error("[Onboarding Cleanup] Error cleaning expired invitations:", cleanupError);
		} else {
			results.deletedInvitations = cleanupResult || 0;
			console.log(`[Onboarding Cleanup] Deleted ${results.deletedInvitations} expired invitations`);
		}

		// =========================================================================
		// STEP 4: Clean up orphaned memberships (company_memberships for deleted companies)
		// =========================================================================
		console.log("[Onboarding Cleanup] Step 4: Cleaning orphaned memberships...");

		// Delete company_memberships for soft-deleted companies
		const { data: orphanedMemberships, error: orphanedError } = await supabase
			.from("company_memberships")
			.delete()
			.filter(
				"company_id",
				"in",
				`(SELECT id FROM companies WHERE deleted_at IS NOT NULL AND deleted_at < '${hardDeleteCutoff.toISOString()}')`
			)
			.select("id");

		if (orphanedError) {
			results.errors.push(`Orphaned memberships: ${orphanedError.message}`);
			console.error("[Onboarding Cleanup] Error cleaning orphaned memberships:", orphanedError);
		} else {
			results.deletedMemberships = orphanedMemberships?.length || 0;
			console.log(`[Onboarding Cleanup] Deleted ${results.deletedMemberships} orphaned memberships`);
		}

		// =========================================================================
		// SUMMARY
		// =========================================================================
		const duration = Date.now() - startTime;
		console.log(
			`[Onboarding Cleanup] Completed: ${results.softDeletedCompanies} soft deleted, ${results.hardDeletedCompanies} hard deleted, ${results.deletedInvitations} invitations, ${results.deletedMemberships} memberships (${duration}ms)`
		);

		return NextResponse.json({
			success: true,
			...results,
			duration,
		});
	} catch (error) {
		console.error("[Onboarding Cleanup] Unexpected error:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "An unexpected error occurred",
			},
			{ status: 500 }
		);
	}
}

/**
 * POST /api/cron/cleanup-incomplete-onboarding
 *
 * Manual trigger for testing.
 */
export async function POST(request: NextRequest) {
	return GET(request);
}
