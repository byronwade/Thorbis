"use client";

import {
	addMinutes,
	differenceInMinutes,
	format,
	isAfter,
	isBefore,
} from "date-fns";
import {
	ArrowLeft,
	Battery,
	BatteryLow,
	Calendar,
	Car,
	CheckCircle2,
	ChevronRight,
	Clock,
	DollarSign,
	ExternalLink,
	Flame,
	MapPin,
	Navigation,
	Phone,
	Play,
	Plus,
	RefreshCw,
	Send,
	Signal,
	Star,
	Target,
	TrendingUp,
	Truck,
	User,
	Wrench,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type Customer = {
	id: string;
	display_name: string;
	phone?: string;
	email?: string;
	address?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	lat?: number;
	lon?: number;
};

type Property = {
	id: string;
	address?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	lat?: number;
	lon?: number;
};

type Job = {
	id: string;
	title: string;
	description?: string;
	job_type?: string;
	priority?: string;
	status?: string;
	total_amount?: number;
	customer?: Customer | null;
	property?: Property | null;
};

type Appointment = {
	id: string;
	scheduled_start: string;
	scheduled_end: string;
	status: string;
	notes?: string;
	job?: Job | null;
};

type Technician = {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	avatar?: string;
	role?: string;
	status?: string;
	job_title?: string;
	department?: string;
	joined_at?: string;
	bio?: string;
};

type GPSLocation = {
	id: string;
	technician_id: string;
	lat: number;
	lng: number;
	accuracy?: number;
	heading?: number;
	speed?: number;
	battery_level?: number;
	status?: string;
	updated_at: string;
};

type Stats = {
	todayCompleted: number;
	todayTotal: number;
	todayRemaining: number;
	monthCompleted: number;
	monthTotal: number;
	completionRate: number;
};

type TechnicianDayViewProps = {
	technician: Technician;
	appointments: Appointment[];
	unassignedJobs: Job[];
	gpsLocation: GPSLocation | null;
	stats: Stats;
	companyId: string;
};

// ============================================================================
// Constants
// ============================================================================

const JOB_TYPE_CONFIG: Record<string, { icon: typeof Wrench; color: string }> =
	{
		emergency: { icon: Zap, color: "text-red-500" },
		repair: { icon: Wrench, color: "text-orange-500" },
		installation: { icon: Target, color: "text-green-500" },
		maintenance: { icon: RefreshCw, color: "text-blue-500" },
		inspection: { icon: CheckCircle2, color: "text-cyan-500" },
		service: { icon: Wrench, color: "text-slate-500" },
	};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
	scheduled: { label: "Scheduled", color: "bg-blue-500" },
	dispatched: { label: "Dispatched", color: "bg-sky-500" },
	"en-route": { label: "En Route", color: "bg-amber-500" },
	arrived: { label: "Arrived", color: "bg-emerald-500" },
	"in-progress": { label: "In Progress", color: "bg-violet-500" },
	completed: { label: "Completed", color: "bg-green-500" },
	closed: { label: "Closed", color: "bg-slate-500" },
	cancelled: { label: "Cancelled", color: "bg-red-500" },
};

// ============================================================================
// Helper Functions
// ============================================================================

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function formatAddress(
	address?: string,
	city?: string,
	state?: string,
	zip?: string,
): string {
	const parts = [address, city, state, zip].filter(Boolean);
	if (parts.length === 0) return "No address";
	if (parts.length <= 2) return parts.join(", ");
	return `${address}, ${city}, ${state} ${zip}`;
}

function formatCurrency(cents?: number): string {
	if (!cents) return "$0";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
	}).format(cents / 100);
}

