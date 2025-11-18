/**
 * Customer Jobs Widget - Progressive Loading Example
 *
 * This widget loads customer jobs data only when it becomes visible in the viewport.
 * Uses ProgressiveWidget + useCustomerJobs hook for on-demand loading.
 *
 * This is an example showing how to refactor Customer 360° widgets
 * from loading all data upfront to progressive on-demand loading.
 */

"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobStatusBadge } from "@/components/ui/status-badge";
import { useCustomerJobs } from "@/hooks/use-customer-360";
import { formatDate } from "@/lib/formatters";

type CustomerJobsWidgetProps = {
	customerId: string;
	/**
	 * Whether to load immediately (true) or wait for viewport visibility (false)
	 * Default: false (progressive loading)
	 */
	loadImmediately?: boolean;
};

export function CustomerJobsWidget({
	customerId,
	loadImmediately = false,
}: CustomerJobsWidgetProps) {
	return (
		<ProgressiveWidget
			title="Recent Jobs"
			icon={<Briefcase className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				// Only fetch when widget is visible
				const {
					data: jobs,
					isLoading,
					error,
				} = useCustomerJobs(customerId, isVisible);

				if (isLoading) {
					return <WidgetSkeleton rows={3} />;
				}

				if (error) {
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load jobs
						</div>
					);
				}

				if (!jobs || jobs.length === 0) {
					return (
						<div className="text-muted-foreground text-center text-sm">
							No jobs found
						</div>
					);
				}

				return (
					<div className="space-y-3">
						{jobs.map((job) => (
							<Link
								key={job.id}
								href={`/dashboard/work/${job.id}`}
								className="hover:bg-accent block rounded-lg border p-3 transition-colors"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{job.job_number}
											</span>
											<JobStatusBadge status={job.status} />
										</div>
										<p className="text-muted-foreground line-clamp-1 text-sm">
											{job.title || "Untitled Job"}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatDate(job.created_at)}
										</p>
									</div>
								</div>
							</Link>
						))}

						{jobs.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work?customer=${customerId}`}>
									View All Jobs
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
