/**
 * Cleanup Orphaned Files Edge Function
 *
 * Scheduled job to:
 * - Remove files from storage without database records
 * - Delete soft-deleted files older than 30 days
 * - Clean up failed uploads
 * - Remove expired temporary files
 * - Generate cleanup reports
 */

/// <reference lib="deno.ns" />
declare const Deno: typeof globalThis.Deno;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_DAY =
	HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const SOFT_DELETE_WINDOW_DAYS = 30;
const SOFT_DELETE_WINDOW_MS = SOFT_DELETE_WINDOW_DAYS * MILLISECONDS_PER_DAY;
const FAILED_UPLOAD_WINDOW_HOURS = 24;
const FAILED_UPLOAD_WINDOW_MS =
	FAILED_UPLOAD_WINDOW_HOURS * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

type CleanupResult = {
	orphanedFiles: number;
	deletedFiles: number;
	failedUploads: number;
	expiredFiles: number;
	totalSize: number;
	errors: string[];
};

type SupabaseClientType = ReturnType<typeof createClient>;

type AttachmentRecord = {
	id: string;
	storage_bucket: string;
	storage_path: string;
	file_size: number;
};

type StorageFileObject = {
	name: string;
	metadata?: {
		size?: number;
	};
};

const logInfo = (...args: unknown[]) => {
	// biome-ignore lint/suspicious/noConsole: Required for operational observability
	console.log(...args);
};

const logError = (...args: unknown[]) => {
	// biome-ignore lint/suspicious/noConsole: Required for operational observability
	console.error(...args);
};

