/**
 * AI Action Approval Service
 *
 * Handles owner-only approval workflow for destructive AI actions.
 * Ensures no destructive action can execute without explicit owner permission.
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import {
	isDestructiveTool,
	getDestructiveToolMetadata,
	type DestructiveToolMetadata,
	type DestructiveActionType,
	type RiskLevel,
} from "./agent-tools";

// ============================================================================
// Types
// ============================================================================

export interface PendingAction {
	id: string;
	companyId: string;
	chatId: string;
	messageId: string;
	userId: string;
	toolName: string;
	toolArgs: Record<string, unknown>;
	actionType: DestructiveActionType;
	affectedEntityType: string;
	affectedEntityIds: string[];
	affectedCount: number;
	riskLevel: RiskLevel;
	status: "pending" | "approved" | "rejected" | "expired" | "executed" | "failed";
	approvedBy?: string;
	approvedAt?: string;
	rejectionReason?: string;
	executedAt?: string;
	executionResult?: Record<string, unknown>;
	executionError?: string;
	expiresAt: string;
	createdAt: string;
}

export interface CreatePendingActionInput {
	companyId: string;
	chatId: string;
	messageId: string;
	userId: string;
	toolName: string;
	toolArgs: Record<string, unknown>;
	affectedEntityIds?: string[];
}

export interface ApprovalResult {
	success: boolean;
	error?: string;
	actionId?: string;
	toolName?: string;
	toolArgs?: Record<string, unknown>;
}

// ============================================================================
// Owner Verification
// ============================================================================

/**
 * Check if a user is the owner of a company
 * Uses the database function for consistency with RLS
 */
export async function isCompanyOwner(
	companyId: string,
	userId: string
): Promise<boolean> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase.rpc("is_company_owner", {
		p_company_id: companyId,
		p_user_id: userId,
	});

	if (error) {
		console.error("Error checking owner status:", error);
		return false;
	}

	return data === true;
}

/**
 * Get the owner(s) of a company
 */
export async function getCompanyOwners(companyId: string): Promise<Array<{
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
}>> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("company_memberships")
		.select(`
			user_id,
			users!company_memberships_users_id_fkey (
				email,
				name
			)
		`)
		.eq("company_id", companyId)
		.eq("role", "owner");

	if (error) {
		console.error("Error fetching company owners:", error);
		return [];
	}

	return (data || []).map((row) => {
		const user = row.users as { email: string; name: string } | null;
		const nameParts = (user?.name || "").split(" ");
		return {
			userId: row.user_id,
			email: user?.email || "",
			firstName: nameParts[0] || "",
			lastName: nameParts.slice(1).join(" ") || "",
		};
	});
}

// ============================================================================
// Pending Action Management
// ============================================================================

/**
 * Create a pending action that requires owner approval
 * Returns the pending action ID for tracking
 */
export async function createPendingAction(
	input: CreatePendingActionInput
): Promise<{ success: boolean; pendingActionId?: string; error?: string }> {
	const supabase = createServiceSupabaseClient();

	// Get metadata about this destructive tool
	const metadata = getDestructiveToolMetadata(input.toolName);
	if (!metadata) {
		return { success: false, error: `Tool '${input.toolName}' is not registered as destructive` };
	}

	// Calculate expiration (24 hours from now)
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 24);

	// Create the pending action record
	const { data, error } = await supabase
		.from("ai_pending_actions")
		.insert({
			company_id: input.companyId,
			chat_id: input.chatId,
			message_id: input.messageId,
			user_id: input.userId,
			tool_name: input.toolName,
			tool_args: input.toolArgs,
			action_type: metadata.actionType,
			action_title: `AI wants to: ${metadata.description}`,
			action_summary: generateActionSummary(input.toolName, input.toolArgs, metadata),
			action_details: {
				toolName: input.toolName,
				toolArgs: input.toolArgs,
				metadata,
			},
			affected_entity_type: metadata.affectedEntityType,
			affected_entity_ids: input.affectedEntityIds || [],
			affected_count: input.affectedEntityIds?.length || 1,
			risk_level: metadata.riskLevel,
			status: "pending",
			urgency: metadata.riskLevel === "critical" ? "high" : metadata.riskLevel === "high" ? "medium" : "low",
			expires_at: expiresAt.toISOString(),
			// Required by existing schema
			action_log_id: crypto.randomUUID(),
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating pending action:", error);
		return { success: false, error: error.message };
	}

	return { success: true, pendingActionId: data.id };
}

