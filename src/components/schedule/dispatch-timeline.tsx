"use client";

import {
	DndContext,
	type DragEndEvent,
	type DragMoveEvent,
	DragOverlay,
	type DragStartEvent,
	MouseSensor,
	TouchSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Car, ChevronRight, Clock, MapPin, Plus, Repeat, User } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	assignJobToTechnician,
	updateAppointmentTimes,
} from "@/actions/schedule-assignments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScheduleJobContextMenu } from "./schedule-job-context-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule, useScheduleRealtime } from "@/hooks/use-schedule";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";
import { ScheduleCommandMenu } from "./schedule-command-menu";
import type { Job, Technician } from "./schedule-types";
import { TeamAvatarGroup } from "./team-avatar-manager";
import { UnassignedPanel } from "./unassigned-panel";

const HOUR_WIDTH = 80;
const LANE_HEIGHT = 70; // More compact
const SIDEBAR_WIDTH = 220;
const JOB_HEIGHT = 48; // Narrower job cards
const JOB_STACK_OFFSET = 6;
const STACK_GAP = 4;
const BASE_CENTER_OFFSET = Math.max(STACK_GAP, (LANE_HEIGHT - JOB_HEIGHT) / 2);
const UNASSIGNED_DROP_ID = "unassigned-dropzone";
const SNAP_INTERVAL_MINUTES = 15;
const LARGE_SNAP_MINUTES = 60;
const AUTO_SCROLL_EDGE = 160;
const AUTO_SCROLL_MAX_SPEED = 28;

type ClientPointerEvent = {
	clientX: number;
	clientY: number;
};

const hasClientCoordinates = (event: unknown): event is ClientPointerEvent => {
	if (!event || typeof event !== "object") {
		return false;
	}

	const candidate = event as Record<string, unknown>;
	return (
		typeof candidate.clientX === "number" &&
		typeof candidate.clientY === "number"
	);
};

// Priority-based color mapping (takes precedence)
const getPriorityColor = (priority: Job["priority"]) => {
	switch (priority) {
		case "urgent":
			return "border-l-4 border-l-red-500 border-red-400 dark:border-red-700";
		case "high":
			return "border-l-4 border-l-orange-500 border-orange-400 dark:border-orange-700";
		case "medium":
			return "border-l-4 border-l-yellow-500 border-yellow-400 dark:border-yellow-700";
		case "low":
		default:
			return "border-slate-300 dark:border-slate-600";
	}
};

// Get job type color based on priority first, then title keywords
const getJobTypeColor = (job: Job) => {
	// Priority takes precedence for urgent/high jobs
	if (job.priority === "urgent" || job.priority === "high") {
		return getPriorityColor(job.priority);
	}

	const title = job.title.toLowerCase();

	// Emergency/Urgent keywords (fallback if priority not set)
	if (title.includes("emergency") || title.includes("urgent")) {
		return "border-l-4 border-l-red-500 border-red-400 dark:border-red-700";
	}

	// Callbacks/Follow-ups - Muted Orange
	if (
		title.includes("callback") ||
		title.includes("follow-up") ||
		title.includes("followup")
	) {
		return "border-orange-400 dark:border-orange-700";
	}

	// Meetings/Events/Training - Muted Purple
	if (
		title.includes("meeting") ||
		title.includes("event") ||
		title.includes("training")
	) {
		return "border-purple-400 dark:border-purple-700";
	}

	// Installation/Setup/New - Muted Green
	if (
		title.includes("install") ||
		title.includes("setup") ||
		title.includes("new")
	) {
		return "border-green-400 dark:border-green-700";
	}

	// Maintenance/Service/Inspection - Muted Blue
	if (
		title.includes("maintenance") ||
		title.includes("service") ||
		title.includes("inspection")
	) {
		return "border-blue-400 dark:border-blue-700";
	}

	// Use priority color if set, otherwise default
	if (job.priority && job.priority !== "low") {
		return getPriorityColor(job.priority);
	}

	// Default - Neutral Gray
	return "border-slate-300 dark:border-slate-600";
};

type JobWithPosition = {
	job: Job;
	left: number;
	width: number;
	top: number;
	lane: number;
	hasOverlap: boolean;
};

