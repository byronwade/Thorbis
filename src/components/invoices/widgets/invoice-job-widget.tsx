/**
 * Invoice Job Widget - Progressive Loading
 *
 * Displays job details linked to this invoice.
 * Loads data only when widget becomes visible.
 */

"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { useInvoiceJob } from "@/hooks/use-invoice-360";

type InvoiceJobWidgetProps = {
	jobId: string | null;
	loadImmediately?: boolean;
};

export function InvoiceJobWidget({ jobId, loadImmediately = false }: InvoiceJobWidgetProps) {
	if (!jobId) {
		return (
			<ProgressiveWidget
				title="Related Job"
				icon={<Briefcase className="h-5 w-5" />}
				loadImmediately={true}
			>
				<div className="text-muted-foreground text-center text-sm">
					No job linked to this invoice
				</div>
			</ProgressiveWidget>
		);
	}

	return (
		<ProgressiveWidget
			title="Related Job"
			icon={<Briefcase className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: job, isLoading, error } = useInvoiceJob(jobId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={2} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load job details
						</div>
					);
				if (!job)
					return <div className="text-muted-foreground text-center text-sm">Job not found</div>;

				return (
					<Link
						href={`/dashboard/work/jobs/${job.id}`}
						className="hover:bg-accent block rounded-lg border p-4 transition-colors"
					>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Job #{job.job_number}</span>
								<span className="text-muted-foreground text-xs">View Details →</span>
							</div>
							{job.title && (
								<p className="text-muted-foreground line-clamp-2 text-sm">{job.title}</p>
							)}
						</div>
					</Link>
				);
			}}
		</ProgressiveWidget>
	);
}
