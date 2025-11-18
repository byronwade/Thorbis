/**
 * Sync Queue System
 *
 * Queues offline operations and syncs them to Supabase when online.
 * Handles retries, conflicts, and temporary ID mapping.
 *
 * Flow:
 * 1. User performs action offline (create job, update invoice)
 * 2. Operation added to IndexedDB sync-queue
 * 3. When online, process queue operations sequentially
 * 4. Update local records with server IDs
 * 5. Handle conflicts (last-write-wins)
 */

"use client";

import { createClient } from "@/lib/supabase/client";
import {
	addRecord,
	deleteRecord,
	generateTempId,
	getAllRecords,
	getRecord,
	isTempId,
	type StoreName,
	type SyncOperation,
	updateRecord,
} from "./indexed-db";

const MAX_RETRIES = 3;

/**
 * Add an operation to the sync queue
 */
export async function addToSyncQueue(
	operation: "INSERT" | "UPDATE" | "DELETE",
	table: string,
	data: any,
): Promise<string> {
	const id = generateTempId();
	const syncOp: SyncOperation = {
		id,
		operation,
		table,
		data,
		timestamp: Date.now(),
		retry_count: 0,
	};

	await addRecord("sync-queue", syncOp);
	return id;
}

/**
 * Process all pending sync operations
 */
export async function processSyncQueue(): Promise<{
	success: number;
	failed: number;
	errors: Array<{ operation: SyncOperation; error: string }>;
}> {
	const operations = await getAllRecords<SyncOperation>("sync-queue");

	if (operations.length === 0) {
		return { success: 0, failed: 0, errors: [] };
	}

	const supabase = createClient();
	let successCount = 0;
	let failedCount = 0;
	const errors: Array<{ operation: SyncOperation; error: string }> = [];

	// Process operations sequentially to maintain order
	for (const operation of operations) {
		try {
			await processSingleOperation(supabase, operation);
			await deleteRecord("sync-queue", operation.id);
			successCount++;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";

			// Increment retry count
			const updatedOp = {
				...operation,
				retry_count: operation.retry_count + 1,
				error: errorMessage,
			};

			if (updatedOp.retry_count >= MAX_RETRIES) {
				await updateRecord("sync-queue", updatedOp);
				failedCount++;
				errors.push({ operation, error: errorMessage });
			} else {
				// Update retry count and try again later
				await updateRecord("sync-queue", updatedOp);
				failedCount++;
			}
		}
	}
	return { success: successCount, failed: failedCount, errors };
}

/**
 * Process a single sync operation
 */
async function processSingleOperation(
	supabase: any,
	operation: SyncOperation,
): Promise<void> {
	const { operation: op, table, data } = operation;

	switch (op) {
		case "INSERT": {
			const { id: tempId, ...insertData } = data;
			const { data: result, error } = await supabase
				.from(table)
				.insert(insertData)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}

			// Update local record with server ID
			if (isTempId(tempId)) {
				const storeName = getStoreNameFromTable(table);
				if (storeName) {
					await deleteRecord(storeName, tempId);
					await addRecord(storeName, { ...result, synced: true });
				}
			}
			break;
		}

		case "UPDATE": {
			const { id, ...updateData } = data;
			const { error } = await supabase
				.from(table)
				.update(updateData)
				.eq("id", id);

			if (error) {
				throw new Error(error.message);
			}

			// Update local record sync status
			const storeName = getStoreNameFromTable(table);
			if (storeName) {
				const localRecord = await getRecord(storeName, id);
				if (localRecord) {
					await updateRecord(storeName, {
						...localRecord,
						...updateData,
						synced: true,
					});
				}
			}
			break;
		}

		case "DELETE": {
			const { id } = data;
			const { error } = await supabase.from(table).delete().eq("id", id);

			if (error) {
				throw new Error(error.message);
			}

			// Remove from local storage
			const storeName = getStoreNameFromTable(table);
			if (storeName) {
				await deleteRecord(storeName, id);
			}
			break;
		}

		default:
			throw new Error(`Unknown operation: ${op}`);
	}
}

/**
 * Map Supabase table name to IndexedDB store name
 */
function getStoreNameFromTable(table: string): StoreName | null {
	const tableToStore: Record<string, StoreName> = {
		jobs: "jobs",
		invoices: "invoices",
		customers: "customers",
		communications: "communications",
		payments: "payments",
		equipment: "equipment",
		schedules: "appointments",
		tags: "tags",
		attachments: "attachments",
	};
	return tableToStore[table] || null;
}

/**
 * Clear failed operations from queue (manual intervention)
 */
export async function clearFailedOperations(): Promise<void> {
	const operations = await getAllRecords<SyncOperation>("sync-queue");
	const failedOps = operations.filter((op) => op.retry_count >= MAX_RETRIES);

	for (const op of failedOps) {
		await deleteRecord("sync-queue", op.id);
	}
}

/**
 * Get failed operations for manual review
 */
export async function getFailedOperations(): Promise<SyncOperation[]> {
	const operations = await getAllRecords<SyncOperation>("sync-queue");
	return operations.filter((op) => op.retry_count >= MAX_RETRIES);
}

/**
 * Retry a specific failed operation
 */
export async function retryOperation(operationId: string): Promise<boolean> {
	const operation = await getRecord<SyncOperation>("sync-queue", operationId);
	if (!operation) {
		return false;
	}

	const supabase = await createClient();

	try {
		await processSingleOperation(supabase, operation);
		await deleteRecord("sync-queue", operationId);
		return true;
	} catch (error) {
		const _errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return false;
	}
}
