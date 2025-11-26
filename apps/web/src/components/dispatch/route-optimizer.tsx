"use client";

/**
 * Route Optimizer Component
 *
 * Optimizes technician routes using Google Cloud Route Optimization API.
 * Useful for:
 * - Daily route planning
 * - Multi-stop optimization
 * - Time window management
 */

import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Loader2,
	MapPin,
	Play,
	Route,
	TrendingDown,
} from "lucide-react";
import { useCallback, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface Job {
	id: string;
	name: string;
	address: string;
	location: {
		latitude: number;
		longitude: number;
	};
	duration: number; // minutes
	timeWindowStart?: Date;
	timeWindowEnd?: Date;
	priority?: "low" | "normal" | "high" | "urgent";
}

export interface Technician {
	id: string;
	name: string;
	startLocation: {
		latitude: number;
		longitude: number;
	};
	endLocation?: {
		latitude: number;
		longitude: number;
	};
	workdayStart: Date;
	workdayEnd: Date;
}

export interface OptimizedRoute {
	technicianId: string;
	technicianName: string;
	jobs: Array<{
		jobId: string;
		jobName: string;
		arrivalTime: string;
		departureTime: string;
		travelTimeFromPrevious: number;
		travelDistanceFromPrevious: number;
	}>;
	totalTravelTime: number;
	totalTravelDistance: number;
	totalWorkTime: number;
	startTime: string;
	endTime: string;
}

export interface RouteOptimizerProps {
	/** Jobs to optimize */
	jobs: Job[];
	/** Available technicians */
	technicians: Technician[];
	/** Callback when optimization is complete */
	onOptimized?: (
		routes: OptimizedRoute[],
		unassigned: Array<{ jobId: string; jobName: string; reason: string }>,
	) => void;
	/** Callback on error */
	onError?: (error: string) => void;
	/** Custom className */
	className?: string;
	/** Show detailed results */
	showDetails?: boolean;
	/** Consider traffic */
	considerTraffic?: boolean;
}

export function RouteOptimizer({
	jobs,
	technicians,
	onOptimized,
	onError,
	className,
	showDetails = true,
	considerTraffic = true,
}: RouteOptimizerProps) {
	const [isOptimizing, setIsOptimizing] = useState(false);
	const [optimizedRoutes, setOptimizedRoutes] = useState<
		OptimizedRoute[] | null
	>(null);
	const [unassignedJobs, setUnassignedJobs] = useState<
		Array<{ jobId: string; jobName: string; reason: string }>
	>([]);
	const [savings, setSavings] = useState<{
		timeSaved: number;
		percentSaved: number;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);

	const optimizeRoutes = useCallback(async () => {
		if (jobs.length === 0 || technicians.length === 0) {
			setError("No jobs or technicians to optimize");
			return;
		}

		setIsOptimizing(true);
		setError(null);
		setSavings(null);

		try {
			const response = await fetch("/api/dispatch/optimize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					jobs: jobs.map((job) => ({
						...job,
						timeWindowStart: job.timeWindowStart?.toISOString(),
						timeWindowEnd: job.timeWindowEnd?.toISOString(),
					})),
					technicians: technicians.map((tech) => ({
						...tech,
						workdayStart: tech.workdayStart.toISOString(),
						workdayEnd: tech.workdayEnd.toISOString(),
					})),
					options: {
						considerTraffic,
					},
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Optimization failed");
			}

			setOptimizedRoutes(data.data.routes);
			setUnassignedJobs(data.data.unassignedJobs || []);

			// Calculate savings
			if (data.data.summary) {
				const originalTime = jobs.length * 30; // Rough estimate: 30 min per job
				const optimizedTime = data.data.summary.totalTravelTime;
				setSavings({
					timeSaved: Math.max(0, originalTime - optimizedTime),
					percentSaved:
						originalTime > 0
							? Math.round(
									((originalTime - optimizedTime) / originalTime) * 100,
								)
							: 0,
				});
			}

			onOptimized?.(data.data.routes, data.data.unassignedJobs || []);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Optimization failed";
			setError(message);
			onError?.(message);
		} finally {
			setIsOptimizing(false);
		}
	}, [jobs, technicians, considerTraffic, onOptimized, onError]);

	const formatTime = (isoString: string) => {
		return new Date(isoString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDuration = (minutes: number) => {
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	};

	const formatDistance = (meters: number) => {
		if (meters < 1000) return `${meters}m`;
		return `${(meters / 1000).toFixed(1)} km`;
	};

	const getPriorityColor = (priority?: string) => {
		switch (priority) {
			case "urgent":
				return "bg-red-500";
			case "high":
				return "bg-orange-500";
			case "normal":
				return "bg-blue-500";
			case "low":
				return "bg-gray-500";
			default:
				return "bg-blue-500";
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Route className="h-5 w-5" />
					Route Optimizer
				</CardTitle>
				<CardDescription>
					Optimize routes for {technicians.length} technician(s) and{" "}
					{jobs.length} job(s)
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Summary Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center p-3 rounded-lg bg-muted">
						<p className="text-2xl font-bold">{jobs.length}</p>
						<p className="text-xs text-muted-foreground">Jobs</p>
					</div>
					<div className="text-center p-3 rounded-lg bg-muted">
						<p className="text-2xl font-bold">{technicians.length}</p>
						<p className="text-xs text-muted-foreground">Technicians</p>
					</div>
					<div className="text-center p-3 rounded-lg bg-muted">
						<p className="text-2xl font-bold">
							{Math.round(jobs.reduce((sum, j) => sum + j.duration, 0) / 60)}h
						</p>
						<p className="text-xs text-muted-foreground">Total Work</p>
					</div>
					<div className="text-center p-3 rounded-lg bg-muted">
						<p className="text-2xl font-bold">
							{
								jobs.filter(
									(j) => j.priority === "urgent" || j.priority === "high",
								).length
							}
						</p>
						<p className="text-xs text-muted-foreground">High Priority</p>
					</div>
				</div>

				{/* Optimize Button */}
				<Button
					className="w-full"
					onClick={optimizeRoutes}
					disabled={
						isOptimizing || jobs.length === 0 || technicians.length === 0
					}
				>
					{isOptimizing ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Optimizing Routes...
						</>
					) : (
						<>
							<Play className="h-4 w-4 mr-2" />
							Optimize Routes
						</>
					)}
				</Button>

				{/* Error Display */}
				{error && (
					<div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
						<AlertTriangle className="h-4 w-4" />
						{error}
					</div>
				)}

				{/* Savings Display */}
				{savings && savings.percentSaved > 0 && (
					<div className="p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 flex items-center gap-2">
						<TrendingDown className="h-4 w-4" />
						<span>
							Estimated savings:{" "}
							<strong>{formatDuration(savings.timeSaved)}</strong> (
							{savings.percentSaved}% less travel time)
						</span>
					</div>
				)}

				{/* Optimized Routes */}
				{showDetails && optimizedRoutes && optimizedRoutes.length > 0 && (
					<div className="space-y-4">
						<Separator />
						<h3 className="font-semibold">Optimized Routes</h3>

						{optimizedRoutes.map((route) => (
							<Card key={route.technicianId} className="overflow-hidden">
								<CardHeader className="pb-2 bg-muted/50">
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-base">
												{route.technicianName}
											</CardTitle>
											<CardDescription>
												{route.jobs.length} jobs •{" "}
												{formatDuration(route.totalTravelTime)} travel •{" "}
												{formatDistance(route.totalTravelDistance)}
											</CardDescription>
										</div>
										<div className="text-right text-sm">
											<p className="font-medium">
												{formatTime(route.startTime)} -{" "}
												{formatTime(route.endTime)}
											</p>
											<p className="text-muted-foreground">
												{formatDuration(route.totalWorkTime)} total
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent className="pt-4">
									<div className="space-y-3">
										{route.jobs.map((job, index) => {
											const originalJob = jobs.find((j) => j.id === job.jobId);
											return (
												<div key={job.jobId} className="flex items-start gap-3">
													{/* Timeline indicator */}
													<div className="flex flex-col items-center">
														<div
															className={cn(
																"w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
																getPriorityColor(originalJob?.priority),
															)}
														>
															{index + 1}
														</div>
														{index < route.jobs.length - 1 && (
															<div className="w-0.5 h-8 bg-border mt-1" />
														)}
													</div>

													{/* Job details */}
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between gap-2">
															<p className="font-medium truncate">
																{job.jobName}
															</p>
															<Badge variant="outline" className="shrink-0">
																{formatTime(job.arrivalTime)}
															</Badge>
														</div>
														<p className="text-sm text-muted-foreground truncate">
															{originalJob?.address}
														</p>
														<div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
															<span className="flex items-center gap-1">
																<Clock className="h-3 w-3" />
																{originalJob?.duration} min
															</span>
															{job.travelTimeFromPrevious > 0 && (
																<span className="flex items-center gap-1">
																	<MapPin className="h-3 w-3" />
																	{formatDuration(job.travelTimeFromPrevious)}{" "}
																	from prev
																</span>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Unassigned Jobs */}
				{showDetails && unassignedJobs.length > 0 && (
					<div className="space-y-2">
						<h3 className="font-semibold text-destructive flex items-center gap-2">
							<AlertTriangle className="h-4 w-4" />
							Unassigned Jobs ({unassignedJobs.length})
						</h3>
						<div className="space-y-2">
							{unassignedJobs.map((job) => (
								<div
									key={job.jobId}
									className="p-3 rounded-lg bg-destructive/10 text-sm"
								>
									<p className="font-medium">{job.jobName}</p>
									<p className="text-muted-foreground">{job.reason}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Success State */}
				{optimizedRoutes &&
					optimizedRoutes.length > 0 &&
					unassignedJobs.length === 0 && (
						<div className="p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 flex items-center gap-2">
							<CheckCircle className="h-4 w-4" />
							All {jobs.length} jobs successfully assigned!
						</div>
					)}

				{/* Progress for assignment */}
				{optimizedRoutes && (
					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span>Jobs Assigned</span>
							<span>
								{jobs.length - unassignedJobs.length} / {jobs.length}
							</span>
						</div>
						<Progress
							value={
								((jobs.length - unassignedJobs.length) / jobs.length) * 100
							}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default RouteOptimizer;
