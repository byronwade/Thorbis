"use client";

import {
	DndContext,
	type DragEndEvent,
	type DragMoveEvent,
	DragOverlay,
	type DragStartEvent,
	MouseSensor,
	pointerWithin,
	TouchSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import {
	AlertTriangle,
	Briefcase,
	Calendar,
	Car,
	Check,
	ChevronRight,
	ClipboardCheck,
	Clock,
	ExternalLink,
	FileText,
	HardHat,
	Layers,
	MapPin,
	Phone,
	Play,
	Plus,
	Repeat,
	Search,
	Send,
	Settings,
	Star,
	User,
	Users,
	Wrench,
	X,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { toast } from "sonner";
import {
	arriveAppointment,
	assignJobToTechnician,
	completeAppointment,
	dispatchAppointment,
	updateAppointmentTimes,
} from "@/actions/schedule-assignments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule, useScheduleRealtime } from "@/hooks/use-schedule";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";
import {
	DRAG_UNASSIGNED_DROP_ID,
	type DragPreview,
	useScheduleDrag,
} from "./hooks/use-schedule-drag";
import {
	QuickAppointmentDialog,
	type TechnicianOption,
} from "./quick-appointment-dialog";
import { ScheduleCommandMenu } from "./schedule-command-menu";
import { ScheduleJobContextMenu } from "./schedule-job-context-menu";
import type {
	AppointmentCategory,
	Job,
	JobType,
	Technician,
} from "./schedule-types";
import { TeamAvatarGroup } from "./team-avatar-manager";
import { UnassignedPanel } from "./unassigned-panel";
import { JobWeatherIndicator } from "./weather-alert-banner";

const HOUR_WIDTH = 80;
const BASE_LANE_HEIGHT = 70; // Minimum lane height
const SIDEBAR_WIDTH = 220;
const JOB_HEIGHT = 48; // Narrower job cards
const JOB_STACK_OFFSET = 6;
const STACK_GAP = 4;
const BASE_CENTER_OFFSET = Math.max(STACK_GAP, (BASE_LANE_HEIGHT - JOB_HEIGHT) / 2);
const SNAP_INTERVAL_MINUTES = 15;
const LARGE_SNAP_MINUTES = 60;

/**
 * Calculate dynamic lane height based on maximum concurrent overlaps
 * Each overlapping job gets full JOB_HEIGHT instead of shrinking
 */
function getLaneHeight(maxOverlaps: number): number {
	if (maxOverlaps <= 1) return BASE_LANE_HEIGHT;
	// Full height for each job + gaps between them + padding top/bottom
	return STACK_GAP * 2 + JOB_HEIGHT * maxOverlaps + (maxOverlaps - 1) * 2;
}

// Auto-scroll configuration for smooth, fast edge scrolling during drag
const AUTO_SCROLL_EDGE = 200; // Start scrolling 200px from edge
const AUTO_SCROLL_INNER_EDGE = 80; // Max speed zone within 80px
const AUTO_SCROLL_MIN_SPEED = 8; // Minimum scroll speed (px/frame)
const AUTO_SCROLL_MAX_SPEED = 45; // Maximum scroll speed (px/frame)
const AUTO_SCROLL_ACCELERATION = 2.5; // Exponential acceleration factor

// Job type visual configuration - distinct colors and icons for each type
type JobTypeConfig = {
	borderColor: string;
	bgColor: string;
	icon: React.ComponentType<{ className?: string }>;
	label: string;
};

const JOB_TYPE_CONFIG: Record<JobType | "default", JobTypeConfig> = {
	emergency: {
		borderColor: "border-l-red-500",
		bgColor: "bg-red-500/10",
		icon: Zap,
		label: "Emergency",
	},
	repair: {
		borderColor: "border-l-orange-500",
		bgColor: "bg-orange-500/10",
		icon: Wrench,
		label: "Repair",
	},
	installation: {
		borderColor: "border-l-green-500",
		bgColor: "bg-green-500/10",
		icon: HardHat,
		label: "Installation",
	},
	maintenance: {
		borderColor: "border-l-blue-500",
		bgColor: "bg-blue-500/10",
		icon: Settings,
		label: "Maintenance",
	},
	premium_maintenance: {
		borderColor: "border-l-violet-500",
		bgColor: "bg-violet-500/10",
		icon: Star,
		label: "Premium",
	},
	inspection: {
		borderColor: "border-l-cyan-500",
		bgColor: "bg-cyan-500/10",
		icon: Search,
		label: "Inspection",
	},
	service: {
		borderColor: "border-l-sky-500",
		bgColor: "bg-sky-500/10",
		icon: ClipboardCheck,
		label: "Service",
	},
	service_call: {
		borderColor: "border-l-teal-500",
		bgColor: "bg-teal-500/10",
		icon: Phone,
		label: "Service Call",
	},
	estimate: {
		borderColor: "border-l-amber-500",
		bgColor: "bg-amber-500/10",
		icon: ClipboardCheck,
		label: "Estimate",
	},
	callback: {
		borderColor: "border-l-pink-500",
		bgColor: "bg-pink-500/10",
		icon: Phone,
		label: "Callback",
	},
	other: {
		borderColor: "border-l-slate-400",
		bgColor: "bg-slate-400/10",
		icon: ClipboardCheck,
		label: "Other",
	},
	default: {
		borderColor: "border-l-slate-400",
		bgColor: "bg-slate-400/10",
		icon: ClipboardCheck,
		label: "Job",
	},
};

const getJobTypeConfig = (job: Job): JobTypeConfig => {
	const config = job.jobType
		? JOB_TYPE_CONFIG[job.jobType]
		: JOB_TYPE_CONFIG.default;
	return config || JOB_TYPE_CONFIG.default;
};

// Get border color class for a job
const getJobTypeColor = (job: Job) => {
	const config = getJobTypeConfig(job);
	return `border-l-2 ${config.borderColor}`;
};

// Appointment category visual configuration - differentiates jobs, meetings, and events
type AppointmentCategoryConfig = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	bgColor: string;
	textColor: string;
	borderStyle: string; // solid for jobs, dashed for meetings, dotted for events
};

const APPOINTMENT_CATEGORY_CONFIG: Record<
	AppointmentCategory,
	AppointmentCategoryConfig
> = {
	job: {
		icon: Briefcase,
		label: "Job",
		bgColor: "bg-blue-500/10",
		textColor: "text-blue-600 dark:text-blue-400",
		borderStyle: "border-solid",
	},
	meeting: {
		icon: Users,
		label: "Meeting",
		bgColor: "bg-purple-500/10",
		textColor: "text-purple-600 dark:text-purple-400",
		borderStyle: "border-solid",
	},
	event: {
		icon: Calendar,
		label: "Event",
		bgColor: "bg-emerald-500/10",
		textColor: "text-emerald-600 dark:text-emerald-400",
		borderStyle: "border-solid",
	},
};

const getAppointmentCategoryConfig = (job: Job): AppointmentCategoryConfig => {
	const category = job.appointmentCategory || "job";
	return APPOINTMENT_CATEGORY_CONFIG[category];
};

type JobWithPosition = {
	job: Job;
	left: number;
	width: number;
	top: number;
	height: number; // Calculated height for side-by-side layout
	column: number; // Which column within the overlap group (0-indexed)
	totalColumns: number; // Total columns in this overlap group
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

		if (
			currentCoords?.lat &&
			currentCoords?.lng &&
			nextCoords?.lat &&
			nextCoords?.lng
		) {
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

/**
 * Detect overlapping jobs and arrange them vertically with dynamic lane height
 * Each job maintains full JOB_HEIGHT - the lane expands to fit all overlapping jobs
 * Returns both the positioned jobs AND the max columns (for calculating lane height)
 */
function detectOverlaps(
	jobs: Array<{ job: Job; left: number; width: number }>,
	laneHeight?: number, // Optional - if not provided, uses BASE_LANE_HEIGHT
): { jobs: JobWithPosition[]; maxColumns: number } {
	if (jobs.length === 0) return { jobs: [], maxColumns: 1 };

	// Sort by start time, then by duration (longer jobs first for better layout)
	const sorted = [...jobs].sort((a, b) => {
		if (a.left !== b.left) return a.left - b.left;
		return b.width - a.width; // Longer jobs first
	});

	// Track positioned jobs with their column assignments
	const positioned: Array<{
		job: Job;
		left: number;
		width: number;
		right: number;
		column: number;
		clusterGroup: number; // Jobs in same cluster share column space
	}> = [];

	let currentCluster = 0;
	let clusterMaxRight = 0;

	sorted.forEach(({ job, left, width }) => {
		const right = left + width;

		// Check if this job starts a new cluster (no overlap with previous jobs)
		if (left >= clusterMaxRight) {
			currentCluster++;
			clusterMaxRight = right;
		} else {
			// Extend cluster's right boundary
			clusterMaxRight = Math.max(clusterMaxRight, right);
		}

		// Find all jobs in current cluster that this job overlaps with
		const overlapping = positioned.filter((p) => {
			return p.clusterGroup === currentCluster && !(right <= p.left || left >= p.right);
		});

		// Find the first available column
		let column = 0;
		const usedColumns = new Set(overlapping.map((p) => p.column));
		while (usedColumns.has(column)) {
			column++;
		}

		positioned.push({
			job,
			left,
			width,
			right,
			column,
			clusterGroup: currentCluster,
		});
	});

	// Calculate total columns for each cluster and find maximum across all clusters
	const clusterColumnCounts = new Map<number, number>();
	let maxColumnsOverall = 1;
	positioned.forEach((p) => {
		const current = clusterColumnCounts.get(p.clusterGroup) || 0;
		const newCount = Math.max(current, p.column + 1);
		clusterColumnCounts.set(p.clusterGroup, newCount);
		maxColumnsOverall = Math.max(maxColumnsOverall, newCount);
	});

	// Use provided lane height or calculate default
	const effectiveLaneHeight = laneHeight ?? getLaneHeight(maxColumnsOverall);

	// Calculate vertical center offset for non-overlapping jobs
	const baseCenterOffset = Math.max(STACK_GAP, (effectiveLaneHeight - JOB_HEIGHT) / 2);

	// Calculate final positions - each job gets full JOB_HEIGHT
	const resultJobs = positioned.map((p) => {
		const totalColumns = clusterColumnCounts.get(p.clusterGroup) || 1;
		const hasOverlap = totalColumns > 1;

		// All jobs get full JOB_HEIGHT - lane height expands to accommodate
		const top = hasOverlap
			? STACK_GAP + p.column * (JOB_HEIGHT + 2) // Stack vertically with 2px gap
			: baseCenterOffset; // Center vertically when no overlap

		return {
			job: p.job,
			left: p.left,
			width: p.width,
			top,
			height: JOB_HEIGHT, // Always full height
			column: p.column,
			totalColumns,
			hasOverlap,
		};
	});

	return { jobs: resultJobs, maxColumns: maxColumnsOverall };
}

/**
 * JobCardContent - Memoized presentational component for job cards
 * PERFORMANCE: This component is separated from useDraggable to prevent re-renders during drag.
 * During drag, only the DraggableJobWrapper re-renders (lightweight), while this expensive
 * component stays memoized and skips re-rendering entirely.
 */
type JobCardContentProps = {
	job: Job;
	width: number;
	hasOverlap: boolean;
	isSelected: boolean;
	isDragging: boolean;
	isPending: boolean;
	isResizing: boolean;
	onSelect: () => void;
	onHover: (isHovering: boolean) => void;
	onResizeStart: (e: React.MouseEvent, direction: "start" | "end") => void;
	onContextMenuChange: (open: boolean) => void;
	onDispatch: (e: React.MouseEvent) => void;
	onArrive: (e: React.MouseEvent) => void;
	onComplete: (e: React.MouseEvent) => void;
};

const JobCardContent = memo(
	function JobCardContent({
		job,
		width,
		hasOverlap,
		isSelected,
		isDragging,
		isPending,
		isResizing,
		onSelect,
		onHover,
		onResizeStart,
		onContextMenuChange,
		onDispatch,
		onArrive,
		onComplete,
	}: JobCardContentProps) {
		// Lazy tooltip state - only render tooltips when hovered for performance
		const [showTooltips, setShowTooltips] = useState(false);

		// Determine which quick action to show based on status
		const quickAction = useMemo(() => {
			if (!job.jobId || job.assignments.length === 0) return null;

			switch (job.status) {
				case "scheduled":
					return {
						icon: Send,
						label: "Dispatch",
						onClick: onDispatch,
						className: "bg-blue-500 hover:bg-blue-600 text-white",
					};
				case "dispatched":
					return {
						icon: Car,
						label: "Arrive",
						onClick: onArrive,
						className: "bg-sky-500 hover:bg-sky-600 text-white",
					};
				case "arrived":
					return {
						icon: Play,
						label: "Start",
						onClick: onComplete,
						className: "bg-emerald-500 hover:bg-emerald-600 text-white",
					};
				case "in-progress":
					return {
						icon: Check,
						label: "Done",
						onClick: onComplete,
						className: "bg-amber-500 hover:bg-amber-600 text-white",
					};
				default:
					return null;
			}
		}, [job.status, job.jobId, job.assignments.length, onDispatch, onArrive, onComplete]);

		const startTime =
			job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
		const endTime =
			job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
		const duration = Math.round(
			(endTime.getTime() - startTime.getTime()) / (1000 * 60),
		);

		const borderColor = getJobTypeColor(job);

		// Responsive breakpoints based on card width
		const isCompact = width < 100; // Very short appointments (~1.25 hours)
		const isMedium = width >= 100 && width < 160; // Medium appointments (1.25-2 hours)
		const isWide = width >= 160; // Full layout (2+ hours)

		const handleMouseEnter = useCallback(() => {
			onHover(true);
			setShowTooltips(true);
		}, [onHover]);

		const handleMouseLeave = useCallback(() => {
			onHover(false);
			setShowTooltips(false);
		}, [onHover]);

		return (
			<>
				{/* Left Resize Handle - wider hit area for easier grabbing */}
				<div
					className="absolute top-0 -left-1 h-full w-3 cursor-ew-resize"
					onMouseDown={(e) => onResizeStart(e, "start")}
					style={{ zIndex: 60 }}
				>
					{/* Visible indicator on hover */}
					<div className="bg-primary absolute top-0 left-1 h-full w-1 rounded-l opacity-0 transition-opacity group-hover:opacity-100" />
				</div>

				<ScheduleJobContextMenu
					job={job}
					onOpenChange={onContextMenuChange}
				>
					{(() => {
						const categoryConfig = getAppointmentCategoryConfig(job);
						const typeConfig = getJobTypeConfig(job);
						const TypeIcon = typeConfig.icon;
						const CategoryIcon = categoryConfig.icon;

						return (
							<HoverCard openDelay={400} closeDelay={100}>
								<HoverCardTrigger asChild>
									<div
										className={cn(
											"bg-card relative flex h-full cursor-grab items-center gap-2 rounded-md border px-2.5 py-1 active:cursor-grabbing",
											// Performance: Only transition shadow/ring, not all properties. Disable during drag.
											!isDragging &&
												"transition-[box-shadow,ring] duration-150 ease-out hover:shadow-sm",
											borderColor,
											categoryConfig.borderStyle,
											job.isUnassigned && "!border-red-500",
											isSelected && "ring-primary shadow-md ring-1",
											isDragging &&
												"shadow-2xl ring-2 ring-primary/50 scale-[1.02] opacity-90",
											(job.status === "completed" ||
												job.status === "closed") &&
												"opacity-50",
											// Side-by-side overlap: add subtle shadow on left for visual separation
											hasOverlap && "shadow-sm",
										)}
										onClick={onSelect}
										onMouseEnter={handleMouseEnter}
										onMouseLeave={handleMouseLeave}
									>
								{/* Overlap indicator - shows when job overlaps with others */}
								{hasOverlap && showTooltips && (
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/20 shadow-sm dark:bg-amber-500/30">
												<Layers className="size-2.5 text-amber-600 dark:text-amber-400" />
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											Scheduled at same time as another job
										</TooltipContent>
									</Tooltip>
								)}
								{hasOverlap && !showTooltips && (
									<div className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/20 shadow-sm dark:bg-amber-500/30">
										<Layers className="size-2.5 text-amber-600 dark:text-amber-400" />
									</div>
								)}

								{/* Recurring indicator - subtle */}
								{job.recurrence && showTooltips && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Repeat className="absolute -top-0.5 left-0.5 size-2.5 text-violet-500" />
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											Recurring job
										</TooltipContent>
									</Tooltip>
								)}
								{job.recurrence && !showTooltips && (
									<Repeat className="absolute -top-0.5 left-0.5 size-2.5 text-violet-500" />
								)}

								{/* Appointment Category Indicator - hidden on compact */}
								{!isCompact && (showTooltips ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<div
												className={cn(
													"flex size-4 shrink-0 items-center justify-center rounded-sm",
													categoryConfig.bgColor,
												)}
											>
												<CategoryIcon
													className={cn(
														"size-2.5",
														categoryConfig.textColor,
													)}
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											{categoryConfig.label}
										</TooltipContent>
									</Tooltip>
								) : (
									<div
										className={cn(
											"flex size-4 shrink-0 items-center justify-center rounded-sm",
											categoryConfig.bgColor,
										)}
									>
										<CategoryIcon
											className={cn(
												"size-2.5",
												categoryConfig.textColor,
											)}
										/>
									</div>
								))}

								{/* Job Type Icon - hidden on compact */}
								{!isCompact && (showTooltips ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<div
												className={cn(
													"flex size-5 shrink-0 items-center justify-center rounded",
													typeConfig.bgColor,
												)}
											>
												<TypeIcon
													className={cn(
														"size-3",
														typeConfig.borderColor.replace(
															"border-l-",
															"text-",
														),
													)}
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											{typeConfig.label}
										</TooltipContent>
									</Tooltip>
								) : (
									<div
										className={cn(
											"flex size-5 shrink-0 items-center justify-center rounded",
											typeConfig.bgColor,
										)}
									>
										<TypeIcon
											className={cn(
												"size-3",
												typeConfig.borderColor.replace(
													"border-l-",
													"text-",
												),
											)}
										/>
									</div>
								))}

								{/* Customer Name - Primary */}
								<span className="text-foreground flex-1 truncate text-xs font-semibold">
									{job.customer?.name || "Unknown Customer"}
								</span>

								{/* Team Avatars - hidden on compact, limited on medium */}
								{!isCompact && (
									<TeamAvatarGroup
										assignments={job.assignments}
										maxVisible={isMedium ? 1 : 2}
										onRemove={(_techId) => {
											// TODO: Implement remove team member
										}}
									/>
								)}

								{/* Quick Action Button - only on wide cards */}
								{isWide && quickAction && showTooltips && (
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type="button"
												onClick={quickAction.onClick}
												disabled={isPending}
												className={cn(
													"flex size-6 items-center justify-center rounded-md opacity-0 transition-opacity duration-150 group-hover:opacity-100",
													"focus:outline-none focus:ring-2 focus:ring-offset-1",
													quickAction.className,
													isPending && "cursor-wait opacity-50",
												)}
											>
												{isPending ? (
													<div className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
												) : (
													<quickAction.icon className="size-3" />
												)}
											</button>
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											{quickAction.label}
										</TooltipContent>
									</Tooltip>
								)}
								{isWide && quickAction && !showTooltips && (
									<button
										type="button"
										onClick={quickAction.onClick}
										disabled={isPending}
										className={cn(
											"flex size-6 items-center justify-center rounded-md opacity-0 transition-opacity duration-150 group-hover:opacity-100",
											"focus:outline-none focus:ring-2 focus:ring-offset-1",
											quickAction.className,
											isPending && "cursor-wait opacity-50",
										)}
									>
										{isPending ? (
											<div className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
										) : (
											<quickAction.icon className="size-3" />
										)}
									</button>
								)}

								{/* View Details Link - only on wide cards */}
								{isWide && job.jobId && showTooltips && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={`/dashboard/work/${job.jobId}`}
												onClick={(e) => e.stopPropagation()}
												className="flex size-6 items-center justify-center rounded-md bg-slate-100 opacity-0 transition-[opacity,background-color] duration-150 hover:bg-slate-200 group-hover:opacity-100 dark:bg-slate-800 dark:hover:bg-slate-700"
											>
												<ExternalLink className="size-3 text-slate-600 dark:text-slate-400" />
											</Link>
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											View Details
										</TooltipContent>
									</Tooltip>
								)}
								{isWide && job.jobId && !showTooltips && (
									<Link
										href={`/dashboard/work/${job.jobId}`}
										onClick={(e) => e.stopPropagation()}
										className="flex size-6 items-center justify-center rounded-md bg-slate-100 opacity-0 transition-[opacity,background-color] duration-150 hover:bg-slate-200 group-hover:opacity-100 dark:bg-slate-800 dark:hover:bg-slate-700"
									>
										<ExternalLink className="size-3 text-slate-600 dark:text-slate-400" />
									</Link>
								)}

									{/* Status dot - larger for better visibility */}
								<div
									className={cn(
										"size-2 shrink-0 rounded-full",
										job.status === "scheduled" && "bg-blue-500",
										job.status === "dispatched" && "bg-sky-500",
										job.status === "arrived" && "bg-emerald-500",
										job.status === "in-progress" && "bg-amber-500",
										(job.status === "closed" ||
											job.status === "completed") &&
											"bg-slate-400",
										job.status === "cancelled" && "bg-slate-300",
									)}
								/>
								</div>
							</HoverCardTrigger>
								<HoverCardContent
									side="bottom"
									align="start"
									className="w-80 p-4 bg-popover border-2 border-border shadow-2xl shadow-black/50 ring-1 ring-white/10 dark:ring-white/5"
								>
									{/* Title & Status */}
									<div className="flex items-start justify-between gap-3 mb-4">
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-sm truncate">
												{job.title || "Untitled Job"}
											</h3>
											<p className="text-xs text-muted-foreground mt-0.5">
												{typeConfig.label} · {categoryConfig.label}
											</p>
										</div>
										<Badge
											variant="outline"
											className={cn(
												"text-[10px] shrink-0",
												job.status === "scheduled" && "border-blue-500/50 text-blue-500",
												job.status === "dispatched" && "border-sky-500/50 text-sky-500",
												job.status === "arrived" && "border-emerald-500/50 text-emerald-500",
												job.status === "in-progress" && "border-amber-500/50 text-amber-500",
												(job.status === "completed" || job.status === "closed") && "border-muted-foreground/50 text-muted-foreground",
												job.status === "cancelled" && "border-red-500/50 text-red-500",
											)}
										>
											{job.status.replace("-", " ")}
										</Badge>
									</div>

									{/* Customer */}
									<div className="flex items-center gap-3 mb-3">
										<Avatar className="size-8">
											<AvatarFallback className="text-xs">
												{(job.customer?.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												{job.customer?.name || "Unknown Customer"}
											</p>
											{job.customer?.phone && (
												<p className="text-xs text-muted-foreground">{job.customer.phone}</p>
											)}
										</div>
									</div>

									{/* Details */}
									<div className="space-y-2 text-sm">
										{/* Time */}
										<div className="flex items-center gap-2 text-muted-foreground">
											<Clock className="size-3.5 shrink-0" />
											<span>
												{format(startTime, "h:mm a")} – {format(endTime, "h:mm a")}
												<span className="text-muted-foreground/60 ml-1">({duration}m)</span>
											</span>
										</div>

										{/* Date */}
										<div className="flex items-center gap-2 text-muted-foreground">
											<Calendar className="size-3.5 shrink-0" />
											<span>{format(startTime, "EEE, MMM d, yyyy")}</span>
										</div>

										{/* Location */}
										{job.location?.address?.street && (
											<div className="flex items-start gap-2 text-muted-foreground">
												<MapPin className="size-3.5 shrink-0 mt-0.5" />
												<span className="line-clamp-2">
													{job.location.address.street}
													{job.location.address.city && `, ${job.location.address.city}`}
												</span>
											</div>
										)}

										{/* Assigned */}
										{job.assignments && job.assignments.length > 0 && (
											<div className="flex items-center gap-2 text-muted-foreground">
												<User className="size-3.5 shrink-0" />
												<span className="truncate">
													{job.assignments.map(a => a.technicianName || "Unknown").join(", ")}
												</span>
											</div>
										)}
									</div>

									{/* Notes */}
									{job.description && (
										<p className="mt-3 pt-3 border-t text-xs text-muted-foreground line-clamp-2">
											{job.description}
										</p>
									)}

									{/* Footer */}
									{job.jobId && (
										<div className="mt-3 pt-3 border-t">
											<Link
												href={`/dashboard/work/${job.jobId}`}
												className="text-xs text-primary hover:underline inline-flex items-center gap-1"
												onClick={(e) => e.stopPropagation()}
											>
												View job details
												<ExternalLink className="size-3" />
											</Link>
										</div>
									)}
								</HoverCardContent>
							</HoverCard>
						);
					})()}
				</ScheduleJobContextMenu>

				{/* Right Resize Handle - wider hit area for easier grabbing */}
				<div
					className="absolute top-0 -right-1 h-full w-3 cursor-ew-resize"
					onMouseDown={(e) => onResizeStart(e, "end")}
					style={{ zIndex: 60 }}
				>
					{/* Visible indicator on hover */}
					<div className="bg-primary absolute top-0 right-1 h-full w-1 rounded-r opacity-0 transition-opacity group-hover:opacity-100" />
				</div>
			</>
		);
	},
	(prev, next) => {
		// PERFORMANCE: Strict comparison - only re-render if actual visible data changes
		// This memo comparison is critical for drag performance
		return (
			prev.job.id === next.job.id &&
			prev.job.status === next.job.status &&
			prev.job.startTime === next.job.startTime &&
			prev.job.endTime === next.job.endTime &&
			prev.job.customer?.name === next.job.customer?.name &&
			prev.job.assignments.length === next.job.assignments.length &&
			prev.width === next.width &&
			prev.hasOverlap === next.hasOverlap &&
			prev.isSelected === next.isSelected &&
			prev.isDragging === next.isDragging &&
			prev.isPending === next.isPending &&
			prev.isResizing === next.isResizing
		);
	},
);

/**
 * DraggableJobWrapper - Lightweight wrapper that handles drag state
 * PERFORMANCE: This component will re-render during drag (due to useDraggable),
 * but it's lightweight. The expensive JobCardContent inside stays memoized.
 */
const JobCard = memo(
	function JobCard({
		job,
		left,
		width,
		top,
		height,
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
		height: number;
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
		const [isPending, startTransition] = useTransition();
		const { attributes, listeners, setNodeRef, transform, isDragging } =
			useDraggable({
				id: job.id,
				data: { job },
				disabled: isResizing,
			});

		// Quick action handlers
		const handleDispatch = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation();
				if (!job.id) return;
				startTransition(async () => {
					const result = await dispatchAppointment(job.id);
					if (result.success) {
						toast.success("Job dispatched");
					} else {
						toast.error(result.error || "Failed to dispatch");
					}
				});
			},
			[job.id],
		);

		const handleArrive = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation();
				if (!job.id) return;
				startTransition(async () => {
					const result = await arriveAppointment(job.id);
					if (result.success) {
						toast.success("Marked as arrived");
					} else {
						toast.error(result.error || "Failed to update");
					}
				});
			},
			[job.id],
		);

		const handleComplete = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation();
				if (!job.id) return;
				startTransition(async () => {
					const result = await completeAppointment(job.id);
					if (result.success) {
						toast.success("Job completed");
					} else {
						toast.error(result.error || "Failed to complete");
					}
				});
			},
			[job.id],
		);

		// Calculate position style - this is the only thing the wrapper needs
		// Note: `top` is already calculated with proper offsets in detectOverlaps()
		const style = useMemo(() => ({
			left: `${left}px`,
			width: `${width}px`,
			top: `${top}px`,
			height: `${height}px`,
			transform: CSS.Translate.toString(transform),
			zIndex: isDragging ? 50 : isSelected ? 20 : hasOverlap ? 15 : 10,
			// Opacity handled by CSS class (opacity-0 when isDragging)
		}), [left, width, top, height, transform, isDragging, isSelected, hasOverlap]);

		// Resize handler - passed to JobCardContent
		const handleResizeStart = useCallback(
			(e: React.MouseEvent, direction: "start" | "end") => {
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
			},
			[job.id, onHover, onResize, onResizeComplete],
		);

		const handleContextMenuChange = useCallback((open: boolean) => {
			setIsContextMenuOpen(open);
		}, []);

		// PERFORMANCE: This wrapper is lightweight - only handles position and drag state
		// The expensive JobCardContent inside stays memoized and won't re-render during drag movement
		return (
			<TooltipProvider>
				<div
					className={cn(
						"job-card group absolute will-change-transform",
						// Smooth position transitions when not dragging (for repositioning after drop)
						!isDragging &&
							"transition-[left,top,width] duration-200 ease-out",
						// Hide original card when dragging (DragOverlay shows the dragged item)
						isDragging && "opacity-0",
					)}
					ref={setNodeRef}
					style={style}
					{...attributes}
					{...listeners}
				>
					<JobCardContent
						job={job}
						width={width}
						hasOverlap={hasOverlap}
						isSelected={isSelected}
						isDragging={isDragging}
						isPending={isPending}
						isResizing={isResizing}
						onSelect={onSelect}
						onHover={onHover}
						onResizeStart={handleResizeStart}
						onContextMenuChange={handleContextMenuChange}
						onDispatch={handleDispatch}
						onArrive={handleArrive}
						onComplete={handleComplete}
					/>
				</div>
			</TooltipProvider>
		);
	},
	(prev, next) => {
		// PERFORMANCE: Only compare position props - content comparison is in JobCardContent
		return (
			prev.job.id === next.job.id &&
			prev.left === next.left &&
			prev.width === next.width &&
			prev.top === next.top &&
			prev.height === next.height &&
			prev.hasOverlap === next.hasOverlap &&
			prev.isSelected === next.isSelected
		);
	},
);

