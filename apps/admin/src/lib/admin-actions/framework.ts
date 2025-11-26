/**
 * Admin Actions Framework
 *
 * Core framework for all admin editing actions in view-as mode.
 * Provides:
 * - Session validation
 * - Permission checking
 * - Automatic audit logging
 * - Before/after data capture
 * - Error handling
 */

import {
	requireActiveSupportSession,
	hasPermission,
	logAdminActionInSession,
	getActiveSupportSessionId,
} from "@/lib/admin-context";
import { getAdminSession } from "@/lib/auth/session";
import { createWebClient } from "@/lib/supabase/web-client";

export type ActionResult<T = void> = {
	success: boolean;
	data?: T;
	error?: string;
};

/**
 * Admin Action Options
 */
interface AdminActionOptions {
	permission: string;
	action: string;
	resourceType: string;
	resourceId: string;
	reason?: string;
}

/**
 * Execute Admin Action
 *
 * Wrapper function that handles all common admin action logic:
 * - Validates active support session
 * - Checks required permission
 * - Logs action to audit trail
 * - Handles errors
 *
 * @param options - Action configuration
 * @param handler - The actual action logic (receives supabase client and session)
 * @returns ActionResult with success status and optional data/error
 */
export async function executeAdminAction<T>(
	options: AdminActionOptions,
	handler: (supabase: ReturnType<typeof createWebClient>, sessionId: string) => Promise<T>,
): Promise<ActionResult<T>> {
	try {
		// 1. Validate active support session
		const session = await requireActiveSupportSession();

		// 2. Check permission
		const hasRequiredPermission = await hasPermission(options.permission);
		if (!hasRequiredPermission) {
			return {
				success: false,
				error: `Permission denied: ${options.permission} required`,
			};
		}

		// 3. Get admin user info
		const adminSession = await getAdminSession();
		if (!adminSession) {
			return {
				success: false,
				error: "Admin session not found",
			};
		}

		// 4. Execute the action
		const supabase = createWebClient();
		const result = await handler(supabase, session.sessionId);

		// 5. Log to audit trail
		const sessionId = await getActiveSupportSessionId();
		if (sessionId) {
			await logAdminActionInSession(
				options.action,
				options.resourceType,
				options.resourceId,
				null, // before_data - handler should log this if needed
				null, // after_data - handler should log this if needed
				options.reason,
			);
		}

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error(`Admin action error (${options.action}):`, error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

/**
 * Get Before/After Data for Audit Log
 *
 * Fetches current data from a table before making changes.
 * Used for audit trail to show what was changed.
 */
export async function getBeforeData(
	table: string,
	id: string,
	columns: string = "*",
): Promise<any> {
	const supabase = createWebClient();

	const { data, error } = await supabase
		.from(table)
		.select(columns)
		.eq("id", id)
		.single();

	if (error) {
		console.warn(`Failed to fetch before data from ${table}:`, error);
		return null;
	}

	return data;
}

/**
 * Log Detailed Action
 *
 * Logs an action with before/after data for complete audit trail.
 */
export async function logDetailedAction(
	action: string,
	resourceType: string,
	resourceId: string,
	beforeData: any,
	afterData: any,
	reason?: string,
): Promise<void> {
	const sessionId = await getActiveSupportSessionId();
	if (!sessionId) {
		console.warn("No active session - cannot log action");
		return;
	}

	await logAdminActionInSession(
		action,
		resourceType,
		resourceId,
		beforeData,
		afterData,
		reason,
	);
}

/**
 * Validate Company Ownership
 *
 * Ensures the resource belongs to the impersonated company.
 * Prevents admins from accidentally editing data from other companies.
 */
export async function validateCompanyOwnership(
	table: string,
	resourceId: string,
	companyId: string,
): Promise<boolean> {
	const supabase = createWebClient();

	const { data, error } = await supabase
		.from(table)
		.select("company_id")
		.eq("id", resourceId)
		.single();

	if (error || !data) {
		return false;
	}

	return data.company_id === companyId;
}
