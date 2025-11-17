/**
 * Customer Contracts Widget - Progressive Loading
 */

"use client";

import { FileSignature } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomerContracts } from "@/hooks/use-customer-360";
import { formatDate } from "@/lib/formatters";

type CustomerContractsWidgetProps = {
	customerId: string;
	companyId: string;
	loadImmediately?: boolean;
};

export function CustomerContractsWidget({
	customerId,
	companyId,
	loadImmediately = false,
}: CustomerContractsWidgetProps) {
	return (
		<ProgressiveWidget
			title="Active Contracts"
			icon={<FileSignature className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: contracts,
					isLoading,
					error,
				} = useCustomerContracts(customerId, companyId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={2} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load contracts
						</div>
					);
				if (!contracts || contracts.length === 0)
					return (
						<div className="text-muted-foreground text-center text-sm">No contracts found</div>
					);

				return (
					<div className="space-y-3">
						{contracts.slice(0, 10).map((contract) => (
							<Link
								key={contract.id}
								href={`/dashboard/work/contracts/${contract.id}`}
								className="hover:bg-accent block rounded-lg border p-3 transition-colors"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium">
											{contract.contract_number || `Contract #${contract.id.slice(0, 8)}`}
										</span>
										<Badge variant="outline" className="text-xs">
											{contract.status}
										</Badge>
									</div>
									{contract.job && (
										<p className="text-muted-foreground text-xs">Job: {contract.job.job_number}</p>
									)}
									<p className="text-muted-foreground text-xs">{formatDate(contract.created_at)}</p>
								</div>
							</Link>
						))}

						{contracts.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work/contracts?customer=${customerId}`}>
									View All Contracts
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
