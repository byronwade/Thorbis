/**
 * Execute Approved AI Actions API
 *
 * This endpoint executes AI actions that have been approved by company owners.
 * It can be called:
 * 1. Immediately after approval via the UI
 * 2. By a cron job to process any approved but unexecuted actions
 * 3. Via polling from the AI chat interface
 */

import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { aiAgentTools } from "@/lib/ai/agent-tools";
import {
	markActionExecuted,
	markActionFailed,
	type PendingAction,
} from "@/lib/ai/action-approval";

export const maxDuration = 30;

interface ExecutionResult {
	actionId: string;
	toolName: string;
	success: boolean;
	result?: unknown;
	error?: string;
}

/**
 * Execute a single approved action
 */
async function executeApprovedAction(
	action: PendingAction
): Promise<ExecutionResult> {
	const toolName = action.toolName;
	const toolArgs = action.toolArgs;
	const companyId = action.companyId;

	// Get the tool from our registry
	const toolInstance = aiAgentTools[toolName as keyof typeof aiAgentTools];

	if (!toolInstance) {
		return {
			actionId: action.id,
			toolName,
			success: false,
			error: `Tool '${toolName}' not found in registry`,
		};
	}

	try {
		// Execute the tool with the stored arguments
		// Tools expect a context object with companyId
		const executeFunc = toolInstance.execute as (
			args: Record<string, unknown>,
			context: { companyId: string }
		) => Promise<unknown>;

		const result = await executeFunc(toolArgs, { companyId });

		// Mark the action as executed
		await markActionExecuted(companyId, action.id, result as Record<string, unknown>);

		return {
			actionId: action.id,
			toolName,
			success: true,
			result,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error during execution";

		// Mark the action as failed
		await markActionFailed(companyId, action.id, errorMessage);

		return {
			actionId: action.id,
			toolName,
			success: false,
			error: errorMessage,
		};
	}
}

/**
 * POST: Execute a specific approved action by ID
 */
export async function POST(req: Request) {
	try {
		const { actionId, companyId } = await req.json();

		if (!actionId || !companyId) {
			return NextResponse.json(
				{ error: "actionId and companyId are required" },
				{ status: 400 }
			);
		}

		const supabase = createServiceSupabaseClient();

		// Fetch the approved action
		const { data: action, error } = await supabase
			.from("ai_pending_actions")
			.select("*")
			.eq("id", actionId)
			.eq("company_id", companyId)
			.eq("status", "approved")
			.single();

		if (error || !action) {
			return NextResponse.json(
				{ error: "Action not found or not approved" },
				{ status: 404 }
			);
		}

		// Map database row to PendingAction
		const pendingAction: PendingAction = {
			id: action.id,
			companyId: action.company_id,
			chatId: action.chat_id,
			messageId: action.message_id,
			userId: action.user_id,
			toolName: action.tool_name,
			toolArgs: action.tool_args || {},
			actionType: action.action_type,
			affectedEntityType: action.affected_entity_type,
			affectedEntityIds: action.affected_entity_ids || [],
			affectedCount: action.affected_count || 1,
			riskLevel: action.risk_level || "medium",
			status: action.status,
			expiresAt: action.expires_at,
			createdAt: action.created_at,
		};

		// Execute the action
		const result = await executeApprovedAction(pendingAction);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error executing approved action:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}

/**
 * GET: Process all approved but unexecuted actions for a company
 * Can be called by cron or for batch processing
 */
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const companyId = searchParams.get("companyId");

		if (!companyId) {
			return NextResponse.json(
				{ error: "companyId query parameter is required" },
				{ status: 400 }
			);
		}

		const supabase = createServiceSupabaseClient();

		// Fetch all approved but unexecuted actions
		const { data: actions, error } = await supabase
			.from("ai_pending_actions")
			.select("*")
			.eq("company_id", companyId)
			.eq("status", "approved")
			.is("executed_at", null)
			.order("approved_at", { ascending: true });

		if (error) {
			return NextResponse.json(
				{ error: error.message },
				{ status: 500 }
			);
		}

		if (!actions || actions.length === 0) {
			return NextResponse.json({
				message: "No approved actions pending execution",
				executed: [],
			});
		}

		// Execute each action
		const results: ExecutionResult[] = [];

		for (const action of actions) {
			const pendingAction: PendingAction = {
				id: action.id,
				companyId: action.company_id,
				chatId: action.chat_id,
				messageId: action.message_id,
				userId: action.user_id,
				toolName: action.tool_name,
				toolArgs: action.tool_args || {},
				actionType: action.action_type,
				affectedEntityType: action.affected_entity_type,
				affectedEntityIds: action.affected_entity_ids || [],
				affectedCount: action.affected_count || 1,
				riskLevel: action.risk_level || "medium",
				status: action.status,
				expiresAt: action.expires_at,
				createdAt: action.created_at,
			};

			const result = await executeApprovedAction(pendingAction);
			results.push(result);
		}

		const successful = results.filter((r) => r.success).length;
		const failed = results.filter((r) => !r.success).length;

		return NextResponse.json({
			message: `Executed ${successful} action(s), ${failed} failed`,
			executed: results,
		});
	} catch (error) {
		console.error("Error processing approved actions:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
