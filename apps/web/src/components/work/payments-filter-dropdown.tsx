"use client";

import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
	type PaymentsFilters,
	usePaymentsFiltersStore,
} from "@/lib/stores/payments-filters-store";

type PaymentsFilterDropdownProps = {
	activeCount?: number;
	archivedCount?: number;
	totalCount?: number;
};

export function PaymentsFilterDropdown({
	activeCount,
	archivedCount,
	totalCount,
}: PaymentsFilterDropdownProps) {
	const globalFilters = usePaymentsFiltersStore((state) => state.filters);
	const setFilters = usePaymentsFiltersStore((state) => state.setFilters);
	const resetFilters = usePaymentsFiltersStore((state) => state.resetFilters);

	const [localFilters, setLocalFilters] = useState(globalFilters);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setLocalFilters(globalFilters);
		}
	}, [isOpen, globalFilters]);

	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (localFilters.archiveStatus !== "active") {
			count++;
		}
		if (localFilters.status !== "all") {
			count++;
		}
		if (localFilters.method !== "all") {
			count++;
		}
		if (localFilters.amountMin) {
			count++;
		}
		if (localFilters.amountMax) {
			count++;
		}
		if (localFilters.customerName) {
			count++;
		}
		if (localFilters.referenceNumber) {
			count++;
		}
		return count;
	}, [localFilters]);

	const handleApply = () => {
		setFilters(localFilters);
		setIsOpen(false);
	};

	const handleClear = () => {
		resetFilters();
		setIsOpen(false);
	};

	const handleLocalChange = (key: keyof PaymentsFilters, value: string) => {
		setLocalFilters((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
			<DropdownMenuTrigger asChild>
				<Button className="relative" size="sm" variant="outline">
					<Filter className="size-4" />
					<span className="ml-2">Filters</span>
					{activeFilterCount > 0 && (
						<Badge
							className="ml-2 h-5 w-5 justify-center p-0 text-xs"
							variant="secondary"
						>
							{activeFilterCount}
						</Badge>
					)}
					<ChevronDown className="ml-1 size-3 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel className="flex items-center justify-between">
					<span>Filter Payments</span>
					{activeFilterCount > 0 && (
						<Button
							className="h-6 px-2 text-xs"
							onClick={handleClear}
							size="sm"
							variant="ghost"
						>
							Clear all
						</Button>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<div className="space-y-4 p-3">
					{/* Archive Status */}
					<StandardFormField
						label="Archive Status"
						htmlFor="filter-payments-archive-status"
					>
						<Select
							onValueChange={(value) =>
								handleLocalChange(
									"archiveStatus",
									value as PaymentsFilters["archiveStatus"],
								)
							}
							value={localFilters.archiveStatus}
						>
							<SelectTrigger
								id="filter-payments-archive-status"
								className="h-9"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">
									Active Only {activeCount !== undefined && `(${activeCount})`}
								</SelectItem>
								<SelectItem value="all">
									All Payments {totalCount !== undefined && `(${totalCount})`}
								</SelectItem>
								<SelectItem value="archived">
									Archived Only{" "}
									{archivedCount !== undefined && `(${archivedCount})`}
								</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					<Separator />

					{/* Status */}
					<StandardFormField label="Status" htmlFor="filter-payments-status">
						<Select
							onValueChange={(value) => handleLocalChange("status", value)}
							value={localFilters.status}
						>
							<SelectTrigger id="filter-payments-status" className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
								<SelectItem value="refunded">Refunded</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					<Separator />

					{/* Payment Method */}
					<StandardFormField
						label="Payment Method"
						htmlFor="filter-payments-method"
					>
						<Select
							onValueChange={(value) => handleLocalChange("method", value)}
							value={localFilters.method}
						>
							<SelectTrigger id="filter-payments-method" className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Methods</SelectItem>
								<SelectItem value="cash">Cash</SelectItem>
								<SelectItem value="check">Check</SelectItem>
								<SelectItem value="card">Card</SelectItem>
								<SelectItem value="ach">ACH</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</StandardFormField>

					<Separator />

					{/* Amount Range */}
					<StandardFormField
						label="Amount Range"
						htmlFor="filter-payments-amount-min"
					>
						<div className="grid grid-cols-2 gap-2">
							<Input
								id="filter-payments-amount-min"
								className="h-9"
								onChange={(e) => handleLocalChange("amountMin", e.target.value)}
								placeholder="Min"
								type="number"
								value={localFilters.amountMin}
							/>
							<Input
								id="filter-payments-amount-max"
								className="h-9"
								onChange={(e) => handleLocalChange("amountMax", e.target.value)}
								placeholder="Max"
								type="number"
								value={localFilters.amountMax}
							/>
						</div>
					</StandardFormField>

					<Separator />

					{/* Customer Name */}
					<StandardFormField
						label="Customer"
						htmlFor="filter-payments-customer-name"
					>
						<Input
							id="filter-payments-customer-name"
							className="h-9"
							onChange={(e) =>
								handleLocalChange("customerName", e.target.value)
							}
							placeholder="Search by customer name..."
							type="text"
							value={localFilters.customerName}
						/>
					</StandardFormField>

					<Separator />

					{/* Reference Number */}
					<StandardFormField
						label="Reference Number"
						htmlFor="filter-payments-reference-number"
					>
						<Input
							id="filter-payments-reference-number"
							className="h-9"
							onChange={(e) =>
								handleLocalChange("referenceNumber", e.target.value)
							}
							placeholder="Search by reference #..."
							type="text"
							value={localFilters.referenceNumber}
						/>
					</StandardFormField>
				</div>

				<DropdownMenuSeparator />

				<div className="flex gap-2 p-3">
					<Button
						className="flex-1"
						onClick={() => setIsOpen(false)}
						size="sm"
						variant="outline"
					>
						Cancel
					</Button>
					<Button className="flex-1" onClick={handleApply} size="sm">
						Apply Filters
					</Button>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
