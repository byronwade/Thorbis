"use client";

/**
 * Timeline Controls
 *
 * Zoom controls and travel time indicators for the dispatch timeline:
 * - Zoom in/out (15min, 30min, 60min intervals)
 * - Travel time indicators between jobs
 * - Current time indicator
 */

import { addMinutes, differenceInMinutes, format } from "date-fns";
import {
	ArrowRight,
	Car,
	Clock,
	Minus,
	Plus,
	RotateCcw,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	calculateHaversineDistance,
	estimateTravelTime,
	getJobCoordinates,
} from "@/lib/schedule/route-optimization";
import { cn } from "@/lib/utils";
import type { Job } from "./schedule-types";

// ============================================================================
// Types
// ============================================================================

type TimelineZoomLevel = 15 | 30 | 60;

type TimelineControlsProps = {
	zoomLevel: TimelineZoomLevel;
	onZoomChange: (level: TimelineZoomLevel) => void;
	currentDate: Date;
	className?: string;
};

type TravelTimeIndicatorProps = {
	fromJob: Job;
	toJob: Job;
	className?: string;
};

type CurrentTimeIndicatorProps = {
	hourWidth: number;
	startHour: number;
};

// ============================================================================
// Zoom Level Configurations
// ============================================================================

const ZOOM_LEVELS: {
	value: TimelineZoomLevel;
	label: string;
	hourWidth: number;
}[] = [
	{ value: 15, label: "15 min", hourWidth: 160 },
	{ value: 30, label: "30 min", hourWidth: 80 },
	{ value: 60, label: "1 hour", hourWidth: 40 },
];

// ============================================================================
// Timeline Zoom Controls
// ============================================================================

export function TimelineZoomControls({
	zoomLevel,
	onZoomChange,
	currentDate,
	className,
}: TimelineControlsProps) {
	const currentZoomIndex = ZOOM_LEVELS.findIndex((z) => z.value === zoomLevel);

	const handleZoomIn = useCallback(() => {
		if (currentZoomIndex > 0) {
			onZoomChange(ZOOM_LEVELS[currentZoomIndex - 1].value);
		}
	}, [currentZoomIndex, onZoomChange]);

	const handleZoomOut = useCallback(() => {
		if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
			onZoomChange(ZOOM_LEVELS[currentZoomIndex + 1].value);
		}
	}, [currentZoomIndex, onZoomChange]);

	const handleReset = useCallback(() => {
		onZoomChange(30); // Default zoom
	}, [onZoomChange]);

	return (
		<TooltipProvider>
			<Card className={cn("inline-flex", className)}>
				<CardContent className="flex items-center gap-1 p-1">
					{/* Zoom Out */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleZoomOut}
								disabled={currentZoomIndex >= ZOOM_LEVELS.length - 1}
							>
								<ZoomOut className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Zoom out</TooltipContent>
					</Tooltip>

					{/* Zoom Level Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 min-w-[80px]">
								<Clock className="mr-1.5 h-3 w-3" />
								{ZOOM_LEVELS.find((z) => z.value === zoomLevel)?.label}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="center">
							{ZOOM_LEVELS.map((level) => (
								<DropdownMenuItem
									key={level.value}
									onClick={() => onZoomChange(level.value)}
									className={cn(zoomLevel === level.value && "bg-accent")}
								>
									{level.label} intervals
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Zoom In */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleZoomIn}
								disabled={currentZoomIndex <= 0}
							>
								<ZoomIn className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Zoom in</TooltipContent>
					</Tooltip>

					{/* Separator */}
					<div className="mx-1 h-4 w-px bg-border" />

					{/* Reset */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleReset}
							>
								<RotateCcw className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Reset zoom</TooltipContent>
					</Tooltip>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}

// ============================================================================
// Travel Time Indicator
// ============================================================================

