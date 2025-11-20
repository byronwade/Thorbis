"use client";

/**
 * Contracts Filter Dropdown
 *
 * Comprehensive filter control for contracts
 */

import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StandardFormField } from "@/components/ui/standard-form-field";
import {
	type ContractsFilters,
	useContractsFiltersStore,
} from "@/lib/stores/contracts-filters-store";

type ContractsFilterDropdownProps = {
	activeCount?: number;
	archivedCount?: number;
	totalCount?: number;
};

export function ContractsFilterDropdown({
	activeCount,
	archivedCount,
	totalCount,
}: ContractsFilterDropdownProps) {
	const globalFilters = useContractsFiltersStore((state) => state.filters);
	const setFilters = useContractsFiltersStore((state) => state.setFilters);
	const resetFilters = useContractsFiltersStore((state) => state.resetFilters);

	const [localFilters, setLocalFilters] = useState(globalFilters);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setLocalFilters(globalFilters);
		}
	}, [isOpen, globalFilters]);

	const activeFilterCount = Object.entries(globalFilters).filter(
		([key, value]) => {
			if (key === "archiveStatus") {
				return value !== "active";
			}
			if (key === "status") {
				return value !== "all";
			}
			return value !== "";
		},
	).length;

	const handleApplyFilters = () => {
		setFilters(localFilters);
		setIsOpen(false);
	};

	const handleClearAll = () => {
		resetFilters();
		setLocalFilters(globalFilters);
	};

	return (
		<DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
			<DropdownMenuTrigger asChild>
				<Button className="relative" size="sm" variant="outline">
					<Filter className="mr-2 size-4" />
					Filters
					<ChevronDown className="ml-2 size-4" />
					{activeFilterCount > 0 && (
						<Badge
							className="ml-2 size-5 rounded-full p-0 text-xs"
							variant="secondary"
						>
							{activeFilterCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-80 p-4">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h4 className="text-sm font-semibold">Filter Contracts</h4>
						{activeFilterCount > 0 && (
							<Button
								className="h-auto p-1 text-xs"
								onClick={handleClearAll}
								size="sm"
								variant="ghost"
							>
								Clear All
							</Button>
						)}
					</div>

					<Separator />

					{/* Archive Status */}
					<StandardFormField label="Status" htmlFor="filter-contracts-status">
						<Select
							onValueChange={(value: ContractsFilters["archiveStatus"]) =>
								setLocalFilters({ ...localFilters, archiveStatus: value })
							}
							value={localFilters.archiveStatus}
						>
							<SelectTrigger id="filter-contracts-status" className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">
									Active Only {activeCount !== undefined && `(${activeCount})`}
								</SelectItem>
								<SelectItem value="archived">
									Archived Only{" "}
									{archivedCount !== undefined && `(${archivedCount})`}
								</SelectItem>
								<SelectItem value="all">
									All Contracts {totalCount !== undefined && `(${totalCount})`}
								</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					{/* Contract Status */}
					<StandardFormField
						label="Contract Status"
						htmlFor="filter-contracts-contract-status"
					>
						<Select
							onValueChange={(value) =>
								setLocalFilters({ ...localFilters, status: value })
							}
							value={localFilters.status}
						>
							<SelectTrigger
								id="filter-contracts-contract-status"
								className="h-9"
							>
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="expired">Expired</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					{/* Customer Name */}
					<StandardFormField
						label="Customer Name"
						htmlFor="filter-contracts-customer-name"
					>
						<Input
							id="filter-contracts-customer-name"
							className="h-9"
							onChange={(e) =>
								setLocalFilters({
									...localFilters,
									customerName: e.target.value,
								})
							}
							placeholder="Search by customer..."
							value={localFilters.customerName}
						/>
					</StandardFormField>

					{/* Contract Number */}
					<StandardFormField
						label="Contract Number"
						htmlFor="filter-contracts-contract-number"
					>
						<Input
							id="filter-contracts-contract-number"
							className="h-9"
							onChange={(e) =>
								setLocalFilters({
									...localFilters,
									contractNumber: e.target.value,
								})
							}
							placeholder="Search by number..."
							value={localFilters.contractNumber}
						/>
					</StandardFormField>

					{/* Value Range */}
					<StandardFormField
						label="Value Range"
						htmlFor="filter-contracts-value-min"
					>
						<div className="flex gap-2">
							<Input
								id="filter-contracts-value-min"
								className="h-9"
								onChange={(e) =>
									setLocalFilters({ ...localFilters, valueMin: e.target.value })
								}
								placeholder="Min"
								type="number"
								value={localFilters.valueMin}
							/>
							<Input
								id="filter-contracts-value-max"
								className="h-9"
								onChange={(e) =>
									setLocalFilters({ ...localFilters, valueMax: e.target.value })
								}
								placeholder="Max"
								type="number"
								value={localFilters.valueMax}
							/>
						</div>
					</StandardFormField>

					<Separator />

					{/* Actions */}
					<div className="flex gap-2">
						<Button
							className="flex-1"
							onClick={() => setIsOpen(false)}
							size="sm"
							variant="outline"
						>
							Cancel
						</Button>
						<Button className="flex-1" onClick={handleApplyFilters} size="sm">
							Apply Filters
						</Button>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
