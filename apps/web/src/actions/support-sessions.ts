"use server";

/**
 * Support Session Actions for Web App
 *
 * Customer-facing actions for managing support access requests.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface SupportSession {
	id: string;
	admin_user_id: string;
	ticket_id: string | null;
	reason: string;
	requested_at: string;
	requested_permissions: string[];
	admin_name?: string;
	admin_email?: string;
}

/**
 * Get pending support session requests for the current company
 */
export async function getPendingSupportSessions(): Promise<{
	success: boolean;
	sessions?: SupportSession[];
	error?: string;
}> {
	try {
		const supabase = await createClient();

		// Get current user's company
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get user's company_id from team_members
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			return { success: false, error: "No company found" };
		}

		// Query admin database for pending sessions
		// Note: This requires admin database access - we'll use a service role query
		const adminSupabase = createClient(); // TODO: Use admin/service client

		const { data: sessions, error } = await adminSupabase
			.from("support_sessions")
			.select(
				`
        id,
        admin_user_id,
        ticket_id,
        reason,
        requested_at,
        requested_permissions
      `,
			)
			.eq("company_id", teamMember.company_id)
			.eq("status", "pending")
			.order("requested_at", { ascending: false });

		if (error) {
			console.error("Error fetching pending sessions:", error);
			return { success: false, error: error.message };
		}

		// TODO: Enrich with admin user details from admin database
		// For now, return sessions without admin details
		return {
			success: true,
			sessions: sessions || [],
		};
	} catch (error) {
		console.error("Error in getPendingSupportSessions:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get active support sessions for the current company
 */
export async function getActiveSupportSessions(): Promise<{
	success: boolean;
	sessions?: SupportSession[];
	error?: string;
}> {
	try {
		const supabase = await createClient();

		// Get current user's company
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get user's company_id
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			return { success: false, error: "No company found" };
		}

		// Query for active sessions
		const adminSupabase = createClient(); // TODO: Use admin/service client

		const { data: sessions, error } = await adminSupabase
			.from("support_sessions")
			.select(
				`
        id,
        admin_user_id,
        ticket_id,
        reason,
        requested_at,
        approved_at,
        expires_at,
        requested_permissions
      `,
			)
			.eq("company_id", teamMember.company_id)
			.eq("status", "active")
			.order("approved_at", { ascending: false });

		if (error) {
			console.error("Error fetching active sessions:", error);
			return { success: false, error: error.message };
		}

		return {
			success: true,
			sessions: sessions || [],
		};
	} catch (error) {
		console.error("Error in getActiveSupportSessions:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Approve a support session request
 */
export async function approveSupportSessionRequest(
	sessionId: string,
	durationMinutes: number = 60,
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const supabase = await createClient();

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Verify user is part of the company for this session
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			return { success: false, error: "No company found" };
		}

		// Call admin database to approve session
		// TODO: This should be a secure RPC call to admin database
		const adminSupabase = createClient(); // Use admin client

		const expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + durationMinutes);

		const { error: updateError } = await adminSupabase
			.from("support_sessions")
			.update({
				status: "active",
				approved_at: new Date().toISOString(),
				approved_by: user.id,
				expires_at: expiresAt.toISOString(),
			})
			.eq("id", sessionId)
			.eq("company_id", teamMember.company_id)
			.eq("status", "pending");

		if (updateError) {
			console.error("Error approving session:", updateError);
			return { success: false, error: updateError.message };
		}

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Error in approveSupportSessionRequest:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Reject a support session request
 */
export async function rejectSupportSessionRequest(
	sessionId: string,
	reason?: string,
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const supabase = await createClient();

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Verify user is part of the company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			return { success: false, error: "No company found" };
		}

		// Update session status
		const adminSupabase = createClient(); // Use admin client

		const { error: updateError } = await adminSupabase
			.from("support_sessions")
			.update({
				status: "rejected",
				rejected_at: new Date().toISOString(),
				rejected_by: user.id,
				rejection_reason: reason,
			})
			.eq("id", sessionId)
			.eq("company_id", teamMember.company_id)
			.eq("status", "pending");

		if (updateError) {
			console.error("Error rejecting session:", updateError);
			return { success: false, error: updateError.message };
		}

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Error in rejectSupportSessionRequest:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * End an active support session (customer-initiated)
 */
export async function endActiveSupportSession(sessionId: string): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const supabase = await createClient();

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Verify user is part of the company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			return { success: false, error: "No company found" };
		}

		// End the session
		const adminSupabase = createClient(); // Use admin client

		const { error: updateError } = await adminSupabase
			.from("support_sessions")
			.update({
				status: "ended",
				ended_at: new Date().toISOString(),
				ended_by: user.id,
			})
			.eq("id", sessionId)
			.eq("company_id", teamMember.company_id)
			.eq("status", "active");

		if (updateError) {
			console.error("Error ending session:", updateError);
			return { success: false, error: updateError.message };
		}

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Error in endActiveSupportSession:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