function getEnvVar(name: string): string {
	const value = Deno.env.get(name);
	if (!value) {
		throw new Error(`${name} is not configured`);
	}
	return value;
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

serve(async (req) => {
	try {
		// Verify authorization (should be called by cron or service role only)
		const authHeader = req.headers.get("Authorization");
		if (!authHeader?.includes("Bearer")) {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Create Supabase client with service role key
		const supabaseUrl = getEnvVar("SUPABASE_URL");
		const supabaseServiceKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		const result: CleanupResult = {
			orphanedFiles: 0,
			deletedFiles: 0,
			failedUploads: 0,
			expiredFiles: 0,
			totalSize: 0,
			errors: [],
		};

		logInfo("Starting cleanup job...");

		// 1. Clean up soft-deleted files (older than 30 days)
		await cleanupSoftDeletedFiles(supabase, result);

		// 2. Clean up expired temporary files
		await cleanupExpiredFiles(supabase, result);

		// 3. Find and remove orphaned storage files
		await cleanupOrphanedFiles(supabase, result);

		// 4. Clean up failed uploads (older than 24 hours)
		await cleanupFailedUploads(supabase, result);

		logInfo("Cleanup job completed:", result);

		return new Response(
			JSON.stringify({
				success: true,
				result,
				timestamp: new Date().toISOString(),
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		logError("Cleanup job error:", error);

		return new Response(
			JSON.stringify({
				error: "Cleanup job failed",
				details: getErrorMessage(error),
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
});

/**
 * Clean up soft-deleted files older than 30 days
 */
async function cleanupSoftDeletedFiles(
	supabase: SupabaseClientType,
	result: CleanupResult
): Promise<void> {
	const thirtyDaysAgo = new Date(Date.now() - SOFT_DELETE_WINDOW_MS);

	try {
		// Get soft-deleted files
		const { data: deletedFiles, error: fetchError } = await supabase
			.from<AttachmentRecord>("attachments")
			.select("id, storage_bucket, storage_path, file_size")
			.not("deleted_at", "is", null)
			.lt("deleted_at", thirtyDaysAgo.toISOString());

		if (fetchError) {
			result.errors.push(`Failed to fetch deleted files: ${fetchError.message}`);
			return;
		}

		if (!deletedFiles || deletedFiles.length === 0) {
			return;
		}

		logInfo(`Found ${deletedFiles.length} soft-deleted files to remove`);

		// Delete from storage and database
		for (const file of deletedFiles) {
			try {
				// Delete from storage
				const { error: storageError } = await supabase.storage
					.from(file.storage_bucket)
					.remove([file.storage_path]);

				if (storageError) {
					logError(`Failed to delete ${file.storage_path}:`, storageError);
					result.errors.push(`Storage deletion failed: ${file.id}`);
					continue;
				}

				// Delete database record
				const { error: dbError } = await supabase.from("attachments").delete().eq("id", file.id);

				if (dbError) {
					logError(`Failed to delete DB record ${file.id}:`, dbError);
					result.errors.push(`Database deletion failed: ${file.id}`);
					continue;
				}

				result.deletedFiles++;
				result.totalSize += file.file_size;
			} catch (error) {
				logError(`Error cleaning up file ${file.id}:`, error);
				result.errors.push(`Cleanup error: ${file.id}`);
			}
		}
	} catch (error) {
		result.errors.push(`Soft-deleted cleanup failed: ${getErrorMessage(error)}`);
	}
}

/**
 * Clean up expired temporary files
 */
async function cleanupExpiredFiles(
	supabase: SupabaseClientType,
	result: CleanupResult
): Promise<void> {
	try {
		const now = new Date().toISOString();

		// Get expired files
		const { data: expiredFiles, error: fetchError } = await supabase
			.from<AttachmentRecord>("attachments")
			.select("id, storage_bucket, storage_path, file_size")
			.not("expiry_date", "is", null)
			.lt("expiry_date", now)
			.is("deleted_at", null);

		if (fetchError) {
			result.errors.push(`Failed to fetch expired files: ${fetchError.message}`);
			return;
		}

		if (!expiredFiles || expiredFiles.length === 0) {
			return;
		}

		logInfo(`Found ${expiredFiles.length} expired files to remove`);

		for (const file of expiredFiles) {
			try {
				// Delete from storage
				await supabase.storage.from(file.storage_bucket).remove([file.storage_path]);

				// Soft delete in database
				await supabase
					.from("attachments")
					.update({
						deleted_at: new Date().toISOString(),
						deleted_by: null, // System deletion
					})
					.eq("id", file.id);

				result.expiredFiles++;
				result.totalSize += file.file_size;
			} catch (error) {
				logError(`Error cleaning up expired file ${file.id}:`, error);
				result.errors.push(`Expired file cleanup error: ${file.id}`);
			}
		}
	} catch (error) {
		result.errors.push(`Expired files cleanup failed: ${getErrorMessage(error)}`);
	}
}

/**
 * Find and remove orphaned storage files
 */
async function cleanupOrphanedFiles(
	supabase: SupabaseClientType,
	result: CleanupResult
): Promise<void> {
	const buckets = [
		"company-files",
		"customer-documents",
		"documents",
		"job-photos",
		"invoices",
		"estimates",
		"contracts",
	];

	for (const bucket of buckets) {
		await processBucket(supabase, bucket, result);
	}
}

async function processBucket(supabase: SupabaseClientType, bucket: string, result: CleanupResult) {
	try {
		const { data: storageFiles, error: listError } = await supabase.storage.from(bucket).list("", {
			limit: 1000,
			sortBy: { column: "created_at", order: "asc" },
		});

		if (listError) {
			result.errors.push(`Failed to list ${bucket}: ${listError.message}`);
			return;
		}

		if (!storageFiles || storageFiles.length === 0) {
			return;
		}

		logInfo(`Checking ${storageFiles.length} files in ${bucket}`);

		for (const storageFile of storageFiles) {
			await handleStorageFile(supabase, bucket, storageFile, result);
		}
	} catch (error) {
		result.errors.push(`Bucket ${bucket} cleanup failed: ${getErrorMessage(error)}`);
	}
}

async function handleStorageFile(
	supabase: SupabaseClientType,
	bucket: string,
	storageFile: StorageFileObject,
	result: CleanupResult
) {
	try {
		const fullPath = storageFile.name;

		const { data: dbRecord, error: dbError } = await supabase
			.from("attachments")
			.select("id")
			.eq("storage_bucket", bucket)
			.eq("storage_path", fullPath)
			.maybeSingle();

		if (dbError) {
			logError(`DB check failed for ${fullPath}:`, dbError);
			return;
		}

		if (dbRecord) {
			return;
		}

		logInfo(`Orphaned file found: ${bucket}/${fullPath}`);

		const { error: deleteError } = await supabase.storage.from(bucket).remove([fullPath]);

		if (deleteError) {
			logError("Failed to delete orphaned file:", deleteError);
			result.errors.push(`Orphan deletion failed: ${bucket}/${fullPath}`);
			return;
		}

		result.orphanedFiles++;
		result.totalSize += storageFile.metadata?.size ?? 0;
	} catch (error) {
		logError(`Error processing ${storageFile.name}:`, error);
		result.errors.push(`Processing error: ${storageFile.name}`);
	}
}

/**
 * Clean up failed uploads older than 24 hours
 */
async function cleanupFailedUploads(
	supabase: SupabaseClientType,
	result: CleanupResult
): Promise<void> {
	const failedUploadThreshold = new Date(Date.now() - FAILED_UPLOAD_WINDOW_MS);

	try {
		// Get failed uploads
		const { data: failedUploads, error: fetchError } = await supabase
			.from<AttachmentRecord>("attachments")
			.select("id, storage_bucket, storage_path, file_size")
			.eq("virus_scan_status", "failed")
			.lt("created_at", failedUploadThreshold.toISOString())
			.is("deleted_at", null);

		if (fetchError) {
			result.errors.push(`Failed to fetch failed uploads: ${fetchError.message}`);
			return;
		}

		if (!failedUploads || failedUploads.length === 0) {
			return;
		}

		logInfo(`Found ${failedUploads.length} failed uploads to remove`);

		for (const file of failedUploads) {
			try {
				// Delete from storage
				await supabase.storage.from(file.storage_bucket).remove([file.storage_path]);

				// Soft delete in database
				await supabase
					.from("attachments")
					.update({
						deleted_at: new Date().toISOString(),
						deleted_by: null,
					})
					.eq("id", file.id);

				result.failedUploads++;
				result.totalSize += file.file_size;
			} catch (error) {
				logError(`Error cleaning up failed upload ${file.id}:`, error);
				result.errors.push(`Failed upload cleanup error: ${file.id}`);
			}
		}
	} catch (error) {
		result.errors.push(`Failed uploads cleanup failed: ${getErrorMessage(error)}`);
	}
}
