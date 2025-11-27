/**
 * Admin View-As: Jobs Page
 *
 * Shows the exact jobs view that the customer sees in their dashboard.
 * Uses the real web component with company context override.
 */

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getImpersonatedCompanyId } from "@/lib/admin-context";
import { redirect } from "next/navigation";
import { getJobsPageData, JOBS_PAGE_SIZE } from "@web/lib/queries/jobs";
import { JobsKanban } from "@web/components/work/jobs-kanban";
import { JobsTable } from "@web/components/work/jobs-table";
import { JobsSkeleton } from "@web/components/work/jobs/jobs-skeleton";
import { WorkDataView } from "@web/components/work/work-data-view";

type SearchParams = {
	page?: string;
	search?: string;
	tags?: string;
};

interface JobsPageProps {
	searchParams: Promise<SearchParams>;
}

/**
 * Jobs Data Component
 *
 * Fetches jobs for the impersonated company and renders the customer's view.
 */
async function JobsData({ searchParams }: { searchParams: SearchParams }) {
	// Get impersonated company ID from admin context
	const companyId = await getImpersonatedCompanyId();

	if (!companyId) {
		redirect("/admin/dashboard/work/companies");
	}

	const currentPage = Number(searchParams?.page) || 1;
	const searchQuery = searchParams?.search ?? "";

	// Use web app's query function with company override
	const { jobs: jobsRaw, totalCount } = await getJobsPageData(
		currentPage,
		JOBS_PAGE_SIZE,
		searchQuery,
		companyId, // Override company ID to impersonated company
	);

	// Transform to camelCase (same as web component)
	const toDate = (value: string | null) => (value ? new Date(value) : null);

	const resolveRelation = <T,>(
		relation: T | T[] | null | undefined,
	): T | null => {
		if (!relation) return null;
		return Array.isArray(relation) ? (relation[0] ?? null) : relation;
	};

	const jobs = (jobsRaw ?? []).map((job) => {
		const customer = resolveRelation(job.customers as any);
		const property = resolveRelation(job.properties as any);
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
			customers: customer
				? {
						display_name: customer.display_name ?? null,
						company_name: customer.company_name ?? null,
						first_name: customer.first_name ?? null,
						last_name: customer.last_name ?? null,
						email: customer.email ?? null,
						phone: customer.phone ?? null,
					}
				: null,
			properties: property
				? {
						display_name: property.display_name ?? null,
						address: property.address ?? null,
						city: property.city ?? null,
						state: property.state ?? null,
						zip_code: property.zip_code ?? null,
					}
				: null,
			totalAmount: financial?.total_amount ?? null,
			paidAmount: financial?.paid_amount ?? null,
			actualStart: toDate(timeTracking?.actual_start ?? null),
			actualEnd: toDate(timeTracking?.actual_end ?? null),
		};
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

export default async function AdminJobsPage({ searchParams }: JobsPageProps) {
	const params = await searchParams;

	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 overflow-hidden">
				<Suspense fallback={<JobsSkeleton />}>
					<JobsData searchParams={params} />
				</Suspense>
			</div>
		</div>
	);
}
