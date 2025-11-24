"use client";

import { useMemo, useState, useCallback } from "react";
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	isSameMonth,
	isSameDay,
	isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import type { Job } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";
import { JobActionsBottomSheet } from "./job-actions-bottom-sheet";
import { DayDetailBottomSheet } from "./day-detail-bottom-sheet";

/**
 * MonthlyViewMobile - Mobile-optimized calendar month view
 *
 * Differences from desktop:
 * - Larger touch-friendly cells (100px+ height)
 * - Tap day → bottom sheet with day details
 * - Tap job → job actions bottom sheet
 * - NO drag & drop (use bottom sheet to reschedule)
 * - NO context menus or tooltips
 * - Simplified job indicators (dots + count)
 * - Week view toggle for very small screens
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

// Job status color mapping
const getStatusColor = (status?: string) => {
	switch (status?.toLowerCase()) {
		case "scheduled":
			return "bg-blue-500";
		case "dispatched":
			return "bg-sky-500";
		case "arrived":
			return "bg-emerald-400";
		case "in_progress":
			return "bg-amber-500";
		case "closed":
		case "completed":
			return "bg-emerald-600";
		case "cancelled":
			return "bg-slate-400";
		default:
			return "bg-slate-500";
	}
};

type DayCellProps = {
	date: Date;
	jobs: Job[];
	isCurrentMonth: boolean;
	onDayTap: (date: Date, jobs: Job[]) => void;
	onJobTap: (job: Job) => void;
};

function DayCell({ date, jobs, isCurrentMonth, onDayTap, onJobTap }: DayCellProps) {
	const isCurrentDay = isToday(date);
	const hasJobs = jobs.length > 0;
	const isWeekend = date.getDay() === 0 || date.getDay() === 6;

	// Group jobs by status for colored dots
	const statusCounts = useMemo(() => {
		return jobs.reduce((acc, job) => {
			const status = job.status?.toLowerCase() || "scheduled";
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
	}, [jobs]);

	// Get top 3 statuses to show
	const topStatuses = useMemo(() => {
		return Object.entries(statusCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3);
	}, [statusCounts]);

	return (
		<button
			className={cn(
				"flex h-24 sm:h-28 flex-col border-r border-b p-1.5 sm:p-2 text-left transition-all active:scale-95",
				!isCurrentMonth && "bg-muted/50 opacity-60",
				isCurrentDay && "bg-blue-50 ring-2 ring-inset ring-blue-500/50 dark:bg-blue-950/30",
				isWeekend && !isCurrentDay && "bg-slate-100/80 dark:bg-slate-800/30",
			)}
			onClick={() => onDayTap(date, jobs)}
			type="button"
		>
			{/* Date Number */}
			<div className="flex items-center justify-between gap-1 mb-1">
				<span
					className={cn(
						"flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold",
						isCurrentDay && "bg-blue-500 text-white shadow-md",
						!isCurrentDay && !isCurrentMonth && "text-muted-foreground/60",
						!isCurrentDay && isCurrentMonth && "text-foreground",
					)}
				>
					{format(date, "d")}
				</span>

				{/* Job count badge */}
				{hasJobs && (
					<Badge className="h-4 px-1.5 text-[9px] sm:text-[10px] font-semibold" variant="secondary">
						{jobs.length}
					</Badge>
				)}
			</div>

			{/* Status indicators - Small colored dots */}
			{hasJobs && (
				<div className="flex flex-wrap gap-0.5">
					{topStatuses.map(([status, count]) => (
						<div
							className="flex items-center gap-0.5"
							key={status}
						>
							<div className={cn("h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full", getStatusColor(status))} />
							{count > 1 && (
								<span className="text-[8px] sm:text-[9px] text-muted-foreground font-medium">
									{count}
								</span>
							)}
						</div>
					))}
				</div>
			)}

			{/* First few jobs as mini pills (only on larger mobile screens) */}
			{hasJobs && (
				<div className="hidden xs:flex flex-col gap-0.5 mt-1 overflow-hidden">
					{jobs.slice(0, 2).map((job) => (
						<button
							className={cn(
								"flex items-center gap-1 rounded px-1 py-0.5 text-[8px] sm:text-[9px] font-medium transition-colors hover:opacity-80",
								getStatusColor(job.status),
								"text-white truncate"
							)}
							key={job.id}
							onClick={(e) => {
								e.stopPropagation();
								onJobTap(job);
							}}
							type="button"
						>
							<span className="truncate">{job.customer?.name || job.title}</span>
						</button>
					))}
					{jobs.length > 2 && (
						<span className="text-[8px] text-muted-foreground ml-1">
							+{jobs.length - 2} more
						</span>
					)}
				</div>
			)}
		</button>
	);
}

