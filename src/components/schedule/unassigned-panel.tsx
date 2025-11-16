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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
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
				"group relative cursor-grab rounded-lg border-2 border-red-200 border-dashed bg-card p-3 shadow-sm transition-all hover:border-red-300 hover:shadow-md active:cursor-grabbing dark:border-red-900/50",
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
					<p className="font-semibold text-foreground text-sm">{job.title}</p>
					{job.customer?.name && (
						<p className="text-muted-foreground text-xs">{job.customer.name}</p>
					)}
				</div>

				{/* Time */}
				<div className="flex items-center gap-4 text-xs">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Clock className="size-3.5" />
						<span className="font-medium font-mono">
							{format(startTime, "h:mm a")}
						</span>
					</div>
					<Badge className="text-[10px]" variant="secondary">
						{duration} min
					</Badge>
				</div>

				{/* Location */}
				{job.location?.address?.street && (
					<div className="flex items-start gap-1.5 text-muted-foreground text-xs">
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
}: {
	unassignedJobs: Job[];
	isOpen: boolean;
	onToggle: () => void;
	dropId?: string;
	activeJobId: string | null;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: dropId,
	});

	const jobs = Array.isArray(unassignedJobs) ? unassignedJobs : [];
	const activeJob = jobs.find((job) => job.id === activeJobId);

	return (
		<>
			<Collapsible className="h-full" onOpenChange={onToggle} open={isOpen}>
				<div
					className={cn(
						"flex h-full flex-col border-r bg-card transition-colors duration-200",
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
									className="h-auto w-full shrink-0 justify-between px-4 py-3 hover:bg-muted"
									variant="ghost"
								>
									<div className="flex items-center gap-2">
										<AlertCircle className="size-4 text-red-500" />
										<span className="font-semibold text-sm">Unscheduled</span>
										<Badge
											className="bg-red-100 px-2 py-0.5 font-semibold text-red-700 text-xs dark:bg-red-950/50 dark:text-red-400"
											variant="secondary"
										>
											{jobs.length}
										</Badge>
									</div>
									<ChevronLeft className="size-4 transition-transform" />
								</Button>
							</CollapsibleTrigger>

							<div
								className="flex-1 overflow-y-auto overflow-x-hidden"
								style={{ minHeight: 0 }}
							>
								<div className="space-y-2 p-3">
									{jobs.length === 0 ? (
										<div className="rounded-lg border border-dashed p-6 text-center">
											<p className="text-muted-foreground text-xs">
												All jobs scheduled
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
						</>
					) : (
						// Collapsed: Vertical text in sliver
						<button
							className="flex h-full w-12 items-center justify-center bg-red-50 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
							onClick={onToggle}
						>
							<div className="flex rotate-180 items-center gap-3 [writing-mode:vertical-rl]">
								<span className="font-bold text-red-700 text-sm tracking-wider dark:text-red-400">
									UNSCHEDULED
								</span>
								<Badge
									className="bg-red-600 px-2.5 py-0.5 font-semibold text-white text-xs dark:bg-red-700"
									variant="secondary"
								>
									{jobs.length}
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
