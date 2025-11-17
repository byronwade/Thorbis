/**
 * Job Financials Widget - Server Component
 *
 * Quick financial summary for the job
 */

import { CircleDollarSign, DollarSign } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/formatters";

type JobFinancialsWidgetProps = {
	job: Job;
};

export function JobFinancialsWidget({ job }: JobFinancialsWidgetProps) {
	const totalAmount = job.totalAmount || 0;
	const paidAmount = job.paidAmount || 0;
	const remainingAmount = totalAmount - paidAmount;
	const percentagePaid = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

	return (
		<div className="space-y-4">
			{/* Total Amount */}
			<div>
				<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
					<CircleDollarSign className="size-3.5" />
					Total Amount
				</div>
				<div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
			</div>

			<Separator />

			{/* Payment Breakdown */}
			<div className="space-y-2 text-sm">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Paid</span>
					<span className="text-success font-medium">{formatCurrency(paidAmount)}</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Remaining</span>
					<span className="text-warning font-medium">{formatCurrency(remainingAmount)}</span>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="space-y-1">
				<Progress className="h-2" value={percentagePaid} />
				<div className="text-muted-foreground text-center text-xs">
					{Math.round(percentagePaid)}% paid
				</div>
			</div>

			<Separator />

			{/* Actions */}
			<div className="space-y-2">
				<Button asChild className="w-full" size="sm" variant="outline">
					<Link href={`/dashboard/work/${job.id}/invoices/new`}>
						<DollarSign className="mr-2 size-4" />
						Create Invoice
					</Link>
				</Button>
			</div>
		</div>
	);
}
