/**
 * Storage Usage Tracking
 *
 * Tracks Supabase Storage usage per company for billing.
 * Provider cost: $0.09/GB, Customer price: $0.27/GB (3x markup)
 *
 * Usage:
 * ```typescript
 * import { getStorageUsage, trackStorageSnapshot } from "@/lib/analytics/storage-tracker";
 *
 * // Get current storage usage for a company
 * const usage = await getStorageUsage(companyId);
 * console.log(`Using ${usage.totalGb} GB ($${usage.customerPriceCents / 100})`);
 *
 * // Take a snapshot for billing (run daily via cron)
 * await trackStorageSnapshot(companyId);
 * ```
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { STORAGE_PRICING } from "@/lib/billing/pricing";

// ============================================
// Types
// ============================================

export interface StorageUsage {
	companyId: string;
	totalBytes: number;
	totalGb: number;
	fileCount: number;
	bucketBreakdown: BucketUsage[];
	providerCostCents: number;
	customerPriceCents: number;
	measuredAt: Date;
}

export interface BucketUsage {
	bucketName: string;
	bytes: number;
	fileCount: number;
}

export interface StorageSnapshot {
	companyId: string;
	monthYear: string;
	totalBytes: number;
	fileCount: number;
	providerCostCents: number;
	customerPriceCents: number;
	snapshotDate: string;
}

// ============================================
// Storage Cost Calculation
// ============================================

/**
 * Calculate storage cost in cents
 */
export function calculateStorageCost(bytes: number): {
	gb: number;
	providerCostCents: number;
	customerPriceCents: number;
} {
	const gb = bytes / STORAGE_PRICING.bytesPerGb;
	return {
		gb: Math.round(gb * 100) / 100,
		providerCostCents: Math.round(gb * STORAGE_PRICING.providerCostPerGb),
		customerPriceCents: Math.round(gb * STORAGE_PRICING.customerPricePerGb),
	};
}

// ============================================
// Storage Query Functions
// ============================================

/**
 * Get current storage usage for a company
 * Queries Supabase Storage API for all company buckets
 */
async function getStorageUsage(companyId: string): Promise<StorageUsage> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		return createEmptyUsage(companyId);
	}

	try {
		// Company files are typically stored in paths like: {companyId}/...
		// Or in company-specific buckets
		const buckets = ["company-files", "documents", "photos", "attachments"];
		const bucketBreakdown: BucketUsage[] = [];
		let totalBytes = 0;
		let totalFileCount = 0;

		for (const bucketName of buckets) {
			try {
				// List all files in the company's folder within this bucket
				const { data: files, error } = await supabase.storage
					.from(bucketName)
					.list(companyId, {
						limit: 10000, // Get all files
						sortBy: { column: "created_at", order: "desc" },
					});

				if (error) {
					// Bucket might not exist or company has no files there
					continue;
				}

				if (files && files.length > 0) {
					let bucketBytes = 0;
					let bucketFileCount = 0;

					for (const file of files) {
						if (file.metadata?.size) {
							bucketBytes += file.metadata.size;
							bucketFileCount++;
						}
					}

					if (bucketBytes > 0) {
						bucketBreakdown.push({
							bucketName,
							bytes: bucketBytes,
							fileCount: bucketFileCount,
						});
						totalBytes += bucketBytes;
						totalFileCount += bucketFileCount;
					}
				}
			} catch {
				// Bucket doesn't exist or access denied, skip
			}
		}

		// Also check for company-specific bucket (some setups use this pattern)
		try {
			const { data: companyBucketFiles } = await supabase.storage
				.from(`company-${companyId}`)
				.list("", { limit: 10000 });

			if (companyBucketFiles && companyBucketFiles.length > 0) {
				let bucketBytes = 0;
				let bucketFileCount = 0;

				for (const file of companyBucketFiles) {
					if (file.metadata?.size) {
						bucketBytes += file.metadata.size;
						bucketFileCount++;
					}
				}

				if (bucketBytes > 0) {
					bucketBreakdown.push({
						bucketName: `company-${companyId}`,
						bytes: bucketBytes,
						fileCount: bucketFileCount,
					});
					totalBytes += bucketBytes;
					totalFileCount += bucketFileCount;
				}
			}
		} catch {
			// Company-specific bucket doesn't exist
		}

		const costs = calculateStorageCost(totalBytes);

		return {
			companyId,
			totalBytes,
			totalGb: costs.gb,
			fileCount: totalFileCount,
			bucketBreakdown,
			providerCostCents: costs.providerCostCents,
			customerPriceCents: costs.customerPriceCents,
			measuredAt: new Date(),
		};
	} catch (err) {
		console.error("[Storage Tracker] Failed to get storage usage:", err);
		return createEmptyUsage(companyId);
	}
}

