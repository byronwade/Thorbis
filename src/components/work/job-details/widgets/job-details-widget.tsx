/**
 * Job Details Widget - Server Component
 *
 * Core job information and notes
 */

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";
import { formatDate } from "@/lib/formatters";

type JobDetailsWidgetProps = {
	job: Job;
};

export function JobDetailsWidget({ job }: JobDetailsWidgetProps) {
	const jobNumber = job.jobNumber != null ? String(job.jobNumber) : "Not assigned";
	const jobStatus = (job.status ?? "unknown").toString().replace(/_/g, " ");
	const jobType = (job.jobType ?? "service").toString();
	const jobPriority = (job.priority ?? "medium").toString();
	const jobDescription =
		(job.description as string | null | undefined) ?? "No description provided.";
	const jobNotes = (job.notes as string | null | undefined) ?? null;

	return (
		<div className="space-y-4">
			{/* Basic Info */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<div className="text-muted-foreground text-xs">Job Number</div>
					<div className="text-sm font-medium">{jobNumber}</div>
				</div>
				<div>
					<div className="text-muted-foreground text-xs">Status</div>
					<Badge className="text-xs" variant="outline">
						{jobStatus}
					</Badge>
				</div>
				<div>
					<div className="text-muted-foreground text-xs">Job Type</div>
					<div className="text-sm font-medium capitalize">{jobType}</div>
				</div>
				<div>
					<div className="text-muted-foreground text-xs">Priority</div>
					<Badge
						className="text-xs"
						variant={
							jobPriority === "high"
								? "destructive"
								: jobPriority === "medium"
									? "secondary"
									: "outline"
						}
					>
						{jobPriority}
					</Badge>
				</div>
			</div>

			<Separator />

			{/* Schedule */}
			<div>
				<h4 className="mb-2 text-xs font-semibold">Schedule</h4>
				<div className="space-y-2 text-xs">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Scheduled Start</span>
						<span className="font-medium">{formatDate(job.scheduledStart)}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Scheduled End</span>
						<span className="font-medium">{formatDate(job.scheduledEnd)}</span>
					</div>
					{job.actualStart ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Actual Start</span>
							<span className="font-medium">{formatDate(job.actualStart)}</span>
						</div>
					) : null}
					{job.actualEnd ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Actual End</span>
							<span className="font-medium">{formatDate(job.actualEnd)}</span>
						</div>
					) : null}
				</div>
			</div>

			<Separator />

			{/* Description */}
			<div>
				<h4 className="mb-2 text-xs font-semibold">Description</h4>
				<p className="text-muted-foreground text-xs">{jobDescription}</p>
			</div>

			{/* Notes */}
			{jobNotes ? (
				<>
					<Separator />
					<div>
						<h4 className="mb-2 text-xs font-semibold">Notes</h4>
						<div className="bg-muted rounded-md p-2 text-xs">{jobNotes}</div>
					</div>
				</>
			) : null}
		</div>
	);
}
