"use client";

/**
 * Gantt Job Block Component
 * Renders a job as a block in the time grid
 */

import { format } from "date-fns";
import { AlertTriangle, Clock, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateDuration, formatDuration } from "@/lib/schedule-utils";
import { cn } from "@/lib/utils";
import type { Job } from "./schedule-types";

type GanttJobBlockProps = {
	job: Job;
	isSelected?: boolean;
	onClick?: () => void;
	style?: React.CSSProperties;
	highlightUnassigned?: boolean;
};

const statusColors: Record<Job["status"], string> = {
	scheduled: "bg-primary/90 hover:bg-primary",
	dispatched: "bg-sky-500/90 hover:bg-sky-500",
	arrived: "bg-indigo-500/90 hover:bg-indigo-500",
	"in-progress": "bg-warning/90 hover:bg-warning",
	completed: "bg-success/90 hover:bg-success",
	closed: "bg-emerald-600/90 hover:bg-emerald-600",
	cancelled: "bg-destructive/90 hover:bg-destructive",
};

const priorityBorderColors = {
	low: "border-l-slate-500",
	medium: "border-l-blue-500",
	high: "border-l-orange-500",
	urgent: "border-l-red-500",
};

export function GanttJobBlock({
	job,
	isSelected,
	onClick,
	style,
	highlightUnassigned = false,
}: GanttJobBlockProps) {
	const duration = calculateDuration(job.startTime, job.endTime);
	const start = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
	const end = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
	const primaryAssignment = job.assignments.find((assignment) => assignment.role === "primary");
	const additionalAssignments = job.assignments.filter(
		(assignment) => assignment.role !== "primary"
	);
	const assignmentLabel = job.isUnassigned
		? "Unassigned"
		: primaryAssignment?.displayName || "Assigned";
	const showHighlight = highlightUnassigned && job.isUnassigned;
	const assignmentTooltip = job.assignments.map((assignment) => assignment.displayName).join(", ");
	const priorityColor = priorityBorderColors[job.priority] ?? priorityBorderColors.medium;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							"group relative flex min-h-[60px] cursor-pointer flex-col gap-1 rounded-md border-l-4 px-2 py-1.5 text-white shadow-sm transition-all",
							statusColors[job.status],
							priorityColor,
							job.isUnassigned &&
								"border-destructive/40 bg-destructive/30 text-destructive-foreground",
							isSelected && "ring-primary ring-2 ring-offset-1",
							showHighlight && "animate-pulse",
							onClick && "hover:shadow-md"
						)}
						onClick={onClick}
						style={style}
						title={`${job.title} • ${job.customer.name}${assignmentTooltip ? ` • ${assignmentTooltip}` : ""}`}
					>
						<div className="flex items-center justify-between gap-2">
							<p className="line-clamp-1 text-xs leading-tight font-semibold">{job.title}</p>
							<div
								className={cn(
									"absolute top-1 right-1 size-1.5 rounded-full",
									priorityColor.replace("border-l-", "bg-")
								)}
							/>
						</div>

						<p className="line-clamp-1 text-[10px] opacity-90">{job.customer.name}</p>

						<div className="flex items-center gap-1 text-[10px] opacity-90">
							{job.isUnassigned ? (
								<AlertTriangle className="size-3" />
							) : (
								<Users className="size-3" />
							)}
							<span className="font-medium">{assignmentLabel}</span>
							{additionalAssignments.length > 0 && (
								<span className="text-[10px] text-white/70">+{additionalAssignments.length}</span>
							)}
						</div>

						{job.assignments.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{job.assignments.slice(0, 3).map((assignment) => (
									<span
										className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px]"
										key={`badge-${assignment.technicianId ?? assignment.teamMemberId ?? assignment.displayName}`}
									>
										{getInitials(assignment.displayName)}
									</span>
								))}
								{job.assignments.length > 3 && (
									<span className="text-[10px] text-white/70">
										+{job.assignments.length - 3} more
									</span>
								)}
							</div>
						)}

						<div className="mt-auto flex items-center gap-1 text-[10px] opacity-80">
							<Clock className="size-2.5" />
							<span className="font-medium">{formatDuration(duration)}</span>
						</div>
					</div>
				</TooltipTrigger>
				<TooltipContent className="w-64 space-y-2 text-left">
					<div>
						<p className="text-sm font-semibold">{job.title}</p>
						<p className="text-muted-foreground text-[11px]">
							{format(start, "EEE, MMM d • h:mm a")} – {format(end, "h:mm a")}
						</p>
					</div>
					<div className="text-[11px]">
						<p className="text-muted-foreground">Customer</p>
						<p>{job.customer.name}</p>
					</div>
					<div className="space-y-1 text-[11px]">
						<p className="text-muted-foreground">
							{job.assignments.length > 0 ? "Assigned technicians" : "Waiting for assignment"}
						</p>
						{job.assignments.length > 0 ? (
							job.assignments.map((assignment) => (
								<div
									className="flex items-center justify-between"
									key={`tooltip-${assignment.technicianId ?? assignment.teamMemberId ?? assignment.displayName}`}
								>
									<span>{assignment.displayName}</span>
									<span className="text-muted-foreground capitalize">{assignment.role}</span>
								</div>
							))
						) : (
							<span className="text-destructive font-medium">No technician assigned</span>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((word) => word[0])
		.join("")
		.slice(0, 3)
		.toUpperCase();
}
