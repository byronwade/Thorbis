"use client";

import { format } from "date-fns";
import {
	ArrowRight,
	Briefcase,
	Calendar,
	Clock,
	MapPin,
	Plus,
	Search,
	Sparkles,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Job } from "./schedule-types";

type ScheduleCommandMenuProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedDate: Date | null;
	selectedTechnicianId?: string | null;
	selectedTechnicianName?: string;
	unassignedJobs?: Job[];
};

export function ScheduleCommandMenu({
	isOpen,
	onClose,
	selectedDate,
	selectedTechnicianId,
	selectedTechnicianName,
	unassignedJobs = [],
}: ScheduleCommandMenuProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	const handleCreateNew = useCallback(() => {
		const params = new URLSearchParams();

		if (selectedDate) {
			params.set("date", format(selectedDate, "yyyy-MM-dd"));
			params.set("startTime", format(selectedDate, "HH:mm"));
		}

		if (selectedTechnicianId) {
			params.set("assignTo", selectedTechnicianId);
		}

		const queryString = params.toString();
		router.push(`/dashboard/work/new${queryString ? `?${queryString}` : ""}`);
		onClose();
	}, [selectedDate, selectedTechnicianId, router, onClose]);

	const handleSelectUnassigned = useCallback(
		(job: Job) => {
			// Navigate to job details to schedule it
			if (job.jobId) {
				router.push(`/dashboard/work/${job.jobId}`);
			}
			onClose();
		},
		[router, onClose],
	);

	// Filter unassigned jobs by search query
	const filteredJobs = unassignedJobs.filter((job) => {
		if (!searchQuery) {
			return true;
		}
		const query = searchQuery.toLowerCase();
		return (
			job.title?.toLowerCase().includes(query) ||
			job.customer?.name?.toLowerCase().includes(query) ||
			job.location?.address?.street?.toLowerCase().includes(query)
		);
	});

	// Get priority indicator for jobs
	const getJobPriority = (job: Job) => {
		const title = job.title.toLowerCase();
		if (title.includes("emergency") || title.includes("urgent")) {
			return { label: "Urgent", color: "bg-red-500" };
		}
		if (title.includes("callback") || title.includes("follow")) {
			return { label: "Callback", color: "bg-orange-500" };
		}
		return null;
	};

	return (
		<CommandDialog onOpenChange={onClose} open={isOpen}>
			<div className="flex items-center border-b px-3">
				<Search className="text-muted-foreground mr-2 size-4 shrink-0" />
				<CommandInput
					onValueChange={setSearchQuery}
					placeholder="Search jobs, customers, or addresses..."
					value={searchQuery}
					className="border-0 focus:ring-0"
				/>
			</div>
			<CommandList className="max-h-[400px]">
				<CommandEmpty>
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="bg-muted mb-3 flex size-12 items-center justify-center rounded-full">
							<Search className="text-muted-foreground size-5" />
						</div>
						<p className="mb-1 text-sm font-medium">No matching jobs</p>
						<p className="text-muted-foreground mb-4 max-w-[200px] text-xs">
							Try a different search term or create a new job
						</p>
						<button
							onClick={handleCreateNew}
							className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors"
						>
							<Plus className="size-4" />
							Create New Job
						</button>
					</div>
				</CommandEmpty>

				{/* Create New */}
				<CommandGroup heading="Quick Actions">
					<CommandItem className="group py-3" onSelect={handleCreateNew}>
						<div className="bg-primary/10 group-aria-selected:bg-primary/20 mr-3 flex size-10 items-center justify-center rounded-lg transition-colors">
							<Plus className="text-primary size-5" />
						</div>
						<div className="flex flex-1 flex-col gap-1">
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-sm font-semibold">Create New Job</span>
								{selectedDate && (
									<Badge className="gap-1 font-medium" variant="secondary">
										<Calendar className="size-3" />
										{format(selectedDate, "MMM d")} at{" "}
										{format(selectedDate, "h:mm a")}
									</Badge>
								)}
								{selectedTechnicianName && (
									<Badge
										className="gap-1 font-medium"
										variant="outline"
									>
										<User className="size-3" />
										{selectedTechnicianName}
									</Badge>
								)}
							</div>
							<span className="text-muted-foreground text-xs">
								{selectedTechnicianName
									? `Schedule a new appointment for ${selectedTechnicianName}`
									: "Create a new job or service appointment"}
							</span>
						</div>
						<kbd className="bg-muted text-muted-foreground ml-2 hidden rounded px-1.5 py-0.5 font-mono text-[10px] group-aria-selected:inline">
							↵
						</kbd>
					</CommandItem>
				</CommandGroup>

				{/* Unassigned Jobs */}
				{filteredJobs.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup>
							<div className="flex items-center justify-between px-2 py-1.5">
								<span className="text-muted-foreground text-xs font-medium">
									Unscheduled Jobs
								</span>
								<Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
									{filteredJobs.length}
								</Badge>
							</div>
							{filteredJobs.slice(0, 10).map((job) => {
								const startTime =
									job.startTime instanceof Date
										? job.startTime
										: new Date(job.startTime);
								const priority = getJobPriority(job);

								return (
									<CommandItem
										className="group py-2.5"
										key={job.id}
										onSelect={() => handleSelectUnassigned(job)}
									>
										<div className="mr-3 flex size-10 items-center justify-center rounded-lg bg-orange-500/10 group-aria-selected:bg-orange-500/20 transition-colors">
											<Briefcase className="size-5 text-orange-600 dark:text-orange-500" />
										</div>
										<div className="flex flex-1 flex-col gap-1">
											<div className="flex items-center gap-2">
												<span className="text-sm font-semibold">
													{job.title}
												</span>
												{priority && (
													<span
														className={cn(
															"rounded px-1.5 py-0.5 text-[10px] font-medium text-white",
															priority.color
														)}
													>
														{priority.label}
													</span>
												)}
											</div>
											{job.customer?.name && (
												<span className="text-muted-foreground text-xs font-medium">
													{job.customer.name}
												</span>
											)}
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
												{job.startTime && (
													<div className="text-muted-foreground flex items-center gap-1 text-xs">
														<Clock className="size-3" />
														<span>{format(startTime, "MMM d, h:mm a")}</span>
													</div>
												)}
												{job.assignments.length > 0 && (
													<div className="text-muted-foreground flex items-center gap-1 text-xs">
														<User className="size-3" />
														<span>
															{job.assignments.length} assigned
														</span>
													</div>
												)}
												{job.location?.address?.street && (
													<div className="text-muted-foreground flex items-center gap-1 text-xs">
														<MapPin className="size-3" />
														<span className="max-w-[180px] truncate">
															{job.location.address.street}
														</span>
													</div>
												)}
											</div>
										</div>
										<ArrowRight className="text-muted-foreground ml-2 size-4 shrink-0 opacity-0 transition-opacity group-aria-selected:opacity-100" />
									</CommandItem>
								);
							})}
							{filteredJobs.length > 10 && (
								<div className="flex items-center gap-2 px-2 py-2">
									<Sparkles className="text-muted-foreground/50 size-4" />
									<span className="text-muted-foreground text-xs">
										+{filteredJobs.length - 10} more jobs available
									</span>
								</div>
							)}
						</CommandGroup>
					</>
				)}
			</CommandList>

			{/* Keyboard shortcuts footer */}
			<div className="border-t px-3 py-2">
				<div className="flex items-center justify-between">
					<div className="text-muted-foreground flex items-center gap-4 text-xs">
						<span className="flex items-center gap-1">
							<kbd className="bg-muted rounded px-1 font-mono text-[10px]">↑↓</kbd>
							navigate
						</span>
						<span className="flex items-center gap-1">
							<kbd className="bg-muted rounded px-1 font-mono text-[10px]">↵</kbd>
							select
						</span>
						<span className="flex items-center gap-1">
							<kbd className="bg-muted rounded px-1 font-mono text-[10px]">esc</kbd>
							close
						</span>
					</div>
					{filteredJobs.length > 0 && (
						<span className="text-muted-foreground text-[10px]">
							{filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""}
						</span>
					)}
				</div>
			</div>
		</CommandDialog>
	);
}
