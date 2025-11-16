/**
 * Schedule Widget - Server Component
 *
 * Displays job scheduling information including date/time, duration, and technician availability.
 * Shows conflicts, buffer time, and links to full scheduling interface.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	MapPin,
	Users,
	XCircle,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";
import { formatDate } from "@/lib/formatters";

type ScheduleWidgetProps = {
	job: Job;
};

// Mock schedule details (in production, fetch from database)
type ScheduleDetails = {
	scheduledStart: Date;
	scheduledEnd: Date;
	estimatedDuration: number; // minutes
	actualStart?: Date;
	actualEnd?: Date;
	status:
		| "scheduled"
		| "in_progress"
		| "completed"
		| "rescheduled"
		| "cancelled";
	technicians: {
		id: string;
		name: string;
		isLead: boolean;
		availability: "available" | "conflict" | "unavailable";
	}[];
	travelTime?: number; // minutes
	bufferTime?: number; // minutes
	recurringSchedule?: {
		frequency: "daily" | "weekly" | "monthly";
		nextOccurrence: Date;
	};
	conflicts?: {
		type: "double_booking" | "travel_time" | "unavailable";
		message: string;
	}[];
};

export function ScheduleWidget({ job }: ScheduleWidgetProps) {
	const toDate = (value: unknown, fallback?: Date): Date => {
		if (value instanceof Date && !Number.isNaN(value.getTime())) {
			return value;
		}
		if (typeof value === "string" || typeof value === "number") {
			const parsed = new Date(value);
			if (!Number.isNaN(parsed.getTime())) {
				return parsed;
			}
		}
		return fallback ?? new Date();
	};

	// Mock schedule data (in production, fetch from database)
	const scheduledStartDate = job.scheduledStart
		? toDate(job.scheduledStart as unknown)
		: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now

	const schedule: ScheduleDetails = {
		scheduledStart: scheduledStartDate,
		scheduledEnd: new Date(scheduledStartDate.getTime() + 4 * 60 * 60 * 1000), // +4 hours
		estimatedDuration: 240, // 4 hours
		status: "scheduled",
		technicians: [
			{
				id: "1",
				name: "Mike Rodriguez",
				isLead: true,
				availability: "available",
			},
			{
				id: "2",
				name: "Sarah Johnson",
				isLead: false,
				availability: "available",
			},
		],
		travelTime: 25,
		bufferTime: 30,
		conflicts: [],
	};

	const statusConfig = {
		scheduled: {
			label: "Scheduled",
			icon: Calendar,
			color: "text-primary",
			bgColor: "bg-primary dark:bg-primary",
			variant: "secondary" as const,
		},
		in_progress: {
			label: "In Progress",
			icon: Clock,
			color: "text-success",
			bgColor: "bg-success dark:bg-success",
			variant: "default" as const,
		},
		completed: {
			label: "Completed",
			icon: CheckCircle2,
			color: "text-success",
			bgColor: "bg-success dark:bg-success",
			variant: "default" as const,
		},
		rescheduled: {
			label: "Rescheduled",
			icon: Calendar,
			color: "text-warning",
			bgColor: "bg-warning dark:bg-warning",
			variant: "outline" as const,
		},
		cancelled: {
			label: "Cancelled",
			icon: XCircle,
			color: "text-destructive",
			bgColor: "bg-destructive dark:bg-destructive",
			variant: "destructive" as const,
		},
	};

	const config = statusConfig[schedule.status];
	const Icon = config.icon;

	function formatDateTime(date: Date | null | undefined): string {
		return formatDate(date ?? null, { preset: "datetime" });
	}

	function formatTime(date: Date | null | undefined): string {
		if (!date) {
			return "—";
		}
		return new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
		}).format(date);
	}

	function formatDuration(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours === 0) {
			return `${mins}m`;
		}
		if (mins === 0) {
			return `${hours}h`;
		}
		return `${hours}h ${mins}m`;
	}

	function getTimeUntilStart(date: Date | null | undefined): string {
		if (!date) {
			return "unknown";
		}
		const diffMs = date.getTime() - Date.now();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(
			(diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
		);

		if (diffDays > 1) {
			return `in ${diffDays} days`;
		}
		if (diffDays === 1) {
			return "tomorrow";
		}
		if (diffHours > 0) {
			return `in ${diffHours} hours`;
		}
		if (diffMs > 0) {
			return "soon";
		}
		return "started";
	}

	const hasConflicts = schedule.conflicts && schedule.conflicts.length > 0;

	if (!schedule) {
		return (
			<div className="flex min-h-[200px] items-center justify-center text-center">
				<div>
					<Calendar className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
					<p className="mb-2 text-muted-foreground text-sm">
						Not scheduled yet
					</p>
					<Button asChild size="sm" variant="outline">
						<Link href={`/dashboard/schedule?jobId=${job.id}`}>
							<Clock className="mr-2 size-4" />
							Schedule Job
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h4 className="font-semibold text-sm">Schedule</h4>
				<Badge className="text-xs" variant={config.variant}>
					<Icon className="mr-1 size-3" />
					{config.label}
				</Badge>
			</div>

			{/* Date & Time Card */}
			<div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
				<div className="mb-3 flex items-center gap-2">
					<Calendar className="size-4 text-primary" />
					<span className="font-medium text-primary text-xs uppercase tracking-wide">
						Scheduled Time
					</span>
				</div>

				{/* Start Time */}
				<div className="mb-2 space-y-1">
					<p className="text-muted-foreground text-xs">Start</p>
					<p className="font-semibold text-base">
						{formatDateTime(schedule.scheduledStart)}
					</p>
					<Badge className="text-xs" variant="outline">
						{getTimeUntilStart(schedule.scheduledStart)}
					</Badge>
				</div>

				<Separator className="my-3" />

				{/* End Time */}
				<div className="mb-2 space-y-1">
					<p className="text-muted-foreground text-xs">End (Estimated)</p>
					<p className="font-medium text-sm">
						{formatTime(schedule.scheduledEnd)}
					</p>
				</div>

				{/* Duration */}
				<div className="mt-3 flex items-center justify-between rounded-lg bg-background/50 p-2 text-xs">
					<span className="text-muted-foreground">Duration</span>
					<span className="font-semibold">
						{formatDuration(schedule.estimatedDuration)}
					</span>
				</div>
			</div>

			{/* Actual Times (if job in progress or completed) */}
			{schedule.actualStart && (
				<>
					<Separator />
					<div className="space-y-2 rounded-lg bg-muted p-3">
						<h5 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							Actual Times
						</h5>
						<div className="space-y-1.5 text-xs">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Started:</span>
								<span className="font-medium">
									{formatTime(schedule.actualStart)}
								</span>
							</div>
							{schedule.actualEnd && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Completed:</span>
									<span className="font-medium">
										{formatTime(schedule.actualEnd)}
									</span>
								</div>
							)}
						</div>
					</div>
				</>
			)}

			<Separator />

			{/* Assigned Technicians */}
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<Users className="size-4 text-muted-foreground" />
					<h5 className="font-medium text-sm">Assigned Technicians</h5>
				</div>
				<div className="space-y-2">
					{schedule.technicians.map((tech) => (
						<div
							className="flex items-center justify-between rounded-lg border p-2"
							key={tech.id}
						>
							<div className="flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
									{tech.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</div>
								<div>
									<p className="font-medium text-sm">{tech.name}</p>
									{tech.isLead && (
										<Badge className="mt-0.5 text-xs" variant="outline">
											Lead
										</Badge>
									)}
								</div>
							</div>
							<Badge
								className="text-xs"
								variant={
									tech.availability === "available"
										? "default"
										: tech.availability === "conflict"
											? "outline"
											: "destructive"
								}
							>
								{tech.availability === "available" && (
									<CheckCircle2 className="mr-1 size-3" />
								)}
								{tech.availability === "conflict" && (
									<AlertCircle className="mr-1 size-3" />
								)}
								{tech.availability === "unavailable" && (
									<XCircle className="mr-1 size-3" />
								)}
								{tech.availability}
							</Badge>
						</div>
					))}
				</div>
			</div>

			{/* Travel & Buffer Time */}
			{(schedule.travelTime || schedule.bufferTime) && (
				<>
					<Separator />
					<div className="grid grid-cols-2 gap-2 text-xs">
						{schedule.travelTime && (
							<div className="rounded-lg border p-2">
								<div className="mb-1 flex items-center gap-1.5">
									<MapPin className="size-3 text-muted-foreground" />
									<span className="text-muted-foreground">Travel Time</span>
								</div>
								<p className="font-semibold">
									{formatDuration(schedule.travelTime)}
								</p>
							</div>
						)}
						{schedule.bufferTime && (
							<div className="rounded-lg border p-2">
								<div className="mb-1 flex items-center gap-1.5">
									<Clock className="size-3 text-muted-foreground" />
									<span className="text-muted-foreground">Buffer Time</span>
								</div>
								<p className="font-semibold">
									{formatDuration(schedule.bufferTime)}
								</p>
							</div>
						)}
					</div>
				</>
			)}

			{/* Conflicts Warning */}
			{hasConflicts && (
				<>
					<Separator />
					<div className="space-y-2">
						{schedule.conflicts?.map((conflict, index) => (
							<div
								className="flex items-start gap-2 rounded-lg border-destructive border-l-4 bg-destructive p-3 dark:bg-destructive/30"
								key={index}
							>
								<AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
								<div>
									<p className="font-medium text-destructive text-sm dark:text-destructive">
										Scheduling Conflict
									</p>
									<p className="text-destructive text-xs dark:text-destructive">
										{conflict.message}
									</p>
								</div>
							</div>
						))}
					</div>
				</>
			)}

			{/* Recurring Schedule */}
			{schedule.recurringSchedule && (
				<>
					<Separator />
					<div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 dark:from-purple-950/30 dark:to-purple-900/20">
						<div className="mb-1 flex items-center gap-1.5">
							<Calendar className="size-4 text-accent-foreground" />
							<span className="font-medium text-accent-foreground text-sm dark:text-accent-foreground">
								Recurring Job
							</span>
						</div>
						<p className="text-accent-foreground text-xs dark:text-accent-foreground">
							{schedule.recurringSchedule.frequency} • Next:{" "}
							{formatDateTime(schedule.recurringSchedule.nextOccurrence)}
						</p>
					</div>
				</>
			)}

			{/* Actions */}
			<Separator />
			<div className="space-y-2">
				<Button asChild className="w-full" size="sm" variant="outline">
					<Link href={`/dashboard/schedule?jobId=${job.id}`}>
						<Calendar className="mr-2 size-4" />
						View Full Schedule
					</Link>
				</Button>
				<Button asChild className="w-full" size="sm" variant="outline">
					<Link href={"/dashboard/schedule/dispatch"}>Dispatch Board</Link>
				</Button>
			</div>
		</div>
	);
}
