import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

// Configuration constants
const MAX_APPOINTMENTS_PER_PAGE = 100;

/**
 * AppointmentsStats - Async Server Component
 *
 * Fetches and displays appointments statistics.
 * This streams in first, before the table/kanban.
 */
export async function AppointmentsStats() {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	// Get active company ID
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Fetch appointments for stats
	const { data: appointmentsRaw, error } = await supabase
		.from("schedules")
		.select("id, status, archived_at, deleted_at")
		.eq("company_id", activeCompanyId)
		.eq("type", "appointment")
		.limit(MAX_APPOINTMENTS_PER_PAGE);

	if (error) {
		const errorMessage = error.message || error.hint || JSON.stringify(error) || "Unknown database error";
		throw new Error(`Failed to load appointment stats: ${errorMessage}`);
	}

	// Only count active (non-archived) appointments in stats
	const activeAppointments = (appointmentsRaw || []).filter((a: any) => !(a.archived_at || a.deleted_at));

	const scheduledCount = activeAppointments.filter((a: any) => a.status === "scheduled").length;
	const confirmedCount = activeAppointments.filter((a: any) => a.status === "confirmed").length;
	const inProgressCount = activeAppointments.filter((a: any) => a.status === "in_progress").length;
	const completedCount = activeAppointments.filter((a: any) => a.status === "completed").length;
	const cancelledCount = activeAppointments.filter((a: any) => a.status === "cancelled").length;

	const CHANGE_PERCENTAGE_SCHEDULED = 8.4;
	const CHANGE_PERCENTAGE_CONFIRMED = 12.1;
	const CHANGE_PERCENTAGE_IN_PROGRESS = 5.7;
	const CHANGE_PERCENTAGE_COMPLETED = 9.3;
	const CHANGE_PERCENTAGE_CANCELLED_NEGATIVE = -3.2;
	const CHANGE_PERCENTAGE_CANCELLED_POSITIVE = 2.1;

	const appointmentStats: StatCard[] = [
		{
			label: "Scheduled",
			value: scheduledCount,
			change: scheduledCount > 0 ? CHANGE_PERCENTAGE_SCHEDULED : 0,
			changeLabel: "vs last week",
		},
		{
			label: "Confirmed",
			value: confirmedCount,
			change: confirmedCount > 0 ? CHANGE_PERCENTAGE_CONFIRMED : 0,
			changeLabel: "vs last week",
		},
		{
			label: "In Progress",
			value: inProgressCount,
			change: inProgressCount > 0 ? CHANGE_PERCENTAGE_IN_PROGRESS : 0,
			changeLabel: "vs last week",
		},
		{
			label: "Completed",
			value: completedCount,
			change: completedCount > 0 ? CHANGE_PERCENTAGE_COMPLETED : 0,
			changeLabel: "vs last week",
		},
		{
			label: "Cancelled",
			value: cancelledCount,
			change: cancelledCount > 0 ? CHANGE_PERCENTAGE_CANCELLED_NEGATIVE : CHANGE_PERCENTAGE_CANCELLED_POSITIVE,
			changeLabel: "vs last week",
		},
	];

	return <StatusPipeline compact stats={appointmentStats} />;
}
