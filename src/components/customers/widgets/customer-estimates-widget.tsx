/**
 * Customer Estimates Widget - Progressive Loading
 */

"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomerEstimates } from "@/hooks/use-customer-360";
import { formatCurrencyFromDollars, formatDate } from "@/lib/formatters";

type CustomerEstimatesWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerEstimatesWidget({
	customerId,
	loadImmediately = false,
}: CustomerEstimatesWidgetProps) {
	return (
		<ProgressiveWidget
			title="Recent Estimates"
			icon={<FileText className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: estimates,
					isLoading,
					error,
				} = useCustomerEstimates(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load estimates
						</div>
					);
				if (!estimates || estimates.length === 0)
					return (
						<div className="text-muted-foreground text-center text-sm">
							No estimates found
						</div>
					);

				return (
					<div className="space-y-3">
						{estimates.map((estimate) => (
							<Link
								key={estimate.id}
								href={`/dashboard/work/estimates/${estimate.id}`}
								className="hover:bg-accent block rounded-lg border p-3 transition-colors"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{estimate.estimate_number}
											</span>
											<Badge variant="outline" className="text-xs">
												{estimate.status}
											</Badge>
										</div>
										<p className="text-sm font-semibold">
											{formatCurrencyFromDollars(estimate.total_amount || 0)}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatDate(estimate.created_at)}
										</p>
									</div>
								</div>
							</Link>
						))}

						{estimates.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work/estimates?customer=${customerId}`}>
									View All Estimates
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
