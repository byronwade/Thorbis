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
  service_type,
  scheduled_start,
  scheduled_end,
  notes,
  metadata,
  created_at,
  updated_at,
  archived_at,
  deleted_at,
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
  ),
  financial:job_financial (
    total_amount,
    paid_amount
  ),
  timeTracking:job_time_tracking (
    actual_start,
    actual_end
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
 *
 * Server-side pagination: Only fetches current page of data based on URL params.
 */
export async function JobsData({ searchParams }: { searchParams?: { page?: string } }) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get current page from URL (default to 1)
	const currentPage = Number(searchParams?.page) || 1;
	const start = (currentPage - 1) * JOBS_PAGE_SIZE;
	const end = start + JOBS_PAGE_SIZE - 1;

	// Fetch total count (just the number, very fast)
	const { count: totalCount } = await supabase
		.from("jobs")
		.select("*", { count: "exact", head: true })
		.is("deleted_at", null);

	// Fetch only current page of jobs (server-side pagination)
	const { data: jobsRaw, error } = await supabase
		.from("jobs")
		.select(JOB_SELECT)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.range(start, end); // Fetch current page based on URL param

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
		relation: T | T[] | null | undefined,
	): T | null => {
		if (!relation) {
			return null;
		}
		return Array.isArray(relation) ? (relation[0] ?? null) : relation;
	};

	const jobs: ExtendedJob[] = (jobsRaw ?? []).map((job) => {
		const customer = resolveRelation<RelatedCustomer>(
			job.customers as RelatedCustomer | RelatedCustomer[] | null,
		);
		const property = resolveRelation<RelatedProperty>(
			job.properties as RelatedProperty | RelatedProperty[] | null,
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

		// Extract domain data with null safety
		const financial = resolveRelation(job.financial as any);
		const timeTracking = resolveRelation(job.timeTracking as any);

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
			scheduledStart: toDate(job.scheduled_start),
			scheduledEnd: toDate(job.scheduled_end),
			notes: job.notes,
			metadata: job.metadata,
			createdAt: new Date(job.created_at),
			updatedAt: new Date(job.updated_at),
			customers: customerData,
			properties: propertyData,
			// Domain fields from separate tables
			totalAmount: financial?.total_amount ?? null,
			paidAmount: financial?.paid_amount ?? null,
			actualStart: toDate(timeTracking?.actual_start ?? null),
			actualEnd: toDate(timeTracking?.actual_end ?? null),
		} satisfies ExtendedJob;
	});

	return (
		<WorkDataView
			kanban={<JobsKanban jobs={jobs} />}
			section="jobs"
			table={<JobsTable itemsPerPage={50} jobs={jobs} totalCount={totalCount || 0} />}
		/>
	);
}
