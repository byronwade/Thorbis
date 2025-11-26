/**
 * Admin View-As: Materials Page
 */

import { Suspense } from "react";
import { getViewAsMaterials } from "@/lib/queries/view-as-queries";
import { GenericWorkTable, formatters } from "@/components/view-as/generic-work-table";
import { Skeleton } from "@/components/ui/skeleton";

async function MaterialsData({ page }: { page: number }) {
	const { data, totalCount } = await getViewAsMaterials(page);

	return (
		<GenericWorkTable
			data={data}
			totalCount={totalCount}
			emptyMessage="No materials found"
			columns={[
				{ header: "Name", accessor: "name" },
				{ header: "SKU", accessor: "sku" },
				{ header: "Category", accessor: "category" },
				{ header: "On Hand", accessor: "quantity_on_hand", align: "right" },
				{ header: "Unit Cost", accessor: "unit_cost", align: "right", format: formatters.currency },
				{ header: "Added", accessor: "created_at", format: formatters.date },
			]}
		/>
	);
}

export default async function AdminMaterialsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Materials</h1>
				<p className="text-sm text-muted-foreground">View materials inventory</p>
			</div>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<MaterialsData page={currentPage} />
			</Suspense>
		</div>
	);
}
