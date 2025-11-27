"use client";

/**
 * Capacity Indicator Component
 *
 * Visual indicators for technician workload and availability:
 * - Utilization percentage
 * - Daily capacity breakdown
 * - Overbooking warnings
 * - Travel time estimation
 */

import { format } from "date-fns";
import {
	AlertTriangle,
	Car,
	Check,
	Clock,
	TrendingUp,
	User,
	Users,
} from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
import {
	type CapacityInfo,
	calculateTechnicianCapacity,
} from "@/lib/schedule/route-optimization";
import { cn } from "@/lib/utils";
import type { Job, Technician } from "./schedule-types";

// ============================================================================
// Types
// ============================================================================

type CapacityIndicatorProps = {
	technician: Technician;
	date?: Date;
	jobs?: Job[];
	variant?: "compact" | "detailed" | "inline";
	className?: string;
};

type CapacityBarProps = {
	capacity: CapacityInfo;
	showLabels?: boolean;
};

type TeamCapacityOverviewProps = {
	date?: Date;
	className?: string;
};

// ============================================================================
// Helper Functions
// ============================================================================

function getCapacityColor(percent: number): string {
	if (percent > 100) return "bg-red-500";
	if (percent > 85) return "bg-amber-500";
	if (percent > 60) return "bg-blue-500";
	return "bg-green-500";
}

function getCapacityTextColor(percent: number): string {
	if (percent > 100) return "text-red-600 dark:text-red-400";
	if (percent > 85) return "text-amber-600 dark:text-amber-400";
	if (percent > 60) return "text-blue-600 dark:text-blue-400";
	return "text-green-600 dark:text-green-400";
}

function formatMinutes(minutes: number): string {
	if (minutes < 60) return `${Math.round(minutes)}m`;
	const hours = Math.floor(minutes / 60);
	const mins = Math.round(minutes % 60);
	if (mins === 0) return `${hours}h`;
	return `${hours}h ${mins}m`;
}

// ============================================================================
// Capacity Bar Component
// ============================================================================

function CapacityBar({ capacity, showLabels = true }: CapacityBarProps) {
	const scheduledPercent = Math.min(
		(capacity.scheduledMinutes / capacity.totalMinutes) * 100,
		100,
	);
	const travelPercent = Math.min(
		(capacity.travelMinutes / capacity.totalMinutes) * 100,
		100 - scheduledPercent,
	);

	return (
		<div className="space-y-1">
			{showLabels && (
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground">Capacity</span>
					<span
						className={cn(
							"font-medium",
							getCapacityTextColor(capacity.utilizationPercent),
						)}
					>
						{capacity.utilizationPercent}%
					</span>
				</div>
			)}
			<div className="relative h-2 overflow-hidden rounded-full bg-muted">
				{/* Scheduled time */}
				<div
					className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
					style={{ width: `${scheduledPercent}%` }}
				/>
				{/* Travel time */}
				<div
					className="absolute top-0 h-full bg-amber-500 transition-all"
					style={{
						left: `${scheduledPercent}%`,
						width: `${travelPercent}%`,
					}}
				/>
			</div>
			{showLabels && (
				<div className="flex items-center gap-3 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<span className="h-2 w-2 rounded-full bg-blue-500" />
						{formatMinutes(capacity.scheduledMinutes)} work
					</span>
					{capacity.travelMinutes > 0 && (
						<span className="flex items-center gap-1">
							<span className="h-2 w-2 rounded-full bg-amber-500" />
							{formatMinutes(capacity.travelMinutes)} travel
						</span>
					)}
				</div>
			)}
		</div>
	);
}

// ============================================================================
// Main Capacity Indicator
// ============================================================================

