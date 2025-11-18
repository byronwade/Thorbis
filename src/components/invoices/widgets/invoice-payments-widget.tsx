/**
 * Invoice Payments Widget - Progressive Loading
 *
 * Displays payments applied to this invoice.
 * Loads data only when widget becomes visible.
 */

"use client";

import { CreditCard, DollarSign } from "lucide-react";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { useInvoicePayments } from "@/hooks/use-invoice-360";
import { formatCurrency, formatDate } from "@/lib/formatters";

type InvoicePaymentsWidgetProps = {
	invoiceId: string;
	loadImmediately?: boolean;
};

export function InvoicePaymentsWidget({
	invoiceId,
	loadImmediately = false,
}: InvoicePaymentsWidgetProps) {
	return (
		<ProgressiveWidget
			title="Payments Received"
			icon={<DollarSign className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: payments,
					isLoading,
					error,
				} = useInvoicePayments(invoiceId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load payments
						</div>
					);
				if (!payments || payments.length === 0)
					return (
						<div className="text-muted-foreground text-center text-sm">
							No payments received yet
						</div>
					);

				return (
					<div className="space-y-3">
						{payments.map((invoicePayment) => {
							const payment = invoicePayment.payment;
							if (!payment) return null;

							return (
								<div key={invoicePayment.id} className="rounded-lg border p-3">
									<div className="flex items-start gap-3">
										<div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
											<CreditCard className="h-4 w-4 text-green-600" />
										</div>
										<div className="flex-1 space-y-1">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													{formatCurrency(invoicePayment.amount_applied)}
												</span>
												<span
													className={`inline-block rounded-full px-2 py-0.5 text-xs ${
														payment.status === "completed"
															? "bg-green-100 text-green-700"
															: payment.status === "pending"
																? "bg-yellow-100 text-yellow-700"
																: "bg-gray-100 text-gray-700"
													}`}
												>
													{payment.status}
												</span>
											</div>
											<p className="text-muted-foreground text-xs">
												Payment #{payment.payment_number}
											</p>
											{payment.payment_method && (
												<p className="text-muted-foreground text-xs">
													{payment.payment_method}
													{payment.card_last4 &&
														` ending in ${payment.card_last4}`}
												</p>
											)}
											<p className="text-muted-foreground text-xs">
												Applied {formatDate(invoicePayment.applied_at)}
											</p>
											{invoicePayment.notes && (
												<p className="text-muted-foreground text-xs italic">
													"{invoicePayment.notes}"
												</p>
											)}
										</div>
									</div>
								</div>
							);
						})}

						{payments.length > 5 && (
							<Button variant="outline" size="sm" className="w-full">
								View All Payments
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
