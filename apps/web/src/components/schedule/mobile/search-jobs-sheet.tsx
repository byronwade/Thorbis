"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { Job } from "@/lib/stores/schedule-store";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { JobCardMobile } from "./job-card-mobile";

/**
 * SearchJobsSheet - Mobile search interface for jobs
 *
 * Features:
 * - Real-time search as you type
 * - Searches customer name, job title, location
 * - Shows matching jobs in scrollable list
 * - Tap job to view details
 * - Clear search button
 */

type SearchJobsSheetProps = {
	isOpen: boolean;
	onClose: () => void;
	onJobSelect: (job: Job) => void;
};

export function SearchJobsSheet({
	isOpen,
	onClose,
	onJobSelect,
}: SearchJobsSheetProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const jobsMap = useScheduleStore((state) => state.jobs);

	// Get all jobs as array
	const allJobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);

	// Filter jobs by search query
	const filteredJobs = useMemo(() => {
		if (!searchQuery.trim()) return [];

		const query = searchQuery.toLowerCase();

		return allJobs.filter((job) => {
			// Search customer name
			const customerName = job.customer?.name?.toLowerCase() || "";
			if (customerName.includes(query)) return true;

			// Search job title
			const jobTitle = job.title?.toLowerCase() || "";
			if (jobTitle.includes(query)) return true;

			// Search location
			const location = job.location?.address?.street?.toLowerCase() || "";
			if (location.includes(query)) return true;

			// Search job number
			const jobNumber = job.jobNumber?.toString().toLowerCase() || "";
			if (jobNumber.includes(query)) return true;

			return false;
		});
	}, [allJobs, searchQuery]);

	const handleJobClick = (job: Job) => {
		onJobSelect(job);
		onClose();
	};

	const handleClearSearch = () => {
		setSearchQuery("");
	};

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent side="top" className="h-[90vh] flex flex-col">
				<SheetHeader>
					<SheetTitle>Search Jobs</SheetTitle>
				</SheetHeader>

				{/* Search Input */}
				<div className="relative mt-4">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						autoFocus
						className="pl-9 pr-9"
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search by customer, job title, location..."
						type="search"
						value={searchQuery}
					/>
					{searchQuery && (
						<Button
							className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
							onClick={handleClearSearch}
							size="sm"
							variant="ghost"
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Clear search</span>
						</Button>
					)}
				</div>

				{/* Results */}
				<div className="flex-1 overflow-y-auto mt-4">
					{!searchQuery.trim() ? (
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<Search className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
								<p className="mt-4 text-sm text-muted-foreground">
									Start typing to search jobs
								</p>
							</div>
						</div>
					) : filteredJobs.length === 0 ? (
						<div className="flex h-full items-center justify-center">
							<div className="text-center">
								<Search className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
								<p className="mt-4 text-sm text-muted-foreground">
									No jobs found for &quot;{searchQuery}&quot;
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground mb-3">
								{filteredJobs.length}{" "}
								{filteredJobs.length === 1 ? "job" : "jobs"} found
							</p>
							{filteredJobs.map((job) => (
								<JobCardMobile
									job={job}
									key={job.id}
									onClick={() => handleJobClick(job)}
									showDate={true}
									showTechnician={true}
								/>
							))}
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
