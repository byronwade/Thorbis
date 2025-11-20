import { notFound } from "next/navigation";
import { JobsKanban } from "@/components/work/jobs-kanban";
import { JobsTable } from "@/components/work/jobs-table";
import { WorkDataView } from "@/components/work/work-data-view";
import type { Job } from "@/lib/db/schema";
import {
	getJobsPageData,
	getJobsWithTags,
	JOBS_PAGE_SIZE,
} from "@/lib/queries/jobs";

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
 * Supports tag filtering via URL query string: ?tags=warranty,emergency
 */
export async function JobsData({
	searchParams,
}: {
	searchParams?: { page?: string; search?: string; tags?: string };
}) {
	// Get user's active company
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const searchQuery = searchParams?.search ?? "";
	const tagSlugs = searchParams?.tags ? searchParams.tags.split(",") : [];

	// Use tag-filtered query if tags are provided
	const { jobs: jobsRaw, totalCount } =
		tagSlugs.length > 0
			? await getJobsWithTags(
					currentPage,
					JOBS_PAGE_SIZE,
					searchQuery,
					tagSlugs,
				)
			: await getJobsPageData(
					currentPage,
					JOBS_PAGE_SIZE,
					searchQuery,
					companyId,
				);

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
			table={
				<JobsTable
					initialSearchQuery={searchQuery}
					itemsPerPage={JOBS_PAGE_SIZE}
					jobs={jobs}
					totalCount={totalCount || 0}
					currentPage={currentPage}
				/>
			}
		/>
	);
}
