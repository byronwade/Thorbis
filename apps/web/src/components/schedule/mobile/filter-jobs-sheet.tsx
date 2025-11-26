"use client";

import { Check, Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";

/**
 * FilterJobsSheet - Mobile filter interface for jobs
 *
 * Features:
 * - Filter by status (scheduled, dispatched, in progress, etc.)
 * - Filter by technician
 * - Filter by date range
 * - Show unassigned jobs
 * - Apply/Clear filters
 * - Visual indicators for active filters
 */

type FilterJobsSheetProps = {
	isOpen: boolean;
	onClose: () => void;
	activeFilters: {
		statuses: string[];
		technicianIds: string[];
		showUnassignedOnly: boolean;
	};
	onApplyFilters: (filters: {
		statuses: string[];
		technicianIds: string[];
		showUnassignedOnly: boolean;
	}) => void;
};

const STATUS_OPTIONS = [
	{
		value: "scheduled",
		label: "Scheduled",
		color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	},
	{
		value: "dispatched",
		label: "Dispatched",
		color:
			"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
	},
	{
		value: "arrived",
		label: "Arrived",
		color:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
	},
	{
		value: "in_progress",
		label: "In Progress",
		color:
			"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
	},
	{
		value: "completed",
		label: "Completed",
		color:
			"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
	},
	{
		value: "cancelled",
		label: "Cancelled",
		color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
	},
];

export function FilterJobsSheet({
	isOpen,
	onClose,
	activeFilters,
	onApplyFilters,
}: FilterJobsSheetProps) {
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
		activeFilters.statuses,
	);
	const [selectedTechnicianIds, setSelectedTechnicianIds] = useState<string[]>(
		activeFilters.technicianIds,
	);
	const [showUnassignedOnly, setShowUnassignedOnly] = useState(
		activeFilters.showUnassignedOnly,
	);

	const techniciansMap = useScheduleStore((state) => state.technicians);
	const technicians = useMemo(
		() => Array.from(techniciansMap.values()),
		[techniciansMap],
	);

	const toggleStatus = (status: string) => {
		setSelectedStatuses((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status],
		);
	};

	const toggleTechnician = (techId: string) => {
		setSelectedTechnicianIds((prev) =>
			prev.includes(techId)
				? prev.filter((id) => id !== techId)
				: [...prev, techId],
		);
	};

	const handleApply = () => {
		onApplyFilters({
			statuses: selectedStatuses,
			technicianIds: selectedTechnicianIds,
			showUnassignedOnly,
		});
		onClose();
	};

	const handleClear = () => {
		setSelectedStatuses([]);
		setSelectedTechnicianIds([]);
		setShowUnassignedOnly(false);
	};

	const hasActiveFilters =
		selectedStatuses.length > 0 ||
		selectedTechnicianIds.length > 0 ||
		showUnassignedOnly;

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent
				side="right"
				className="w-[300px] sm:w-[400px] flex flex-col"
			>
				<SheetHeader>
					<SheetTitle className="flex items-center justify-between">
						<span>Filter Jobs</span>
						<Button
							className="h-8 w-8 p-0"
							onClick={onClose}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
					</SheetTitle>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto py-6 space-y-6">
					{/* Status Filters */}
					<div className="space-y-3">
						<Label className="text-sm font-semibold">Status</Label>
						<div className="space-y-2">
							{STATUS_OPTIONS.map((status) => (
								<button
									className={cn(
										"flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
										selectedStatuses.includes(status.value)
											? "border-primary bg-primary/5"
											: "border-border hover:bg-muted/50",
									)}
									key={status.value}
									onClick={() => toggleStatus(status.value)}
									type="button"
								>
									<Badge
										className={cn("text-xs", status.color)}
										variant="secondary"
									>
										{status.label}
									</Badge>
									{selectedStatuses.includes(status.value) && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</button>
							))}
						</div>
					</div>

					{/* Technician Filters */}
					<div className="space-y-3">
						<Label className="text-sm font-semibold">Technician</Label>
						<div className="space-y-2">
							{technicians.map((tech) => {
								const initials = tech.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()
									.slice(0, 2);

								return (
									<button
										className={cn(
											"flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
											selectedTechnicianIds.includes(tech.id)
												? "border-primary bg-primary/5"
												: "border-border hover:bg-muted/50",
										)}
										key={tech.id}
										onClick={() => toggleTechnician(tech.id)}
										type="button"
									>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage
													alt={tech.name}
													src={tech.avatar || undefined}
												/>
												<AvatarFallback className="text-xs">
													{initials}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm font-medium">{tech.name}</span>
										</div>
										{selectedTechnicianIds.includes(tech.id) && (
											<Check className="h-4 w-4 text-primary" />
										)}
									</button>
								);
							})}
						</div>
					</div>

					{/* Unassigned Filter */}
					<div className="space-y-3">
						<Label className="text-sm font-semibold">Special Filters</Label>
						<button
							className={cn(
								"flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
								showUnassignedOnly
									? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
									: "border-border hover:bg-muted/50",
							)}
							onClick={() => setShowUnassignedOnly(!showUnassignedOnly)}
							type="button"
						>
							<span className="text-sm font-medium">Show unassigned only</span>
							{showUnassignedOnly && (
								<Check className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
							)}
						</button>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="shrink-0 space-y-2 border-t pt-4">
					{hasActiveFilters && (
						<Button
							className="w-full"
							onClick={handleClear}
							size="sm"
							variant="outline"
						>
							Clear All Filters
						</Button>
					)}
					<Button className="w-full" onClick={handleApply} size="default">
						Apply Filters
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
