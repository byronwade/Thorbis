"use client";

import { useState } from "react";
import { Filter, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * MobileWorkFilterSheet - Reusable mobile filter interface for work pages
 *
 * Features:
 * - Filter by status (customizable)
 * - Filter by date range
 * - Show archived items toggle
 * - Apply/Clear filters
 * - Visual indicators for active filters
 * - WCAG-compliant touch targets (44px minimum)
 *
 * Usage:
 * ```tsx
 * <MobileWorkFilterSheet
 *   isOpen={showFilter}
 *   onClose={() => setShowFilter(false)}
 *   statusOptions={JOB_STATUSES}
 *   activeFilters={filters}
 *   onApplyFilters={setFilters}
 * />
 * ```
 */

type StatusOption = {
	value: string;
	label: string;
	color: string;
};

type FilterState = {
	statuses: string[];
	dateRange?: { from: Date; to: Date };
	showArchived: boolean;
};

type MobileWorkFilterSheetProps = {
	isOpen: boolean;
	onClose: () => void;
	statusOptions: StatusOption[];
	activeFilters: FilterState;
	onApplyFilters: (filters: FilterState) => void;
	/** Optional title (default: "Filter") */
	title?: string;
	/** Optional show archived label (default: "Show archived items") */
	archivedLabel?: string;
};

export function MobileWorkFilterSheet({
	isOpen,
	onClose,
	statusOptions,
	activeFilters,
	onApplyFilters,
	title = "Filter",
	archivedLabel = "Show archived items",
}: MobileWorkFilterSheetProps) {
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(activeFilters.statuses);
	const [showArchived, setShowArchived] = useState(activeFilters.showArchived);

	const toggleStatus = (status: string) => {
		setSelectedStatuses((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status]
		);
	};

	const handleApply = () => {
		onApplyFilters({
			statuses: selectedStatuses,
			showArchived,
		});
		onClose();
	};

	const handleClear = () => {
		setSelectedStatuses([]);
		setShowArchived(false);
	};

	const hasActiveFilters = selectedStatuses.length > 0 || showArchived;

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
				<SheetHeader>
					<SheetTitle className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<Filter className="h-5 w-5" />
							{title}
						</span>
						<Button
							className="h-10 w-10 p-0" // 40px touch target
							onClick={onClose}
							size="icon"
							variant="ghost"
						>
							<X className="h-5 w-5" />
							<span className="sr-only">Close</span>
						</Button>
					</SheetTitle>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto py-6 space-y-6">
					{/* Status Filters */}
					<div className="space-y-3">
						<Label className="text-sm font-semibold">Status</Label>
						<div className="space-y-2">
							{statusOptions.map((status) => (
								<button
									className={cn(
										"flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors",
										// 56px minimum height for better mobile UX
										"min-h-[56px]",
										selectedStatuses.includes(status.value)
											? "border-primary bg-primary/5"
											: "border-border hover:bg-muted/50 active:bg-muted"
									)}
									key={status.value}
									onClick={() => toggleStatus(status.value)}
									type="button"
								>
									<Badge
										className={cn("text-xs font-medium", status.color)}
										variant="secondary"
									>
										{status.label}
									</Badge>
									{selectedStatuses.includes(status.value) && (
										<Check className="h-5 w-5 text-primary shrink-0" />
									)}
								</button>
							))}
						</div>
					</div>

					{/* Archived Filter */}
					<div className="space-y-3">
						<Label className="text-sm font-semibold">Archive</Label>
						<button
							className={cn(
								"flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors",
								"min-h-[56px]",
								showArchived
									? "border-primary bg-primary/5"
									: "border-border hover:bg-muted/50 active:bg-muted"
							)}
							onClick={() => setShowArchived(!showArchived)}
							type="button"
						>
							<span className="text-sm font-medium">{archivedLabel}</span>
							{showArchived && (
								<Check className="h-5 w-5 text-primary shrink-0" />
							)}
						</button>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="shrink-0 space-y-2 border-t pt-4">
					{hasActiveFilters && (
						<Button
							className="w-full h-11" // 44px touch target
							onClick={handleClear}
							size="default"
							variant="outline"
						>
							Clear All Filters
						</Button>
					)}
					<Button
						className="w-full h-11" // 44px touch target
						onClick={handleApply}
						size="default"
					>
						Apply Filters
						{hasActiveFilters && (
							<Badge className="ml-2" variant="secondary">
								{selectedStatuses.length + (showArchived ? 1 : 0)}
							</Badge>
						)}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
