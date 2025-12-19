/**
 * Payments Table Configuration
 *
 * Configuration for GenericWorkTable to display payments.
 * Replaces the standalone payments-table.tsx component.
 */

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@/components/ui/full-width-datatable";
import { cn } from "@/lib/utils";
import { Archive, CreditCard, Download, Edit, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type {
	GenericWorkTableConfig,
	RowActionHandlers,
} from "../types";

// =============================================================================
// TYPE DEFINITION
// =============================================================================

export type Payment = {
	id: string;
	payment_number: string;
	amount: number;
	payment_method: string;
	status: string;
	processed_at?: string | Date | null;
	customer?: {
		first_name?: string | null;
		last_name?: string | null;
		display_name?: string | null;
	} | null;
	invoice_id?: string | null;
	job_id?: string | null;
	archived_at?: string | null;
	deleted_at?: string | null;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatCurrency(cents: number | null): string {
	if (cents === null) return "$0.00";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

function formatDate(date: Date | string | null | undefined): string {
	if (!date) return "—";
	const d = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(d);
}

function getCustomerName(payment: Payment): string {
	if (payment.customer?.display_name) return payment.customer.display_name;
	if (payment.customer?.first_name || payment.customer?.last_name) {
		return `${payment.customer.first_name || ""} ${payment.customer.last_name || ""}`.trim();
	}
	return "Unknown Customer";
}

function getPaymentMethodLabel(method: string): string {
	const labels: Record<string, string> = {
		cash: "Cash",
		check: "Check",
		credit_card: "Credit Card",
		debit_card: "Debit Card",
		ach: "ACH",
		wire: "Wire Transfer",
		venmo: "Venmo",
		paypal: "PayPal",
		other: "Other",
	};
	return labels[method] || method;
}

// =============================================================================
// STATUS BADGE
// =============================================================================

function PaymentStatusBadge({ status }: { status: string }) {
	const variants: Record<string, { className: string; label: string }> = {
		pending: {
			className:
				"border-warning bg-warning text-warning hover:bg-warning dark:border-warning dark:bg-warning/50 dark:text-warning",
			label: "Pending",
		},
		processing: {
			className:
				"border-primary bg-primary text-primary hover:bg-primary dark:border-primary dark:bg-primary/50 dark:text-primary",
			label: "Processing",
		},
		completed: {
			className: "border-success/50 bg-success text-white hover:bg-success",
			label: "Completed",
		},
		failed: {
			className: "border-destructive/50 bg-destructive text-white hover:bg-destructive",
			label: "Failed",
		},
		refunded: {
			className: "border-warning/50 bg-warning text-white hover:bg-warning",
			label: "Refunded",
		},
		partially_refunded: {
			className:
				"border-warning bg-warning text-warning hover:bg-warning dark:border-warning dark:bg-warning/50 dark:text-warning",
			label: "Partially Refunded",
		},
		cancelled: {
			className: "border-border/50 bg-secondary text-white hover:bg-accent",
			label: "Cancelled",
		},
	};

	const config = variants[status] || {
		className: "border-border/50 bg-background text-muted-foreground",
		label: status,
	};

	return (
		<Badge className={cn("text-xs font-medium", config.className)} variant="outline">
			{config.label}
		</Badge>
	);
}

// =============================================================================
// COLUMN DEFINITIONS
// =============================================================================

const columns: ColumnDef<Payment>[] = [
	{
		key: "payment_number",
		header: "Payment #",
		width: "w-36",
		shrink: true,
		sortable: true,
		render: (payment) => (
			<Link
				className="text-foreground hover:text-primary text-sm font-medium transition-colors hover:underline"
				href={`/dashboard/work/payments/${payment.id}`}
				onClick={(e) => e.stopPropagation()}
			>
				{payment.payment_number}
			</Link>
		),
	},
	{
		key: "customer",
		header: "Customer",
		width: "w-48",
		shrink: true,
		sortable: true,
		hideable: false, // CRITICAL: Always show customer
		render: (payment) => (
			<span className="text-muted-foreground text-sm">{getCustomerName(payment)}</span>
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
		render: (payment) => (
			<span className="font-semibold tabular-nums">{formatCurrency(payment.amount)}</span>
		),
	},
	{
		key: "payment_method",
		header: "Method",
		width: "w-32",
		shrink: true,
		hideOnMobile: true,
		sortable: true,
		hideable: true,
		render: (payment) => (
			<span className="text-muted-foreground text-sm">
				{getPaymentMethodLabel(payment.payment_method)}
			</span>
		),
	},
	{
		key: "status",
		header: "Status",
		width: "w-32",
		shrink: true,
		sortable: true,
		hideable: false, // CRITICAL: Status key for action items
		render: (payment) => <PaymentStatusBadge status={payment.status} />,
	},
	{
		key: "processed_at",
		header: "Date",
		width: "w-32",
		shrink: true,
		sortable: true,
		hideOnMobile: true,
		hideable: true,
		render: (payment) => (
			<span className="text-muted-foreground text-sm tabular-nums">
				{formatDate(payment.processed_at)}
			</span>
		),
	},
];

// =============================================================================
// ROW ACTIONS
// =============================================================================

function buildRowActions(payment: Payment, handlers: RowActionHandlers) {
	const isArchived = Boolean(payment.archived_at || payment.deleted_at);

	if (isArchived) {
		return [
			{
				label: "View Details",
				icon: Eye,
				href: `/dashboard/work/payments/${payment.id}`,
			},
			{
				label: "Restore",
				icon: RotateCcw,
				onClick: () => handlers.openRestoreDialog(payment.id),
				separatorBefore: true,
			},
		];
	}

	return [
		{
			label: "View Details",
			icon: Eye,
			href: `/dashboard/work/payments/${payment.id}`,
		},
		{
			label: "Edit Payment",
			icon: Edit,
			href: `/dashboard/work/payments/${payment.id}/edit`,
		},
		{
			label: "Archive",
			icon: Archive,
			onClick: () => handlers.openArchiveDialog(payment.id),
			variant: "destructive" as const,
			separatorBefore: true,
		},
	];
}

// =============================================================================
// BULK ACTIONS
// =============================================================================

const bulkActions = [
	{
		label: "Export",
		icon: Download,
		onClick: async (selectedIds: Set<string>, items: Payment[]) => {
			const selectedPayments = items.filter((p) => selectedIds.has(p.id));
			const csvContent = [
				["Payment #", "Customer", "Amount", "Method", "Status", "Date"].join(","),
				...selectedPayments.map((p) =>
					[
						p.payment_number,
						getCustomerName(p),
						formatCurrency(p.amount),
						getPaymentMethodLabel(p.payment_method),
						p.status,
						formatDate(p.processed_at),
					].join(",")
				),
			].join("\n");

			const blob = new Blob([csvContent], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `payments-export-${new Date().toISOString().split("T")[0]}.csv`;
			a.click();
			URL.revokeObjectURL(url);

			toast.success(`Exported ${selectedIds.size} payment${selectedIds.size > 1 ? "s" : ""}`);
		},
	},
];

// =============================================================================
// CONFIGURATION EXPORT
// =============================================================================

export const paymentsTableConfig: GenericWorkTableConfig<Payment> = {
	entityType: "payments",
	entityLabel: {
		singular: "Payment",
		plural: "Payments",
	},
	columns,
	rowActions: buildRowActions,
	bulkActions,
	archive: {
		storeKey: "payments",
		action: async (id: string) => {
			const { archivePayment } = await import("@/actions/payments");
			return archivePayment(id);
		},
		restoreAction: async (id: string) => {
			const { restorePayment } = await import("@/actions/payments");
			return restorePayment(id);
		},
	},
	emptyState: {
		icon: CreditCard,
		message: "No payments found",
		actionLabel: "Record Payment",
		actionHref: "/dashboard/work/payments/new",
	},
	navigation: {
		getDetailUrl: (payment) => `/dashboard/work/payments/${payment.id}`,
		getEditUrl: (payment) => `/dashboard/work/payments/${payment.id}/edit`,
		createUrl: "/dashboard/work/payments/new",
	},
	search: {
		placeholder: "Search payments by number, customer, or method...",
		filter: (payment, query) => {
			const searchStr = query.toLowerCase();
			return (
				payment.payment_number.toLowerCase().includes(searchStr) ||
				payment.status.toLowerCase().includes(searchStr) ||
				payment.payment_method.toLowerCase().includes(searchStr) ||
				getCustomerName(payment).toLowerCase().includes(searchStr)
			);
		},
	},
	serverPagination: true,
	itemsPerPage: 50,
};
