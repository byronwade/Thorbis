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
import { format } from "date-fns";
import { memo, useCallback, useMemo, useState, useTransition } from "react";
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
// Normalizers to tolerate non-Map inputs
// ============================================================================

type TechnicianMapLike =
	| Map<string, Technician>
	| Technician[]
	| Record<string, Technician>
	| null
	| undefined;

type JobsByTechMapLike =
	| Map<string, Job[]>
	| Record<string, Job[]>
	| null
	| undefined;

function normalizeTechnicians(input: TechnicianMapLike): Map<string, Technician> {
	if (input instanceof Map) return input;
	if (Array.isArray(input)) return new Map(input.map((t) => [t.id, t]));
	if (input && typeof input === "object") {
		return new Map(Object.values(input).map((t) => [t.id, t]));
	}
	return new Map();
}

function normalizeJobsByTech(input: JobsByTechMapLike): Map<string, Job[]> {
	if (input instanceof Map) return input;
	if (input && typeof input === "object" && !Array.isArray(input)) {
		return new Map(Object.entries(input));
	}
	return new Map();
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
	technicians: TechnicianMapLike;
	jobsByTechnician: JobsByTechMapLike;
	selectedDate: Date;
	className?: string;
};

function RouteOptimizationPanel({
	technicians,
	jobsByTechnician,
	selectedDate,
	className,
}: RouteOptimizationPanelProps) {
	const technicianMap = useMemo(
		() => normalizeTechnicians(technicians),
		[technicians],
	);
	const jobsByTechMap = useMemo(
		() => normalizeJobsByTech(jobsByTechnician),
		[jobsByTechnician],
	);

	const [isPending, startTransition] = useTransition();
	const [optimizingTechId, setOptimizingTechId] = useState<string | null>(null);
	const [applyingTechId, setApplyingTechId] = useState<string | null>(null);
	const [results, setResults] = useState<Map<string, RouteOptimizationResult>>(
		new Map(),
	);

	// Filter technicians with 2+ jobs
	const techsWithJobs = Array.from(technicianMap.values())
		.map((tech) => ({
			tech,
			jobs: jobsByTechMap.get(tech.id) || [],
		}))
		.filter(({ jobs }) => jobs.length > 0)
		.sort((a, b) => b.jobs.length - a.jobs.length);

	const techsToOptimize = techsWithJobs.filter(({ jobs }) => jobs.length >= 2);
	const totalPotentialSavings = Array.from(results.values()).reduce(
		(acc, r) => acc + r.savings.timeSeconds,
		0,
	);
	const totalJobsForDay = useMemo(() => {
		let count = 0;
		for (const [, jobs] of jobsByTechMap) {
			count += jobs.length;
		}
		return count;
	}, [jobsByTechMap]);
	const dateLabel = format(selectedDate, "EEE, MMM d");

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
						const tech = technicianMap.get(techId);
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
		[technicianMap],
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
		<div className={cn("flex flex-col gap-5", className)}>
			{/* Hero / Summary */}
			<div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-5 shadow-sm">
				<div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_12%_20%,hsl(var(--primary)/0.08),transparent_35%),radial-gradient(circle_at_85%_15%,hsl(var(--success)/0.08),transparent_28%)]" />
				<div className="relative flex flex-wrap items-start gap-3">
					<div className="flex items-start gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Sparkles className="h-5 w-5" />
						</div>
						<div className="space-y-1">
							<div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Route AI
							</div>
							<div className="text-lg font-semibold leading-tight">
								Keep trucks on the shortest paths
							</div>
							<p className="text-muted-foreground text-sm">
								We look at your {dateLabel} schedule to cut windshield time and fuel burn.
							</p>
						</div>
					</div>
					<div className="ml-auto flex flex-wrap items-center gap-2">
						<Badge variant="secondary" className="bg-muted text-xs">
							{dateLabel}
						</Badge>
						{totalPotentialSavings > 0 && (
							<Button
								variant="default"
								size="sm"
								className="gap-1.5"
								onClick={() => {
									for (const [techId] of results) {
										handleApplyRoute(techId);
									}
								}}
								disabled={isPending}
							>
								Apply all
								<Check className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>

				<div className="relative mt-4 grid gap-3 sm:grid-cols-3">
					<div className="rounded-xl border bg-background/70 p-3 shadow-[0_10px_30px_-20px_hsl(var(--foreground)/0.1)] dark:shadow-[0_10px_30px_-20px_hsl(var(--foreground)/0.3)]">
						<div className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
							Ready to optimize
							<Route className="h-4 w-4 text-primary" />
						</div>
						<div className="mt-2 flex items-baseline gap-2">
							<div className="text-2xl font-semibold">
								{techsToOptimize.length}
							</div>
							<div className="text-muted-foreground text-sm">
								tech{techsToOptimize.length === 1 ? "" : "s"} with 2+ stops
							</div>
						</div>
					</div>
					<div className="rounded-xl border bg-background/70 p-3 shadow-[0_10px_30px_-20px_hsl(var(--foreground)/0.1)] dark:shadow-[0_10px_30px_-20px_hsl(var(--foreground)/0.3)]">
						<div className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
							Stops today
							<Truck className="h-4 w-4 text-primary" />
						</div>
						<div className="mt-2 flex items-baseline gap-2">
							<div className="text-2xl font-semibold">{totalJobsForDay}</div>
							<div className="text-muted-foreground text-sm">appointments</div>
						</div>
					</div>
					<div className="rounded-xl border bg-background/70 p-3 shadow-[0_10px_30px_-20px_hsl(var(--foreground)/0.1)] dark:shadow-[0_10px_30px_-20px_hsl(var(--foreground)/0.3)]">
						<div className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
							Potential savings
							<TrendingUp className="h-4 w-4 text-primary" />
						</div>
						<div className="mt-2 flex items-baseline gap-2">
							<div className="text-2xl font-semibold">
								{totalPotentialSavings > 0
									? formatDuration(totalPotentialSavings)
									: "Run analysis"}
							</div>
							<div className="text-muted-foreground text-sm">
								{results.size > 0
									? `Across ${results.size} tech${results.size === 1 ? "" : "s"}`
									: "Calculates drive + distance"}
							</div>
						</div>
					</div>
				</div>
			</div>

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
			<div className="relative overflow-hidden rounded-xl border border-dashed bg-muted/30 p-4 text-xs text-muted-foreground">
				<div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_10%_20%,hsl(var(--primary)/0.08),transparent_35%)]" />
				<div className="relative flex flex-col gap-2">
					<div className="flex items-start gap-2">
						<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
						<div>
							<p className="font-semibold text-foreground">How it works</p>
							<p className="mt-1">
								We calculate the most efficient stop order with Google Distance Matrix, respecting time windows and live drive times.
							</p>
						</div>
					</div>
					<div className="grid gap-2 sm:grid-cols-2">
						<div className="flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2">
							<Clock className="h-4 w-4 text-primary" />
							<span>Best when a tech has 2+ jobs and clear time windows</span>
						</div>
						<div className="flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2">
							<ArrowRight className="h-4 w-4 text-primary" />
							<span>Apply to reorder jobs on the board instantly</span>
						</div>
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
	technicians: TechnicianMapLike;
	jobsByTechnician: JobsByTechMapLike;
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

	const technicianMap = useMemo(
		() => normalizeTechnicians(technicians),
		[technicians],
	);
	const jobsByTechMap = useMemo(
		() => normalizeJobsByTech(jobsByTechnician),
		[jobsByTechnician],
	);

	const techsWithMultipleJobs = Array.from(technicianMap.values()).filter(
		(tech) => {
			const jobs = jobsByTechMap.get(tech.id) || [];
			return jobs.length >= 2;
		},
	).length;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			{trigger ? (
				<SheetTrigger asChild>{trigger}</SheetTrigger>
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<SheetTrigger asChild>
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
						</SheetTrigger>
					</TooltipTrigger>
					<TooltipContent>
						{techsWithMultipleJobs > 0
							? `Optimize routes for ${techsWithMultipleJobs} technician${techsWithMultipleJobs !== 1 ? "s" : ""}`
							: "Need technicians with 2+ jobs to optimize"}
					</TooltipContent>
				</Tooltip>
			)}
			<SheetContent className="w-full overflow-y-auto border-l bg-background/95 sm:max-w-2xl">
				<SheetHeader className="sr-only">
					<SheetTitle>Route Optimization</SheetTitle>
					<SheetDescription>
						Optimize technician routes to minimize travel time
					</SheetDescription>
				</SheetHeader>
				<div className="space-y-5 p-5">
					<RouteOptimizationPanel
						technicians={technicianMap}
						jobsByTechnician={jobsByTechMap}
						selectedDate={selectedDate}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default RouteOptimizationPanel;
