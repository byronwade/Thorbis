"use client";

import { useCallback, useMemo, useState } from "react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import type { Job } from "@/lib/stores/schedule-store";
import { EmptyStateMobile } from "./empty-state-mobile";
import { JobActionsBottomSheet } from "./job-actions-bottom-sheet";
import { JobCardMobile } from "./job-card-mobile";
import type { ActiveFilters, FilterOption } from "./schedule-filters-mobile";
import { ScheduleFiltersMobile } from "./schedule-filters-mobile";

/**
 * ListViewMobile - Primary mobile schedule view
 *
 * Features:
 * - Vertical scrolling list of all jobs
 * - Search bar at top (full-text search)
 * - Filter chips (status, technician)
 * - Group by: Date, Technician, Status, Customer
 * - Sort by: Start Time, Priority, Customer
 * - Tap job card → bottom sheet with actions
 * - Pull to refresh (future)
 * - Floating Action Button (FAB) for new appointments
 * - Infinite scroll with lazy loading (future)
 *
 * This is the DEFAULT mobile view as it provides the best
 * mobile experience with vertical scrolling and easy filtering.
 */

type GroupByOption = "date" | "technician" | "status" | "customer";
type SortByOption = "start_time" | "priority" | "customer" | "status";

export function ListViewMobile() {
	// Get Maps from store (stable references)
	const jobsMap = useScheduleStore((state) => state.jobs);
	const techniciansMap = useScheduleStore((state) => state.technicians);

	// Convert Maps to arrays once (memoized)
	const jobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);
	const technicians = useMemo(() => Array.from(techniciansMap.values()), [techniciansMap]);

	// Local state
	const [searchQuery, setSearchQuery] = useState("");
	const [groupBy, setGroupBy] = useState<GroupByOption>("date");
	const [sortBy, setSortBy] = useState<SortByOption>("start_time");
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
		statuses: [],
		technicians: [],
	});

	// Filter options
	const statusOptions: FilterOption[] = useMemo(() => {
		const statusCounts = jobs.reduce((acc, job) => {
			const status = job.status || "unscheduled";
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return [
			{ id: "scheduled", label: "Scheduled", count: statusCounts.scheduled || 0 },
			{ id: "dispatched", label: "Dispatched", count: statusCounts.dispatched || 0 },
			{ id: "arrived", label: "Arrived", count: statusCounts.arrived || 0 },
			{ id: "in_progress", label: "In Progress", count: statusCounts.in_progress || 0 },
			{ id: "completed", label: "Completed", count: statusCounts.completed || 0 },
		];
	}, [jobs]);

	const technicianOptions: FilterOption[] = useMemo(() => {
		return technicians.map((tech) => {
			const jobCount = jobs.filter((job) => job.assignedTechnicianId === tech.id).length;
			return {
				id: tech.id,
				label: tech.name,
				count: jobCount,
			};
		});
	}, [technicians, jobs]);

	// Filter jobs based on search and filters
	const filteredJobs = useMemo(() => {
		let filtered = [...jobs];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(job) =>
					job.customer?.name.toLowerCase().includes(query) ||
					job.title?.toLowerCase().includes(query) ||
					job.property?.address?.toLowerCase().includes(query) ||
					job.description?.toLowerCase().includes(query)
			);
		}

		// Status filter
		if (activeFilters.statuses.length > 0) {
			filtered = filtered.filter((job) =>
				activeFilters.statuses.includes(job.status?.toLowerCase() || "unscheduled")
			);
		}

		// Technician filter
		if (activeFilters.technicians.length > 0) {
			filtered = filtered.filter((job) =>
				job.assignedTechnicianId
					? activeFilters.technicians.includes(job.assignedTechnicianId)
					: false
			);
		}

		return filtered;
	}, [jobs, searchQuery, activeFilters]);

	// Sort jobs
	const sortedJobs = useMemo(() => {
		const sorted = [...filteredJobs];

		switch (sortBy) {
			case "start_time":
				sorted.sort((a, b) => {
					if (!a.scheduled_start) return 1;
					if (!b.scheduled_start) return -1;
					return (
						new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
					);
				});
				break;
			case "customer":
				sorted.sort((a, b) => {
					const nameA = a.customer?.name || "";
					const nameB = b.customer?.name || "";
					return nameA.localeCompare(nameB);
				});
				break;
			case "status":
				sorted.sort((a, b) => {
					const statusA = a.status || "unscheduled";
					const statusB = b.status || "unscheduled";
					return statusA.localeCompare(statusB);
				});
				break;
			default:
				break;
		}

		return sorted;
	}, [filteredJobs, sortBy]);

	// Group jobs
	const groupedJobs = useMemo(() => {
		const groups: Record<string, Job[]> = {};

		sortedJobs.forEach((job) => {
			let groupKey = "";

			switch (groupBy) {
				case "date": {
					if (!job.scheduled_start) {
						groupKey = "Unscheduled";
					} else {
						// Handle both ISO string and Date object
						const date = typeof job.scheduled_start === 'string'
							? parseISO(job.scheduled_start)
							: new Date(job.scheduled_start);

						if (isToday(date)) {
							groupKey = "Today";
						} else if (isTomorrow(date)) {
							groupKey = "Tomorrow";
						} else {
							groupKey = format(date, "EEEE, MMM d");
						}
					}
					break;
				}
				case "technician":
					groupKey = job.assignedTechnician?.name || "Unassigned";
					break;
				case "status":
					groupKey = job.status || "Unscheduled";
					break;
				case "customer":
					groupKey = job.customer?.name || "No Customer";
					break;
				default:
					groupKey = "All Jobs";
			}

			if (!groups[groupKey]) {
				groups[groupKey] = [];
			}
			groups[groupKey].push(job);
		});

		return groups;
	}, [sortedJobs, groupBy]);

	// Filter handlers
	const handleToggleStatus = useCallback((statusId: string) => {
		setActiveFilters((prev) => ({
			...prev,
			statuses: prev.statuses.includes(statusId)
				? prev.statuses.filter((s) => s !== statusId)
				: [...prev.statuses, statusId],
		}));
	}, []);

	const handleToggleTechnician = useCallback((techId: string) => {
		setActiveFilters((prev) => ({
			...prev,
			technicians: prev.technicians.includes(techId)
				? prev.technicians.filter((t) => t !== techId)
				: [...prev.technicians, techId],
		}));
	}, []);

	const handleClearFilters = useCallback(() => {
		setActiveFilters({ statuses: [], technicians: [] });
		setSearchQuery("");
	}, []);

	// Job action handler
	const handleJobAction = useCallback((action: string, job: Job) => {
		console.log("Job action:", action, job);
		// TODO: Implement actual actions (dispatch, reschedule, etc.)
		setSelectedJob(null);
	}, []);

	// Empty state
	if (filteredJobs.length === 0 && !searchQuery && activeFilters.statuses.length === 0) {
		return (
			<div className="flex h-full flex-col">
				<EmptyStateMobile
					onAction={() => {
						/* TODO: Open create job form */
					}}
					variant="no_jobs"
				/>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header: Search */}
			<div className="shrink-0 space-y-3 border-b bg-background p-4">
				{/* Search input */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="h-11 pl-10 text-base"
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search jobs, customers, or locations..."
						type="search"
						value={searchQuery}
					/>
				</div>

				{/* Filters */}
				<ScheduleFiltersMobile
					activeFilters={activeFilters}
					onClearAll={handleClearFilters}
					onToggleStatus={handleToggleStatus}
					onToggleTechnician={handleToggleTechnician}
					statusOptions={statusOptions}
					technicianOptions={technicianOptions}
				/>

				{/* Group by / Sort by controls */}
				<div className="flex gap-2">
					<Select onValueChange={(value) => setGroupBy(value as GroupByOption)} value={groupBy}>
						<SelectTrigger className="h-9 w-[140px] text-sm">
							<SelectValue placeholder="Group by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="date">Group by Date</SelectItem>
							<SelectItem value="technician">Group by Tech</SelectItem>
							<SelectItem value="status">Group by Status</SelectItem>
							<SelectItem value="customer">Group by Customer</SelectItem>
						</SelectContent>
					</Select>

					<Select onValueChange={(value) => setSortBy(value as SortByOption)} value={sortBy}>
						<SelectTrigger className="h-9 w-[140px] text-sm">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="start_time">Sort by Time</SelectItem>
							<SelectItem value="customer">Sort by Customer</SelectItem>
							<SelectItem value="status">Sort by Status</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Scrollable job list */}
			<div className="flex-1 overflow-y-auto">
				{filteredJobs.length === 0 ? (
					<EmptyStateMobile
						actionLabel="Clear Filters"
						onAction={handleClearFilters}
						variant="no_results"
					/>
				) : (
					<div className="space-y-6 p-4">
						{Object.entries(groupedJobs).map(([groupName, groupJobs]) => (
							<div key={groupName}>
								{/* Section header */}
								<div className="mb-3 flex items-center justify-between">
									<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
										{groupName}
									</h3>
									<span className="text-xs text-muted-foreground">
										{groupJobs.length} {groupJobs.length === 1 ? "job" : "jobs"}
									</span>
								</div>

								{/* Job cards */}
								<div className="space-y-2">
									{groupJobs.map((job) => (
										<JobCardMobile
											job={job}
											key={job.id}
											onClick={() => setSelectedJob(job)}
											showDate={groupBy !== "date"}
											showTechnician={groupBy !== "technician"}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Floating Action Button (FAB) - Create new job */}
			<Button
				className="fixed right-4 bottom-20 lg:bottom-4 h-14 w-14 rounded-full shadow-lg"
				onClick={() => {
					/* TODO: Open create job form */
				}}
				size="icon"
			>
				<Plus className="h-6 w-6" />
				<span className="sr-only">Create new job</span>
			</Button>

			{/* Job Actions Bottom Sheet */}
			<JobActionsBottomSheet
				isOpen={selectedJob !== null}
				job={selectedJob}
				onAction={handleJobAction}
				onClose={() => setSelectedJob(null)}
			/>
		</div>
	);
}
