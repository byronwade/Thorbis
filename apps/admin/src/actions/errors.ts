"use server";

/**
 * Error Tracking Actions
 *
 * Server actions for tracking and managing platform errors.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { getAdminSession } from "@/lib/auth/session";

export interface ErrorLogEntry {
	id: string;
	message: string;
	severity: "error" | "warning" | "critical";
	company_id?: string;
	company_name?: string;
	entity_type?: string;
	entity_id?: string;
	user_id?: string;
	stack_trace?: string;
	metadata?: Record<string, unknown>;
	created_at: string;
}

export interface ErrorStats {
	total: number;
	bySeverity: {
		critical: number;
		error: number;
		warning: number;
	};
	byCompany: Array<{
		company_id: string;
		company_name: string;
		count: number;
	}>;
	trends: Array<{
		date: string;
		count: number;
	}>;
}

export interface ErrorGroup {
	message: string;
	count: number;
	first_seen: string;
	last_seen: string;
	severity: "error" | "warning" | "critical";
	affected_companies: number;
}

/**
 * Get error logs with filtering
 */
export async function getErrorLogs(options?: {
	limit?: number;
	severity?: "error" | "warning" | "critical";
	company_id?: string;
	start_date?: string;
	end_date?: string;
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();
		const webDb = createWebClient();

		const limit = options?.limit || 50;
		let query = adminDb
			.from("admin_audit_logs")
			.select("id, action, details, resource_type, resource_id, created_at")
			.or("action.ilike.%error%,action.ilike.%fail%,action.ilike.%exception%")
			.order("created_at", { ascending: false })
			.limit(limit);

		if (options?.start_date) {
			query = query.gte("created_at", options.start_date);
		}
		if (options?.end_date) {
			query = query.lte("created_at", options.end_date);
		}

		const { data: logs, error } = await query;

		if (error || !logs) {
			return { error: "Failed to fetch error logs" };
		}

		// Also check web database for audit_logs with errors
		const { data: webLogs } = await webDb
			.from("audit_logs")
			.select("id, action, entity_type, entity_id, company_id, old_values, new_values, severity, created_at")
			.in("severity", ["error", "critical"])
			.order("created_at", { ascending: false })
			.limit(limit);

		// Combine and format error logs
		const errorEntries: ErrorLogEntry[] = [];

		// Process admin audit logs
		for (const log of logs || []) {
			const details = (log.details as { message?: string; stack?: string; error?: string }) || {};
			const message = details.message || details.error || log.action || "Unknown error";
			const severity = message.toLowerCase().includes("critical")
				? ("critical" as const)
				: ("error" as const);

			errorEntries.push({
				id: log.id,
				message,
				severity,
				entity_type: log.resource_type || undefined,
				entity_id: log.resource_id || undefined,
				stack_trace: details.stack || undefined,
				metadata: log.details as Record<string, unknown>,
				created_at: log.created_at,
			});
		}

		// Process web audit logs
		for (const log of webLogs || []) {
			const message =
				(log.old_values as { error?: string })?.error ||
				(log.new_values as { error?: string })?.error ||
				log.action ||
				"Unknown error";
			const severity = (log.severity as "error" | "warning" | "critical") || "error";

			// Get company name if we have company_id
			let companyName: string | undefined;
			if (log.company_id) {
				const { data: company } = await webDb
					.from("companies")
					.select("name")
					.eq("id", log.company_id)
					.single();
				companyName = company?.name;
			}

			errorEntries.push({
				id: log.id,
				message,
				severity,
				company_id: log.company_id,
				company_name: companyName,
				entity_type: log.entity_type || undefined,
				entity_id: log.entity_id || undefined,
				created_at: log.created_at,
			});
		}

		// Sort by created_at descending and apply filters
		errorEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

		// Apply severity filter
		const filtered = options?.severity
			? errorEntries.filter((e) => e.severity === options.severity)
			: errorEntries;

		// Apply company filter
		const final = options?.company_id
			? filtered.filter((e) => e.company_id === options.company_id)
			: filtered;

		// Limit results
		return { data: final.slice(0, limit) };
	} catch (error) {
		console.error("Failed to get error logs:", error);
		return { error: error instanceof Error ? error.message : "Failed to get error logs" };
	}
}

/**
 * Get error statistics
 */
