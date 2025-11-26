/**
 * Admin View-As: Invoices Page
 *
 * Shows the customer's invoices in view-as mode.
 */

import { Suspense } from "react";
import { getViewAsInvoices } from "@/lib/queries/view-as-queries";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { RowActionsDropdown } from "@/components/view-as/row-actions-dropdown";

type SearchParams = {
	page?: string;
};

interface InvoicesPageProps {
	searchParams: Promise<SearchParams>;
}

function formatCurrency(cents: number | null) {
	if (cents === null) return "$0.00";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

function getStatusBadge(status: string | null) {
	const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
		draft: { variant: "secondary", label: "Draft" },
		sent: { variant: "default", label: "Sent" },
		paid: { variant: "outline", label: "Paid" },
		overdue: { variant: "destructive", label: "Overdue" },
		cancelled: { variant: "secondary", label: "Cancelled" },
	};

	const config = statusMap[status || "draft"] || { variant: "outline", label: status || "Unknown" };
	return <Badge variant={config.variant}>{config.label}</Badge>;
}

async function InvoicesData({ page }: { page: number }) {
	const { data: invoices, totalCount } = await getViewAsInvoices(page);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Invoice #</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Total</TableHead>
						<TableHead className="text-right">Paid</TableHead>
						<TableHead className="text-right">Balance</TableHead>
						<TableHead>Due Date</TableHead>
						<TableHead className="w-[50px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invoices.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
								No invoices found
							</TableCell>
						</TableRow>
					) : (
						invoices.map((invoice: any) => {
							const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
							const customerName = customer?.display_name ||
								[customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
								"Unknown";

							return (
								<TableRow key={invoice.id}>
									<TableCell className="font-medium">{invoice.invoice_number || "—"}</TableCell>
									<TableCell>{customerName}</TableCell>
									<TableCell>{getStatusBadge(invoice.status)}</TableCell>
									<TableCell className="text-right font-mono">{formatCurrency(invoice.total_amount)}</TableCell>
									<TableCell className="text-right font-mono">{formatCurrency(invoice.paid_amount)}</TableCell>
									<TableCell className="text-right font-mono">{formatCurrency(invoice.balance_amount)}</TableCell>
									<TableCell>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "—"}</TableCell>
									<TableCell>
										<RowActionsDropdown
											resourceType="invoice"
											resourceId={invoice.id}
										/>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
			<div className="p-4 text-sm text-muted-foreground">
				Showing {invoices.length} of {totalCount} invoices
			</div>
		</div>
	);
}

function InvoicesSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

export default async function AdminInvoicesPage({ searchParams }: InvoicesPageProps) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Invoices</h1>
				<p className="text-sm text-muted-foreground">View customer invoices</p>
			</div>

			<Suspense fallback={<InvoicesSkeleton />}>
				<InvoicesData page={currentPage} />
			</Suspense>
		</div>
	);
}
