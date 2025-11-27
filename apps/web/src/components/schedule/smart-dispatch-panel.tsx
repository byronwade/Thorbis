"use client";

/**
 * Smart Dispatch Panel
 *
 * AI-powered technician recommendations for job assignment:
 * - Proximity scoring (nearest technician)
 * - Skill matching
 * - Workload balancing
 * - Real-time availability
 */

import {
	Award,
	Car,
	Check,
	ChevronRight,
	Clock,
	MapPin,
	Sparkles,
	Star,
	User,
	Users,
	Zap,
} from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { assignJobToTechnician } from "@/actions/schedule-assignments";
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
import { Separator } from "@/components/ui/separator";
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
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
import {
	getSmartDispatchRecommendations,
	type SmartDispatchRecommendation,
} from "@/lib/schedule/route-optimization";
import { cn } from "@/lib/utils";
import type { Job, Technician } from "./schedule-types";

// ============================================================================
// Types
// ============================================================================

type SmartDispatchPanelProps = {
	job: Job;
	onAssign?: (technicianId: string) => void;
	onClose?: () => void;
	className?: string;
};

type RecommendationCardProps = {
	recommendation: SmartDispatchRecommendation;
	isSelected: boolean;
	onSelect: () => void;
	onAssign: () => void;
	isAssigning: boolean;
};

// ============================================================================
// Helper Components
// ============================================================================

function ScoreIndicator({
	score,
	size = "default",
}: {
	score: number;
	size?: "sm" | "default";
}) {
	const color =
		score >= 80
			? "text-green-500 dark:text-green-400"
			: score >= 60
				? "text-amber-500 dark:text-amber-400"
				: "text-red-500 dark:text-red-400";

	const bgColor =
		score >= 80
			? "bg-green-500/10"
			: score >= 60
				? "bg-amber-500/10"
				: "bg-red-500/10";

	return (
		<div
			className={cn(
				"flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
				bgColor,
				color,
				size === "sm" ? "text-xs" : "text-sm",
			)}
		>
			<Sparkles className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
			{score}%
		</div>
	);
}