function calculateDriveTime(
	fromLat?: number,
	fromLng?: number,
	toLat?: number,
	toLng?: number,
): number | null {
	if (!fromLat || !fromLng || !toLat || !toLng) return null;

	// Haversine distance
	const R = 6371; // km
	const dLat = ((toLat - fromLat) * Math.PI) / 180;
	const dLon = ((toLng - fromLng) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((fromLat * Math.PI) / 180) *
			Math.cos((toLat * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distanceKm = R * c;

	// Assume average speed of 40 km/h in urban areas
	return Math.round((distanceKm / 40) * 60);
}

function getJobLocation(job?: Job | null): { lat?: number; lng?: number } {
	if (job?.property?.lat && job?.property?.lon) {
		return { lat: job.property.lat, lng: job.property.lon };
	}
	if (job?.customer?.lat && job?.customer?.lon) {
		return { lat: job.customer.lat, lng: job.customer.lon };
	}
	return {};
}

// ============================================================================
// Component
// ============================================================================

export function TechnicianDayView({
	technician,
	appointments,
	unassignedJobs,
	gpsLocation,
	stats,
	companyId,
}: TechnicianDayViewProps) {
	const router = useRouter();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [liveGPS, setLiveGPS] = useState(gpsLocation);

	// Update current time every minute
	useEffect(() => {
		const interval = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(interval);
	}, []);

	// Subscribe to real-time GPS updates
	useEffect(() => {
		const supabase = createClient();

		const channel = supabase
			.channel(`technician-gps-${technician.id}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "technician_locations",
					filter: `technician_id=eq.${technician.id}`,
				},
				(payload) => {
					if (payload.new) {
						setLiveGPS(payload.new as GPSLocation);
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [technician.id]);

	// Calculate route with drive times
	const routeWithDriveTimes = useMemo(() => {
		const route: Array<{
			appointment: Appointment;
			driveTimeFromPrev: number | null;
			distanceFromPrev: number | null;
			isNext: boolean;
			isPast: boolean;
			isCurrent: boolean;
		}> = [];

		let prevLat = liveGPS?.lat;
		let prevLng = liveGPS?.lng;

		for (let i = 0; i < appointments.length; i++) {
			const apt = appointments[i];
			const startTime = new Date(apt.scheduled_start);
			const endTime = new Date(apt.scheduled_end);
			const location = getJobLocation(apt.job);

			const driveTime = calculateDriveTime(
				prevLat,
				prevLng,
				location.lat,
				location.lng,
			);

			const isPast = isAfter(currentTime, endTime);
			const isCurrent =
				isAfter(currentTime, startTime) && isBefore(currentTime, endTime);
			const isNext =
				!isPast &&
				!isCurrent &&
				(i === 0 || route[i - 1]?.isPast || route[i - 1]?.isCurrent);

			route.push({
				appointment: apt,
				driveTimeFromPrev: driveTime,
				distanceFromPrev: null,
				isNext,
				isPast,
				isCurrent,
			});

			if (location.lat && location.lng) {
				prevLat = location.lat;
				prevLng = location.lng;
			}
		}

		return route;
	}, [appointments, liveGPS, currentTime]);

	// Calculate total scheduled time
	const totalScheduledMinutes = useMemo(() => {
		return appointments.reduce((acc, apt) => {
			const start = new Date(apt.scheduled_start);
			const end = new Date(apt.scheduled_end);
			return acc + differenceInMinutes(end, start);
		}, 0);
	}, [appointments]);

	// Nearby unassigned jobs (within 30km of tech's location)
	const nearbyJobs = useMemo(() => {
		if (!liveGPS) return [];

		return unassignedJobs
			.map((job) => {
				const location = getJobLocation(job);
				const driveTime = calculateDriveTime(
					liveGPS.lat,
					liveGPS.lng,
					location.lat,
					location.lng,
				);
				return { job, driveTime };
			})
			.filter((j) => j.driveTime !== null && j.driveTime < 45) // Within 45 min drive
			.sort((a, b) => (a.driveTime || 999) - (b.driveTime || 999))
			.slice(0, 5);
	}, [unassignedJobs, liveGPS]);

	const handleRefresh = useCallback(() => {
		setIsRefreshing(true);
		router.refresh();
		setTimeout(() => setIsRefreshing(false), 1000);
	}, [router]);

	const utilizationPercent = Math.min(
		100,
		Math.round((totalScheduledMinutes / 480) * 100), // 8 hour day
	);

	return (
		<div className="flex h-full flex-col bg-background">
			{/* Header */}
			<div className="border-b bg-card px-6 py-4">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.back()}
						className="shrink-0"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>

					<Avatar className="h-14 w-14 border-2 border-primary/20">
						{technician.avatar && (
							<AvatarImage src={technician.avatar} alt={technician.name} />
						)}
						<AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
							{getInitials(technician.name)}
						</AvatarFallback>
					</Avatar>

					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<h1 className="text-xl font-bold truncate">{technician.name}</h1>
							<Badge
								variant="secondary"
								className={cn(
									"shrink-0",
									technician.status === "available" &&
										"bg-green-100 text-green-700",
									technician.status === "busy" && "bg-amber-100 text-amber-700",
									technician.status === "offline" &&
										"bg-slate-100 text-slate-700",
								)}
							>
								{technician.status || "Available"}
							</Badge>
						</div>
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							<span>{technician.role || "Technician"}</span>
							{technician.phone && (
								<>
									<span>•</span>
									<a
										href={`tel:${technician.phone}`}
										className="flex items-center gap-1 hover:text-foreground"
									>
										<Phone className="h-3 w-3" />
										{technician.phone}
									</a>
								</>
							)}
						</div>
					</div>

					{/* GPS Status */}
					{liveGPS && (
						<div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
							<Signal className="h-4 w-4 text-green-500" />
							<div className="text-xs">
								<div className="font-medium">GPS Active</div>
								<div className="text-muted-foreground">
									Updated {format(new Date(liveGPS.updated_at), "h:mm a")}
								</div>
							</div>
							{liveGPS.battery_level !== undefined && (
								<div className="flex items-center gap-1 border-l pl-2">
									{liveGPS.battery_level < 0.2 ? (
										<BatteryLow className="h-4 w-4 text-red-500" />
									) : (
										<Battery className="h-4 w-4 text-green-500" />
									)}
									<span className="text-xs font-medium">
										{Math.round(liveGPS.battery_level * 100)}%
									</span>
								</div>
							)}
						</div>
					)}

					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={handleRefresh}>
							<RefreshCw
								className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
							/>
							Refresh
						</Button>
						<Button size="sm">
							<Send className="mr-2 h-4 w-4" />
							Message
						</Button>
					</div>
				</div>
			</div>

			{/* Stats Bar */}
			<div className="border-b bg-muted/30 px-6 py-3">
				<div className="flex items-center gap-8">
					{/* Today's Progress */}
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Target className="h-5 w-5 text-primary" />
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Today</div>
							<div className="font-semibold">
								{stats.todayCompleted}/{stats.todayTotal} Jobs
							</div>
						</div>
					</div>

					{/* Utilization */}
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
							<Clock className="h-5 w-5 text-blue-500" />
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Utilization</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">{utilizationPercent}%</span>
								<Progress value={utilizationPercent} className="h-2 w-20" />
							</div>
						</div>
					</div>

					{/* Time Booked */}
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
							<Calendar className="h-5 w-5 text-violet-500" />
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Time Booked</div>
							<div className="font-semibold">
								{Math.floor(totalScheduledMinutes / 60)}h{" "}
								{totalScheduledMinutes % 60}m
							</div>
						</div>
					</div>

					{/* Month Stats */}
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
							<TrendingUp className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<div className="text-xs text-muted-foreground">This Month</div>
							<div className="font-semibold">
								{stats.monthCompleted} Jobs ({stats.completionRate.toFixed(0)}%)
							</div>
						</div>
					</div>

					{/* Department/Job Title */}
					{(technician.job_title || technician.department) && (
						<div className="ml-auto flex items-center gap-2">
							{technician.job_title && (
								<Badge variant="secondary" className="text-xs">
									{technician.job_title}
								</Badge>
							)}
							{technician.department && (
								<Badge variant="outline" className="text-xs">
									{technician.department}
								</Badge>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left: Route Timeline */}
				<div className="flex-1 overflow-hidden border-r">
					<div className="flex h-full flex-col">
						<div className="flex items-center justify-between border-b px-6 py-3">
							<h2 className="font-semibold">
								Today's Route ({appointments.length} stops)
							</h2>
							<div className="text-sm text-muted-foreground">
								{format(currentTime, "EEEE, MMMM d")}
							</div>
						</div>

						<ScrollArea className="flex-1">
							<div className="p-6">
								{routeWithDriveTimes.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
										<h3 className="text-lg font-medium">No Jobs Scheduled</h3>
										<p className="text-muted-foreground">
											This technician has no appointments today
										</p>
									</div>
								) : (
									<div className="relative">
										{/* Timeline line */}
										<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

										{routeWithDriveTimes.map((item, index) => {
											const apt = item.appointment;
											const job = apt.job;
											const customer = job?.customer;
											const property = job?.property;
											const startTime = new Date(apt.scheduled_start);
											const endTime = new Date(apt.scheduled_end);
											const duration = differenceInMinutes(endTime, startTime);
											const jobTypeConfig =
												JOB_TYPE_CONFIG[job?.job_type || "service"] ||
												JOB_TYPE_CONFIG.service;
											const statusConfig =
												STATUS_CONFIG[apt.status] || STATUS_CONFIG.scheduled;
											const JobIcon = jobTypeConfig.icon;

											return (
												<div key={apt.id} className="relative mb-6">
													{/* Drive time indicator */}
													{item.driveTimeFromPrev !== null && index > 0 && (
														<div className="mb-3 ml-12 flex items-center gap-2 text-xs text-muted-foreground">
															<Car className="h-3 w-3" />
															<span>~{item.driveTimeFromPrev} min drive</span>
														</div>
													)}

													{/* Timeline dot */}
													<div
														className={cn(
															"absolute left-4 top-4 h-5 w-5 rounded-full border-2 border-background",
															item.isCurrent &&
																"bg-primary ring-4 ring-primary/20",
															item.isNext && "bg-amber-500",
															item.isPast && "bg-green-500",
															!item.isCurrent &&
																!item.isNext &&
																!item.isPast &&
																"bg-muted-foreground/30",
														)}
													/>

													{/* Job Card */}
													<div
														className={cn(
															"ml-12 rounded-lg border bg-card p-4 transition-all",
															item.isCurrent &&
																"border-primary/50 bg-primary/5 ring-2 ring-primary/20",
															item.isNext &&
																"border-amber-500/50 bg-amber-500/5",
														)}
													>
														{/* Header */}
														<div className="mb-3 flex items-start justify-between">
															<div className="flex items-center gap-2">
																<div
																	className={cn(
																		"flex h-8 w-8 items-center justify-center rounded-lg",
																		jobTypeConfig.color.replace(
																			"text-",
																			"bg-",
																		) + "/10",
																	)}
																>
																	<JobIcon
																		className={cn(
																			"h-4 w-4",
																			jobTypeConfig.color,
																		)}
																	/>
																</div>
																<div>
																	<div className="flex items-center gap-2">
																		<span className="font-semibold">
																			{format(startTime, "h:mm a")} -{" "}
																			{format(endTime, "h:mm a")}
																		</span>
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			{duration} min
																		</Badge>
																	</div>
																	<div className="text-xs text-muted-foreground capitalize">
																		{job?.job_type?.replace("_", " ") ||
																			"Service"}
																	</div>
																</div>
															</div>
															<div className="flex items-center gap-2">
																<div
																	className={cn(
																		"h-2 w-2 rounded-full",
																		statusConfig.color,
																	)}
																/>
																<span className="text-xs text-muted-foreground">
																	{statusConfig.label}
																</span>
															</div>
														</div>

														{/* Job Title */}
														<h4 className="mb-2 font-medium">
															{job?.title || "Service Call"}
														</h4>

														{/* Customer & Address */}
														<div className="mb-3 space-y-1 text-sm">
															{customer && (
																<div className="flex items-center gap-2">
																	<User className="h-4 w-4 text-muted-foreground" />
																	<span>{customer.display_name}</span>
																	{customer.phone && (
																		<a
																			href={`tel:${customer.phone}`}
																			className="ml-auto text-xs text-primary hover:underline"
																		>
																			{customer.phone}
																		</a>
																	)}
																</div>
															)}
															<div className="flex items-center gap-2 text-muted-foreground">
																<MapPin className="h-4 w-4 shrink-0" />
																<span className="truncate">
																	{formatAddress(
																		property?.address || customer?.address,
																		property?.city || customer?.city,
																		property?.state || customer?.state,
																		property?.zip_code || customer?.zip_code,
																	)}
																</span>
															</div>
														</div>

														{/* Footer */}
														<div className="flex items-center justify-between border-t pt-3">
															<div className="flex items-center gap-3 text-sm">
																{job?.total_amount && (
																	<div className="flex items-center gap-1 text-green-600">
																		<DollarSign className="h-4 w-4" />
																		{formatCurrency(job.total_amount)}
																	</div>
																)}
																{job?.priority === "high" && (
																	<Badge
																		variant="destructive"
																		className="text-xs"
																	>
																		High Priority
																	</Badge>
																)}
															</div>
															<div className="flex gap-2">
																<Button variant="ghost" size="sm" asChild>
																	<Link
																		href={`/dashboard/work/jobs/${job?.id}`}
																	>
																		<ExternalLink className="mr-1 h-3 w-3" />
																		View Job
																	</Link>
																</Button>
																{(item.isCurrent || item.isNext) && (
																	<Button size="sm">
																		<Navigation className="mr-1 h-3 w-3" />
																		Navigate
																	</Button>
																)}
															</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</ScrollArea>
					</div>
				</div>

				{/* Right: Map & Nearby Jobs */}
				<div className="flex w-[450px] flex-col">
					{/* Map Placeholder */}
					<div className="border-b p-4">
						<h3 className="mb-3 font-semibold">Route Map</h3>
						<div className="flex h-[280px] items-center justify-center rounded-lg border bg-muted/30">
							<div className="text-center text-muted-foreground">
								<MapPin className="mx-auto mb-2 h-8 w-8" />
								<p className="text-sm">Map integration coming soon</p>
								{liveGPS && (
									<p className="mt-1 text-xs">
										GPS: {liveGPS.lat.toFixed(4)}, {liveGPS.lng.toFixed(4)}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Nearby Unassigned Jobs */}
					<div className="flex-1 overflow-hidden">
						<div className="flex items-center justify-between border-b px-4 py-3">
							<h3 className="font-semibold">Nearby Unassigned</h3>
							<Badge variant="secondary">{nearbyJobs.length}</Badge>
						</div>
						<ScrollArea className="h-full">
							<div className="p-4 space-y-3">
								{nearbyJobs.length === 0 ? (
									<div className="py-8 text-center text-muted-foreground">
										<Truck className="mx-auto mb-2 h-8 w-8 opacity-50" />
										<p className="text-sm">No nearby jobs available</p>
									</div>
								) : (
									nearbyJobs.map(({ job, driveTime }) => (
										<Card key={job.id} className="p-3">
											<div className="flex items-start gap-3">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted">
													<Wrench className="h-4 w-4 text-muted-foreground" />
												</div>
												<div className="min-w-0 flex-1">
													<h4 className="truncate text-sm font-medium">
														{job.title}
													</h4>
													<p className="truncate text-xs text-muted-foreground">
														{job.customer?.display_name}
													</p>
													<div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
														<Car className="h-3 w-3" />
														<span>~{driveTime} min</span>
														{job.total_amount && (
															<>
																<span>•</span>
																<span className="text-green-600">
																	{formatCurrency(job.total_amount)}
																</span>
															</>
														)}
													</div>
												</div>
												<Button variant="outline" size="sm">
													<Plus className="mr-1 h-3 w-3" />
													Add
												</Button>
											</div>
										</Card>
									))
								)}
							</div>
						</ScrollArea>
					</div>
				</div>
			</div>
		</div>
	);
}