export function MonthlyViewMobile() {
	// Get Map from store (stable reference)
	const jobsMap = useScheduleStore((state) => state.jobs);
	const { currentDate, goToToday, navigatePrevious, navigateNext } = useScheduleViewStore();

	// Convert Map to array once (memoized)
	const jobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);

	// Local state
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [selectedDay, setSelectedDay] = useState<{ date: Date; jobs: Job[] } | null>(null);
	const [showWeekView, setShowWeekView] = useState(false);

	const dateObj = useMemo(
		() => (currentDate instanceof Date ? currentDate : new Date(currentDate)),
		[currentDate],
	);

	// Generate calendar grid
	const calendarDays = useMemo(() => {
		const monthStart = startOfMonth(dateObj);
		const monthEnd = endOfMonth(dateObj);
		const calendarStart = startOfWeek(monthStart);
		const calendarEnd = endOfWeek(monthEnd);

		const days: Date[] = [];
		let currentDay = calendarStart;

		while (currentDay <= calendarEnd) {
			days.push(currentDay);
			currentDay = addDays(currentDay, 1);
		}

		return days;
	}, [dateObj]);

	// Get jobs for the current week if in week view mode
	const weekDays = useMemo(() => {
		if (!showWeekView) return calendarDays;

		// Find the week containing currentDate
		const weekStart = startOfWeek(dateObj);
		const days: Date[] = [];
		for (let i = 0; i < 7; i++) {
			days.push(addDays(weekStart, i));
		}
		return days;
	}, [showWeekView, dateObj, calendarDays]);

	// Group jobs by date
	const jobsByDate = useMemo(() => {
		const grouped = new Map<string, Job[]>();

		jobs.forEach((job) => {
			if (!job.scheduled_start) return;

			const startTime = new Date(job.scheduled_start);
			const dateKey = format(startTime, "yyyy-MM-dd");

			if (!grouped.has(dateKey)) {
				grouped.set(dateKey, []);
			}
			grouped.get(dateKey)?.push(job);
		});

		// Sort jobs within each day by start time
		grouped.forEach((jobList) => {
			jobList.sort((a, b) => {
				if (!a.scheduled_start) return 1;
				if (!b.scheduled_start) return -1;
				return new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime();
			});
		});

		return grouped;
	}, [jobs]);

	// Handlers
	const handleDayTap = useCallback((date: Date, dayJobs: Job[]) => {
		setSelectedDay({ date, jobs: dayJobs });
	}, []);

	const handleJobTap = useCallback((job: Job) => {
		setSelectedJob(job);
	}, []);

	const handleJobAction = useCallback((action: string, job: Job) => {
		console.log("Job action:", action, job);
		// TODO: Implement actual actions
		setSelectedJob(null);
	}, []);

	const handleDayAction = useCallback((action: string, date: Date) => {
		console.log("Day action:", action, date);
		// TODO: Implement actual actions (create appointment, view day, etc.)
		setSelectedDay(null);
	}, []);

	const isToday = isSameDay(dateObj, new Date());

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header: Month navigation */}
			<div className="shrink-0 border-b bg-background">
				<div className="flex items-center justify-between p-3 sm:p-4">
					{/* Previous month */}
					<Button
						className="h-9 w-9"
						onClick={navigatePrevious}
						size="icon"
						variant="ghost"
					>
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Previous month</span>
					</Button>

					{/* Current month/year */}
					<div className="flex flex-col items-center">
						<h2 className="text-base sm:text-lg font-semibold">
							{format(dateObj, showWeekView ? "MMM d - " : "MMMM yyyy")}
							{showWeekView && format(addDays(startOfWeek(dateObj), 6), "MMM d, yyyy")}
						</h2>
						<p className="text-xs text-muted-foreground">
							{jobsByDate.size} days with jobs
						</p>
					</div>

					{/* Next month */}
					<Button
						className="h-9 w-9"
						onClick={navigateNext}
						size="icon"
						variant="ghost"
					>
						<ChevronRight className="h-4 w-4" />
						<span className="sr-only">Next month</span>
					</Button>
				</div>

				{/* View toggle + Today button */}
				<div className="flex gap-2 px-3 sm:px-4 pb-3">
					<Button
						className="flex-1 h-8 text-xs"
						onClick={() => setShowWeekView(!showWeekView)}
						size="sm"
						variant="outline"
					>
						{showWeekView ? "Show Month" : "Show Week"}
					</Button>

					{!isToday && (
						<Button
							className="flex-1 h-8 text-xs"
							onClick={goToToday}
							size="sm"
							variant="outline"
						>
							Today
						</Button>
					)}
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="flex-1 overflow-auto">
				<div className="grid grid-cols-7 h-full">
					{/* Weekday Headers */}
					{WEEKDAYS.map((day, idx) => (
						<div
							className={cn(
								"sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-r border-b px-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase",
								(idx === 0 || idx === 6) && "bg-slate-200/80 dark:bg-slate-700/50",
							)}
							key={day}
						>
							<span className="hidden xs:inline">{day}</span>
							<span className="xs:hidden">{WEEKDAYS_SHORT[idx]}</span>
						</div>
					))}

					{/* Day Cells */}
					{weekDays.map((date) => {
						const dateKey = format(date, "yyyy-MM-dd");
						const dayJobs = jobsByDate.get(dateKey) || [];
						const isCurrentMonth = isSameMonth(date, dateObj);

						return (
							<DayCell
								date={date}
								isCurrentMonth={isCurrentMonth}
								jobs={dayJobs}
								key={date.toISOString()}
								onDayTap={handleDayTap}
								onJobTap={handleJobTap}
							/>
						);
					})}
				</div>
			</div>

			{/* Job Actions Bottom Sheet */}
			<JobActionsBottomSheet
				isOpen={selectedJob !== null}
				job={selectedJob}
				onAction={handleJobAction}
				onClose={() => setSelectedJob(null)}
			/>

			{/* Day Detail Bottom Sheet */}
			<DayDetailBottomSheet
				date={selectedDay?.date || null}
				isOpen={selectedDay !== null}
				jobs={selectedDay?.jobs || []}
				onAction={handleDayAction}
				onClose={() => setSelectedDay(null)}
				onJobTap={handleJobTap}
			/>
		</div>
	);
}
