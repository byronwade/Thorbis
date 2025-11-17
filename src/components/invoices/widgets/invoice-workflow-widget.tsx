/**
 * Invoice Workflow Widget - Progressive Loading
 *
 * Displays workflow timeline showing: Estimate → Contract → Invoice
 * Loads estimate and contract data only when widget becomes visible.
 */

"use client";

import { GitBranch, Check, FileText, FileCheck } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { useInvoiceEstimate, useInvoiceContract } from "@/hooks/use-invoice-360";
import { formatDate } from "@/lib/formatters";

type InvoiceWorkflowWidgetProps = {
	estimateId: string | null;
	invoiceId: string;
	invoiceCreatedAt: string;
	loadImmediately?: boolean;
};

export function InvoiceWorkflowWidget({
	estimateId,
	invoiceId,
	invoiceCreatedAt,
	loadImmediately = false,
}: InvoiceWorkflowWidgetProps) {
	return (
		<ProgressiveWidget
			title="Workflow Timeline"
			icon={<GitBranch className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: estimate, isLoading: estimateLoading } = useInvoiceEstimate(
					estimateId,
					isVisible
				);
				const { data: contract, isLoading: contractLoading } = useInvoiceContract(
					invoiceId,
					isVisible
				);

				if (estimateLoading || contractLoading) {
					return <WidgetSkeleton rows={3} />;
				}

				return (
					<div className="space-y-3">
						{/* Estimate */}
						{estimate && (
							<Link
								href={`/dashboard/work/estimates/${estimate.id}`}
								className="hover:bg-accent flex items-start gap-3 rounded-lg border p-3 transition-colors"
							>
								<div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
									<FileText className="h-3.5 w-3.5" />
								</div>
								<div className="flex-1 space-y-1">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											Estimate #{estimate.estimate_number}
										</span>
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<p className="text-muted-foreground text-xs">
										Created {formatDate(estimate.created_at)}
									</p>
									<span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
										{estimate.status}
									</span>
								</div>
							</Link>
						)}

						{/* Contract */}
						{contract && (
							<Link
								href={`/dashboard/work/contracts/${contract.id}`}
								className="hover:bg-accent flex items-start gap-3 rounded-lg border p-3 transition-colors"
							>
								<div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
									<FileCheck className="h-3.5 w-3.5" />
								</div>
								<div className="flex-1 space-y-1">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											Contract #{contract.contract_number}
										</span>
										<Check className="h-4 w-4 text-green-600" />
									</div>
									<p className="text-muted-foreground text-xs">
										{contract.signed_at
											? `Signed ${formatDate(contract.signed_at)}`
											: `Created ${formatDate(contract.created_at)}`}
									</p>
									<span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
										{contract.status}
									</span>
								</div>
							</Link>
						)}

						{/* Current Invoice */}
						<div className="border-primary/50 bg-primary/5 flex items-start gap-3 rounded-lg border p-3">
							<div className="bg-primary text-primary-foreground mt-0.5 flex h-6 w-6 items-center justify-center rounded-full">
								<FileText className="h-3.5 w-3.5" />
							</div>
							<div className="flex-1 space-y-1">
								<span className="text-sm font-medium">Invoice (Current)</span>
								<p className="text-muted-foreground text-xs">
									Created {formatDate(invoiceCreatedAt)}
								</p>
							</div>
						</div>

						{!estimate && !contract && (
							<div className="text-muted-foreground text-center text-sm">
								No workflow history available
							</div>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