/**
 * Generate a human-readable summary of the action
 */
function generateActionSummary(
	toolName: string,
	toolArgs: Record<string, unknown>,
	metadata: DestructiveToolMetadata
): string {
	const parts: string[] = [metadata.description];

	// Add relevant details from toolArgs
	if (toolArgs.to || toolArgs.recipient) {
		parts.push(`Recipient: ${toolArgs.to || toolArgs.recipient}`);
	}
	if (toolArgs.subject) {
		parts.push(`Subject: "${toolArgs.subject}"`);
	}
	if (toolArgs.customerId) {
		parts.push(`Customer ID: ${toolArgs.customerId}`);
	}
	if (toolArgs.amount) {
		parts.push(`Amount: $${(toolArgs.amount as number) / 100}`);
	}

	return parts.join(" | ");
}

/**
 * Get all pending actions for a chat session
 */
export async function getPendingActionsForChat(
	companyId: string,
	chatId: string
): Promise<PendingAction[]> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_pending_actions")
		.select("*")
		.eq("company_id", companyId)
		.eq("chat_id", chatId)
		.eq("status", "pending")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching pending actions:", error);
		return [];
	}

	return (data || []).map(mapDbToPendingAction);
}

/**
 * Get all pending actions for a company (for owner dashboard)
 */
export async function getPendingActionsForCompany(
	companyId: string,
	options?: {
		status?: "pending" | "approved" | "rejected" | "expired";
		limit?: number;
	}
): Promise<PendingAction[]> {
	const supabase = createServiceSupabaseClient();

	let query = supabase
		.from("ai_pending_actions")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false });

	if (options?.status) {
		query = query.eq("status", options.status);
	}

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Error fetching pending actions:", error);
		return [];
	}

	return (data || []).map(mapDbToPendingAction);
}

/**
 * Get a specific pending action by ID
 */
export async function getPendingAction(
	companyId: string,
	actionId: string
): Promise<PendingAction | null> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_pending_actions")
		.select("*")
		.eq("company_id", companyId)
		.eq("id", actionId)
		.single();

	if (error) {
		console.error("Error fetching pending action:", error);
		return null;
	}

	return mapDbToPendingAction(data);
}

// ============================================================================
// Approval/Rejection (Owner-Only)
// ============================================================================

/**
 * Approve a pending action - OWNER ONLY
 * Uses the database function which enforces owner check
 */
export async function approveAction(
	actionId: string,
	approverId: string
): Promise<ApprovalResult> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase.rpc("approve_pending_action", {
		p_action_id: actionId,
		p_approver_id: approverId,
	});

	if (error) {
		console.error("Error approving action:", error);
		return { success: false, error: error.message };
	}

	const result = data as ApprovalResult;
	return result;
}

/**
 * Reject a pending action - OWNER ONLY
 * Uses the database function which enforces owner check
 */
export async function rejectAction(
	actionId: string,
	rejectorId: string,
	reason?: string
): Promise<ApprovalResult> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase.rpc("reject_pending_action", {
		p_action_id: actionId,
		p_rejector_id: rejectorId,
		p_reason: reason || null,
	});

	if (error) {
		console.error("Error rejecting action:", error);
		return { success: false, error: error.message };
	}

	const result = data as ApprovalResult;
	return result;
}

// ============================================================================
// Execution After Approval
// ============================================================================

/**
 * Mark an approved action as executed
 */
export async function markActionExecuted(
	companyId: string,
	actionId: string,
	result: Record<string, unknown>
): Promise<boolean> {
	const supabase = createServiceSupabaseClient();

	const { error } = await supabase
		.from("ai_pending_actions")
		.update({
			status: "executed",
			executed_at: new Date().toISOString(),
			execution_result: result,
			updated_at: new Date().toISOString(),
		})
		.eq("company_id", companyId)
		.eq("id", actionId)
		.eq("status", "approved"); // Can only execute approved actions

	if (error) {
		console.error("Error marking action as executed:", error);
		return false;
	}

	return true;
}

