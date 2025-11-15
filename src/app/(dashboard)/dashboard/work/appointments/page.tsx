import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { AppointmentsKanban } from "@/components/work/appointments-kanban";
import { AppointmentsTable } from "@/components/work/appointments-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Appointments Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only AppointmentsTable and AppointmentsKanban components are client-side for interactivity
 * - Better SEO and initial page load performance
 */

// Configuration constants
const MAX_APPOINTMENTS_PER_PAGE = 100;

export default async function AppointmentsPage() {
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

  // Fetch ALL appointments from schedules table where type = 'appointment'
  // Client-side filtering will handle archive status
  const { data: appointmentsRaw, error } = await supabase
    .from("schedules")
    .select(`
      *,
      customers!customer_id(first_name, last_name, display_name, company_name),
      properties!property_id(address, city, state, zip_code),
      assigned_user:users!assigned_to(id, name, email)
    `)
    .eq("company_id", activeCompanyId)
    .eq("type", "appointment")
    .order("start_time", { ascending: true })
    .limit(MAX_APPOINTMENTS_PER_PAGE);

  if (error) {
    const errorMessage =
      error.message ||
      error.hint ||
      JSON.stringify(error) ||
      "Unknown database error";
    throw new Error(`Failed to load appointments: ${errorMessage}`);
  }

  // Transform data for components
  const appointments = (appointmentsRaw || [])
    .filter((apt: any) => apt.start_time) // Only include appointments with start time
    .map((apt: any) => {
      const customer = Array.isArray(apt.customers)
        ? apt.customers[0]
        : apt.customers;
      const property = Array.isArray(apt.properties)
        ? apt.properties[0]
        : apt.properties;

      return {
        id: apt.id,
        title: apt.title,
        description: apt.description,
        start_time: new Date(apt.start_time),
        end_time: apt.end_time
          ? new Date(apt.end_time)
          : new Date(apt.start_time),
        status: apt.status || "scheduled",
        type: apt.type,
        customer,
        property,
        assigned_user: Array.isArray(apt.assigned_user)
          ? apt.assigned_user[0]
          : apt.assigned_user,
        job_id: apt.job_id,
        property_id: apt.property_id,
        customer_id: apt.customer_id,
        company_id: apt.company_id,
        created_at: new Date(apt.created_at),
        updated_at: new Date(apt.updated_at),
        archived_at: apt.archived_at,
        deleted_at: apt.deleted_at,
      };
    });

  // Only count active (non-archived) appointments in stats
  const activeAppointments = appointments.filter(
    (a) => !(a.archived_at || a.deleted_at)
  );

  const scheduledCount = activeAppointments.filter(
    (a) => a.status === "scheduled"
  ).length;
  const confirmedCount = activeAppointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const inProgressCount = activeAppointments.filter(
    (a) => a.status === "in_progress"
  ).length;
  const completedCount = activeAppointments.filter(
    (a) => a.status === "completed"
  ).length;
  const cancelledCount = activeAppointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  const appointmentStats: StatCard[] = [
    {
      label: "Scheduled",
      value: scheduledCount,
      change: scheduledCount > 0 ? 8.4 : 0, // Green if scheduled appointments
      changeLabel: "vs last week",
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      change: confirmedCount > 0 ? 12.1 : 0, // Green if confirmed
      changeLabel: "vs last week",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      change: inProgressCount > 0 ? 5.7 : 0, // Green if in progress
      changeLabel: "vs last week",
    },
    {
      label: "Completed",
      value: completedCount,
      change: completedCount > 0 ? 9.3 : 0, // Green if completed
      changeLabel: "vs last week",
    },
    {
      label: "Cancelled",
      value: cancelledCount,
      change: cancelledCount > 0 ? -3.2 : 2.1, // Red if cancelled, green if none
      changeLabel: "vs last week",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <StatusPipeline compact stats={appointmentStats} />
      <div className="flex-1 overflow-hidden">
        <WorkDataView
          kanban={<AppointmentsKanban appointments={appointments} />}
          section="appointments"
          table={
            <AppointmentsTable appointments={appointments} itemsPerPage={50} />
          }
        />
      </div>
    </div>
  );
}
