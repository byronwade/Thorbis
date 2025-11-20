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
	ChevronLeft,
	ChevronRight,
	Clock,
	MapPin,
	Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Job } from "./schedule-types";

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
			{...(isDragOverlay ? {} : attributes)}
			{...(isDragOverlay ? {} : listeners)}
			className={cn(
				"group bg-card relative cursor-grab rounded-lg border-2 border-dashed border-red-200 p-3 shadow-sm transition-all hover:border-red-300 hover:shadow-md active:cursor-grabbing dark:border-red-900/50",
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
				{/* Title */}
				<div className="pr-6">
					<p className="text-foreground text-sm font-semibold">{job.title}</p>
					{job.customer?.name && (
						<p className="text-muted-foreground text-xs">{job.customer.name}</p>
					)}
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
						<span className="line-clamp-1">{job.location.address.street}</span>
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
}

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

	const jobs = Array.isArray(unassignedJobs) ? unassignedJobs : [];
	const activeJob = jobs.find((job) => job.id === activeJobId);
	const [searchValue, setSearchValue] = useState(searchQuery ?? "");
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
		const handler = setTimeout(() => {
			if (trimmedSearch === (lastSentSearch.current ?? "")) {
				return;
			}
			lastSentSearch.current = trimmedSearch;
			onSearchChange(trimmedSearch);
		}, 400);
		return () => clearTimeout(handler);
	}, [trimmedSearch, onSearchChange]);

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
								<div className="flex items-center gap-2">
									<div className="relative flex-1">
										<Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
										<Input
											className="pl-8 text-sm"
											placeholder="Search jobs..."
											value={searchValue}
											onChange={(event) => setSearchValue(event.target.value)}
										/>
									</div>
									<Badge variant="outline" className="text-[10px]">
										{totalCount !== undefined
											? `${jobs.length} / ${totalCount}`
											: jobs.length}
									</Badge>
								</div>
							</div>

							<div
								className="flex-1 overflow-x-hidden overflow-y-auto"
								style={{ minHeight: 0 }}
							>
								<div className="space-y-2 p-3">
									{jobs.length === 0 ? (
										<div className="rounded-lg border border-dashed p-6 text-center">
											<p className="text-muted-foreground text-xs">
												{trimmedSearch
													? "No jobs match this search"
													: "All jobs scheduled"}
											</p>
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
