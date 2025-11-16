import { notFound } from "next/navigation";
import { JobsKanban } from "@/components/work/jobs-kanban";
import { JobsTable } from "@/components/work/jobs-table";
import { WorkDataView } from "@/components/work/work-data-view";
import type { Job } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

// Configuration constants
const JOBS_PAGE_SIZE = 50;

const JOB_SELECT = `
  id,
  company_id,
  property_id,
  customer_id,
  assigned_to,
  job_number,
  title,
  description,
  status,
  priority,
  job_type,
  ai_categories,
  ai_equipment,
  ai_service_type,
  ai_priority_score,
  ai_tags,
  ai_processed_at,
  scheduled_start,
  scheduled_end,
  actual_start,
  actual_end,
  total_amount,
  paid_amount,
  notes,
  metadata,
  created_at,
  updated_at,
  customers:customers!customer_id (
    first_name,
    last_name,
    email,
    phone
  ),
  properties:properties!property_id (
    address,
    city,
    state,
    zip_code
  )
`;

type RelatedCustomer = {
  display_name?: string | null;
  company_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type RelatedProperty = {
  display_name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
};

type ExtendedJob = Job & {
  id: string;
  companyId?: string | null;
  propertyId?: string | null;
  customerId?: string | null;
  assignedTo?: string | null;
  metadata?: Record<string, unknown> | null;
  customers?: RelatedCustomer | null;
  properties?: RelatedProperty | null;
  aiProcessedAt?: Date | string | null;
  scheduledStart?: Date | string | null;
  scheduledEnd?: Date | string | null;
  actualStart?: Date | string | null;
  actualEnd?: Date | string | null;
  totalAmount?: number | null;
  paidAmount?: number | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

/**
 * Jobs Data - Async Server Component
 *
 * Fetches jobs data and renders table/kanban views.
 * Streams in after shell renders.
 */
export async function JobsData() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Fetch jobs from Supabase with customer and property details
  const { data: jobsRaw, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(JOBS_PAGE_SIZE);

  if (error) {
    const errorMessage =
      error.message ||
      error.hint ||
      JSON.stringify(error) ||
      "Unknown database error";
    throw new Error(`Failed to load jobs: ${errorMessage}`);
  }

  // Transform snake_case to camelCase for the component
  const toDate = (value: string | null) => (value ? new Date(value) : null);

  const resolveRelation = <T,>(
    relation: T | T[] | null | undefined
  ): T | null => {
    if (!relation) {
      return null;
    }
    return Array.isArray(relation) ? (relation[0] ?? null) : relation;
  };

  const jobs: ExtendedJob[] = (jobsRaw ?? []).map((job) => {
    const customer = resolveRelation<RelatedCustomer>(
      job.customers as RelatedCustomer | RelatedCustomer[] | null
    );
    const property = resolveRelation<RelatedProperty>(
      job.properties as RelatedProperty | RelatedProperty[] | null
    );

    const customerData: RelatedCustomer | null = customer
      ? {
          display_name: customer.display_name ?? null,
          company_name: customer.company_name ?? null,
          first_name: customer.first_name ?? null,
          last_name: customer.last_name ?? null,
          email: customer.email ?? null,
          phone: customer.phone ?? null,
        }
      : null;

    const propertyData: RelatedProperty | null = property
      ? {
          display_name: property.display_name ?? null,
          address: property.address ?? null,
          city: property.city ?? null,
          state: property.state ?? null,
          zip_code: property.zip_code ?? null,
        }
      : null;

    return {
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
      aiProcessedAt: toDate(job.ai_processed_at),
      scheduledStart: toDate(job.scheduled_start),
      scheduledEnd: toDate(job.scheduled_end),
      actualStart: toDate(job.actual_start),
      actualEnd: toDate(job.actual_end),
      totalAmount: job.total_amount ?? 0,
      paidAmount: job.paid_amount ?? 0,
      notes: job.notes,
      metadata: job.metadata,
      createdAt: new Date(job.created_at),
      updatedAt: new Date(job.updated_at),
      customers: customerData,
      properties: propertyData,
    } satisfies ExtendedJob;
  });

  return (
    <WorkDataView
      kanban={<JobsKanban jobs={jobs} />}
      section="jobs"
      table={<JobsTable itemsPerPage={50} jobs={jobs} />}
    />
  );
}
