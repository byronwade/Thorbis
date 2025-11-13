/**
 * Appointment Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { AppointmentPageContent } from "@/components/work/appointments/appointment-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { generateAppointmentStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

export default async function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: appointmentId } = await params;

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
    .select(`
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*),
      job:jobs!job_id(*),
      assigned_user:users!assigned_to(id, name, email, avatar)
    `)
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
  const job = Array.isArray(appointment.job)
    ? appointment.job[0]
    : appointment.job;
  const assignedUser = Array.isArray(appointment.assigned_user)
    ? appointment.assigned_user[0]
    : appointment.assigned_user;

  // Fetch all related data
  const [{ data: activities }, { data: notes }, { data: attachments }] =
    await Promise.all([
      supabase
        .from("activity_log")
        .select("*, user:users!user_id(*)")
        .eq("entity_type", "appointment")
        .eq("entity_id", appointmentId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("notes")
        .select("*")
        .eq("entity_type", "appointment")
        .eq("entity_id", appointmentId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
      supabase
        .from("attachments")
        .select("*")
        .eq("entity_type", "appointment")
        .eq("entity_id", appointmentId)
        .order("created_at", { ascending: false }),
    ]);

  const appointmentData = {
    appointment,
    customer,
    property,
    job,
    assigned_user: assignedUser,
    activities: activities || [],
    notes: notes || [],
    attachments: attachments || [],
  };

  // Calculate metrics for stats
  const appointmentStart = appointment.start_time
    ? new Date(appointment.start_time)
    : null;
  const appointmentEnd = appointment.end_time
    ? new Date(appointment.end_time)
    : null;
  const duration =
    appointmentStart && appointmentEnd
      ? Math.floor(
          (appointmentEnd.getTime() - appointmentStart.getTime()) / (1000 * 60)
        )
      : 0;

  const metrics = {
    duration,
    travelTime: 0,
    teamMemberCount: assignedUser ? 1 : 0,
    jobValue: job?.total_amount || 0,
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
            <AppointmentPageContent entityData={appointmentData} />
          </div>
        </div>
      </div>
    </ToolbarStatsProvider>
  );
}