function RecommendationCard({
	recommendation,
	isSelected,
	onSelect,
	onAssign,
	isAssigning,
}: RecommendationCardProps) {
	const {
		technician,
		score,
		reasons,
		estimatedArrival,
		travelTime,
		currentWorkload,
		skillMatch,
		proximityScore,
	} = recommendation;

	const formatTravelTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const formatArrival = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
	};

	return (
		<Card
			className={cn(
				"cursor-pointer transition-all hover:border-primary/50",
				isSelected && "border-primary ring-1 ring-primary",
			)}
			onClick={onSelect}
		>
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					{/* Technician Info */}
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							{technician.avatar && <AvatarImage src={technician.avatar} />}
							<AvatarFallback>
								{technician.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center gap-2">
								<span className="font-medium">{technician.name}</span>
								<ScoreIndicator score={score} />
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Badge
									variant="outline"
									className={cn(
										"text-xs",
										technician.status === "available" &&
											"border-green-500 dark:border-green-400 text-green-600 dark:text-green-400",
										technician.status === "on-job" &&
											"border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400",
										technician.status === "on-break" &&
											"border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400",
									)}
								>
									{technician.status}
								</Badge>
								<span>{technician.role}</span>
							</div>
						</div>
					</div>

					{/* Assign Button */}
					<Button
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							onAssign();
						}}
						disabled={isAssigning}
					>
						{isAssigning ? (
							<>Assigning...</>
						) : (
							<>
								Assign
								<ChevronRight className="ml-1 h-4 w-4" />
							</>
						)}
					</Button>
				</div>

				{/* Stats Row */}
				<div className="mt-4 grid grid-cols-3 gap-4">
					<div className="flex items-center gap-2">
						<Car className="h-4 w-4 text-muted-foreground" />
						<div>
							<div className="text-sm font-medium">
								{formatTravelTime(travelTime)}
							</div>
							<div className="text-xs text-muted-foreground">Travel time</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<div>
							<div className="text-sm font-medium">
								{formatArrival(estimatedArrival)}
							</div>
							<div className="text-xs text-muted-foreground">ETA</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<div>
							<div className="text-sm font-medium">{currentWorkload} jobs</div>
							<div className="text-xs text-muted-foreground">Today</div>
						</div>
					</div>
				</div>

				{/* Score Breakdown */}
				{isSelected && (
					<div className="mt-4 space-y-3 border-t pt-4">
						<div className="text-sm font-medium">Score Breakdown</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span>Proximity</span>
								</div>
								<div className="flex items-center gap-2">
									<Progress value={proximityScore} className="w-20" />
									<span className="w-10 text-right text-muted-foreground">
										{proximityScore}%
									</span>
								</div>
							</div>

							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<Award className="h-4 w-4 text-muted-foreground" />
									<span>Skill Match</span>
								</div>
								<div className="flex items-center gap-2">
									<Progress value={skillMatch} className="w-20" />
									<span className="w-10 text-right text-muted-foreground">
										{skillMatch}%
									</span>
								</div>
							</div>
						</div>

						{/* Reasons */}
						{reasons.length > 0 && (
							<div className="flex flex-wrap gap-1 pt-2">
								{reasons.map((reason, index) => (
									<Badge key={index} variant="secondary" className="text-xs">
										<Check className="mr-1 h-3 w-3" />
										{reason}
									</Badge>
								))}
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// ============================================================================
// Main Component
// ============================================================================

export function SmartDispatchPanel({
	job,
	onAssign,
	onClose,
	className,
}: SmartDispatchPanelProps) {
	const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const { jobs, technicians } = useSchedule();

	// Get recommendations
	const recommendations = useMemo(() => {
		const techsArray = Array.from(technicians.values());
		const jobsByTech = new Map<string, Job[]>();

		// Group existing jobs by technician
		for (const existingJob of jobs.values()) {
			for (const assignment of existingJob.assignments) {
				if (assignment.technicianId) {
					const existing = jobsByTech.get(assignment.technicianId) || [];
					existing.push(existingJob);
					jobsByTech.set(assignment.technicianId, existing);
				}
			}
		}

		return getSmartDispatchRecommendations(job, techsArray, jobsByTech, {
			prioritizeProximity: job.priority === "urgent" || job.priority === "high",
			maxRecommendations: 5,
		});
	}, [job, technicians, jobs]);

	// Handle assignment
	const handleAssign = useCallback(
		(technicianId: string) => {
			startTransition(async () => {
				try {
					const result = await assignJobToTechnician(job.id, technicianId, {
						scheduledStart: job.startTime.toISOString(),
						scheduledEnd: job.endTime.toISOString(),
					});

					if (result.error) {
						toast.error("Failed to assign technician", {
							description: result.error,
						});
						return;
					}

					toast.success("Technician assigned", {
						description: `Job assigned to ${
							technicians.get(technicianId)?.name || "technician"
						}`,
					});

					onAssign?.(technicianId);
					onClose?.();
				} catch (error) {
					toast.error("Failed to assign technician");
				}
			});
		},
		[job, technicians, onAssign, onClose],
	);

	// Get best recommendation
	const bestRecommendation = recommendations[0];

	return (
		<div className={cn("flex flex-col", className)}>
			{/* Header */}
			<div className="space-y-2 pb-4">
				<div className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-primary" />
					<h3 className="text-lg font-semibold">Smart Dispatch</h3>
				</div>
				<p className="text-sm text-muted-foreground">
					AI-powered recommendations based on proximity, skills, and
					availability
				</p>
			</div>

			{/* Job Summary */}
			<Card className="mb-4">
				<CardContent className="p-4">
					<div className="flex items-start justify-between">
						<div>
							<h4 className="font-medium">{job.title}</h4>
							<p className="text-sm text-muted-foreground">
								{job.customer?.name}
							</p>
							<div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
								<MapPin className="h-4 w-4" />
								{job.location?.address?.street}, {job.location?.address?.city}
							</div>
						</div>
						<Badge
							variant={
								job.priority === "urgent"
									? "destructive"
									: job.priority === "high"
										? "default"
										: "secondary"
							}
						>
							{job.priority}
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Best Match Highlight */}
			{bestRecommendation && bestRecommendation.score >= 70 && (
				<div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
					<div className="flex items-center gap-2 text-sm font-medium text-primary">
						<Star className="h-4 w-4" />
						Best Match
					</div>
					<p className="mt-1 text-sm text-muted-foreground">
						<span className="font-medium text-foreground">
							{bestRecommendation.technician.name}
						</span>{" "}
						is the optimal choice with a{" "}
						<span className="font-medium text-foreground">
							{bestRecommendation.score}%
						</span>{" "}
						match score
					</p>
				</div>
			)}

			{/* Recommendations List */}
			<div className="space-y-3">
				<div className="flex items-center justify-between text-sm">
					<span className="font-medium">Recommended Technicians</span>
					<span className="text-muted-foreground">
						{recommendations.length} options
					</span>
				</div>

				{recommendations.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center p-8 text-center">
							<Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
							<p className="font-medium">No technicians available</p>
							<p className="text-sm text-muted-foreground">
								All technicians are either offline or fully booked
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-2">
						{recommendations.map((rec) => (
							<RecommendationCard
								key={rec.technicianId}
								recommendation={rec}
								isSelected={selectedTechId === rec.technicianId}
								onSelect={() => setSelectedTechId(rec.technicianId)}
								onAssign={() => handleAssign(rec.technicianId)}
								isAssigning={isPending}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// ============================================================================
// Sheet Wrapper
// ============================================================================

type SmartDispatchSheetProps = {
	job: Job | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAssign?: (technicianId: string) => void;
};

export function SmartDispatchSheet({
	job,
	open,
	onOpenChange,
	onAssign,
}: SmartDispatchSheetProps) {
	if (!job) return null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full overflow-y-auto sm:max-w-lg">
				<SheetHeader className="sr-only">
					<SheetTitle>Smart Dispatch</SheetTitle>
					<SheetDescription>
						AI-powered technician recommendations
					</SheetDescription>
				</SheetHeader>
				<SmartDispatchPanel
					job={job}
					onAssign={onAssign}
					onClose={() => onOpenChange(false)}
				/>
			</SheetContent>
		</Sheet>
	);
}

export default SmartDispatchPanel;
