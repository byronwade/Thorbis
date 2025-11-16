/**
 * Invoice Progress Payments - Full Width Datatable in Collapsible Card
 *
 * Displays progress/milestone payments with full datatable features:
 * - Collapsible card wrapper (like customer page)
 * - Search functionality
 * - Select all / bulk actions
 * - Pagination
 * - Refresh
 * - Full-width layout
 */

"use client";

import {
	Check,
	ChevronDown,
	ChevronRight,
	Clock,
	DollarSign,
	Plus,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";

type ProgressPayment = {
	id: string;
	description: string;
	amount: number;
	status: "paid" | "pending";
	paidDate: string | null;
};

type InvoiceProgressPaymentsProps = {
	invoice: {
		id: string;
		total_amount: number;
	};
};

export function InvoiceProgressPayments({
	invoice,
}: InvoiceProgressPaymentsProps) {
	const [isOpen, setIsOpen] = useState(true);

	// Load state from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("invoice-progress-payments-open");
		if (saved !== null) {
			setIsOpen(saved === "true");
		}
	}, []);

	// Save state to localStorage
	const toggleOpen = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		localStorage.setItem("invoice-progress-payments-open", String(newState));
	};

	// Format currency
	const formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);

	// Progress payments (mock data - replace with real data)
	const progressPayments: ProgressPayment[] = [
		{
			id: "1",
			description: "Deposit (50%)",
			amount: invoice.total_amount * 0.5,
			status: "paid",
			paidDate: new Date().toISOString(),
		},
		{
			id: "2",
			description: "Final Payment (50%)",
			amount: invoice.total_amount * 0.5,
			status: "pending",
			paidDate: null,
		},
	];

	// Define columns
	const columns: ColumnDef<ProgressPayment>[] = [
		{
			key: "description",
			header: "Description",
			render: (payment) => (
				<div className="font-medium">{payment.description}</div>
			),
			width: "flex-1",
		},
		{
			key: "amount",
			header: "Amount",
			render: (payment) => (
				<div className="font-medium tabular-nums">
					{formatCurrency(payment.amount)}
				</div>
			),
			width: "w-40",
			align: "right",
		},
		{
			key: "status",
			header: "Status",
			render: (payment) =>
				payment.status === "paid" ? (
					<Badge className="gap-1" variant="default">
						<Check className="h-3 w-3" />
						Paid
					</Badge>
				) : (
					<Badge className="gap-1" variant="outline">
						<Clock className="h-3 w-3" />
						Pending
					</Badge>
				),
			width: "w-32",
		},
		{
			key: "paidDate",
			header: "Paid Date",
			render: (payment) => (
				<div className="text-muted-foreground tabular-nums">
					{payment.paidDate
						? new Date(payment.paidDate).toLocaleDateString("en-US", {
								month: "numeric",
								day: "numeric",
								year: "numeric",
							})
						: "-"}
				</div>
			),
			width: "w-32",
		},
	];

	// Bulk actions
	const bulkActions = [
		{
			label: "Mark as Paid",
			icon: <Check className="h-4 w-4" />,
			onClick: (ids: Set<string>) => {
				toast.success(`Marked ${ids.size} payment(s) as paid`);
			},
		},
		{
			label: "Delete",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: (ids: Set<string>) => {
				toast.success(`Deleted ${ids.size} payment(s)`);
			},
			variant: "destructive" as const,
		},
	];

	// Calculate summary
	const paidCount = progressPayments.filter((p) => p.status === "paid").length;
	const totalPaid = progressPayments
		.filter((p) => p.status === "paid")
		.reduce((sum, p) => sum + p.amount, 0);

	const summary =
		paidCount > 0
			? `${paidCount}/${progressPayments.length} paid - ${formatCurrency(totalPaid)} received`
			: `${progressPayments.length} payments pending`;

	return (
		<div className="not-prose my-6 rounded-lg border bg-card">
			{/* Header - Clickable to toggle */}
			<div className="flex w-full items-center justify-between gap-4 p-4">
				<button
					className="flex flex-1 items-center gap-2 text-left transition-colors hover:bg-muted/50"
					onClick={toggleOpen}
					type="button"
				>
					{/* Collapse/Expand Chevron */}
					{isOpen ? (
						<ChevronDown className="size-5 text-muted-foreground transition-transform" />
					) : (
						<ChevronRight className="size-5 text-muted-foreground transition-transform" />
					)}

					{/* Icon and Title */}
					<DollarSign className="size-5 text-primary" />
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-lg">Progress Payments</h3>
							<Badge className="text-xs" variant="secondary">
								{paidCount}/{progressPayments.length} paid
							</Badge>
						</div>
						{!isOpen && (
							<p className="mt-0.5 text-muted-foreground text-sm">{summary}</p>
						)}
					</div>
				</button>

				{/* Action Buttons - Always visible */}
				<div className="flex shrink-0 items-center gap-2">
					<Button
						className="gap-1"
						onClick={() => toast.info("Add payment milestone")}
						size="sm"
						variant="outline"
					>
						<Plus className="size-4" />
						Add Milestone
					</Button>
				</div>
			</div>

			{/* Content - Collapsible Full-Width Datatable */}
			{isOpen && (
				<div className="fade-in slide-in-from-top-2 animate-in border-t duration-200">
					<FullWidthDataTable
						bulkActions={bulkActions}
						columns={columns}
						data={progressPayments}
						emptyMessage="No progress payments configured for this invoice"
						enableSelection={true}
						getItemId={(payment) => payment.id}
						itemsPerPage={10}
						onRefresh={() => {
							toast.info("Refreshing payments...");
							// TODO: Implement refresh
						}}
						searchFilter={(payment, query) =>
							payment.description.toLowerCase().includes(query.toLowerCase())
						}
						searchPlaceholder="Search progress payments..."
						showPagination={true}
						showRefresh={false}
					/>
				</div>
			)}
		</div>
	);
}
