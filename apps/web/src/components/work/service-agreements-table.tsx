"use client";

import {
	Archive,
	Calendar,
	Download,
	FileText,
	MoreHorizontal,
	Plus,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { archiveServiceAgreement } from "@/actions/service-agreements";
import { useArchiveDialog } from "@/components/ui/archive-dialog-manager";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { GenericStatusBadge } from "@/components/ui/generic-status-badge";
import { useTableActions } from "@/hooks/use-table-actions";
import { getRowHighlight } from "@/lib/datatable/rowHighlight";
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatCurrency } from "@/lib/formatters";
import { useArchiveStore } from "@/lib/stores/archive-store";

export type ServiceAgreement = {
	id: string;
	agreementNumber: string;
	customer: string;
	type:
		| "Service Level Agreement"
		| "Extended Warranty"
		| "Maintenance Contract"
		| "Support Contract";
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
		className:
			"bg-destructive text-destructive dark:bg-destructive/20 dark:text-destructive",
		label: "Expired",
	},
	cancelled: {
		className:
			"bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground",
		label: "Cancelled",
	},
} as const;

export function ServiceAgreementsTable({
	agreements,
	itemsPerPage = 50,
	currentPage = 1,
	totalCount,
}: {
	agreements: ServiceAgreement[];
	itemsPerPage?: number;
	currentPage?: number;
	totalCount?: number;
}) {
	const router = useRouter();

	// Archive filter state
	const archiveFilter = useArchiveStore(
		(state) => state.filters.service_agreements,
	);

	// Table actions hook
	const { handleRefresh } = useTableActions({
		entityType: "service_agreements",
	});

	// Archive dialog
	const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
		onConfirm: async (id) => {
			const result = await archiveServiceAgreement(id);
			if (result.success) {
				handleRefresh();
			}
		},
		title: "Archive Service Agreement?",
		description:
			"This service agreement will be archived and can be restored within 90 days.",
	});

	// Bulk archive state
	const [selectedAgreementIds, setSelectedAgreementIds] = useState<Set<string>>(
		new Set(),
	);

	// Bulk archive dialog
	const {
		openArchiveDialog: openBulkArchiveDialog,
		ArchiveDialogComponent: BulkArchiveDialogComponent,
	} = useArchiveDialog({
		onConfirm: async () => {
			let archived = 0;
			for (const id of selectedAgreementIds) {
				const result = await archiveServiceAgreement(id);
				if (result.success) {
					archived++;
				}
			}
			if (archived > 0) {
				handleRefresh();
			}
		},
		title: `Archive ${selectedAgreementIds.size} Service Agreement(s)?`,
		description: `${selectedAgreementIds.size} service agreement(s) will be archived and can be restored within 90 days.`,
	});

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
					className="text-foreground hover:text-primary text-xs font-medium transition-colors hover:underline"
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
					<div className="text-foreground truncate text-xs leading-tight font-medium hover:underline">
						{agreement.customer}
					</div>
					<div className="text-muted-foreground mt-0.5 truncate text-xs leading-tight">
						{agreement.type}
					</div>
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
			render: (agreement) => (
				<span className="text-muted-foreground text-xs tabular-nums">
					{agreement.startDate}
				</span>
			),
		},
		{
			key: "endDate",
			header: "End Date",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (agreement) => (
				<span className="text-muted-foreground text-xs tabular-nums">
					{agreement.endDate}
				</span>
			),
		},
		{
			key: "value",
			header: "Value",
			width: "w-32",
			shrink: true,
			align: "right",
			hideable: true,
			render: (agreement) => (
				<span className="font-semibold tabular-nums">
					{formatCurrency(agreement.value)}
				</span>
			),
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
			render: (agreement) => (
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
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									openArchiveDialog(agreement.id);
								}}
							>
								<Archive className="mr-2 size-4" />
								Archive Agreement
							</DropdownMenuItem>
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
			onClick: (selectedIds) => {
				toast.info(
					`Renew functionality for ${selectedIds.size} agreement${selectedIds.size > 1 ? "s" : ""} coming soon`,
				);
			},
		},
		{
			label: "Export",
			icon: <Download className="h-4 w-4" />,
			onClick: (selectedIds) => {
				// Export selected agreements as CSV
				const selectedAgreements = serviceAgreements.filter((a) =>
					selectedIds.has(a.id),
				);
				const csvContent = [
					[
						"Agreement #",
						"Customer",
						"Type",
						"Start Date",
						"End Date",
						"Value",
						"Status",
					].join(","),
					...selectedAgreements.map((a) =>
						[
							a.agreementNumber,
							`"${a.customer}"`,
							a.type,
							a.startDate,
							a.endDate,
							formatCurrency(a.value),
							a.status,
						].join(","),
					),
				].join("\n");
				const blob = new Blob([csvContent], { type: "text/csv" });
				const url = URL.createObjectURL(blob);
				const anchor = document.createElement("a");
				anchor.href = url;
				anchor.download = `service-agreements-export-${new Date().toISOString().split("T")[0]}.csv`;
				anchor.click();
				URL.revokeObjectURL(url);
				toast.success(
					`Exported ${selectedIds.size} agreement${selectedIds.size > 1 ? "s" : ""}`,
				);
			},
		},
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			variant: "destructive",
			onClick: async (selectedIds) => {
				setSelectedAgreementIds(selectedIds);
				openBulkArchiveDialog("");
			},
		},
		{
			label: "Cancel",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: (selectedIds) => {
				toast.info(
					`Cancel functionality for ${selectedIds.size} agreement${selectedIds.size > 1 ? "s" : ""} coming soon`,
				);
			},
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
		<>
			<FullWidthDataTable
				{...TablePresets.fullList()}
				bulkActions={bulkActions}
				columns={columns}
				data={filteredAgreements}
				emptyAction={
					<Button
						onClick={() =>
							(window.location.href = "/dashboard/work/service-agreements/new")
						}
						size="sm"
					>
						<Plus className="mr-2 size-4" />
						Create Service Agreement
					</Button>
				}
				emptyIcon={
					<FileText className="text-muted-foreground mx-auto h-12 w-12" />
				}
				emptyMessage="No service agreements found"
				entity="service_agreements"
				getHighlightClass={(agreement) =>
					getRowHighlight(agreement).highlightClass
				}
				getItemId={(agreement) => agreement.id}
				isArchived={(agreement) =>
					Boolean(agreement.archived_at || agreement.deleted_at)
				}
				isHighlighted={(agreement) => getRowHighlight(agreement).isHighlighted}
				currentPageFromServer={currentPage}
				serverPagination
				onRefresh={handleRefresh}
				onRowClick={(agreement) =>
					(window.location.href = `/dashboard/work/service-agreements/${agreement.id}`)
				}
				searchFilter={searchFilter}
				searchPlaceholder="Search agreements by number, customer, type, or status..."
				showArchived={archiveFilter !== "active"}
				showRefresh={false}
				totalCount={totalCount ?? filteredAgreements.length}
			/>

			<ArchiveDialogComponent />
			<BulkArchiveDialogComponent />
		</>
	);
}
