/**
 * Admin Context - Impersonation & Session Management
 *
 * Handles admin impersonation of customer accounts with session-based permissions.
 * Overrides company context when in view-as mode.
 */

import { cache } from "react";
import { cookies } from "next/headers";
import { createAdminClient } from "../supabase/admin-client";
import { getAdminSession } from "../auth/session";

const IMPERSONATION_COOKIE = "admin_impersonation_company_id";
const SESSION_COOKIE = "admin_support_session_id";

/**
 * Get the currently impersonated company ID (if in view-as mode)
 */
export const getImpersonatedCompanyId = cache(async (): Promise<string | null> => {
	const cookieStore = await cookies();
	const impersonationCookie = cookieStore.get(IMPERSONATION_COOKIE);

	if (!impersonationCookie?.value) {
		return null;
	}

	// Verify admin session exists
	const adminSession = await getAdminSession();
	if (!adminSession) {
		// Clear invalid impersonation
		await clearImpersonation();
		return null;
	}

	// Verify support session is still active
	const sessionCookie = cookieStore.get(SESSION_COOKIE);
	if (sessionCookie?.value) {
		const isActive = await verifySupportSessionActive(sessionCookie.value);
		if (!isActive) {
			// Session expired, clear impersonation
			await clearImpersonation();
			return null;
		}
	}

	return impersonationCookie.value;
});

/**
 * Get the active support session ID (if in view-as mode)
 */
export const getActiveSupportSessionId = cache(async (): Promise<string | null> => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(SESSION_COOKIE);
	return sessionCookie?.value || null;
});

/**
 * Set impersonation context (call when entering view-as mode)
 */
export async function setImpersonation(companyId: string, sessionId: string): Promise<void> {
	const cookieStore = await cookies();

	// Verify admin session
	const adminSession = await getAdminSession();
	if (!adminSession) {
		throw new Error("Admin session required");
	}

	// Verify support session is active
	const isActive = await verifySupportSessionActive(sessionId);
	if (!isActive) {
		throw new Error("Support session is not active");
	}

	// Set impersonation cookies
	cookieStore.set(IMPERSONATION_COOKIE, companyId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 2, // 2 hours max
	});

	cookieStore.set(SESSION_COOKIE, sessionId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 2, // 2 hours max
	});
}

/**
 * Clear impersonation context (call when exiting view-as mode)
 */
export async function clearImpersonation(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(IMPERSONATION_COOKIE);
	cookieStore.delete(SESSION_COOKIE);
}

/**
 * Verify that a support session is still active
 */
async function verifySupportSessionActive(sessionId: string): Promise<boolean> {
	const adminDb = createAdminClient();

	const { data: isActive } = await adminDb.rpc("is_session_active", {
		p_session_id: sessionId,
	});

	return isActive === true;
}

/**
 * Require an active support session (use in Server Actions/Components)
 * Throws error if no active session
 */
export async function requireActiveSupportSession(): Promise<{
	sessionId: string;
	companyId: string;
	adminUserId: string;
}> {
	const sessionId = await getActiveSupportSessionId();
	if (!sessionId) {
		throw new Error("No active support session");
	}

	const companyId = await getImpersonatedCompanyId();
	if (!companyId) {
		throw new Error("No impersonated company");
	}

	const adminSession = await getAdminSession();
	if (!adminSession) {
		throw new Error("No admin session");
	}

	// Verify session is still active
	const isActive = await verifySupportSessionActive(sessionId);
	if (!isActive) {
		await clearImpersonation();
		throw new Error("Support session has expired");
	}

	return {
		sessionId,
		companyId,
		adminUserId: adminSession.userId,
	};
}

/**
 * Check if currently in view-as mode
 */
export const isInViewAsMode = cache(async (): Promise<boolean> => {
	const companyId = await getImpersonatedCompanyId();
	return companyId !== null;
});

/**
 * Get support session permissions
 */
export async function getSessionPermissions(sessionId: string): Promise<string[]> {
	const adminDb = createAdminClient();

	const { data: permissions } = await adminDb.from("support_session_permissions").select("action_type").eq("session_id", sessionId).eq("granted", true);

	return permissions?.map((p) => p.action_type) || [];
}

/**
 * Check if admin has specific permission in current session
 */
export async function hasPermission(actionType: string): Promise<boolean> {
	const sessionId = await getActiveSupportSessionId();
	if (!sessionId) {
		return false;
	}

	const permissions = await getSessionPermissions(sessionId);
	return permissions.includes(actionType);
}

/**
 * Higher-order function to wrap Server Actions with permission checks
 */
export function withSupportSession<T extends (...args: any[]) => Promise<any>>(action: T, requiredPermission?: string): T {
	return (async (...args: any[]) => {
		// Verify active support session
		const session = await requireActiveSupportSession();

		// Check permission if specified
		if (requiredPermission) {
			const hasAccess = await hasPermission(requiredPermission);
			if (!hasAccess) {
				throw new Error(`Permission denied: ${requiredPermission}`);
			}
		}

		// Execute action
		return await action(...args);
	}) as T;
}

/**
 * Log an admin action with automatic session context
 */
export async function logAdminActionInSession(action: string, resourceType: string, resourceId: string, beforeData?: any, afterData?: any, reason?: string) {
	const session = await requireActiveSupportSession();
	const adminSession = await getAdminSession();

	if (!adminSession) {
		throw new Error("No admin session");
	}

	const adminDb = createAdminClient();

	await adminDb.from("support_session_actions").insert({
		session_id: session.sessionId,
		admin_user_id: session.adminUserId,
		action,
		resource_type: resourceType,
		resource_id: resourceId,
		before_data: beforeData,
		after_data: afterData,
		reason,
	});
}

/**
 * Get current session details
 */
export async function getCurrentSession() {
	const sessionId = await getActiveSupportSessionId();
	if (!sessionId) {
		return null;
	}

	const adminDb = createAdminClient();

	const { data: session } = await adminDb.from("support_sessions").select("*, admin_users(email, full_name)").eq("id", sessionId).single();

	return session;
}
