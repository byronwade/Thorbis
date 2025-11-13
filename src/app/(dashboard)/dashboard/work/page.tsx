import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { JobsKanban } from "@/components/work/jobs-kanban";
import { JobsTable } from "@/components/work/jobs-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { createClient } from "@/lib/supabase/server";

/**
 * Work Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only JobsTable and JobStatusPipeline components are client-side for interactivity
 * - Better SEO and initial page load performance
 *
 * Features:
 * - Realistic customer-focused job display (Customer Name + Job Type)
 * - AI auto-tagging extracts categories, equipment, and priority from notes
 * - No fake AI summaries - shows actual job data like real FSM systems
 * - Full-width seamless datatable layout with toolbar integration
 */

// Configuration constants
const MAX_JOBS_PER_PAGE = 100;

export default async function JobsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  if (!supabase) {
    throw new Error("Database connection not available");
  }

  // Fetch jobs from Supabase with customer and property details
  // Note: Use the foreign key column name with ! to specify the exact relationship
  const { data: jobsRaw, error } = await supabase
    .from("jobs")
    .select(`
      *,
      customers!customer_id(first_name, last_name, email, phone),
      properties!property_id(address, city, state, zip_code)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(MAX_JOBS_PER_PAGE);

  if (error) {
    // Supabase PostgREST errors may not have standard structure
    const errorMessage =
      error.message ||
      error.hint ||
      JSON.stringify(error) ||
      "Unknown database error";
    throw new Error(`Failed to load jobs: ${errorMessage}`);
  }

  // Transform snake_case to camelCase for the component
  const jobs = (jobsRaw || []).map((job: any) => ({
    id: job.id,
    companyId: job.company_id,
    propertyId: job.property_id,
    customerId: job.customer_id,
    assignedTo: job.assigned_to,
    jobNumber: job.job_number,
    title: job.title,
    description: job.description,
    status: job.status,
    priority: job.priority,
    jobType: job.job_type,
    aiCategories: job.ai_categories,
    aiEquipment: job.ai_equipment,
    aiServiceType: job.ai_service_type,
    aiPriorityScore: job.ai_priority_score,
    aiTags: job.ai_tags,
    aiProcessedAt: job.ai_processed_at ? new Date(job.ai_processed_at) : null,
    scheduledStart: job.scheduled_start ? new Date(job.scheduled_start) : null,
    scheduledEnd: job.scheduled_end ? new Date(job.scheduled_end) : null,
    actualStart: job.actual_start ? new Date(job.actual_start) : null,
    actualEnd: job.actual_end ? new Date(job.actual_end) : null,
    totalAmount: job.total_amount ?? 0,
    paidAmount: job.paid_amount ?? 0,
    notes: job.notes,
    metadata: job.metadata,
    createdAt: new Date(job.created_at),
    updatedAt: new Date(job.updated_at),
    // Include related data
    customers: job.customers,
    properties: job.properties,
  }));

  // Calculate job stats
  const jobStats: StatCard[] = [
    {
      label: "Scheduled",
      value: 18,
      change: 5.2,
      changeLabel: "vs last week",
    },
    {
      label: "En Route",
      value: 7,
      change: -2.1,
      changeLabel: "vs last week",
    },
    {
      label: "In Progress",
      value: 12,
      change: 8.3,
      changeLabel: "vs last week",
    },
    {
      label: "Completed",
      value: 24,
      change: 12.5,
      changeLabel: "vs last week",
    },
    {
      label: "Invoiced",
      value: 20,
      change: 3.7,
      changeLabel: "vs last week",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Job Flow Pipeline - Rendered on server, passed to client component */}
      <StatusPipeline compact stats={jobStats} />

      {/* Jobs Table - Client component handles sorting, filtering, pagination */}
      <div className="flex-1 overflow-hidden">
        <WorkDataView
          kanban={<JobsKanban jobs={jobs} />}
          section="jobs"
          table={<JobsTable itemsPerPage={50} jobs={jobs} />}
        />
      </div>
    </div>
  );
}
