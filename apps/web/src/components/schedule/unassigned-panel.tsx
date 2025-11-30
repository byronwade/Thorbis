"use client";

import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import {
	AlertCircle,
	Briefcase,
	Calendar,
	Check,
	ChevronLeft,
	ChevronRight,
	ClipboardCheck,
	Clock,
	HardHat,
	Loader2,
	MapPin,
	Phone,
	Search,
	Settings,
	Star,
	Users,
	Wrench,
	Zap,
} from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { AppointmentCategory, Job, JobType } from "./schedule-types";

// Job type visual configuration - consistent with timeline and kanban views
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

// Appointment category visual configuration
type AppointmentCategoryConfig = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	bgColor: string;
	textColor: string;
	borderStyle: string;
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

const UnassignedJobCard = memo(
	function UnassignedJobCard({
		job,
		isDragOverlay = false,
	}: {
		job: Job;
		isDragOverlay?: boolean;
	}) {
		const sortable = useSortable({
			id: job.id,
			data: { job },
		});

		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
		} = sortable;

		const style = isDragOverlay
			? undefined
			: {
					transform: CSS.Transform.toString(transform),
					transition,
				};

		const startTime =
			job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
		const endTime =
			job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
		const duration = Math.round(
			(endTime.getTime() - startTime.getTime()) / (1000 * 60),
		);

		return (
			<div
				ref={isDragOverlay ? undefined : setNodeRef}
				style={style}
				role="button"
				aria-label={`Unassigned job: ${job.title || "Untitled"}. Drag to schedule on timeline.`}
				tabIndex={isDragOverlay ? undefined : 0}
				{...(isDragOverlay ? {} : attributes)}
				{...(isDragOverlay ? {} : listeners)}
				className={cn(
					"group bg-card relative cursor-grab rounded-lg border-2 border-dashed border-red-200 p-3 shadow-sm transition-all hover:border-red-300 hover:shadow-md active:cursor-grabbing dark:border-red-900/50",
					"focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
					isDragging && !isDragOverlay && "opacity-30",
					isDragOverlay &&
						"scale-105 cursor-grabbing shadow-2xl ring-2 ring-red-500",
				)}
			>
				{/* Drag indicator */}
				<div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
					<div className="flex size-5 items-center justify-center rounded bg-red-500 text-white">
						<ChevronRight className="size-3" />
					</div>
				</div>

				<div className="space-y-2">
					{/* Appointment Category + Job Type + Title */}
					<div className="flex items-start gap-2 pr-6">
						<TooltipProvider>
							{/* Appointment Category Icon */}
							{(() => {
								const catConfig = getAppointmentCategoryConfig(job);
								const CatIcon = catConfig.icon;
								return (
									<Tooltip>
										<TooltipTrigger asChild>
											<div
												className={cn(
													"mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm",
													catConfig.bgColor,
												)}
											>
												<CatIcon
													className={cn("size-2.5", catConfig.textColor)}
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent side="top" className="text-xs">
											{catConfig.label}
										</TooltipContent>
									</Tooltip>
								);
							})()}
							{/* Job Type Icon */}
							{(() => {
								const typeConfig = getJobTypeConfig(job);
								const TypeIcon = typeConfig.icon;
								return (
									<Tooltip>
										<TooltipTrigger asChild>
											<div
												className={cn(
													"mt-0.5 flex size-5 shrink-0 items-center justify-center rounded",
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
								);
							})()}
						</TooltipProvider>
						<div className="min-w-0 flex-1">
							<p className="text-foreground text-sm font-semibold">
								{job.title}
							</p>
							{job.customer?.name && (
								<p className="text-muted-foreground text-xs">
									{job.customer.name}
								</p>
							)}
						</div>
					</div>

					{/* Time */}
					<div className="flex items-center gap-4 text-xs">
						<div className="text-muted-foreground flex items-center gap-1.5">
							<Clock className="size-3.5" />
							<span className="font-mono font-medium">
								{format(startTime, "h:mm a")}
							</span>
						</div>
						<Badge className="text-[10px]" variant="secondary">
							{duration} min
						</Badge>
					</div>

					{/* Location */}
					{job.location?.address?.street && (
						<div className="text-muted-foreground flex items-start gap-1.5 text-xs">
							<MapPin className="mt-0.5 size-3.5 shrink-0" />
							<span className="line-clamp-1">
								{job.location.address.street}
							</span>
						</div>
					)}

					{/* Priority indicator */}
					{job.priority === "urgent" && (
						<Badge className="text-[9px]" variant="destructive">
							URGENT
						</Badge>
					)}
				</div>
			</div>
		);
	},
	(prev, next) => {
		// Only re-render if job ID changes, isDragOverlay changes, or key job fields change
		return (
			prev.job.id === next.job.id &&
			prev.isDragOverlay === next.isDragOverlay &&
			prev.job.status === next.job.status &&
			prev.job.title === next.job.title
		);
	},
);

export function UnassignedPanel({
	unassignedJobs = [],
	isOpen,
	onToggle,
	dropId = "unassigned-dropzone",
	activeJobId,
	searchQuery = "",
	onSearchChange,
	onLoadMore,
	hasMore = false,
	isLoadingMore = false,
	totalCount,
}: {
	unassignedJobs: Job[];
	isOpen: boolean;
	onToggle: () => void;
	dropId?: string;
	activeJobId: string | null;
	searchQuery?: string;
	onSearchChange?: (value: string) => void;
	onLoadMore?: () => void;
	hasMore?: boolean;
	isLoadingMore?: boolean;
	totalCount?: number;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: dropId,
	});

	const rawJobs = Array.isArray(unassignedJobs) ? unassignedJobs : [];
	const activeJob = rawJobs.find((job) => job.id === activeJobId);
	const [searchValue, setSearchValue] = useState(searchQuery ?? "");
	const [isSearchPending, setIsSearchPending] = useState(false);
	const lastSentSearch = useRef(searchQuery ?? "");
	const trimmedSearch = searchValue.trim();

	useEffect(() => {
		lastSentSearch.current = searchQuery ?? "";
		setSearchValue(searchQuery ?? "");
	}, [searchQuery]);

	useEffect(() => {
		if (!onSearchChange) {
			return;
		}
		// Show pending indicator if search has changed
		const hasPendingSearch = trimmedSearch !== (lastSentSearch.current ?? "");
		setIsSearchPending(hasPendingSearch);

		const handler = setTimeout(() => {
			if (trimmedSearch === (lastSentSearch.current ?? "")) {
				return;
			}
			lastSentSearch.current = trimmedSearch;
			onSearchChange(trimmedSearch);
			setIsSearchPending(false);
		}, 400);
		return () => clearTimeout(handler);
	}, [trimmedSearch, onSearchChange]);

	// Sort jobs by time (urgent first, then by start time)
	const jobs = useMemo(() => {
		return [...rawJobs].sort((a, b) => {
			// Urgent jobs first
			if (a.priority === "urgent" && b.priority !== "urgent") return -1;
			if (b.priority === "urgent" && a.priority !== "urgent") return 1;
			// Then by start time
			return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
		});
	}, [rawJobs]);

	return (
		<>
			<Collapsible className="h-full" onOpenChange={onToggle} open={isOpen}>
				<div
					className={cn(
						"bg-card flex h-full flex-col border-r transition-colors duration-200",
						isOver &&
							"bg-red-50/80 ring-2 ring-red-500 ring-inset dark:bg-red-950/50",
					)}
					ref={setNodeRef}
				>
					{isOpen ? (
						// Expanded: Full panel with flex layout
						<>
							<CollapsibleTrigger asChild>
								<Button
									className="hover:bg-muted h-auto w-full shrink-0 justify-between px-4 py-3"
									variant="ghost"
								>
									<div className="flex items-center gap-2">
										<AlertCircle className="size-4 text-red-500" />
										<span className="text-sm font-semibold">Unscheduled</span>
										<Badge
											className="bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400"
											variant="secondary"
										>
											{totalCount ?? jobs.length}
										</Badge>
									</div>
									<ChevronLeft className="size-4 transition-transform" />
								</Button>
							</CollapsibleTrigger>

							<div className="border-b px-3 py-2">
								<div className="relative">
									{isSearchPending ? (
										<Loader2 className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2 animate-spin" />
									) : (
										<Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
									)}
									<Input
										className="pl-8 text-sm"
										placeholder="Search..."
										value={searchValue}
										onChange={(event) => setSearchValue(event.target.value)}
									/>
								</div>
							</div>

							<div
								className="flex-1 overflow-x-hidden overflow-y-auto"
								style={{ minHeight: 0 }}
							>
								<div className="space-y-2 p-3">
									{jobs.length === 0 ? (
										<div className="rounded-lg border border-dashed border-border/60 bg-gradient-to-b from-muted/30 to-transparent p-6 text-center">
											<div className="flex flex-col items-center gap-3">
												{/* Icon illustration */}
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 ring-1 ring-emerald-500/20">
													<Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
												</div>
												<div className="space-y-1">
													<p className="text-foreground/80 text-xs font-medium">
														{trimmedSearch
															? "No jobs match this search"
															: "All jobs scheduled!"}
													</p>
													<p className="text-muted-foreground text-[10px]">
														{trimmedSearch
															? "Try a different search term"
															: "Great work keeping on top of things"}
													</p>
												</div>
											</div>
										</div>
									) : (
										<SortableContext
											items={jobs.map((job) => job.id)}
											strategy={verticalListSortingStrategy}
										>
											{jobs.map((job) => (
												<UnassignedJobCard job={job} key={job.id} />
											))}
										</SortableContext>
									)}
								</div>
							</div>

							{(hasMore || isLoadingMore) && (
								<div className="border-t px-3 py-2">
									<Button
										className="w-full"
										disabled={isLoadingMore || !onLoadMore}
										onClick={onLoadMore}
										size="sm"
										variant="outline"
									>
										{isLoadingMore ? "Loading..." : "Load more"}
									</Button>
								</div>
							)}
						</>
					) : (
						// Collapsed: Vertical text in sliver
						<button
							className="flex h-full w-12 items-center justify-center bg-red-50 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
							onClick={onToggle}
						>
							<div className="flex rotate-180 items-center gap-3 [writing-mode:vertical-rl]">
								<span className="text-sm font-bold tracking-wider text-red-700 dark:text-red-400">
									UNSCHEDULED
								</span>
								<Badge
									className="bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-red-700"
									variant="secondary"
								>
									{totalCount ?? jobs.length}
								</Badge>
							</div>
						</button>
					)}
				</div>
			</Collapsible>

			{/* Drag Overlay - Ghost preview */}
			<DragOverlay dropAnimation={null}>
				{activeJob ? <UnassignedJobCard isDragOverlay job={activeJob} /> : null}
			</DragOverlay>
		</>
	);
}