export async function getErrorStats(options?: {
	start_date?: string;
	end_date?: string;
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();
		const webDb = createWebClient();

		const startDate = options?.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
		const endDate = options?.end_date || new Date().toISOString();

		// Get admin audit logs with errors
		const { data: adminLogs } = await adminDb
			.from("admin_audit_logs")
			.select("action, created_at")
			.or("action.ilike.%error%,action.ilike.%fail%,action.ilike.%critical%")
			.gte("created_at", startDate)
			.lte("created_at", endDate);

		// Get web audit logs with errors
		const { data: webLogs } = await webDb
			.from("audit_logs")
			.select("severity, company_id, created_at")
			.in("severity", ["error", "critical"])
			.gte("created_at", startDate)
			.lte("created_at", endDate);

		// Calculate stats
		const total = (adminLogs?.length || 0) + (webLogs?.length || 0);
		const bySeverity = {
			critical: (webLogs?.filter((l) => l.severity === "critical").length || 0) +
				(adminLogs?.filter((l) => l.action?.toLowerCase().includes("critical")).length || 0),
			error: (webLogs?.filter((l) => l.severity === "error").length || 0) +
				(adminLogs?.filter((l) => !l.action?.toLowerCase().includes("critical")).length || 0),
			warning: 0, // TODO: Track warnings separately
		};

		// Group by company
		const companyCounts: Record<string, { name: string; count: number }> = {};
		for (const log of webLogs || []) {
			if (log.company_id) {
				if (!companyCounts[log.company_id]) {
					companyCounts[log.company_id] = { name: "", count: 0 };
				}
				companyCounts[log.company_id].count++;
			}
		}

		// Get company names
		const companyIds = Object.keys(companyCounts);
		if (companyIds.length > 0) {
			const { data: companies } = await webDb
				.from("companies")
				.select("id, name")
				.in("id", companyIds);

			for (const company of companies || []) {
				if (companyCounts[company.id]) {
					companyCounts[company.id].name = company.name;
				}
			}
		}

		const byCompany = Object.entries(companyCounts).map(([id, data]) => ({
			company_id: id,
			company_name: data.name || "Unknown",
			count: data.count,
		}));

		// Calculate trends (by day)
		const trendsMap: Record<string, number> = {};
		const allLogs = [
			...(adminLogs || []).map((l) => ({ created_at: l.created_at })),
			...(webLogs || []).map((l) => ({ created_at: l.created_at })),
		];

		for (const log of allLogs) {
			const date = new Date(log.created_at).toISOString().split("T")[0];
			trendsMap[date] = (trendsMap[date] || 0) + 1;
		}

		const trends = Object.entries(trendsMap)
			.map(([date, count]) => ({ date, count }))
			.sort((a, b) => a.date.localeCompare(b.date));

		return {
			data: {
				total,
				bySeverity,
				byCompany,
				trends,
			},
		};
	} catch (error) {
		console.error("Failed to get error stats:", error);
		return { error: error instanceof Error ? error.message : "Failed to get error stats" };
	}
}

/**
 * Get grouped errors (same error message grouped together)
 */
export async function getErrorGroups(options?: {
	limit?: number;
	severity?: "error" | "warning" | "critical";
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const result = await getErrorLogs({ limit: 1000 });

		if (result.error || !result.data) {
			return result;
		}

		// Group errors by message
		const groupsMap: Record<string, ErrorGroup> = {};

		for (const error of result.data) {
			const key = error.message.substring(0, 200); // Normalize message

			if (!groupsMap[key]) {
				groupsMap[key] = {
					message: error.message,
					count: 0,
					first_seen: error.created_at,
					last_seen: error.created_at,
					severity: error.severity,
					affected_companies: 0,
				};
			}

			const group = groupsMap[key];
			group.count++;
			if (new Date(error.created_at) < new Date(group.first_seen)) {
				group.first_seen = error.created_at;
			}
			if (new Date(error.created_at) > new Date(group.last_seen)) {
				group.last_seen = error.created_at;
			}
			if (error.company_id) {
				// Count unique companies - simplified for now
				group.affected_companies = Math.max(group.affected_companies, 1);
			}
		}

		const groups = Object.values(groupsMap)
			.sort((a, b) => b.count - a.count)
			.slice(0, options?.limit || 20);

		return { data: groups };
	} catch (error) {
		console.error("Failed to get error groups:", error);
		return { error: error instanceof Error ? error.message : "Failed to get error groups" };
	}
}

