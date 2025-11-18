"use client";

/**
 * Appointments Filter Dropdown
 *
 * Comprehensive filter control for appointments
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
	type AppointmentsFilters,
	useAppointmentsFiltersStore,
} from "@/lib/stores/appointments-filters-store";

type AppointmentsFilterDropdownProps = {
	activeCount?: number;
	archivedCount?: number;
	totalCount?: number;
};

export function AppointmentsFilterDropdown({
	activeCount,
	archivedCount,
	totalCount,
}: AppointmentsFilterDropdownProps) {
	const globalFilters = useAppointmentsFiltersStore((state) => state.filters);
	const setFilters = useAppointmentsFiltersStore((state) => state.setFilters);
	const resetFilters = useAppointmentsFiltersStore(
		(state) => state.resetFilters,
	);

	const [localFilters, setLocalFilters] = useState(globalFilters);
	const [isOpen, setIsOpen] = useState(false);

	// Sync local filters with global filters when dropdown opens
	useEffect(() => {
		if (isOpen) {
			setLocalFilters(globalFilters);
		}
	}, [isOpen, globalFilters]);

	// Count active filters
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
						<h4 className="text-sm font-semibold">Filter Appointments</h4>
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
					<div className="space-y-2">
						<Label className="text-xs">Status</Label>
						<Select
							onValueChange={(value: AppointmentsFilters["archiveStatus"]) =>
								setLocalFilters({ ...localFilters, archiveStatus: value })
							}
							value={localFilters.archiveStatus}
						>
							<SelectTrigger className="h-9">
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
									All Appointments{" "}
									{totalCount !== undefined && `(${totalCount})`}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Appointment Status */}
					<div className="space-y-2">
						<Label className="text-xs">Appointment Status</Label>
						<Select
							onValueChange={(value) =>
								setLocalFilters({ ...localFilters, status: value })
							}
							value={localFilters.status}
						>
							<SelectTrigger className="h-9">
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="scheduled">Scheduled</SelectItem>
								<SelectItem value="confirmed">Confirmed</SelectItem>
								<SelectItem value="in_progress">In Progress</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
								<SelectItem value="no_show">No Show</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Customer Name */}
					<div className="space-y-2">
						<Label className="text-xs">Customer Name</Label>
						<Input
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
					</div>

					{/* Assigned To */}
					<div className="space-y-2">
						<Label className="text-xs">Assigned To</Label>
						<Input
							className="h-9"
							onChange={(e) =>
								setLocalFilters({ ...localFilters, assignedTo: e.target.value })
							}
							placeholder="Search by assigned person..."
							value={localFilters.assignedTo}
						/>
					</div>

					{/* Appointment Number */}
					<div className="space-y-2">
						<Label className="text-xs">Appointment Number</Label>
						<Input
							className="h-9"
							onChange={(e) =>
								setLocalFilters({
									...localFilters,
									appointmentNumber: e.target.value,
								})
							}
							placeholder="Search by number..."
							value={localFilters.appointmentNumber}
						/>
					</div>

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
