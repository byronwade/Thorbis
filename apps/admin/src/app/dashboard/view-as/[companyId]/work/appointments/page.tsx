/**
 * Admin View-As: Appointments Page
 */

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getViewAsAppointments } from "@/lib/queries/view-as-queries";
import { GenericWorkTable, formatters } from "@/components/view-as/generic-work-table";
import { Skeleton } from "@/components/ui/skeleton";

async function AppointmentsData({ page }: { page: number }) {
	const { data, totalCount } = await getViewAsAppointments(page);

	return (
		<GenericWorkTable
			data={data}
			totalCount={totalCount}
			emptyMessage="No appointments found"
			columns={[
				{ header: "Title", accessor: "title" },
				{ header: "Customer", accessor: "customers", format: formatters.customer },
				{ header: "Status", accessor: "status", format: formatters.status },
				{ header: "Scheduled Start", accessor: "scheduled_start", format: formatters.datetime },
				{ header: "Scheduled End", accessor: "scheduled_end", format: formatters.datetime },
				{ header: "Created", accessor: "created_at", format: formatters.date },
			]}
		/>
	);
}

export default async function AdminAppointmentsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Appointments</h1>
				<p className="text-sm text-muted-foreground">View customer appointments</p>
			</div>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<AppointmentsData page={currentPage} />
			</Suspense>
		</div>
	);
}
