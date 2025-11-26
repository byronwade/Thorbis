/**
 * AI Action Reverter Service - Rubrik-style selective rollback for AI actions
 * Based on Rubrik Agent Rewind patterns for granular recovery
 */

import crypto from "crypto";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { recordReversal } from "./audit-trail";

export type SnapshotType = "full" | "partial" | "field_level";
export type RevertStatus =
	| "pending"
	| "in_progress"
	| "completed"
	| "failed"
	| "partial";

export interface ActionSnapshot {
	entityType: string;
	entityId: string;
	beforeState: Record<string, unknown>;
	afterState: Record<string, unknown>;
	changedFields: string[];
	operation: "create" | "update" | "delete";
}

export interface RevertResult {
	success: boolean;
	revertedEntities: Array<{
		entityType: string;
		entityId: string;
		revertedFields: string[];
	}>;
	failedEntities: Array<{
		entityType: string;
		entityId: string;
		error: string;
	}>;
	reversalId?: string;
}

/**
 * Create an action snapshot before AI performs an action
 */
export async function createActionSnapshot(
	companyId: string,
	messageId: string,
	chatId: string,
	snapshot: ActionSnapshot,
): Promise<string> {
	const supabase = createServiceSupabaseClient();
	const snapshotId = crypto.randomUUID();

	const { error } = await supabase.from("ai_action_snapshots").insert({
		id: snapshotId,
		company_id: companyId,
		message_id: messageId,
		chat_id: chatId,
		entity_type: snapshot.entityType,
		entity_id: snapshot.entityId,
		before_state: snapshot.beforeState,
		after_state: snapshot.afterState,
		changed_fields: snapshot.changedFields,
		operation: snapshot.operation,
		snapshot_type: snapshot.changedFields.length > 0 ? "field_level" : "full",
		is_reverted: false,
		created_at: new Date().toISOString(),
	});

	if (error) {
		console.error("Failed to create action snapshot:", error);
		throw error;
	}

	return snapshotId;
}

/**
 * Create bulk snapshots for multiple entities (e.g., bulk operations)
 */
export async function createBulkSnapshots(
	companyId: string,
	messageId: string,
	chatId: string,
	snapshots: ActionSnapshot[],
): Promise<string[]> {
	const supabase = createServiceSupabaseClient();
	const snapshotIds: string[] = [];

	const records = snapshots.map((snapshot) => {
		const id = crypto.randomUUID();
		snapshotIds.push(id);
		return {
			id,
			company_id: companyId,
			message_id: messageId,
			chat_id: chatId,
			entity_type: snapshot.entityType,
			entity_id: snapshot.entityId,
			before_state: snapshot.beforeState,
			after_state: snapshot.afterState,
			changed_fields: snapshot.changedFields,
			operation: snapshot.operation,
			snapshot_type: "full" as const,
			is_reverted: false,
			created_at: new Date().toISOString(),
		};
	});

	const { error } = await supabase.from("ai_action_snapshots").insert(records);

	if (error) {
		console.error("Failed to create bulk snapshots:", error);
		throw error;
	}

	return snapshotIds;
}

/**
 * Get all snapshots for a specific message (for undo capability)
 */
export async function getMessageSnapshots(
	companyId: string,
	messageId: string,
): Promise<
	Array<{
		id: string;
		entityType: string;
		entityId: string;
		operation: string;
		changedFields: string[];
		isReverted: boolean;
		createdAt: string;
	}>
> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_action_snapshots")
		.select(
			"id, entity_type, entity_id, operation, changed_fields, is_reverted, created_at",
		)
		.eq("company_id", companyId)
		.eq("message_id", messageId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Failed to get message snapshots:", error);
		return [];
	}

	return (data || []).map((s) => ({
		id: s.id,
		entityType: s.entity_type,
		entityId: s.entity_id,
		operation: s.operation,
		changedFields: s.changed_fields || [],
		isReverted: s.is_reverted,
		createdAt: s.created_at,
	}));
}

/**
 * Get revertable actions for a chat session
 */
export async function getRevertableActions(
	companyId: string,
	chatId: string,
	options?: { limit?: number; includeReverted?: boolean },
): Promise<
	Array<{
		id: string;
		messageId: string;
		entityType: string;
		entityId: string;
		operation: string;
		changedFields: string[];
		isReverted: boolean;
		createdAt: string;
	}>
