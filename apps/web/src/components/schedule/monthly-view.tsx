"use client";

import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
	addDays,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import {
	Archive,
	Calendar,
	CheckCircle,
	CheckCircle2,
	Copy,
	ExternalLink,
	MapPin,
	Navigation,
	Truck,
	UserCheck,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateAppointmentTimes } from "@/actions/schedule-assignments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	PopoverContent,
	Popover as PopoverRoot,
	PopoverTrigger,
} from "@/components/ui/popover";
import { StandardFormField } from "@/components/ui/standard-form-field";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";
import {
	QuickAppointmentDialog,
	type TechnicianOption,
} from "./quick-appointment-dialog";
import { ScheduleCommandMenu } from "./schedule-command-menu";
import { ScheduleJobContextMenu } from "./schedule-job-context-menu";
import type { Job } from "./schedule-types";
import { UnassignedPanel } from "./unassigned-panel";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Job status color mapping
const getStatusColor = (status: Job["status"]) => {
	switch (status) {
		case "scheduled":
			return "bg-blue-500";
		case "dispatched":
			return "bg-sky-500";
		case "arrived":
			return "bg-emerald-400";
		case "in-progress":
			return "bg-amber-500 animate-pulse";
		case "closed":
			return "bg-emerald-600";
		case "completed":
			return "bg-emerald-600";
		case "cancelled":
			return "bg-slate-400";
		default:
			return "bg-slate-500";
	}
};

// Job type color mapping
const getJobTypeColor = (job: Job) => {
	const title = job.title.toLowerCase();

	if (title.includes("emergency") || title.includes("urgent")) {
		return "border-red-400 dark:border-red-700";
	}

	if (
		title.includes("callback") ||
		title.includes("follow-up") ||
		title.includes("followup")
	) {
		return "border-orange-400 dark:border-orange-700";
	}

	if (
		title.includes("meeting") ||
		title.includes("event") ||
		title.includes("training")
	) {
		return "border-purple-400 dark:border-purple-700";
	}

	if (
		title.includes("install") ||
		title.includes("setup") ||
		title.includes("new")
	) {
		return "border-green-400 dark:border-green-700";
	}

	if (title.includes("service") || title.includes("maintenance")) {
		return "border-blue-400 dark:border-blue-700";
	}

	return "border-slate-300 dark:border-slate-700";
};

