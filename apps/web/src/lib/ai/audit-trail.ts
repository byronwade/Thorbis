/**
 * AI Audit Trail Service - Tamper-evident logging for AI actions
 * Based on industry best practices from Langfuse, Datadog, and compliance standards
 */

import crypto from "crypto";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export type AuditAction =
	| "create"
	| "update"
	| "delete"
	| "query"
	| "tool_call"
	| "api_call"
	| "file_access"
	| "permission_change"
	| "configuration_change"
	| "data_export"
	| "bulk_operation";

export type AuditSeverity = "low" | "medium" | "high" | "critical";

export interface AuditContext {
	companyId: string;
	userId?: string;
	chatId?: string;
	messageId?: string;
	traceId?: string;
	spanId?: string;
	sessionId?: string;
}

export interface AuditLogEntry {
	action: AuditAction;
	entityType: string;
	entityId?: string;
	entityIds?: string[];
	beforeState?: Record<string, unknown>;
	afterState?: Record<string, unknown>;
	changedFields?: string[];
	toolName?: string;
	toolParams?: Record<string, unknown>;
	toolResult?: Record<string, unknown>;
	severity?: AuditSeverity;
	ipAddress?: string;
	userAgent?: string;
	metadata?: Record<string, unknown>;
}

export interface ReversalRequest {
	auditLogId: string;
	reason: string;
	reversedBy: string;
	reversalMethod: "automatic" | "manual" | "partial";
	partialFields?: string[];
}

/**
 * Calculate SHA-256 checksum for tamper detection
 */
function calculateChecksum(data: Record<string, unknown>): string {
	const normalized = JSON.stringify(data, Object.keys(data).sort());
	return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Determine severity based on action and entity type
 */
function determineSeverity(
	action: AuditAction,
	entityType: string,
): AuditSeverity {
	// Critical actions
	if (action === "delete" || action === "permission_change") return "critical";
	if (action === "bulk_operation") return "high";
	if (entityType.includes("payment") || entityType.includes("invoice"))
		return "high";
	if (action === "configuration_change") return "high";
	if (action === "data_export") return "high";
	if (action === "update") return "medium";
	if (action === "create") return "medium";
	return "low";
}

/**
 * Extract changed fields from before/after states
 */
function extractChangedFields(
	before?: Record<string, unknown>,
	after?: Record<string, unknown>,
): string[] {
	if (!before || !after) return [];

	const changedFields: string[] = [];
	const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

	for (const key of allKeys) {
		if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
			changedFields.push(key);
		}
	}

	return changedFields;
}

/**
 * Create an audit log entry with tamper-evident checksum
 */
export async function createAuditLog(
	context: AuditContext,
	entry: AuditLogEntry,
): Promise<string> {
	const supabase = createServiceSupabaseClient();
	const auditId = crypto.randomUUID();
	const timestamp = new Date().toISOString();

	// Calculate changed fields if not provided
	const changedFields =
		entry.changedFields ||
		extractChangedFields(entry.beforeState, entry.afterState);

	// Determine severity if not provided
	const severity =
		entry.severity || determineSeverity(entry.action, entry.entityType);

	// Prepare the data for checksum calculation
	const checksumData = {
		id: auditId,
		company_id: context.companyId,
		user_id: context.userId,
		chat_id: context.chatId,
		message_id: context.messageId,
		trace_id: context.traceId,
		span_id: context.spanId,
		action: entry.action,
		entity_type: entry.entityType,
		entity_id: entry.entityId,
		entity_ids: entry.entityIds,
		before_state: entry.beforeState,
		after_state: entry.afterState,
		changed_fields: changedFields,
		tool_name: entry.toolName,
		tool_params: entry.toolParams,
		tool_result: entry.toolResult,
		timestamp,
	};

	const checksum = calculateChecksum(checksumData);

	const { error } = await supabase.from("ai_audit_log").insert({
		id: auditId,
		company_id: context.companyId,
		user_id: context.userId,
		chat_id: context.chatId,
		message_id: context.messageId,
		trace_id: context.traceId,
		span_id: context.spanId,
		action: entry.action,
		entity_type: entry.entityType,
		entity_id: entry.entityId,
		entity_ids: entry.entityIds || [],
		before_state: entry.beforeState,
		after_state: entry.afterState,
		changed_fields: changedFields,
		tool_name: entry.toolName,
		tool_params: entry.toolParams,
		tool_result: entry.toolResult,
		severity,
		ip_address: entry.ipAddress,
		user_agent: entry.userAgent,
		metadata: entry.metadata || {},
		checksum,
		is_reversible: entry.action !== "query" && entry.beforeState !== undefined,
		reversed: false,
		created_at: timestamp,
	});

	if (error) {
		console.error("Failed to create audit log:", error);
		throw error;
	}

	return auditId;
}