> {
	const supabase = createServiceSupabaseClient();
	const limit = options?.limit || 50;

	let query = supabase
		.from("ai_action_snapshots")
		.select(
			"id, message_id, entity_type, entity_id, operation, changed_fields, is_reverted, created_at",
		)
		.eq("company_id", companyId)
		.eq("chat_id", chatId)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (!options?.includeReverted) {
		query = query.eq("is_reverted", false);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Failed to get revertable actions:", error);
		return [];
	}

	return (data || []).map((s) => ({
		id: s.id,
		messageId: s.message_id,
		entityType: s.entity_type,
		entityId: s.entity_id,
		operation: s.operation,
		changedFields: s.changed_fields || [],
		isReverted: s.is_reverted,
		createdAt: s.created_at,
	}));
}

/**
 * Revert a single snapshot to its before state
 */
export async function revertSnapshot(
	companyId: string,
	snapshotId: string,
	userId: string,
	reason: string,
	options?: { partialFields?: string[] },
): Promise<RevertResult> {
	const supabase = createServiceSupabaseClient();

	// Get the snapshot
	const { data: snapshot, error: fetchError } = await supabase
		.from("ai_action_snapshots")
		.select("*")
		.eq("id", snapshotId)
		.eq("company_id", companyId)
		.single();

	if (fetchError || !snapshot) {
		return {
			success: false,
			revertedEntities: [],
			failedEntities: [
				{
					entityType: "unknown",
					entityId: "unknown",
					error: "Snapshot not found",
				},
			],
		};
	}

	if (snapshot.is_reverted) {
		return {
			success: false,
			revertedEntities: [],
			failedEntities: [
				{
					entityType: snapshot.entity_type,
					entityId: snapshot.entity_id,
					error: "Already reverted",
				},
			],
		};
	}

	try {
		// Determine what to restore
		let stateToRestore = snapshot.before_state as Record<string, unknown>;
		let revertedFields = snapshot.changed_fields as string[];

		if (options?.partialFields && options.partialFields.length > 0) {
			// Partial revert - only restore specific fields
			const currentState = snapshot.after_state as Record<string, unknown>;
			stateToRestore = { ...currentState };
			for (const field of options.partialFields) {
				if (field in (snapshot.before_state as Record<string, unknown>)) {
					stateToRestore[field] = (
						snapshot.before_state as Record<string, unknown>
					)[field];
				}
			}
			revertedFields = options.partialFields;
		}

		// Handle different operations
		if (snapshot.operation === "create") {
			// For creates, we need to soft-delete or restore deleted_at
			const { error: deleteError } = await supabase
				.from(snapshot.entity_type)
				.update({ deleted_at: new Date().toISOString() })
				.eq("id", snapshot.entity_id)
				.eq("company_id", companyId);

			if (deleteError) throw deleteError;
		} else if (snapshot.operation === "delete") {
			// For deletes, restore the record
			const { error: restoreError } = await supabase
				.from(snapshot.entity_type)
				.update({ ...stateToRestore, deleted_at: null })
				.eq("id", snapshot.entity_id)
				.eq("company_id", companyId);

			if (restoreError) throw restoreError;
		} else {
			// For updates, restore the before state
			const { error: updateError } = await supabase
				.from(snapshot.entity_type)
				.update(stateToRestore)
				.eq("id", snapshot.entity_id)
				.eq("company_id", companyId);

			if (updateError) throw updateError;
		}

		// Mark snapshot as reverted
		await supabase
			.from("ai_action_snapshots")
			.update({
				is_reverted: true,
				reverted_at: new Date().toISOString(),
				reverted_by: userId,
				revert_reason: reason,
				partial_revert_fields: options?.partialFields,
			})
			.eq("id", snapshotId)
			.eq("company_id", companyId);

		// Record in audit trail
		const reversalId = await recordReversal(companyId, {
			auditLogId: snapshotId, // Using snapshot ID as reference
			reason,
			reversedBy: userId,
			reversalMethod: options?.partialFields ? "partial" : "automatic",
			partialFields: options?.partialFields,
		}).catch(() => undefined);

		return {
			success: true,
			revertedEntities: [
				{
					entityType: snapshot.entity_type,
					entityId: snapshot.entity_id,
					revertedFields,
				},
			],
			failedEntities: [],
			reversalId,
		};
	} catch (error) {
		console.error("Failed to revert snapshot:", error);
		return {
			success: false,
			revertedEntities: [],
			failedEntities: [
				{
					entityType: snapshot.entity_type,
					entityId: snapshot.entity_id,
					error: error instanceof Error ? error.message : "Unknown error",
				},
			],
		};
	}
}

/**
 * Revert all actions from a specific message
 */