export function TravelTimeIndicator({
	fromJob,
	toJob,
	className,
}: TravelTimeIndicatorProps) {
	const travelInfo = useMemo(() => {
		const fromCoords = getJobCoordinates(fromJob);
		const toCoords = getJobCoordinates(toJob);

		if (!fromCoords || !toCoords) {
			return null;
		}

		const distance = calculateHaversineDistance(fromCoords, toCoords);
		const duration = estimateTravelTime(distance);

		// Calculate gap between jobs
		const gapMinutes = differenceInMinutes(toJob.startTime, fromJob.endTime);

		// Determine if there's enough time
		const durationMinutes = Math.ceil(duration / 60);
		const hasEnoughTime = gapMinutes >= durationMinutes;
		const shortfall = hasEnoughTime ? 0 : durationMinutes - gapMinutes;

		return {
			distance,
			duration,
			durationMinutes,
			gapMinutes,
			hasEnoughTime,
			shortfall,
		};
	}, [fromJob, toJob]);

	if (!travelInfo) {
		return null;
	}

	const formatDuration = (minutes: number) => {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	};

	const formatDistance = (meters: number) => {
		const miles = meters / 1609.34;
		return `${miles.toFixed(1)} mi`;
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							"flex items-center gap-1 rounded px-1.5 py-0.5 text-xs",
							travelInfo.hasEnoughTime
								? "bg-muted text-muted-foreground"
								: "bg-red-500/10 text-red-600",
							className,
						)}
					>
						<Car className="h-3 w-3" />
						<span>{formatDuration(travelInfo.durationMinutes)}</span>
						{!travelInfo.hasEnoughTime && (
							<span className="font-medium">(-{travelInfo.shortfall}m)</span>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<div className="space-y-1 text-xs">
						<div className="font-medium">Travel to next job</div>
						<div className="flex items-center gap-2">
							<Car className="h-3 w-3" />
							<span>
								{formatDuration(travelInfo.durationMinutes)} ·{" "}
								{formatDistance(travelInfo.distance)}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="h-3 w-3" />
							<span>Gap: {formatDuration(travelInfo.gapMinutes)}</span>
						</div>
						{!travelInfo.hasEnoughTime && (
							<div className="text-red-600">
								{travelInfo.shortfall} minutes short!
							</div>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

// ============================================================================
// Travel Time Between Jobs (for timeline row)
// ============================================================================

type JobTravelTimeRowProps = {
	jobs: Job[];
	hourWidth: number;
	startHour: number;
};

export function JobTravelTimeRow({
	jobs,
	hourWidth,
	startHour,
}: JobTravelTimeRowProps) {
	const sortedJobs = useMemo(() => {
		return [...jobs].sort(
			(a, b) => a.startTime.getTime() - b.startTime.getTime(),
		);
	}, [jobs]);

	const travelSegments = useMemo(() => {
		const segments: {
			fromJob: Job;
			toJob: Job;
			left: number;
			width: number;
			duration: number;
			hasEnoughTime: boolean;
		}[] = [];

		for (let i = 0; i < sortedJobs.length - 1; i++) {
			const fromJob = sortedJobs[i];
			const toJob = sortedJobs[i + 1];

			const fromCoords = getJobCoordinates(fromJob);
			const toCoords = getJobCoordinates(toJob);

			if (!fromCoords || !toCoords) continue;

			const distance = calculateHaversineDistance(fromCoords, toCoords);
			const duration = Math.ceil(estimateTravelTime(distance) / 60);

			// Calculate position on timeline
			const fromEndHour =
				fromJob.endTime.getHours() +
				fromJob.endTime.getMinutes() / 60 -
				startHour;
			const toStartHour =
				toJob.startTime.getHours() +
				toJob.startTime.getMinutes() / 60 -
				startHour;

			const gapMinutes = differenceInMinutes(toJob.startTime, fromJob.endTime);
			const hasEnoughTime = gapMinutes >= duration;

			segments.push({
				fromJob,
				toJob,
				left: fromEndHour * hourWidth,
				width: Math.max((toStartHour - fromEndHour) * hourWidth, 24),
				duration,
				hasEnoughTime,
			});
		}

		return segments;
	}, [sortedJobs, hourWidth, startHour]);

	if (travelSegments.length === 0) {
		return null;
	}

	return (
		<div className="pointer-events-none absolute inset-0">
			{travelSegments.map((segment, index) => (
				<div
					key={index}
					className="pointer-events-auto absolute flex items-center justify-center"
					style={{
						left: segment.left,
						width: segment.width,
						top: "50%",
						transform: "translateY(-50%)",
					}}
				>
					<TravelTimeIndicator
						fromJob={segment.fromJob}
						toJob={segment.toJob}
					/>
				</div>
			))}
		</div>
	);
}

// ============================================================================
// Current Time Indicator
// ============================================================================

export function CurrentTimeIndicator({
	hourWidth,
	startHour,
}: CurrentTimeIndicatorProps) {
	const now = new Date();
	const currentHour = now.getHours() + now.getMinutes() / 60;
	const position = (currentHour - startHour) * hourWidth;

	// Don't show if outside visible range
	if (position < 0) {
		return null;
	}

	return (
		<div
			className="pointer-events-none absolute top-0 z-20 flex h-full flex-col items-center"
			style={{ left: position }}
		>
			{/* Time badge */}
			<Badge
				variant="destructive"
				className="relative -top-1 z-30 text-xs font-medium"
			>
				{format(now, "h:mm a")}
			</Badge>
			{/* Line */}
			<div className="h-full w-0.5 bg-red-500" />
		</div>
	);
}

// ============================================================================
// Exports
// ============================================================================

export { ZOOM_LEVELS };
export type { TimelineZoomLevel };
