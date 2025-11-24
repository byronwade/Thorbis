"use client";

import { useCallback, useMemo, useState } from "react";
import { format, isSameDay } from "date-fns";
import { ChevronDown, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import type { Job, Technician } from "@/lib/stores/schedule-store";
import { EmptyStateMobile } from "./empty-state-mobile";
import { JobActionsBottomSheet } from "./job-actions-bottom-sheet";
import { JobCardMobile } from "./job-card-mobile";
import { MobileScheduleHeader } from "./mobile-schedule-header";
import { DatePickerSheet } from "./date-picker-sheet";

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
	const { currentDate, goToToday, navigatePrevious, navigateNext, setCurrentDate } = useScheduleViewStore();

	// Convert Maps to arrays once (memoized)
	const jobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);
	const technicians = useMemo(() => Array.from(techniciansMap.values()), [techniciansMap]);

	// Local state
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [expandedTechs, setExpandedTechs] = useState<Set<string>>(new Set()); // Collapsed by default for better mobile UX
	const [showUnassigned, setShowUnassigned] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);

	// Filter jobs for current date
	const todaysJobs = useMemo(() => {
		return jobs.filter((job) => {
			if (!job.startTime) return false;
			// Handle both ISO string and Date object
			const jobDate = typeof job.startTime === 'string'
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
				return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
			});
		});

		return grouped;
	}, [todaysJobs, technicians]);

	// Get unassigned jobs for today
	const unassignedJobs = useMemo(() => {
		return todaysJobs.filter((job) => job.isUnassigned);
	}, [todaysJobs]);

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
	const handleJobAction = useCallback((action: string, job: Job) => {
		console.log("Job action:", action, job);
		// TODO: Implement actual actions
		setSelectedJob(null);
	}, []);

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
							/* TODO: Navigate to list view or month view */
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
								<div
									className="border-b last:border-b-0"
									key={tech.id}
								>
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
													{techJobs.length} {techJobs.length === 1 ? "job" : "jobs"}
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
												{unassignedJobs.length} {unassignedJobs.length === 1 ? "job" : "jobs"} need assignment
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