/**
 * Get storage usage from database records (for jobs, invoices, etc.)
 * This is an alternative method that counts attachments in the database
 */
async function getStorageUsageFromDatabase(
	companyId: string,
): Promise<StorageUsage> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		return createEmptyUsage(companyId);
	}

	try {
		// Query file attachments from various tables
		const attachmentQueries = [
			// Job attachments
			supabase
				.from("job_attachments")
				.select("file_size")
				.eq("company_id", companyId),
			// Invoice attachments
			supabase
				.from("invoice_attachments")
				.select("file_size")
				.eq("company_id", companyId),
			// Customer documents
			supabase
				.from("customer_documents")
				.select("file_size")
				.eq("company_id", companyId),
			// Property photos
			supabase
				.from("property_photos")
				.select("file_size")
				.eq("company_id", companyId),
			// Equipment photos
			supabase
				.from("equipment_photos")
				.select("file_size")
				.eq("company_id", companyId),
		];

		let totalBytes = 0;
		let totalFileCount = 0;
		const bucketBreakdown: BucketUsage[] = [];

		const results = await Promise.allSettled(attachmentQueries);

		const tableNames = [
			"job_attachments",
			"invoice_attachments",
			"customer_documents",
			"property_photos",
			"equipment_photos",
		];

		results.forEach((result, index) => {
			if (result.status === "fulfilled" && result.value.data) {
				const files = result.value.data;
				let tableBytes = 0;
				let tableFileCount = 0;

				for (const file of files) {
					if (file.file_size) {
						tableBytes += file.file_size;
						tableFileCount++;
					}
				}

				if (tableBytes > 0) {
					bucketBreakdown.push({
						bucketName: tableNames[index],
						bytes: tableBytes,
						fileCount: tableFileCount,
					});
					totalBytes += tableBytes;
					totalFileCount += tableFileCount;
				}
			}
		});

		const costs = calculateStorageCost(totalBytes);

		return {
			companyId,
			totalBytes,
			totalGb: costs.gb,
			fileCount: totalFileCount,
			bucketBreakdown,
			providerCostCents: costs.providerCostCents,
			customerPriceCents: costs.customerPriceCents,
			measuredAt: new Date(),
		};
	} catch (err) {
		console.error("[Storage Tracker] Failed to get storage from database:", err);
		return createEmptyUsage(companyId);
	}
}

// ============================================
// Storage Snapshot Functions (for billing)
// ============================================

/**
 * Take a storage snapshot for a company
 * Should be run daily via cron job
 */
async function trackStorageSnapshot(
	companyId: string,
): Promise<StorageSnapshot | null> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) return null;

	try {
		// Get current storage usage
		const usage = await getStorageUsage(companyId);

		// Also try database method and take the higher value
		const dbUsage = await getStorageUsageFromDatabase(companyId);

		// Use whichever method found more storage (they might track different things)
		const finalUsage = usage.totalBytes > dbUsage.totalBytes ? usage : dbUsage;

		const now = new Date();
		const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		const snapshotDate = now.toISOString().split("T")[0];

		// Insert or update the storage snapshot
		const { error } = await supabase.from("storage_usage_snapshots").upsert(
			{
				company_id: companyId,
				month_year: monthYear,
				snapshot_date: snapshotDate,
				total_bytes: finalUsage.totalBytes,
				file_count: finalUsage.fileCount,
				provider_cost_cents: finalUsage.providerCostCents,
				customer_price_cents: finalUsage.customerPriceCents,
				bucket_breakdown: finalUsage.bucketBreakdown,
				updated_at: now.toISOString(),
			},
			{
				onConflict: "company_id,month_year,snapshot_date",
			},
		);

		if (error && !error.message.includes("does not exist")) {
			console.error("[Storage Tracker] Failed to save snapshot:", error.message);
			return null;
		}

		return {
			companyId,
			monthYear,
			totalBytes: finalUsage.totalBytes,
			fileCount: finalUsage.fileCount,
			providerCostCents: finalUsage.providerCostCents,
			customerPriceCents: finalUsage.customerPriceCents,
			snapshotDate,
		};
	} catch (err) {
		console.error("[Storage Tracker] Snapshot error:", err);
		return null;
	}
}

