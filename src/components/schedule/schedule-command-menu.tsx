"use client";

import { format } from "date-fns";
import { ArrowRight, Briefcase, Clock, MapPin, Plus, Search, Sparkles, User } from "lucide-react";
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
import type { Job } from "./schedule-types";

type ScheduleCommandMenuProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedDate: Date | null;
	unassignedJobs?: Job[];
};

export function ScheduleCommandMenu({ isOpen, onClose, selectedDate, unassignedJobs = [] }: ScheduleCommandMenuProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	const handleCreateNew = useCallback(() => {
		if (selectedDate) {
			const params = new URLSearchParams({
				date: format(selectedDate, "yyyy-MM-dd"),
				startTime: "09:00",
			});
			router.push(`/dashboard/work/new?${params.toString()}`);
		} else {
			router.push("/dashboard/work/new");
		}
		onClose();
	}, [selectedDate, router, onClose]);

	const handleSelectUnassigned = useCallback(
		(job: Job) => {
			// Navigate to job details to schedule it
			if (job.jobId) {
				router.push(`/dashboard/work/${job.jobId}`);
			}
			onClose();
		},
		[router, onClose]
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

	return (
		<CommandDialog onOpenChange={onClose} open={isOpen}>
			<CommandInput
				onValueChange={setSearchQuery}
				placeholder="Search jobs or create new appointment..."
				value={searchQuery}
			/>
			<CommandList>
				<CommandEmpty>
					<div className="flex flex-col items-center justify-center py-6 text-center">
						<Search className="mb-2 size-8 text-muted-foreground/50" />
						<p className="mb-1 font-medium text-sm">No jobs found</p>
						<p className="text-muted-foreground text-xs">Try a different search or create a new job</p>
					</div>
				</CommandEmpty>

				{/* Create New */}
				<CommandGroup heading="Quick Actions">
					<CommandItem className="group" onSelect={handleCreateNew}>
						<div className="mr-3 flex size-8 items-center justify-center rounded-md bg-primary/10 group-aria-selected:bg-primary/20">
							<Plus className="size-4 text-primary" />
						</div>
						<div className="flex flex-1 flex-col">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-sm">Create New Job</span>
								{selectedDate && (
									<Badge className="font-medium" variant="secondary">
										{format(selectedDate, "MMM d, yyyy")}
									</Badge>
								)}
							</div>
							<span className="text-muted-foreground text-xs">Start a new job or appointment</span>
						</div>
						<ArrowRight className="ml-2 size-4 text-muted-foreground opacity-0 transition-opacity group-aria-selected:opacity-100" />
					</CommandItem>
				</CommandGroup>

				{/* Unassigned Jobs */}
				{filteredJobs.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup heading={`Unscheduled Jobs · ${filteredJobs.length} total`}>
							{filteredJobs.slice(0, 10).map((job) => {
								const startTime = job.startTime instanceof Date ? job.startTime : new Date(job.startTime);

								return (
									<CommandItem className="group" key={job.id} onSelect={() => handleSelectUnassigned(job)}>
										<div className="mr-3 flex size-8 items-center justify-center rounded-md bg-orange-500/10 group-aria-selected:bg-orange-500/20">
											<Briefcase className="size-4 text-orange-600 dark:text-orange-500" />
										</div>
										<div className="flex flex-1 flex-col gap-1.5">
											<div className="flex items-center gap-2">
												<span className="font-semibold text-sm">{job.title}</span>
												{job.customer?.name && (
													<span className="text-muted-foreground text-xs">{job.customer.name}</span>
												)}
											</div>
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
												{job.startTime && (
													<div className="flex items-center gap-1 text-muted-foreground text-xs">
														<Clock className="size-3" />
														<span>{format(startTime, "MMM d, h:mm a")}</span>
													</div>
												)}
												{job.assignments.length > 0 && (
													<div className="flex items-center gap-1 text-muted-foreground text-xs">
														<User className="size-3" />
														<span>
															{job.assignments.length} team member
															{job.assignments.length !== 1 ? "s" : ""}
														</span>
													</div>
												)}
												{job.location?.address?.street && (
													<div className="flex items-center gap-1 text-muted-foreground text-xs">
														<MapPin className="size-3" />
														<span className="max-w-[200px] truncate">{job.location.address.street}</span>
													</div>
												)}
											</div>
										</div>
										<ArrowRight className="ml-2 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-aria-selected:opacity-100" />
									</CommandItem>
								);
							})}
							{filteredJobs.length > 10 && (
								<CommandItem disabled>
									<div className="mr-3 flex size-8 items-center justify-center">
										<Sparkles className="size-4 text-muted-foreground/50" />
									</div>
									<span className="text-muted-foreground text-sm">+{filteredJobs.length - 10} more jobs available</span>
								</CommandItem>
							)}
						</CommandGroup>
					</>
				)}
			</CommandList>
		</CommandDialog>
	);
}
