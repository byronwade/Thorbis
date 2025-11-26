/**
 * AI Action Approval Server Actions
 *
 * Server actions for owner-only approval of destructive AI actions.
 * These actions wrap the action-approval service for use in React components.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
	approveAction,
	expireOldActions,
	getPendingAction,
	getPendingActionsForChat,
	getPendingActionsForCompany,
	isCompanyOwner,
	type PendingAction,
	rejectAction,
} from "@/lib/ai/action-approval";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// Types
// ============================================================================

export type { PendingAction };

export interface ApprovalActionResult {
	success: boolean;
	error?: string;
	actionId?: string;
	toolName?: string;
	toolArgs?: Record<string, unknown>;
	// Execution fields (for approval responses)
	executed?: boolean;
	executionResult?: unknown;
	executionError?: string;
}

// ============================================================================
// Validation Schemas
// ============================================================================

const approveActionSchema = z.object({
	actionId: z.string().uuid("Invalid action ID"),
});

const rejectActionSchema = z.object({
	actionId: z.string().uuid("Invalid action ID"),
	reason: z.string().max(500, "Reason too long").optional(),
});

const getPendingActionsSchema = z.object({
	status: z.enum(["pending", "approved", "rejected", "expired"]).optional(),
	limit: z.number().min(1).max(100).default(50),
});

const getChatActionsSchema = z.object({
	chatId: z.string().uuid("Invalid chat ID"),
});

// ============================================================================
// Helper Functions
// ============================================================================

async function getAuthenticatedUserWithCompany() {
	const supabase = await createClient();
	if (!supabase) {
		throw new ActionError(
			"Database connection failed",
			ERROR_CODES.DB_CONNECTION_ERROR,
		);
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	assertAuthenticated(user?.id);

	const { data: teamMember } = await supabase
		.from("company_memberships")
		.select("company_id, role")
		.eq("user_id", user.id)
		.single();

	if (!teamMember?.company_id) {
		throw new ActionError(
			"You must be part of a company",
			ERROR_CODES.AUTH_FORBIDDEN,
			403,
		);
	}

	return {
		userId: user.id,
		companyId: teamMember.company_id,
		role: teamMember.role,
	};
}

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Approve a pending AI action - OWNER ONLY
 * This action will be executed immediately after approval
 */