const TechnicianLane = memo(
	function TechnicianLane({
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
		onDragCreate,
		totalWidth,
		timeRangeStart,
		isSelectionMode,
		selectedJobIds,
		onToggleJobSelection,
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
		onDragCreate: (
			technicianId: string,
			startTime: Date,
			durationMinutes: number,
		) => void;
		totalWidth: number;
		timeRangeStart: Date;
		isSelectionMode: boolean;
		selectedJobIds: Set<string>;
		onToggleJobSelection: (jobId: string) => void;
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
				// Calculate total minutes based on actual buffer width (multi-day support)
				const totalHours = totalWidth / HOUR_WIDTH;
				const minutesFromStart = (clickX / totalWidth) * (totalHours * 60);

				// Snap to 15-minute intervals
				const snappedMinutes = Math.round(minutesFromStart / 15) * 15;

				const newStartTime = new Date(timeRangeStart);
				newStartTime.setMinutes(newStartTime.getMinutes() + snappedMinutes);

				onDoubleClick(technician.id, newStartTime);
			},
			[totalWidth, timeRangeStart, technician.id, onDoubleClick],
		);

		// Drag-to-create state
		const [isDraggingToCreate, setIsDraggingToCreate] = useState(false);
		const [dragStartX, setDragStartX] = useState(0);
		const [dragCurrentX, setDragCurrentX] = useState(0);
		const [dragStartY, setDragStartY] = useState(0);
		// Store the lane rect when drag starts so we don't depend on ref in effects
		const dragLaneRectRef = useRef<DOMRect | null>(null);
		const laneRef = useRef<HTMLDivElement>(null);

		// Convert pixel position to time (multi-day buffer support)
		const pixelToTime = useCallback(
			(pixelX: number): Date => {
				const totalHours = totalWidth / HOUR_WIDTH;
				const minutesFromStart = (pixelX / totalWidth) * (totalHours * 60);
				const snappedMinutes = Math.round(minutesFromStart / 15) * 15;
				const time = new Date(timeRangeStart);
				time.setMinutes(time.getMinutes() + snappedMinutes);
				return time;
			},
			[totalWidth, timeRangeStart],
		);

		// Handle mouse down to start drag-to-create
		const handleCanvasMouseDown = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				// Don't start drag-to-create if dnd-kit is already handling a drag
				if (isDragActive) {
					return;
				}

				// Only trigger on empty space (not on job cards or resize handles)
				if ((e.target as HTMLElement).closest(".job-card")) {
					return;
				}

				// Only left mouse button
				if (e.button !== 0) return;

				const rect = e.currentTarget.getBoundingClientRect();
				const startX = e.clientX - rect.left;
				const startY = e.clientY - rect.top;

				// Store the rect for use in global event handlers
				dragLaneRectRef.current = rect;
				setDragStartX(startX);
				setDragCurrentX(startX);
				setDragStartY(startY);
				setIsDraggingToCreate(true);

				// Prevent text selection during drag
				e.preventDefault();
			},
			[isDragActive],
		);

		// Cancel drag-to-create if dnd-kit drag starts (race condition safeguard)
		useEffect(() => {
			if (isDragActive && isDraggingToCreate) {
				setIsDraggingToCreate(false);
			}
		}, [isDragActive, isDraggingToCreate]);

		// Handle mouse move during drag-to-create
		useEffect(() => {
			if (!isDraggingToCreate) return;

			// Use stored rect from mousedown - this ensures we have the correct reference
			const rect = dragLaneRectRef.current;
			if (!rect) return;

			const handleMouseMove = (e: MouseEvent) => {
				const currentX = Math.max(
					0,
					Math.min(e.clientX - rect.left, totalWidth),
				);
				setDragCurrentX(currentX);
			};

			const handleMouseUp = (e: MouseEvent) => {
				const endX = Math.max(0, Math.min(e.clientX - rect.left, totalWidth));

				// Calculate start and end times
				const minX = Math.min(dragStartX, endX);
				const maxX = Math.max(dragStartX, endX);

				// Only trigger if dragged more than 20 pixels (to avoid accidental clicks)
				const dragDistance = maxX - minX;
				console.log(
					"[DEBUG] MouseUp - dragDistance:",
					dragDistance,
					"minX:",
					minX,
					"maxX:",
					maxX,
				);

				// Clear drag state first
				setIsDraggingToCreate(false);
				setDragStartX(0);
				setDragCurrentX(0);
				dragLaneRectRef.current = null;

				if (dragDistance > 20) {
					const startTime = pixelToTime(minX);
					const endTime = pixelToTime(maxX);
					const durationMinutes = Math.round(
						(endTime.getTime() - startTime.getTime()) / (1000 * 60),
					);

					// Minimum 15 minutes - open dialog
					if (durationMinutes >= 15) {
						// Use setTimeout to ensure state clearing is processed first
						setTimeout(() => {
							console.log("[DEBUG] Drag-to-create:", {
								techId: technician.id,
								startTime,
								durationMinutes,
							});
							onDragCreate(technician.id, startTime, durationMinutes);
						}, 0);
					} else {
						console.log(
							"[DEBUG] Duration too short:",
							durationMinutes,
							"minutes",
						);
					}
				}
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}, [
			isDraggingToCreate,
			dragStartX,
			totalWidth,
			pixelToTime,
			technician.id,
			onDragCreate,
		]);

		// Calculate drag preview position and dimensions
		const dragPreviewStyle = useMemo(() => {
			if (!isDraggingToCreate) return null;
			const minX = Math.min(dragStartX, dragCurrentX);
			const width = Math.abs(dragCurrentX - dragStartX);

			// Calculate which sub-row was clicked (for overlapping appointments)
			const subRow = Math.max(
				0,
				Math.floor((dragStartY - STACK_GAP) / (JOB_HEIGHT + 2)),
			);
			const top = STACK_GAP + subRow * (JOB_HEIGHT + 2);

			return { left: minX, width, top };
		}, [isDraggingToCreate, dragStartX, dragCurrentX, dragStartY]);

		// Calculate preview time labels
		const dragTimeLabels = useMemo(() => {
			if (
				!isDraggingToCreate ||
				!dragPreviewStyle ||
				dragPreviewStyle.width < 20
			)
				return null;
			const minX = Math.min(dragStartX, dragCurrentX);
			const maxX = Math.max(dragStartX, dragCurrentX);
			const startTime = pixelToTime(minX);
			const endTime = pixelToTime(maxX);
			const durationMinutes = Math.round(
				(endTime.getTime() - startTime.getTime()) / (1000 * 60),
			);
			return {
				start: format(startTime, "h:mm a"),
				end: format(endTime, "h:mm a"),
				duration:
					durationMinutes >= 60
						? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
						: `${durationMinutes}m`,
			};
		}, [
			isDraggingToCreate,
			dragPreviewStyle,
			dragStartX,
			dragCurrentX,
			pixelToTime,
		]);

		// Combine refs for both droppable and local lane ref
		const combinedRef = useCallback(
			(node: HTMLDivElement | null) => {
				setNodeRef(node);
				(laneRef as React.MutableRefObject<HTMLDivElement | null>).current =
					node;
			},
			[setNodeRef],
		);

		return (
			<div
				className={cn(
					"relative border-b transition-[background-color,box-shadow] duration-150",
					isDragActive && "bg-muted/20",
					isOver && "bg-primary/10 ring-primary shadow-inner ring-2 ring-inset",
					isDraggingToCreate && "cursor-crosshair select-none",
				)}
				ref={combinedRef}
				style={{ height, minHeight: height, maxHeight: height }}
				onDoubleClick={handleDoubleClick}
				onMouseDown={handleCanvasMouseDown}
			>
				{/* Drop zone indicator */}
				{isOver && (
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
						<div className="fade-in zoom-in-95 animate-in bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold shadow-lg duration-200">
							Drop to assign to {technician.name}
						</div>
					</div>
				)}

				{/* Drag-to-create preview */}
				{isDraggingToCreate &&
					dragPreviewStyle &&
					dragPreviewStyle.width > 10 && (
						<div
							className="pointer-events-none absolute z-50"
							style={{
								left: dragPreviewStyle.left,
								width: dragPreviewStyle.width,
								height: JOB_HEIGHT,
								top: dragPreviewStyle.top,
							}}
						>
							{/* Time badge positioned ABOVE the preview box */}
							{dragTimeLabels && (
								<div className="absolute -top-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-md">
									<Clock className="h-3 w-3" />
									<span>
										{dragTimeLabels.start} - {dragTimeLabels.end}
									</span>
									<span className="text-blue-200">
										({dragTimeLabels.duration})
									</span>
								</div>
							)}
							{/* Dotted preview box (empty inside) */}
							<div className="h-full w-full rounded-lg border-2 border-dashed border-blue-400 bg-blue-500/40 shadow-lg" />
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
							<TravelTimeIndicator
								gap={gap}
								key={`travel-${gap.fromJobId}-${gap.toJobId}`}
							/>
						))}

						{/* Job cards */}
						{jobs.map(({ job, left, width, top, height: jobHeight, hasOverlap }) => (
							<JobCard
								hasOverlap={hasOverlap}
								height={jobHeight}
								isSelected={
									isSelectionMode
										? selectedJobIds.has(job.id)
										: selectedJobId === job.id
								}
								job={job}
								key={job.id}
								left={left}
								onHover={onJobHover}
								onResize={onResize}
								onResizeComplete={onResizeComplete}
								onSelect={() =>
									isSelectionMode
										? onToggleJobSelection(job.id)
										: onSelectJob(job.id)
								}
								top={top}
								width={width}
							/>
						))}
					</>
				)}
			</div>
		);
	},
	(prev, next) => {
		// Performance: Custom comparison to avoid re-renders from callback references
		return (
			prev.technician.id === next.technician.id &&
			prev.height === next.height &&
			prev.selectedJobId === next.selectedJobId &&
			prev.isDragActive === next.isDragActive &&
			prev.totalWidth === next.totalWidth &&
			prev.timeRangeStart === next.timeRangeStart &&
			prev.isSelectionMode === next.isSelectionMode &&
			prev.selectedJobIds === next.selectedJobIds &&
			prev.jobs === next.jobs // jobs array reference - will be new if positions changed
		);
	},
);

