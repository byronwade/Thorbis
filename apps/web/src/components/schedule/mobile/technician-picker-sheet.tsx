"use client";

import { Check, Search, UserCircle, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Job, Technician } from "@/lib/stores/schedule-store";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";

/**
 * TechnicianPickerSheet - Technician selection for job assignment
 *
 * Features:
 * - Search technicians by name
 * - Shows current workload (jobs assigned)
 * - Visual feedback for selected technician
 * - Touch-friendly 56px+ buttons
 * - Unassign option to remove technician
 */

type TechnicianPickerSheetProps = {
	job: Job | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (job: Job, technicianId: string | null) => void;
};

export function TechnicianPickerSheet({
	job,
	isOpen,
	onClose,
	onConfirm,
}: TechnicianPickerSheetProps) {
	// Get Maps from store (stable references)
	const techniciansMap = useScheduleStore((state) => state.technicians);
	const jobsMap = useScheduleStore((state) => state.jobs);

	// Convert Maps to arrays once (memoized)
	const technicians = useMemo(
		() => Array.from(techniciansMap.values()),
		[techniciansMap],
	);
	const jobs = useMemo(() => Array.from(jobsMap.values()), [jobsMap]);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTechId, setSelectedTechId] = useState<string | null>(
		job?.assignedTechnicianId || null,
	);

	// Calculate workload for each technician
	const techniciansWithWorkload = useMemo(() => {
		return technicians.map((tech) => {
			const assignedJobs = jobs.filter(
				(j) => j.assignedTechnicianId === tech.id,
			);
			const activeJobs = assignedJobs.filter(
				(j) =>
					!["completed", "cancelled", "closed"].includes(
						j.status?.toLowerCase() || "",
					),
			);

			return {
				...tech,
				totalJobs: assignedJobs.length,
				activeJobs: activeJobs.length,
			};
		});
	}, [technicians, jobs]);

	// Filter technicians by search query
	const filteredTechnicians = useMemo(() => {
		if (!searchQuery.trim()) return techniciansWithWorkload;

		const query = searchQuery.toLowerCase();
		return techniciansWithWorkload.filter((tech) =>
			tech.name.toLowerCase().includes(query),
		);
	}, [techniciansWithWorkload, searchQuery]);

	// Sort: Current assignee first, then by active jobs (least busy first)
	const sortedTechnicians = useMemo(() => {
		return [...filteredTechnicians].sort((a, b) => {
			// Current assignee always first
			if (a.id === job?.assignedTechnicianId) return -1;
			if (b.id === job?.assignedTechnicianId) return 1;

			// Then sort by active jobs (least busy first)
			return a.activeJobs - b.activeJobs;
		});
	}, [filteredTechnicians, job]);

	const handleConfirm = () => {
		if (!job) return;
		onConfirm(job, selectedTechId);
		onClose();
	};

	if (!job) return null;

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 animate-in fade-in"
					onClick={onClose}
				/>
			)}

			{/* Bottom Sheet */}
			<div
				className={cn(
					"fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl",
					"transform transition-transform duration-300 ease-out",
					isOpen ? "translate-y-0" : "translate-y-full",
				)}
				style={{ maxHeight: "85vh" }}
			>
				{/* Drag Handle */}
				<div className="flex justify-center pt-3 pb-2">
					<div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
				</div>

				{/* Header */}
				<div className="flex items-start justify-between gap-3 px-4 pb-4 border-b">
					<div className="flex-1">
						<h2 className="text-lg font-semibold mb-1">Assign Technician</h2>
						<p className="text-sm text-muted-foreground">
							{job.customer?.name || "Unknown Customer"}
						</p>
						<p className="text-xs text-muted-foreground">{job.title}</p>
					</div>

					{/* Close button */}
					<Button
						className="h-9 w-9 shrink-0"
						onClick={onClose}
						size="icon"
						variant="ghost"
					>
						<X className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</Button>
				</div>

				{/* Search */}
				<div className="px-4 pt-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-11 pl-10 text-base"
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search technicians..."
							type="search"
							value={searchQuery}
						/>
					</div>
				</div>

				{/* Unassign Option */}
				{job.assignedTechnicianId && (
					<div className="px-4 pt-3">
						<button
							className={cn(
								"flex w-full items-center gap-3 rounded-lg border-2 p-3 transition-all hover:border-orange-500/50 active:scale-98",
								selectedTechId === null
									? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
									: "border-border",
							)}
							onClick={() => setSelectedTechId(null)}
							type="button"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
								<UserCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
							</div>

							<div className="flex-1 text-left">
								<p className="text-base font-semibold">Unassign Technician</p>
								<p className="text-xs text-muted-foreground">
									Remove technician from this job
								</p>
							</div>

							{selectedTechId === null && (
								<Check className="h-5 w-5 text-orange-600 shrink-0" />
							)}
						</button>
					</div>
				)}

				{/* Technician List */}
				<ScrollArea
					className="flex-1"
					style={{ maxHeight: "calc(85vh - 280px)" }}
				>
					<div className="p-4 space-y-2">
						{sortedTechnicians.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<UserCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
								<p className="text-sm font-medium mb-1">No technicians found</p>
								<p className="text-xs text-muted-foreground">
									Try a different search term
								</p>
							</div>
						) : (
							sortedTechnicians.map((tech) => {
								const isSelected = selectedTechId === tech.id;
								const isCurrentAssignee = job.assignedTechnicianId === tech.id;

								return (
									<button
										className={cn(
											"flex w-full items-center gap-3 rounded-lg border-2 p-3 transition-all hover:border-primary/50 active:scale-98",
											isSelected
												? "border-primary bg-primary/5"
												: "border-border",
										)}
										key={tech.id}
										onClick={() => setSelectedTechId(tech.id)}
										type="button"
									>
										<Avatar className="h-12 w-12">
											<AvatarFallback className="text-sm font-medium">
												{tech.name
													.split(" ")
													.map((n) => n[0])
													.join("")
													.toUpperCase()
													.slice(0, 2)}
											</AvatarFallback>
										</Avatar>

										<div className="flex-1 text-left">
											<div className="flex items-center gap-2 mb-1">
												<p className="text-base font-semibold">{tech.name}</p>
												{isCurrentAssignee && (
													<Badge
														className="h-5 px-2 text-[9px]"
														variant="secondary"
													>
														Current
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-3 text-xs text-muted-foreground">
												<span>{tech.activeJobs} active</span>
												<span>•</span>
												<span>{tech.totalJobs} total</span>
											</div>
										</div>

										{/* Workload indicator */}
										<div className="flex items-center gap-2 shrink-0">
											<div className="flex flex-col items-end">
												<div
													className={cn(
														"h-2 w-16 rounded-full bg-muted overflow-hidden",
													)}
												>
													<div
														className={cn(
															"h-full transition-all",
															tech.activeJobs === 0 && "bg-green-500",
															tech.activeJobs > 0 &&
																tech.activeJobs <= 3 &&
																"bg-blue-500",
															tech.activeJobs > 3 &&
																tech.activeJobs <= 6 &&
																"bg-yellow-500",
															tech.activeJobs > 6 && "bg-red-500",
														)}
														style={{
															width: `${Math.min((tech.activeJobs / 10) * 100, 100)}%`,
														}}
													/>
												</div>
											</div>

											{isSelected && <Check className="h-5 w-5 text-primary" />}
										</div>
									</button>
								);
							})
						)}
					</div>
				</ScrollArea>

				{/* Actions */}
				<div className="border-t bg-muted/30 p-4 safe-bottom">
					<div className="flex gap-2">
						<Button
							className="flex-1 h-12"
							onClick={onClose}
							size="lg"
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							className="flex-1 h-12"
							disabled={selectedTechId === job.assignedTechnicianId}
							onClick={handleConfirm}
							size="lg"
							variant="default"
						>
							{selectedTechId === null ? "Unassign" : "Assign Technician"}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