// Compact job pill with tooltip details
const MonthlyJobPill = memo(function MonthlyJobPill({
	job,
	isDragOverlay = false,
	isSelected = false,
	onSelect,
}: {
	job: Job;
	isDragOverlay?: boolean;
	isSelected?: boolean;
	onSelect?: (jobId: string, shiftKey: boolean) => void;
}) {
	const router = useRouter();
	const [, setIsContextMenuOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editStartTime, setEditStartTime] = useState("");
	const [editEndTime, setEditEndTime] = useState("");
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: job.id,
			data: { job },
		});

	const style = {
		transform: CSS.Translate.toString(transform),
	};

	const startTime =
		job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
	const endTime =
		job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

	const handleOpenEdit = () => {
		setEditStartTime(format(startTime, "HH:mm"));
		setEditEndTime(format(endTime, "HH:mm"));
		setIsEditOpen(true);
	};

	const handleSaveEdit = async () => {
		const [startHours, startMinutes] = editStartTime.split(":").map(Number);
		const [endHours, endMinutes] = editEndTime.split(":").map(Number);

		const newStartTime = new Date(startTime);
		newStartTime.setHours(startHours, startMinutes, 0, 0);

		const newEndTime = new Date(endTime);
		newEndTime.setHours(endHours, endMinutes, 0, 0);

		const toastId = toast.loading("Updating appointment times...");
		const result = await updateAppointmentTimes(
			job.id,
			newStartTime,
			newEndTime,
		);

		if (result.success) {
			toast.success("Times updated", { id: toastId });
			setIsEditOpen(false);
		} else {
			toast.error(result.error || "Failed to update times", { id: toastId });
		}
	};

	const handleAction = async (
		action: string,
		actionFn: (id: string) => Promise<{ success: boolean; error?: string }>,
	) => {
		const toastId = toast.loading(`${action}...`);
		const result = await actionFn(job.id);

		if (result.success) {
			toast.success(`${action} successful`, { id: toastId });
		} else {
			toast.error(result.error || `Failed to ${action.toLowerCase()}`, {
				id: toastId,
			});
		}
	};

	// Get status icon
	const getStatusIcon = () => {
		switch (job.status) {
			case "dispatched":
				return <Truck className="size-3" />;
			case "arrived":
				return <Navigation className="size-3" />;
			case "closed":
				return <CheckCircle className="size-3" />;
			case "completed":
				return <CheckCircle2 className="size-3" />;
			default:
				return null;
		}
	};

	const pillContent = (
		<button
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={cn(
				"group bg-background relative flex w-full cursor-grab items-center gap-1.5 rounded-full border-2 px-2.5 py-1.5 text-left text-xs font-medium shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
				getJobTypeColor(job),
				isDragging && !isDragOverlay && "opacity-30",
				isDragOverlay && "ring-primary cursor-grabbing shadow-xl ring-2",
				isSelected && "ring-primary ring-2 ring-offset-1",
			)}
			onClick={(event) => {
				if (event.shiftKey && onSelect) {
					event.stopPropagation();
					onSelect(job.id, true);
				} else if (!event.shiftKey) {
					event.stopPropagation();
					handleOpenEdit();
				}
			}}
			type="button"
		>
			{/* Status Icon or Dot */}
			{getStatusIcon() ? (
				<div className={cn("shrink-0", getStatusColor(job.status))}>
					{getStatusIcon()}
				</div>
			) : (
				<div
					className={cn(
						"size-1.5 shrink-0 rounded-full",
						getStatusColor(job.status),
					)}
				/>
			)}

			{/* Time */}
			<span className="shrink-0 text-[10px] font-medium">
				{format(startTime, "h:mm a")}
			</span>

			{/* Customer Name */}
			<span className="truncate text-[11px] font-semibold">
				{job.customer?.name || "Unknown"}
			</span>

			{/* Mini Technician Avatars */}
			{job.assignments.length > 0 && (
				<div className="ml-auto flex shrink-0 -space-x-1">
					{job.assignments.slice(0, 2).map((tech, idx) => (
						<Avatar
							className="border-background size-4 border"
							key={tech.technicianId || idx}
						>
							<AvatarFallback className="text-[8px]">
								{tech.displayName?.slice(0, 2).toUpperCase() || "?"}
							</AvatarFallback>
						</Avatar>
					))}
					{job.assignments.length > 2 && (
						<div className="border-background bg-muted flex size-4 items-center justify-center rounded-full border text-[7px] font-medium">
							+{job.assignments.length - 2}
						</div>
					)}
				</div>
			)}
		</button>
	);

	const tooltipContent = (
		<div className="space-y-2">
			<div>
				<p className="text-sm font-semibold">
					{job.customer?.name || "Unknown Customer"}
				</p>
				<p className="text-muted-foreground text-xs">{job.title}</p>
			</div>
			<div className="space-y-1 text-xs">
				<p>
					<span className="font-medium">Time:</span>{" "}
					{format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
				</p>
				{job.location?.address?.street && (
					<p>
						<span className="font-medium">Location:</span>{" "}
						{job.location.address.street}
					</p>
				)}
				{job.assignments.length > 0 && (
					<p>
						<span className="font-medium">Team:</span>{" "}
						{job.assignments.map((a) => a.displayName).join(", ")}
					</p>
				)}
			</div>
		</div>
	);

	if (isDragOverlay) {
		return pillContent;
	}

	const startInputId = `monthly-start-${job.id}`;
	const endInputId = `monthly-end-${job.id}`;

	return (
		<PopoverRoot onOpenChange={setIsEditOpen} open={isEditOpen}>
			<TooltipProvider>
				<Tooltip delayDuration={200}>
					<ScheduleJobContextMenu job={job} onOpenChange={setIsContextMenuOpen}>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>{pillContent}</PopoverTrigger>
						</TooltipTrigger>
					</ScheduleJobContextMenu>
					<TooltipContent className="max-w-xs" side="top">
						{tooltipContent}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<PopoverContent align="start" className="w-80">
				<div className="space-y-4">
					<div>
						<h4 className="text-sm font-semibold">Quick Edit Times</h4>
						<p className="text-muted-foreground text-xs">
							{job.customer?.name || "Unknown Customer"}
						</p>
					</div>

					<div className="grid gap-3">
						<StandardFormField label="Start Time" htmlFor={startInputId}>
							<Input
								id={startInputId}
								onChange={(e) => setEditStartTime(e.target.value)}
								type="time"
								value={editStartTime}
							/>
						</StandardFormField>

						<StandardFormField label="End Time" htmlFor={endInputId}>
							<Input
								id={endInputId}
								onChange={(e) => setEditEndTime(e.target.value)}
								type="time"
								value={editEndTime}
							/>
						</StandardFormField>
					</div>

					<div className="flex gap-2">
						<Button className="flex-1" onClick={handleSaveEdit} size="sm">
							Save
						</Button>
						<Button
							className="flex-1"
							onClick={() => setIsEditOpen(false)}
							size="sm"
							variant="outline"
						>
							Cancel
						</Button>
					</div>
				</div>
			</PopoverContent>
		</PopoverRoot>
	);
});

