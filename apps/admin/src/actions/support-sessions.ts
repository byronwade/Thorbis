"use server";

/**
 * Support Sessions Management
 *
 * Server actions for managing support access sessions where admins can
 * view and edit customer accounts with customer approval.
 */

import { createAdminClient } from "@/lib/supabase/admin-client";
import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";
import { logAdminAction, ADMIN_ACTIONS } from "@/lib/admin/audit";
import { revalidatePath } from "next/cache";

export interface SupportSession {
	id: string;
	company_id: string;
	admin_user_id: string;
	ticket_id?: string;
	status: "pending" | "active" | "expired" | "ended" | "rejected";
	requested_at: string;
	approved_at?: string;
	expires_at?: string;
	reason?: string;
	requested_permissions: string[];
}

/**
 * Request a support session to access a customer's account
 */
export async function requestSupportSession(companyId: string, ticketId: string | null, reason: string, requestedPermissions: string[] = ["view"]) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const adminDb = createAdminClient();

	// Check if there's already an active session
	const { data: existingSession } = await adminDb.rpc("get_active_session_for_company", {
		p_company_id: companyId,
	});

	if (existingSession) {
		return { error: "Active session already exists for this company" };
	}

	// Create new pending session
	const { data: newSession, error: createError } = await adminDb
		.from("support_sessions")
		.insert({
			company_id: companyId,
			admin_user_id: session.userId,
			ticket_id: ticketId,
			status: "pending",
			reason,
			requested_permissions: requestedPermissions,
		})
		.select()
		.single();

	if (createError || !newSession) {
		return { error: "Failed to create support session" };
	}

	// Create permissions entries
	if (requestedPermissions.length > 0) {
		const permissionsToInsert = requestedPermissions.map((permission) => ({
			session_id: newSession.id,
			action_type: permission,
			granted: false, // Will be granted when customer approves
		}));

		await adminDb.from("support_session_permissions").insert(permissionsToInsert);
	}

	// Log the request
	await logAdminAction({
		adminUserId: session.userId,
		adminEmail: session.email || "",
		action: "support_session_requested",
		resourceType: "company",
		resourceId: companyId,
		details: {
			session_id: newSession.id,
			ticket_id: ticketId,
			reason,
			permissions: requestedPermissions,
		},
	});

	// TODO: Send notification to customer (will implement in Phase 5)
	// await sendSessionRequestNotification(companyId, newSession.id);

	return { data: newSession };
}

/**
 * Approve a support session (called by customer in web app)
 */
async function approveSupportSession(sessionId: string, durationMinutes: number = 60) {
	// TODO: Verify customer authorization (will implement with web app integration)
	// const webSession = await getWebSession();
	// if (!webSession) return { error: "Unauthorized" };

	const adminDb = createAdminClient();

	// Get session details
	const { data: session, error: fetchError } = await adminDb.from("support_sessions").select("*").eq("id", sessionId).single();

	if (fetchError || !session) {
		return { error: "Session not found" };
	}

	if (session.status !== "pending") {
		return { error: "Session is not pending approval" };
	}

	// Calculate expiration time
	const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

	// Update session to active
	const { error: updateError } = await adminDb
		.from("support_sessions")
		.update({
			status: "active",
			approved_at: new Date().toISOString(),
			// approved_by_user_id: webSession.user.id, // TODO: Add when web integration ready
			expires_at: expiresAt.toISOString(),
		})
		.eq("id", sessionId);

	if (updateError) {
		return { error: "Failed to approve session" };
	}

	// Grant all requested permissions
	await adminDb
		.from("support_session_permissions")
		.update({ granted: true, granted_at: new Date().toISOString() })
		.eq("session_id", sessionId);

	// TODO: Send confirmation to admin
	// await sendSessionApprovedNotification(session.admin_user_id, sessionId);

	revalidatePath("/admin/dashboard/work/companies");

	return { success: true, expiresAt: expiresAt.toISOString() };
}

/**
 * Reject a support session (called by customer in web app)
 */
async function rejectSupportSession(sessionId: string, reason?: string) {
	// TODO: Verify customer authorization
	const adminDb = createAdminClient();

	const { error } = await adminDb
		.from("support_sessions")
		.update({
			status: "rejected",
			rejected_at: new Date().toISOString(),
			rejected_reason: reason,
		})
		.eq("id", sessionId);

	if (error) {
		return { error: "Failed to reject session" };
	}

	return { success: true };
}

/**
 * End a support session (can be called by admin or customer)
 */