// Travel time gap between consecutive jobs
type TravelGap = {
	fromJobId: string;
	toJobId: string;
	fromJob: Job;
	toJob: Job;
	gapMinutes: number; // Time gap between jobs
	estimatedTravelMinutes: number; // Estimated travel based on distance or default
	leftPosition: number; // Pixel position for indicator
	width: number; // Width of the gap in pixels
	isTight: boolean; // True if gap < estimated travel time
	isInsufficient: boolean; // True if gap significantly less than needed
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number {
	const R = 3959; // Earth's radius in miles
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

// Estimate travel time based on distance (assumes ~25 mph average in urban areas)
function estimateTravelTime(distanceMiles: number): number {
	const averageSpeedMph = 25;
	return Math.ceil((distanceMiles / averageSpeedMph) * 60); // minutes
}

// Calculate travel gaps between consecutive jobs
function calculateTravelGaps(
	jobs: JobWithPosition[],
	hourWidth: number,
): TravelGap[] {
	if (jobs.length < 2) return [];

	// Sort jobs by start time (left position)
	const sortedJobs = [...jobs].sort((a, b) => a.left - b.left);
	const gaps: TravelGap[] = [];

	for (let i = 0; i < sortedJobs.length - 1; i++) {
		const currentJob = sortedJobs[i];
		const nextJob = sortedJobs[i + 1];

		// Skip if jobs overlap (lane stacking)
		if (currentJob.left + currentJob.width > nextJob.left) {
			continue;
		}

		const currentEnd =
			currentJob.job.endTime instanceof Date
				? currentJob.job.endTime
				: new Date(currentJob.job.endTime);
		const nextStart =
			nextJob.job.startTime instanceof Date
				? nextJob.job.startTime
				: new Date(nextJob.job.startTime);

		const gapMinutes = Math.round(
			(nextStart.getTime() - currentEnd.getTime()) / (1000 * 60),
		);

		// Only show gaps >= 15 minutes (significant travel opportunity)
		if (gapMinutes < 15) continue;

		// Calculate estimated travel time based on distance
		let estimatedTravelMinutes = 15; // Default minimum
		const currentCoords = currentJob.job.location?.coordinates;
		const nextCoords = nextJob.job.location?.coordinates;

		if (currentCoords?.lat && currentCoords?.lng && nextCoords?.lat && nextCoords?.lng) {
			const distance = calculateDistance(
				currentCoords.lat,
				currentCoords.lng,
				nextCoords.lat,
				nextCoords.lng,
			);
			estimatedTravelMinutes = Math.max(5, estimateTravelTime(distance));
		}

		const leftPosition = currentJob.left + currentJob.width;
		const width = nextJob.left - leftPosition;

		gaps.push({
			fromJobId: currentJob.job.id,
			toJobId: nextJob.job.id,
			fromJob: currentJob.job,
			toJob: nextJob.job,
			gapMinutes,
			estimatedTravelMinutes,
			leftPosition,
			width,
			isTight: gapMinutes < estimatedTravelMinutes * 1.5,
			isInsufficient: gapMinutes < estimatedTravelMinutes,
		});
	}

	return gaps;
}

// Travel time indicator component
const TravelTimeIndicator = memo(function TravelTimeIndicator({
	gap,
}: {
	gap: TravelGap;
}) {
	// Only show if gap is at least 30 pixels wide (to fit content)
	if (gap.width < 30) return null;

	const formatDuration = (minutes: number): string => {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	};

	return (
		<TooltipProvider>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<div
						className="absolute flex items-center justify-center"
						style={{
							left: `${gap.leftPosition}px`,
							width: `${gap.width}px`,
							top: "50%",
							transform: "translateY(-50%)",
							height: "32px",
						}}
					>
						<div
							className={cn(
								"flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium shadow-sm",
								gap.isInsufficient
									? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
									: gap.isTight
										? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
										: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
							)}
						>
							<Car className="size-3" />
							<span>{formatDuration(gap.gapMinutes)}</span>
						</div>
					</div>
				</TooltipTrigger>
				<TooltipContent className="max-w-64" side="top" sideOffset={4}>
					<div className="space-y-1.5 text-xs">
						<div className="font-semibold">Travel Time Gap</div>
						<div className="text-muted-foreground">
							<span className="font-medium text-foreground">
								{formatDuration(gap.gapMinutes)}
							</span>{" "}
							available between jobs
						</div>
						<div className="text-muted-foreground">
							Est. travel:{" "}
							<span className="font-medium text-foreground">
								{formatDuration(gap.estimatedTravelMinutes)}
							</span>
						</div>
						{gap.isInsufficient && (
							<div className="text-red-600 dark:text-red-400 font-medium">
								⚠ Insufficient travel time
							</div>
						)}
						{gap.isTight && !gap.isInsufficient && (
							<div className="text-orange-600 dark:text-orange-400 font-medium">
								⚠ Tight schedule
							</div>
						)}
						<div className="border-t pt-1.5 mt-1.5 text-muted-foreground">
							<div>
								From: {gap.fromJob.customer?.name || "Unknown"} (ends{" "}
								{format(
									gap.fromJob.endTime instanceof Date
										? gap.fromJob.endTime
										: new Date(gap.fromJob.endTime),
									"h:mm a",
								)}
								)
							</div>
							<div>
								To: {gap.toJob.customer?.name || "Unknown"} (starts{" "}
								{format(
									gap.toJob.startTime instanceof Date
										? gap.toJob.startTime
										: new Date(gap.toJob.startTime),
									"h:mm a",
								)}
								)
							</div>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
});

function detectOverlaps(
	jobs: Array<{ job: Job; left: number; width: number }>,
): JobWithPosition[] {
	const positioned: JobWithPosition[] = [];

	// Sort by start time
	const sorted = [...jobs].sort((a, b) => a.left - b.left);

	sorted.forEach(({ job, left, width }) => {
		const right = left + width;

		// Find all jobs this one overlaps with
		const overlapping = positioned.filter((p) => {
			const pRight = p.left + p.width;
			return !(right <= p.left || left >= pRight);
		});

		if (overlapping.length > 0) {
			overlapping.forEach((p) => {
				if (!p.hasOverlap) {
					p.hasOverlap = true;
				}
			});
		}

		// Find the first available lane (row)
		let lane = 0;
		const usedLanes = new Set(overlapping.map((p) => p.lane));
		while (usedLanes.has(lane)) {
			lane++;
		}

		positioned.push({
			job,
			left,
			width,
			top: lane * (JOB_HEIGHT + STACK_GAP),
			lane,
			hasOverlap: overlapping.length > 0,
		});
	});

	return positioned;
}

const JobCard = memo(function JobCard({
	job,
	left,
	width,
	top,
	hasOverlap,
	isSelected,
	onSelect,
	onHover,
	onResize,
	onResizeComplete,
}: {
	job: Job;
	left: number;
	width: number;
	top: number;
	hasOverlap: boolean;
	isSelected: boolean;
	onSelect: () => void;
	onHover: (isHovering: boolean) => void;
	onResize: (
		jobId: string,
		direction: "start" | "end",
		deltaMinutes: number,
	) => void;
	onResizeComplete: (jobId: string, hasChanges: boolean) => void;
}) {
	const [isResizing, setIsResizing] = useState(false);
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: job.id,
			data: { job },
			disabled: isResizing,
		});

	const topOffset =
		(top > 0 || hasOverlap ? STACK_GAP : BASE_CENTER_OFFSET) + top;

	const style = {
		left: `${left}px`,
		width: `${width}px`,
		top: `${topOffset}px`,
		height: `${JOB_HEIGHT}px`,
		transform: CSS.Translate.toString(transform),
		zIndex: isDragging ? 50 : isSelected ? 20 : 10 - top / JOB_STACK_OFFSET,
	};

	const startTime =
		job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
	const endTime =
		job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
	const duration = Math.round(
		(endTime.getTime() - startTime.getTime()) / (1000 * 60),
	);

	const borderColor = getJobTypeColor(job);

	const handleResizeStart = (
		e: React.MouseEvent,
		direction: "start" | "end",
	) => {
		e.stopPropagation();
		setIsResizing(true);
		onHover(true); // Keep hover state active during resize

		const startX = e.clientX;
		let totalDelta = 0;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const deltaX = moveEvent.clientX - startX;
			const deltaMinutes = Math.round((deltaX / HOUR_WIDTH) * 60);

			// Snap to 15-minute intervals
			const snappedMinutes = Math.round(deltaMinutes / 15) * 15;

			if (snappedMinutes !== totalDelta) {
				totalDelta = snappedMinutes;
				onResize(job.id, direction, snappedMinutes);
			}
		};

		const handleMouseUp = () => {
			setIsResizing(false);
			onHover(false);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);

			onResizeComplete(job.id, totalDelta !== 0);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<TooltipProvider>
			<Tooltip delayDuration={200} open={isContextMenuOpen ? false : undefined}>
				<TooltipTrigger asChild>
					<div
						className="group absolute"
						ref={setNodeRef}
						style={style}
						{...attributes}
						{...listeners}
						onMouseEnter={() => onHover(true)}
						onMouseLeave={() => onHover(false)}
					>
						{/* Left Resize Handle */}
						<div
							className="bg-primary absolute top-0 left-0 h-full w-1 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
							onMouseDown={(e) => handleResizeStart(e, "start")}
							style={{ zIndex: 60 }}
						/>

						<ScheduleJobContextMenu job={job} onOpenChange={setIsContextMenuOpen}>
							<div
								className={cn(
									"bg-card relative flex h-full cursor-grab items-center gap-2 rounded-md border px-2.5 py-1.5 transition-all hover:shadow-sm active:cursor-grabbing",
									borderColor,
									job.isUnassigned && "!border-red-500",
									isSelected && "ring-primary shadow-md ring-1",
									isDragging && "shadow-lg",
									(job.status === "completed" || job.status === "closed") &&
										"opacity-50",
								)}
								onClick={onSelect}
							>
								{/* Overlap indicator */}
								{hasOverlap && (
									<div className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white">
										!
									</div>
								)}

								{/* Recurring job indicator */}
								{job.recurrence && (
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="absolute -top-1 left-1 flex size-3.5 items-center justify-center rounded-full bg-violet-500">
												<Repeat className="size-2 text-white" />
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											<div className="flex flex-col gap-0.5">
												<span className="font-medium">Recurring Job</span>
												<span className="text-muted-foreground">
													{job.recurrence.frequency === "daily"
														? `Every ${job.recurrence.interval > 1 ? `${job.recurrence.interval} days` : "day"}`
														: job.recurrence.frequency === "weekly"
															? `Every ${job.recurrence.interval > 1 ? `${job.recurrence.interval} weeks` : "week"}`
															: job.recurrence.frequency === "monthly"
																? `Every ${job.recurrence.interval > 1 ? `${job.recurrence.interval} months` : "month"}`
																: `Every ${job.recurrence.interval > 1 ? `${job.recurrence.interval} years` : "year"}`}
												</span>
											</div>
										</TooltipContent>
									</Tooltip>
								)}

								{/* Customer Name - Primary */}
								<span className="text-foreground flex-1 truncate text-xs font-semibold">
									{job.customer?.name || "Unknown Customer"}
								</span>

								{/* Team Avatars */}
								<TeamAvatarGroup
									assignments={job.assignments}
									maxVisible={3}
									onAddMember={() => {
										// TODO: Implement add team member
									}}
									onRemove={(_techId) => {
										// TODO: Implement remove team member
									}}
								/>

								{/* Status dot */}
								<div
									className={cn(
										"size-1.5 shrink-0 rounded-full",
										job.status === "scheduled" && "bg-blue-500",
										job.status === "dispatched" && "bg-sky-500",
										job.status === "arrived" && "bg-emerald-400",
										job.status === "in-progress" &&
											"animate-pulse bg-amber-500",
										job.status === "closed" && "bg-emerald-600",
										job.status === "completed" && "bg-emerald-500",
										job.status === "cancelled" && "bg-slate-400",
									)}
								/>
							</div>
						</ScheduleJobContextMenu>

						{/* Right Resize Handle */}
						<div
							className="bg-primary absolute top-0 right-0 h-full w-1 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
							onMouseDown={(e) => handleResizeStart(e, "end")}
							style={{ zIndex: 60 }}
						/>
					</div>
				</TooltipTrigger>
				<TooltipContent className="w-72 p-0" side="top" sideOffset={8}>
					<div className="bg-card overflow-hidden rounded-lg border shadow-lg">
						{/* Header */}
						<div className="border-b px-4 py-3">
							<div className="mb-1 flex items-center justify-between gap-2">
								<h4 className="text-foreground text-base font-bold">
									{job.customer?.name || "Unknown Customer"}
								</h4>
								<div className="flex items-center gap-1.5">
									{job.recurrence && (
										<Badge
											className="gap-0.5 bg-violet-100 px-1.5 py-0 text-[10px] text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
											variant="outline"
										>
											<Repeat className="size-2.5" />
											Recurring
										</Badge>
									)}
									<Badge className="text-[10px] capitalize" variant="outline">
										{job.status}
									</Badge>
								</div>
							</div>
							<p className="text-muted-foreground text-sm">{job.title}</p>
						</div>

						{/* Content */}
						<div className="space-y-3 p-4">
							{/* Time */}
							<div className="flex items-center gap-2.5">
								<Clock className="text-muted-foreground size-4" />
								<div>
									<p className="text-foreground text-sm font-medium">
										{format(startTime, "h:mm a")} – {format(endTime, "h:mm a")}
									</p>
									<p className="text-muted-foreground text-xs">
										{format(startTime, "EEE, MMM d")} • {duration} min
									</p>
								</div>
							</div>

							{/* Location */}
							{job.location?.address?.street && (
								<div className="flex items-start gap-2.5">
									<MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
									<div className="min-w-0 flex-1">
										<p className="text-foreground text-sm font-medium">
											{job.location.address.street}
										</p>
										{job.location.address.city && (
											<p className="text-muted-foreground text-xs">
												{job.location.address.city},{" "}
												{job.location.address.state}
											</p>
										)}
									</div>
								</div>
							)}

							{/* Contact */}
							{job.customer?.phone && (
								<div className="flex items-center gap-2.5">
									<User className="text-muted-foreground size-4" />
									<p className="text-foreground text-sm font-medium">
										{job.customer.phone}
									</p>
								</div>
							)}

							{/* Team */}
							{job.assignments.length > 0 && (
								<div className="flex flex-wrap gap-1.5 border-t pt-2">
									{job.assignments.map((assignment, idx) => (
										<div
											className="bg-muted flex items-center gap-1 rounded-md px-2 py-1"
											key={idx}
										>
											<div
												className={cn(
													"size-1.5 rounded-full",
													assignment.status === "available" && "bg-green-500",
													assignment.status === "on-job" && "bg-amber-500",
													assignment.status === "on-break" && "bg-slate-400",
												)}
											/>
											<span className="text-foreground text-xs font-medium">
												{assignment.displayName}
											</span>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Action */}
						{job.jobId && (
							<div className="border-t p-3">
								<a
									className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
									href={`/dashboard/work/${job.jobId}`}
									onClick={(e) => e.stopPropagation()}
								>
									View Details
									<ChevronRight className="size-3.5" />
								</a>
							</div>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
});

const TechnicianLane = memo(function TechnicianLane({
	technician,
	jobs,
	height,
	selectedJobId,
	onSelectJob,
	onJobHover,
	onResize,
	onResizeComplete,
	isDragActive,
	onDoubleClick,
	totalWidth,
	timeRangeStart,
}: {
	technician: Technician;
	jobs: JobWithPosition[];
	height: number;
	selectedJobId: string | null;
	onSelectJob: (jobId: string) => void;
	onJobHover: (isHovering: boolean) => void;
	onResize: (
		jobId: string,
		direction: "start" | "end",
		deltaMinutes: number,
	) => void;
	onResizeComplete: (jobId: string, hasChanges: boolean) => void;
	isDragActive: boolean;
	onDoubleClick: (technicianId: string, startTime: Date) => void;
	totalWidth: number;
	timeRangeStart: Date;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: technician.id,
		data: { technician },
	});

	// Calculate travel gaps between consecutive jobs
	const travelGaps = useMemo(
		() => calculateTravelGaps(jobs, HOUR_WIDTH),
		[jobs],
	);

	// Handle double-click to create new job
	const handleDoubleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			// Only trigger on empty space (not on job cards)
			if ((e.target as HTMLElement).closest(".job-card")) {
				return;
			}

			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const minutesFromStart = (clickX / totalWidth) * (24 * 60);

			// Snap to 15-minute intervals
			const snappedMinutes = Math.round(minutesFromStart / 15) * 15;

			const newStartTime = new Date(timeRangeStart);
			newStartTime.setMinutes(newStartTime.getMinutes() + snappedMinutes);

			onDoubleClick(technician.id, newStartTime);
		},
		[totalWidth, timeRangeStart, technician.id, onDoubleClick],
	);

	return (
		<div
			className={cn(
				"relative border-b transition-all duration-200",
				isDragActive && "bg-muted/20",
				isOver && "bg-primary/10 ring-primary shadow-inner ring-2 ring-inset",
			)}
			ref={setNodeRef}
			style={{ height, minHeight: height, maxHeight: height }}
			onDoubleClick={handleDoubleClick}
		>
			{/* Drop zone indicator */}
			{isOver && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
					<div className="fade-in zoom-in-95 animate-in bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold shadow-lg duration-200">
						Drop to assign to {technician.name}
					</div>
				</div>
			)}

			{jobs.length === 0 && !isDragActive ? (
				<div className="flex h-full items-center pl-4">
					<div className="sticky left-16 z-20">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="border-muted-foreground/30 bg-muted hover:border-primary/40 hover:bg-primary/5 flex h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2 shadow-sm transition-colors">
									<Plus className="text-muted-foreground size-3.5" />
									<span className="text-muted-foreground text-xs font-semibold tracking-wide">
										Double-click to add job
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent side="top" className="text-xs">
								Double-click anywhere to schedule a job for {technician.name}
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			) : (
				<>
					{/* Travel time indicators between jobs */}
					{travelGaps.map((gap) => (
						<TravelTimeIndicator gap={gap} key={`travel-${gap.fromJobId}-${gap.toJobId}`} />
					))}

					{/* Job cards */}
					{jobs.map(({ job, left, width, top, hasOverlap }) => (
						<JobCard
							hasOverlap={hasOverlap}
							isSelected={selectedJobId === job.id}
							job={job}
							key={job.id}
							left={left}
							onHover={onJobHover}
							onResize={onResize}
							onResizeComplete={onResizeComplete}
							onSelect={() => onSelectJob(job.id)}
							top={top}
							width={width}
						/>
					))}
				</>
			)}
		</div>
	);
});

export function DispatchTimeline() {
	const [mounted, setMounted] = useState(false);
	const [hoverPosition, setHoverPosition] = useState<number | null>(null);
	const [hoverTime, setHoverTime] = useState<string | null>(null);
	const [isJobHovered, setIsJobHovered] = useState(false);
	const [activeJobId, setActiveJobId] = useState<string | null>(null);
	const [_dragPreview, setDragPreview] = useState<{
		label: string;
		technician: string;
	} | null>(null);
	const [unassignedPanelOpen, setUnassignedPanelOpen] = useState(false);
	const [unassignedOrder, setUnassignedOrder] = useState<string[]>([]);
	const [commandMenuOpen, setCommandMenuOpen] = useState(false);
	const [commandMenuDate, setCommandMenuDate] = useState<Date | null>(null);
	const [quickCreateTechId, setQuickCreateTechId] = useState<string | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const dragPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const {
		technicians,
		getJobsForTechnician,
		selectJob,
		selectedJobId,
		moveJob,
		updateJob,
		jobs,
		isLoading,
		error,
		unassignedHasMore,
		unassignedSearch,
		isLoadingUnassigned,
		unassignedTotalCount,
		loadMoreUnassignedJobs,
	} = useSchedule();
	const { currentDate } = useScheduleViewStore();

	// Enable real-time updates for schedule changes
	const { isConnected: isRealtimeConnected } = useScheduleRealtime();

	// Get unassigned jobs
	const unassignedJobs = useMemo(
		() => jobs.filter((job) => job.isUnassigned),
		[jobs],
	);
	const showUnassignedPanel =
		unassignedJobs.length > 0 ||
		unassignedHasMore ||
		unassignedSearch.length > 0;

	useEffect(() => {
		setUnassignedOrder((prev) => {
			const ids = unassignedJobs.map((job) => job.id);
			if (prev.length === 0) {
				return ids;
			}
			const next = prev.filter((id) => ids.includes(id));
			ids.forEach((id) => {
				if (!next.includes(id)) {
					next.push(id);
				}
			});
			return next;
		});
	}, [unassignedJobs]);

	const orderedUnassignedJobs = useMemo(() => {
		if (unassignedOrder.length === 0) {
			return unassignedJobs;
		}
		const lookup = new Map(unassignedJobs.map((job) => [job.id, job]));
		const ordered = unassignedOrder
			.map((id) => lookup.get(id))
			.filter((job): job is Job => Boolean(job));
		const remaining = unassignedJobs.filter(
			(job) => !unassignedOrder.includes(job.id),
		);
		return [...ordered, ...remaining];
	}, [unassignedJobs, unassignedOrder]);

	const handleUnassignedSearch = useCallback(
		(value: string) => {
			loadMoreUnassignedJobs({ reset: true, search: value });
		},
		[loadMoreUnassignedJobs],
	);

	const handleLoadMoreUnassigned = useCallback(() => {
		loadMoreUnassignedJobs({ search: unassignedSearch });
	}, [loadMoreUnassignedJobs, unassignedSearch]);

	// Configure drag sensors
	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 5, // 5px movement required to start drag
		},
	});
	const touchSensor = useSensor(TouchSensor);
	const sensors = useSensors(mouseSensor, touchSensor);

	useEffect(() => {
		if (!showUnassignedPanel && unassignedPanelOpen) {
			setUnassignedPanelOpen(false);
		}
	}, [showUnassignedPanel, unassignedPanelOpen]);

	const dateObj = useMemo(
		() => (currentDate instanceof Date ? currentDate : new Date(currentDate)),
		[currentDate],
	);

	const hourlySlots = useMemo(() => {
		const slots: Date[] = [];
		const dayStart = new Date(dateObj);
		dayStart.setHours(0, 0, 0, 0);

		for (let hour = 0; hour < 24; hour++) {
			const slot = new Date(dayStart);
			slot.setHours(hour, 0, 0, 0);
			slots.push(slot);
		}
		return slots;
	}, [dateObj]);

	const timeRange = useMemo(() => {
		const start = hourlySlots[0];
		const end = new Date(hourlySlots.at(-1));
		end.setHours(23, 59, 59, 999);
		return { start, end };
	}, [hourlySlots]);

	const totalWidth = hourlySlots.length * HOUR_WIDTH;

	const currentTimePosition = useMemo(() => {
		const now = new Date();
		const isToday = now.toDateString() === dateObj.toDateString();
		if (!isToday) {
			return null;
		}

		const totalMinutes =
			(timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60);
		const currentMinutes =
			(now.getTime() - timeRange.start.getTime()) / (1000 * 60);
		return (currentMinutes / totalMinutes) * totalWidth;
	}, [timeRange, totalWidth, dateObj]);

	const technicianLanes = useMemo(() => {
		const lanes = technicians.map((tech) => {
			const allJobs = getJobsForTechnician(tech.id);
			const jobs = allJobs.filter((job) => {
				const jobStart =
					job.startTime instanceof Date
						? job.startTime
						: new Date(job.startTime);
				const jobEnd =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
				return jobStart <= timeRange.end && jobEnd >= timeRange.start;
			});

			const jobPositions = jobs.map((job) => {
				const jobStart =
					job.startTime instanceof Date
						? job.startTime
						: new Date(job.startTime);
				const jobEnd =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

				const startMinutes =
					(jobStart.getTime() - timeRange.start.getTime()) / (1000 * 60);
				const endMinutes =
					(jobEnd.getTime() - timeRange.start.getTime()) / (1000 * 60);
				const durationMinutes = endMinutes - startMinutes;

				const left = (startMinutes / 60) * HOUR_WIDTH;
				const width = Math.max(60, (durationMinutes / 60) * HOUR_WIDTH);

				return { job, left, width };
			});

			const positionedJobs = detectOverlaps(jobPositions);
			const maxLane = Math.max(0, ...positionedJobs.map((p) => p.lane));
			// Calculate lane height to accommodate all stacked jobs
			const laneHeight = Math.max(
				LANE_HEIGHT,
				(maxLane + 1) * (JOB_HEIGHT + STACK_GAP) + STACK_GAP * 2,
			);

			return {
				technician: tech,
				jobs: positionedJobs,
				height: laneHeight,
			};
		});

		return lanes;
	}, [technicians, getJobsForTechnician, timeRange]);

	// Calculate total height needed for sidebar to match all lanes
	const totalContentHeight = useMemo(() => {
		// h-11 = 2.75rem = 44px
		const headerHeight = 44;
		const lanesHeight = technicianLanes.reduce(
			(sum, lane) => sum + lane.height,
			0,
		);
		return headerHeight + lanesHeight;
	}, [technicianLanes]);

	// Track resize state to accumulate changes
	const resizeStateRef = useRef<{
		jobId: string;
		originalStart: Date;
		originalEnd: Date;
	} | null>(null);

	const handleResize = useCallback(
		(jobId: string, direction: "start" | "end", deltaMinutes: number) => {
			if (!resizeStateRef.current || resizeStateRef.current.jobId !== jobId) {
				const jobData = technicianLanes
					.flatMap((lane) => lane.jobs)
					.find((j) => j.job.id === jobId);
				if (!jobData) {
					return;
				}
				const job = jobData.job;
				resizeStateRef.current = {
					jobId,
					originalStart:
						job.startTime instanceof Date
							? job.startTime
							: new Date(job.startTime),
					originalEnd:
						job.endTime instanceof Date ? job.endTime : new Date(job.endTime),
				};
			}

			const state = resizeStateRef.current;
			if (!state) {
				return;
			}

			const { originalStart, originalEnd } = state;

			let newStart = originalStart;
			let newEnd = originalEnd;

			if (direction === "start") {
				newStart = new Date(originalStart.getTime() + deltaMinutes * 60 * 1000);
				if (newStart >= originalEnd) {
					newStart = new Date(originalEnd.getTime() - 15 * 60 * 1000);
				}
			} else {
				newEnd = new Date(originalEnd.getTime() + deltaMinutes * 60 * 1000);
				if (newEnd <= originalStart) {
					newEnd = new Date(originalStart.getTime() + 15 * 60 * 1000);
				}
			}

			const currentTechId =
				technicianLanes.find((lane) =>
					lane.jobs.some((j) => j.job.id === jobId),
				)?.technician.id || "";

			moveJob(jobId, currentTechId, newStart, newEnd);
		},
		[technicianLanes, moveJob],
	);

	// Finalize resize and update database
	const finalizeResize = useCallback(
		async (jobId: string, hasChanges: boolean) => {
			if (!resizeStateRef.current || resizeStateRef.current.jobId !== jobId) {
				return;
			}

			if (!hasChanges) {
				resizeStateRef.current = null;
				return;
			}

			const jobData = technicianLanes
				.flatMap((lane) => lane.jobs)
				.find((j) => j.job.id === jobId);

			if (!jobData) {
				resizeStateRef.current = null;
				return;
			}

			const job = jobData.job;
			const newStart =
				job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const newEnd =
				job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

			// Update in database
			const toastId = toast.loading("Saving appointment time...");
			const result = await updateAppointmentTimes(jobId, newStart, newEnd);

			if (result.success) {
				toast.success(
					`Updated to ${format(newStart, "h:mm a")} - ${format(newEnd, "h:mm a")}`,
					{
						id: toastId,
					},
				);
			} else {
				toast.error(result.error || "Failed to update times", { id: toastId });
			}

			resizeStateRef.current = null;
		},
		[technicianLanes],
	);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveJobId(event.active.id as string);
		setDragPreview(null);
		const activator = event.activatorEvent;
		if (hasClientCoordinates(activator)) {
			dragPointerRef.current = {
				x: activator.clientX,
				y: activator.clientY,
			};
		}
	}, []);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over, delta } = event;

			setActiveJobId(null);
			setDragPreview(null);

			if (!over) {
				return;
			}

			const jobId = active.id as string;
			const overId = over.id as string;
			const droppedOnUnassigned = overId === UNASSIGNED_DROP_ID;
			const overIsUnassignedJob = unassignedJobs.some((j) => j.id === overId);

			// Check if this is from the unassigned panel
			const isFromUnassigned = unassignedJobs.some((j) => j.id === jobId);

			let job: Job | undefined;

			if (isFromUnassigned) {
				// Dragging from unassigned panel
				job = unassignedJobs.find((j) => j.id === jobId);
			} else {
				// Dragging from existing lane
				const jobData = technicianLanes
					.flatMap((lane) => lane.jobs)
					.find((j) => j.job.id === jobId);

				if (!jobData) {
					return;
				}
				job = jobData.job;
			}

			if (!job) {
				return;
			}
			if (isFromUnassigned && overIsUnassignedJob && jobId !== overId) {
				setUnassignedOrder((prev) => {
					const fromIndex = prev.indexOf(jobId);
					const toIndex = prev.indexOf(overId);
					if (fromIndex === -1 || toIndex === -1) {
						return prev;
					}
					return arrayMove(prev, fromIndex, toIndex);
				});
				return;
			}

			if (droppedOnUnassigned) {
				if (isFromUnassigned) {
					setUnassignedOrder((prev) => {
						const fromIndex = prev.indexOf(jobId);
						if (fromIndex === -1) {
							return prev;
						}
						return arrayMove(prev, fromIndex, prev.length - 1);
					});
					return;
				}

				const startTime =
					job.startTime instanceof Date
						? job.startTime
						: new Date(job.startTime);
				const endTime =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

				updateJob(jobId, {
					technicianId: "",
					assignments: [],
					isUnassigned: true,
					startTime,
					endTime,
				});

				const toastId = toast.loading("Moving appointment to Unscheduled…");
				const result = await unassignAppointment(jobId);
				if (result.success) {
					toast.success("Appointment moved to Unscheduled", { id: toastId });
				} else {
					toast.error(result.error || "Failed to unschedule appointment", {
						id: toastId,
					});
				}
				return;
			}

			const targetTechnicianId = overId;
			const targetTech = technicians.find((t) => t.id === targetTechnicianId);

			let newStart: Date;
			let newEnd: Date;

			if (isFromUnassigned) {
				// For unassigned jobs, calculate drop time from cursor position
				const dropX = dragPointerRef.current.x;
				const timelineRect = timelineRef.current?.getBoundingClientRect();

				if (timelineRect) {
					const relativeX = dropX - timelineRect.left;
					const minutesFromStart = (relativeX / totalWidth) * (24 * 60);

					// Snap to 15-minute intervals
					const snappedMinutes = Math.round(minutesFromStart / 15) * 15;

					// Create 2-hour appointment starting at drop time
					newStart = new Date(timeRange.start);
					newStart.setMinutes(newStart.getMinutes() + snappedMinutes);
					newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000); // 2 hours
				} else {
					// Fallback to current time
					newStart = new Date();
					newStart.setMinutes(Math.round(newStart.getMinutes() / 15) * 15);
					newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000);
				}
			} else {
				// For existing jobs, calculate time change from horizontal drag
				const deltaMinutes = Math.round((delta.x / HOUR_WIDTH) * 60);
				const snappedMinutes = Math.round(deltaMinutes / 15) * 15;

				const oldStart =
					job.startTime instanceof Date
						? job.startTime
						: new Date(job.startTime);
				const oldEnd =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
				const duration = oldEnd.getTime() - oldStart.getTime();

				newStart = new Date(oldStart.getTime() + snappedMinutes * 60 * 1000);
				newEnd = new Date(newStart.getTime() + duration);
			}

			// Optimistic update in UI
			moveJob(jobId, targetTechnicianId, newStart, newEnd);

			// Show loading toast
			const message = isFromUnassigned
				? `Scheduling for ${targetTech?.name} at ${format(newStart, "h:mm a")}...`
				: `Moving to ${targetTech?.name} at ${format(newStart, "h:mm a")}...`;
			const toastId = toast.loading(message);

			// Update in Supabase
			// Use userId if available, otherwise use the technician ID (which might be team_member_id)
			const techIdForDb = targetTech?.userId || targetTechnicianId;

			// Update technician assignment
			const assignResult = await assignJobToTechnician(
				jobId,
				jobId,
				techIdForDb,
			);

			if (!assignResult.success) {
				toast.error(assignResult.error || "Failed to assign job", {
					id: toastId,
				});
				return;
			}
			const timeResult = await updateAppointmentTimes(jobId, newStart, newEnd);

			if (!timeResult.success) {
				toast.error(timeResult.error || "Failed to update times", {
					id: toastId,
				});
				return;
			}

			const successMsg = isFromUnassigned
				? `Scheduled for ${targetTech?.name} at ${format(newStart, "h:mm a")}`
				: `Moved to ${targetTech?.name} at ${format(newStart, "h:mm a")}`;
			toast.success(successMsg, { id: toastId });
		},
		[
			technicianLanes,
			technicians,
			moveJob,
			updateJob,
			unassignedJobs,
			timeRange,
			totalWidth,
		],
	);

	const _handleDragMove = useCallback(
		(event: DragMoveEvent) => {
			const jobId = event.active.id as string;
			const jobData = technicianLanes
				.flatMap((lane) => lane.jobs)
				.find((j) => j.job.id === jobId);

			if (!jobData) {
				setDragPreview(null);
				return;
			}

			const job = jobData.job;
			const targetTechnicianId =
				(event.over?.id as string | undefined) ?? job.technicianId;
			const targetTech = technicians.find(
				(tech) => tech.id === targetTechnicianId,
			);

			const start =
				job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const end =
				job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
			const duration = end.getTime() - start.getTime();

			const deltaMinutes = Math.round((event.delta.x / HOUR_WIDTH) * 60);
			const snappedMinutes =
				Math.round(deltaMinutes / SNAP_INTERVAL_MINUTES) *
				SNAP_INTERVAL_MINUTES;
			const newStart = new Date(start.getTime() + snappedMinutes * 60 * 1000);
			const newEnd = new Date(newStart.getTime() + duration);

			setDragPreview({
				label: `${format(newStart, "h:mm a")} – ${format(newEnd, "h:mm a")}`,
				technician: targetTech?.name ?? "Unassigned",
			});
		},
		[technicianLanes, technicians],
	);

	const _handleDragCancel = useCallback(() => {
		setActiveJobId(null);
		setDragPreview(null);
	}, []);

	const adjustJobTime = useCallback(
		async (jobId: string, deltaMinutes: number) => {
			if (deltaMinutes === 0) {
				return;
			}

			const jobData = technicianLanes
				.flatMap((lane) => lane.jobs)
				.find((j) => j.job.id === jobId);

			if (!jobData) {
				return;
			}

			const job = jobData.job;
			const currentTechId = job.technicianId;
			const start =
				job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const end =
				job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

			const newStart = new Date(start.getTime() + deltaMinutes * 60 * 1000);
			const newEnd = new Date(end.getTime() + deltaMinutes * 60 * 1000);

			moveJob(jobId, currentTechId, newStart, newEnd);

			const toastId = toast.loading(`Moving to ${format(newStart, "h:mm a")}…`);
			const result = await updateAppointmentTimes(jobId, newStart, newEnd);

			if (result.success) {
				toast.success(
					`Updated to ${format(newStart, "h:mm a")} - ${format(newEnd, "h:mm a")}`,
					{
						id: toastId,
					},
				);
			} else {
				toast.error(result.error || "Failed to update times", { id: toastId });
			}
		},
		[technicianLanes, moveJob],
	);

	const nudgeJobTechnician = useCallback(
		async (jobId: string, direction: -1 | 1) => {
			const jobData = technicianLanes
				.flatMap((lane) => lane.jobs)
				.find((j) => j.job.id === jobId);
			if (!jobData) {
				return;
			}
			const job = jobData.job;
			const currentIndex = technicians.findIndex(
				(tech) => tech.id === job.technicianId,
			);
			if (currentIndex === -1) {
				return;
			}
			const targetTech = technicians[currentIndex + direction];
			if (!targetTech) {
				return;
			}

			const start =
				job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const end =
				job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

			moveJob(jobId, targetTech.id, start, end);

			const toastId = toast.loading(`Assigning to ${targetTech.name}…`);
			const result = await assignJobToTechnician(jobId, jobId, targetTech.id);

			if (result.success) {
				toast.success(`Assigned to ${targetTech.name}`, { id: toastId });
			} else {
				toast.error(result.error || "Failed to assign job", { id: toastId });
			}
		},
		[technicianLanes, technicians, moveJob],
	);

	useEffect(() => {
		if (!activeJobId) {
			return;
		}
		const handlePointerMove = (event: PointerEvent) => {
			dragPointerRef.current = { x: event.clientX, y: event.clientY };
		};
		window.addEventListener("pointermove", handlePointerMove, {
			passive: true,
		});
		return () => window.removeEventListener("pointermove", handlePointerMove);
	}, [activeJobId]);

	useEffect(() => {
		if (!activeJobId) {
			return;
		}
		const container = scrollContainerRef.current;
		if (!container) {
			return;
		}

		let frame: number;
		const tick = () => {
			const pointer = dragPointerRef.current;
			const rect = container.getBoundingClientRect();
			let deltaX = 0;

			if (pointer.x - rect.left < AUTO_SCROLL_EDGE) {
				deltaX = -Math.min(
					AUTO_SCROLL_MAX_SPEED,
					AUTO_SCROLL_EDGE - (pointer.x - rect.left),
				);
			} else if (rect.right - pointer.x < AUTO_SCROLL_EDGE) {
				deltaX = Math.min(
					AUTO_SCROLL_MAX_SPEED,
					AUTO_SCROLL_EDGE - (rect.right - pointer.x),
				);
			}

			if (deltaX !== 0) {
				container.scrollLeft += deltaX;
			}

			const timelineArea = timelineRef.current;
			if (timelineArea) {
				const timelineRect = timelineArea.getBoundingClientRect();
				let deltaY = 0;
				if (pointer.y - timelineRect.top < AUTO_SCROLL_EDGE) {
					deltaY = -Math.min(
						AUTO_SCROLL_MAX_SPEED,
						AUTO_SCROLL_EDGE - (pointer.y - timelineRect.top),
					);
				} else if (timelineRect.bottom - pointer.y < AUTO_SCROLL_EDGE) {
					deltaY = Math.min(
						AUTO_SCROLL_MAX_SPEED,
						AUTO_SCROLL_EDGE - (timelineRect.bottom - pointer.y),
					);
				}
				if (deltaY !== 0) {
					timelineArea.scrollTop += deltaY;
				}
			}

			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [activeJobId]);

	// Handle mouse move to show hover time indicator (hide when hovering over jobs)
	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!timelineRef.current || isJobHovered) {
				setHoverPosition(null);
				setHoverTime(null);
				return;
			}

			const rect = timelineRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;

			if (x < 0 || x > totalWidth) {
				setHoverPosition(null);
				setHoverTime(null);
				return;
			}

			// Calculate time at cursor position
			const minutesFromStart = (x / totalWidth) * (24 * 60);
			const hoverDate = new Date(timeRange.start);
			hoverDate.setMinutes(hoverDate.getMinutes() + minutesFromStart);

			setHoverPosition(x);
			setHoverTime(format(hoverDate, "h:mm a"));
		},
		[totalWidth, timeRange, isJobHovered],
	);

	const handleMouseLeave = useCallback(() => {
		setHoverPosition(null);
		setHoverTime(null);
	}, []);

	const activeJob = useMemo(() => {
		if (!activeJobId) {
			return null;
		}
		return technicianLanes
			.flatMap((lane) => lane.jobs)
			.find((j) => j.job.id === activeJobId)?.job;
	}, [activeJobId, technicianLanes]);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!selectedJobId) {
				return;
			}
			const target = event.target as HTMLElement | null;
			if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
				return;
			}

			if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
				event.preventDefault();
				const delta =
					(event.shiftKey ? LARGE_SNAP_MINUTES : SNAP_INTERVAL_MINUTES) *
					(event.key === "ArrowRight" ? 1 : -1);
				void adjustJobTime(selectedJobId, delta);
			} else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				event.preventDefault();
				void nudgeJobTechnician(
					selectedJobId,
					event.key === "ArrowUp" ? -1 : 1,
				);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedJobId, adjustJobTime, nudgeJobTechnician]);

	useEffect(() => {
		if (currentTimePosition !== null && scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			container.scrollLeft = Math.max(
				0,
				currentTimePosition - container.clientWidth / 2,
			);
		}
	}, [currentTimePosition]);

	// Command menu keyboard shortcut (Cmd+K)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setCommandMenuDate(dateObj);
				setCommandMenuOpen(true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [dateObj]);

	// Right-click handler for timeline
	const handleTimelineContextMenu = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			setCommandMenuDate(dateObj);
			setCommandMenuOpen(true);
		},
		[dateObj],
	);

	// Handle double-click on timeline to create new job
	const handleLaneDoubleClick = useCallback(
		(technicianId: string, startTime: Date) => {
			setQuickCreateTechId(technicianId);
			setCommandMenuDate(startTime);
			setCommandMenuOpen(true);
		},
		[],
	);

	if (!mounted || isLoading) {
		// Conditional returns AFTER all hooks
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-muted-foreground">Loading schedule...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-center">
					<p className="text-destructive mb-2">Error loading schedule</p>
					<p className="text-muted-foreground text-sm">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<DndContext
			onDragCancel={() => setActiveJobId(null)}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			sensors={sensors}
		>
			<div className="bg-background m-0 flex h-full w-full overflow-hidden p-0">
				{/* Unassigned Panel */}
				{showUnassignedPanel && (
					<div
						className="h-full shrink-0"
						style={{ width: unassignedPanelOpen ? "320px" : "48px" }}
					>
						<UnassignedPanel
							activeJobId={activeJobId}
							dropId={UNASSIGNED_DROP_ID}
							isOpen={unassignedPanelOpen}
							onToggle={() => setUnassignedPanelOpen(!unassignedPanelOpen)}
							onSearchChange={handleUnassignedSearch}
							onLoadMore={handleLoadMoreUnassigned}
							unassignedJobs={orderedUnassignedJobs}
							hasMore={unassignedHasMore}
							isLoadingMore={isLoadingUnassigned}
							totalCount={unassignedTotalCount}
							searchQuery={unassignedSearch}
						/>
					</div>
				)}

				{/* Timeline */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Single scroll container */}
					<div className="flex flex-1 overflow-auto" ref={scrollContainerRef}>
						{/* Team Sidebar - Sticky */}
						<div
							className="bg-card sticky left-0 z-35 flex shrink-0 flex-col border-r"
							style={{ width: SIDEBAR_WIDTH, minHeight: totalContentHeight }}
						>
							{/* Team Header - Sticky */}
							<div className="bg-muted sticky top-0 z-40 flex h-11 shrink-0 items-center justify-between border-b px-4">
								<span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
									Team
								</span>
								{/* Real-time connection indicator */}
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											className={cn(
												"size-2 rounded-full",
												isRealtimeConnected
													? "bg-green-500 animate-pulse"
													: "bg-slate-400",
											)}
										/>
									</TooltipTrigger>
									<TooltipContent side="right" className="text-xs">
										{isRealtimeConnected
											? "Live updates active"
											: "Connecting to live updates..."}
									</TooltipContent>
								</Tooltip>
							</div>

							{/* Team Members */}
							{technicianLanes.map(({ technician, jobs, height }) => {
								const isApprentice = technician.role
									?.toLowerCase()
									.includes("apprentice");
								const hasJobs = jobs.length > 0;

								// Calculate utilization (assuming 8 hour workday: 8am-5pm = 9 hours with lunch)
								const WORK_DAY_MINUTES = 8 * 60; // 8 hours
								const totalScheduledMinutes = jobs.reduce((acc, job) => {
									const start =
										job.startTime instanceof Date
											? job.startTime
											: new Date(job.startTime);
									const end =
										job.endTime instanceof Date
											? job.endTime
											: new Date(job.endTime);
									return acc + (end.getTime() - start.getTime()) / (1000 * 60);
								}, 0);
								const utilizationPercent = Math.min(
									100,
									Math.round((totalScheduledMinutes / WORK_DAY_MINUTES) * 100),
								);

								// Color based on utilization
								const utilizationColor =
									utilizationPercent === 0
										? "bg-slate-200 dark:bg-slate-700"
										: utilizationPercent < 50
											? "bg-emerald-500"
											: utilizationPercent < 80
												? "bg-amber-500"
												: "bg-red-500";

								return (
									<Tooltip key={technician.id}>
										<TooltipTrigger asChild>
											<div
												className="flex cursor-default items-center border-b px-3 hover:bg-muted/50"
												style={{ height, minHeight: height, maxHeight: height }}
											>
												<div className="flex w-full items-center gap-2.5">
													<div className="relative">
														<Avatar className="size-9">
															<AvatarFallback
																className={cn(
																	"text-xs font-semibold",
																	isApprentice
																		? "bg-amber-100 text-amber-700"
																		: "bg-primary/10 text-primary",
																)}
															>
																{technician.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														{/* Availability indicator */}
														<div
															className={cn(
																"ring-card absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2",
																hasJobs ? "bg-warning" : "bg-success",
															)}
														/>
													</div>
													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-1.5">
															<p className="truncate text-sm font-semibold">
																{technician.name}
															</p>
															{isApprentice && (
																<Badge
																	className="px-1 py-0 text-[9px]"
																	variant="outline"
																>
																	Apprentice
																</Badge>
															)}
														</div>
														{/* Utilization bar */}
														<div className="mt-1 flex items-center gap-2">
															<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
																<div
																	className={cn(
																		"h-full rounded-full transition-all",
																		utilizationColor,
																	)}
																	style={{ width: `${utilizationPercent}%` }}
																/>
															</div>
															<span className="text-muted-foreground text-[10px] tabular-nums">
																{jobs.length} job{jobs.length !== 1 ? "s" : ""}
															</span>
														</div>
													</div>
												</div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="right" className="text-xs">
											<div className="flex flex-col gap-1">
												<div className="flex items-center justify-between gap-4">
													<span className="font-medium">{technician.name}</span>
													<span
														className={cn(
															"rounded px-1.5 py-0.5 text-[10px] font-medium",
															hasJobs
																? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
																: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
														)}
													>
														{hasJobs ? "Busy" : "Available"}
													</span>
												</div>
												<div className="text-muted-foreground">
													{technician.role}
												</div>
												<div className="border-t pt-1 mt-1">
													<div className="flex justify-between">
														<span>Jobs Today:</span>
														<span className="font-medium">{jobs.length}</span>
													</div>
													<div className="flex justify-between">
														<span>Time Booked:</span>
														<span className="font-medium">
															{Math.round(totalScheduledMinutes / 60)}h{" "}
															{Math.round(totalScheduledMinutes % 60)}m
														</span>
													</div>
													<div className="flex justify-between">
														<span>Utilization:</span>
														<span
															className={cn(
																"font-medium",
																utilizationPercent < 50
																	? "text-emerald-600"
																	: utilizationPercent < 80
																		? "text-amber-600"
																		: "text-red-600",
															)}
														>
															{utilizationPercent}%
														</span>
													</div>
												</div>
											</div>
										</TooltipContent>
									</Tooltip>
								);
							})}
						</div>

						{/* Timeline (Hours + Lanes) */}
						<div
							className="flex flex-1 flex-col"
							style={{ minWidth: totalWidth }}
						>
							{/* Hour Header - sticky top, scrolls horizontally */}
							<div className="bg-card sticky top-0 z-30 flex h-11 shrink-0 border-b">
								{hourlySlots.map((slot, index) => {
									const hour = slot.getHours();
									const isBusinessHours = hour >= 6 && hour < 18;
									return (
										<div
											className={cn(
												"flex shrink-0 items-center justify-center border-r",
												isBusinessHours ? "bg-card" : "bg-muted/30",
											)}
											key={index}
											style={{ width: HOUR_WIDTH }}
										>
											<span
												className={cn(
													"text-xs font-medium",
													isBusinessHours
														? "text-foreground"
														: "text-muted-foreground",
												)}
											>
												{format(slot, "h a")}
											</span>
										</div>
									);
								})}
							</div>

							{/* Timeline Grid */}
							<div
								className="relative flex-1"
								onContextMenu={handleTimelineContextMenu}
								onMouseLeave={handleMouseLeave}
								onMouseMove={handleMouseMove}
								ref={timelineRef}
								style={{ minWidth: totalWidth }}
							>
								{/* Hour Column Backgrounds with 15-min snap guides */}
								<div className="absolute inset-0 flex">
									{hourlySlots.map((slot, index) => {
										const hour = slot.getHours();
										const isBusinessHours = hour >= 6 && hour < 18;
										return (
											<div
												className={cn(
													"relative shrink-0 border-r",
													isBusinessHours
														? index % 2 === 0
															? "bg-background"
															: "bg-muted/5"
														: "bg-muted/20",
												)}
												key={index}
												style={{
													width: HOUR_WIDTH,
													backgroundImage: isBusinessHours
														? undefined
														: "repeating-linear-gradient(45deg, transparent, transparent 8px, hsl(var(--muted) / 0.3) 8px, hsl(var(--muted) / 0.3) 16px)",
												}}
											>
												{/* 15-minute snap guides (visible during drag) */}
												{activeJobId && (
													<>
														<div className="bg-primary/20 absolute top-0 left-1/4 h-full w-px" />
														<div className="bg-primary/30 absolute top-0 left-1/2 h-full w-px" />
														<div className="bg-primary/20 absolute top-0 left-3/4 h-full w-px" />
													</>
												)}
											</div>
										);
									})}
								</div>

								{/* Hover Time Indicator - Time Badge Only */}
								{hoverPosition !== null && hoverTime && !isJobHovered && (
									<div
										className="pointer-events-none absolute top-0 z-50"
										style={{
											left: hoverPosition,
											transform: "translate(-50%, -50%)",
										}}
									>
										<div className="bg-foreground text-background rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap shadow-lg">
											{hoverTime}
										</div>
									</div>
								)}

								{/* Current Time Indicator - Blue Line */}
								{currentTimePosition !== null && (
									<div
										className="absolute top-0 z-30 h-full w-0.5 bg-blue-500 shadow-lg"
										style={{ left: currentTimePosition }}
									>
										<div className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-blue-500 ring-2 ring-blue-200" />
										<div className="absolute top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-500 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-lg">
											{format(new Date(), "EEE, MMM d • h:mm a")}
										</div>
									</div>
								)}

								{/* Technician Lanes */}
								{technicianLanes.map(({ technician, jobs, height }) => (
									<TechnicianLane
										height={height}
										isDragActive={activeJobId !== null}
										jobs={jobs}
										key={technician.id}
										onJobHover={setIsJobHovered}
										onResize={handleResize}
										onResizeComplete={finalizeResize}
										onSelectJob={selectJob}
										selectedJobId={selectedJobId}
										technician={technician}
										onDoubleClick={handleLaneDoubleClick}
										totalWidth={totalWidth}
										timeRangeStart={timeRange.start}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Drag Overlay - Ghost Preview */}
			<DragOverlay dropAnimation={null}>
				{activeJob ? (
					<div
						className="border-primary bg-card rounded-md border-2 p-2 shadow-2xl"
						style={{ width: "200px", height: `${JOB_HEIGHT}px` }}
					>
						<div className="flex items-center justify-between">
							<div className="min-w-0 flex-1">
								<p className="text-foreground truncate text-xs font-semibold">
									{activeJob.customer.name}
								</p>
							</div>
							<Badge className="ml-2 text-[9px]" variant="secondary">
								Moving
							</Badge>
						</div>
					</div>
				) : null}
			</DragOverlay>

			{/* Command Menu */}
			<ScheduleCommandMenu
				isOpen={commandMenuOpen}
				onClose={() => {
					setCommandMenuOpen(false);
					setQuickCreateTechId(null);
				}}
				selectedDate={commandMenuDate}
				selectedTechnicianId={quickCreateTechId}
				selectedTechnicianName={
					quickCreateTechId
						? technicians.find((t) => t.id === quickCreateTechId)?.name
						: undefined
				}
				unassignedJobs={unassignedJobs}
			/>
		</DndContext>
	);
}
