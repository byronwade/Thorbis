"use server";

import { revalidatePath } from "next/cache";
import {
	getRevertableActions,
	previewRevert,
	revertSnapshot,
} from "@/lib/ai/action-reverter";
import {
	getAuditStatistics,
	getHighSeverityAuditEntries,
} from "@/lib/ai/audit-trail";
import { getActiveCompany } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export type ActivityLogEntry = {
	id: string;
	action: string;
	entityType: string;
	entityId: string | null;
	toolName: string | null;
	severity: string;
	isReversible: boolean;
	reversed: boolean;
	createdAt: string;
	userId: string | null;
	chatId: string | null;
	beforeState: Record<string, unknown> | null;
	afterState: Record<string, unknown> | null;
	changedFields: string[];
};

export async function getActivityLogAction(options?: {
	limit?: number;
	offset?: number;
	severityFilter?: string[];
	actionFilter?: string[];
	dateFrom?: string;
	dateTo?: string;
}): Promise<{
	entries: ActivityLogEntry[];
	total: number;
	error?: string;
}> {
	try {
		const company = await getActiveCompany();
		if (!company?.id) {
			return { entries: [], total: 0, error: "Not authenticated" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { entries: [], total: 0, error: "Database connection failed" };
		}

		const limit = options?.limit || 50;
		const offset = options?.offset || 0;

		let query = supabase
			.from("ai_audit_log")
			.select(
				"id, action, entity_type, entity_id, tool_name, severity, is_reversible, reversed, created_at, user_id, chat_id, before_state, after_state, changed_fields",
				{ count: "exact" },
			)
			.eq("company_id", company.id)
			.order("created_at", { ascending: false });

		if (options?.severityFilter && options.severityFilter.length > 0) {
			query = query.in("severity", options.severityFilter);
		}

		if (options?.actionFilter && options.actionFilter.length > 0) {
			query = query.in("action", options.actionFilter);
		}

		if (options?.dateFrom) {
			query = query.gte("created_at", options.dateFrom);
		}

		if (options?.dateTo) {
			query = query.lte("created_at", options.dateTo);
		}

		const { data, error, count } = await query.range(
			offset,
			offset + limit - 1,
		);

		if (error) {
			console.error("Failed to fetch activity log:", error);
			return { entries: [], total: 0, error: error.message };
		}

		return {
			entries: (data || []).map((entry) => ({
				id: entry.id,
				action: entry.action,
				entityType: entry.entity_type,
				entityId: entry.entity_id,
				toolName: entry.tool_name,
				severity: entry.severity,
				isReversible: entry.is_reversible,
				reversed: entry.reversed,
				createdAt: entry.created_at,
				userId: entry.user_id,
				chatId: entry.chat_id,
				beforeState: entry.before_state as Record<string, unknown> | null,
				afterState: entry.after_state as Record<string, unknown> | null,
				changedFields: (entry.changed_fields as string[]) || [],
			})),
			total: count || 0,
		};
	} catch (error) {
		console.error("Error fetching activity log:", error);
		return { entries: [], total: 0, error: "Failed to fetch activity log" };
	}
}

export async function getActivityStatsAction(dateRange?: {
	start: string;
	end: string;
}): Promise<{
	stats: {
		totalActions: number;
		byAction: Record<string, number>;
		bySeverity: Record<string, number>;
		byEntityType: Record<string, number>;
		reversalRate: number;
		criticalActionsCount: number;
		topTools: Array<{ tool: string; count: number }>;
	} | null;
	error?: string;
}> {
	try {
		const company = await getActiveCompany();
		if (!company?.id) {
			return { stats: null, error: "Not authenticated" };
		}

		const start = dateRange?.start
			? new Date(dateRange.start)
			: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		const end = dateRange?.end ? new Date(dateRange.end) : new Date();

		const stats = await getAuditStatistics(company.id, { start, end });
		return { stats };
	} catch (error) {
		console.error("Error fetching activity stats:", error);
		return { stats: null, error: "Failed to fetch activity stats" };
	}
}

async function getHighSeverityActionsAction(): Promise<{
	entries: Array<{
		id: string;
		action: string;
		entityType: string;
		entityId: string | null;
		userId: string | null;
		toolName: string | null;
		severity: string;
		reversed: boolean;
		createdAt: string;
	}>;
	error?: string;
}> {
	try {
		const company = await getActiveCompany();
		if (!company?.id) {
			return { entries: [], error: "Not authenticated" };
		}

		const entries = await getHighSeverityAuditEntries(company.id, {
			since: new Date(Date.now() - 24 * 60 * 60 * 1000),
			limit: 50,
		});

		return { entries };
	} catch (error) {
		console.error("Error fetching high severity actions:", error);
		return { entries: [], error: "Failed to fetch high severity actions" };
	}
}

export async function previewUndoAction(snapshotId: string): Promise<{
	preview: {
		entityType: string;
		entityId: string;
		operation: string;
		currentState: Record<string, unknown> | null;
		willRestoreTo: Record<string, unknown>;
		changedFields: string[];
		canRevert: boolean;
		reason?: string;
	} | null;
	error?: string;
}> {
	try {
		const company = await getActiveCompany();
		if (!company?.id) {
			return { preview: null, error: "Not authenticated" };
		}

		const preview = await previewRevert(company.id, snapshotId);
		return { preview };
	} catch (error) {
		console.error("Error previewing undo:", error);
		return { preview: null, error: "Failed to preview undo" };
	}
}

export async function undoActionAction(
	snapshotId: string,
	reason: string,
): Promise<{
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
	error?: string;
}> {
	try {
		const [company, user] = await Promise.all([
			getActiveCompany(),
			getCurrentUser(),
		]);
		if (!company?.id || !user?.id) {
			return {
				success: false,
				revertedEntities: [],
				failedEntities: [],
				error: "Not authenticated",
			};
		}

		const result = await revertSnapshot(
			company.id,
			snapshotId,
			user.id,
			reason,
		);

		if (result.success) {
			revalidatePath("/dashboard/ai/activity");
		}

		return result;
	} catch (error) {
		console.error("Error undoing action:", error);
		return {
			success: false,
			revertedEntities: [],
			failedEntities: [],
			error: "Failed to undo action",
		};
	}
}

async function getRevertableActionsAction(chatId?: string): Promise<{
	actions: Array<{
		id: string;
		messageId: string;
		entityType: string;
		entityId: string;
		operation: string;
		changedFields: string[];
		isReverted: boolean;
		createdAt: string;
	}>;
	error?: string;
}> {
	try {
		const company = await getActiveCompany();
		if (!company?.id) {
			return { actions: [], error: "Not authenticated" };
		}

		if (!chatId) {
			return { actions: [], error: "Chat ID required" };
		}

		const actions = await getRevertableActions(company.id, chatId, {
			limit: 50,
			includeReverted: true,
		});

		return { actions };
	} catch (error) {
		console.error("Error fetching revertable actions:", error);
		return { actions: [], error: "Failed to fetch revertable actions" };
	}
}
