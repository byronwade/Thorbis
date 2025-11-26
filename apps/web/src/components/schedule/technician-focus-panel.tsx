"use client";

/**
 * Technician Focus Panel
 *
 * Single-click view showing comprehensive technician data:
 * - Profile with skills, certifications, rating
 * - Real-time GPS location and status
 * - Today's route with drive times and distances
 * - Nearby unassigned jobs sorted by distance
 * - Performance stats from analytics
 *
 * Integrates with:
 * - schedule-store: Technician and job data
 * - gps-tracking-store: Real-time location
 * - route-optimization: Distance calculations
 */

import { differenceInMinutes, format, isToday } from "date-fns";
import {
	Award,
	Battery,
	Car,
	ChevronRight,
	Clock,
	Gauge,
	MapPin,
	Navigation,
	Phone,
	Star,
	Target,
	TrendingUp,
	User,
	Wrench,
	X,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type CapacityInfo,
	type Coordinates,
	calculateHaversineDistance,
	calculateTechnicianCapacity,
	getJobCoordinates,
} from "@/lib/schedule/route-optimization";
import {
	formatLocationAge,
	type TechnicianLocation,
	useGPSTrackingStore,
} from "@/lib/stores/gps-tracking-store";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";
import type { Job, Technician } from "./schedule-types";

// ============================================================================
// Types
// ============================================================================

type TechnicianFocusPanelProps = {
	technicianId: string;
	onClose: () => void;
	onJobSelect?: (job: Job) => void;
	className?: string;
};

type NearbyJob = Job & {
	distanceMeters: number;
	distanceText: string;
	estimatedDriveMinutes: number;
};

type TechnicianStats = {
	jobsCompletedToday: number;
	jobsScheduledToday: number;
	utilizationPercent: number;
	onTimeRate: number;
	avgRating: number;
	revenueToday: number;
	firstTimeFixRate: number;
};

// ============================================================================
// Constants
// ============================================================================

const AVERAGE_SPEED_KPH = 40;
const NEARBY_RADIUS_METERS = 30000; // 30km

// ============================================================================
// Helper Functions
// ============================================================================

function formatDistance(meters: number): string {
	const miles = meters / 1609.34;
	if (miles < 0.1) return `${Math.round(meters)} m`;
	return `${miles.toFixed(1)} mi`;
}

function formatDriveTime(minutes: number): string {
	if (minutes < 60) return `${Math.round(minutes)} min`;
	const hours = Math.floor(minutes / 60);
	const mins = Math.round(minutes % 60);
	return `${hours}h ${mins}m`;
}

function getTechnicianInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function getStatusColor(status: Technician["status"]): string {
	switch (status) {
		case "available":
			return "bg-green-500";
		case "on-job":
			return "bg-blue-500";
		case "on-break":
			return "bg-amber-500";
		case "offline":
			return "bg-gray-500";
		default:
			return "bg-gray-500";
	}
}

function getStatusLabel(status: Technician["status"]): string {
	switch (status) {
		case "available":
			return "Available";
		case "on-job":
			return "On Job";
		case "on-break":
			return "On Break";
		case "offline":
			return "Offline";
		default:
			return "Unknown";
	}
}

// ============================================================================
// Component
// ============================================================================

