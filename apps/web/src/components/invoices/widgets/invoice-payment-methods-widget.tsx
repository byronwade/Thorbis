/**
 * Invoice Payment Methods Widget - Progressive Loading
 *
 * Displays customer's saved payment methods for this invoice.
 * Loads data only when widget becomes visible.
 */

"use client";

import { Check, CreditCard } from "lucide-react";
import { CollectPaymentDialog } from "@/components/finance/collect-payment-dialog";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInvoicePaymentMethods } from "@/hooks/use-invoice-360";

type InvoicePaymentMethodsWidgetProps = {
	customerId: string;
	invoiceId?: string;
	invoiceNumber?: string;
	customerName?: string;
	companyId?: string;
	amountDue?: number;
	loadImmediately?: boolean;
	onPaymentSuccess?: () => void;
};

export function InvoicePaymentMethodsWidget({
	customerId,
	invoiceId,
	invoiceNumber,
	customerName,
	companyId,
	amountDue,
	loadImmediately = false,
	onPaymentSuccess,
}: InvoicePaymentMethodsWidgetProps) {
	const canCollectPayment =
		invoiceId && companyId && amountDue && amountDue > 0;
	return (
		<ProgressiveWidget
			title="Payment Methods"
			icon={<CreditCard className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: paymentMethods,
					isLoading,
					error,
				} = useInvoicePaymentMethods(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={2} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load payment methods
						</div>
					);
				if (!paymentMethods || paymentMethods.length === 0)
					return (
						<div className="space-y-3">
							<div className="text-muted-foreground text-center text-sm">
								No saved payment methods
							</div>
							<Button variant="outline" size="sm" className="w-full">
								Add Payment Method
							</Button>
						</div>
					);

				return (
					<div className="space-y-3">
						{paymentMethods.map((method) => (
							<div key={method.id} className="rounded-lg border p-3">
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{method.type === "card" ? "Credit Card" : method.type}
											</span>
											{method.is_default && (
												<Badge variant="default" className="text-xs">
													<Check className="mr-1 h-3 w-3" />
													Default
												</Badge>
											)}
										</div>
										{method.last4 && (
											<p className="text-muted-foreground text-sm">
												•••• {method.last4}
											</p>
										)}
										{method.brand && (
											<p className="text-muted-foreground text-xs">
												{method.brand}
											</p>
										)}
										{method.exp_month && method.exp_year && (
											<p className="text-muted-foreground text-xs">
												Expires {method.exp_month}/{method.exp_year}
											</p>
										)}
									</div>
								</div>
							</div>
						))}

						{canCollectPayment ? (
							<CollectPaymentDialog
								invoiceId={invoiceId}
								invoiceNumber={invoiceNumber || ""}
								customerId={customerId}
								customerName={customerName || "Customer"}
								companyId={companyId}
								amountDue={amountDue}
								onSuccess={onPaymentSuccess}
								trigger={
									<Button variant="outline" size="sm" className="w-full">
										Collect Payment
									</Button>
								}
							/>
						) : (
							<Button variant="outline" size="sm" className="w-full" disabled>
								Collect Payment
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
