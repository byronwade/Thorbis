"use client";

import { format, isSameDay } from "date-fns";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Job, Technician } from "@/lib/stores/schedule-store";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { DatePickerSheet } from "./date-picker-sheet";
import { EmptyStateMobile } from "./empty-state-mobile";
import { JobActionsBottomSheet } from "./job-actions-bottom-sheet";
import { JobCardMobile } from "./job-card-mobile";
import { MobileScheduleHeader } from "./mobile-schedule-header";

/**
 * DayViewMobile - Mobile-optimized day view with vertical timeline
 *
 * Completely different from desktop dispatch timeline:
 * - NO horizontal 1,920px scroll
 * - Vertical scrolling (natural mobile pattern)
 * - Time slots stacked vertically (8am, 9am, 10am, etc.)
 * - Collapsible technician sections
 * - Unassigned jobs panel at bottom
 * - Tap job card → bottom sheet (no drag & drop)
 * - Date navigation with arrows or swipe
 *
 * Layout:
 * ┌─────────────────────────────────┐
 * │ ← Jan 15, 2025 →  [Today]      │ Date nav
 * ├─────────────────────────────────┤
 * │ Mike Johnson (4 jobs) ▼         │ Collapsible
 * │ ┌─────────────────────────────┐ │
 * │ │ 8:00 AM - Job card          │ │
 * │ │ 10:00 AM - Job card         │ │
 * │ └─────────────────────────────┘ │
 * ├─────────────────────────────────┤
 * │ Sarah Williams (2 jobs) ▼       │
 * │ ... jobs ...                    │
 * ├─────────────────────────────────┤
 * │ 📋 Unassigned (8) ▶             │ Collapsible
 * └─────────────────────────────────┘
 */

