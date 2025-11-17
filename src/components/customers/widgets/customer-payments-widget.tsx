/**
 * Customer Payments Widget - Progressive Loading
 */

"use client";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomerPayments } from "@/hooks/use-customer-360";
import { formatCurrencyFromDollars, formatDate } from "@/lib/formatters";

type CustomerPaymentsWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerPaymentsWidget({
	customerId,
	loadImmediately = false,
}: CustomerPaymentsWidgetProps) {
	return (
		<ProgressiveWidget
			title="Recent Payments"
			icon={<CreditCard className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: payments, isLoading, error } = useCustomerPayments(
					customerId,
					isVisible,
				);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-center text-muted-foreground text-sm">
							Failed to load payments
						</div>
					);
				if (!payments || payments.length === 0)
					return (
						<div className="text-center text-muted-foreground text-sm">
							No payments found
						</div>
					);

				return (
					<div className="space-y-3">
						{payments.map((payment) => (
							<Link
								key={payment.id}
								href={`/dashboard/work/payments/${payment.id}`}
								className="block rounded-lg border p-3 transition-colors hover:bg-accent"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-semibold text-sm">
												{formatCurrencyFromDollars(payment.amount || 0)}
											</span>
											<Badge variant="outline" className="text-xs">
												{payment.payment_method || "Unknown"}
											</Badge>
										</div>
										<p className="text-muted-foreground text-xs">
											{payment.status}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatDate(payment.processed_at || payment.created_at)}
										</p>
									</div>
								</div>
							</Link>
						))}

						{payments.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work/payments?customer=${customerId}`}>
									View All Payments
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