export function CapacityIndicator({
	technician,
	date = new Date(),
	jobs,
	variant = "detailed",
	className,
}: CapacityIndicatorProps) {
	const { jobs: allJobs } = useSchedule();

	// Get jobs for this technician
	const techJobs = useMemo(() => {
		if (jobs) return jobs;

		return Array.from(allJobs.values()).filter((job) =>
			job.assignments.some((a) => a.technicianId === technician.id),
		);
	}, [jobs, allJobs, technician.id]);

	// Calculate capacity
	const capacity = useMemo(() => {
		return calculateTechnicianCapacity(technician, techJobs, date);
	}, [technician, techJobs, date]);

	// Compact inline version
	if (variant === "inline") {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn(
								"flex items-center gap-1.5 rounded-full px-2 py-0.5",
								capacity.status === "available" &&
									"bg-green-500/10 text-green-600 dark:text-green-400",
								capacity.status === "busy" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
								capacity.status === "overbooked" &&
									"bg-red-500/10 text-red-600 dark:text-red-400",
								className,
							)}
						>
							<div
								className={cn(
									"h-1.5 w-1.5 rounded-full",
									getCapacityColor(capacity.utilizationPercent),
								)}
							/>
							<span className="text-xs font-medium">
								{capacity.utilizationPercent}%
							</span>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="space-y-1 text-xs">
							<div className="font-medium">{technician.name}</div>
							<div>
								{capacity.jobCount} jobs ·{" "}
								{formatMinutes(capacity.availableMinutes)} available
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	// Compact card version
	if (variant === "compact") {
		return (
			<div className={cn("flex items-center gap-3", className)}>
				<div className="relative">
					<Avatar className="h-8 w-8">
						{technician.avatar && <AvatarImage src={technician.avatar} />}
						<AvatarFallback className="text-xs">
							{technician.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div
						className={cn(
							"absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
							getCapacityColor(capacity.utilizationPercent),
						)}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between">
						<span className="truncate text-sm font-medium">
							{technician.name}
						</span>
						<span
							className={cn(
								"text-xs font-medium",
								getCapacityTextColor(capacity.utilizationPercent),
							)}
						>
							{capacity.utilizationPercent}%
						</span>
					</div>
					<Progress
						value={Math.min(capacity.utilizationPercent, 100)}
						className="mt-1 h-1.5"
					/>
				</div>
			</div>
		);
	}

	// Detailed card version
	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar>
							{technician.avatar && <AvatarImage src={technician.avatar} />}
							<AvatarFallback>
								{technician.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="text-base">{technician.name}</CardTitle>
							<p className="text-sm text-muted-foreground">{technician.role}</p>
						</div>
					</div>
					<Badge
						variant={
							capacity.status === "available"
								? "default"
								: capacity.status === "busy"
									? "secondary"
									: "destructive"
						}
					>
						{capacity.status === "available" && (
							<Check className="mr-1 h-3 w-3" />
						)}
						{capacity.status === "busy" && <Clock className="mr-1 h-3 w-3" />}
						{capacity.status === "overbooked" && (
							<AlertTriangle className="mr-1 h-3 w-3" />
						)}
						{capacity.status}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Capacity Bar */}
				<CapacityBar capacity={capacity} />

				{/* Stats Grid */}
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="text-2xl font-semibold">{capacity.jobCount}</div>
						<div className="text-xs text-muted-foreground">Jobs</div>
					</div>
					<div>
						<div className="text-2xl font-semibold">
							{formatMinutes(capacity.scheduledMinutes)}
						</div>
						<div className="text-xs text-muted-foreground">Scheduled</div>
					</div>
					<div>
						<div className="text-2xl font-semibold">
							{formatMinutes(capacity.availableMinutes)}
						</div>
						<div className="text-xs text-muted-foreground">Available</div>
					</div>
				</div>

				{/* Travel Time Notice */}
				{capacity.travelMinutes > 0 && (
					<div className="flex items-center gap-2 rounded-md bg-amber-500/10 p-2 text-sm text-amber-600 dark:text-amber-400">
						<Car className="h-4 w-4" />
						<span>
							Est. {formatMinutes(capacity.travelMinutes)} travel time between
							jobs
						</span>
					</div>
				)}

				{/* Overbooking Warning */}
				{capacity.status === "overbooked" && (
					<div className="flex items-center gap-2 rounded-md bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">
						<AlertTriangle className="h-4 w-4" />
						<span>
							Scheduled{" "}
							{formatMinutes(
								capacity.scheduledMinutes + capacity.travelMinutes,
							)}{" "}
							of {formatMinutes(capacity.totalMinutes)} available
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// ============================================================================
// Team Capacity Overview
// ============================================================================

export function TeamCapacityOverview({
	date = new Date(),
	className,
}: TeamCapacityOverviewProps) {
	const { jobs, technicians } = useSchedule();

	// Calculate capacity for all technicians
	const teamCapacity = useMemo(() => {
		const capacities: (CapacityInfo & { technician: Technician })[] = [];

		for (const tech of technicians.values()) {
			const techJobs = Array.from(jobs.values()).filter((job) =>
				job.assignments.some((a) => a.technicianId === tech.id),
			);

			const capacity = calculateTechnicianCapacity(tech, techJobs, date);
			capacities.push({ ...capacity, technician: tech });
		}

		return capacities.sort(
			(a, b) => b.utilizationPercent - a.utilizationPercent,
		);
	}, [technicians, jobs, date]);

	// Team stats
	const stats = useMemo(() => {
		const available = teamCapacity.filter(
			(c) => c.status === "available",
		).length;
		const busy = teamCapacity.filter((c) => c.status === "busy").length;
		const overbooked = teamCapacity.filter(
			(c) => c.status === "overbooked",
		).length;

		const totalScheduled = teamCapacity.reduce(
			(sum, c) => sum + c.scheduledMinutes,
			0,
		);
		const totalCapacity = teamCapacity.reduce(
			(sum, c) => sum + c.totalMinutes,
			0,
		);
		const avgUtilization =
			totalCapacity > 0
				? Math.round((totalScheduled / totalCapacity) * 100)
				: 0;

		return { available, busy, overbooked, avgUtilization };
	}, [teamCapacity]);

	return (
		<Card className={className}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Team Capacity
					</CardTitle>
					<Badge variant="outline">{format(date, "MMM d")}</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Summary Stats */}
				<div className="grid grid-cols-4 gap-2 text-center">
					<div className="rounded-md bg-muted p-2">
						<div className="text-xl font-semibold">{teamCapacity.length}</div>
						<div className="text-xs text-muted-foreground">Total</div>
					</div>
					<div className="rounded-md bg-green-500/10 p-2">
						<div className="text-xl font-semibold text-green-600 dark:text-green-400">
							{stats.available}
						</div>
						<div className="text-xs text-muted-foreground">Available</div>
					</div>
					<div className="rounded-md bg-amber-500/10 p-2">
						<div className="text-xl font-semibold text-amber-600 dark:text-amber-400">
							{stats.busy}
						</div>
						<div className="text-xs text-muted-foreground">Busy</div>
					</div>
					<div className="rounded-md bg-red-500/10 p-2">
						<div className="text-xl font-semibold text-red-600 dark:text-red-400">
							{stats.overbooked}
						</div>
						<div className="text-xs text-muted-foreground">Over</div>
					</div>
				</div>

				{/* Average Utilization */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
							Team Utilization
						</span>
						<span className="font-medium">{stats.avgUtilization}%</span>
					</div>
					<Progress value={stats.avgUtilization} className="h-2" />
				</div>

				{/* Individual Technicians */}
				<div className="space-y-2">
					{teamCapacity.map((capacity) => (
						<CapacityIndicator
							key={capacity.technicianId}
							technician={capacity.technician}
							date={date}
							variant="compact"
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default CapacityIndicator;