export async function endSupportSession(sessionId: string, endedBy: "admin" | "customer" = "admin") {
	const session = await getAdminSession();
	if (!session && endedBy === "admin") {
		return { error: "Unauthorized" };
	}

	const adminDb = createAdminClient();

	// Get session details for logging
	const { data: supportSession } = await adminDb.from("support_sessions").select("*").eq("id", sessionId).single();

	// Update session to ended
	const { error } = await adminDb
		.from("support_sessions")
		.update({
			status: "ended",
			ended_at: new Date().toISOString(),
			ended_by: endedBy,
		})
		.eq("id", sessionId);

	if (error) {
		return { error: "Failed to end session" };
	}

	// Log the action
	if (session && supportSession) {
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: "support_session_ended",
			resourceType: "company",
			resourceId: supportSession.company_id,
			details: {
				session_id: sessionId,
				ended_by: endedBy,
			},
		});
	}

	revalidatePath("/admin/dashboard/work/companies");

	return { success: true };
}

/**
 * Get support session status
 */
async function getSupportSessionStatus(sessionId: string) {
	const adminDb = createAdminClient();

	const { data: session, error } = await adminDb.from("support_sessions").select("*, admin_users(email, full_name)").eq("id", sessionId).single();

	if (error || !session) {
		return { error: "Session not found" };
	}

	// Check if session is still active (not expired)
	const isActive = session.status === "active" && session.expires_at && new Date(session.expires_at) > new Date();

	return {
		data: {
			...session,
			isActive,
			timeRemaining: session.expires_at ? Math.max(0, new Date(session.expires_at).getTime() - Date.now()) : 0,
		},
	};
}

/**
 * Get active session for a company (if any)
 */
async function getActiveSessionForCompany(companyId: string) {
	const adminDb = createAdminClient();

	const { data: sessionId } = await adminDb.rpc("get_active_session_for_company", {
		p_company_id: companyId,
	});

	if (!sessionId) {
		return { data: null };
	}

	return getSupportSessionStatus(sessionId);
}

/**
 * Extend a support session (requires customer approval)
 */
async function requestSessionExtension(sessionId: string, additionalMinutes: number = 30) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const adminDb = createAdminClient();

	// Get current session
	const { data: supportSession } = await adminDb.from("support_sessions").select("*").eq("id", sessionId).single();

	if (!supportSession || supportSession.status !== "active") {
		return { error: "Session is not active" };
	}

	// TODO: Send extension request notification to customer
	// Customer will need to approve via approveSupportSession with new duration

	// For now, log the extension request
	await logAdminAction({
		adminUserId: session.userId,
		adminEmail: session.email || "",
		action: "support_session_extension_requested",
		resourceType: "company",
		resourceId: supportSession.company_id,
		details: {
			session_id: sessionId,
			additional_minutes: additionalMinutes,
		},
	});

	return { success: true, message: "Extension request sent to customer" };
}

/**
 * Log a support action during an active session
 */
async function logSupportAction(sessionId: string, action: string, resourceType: string, resourceId: string, beforeData?: any, afterData?: any, reason?: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const adminDb = createAdminClient();

	// Verify session is active
	const { data: isActive } = await adminDb.rpc("is_session_active", {
		p_session_id: sessionId,
	});

	if (!isActive) {
		return { error: "Session is not active" };
	}

	// Log the action
	const { error } = await adminDb.from("support_session_actions").insert({
		session_id: sessionId,
		admin_user_id: session.userId,
		action,
		resource_type: resourceType,
		resource_id: resourceId,
		before_data: beforeData,
		after_data: afterData,
		reason,
	});

	if (error) {
		return { error: "Failed to log action" };
	}

	return { success: true };
}

/**
 * Get all sessions for a company (for audit trail)
 */
async function getCompanySupportSessions(companyId: string, limit: number = 50) {
	const adminDb = createAdminClient();

	const { data: sessions, error } = await adminDb
		.from("support_sessions")
		.select(
			`
      *,
      admin_users(email, full_name),
      support_tickets(subject)
    `
		)
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		return { error: "Failed to fetch sessions" };
	}

	return { data: sessions };
}

/**
 * Get all actions for a session (detailed audit trail)
 */
async function getSessionActions(sessionId: string) {
	const adminDb = createAdminClient();

	const { data: actions, error } = await adminDb
		.from("support_session_actions")
		.select(
			`
      *,
      admin_users(email, full_name)
    `
		)
		.eq("session_id", sessionId)
		.order("created_at", { ascending: false });

	if (error) {
		return { error: "Failed to fetch session actions" };
	}

	return { data: actions };
}

/**
 * Check if admin has permission for an action in current session
 */
async function hasSessionPermission(sessionId: string, actionType: string): Promise<boolean> {
	const adminDb = createAdminClient();

	const { data: permission } = await adminDb.from("support_session_permissions").select("granted").eq("session_id", sessionId).eq("action_type", actionType).single();

	return permission?.granted === true;
}
