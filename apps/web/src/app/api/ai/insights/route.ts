/**
 * AI Insights API Route
 * Generates proactive business insights using AI analysis
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const maxDuration = 30;

interface Insight {
	id: string;
	type: "urgent" | "opportunity" | "reminder" | "metric";
	category: "customer" | "financial" | "scheduling" | "communication";
	title: string;
	description: string;
	actionLabel?: string;
	actionPrompt?: string;
	value?: string | number;
	trend?: "up" | "down" | "stable";
}

export async function POST(req: Request) {
	try {
		const { companyId } = await req.json();

		if (!companyId) {
			return Response.json({ error: "Company ID required" }, { status: 400 });
		}

		const supabase = createServiceSupabaseClient();
		const insights: Insight[] = [];

		// Get current date info
		const now = new Date();
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		// 1. Check for overdue invoices
		const { data: overdueInvoices, count: overdueCount } = await supabase
			.from("invoices")
			.select("id, total, customer_id", { count: "exact" })
			.eq("company_id", companyId)
			.eq("status", "sent")
			.lt("due_date", now.toISOString())
			.limit(5);

		if (overdueCount && overdueCount > 0) {
			const totalOverdue =
				overdueInvoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
			insights.push({
				id: "overdue-invoices",
				type: "urgent",
				category: "financial",
				title: `${overdueCount} Overdue Invoice${overdueCount > 1 ? "s" : ""}`,
				description: `$${(totalOverdue / 100).toFixed(2)} in outstanding payments need attention.`,
				actionLabel: "Send reminders",
				actionPrompt: `Show me all overdue invoices and help me send payment reminders to customers.`,
				value: `$${(totalOverdue / 100).toFixed(0)}`,
			});
		}

		// 2. Check for inactive customers
		const { count: inactiveCount } = await supabase
			.from("customers")
			.select("id", { count: "exact" })
			.eq("company_id", companyId)
			.eq("status", "active")
			.lt("updated_at", thirtyDaysAgo.toISOString());

		if (inactiveCount && inactiveCount > 0) {
			insights.push({
				id: "inactive-customers",
				type: "opportunity",
				category: "customer",
				title: `${inactiveCount} Inactive Customer${inactiveCount > 1 ? "s" : ""}`,
				description: `Customers with no activity in the last 30 days could use a follow-up.`,
				actionLabel: "View customers",
				actionPrompt: `Show me customers who haven't been contacted in 30 days and help me create a re-engagement campaign.`,
			});
		}

		// 3. Check upcoming appointments today
		const todayStart = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
		);
		const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

		const { count: todayAppointments } = await supabase
			.from("jobs")
			.select("id", { count: "exact" })
			.eq("company_id", companyId)
			.gte("scheduled_start", todayStart.toISOString())
			.lt("scheduled_start", todayEnd.toISOString());

		if (todayAppointments && todayAppointments > 0) {
			insights.push({
				id: "today-appointments",
				type: "reminder",
				category: "scheduling",
				title: `${todayAppointments} Appointment${todayAppointments > 1 ? "s" : ""} Today`,
				description: `You have ${todayAppointments} job${todayAppointments > 1 ? "s" : ""} scheduled for today.`,
				actionLabel: "View schedule",
				actionPrompt: `Show me today's schedule and any preparation needed for each appointment.`,
				value: todayAppointments,
			});
		}

		// 4. Revenue this week vs last week
		const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

		const { data: thisWeekRevenue } = await supabase
			.from("invoices")
			.select("total")
			.eq("company_id", companyId)
			.eq("status", "paid")
			.gte("paid_at", thisWeekStart.toISOString());

		const { data: lastWeekRevenue } = await supabase
			.from("invoices")
			.select("total")
			.eq("company_id", companyId)
			.eq("status", "paid")
			.gte("paid_at", lastWeekStart.toISOString())
			.lt("paid_at", thisWeekStart.toISOString());

		const thisWeekTotal =
			thisWeekRevenue?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
		const lastWeekTotal =
			lastWeekRevenue?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

		const trend: "up" | "down" | "stable" =
			thisWeekTotal > lastWeekTotal
				? "up"
				: thisWeekTotal < lastWeekTotal
					? "down"
					: "stable";

		insights.push({
			id: "weekly-revenue",
			type: "metric",
			category: "financial",
			title: "Weekly Revenue",
			description:
				trend === "up"
					? `Revenue is up ${lastWeekTotal > 0 ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100) : 100}% from last week.`
					: trend === "down"
						? `Revenue is down ${thisWeekTotal > 0 ? Math.round(((lastWeekTotal - thisWeekTotal) / lastWeekTotal) * 100) : 100}% from last week.`
						: "Revenue is stable compared to last week.",
			value: `$${(thisWeekTotal / 100).toFixed(0)}`,
			trend,
			actionLabel: "View details",
			actionPrompt: `Give me a detailed financial summary for this week compared to last week.`,
		});

		// 5. Check for jobs needing follow-up
		const { count: completedJobsCount } = await supabase
			.from("jobs")
			.select("id", { count: "exact" })
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("completed_at", sevenDaysAgo.toISOString());

		if (completedJobsCount && completedJobsCount > 0) {
			insights.push({
				id: "job-followups",
				type: "opportunity",
				category: "customer",
				title: "Follow-up Opportunity",
				description: `${completedJobsCount} job${completedJobsCount > 1 ? "s" : ""} completed this week. Consider sending satisfaction surveys.`,
				actionLabel: "Send follow-ups",
				actionPrompt: `Show me recently completed jobs and help me send follow-up satisfaction surveys to those customers.`,
			});
		}

		// 6. Unread messages/communications
		const { count: unreadCount } = await supabase
			.from("communications")
			.select("id", { count: "exact" })
			.eq("company_id", companyId)
			.eq("direction", "inbound")
			.eq("is_read", false);

		if (unreadCount && unreadCount > 0) {
			insights.push({
				id: "unread-messages",
				type: unreadCount > 5 ? "urgent" : "reminder",
				category: "communication",
				title: `${unreadCount} Unread Message${unreadCount > 1 ? "s" : ""}`,
				description: `You have ${unreadCount} unread customer communication${unreadCount > 1 ? "s" : ""} waiting for response.`,
				actionLabel: "View messages",
				actionPrompt: `Show me all unread messages and help me draft responses.`,
				value: unreadCount,
			});
		}

		// Sort insights by priority: urgent > opportunity > reminder > metric
		const priorityOrder = { urgent: 0, opportunity: 1, reminder: 2, metric: 3 };
		insights.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);

		return Response.json({ insights });
	} catch (error) {
		console.error("AI Insights Error:", error);
		return Response.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
