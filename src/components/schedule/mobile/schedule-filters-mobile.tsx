"use client";

import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ScheduleFiltersMobile - Mobile filter chips component
 *
 * Provides horizontal scrolling filter chips for:
 * - Status filtering (scheduled, dispatched, completed, etc.)
 * - Technician filtering
 * - Date range filtering
 *
 * Design:
 * - Horizontal scrolling chip container
 * - Active filters highlighted with primary color
 * - Clear all button when filters active
 * - Touch-friendly 36px height chips
 *
 * Usage:
 * - List view: Primary filtering UI
 * - Day/Week/Month views: Quick filter options
 */

export type FilterOption = {
	id: string;
	label: string;
	count?: number; // Optional count badge (e.g., "Dispatched (5)")
};

export type ActiveFilters = {
	statuses: string[];
	technicians: string[];
	dateRange?: { start: Date; end: Date };
};

type ScheduleFiltersMobileProps = {
	statusOptions: FilterOption[];
	technicianOptions: FilterOption[];
	activeFilters: ActiveFilters;
	onToggleStatus: (statusId: string) => void;
	onToggleTechnician: (techId: string) => void;
	onClearAll: () => void;
	onOpenFilters?: () => void; // Opens full filter modal
	className?: string;
};

export function ScheduleFiltersMobile({
	statusOptions,
	technicianOptions,
	activeFilters,
	onToggleStatus,
	onToggleTechnician,
	onClearAll,
	onOpenFilters,
	className,
}: ScheduleFiltersMobileProps) {
	const hasActiveFilters =
		activeFilters.statuses.length > 0 ||
		activeFilters.technicians.length > 0 ||
		activeFilters.dateRange;

	const activeFilterCount =
		activeFilters.statuses.length +
		activeFilters.technicians.length +
		(activeFilters.dateRange ? 1 : 0);

	return (
		<div className={cn("flex items-center gap-2 overflow-x-auto pb-2", className)}>
			{/* Filter button (opens full filter modal) */}
			{onOpenFilters && (
				<Button
					className="h-9 shrink-0 gap-2"
					onClick={onOpenFilters}
					size="sm"
					variant="outline"
				>
					<Filter className="h-4 w-4" />
					<span>Filters</span>
					{activeFilterCount > 0 && (
						<Badge
							className="ml-1 h-5 min-w-5 px-1.5 text-xs"
							variant="secondary"
						>
							{activeFilterCount}
						</Badge>
					)}
				</Button>
			)}

			{/* Status filter chips */}
			{statusOptions.map((status) => {
				const isActive = activeFilters.statuses.includes(status.id);
				return (
					<Badge
						className={cn(
							"h-9 cursor-pointer shrink-0 gap-1.5 px-3 text-sm font-medium transition-all",
							isActive
								? "bg-primary text-primary-foreground hover:bg-primary/90"
								: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
						)}
						key={status.id}
						onClick={() => onToggleStatus(status.id)}
						variant="secondary"
					>
						<span>{status.label}</span>
						{status.count !== undefined && (
							<span
								className={cn(
									"rounded-full px-1.5 py-0.5 text-xs font-semibold",
									isActive
										? "bg-primary-foreground/20 text-primary-foreground"
										: "bg-muted text-muted-foreground"
								)}
							>
								{status.count}
							</span>
						)}
					</Badge>
				);
			})}

			{/* Technician filter chips */}
			{technicianOptions.length > 0 && (
				<>
					{/* Separator */}
					<div className="h-6 w-px bg-border shrink-0" />

					{technicianOptions.map((tech) => {
						const isActive = activeFilters.technicians.includes(tech.id);
						return (
							<Badge
								className={cn(
									"h-9 cursor-pointer shrink-0 gap-1.5 px-3 text-sm font-medium transition-all",
									isActive
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
								)}
								key={tech.id}
								onClick={() => onToggleTechnician(tech.id)}
								variant="secondary"
							>
								<span>{tech.label}</span>
								{tech.count !== undefined && (
									<span
										className={cn(
											"rounded-full px-1.5 py-0.5 text-xs font-semibold",
											isActive
												? "bg-primary-foreground/20 text-primary-foreground"
												: "bg-muted text-muted-foreground"
										)}
									>
										{tech.count}
									</span>
								)}
							</Badge>
						);
					})}
				</>
			)}

			{/* Clear all button (only show when filters active) */}
			{hasActiveFilters && (
				<Button
					className="h-9 shrink-0 gap-2"
					onClick={onClearAll}
					size="sm"
					variant="ghost"
				>
					<X className="h-4 w-4" />
					<span>Clear</span>
				</Button>
			)}
		</div>
	);
}