/**
 * Mark an approved action as failed
 */
export async function markActionFailed(
	companyId: string,
	actionId: string,
	errorMessage: string
): Promise<boolean> {
	const supabase = createServiceSupabaseClient();

	const { error } = await supabase
		.from("ai_pending_actions")
		.update({
			status: "failed",
			execution_error: errorMessage,
			updated_at: new Date().toISOString(),
		})
		.eq("company_id", companyId)
		.eq("id", actionId)
		.eq("status", "approved");

	if (error) {
		console.error("Error marking action as failed:", error);
		return false;
	}

	return true;
}

// ============================================================================
// Expiration Handling
// ============================================================================

/**
 * Expire old pending actions (called by cron or on access)
 */
export async function expireOldActions(companyId: string): Promise<number> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_pending_actions")
		.update({
			status: "expired",
			updated_at: new Date().toISOString(),
		})
		.eq("company_id", companyId)
		.eq("status", "pending")
		.lt("expires_at", new Date().toISOString())
		.select("id");

	if (error) {
		console.error("Error expiring old actions:", error);
		return 0;
	}

	return data?.length || 0;
}

// ============================================================================
// Tool Interception Helper
// ============================================================================

/**
 * Check if a tool call should be intercepted for owner approval
 * Returns the pending action details if interception is needed
 */
export async function shouldInterceptTool(
	toolName: string,
	toolArgs: Record<string, unknown>,
	context: {
		companyId: string;
		chatId: string;
		messageId: string;
		userId: string;
	}
): Promise<{
	intercept: boolean;
	pendingActionId?: string;
	metadata?: DestructiveToolMetadata;
	error?: string;
}> {
	// Check if tool is destructive
	if (!isDestructiveTool(toolName)) {
		return { intercept: false };
	}

	const metadata = getDestructiveToolMetadata(toolName);
	if (!metadata || !metadata.requiresOwnerApproval) {
		return { intercept: false };
	}

	// Check if user is already an owner (owners can self-approve in UI)
	const isOwner = await isCompanyOwner(context.companyId, context.userId);

	// Even owners need to see the dialog and explicitly approve
	// This ensures conscious decision-making for destructive actions

	// Create pending action
	const result = await createPendingAction({
		companyId: context.companyId,
		chatId: context.chatId,
		messageId: context.messageId,
		userId: context.userId,
		toolName,
		toolArgs,
	});

	if (!result.success) {
		return { intercept: true, error: result.error, metadata };
	}

	return {
		intercept: true,
		pendingActionId: result.pendingActionId,
		metadata,
	};
}

// ============================================================================
// Helpers
// ============================================================================

function mapDbToPendingAction(row: Record<string, unknown>): PendingAction {
	return {
		id: row.id as string,
		companyId: row.company_id as string,
		chatId: row.chat_id as string,
		messageId: row.message_id as string,
		userId: row.user_id as string,
		toolName: row.tool_name as string,
		toolArgs: (row.tool_args as Record<string, unknown>) || {},
		actionType: row.action_type as DestructiveActionType,
		affectedEntityType: row.affected_entity_type as string,
		affectedEntityIds: (row.affected_entity_ids as string[]) || [],
		affectedCount: (row.affected_count as number) || 1,
		riskLevel: (row.risk_level as RiskLevel) || "medium",
		status: row.status as PendingAction["status"],
		approvedBy: row.approved_by as string | undefined,
		approvedAt: row.approved_at as string | undefined,
		rejectionReason: row.rejection_reason as string | undefined,
		executedAt: row.executed_at as string | undefined,
		executionResult: row.execution_result as Record<string, unknown> | undefined,
		executionError: row.execution_error as string | undefined,
		expiresAt: row.expires_at as string,
		createdAt: row.created_at as string,
	};
}

// ============================================================================
// Exports for use in AI chat route and UI
// ============================================================================

export {
	isDestructiveTool,
	getDestructiveToolMetadata,
	type DestructiveToolMetadata,
	type DestructiveActionType,
	type RiskLevel,
} from "./agent-tools";
