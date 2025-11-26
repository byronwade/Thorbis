/**
 * Admin View-As: Contracts Page
 */

import { Suspense } from "react";
import { getViewAsContracts } from "@/lib/queries/view-as-queries";
import { GenericWorkTable, formatters } from "@/components/view-as/generic-work-table";
import { Skeleton } from "@/components/ui/skeleton";

async function ContractsData({ page }: { page: number }) {
	const { data, totalCount } = await getViewAsContracts(page);

	return (
		<GenericWorkTable
			data={data}
			totalCount={totalCount}
			emptyMessage="No contracts found"
			columns={[
				{ header: "Contract #", accessor: "contract_number" },
				{ header: "Title", accessor: "title" },
				{ header: "Customer", accessor: "customers", format: formatters.customer },
				{ header: "Status", accessor: "status", format: formatters.status },
				{ header: "Value", accessor: "total_value", align: "right", format: formatters.currency },
				{ header: "Start Date", accessor: "start_date", format: formatters.date },
				{ header: "End Date", accessor: "end_date", format: formatters.date },
			]}
		/>
	);
}

export default async function AdminContractsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Contracts</h1>
				<p className="text-sm text-muted-foreground">View customer contracts</p>
			</div>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<ContractsData page={currentPage} />
			</Suspense>
		</div>
	);
}
