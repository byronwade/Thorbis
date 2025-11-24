/**
 * Telnyx Dead Letter Queue
 *
 * Stores failed webhook events for retry and manual review.
 * Implements exponential backoff for automatic retries.
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { telnyxLogger } from "./logger";
import { sleep, calculateDelay } from "./retry";

// =============================================================================
// TYPES
// =============================================================================

export interface DLQEntry {
	id: string;
	company_id: string | null;
	event_type: string;
	payload: Record<string, unknown>;
	error_message: string;
	retry_count: number;
	next_retry_at: Date | null;
	created_at: Date;
	last_retry_at: Date | null;
	resolved_at: Date | null;
	resolved_by: string | null;
	resolution_notes: string | null;
}

export interface DLQStats {
	total: number;
	pending: number;
	retrying: number;
	resolved: number;
	failed: number; // Max retries exceeded
}

export interface DLQConfig {
	maxRetries: number;
	retryDelays: number[]; // Delays in minutes: [1, 5, 15, 60, 240]
	autoRetryEnabled: boolean;
	retentionDays: number;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

export const DEFAULT_DLQ_CONFIG: DLQConfig = {
	maxRetries: 5,
	retryDelays: [1, 5, 15, 60, 240], // 1min, 5min, 15min, 1hr, 4hr
	autoRetryEnabled: true,
	retentionDays: 30,
};

// =============================================================================
// DLQ OPERATIONS
// =============================================================================

/**
 * Add a failed event to the dead letter queue
 */
