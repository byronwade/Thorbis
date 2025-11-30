"use server";

/**
 * Audit Log Actions
 *
 * Server actions for viewing and managing audit logs.
 */

import { createAdminClient } from "@/lib/supabase/admin-client";
import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface AuditLogEntry {
	id: string;
	admin_user_id?: string;
	admin_email?: string;
	action: string;
	resource_type?: string;
	resource_id?: string;
	details: Record<string, unknown>;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
	company_id?: string;
	company_name?: string;
	session_id?: string;
}

export interface AuditLogStats {
	total: number;
	byAction: Array<{
		action: string;
		count: number;
	}>;
	byAdmin: Array<{
		admin_email: string;
		count: number;
	}>;
	byResource: Array<{
		resource_type: string;
		count: number;
	}>;
	recentActivity: number;
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs(options?: {
	limit?: number;
	offset?: number;
	action?: string;
	resource_type?: string;
	admin_user_id?: string;
	start_date?: string;
	end_date?: string;
	search?: string;
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();
		const webDb = createWebClient();

		const limit = options?.limit || 50;
		const offset = options?.offset || 0;

		let query = adminDb
			.from("admin_audit_logs")
			.select("id, admin_user_id, admin_email, action, resource_type, resource_id, details, ip_address, user_agent, created_at")
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (options?.action) {
			query = query.ilike("action", `%${options.action}%`);
		}
		if (options?.resource_type) {
			query = query.eq("resource_type", options.resource_type);
		}
		if (options?.admin_user_id) {
			query = query.eq("admin_user_id", options.admin_user_id);
		}
		if (options?.start_date) {
			query = query.gte("created_at", options.start_date);
		}
		if (options?.end_date) {
			query = query.lte("created_at", options.end_date);
		}
		if (options?.search) {
			query = query.or(`action.ilike.%${options.search}%,resource_type.ilike.%${options.search}%,admin_email.ilike.%${options.search}%`);
		}

		const { data: logs, error } = await query;

		if (error) {
			console.error("Failed to fetch audit logs:", error);
			return { error: "Failed to fetch audit logs" };
		}

		// Also get support session actions for view-as activity
		const { data: sessionActions } = await adminDb
			.from("support_session_actions")
			.select("id, session_id, action_type, resource_type, resource_id, before_data, after_data, created_at, admin_user_id")
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		// Combine and format audit logs
		const auditEntries: AuditLogEntry[] = [];

		// Process admin audit logs
		for (const log of logs || []) {
			auditEntries.push({
				id: log.id,
				admin_user_id: log.admin_user_id,
				admin_email: log.admin_email || undefined,
				action: log.action,
				resource_type: log.resource_type || undefined,
				resource_id: log.resource_id || undefined,
				details: (log.details as Record<string, unknown>) || {},
				ip_address: log.ip_address || undefined,
				user_agent: log.user_agent || undefined,
				created_at: log.created_at,
			});
		}

		// Process support session actions
		for (const action of sessionActions || []) {
			// Get admin email if we have admin_user_id
			let adminEmail: string | undefined;
			if (action.admin_user_id) {
				const { data: admin } = await adminDb
					.from("admin_users")
					.select("email")
					.eq("id", action.admin_user_id)
					.single();
				adminEmail = admin?.email;
			}

			auditEntries.push({
				id: action.id,
				admin_user_id: action.admin_user_id || undefined,
				admin_email: adminEmail,
				action: action.action_type || "support_session_action",
				resource_type: action.resource_type || undefined,
				resource_id: action.resource_id || undefined,
				details: {
					session_id: action.session_id,
					before_data: action.before_data,
					after_data: action.after_data,
				},
				session_id: action.session_id,
				created_at: action.created_at,
			});
		}

		// Sort by created_at descending
		auditEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

		// Get company names for entries that have company_id in details
		for (const entry of auditEntries) {
			const companyId = (entry.details as { company_id?: string })?.company_id;
			if (companyId) {
				const { data: company } = await webDb
					.from("companies")
					.select("name")
					.eq("id", companyId)
					.single();
				if (company) {
					entry.company_id = companyId;
					entry.company_name = company.name;
				}
			}
		}

		// Limit results
		return { data: auditEntries.slice(0, limit) };
	} catch (error) {
		console.error("Failed to get audit logs:", error);
		return { error: error instanceof Error ? error.message : "Failed to get audit logs" };
	}
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats(options?: {
	start_date?: string;
	end_date?: string;
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();

		const startDate = options?.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
		const endDate = options?.end_date || new Date().toISOString();

		// Get all audit logs in date range
		const { data: logs } = await adminDb
			.from("admin_audit_logs")
			.select("action, resource_type, admin_user_id, admin_email, created_at")
			.gte("created_at", startDate)
			.lte("created_at", endDate);

		if (!logs || logs.length === 0) {
			return {
				data: {
					total: 0,
					byAction: [],
					byAdmin: [],
					byResource: [],
					recentActivity: 0,
				},
			};
		}

		const total = logs.length;

		// Group by action
		const actionCounts: Record<string, number> = {};
		for (const log of logs) {
			actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
		}
		const byAction = Object.entries(actionCounts)
			.map(([action, count]) => ({ action, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		// Group by admin
		const adminCounts: Record<string, number> = {};
		for (const log of logs) {
			const email = log.admin_email || "unknown";
			adminCounts[email] = (adminCounts[email] || 0) + 1;
		}
		const byAdmin = Object.entries(adminCounts)
			.map(([admin_email, count]) => ({ admin_email, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		// Group by resource type
		const resourceCounts: Record<string, number> = {};
		for (const log of logs) {
			if (log.resource_type) {
				resourceCounts[log.resource_type] = (resourceCounts[log.resource_type] || 0) + 1;
			}
		}
		const byResource = Object.entries(resourceCounts)
			.map(([resource_type, count]) => ({ resource_type, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		// Recent activity (last 24 hours)
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
		const recentActivity = logs.filter((log) => log.created_at >= oneDayAgo).length;

		return {
			data: {
				total,
				byAction,
				byAdmin,
				byResource,
				recentActivity,
			},
		};
	} catch (error) {
		console.error("Failed to get audit log stats:", error);
		return { error: error instanceof Error ? error.message : "Failed to get audit log stats" };
	}
}

/**
 * Export audit logs as CSV
 */
export async function exportAuditLogs(options?: {
	start_date?: string;
	end_date?: string;
	action?: string;
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const result = await getAuditLogs({
			limit: 10000, // Large limit for export
			start_date: options?.start_date,
			end_date: options?.end_date,
			action: options?.action,
		});

		if (result.error || !result.data) {
			return result;
		}

		// Generate CSV
		const headers = ["ID", "Timestamp", "Admin Email", "Action", "Resource Type", "Resource ID", "IP Address"];
		const rows = result.data.map((log) => [
			log.id,
			log.created_at,
			log.admin_email || "",
			log.action,
			log.resource_type || "",
			log.resource_id || "",
			log.ip_address || "",
		]);

		const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");

		return { data: csv };
	} catch (error) {
		console.error("Failed to export audit logs:", error);
		return { error: error instanceof Error ? error.message : "Failed to export audit logs" };
	}
}

