"use client";

/**
 * InvoicesTable Component
 * Full-width Gmail-style table for displaying invoices
 */

import { Archive, Download, FileText, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { RowActionsDropdown } from "@/components/ui/row-actions-dropdown";
import { InvoiceStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/formatters";
import { useInvoiceFiltersStore } from "@/lib/stores/invoice-filters-store";

export type Invoice = {
	id: string;
	invoiceNumber: string;
	customer: string;
	date: string;
	dueDate: string;
	amount: number;
	status: "paid" | "pending" | "draft" | "overdue";
	archived_at?: string | null;
	deleted_at?: string | null;
};

type InvoicesTableProps = {
	invoices: Invoice[];
	itemsPerPage?: number;
	showRefresh?: boolean;
	enableVirtualization?: boolean | "auto";
	totalCount?: number;
	currentPage?: number;
};

export function InvoicesTable({
	invoices,
	itemsPerPage = 50,
	showRefresh = false,
	enableVirtualization = "auto",
	totalCount,
	currentPage = 1,
}: InvoicesTableProps) {
	// Get filters from global store
	const filters = useInvoiceFiltersStore((state) => state.filters);

	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [itemToArchive, setItemToArchive] = useState<string | null>(null);
	const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
	const [isBulkSendDialogOpen, setIsBulkSendDialogOpen] = useState(false);
	const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
		new Set(),
	);
	const [pendingSendIds, setPendingSendIds] = useState<Set<string>>(new Set());

	// Apply filters from store
	const filteredInvoices = useMemo(() => {
		let result = invoices;

		// 1. Filter by archive status
		if (filters.archiveStatus === "active") {
			result = result.filter((inv) => !(inv.archived_at || inv.deleted_at));
		} else if (filters.archiveStatus === "archived") {
			result = result.filter((inv) =>
				Boolean(inv.archived_at || inv.deleted_at),
			);
		}
		// "all" = no archive filtering

		// 2. Filter by status
		if (filters.status && filters.status !== "all") {
			result = result.filter((inv) => inv.status === filters.status);
		}

		// 3. Filter by amount range
		if (filters.amountMin) {
			const min = Number(filters.amountMin) * 100; // Convert to cents
			result = result.filter((inv) => inv.amount >= min);
		}
		if (filters.amountMax) {
			const max = Number(filters.amountMax) * 100; // Convert to cents
			result = result.filter((inv) => inv.amount <= max);
		}

		// 4. Filter by customer name
		if (filters.customerName) {
			const search = filters.customerName.toLowerCase();
			result = result.filter((inv) =>
				inv.customer.toLowerCase().includes(search),
			);
		}

		// 5. Filter by invoice number
		if (filters.invoiceNumber) {
			const search = filters.invoiceNumber.toLowerCase();
			result = result.filter((inv) =>
				inv.invoiceNumber.toLowerCase().includes(search),
			);
		}

		return result;
	}, [invoices, filters]);

	// Determine if we're showing archived items
	const showingArchived =
		filters.archiveStatus === "archived" || filters.archiveStatus === "all";

	const columns: ColumnDef<Invoice>[] = [
		{
			key: "invoiceNumber",
			header: "Invoice #",
			width: "w-36",
			shrink: true,
			sortable: true,
			render: (invoice) => (
				<Link
					className="text-foreground hover:text-primary text-sm font-medium transition-colors hover:underline"
					href={`/dashboard/work/invoices/${invoice.id}`}
					prefetch={false}
					onClick={(e) => e.stopPropagation()}
				>
					{invoice.invoiceNumber}
				</Link>
			),
		},
		{
			key: "customer",
			header: "Customer",
			width: "flex-1",
			sortable: true,
			hideable: false, // CRITICAL: Always show customer for quick identification
			render: (invoice) => (
				<Link
					className="block"
					href={`/dashboard/work/invoices/${invoice.id}`}
					prefetch={false}
					onClick={(e) => e.stopPropagation()}
				>
					<span className="text-foreground text-sm font-medium hover:underline">
						{invoice.customer}
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
			render: (invoice) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{invoice.date}
				</span>
			),
		},
		{
			key: "dueDate",
			header: "Due Date",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			sortable: true,
			hideable: false, // CRITICAL: Due dates are essential for AR management
			render: (invoice) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{invoice.dueDate}
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
			hideable: false, // CRITICAL: Financial data essential for decision-making
			render: (invoice) => (
				<span className="font-semibold tabular-nums">
					{formatCurrency(invoice.amount, { decimals: 2 })}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			sortable: true,
			hideable: false, // CRITICAL: Status is key for action items
			render: (invoice) => <InvoiceStatusBadge status={invoice.status} />,
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (invoice) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Invoice",
							icon: FileText,
							href: `/dashboard/work/invoices/${invoice.id}`,
						},
						{
							label: "Send to Customer",
							icon: Send,
							onClick: () => {
								// TODO: Implement send functionality
							},
						},
						{
							label: "Download PDF",
							icon: Download,
							onClick: () => {
								// TODO: Implement download functionality
							},
						},
						// Only show archive option for non-paid invoices
						...(invoice.status !== "paid"
							? [
									{
										label: "Archive Invoice",
										icon: Archive,
										variant: "destructive" as const,
										separatorBefore: true,
										onClick: () => {
											setItemToArchive(invoice.id);
											setIsArchiveDialogOpen(true);
										},
									},
								]
							: []),
					]}
				/>
			),
		},
	];

	// Loading state for bulk actions
	const [isBulkSending, setIsBulkSending] = useState(false);

	// Bulk actions
	const bulkActions: BulkAction[] = [
		{
			label: "Send",
			icon: <Send className="h-4 w-4" />,
			onClick: async (selectedIds) => {
				if (isBulkSending) {
					return;
				}

				const invoicesToSend = filteredInvoices.filter((inv) =>
					selectedIds.has(inv.id),
				);

				if (invoicesToSend.length === 0) {
					toast.error("No invoices selected");
					return;
				}

				// Open confirmation dialog
				setPendingSendIds(selectedIds);
				setIsBulkSendDialogOpen(true);
			},
		},
		{
			label: "Download",
			icon: <Download className="h-4 w-4" />,
			onClick: () => {
				toast.info("Download functionality coming soon");
			},
		},
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			onClick: (selectedIds) => {
				// Check if all selected are paid invoices
				const hasNonPaidInvoices = filteredInvoices.some(
					(inv) => selectedIds.has(inv.id) && inv.status !== "paid",
				);

				if (!hasNonPaidInvoices) {
					toast.error("All selected invoices are paid and cannot be archived");
					return;
				}

				// Open dialog with all selected IDs - the server action will filter out paid ones
				setSelectedItemIds(selectedIds);
				setIsBulkArchiveOpen(true);
			},
			variant: "destructive",
		},
	];

	// Search filter function
	const searchFilter = (invoice: Invoice, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			invoice.invoiceNumber.toLowerCase().includes(searchStr) ||
			invoice.customer.toLowerCase().includes(searchStr) ||
			invoice.status.toLowerCase().includes(searchStr)
		);
	};

	const handleRowClick = (invoice: Invoice) => {
		window.location.href = `/dashboard/work/invoices/${invoice.id}`;
	};

	// Highlight overdue invoices
	const isHighlighted = (invoice: Invoice) => invoice.status === "overdue";

	return (
		<>
			<FullWidthDataTable
				bulkActions={bulkActions}
				columns={columns}
				data={filteredInvoices}
				emptyAction={
					<Button
						onClick={() =>
							(window.location.href = "/dashboard/work/invoices/new")
						}
						size="sm"
					>
						<Plus className="mr-2 size-4" />
						Create Invoice
					</Button>
				}
				emptyIcon={<FileText className="text-muted-foreground h-8 w-8" />}
				emptyMessage="No invoices found"
				enableSelection={true}
				enableVirtualization={enableVirtualization}
				entity="invoices"
				getHighlightClass={() => "bg-destructive/30 dark:bg-destructive/10"}
				getItemId={(invoice) => invoice.id}
				isArchived={(invoice) => !!(invoice.archived_at || invoice.deleted_at)}
				isHighlighted={isHighlighted}
				itemsPerPage={itemsPerPage}
				totalCount={totalCount ?? filteredInvoices.length}
				currentPageFromServer={currentPage}
				serverPagination
				onRefresh={() => window.location.reload()}
				onRowClick={handleRowClick}
				searchFilter={searchFilter}
				searchPlaceholder="Search invoices by number, customer, or status..."
				showArchived={showingArchived}
				showRefresh={showRefresh}
				toolbarActions={undefined}
			/>

			{/* Archive Single Invoice Dialog */}
			<AlertDialog
				onOpenChange={setIsArchiveDialogOpen}
				open={isArchiveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Invoice?</AlertDialogTitle>
						<AlertDialogDescription>
							This invoice will be archived and can be restored within 90 days.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								if (itemToArchive) {
									try {
										const { archiveInvoice } = await import(
											"@/actions/invoices"
										);
										const result = await archiveInvoice(itemToArchive);
										if (result.success) {
											toast.success("Invoice archived successfully");
											window.location.reload();
										} else {
											toast.error(result.error || "Failed to archive invoice");
										}
									} catch {
										toast.error("Failed to archive invoice");
									}
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
							Archive {selectedItemIds.size} Invoice(s)?
						</AlertDialogTitle>
						<AlertDialogDescription>
							{selectedItemIds.size} invoice(s) will be archived and can be
							restored within 90 days. Paid invoices will be automatically
							skipped.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								const loadingToast = toast.loading(
									`Archiving ${selectedItemIds.size} invoice(s)...`,
								);

								try {
									const { bulkArchiveInvoices } = await import(
										"@/actions/bulk-archive"
									);
									const result = await bulkArchiveInvoices(
										Array.from(selectedItemIds),
									);

									toast.dismiss(loadingToast);

									if (result.success && result.data) {
										const { successful, failed, skipped } = result.data;

										if (successful > 0) {
											toast.success(result.message || "Invoices archived");
											window.location.reload();
										} else if (skipped > 0 && failed === 0) {
											toast.warning(
												`${skipped} paid invoice${skipped !== 1 ? "s" : ""} cannot be archived`,
											);
										} else {
											toast.error(
												result.message || "Failed to archive invoices",
											);
										}
									} else {
										toast.error("Failed to archive invoices");
									}
								} catch (error) {
									toast.dismiss(loadingToast);
									toast.error(
										error instanceof Error
											? error.message
											: "Failed to archive invoices",
									);
								}
							}}
						>
							Archive
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
							Send {pendingSendIds.size} Invoice(s)?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will send {pendingSendIds.size} invoice
							{pendingSendIds.size !== 1 ? "s" : ""} via email to your
							customers.
							<br />
							<br />
							<strong>Estimated time:</strong>{" "}
							{Math.ceil(pendingSendIds.size * 0.5)} second
							{Math.ceil(pendingSendIds.size * 0.5) !== 1 ? "s" : ""}
							<br />
							<br />
							Note: Only invoices with customer email addresses will be sent.
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
								const { startOperation, updateOperation, completeOperation } =
									useSyncStore.getState();

								const invoiceIds = Array.from(pendingSendIds);
								const count = invoiceIds.length;

								// Start sync operation
								const operationId = startOperation({
									type: "bulk_send_invoices",
									title: `Sending ${count} invoice${count !== 1 ? "s" : ""}`,
									description: "Preparing emails with payment links...",
									total: count,
									current: 0,
								});

								try {
									const { bulkSendInvoices } = await import(
										"@/actions/bulk-communications"
									);

									// Send invoices
									const result = await bulkSendInvoices(invoiceIds, {
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
											result.error || "Failed to send invoices",
										);
										toast.error(result.error || "Failed to send invoices");
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
											: "Failed to send invoices",
									);
									toast.error(
										error instanceof Error
											? error.message
											: "Failed to send invoices",
									);
								} finally {
									setIsBulkSending(false);
									setPendingSendIds(new Set());
								}
							}}
						>
							Send Invoices
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
