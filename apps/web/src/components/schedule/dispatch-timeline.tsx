"use client";

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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule, useScheduleRealtime } from "@/hooks/use-schedule";
import { useJobTimezone } from "@/hooks/use-job-timezone";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import {
	DndContext,
	DragOverlay,
	MouseSensor,
	pointerWithin,
	TouchSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import {
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	Calendar,
	Car,
	Check,
	ChevronRight,
	ClipboardCheck,
	Clock,
	HardHat,
	MapPin,
	Mail,
	MessageSquare,
	MoreVertical,
	Phone,
	Play,
	Repeat,
	Search,
	Send,
	Settings,
	Star,
	User,
	Users,
	Wrench,
	X,
	Zap
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { TechnicianRouteTrackingMap } from "./dispatch-map/technician-route-tracking-map";
import {
	DRAG_UNASSIGNED_DROP_ID,
	type DragPreview,
	useScheduleDrag,
} from "./hooks/use-schedule-drag";
import {
	QuickAppointmentDialog,
	type TechnicianOption,
} from "./quick-appointment-dialog";
import { ScheduleJobContextMenu } from "./schedule-job-context-menu";
import type {
	AppointmentCategory,
	Job,
	JobType,
	Technician,
} from "./schedule-types";
import { getAppointmentCategory } from "./schedule-types";
import { TeamAvatarGroup } from "./team-avatar-manager";
import { UnassignedPanel } from "./unassigned-panel";

const HOUR_WIDTH = 80;
const LANE_HEIGHT = 70; // More compact
const SIDEBAR_WIDTH = 220;
const JOB_HEIGHT = 48; // Narrower job cards
const JOB_STACK_OFFSET = 6;
const STACK_GAP = 4;
const BASE_CENTER_OFFSET = Math.max(STACK_GAP, (LANE_HEIGHT - JOB_HEIGHT) / 2);
const SNAP_INTERVAL_MINUTES = 15;
const LARGE_SNAP_MINUTES = 60;

// Auto-scroll configuration for smooth, fast edge scrolling during drag
const AUTO_SCROLL_EDGE = 200; // Start scrolling 200px from edge
const AUTO_SCROLL_INNER_EDGE = 80; // Max speed zone within 80px
const AUTO_SCROLL_MIN_SPEED = 8; // Minimum scroll speed (px/frame)
const AUTO_SCROLL_MAX_SPEED = 45; // Maximum scroll speed (px/frame)
const AUTO_SCROLL_ACCELERATION = 2.5; // Exponential acceleration factor
const VISIBLE_DATE_UPDATE_THROTTLE_MS = 200; // Limit how often we recalculate the visible day during scroll
const BUFFER_GUARD_HOURS = 36; // Auto-extend buffer when we get within 1.5 days of either edge

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
	// Keep color utility available if needed elsewhere, but drop the thick left border
	return "";
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
		borderStyle: "border-dashed",
	},
	event: {
		icon: Calendar,
		label: "Event",
		bgColor: "bg-emerald-500/10",
		textColor: "text-emerald-600 dark:text-emerald-400",
		borderStyle: "border-dotted",
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
	lane: number;
	hasOverlap: boolean;
	overlapRange: { left: number; width: number } | null;
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
	fromJobTop: number; // Top position of the from job
	toJobTop: number; // Top position of the to job
	fromJobHasOverlap: boolean; // Whether from job has overlap
	toJobHasOverlap: boolean; // Whether to job has overlap
	fromJobLeft: number; // Left position of the from job
	fromJobWidth: number; // Width of the from job
	toJobLeft: number; // Left position of the to job
	toJobWidth: number; // Width of the to job
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
	isDragActive: boolean,
): TravelGap[] {
	if (jobs.length < 2 || isDragActive) return [];

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
		const currentStart =
			currentJob.job.startTime instanceof Date
				? currentJob.job.startTime
				: new Date(currentJob.job.startTime);
		const nextEnd =
			nextJob.job.endTime instanceof Date
				? nextJob.job.endTime
				: new Date(nextJob.job.endTime);

		const gapMinutes = Math.round(
			(nextStart.getTime() - currentEnd.getTime()) / (1000 * 60),
		);

		const sameDay = currentEnd.toDateString() === nextStart.toDateString();

		// Skip any cross-midnight gaps; only show travel within the same calendar day
		if (!sameDay) {
			continue;
		}

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
			fromJobTop: currentJob.top,
			toJobTop: nextJob.top,
			fromJobHasOverlap: currentJob.hasOverlap,
			toJobHasOverlap: nextJob.hasOverlap,
			fromJobLeft: currentJob.left,
			fromJobWidth: currentJob.width,
			toJobLeft: nextJob.left,
			toJobWidth: nextJob.width,
		});
	}

	return gaps;
}

