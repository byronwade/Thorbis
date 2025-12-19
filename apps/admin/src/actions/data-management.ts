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
 *
 * This function safely removes records that have null company_id,
 * which indicates orphaned data that should not exist in production.
 *
 * SAFETY MEASURES:
 * - Requires admin authentication
 * - Only deletes records with NULL company_id
 * - Logs all deletions for audit trail
 * - Returns count of deleted records
 */
export async function cleanupOrphanedData(dataType: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	// Valid data types that can be cleaned
	const validDataTypes = ["jobs", "invoices", "customers", "estimates", "contracts", "appointments"];

	if (!validDataTypes.includes(dataType)) {
		return {
			success: false,
			error: `Invalid data type: ${dataType}. Valid types: ${validDataTypes.join(", ")}`,
		};
	}

	try {
		const webDb = createWebClient();

		// First, get count of records to be deleted
		const { count: orphanedCount, error: countError } = await webDb
			.from(dataType)
			.select("id", { count: "exact", head: true })
			.is("company_id", null);

		if (countError) {
			throw new Error(`Failed to count orphaned ${dataType}: ${countError.message}`);
		}

		if (!orphanedCount || orphanedCount === 0) {
			return {
				success: true,
				message: `No orphaned ${dataType} records found`,
				deletedCount: 0,
			};
		}

		// Delete orphaned records in batches to avoid timeout
		const batchSize = 100;
		let totalDeleted = 0;
		let hasMore = true;

		while (hasMore) {
			// Get IDs of orphaned records
			const { data: orphanedRecords, error: fetchError } = await webDb
				.from(dataType)
				.select("id")
				.is("company_id", null)
				.limit(batchSize);

			if (fetchError) {
				throw new Error(`Failed to fetch orphaned ${dataType}: ${fetchError.message}`);
			}

			if (!orphanedRecords || orphanedRecords.length === 0) {
				hasMore = false;
				break;
			}

			const idsToDelete = orphanedRecords.map((r) => r.id);

			// Delete the batch
			const { error: deleteError, count: deletedCount } = await webDb
				.from(dataType)
				.delete()
				.in("id", idsToDelete);

			if (deleteError) {
				throw new Error(`Failed to delete orphaned ${dataType}: ${deleteError.message}`);
			}

			totalDeleted += deletedCount || idsToDelete.length;

			// If we got fewer records than batch size, we're done
			if (orphanedRecords.length < batchSize) {
				hasMore = false;
			}
		}

		// Log the cleanup action
		console.log(`[Admin] Cleaned up ${totalDeleted} orphaned ${dataType} records by admin ${session.user.email}`);

		return {
			success: true,
			message: `Successfully deleted ${totalDeleted} orphaned ${dataType} records`,
			deletedCount: totalDeleted,
		};
	} catch (error) {
		console.error("Failed to cleanup orphaned data:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to cleanup orphaned data",
		};
	}
}



