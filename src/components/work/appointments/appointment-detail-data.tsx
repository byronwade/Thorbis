/**
 * Appointment Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all appointment data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Appointment/Schedule data (with customer, property, job, assigned user)
 * - Activity log
 * - Notes
 * - Attachments
 *
 * Total: 4 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { AppointmentPageContent } from "@/components/work/appointments/appointment-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
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

	// Check if active company has completed onboarding
	const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

	if (!isOnboardingComplete) {
		redirect("/dashboard/welcome");
	}

	// Get active company ID
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard/welcome");
	}

	// Fetch appointment with all related data
	const { data: appointment, error: appointmentError } = await supabase
		.from("schedules")
		.select(
			`
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*),
      job:jobs!job_id(*),
      assigned_user:users!assigned_to(id, name, email, avatar)
    `
		)
		.eq("id", appointmentId)
		.eq("type", "appointment")
		.is("deleted_at", null)
		.single();

	if (appointmentError || !appointment) {
		return notFound();
	}

	if (appointment.company_id !== activeCompanyId) {
		return notFound();
	}

	// Get related data
	const customer = Array.isArray(appointment.customer)
		? appointment.customer[0]
		: appointment.customer;
	const property = Array.isArray(appointment.property)
		? appointment.property[0]
		: appointment.property;
	const job = Array.isArray(appointment.job) ? appointment.job[0] : appointment.job;
	const assignedUser = Array.isArray(appointment.assigned_user)
		? appointment.assigned_user[0]
		: appointment.assigned_user;

	// Fetch all related data in parallel
	const [{ data: activities }, { data: notes }, { data: attachments }] = await Promise.all([
		supabase
			.from("activity_log")
			.select("*, user:users!user_id(*)")
			.eq("entity_type", "schedule")
			.eq("entity_id", appointmentId)
			.order("created_at", { ascending: false })
			.limit(50),
		supabase
			.from("notes")
			.select("*")
			.eq("entity_type", "schedule")
			.eq("entity_id", appointmentId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false }),
		supabase
			.from("attachments")
			.select("*")
			.eq("entity_type", "schedule")
			.eq("entity_id", appointmentId)
			.order("created_at", { ascending: false }),
	]);

	const appointmentData = {
		appointment,
		customer,
		property,
		job,
		assignedUser,
		activities: activities || [],
		notes: notes || [],
		attachments: attachments || [],
	};

	// Calculate metrics
	const scheduledStart = appointment.scheduled_start ? new Date(appointment.scheduled_start) : null;
	const scheduledEnd = appointment.scheduled_end ? new Date(appointment.scheduled_end) : null;
	const duration =
		scheduledStart && scheduledEnd
			? Math.round((scheduledEnd.getTime() - scheduledStart.getTime()) / (1000 * 60))
			: 0;

	const metrics = {
		status: appointment.status || "scheduled",
		scheduledStart: appointment.scheduled_start,
		scheduledEnd: appointment.scheduled_end,
		duration,
		assignedTo: assignedUser?.name || "Unassigned",
	};

	const stats = generateAppointmentStats(metrics);

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<AppointmentPageContent entityData={appointmentData} />
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