export async function addToDLQ(params: {
	companyId?: string;
	eventType: string;
	payload: Record<string, unknown>;
	errorMessage: string;
	correlationId?: string;
}): Promise<{ success: boolean; entryId?: string; error?: string }> {
	try {
		const supabase = createServiceSupabaseClient();

		// Calculate next retry time
		const nextRetryAt = new Date(
			Date.now() + DEFAULT_DLQ_CONFIG.retryDelays[0] * 60 * 1000
		);

		const { data, error } = await supabase
			.from("webhook_failures")
			.insert({
				company_id: params.companyId || null,
				event_type: params.eventType,
				payload: params.payload,
				error_message: params.errorMessage,
				retry_count: 0,
				next_retry_at: nextRetryAt.toISOString(),
			})
			.select("id")
			.single();

		if (error) {
			telnyxLogger.error("Failed to add to DLQ", {
				error: error.message,
				eventType: params.eventType,
				correlationId: params.correlationId,
			});
			return { success: false, error: error.message };
		}

		telnyxLogger.info("Added to DLQ", {
			entryId: data.id,
			eventType: params.eventType,
			nextRetryAt: nextRetryAt.toISOString(),
			correlationId: params.correlationId,
		});

		return { success: true, entryId: data.id };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get entries due for retry
 */
export async function getDueForRetry(
	limit: number = 100
): Promise<DLQEntry[]> {
	try {
		const supabase = createServiceSupabaseClient();

		const { data, error } = await supabase
			.from("webhook_failures")
			.select("*")
			.lte("next_retry_at", new Date().toISOString())
			.is("resolved_at", null)
			.lt("retry_count", DEFAULT_DLQ_CONFIG.maxRetries)
			.order("next_retry_at", { ascending: true })
			.limit(limit);

		if (error) {
			telnyxLogger.error("Failed to get DLQ entries", { error: error.message });
			return [];
		}

		return (data || []).map(mapDLQEntry);
	} catch (error) {
		telnyxLogger.error("Error fetching DLQ entries", {
			error: error instanceof Error ? error.message : "Unknown error",
		});
		return [];
	}
}

/**
 * Mark an entry as being retried
 */
export async function markRetrying(entryId: string): Promise<boolean> {
	try {
		const supabase = createServiceSupabaseClient();

		const { error } = await supabase
			.from("webhook_failures")
			.update({
				last_retry_at: new Date().toISOString(),
			})
			.eq("id", entryId);

		return !error;
	} catch {
		return false;
	}
}

/**
 * Update retry status after a retry attempt
 */
export async function updateRetryStatus(params: {
	entryId: string;
	success: boolean;
	errorMessage?: string;
}): Promise<boolean> {
	try {
		const supabase = createServiceSupabaseClient();

		if (params.success) {
			// Mark as resolved
			const { error } = await supabase
				.from("webhook_failures")
				.update({
					resolved_at: new Date().toISOString(),
					resolution_notes: "Auto-resolved on retry",
				})
				.eq("id", params.entryId);

			if (!error) {
				telnyxLogger.info("DLQ entry resolved", { entryId: params.entryId });
			}

			return !error;
		}

		// Get current entry
		const { data: entry, error: fetchError } = await supabase
			.from("webhook_failures")
			.select("retry_count")
			.eq("id", params.entryId)
			.single();

		if (fetchError || !entry) {
			return false;
		}

		const newRetryCount = entry.retry_count + 1;
		const delayIndex = Math.min(
			newRetryCount,
			DEFAULT_DLQ_CONFIG.retryDelays.length - 1
		);
		const delayMinutes = DEFAULT_DLQ_CONFIG.retryDelays[delayIndex];

		const nextRetryAt =
			newRetryCount >= DEFAULT_DLQ_CONFIG.maxRetries
				? null // No more retries
				: new Date(Date.now() + delayMinutes * 60 * 1000);

		const { error } = await supabase
			.from("webhook_failures")
			.update({
				retry_count: newRetryCount,
				error_message: params.errorMessage || entry.error_message,
				next_retry_at: nextRetryAt?.toISOString() || null,
			})
			.eq("id", params.entryId);

		if (!error) {
			telnyxLogger.info("DLQ retry failed", {
				entryId: params.entryId,
				retryCount: newRetryCount,
				nextRetryAt: nextRetryAt?.toISOString(),
				maxRetries: DEFAULT_DLQ_CONFIG.maxRetries,
			});
		}

		return !error;
	} catch (error) {
		telnyxLogger.error("Failed to update DLQ status", {
			entryId: params.entryId,
			error: error instanceof Error ? error.message : "Unknown error",
		});
		return false;
	}
}

/**
 * Manually resolve an entry
 */
export async function resolveEntry(params: {
	entryId: string;
	resolvedBy: string;
	notes?: string;
}): Promise<boolean> {
	try {
		const supabase = createServiceSupabaseClient();

		const { error } = await supabase
			.from("webhook_failures")
			.update({
				resolved_at: new Date().toISOString(),
				resolved_by: params.resolvedBy,
				resolution_notes: params.notes || "Manually resolved",
			})
			.eq("id", params.entryId);

		if (!error) {
			telnyxLogger.info("DLQ entry manually resolved", {
				entryId: params.entryId,
				resolvedBy: params.resolvedBy,
			});
		}

		return !error;
	} catch {
		return false;
	}
}

/**
 * Get DLQ statistics
 */
export async function getDLQStats(companyId?: string): Promise<DLQStats> {
	try {
		const supabase = createServiceSupabaseClient();

		let query = supabase.from("webhook_failures").select("*", { count: "exact" });

		if (companyId) {
			query = query.eq("company_id", companyId);
		}

		const { data, count } = await query;

		const entries = data || [];

		return {
			total: count || 0,
			pending: entries.filter(
				(e) =>
					!e.resolved_at &&
					e.retry_count < DEFAULT_DLQ_CONFIG.maxRetries &&
					(!e.next_retry_at || new Date(e.next_retry_at) > new Date())
			).length,
			retrying: entries.filter(
				(e) =>
					!e.resolved_at &&
					e.next_retry_at &&
					new Date(e.next_retry_at) <= new Date()
			).length,
			resolved: entries.filter((e) => e.resolved_at).length,
			failed: entries.filter(
				(e) => !e.resolved_at && e.retry_count >= DEFAULT_DLQ_CONFIG.maxRetries
			).length,
		};
	} catch {
		return { total: 0, pending: 0, retrying: 0, resolved: 0, failed: 0 };
	}
}

/**
 * Get entries by status
 */
export async function getEntriesByStatus(params: {
	status: "pending" | "retrying" | "failed" | "resolved";
	companyId?: string;
	limit?: number;
	offset?: number;
}): Promise<{ entries: DLQEntry[]; total: number }> {
	try {
		const supabase = createServiceSupabaseClient();

		let query = supabase.from("webhook_failures").select("*", { count: "exact" });

		if (params.companyId) {
			query = query.eq("company_id", params.companyId);
		}

		switch (params.status) {
			case "pending":
				query = query
					.is("resolved_at", null)
					.lt("retry_count", DEFAULT_DLQ_CONFIG.maxRetries)
					.gte("next_retry_at", new Date().toISOString());
				break;
			case "retrying":
				query = query
					.is("resolved_at", null)
					.lte("next_retry_at", new Date().toISOString())
					.lt("retry_count", DEFAULT_DLQ_CONFIG.maxRetries);
				break;
			case "failed":
				query = query
					.is("resolved_at", null)
					.gte("retry_count", DEFAULT_DLQ_CONFIG.maxRetries);
				break;
			case "resolved":
				query = query.not("resolved_at", "is", null);
				break;
		}

		query = query
			.order("created_at", { ascending: false })
			.range(params.offset || 0, (params.offset || 0) + (params.limit || 50) - 1);

		const { data, count, error } = await query;

		if (error) {
			return { entries: [], total: 0 };
		}

		return {
			entries: (data || []).map(mapDLQEntry),
			total: count || 0,
		};
	} catch {
		return { entries: [], total: 0 };
	}
}

/**
 * Cleanup old resolved entries
 */
export async function cleanupOldEntries(
	retentionDays: number = DEFAULT_DLQ_CONFIG.retentionDays
): Promise<number> {
	try {
		const supabase = createServiceSupabaseClient();

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

		const { data, error } = await supabase
			.from("webhook_failures")
			.delete()
			.not("resolved_at", "is", null)
			.lt("resolved_at", cutoffDate.toISOString())
			.select("id");

		if (error) {
			telnyxLogger.error("Failed to cleanup DLQ", { error: error.message });
			return 0;
		}

		const deletedCount = data?.length || 0;

		if (deletedCount > 0) {
			telnyxLogger.info("Cleaned up old DLQ entries", {
				deletedCount,
				retentionDays,
			});
		}

		return deletedCount;
	} catch {
		return 0;
	}
}

// =============================================================================
// RETRY PROCESSOR
// =============================================================================

export type WebhookProcessor = (
	eventType: string,
	payload: Record<string, unknown>
) => Promise<{ success: boolean; error?: string }>;

/**
 * Process DLQ entries that are due for retry
 */
export async function processDLQRetries(
	processor: WebhookProcessor,
	options: { batchSize?: number; maxConcurrent?: number } = {}
): Promise<{ processed: number; succeeded: number; failed: number }> {
	const { batchSize = 50, maxConcurrent = 5 } = options;

	const entries = await getDueForRetry(batchSize);

	if (entries.length === 0) {
		return { processed: 0, succeeded: 0, failed: 0 };
	}

	telnyxLogger.info("Processing DLQ retries", { count: entries.length });

	let succeeded = 0;
	let failed = 0;

	// Process in batches with concurrency limit
	for (let i = 0; i < entries.length; i += maxConcurrent) {
		const batch = entries.slice(i, i + maxConcurrent);

		const results = await Promise.all(
			batch.map(async (entry) => {
				await markRetrying(entry.id);

				try {
					const result = await processor(entry.event_type, entry.payload);

					await updateRetryStatus({
						entryId: entry.id,
						success: result.success,
						errorMessage: result.error,
					});

					return result.success;
				} catch (error) {
					await updateRetryStatus({
						entryId: entry.id,
						success: false,
						errorMessage:
							error instanceof Error ? error.message : "Unknown error",
					});
					return false;
				}
			})
		);

		succeeded += results.filter((r) => r).length;
		failed += results.filter((r) => !r).length;

		// Small delay between batches
		if (i + maxConcurrent < entries.length) {
			await sleep(100);
		}
	}

	telnyxLogger.info("DLQ retry processing complete", {
		processed: entries.length,
		succeeded,
		failed,
	});

	return { processed: entries.length, succeeded, failed };
}

// =============================================================================
// HELPERS
// =============================================================================

function mapDLQEntry(row: Record<string, unknown>): DLQEntry {
	return {
		id: row.id as string,
		company_id: row.company_id as string | null,
		event_type: row.event_type as string,
		payload: row.payload as Record<string, unknown>,
		error_message: row.error_message as string,
		retry_count: row.retry_count as number,
		next_retry_at: row.next_retry_at ? new Date(row.next_retry_at as string) : null,
		created_at: new Date(row.created_at as string),
		last_retry_at: row.last_retry_at
			? new Date(row.last_retry_at as string)
			: null,
		resolved_at: row.resolved_at ? new Date(row.resolved_at as string) : null,
		resolved_by: row.resolved_by as string | null,
		resolution_notes: row.resolution_notes as string | null,
	};
}
