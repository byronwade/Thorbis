"use server";

/**
 * Data Management Actions
 *
 * Server actions for data cleanup, orphan detection, and database health.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface OrphanedDataReport {
	total_orphaned_records: number;
	by_type: Array<{
		type: string;
		count: number;
		description: string;
	}>;
}

export interface DatabaseHealthReport {
	total_tables: number;
	tables_with_issues: number;
	orphaned_data: OrphanedDataReport;
	recent_migrations: Array<{
		name: string;
		applied_at: string;
		status: string;
	}>;
}

/**
 * Get database health report
 */
export async function getDatabaseHealth() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// Check for orphaned records (simplified examples)
		const orphanedJobs = await webDb
			.from("jobs")
			.select("id", { count: "exact", head: true })
			.is("company_id", null);

		const orphanedInvoices = await webDb
			.from("invoices")
			.select("id", { count: "exact", head: true })
			.is("company_id", null);

		const orphanedCustomers = await webDb
			.from("customers")
			.select("id", { count: "exact", head: true })
			.is("company_id", null);

		// Get orphaned data summary
		const orphanedByType = [
			{
				type: "jobs",
				count: orphanedJobs.count || 0,
				description: "Jobs without associated company",
			},
			{
				type: "invoices",
				count: orphanedInvoices.count || 0,
				description: "Invoices without associated company",
			},
			{
				type: "customers",
				count: orphanedCustomers.count || 0,
				description: "Customers without associated company",
			},
		].filter((item) => item.count > 0);

		const totalOrphaned = orphanedByType.reduce((sum, item) => sum + item.count, 0);

		// Mock migration status (would need actual migration tracking)
		const recentMigrations = [
			{
				name: "20250131000020_complete_security_infrastructure",
				applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
				status: "applied",
			},
			{
				name: "20251224000000_add_webhook_dedup_and_rate_limiting",
				applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
				status: "applied",
			},
		];

		return {
			data: {
				total_tables: 0, // Would need actual table count
				tables_with_issues: orphanedByType.length > 0 ? 1 : 0,
				orphaned_data: {
					total_orphaned_records: totalOrphaned,
					by_type: orphanedByType,
				},
				recent_migrations: recentMigrations,
			},
		};
	} catch (error) {
		console.error("Failed to get database health:", error);
		return { error: error instanceof Error ? error.message : "Failed to get database health" };
	}
}

/**
 * Clean up orphaned records
 */
export async function cleanupOrphanedData(dataType: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// This would need to be implemented carefully to avoid data loss
		// For now, just return a placeholder response
		return {
			success: false,
			error: "Cleanup functionality not yet implemented. Please contact support.",
		};
	} catch (error) {
		console.error("Failed to cleanup orphaned data:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to cleanup orphaned data",
		};
	}
}



