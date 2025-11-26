/**
 * Admin View-As: Equipment Page
 */

import { Suspense } from "react";
import { getViewAsEquipment } from "@/lib/queries/view-as-queries";
import { GenericWorkTable, formatters } from "@/components/view-as/generic-work-table";
import { Skeleton } from "@/components/ui/skeleton";

async function EquipmentData({ page }: { page: number }) {
	const { data, totalCount } = await getViewAsEquipment(page);

	return (
		<GenericWorkTable
			data={data}
			totalCount={totalCount}
			emptyMessage="No equipment found"
			columns={[
				{ header: "Name", accessor: "name" },
				{ header: "Type", accessor: "type" },
				{ header: "Serial Number", accessor: "serial_number" },
				{ header: "Status", accessor: "status", format: formatters.status },
				{ header: "Purchase Date", accessor: "purchase_date", format: formatters.date },
				{ header: "Added", accessor: "created_at", format: formatters.date },
			]}
		/>
	);
}

export default async function AdminEquipmentPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Equipment</h1>
				<p className="text-sm text-muted-foreground">View company equipment</p>
			</div>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<EquipmentData page={currentPage} />
			</Suspense>
		</div>
	);
}