/**
 * Get monthly storage usage for billing
 * Returns the peak storage usage for the month (highest daily snapshot)
 */
async function getMonthlyStorageUsage(
	companyId: string,
	monthYear: string, // Format: "2024-11"
): Promise<{
	peakBytes: number;
	peakGb: number;
	avgBytes: number;
	avgGb: number;
	providerCostCents: number;
	customerPriceCents: number;
	snapshotCount: number;
}> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		return {
			peakBytes: 0,
			peakGb: 0,
			avgBytes: 0,
			avgGb: 0,
			providerCostCents: 0,
			customerPriceCents: 0,
			snapshotCount: 0,
		};
	}

	try {
		const { data, error } = await supabase
			.from("storage_usage_snapshots")
			.select("total_bytes, provider_cost_cents, customer_price_cents")
			.eq("company_id", companyId)
			.eq("month_year", monthYear);

		if (error) {
			console.error("[Storage Tracker] Failed to get monthly usage:", error.message);
			return {
				peakBytes: 0,
				peakGb: 0,
				avgBytes: 0,
				avgGb: 0,
				providerCostCents: 0,
				customerPriceCents: 0,
				snapshotCount: 0,
			};
		}

		if (!data || data.length === 0) {
			return {
				peakBytes: 0,
				peakGb: 0,
				avgBytes: 0,
				avgGb: 0,
				providerCostCents: 0,
				customerPriceCents: 0,
				snapshotCount: 0,
			};
		}

		// Calculate peak and average
		let peakBytes = 0;
		let totalBytes = 0;

		for (const snapshot of data) {
			const bytes = snapshot.total_bytes || 0;
			if (bytes > peakBytes) peakBytes = bytes;
			totalBytes += bytes;
		}

		const avgBytes = Math.round(totalBytes / data.length);
		const peakCosts = calculateStorageCost(peakBytes);

		// Bill based on peak usage (standard cloud billing practice)
		return {
			peakBytes,
			peakGb: peakCosts.gb,
			avgBytes,
			avgGb: Math.round((avgBytes / STORAGE_PRICING.bytesPerGb) * 100) / 100,
			providerCostCents: peakCosts.providerCostCents,
			customerPriceCents: peakCosts.customerPriceCents,
			snapshotCount: data.length,
		};
	} catch (err) {
		console.error("[Storage Tracker] Monthly usage error:", err);
		return {
			peakBytes: 0,
			peakGb: 0,
			avgBytes: 0,
			avgGb: 0,
			providerCostCents: 0,
			customerPriceCents: 0,
			snapshotCount: 0,
		};
	}
}

/**
 * Get storage usage trend over multiple months
 */
async function getStorageUsageTrend(
	companyId: string,
	months: number = 6,
): Promise<
	{
		monthYear: string;
		peakGb: number;
		customerPriceCents: number;
	}[]
> {
	const supabase = await createServiceSupabaseClient();
	if (!supabase) return [];

	try {
		// Generate list of month-year strings for the past N months
		const monthYears: string[] = [];
		const now = new Date();
		for (let i = 0; i < months; i++) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			monthYears.push(
				`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
			);
		}

		const results: { monthYear: string; peakGb: number; customerPriceCents: number }[] =
			[];

		for (const monthYear of monthYears) {
			const usage = await getMonthlyStorageUsage(companyId, monthYear);
			results.push({
				monthYear,
				peakGb: usage.peakGb,
				customerPriceCents: usage.customerPriceCents,
			});
		}

		return results.reverse(); // Oldest first
	} catch (err) {
		console.error("[Storage Tracker] Trend query error:", err);
		return [];
	}
}

// ============================================
// Helper Functions
// ============================================

function createEmptyUsage(companyId: string): StorageUsage {
	return {
		companyId,
		totalBytes: 0,
		totalGb: 0,
		fileCount: 0,
		bucketBreakdown: [],
		providerCostCents: 0,
		customerPriceCents: 0,
		measuredAt: new Date(),
	};
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ============================================
// Exports
// ============================================

default {
	getStorageUsage,
	getStorageUsageFromDatabase,
	trackStorageSnapshot,
	getMonthlyStorageUsage,
	getStorageUsageTrend,
	calculateStorageCost,
	formatBytes,
};
