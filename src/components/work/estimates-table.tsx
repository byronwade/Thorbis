"use client";

import {
	Archive,
	Download,
	FileText,
	MoreHorizontal,
	Send,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { EstimateStatusBadge } from "@/components/ui/status-badge";
import {
	ClearFiltersButton,
	type FilterGroup,
	TableFilters,
} from "@/components/ui/table-filters";
import { formatCurrency } from "@/lib/formatters";

export type Estimate = {
	id: string;
	estimateNumber: string;
	customer: string;
	project: string;
	date: string;
	validUntil: string;
	amount: number;
	status: "accepted" | "sent" | "draft" | "declined" | "expired";
	archived_at?: string | null;
	deleted_at?: string | null;
};

export function EstimatesTable({
	estimates,
	itemsPerPage = 50,
}: {
	estimates: Estimate[];
	itemsPerPage?: number;
}) {
	// Filter state
	const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
		Status: "all",
		Archive: "active",
	});

	const [isSingleArchiveOpen, setIsSingleArchiveOpen] = useState(false);
	const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
	const [isBulkSendDialogOpen, setIsBulkSendDialogOpen] = useState(false);
	const [estimateToArchive, setEstimateToArchive] = useState<string | null>(
		null,
	);
	const [selectedEstimateIds, setSelectedEstimateIds] = useState<Set<string>>(
		new Set(),
	);
	const [pendingSendIds, setPendingSendIds] = useState<Set<string>>(new Set());

	// Count estimates by status
	const statusCounts = useMemo(() => {
		const counts = {
			all: estimates.length,
			draft: 0,
			sent: 0,
			accepted: 0,
			declined: 0,
			expired: 0,
		};

		for (const estimate of estimates) {
			if (estimate.status === "draft") {
				counts.draft++;
			} else if (estimate.status === "sent") {
				counts.sent++;
			} else if (estimate.status === "accepted") {
				counts.accepted++;
			} else if (estimate.status === "declined") {
				counts.declined++;
			} else if (estimate.status === "expired") {
				counts.expired++;
			}
		}

		return counts;
	}, [estimates]);

	// Count by archive status
	const archiveCounts = useMemo(() => {
		let active = 0;
		let archived = 0;

		for (const estimate of estimates) {
			const isArchived = Boolean(estimate.archived_at || estimate.deleted_at);
			if (isArchived) {
				archived++;
			} else {
				active++;
			}
		}

		return { all: estimates.length, active, archived };
	}, [estimates]);

	// Define filter groups
	const filterGroups: FilterGroup[] = [
		{
			label: "Status",
			options: [
				{ label: "All Statuses", value: "all", count: statusCounts.all },
				{ label: "Draft", value: "draft", count: statusCounts.draft },
				{ label: "Sent", value: "sent", count: statusCounts.sent },
				{ label: "Accepted", value: "accepted", count: statusCounts.accepted },
				{ label: "Declined", value: "declined", count: statusCounts.declined },
				{ label: "Expired", value: "expired", count: statusCounts.expired },
			],
		},
		{
			label: "Archive",
			options: [
				{ label: "Active Only", value: "active", count: archiveCounts.active },
				{ label: "All Estimates", value: "all", count: archiveCounts.all },
				{
					label: "Archived Only",
					value: "archived",
					count: archiveCounts.archived,
				},
			],
		},
	];

	// Filter estimates based on active filters
	const filteredEstimates = useMemo(() => {
		return estimates.filter((estimate) => {
			// Filter by status
			const statusFilter = activeFilters.Status;
			if (statusFilter !== "all" && estimate.status !== statusFilter) {
				return false;
			}

			// Filter by archive status
			const archiveFilter = activeFilters.Archive;
			const isArchived = Boolean(estimate.archived_at || estimate.deleted_at);
			if (archiveFilter === "active" && isArchived) {
				return false;
			}
			if (archiveFilter === "archived" && !isArchived) {
				return false;
			}

			return true;
		});
	}, [estimates, activeFilters]);

	// Handle filter changes
	const handleFilterChange = (filterGroup: string, value: string) => {
		setActiveFilters((prev) => ({ ...prev, [filterGroup]: value }));
	};

	// Clear all filters
	const handleClearFilters = () => {
		setActiveFilters({
			Status: "all",
			Archive: "active",
		});
	};

	// Count active filters (excluding defaults)
	const activeFilterCount =
		(activeFilters.Status !== "all" ? 1 : 0) +
		(activeFilters.Archive !== "active" ? 1 : 0);

	const columns: ColumnDef<Estimate>[] = [
		{
			key: "estimateNumber",
			header: "Estimate #",
			width: "w-36",
			shrink: true,
			sortable: true,
			hideable: false,
			sortFn: (a, b) => a.estimateNumber.localeCompare(b.estimateNumber),
			render: (estimate) => (
				<Link
					className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
					href={`/dashboard/work/estimates/${estimate.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{estimate.estimateNumber}
				</Link>
			),
		},
		{
			key: "customer",
			header: "Customer",
			width: "w-48",
			shrink: true,
			sortable: true,
			hideable: false, // CRITICAL: Always show customer for quick identification
			sortFn: (a, b) => a.customer.localeCompare(b.customer),
			render: (estimate) => (
				<span className="font-medium text-foreground text-sm">
					{estimate.customer}
				</span>
			),
		},
		{
			key: "project",
			header: "Project",
			width: "flex-1",
			sortable: true,
			hideable: false,
			sortFn: (a, b) => a.project.localeCompare(b.project),
			render: (estimate) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/estimates/${estimate.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<span className="font-medium text-foreground text-sm leading-tight hover:underline">
						{estimate.project}
					</span>
				</Link>
			),
		},
		{
			key: "date",
			header: "Date",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			sortable: true,
			hideable: true,
			sortFn: (a, b) => a.date.localeCompare(b.date),
			render: (estimate) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{estimate.date}
				</span>
			),
		},
		{
			key: "validUntil",
			header: "Valid Until",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			sortable: true,
			hideable: true,
			sortFn: (a, b) => a.validUntil.localeCompare(b.validUntil),
			render: (estimate) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{estimate.validUntil}
				</span>
			),
		},
		{
			key: "amount",
			header: "Amount",
			width: "w-32",
			shrink: true,
			align: "right",
			sortable: true,
			hideable: false, // CRITICAL: Financial data essential
			sortFn: (a, b) => a.amount - b.amount,
			render: (estimate) => (
				<span className="font-semibold tabular-nums">
					{formatCurrency(estimate.amount, { decimals: 2 })}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			sortable: true,
			hideable: false, // CRITICAL: Status key for action items
			sortFn: (a, b) => a.status.localeCompare(b.status),
			render: (estimate) => <EstimateStatusBadge status={estimate.status} />,
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (estimate) => (
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
								<Send className="mr-2 size-4" />
								Send to Customer
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Download className="mr-2 size-4" />
								Download PDF
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									setEstimateToArchive(estimate.id);
									setIsSingleArchiveOpen(true);
								}}
							>
								<Archive className="mr-2 size-4" />
								Archive Estimate
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	// Loading state for bulk actions
	const [isBulkSending, setIsBulkSending] = useState(false);

	const bulkActions: BulkAction[] = [
		{
			label: "Send",
			icon: <Send className="h-4 w-4" />,
			onClick: async (selectedIds) => {
				if (isBulkSending) {
					return;
				}

				const estimatesToSend = filteredEstimates.filter((est) =>
					selectedIds.has(est.id),
				);

				if (estimatesToSend.length === 0) {
					const { toast } = await import("sonner");
					toast.error("No estimates selected");
					return;
				}

				// Open confirmation dialog
				setPendingSendIds(selectedIds);
				setIsBulkSendDialogOpen(true);
			},
		},
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			onClick: async (selectedIds) => {
				setSelectedEstimateIds(selectedIds);
				setIsBulkArchiveOpen(true);
			},
			variant: "destructive",
		},
	];

	const searchFilter = (estimate: Estimate, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			estimate.estimateNumber.toLowerCase().includes(searchStr) ||
			estimate.customer.toLowerCase().includes(searchStr) ||
			estimate.project.toLowerCase().includes(searchStr) ||
			estimate.status.toLowerCase().includes(searchStr)
		);
	};

	return (
		<>
			<FullWidthDataTable
				bulkActions={bulkActions}
				columns={columns}
				data={filteredEstimates}
				emptyIcon={
					<FileText className="mx-auto h-12 w-12 text-muted-foreground" />
				}
				emptyMessage="No estimates found"
				enableSelection={true}
				entity="estimates"
				getHighlightClass={() => "bg-success/30 dark:bg-success/10"}
				getItemId={(estimate) => estimate.id}
				isArchived={(est) => Boolean(est.archived_at || est.deleted_at)}
				isHighlighted={(estimate) => estimate.status === "accepted"}
				itemsPerPage={itemsPerPage}
				onRefresh={() => window.location.reload()}
				onRowClick={(estimate) =>
					(window.location.href = `/dashboard/work/estimates/${estimate.id}`)
				}
				searchFilter={searchFilter}
				searchPlaceholder="Search estimates by number, customer, project, or status..."
				showArchived={activeFilters.Archive !== "active"}
				showRefresh={false}
				toolbarActions={
					<>
						<TableFilters
							activeFilters={activeFilters}
							filters={filterGroups}
							onFilterChange={handleFilterChange}
						/>
						<ClearFiltersButton
							count={activeFilterCount}
							onClear={handleClearFilters}
						/>
					</>
				}
			/>

			{/* Single Estimate Archive Dialog */}
			<AlertDialog
				onOpenChange={setIsSingleArchiveOpen}
				open={isSingleArchiveOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Estimate?</AlertDialogTitle>
						<AlertDialogDescription>
							This estimate will be archived and can be restored within 90 days.
							After 90 days, it will be permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								if (estimateToArchive) {
									const { archiveEstimate } = await import(
										"@/actions/estimates"
									);
									await archiveEstimate(estimateToArchive);
									window.location.reload();
								}
							}}
						>
							Archive
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Bulk Archive Dialog */}
			<AlertDialog onOpenChange={setIsBulkArchiveOpen} open={isBulkArchiveOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Archive {selectedEstimateIds.size} Estimate(s)?
						</AlertDialogTitle>
						<AlertDialogDescription>
							These estimates will be archived and can be restored within 90
							days. After 90 days, they will be permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								const { archiveEstimate } = await import("@/actions/estimates");
								for (const estimateId of selectedEstimateIds) {
									await archiveEstimate(estimateId);
								}
								window.location.reload();
							}}
						>
							Archive All
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Bulk Send Confirmation Dialog */}
			<AlertDialog
				onOpenChange={setIsBulkSendDialogOpen}
				open={isBulkSendDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Send {pendingSendIds.size} Estimate(s)?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will send {pendingSendIds.size} estimate
							{pendingSendIds.size !== 1 ? "s" : ""} via email to your
							customers.
							<br />
							<br />
							<strong>Estimated time:</strong>{" "}
							{Math.ceil(pendingSendIds.size * 0.5)} second
							{Math.ceil(pendingSendIds.size * 0.5) !== 1 ? "s" : ""}
							<br />
							<br />
							Note: Only estimates with customer email addresses will be sent.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								setIsBulkSendDialogOpen(false);
								setIsBulkSending(true);

								// Import sync store
								const { useSyncStore } = await import(
									"@/lib/stores/sync-store"
								);
								const { startOperation, completeOperation } =
									useSyncStore.getState();

								const { toast } = await import("sonner");
								const estimateIds = Array.from(pendingSendIds);
								const count = estimateIds.length;

								// Start sync operation
								const operationId = startOperation({
									type: "bulk_send_estimates",
									title: `Sending ${count} estimate${count !== 1 ? "s" : ""}`,
									description: "Preparing emails...",
									total: count,
									current: 0,
								});

								try {
									const { bulkSendEstimates } = await import(
										"@/actions/bulk-communications"
									);

									// Send estimates
									const result = await bulkSendEstimates(estimateIds, {
										batchSize: 10,
										batchDelay: 1000,
									});

									// Complete operation
									if (result.success || (result.results?.successful ?? 0) > 0) {
										completeOperation(operationId, true);
										toast.success(result.message);
									} else {
										completeOperation(
											operationId,
											false,
											result.error || "Failed to send estimates",
										);
										toast.error(result.error || "Failed to send estimates");
									}

									// Reload if any succeeded
									if ((result.results?.successful ?? 0) > 0) {
										window.location.reload();
									}
								} catch (error) {
									completeOperation(
										operationId,
										false,
										error instanceof Error
											? error.message
											: "Failed to send estimates",
									);
									toast.error(
										error instanceof Error
											? error.message
											: "Failed to send estimates",
									);
								} finally {
									setIsBulkSending(false);
									setPendingSendIds(new Set());
								}
							}}
						>
							Send Estimates
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