export function TechnicianFocusPanel({
	technicianId,
	onClose,
	onJobSelect,
	className,
}: TechnicianFocusPanelProps) {
	// Store hooks
	const technician = useScheduleStore((state) =>
		state.getTechnicianById(technicianId),
	);
	const getJobsByTechnician = useScheduleStore(
		(state) => state.getJobsByTechnician,
	);
	const getUnassignedJobs = useScheduleStore(
		(state) => state.getUnassignedJobs,
	);
	const jobs = useScheduleStore((state) => state.jobs);

	const gpsLocation = useGPSTrackingStore((state) =>
		state.getLocation(technicianId),
	);
	const isTracking = useGPSTrackingStore((state) => state.isTracking);

	// Derived data
	const technicianJobs = useMemo(() => {
		return getJobsByTechnician(technicianId).sort(
			(a, b) => a.startTime.getTime() - b.startTime.getTime(),
		);
	}, [getJobsByTechnician, technicianId]);

	const todaysJobs = useMemo(() => {
		return technicianJobs.filter((job) => isToday(job.startTime));
	}, [technicianJobs]);

	// Calculate capacity
	const capacity = useMemo((): CapacityInfo | null => {
		if (!technician) return null;
		return calculateTechnicianCapacity(technician, technicianJobs, new Date());
	}, [technician, technicianJobs]);

	// Get nearby unassigned jobs
	const nearbyJobs = useMemo((): NearbyJob[] => {
		const unassigned = getUnassignedJobs();
		const techLocation: Coordinates | null =
			gpsLocation?.coordinates ||
			technician?.currentLocation?.coordinates ||
			null;

		if (!techLocation) {
			// If no location, return unassigned jobs without distance
			return unassigned.slice(0, 10).map((job) => ({
				...job,
				distanceMeters: Infinity,
				distanceText: "Unknown",
				estimatedDriveMinutes: 0,
			}));
		}

		const jobsWithDistance = unassigned
			.map((job) => {
				const jobCoords = getJobCoordinates(job);
				if (!jobCoords) {
					return {
						...job,
						distanceMeters: Infinity,
						distanceText: "Unknown",
						estimatedDriveMinutes: 0,
					};
				}

				const distanceMeters = calculateHaversineDistance(
					techLocation,
					jobCoords,
				);
				const estimatedDriveMinutes =
					(distanceMeters / 1000 / AVERAGE_SPEED_KPH) * 60;

				return {
					...job,
					distanceMeters,
					distanceText: formatDistance(distanceMeters),
					estimatedDriveMinutes,
				};
			})
			.filter((job) => job.distanceMeters <= NEARBY_RADIUS_METERS)
			.sort((a, b) => a.distanceMeters - b.distanceMeters);

		return jobsWithDistance.slice(0, 10);
	}, [getUnassignedJobs, gpsLocation, technician]);

	// Calculate stats
	const stats = useMemo((): TechnicianStats => {
		const completed = todaysJobs.filter(
			(j) => j.status === "completed" || j.status === "closed",
		).length;
		const scheduled = todaysJobs.length;

		return {
			jobsCompletedToday: completed,
			jobsScheduledToday: scheduled,
			utilizationPercent: capacity?.utilizationPercent || 0,
			onTimeRate: 95, // TODO: Pull from analytics_technician_leaderboard
			avgRating: 4.8, // TODO: Pull from analytics_technician_leaderboard
			revenueToday: 0, // TODO: Pull from analytics_technician_leaderboard
			firstTimeFixRate: 92, // TODO: Pull from analytics_technician_leaderboard
		};
	}, [todaysJobs, capacity]);

	// Current/Next job
	const currentJob = useMemo(() => {
		const now = new Date();
		return todaysJobs.find(
			(job) =>
				job.status === "in-progress" ||
				(job.startTime <= now && job.endTime >= now),
		);
	}, [todaysJobs]);

	const nextJob = useMemo(() => {
		const now = new Date();
		return todaysJobs.find(
			(job) =>
				job.status === "scheduled" &&
				job.startTime > now &&
				job.status !== "completed" &&
				job.status !== "cancelled",
		);
	}, [todaysJobs]);

	if (!technician) {
		return (
			<Card className={cn("w-full max-w-md", className)}>
				<CardContent className="p-6">
					<p className="text-muted-foreground">Technician not found</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full max-w-md flex flex-col h-full", className)}>
			{/* Header */}
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className="relative">
							<Avatar className="h-12 w-12">
								<AvatarImage src={technician.avatar} alt={technician.name} />
								<AvatarFallback className="bg-primary/10">
									{getTechnicianInitials(technician.name)}
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background",
									getStatusColor(technician.status),
								)}
							/>
						</div>
						<div>
							<CardTitle className="text-lg">{technician.name}</CardTitle>
							<div className="flex items-center gap-2 mt-0.5">
								<Badge variant="outline" className="text-xs">
									{technician.role}
								</Badge>
								<span className="text-xs text-muted-foreground">
									{getStatusLabel(technician.status)}
								</span>
							</div>
						</div>
					</div>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>

			<ScrollArea className="flex-1">
				<div className="px-6 pb-6 space-y-4">
					{/* GPS Location */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium flex items-center gap-2">
							<Navigation className="h-4 w-4 text-blue-500" />
							Location
						</h4>
						{gpsLocation ? (
							<div className="bg-muted/50 rounded-lg p-3 space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className={cn(
												"h-2 w-2 rounded-full",
												gpsLocation.status === "active"
													? "bg-green-500 animate-pulse"
													: gpsLocation.status === "stale"
														? "bg-amber-500"
														: "bg-gray-500",
											)}
										/>
										<span className="text-sm">
											{gpsLocation.status === "active"
												? "Live"
												: gpsLocation.status === "stale"
													? "Stale"
													: "Offline"}
										</span>
									</div>
									<span className="text-xs text-muted-foreground">
										{formatLocationAge(gpsLocation.timestamp)}
									</span>
								</div>
								<div className="grid grid-cols-2 gap-2 text-xs">
									<div>
										<span className="text-muted-foreground">Speed:</span>{" "}
										{gpsLocation.speed
											? `${Math.round((gpsLocation.speed * 3600) / 1000)} km/h`
											: "Stationary"}
									</div>
									{gpsLocation.batteryLevel !== undefined && (
										<div className="flex items-center gap-1">
											<Battery className="h-3 w-3" />
											{Math.round(gpsLocation.batteryLevel * 100)}%
										</div>
									)}
								</div>
								<div className="text-xs text-muted-foreground">
									{gpsLocation.coordinates.lat.toFixed(5)},{" "}
									{gpsLocation.coordinates.lng.toFixed(5)}
								</div>
							</div>
						) : (
							<div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
								No location data available
							</div>
						)}
					</div>

					<Separator />

					{/* Today's Stats */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium flex items-center gap-2">
							<Gauge className="h-4 w-4 text-purple-500" />
							Today&apos;s Stats
						</h4>
						<div className="grid grid-cols-2 gap-2">
							<div className="bg-muted/50 rounded-lg p-2.5">
								<div className="text-xs text-muted-foreground">Jobs</div>
								<div className="text-lg font-semibold">
									{stats.jobsCompletedToday}/{stats.jobsScheduledToday}
								</div>
							</div>
							<div className="bg-muted/50 rounded-lg p-2.5">
								<div className="text-xs text-muted-foreground">Utilization</div>
								<div className="flex items-center gap-2">
									<div className="text-lg font-semibold">
										{stats.utilizationPercent}%
									</div>
									<Progress
										value={stats.utilizationPercent}
										className="h-1.5 flex-1"
									/>
								</div>
							</div>
							<div className="bg-muted/50 rounded-lg p-2.5">
								<div className="text-xs text-muted-foreground">On-Time</div>
								<div className="text-lg font-semibold flex items-center gap-1">
									{stats.onTimeRate}%
									<TrendingUp className="h-3 w-3 text-green-500" />
								</div>
							</div>
							<div className="bg-muted/50 rounded-lg p-2.5">
								<div className="text-xs text-muted-foreground">Rating</div>
								<div className="text-lg font-semibold flex items-center gap-1">
									{stats.avgRating}
									<Star className="h-3 w-3 text-amber-500 fill-amber-500" />
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Current/Next Job */}
					{(currentJob || nextJob) && (
						<>
							<div className="space-y-2">
								<h4 className="text-sm font-medium flex items-center gap-2">
									{currentJob ? (
										<>
											<Zap className="h-4 w-4 text-amber-500" />
											Current Job
										</>
									) : (
										<>
											<Clock className="h-4 w-4 text-blue-500" />
											Next Job
										</>
									)}
								</h4>
								<JobCard
									job={currentJob || nextJob!}
									onSelect={onJobSelect}
									showDistance={false}
								/>
							</div>
							<Separator />
						</>
					)}

					{/* Today's Route */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium flex items-center gap-2">
							<Car className="h-4 w-4 text-green-500" />
							Today&apos;s Route ({todaysJobs.length} jobs)
						</h4>
						{todaysJobs.length > 0 ? (
							<div className="space-y-1">
								{todaysJobs.map((job, index) => (
									<RouteJobItem
										key={job.id}
										job={job}
										index={index}
										isLast={index === todaysJobs.length - 1}
										onSelect={onJobSelect}
									/>
								))}
							</div>
						) : (
							<div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
								No jobs scheduled for today
							</div>
						)}
					</div>

					<Separator />

					{/* Nearby Unassigned Jobs */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium flex items-center gap-2">
							<Target className="h-4 w-4 text-red-500" />
							Nearby Unassigned ({nearbyJobs.length})
						</h4>
						{nearbyJobs.length > 0 ? (
							<div className="space-y-1.5">
								{nearbyJobs.slice(0, 5).map((job) => (
									<JobCard
										key={job.id}
										job={job}
										onSelect={onJobSelect}
										showDistance={true}
										distance={job.distanceText}
										driveTime={formatDriveTime(job.estimatedDriveMinutes)}
									/>
								))}
							</div>
						) : (
							<div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
								No unassigned jobs nearby
							</div>
						)}
					</div>

					<Separator />

					{/* Skills & Certifications */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium flex items-center gap-2">
							<Award className="h-4 w-4 text-indigo-500" />
							Skills & Certifications
						</h4>
						<div className="flex flex-wrap gap-1.5">
							{technician.skills?.map((skill) => (
								<Badge key={skill} variant="secondary" className="text-xs">
									<Wrench className="h-3 w-3 mr-1" />
									{skill}
								</Badge>
							))}
							{technician.certifications?.map((cert) => (
								<Badge
									key={cert}
									variant="outline"
									className="text-xs border-amber-500/50 text-amber-600"
								>
									<Award className="h-3 w-3 mr-1" />
									{cert}
								</Badge>
							))}
							{!technician.skills?.length &&
								!technician.certifications?.length && (
									<span className="text-sm text-muted-foreground">
										No skills or certifications listed
									</span>
								)}
						</div>
					</div>

					{/* Contact */}
					{(technician.phone || technician.email) && (
						<>
							<Separator />
							<div className="space-y-2">
								<h4 className="text-sm font-medium flex items-center gap-2">
									<Phone className="h-4 w-4 text-teal-500" />
									Contact
								</h4>
								<div className="space-y-1 text-sm">
									{technician.phone && (
										<a
											href={`tel:${technician.phone}`}
											className="flex items-center gap-2 text-blue-500 hover:underline"
										>
											<Phone className="h-3 w-3" />
											{technician.phone}
										</a>
									)}
									{technician.email && (
										<a
											href={`mailto:${technician.email}`}
											className="flex items-center gap-2 text-blue-500 hover:underline"
										>
											{technician.email}
										</a>
									)}
								</div>
							</div>
						</>
					)}
				</div>
			</ScrollArea>
		</Card>
	);
}

// ============================================================================
// Sub-Components
// ============================================================================

type JobCardProps = {
	job: Job;
	onSelect?: (job: Job) => void;
	showDistance?: boolean;
	distance?: string;
	driveTime?: string;
};

function JobCard({
	job,
	onSelect,
	showDistance,
	distance,
	driveTime,
}: JobCardProps) {
	const priorityColors = {
		urgent: "border-l-red-500 bg-red-500/5",
		high: "border-l-orange-500 bg-orange-500/5",
		medium: "border-l-blue-500 bg-blue-500/5",
		low: "border-l-gray-500 bg-gray-500/5",
	};

	return (
		<button
			type="button"
			onClick={() => onSelect?.(job)}
			className={cn(
				"w-full text-left rounded-lg border border-l-4 p-2.5 transition-colors hover:bg-accent/50",
				priorityColors[job.priority],
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 min-w-0">
					<div className="font-medium text-sm truncate">{job.title}</div>
					<div className="text-xs text-muted-foreground truncate">
						{job.customer.name}
					</div>
				</div>
				<div className="text-right shrink-0">
					<div className="text-xs font-medium">
						{format(job.startTime, "h:mm a")}
					</div>
					{showDistance && distance && (
						<div className="text-xs text-muted-foreground">{distance}</div>
					)}
				</div>
			</div>
			{showDistance && driveTime && (
				<div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
					<Car className="h-3 w-3" />
					{driveTime} drive
				</div>
			)}
			<div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
				<MapPin className="h-3 w-3" />
				<span className="truncate">
					{job.location.address.street}, {job.location.address.city}
				</span>
			</div>
		</button>
	);
}

type RouteJobItemProps = {
	job: Job;
	index: number;
	isLast: boolean;
	onSelect?: (job: Job) => void;
};

function RouteJobItem({ job, index, isLast, onSelect }: RouteJobItemProps) {
	const statusColors: Record<string, string> = {
		completed: "bg-green-500",
		"in-progress": "bg-blue-500",
		dispatched: "bg-amber-500",
		arrived: "bg-purple-500",
		scheduled: "bg-gray-400",
		cancelled: "bg-red-500",
		closed: "bg-gray-500",
	};

	return (
		<div className="flex items-stretch gap-2">
			{/* Timeline connector */}
			<div className="flex flex-col items-center">
				<div
					className={cn(
						"h-3 w-3 rounded-full shrink-0",
						statusColors[job.status],
					)}
				/>
				{!isLast && <div className="w-0.5 flex-1 bg-border my-1" />}
			</div>

			{/* Job info */}
			<button
				type="button"
				onClick={() => onSelect?.(job)}
				className="flex-1 text-left py-1 hover:bg-accent/50 rounded px-1 -ml-1 transition-colors"
			>
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium truncate">{job.title}</span>
					<span className="text-xs text-muted-foreground shrink-0 ml-2">
						{format(job.startTime, "h:mm a")}
					</span>
				</div>
				<div className="text-xs text-muted-foreground truncate">
					{job.customer.name} • {job.location.address.city}
				</div>
			</button>
		</div>
	);
}

// ============================================================================
// Export Hook for Integration
// ============================================================================

export function useTechnicianFocus() {
	const [focusedTechnicianId, setFocusedTechnicianId] = useState<string | null>(
		null,
	);
	const selectTechnician = useScheduleStore((state) => state.selectTechnician);

	const openFocus = useCallback(
		(technicianId: string) => {
			setFocusedTechnicianId(technicianId);
			selectTechnician(technicianId);
		},
		[selectTechnician],
	);

	const closeFocus = useCallback(() => {
		setFocusedTechnicianId(null);
		selectTechnician(null);
	}, [selectTechnician]);

	return {
		focusedTechnicianId,
		openFocus,
		closeFocus,
	};
}
