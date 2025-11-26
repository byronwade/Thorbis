/**
 * Admin View-As: Estimates Page
 */

import { Suspense } from "react";
import { getViewAsEstimates } from "@/lib/queries/view-as-queries";
import { GenericWorkTable, formatters } from "@/components/view-as/generic-work-table";
import { Skeleton } from "@/components/ui/skeleton";

async function EstimatesData({ page }: { page: number }) {
	const { data, totalCount } = await getViewAsEstimates(page);

	return (
		<GenericWorkTable
			data={data}
			totalCount={totalCount}
			emptyMessage="No estimates found"
			columns={[
				{ header: "Estimate #", accessor: "estimate_number" },
				{ header: "Title", accessor: "title" },
				{ header: "Customer", accessor: "customers", format: formatters.customer },
				{ header: "Status", accessor: "status", format: formatters.status },
				{ header: "Amount", accessor: "total_amount", align: "right", format: formatters.currency },
				{ header: "Valid Until", accessor: "valid_until", format: formatters.date },
				{ header: "Created", accessor: "created_at", format: formatters.date },
			]}
		/>
	);
}

export default async function AdminEstimatesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Estimates</h1>
				<p className="text-sm text-muted-foreground">View customer estimates</p>
			</div>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<EstimatesData page={currentPage} />
			</Suspense>
		</div>
	);
}