export async function revertMessageActions(
	companyId: string,
	messageId: string,
	userId: string,
	reason: string,
): Promise<RevertResult> {
	const snapshots = await getMessageSnapshots(companyId, messageId);
	const unrevertedSnapshots = snapshots.filter((s) => !s.isReverted);

	if (unrevertedSnapshots.length === 0) {
		return {
			success: true,
			revertedEntities: [],
			failedEntities: [],
		};
	}

	const revertedEntities: RevertResult["revertedEntities"] = [];
	const failedEntities: RevertResult["failedEntities"] = [];

	// Revert in reverse order (last action first)
	for (const snapshot of unrevertedSnapshots) {
		const result = await revertSnapshot(companyId, snapshot.id, userId, reason);

		if (result.success) {
			revertedEntities.push(...result.revertedEntities);
		} else {
			failedEntities.push(...result.failedEntities);
		}
	}

	return {
		success: failedEntities.length === 0,
		revertedEntities,
		failedEntities,
	};
}

/**
 * Preview what would be reverted without actually doing it
 */
export async function previewRevert(
	companyId: string,
	snapshotId: string,
): Promise<{
	entityType: string;
	entityId: string;
	operation: string;
	currentState: Record<string, unknown> | null;
	willRestoreTo: Record<string, unknown>;
	changedFields: string[];
	canRevert: boolean;
	reason?: string;
}> {
	const supabase = createServiceSupabaseClient();

	// Get the snapshot
	const { data: snapshot, error: fetchError } = await supabase
		.from("ai_action_snapshots")
		.select("*")
		.eq("id", snapshotId)
		.eq("company_id", companyId)
		.single();

	if (fetchError || !snapshot) {
		return {
			entityType: "unknown",
			entityId: "unknown",
			operation: "unknown",
			currentState: null,
			willRestoreTo: {},
			changedFields: [],
			canRevert: false,
			reason: "Snapshot not found",
		};
	}

	if (snapshot.is_reverted) {
		return {
			entityType: snapshot.entity_type,
			entityId: snapshot.entity_id,
			operation: snapshot.operation,
			currentState: snapshot.after_state as Record<string, unknown>,
			willRestoreTo: snapshot.before_state as Record<string, unknown>,
			changedFields: snapshot.changed_fields as string[],
			canRevert: false,
			reason: "Already reverted",
		};
	}

	// Get current state from database
	const { data: currentRecord, error: currentError } = await supabase
		.from(snapshot.entity_type)
		.select("*")
		.eq("id", snapshot.entity_id)
		.eq("company_id", companyId)
		.single();

	return {
		entityType: snapshot.entity_type,
		entityId: snapshot.entity_id,
		operation: snapshot.operation,
		currentState: currentError
			? null
			: (currentRecord as Record<string, unknown>),
		willRestoreTo: snapshot.before_state as Record<string, unknown>,
		changedFields: snapshot.changed_fields as string[],
		canRevert: !currentError,
		reason: currentError ? "Entity not found in database" : undefined,
	};
}

/**
 * Get revert history for an entity
 */
export async function getEntityRevertHistory(
	companyId: string,
	entityType: string,
	entityId: string,
): Promise<
	Array<{
		id: string;
		operation: string;
		revertedAt: string;
		revertedBy: string;
		reason: string;
		partialFields: string[] | null;
	}>
> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_action_snapshots")
		.select(
			"id, operation, reverted_at, reverted_by, revert_reason, partial_revert_fields",
		)
		.eq("company_id", companyId)
		.eq("entity_type", entityType)
		.eq("entity_id", entityId)
		.eq("is_reverted", true)
		.order("reverted_at", { ascending: false });

	if (error) {
		console.error("Failed to get entity revert history:", error);
		return [];
	}

	return (data || []).map((r) => ({
		id: r.id,
		operation: r.operation,
		revertedAt: r.reverted_at,
		revertedBy: r.reverted_by,
		reason: r.revert_reason,
		partialFields: r.partial_revert_fields,
	}));
}

/**
 * Batch revert multiple snapshots with transaction-like behavior
 */
export async function batchRevert(
	companyId: string,
	snapshotIds: string[],
	userId: string,
	reason: string,
): Promise<RevertResult> {
	const revertedEntities: RevertResult["revertedEntities"] = [];
	const failedEntities: RevertResult["failedEntities"] = [];

	for (const snapshotId of snapshotIds) {
		const result = await revertSnapshot(companyId, snapshotId, userId, reason);

		if (result.success) {
			revertedEntities.push(...result.revertedEntities);
		} else {
			failedEntities.push(...result.failedEntities);
		}
	}

	return {
		success: failedEntities.length === 0,
		revertedEntities,
		failedEntities,
	};
}
