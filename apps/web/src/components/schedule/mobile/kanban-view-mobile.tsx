"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/stores/schedule-store";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { EmptyStateMobile } from "./empty-state-mobile";
import { JobActionsBottomSheet } from "./job-actions-bottom-sheet";
import { JobCardMobile } from "./job-card-mobile";

/**
 * KanbanViewMobile - Mobile-optimized kanban view with single column
 *
 * Completely different from desktop 8-column kanban:
 * - ONE status column at a time (full screen width)
 * - Horizontal swipe to navigate between statuses
 * - Status indicator dots at top
 * - Full-width job cards (better readability)
 * - Tap card → bottom sheet with "Move to..." action
 * - NO drag & drop (use bottom sheet to change status)
 *
 * Layout:
 * ┌─────────────────────────────────┐
 * │ ○ ○ ○ ● ○ ○ ○ ○                │ Status dots
 * │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
 * │    ← Dispatched →               │ Current status
 * ├─────────────────────────────────┤
 * │ ┌─────────────────────────────┐ │
 * │ │ Job card (full width)       │ │
 * │ └─────────────────────────────┘ │
 * │ ┌─────────────────────────────┐ │
 * │ │ Job card                    │ │
 * │ └─────────────────────────────┘ │
 * │                                 │
 * │ 12 jobs                         │ Count
 * └─────────────────────────────────┘
 *
 * Swipe left/right changes status column
 */

const STATUS_COLUMNS = [
	{ id: "unscheduled", label: "Unscheduled", color: "bg-gray-500" },
	{ id: "scheduled", label: "Scheduled", color: "bg-blue-500" },
	{ id: "dispatched", label: "Dispatched", color: "bg-yellow-500" },
	{ id: "arrived", label: "Arrived", color: "bg-purple-500" },
	{ id: "in_progress", label: "In Progress", color: "bg-orange-500" },
	{ id: "closed", label: "Closed", color: "bg-green-500" },
	{ id: "completed", label: "Completed", color: "bg-emerald-500" },
	{ id: "cancelled", label: "Cancelled", color: "bg-red-500" },
] as const;

