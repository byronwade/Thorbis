"use client";

import {
	Archive,
	Calendar,
	Download,
	FileText,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { archiveMaintenancePlan } from "@/actions/maintenance-plans";
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
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatCurrency } from "@/lib/formatters";
import { useArchiveStore } from "@/lib/stores/archive-store";

export type MaintenancePlan = {
	id: string;
	planName: string;
	customer: string;
	serviceType: string;
	frequency: "Monthly" | "Quarterly" | "Bi-Annual" | "Annual";
	nextVisit: string;
	monthlyFee: number;
	status: "active" | "pending" | "paused" | "cancelled";
	archived_at?: string | null;
	deleted_at?: string | null;
};

const MAINTENANCE_PLAN_STATUS_CONFIG = {
	active: {
		className: "bg-success hover:bg-success text-white",
		label: "Active",
	},
	pending: {
		className: "bg-warning text-warning dark:bg-warning/20 dark:text-warning",
		label: "Pending",
	},
	paused: {
		className:
			"bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground",
		label: "Paused",
	},
	cancelled: {
		className:
			"bg-destructive text-destructive dark:bg-destructive/20 dark:text-destructive",
		label: "Cancelled",
	},
} as const;

export function MaintenancePlansTable({
	plans,
	itemsPerPage = 50,
	currentPage = 1,
	totalCount,
}: {
	plans: MaintenancePlan[];
	itemsPerPage?: number;
	currentPage?: number;
	totalCount?: number;
}) {
	const router = useRouter();

	// Archive filter state
	const archiveFilter = useArchiveStore(
		(state) => state.filters.maintenance_plans,
	);

	// Table actions hook
	const { handleRefresh } = useTableActions({
		entityType: "maintenance_plans",
	});

	// Archive dialog
	const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
		onConfirm: async (id) => {
			const result = await archiveMaintenancePlan(id);
			if (result.success) {
				handleRefresh();
			}
		},
		title: "Archive Maintenance Plan?",
		description:
			"This maintenance plan will be archived and can be restored within 90 days.",
	});

	// Bulk archive state
	const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(
		new Set(),
	);

	// Bulk archive dialog
	const {
		openArchiveDialog: openBulkArchiveDialog,
		ArchiveDialogComponent: BulkArchiveDialogComponent,
	} = useArchiveDialog({
		onConfirm: async () => {
			let archived = 0;
			for (const id of selectedPlanIds) {
				const result = await archiveMaintenancePlan(id);
				if (result.success) {
					archived++;
				}
			}
			if (archived > 0) {
				handleRefresh();
			}
		},
		title: `Archive ${selectedPlanIds.size} Maintenance Plan(s)?`,
		description: `${selectedPlanIds.size} maintenance plan(s) will be archived and can be restored within 90 days.`,
	});

	// Filter plans based on archive status
	const filteredPlans = plans.filter((plan) => {
		const isArchived = Boolean(plan.archived_at || plan.deleted_at);
		if (archiveFilter === "active") {
			return !isArchived;
		}
		if (archiveFilter === "archived") {
			return isArchived;
		}
		return true; // "all"
	});

	const columns: ColumnDef<MaintenancePlan>[] = [
		{
			key: "planName",
			header: "Plan Name",
			width: "w-40",
			shrink: true,
			sortable: true,
			render: (plan) => (
				<Link
					className="text-foreground text-xs leading-tight font-medium hover:underline"
					href={`/dashboard/work/maintenance-plans/${plan.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{plan.planName}
				</Link>
			),
		},
		{
			key: "customer",
			header: "Customer",
			width: "flex-1",
			sortable: true,
			render: (plan) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/maintenance-plans/${plan.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="text-foreground truncate text-xs leading-tight font-medium hover:underline">
						{plan.customer}
					</div>
					<div className="text-muted-foreground mt-0.5 truncate text-xs leading-tight">
						{plan.serviceType}
					</div>
				</Link>
			),
		},
		{
			key: "frequency",
			header: "Frequency",
			width: "w-32",
			shrink: true,
			sortable: true,
			hideOnMobile: true,
			render: (plan) => (
				<span className="text-foreground text-xs">{plan.frequency}</span>
			),
		},
		{
			key: "nextVisit",
			header: "Next Visit",
			width: "w-32",
			shrink: true,
			sortable: true,
			hideOnMobile: true,
			render: (plan) => (
				<span className="text-muted-foreground text-xs tabular-nums">
					{plan.nextVisit}
				</span>
			),
		},
		{
			key: "monthlyFee",
			header: "Monthly Fee",
			width: "w-28",
			shrink: true,
			sortable: true,
			align: "right",
			render: (plan) => (
				<span className="font-semibold tabular-nums">
					{formatCurrency(plan.monthlyFee)}/mo
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			sortable: true,
			render: (plan) => (
				<GenericStatusBadge
					config={MAINTENANCE_PLAN_STATUS_CONFIG}
					defaultStatus="pending"
					status={plan.status}
				/>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (_plan) => (
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
								<Calendar className="mr-2 size-4" />
								Schedule Visit
							</DropdownMenuItem>
							<DropdownMenuItem>
								<FileText className="mr-2 size-4" />
								View Contract
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									openArchiveDialog(plan.id);
								}}
							>
								<Archive className="mr-2 size-4" />
								Archive Plan
							</DropdownMenuItem>
							<DropdownMenuItem className="text-destructive">
								<Trash2 className="mr-2 size-4" />
								Cancel Plan
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Schedule Visits",
			icon: <Calendar className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Export",
			icon: <Download className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			variant: "destructive",
			onClick: async (selectedIds) => {
				setSelectedPlanIds(selectedIds);
				openBulkArchiveDialog("");
			},
		},
		{
			label: "Cancel",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
			variant: "destructive",
		},
	];

	const searchFilter = (plan: MaintenancePlan, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			plan.planName.toLowerCase().includes(searchStr) ||
			plan.customer.toLowerCase().includes(searchStr) ||
			plan.serviceType.toLowerCase().includes(searchStr) ||
			plan.frequency.toLowerCase().includes(searchStr) ||
			plan.status.toLowerCase().includes(searchStr)
		);
	};

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.fullList()}
				bulkActions={bulkActions}
				columns={columns}
				data={filteredPlans}
				emptyIcon={
					<Calendar className="text-muted-foreground mx-auto h-12 w-12" />
				}
				emptyMessage="No maintenance plans found"
				entity="maintenance_plans"
				getHighlightClass={() => "bg-success/30 dark:bg-success/10"}
				getItemId={(plan) => plan.id}
				isArchived={(plan) => Boolean(plan.archived_at || plan.deleted_at)}
				isHighlighted={(plan) => plan.status === "active"}
				currentPageFromServer={currentPage}
				serverPagination
				onRefresh={handleRefresh}
				onRowClick={(plan) =>
					(window.location.href = `/dashboard/work/maintenance-plans/${plan.id}`)
				}
				searchFilter={searchFilter}
				searchPlaceholder="Search plans by name, customer, service type, frequency, or status..."
				showArchived={archiveFilter !== "active"}
				showRefresh={false}
				totalCount={totalCount ?? filteredPlans.length}
			/>

			<ArchiveDialogComponent />
			<BulkArchiveDialogComponent />
		</>
	);
}
