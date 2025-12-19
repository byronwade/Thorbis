"use client";

/**
 * Jobs Data (Convex Version)
 *
 * Client component that fetches job data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: jobs-data.tsx (Supabase Server Component)
 */
import { useMemo } from "react";
import { JobsKanban } from "@/components/work/jobs-kanban";
import { JobsTable } from "@/components/work/jobs-table";
import { WorkDataView } from "@/components/work/work-data-view";
import type { Job } from "@/lib/db/schema";
import { useJobs, useJobsDashboard } from "@/lib/convex/hooks/jobs";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const JOBS_PAGE_SIZE = 50;

/**
 * Loading skeleton for jobs view
 */
function JobsLoadingSkeleton() {
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
function JobsError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Jobs</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function JobsEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Jobs Yet</h3>
        <p className="text-muted-foreground mt-2">
          Get started by creating your first job.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for JobsDataConvex
 */
interface JobsDataConvexProps {
  searchParams?: { page?: string; search?: string; tags?: string };
}

/**
 * Jobs Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function JobsDataConvex({ searchParams }: JobsDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const searchQuery = searchParams?.search ?? "";
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch enriched jobs with customer/property data from Convex
  const dashboardData = useJobsDashboard(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  // Loading state
  if (companyLoading || dashboardData === undefined) {
    return <JobsLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <JobsError message="Please select a company to view jobs." />;
  }

  // Error state (Convex returns undefined on error)
  if (dashboardData === null) {
    return <JobsError message="Failed to load jobs. Please try again." />;
  }

  // Empty state
  if (dashboardData.length === 0) {
    return <JobsEmpty />;
  }

  // Transform Convex records to table format
  // The getDashboard query returns enriched jobs with related data
  const jobs: Job[] = dashboardData.map((job) => ({
    id: job._id,
    jobNumber: job.jobNumber,
    jobType: job.jobType ?? null,
    title: job.title,
    status: job.status,
    priority: job.priority,
    description: job.description ?? null,
    totalAmount: job.financial?.totalAmount ?? job.totalAmount ?? null,
    paidAmount: job.financial?.paidAmount ?? null,
    scheduledStart: job.scheduledStart ? new Date(job.scheduledStart).toISOString() : null,
    scheduledEnd: job.scheduledEnd ? new Date(job.scheduledEnd).toISOString() : null,
    actualStart: job.timeTracking?.actualStart ? new Date(job.timeTracking.actualStart).toISOString() : null,
    actualEnd: job.timeTracking?.actualEnd ? new Date(job.timeTracking.actualEnd).toISOString() : null,
    notes: job.internalNotes ?? null,
    createdAt: new Date(job._creationTime).toISOString(),
    updatedAt: null,
    // Extend with customer/property data for table rendering
    customers: job.customer
      ? {
          display_name: job.customer.displayName,
          email: job.customer.email ?? null,
          phone: job.customer.phone ?? null,
          first_name: null,
          last_name: null,
          company_name: null,
        }
      : null,
    properties: job.property
      ? {
          display_name: null,
          address: job.property.address ?? null,
          city: job.property.city ?? null,
          state: job.property.state ?? null,
          zip_code: null,
        }
      : null,
    // Archive/delete status
    archived_at: job.archivedAt ? new Date(job.archivedAt).toISOString() : undefined,
    deleted_at: job.deletedAt ? new Date(job.deletedAt).toISOString() : undefined,
  })) as unknown as Job[];

  // Apply client-side search if provided (for real-time filtering)
  const filteredJobs = searchQuery
    ? jobs.filter((job) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          job.title?.toLowerCase().includes(searchLower) ||
          job.jobNumber?.toString().toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower) ||
          (job as any).customers?.display_name?.toLowerCase().includes(searchLower)
        );
      })
    : jobs;

  return (
    <WorkDataView
      kanban={<JobsKanban jobs={filteredJobs} />}
      section="jobs"
      table={
        <JobsTable
          initialSearchQuery={searchQuery}
          itemsPerPage={JOBS_PAGE_SIZE}
          jobs={filteredJobs}
          totalCount={filteredJobs.length}
          currentPage={currentPage}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { JobsData } from "./jobs-data";