export function DispatchTimeline() {
	const [mounted, setMounted] = useState(false);
	const [hoverPosition, setHoverPosition] = useState<number | null>(null);
	const [hoverTime, setHoverTime] = useState<string | null>(null);
	const [isJobHovered, setIsJobHovered] = useState(false);
	const [activeJobId, setActiveJobId] = useState<string | null>(null);
	const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
	const [unassignedPanelOpen, setUnassignedPanelOpen] = useState(false);
	const [unassignedOrder, setUnassignedOrder] = useState<string[]>([]);
	const [commandMenuOpen, setCommandMenuOpen] = useState(false);
	const [commandMenuDate, setCommandMenuDate] = useState<Date | null>(null);
	const [quickCreateTechId, setQuickCreateTechId] = useState<string | null>(
		null,
	);
	const [showQuickAppointment, setShowQuickAppointment] = useState(false);
	const [quickAppointmentTime, setQuickAppointmentTime] = useState<Date | null>(
		null,
	);
	const [quickAppointmentDuration, setQuickAppointmentDuration] = useState<
		number | null
	>(null);
	// Multi-select mode state
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
	const [isBulkActionPending, startBulkTransition] = useTransition();
	// Current time state - updates every minute for the time indicator
	const [currentTime, setCurrentTime] = useState(() => new Date());
	// Navigation for technician detail page
	const router = useRouter();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
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
		refresh,
	} = useSchedule();
	// Use individual selectors for better performance (prevents re-renders when unrelated state changes)
	const currentDate = useScheduleViewStore((s) => s.currentDate);
	const bufferStartDate = useScheduleViewStore((s) => s.bufferStartDate);
	const bufferEndDate = useScheduleViewStore((s) => s.bufferEndDate);
	const extendBufferLeft = useScheduleViewStore((s) => s.extendBufferLeft);
	const extendBufferRight = useScheduleViewStore((s) => s.extendBufferRight);

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

	// Multi-select handlers
	const toggleSelectionMode = useCallback(() => {
		setIsSelectionMode((prev) => !prev);
		if (isSelectionMode) {
			// Clear selection when exiting selection mode
			setSelectedJobIds(new Set());
		}
	}, [isSelectionMode]);

	const toggleJobSelection = useCallback((jobId: string) => {
		setSelectedJobIds((prev) => {
			const next = new Set(prev);
			if (next.has(jobId)) {
				next.delete(jobId);
			} else {
				next.add(jobId);
			}
			return next;
		});
	}, []);

	const selectAllJobs = useCallback(() => {
		const allJobIds = jobs
			.filter((job) => !job.isUnassigned)
			.map((job) => job.id);
		setSelectedJobIds(new Set(allJobIds));
	}, [jobs]);

	const clearSelection = useCallback(() => {
		setSelectedJobIds(new Set());
	}, []);

	// Bulk action handlers
	const handleBulkDispatch = useCallback(() => {
		startBulkTransition(async () => {
			const jobIds = Array.from(selectedJobIds);
			let successCount = 0;
			let errorCount = 0;

			for (const jobId of jobIds) {
				const result = await dispatchAppointment(jobId);
				if (result.success) {
					successCount++;
				} else {
					errorCount++;
				}
			}

			if (successCount > 0) {
				toast.success(
					`Dispatched ${successCount} job${successCount > 1 ? "s" : ""}`,
				);
			}
			if (errorCount > 0) {
				toast.error(
					`Failed to dispatch ${errorCount} job${errorCount > 1 ? "s" : ""}`,
				);
			}

			// Clear selection after bulk action
			setSelectedJobIds(new Set());
			setIsSelectionMode(false);
		});
	}, [selectedJobIds]);

	const handleBulkComplete = useCallback(() => {
		startBulkTransition(async () => {
			const jobIds = Array.from(selectedJobIds);
			let successCount = 0;
			let errorCount = 0;

			for (const jobId of jobIds) {
				const result = await completeAppointment(jobId);
				if (result.success) {
					successCount++;
				} else {
					errorCount++;
				}
			}

			if (successCount > 0) {
				toast.success(
					`Completed ${successCount} job${successCount > 1 ? "s" : ""}`,
				);
			}
			if (errorCount > 0) {
				toast.error(
					`Failed to complete ${errorCount} job${errorCount > 1 ? "s" : ""}`,
				);
			}

			// Clear selection after bulk action
			setSelectedJobIds(new Set());
			setIsSelectionMode(false);
		});
	}, [selectedJobIds]);

	// Configure drag sensors for responsive, smooth dragging
	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 3, // Reduced from 5px for faster drag activation
		},
	});
	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: 150, // Short delay for touch to distinguish from scroll
			tolerance: 5, // Small movement tolerance during delay
		},
	});
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

	// Convert buffer dates to Date objects
	const bufferStart = useMemo(
		() =>
			bufferStartDate instanceof Date
				? bufferStartDate
				: new Date(bufferStartDate),
		[bufferStartDate],
	);
	const bufferEnd = useMemo(
		() =>
			bufferEndDate instanceof Date ? bufferEndDate : new Date(bufferEndDate),
		[bufferEndDate],
	);

	// Generate hourly slots for the entire buffer range (enables infinite scroll)
	// PERFORMANCE: Pre-calculate timestamps, lazy Date creation in render
	const hourlySlotData = useMemo(() => {
		const startTime = new Date(bufferStart);
		startTime.setHours(0, 0, 0, 0);
		const startTs = startTime.getTime();

		const endTime = new Date(bufferEnd);
		endTime.setHours(23, 59, 59, 999);
		const endTs = endTime.getTime();

		// Calculate total hours and store as timestamps (faster than Date objects)
		const totalHours = Math.ceil((endTs - startTs) / (1000 * 60 * 60));
		const hourMs = 1000 * 60 * 60;

		// Return metadata instead of array of Dates (reduces memory + GC)
		return {
			startTs,
			totalHours,
			hourMs,
			// Helper to get Date for a specific index (created on-demand)
			getSlot: (index: number) => new Date(startTs + index * hourMs),
		};
	}, [bufferStart, bufferEnd]);

	// For compatibility with existing code, create slots array lazily
	const hourlySlots = useMemo(() => {
		const slots: Date[] = [];
		for (let i = 0; i < hourlySlotData.totalHours; i++) {
			slots.push(hourlySlotData.getSlot(i));
		}
		return slots;
	}, [hourlySlotData]);

	const timeRange = useMemo(() => {
		const start = hourlySlots[0] ?? new Date(bufferStart);
		const lastSlot = hourlySlots.at(-1);
		const end = lastSlot ? new Date(lastSlot) : new Date(bufferEnd);
		end.setHours(end.getHours(), 59, 59, 999);
		return { start, end };
	}, [hourlySlots, bufferStart, bufferEnd]);

	// PERFORMANCE: Use pre-calculated totalHours instead of array length
	const totalWidth = hourlySlotData.totalHours * HOUR_WIDTH;

	// Calculate pixel offset for the current date within the buffer
	const currentDateOffset = useMemo(() => {
		const currentDayStart = new Date(dateObj);
		currentDayStart.setHours(0, 0, 0, 0);
		const bufferStartTime = new Date(bufferStart);
		bufferStartTime.setHours(0, 0, 0, 0);
		const hoursOffset =
			(currentDayStart.getTime() - bufferStartTime.getTime()) /
			(1000 * 60 * 60);
		return hoursOffset * HOUR_WIDTH;
	}, [dateObj, bufferStart]);

	const currentTimePosition = useMemo(() => {
		// Use currentTime state instead of new Date() so it updates every minute
		// Check if current time is within the buffer range
		if (currentTime < timeRange.start || currentTime > timeRange.end) {
			return null;
		}

		// Calculate position based on minutes from buffer start
		const totalMinutes =
			(timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60);
		const currentMinutes =
			(currentTime.getTime() - timeRange.start.getTime()) / (1000 * 60);
		return (currentMinutes / totalMinutes) * totalWidth;
	}, [timeRange, totalWidth, currentTime]);

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
				// Minimum 80px width for readability (was 60px which caused text truncation)
				const width = Math.max(80, (durationMinutes / 60) * HOUR_WIDTH);

				return { job, left, width };
			});

			// Detect overlaps and get max columns for this technician
			const { jobs: positionedJobs, maxColumns } = detectOverlaps(jobPositions);

			// Calculate dynamic lane height based on max overlaps
			// Lane expands to give each overlapping job full JOB_HEIGHT
			const dynamicHeight = getLaneHeight(maxColumns);

			return {
				technician: tech,
				jobs: positionedJobs,
				height: dynamicHeight,
			};
		});

		return lanes;
	}, [technicians, getJobsForTechnician, timeRange]);

	// Calculate total conflicts across all lanes
	const conflictCount = useMemo(() => {
		return technicianLanes.reduce((count, lane) => {
			return count + lane.jobs.filter((j) => j.hasOverlap).length;
		}, 0);
	}, [technicianLanes]);

	// Calculate team workload summary
	const teamWorkloadSummary = useMemo(() => {
		const WORK_DAY_MINUTES = 8 * 60;
		let totalJobs = 0;
		let totalMinutes = 0;
		let availableTechs = 0;
		let busyTechs = 0;

		technicianLanes.forEach(({ jobs }) => {
			totalJobs += jobs.length;
			const techMinutes = jobs.reduce((acc, { job }) => {
				const start =
					job.startTime instanceof Date
						? job.startTime
						: new Date(job.startTime);
				const end =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
				return acc + (end.getTime() - start.getTime()) / (1000 * 60);
			}, 0);
			totalMinutes += techMinutes;
			if (techMinutes > 0) {
				busyTechs++;
			} else {
				availableTechs++;
			}
		});

		const avgUtilization =
			technicianLanes.length > 0
				? Math.round(
						(totalMinutes / (technicianLanes.length * WORK_DAY_MINUTES)) * 100,
					)
				: 0;

		return {
			totalJobs,
			totalHours: Math.round(totalMinutes / 60),
			avgUtilization,
			availableTechs,
			busyTechs,
			totalTechs: technicianLanes.length,
		};
	}, [technicianLanes]);

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

	// Performance: Keep ref to technicianLanes to avoid callback recreation
	const technicianLanesRef = useRef(technicianLanes);
	technicianLanesRef.current = technicianLanes;

	// Use the optimized drag hook - separates move vs create operations
	// and uses batched server calls for performance
	const {
		handleDragStart,
		handleDragMove,
		handleDragEnd,
		handleDragCancel,
		dragPointerRef,
		rafIdRef,
		pendingDragMoveRef,
		dragJobCacheRef,
		lastDragPreviewRef,
	} = useScheduleDrag({
		technicians,
		unassignedJobs,
		technicianLanes: technicianLanes.map((lane) => ({
			technicianId: lane.technician.id,
			jobs: lane.jobs,
		})),
		timeRange,
		totalWidth,
		timelineRef,
		setUnassignedOrder,
		setActiveJobId,
		setDragPreview,
	});

	const handleResize = useCallback(
		(jobId: string, direction: "start" | "end", deltaMinutes: number) => {
			if (!resizeStateRef.current || resizeStateRef.current.jobId !== jobId) {
				const jobData = technicianLanesRef.current
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
				technicianLanesRef.current.find((lane) =>
					lane.jobs.some((j) => j.job.id === jobId),
				)?.technician.id || "";

			moveJob(jobId, currentTechId, newStart, newEnd);
		},
		[moveJob],
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

			const jobData = technicianLanesRef.current
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
		[],
	);

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

	// Auto-scroll during drag with smooth exponential acceleration
	useEffect(() => {
		if (!activeJobId) {
			return;
		}
		const container = scrollContainerRef.current;
		if (!container) {
			return;
		}

		let frame: number;
		let lastExtendCheck = 0;

		// Calculate scroll speed with exponential easing for smooth acceleration
		const calcScrollSpeed = (distanceFromEdge: number): number => {
			if (distanceFromEdge >= AUTO_SCROLL_EDGE) return 0;

			// Normalize distance (0 = at edge, 1 = at threshold)
			const normalized = distanceFromEdge / AUTO_SCROLL_EDGE;
			// Exponential ease-in: faster as you get closer to edge
			const eased = (1 - normalized) ** AUTO_SCROLL_ACCELERATION;
			// Scale to speed range
			return (
				AUTO_SCROLL_MIN_SPEED +
				eased * (AUTO_SCROLL_MAX_SPEED - AUTO_SCROLL_MIN_SPEED)
			);
		};

		const tick = () => {
			const pointer = dragPointerRef.current;
			const rect = container.getBoundingClientRect();
			let deltaX = 0;

			const distanceFromLeft = pointer.x - rect.left;
			const distanceFromRight = rect.right - pointer.x;

			// Horizontal auto-scroll
			if (distanceFromLeft < AUTO_SCROLL_EDGE) {
				deltaX = -calcScrollSpeed(distanceFromLeft);
			} else if (distanceFromRight < AUTO_SCROLL_EDGE) {
				deltaX = calcScrollSpeed(distanceFromRight);
			}

			if (deltaX !== 0) {
				container.scrollLeft += deltaX;

				// Trigger infinite scroll extension while dragging (throttled)
				const now = Date.now();
				if (now - lastExtendCheck > 300) {
					lastExtendCheck = now;
					const { scrollLeft, scrollWidth, clientWidth } = container;
					const scrollRight = scrollWidth - scrollLeft - clientWidth;

					if (scrollLeft < 300 && deltaX < 0) {
						extendBufferLeft();
					} else if (scrollRight < 300 && deltaX > 0) {
						extendBufferRight();
					}
				}
			}

			// Vertical auto-scroll for technician lanes
			const timelineArea = timelineRef.current;
			if (timelineArea) {
				const timelineRect = timelineArea.getBoundingClientRect();
				let deltaY = 0;

				const distanceFromTop = pointer.y - timelineRect.top;
				const distanceFromBottom = timelineRect.bottom - pointer.y;

				if (distanceFromTop < AUTO_SCROLL_EDGE) {
					deltaY = -calcScrollSpeed(distanceFromTop);
				} else if (distanceFromBottom < AUTO_SCROLL_EDGE) {
					deltaY = calcScrollSpeed(distanceFromBottom);
				}

				if (deltaY !== 0) {
					timelineArea.scrollTop += deltaY;
				}
			}

			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [activeJobId, extendBufferLeft, extendBufferRight]);

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

	// PERFORMANCE: Memoize drag overlay content to prevent recreation on every render
	const dragOverlayContent = useMemo(() => {
		if (!activeJob) return null;

		const categoryConfig = getAppointmentCategoryConfig(activeJob);
		const typeConfig = getJobTypeConfig(activeJob);
		const TypeIcon = typeConfig.icon;
		const CategoryIcon = categoryConfig.icon;
		const borderColor = getJobTypeColor(activeJob);

		return (
			<div className="relative">
				{/* Floating time preview badge - positioned below to avoid cutoff at top of timeline */}
				{dragPreview && (
					<div className="absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-lg">
						<Clock className="mr-1 inline-block size-3" />
						{dragPreview.label}
					</div>
				)}
				<div
					className={cn(
						"bg-card flex items-center gap-2 rounded-md border px-2.5 py-1.5 shadow-2xl ring-2 ring-primary scale-[1.02]",
						borderColor,
						categoryConfig.borderStyle,
						activeJob.isUnassigned && "!border-red-500",
					)}
					style={{
						height: `${JOB_HEIGHT}px`,
						minWidth: "180px",
						maxWidth: "300px",
					}}
				>
					{/* Appointment Category Indicator */}
					<div
						className={cn(
							"flex size-4 shrink-0 items-center justify-center rounded-sm",
							categoryConfig.bgColor,
						)}
					>
						<CategoryIcon
							className={cn("size-2.5", categoryConfig.textColor)}
						/>
					</div>

					{/* Job Type Icon */}
					<div
						className={cn(
							"flex size-5 shrink-0 items-center justify-center rounded",
							typeConfig.bgColor,
						)}
					>
						<TypeIcon
							className={cn(
								"size-3",
								typeConfig.borderColor.replace("border-l-", "text-"),
							)}
						/>
					</div>

					{/* Customer Name */}
					<span className="text-foreground flex-1 truncate text-xs font-semibold">
						{activeJob.customer?.name || "Unknown Customer"}
					</span>

					{/* Team Avatars */}
					<TeamAvatarGroup
						assignments={activeJob.assignments}
						maxVisible={2}
						onAddMember={() => {}}
						onRemove={() => {}}
					/>

					{/* Status dot */}
					<div
						className={cn(
							"size-1.5 shrink-0 rounded-full",
							activeJob.status === "scheduled" && "bg-blue-500",
							activeJob.status === "dispatched" && "bg-sky-500",
							activeJob.status === "arrived" && "bg-emerald-500",
							activeJob.status === "in-progress" && "bg-amber-500",
							(activeJob.status === "closed" ||
								activeJob.status === "completed") &&
								"bg-slate-400",
							activeJob.status === "cancelled" && "bg-slate-300",
						)}
					/>
				</div>
			</div>
		);
	}, [activeJob, dragPreview]);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Update current time every minute for the time indicator
	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000); // Update every minute

		return () => clearInterval(intervalId);
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

	// Scroll to current time/date on mount and when current date changes
	const hasInitialScrolled = useRef(false);
	useEffect(() => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			// On initial load or date change, scroll to center the current date
			if (!hasInitialScrolled.current || currentTimePosition !== null) {
				const targetPosition =
					currentTimePosition !== null
						? currentTimePosition
						: currentDateOffset + container.clientWidth / 4; // Center on current day
				container.scrollLeft = Math.max(
					0,
					targetPosition - container.clientWidth / 2,
				);
				hasInitialScrolled.current = true;
			}
		}
	}, [currentTimePosition, currentDateOffset]);

	// Infinite scroll: Extend buffer when scrolling near edges
	// PERFORMANCE: Higher threshold + throttling reduces state updates
	const SCROLL_EDGE_THRESHOLD = 400; // pixels from edge to trigger buffer extension
	const SCROLL_THROTTLE_MS = 150; // minimum ms between scroll checks
	const isExtendingBuffer = useRef(false);
	const lastScrollCheck = useRef(0);

	const handleInfiniteScroll = useCallback(() => {
		const container = scrollContainerRef.current;
		if (!container || isExtendingBuffer.current) return;

		// Throttle scroll checks for performance
		const now = Date.now();
		if (now - lastScrollCheck.current < SCROLL_THROTTLE_MS) return;
		lastScrollCheck.current = now;

		const { scrollLeft, scrollWidth, clientWidth } = container;
		const scrollRight = scrollWidth - scrollLeft - clientWidth;

		// Check if near left edge (scrolling into the past)
		if (scrollLeft < SCROLL_EDGE_THRESHOLD) {
			isExtendingBuffer.current = true;
			// Store current scroll position relative to content
			const previousScrollWidth = scrollWidth;
			extendBufferLeft();
			// After state update, adjust scroll to maintain position
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					// Double RAF ensures DOM has updated
					if (scrollContainerRef.current) {
						const newScrollWidth = scrollContainerRef.current.scrollWidth;
						const addedWidth = newScrollWidth - previousScrollWidth;
						scrollContainerRef.current.scrollLeft = scrollLeft + addedWidth;
					}
					isExtendingBuffer.current = false;
				});
			});
		}
		// Check if near right edge (scrolling into the future)
		else if (scrollRight < SCROLL_EDGE_THRESHOLD) {
			isExtendingBuffer.current = true;
			extendBufferRight();
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					isExtendingBuffer.current = false;
				});
			});
		}
	}, [extendBufferLeft, extendBufferRight]);

	// Attach scroll listener for infinite scroll (passive for performance)
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		container.addEventListener("scroll", handleInfiniteScroll, {
			passive: true,
		});
		return () => container.removeEventListener("scroll", handleInfiniteScroll);
	}, [handleInfiniteScroll]);

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
			setQuickAppointmentTime(startTime);
			setQuickAppointmentDuration(null); // Use default duration
			setShowQuickAppointment(true);
		},
		[],
	);

	// Handle drag-to-create on timeline
	const handleLaneDragCreate = useCallback(
		(technicianId: string, startTime: Date, durationMinutes: number) => {
			console.log("[DEBUG] handleLaneDragCreate called:", {
				technicianId,
				startTime,
				durationMinutes,
			});
			setQuickCreateTechId(technicianId);
			setQuickAppointmentTime(startTime);
			setQuickAppointmentDuration(durationMinutes);
			setShowQuickAppointment(true);
			console.log("[DEBUG] showQuickAppointment set to true");
		},
		[],
	);

	// Transform technicians to options format for dialog
	const technicianOptions: TechnicianOption[] = useMemo(
		() =>
			technicians.map((tech) => ({
				id: tech.id,
				name: tech.name,
				avatar: tech.avatar,
			})),
		[technicians],
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
			autoScroll={false} // Disabled - using custom smooth auto-scroll implementation
			collisionDetection={pointerWithin} // More accurate for horizontal timeline drop zones
			onDragCancel={handleDragCancel}
			onDragEnd={handleDragEnd}
			onDragMove={handleDragMove}
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
							dropId={DRAG_UNASSIGNED_DROP_ID}
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
							{/* Team Header with Summary - Sticky */}
							<div className="bg-muted sticky top-0 z-40 h-11 shrink-0 border-b">
								<div className="flex h-full items-center justify-between px-4">
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
							</div>

							{/* Team Members */}
							{technicianLanes.map(({ technician, jobs, height }) => {
								const isApprentice = technician.role
									?.toLowerCase()
									.includes("apprentice");
								const hasJobs = jobs.length > 0;

								// Calculate utilization (assuming 8 hour workday: 8am-5pm = 9 hours with lunch)
								const WORK_DAY_MINUTES = 8 * 60; // 8 hours
								const totalScheduledMinutes = jobs.reduce((acc, jobWithPos) => {
									const start =
										jobWithPos.job.startTime instanceof Date
											? jobWithPos.job.startTime
											: new Date(jobWithPos.job.startTime);
									const end =
										jobWithPos.job.endTime instanceof Date
											? jobWithPos.job.endTime
											: new Date(jobWithPos.job.endTime);
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
												className="flex cursor-pointer items-center border-b px-3 hover:bg-primary/5 active:bg-primary/10 transition-colors"
												style={{ height, minHeight: height, maxHeight: height }}
												onClick={() =>
													router.push(
														`/dashboard/schedule/technician/${technician.id}`,
													)
												}
											>
												<div className="flex w-full items-center gap-2.5">
													<div className="relative">
														<Avatar className="size-9">
															<AvatarFallback
																className={cn(
																	"text-xs font-semibold",
																	isApprentice
																		? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
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
																		"h-full rounded-full transition-[width] duration-200",
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
										<TooltipContent
											side="right"
											className="overflow-hidden rounded-lg border border-border bg-popover p-0 shadow-xl [&>svg]:hidden"
										>
											<div className="flex flex-col gap-1 p-3 text-xs text-popover-foreground">
												<div className="flex items-center justify-between gap-4">
													<span className="font-medium">{technician.name}</span>
													<Badge
														variant="secondary"
														className={cn(
															"px-1.5 py-0.5 text-[10px]",
															hasJobs
																? "bg-warning/15 text-warning"
																: "bg-success/15 text-success",
														)}
													>
														{hasJobs ? "Busy" : "Available"}
													</Badge>
												</div>
												<div className="text-muted-foreground">
													{technician.role}
												</div>
												<div className="mt-1 border-t border-border pt-1">
													<div className="flex justify-between">
														<span className="text-muted-foreground">
															Jobs Today:
														</span>
														<span className="font-medium">{jobs.length}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">
															Time Booked:
														</span>
														<span className="font-medium">
															{Math.round(totalScheduledMinutes / 60)}h{" "}
															{Math.round(totalScheduledMinutes % 60)}m
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">
															Utilization:
														</span>
														<span
															className={cn(
																"font-medium",
																utilizationPercent < 50
																	? "text-success"
																	: utilizationPercent < 80
																		? "text-warning"
																		: "text-destructive",
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
									const isMidnight = hour === 0;
									const isCurrentDay =
										slot.toDateString() === dateObj.toDateString();
									return (
										<div
											className={cn(
												"relative flex shrink-0 flex-col items-center justify-center border-r",
												isBusinessHours ? "bg-card" : "bg-muted/30",
												isMidnight && "border-l-2 border-l-primary/50",
												isCurrentDay && isMidnight && "bg-primary/10",
											)}
											key={index}
											style={{ width: HOUR_WIDTH }}
										>
											{/* Show date label at midnight */}
											{isMidnight && (
												<span
													className={cn(
														"text-[10px] font-semibold leading-tight",
														isCurrentDay
															? "text-primary"
															: "text-muted-foreground",
													)}
												>
													{format(slot, "EEE d")}
												</span>
											)}
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
										const isMidnight = hour === 0;
										const isCurrentDay =
											slot.toDateString() === dateObj.toDateString();
										return (
											<div
												className={cn(
													"relative shrink-0 border-r",
													isBusinessHours
														? index % 2 === 0
															? "bg-background"
															: "bg-muted/5"
														: "bg-muted/20",
													isMidnight && "border-l-2 border-l-primary/30",
													isCurrentDay && "bg-primary/5",
												)}
												key={index}
												style={{
													width: HOUR_WIDTH,
													backgroundImage: isBusinessHours
														? undefined
														: "repeating-linear-gradient(45deg, transparent, transparent 8px, hsl(var(--muted) / 0.3) 8px, hsl(var(--muted) / 0.3) 16px)",
												}}
											>
												{/* 30-minute grid line (always visible) */}
												<div className="absolute top-0 left-1/2 h-full w-px bg-border/40 dark:bg-border/30" />
												{/* 15-minute snap guides (visible during drag) */}
												{activeJobId && (
													<>
														<div className="bg-primary/30 absolute top-0 left-1/4 h-full w-px" />
														<div className="bg-primary/50 absolute top-0 left-1/2 h-full w-px" />
														<div className="bg-primary/30 absolute top-0 left-3/4 h-full w-px" />
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
										onDragCreate={handleLaneDragCreate}
										totalWidth={totalWidth}
										timeRangeStart={timeRange.start}
										isSelectionMode={isSelectionMode}
										selectedJobIds={selectedJobIds}
										onToggleJobSelection={toggleJobSelection}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Drag Overlay - Ghost Preview */}
			{/* PERFORMANCE: Using memoized dragOverlayContent to prevent recreation on every render */}
			{/* dropAnimation=null makes overlay disappear instantly on drop, preventing "ghost returns to origin" issue */}
			<DragOverlay dropAnimation={null}>
				{dragOverlayContent}
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

			{/* Quick Appointment Dialog - triggered by double-click or drag-to-create on timeline */}
			<QuickAppointmentDialog
				open={showQuickAppointment}
				onOpenChange={(open) => {
					setShowQuickAppointment(open);
					if (!open) {
						setQuickCreateTechId(null);
						setQuickAppointmentTime(null);
						setQuickAppointmentDuration(null);
					}
				}}
				technicians={technicianOptions}
				onSuccess={() => {
					// Refresh the schedule data
					void refresh();
				}}
				defaultTechnicianId={quickCreateTechId || undefined}
				defaultDateTime={quickAppointmentTime || undefined}
				defaultDuration={quickAppointmentDuration || undefined}
			/>
		</DndContext>
	);
}