/**
 * Verify audit log integrity by recalculating checksum
 */
export async function verifyAuditLogIntegrity(
	companyId: string,
	auditLogId: string,
): Promise<{ valid: boolean; reason?: string }> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_audit_log")
		.select("*")
		.eq("id", auditLogId)
		.eq("company_id", companyId)
		.single();

	if (error || !data) {
		return { valid: false, reason: "Audit log not found" };
	}

	// Recalculate checksum
	const checksumData = {
		id: data.id,
		company_id: data.company_id,
		user_id: data.user_id,
		chat_id: data.chat_id,
		message_id: data.message_id,
		trace_id: data.trace_id,
		span_id: data.span_id,
		action: data.action,
		entity_type: data.entity_type,
		entity_id: data.entity_id,
		entity_ids: data.entity_ids,
		before_state: data.before_state,
		after_state: data.after_state,
		changed_fields: data.changed_fields,
		tool_name: data.tool_name,
		tool_params: data.tool_params,
		tool_result: data.tool_result,
		timestamp: data.created_at,
	};

	const calculatedChecksum = calculateChecksum(checksumData);

	if (calculatedChecksum !== data.checksum) {
		return {
			valid: false,
			reason: "Checksum mismatch - data may have been tampered",
		};
	}

	return { valid: true };
}

/**
 * Get audit trail for a specific entity
 */
export async function getEntityAuditTrail(
	companyId: string,
	entityType: string,
	entityId: string,
	options?: { limit?: number; offset?: number },
): Promise<{
	entries: Array<{
		id: string;
		action: string;
		changedFields: string[];
		beforeState: Record<string, unknown> | null;
		afterState: Record<string, unknown> | null;
		userId: string | null;
		toolName: string | null;
		severity: string;
		reversed: boolean;
		createdAt: string;
	}>;
	total: number;
}> {
	const supabase = createServiceSupabaseClient();
	const limit = options?.limit || 50;
	const offset = options?.offset || 0;

	// Get total count
	const { count } = await supabase
		.from("ai_audit_log")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.eq("entity_type", entityType)
		.eq("entity_id", entityId);

	// Get entries
	const { data, error } = await supabase
		.from("ai_audit_log")
		.select(
			"id, action, changed_fields, before_state, after_state, user_id, tool_name, severity, reversed, created_at",
		)
		.eq("company_id", companyId)
		.eq("entity_type", entityType)
		.eq("entity_id", entityId)
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		console.error("Failed to get entity audit trail:", error);
		return { entries: [], total: 0 };
	}

	return {
		entries: (data || []).map((entry) => ({
			id: entry.id,
			action: entry.action,
			changedFields: entry.changed_fields || [],
			beforeState: entry.before_state as Record<string, unknown> | null,
			afterState: entry.after_state as Record<string, unknown> | null,
			userId: entry.user_id,
			toolName: entry.tool_name,
			severity: entry.severity,
			reversed: entry.reversed,
			createdAt: entry.created_at,
		})),
		total: count || 0,
	};
}

/**
 * Get audit trail for a chat session
 */
export async function getChatAuditTrail(
	companyId: string,
	chatId: string,
	options?: {
		limit?: number;
		offset?: number;
		severityFilter?: AuditSeverity[];
	},
): Promise<{
	entries: Array<{
		id: string;
		action: string;
		entityType: string;
		entityId: string | null;
		toolName: string | null;
		severity: string;
		isReversible: boolean;
		reversed: boolean;
		createdAt: string;
	}>;
	total: number;
}> {
	const supabase = createServiceSupabaseClient();
	const limit = options?.limit || 50;
	const offset = options?.offset || 0;

	let query = supabase
		.from("ai_audit_log")
		.select("*", { count: "exact" })
		.eq("company_id", companyId)
		.eq("chat_id", chatId);

	if (options?.severityFilter && options.severityFilter.length > 0) {
		query = query.in("severity", options.severityFilter);
	}

	const { data, error, count } = await query
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		console.error("Failed to get chat audit trail:", error);
		return { entries: [], total: 0 };
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
		})),
		total: count || 0,
	};
}

/**
 * Get high-severity audit entries for monitoring
 */
export async function getHighSeverityAuditEntries(
	companyId: string,
	options?: {
		since?: Date;
		limit?: number;
		includeReversed?: boolean;
	},
): Promise<
	Array<{
		id: string;
		action: string;
		entityType: string;
		entityId: string | null;
		userId: string | null;
		toolName: string | null;
		severity: string;
		reversed: boolean;
		createdAt: string;
	}>