// Job time display component with timezone awareness
const JobTimeDisplay = memo(function JobTimeDisplay({
	job,
	startTime,
	endTime,
	duration,
}: {
	job: Job;
	startTime: Date;
	endTime: Date;
	duration: number;
}) {
	const { isDifferent, formatJobTime, isLoading } = useJobTimezone(job);

	const jobStartTime = formatJobTime(startTime);
	const jobEndTime = formatJobTime(endTime);

	return (
		<div className="flex items-center gap-2.5">
			<Clock className="text-muted-foreground size-4" />
			<div>
				<p className="text-foreground text-sm font-medium">
					{format(startTime, "h:mm a")} – {format(endTime, "h:mm a")}
					{isDifferent && !isLoading && jobStartTime && jobEndTime && (
						<span className="text-muted-foreground ml-1.5 text-xs font-normal">
							({jobStartTime} – {jobEndTime} local)
						</span>
					)}
				</p>
				<p className="text-muted-foreground text-xs">
					{format(startTime, "EEE, MMM d")} • {duration} min
				</p>
			</div>
		</div>
	);
});

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

	// Calculate vertical center based on job card positions
	// Job cards use: topOffset = (top > 0 || hasOverlap ? STACK_GAP : BASE_CENTER_OFFSET) + top
	// Center of job = topOffset + JOB_HEIGHT / 2
	const fromJobTopOffset =
		(gap.fromJobTop > 0 || gap.fromJobHasOverlap
			? STACK_GAP
			: BASE_CENTER_OFFSET) + gap.fromJobTop;
	const toJobTopOffset =
		(gap.toJobTop > 0 || gap.toJobHasOverlap
			? STACK_GAP
			: BASE_CENTER_OFFSET) + gap.toJobTop;

	const fromJobCenterY = fromJobTopOffset + JOB_HEIGHT / 2;
	const toJobCenterY = toJobTopOffset + JOB_HEIGHT / 2;

	// Calculate horizontal positions with offset from job edges
	const OFFSET = 12; // Space between job edge and vertical line
	const fromJobLineX = gap.fromJobLeft + gap.fromJobWidth + OFFSET;
	const toJobLineX = gap.toJobLeft - OFFSET;

	// Calculate the middle point between the two vertical lines
	const middleX = (fromJobLineX + toJobLineX) / 2;

	// Calculate the middle Y position (average of both job centers)
	const middleY = (fromJobCenterY + toJobCenterY) / 2;
	// Calculate the distance from each job center to the middle
	const fromJobToMiddle = Math.abs(middleY - fromJobCenterY);
	const toJobToMiddle = Math.abs(middleY - toJobCenterY);

	return (
		<TooltipProvider>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<div className="pointer-events-none absolute inset-0">
						{/* Vertical line from first job center (with offset from right edge) to middle */}
						<div
							className="absolute bg-emerald-500/70 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
							style={{
								left: `${fromJobLineX - 1}px`,
								top: `${Math.min(fromJobCenterY, middleY)}px`,
								width: "2px",
								height: `${fromJobToMiddle}px`,
							}}
						/>

						{/* Horizontal connector line */}
						<div
							className="absolute bg-emerald-500/70 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
							style={{
								left: `${fromJobLineX}px`,
								top: `${middleY - 1}px`,
								width: `${Math.abs(toJobLineX - fromJobLineX)}px`,
								height: "2px",
							}}
						/>

						{/* Vertical line from middle to second job center (with offset from left edge) */}
						<div
							className="absolute bg-emerald-500/70 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
							style={{
								left: `${toJobLineX - 1}px`,
								top: `${Math.min(middleY, toJobCenterY)}px`,
								width: "2px",
								height: `${toJobToMiddle}px`,
							}}
						/>

						{/* Dot at first job center (with offset from right edge) */}
						<div
							className="absolute rounded-full bg-emerald-500 shadow"
							style={{
								left: `${fromJobLineX - 4}px`,
								top: `${fromJobCenterY - 4}px`,
								width: "8px",
								height: "8px",
							}}
						/>

						{/* Dot at second job center (with offset from left edge) */}
						<div
							className="absolute rounded-full bg-emerald-500 shadow"
							style={{
								left: `${toJobLineX - 4}px`,
								top: `${toJobCenterY - 4}px`,
								width: "8px",
								height: "8px",
							}}
						/>

						{/* Time badge in the middle */}
						<div
							className="absolute flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-800 shadow-sm dark:bg-emerald-900 dark:text-emerald-200"
							style={{
								left: `${middleX}px`,
								top: `${middleY}px`,
								transform: "translate(-50%, -50%)",
							}}
						>
							<Car className="size-3" />
							<span>{formatDuration(gap.gapMinutes)}</span>
							{gap.isInsufficient && (
								<span className="text-[9px] font-semibold text-red-500">
									Tight
								</span>
							)}
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

		// Compute overlapped segment (union of overlaps)
		let overlapRange: { left: number; width: number } | null = null;
		if (overlapping.length > 0) {
			let minLeft = Infinity;
			let maxRight = -Infinity;
			overlapping.forEach((p) => {
				const pRight = p.left + p.width;
				const overlapLeft = Math.max(left, p.left);
				const overlapRight = Math.min(right, pRight);
				if (overlapRight > overlapLeft) {
					minLeft = Math.min(minLeft, overlapLeft);
					maxRight = Math.max(maxRight, overlapRight);
				}
			});
			if (minLeft !== Infinity && maxRight !== -Infinity) {
				overlapRange = { left: minLeft, width: maxRight - minLeft };
			}
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
			overlapRange,
		});
	});

	// Post-process to ensure each job has its overlap segment (union of all intersections)
	for (let i = 0; i < positioned.length; i++) {
		let minLeft = Infinity;
		let maxRight = -Infinity;
		const a = positioned[i];
		const aRight = a.left + a.width;
		for (let j = 0; j < positioned.length; j++) {
			if (i === j) continue;
			const b = positioned[j];
			const bRight = b.left + b.width;
			const overlapLeft = Math.max(a.left, b.left);
			const overlapRight = Math.min(aRight, bRight);
			if (overlapRight > overlapLeft) {
				minLeft = Math.min(minLeft, overlapLeft);
				maxRight = Math.max(maxRight, overlapRight);
				a.hasOverlap = true;
			}
		}
		if (minLeft !== Infinity && maxRight !== -Infinity) {
			a.overlapRange = { left: minLeft, width: maxRight - minLeft };
		} else {
			a.overlapRange = null;
		}
	}

	return positioned;
}

