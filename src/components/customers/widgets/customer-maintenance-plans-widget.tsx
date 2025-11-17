/**
 * Customer Maintenance Plans Widget - Progressive Loading
 */

"use client";

import { Wrench } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomerMaintenancePlans } from "@/hooks/use-customer-360";
import { formatCurrencyFromDollars, formatDate } from "@/lib/formatters";

type CustomerMaintenancePlansWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerMaintenancePlansWidget({
	customerId,
	loadImmediately = false,
}: CustomerMaintenancePlansWidgetProps) {
	return (
		<ProgressiveWidget
			title="Maintenance Plans"
			icon={<Wrench className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: plans,
					isLoading,
					error,
				} = useCustomerMaintenancePlans(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={2} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load maintenance plans
						</div>
					);
				if (!plans || plans.length === 0)
					return (
						<div className="text-muted-foreground text-center text-sm">No maintenance plans</div>
					);

				return (
					<div className="space-y-3">
						{plans.map((plan) => (
							<Link
								key={plan.id}
								href={`/dashboard/work/maintenance-plans/${plan.id}`}
								className="hover:bg-accent block rounded-lg border p-3 transition-colors"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium">{plan.name || "Unnamed Plan"}</span>
										<Badge variant="outline" className="text-xs">
											{plan.status || "active"}
										</Badge>
									</div>
									{plan.recurring_amount && (
										<p className="text-muted-foreground text-sm">
											{formatCurrencyFromDollars(plan.recurring_amount)}/
											{plan.billing_frequency || "month"}
										</p>
									)}
									<p className="text-muted-foreground text-xs">
										Started: {formatDate(plan.start_date || plan.created_at)}
									</p>
								</div>
							</Link>
						))}

						{plans.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work/maintenance-plans?customer=${customerId}`}>
									View All Plans
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
