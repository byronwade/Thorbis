/**
 * Customer Service Agreements Widget - Progressive Loading
 */

"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomerServiceAgreements } from "@/hooks/use-customer-360";
import { formatDate } from "@/lib/formatters";

type CustomerServiceAgreementsWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerServiceAgreementsWidget({
	customerId,
	loadImmediately = false,
}: CustomerServiceAgreementsWidgetProps) {
	return (
		<ProgressiveWidget
			title="Service Agreements"
			icon={<ShieldCheck className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: agreements,
					isLoading,
					error,
				} = useCustomerServiceAgreements(customerId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={2} />;
				if (error)
					return (
						<div className="text-center text-muted-foreground text-sm">
							Failed to load service agreements
						</div>
					);
				if (!agreements || agreements.length === 0)
					return (
						<div className="text-center text-muted-foreground text-sm">
							No service agreements
						</div>
					);

				return (
					<div className="space-y-3">
						{agreements.map((agreement) => (
							<Link
								key={agreement.id}
								href={`/dashboard/work/service-agreements/${agreement.id}`}
								className="block rounded-lg border p-3 transition-colors hover:bg-accent"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-medium text-sm">
											{agreement.name || "Unnamed Agreement"}
										</span>
										<Badge variant="outline" className="text-xs">
											{agreement.status || "active"}
										</Badge>
									</div>
									<p className="text-muted-foreground text-xs">
										{formatDate(agreement.start_date || agreement.created_at)}
									</p>
								</div>
							</Link>
						))}

						{agreements.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link
									href={`/dashboard/work/service-agreements?customer=${customerId}`}
								>
									View All Agreements
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
