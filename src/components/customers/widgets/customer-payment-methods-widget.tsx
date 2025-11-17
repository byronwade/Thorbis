/**
 * Customer Payment Methods Widget - Progressive Loading
 */

"use client";

import { CreditCard, Check } from "lucide-react";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomerPaymentMethods } from "@/hooks/use-customer-360";

type CustomerPaymentMethodsWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerPaymentMethodsWidget({
	customerId,
	loadImmediately = false,
}: CustomerPaymentMethodsWidgetProps) {
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
				} = useCustomerPaymentMethods(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={2} />;
				if (error)
					return (
						<div className="text-center text-muted-foreground text-sm">
							Failed to load payment methods
						</div>
					);
				if (!paymentMethods || paymentMethods.length === 0)
					return (
						<div className="text-center text-muted-foreground text-sm">
							No payment methods on file
						</div>
					);

				return (
					<div className="space-y-3">
						{paymentMethods.map((method) => (
							<div
								key={method.id}
								className="rounded-lg border p-3"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-medium text-sm">
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
									</div>
								</div>
							</div>
						))}

						<Button variant="outline" size="sm" className="w-full">
							Manage Payment Methods
						</Button>
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