export async function approveAIAction(
	input: z.infer<typeof approveActionSchema>,
): Promise<ActionResult<ApprovalActionResult>> {
	return await withErrorHandling(async () => {
		const validated = approveActionSchema.parse(input);
		const { userId, companyId } = await getAuthenticatedUserWithCompany();

		// Verify user is owner (double-check even though DB function enforces this)
		const ownerCheck = await isCompanyOwner(companyId, userId);
		if (!ownerCheck) {
			throw new ActionError(
				"Only company owners can approve destructive AI actions",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Call the approval function (which calls the DB RPC)
		const result = await approveAction(validated.actionId, userId);

		if (!result.success) {
			throw new ActionError(
				result.error || "Failed to approve action",
				ERROR_CODES.OPERATION_FAILED,
			);
		}

		// Automatically execute the approved action
		let executionResult: {
			success: boolean;
			result?: unknown;
			error?: string;
		} | null = null;
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ai/execute-approved`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						actionId: validated.actionId,
						companyId,
					}),
				},
			);
			executionResult = await response.json();
		} catch (execError) {
			console.error("Failed to auto-execute approved action:", execError);
			// Don't fail the approval - execution can be retried
		}

		// Revalidate AI-related paths
		revalidatePath("/dashboard/ai");
		revalidatePath("/dashboard/settings/ai");

		return {
			success: true,
			actionId: result.actionId,
			toolName: result.toolName,
			toolArgs: result.toolArgs,
			executed: executionResult?.success || false,
			executionResult: executionResult?.result,
			executionError: executionResult?.error,
		};
	});
}

/**
 * Reject a pending AI action - OWNER ONLY
 * The AI will not execute this action
 */
export async function rejectAIAction(
	input: z.infer<typeof rejectActionSchema>,
): Promise<ActionResult<ApprovalActionResult>> {
	return await withErrorHandling(async () => {
		const validated = rejectActionSchema.parse(input);
		const { userId, companyId } = await getAuthenticatedUserWithCompany();

		// Verify user is owner
		const ownerCheck = await isCompanyOwner(companyId, userId);
		if (!ownerCheck) {
			throw new ActionError(
				"Only company owners can reject destructive AI actions",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Call the rejection function
		const result = await rejectAction(
			validated.actionId,
			userId,
			validated.reason,
		);

		if (!result.success) {
			throw new ActionError(
				result.error || "Failed to reject action",
				ERROR_CODES.OPERATION_FAILED,
			);
		}

		// Revalidate AI-related paths
		revalidatePath("/dashboard/ai");
		revalidatePath("/dashboard/settings/ai");

		return {
			success: true,
			actionId: validated.actionId,
		};
	});
}

/**
 * Get all pending actions for the current company
 * Used by the owner dashboard to review pending approvals
 */
export async function getCompanyPendingActions(
	input?: z.infer<typeof getPendingActionsSchema>,
): Promise<ActionResult<PendingAction[]>> {
	return await withErrorHandling(async () => {
		const validated = input
			? getPendingActionsSchema.parse(input)
			: { limit: 50 };
		const { companyId } = await getAuthenticatedUserWithCompany();

		// Expire old actions first
		await expireOldActions(companyId);

		// Fetch pending actions
		const actions = await getPendingActionsForCompany(companyId, {
			status: validated.status,
			limit: validated.limit,
		});

		return actions;
	});
}

/**
 * Get pending actions for a specific chat session
 * Used to show approval banners in the AI chat
 */
export async function getChatPendingActions(
	input: z.infer<typeof getChatActionsSchema>,
): Promise<ActionResult<PendingAction[]>> {
	return await withErrorHandling(async () => {
		const validated = getChatActionsSchema.parse(input);
		const { companyId } = await getAuthenticatedUserWithCompany();

		// Expire old actions first
		await expireOldActions(companyId);

		// Fetch pending actions for the chat
		const actions = await getPendingActionsForChat(companyId, validated.chatId);

		return actions;
	});
}

/**
 * Get a specific pending action by ID
 */
export async function getPendingActionById(
	actionId: string,
): Promise<ActionResult<PendingAction | null>> {
	return await withErrorHandling(async () => {
		const validated = z.string().uuid("Invalid action ID").parse(actionId);
		const { companyId } = await getAuthenticatedUserWithCompany();

		const action = await getPendingAction(companyId, validated);
		return action;
	});
}

/**
 * Check if current user is a company owner
 * Used by UI to determine if approval buttons should be enabled
 */
export async function checkIsCompanyOwner(): Promise<ActionResult<boolean>> {
	return await withErrorHandling(async () => {
		const { userId, companyId } = await getAuthenticatedUserWithCompany();
		const isOwner = await isCompanyOwner(companyId, userId);
		return isOwner;
	});
}

/**
 * Get pending action counts for notifications
 */
export async function getPendingActionCounts(): Promise<
	ActionResult<{
		total: number;
		byRiskLevel: Record<string, number>;
	}>
> {
	return await withErrorHandling(async () => {
		const { companyId } = await getAuthenticatedUserWithCompany();

		// Expire old actions first
		await expireOldActions(companyId);

		// Fetch pending actions
		const actions = await getPendingActionsForCompany(companyId, {
			status: "pending",
			limit: 100,
		});

		// Group by risk level
		const byRiskLevel: Record<string, number> = {
			low: 0,
			medium: 0,
			high: 0,
			critical: 0,
		};

		for (const action of actions) {
			byRiskLevel[action.riskLevel] = (byRiskLevel[action.riskLevel] || 0) + 1;
		}

		return {
			total: actions.length,
			byRiskLevel,
		};
	});
}
