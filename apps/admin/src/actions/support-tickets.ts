"use server";

/**
 * Support Tickets Actions
 *
 * Server actions for managing support tickets.
 */

import { createAdminClient } from "@/lib/supabase/admin-client";
import { getAdminSession } from "@/lib/auth/session";

export interface SupportTicket {
	id: string;
	ticket_number?: string;
	subject: string;
	description?: string;
	status: "open" | "in_progress" | "waiting_on_customer" | "waiting_on_us" | "resolved" | "closed";
	priority: "low" | "normal" | "high" | "urgent";
	category?: string;
	requester_email: string;
	requester_name?: string;
	company_id?: string;
	company_name?: string;
	assigned_to?: string;
	assigned_to_name?: string;
	first_response_at?: string;
	resolved_at?: string;
	created_at: string;
	updated_at: string;
}

export interface SupportTicketStats {
	total_tickets: number;
	open_tickets: number;
	in_progress: number;
	resolved_today: number;
	avg_response_time_minutes: number;
}

/**
 * Get support tickets with filters
 */
export async function getSupportTickets(
	limit: number = 50,
	offset: number = 0,
	status?: string,
	priority?: string,
) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();

		let query = adminDb
			.from("support_tickets")
			.select(`
				*,
				companies_registry:company_id (
					name
				),
				admin_users:assigned_to (
					email
				)
			`)
			.order("created_at", { ascending: false });

		if (status && status !== "all") {
			query = query.eq("status", status);
		}

		if (priority && priority !== "all") {
			query = query.eq("priority", priority);
		}

		const { data, error } = await query.range(offset, offset + limit - 1);

		if (error) {
			console.error("Failed to fetch support tickets:", error);
			return { error: "Failed to fetch support tickets" };
		}

		const tickets: SupportTicket[] = (data || []).map((ticket: any) => ({
			id: ticket.id,
			ticket_number: ticket.id.slice(0, 8).toUpperCase(),
			subject: ticket.subject,
			description: ticket.description || undefined,
			status: ticket.status,
			priority: ticket.priority,
			category: ticket.category || undefined,
			requester_email: ticket.requester_email,
			requester_name: ticket.requester_name || undefined,
			company_id: ticket.company_id || undefined,
			company_name: (ticket.companies_registry as any)?.name || undefined,
			assigned_to: ticket.assigned_to || undefined,
			assigned_to_name: (ticket.admin_users as any)?.email || undefined,
			first_response_at: ticket.first_response_at || undefined,
			resolved_at: ticket.resolved_at || undefined,
			created_at: ticket.created_at,
			updated_at: ticket.updated_at,
		}));

		return { data: tickets };
	} catch (error) {
		console.error("Failed to get support tickets:", error);
		return { error: error instanceof Error ? error.message : "Failed to get support tickets" };
	}
}

/**
 * Get support ticket statistics
 */
export async function getSupportTicketStats(): Promise<{ data?: SupportTicketStats; error?: string }> {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();

		const { data: allTickets, error } = await adminDb
			.from("support_tickets")
			.select("status, first_response_at, created_at, resolved_at");

		if (error) {
			console.error("Failed to fetch ticket stats:", error);
			return { error: "Failed to fetch ticket stats" };
		}

		const tickets = allTickets || [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const resolvedToday = tickets.filter(
			(t) => t.resolved_at && new Date(t.resolved_at) >= today,
		).length;

		// Calculate average response time (simplified)
		const ticketsWithResponse = tickets.filter((t) => t.first_response_at && t.created_at);
		const totalResponseTime = ticketsWithResponse.reduce((sum, t) => {
			const created = new Date(t.created_at).getTime();
			const responded = new Date(t.first_response_at!).getTime();
			return sum + (responded - created) / (1000 * 60); // minutes
		}, 0);
		const avgResponseTime = ticketsWithResponse.length > 0 ? totalResponseTime / ticketsWithResponse.length : 0;

		return {
			data: {
				total_tickets: tickets.length,
				open_tickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
				in_progress: tickets.filter((t) => t.status === "in_progress").length,
				resolved_today,
				avg_response_time_minutes: Math.round(avgResponseTime),
			},
		};
	} catch (error) {
		console.error("Failed to get support ticket stats:", error);
		return { error: error instanceof Error ? error.message : "Failed to get support ticket stats" };
	}
}

