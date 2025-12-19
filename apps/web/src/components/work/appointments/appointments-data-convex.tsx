"use client";

/**
 * Appointments Data (Convex Version)
 *
 * Client component that fetches appointment data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: appointments-data.tsx (Supabase Server Component)
 */
import { AppointmentsKanban } from "@/components/work/appointments-kanban";
import { AppointmentsTable } from "@/components/work/appointments-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useAppointments } from "@/lib/convex/hooks/appointments";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const APPOINTMENTS_PAGE_SIZE = 50;

/**
 * Loading skeleton for appointments view
 */
function AppointmentsLoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Error state component
 */
function AppointmentsError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Appointments</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function AppointmentsEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Appointments Yet</h3>
        <p className="text-muted-foreground mt-2">
          Schedule your first appointment to get started.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for AppointmentsDataConvex
 */
interface AppointmentsDataConvexProps {
  searchParams?: { page?: string; search?: string };
}

/**
 * Appointments Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function AppointmentsDataConvex({ searchParams }: AppointmentsDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch appointments from Convex
  const appointmentsResult = useAppointments(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: APPOINTMENTS_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || appointmentsResult === undefined) {
    return <AppointmentsLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <AppointmentsError message="Please select a company to view appointments." />;
  }

  // Error state
  if (appointmentsResult === null) {
    return <AppointmentsError message="Failed to load appointments. Please try again." />;
  }

  const { schedules: convexAppointments, total, hasMore } = appointmentsResult;

  // Empty state
  if (convexAppointments.length === 0) {
    return <AppointmentsEmpty />;
  }

  // Transform Convex records to table format
  const appointments = convexAppointments.map((apt) => ({
    id: apt._id,
    title: apt.title || "Untitled Appointment",
    description: apt.description,
    start_time: apt.startTime ? new Date(apt.startTime).toISOString() : null,
    end_time: apt.endTime ? new Date(apt.endTime).toISOString() : apt.startTime ? new Date(apt.startTime).toISOString() : null,
    status: apt.status || "scheduled",
    customer: null, // Customer data not included in list query
    assigned_user: null, // Assigned user not included in list query
    job_id: apt.jobId,
    archived_at: apt.archivedAt ? new Date(apt.archivedAt).toISOString() : null,
    deleted_at: apt.deletedAt ? new Date(apt.deletedAt).toISOString() : null,
  }));

  return (
    <WorkDataView
      kanban={<AppointmentsKanban appointments={appointments} />}
      section="appointments"
      table={
        <AppointmentsTable
          appointments={appointments}
          itemsPerPage={APPOINTMENTS_PAGE_SIZE}
          totalCount={total}
          currentPage={currentPage}
          initialSearchQuery={searchParams?.search ?? ""}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { AppointmentsData } from "./appointments-data";
