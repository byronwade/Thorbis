"use client";

/**
 * Route Optimization Panel
 *
 * Displays route optimization opportunities for technicians.
 * Uses Google Distance Matrix API to calculate optimal job order.
 * Features:
 * - Shows potential time/distance savings per technician
 * - One-click route optimization
 * - Before/after comparison
 */

import {
	ArrowRight,
	Car,
	Check,
	ChevronDown,
	ChevronRight,
	Clock,
	MapPin,
	Route,
	Sparkles,
	TrendingDown,
	TrendingUp,
	Truck,
	Zap,
} from "lucide-react";
import { memo, useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	applyOptimizedRoute,
	getDailyRouteOptimizations,
	optimizeTechnicianRoute,
} from "@/actions/route-optimization";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Job, Technician } from "./schedule-types";

// ============================================================================
// Types
// ============================================================================

type RouteOptimizationResult = {
	technicianId: string;
	technicianName: string;
	jobCount: number;
	originalOrder: string[];
	optimizedOrder: string[];
	savings: {
		timeSeconds: number;
		distanceMeters: number;
		percentImprovement: number;
	};
	route: Array<{
		jobId: string;
		jobTitle?: string;
		fromPrevious: {
			durationSeconds: number;
			distanceMeters: number;
		} | null;
	}>;
};

type TechnicianOptimizationCardProps = {
	technicianId: string;
	technicianName: string;
	jobs: Job[];
	onOptimize: () => void;
	isOptimizing: boolean;
	result: RouteOptimizationResult | null;
	onApply: () => void;
	isApplying: boolean;
};

// ============================================================================
// Helper Functions
// ============================================================================

