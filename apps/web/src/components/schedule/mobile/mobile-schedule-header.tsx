"use client";

import {
	BarChart3,
	Calendar,
	Filter,
	LayoutGrid,
	List,
	Plus,
	Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { Job } from "@/lib/stores/schedule-store";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { FilterJobsSheet } from "./filter-jobs-sheet";
import { SearchJobsSheet } from "./search-jobs-sheet";

/**
 * MobileScheduleHeader - Feature-rich mobile toolbar
 *
 * Features:
 * - View mode switcher (Day/Week/List)
 * - Quick stats (Total/Completed/In Progress/Unassigned)
 * - Search jobs
 * - Filter options
 * - Create new job
 */

type ViewMode = "day" | "week" | "list";

type MobileScheduleHeaderProps = {
	onJobSelect?: (job: Job) => void;
};

export function MobileScheduleHeader({
	onJobSelect,
}: MobileScheduleHeaderProps) {
	const router = useRouter();
	const { viewMode, setViewMode } = useScheduleViewStore();
	const jobsMap = useScheduleStore((state) => state.jobs);

	// Local state for sheets
	const [showSearch, setShowSearch] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [activeFilters, setActiveFilters] = useState<{
		statuses: string[];
		technicianIds: string[];
		showUnassignedOnly: boolean;
	}>({
		statuses: [],
		technicianIds: [],
		showUnassignedOnly: false,
	});

	// Calculate stats
	const stats = useMemo(() => {
		const jobs = Array.from(jobsMap.values());
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const todaysJobs = jobs.filter((job) => {
			const jobDate = new Date(job.startTime);
			jobDate.setHours(0, 0, 0, 0);
			return jobDate.getTime() === today.getTime();
		});

		return {
			total: todaysJobs.length,
			completed: todaysJobs.filter((j) => j.status === "completed").length,
			inProgress: todaysJobs.filter(
				(j) => j.status === "in_progress" || j.status === "in-progress",
			).length,
			unassigned: todaysJobs.filter((j) => j.isUnassigned).length,
		};
	}, [jobsMap]);

	const handleViewModeChange = (mode: ViewMode) => {
		setViewMode(mode);
	};

	const handleCreateJob = () => {
		router.push("/dashboard/work/jobs/new");
	};

	const handleJobSelect = (job: Job) => {
		if (onJobSelect) {
			onJobSelect(job);
		}
	};

	const handleApplyFilters = (filters: typeof activeFilters) => {
		setActiveFilters(filters);
		// TODO: Apply filters to job list
	};

	const activeFilterCount =
		activeFilters.statuses.length +
		activeFilters.technicianIds.length +
		(activeFilters.showUnassignedOnly ? 1 : 0);

	return (
		<div className="safe-top sticky top-0 z-35 border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
			{/* Top row: Actions */}
			<div className="flex items-center justify-between gap-2 px-4 py-2.5">
				{/* View mode switcher */}
				<div className="flex items-center gap-1.5 rounded-lg border p-1">
					<Button
						className="h-9 w-9 p-0"
						onClick={() => handleViewModeChange("day")}
						size="sm"
						variant={viewMode === "day" ? "secondary" : "ghost"}
					>
						<Calendar className="h-4 w-4" />
						<span className="sr-only">Day view</span>
					</Button>
					<Button
						className="h-9 w-9 p-0"
						onClick={() => handleViewModeChange("week")}
						size="sm"
						variant={viewMode === "week" ? "secondary" : "ghost"}
					>
						<LayoutGrid className="h-4 w-4" />
						<span className="sr-only">Week view</span>
					</Button>
					<Button
						className="h-9 w-9 p-0"
						onClick={() => handleViewModeChange("list")}
						size="sm"
						variant={viewMode === "list" ? "secondary" : "ghost"}
					>
						<List className="h-4 w-4" />
						<span className="sr-only">List view</span>
					</Button>
				</div>

				{/* Action buttons */}
				<div className="flex items-center gap-1.5">
					{/* Stats sheet */}
					<Sheet>
						<SheetTrigger asChild>
							<Button className="h-9 w-9 p-0" size="sm" variant="ghost">
								<BarChart3 className="h-4 w-4" />
								<span className="sr-only">View stats</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="bottom" className="h-[300px]">
							<SheetHeader>
								<SheetTitle>Today's Stats</SheetTitle>
							</SheetHeader>
							<div className="mt-6 grid grid-cols-2 gap-4">
								<div className="rounded-lg border p-4">
									<p className="text-2xl font-bold">{stats.total}</p>
									<p className="text-xs text-muted-foreground">Total Jobs</p>
								</div>
								<div className="rounded-lg border p-4">
									<p className="text-2xl font-bold text-green-600">
										{stats.completed}
									</p>
									<p className="text-xs text-muted-foreground">Completed</p>
								</div>
								<div className="rounded-lg border p-4">
									<p className="text-2xl font-bold text-orange-600">
										{stats.inProgress}
									</p>
									<p className="text-xs text-muted-foreground">In Progress</p>
								</div>
								<div className="rounded-lg border p-4">
									<p className="text-2xl font-bold text-yellow-600">
										{stats.unassigned}
									</p>
									<p className="text-xs text-muted-foreground">Unassigned</p>
								</div>
							</div>
						</SheetContent>
					</Sheet>

					{/* Search button */}
					<Button
						className="h-9 w-9 p-0"
						onClick={() => setShowSearch(true)}
						size="sm"
						variant="ghost"
					>
						<Search className="h-4 w-4" />
						<span className="sr-only">Search jobs</span>
					</Button>

					{/* Filter button */}
					<Button
						className="h-9 w-9 p-0 relative"
						onClick={() => setShowFilter(true)}
						size="sm"
						variant="ghost"
					>
						<Filter className="h-4 w-4" />
						{activeFilterCount > 0 && (
							<Badge
								className="absolute -top-1 -right-1 h-4 min-w-4 p-0 text-[0.6rem]"
								variant="destructive"
							>
								{activeFilterCount}
							</Badge>
						)}
						<span className="sr-only">Filter jobs</span>
					</Button>

					{/* Create job button */}
					<Button
						className="h-9 w-9 p-0"
						onClick={handleCreateJob}
						size="sm"
						variant="default"
					>
						<Plus className="h-4 w-4" />
						<span className="sr-only">Create job</span>
					</Button>
				</div>
			</div>

			{/* Bottom row: Quick stats pills */}
			<div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
				<div className="flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs whitespace-nowrap">
					<span className="font-semibold">{stats.total}</span>
					<span className="text-muted-foreground">Total</span>
				</div>
				{stats.completed > 0 && (
					<div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs whitespace-nowrap dark:border-green-900 dark:bg-green-950">
						<span className="font-semibold text-green-700 dark:text-green-300">
							{stats.completed}
						</span>
						<span className="text-green-600 dark:text-green-400">Done</span>
					</div>
				)}
				{stats.inProgress > 0 && (
					<div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs whitespace-nowrap dark:border-orange-900 dark:bg-orange-950">
						<span className="font-semibold text-orange-700 dark:text-orange-300">
							{stats.inProgress}
						</span>
						<span className="text-orange-600 dark:text-orange-400">Active</span>
					</div>
				)}
				{stats.unassigned > 0 && (
					<div className="flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs whitespace-nowrap dark:border-yellow-900 dark:bg-yellow-950">
						<span className="font-semibold text-yellow-700 dark:text-yellow-300">
							{stats.unassigned}
						</span>
						<span className="text-yellow-600 dark:text-yellow-400">
							Unassigned
						</span>
					</div>
				)}
			</div>

			{/* Search Sheet */}
			<SearchJobsSheet
				isOpen={showSearch}
				onClose={() => setShowSearch(false)}
				onJobSelect={handleJobSelect}
			/>

			{/* Filter Sheet */}
			<FilterJobsSheet
				activeFilters={activeFilters}
				isOpen={showFilter}
				onApplyFilters={handleApplyFilters}
				onClose={() => setShowFilter(false)}
			/>
		</div>
	);
}
