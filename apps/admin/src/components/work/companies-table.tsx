"use client";

/**
 * CompaniesTable Component
 *
 * Admin datatable for managing companies on the Stratos platform.
 */

import { Archive, Building2, Edit, Eye, Plus, Users } from "lucide-react";
import Link from "next/link";
import { Button, RowActionsDropdown } from "@stratos/ui";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import {
	CompanyStatusBadge,
	PlanBadge,
} from "@/components/ui/status-badge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import type { Company } from "@/types/entities";

type CompaniesTableProps = {
	companies: Company[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onCompanyClick?: (company: Company) => void;
	showRefresh?: boolean;
	initialSearchQuery?: string;
};

export function CompaniesTable({
	companies,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onCompanyClick,
	showRefresh = false,
	initialSearchQuery = "",
}: CompaniesTableProps) {
	const columns: ColumnDef<Company>[] = [
		{
			key: "name",
			header: "Company",
			width: "flex-1",
			render: (company) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/companies/${company.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center gap-3">
						<div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
							<Building2 className="text-muted-foreground h-4 w-4" />
						</div>
						<div className="min-w-0">
							<div className="truncate text-sm font-medium hover:underline">
								{company.name}
							</div>
							<div className="text-muted-foreground truncate text-xs">
								{company.email}
							</div>
						</div>
					</div>
				</Link>
			),
		},
		{
			key: "plan",
			header: "Plan",
			width: "w-32",
			shrink: true,
			hideable: true,
			render: (company) => <PlanBadge plan={company.plan} />,
		},
		{
			key: "users",
			header: "Users",
			width: "w-24",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (company) => (
				<div className="flex items-center gap-1.5">
					<Users className="text-muted-foreground h-3.5 w-3.5" />
					<span className="text-sm tabular-nums">{company.usersCount}</span>
				</div>
			),
		},
		{
			key: "revenue",
			header: "MRR",
			width: "w-28",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			hideable: true,
			render: (company) => (
				<span className="font-mono text-sm tabular-nums">
					{formatCurrency(company.monthlyRevenue ?? 0, { decimals: 0 })}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			hideable: false,
			render: (company) => <CompanyStatusBadge status={company.status} />,
		},
		{
			key: "created",
			header: "Created",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (company) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{formatDate(company.createdAt, "short")}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (company) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Details",
							icon: Eye,
							href: `/dashboard/work/companies/${company.id}`,
						},
						{
							label: "Edit Company",
							icon: Edit,
							href: `/dashboard/work/companies/${company.id}/edit`,
						},
						{
							label: "View Users",
							icon: Users,
							href: `/dashboard/work/users?companyId=${company.id}`,
							separatorBefore: true,
						},
						{
							label: "Suspend Company",
							icon: Archive,
							variant: "destructive",
							separatorBefore: true,
							onClick: () => {
								// TODO: Implement suspend action
								console.log("Suspend company:", company.id);
							},
						},
					]}
				/>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Suspend Selected",
			icon: <Archive className="h-4 w-4" />,
			onClick: (selectedIds) => {
				// TODO: Implement bulk suspend
				console.log("Suspend companies:", selectedIds);
			},
			variant: "destructive",
		},
	];

	const handleRowClick = (company: Company) => {
		if (onCompanyClick) {
			onCompanyClick(company);
		} else {
			window.location.href = `/dashboard/work/companies/${company.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	const handleAddCompany = () => {
		window.location.href = "/dashboard/work/companies/new";
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={companies}
			totalCount={totalCount}
			currentPageFromServer={currentPage}
			initialSearchQuery={initialSearchQuery}
			serverPagination
			emptyAction={
				<Button onClick={handleAddCompany} size="sm">
					<Plus className="mr-2 size-4" />
					Add Company
				</Button>
			}
			emptyIcon={<Building2 className="text-muted-foreground h-8 w-8" />}
			emptyMessage="No companies found"
			enableSelection={true}
			entity="admin-companies"
			getItemId={(company) => company.id}
			itemsPerPage={itemsPerPage}
			onRefresh={handleRefresh}
			onRowClick={handleRowClick}
			serverSearch
			searchParamKey="search"
			searchPlaceholder="Search companies by name, email, plan..."
			showRefresh={showRefresh}
		/>
	);
}
