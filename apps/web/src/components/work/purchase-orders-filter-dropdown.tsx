"use client";

/**
 * Purchase Orders Filter Dropdown
 *
 * Comprehensive filter control for purchase orders
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
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import {
	type PurchaseOrdersFilters,
	usePurchaseOrdersFiltersStore,
} from "@/lib/stores/purchase-orders-filters-store";

type PurchaseOrdersFilterDropdownProps = {
	activeCount?: number;
	archivedCount?: number;
	totalCount?: number;
};

export function PurchaseOrdersFilterDropdown({
	activeCount,
	archivedCount,
	totalCount,
}: PurchaseOrdersFilterDropdownProps) {
	const globalFilters = usePurchaseOrdersFiltersStore((state) => state.filters);
	const setFilters = usePurchaseOrdersFiltersStore((state) => state.setFilters);
	const resetFilters = usePurchaseOrdersFiltersStore(
		(state) => state.resetFilters,
	);

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
						<h4 className="text-sm font-semibold">Filter Purchase Orders</h4>
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
					<StandardFormField label="Status" htmlFor="filter-po-status">
						<Select
							onValueChange={(value: PurchaseOrdersFilters["archiveStatus"]) =>
								setLocalFilters({ ...localFilters, archiveStatus: value })
							}
							value={localFilters.archiveStatus}
						>
							<SelectTrigger id="filter-po-status" className="h-9">
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
									All Purchase Orders{" "}
									{totalCount !== undefined && `(${totalCount})`}
								</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					{/* Order Status */}
					<StandardFormField
						label="Order Status"
						htmlFor="filter-po-order-status"
					>
						<Select
							onValueChange={(value) =>
								setLocalFilters({ ...localFilters, status: value })
							}
							value={localFilters.status}
						>
							<SelectTrigger id="filter-po-order-status" className="h-9">
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="ordered">Ordered</SelectItem>
								<SelectItem value="received">Received</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					{/* Vendor Name */}
					<StandardFormField label="Vendor Name" htmlFor="filter-po-vendor">
						<Input
							id="filter-po-vendor"
							className="h-9"
							onChange={(e) =>
								setLocalFilters({ ...localFilters, vendorName: e.target.value })
							}
							placeholder="Search by vendor..."
							value={localFilters.vendorName}
						/>
					</StandardFormField>

					{/* Order Number */}
					<StandardFormField label="Order Number" htmlFor="filter-po-number">
						<Input
							id="filter-po-number"
							className="h-9"
							onChange={(e) =>
								setLocalFilters({
									...localFilters,
									orderNumber: e.target.value,
								})
							}
							placeholder="Search by number..."
							value={localFilters.orderNumber}
						/>
					</StandardFormField>

					{/* Total Range */}
					<StandardFormField label="Total Range" htmlFor="filter-po-total-min">
						<StandardFormRow cols={2}>
							<Input
								id="filter-po-total-min"
								className="h-9"
								onChange={(e) =>
									setLocalFilters({ ...localFilters, totalMin: e.target.value })
								}
								placeholder="Min"
								type="number"
								value={localFilters.totalMin}
							/>
							<Input
								id="filter-po-total-max"
								className="h-9"
								onChange={(e) =>
									setLocalFilters({ ...localFilters, totalMax: e.target.value })
								}
								placeholder="Max"
								type="number"
								value={localFilters.totalMax}
							/>
						</StandardFormRow>
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
