"use client";

import {
	CreditCard,
	Download,
	Eye,
	FileText,
	Link2Off,
	MoreHorizontal,
	Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { unlinkInvoiceFromJob } from "@/actions/invoices";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { InvoiceStatusBadge } from "@/components/ui/status-badge";
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatCurrency, formatDate } from "@/lib/formatters";

type Invoice = {
	id: string;
	invoice_number: string;
	title?: string;
	total_amount: number;
	paid_amount: number;
	balance_amount?: number;
	status: string;
	created_at: string;
	due_date?: string;
};

type JobInvoicesTableProps = {
	invoices: Invoice[];
};

export function JobInvoicesTable({ invoices }: JobInvoicesTableProps) {
	const router = useRouter();
	const [unlinkInvoiceId, setUnlinkInvoiceId] = useState<string | null>(null);
	const [isUnlinking, setIsUnlinking] = useState(false);

	const formatCurrencyCents = useCallback(
		(cents: number) =>
			formatCurrency(cents, {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}),
		[],
	);

	const handleUnlinkInvoice = useCallback(async () => {
		if (!unlinkInvoiceId) {
			return;
		}

		setIsUnlinking(true);
		try {
			const result = await unlinkInvoiceFromJob(unlinkInvoiceId);

			if (result.success) {
				toast.success("Invoice unlinked from job");
				setUnlinkInvoiceId(null);
				// Soft navigation - Server Component refetches with revalidatePath()
				router.refresh();
			} else {
				toast.error(result.error || "Failed to unlink invoice");
			}
		} catch (_error) {
			toast.error("Failed to unlink invoice");
		} finally {
			setIsUnlinking(false);
		}
	}, [unlinkInvoiceId, router]);

	const columns: ColumnDef<Invoice>[] = useMemo(
		() => [
			{
				key: "invoice_number",
				header: "Invoice #",
				width: "w-32",
				shrink: true,
				render: (invoice) => (
					<Link
						className="text-foreground text-xs leading-tight font-medium hover:underline"
						href={`/dashboard/work/invoices/${invoice.id}`}
						onClick={(e) => e.stopPropagation()}
					>
						{invoice.invoice_number}
					</Link>
				),
			},
			{
				key: "title",
				header: "Title",
				render: (invoice) => (
					<Link
						className="text-foreground text-xs leading-tight font-medium hover:underline"
						href={`/dashboard/work/invoices/${invoice.id}`}
						onClick={(e) => e.stopPropagation()}
					>
						{invoice.title || "—"}
					</Link>
				),
			},
			{
				key: "status",
				header: "Status",
				width: "w-24",
				shrink: true,
				render: (invoice) => <InvoiceStatusBadge status={invoice.status} />,
			},
			{
				key: "total_amount",
				header: "Amount",
				width: "w-32",
				shrink: true,
				align: "right",
				render: (invoice) => (
					<span className="font-medium">
						{formatCurrencyCents(invoice.total_amount)}
					</span>
				),
			},
			{
				key: "balance_amount",
				header: "Balance",
				width: "w-32",
				shrink: true,
				align: "right",
				render: (invoice) => {
					const balance =
						invoice.balance_amount ??
						invoice.total_amount - invoice.paid_amount;
					return balance > 0 ? (
						<span className="text-destructive font-medium">
							{formatCurrencyCents(balance)}
						</span>
					) : (
						<span className="text-muted-foreground text-xs">Paid</span>
					);
				},
			},
			{
				key: "due_date",
				header: "Due Date",
				width: "w-28",
				shrink: true,
				hideOnMobile: true,
				render: (invoice) => (
					<span className="text-xs">
						{formatDate(invoice.due_date, "short")}
					</span>
				),
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (invoice) => {
					const balance =
						invoice.balance_amount ??
						invoice.total_amount - invoice.paid_amount;
					const canPay = invoice.status !== "paid" && balance > 0;

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="size-8 p-0" size="sm" variant="ghost">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem className="cursor-pointer">
									<Eye className="mr-2 size-4" />
									View Details
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<Download className="mr-2 size-4" />
									Download PDF
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="cursor-pointer">
									<Send className="mr-2 size-4" />
									Send to Customer
								</DropdownMenuItem>
								{canPay && (
									<DropdownMenuItem className="cursor-pointer">
										<CreditCard className="mr-2 size-4" />
										Record Payment
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive cursor-pointer"
									onClick={() => setUnlinkInvoiceId(invoice.id)}
								>
									<Link2Off className="mr-2 size-4" />
									Unlink from Job
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[formatCurrencyCents],
	);

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.compact()}
				columns={columns}
				data={invoices}
				emptyIcon={<FileText className="text-muted-foreground/50 size-12" />}
				emptyMessage="No invoices found for this job"
				getItemId={(invoice) => invoice.id}
				noPadding={true}
				searchFilter={(invoice, query) => {
					const searchLower = query.toLowerCase();
					return (
						invoice.invoice_number?.toLowerCase().includes(searchLower) ||
						invoice.title?.toLowerCase().includes(searchLower) ||
						invoice.status?.toLowerCase().includes(searchLower)
					);
				}}
				searchPlaceholder="Search invoices..."
			/>

			{/* Unlink Confirmation Dialog */}
			<Dialog
				onOpenChange={(open) => !open && setUnlinkInvoiceId(null)}
				open={unlinkInvoiceId !== null}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Unlink Invoice from Job?</DialogTitle>
						<DialogDescription>
							This will remove the job association from this invoice. The
							invoice will remain in the system but will no longer appear on
							this job's page.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isUnlinking}
							onClick={() => setUnlinkInvoiceId(null)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isUnlinking}
							onClick={handleUnlinkInvoice}
							variant="destructive"
						>
							{isUnlinking ? "Unlinking..." : "Unlink Invoice"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
