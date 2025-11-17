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
import { ChevronRight, Clock, MapPin, User } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	archiveAppointment,
	arriveAppointment,
	assignJobToTechnician,
	cancelAppointment,
	cancelJobAndAppointment,
	closeAppointment,
	dispatchAppointment,
	unassignAppointment,
	updateAppointmentTimes,
} from "@/actions/schedule-assignments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
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
	return typeof candidate.clientX === "number" && typeof candidate.clientY === "number";
};

// Get job type color based on title keywords
const getJobTypeColor = (job: Job) => {
	const title = job.title.toLowerCase();

	// Emergency/Urgent - Muted Red
	if (title.includes("emergency") || title.includes("urgent")) {
		return "border-red-400 dark:border-red-700";
	}

	// Callbacks/Follow-ups - Muted Orange
	if (title.includes("callback") || title.includes("follow-up") || title.includes("followup")) {
		return "border-orange-400 dark:border-orange-700";
	}

	// Meetings/Events/Training - Muted Purple
	if (title.includes("meeting") || title.includes("event") || title.includes("training")) {
		return "border-purple-400 dark:border-purple-700";
	}

	// Installation/Setup/New - Muted Green
	if (title.includes("install") || title.includes("setup") || title.includes("new")) {
		return "border-green-400 dark:border-green-700";
	}

	// Maintenance/Service/Inspection - Muted Blue
	if (title.includes("maintenance") || title.includes("service") || title.includes("inspection")) {
		return "border-blue-400 dark:border-blue-700";
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

function detectOverlaps(jobs: Array<{ job: Job; left: number; width: number }>): JobWithPosition[] {
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
	onResize: (jobId: string, direction: "start" | "end", deltaMinutes: number) => void;
	onResizeComplete: (jobId: string, hasChanges: boolean) => void;
}) {
	const [isResizing, setIsResizing] = useState(false);
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: job.id,
		data: { job },
		disabled: isResizing,
	});

	const topOffset = (top > 0 || hasOverlap ? STACK_GAP : BASE_CENTER_OFFSET) + top;

	const style = {
		left: `${left}px`,
		width: `${width}px`,
		top: `${topOffset}px`,
		height: `${JOB_HEIGHT}px`,
		transform: CSS.Translate.toString(transform),
		zIndex: isDragging ? 50 : isSelected ? 20 : 10 - top / JOB_STACK_OFFSET,
	};

	const startTime = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
	const endTime = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
	const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

	const borderColor = getJobTypeColor(job);

	const handleResizeStart = (e: React.MouseEvent, direction: "start" | "end") => {
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

						<ContextMenu onOpenChange={setIsContextMenuOpen}>
							<ContextMenuTrigger asChild>
								<div
									className={cn(
										"bg-card relative flex h-full cursor-grab items-center gap-2 rounded-md border px-2.5 py-1.5 transition-all hover:shadow-sm active:cursor-grabbing",
										borderColor,
										job.isUnassigned && "!border-red-500",
										isSelected && "ring-primary shadow-md ring-1",
										isDragging && "shadow-lg",
										(job.status === "completed" || job.status === "closed") && "opacity-50"
									)}
									onClick={onSelect}
								>
									{/* Overlap indicator */}
									{hasOverlap && (
										<div className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white">
											!
										</div>
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
											job.status === "in-progress" && "animate-pulse bg-amber-500",
											job.status === "closed" && "bg-emerald-600",
											job.status === "completed" && "bg-emerald-500",
											job.status === "cancelled" && "bg-slate-400"
										)}
									/>
								</div>
							</ContextMenuTrigger>

							<ContextMenuContent className="w-56">
								<ContextMenuItem
									disabled={!job.jobId}
									onClick={() => {
										if (job.jobId) {
											window.location.href = `/dashboard/work/${job.jobId}`;
										}
									}}
								>
									View Job Details
								</ContextMenuItem>

								<ContextMenuSeparator />

								<ContextMenuItem
									disabled={["dispatched", "arrived", "closed", "cancelled"].includes(job.status)}
									onClick={async () => {
										const result = await dispatchAppointment(job.id);
										if (result.success) {
											toast.success("Appointment marked as dispatched");
											window.location.reload();
										} else {
											toast.error(result.error || "Failed to dispatch");
										}
									}}
								>
									Mark Dispatched
								</ContextMenuItem>
								<ContextMenuItem
									disabled={["arrived", "closed", "cancelled"].includes(job.status)}
									onClick={async () => {
										const result = await arriveAppointment(job.id);
										if (result.success) {
											toast.success("Arrival recorded");
											window.location.reload();
										} else {
											toast.error(result.error || "Failed to mark arrival");
										}
									}}
								>
									Mark Arrived
								</ContextMenuItem>
								<ContextMenuItem
									disabled={["closed", "cancelled"].includes(job.status)}
									onClick={async () => {
										const result = await closeAppointment(job.id);
										if (result.success) {
											toast.success("Appointment closed");
											window.location.reload();
										} else {
											toast.error(result.error || "Failed to close");
										}
									}}
								>
									Mark Closed
								</ContextMenuItem>

								<ContextMenuSeparator />

								<ContextMenuItem
									onClick={() => {
										// TODO: Open reschedule dialog
									}}
								>
									Reschedule
								</ContextMenuItem>

								<ContextMenuItem
									onClick={() => {
										// TODO: Implement duplicate
									}}
								>
									Duplicate Appointment
								</ContextMenuItem>

								<ContextMenuSeparator />

								<ContextMenuItem
									className="text-orange-600 focus:text-orange-600"
									disabled={job.status === "cancelled"}
									onClick={async () => {
										const result = await cancelAppointment(job.id, "Appointment cancelled by user");
										if (result.success) {
											toast.success("Appointment cancelled - job moved to unscheduled");
											window.location.reload();
										} else {
											toast.error(result.error || "Failed to cancel");
										}
									}}
								>
									Cancel Appointment Only
								</ContextMenuItem>

								<ContextMenuItem
									className="text-destructive focus:text-destructive"
									disabled={job.status === "cancelled" || !job.jobId}
									onClick={async () => {
										if (!job.jobId) {
											toast.error("No job linked to this appointment");
											return;
										}
										const result = await cancelJobAndAppointment(
											job.id,
											job.jobId,
											"Job and appointment cancelled by user"
										);
										if (result.success) {
											toast.success("Job and appointment cancelled");
											window.location.reload();
										} else {
											toast.error(result.error || "Failed to cancel");
										}
									}}
								>
									Cancel Job & Appointment
								</ContextMenuItem>

								<ContextMenuItem
									className="text-destructive focus:text-destructive"
									onClick={async () => {
										const result = await archiveAppointment(job.id);
										if (result.success) {
											toast.success("Appointment archived");
											window.location.reload();
										} else {
											toast.error(result.error || "Failed to archive");
										}
									}}
								>
									Archive Appointment
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>

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
								<Badge className="text-[10px] capitalize" variant="outline">
									{job.status}
								</Badge>
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
												{job.location.address.city}, {job.location.address.state}
											</p>
										)}
									</div>
								</div>
							)}

							{/* Contact */}
							{job.customer?.phone && (
								<div className="flex items-center gap-2.5">
									<User className="text-muted-foreground size-4" />
									<p className="text-foreground text-sm font-medium">{job.customer.phone}</p>
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
													assignment.status === "on-break" && "bg-slate-400"
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
}: {
	technician: Technician;
	jobs: JobWithPosition[];
	height: number;
	selectedJobId: string | null;
	onSelectJob: (jobId: string) => void;
	onJobHover: (isHovering: boolean) => void;
	onResize: (jobId: string, direction: "start" | "end", deltaMinutes: number) => void;
	onResizeComplete: (jobId: string, hasChanges: boolean) => void;
	isDragActive: boolean;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: technician.id,
		data: { technician },
	});

	return (
		<div
			className={cn(
				"relative border-b transition-all duration-200",
				isDragActive && "bg-muted/20",
				isOver && "bg-primary/10 ring-primary shadow-inner ring-2 ring-inset"
			)}
			ref={setNodeRef}
			style={{ height, minHeight: height, maxHeight: height }}
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
				<div className="pointer-events-none flex h-full items-center pl-4">
					<div className="sticky left-16 z-20">
						<div className="border-muted-foreground/30 bg-muted flex h-10 items-center gap-2 rounded-md border border-dashed px-4 py-2 shadow-sm">
							<span className="text-muted-foreground text-xs font-semibold tracking-wide">
								No appointments
							</span>
						</div>
					</div>
				</div>
			) : (
				jobs.map(({ job, left, width, top, hasOverlap }) => (
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
				))
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
	} = useSchedule();
	const { currentDate } = useScheduleViewStore();

	// Get unassigned jobs
	const unassignedJobs = useMemo(() => jobs.filter((job) => job.isUnassigned), [jobs]);
	const hasUnassignedJobs = unassignedJobs.length > 0;

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
		const remaining = unassignedJobs.filter((job) => !unassignedOrder.includes(job.id));
		return [...ordered, ...remaining];
	}, [unassignedJobs, unassignedOrder]);

	// Configure drag sensors
	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 5, // 5px movement required to start drag
		},
	});
	const touchSensor = useSensor(TouchSensor);
	const sensors = useSensors(mouseSensor, touchSensor);

	useEffect(() => {
		if (!hasUnassignedJobs && unassignedPanelOpen) {
			setUnassignedPanelOpen(false);
		}
	}, [hasUnassignedJobs, unassignedPanelOpen]);

	const dateObj = useMemo(
		() => (currentDate instanceof Date ? currentDate : new Date(currentDate)),
		[currentDate]
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

		const totalMinutes = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60);
		const currentMinutes = (now.getTime() - timeRange.start.getTime()) / (1000 * 60);
		return (currentMinutes / totalMinutes) * totalWidth;
	}, [timeRange, totalWidth, dateObj]);

	const technicianLanes = useMemo(() => {
		const lanes = technicians.map((tech) => {
			const allJobs = getJobsForTechnician(tech.id);
			const jobs = allJobs.filter((job) => {
				const jobStart = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
				const jobEnd = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
				return jobStart <= timeRange.end && jobEnd >= timeRange.start;
			});

			const jobPositions = jobs.map((job) => {
				const jobStart = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
				const jobEnd = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

				const startMinutes = (jobStart.getTime() - timeRange.start.getTime()) / (1000 * 60);
				const endMinutes = (jobEnd.getTime() - timeRange.start.getTime()) / (1000 * 60);
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
				(maxLane + 1) * (JOB_HEIGHT + STACK_GAP) + STACK_GAP * 2
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
		const lanesHeight = technicianLanes.reduce((sum, lane) => sum + lane.height, 0);
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
					originalStart: job.startTime instanceof Date ? job.startTime : new Date(job.startTime),
					originalEnd: job.endTime instanceof Date ? job.endTime : new Date(job.endTime),
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
				technicianLanes.find((lane) => lane.jobs.some((j) => j.job.id === jobId))?.technician.id ||
				"";

			moveJob(jobId, currentTechId, newStart, newEnd);
		},
		[technicianLanes, moveJob]
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

			const jobData = technicianLanes.flatMap((lane) => lane.jobs).find((j) => j.job.id === jobId);

			if (!jobData) {
				resizeStateRef.current = null;
				return;
			}

			const job = jobData.job;
			const newStart = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const newEnd = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

			// Update in database
			const toastId = toast.loading("Saving appointment time...");
			const result = await updateAppointmentTimes(jobId, newStart, newEnd);

			if (result.success) {
				toast.success(`Updated to ${format(newStart, "h:mm a")} - ${format(newEnd, "h:mm a")}`, {
					id: toastId,
				});
			} else {
				toast.error(result.error || "Failed to update times", { id: toastId });
			}

			resizeStateRef.current = null;
		},
		[technicianLanes]
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

				const startTime = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
				const endTime = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

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

				const oldStart = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
				const oldEnd = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
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
			const assignResult = await assignJobToTechnician(jobId, jobId, techIdForDb);

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
		[technicianLanes, technicians, moveJob, updateJob, unassignedJobs, timeRange, totalWidth]
	);

	const _handleDragMove = useCallback(
		(event: DragMoveEvent) => {
			const jobId = event.active.id as string;
			const jobData = technicianLanes.flatMap((lane) => lane.jobs).find((j) => j.job.id === jobId);

			if (!jobData) {
				setDragPreview(null);
				return;
			}

			const job = jobData.job;
			const targetTechnicianId = (event.over?.id as string | undefined) ?? job.technicianId;
			const targetTech = technicians.find((tech) => tech.id === targetTechnicianId);

			const start = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const end = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
			const duration = end.getTime() - start.getTime();

			const deltaMinutes = Math.round((event.delta.x / HOUR_WIDTH) * 60);
			const snappedMinutes =
				Math.round(deltaMinutes / SNAP_INTERVAL_MINUTES) * SNAP_INTERVAL_MINUTES;
			const newStart = new Date(start.getTime() + snappedMinutes * 60 * 1000);
			const newEnd = new Date(newStart.getTime() + duration);

			setDragPreview({
				label: `${format(newStart, "h:mm a")} – ${format(newEnd, "h:mm a")}`,
				technician: targetTech?.name ?? "Unassigned",
			});
		},
		[technicianLanes, technicians]
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

			const jobData = technicianLanes.flatMap((lane) => lane.jobs).find((j) => j.job.id === jobId);

			if (!jobData) {
				return;
			}

			const job = jobData.job;
			const currentTechId = job.technicianId;
			const start = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const end = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

			const newStart = new Date(start.getTime() + deltaMinutes * 60 * 1000);
			const newEnd = new Date(end.getTime() + deltaMinutes * 60 * 1000);

			moveJob(jobId, currentTechId, newStart, newEnd);

			const toastId = toast.loading(`Moving to ${format(newStart, "h:mm a")}…`);
			const result = await updateAppointmentTimes(jobId, newStart, newEnd);

			if (result.success) {
				toast.success(`Updated to ${format(newStart, "h:mm a")} - ${format(newEnd, "h:mm a")}`, {
					id: toastId,
				});
			} else {
				toast.error(result.error || "Failed to update times", { id: toastId });
			}
		},
		[technicianLanes, moveJob]
	);

	const nudgeJobTechnician = useCallback(
		async (jobId: string, direction: -1 | 1) => {
			const jobData = technicianLanes.flatMap((lane) => lane.jobs).find((j) => j.job.id === jobId);
			if (!jobData) {
				return;
			}
			const job = jobData.job;
			const currentIndex = technicians.findIndex((tech) => tech.id === job.technicianId);
			if (currentIndex === -1) {
				return;
			}
			const targetTech = technicians[currentIndex + direction];
			if (!targetTech) {
				return;
			}

			const start = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
			const end = job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

			moveJob(jobId, targetTech.id, start, end);

			const toastId = toast.loading(`Assigning to ${targetTech.name}…`);
			const result = await assignJobToTechnician(jobId, jobId, targetTech.id);

			if (result.success) {
				toast.success(`Assigned to ${targetTech.name}`, { id: toastId });
			} else {
				toast.error(result.error || "Failed to assign job", { id: toastId });
			}
		},
		[technicianLanes, technicians, moveJob]
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
				deltaX = -Math.min(AUTO_SCROLL_MAX_SPEED, AUTO_SCROLL_EDGE - (pointer.x - rect.left));
			} else if (rect.right - pointer.x < AUTO_SCROLL_EDGE) {
				deltaX = Math.min(AUTO_SCROLL_MAX_SPEED, AUTO_SCROLL_EDGE - (rect.right - pointer.x));
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
						AUTO_SCROLL_EDGE - (pointer.y - timelineRect.top)
					);
				} else if (timelineRect.bottom - pointer.y < AUTO_SCROLL_EDGE) {
					deltaY = Math.min(
						AUTO_SCROLL_MAX_SPEED,
						AUTO_SCROLL_EDGE - (timelineRect.bottom - pointer.y)
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
		[totalWidth, timeRange, isJobHovered]
	);

	const handleMouseLeave = useCallback(() => {
		setHoverPosition(null);
		setHoverTime(null);
	}, []);

	const activeJob = useMemo(() => {
		if (!activeJobId) {
			return null;
		}
		return technicianLanes.flatMap((lane) => lane.jobs).find((j) => j.job.id === activeJobId)?.job;
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
				void nudgeJobTechnician(selectedJobId, event.key === "ArrowUp" ? -1 : 1);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedJobId, adjustJobTime, nudgeJobTechnician]);

	useEffect(() => {
		if (currentTimePosition !== null && scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			container.scrollLeft = Math.max(0, currentTimePosition - container.clientWidth / 2);
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
		[dateObj]
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
				{hasUnassignedJobs && (
					<div
						className="h-full shrink-0"
						style={{ width: unassignedPanelOpen ? "320px" : "48px" }}
					>
						<UnassignedPanel
							activeJobId={activeJobId}
							dropId={UNASSIGNED_DROP_ID}
							isOpen={unassignedPanelOpen}
							onToggle={() => setUnassignedPanelOpen(!unassignedPanelOpen)}
							unassignedJobs={orderedUnassignedJobs}
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
							<div className="bg-muted sticky top-0 z-40 flex h-11 shrink-0 items-center border-b px-4">
								<span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
									Team
								</span>
							</div>

							{/* Team Members */}
							{technicianLanes.map(({ technician, jobs, height }) => {
								const isApprentice = technician.role?.toLowerCase().includes("apprentice");
								const hasJobs = jobs.length > 0;

								return (
									<div
										className="flex items-center border-b px-3"
										key={technician.id}
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
																: "bg-primary/10 text-primary"
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
														hasJobs ? "bg-warning" : "bg-success"
													)}
													title={hasJobs ? "Busy" : "Available"}
												/>
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center gap-1.5">
													<p className="truncate text-sm font-semibold">{technician.name}</p>
													{isApprentice && (
														<Badge className="px-1 py-0 text-[9px]" variant="outline">
															Apprentice
														</Badge>
													)}
												</div>
												<p className="text-muted-foreground truncate text-xs">{technician.role}</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* Timeline (Hours + Lanes) */}
						<div className="flex flex-1 flex-col" style={{ minWidth: totalWidth }}>
							{/* Hour Header - sticky top, scrolls horizontally */}
							<div className="bg-card sticky top-0 z-30 flex h-11 shrink-0 border-b">
								{hourlySlots.map((slot, index) => {
									const hour = slot.getHours();
									const isBusinessHours = hour >= 6 && hour < 18;
									return (
										<div
											className={cn(
												"flex shrink-0 items-center justify-center border-r",
												isBusinessHours ? "bg-card" : "bg-muted/30"
											)}
											key={index}
											style={{ width: HOUR_WIDTH }}
										>
											<span
												className={cn(
													"text-xs font-medium",
													isBusinessHours ? "text-foreground" : "text-muted-foreground"
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
														: "bg-muted/20"
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
				onClose={() => setCommandMenuOpen(false)}
				selectedDate={commandMenuDate}
				unassignedJobs={unassignedJobs}
			/>
		</DndContext>
	);
}
