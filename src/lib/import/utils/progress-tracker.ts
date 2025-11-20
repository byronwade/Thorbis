/**
 * Progress Tracker with Supabase Realtime
 *
 * Features:
 * - Real-time progress updates via Supabase Realtime
 * - ETA calculation
 * - Memory usage monitoring
 * - Batch completion tracking
 * - Error aggregation
 */

import { createClient } from "@/lib/supabase/server";
import type { ImportError, ImportProgress, ImportStatus } from "@/types/import";

export class ProgressTracker {
	private importId: string;
	private totalRecords: number;
	private processedRecords = 0;
	private successCount = 0;
	private failureCount = 0;
	private startTime: number;
	private errors: ImportError[] = [];
	private status: ImportStatus = "pending";
	private currentBatch = 0;
	private totalBatches = 0;

	constructor(importId: string, totalRecords: number, totalBatches: number) {
		this.importId = importId;
		this.totalRecords = totalRecords;
		this.totalBatches = totalBatches;
		this.startTime = Date.now();
	}

	/**
	 * Update progress and broadcast to subscribers
	 */
	async updateProgress(
		processed: number,
		successCount: number,
		failureCount: number,
		batchNumber?: number,
	): Promise<void> {
		this.processedRecords = processed;
		this.successCount = successCount;
		this.failureCount = failureCount;

		if (batchNumber !== undefined) {
			this.currentBatch = batchNumber;
		}

		await this.broadcast();
	}

	/**
	 * Add error to tracking
	 */
	addError(error: ImportError): void {
		this.errors.push(error);
	}

	/**
	 * Add multiple errors
	 */
	addErrors(errors: ImportError[]): void {
		this.errors.push(...errors);
	}

	/**
	 * Update status
	 */
	async setStatus(status: ImportStatus): Promise<void> {
		this.status = status;
		await this.broadcast();
	}

	/**
	 * Mark import as complete
	 */
	async markComplete(): Promise<void> {
		this.status = "completed";
		await this.updateDatabase();
		await this.broadcast();
	}

	/**
	 * Mark import as failed
	 */
	async markFailed(error: string): Promise<void> {
		this.status = "failed";
		this.errors.push({
			recordIndex: -1,
			error,
			code: "IMPORT_FAILED",
			severity: "error",
			canRetry: true,
		});
		await this.updateDatabase();
		await this.broadcast();
	}

	/**
	 * Get current progress
	 */
	getProgress(): ImportProgress {
		const percentComplete =
			this.totalRecords > 0
				? (this.processedRecords / this.totalRecords) * 100
				: 0;

		const estimatedTimeRemaining = this.calculateETA();

		return {
			importId: this.importId,
			status: this.status,
			totalRecords: this.totalRecords,
			processedRecords: this.processedRecords,
			successCount: this.successCount,
			failureCount: this.failureCount,
			currentBatch: this.currentBatch,
			totalBatches: this.totalBatches,
			percentComplete: Math.round(percentComplete * 100) / 100,
			estimatedTimeRemaining,
			errors: this.errors.slice(-10), // Last 10 errors
		};
	}

	/**
	 * Calculate estimated time remaining (in seconds)
	 */
	private calculateETA(): number | undefined {
		if (this.processedRecords === 0) {
			return undefined;
		}

		const elapsedTime = (Date.now() - this.startTime) / 1000; // seconds
		const recordsPerSecond = this.processedRecords / elapsedTime;
		const remainingRecords = this.totalRecords - this.processedRecords;

		return Math.ceil(remainingRecords / recordsPerSecond);
	}

	/**
	 * Broadcast progress update via Supabase Realtime
	 */
	private async broadcast(): Promise<void> {
		try {
			const supabase = await createClient();
			const progress = this.getProgress();

			// Update database record
			await this.updateDatabase();

			// Broadcast via Realtime channel
			const channel = supabase.channel(`import:${this.importId}`);

			await channel.send({
				type: "broadcast",
				event: "progress",
				payload: progress,
			});

			// Subscribe if not already subscribed (for first broadcast)
			if (channel.state !== "joined") {
				await channel.subscribe();
			}
		} catch (error) {
			console.error("Failed to broadcast progress:", error);
		}
	}

	/**
	 * Update database with current progress
	 */
	private async updateDatabase(): Promise<void> {
		try {
			const supabase = await createClient();

			const progress = this.getProgress();

			await supabase
				.from("data_imports")
				.update({
					status: this.status,
					successful_rows: this.successCount,
					failed_rows: this.failureCount,
					error_log: this.errors.length > 0 ? this.errors : undefined,
					updated_at: new Date().toISOString(),
					...(this.status === "completed" && {
						completed_at: new Date().toISOString(),
						actual_duration_seconds: Math.floor(
							(Date.now() - this.startTime) / 1000,
						),
					}),
				})
				.eq("id", this.importId);
		} catch (error) {
			console.error("Failed to update database:", error);
		}
	}

	/**
	 * Get statistics
	 */
	getStats() {
		return {
			processedRecords: this.processedRecords,
			successCount: this.successCount,
			failureCount: this.failureCount,
			errorCount: this.errors.length,
			percentComplete: (this.processedRecords / this.totalRecords) * 100,
			elapsedTime: (Date.now() - this.startTime) / 1000,
			recordsPerSecond:
				this.processedRecords / ((Date.now() - this.startTime) / 1000),
		};
	}
}

/**
 * Subscribe to import progress updates (client-side)
 */
export function subscribeToImportProgress(
	importId: string,
	onProgress: (progress: ImportProgress) => void,
	onError?: (error: Error) => void,
) {
	const supabase = createClient();
	const channel = supabase.channel(`import:${importId}`);

	channel
		.on("broadcast", { event: "progress" }, ({ payload }) => {
			onProgress(payload as ImportProgress);
		})
		.subscribe((status) => {
			if (status === "SUBSCRIBED") {
				console.log(`Subscribed to import progress: ${importId}`);
			} else if (status === "CHANNEL_ERROR") {
				onError?.(new Error("Failed to subscribe to import progress"));
			}
		});

	// Return unsubscribe function
	return () => {
		channel.unsubscribe();
	};
}

/**
 * Poll import progress (fallback if Realtime unavailable)
 */
export async function pollImportProgress(
	importId: string,
): Promise<ImportProgress | null> {
	try {
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("data_imports")
			.select("*")
			.eq("id", importId)
			.single();

		if (error || !data) {
			return null;
		}

		return {
			importId: data.id,
			status: data.status as ImportStatus,
			totalRecords: data.total_rows || 0,
			processedRecords: (data.successful_rows || 0) + (data.failed_rows || 0),
			successCount: data.successful_rows || 0,
			failureCount: data.failed_rows || 0,
			currentBatch: 0,
			totalBatches: 0,
			percentComplete: data.total_rows
				? (((data.successful_rows || 0) + (data.failed_rows || 0)) /
						data.total_rows) *
					100
				: 0,
			errors: data.error_log || [],
		};
	} catch (error) {
		console.error("Failed to poll import progress:", error);
		return null;
	}
}
