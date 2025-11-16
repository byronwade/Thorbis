"use client";

/**
 * Archive Filter Select Component
 *
 * Reusable dropdown for filtering archived vs active items
 * - Used in all datatables
 * - Persists filter preference via Zustand
 * - Shows counts for each filter option
 */

import { Archive, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ArchivableEntity, useArchiveStore } from "@/lib/stores/archive-store";
import { ARCHIVE_FILTER_OPTIONS, type ArchiveFilter } from "@/lib/utils/archive";

type ArchiveFilterSelectProps = {
	entity: ArchivableEntity;
	activeCount?: number;
	archivedCount?: number;
	totalCount?: number;
};

export function ArchiveFilterSelect({ entity, activeCount, archivedCount, totalCount }: ArchiveFilterSelectProps) {
	const filter = useArchiveStore((state) => state.filters[entity]);
	const setFilter = useArchiveStore((state) => state.setFilter);

	const handleFilterChange = (newFilter: ArchiveFilter) => {
		setFilter(entity, newFilter);
	};

	const getCountForFilter = (filterValue: ArchiveFilter): number | undefined => {
		switch (filterValue) {
			case "active":
				return activeCount;
			case "archived":
				return archivedCount;
			case "all":
				return totalCount;
			default:
				return;
		}
	};

	const currentLabel = ARCHIVE_FILTER_OPTIONS.find((opt) => opt.value === filter)?.label || "Active Only";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="outline">
					<Archive className="size-4" />
					<span className="ml-2">{currentLabel}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>Show Items</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{ARCHIVE_FILTER_OPTIONS.map((option) => {
					const isSelected = filter === option.value;
					const count = getCountForFilter(option.value);

					return (
						<DropdownMenuItem
							className="flex items-center justify-between"
							key={option.value}
							onClick={() => handleFilterChange(option.value)}
						>
							<div className="flex items-center gap-2">
								{isSelected && <Check className="size-4" />}
								<span className={isSelected ? "font-medium" : ""}>{option.label}</span>
							</div>
							{count !== undefined && <span className="text-muted-foreground text-xs">{count}</span>}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