function formatDuration(seconds: number): string {
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatDistance(meters: number): string {
	const miles = meters / 1609.344;
	return `${miles.toFixed(1)} mi`;
}

// ============================================================================
// Technician Optimization Card
// ============================================================================

const TechnicianOptimizationCard = memo(function TechnicianOptimizationCard({
	technicianId,
	technicianName,
	jobs,
	onOptimize,
	isOptimizing,
	result,
	onApply,
	isApplying,
}: TechnicianOptimizationCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const hasSavings = result && result.savings.timeSeconds > 0;
	const initials = technicianName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	return (
		<Card
			className={cn(
				"transition-all",
				hasSavings && "border-green-500/30 bg-green-500/5",
			)}
		>
			<CardContent className="p-4">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar className="h-9 w-9">
							<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium">{technicianName}</div>
							<div className="text-muted-foreground text-sm">
								{jobs.length} job{jobs.length !== 1 ? "s" : ""} scheduled
							</div>
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex items-center gap-2">
						{result ? (
							hasSavings ? (
								<>
									<Badge
										variant="secondary"
										className="bg-green-500/10 text-green-600"
									>
										<TrendingDown className="mr-1 h-3 w-3" />
										Save {formatDuration(result.savings.timeSeconds)}
									</Badge>
									<Button
										size="sm"
										onClick={onApply}
										disabled={isApplying}
										className="gap-1"
									>
										{isApplying ? (
											"Applying..."
										) : (
											<>
												Apply
												<Check className="h-4 w-4" />
											</>
										)}
									</Button>
								</>
							) : (
								<Badge variant="outline" className="text-muted-foreground">
									Already optimal
								</Badge>
							)
						) : (
							<Button
								size="sm"
								variant="outline"
								onClick={onOptimize}
								disabled={isOptimizing || jobs.length < 2}
								className="gap-1"
							>
								{isOptimizing ? (
									"Calculating..."
								) : (
									<>
										<Route className="h-4 w-4" />
										Optimize
									</>
								)}
							</Button>
						)}
					</div>
				</div>

				{/* Optimization Result */}
				{result && hasSavings && (
					<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
						<CollapsibleTrigger className="mt-3 flex w-full items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm hover:bg-muted transition-colors">
							<span className="text-muted-foreground">
								View optimized route details
							</span>
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</CollapsibleTrigger>

						<CollapsibleContent className="mt-3 space-y-3">
							{/* Savings Summary */}
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-lg bg-muted/50 p-2.5 text-center">
									<div className="flex items-center justify-center gap-1 text-green-600">
										<Clock className="h-4 w-4" />
										<span className="text-sm font-semibold">
											{formatDuration(result.savings.timeSeconds)}
										</span>
									</div>
									<div className="text-muted-foreground text-xs">Time saved</div>
								</div>
								<div className="rounded-lg bg-muted/50 p-2.5 text-center">
									<div className="flex items-center justify-center gap-1 text-green-600">
										<Car className="h-4 w-4" />
										<span className="text-sm font-semibold">
											{formatDistance(result.savings.distanceMeters)}
										</span>
									</div>
									<div className="text-muted-foreground text-xs">
										Distance saved
									</div>
								</div>
								<div className="rounded-lg bg-muted/50 p-2.5 text-center">
									<div className="flex items-center justify-center gap-1 text-green-600">
										<TrendingDown className="h-4 w-4" />
										<span className="text-sm font-semibold">
											{result.savings.percentImprovement}%
										</span>
									</div>
									<div className="text-muted-foreground text-xs">Improvement</div>
								</div>
							</div>

							{/* Route Order */}
							<div className="space-y-2">
								<div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
									Optimized Route Order
								</div>
								<div className="space-y-1.5">
									{result.route.map((stop, idx) => {
										const job = jobs.find((j) => j.id === stop.jobId);
										return (
											<div
												key={stop.jobId}
												className="flex items-center gap-2 rounded-md bg-background/80 p-2 text-sm"
											>
												<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
													{idx + 1}
												</div>
												<div className="min-w-0 flex-1">
													<div className="truncate font-medium">
														{job?.customer?.name || "Unknown"}
													</div>
													<div className="text-muted-foreground truncate text-xs">
														{job?.location?.address?.street}
													</div>
												</div>
												{stop.fromPrevious && (
													<div className="text-muted-foreground shrink-0 text-xs">
														<Car className="mr-1 inline-block h-3 w-3" />
														{formatDuration(stop.fromPrevious.durationSeconds)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</CollapsibleContent>
					</Collapsible>
				)}

				{/* Job list when not enough jobs */}
				{jobs.length < 2 && (
					<div className="text-muted-foreground mt-2 text-sm">
						Need at least 2 jobs to optimize route
					</div>
				)}
			</CardContent>
		</Card>
	);
});

// ============================================================================
// Main Panel Component
// ============================================================================

type RouteOptimizationPanelProps = {
	technicians: Map<string, Technician>;
	jobsByTechnician: Map<string, Job[]>;
	selectedDate: Date;
	className?: string;
};

export function RouteOptimizationPanel({
	technicians,
	jobsByTechnician,
	selectedDate,
	className,
}: RouteOptimizationPanelProps) {
	const [isPending, startTransition] = useTransition();
	const [optimizingTechId, setOptimizingTechId] = useState<string | null>(null);
	const [applyingTechId, setApplyingTechId] = useState<string | null>(null);
	const [results, setResults] = useState<Map<string, RouteOptimizationResult>>(
		new Map(),
	);

	// Filter technicians with 2+ jobs
	const techsWithJobs = Array.from(technicians.values())
		.map((tech) => ({
			tech,
			jobs: jobsByTechnician.get(tech.id) || [],
		}))
		.filter(({ jobs }) => jobs.length > 0)
		.sort((a, b) => b.jobs.length - a.jobs.length);

	const techsToOptimize = techsWithJobs.filter(({ jobs }) => jobs.length >= 2);
	const totalPotentialSavings = Array.from(results.values()).reduce(
		(acc, r) => acc + r.savings.timeSeconds,
		0,
	);

	// Optimize single technician route
	const handleOptimizeTechnician = useCallback(
		(techId: string, jobs: Job[]) => {
			setOptimizingTechId(techId);

			startTransition(async () => {
				try {
					const jobInputs = jobs.map((j) => ({
						id: j.id,
						title: j.title,
						location: {
							address: j.location?.address
								? `${j.location.address.street}, ${j.location.address.city}, ${j.location.address.state}`
								: undefined,
							latitude: j.location?.coordinates?.lat,
							longitude: j.location?.coordinates?.lng,
						},
						scheduledStart: j.startTime,
						scheduledEnd: j.endTime,
					}));

					const result = await optimizeTechnicianRoute(techId, jobInputs);

					if (result.success && result.data) {
						const tech = technicians.get(techId);
						setResults((prev) => {
							const newMap = new Map(prev);
							newMap.set(techId, {
								technicianId: techId,
								technicianName: tech?.name || "Technician",
								jobCount: jobs.length,
								originalOrder: jobs.map((j) => j.id),
								optimizedOrder: result.data!.optimizedOrder,
								savings: result.data!.savings,
								route: result.data!.route.map((r) => ({
									...r,
									jobTitle: jobs.find((j) => j.id === r.jobId)?.title,
								})),
							});
							return newMap;
						});

						if (result.data.savings.timeSeconds > 0) {
							toast.success(
								`Found ${formatDuration(result.data.savings.timeSeconds)} potential savings!`,
							);
						} else {
							toast.info("Route is already optimal");
						}
					} else {
						toast.error(result.error || "Failed to optimize route");
					}
				} catch (error) {
					console.error("Route optimization error:", error);
					toast.error("Failed to calculate optimal route");
				} finally {
					setOptimizingTechId(null);
				}
			});
		},
		[technicians],
	);

	// Apply optimized route
	const handleApplyRoute = useCallback(
		(techId: string) => {
			const result = results.get(techId);
			if (!result) return;

			setApplyingTechId(techId);

			startTransition(async () => {
				try {
					const applyResult = await applyOptimizedRoute(
						techId,
						result.originalOrder,
						result.optimizedOrder,
					);

					if (applyResult.success) {
						toast.success("Route optimized and applied!", {
							description: `Saved ${formatDuration(result.savings.timeSeconds)} travel time`,
						});
						// Clear the result since it's been applied
						setResults((prev) => {
							const newMap = new Map(prev);
							newMap.delete(techId);
							return newMap;
						});
					} else {
						toast.error(applyResult.error || "Failed to apply route");
					}
				} catch (error) {
					console.error("Apply route error:", error);
					toast.error("Failed to apply optimized route");
				} finally {
					setApplyingTechId(null);
				}
			});
		},
		[results],
	);

	// Optimize all technicians
	const handleOptimizeAll = useCallback(async () => {
		for (const { tech, jobs } of techsToOptimize) {
			if (!results.has(tech.id)) {
				await handleOptimizeTechnician(tech.id, jobs);
			}
		}
	}, [techsToOptimize, results, handleOptimizeTechnician]);

	return (
		<div className={cn("flex flex-col gap-4", className)}>
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<Route className="text-primary h-5 w-5" />
					<h3 className="text-lg font-semibold">Route Optimization</h3>
				</div>
				<p className="text-muted-foreground text-sm">
					Optimize technician routes to minimize travel time and fuel costs
				</p>
			</div>

			{/* Summary */}
			{totalPotentialSavings > 0 && (
				<Card className="border-green-500/30 bg-green-500/5">
					<CardContent className="flex items-center justify-between p-4">
						<div className="flex items-center gap-3">
							<div className="rounded-full bg-green-500/20 p-2">
								<Zap className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<div className="font-semibold text-green-700 dark:text-green-400">
									{formatDuration(totalPotentialSavings)} potential savings
								</div>
								<div className="text-muted-foreground text-sm">
									Across {results.size} technician
									{results.size !== 1 ? "s" : ""}
								</div>
							</div>
						</div>
						<Button
							onClick={() => {
								for (const [techId] of results) {
									handleApplyRoute(techId);
								}
							}}
							disabled={isPending}
							className="gap-2"
						>
							Apply All
							<Check className="h-4 w-4" />
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Optimize All Button */}
			{techsToOptimize.length > 0 && results.size < techsToOptimize.length && (
				<Button
					variant="outline"
					onClick={handleOptimizeAll}
					disabled={isPending}
					className="gap-2"
				>
					<Sparkles className="h-4 w-4" />
					Calculate All Routes ({techsToOptimize.length - results.size}{" "}
					remaining)
				</Button>
			)}

			{/* Technician Cards */}
			<div className="space-y-3">
				{techsWithJobs.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center p-8 text-center">
							<Truck className="text-muted-foreground/50 mb-4 h-12 w-12" />
							<p className="font-medium">No jobs scheduled</p>
							<p className="text-muted-foreground text-sm">
								Route optimization is available when technicians have jobs
								assigned
							</p>
						</CardContent>
					</Card>
				) : (
					techsWithJobs.map(({ tech, jobs }) => (
						<TechnicianOptimizationCard
							key={tech.id}
							technicianId={tech.id}
							technicianName={tech.name}
							jobs={jobs}
							onOptimize={() => handleOptimizeTechnician(tech.id, jobs)}
							isOptimizing={optimizingTechId === tech.id}
							result={results.get(tech.id) || null}
							onApply={() => handleApplyRoute(tech.id)}
							isApplying={applyingTechId === tech.id}
						/>
					))
				)}
			</div>

			{/* Info */}
			<div className="text-muted-foreground rounded-lg border border-dashed p-3 text-xs">
				<div className="flex items-start gap-2">
					<MapPin className="mt-0.5 h-4 w-4 shrink-0" />
					<div>
						<p className="font-medium">How it works</p>
						<p className="mt-1">
							Route optimization uses the Google Distance Matrix API to
							calculate the most efficient order for technician visits, reducing
							travel time and fuel costs while keeping your team on schedule.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

// ============================================================================
// Sheet Wrapper
// ============================================================================

type RouteOptimizationSheetProps = {
	technicians: Map<string, Technician>;
	jobsByTechnician: Map<string, Job[]>;
	selectedDate: Date;
	trigger?: React.ReactNode;
};

export function RouteOptimizationSheet({
	technicians,
	jobsByTechnician,
	selectedDate,
	trigger,
}: RouteOptimizationSheetProps) {
	const [open, setOpen] = useState(false);

	const techsWithMultipleJobs = Array.from(technicians.values()).filter(
		(tech) => {
			const jobs = jobsByTechnician.get(tech.id) || [];
			return jobs.length >= 2;
		},
	).length;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				{trigger || (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5"
								disabled={techsWithMultipleJobs === 0}
							>
								<Route className="h-4 w-4" />
								<span className="hidden sm:inline">Optimize Routes</span>
								{techsWithMultipleJobs > 0 && (
									<Badge
										variant="secondary"
										className="ml-1 h-5 px-1.5 text-xs"
									>
										{techsWithMultipleJobs}
									</Badge>
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{techsWithMultipleJobs > 0
								? `Optimize routes for ${techsWithMultipleJobs} technician${techsWithMultipleJobs !== 1 ? "s" : ""}`
								: "Need technicians with 2+ jobs to optimize"}
						</TooltipContent>
					</Tooltip>
				)}
			</SheetTrigger>
			<SheetContent className="w-full overflow-y-auto sm:max-w-lg">
				<SheetHeader className="sr-only">
					<SheetTitle>Route Optimization</SheetTitle>
					<SheetDescription>
						Optimize technician routes to minimize travel time
					</SheetDescription>
				</SheetHeader>
				<RouteOptimizationPanel
					technicians={technicians}
					jobsByTechnician={jobsByTechnician}
					selectedDate={selectedDate}
				/>
			</SheetContent>
		</Sheet>
	);
}

export default RouteOptimizationPanel;
