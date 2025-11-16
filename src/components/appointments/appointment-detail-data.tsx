/**
 * Appointment Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all appointment data.
 * This streams in after the layout shell renders.
 *
 * Fetches:
 * - Appointment (schedule) with customer, property, job, assigned user
 * - Team assignments
 * - Pending job tasks
 * - Job notes
 * - Activity log
 *
 * Total: 6+ queries (optimized with Promise.all)
 */

import { notFound } from "next/navigation";
import { AppointmentPageContent } from "@/components/appointments/appointment-page-content";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { generateAppointmentStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type AppointmentDetailDataProps = {
	appointmentId: string;
};

export async function AppointmentDetailData({ appointmentId }: AppointmentDetailDataProps) {
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

	// Get active company
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Verify user access
	const { data: teamMember } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", user.id)
		.eq("company_id", activeCompanyId)
		.eq("status", "active")
		.maybeSingle();

	if (!teamMember) {
		return notFound();
	}

	// Fetch appointment with all related data
	const { data: appointment, error } = await supabase
		.from("schedules")
		.select(`
      *,
      customer:customers(*),
      property:properties(*),
      job:jobs(*),
      assigned_user:users!assigned_to(*)
    `)
		.eq("id", appointmentId)
		.is("deleted_at", null)
		.single();

	if (error || !appointment) {
		return notFound();
	}

	// Verify belongs to company
	if (appointment.company_id !== activeCompanyId) {
		return notFound();
	}

	// Fetch related data
	const [{ data: teamAssignments }, { data: tasks }, { data: notes }, { data: activities }] = await Promise.all([
		supabase.from("schedule_team_assignments").select("*, user:users(*)").eq("schedule_id", appointmentId),
		supabase.from("job_tasks").select("*").eq("job_id", appointment.job_id).eq("status", "pending"),
		supabase
			.from("job_notes")
			.select("*, user:users(*)")
			.eq("job_id", appointment.job_id)
			.order("created_at", { ascending: false })
			.limit(10),
		supabase
			.from("activity_log")
			.select("*, user:users(*)")
			.eq("entity_type", "schedule")
			.eq("entity_id", appointmentId)
			.order("created_at", { ascending: false })
			.limit(20),
	]);

	// Get customer and property from appointment
	const customer = Array.isArray(appointment.customer) ? appointment.customer[0] : appointment.customer;
	const property = Array.isArray(appointment.property) ? appointment.property[0] : appointment.property;
	const job = Array.isArray(appointment.job) ? appointment.job[0] : appointment.job;

	// Calculate metrics
	const appointmentStart = appointment.start_time ? new Date(appointment.start_time) : null;
	const appointmentEnd = appointment.end_time ? new Date(appointment.end_time) : null;

	const duration =
		appointmentStart && appointmentEnd
			? Math.floor((appointmentEnd.getTime() - appointmentStart.getTime()) / (1000 * 60))
			: 0;

	const metrics = {
		duration,
		travelTime: 0,
		teamMemberCount: teamAssignments?.length || 0,
		jobValue: job?.total_amount || 0,
	};

	const appointmentData = {
		appointment,
		customer,
		property,
		job,
		teamAssignments: teamAssignments || [],
		tasks: tasks || [],
		notes: notes || [],
		activities: activities || [],
	};

	// Generate stats for toolbar
	const stats = generateAppointmentStats({
		...metrics,
		jobValue: metrics.jobValue || 0,
	});

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<div className="p-6">
						<AppointmentPageContent entityData={appointmentData} metrics={metrics} />
					</div>
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