const JobCard = memo(
	function JobCard({
		job,
		left,
		width,
		top,
		hasOverlap,
		overlapRange,
		isSelected,
		onSelect,
		onHover,
		onApplyOptimization,
		onResize,
		onResizeComplete,
	}: {
		job: Job;
		left: number;
		width: number;
		top: number;
		hasOverlap: boolean;
		overlapRange: { left: number; width: number } | null;
		isSelected: boolean;
		onSelect: () => void;
		onHover: (isHovering: boolean) => void;
		onApplyOptimization: (
			job: Job,
			newStart: Date,
			newEnd: Date,
			newTechId?: string,
		) => Promise<void>;
		onResize: (
			jobId: string,
			direction: "start" | "end",
			deltaMinutes: number,
		) => void;
		onResizeComplete: (jobId: string, hasChanges: boolean) => void;
	}) {
		const [isHovered, setIsHovered] = useState(false);
		const [optimizationText, setOptimizationText] = useState<string | null>(null);
		const [optimizationLoading, setOptimizationLoading] = useState(false);
		const [showOptimizationPopover, setShowOptimizationPopover] = useState(false);
		const [isResizing, setIsResizing] = useState(false);
		const [resizeDirection, setResizeDirection] = useState<"start" | "end" | null>(null);
		const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
		const [isPending, startTransition] = useTransition();
		const resizeStartRef = useRef<{ x: number; startTime: Date; endTime: Date } | null>(null);
		const { attributes, listeners, setNodeRef, transform, isDragging } =
			useDraggable({
				id: job.id,
				data: { job },
				disabled: isResizing,
			});

		// Handle resize start
		const handleResizeStart = useCallback(
			(direction: "start" | "end", e: React.MouseEvent) => {
				e.stopPropagation();
				e.preventDefault();
				setIsResizing(true);
				setResizeDirection(direction);
				const startTime =
					job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
				const endTime =
					job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
				resizeStartRef.current = {
					x: e.clientX,
					startTime,
					endTime,
				};
			},
			[job.startTime, job.endTime],
		);

		// Handle resize move
		useEffect(() => {
			if (!isResizing || !resizeDirection || !resizeStartRef.current) return;

			const handleMouseMove = (e: MouseEvent) => {
				if (!resizeStartRef.current) return;
				const deltaX = e.clientX - resizeStartRef.current.x;
				// Convert pixels to minutes (assuming HOUR_WIDTH pixels per hour)
				const deltaMinutes = Math.round((deltaX / HOUR_WIDTH) * 60);
				// Snap to 15-minute intervals
				const snappedDelta = Math.round(deltaMinutes / 15) * 15;
				if (snappedDelta !== 0) {
					onResize(job.id, resizeDirection, snappedDelta);
				}
			};

			const handleMouseUp = () => {
				if (!resizeStartRef.current) return;
				const hasChanges =
					resizeStartRef.current.startTime.getTime() !==
						(job.startTime instanceof Date
							? job.startTime
							: new Date(job.startTime)
						).getTime() ||
					resizeStartRef.current.endTime.getTime() !==
						(job.endTime instanceof Date ? job.endTime : new Date(job.endTime)
						).getTime();
				onResizeComplete(job.id, hasChanges);
				setIsResizing(false);
				setResizeDirection(null);
				resizeStartRef.current = null;
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}, [isResizing, resizeDirection, job.id, job.startTime, job.endTime, onResize, onResizeComplete]);

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

		// Determine which quick action to show based on status
		const getQuickAction = () => {
			if (!job.jobId || job.assignments.length === 0) return null;

			switch (job.status) {
				case "scheduled":
					return {
						icon: Send,
						label: "Dispatch",
						onClick: handleDispatch,
						className: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white",
					};
				case "dispatched":
					return {
						icon: Car,
						label: "Arrive",
						onClick: handleArrive,
						className: "bg-sky-500 hover:bg-sky-600 text-white",
					};
				case "arrived":
					return {
						icon: Play,
						label: "Start",
						onClick: handleComplete,
						className: "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white",
					};
				case "in-progress":
					return {
						icon: Check,
						label: "Done",
						onClick: handleComplete,
						className: "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white",
					};
				default:
					return null;
			}
		};

		const quickAction = getQuickAction();

		const topOffset =
			(top > 0 || hasOverlap ? STACK_GAP : BASE_CENTER_OFFSET) + top;

			const style = {
				left: `${left}px`,
				width: `${width}px`,
				top: `${topOffset}px`,
				height: `${JOB_HEIGHT}px`,
				// Keep original width; only translate position on drag
				transform: CSS.Translate.toString({
					x: transform?.x ?? 0,
					y: transform?.y ?? 0,
				}),
				opacity: isDragging ? 0 : 1, // Hide original while drag overlay is visible
				// Lower base z-index so the today line (z-10) draws above jobs; keep drag on top
				zIndex: isDragging ? 50 : isSelected ? 8 : Math.max(2, 6 - top / JOB_STACK_OFFSET),
			};

		const startTime =
			job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
		const endTime =
			job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
		const duration = Math.round(
			(endTime.getTime() - startTime.getTime()) / (1000 * 60),
		);

		const borderColor = getJobTypeColor(job);

		const buildFallbackSuggestion = () => {
			const bhStart = new Date(startTime);
			bhStart.setHours(8, 0, 0, 0);
			const bhEnd = new Date(startTime);
			bhEnd.setHours(18, 0, 0, 0);
			const durationMs = endTime.getTime() - startTime.getTime();
			let suggestion = "Optimization available";
			let saved = hasOverlap ? 20 : 10;

			if (startTime < bhStart) {
				const newStart = bhStart;
				const newEnd = new Date(newStart.getTime() + durationMs);
				suggestion = `Move to ${format(newStart, "h:mm a")} – ${format(
					newEnd,
					"h:mm a",
				)} to stay in business hours`;
				saved = 25;
			} else if (endTime > bhEnd) {
				const newEnd = bhEnd;
				const newStart = new Date(newEnd.getTime() - durationMs);
				suggestion = `Pull earlier to ${format(
					newStart,
					"h:mm a",
				)} – ${format(newEnd, "h:mm a")} to finish before close`;
				saved = 20;
			} else if (hasOverlap) {
				const newStart = new Date(startTime.getTime() - 30 * 60 * 1000);
				const newEnd = new Date(newStart.getTime() + durationMs);
				suggestion = `Slide to ${format(newStart, "h:mm a")} – ${format(
					newEnd,
					"h:mm a",
				)} to clear overlap`;
				saved = 20;
			} else if ((job as any).revenue) {
				suggestion = `Keep within ${format(bhStart, "h:mm a")}–${format(
					bhEnd,
					"h:mm a",
				)} and assign best-fit tech to protect revenue`;
				saved = 15;
			}
			return { suggestion, saved };
		};

		const appointmentCategory =
			job.appointmentCategory || getAppointmentCategory(job.appointmentType, job.allDay);
		const categoryIconMap = {
			job: Briefcase,
			meeting: Users,
			event: Calendar,
		};
		const CategoryIcon =
			categoryIconMap[appointmentCategory as keyof typeof categoryIconMap] ||
			Briefcase;

		return (
			<TooltipProvider>
				<ScheduleJobContextMenu
					job={job}
					onOpenChange={setIsContextMenuOpen}
				>
					<Popover>
						<PopoverTrigger asChild>
							<div
									className={cn(
										"group absolute",
										!isDragging &&
											"transition-[left,top,width] duration-200 ease-out",
									)}
								data-job-card
								ref={setNodeRef}
								style={style}
								{...attributes}
								{...listeners}
								onMouseEnter={() => onHover(true)}
								onMouseLeave={() => onHover(false)}
							>
								{/* Left resize handle */}
								<div
									className={cn(
										"absolute left-0 top-0 z-30 h-full w-3",
										"flex items-center justify-center",
										"transition-opacity duration-200",
									"group-hover:opacity-100",
									isResizing && resizeDirection === "start"
										? "opacity-100 cursor-grabbing"
										: "cursor-ew-resize opacity-0",
								)}
								data-resize-handle="start"
								onMouseDown={(e) => handleResizeStart("start", e)}
							>
								{/* Grip indicator */}
								<div
									className={cn(
										"h-8 w-1 rounded-full transition-colors",
										"bg-primary/40 group-hover:bg-primary/60",
										isResizing && resizeDirection === "start" && "bg-primary",
									)}
								/>
							</div>

							{/* Right resize handle */}
							<div
								className={cn(
									"absolute right-0 top-0 z-30 h-full w-3",
									"flex items-center justify-center",
									"transition-opacity duration-200",
									"group-hover:opacity-100",
									isResizing && resizeDirection === "end"
										? "opacity-100 cursor-grabbing"
										: "cursor-ew-resize opacity-0",
								)}
								data-resize-handle="end"
									onMouseDown={(e) => handleResizeStart("end", e)}
								>
									{/* Grip indicator */}
									<div
										className={cn(
										"h-8 w-1 rounded-full transition-colors",
										"bg-primary/40 group-hover:bg-primary/60",
										isResizing && resizeDirection === "end" && "bg-primary",
										)}
									/>
								</div>

								<div
									className={cn(
										"bg-card relative flex h-full cursor-grab items-center gap-3 rounded-lg border px-3 py-2 active:cursor-grabbing",
										!isDragging &&
											"transition-[box-shadow,ring,transform] duration-120 ease-out hover:shadow-sm",
										borderColor,
										job.isUnassigned && "!border-red-500",
										isSelected && "ring-primary shadow-md ring-1",
										isDragging &&
											"shadow-2xl ring-2 ring-primary/50 scale-[1.01] opacity-95",
										(job.status === "completed" || job.status === "closed") &&
											"opacity-60",
									)}
									onClick={onSelect}
									onMouseEnter={() => {
										setIsHovered(true);
										onHover(true);
									}}
									onMouseLeave={() => {
										setIsHovered(false);
										onHover(false);
									}}
								>
									{isHovered &&
										job.status !== "completed" &&
										job.status !== "closed" && (
											<Popover open={showOptimizationPopover} onOpenChange={setShowOptimizationPopover}>
												<PopoverTrigger asChild>
													<button
														type="button"
												className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow"
												onClick={() => {
													setShowOptimizationPopover(true);
													if (!optimizationText && !optimizationLoading) {
														setOptimizationLoading(true);
														const fallback = buildFallbackSuggestion();
														setOptimizationText(
															`${fallback.suggestion} (save ~${fallback.saved}m)`,
														);
																void fetch("/api/schedule/optimization-suggestion", {
																	method: "POST",
																	headers: { "Content-Type": "application/json" },
																	body: JSON.stringify({
																		job: {
																			id: job.id,
																			title: job.title,
																			customerName: job.customer?.name,
																			technicianId: job.technicianId,
																			startTime:
																				job.startTime instanceof Date
																					? job.startTime.toISOString()
																					: job.startTime,
																			endTime:
																				job.endTime instanceof Date
																					? job.endTime.toISOString()
																					: job.endTime,
																			revenue: (job as any).revenue ?? null,
																			isExistingCustomer: job.customer?.isExisting ?? false,
																			location: job.location?.coordinates || null,
																			technicianLocation:
																				job.technician?.currentLocation?.coordinates || null,
																		},
																		businessHours: { start: "08:00", end: "18:00" },
																		hasOverlap,
																		techniciansAvailable: [],
																	}),
																})
																	.then(async (res) => res.json())
																	.then((data) => {
																		setOptimizationText(
																			data?.suggestion
																				? `${data.suggestion}${
																						data.timeSavedMinutes
																							? ` (save ~${Math.round(
																									data.timeSavedMinutes,
																							  )}m)`
																							: ""
																				  }`
																				: `${fallback.suggestion} (save ~${fallback.saved}m)`,
																		);
																	})
																	.catch(() => {
																		setOptimizationText(
																			`${fallback.suggestion} (save ~${fallback.saved}m)`,
																		);
																	})
																	.finally(() => setOptimizationLoading(false));
															}
														}}
													>
														{optimizationLoading
															? "Optimizing..."
															: optimizationText
																? "Optimization"
																: "Optimize"}
													</button>
												</PopoverTrigger>
												<PopoverContent side="top" align="center" className="w-72 space-y-2">
													<p className="text-sm font-semibold">Optimization Suggestion</p>
													<p className="text-sm text-muted-foreground">
														{optimizationLoading
															? "Calculating best slot…"
															: optimizationText ||
																"Suggested: shift to reduce conflicts and stay in business hours."}
													</p>
													<div className="flex justify-end gap-2">
														<button
															type="button"
															className="rounded border px-3 py-1 text-xs"
															onClick={() => setShowOptimizationPopover(false)}
														>
															Deny
														</button>
														<button
															type="button"
															className="rounded bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
															onClick={async () => {
																setShowOptimizationPopover(false);
																const startTime =
																	job.startTime instanceof Date
																		? job.startTime
																		: new Date(job.startTime);
																const endTime =
																	job.endTime instanceof Date
																		? job.endTime
																		: new Date(job.endTime);
																await onApplyOptimization(
																	job,
																	startTime,
																	endTime,
																	job.technicianId,
																);
															}}
														>
															Confirm
														</button>
													</div>
												</PopoverContent>
											</Popover>
										)}
									{hasOverlap && overlapRange && (
										<div
											className="pointer-events-none absolute z-10 bg-[repeating-linear-gradient(45deg,rgba(239,68,68,0.28),rgba(239,68,68,0.28)_6px,rgba(239,68,68,0.08)_6px,rgba(239,68,68,0.08)_12px)]"
											style={{
												left: `${Math.max(0, overlapRange.left - left)}px`,
												width: `${Math.max(
													6,
													Math.min(
														overlapRange.width,
														Math.max(0, width - Math.max(0, overlapRange.left - left)),
													),
												)}px`,
												top: 0,
												height: "100%",
											}}
										/>
									)}
									<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted relative z-20">
										<CategoryIcon className="size-4 text-primary" />
									</div>
									<div className="min-w-0 flex-1 relative z-20">
										<p className="truncate text-sm font-semibold text-foreground">
											{job.customer?.name || job.title || "Untitled"}
										</p>
									</div>
								</div>

							</div>
						</PopoverTrigger>
						<PopoverContent
							className="w-96 overflow-hidden rounded-lg border border-border bg-popover p-0 shadow-xl"
							side="top"
							sideOffset={8}
						>
							<div className="overflow-hidden text-popover-foreground">
								<div className="border-b border-border px-4 py-3">
									<div className="mb-2 flex items-center justify-between gap-2">
										<h4 className="text-foreground text-base font-bold">
											{job.customer?.name || "Unknown Customer"}
										</h4>
										<Badge className="text-[10px] capitalize" variant="outline">
											{job.status}
										</Badge>
									</div>
									<p className="text-muted-foreground mb-2 text-sm">
										{job.title}
									</p>
									<div className="flex flex-wrap items-center gap-1.5">
										{(() => {
											const catConfig = getAppointmentCategoryConfig(job);
											const CatIcon = catConfig.icon;
											return (
												<Badge
													className={cn(
														"gap-1 px-2 py-0.5 text-[10px]",
														catConfig.bgColor,
														catConfig.textColor,
													)}
													variant="outline"
												>
													<CatIcon className="size-2.5" />
													{catConfig.label}
												</Badge>
											);
										})()}
										{(() => {
											const typeConfig = getJobTypeConfig(job);
											const TypeIcon = typeConfig.icon;
											return (
												<Badge
													className={cn(
														"gap-1 px-2 py-0.5 text-[10px]",
														typeConfig.bgColor,
														typeConfig.borderColor.replace("border-l-", "text-"),
													)}
													variant="outline"
												>
													<TypeIcon className="size-2.5" />
													{typeConfig.label}
												</Badge>
											);
										})()}
										{job.recurrence && (
											<Badge
												className="gap-0.5 bg-violet-100 px-1.5 py-0.5 text-[10px] text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
												variant="outline"
											>
												<Repeat className="size-2.5" />
												Recurring
											</Badge>
										)}
										{job.priority === "urgent" && (
											<Badge
												className="gap-0.5 px-1.5 py-0.5 text-[10px]"
												variant="destructive"
											>
												<AlertTriangle className="size-2.5" />
												Urgent
											</Badge>
										)}
									</div>
								</div>

								<div className="space-y-3 p-4">
									<JobTimeDisplay
										job={job}
										startTime={startTime}
										endTime={endTime}
										duration={duration}
									/>

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

									{job.customer?.phone && (
										<div className="flex items-center gap-2.5">
											<User className="text-muted-foreground size-4" />
											<p className="text-foreground text-sm font-medium">
												{job.customer.phone}
											</p>
										</div>
									)}

									{job.assignments.length > 0 && (
										<div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
											{job.assignments.map((assignment, idx) => (
												<div
													className="bg-muted flex items-center gap-1 rounded-md px-2 py-1"
													key={idx}
												>
													<div
														className={cn(
															"size-1.5 rounded-full",
															assignment.status === "available" &&
																"bg-emerald-500 dark:bg-emerald-400",
															assignment.status === "on-job" && "bg-amber-500 dark:bg-amber-400",
															assignment.status === "on-break" &&
																"bg-slate-400",
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

								{job.jobId && (
									<div className="border-t border-border p-3">
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
						</PopoverContent>
					</Popover>
				</ScheduleJobContextMenu>
			</TooltipProvider>
		);
	},
	(prev, next) => {
		// Performance: Custom comparison to avoid re-renders from callback references
		// Only re-render if actual data or selection state changes
		return (
			prev.job.id === next.job.id &&
			prev.job.status === next.job.status &&
			prev.job.startTime === next.job.startTime &&
			prev.job.endTime === next.job.endTime &&
			prev.left === next.left &&
			prev.width === next.width &&
			prev.top === next.top &&
			prev.hasOverlap === next.hasOverlap &&
			((prev.overlapRange === null && next.overlapRange === null) ||
				(prev.overlapRange !== null &&
					next.overlapRange !== null &&
					prev.overlapRange.left === next.overlapRange.left &&
					prev.overlapRange.width === next.overlapRange.width)) &&
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
			() => calculateTravelGaps(jobs, HOUR_WIDTH, isDragActive),
			[jobs, isDragActive],
		);


		// Drag-to-create state
		const [isDraggingToCreate, setIsDraggingToCreate] = useState(false);
		const [dragStartX, setDragStartX] = useState(0);
		const [dragCurrentX, setDragCurrentX] = useState(0);
		const [dragStartY, setDragStartY] = useState(0);
		// Store the lane rect when drag starts so we don't depend on ref in effects
		const dragLaneRectRef = useRef<DOMRect | null>(null);
		const laneRef = useRef<HTMLDivElement>(null);
		// Use ref to track isDragActive to avoid dependency array size changes
		const isDragActiveRef = useRef(isDragActive);
		useEffect(() => {
			isDragActiveRef.current = isDragActive;
		}, [isDragActive]);

		// Calculate which row the Y position corresponds to
		const calculateRowTop = useCallback(
			(y: number): number => {
				// Check if there are overlaps or jobs in stacked rows
				const hasOverlapsOrStacked = jobs.some((j) => j.hasOverlap || j.top > 0);
				
				// Determine base offset (same logic as job positioning)
				const baseOffset = hasOverlapsOrStacked ? STACK_GAP : BASE_CENTER_OFFSET;
				
				// Calculate which row index (0, 1, 2, etc.) based on Y position
				// Each row is JOB_HEIGHT + STACK_GAP tall
				const yFromTop = Math.max(0, y);
				
				// For first row with no overlaps, use BASE_CENTER_OFFSET
				// For subsequent rows or when overlaps exist, calculate from STACK_GAP
				let rowIndex: number;
				if (!hasOverlapsOrStacked && yFromTop < BASE_CENTER_OFFSET + JOB_HEIGHT) {
					// First row, no overlaps
					return BASE_CENTER_OFFSET;
				} else {
					// Calculate row index from STACK_GAP
					rowIndex = Math.floor(
						(yFromTop - STACK_GAP) / (JOB_HEIGHT + STACK_GAP),
					);
					// Clamp to valid row (0 or higher)
					rowIndex = Math.max(0, rowIndex);
					// Calculate the top position for this row
					return STACK_GAP + rowIndex * (JOB_HEIGHT + STACK_GAP);
				}
			},
			[jobs],
		);

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
				// Don't start drag-to-create if a job is already being dragged
				if (isDragActive) {
					return;
				}

				// Only trigger on empty space (not on job cards or resize handles)
				const target = e.target as HTMLElement;
				// Check if click is on a job card, resize handle, or any element inside a job card
				if (
					target.closest("[data-job-card]") ||
					target.closest("[data-dnd-draggable]") ||
					target.closest("[data-resize-handle]")
				) {
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

			// Handle mouse move during drag-to-create
			useEffect(() => {
				if (!isDraggingToCreate) return;

				// Cancel drag-to-create if a job drag starts
				if (isDragActiveRef.current) {
					setIsDraggingToCreate(false);
					setDragStartX(0);
					setDragCurrentX(0);
					setDragStartY(0);
					dragLaneRectRef.current = null;
					return;
				}

				// Use stored rect from mousedown - this ensures we have the correct reference
				const rect = dragLaneRectRef.current;
				if (!rect) return;

				const handleMouseMove = (e: MouseEvent) => {
					// Cancel if a job drag started
					if (isDragActiveRef.current) {
						setIsDraggingToCreate(false);
						setDragStartX(0);
						setDragCurrentX(0);
						setDragStartY(0);
						dragLaneRectRef.current = null;
						return;
					}

					const currentX = Math.max(
						0,
						Math.min(e.clientX - rect.left, totalWidth),
					);
					setDragCurrentX(currentX);
				};

				const handleMouseUp = (e: MouseEvent) => {
					// Cancel if a job drag started
					if (isDragActiveRef.current) {
						setIsDraggingToCreate(false);
						setDragStartX(0);
						setDragCurrentX(0);
						setDragStartY(0);
						dragLaneRectRef.current = null;
						return;
					}
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
				setDragStartY(0);
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
			// Calculate which row to position the preview in
			const rowTop = calculateRowTop(dragStartY);
			return { left: minX, width, top: rowTop };
		}, [isDraggingToCreate, dragStartX, dragCurrentX, dragStartY, calculateRowTop]);

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
						<>
							{/* Time badge above the preview */}
							{dragTimeLabels && (
								<div
									className="pointer-events-none absolute z-50 flex items-center justify-center"
									style={{
										left: dragPreviewStyle.left + dragPreviewStyle.width / 2,
										top: (dragPreviewStyle.top ?? BASE_CENTER_OFFSET) - 32,
										transform: "translateX(-50%)",
									}}
								>
									<div className="flex items-center gap-1.5 rounded-full bg-blue-600 dark:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
										<Clock className="h-3.5 w-3.5" />
										<span>
											{dragTimeLabels.start} - {dragTimeLabels.end}
										</span>
										<span className="text-blue-200">
											({dragTimeLabels.duration})
										</span>
									</div>
								</div>
							)}
							{/* Preview box */}
							<div
								className="pointer-events-none absolute z-40 rounded-lg border-2 border-dashed border-blue-400 dark:border-blue-500 bg-blue-500/40 dark:bg-blue-600/40 shadow-lg"
								style={{
									left: dragPreviewStyle.left,
									width: dragPreviewStyle.width,
									height: JOB_HEIGHT,
									top: dragPreviewStyle.top ?? BASE_CENTER_OFFSET,
								}}
							/>
						</>
					)}

				{jobs.length === 0 && !isDragActive ? null : (
					<>
						{/* Travel time indicators between jobs - hide during drag for performance */}
						{!isDragActive &&
							travelGaps.map((gap) => (
								<TravelTimeIndicator
									gap={gap}
									key={`travel-${gap.fromJobId}-${gap.toJobId}`}
							/>
						))}
						{/* Job cards */}
						{jobs.map(({ job, left, width, top, hasOverlap, overlapRange }) => (
							<JobCard
								hasOverlap={hasOverlap}
								overlapRange={overlapRange}
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
	const [isJobHovered, setIsJobHovered] = useState(false);
	const [activeJobId, setActiveJobId] = useState<string | null>(null);
	const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
	const [unassignedPanelOpen, setUnassignedPanelOpen] = useState(false);
	const [unassignedOrder, setUnassignedOrder] = useState<string[]>([]);
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
	const [visibleLaneRange, setVisibleLaneRange] = useState<{ start: number; end: number }>({
		start: 0,
		end: 0,
	});
	// Navigation for technician detail page
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const setIncomingCall = useUIStore((state) => state.setIncomingCall);
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
	const setCurrentDatePreserveBuffer = useScheduleViewStore(
		(s) => s.setCurrentDatePreserveBuffer,
	);
	const goToToday = useScheduleViewStore((s) => s.goToToday);
	const extendBufferLeft = useScheduleViewStore((s) => s.extendBufferLeft);
	const extendBufferRight = useScheduleViewStore((s) => s.extendBufferRight);
	const focusedTechnicianId = searchParams.get("technician");
	const focusedTechnician = useMemo(
		() => technicians.find((t) => t.id === focusedTechnicianId) || null,
		[technicians, focusedTechnicianId],
	);
	const focusedTechnicianJobs = useMemo(() => {
		if (!focusedTechnicianId) return [];
		return getJobsForTechnician(focusedTechnicianId).sort(
			(a, b) =>
				new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
		);
	}, [focusedTechnicianId, getJobsForTechnician]);

	const handleOpenTechnicianFocus = useCallback(
		(techId: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("technician", techId);
			router.replace(
				`${pathname}${params.size ? `?${params.toString()}` : ""}`,
				{ scroll: false },
			);
		},
		[pathname, router, searchParams],
	);

	const handleCloseTechnicianFocus = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("technician");
		router.replace(
			`${pathname}${params.size ? `?${params.toString()}` : ""}`,
			{ scroll: false },
		);
	}, [pathname, router, searchParams]);

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

	const skipAutoScrollRef = useRef(false);
	const lastVisibleDateRef = useRef<string | null>(null);
	const lastVisibleDateUpdateRef = useRef(0);

	useEffect(() => {
		const normalized = new Date(dateObj);
		normalized.setHours(0, 0, 0, 0);
		lastVisibleDateRef.current = normalized.toISOString();
	}, [dateObj]);

	const setCurrentDateWithoutAutoScroll = useCallback(
		(date: Date) => {
			skipAutoScrollRef.current = true;
			setCurrentDatePreserveBuffer(date);
		},
		[setCurrentDatePreserveBuffer],
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

	// Proactively extend buffer if the visible day is getting close to either edge
	useEffect(() => {
		const marginMs = BUFFER_GUARD_HOURS * 60 * 60 * 1000;
		if (dateObj.getTime() - bufferStart.getTime() < marginMs) {
			extendBufferLeft();
		}
		if (bufferEnd.getTime() - dateObj.getTime() < marginMs) {
			extendBufferRight();
		}
	}, [bufferStart, bufferEnd, dateObj, extendBufferLeft, extendBufferRight]);

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

	const updateVisibleDateFromCurrentScroll = useCallback(() => {
		const container = scrollContainerRef.current;
		if (!container || totalWidth === 0) {
			return;
		}

		const now = Date.now();
		if (now - lastVisibleDateUpdateRef.current < VISIBLE_DATE_UPDATE_THROTTLE_MS) {
			return;
		}
		lastVisibleDateUpdateRef.current = now;

		const centerX = container.scrollLeft + container.clientWidth / 2;
		const clampedCenterX = Math.max(0, Math.min(centerX, totalWidth));
		const totalMinutes =
			(timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60);
		const minutesFromStart =
			totalWidth > 0 ? (clampedCenterX / totalWidth) * totalMinutes : 0;
		const visibleDate = new Date(
			timeRange.start.getTime() + minutesFromStart * 60 * 1000,
		);
		visibleDate.setHours(0, 0, 0, 0);
		const isoDate = visibleDate.toISOString();

		if (lastVisibleDateRef.current === isoDate) {
			return;
		}
		lastVisibleDateRef.current = isoDate;
		setCurrentDateWithoutAutoScroll(visibleDate);
	}, [
		setCurrentDateWithoutAutoScroll,
		timeRange.end,
		timeRange.start,
		totalWidth,
	]);

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
		const now = new Date();
		// Check if current time is within the buffer range
		if (now < timeRange.start || now > timeRange.end) {
			return null;
		}

		// Calculate position based on minutes from buffer start
		const totalMinutes =
			(timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60);
		const currentMinutes =
			(now.getTime() - timeRange.start.getTime()) / (1000 * 60);
		return (currentMinutes / totalMinutes) * totalWidth;
	}, [timeRange, totalWidth]);

	const lastLoadingRef = useRef(isLoading);
	const initialCenterDoneRef = useRef(false);
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
	}, [technicians, getJobsForTechnician, timeRange.start, timeRange.end]);

	// Lane metadata with cumulative offsets for virtualization
	const PERF_MODE_OVERSCAN = 200;

	const laneMeta = useMemo(() => {
		let offset = 0;
		return technicianLanes.map((lane, index) => {
			const top = offset;
			const bottom = top + lane.height;
			offset = bottom;
			return { index, top, bottom, lane };
		});
	}, [technicianLanes]);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const updateVisible = () => {
			if (laneMeta.length === 0) {
				setVisibleLaneRange({ start: 0, end: -1 });
				return;
			}
			const scrollTop = container.scrollTop;
			const viewHeight = container.clientHeight;
			let start = 0;
			let end = laneMeta.length - 1;

			for (let i = 0; i < laneMeta.length; i++) {
				if (laneMeta[i].bottom >= scrollTop - PERF_MODE_OVERSCAN) {
					start = i;
					break;
				}
			}
			for (let i = start; i < laneMeta.length; i++) {
				if (laneMeta[i].top <= scrollTop + viewHeight + PERF_MODE_OVERSCAN) {
					end = i;
				} else {
					break;
				}
			}
			setVisibleLaneRange({ start, end });
		};

		updateVisible();
		container.addEventListener("scroll", updateVisible, { passive: true });
		window.addEventListener("resize", updateVisible);
		return () => {
			container.removeEventListener("scroll", updateVisible);
			window.removeEventListener("resize", updateVisible);
		};
	}, [laneMeta, PERF_MODE_OVERSCAN]);

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
		if (laneMeta.length === 0) return headerHeight;
		const lanesHeight = laneMeta.at(-1)?.bottom ?? 0;
		return headerHeight + lanesHeight;
	}, [laneMeta]);

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
	// Debounced hover handler to reduce render churn
	const hoverRaf = useRef<number | null>(null);
	const lastHoverXRef = useRef<number | null>(null);
	const lastHoverTimeRef = useRef<string | null>(null);
	const hoverIndicatorRef = useRef<HTMLDivElement | null>(null);
	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!timelineRef.current || !scrollContainerRef.current || isJobHovered || activeJobId) {
				if (hoverIndicatorRef.current) {
					hoverIndicatorRef.current.style.display = "none";
				}
				return;
			}

			const rect = timelineRef.current.getBoundingClientRect();
			const scrollLeft = scrollContainerRef.current.scrollLeft;
			const x = e.clientX - rect.left;

			if (x < 0 || x > rect.width) {
				if (hoverIndicatorRef.current) {
					hoverIndicatorRef.current.style.display = "none";
				}
				return;
			}

			if (hoverRaf.current !== null) {
				cancelAnimationFrame(hoverRaf.current);
			}

			hoverRaf.current = requestAnimationFrame(() => {
				// Calculate time at cursor position using the exact same system as hour slots
				// Hour slots are positioned at: index * HOUR_WIDTH pixels
				// Each slot represents one hour, starting from hourlySlotData.startTs (midnight)
				// x is relative to timeline container, scrollLeft is scroll offset
				const absoluteX = Math.min(
					Math.max(0, scrollLeft + x),
					totalWidth,
				);
				// Calculate which hour slot index (same as how hour labels are positioned)
				const hourIndex = Math.floor(absoluteX / HOUR_WIDTH);
				const pixelOffsetInHour = absoluteX % HOUR_WIDTH;
				// Get the exact hour start time from the slot system (same as hour labels use)
				const hourStartTime = hourlySlotData.getSlot(hourIndex);
				// Calculate minutes within that hour
				const minutesInHour = (pixelOffsetInHour / HOUR_WIDTH) * 60;
				// Create the exact time
				const hoverDate = new Date(hourStartTime.getTime() + minutesInHour * 60 * 1000);

				const nextTime = format(hoverDate, "h:mm a");
				// Skip updates if position/time haven't materially changed (reduces rerenders)
				if (
					lastHoverXRef.current !== null &&
					Math.abs(lastHoverXRef.current - x) < 2 &&
					lastHoverTimeRef.current === nextTime
				) {
					return;
				}
				lastHoverXRef.current = x;
				lastHoverTimeRef.current = nextTime;

				const indicator = hoverIndicatorRef.current;
				if (indicator) {
					const inner = indicator.firstChild as HTMLDivElement | null;
					if (inner) {
						inner.textContent = nextTime;
					}
					indicator.style.display = "block";
					// Position indicator in header at bottom (same as current time badge)
					// X position: x is relative to timeline, header is sibling with same scroll position
					// Since both scroll together, x maps directly to header position
					indicator.style.left = `${x}px`;
				}
			});
		},
		[totalWidth, timeRange, isJobHovered, activeJobId, hourlySlotData],
	);

	const handleMouseLeave = useCallback(() => {
		if (hoverIndicatorRef.current) {
			hoverIndicatorRef.current.style.display = "none";
		}
		if (hoverRaf.current !== null) {
			cancelAnimationFrame(hoverRaf.current);
			hoverRaf.current = null;
		}
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

	// Scroll to current time/date on mount and when current date changes
	const hasInitialScrolled = useRef(false);
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		if (skipAutoScrollRef.current) {
			skipAutoScrollRef.current = false;
			return;
		}

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
			requestAnimationFrame(() => {
				updateVisibleDateFromCurrentScroll();
			});
		}
	}, [currentTimePosition, currentDateOffset, updateVisibleDateFromCurrentScroll]);

	// Force an initial recenter on today after a fresh load, even if persisted date was elsewhere
	useEffect(() => {
		if (initialCenterDoneRef.current) return;
		if (isLoading) return;

		initialCenterDoneRef.current = true;
		hasInitialScrolled.current = false;
		skipAutoScrollRef.current = false;
		goToToday();

		requestAnimationFrame(() => {
			const container = scrollContainerRef.current;
			if (!container) return;
			const targetPosition =
				currentTimePosition !== null
					? currentTimePosition
					: currentDateOffset + container.clientWidth / 4;
			container.scrollLeft = Math.max(
				0,
				targetPosition - container.clientWidth / 2,
			);
			updateVisibleDateFromCurrentScroll();
		});
	}, [
		goToToday,
		isLoading,
		currentTimePosition,
		currentDateOffset,
		updateVisibleDateFromCurrentScroll,
	]);

	// Recenter on today after each fresh load of schedule data
	useEffect(() => {
		if (lastLoadingRef.current && !isLoading) {
			hasInitialScrolled.current = false;
			skipAutoScrollRef.current = false;
			requestAnimationFrame(() => {
				const container = scrollContainerRef.current;
				if (!container) return;
				const targetPosition =
					currentTimePosition !== null
						? currentTimePosition
						: currentDateOffset + container.clientWidth / 4;
				container.scrollLeft = Math.max(
					0,
					targetPosition - container.clientWidth / 2,
				);
				updateVisibleDateFromCurrentScroll();
			});
		}
		lastLoadingRef.current = isLoading;
	}, [
		isLoading,
		currentTimePosition,
		currentDateOffset,
		updateVisibleDateFromCurrentScroll,
	]);

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

	const handleScroll = useCallback(() => {
		handleInfiniteScroll();
		updateVisibleDateFromCurrentScroll();
	}, [handleInfiniteScroll, updateVisibleDateFromCurrentScroll]);

	// Attach scroll listener for infinite scroll (passive for performance)
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		container.addEventListener("scroll", handleScroll, {
			passive: true,
		});
		return () => container.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);


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
			{focusedTechnician && (
				<div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
					{/* Unified Toolbar */}
					<div className="flex items-center justify-between border-b bg-card px-4 py-3">
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleCloseTechnicianFocus}
								className="gap-2"
							>
								<ArrowLeft className="h-4 w-4" />
								<span className="hidden sm:inline">Back</span>
							</Button>
							<div className="h-6 w-px bg-border" />
							<div className="flex items-center gap-3">
								<Avatar className="size-9">
									<AvatarFallback className="text-sm font-semibold">
										{focusedTechnician.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0">
									<p className="truncate font-semibold text-base">
										{focusedTechnician.name}
									</p>
									<p className="text-muted-foreground text-xs">
										{focusedTechnician.role || "Technician"}
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="rounded-full px-3 py-1">
								Live routes
							</Badge>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm">
										<MoreVertical className="h-4 w-4" />
										<span className="hidden sm:inline ml-2">Actions</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Contact Technician</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										disabled={!focusedTechnician.phone}
										onClick={() => {
											if (focusedTechnician.phone) {
												setIncomingCall({
													number: focusedTechnician.phone,
													name: focusedTechnician.name,
													avatar: focusedTechnician.avatar,
												});
											}
										}}
									>
										<Phone className="mr-2 h-4 w-4" />
										{focusedTechnician.phone
											? `Call ${focusedTechnician.phone}`
											: "No phone number"}
									</DropdownMenuItem>
									<DropdownMenuItem
										disabled={!focusedTechnician.phone}
										onClick={() => {
											if (focusedTechnician.phone) {
												const params = new URLSearchParams({
													compose: "true",
													to: focusedTechnician.phone,
													name: focusedTechnician.name,
												});
												router.push(
													`/dashboard/communication/sms?${params.toString()}`,
												);
											}
										}}
									>
										<MessageSquare className="mr-2 h-4 w-4" />
										{focusedTechnician.phone
											? "Send text message"
											: "No phone number"}
									</DropdownMenuItem>
									<DropdownMenuItem
										disabled={!focusedTechnician.email}
										onClick={() => {
											if (focusedTechnician.email) {
												const params = new URLSearchParams({
													compose: "true",
													to: focusedTechnician.email,
													name: focusedTechnician.name,
												});
												router.push(
													`/dashboard/communication/email?${params.toString()}`,
												);
											}
										}}
									>
										<Mail className="mr-2 h-4 w-4" />
										{focusedTechnician.email
											? `Email ${focusedTechnician.email}`
											: "No email address"}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Content Area */}
					<div className="flex flex-1 overflow-hidden">
						{/* Appointments Sidebar */}
						<div className="flex w-80 flex-col border-r bg-card">
							<div className="flex-1 overflow-auto p-4">
								<div className="mb-4">
									<h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
										Appointments ({focusedTechnicianJobs.length})
									</h2>
								</div>
								{focusedTechnicianJobs.length === 0 && (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<Calendar className="mb-3 h-8 w-8 text-muted-foreground/50" />
										<p className="text-muted-foreground text-sm">
											No appointments scheduled
										</p>
									</div>
								)}
								<div className="space-y-3">
									{focusedTechnicianJobs.map((job) => {
										const jobTypeConfig = getJobTypeConfig(job);
										const JobIcon = jobTypeConfig.icon;
										return (
											<div
												key={job.id}
												className={cn(
													"group relative rounded-lg border-l-4 border bg-card p-4 shadow-sm transition-all hover:shadow-md",
													jobTypeConfig.borderColor,
													jobTypeConfig.bgColor,
												)}
											>
												<div className="flex items-start justify-between gap-3">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-2">
															<JobIcon className="h-4 w-4 text-muted-foreground shrink-0" />
															<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
																{jobTypeConfig.label}
															</span>
														</div>
														<h3 className="font-semibold text-sm mb-1 line-clamp-2">
															{job.customer?.name || job.title || "Untitled job"}
														</h3>
														<div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
															<div className="flex items-center gap-1">
																<Clock className="h-3 w-3" />
																<span>
																	{format(job.startTime, "h:mm a")} -{" "}
																	{format(job.endTime, "h:mm a")}
																</span>
															</div>
														</div>
														{job.location?.address && (
															<div className="flex items-start gap-1.5 text-xs text-muted-foreground">
																<MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
																<div className="min-w-0">
																	{job.location.address.street && (
																		<p className="truncate">
																			{job.location.address.street}
																		</p>
																	)}
																	{(job.location.address.city ||
																		job.location.address.state) && (
																		<p className="truncate">
																			{[
																				job.location.address.city,
																				job.location.address.state,
																			]
																				.filter(Boolean)
																				.join(", ")}
																		</p>
																	)}
																</div>
															</div>
														)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						{/* Map View */}
						<div className="relative flex flex-1 flex-col bg-muted/10">
							<TechnicianRouteTrackingMap technicianId={focusedTechnician.id} />
						</div>
					</div>
				</div>
			)}
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
														? "bg-emerald-500 dark:bg-emerald-400 animate-pulse"
														: "bg-slate-400 dark:bg-slate-500",
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
											? "bg-emerald-500 dark:bg-emerald-400"
											: utilizationPercent < 80
												? "bg-amber-500 dark:bg-amber-400"
												: "bg-red-500 dark:bg-red-400";

								return (
									<Tooltip key={technician.id}>
										<TooltipTrigger asChild>
											<div
												className="flex cursor-pointer items-center border-b px-3 hover:bg-primary/5 active:bg-primary/10 transition-colors"
												style={{ height, minHeight: height, maxHeight: height }}
												onClick={() => handleOpenTechnicianFocus(technician.id)}
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
							<div className="bg-card sticky top-0 z-30 flex h-11 shrink-0 border-b relative">
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
								{/* Current Time Badge - Fixed in header at bottom */}
								{currentTimePosition !== null && (
									<div
										className="pointer-events-none absolute bottom-0 z-50 -translate-x-1/2 translate-y-1/2"
										style={{ left: currentTimePosition }}
									>
										<div className="rounded-md bg-blue-500 dark:bg-blue-600 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-lg">
											{format(new Date(), "EEE, MMM d • h:mm a")}
										</div>
									</div>
								)}
								{/* Hover Time Indicator - in header at bottom */}
								<div
									ref={hoverIndicatorRef}
									className="pointer-events-none absolute bottom-0 z-50 hidden -translate-x-1/2 translate-y-1/2"
								>
									<div className="rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-2.5 py-1 text-xs font-semibold whitespace-nowrap shadow-lg border border-gray-200 dark:border-gray-700">
									</div>
								</div>
							</div>

							{/* Timeline Grid */}
							<div
								className="relative flex-1"
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

								{/* Current Time Indicator - Blue Line */}
								{currentTimePosition !== null && (
									<div
										className="absolute top-0 left-0 z-10 w-0.5 bg-blue-500 dark:bg-blue-400 shadow-lg"
										style={{ 
											left: currentTimePosition,
											height: '100%',
										}}
									>
										<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full bg-blue-500 dark:bg-blue-400 ring-2 ring-blue-200 dark:ring-blue-800" />
									</div>
								)}

								{/* Technician Lanes with virtualization */}
								<div className="relative" style={{ height: totalContentHeight }}>
									{laneMeta
										.slice(
											visibleLaneRange.start,
											Math.min(visibleLaneRange.end + 1, laneMeta.length),
										)
										.map((meta) => (
											<div
												key={technicianLanes[meta.index].technician.id}
												className="absolute left-0 w-full"
												style={{ top: meta.top, height: meta.lane.height }}
											>
												<TechnicianLane
													height={meta.lane.height}
													isDragActive={activeJobId !== null}
													jobs={meta.lane.jobs}
													onJobHover={setIsJobHovered}
													onResize={handleResize}
													onResizeComplete={finalizeResize}
													onSelectJob={selectJob}
													selectedJobId={selectedJobId}
													technician={meta.lane.technician}
													onDragCreate={handleLaneDragCreate}
													totalWidth={totalWidth}
													timeRangeStart={timeRange.start}
													isSelectionMode={isSelectionMode}
													selectedJobIds={selectedJobIds}
													onToggleJobSelection={toggleJobSelection}
												/>
											</div>
										))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Drag Overlay - Ghost Preview with smooth animation */}
			<DragOverlay dropAnimation={null}>
				{activeJob
					? (() => {
							const categoryConfig = getAppointmentCategoryConfig(activeJob);
							const start =
								activeJob.startTime instanceof Date
									? activeJob.startTime
									: new Date(activeJob.startTime);
							const end =
								activeJob.endTime instanceof Date
									? activeJob.endTime
									: new Date(activeJob.endTime);
							const durationMinutes = Math.max(
								15,
								Math.round((end.getTime() - start.getTime()) / (1000 * 60)),
							);
							const overlayWidth = Math.max(
								60,
								(durationMinutes / 60) * HOUR_WIDTH,
							);

							return (
								<div
									className="bg-primary/15 border-primary/40 relative h-[48px] w-full max-w-xs rounded-md border shadow-sm"
									style={{
										height: `${JOB_HEIGHT}px`,
										width: `${overlayWidth}px`,
										minWidth: `${overlayWidth}px`,
										maxWidth: `${overlayWidth}px`,
									}}
								>
									{dragPreview && (
										<div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground shadow">
											{dragPreview.label}
										</div>
									)}
								</div>
							);
						})()
					: null}
			</DragOverlay>

			{/* Quick Appointment Dialog - triggered by drag-to-create on timeline */}
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