const DayCell = memo(function DayCell({
	date,
	jobs,
	isCurrentMonth,
	isSelectedDate,
	selectedJobIds,
	onJobSelect,
	onOpenCommandMenu,
	onDoubleClick,
}: {
	date: Date;
	jobs: Job[];
	isCurrentMonth: boolean;
	isSelectedDate: boolean;
	selectedJobIds?: Set<string>;
	onJobSelect?: (jobId: string, shiftKey: boolean) => void;
	onOpenCommandMenu?: (date: Date) => void;
	onDoubleClick?: (date: Date) => void;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: `day-${date.toISOString()}`,
		data: { date },
	});

	const isCurrentDay = isToday(date);
	const hasJobs = jobs.length > 0;

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		onOpenCommandMenu?.(date);
	};

	const handleDoubleClick = (e: React.MouseEvent) => {
		// Don't trigger if double-clicking on a job pill
		if ((e.target as HTMLElement).closest("[data-job-pill]")) return;
		onDoubleClick?.(date);
	};

	// Calculate day metrics
	const totalHours = useMemo(
		() =>
			jobs.reduce((sum, job) => {
				const start =
					job.startTime instanceof Date
						? job.startTime
						: new Date(job.startTime);
				const end =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
				return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
			}, 0),
		[jobs],
	);

	const isWeekend = date.getDay() === 0 || date.getDay() === 6;

	return (
		<div
			className={cn(
				"border-border/50 relative flex h-[140px] cursor-context-menu flex-col border p-3 transition-all duration-200",
				!isCurrentMonth && "bg-muted/50 opacity-60",
				isOver && "bg-primary/10 ring-primary ring-2 ring-inset",
				isCurrentDay &&
					"bg-blue-50 ring-2 ring-blue-500/30 dark:bg-blue-950/30",
				isSelectedDate &&
					!isCurrentDay &&
					"bg-emerald-50 ring-2 ring-emerald-500/50 dark:bg-emerald-950/30",
				isWeekend && !isCurrentDay && "bg-slate-100/80 dark:bg-slate-800/30",
			)}
			onContextMenu={handleContextMenu}
			onDoubleClick={handleDoubleClick}
			ref={setNodeRef}
		>
			{/* Date Number & Metrics */}
			<div className="group/header mb-2 flex shrink-0 items-center justify-between gap-2">
				<TooltipProvider>
					<Tooltip delayDuration={300}>
						<TooltipTrigger asChild>
							<span
								className={cn(
									"flex size-7 items-center justify-center rounded-full text-base font-bold transition-all",
									isCurrentDay && "bg-blue-500 text-white shadow-md",
									isSelectedDate &&
										!isCurrentDay &&
										"bg-emerald-500 text-white shadow-md",
									!(isCurrentDay || isSelectedDate || isCurrentMonth) &&
										"text-muted-foreground/60",
									!(isCurrentDay || isSelectedDate) &&
										isCurrentMonth &&
										"text-foreground",
								)}
							>
								{format(date, "d")}
							</span>
						</TooltipTrigger>
						{hasJobs && (
							<TooltipContent className="w-64" side="top">
								<div className="space-y-2">
									<div className="flex items-center justify-between border-b pb-2">
										<p className="text-sm font-semibold">
											{format(date, "EEEE, MMM d")}
										</p>
										<Badge variant="secondary">{jobs.length} jobs</Badge>
									</div>
									<div className="space-y-1 text-xs">
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Total Hours:
											</span>
											<span className="font-medium">
												{totalHours.toFixed(1)}h
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Avg Duration:
											</span>
											<span className="font-medium">
												{(totalHours / jobs.length).toFixed(1)}h
											</span>
										</div>
										<div className="mt-2 space-y-1 border-t pt-2">
											<p className="text-xs font-medium">Status Breakdown:</p>
											{Object.entries(
												jobs.reduce(
													(acc, job) => {
														acc[job.status || "scheduled"] =
															(acc[job.status || "scheduled"] || 0) + 1;
														return acc;
													},
													{} as Record<string, number>,
												),
											).map(([status, count]) => (
												<div className="flex justify-between" key={status}>
													<span className="text-muted-foreground capitalize">
														{status}:
													</span>
													<span className="font-medium">{count}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>

				{/* Day Metrics Badge */}
				{hasJobs && (
					<Badge
						className="h-5 px-2 text-[10px] font-semibold"
						variant="secondary"
					>
						{jobs.length} jobs · {totalHours.toFixed(1)}h
					</Badge>
				)}
			</div>

			{/* Drop Zone Indicator */}
			{isOver && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
					<div className="fade-in zoom-in-95 animate-in bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-semibold shadow-lg duration-200">
						Drop to schedule
					</div>
				</div>
			)}

			{/* Jobs - Scrollable Pills */}
			<div className="flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto">
				{jobs.map((job) => (
					<MonthlyJobPill
						isSelected={selectedJobIds?.has(job.id)}
						job={job}
						key={job.id}
						onSelect={onJobSelect}
					/>
				))}
			</div>
		</div>
	);
});

export function MonthlyView() {
	const [activeJobId, setActiveJobId] = useState<string | null>(null);
	const [unassignedPanelOpen, setUnassignedPanelOpen] = useState(false);
	const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
	const [commandMenuOpen, setCommandMenuOpen] = useState(false);
	const [commandMenuDate, setCommandMenuDate] = useState<Date | null>(null);
	const [showQuickAppointment, setShowQuickAppointment] = useState(false);
	const [quickAppointmentDate, setQuickAppointmentDate] = useState<Date | null>(
		null,
	);
	const { currentDate } = useScheduleViewStore();

	// Multi-select handler
	const handleJobSelect = useCallback((jobId: string, shiftKey: boolean) => {
		setSelectedJobIds((prev) => {
			const newSet = new Set(prev);
			if (shiftKey) {
				// Toggle selection
				if (newSet.has(jobId)) {
					newSet.delete(jobId);
				} else {
					newSet.add(jobId);
				}
			} else {
				// Single select (clear others)
				newSet.clear();
				newSet.add(jobId);
			}
			return newSet;
		});
	}, []);

	// Command menu handler
	const handleOpenCommandMenu = useCallback((date: Date) => {
		setCommandMenuDate(date);
		setCommandMenuOpen(true);
	}, []);

	// Quick appointment handler (double-click on day)
	const handleDayDoubleClick = useCallback((date: Date) => {
		// Set default time to 9 AM on the clicked date
		const appointmentDate = new Date(date);
		appointmentDate.setHours(9, 0, 0, 0);
		setQuickAppointmentDate(appointmentDate);
		setShowQuickAppointment(true);
	}, []);

	const {
		getAllJobs,
		moveJob,
		isLoading,
		loadMoreUnassignedJobs,
		unassignedHasMore,
		unassignedSearch,
		isLoadingUnassigned,
		unassignedTotalCount,
	} = useSchedule();

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 200, tolerance: 6 },
		}),
		useSensor(KeyboardSensor, {
			// Arrow keys for keyboard navigation
			coordinateGetter: (event, { context }) => {
				// Default keyboard navigation for calendar view
				return { x: 0, y: 0 };
			},
		}),
	);

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

	// Group jobs by date and separate unassigned
	const { jobsByDate, unassignedJobs } = useMemo(() => {
		const allJobs = getAllJobs();
		const grouped = new Map<string, Job[]>();
		const unassigned: Job[] = [];

		for (const job of allJobs) {
			// If no technician assigned, it's unscheduled
			if (!job.technicianId) {
				unassigned.push(job);
				continue;
			}

			const startTime =
				job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const dateKey = format(startTime, "yyyy-MM-dd");

			if (!grouped.has(dateKey)) {
				grouped.set(dateKey, []);
			}
			grouped.get(dateKey)?.push(job);
		}

		return { jobsByDate: grouped, unassignedJobs: unassigned };
	}, [getAllJobs]);
	const showUnassignedPanel =
		unassignedJobs.length > 0 ||
		unassignedHasMore ||
		unassignedSearch.length > 0;

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveJobId(event.active.id as string);
	}, []);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;

			setActiveJobId(null);

			if (!over) {
				return;
			}

			const jobId = active.id as string;
			const dropData = over.data.current as { date: Date } | undefined;

			if (!dropData?.date) {
				return;
			}

			const allJobs = getAllJobs();
			const job = allJobs.find((j) => j.id === jobId);

			if (!job) {
				return;
			}

			const oldStart =
				job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const oldEnd =
				job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
			const duration = oldEnd.getTime() - oldStart.getTime();

			// Create new start time on the dropped date, keeping the same time of day
			const newStart = new Date(dropData.date);
			newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);
			const newEnd = new Date(newStart.getTime() + duration);

			// Optimistic update
			moveJob(jobId, job.technicianId, newStart, newEnd);

			const toastId = toast.loading(
				`Moving to ${format(dropData.date, "MMM d")}...`,
			);

			const result = await updateAppointmentTimes(jobId, newStart, newEnd);

			if (result.success) {
				toast.success(`Moved to ${format(dropData.date, "MMM d")}`, {
					id: toastId,
				});
			} else {
				toast.error(result.error || "Failed to move appointment", {
					id: toastId,
				});
			}
		},
		[getAllJobs, moveJob],
	);

	const activeJob = useMemo(() => {
		if (!activeJobId) {
			return null;
		}
		return getAllJobs().find((j) => j.id === activeJobId);
	}, [activeJobId, getAllJobs]);

	const handleUnassignedSearch = useCallback(
		(value: string) => {
			loadMoreUnassignedJobs({ reset: true, search: value });
		},
		[loadMoreUnassignedJobs],
	);

	const handleLoadMoreUnassigned = useCallback(() => {
		loadMoreUnassignedJobs({ search: unassignedSearch });
	}, [loadMoreUnassignedJobs, unassignedSearch]);

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-muted-foreground">Loading schedule...</div>
			</div>
		);
	}

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			sensors={sensors}
		>
			<div className="flex h-full overflow-hidden">
				{/* Unscheduled Panel */}
				{showUnassignedPanel && (
					<UnassignedPanel
						activeJobId={activeJobId}
						hasMore={unassignedHasMore}
						isLoadingMore={isLoadingUnassigned}
						isOpen={unassignedPanelOpen}
						onLoadMore={handleLoadMoreUnassigned}
						onSearchChange={handleUnassignedSearch}
						onToggle={() => setUnassignedPanelOpen(!unassignedPanelOpen)}
						searchQuery={unassignedSearch}
						totalCount={unassignedTotalCount}
						unassignedJobs={unassignedJobs}
					/>
				)}

				{/* Calendar Grid */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<div className="flex-1 overflow-auto">
						<div className="grid min-h-full grid-cols-7">
							{/* Weekday Headers */}
							{WEEKDAYS.map((day, idx) => (
								<div
									className={cn(
										"bg-muted/50 sticky top-0 z-30 border-r border-b-2 px-4 py-3 text-center text-sm font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm",
										(idx === 0 || idx === 6) &&
											"bg-slate-200/80 dark:bg-slate-700/50",
									)}
									key={day}
								>
									{day}
								</div>
							))}

							{/* Day Cells - Fixed Height Rows */}
							{calendarDays.map((date, idx) => {
								const dateKey = format(date, "yyyy-MM-dd");
								const jobs = jobsByDate.get(dateKey) || [];
								const isCurrentMonth = isSameMonth(date, dateObj);
								const isSelectedDate = isSameDay(date, dateObj);
								const _rowIndex = Math.floor(idx / 7);

								return (
									<DayCell
										date={date}
										isCurrentMonth={isCurrentMonth}
										isSelectedDate={isSelectedDate}
										jobs={jobs}
										key={date.toISOString()}
										onDoubleClick={handleDayDoubleClick}
										onJobSelect={handleJobSelect}
										onOpenCommandMenu={handleOpenCommandMenu}
										selectedJobIds={selectedJobIds}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Command Menu */}
			<ScheduleCommandMenu
				isOpen={commandMenuOpen}
				onClose={() => setCommandMenuOpen(false)}
				selectedDate={commandMenuDate}
				unassignedJobs={unassignedJobs}
			/>

			{/* Quick Appointment Dialog */}
			<QuickAppointmentDialog
				open={showQuickAppointment}
				onOpenChange={setShowQuickAppointment}
				defaultDateTime={quickAppointmentDate || undefined}
				onSuccess={() => {
					setShowQuickAppointment(false);
					toast.success("Appointment created");
				}}
			/>

			{/* Drag Overlay with Enhanced Visual */}
			<DragOverlay
				dropAnimation={{
					duration: 200,
					easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
				}}
			>
				{activeJob ? (
					<div className="relative">
						{/* Drag Ghost */}
						<MonthlyJobPill isDragOverlay job={activeJob} />
						{/* Snap Guide Indicator */}
						<div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2">
							<div className="bg-primary text-primary-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] shadow-lg">
								<span>Drop to reschedule</span>
							</div>
						</div>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
