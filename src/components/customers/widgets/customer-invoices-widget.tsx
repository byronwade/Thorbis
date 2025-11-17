/**
 * Customer Invoices Widget - Progressive Loading
 *
 * Loads customer invoices data only when visible in viewport.
 */

"use client";

import { Receipt } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/ui/status-badge";
import { useCustomerInvoices } from "@/hooks/use-customer-360";
import { formatCurrencyFromDollars, formatDate } from "@/lib/formatters";

type CustomerInvoicesWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerInvoicesWidget({
	customerId,
	loadImmediately = false,
}: CustomerInvoicesWidgetProps) {
	return (
		<ProgressiveWidget
			title="Recent Invoices"
			icon={<Receipt className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: invoices, isLoading, error } = useCustomerInvoices(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">Failed to load invoices</div>
					);
				if (!invoices || invoices.length === 0)
					return <div className="text-muted-foreground text-center text-sm">No invoices found</div>;

				return (
					<div className="space-y-3">
						{invoices.map((invoice) => (
							<Link
								key={invoice.id}
								href={`/dashboard/work/invoices/${invoice.id}`}
								className="hover:bg-accent block rounded-lg border p-3 transition-colors"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">{invoice.invoice_number}</span>
											<InvoiceStatusBadge status={invoice.status} />
										</div>
										<p className="text-sm font-semibold">
											{formatCurrencyFromDollars(invoice.total_amount || 0)}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatDate(invoice.created_at)}
										</p>
									</div>
								</div>
							</Link>
						))}

						{invoices.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work/invoices?customer=${customerId}`}>
									View All Invoices
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
