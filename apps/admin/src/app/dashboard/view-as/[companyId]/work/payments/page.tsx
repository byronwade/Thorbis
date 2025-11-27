/**
 * Admin View-As: Payments Page
 *
 * Shows the customer's payments in view-as mode.
 */

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getViewAsPayments } from "@/lib/queries/view-as-queries";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { RowActionsDropdown } from "@/components/view-as/row-actions-dropdown";

type SearchParams = {
	page?: string;
};

interface PaymentsPageProps {
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
		pending: { variant: "secondary", label: "Pending" },
		completed: { variant: "outline", label: "Completed" },
		failed: { variant: "destructive", label: "Failed" },
		refunded: { variant: "secondary", label: "Refunded" },
	};

	const config = statusMap[status || "pending"] || { variant: "outline", label: status || "Unknown" };
	return <Badge variant={config.variant}>{config.label}</Badge>;
}

async function PaymentsData({ page }: { page: number }) {
	const { data: payments, totalCount } = await getViewAsPayments(page);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Payment #</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Invoice #</TableHead>
						<TableHead>Method</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Amount</TableHead>
						<TableHead>Date</TableHead>
						<TableHead className="w-[50px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{payments.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
								No payments found
							</TableCell>
						</TableRow>
					) : (
						payments.map((payment: any) => {
							const customer = Array.isArray(payment.customers) ? payment.customers[0] : payment.customers;
							const invoice = Array.isArray(payment.invoices) ? payment.invoices[0] : payment.invoices;

							// Calculate max refund amount (total paid - already refunded)
							const maxRefundAmount = (payment.amount || 0) - (payment.refunded_amount || 0);

							return (
								<TableRow key={payment.id}>
									<TableCell className="font-medium">{payment.payment_number || "—"}</TableCell>
									<TableCell>{customer?.display_name || "Unknown"}</TableCell>
									<TableCell>{invoice?.invoice_number || "—"}</TableCell>
									<TableCell className="capitalize">{payment.payment_method || "—"}</TableCell>
									<TableCell>{getStatusBadge(payment.status)}</TableCell>
									<TableCell className="text-right font-mono">{formatCurrency(payment.amount)}</TableCell>
									<TableCell>{payment.created_at ? new Date(payment.created_at).toLocaleDateString() : "—"}</TableCell>
									<TableCell>
										<RowActionsDropdown
											resourceType="payment"
											resourceId={payment.id}
											resourceData={{ maxRefundAmount }}
										/>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
			<div className="p-4 text-sm text-muted-foreground">
				Showing {payments.length} of {totalCount} payments
			</div>
		</div>
	);
}

function PaymentsSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

export default async function AdminPaymentsPage({ searchParams }: PaymentsPageProps) {
	const params = await searchParams;
	const currentPage = Number(params.page) || 1;

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Payments</h1>
				<p className="text-sm text-muted-foreground">View customer payments</p>
			</div>

			<Suspense fallback={<PaymentsSkeleton />}>
				<PaymentsData page={currentPage} />
			</Suspense>
		</div>
	);
}