> {
	const supabase = createServiceSupabaseClient();
	const since = options?.since || new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

	let query = supabase
		.from("ai_audit_log")
		.select(
			"id, action, entity_type, entity_id, user_id, tool_name, severity, reversed, created_at",
		)
		.eq("company_id", companyId)
		.in("severity", ["high", "critical"])
		.gte("created_at", since.toISOString())
		.order("created_at", { ascending: false })
		.limit(options?.limit || 100);

	if (!options?.includeReversed) {
		query = query.eq("reversed", false);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Failed to get high severity audit entries:", error);
		return [];
	}

	return (data || []).map((entry) => ({
		id: entry.id,
		action: entry.action,
		entityType: entry.entity_type,
		entityId: entry.entity_id,
		userId: entry.user_id,
		toolName: entry.tool_name,
		severity: entry.severity,
		reversed: entry.reversed,
		createdAt: entry.created_at,
	}));
}

/**
 * Record a reversal action
 */
export async function recordReversal(
	companyId: string,
	request: ReversalRequest,
): Promise<string> {
	const supabase = createServiceSupabaseClient();
	const reversalId = crypto.randomUUID();

	// Get the original audit log entry
	const { data: auditLog, error: fetchError } = await supabase
		.from("ai_audit_log")
		.select("*")
		.eq("id", request.auditLogId)
		.eq("company_id", companyId)
		.single();

	if (fetchError || !auditLog) {
		throw new Error("Audit log entry not found");
	}

	if (!auditLog.is_reversible) {
		throw new Error("This action is not reversible");
	}

	if (auditLog.reversed) {
		throw new Error("This action has already been reversed");
	}

	// Create reversal record
	const { error: insertError } = await supabase
		.from("ai_audit_reversal")
		.insert({
			id: reversalId,
			company_id: companyId,
			audit_log_id: request.auditLogId,
			reversed_by: request.reversedBy,
			reversal_reason: request.reason,
			reversal_method: request.reversalMethod,
			original_action: auditLog.action,
			original_entity_type: auditLog.entity_type,
			original_entity_id: auditLog.entity_id,
			restored_state: auditLog.before_state,
			partial_fields: request.partialFields,
			created_at: new Date().toISOString(),
		});

	if (insertError) {
		console.error("Failed to record reversal:", insertError);
		throw insertError;
	}

	// Mark original audit log as reversed
	const { error: updateError } = await supabase
		.from("ai_audit_log")
		.update({
			reversed: true,
			reversed_at: new Date().toISOString(),
			reversed_by: request.reversedBy,
			reversal_id: reversalId,
		})
		.eq("id", request.auditLogId)
		.eq("company_id", companyId);

	if (updateError) {
		console.error("Failed to update audit log:", updateError);
	}

	return reversalId;
}

/**
 * Get audit statistics for monitoring dashboard
 */
export async function getAuditStatistics(
	companyId: string,
	dateRange: { start: Date; end: Date },
): Promise<{
	totalActions: number;
	byAction: Record<string, number>;
	bySeverity: Record<string, number>;
	byEntityType: Record<string, number>;
	reversalRate: number;
	criticalActionsCount: number;
	topTools: Array<{ tool: string; count: number }>;
}> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_audit_log")
		.select("action, severity, entity_type, tool_name, reversed")
		.eq("company_id", companyId)
		.gte("created_at", dateRange.start.toISOString())
		.lte("created_at", dateRange.end.toISOString());

	if (error || !data) {
		return {
			totalActions: 0,
			byAction: {},
			bySeverity: {},
			byEntityType: {},
			reversalRate: 0,
			criticalActionsCount: 0,
			topTools: [],
		};
	}

	const byAction: Record<string, number> = {};
	const bySeverity: Record<string, number> = {};
	const byEntityType: Record<string, number> = {};
	const toolCounts: Record<string, number> = {};
	let reversedCount = 0;
	let criticalCount = 0;

	for (const entry of data) {
		byAction[entry.action] = (byAction[entry.action] || 0) + 1;
		bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
		byEntityType[entry.entity_type] =
			(byEntityType[entry.entity_type] || 0) + 1;

		if (entry.tool_name) {
			toolCounts[entry.tool_name] = (toolCounts[entry.tool_name] || 0) + 1;
		}

		if (entry.reversed) reversedCount++;
		if (entry.severity === "critical") criticalCount++;
	}

	const topTools = Object.entries(toolCounts)
		.map(([tool, count]) => ({ tool, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	return {
		totalActions: data.length,
		byAction,
		bySeverity,
		byEntityType,
		reversalRate: data.length > 0 ? (reversedCount / data.length) * 100 : 0,
		criticalActionsCount: criticalCount,
		topTools,
	};
}