export function KanbanViewMobile() {
	// Get Map from store (stable reference)
	const jobsMap = useScheduleStore((state) => state.jobs);

	// Convert Map to array once (memoized)
	const jobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);

	// Local state
	const [currentStatusIndex, setCurrentStatusIndex] = useState(2); // Start at "dispatched"
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);

	const currentStatus = STATUS_COLUMNS[currentStatusIndex];

	// Filter jobs by current status
	const statusJobs = useMemo(() => {
		return jobs.filter((job) => {
			const jobStatus = (job.status || "unscheduled")
				.toLowerCase()
				.replace(/ /g, "_");
			return jobStatus === currentStatus.id;
		});
	}, [jobs, currentStatus.id]);

	// Sort by scheduled start time
	const sortedJobs = useMemo(() => {
		return [...statusJobs].sort((a, b) => {
			if (!a.scheduled_start) return 1;
			if (!b.scheduled_start) return -1;
			return (
				new Date(a.scheduled_start).getTime() -
				new Date(b.scheduled_start).getTime()
			);
		});
	}, [statusJobs]);

	// Navigation handlers
	const handlePrevious = useCallback(() => {
		setCurrentStatusIndex((prev) => Math.max(0, prev - 1));
	}, []);

	const handleNext = useCallback(() => {
		setCurrentStatusIndex((prev) =>
			Math.min(STATUS_COLUMNS.length - 1, prev + 1),
		);
	}, []);

	const handleJumpToStatus = useCallback((index: number) => {
		setCurrentStatusIndex(index);
	}, []);

	// Job action handler
	const handleJobAction = useCallback(
		async (action: string, job: Job, ...args: unknown[]) => {
			console.log("Job action:", action, job, args);
			setSelectedJob(null);

			try {
				switch (action) {
					case "view_details":
						window.location.href = `/dashboard/work/jobs/${job.id}`;
						break;

					case "dispatch":
					case "arrive":
					case "start":
					case "complete":
					case "move_to_status": {
						const { updateJobStatus } = await import("@/actions/jobs");
						const newStatus =
							action === "move_to_status" ? (args[0] as string) : action;
						const statusMap: Record<string, string> = {
							dispatch: "dispatched",
							arrive: "arrived",
							start: "in_progress",
							complete: "completed",
						};
						const mappedStatus = statusMap[action] || newStatus;
						const result = await updateJobStatus(job.id, mappedStatus);
						if (result.success) {
							toast.success(
								`Job ${action === "move_to_status" ? "moved to " + newStatus : action + "ed"}`,
							);
							window.location.reload();
						} else {
							toast.error(result.error || "Failed to update job status");
						}
						break;
					}

					case "reschedule": {
						const [newStart, newEnd] = args as [Date, Date];
						const { updateJob } = await import("@/actions/jobs");
						const result = await updateJob({
							jobId: job.id,
							scheduled_start: newStart.toISOString(),
							scheduled_end: newEnd.toISOString(),
						});
						if (result.success) {
							toast.success("Job rescheduled");
							window.location.reload();
						} else {
							toast.error(result.error || "Failed to reschedule job");
						}
						break;
					}

					case "reassign": {
						const technicianId = args[0] as string | null;
						if (technicianId) {
							const { assignJobToTechnician } = await import(
								"@/actions/schedule-assignments"
							);
							const result = await assignJobToTechnician(job.id, technicianId);
							if (result.success) {
								toast.success("Job reassigned");
								window.location.reload();
							} else {
								toast.error(result.error || "Failed to reassign job");
							}
						} else {
							toast.info("Unassigning technician coming soon");
						}
						break;
					}

					case "cancel": {
						const { cancelJobAndAppointment } = await import(
							"@/actions/schedule-assignments"
						);
						const result = await cancelJobAndAppointment(job.id);
						if (result.success) {
							toast.success("Job cancelled");
							window.location.reload();
						} else {
							toast.error(result.error || "Failed to cancel job");
						}
						break;
					}

					default:
						console.warn("Unknown action:", action);
				}
			} catch (error) {
				console.error("Job action error:", error);
				toast.error("An error occurred");
			}
		},
		[],
	);

	const canGoPrevious = currentStatusIndex > 0;
	const canGoNext = currentStatusIndex < STATUS_COLUMNS.length - 1;

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header: Status indicator dots */}
			<div className="shrink-0 border-b bg-background p-4">
				{/* Dots */}
				<div className="mb-4 flex items-center justify-center gap-2">
					{STATUS_COLUMNS.map((status, index) => {
						const isActive = index === currentStatusIndex;
						return (
							<button
								className="transition-transform hover:scale-125 active:scale-110"
								key={status.id}
								onClick={() => handleJumpToStatus(index)}
								type="button"
							>
								<div
									className={`h-2 w-2 rounded-full transition-all ${
										isActive
											? `${status.color} scale-125`
											: "bg-muted-foreground/30"
									}`}
								/>
								<span className="sr-only">{status.label}</span>
							</button>
						);
					})}
				</div>

				{/* Current status with navigation */}
				<div className="flex items-center justify-between">
					{/* Previous button */}
					<Button
						className="h-9 w-9"
						disabled={!canGoPrevious}
						onClick={handlePrevious}
						size="icon"
						variant="ghost"
					>
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Previous status</span>
					</Button>

					{/* Current status */}
					<div className="flex flex-col items-center">
						<div
							className={`mb-1 h-1 w-16 rounded-full ${currentStatus.color}`}
						/>
						<h2 className="text-lg font-semibold">{currentStatus.label}</h2>
						<p className="text-xs text-muted-foreground">
							{sortedJobs.length} {sortedJobs.length === 1 ? "job" : "jobs"}
						</p>
					</div>

					{/* Next button */}
					<Button
						className="h-9 w-9"
						disabled={!canGoNext}
						onClick={handleNext}
						size="icon"
						variant="ghost"
					>
						<ChevronRight className="h-4 w-4" />
						<span className="sr-only">Next status</span>
					</Button>
				</div>
			</div>

			{/* Scrollable job list */}
			<div className="flex-1 overflow-y-auto">
				{sortedJobs.length === 0 ? (
					<div className="flex h-full items-center justify-center p-6">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								No jobs with status "{currentStatus.label}"
							</p>
							{canGoNext && (
								<Button
									className="mt-4"
									onClick={handleNext}
									size="sm"
									variant="outline"
								>
									View {STATUS_COLUMNS[currentStatusIndex + 1].label}
								</Button>
							)}
						</div>
					</div>
				) : (
					<div className="space-y-2 p-4">
						{sortedJobs.map((job) => (
							<JobCardMobile
								job={job}
								key={job.id}
								onClick={() => setSelectedJob(job)}
								showDate={true}
								showTechnician={true}
							/>
						))}
					</div>
				)}
			</div>

			{/* Job Actions Bottom Sheet */}
			<JobActionsBottomSheet
				isOpen={selectedJob !== null}
				job={selectedJob}
				onAction={handleJobAction}
				onClose={() => setSelectedJob(null)}
			/>
		</div>
	);
}
