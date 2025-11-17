"use client";

/**
 * Table Filters Component
 *
 * Reusable filter dropdowns for data tables
 * Supports multiple filter types: status, archive, custom filters
 */

import { Check, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterOption = {
	label: string;
	value: string;
	count?: number;
	color?: string;
};

export type FilterGroup = {
	label: string;
	options: FilterOption[];
};

type TableFiltersProps = {
	/** Filter groups to display */
	filters: FilterGroup[];
	/** Currently active filters { filterGroupLabel: selectedValue } */
	activeFilters: Record<string, string>;
	/** Callback when filter changes */
	onFilterChange: (filterGroup: string, value: string) => void;
	/** Show active filter count badge */
	showBadge?: boolean;
};

export function TableFilters({
	filters,
	activeFilters,
	onFilterChange,
	showBadge = true,
}: TableFiltersProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Count how many non-default filters are active
	const activeFilterCount = Object.entries(activeFilters).filter(([group, value]) => {
		const filterGroup = filters.find((f) => f.label === group);
		const firstOption = filterGroup?.options[0]?.value;
		return value !== firstOption && value !== "all";
	}).length;

	return (
		<DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
			<DropdownMenuTrigger asChild>
				<Button className="h-9 gap-2" size="sm" variant="outline">
					<Filter className="h-4 w-4" />
					<span>Filters</span>
					{showBadge && activeFilterCount > 0 && (
						<Badge className="ml-1 h-5 min-w-5 rounded-full px-1" variant="secondary">
							{activeFilterCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				{filters.map((filterGroup, groupIndex) => (
					<div key={filterGroup.label}>
						{groupIndex > 0 && <DropdownMenuSeparator />}
						<DropdownMenuLabel className="text-muted-foreground text-xs font-semibold uppercase">
							{filterGroup.label}
						</DropdownMenuLabel>
						{filterGroup.options.map((option) => {
							const isActive = activeFilters[filterGroup.label] === option.value;
							return (
								<DropdownMenuItem
									className="flex cursor-pointer items-center justify-between gap-2"
									key={option.value}
									onClick={() => {
										onFilterChange(filterGroup.label, option.value);
									}}
								>
									<div className="flex items-center gap-2">
										<div
											className={cn(
												"flex h-4 w-4 items-center justify-center rounded-sm border",
												isActive
													? "border-primary bg-primary text-primary-foreground"
													: "border-input"
											)}
										>
											{isActive && <Check className="h-3 w-3" />}
										</div>
										<span className="text-sm">{option.label}</span>
									</div>
									{option.count !== undefined && (
										<span className="text-muted-foreground text-xs">{option.count}</span>
									)}
								</DropdownMenuItem>
							);
						})}
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/**
 * Clear Filters Button
 * Shows only when filters are active
 */
type ClearFiltersButtonProps = {
	onClear: () => void;
	count: number;
};

export function ClearFiltersButton({ onClear, count }: ClearFiltersButtonProps) {
	if (count === 0) {
		return null;
	}

	return (
		<Button className="h-9 px-2 lg:px-3" onClick={onClear} size="sm" variant="ghost">
			Clear filters
		</Button>
	);
}
