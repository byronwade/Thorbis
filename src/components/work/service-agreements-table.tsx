"use client";

import { Archive, Calendar, Download, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type BulkAction, type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { GenericStatusBadge } from "@/components/ui/generic-status-badge";
import { formatCurrency } from "@/lib/formatters";
import { useArchiveStore } from "@/lib/stores/archive-store";

export type ServiceAgreement = {
	id: string;
	agreementNumber: string;
	customer: string;
	type: "Service Level Agreement" | "Extended Warranty" | "Maintenance Contract" | "Support Contract";
	startDate: string;
	endDate: string;
	value: number;
	status: "active" | "pending" | "expired" | "cancelled";
	archived_at?: string | null;
	deleted_at?: string | null;
};

const SERVICE_AGREEMENT_STATUS_CONFIG = {
	active: {
		className: "bg-success hover:bg-success text-white",
		label: "Active",
	},
	pending: {
		className: "bg-warning text-warning dark:bg-warning/20 dark:text-warning",
		label: "Pending",
	},
	expired: {
		className: "bg-destructive text-destructive dark:bg-destructive/20 dark:text-destructive",
		label: "Expired",
	},
	cancelled: {
		className: "bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground",
		label: "Cancelled",
	},
} as const;

export function ServiceAgreementsTable({
	agreements,
	itemsPerPage = 50,
}: {
	agreements: ServiceAgreement[];
	itemsPerPage?: number;
}) {
	// Archive filter state
	const archiveFilter = useArchiveStore((state) => state.filters.service_agreements);

	// Filter agreements based on archive status
	const filteredAgreements = agreements.filter((agreement) => {
		const isArchived = Boolean(agreement.archived_at || agreement.deleted_at);
		if (archiveFilter === "active") {
			return !isArchived;
		}
		if (archiveFilter === "archived") {
			return isArchived;
		}
		return true; // "all"
	});

	const columns: ColumnDef<ServiceAgreement>[] = [
		{
			key: "agreementNumber",
			header: "Agreement #",
			width: "w-36",
			shrink: true,
			sortable: true,
			render: (agreement) => (
				<Link
					className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
					href={`/dashboard/work/service-agreements/${agreement.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{agreement.agreementNumber}
				</Link>
			),
		},
		{
			key: "customer",
			sortable: true,
			header: "Customer",
			width: "flex-1",
			render: (agreement) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/service-agreements/${agreement.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="truncate font-medium text-foreground text-sm leading-tight hover:underline">
						{agreement.customer}
					</div>
					<div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">{agreement.type}</div>
				</Link>
			),
		},
		{
			key: "startDate",
			header: "Start Date",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (agreement) => <span className="text-muted-foreground text-sm tabular-nums">{agreement.startDate}</span>,
		},
		{
			key: "endDate",
			header: "End Date",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (agreement) => <span className="text-muted-foreground text-sm tabular-nums">{agreement.endDate}</span>,
		},
		{
			key: "value",
			header: "Value",
			width: "w-32",
			shrink: true,
			align: "right",
			hideable: true,
			render: (agreement) => <span className="font-semibold tabular-nums">{formatCurrency(agreement.value)}</span>,
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			hideable: false, // CRITICAL: Status key for action items
			render: (agreement) => (
				<GenericStatusBadge
					config={SERVICE_AGREEMENT_STATUS_CONFIG}
					defaultStatus="pending"
					status={agreement.status}
				/>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (_agreement) => (
				<div data-no-row-click>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<FileText className="mr-2 size-4" />
								View Contract
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Calendar className="mr-2 size-4" />
								Renew Agreement
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-destructive">
								<Trash2 className="mr-2 size-4" />
								Cancel Agreement
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Renew",
			icon: <Calendar className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Export",
			icon: <Download className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Archive",
			icon: <Archive className="h-4 w-4" />,
			variant: "destructive",
			onClick: (_selectedIds) => {},
		},
		{
			label: "Cancel",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
			variant: "destructive",
		},
	];

	const searchFilter = (agreement: ServiceAgreement, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			agreement.agreementNumber.toLowerCase().includes(searchStr) ||
			agreement.customer.toLowerCase().includes(searchStr) ||
			agreement.type.toLowerCase().includes(searchStr) ||
			agreement.status.toLowerCase().includes(searchStr)
		);
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={filteredAgreements}
			emptyIcon={<FileText className="mx-auto h-12 w-12 text-muted-foreground" />}
			emptyMessage="No service agreements found"
			enableSelection={true}
			entity="service_agreements"
			getHighlightClass={() => "bg-destructive/30 dark:bg-destructive/10"}
			getItemId={(agreement) => agreement.id}
			isArchived={(agreement) => Boolean(agreement.archived_at || agreement.deleted_at)}
			isHighlighted={(agreement) => agreement.status === "expired"}
			itemsPerPage={itemsPerPage}
			onRefresh={() => window.location.reload()}
			onRowClick={(agreement) => (window.location.href = `/dashboard/work/service-agreements/${agreement.id}`)}
			searchFilter={searchFilter}
			searchPlaceholder="Search agreements by number, customer, type, or status..."
			showArchived={archiveFilter !== "active"}
			showRefresh={false}
		/>
	);
}
