/**
 * Admin View-As: Team Page
 */

import { Suspense } from "react";
import { getViewAsTeamMembers } from "@/lib/queries/view-as-queries";
import { GenericWorkTable, formatters } from "@/components/view-as/generic-work-table";
import { RowActionsDropdown } from "@/components/view-as/row-actions-dropdown";
import { Skeleton } from "@/components/ui/skeleton";

async function TeamData({ page }: { page: number }) {
	const { data, totalCount } = await getViewAsTeamMembers(page);

	return (
		<GenericWorkTable
			data={data}
			totalCount={totalCount}
			emptyMessage="No team members found"
			columns={[
				{ header: "Name", accessor: "display_name" },
				{ header: "Email", accessor: (row) => {
					const users = Array.isArray(row.users) ? row.users[0] : row.users;
					return users?.email || row.email || "—";
				}},
				{ header: "Phone", accessor: (row) => {
					const users = Array.isArray(row.users) ? row.users[0] : row.users;
					return users?.phone || row.phone || "—";
				}},
				{ header: "Role", accessor: "role" },
				{ header: "Status", accessor: "status", format: formatters.status },
				{ header: "Joined", accessor: "created_at", format: formatters.date },
			]}
			actionsRenderer={(row) => (
				<RowActionsDropdown
					resourceType="team"
					resourceId={row.id}
				/>
			)}
		/>
	);
}

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Team</h1>
				<p className="text-sm text-muted-foreground">View team members</p>
			</div>
			<Suspense fallback={<Skeleton className="h-64 w-full" />}>
				<TeamData page={currentPage} />
			</Suspense>
		</div>
	);
}