export function DayViewMobile() {
	// Get Maps from store (stable references)
	const jobsMap = useScheduleStore((state) => state.jobs);
	const techniciansMap = useScheduleStore((state) => state.technicians);
	const {
		currentDate,
		goToToday,
		navigatePrevious,
		navigateNext,
		setCurrentDate,
	} = useScheduleViewStore();

	// Convert Maps to arrays once (memoized)
	const jobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);
	const technicians = useMemo(
		() => Array.from(techniciansMap.values()),
		[techniciansMap],
	);

	// Local state
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [expandedTechs, setExpandedTechs] = useState<Set<string>>(new Set());
	const [showUnassigned, setShowUnassigned] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [hasAutoExpanded, setHasAutoExpanded] = useState(false);

	// Filter jobs for current date
	const todaysJobs = useMemo(() => {
		return jobs.filter((job) => {
			if (!job.startTime) return false;
			// Handle both ISO string and Date object
			const jobDate =
				typeof job.startTime === "string"
					? new Date(job.startTime)
					: job.startTime;
			return isSameDay(jobDate, currentDate);
		});
	}, [jobs, currentDate]);

	// Group jobs by technician
	const jobsByTechnician = useMemo(() => {
		const grouped = new Map<string, Job[]>();

		// Initialize map with all technicians (including those with no jobs)
		technicians.forEach((tech) => {
			grouped.set(tech.id, []);
		});

		// Group jobs by assigned technician
		todaysJobs.forEach((job) => {
			if (job.technicianId) {
				const techJobs = grouped.get(job.technicianId) || [];
				techJobs.push(job);
				grouped.set(job.technicianId, techJobs);
			}
		});

		// Sort jobs within each technician by start time
		grouped.forEach((jobs) => {
			jobs.sort((a, b) => {
				if (!a.startTime) return 1;
				if (!b.startTime) return -1;
				return (
					new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
				);
			});
		});

		return grouped;
	}, [todaysJobs, technicians]);

	// Get unassigned jobs for today
	const unassignedJobs = useMemo(() => {
		return todaysJobs.filter((job) => job.isUnassigned);
	}, [todaysJobs]);

	// Auto-expand technicians that have jobs for the day (better UX than starting collapsed)
	useEffect(() => {
		if (hasAutoExpanded || jobsByTechnician.size === 0) return;

		const techsWithJobs = new Set<string>();
		jobsByTechnician.forEach((jobs, techId) => {
			if (jobs.length > 0) {
				techsWithJobs.add(techId);
			}
		});

		if (techsWithJobs.size > 0) {
			setExpandedTechs(techsWithJobs);
			setHasAutoExpanded(true);
		}
	}, [jobsByTechnician, hasAutoExpanded]);

	// Reset auto-expand flag when date changes
	useEffect(() => {
		setHasAutoExpanded(false);
	}, [currentDate]);

	// Toggle technician section
	const toggleTechnician = useCallback((techId: string) => {
		setExpandedTechs((prev) => {
			const next = new Set(prev);
			if (next.has(techId)) {
				next.delete(techId);
			} else {
				next.add(techId);
			}
			return next;
		});
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

	// Format date display
	const dateDisplay = format(currentDate, "EEEE, MMM d, yyyy");
	const isToday = isSameDay(currentDate, new Date());

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Mobile Header with view switcher, stats, and actions */}
			<MobileScheduleHeader onJobSelect={setSelectedJob} />

			{/* Date navigation */}
			<div className="shrink-0 border-b bg-background">
				<div className="flex items-center justify-between p-4">
					{/* Previous day */}
					<Button
						className="h-9 w-9"
						onClick={navigatePrevious}
						size="icon"
						variant="ghost"
					>
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Previous day</span>
					</Button>

					{/* Current date - Clickable */}
					<button
						className="flex flex-col items-center transition-colors hover:text-primary active:scale-95"
						onClick={() => setShowDatePicker(true)}
						type="button"
					>
						<h2 className="text-sm font-medium text-muted-foreground">
							{format(currentDate, "EEEE")}
						</h2>
						<p className="text-lg font-semibold">
							{format(currentDate, "MMM d, yyyy")}
						</p>
					</button>

					{/* Next day */}
					<Button
						className="h-9 w-9"
						onClick={navigateNext}
						size="icon"
						variant="ghost"
					>
						<ChevronRightIcon className="h-4 w-4" />
						<span className="sr-only">Next day</span>
					</Button>
				</div>

				{/* Today button (only show when not on today) */}
				{!isToday && (
					<div className="px-4 pb-3">
						<Button
							className="w-full"
							onClick={goToToday}
							size="sm"
							variant="outline"
						>
							Go to Today
						</Button>
					</div>
				)}
			</div>

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto">
				{todaysJobs.length === 0 ? (
					<EmptyStateMobile
						actionLabel="View Full Schedule"
						onAction={() => {
							window.location.href = "/dashboard/schedule";
						}}
						variant="no_jobs_today"
					/>
				) : (
					<div className="space-y-0">
						{/* Technician sections */}
						{technicians.map((tech) => {
							const techJobs = jobsByTechnician.get(tech.id) || [];
							const isExpanded = expandedTechs.has(tech.id);
							const hasJobs = techJobs.length > 0;

							return (
								<div className="border-b last:border-b-0" key={tech.id}>
									{/* Technician header (collapsible) */}
									<button
										className="flex w-full items-center justify-between bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted"
										onClick={() => toggleTechnician(tech.id)}
										type="button"
									>
										<div className="flex items-center gap-3">
											{isExpanded ? (
												<ChevronDown className="h-4 w-4 text-muted-foreground" />
											) : (
												<ChevronRight className="h-4 w-4 text-muted-foreground" />
											)}
											<div>
												<h3 className="font-medium">{tech.name}</h3>
												<p className="text-xs text-muted-foreground">
													{techJobs.length}{" "}
													{techJobs.length === 1 ? "job" : "jobs"}
												</p>
											</div>
										</div>

										{/* Job count badge */}
										{hasJobs && (
											<div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">
												{techJobs.length}
											</div>
										)}
									</button>

									{/* Job cards (only show when expanded) */}
									{isExpanded && (
										<div className="bg-background px-4 pb-4">
											{techJobs.length === 0 ? (
												<p className="py-8 text-center text-sm text-muted-foreground">
													No jobs scheduled for today
												</p>
											) : (
												<div className="space-y-1.5">
													{techJobs.map((job) => (
														<JobCardMobile
															job={job}
															key={job.id}
															onClick={() => setSelectedJob(job)}
															showDate={false}
															showTechnician={false}
														/>
													))}
												</div>
											)}
										</div>
									)}
								</div>
							);
						})}

						{/* Unassigned jobs section */}
						{unassignedJobs.length > 0 && (
							<div className="border-t">
								{/* Unassigned header (collapsible) */}
								<button
									className="flex w-full items-center justify-between bg-yellow-50 dark:bg-yellow-950/20 p-4 text-left transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-950/30 active:bg-yellow-100 dark:active:bg-yellow-950/30"
									onClick={() => setShowUnassigned(!showUnassigned)}
									type="button"
								>
									<div className="flex items-center gap-3">
										{showUnassigned ? (
											<ChevronDown className="h-4 w-4 text-muted-foreground" />
										) : (
											<ChevronRight className="h-4 w-4 text-muted-foreground" />
										)}
										<div>
											<h3 className="font-medium">📋 Unassigned</h3>
											<p className="text-xs text-muted-foreground">
												{unassignedJobs.length}{" "}
												{unassignedJobs.length === 1 ? "job" : "jobs"} need
												assignment
											</p>
										</div>
									</div>

									{/* Count badge */}
									<div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-600 px-2 text-xs font-semibold text-white">
										{unassignedJobs.length}
									</div>
								</button>

								{/* Unassigned job cards */}
								{showUnassigned && (
									<div className="bg-background px-4 pb-4">
										<div className="space-y-1.5">
											{unassignedJobs.map((job) => (
												<JobCardMobile
													job={job}
													key={job.id}
													onClick={() => setSelectedJob(job)}
													showDate={false}
													showTechnician={true}
												/>
											))}
										</div>
									</div>
								)}
							</div>
						)}
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

			{/* Date Picker Sheet */}
			<DatePickerSheet
				currentDate={currentDate}
				isOpen={showDatePicker}
				onClose={() => setShowDatePicker(false)}
				onDateSelect={(date) => {
					setCurrentDate(date);
					setShowDatePicker(false);
				}}
			/>
		</div>
	);
}
