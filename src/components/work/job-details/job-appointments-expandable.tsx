"use client";

import { Calendar, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AppointmentExpandableRow } from "./appointment-expandable-row";

/**
 * Job Appointments - Expandable List View
 *
 * Alternative to datatable that shows expandable rows for nested data.
 * Each appointment can be expanded to show:
 * - Team members assigned
 * - Equipment used
 * - Time tracking
 * - Notes and instructions
 *
 * Features:
 * - Search by title, type, assignee
 * - Filter by status
 * - Sort by date
 * - Clean expandable rows
 */

type TeamMember = {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
	role?: string;
};

type Equipment = {
	id: string;
	name: string;
	serial_number?: string;
	type?: string;
};

type Appointment = {
	id: string;
	title?: string;
	description?: string;
	start_time: string;
	end_time: string;
	duration?: number | null;
	actual_duration?: number | null;
	actual_start_time?: string | null;
	actual_end_time?: string | null;
	status?: string | null;
	type?: string | null;
	notes?: string | null;
	access_instructions?: string | null;
	team_members?: TeamMember[];
	equipment?: Equipment[];
	assigned_user?:
		| {
				id: string;
				name: string;
				email?: string;
				avatar?: string;
		  }
		| null
		| Array<{
				id: string;
				name: string;
				email?: string;
				avatar?: string;
		  }>;
};

type JobAppointmentsExpandableProps = {
	appointments: Appointment[];
};

export function JobAppointmentsExpandable({
	appointments,
}: JobAppointmentsExpandableProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// Get unique statuses
	const statuses = useMemo(() => {
		const uniqueStatuses = new Set(
			appointments.map((a) => a.status).filter(Boolean),
		);
		return Array.from(uniqueStatuses);
	}, [appointments]);

	// Filter and search appointments
	const filteredAppointments = useMemo(() => {
		let filtered = appointments;

		// Apply search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((appointment) => {
				const assignedUser = Array.isArray(appointment.assigned_user)
					? appointment.assigned_user[0]
					: appointment.assigned_user;

				return (
					appointment.title?.toLowerCase().includes(query) ||
					appointment.type?.toLowerCase().includes(query) ||
					appointment.description?.toLowerCase().includes(query) ||
					assignedUser?.name.toLowerCase().includes(query)
				);
			});
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter(
				(appointment) => appointment.status === statusFilter,
			);
		}

		// Sort by start time (newest first)
		filtered.sort(
			(a, b) =>
				new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
		);

		return filtered;
	}, [appointments, searchQuery, statusFilter]);

	return (
		<div className="flex flex-col">
			{/* Toolbar */}
			<div className="bg-background sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b p-3">
				{/* Search */}
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						className="h-9 pl-9"
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search appointments..."
						value={searchQuery}
					/>
				</div>

				{/* Status Filter */}
				<Select onValueChange={setStatusFilter} value={statusFilter}>
					<SelectTrigger className="h-9 w-[160px]">
						<Filter className="mr-2 size-4" />
						<SelectValue placeholder="All Statuses" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						{statuses.map((status) => (
							<SelectItem key={status} value={status || ""}>
								{status?.replace(/_/g, " ")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Count */}
				<Badge className="h-9 px-3" variant="outline">
					{filteredAppointments.length} of {appointments.length}
				</Badge>
			</div>

			{/* Appointments List */}
			<div className="divide-y">
				{filteredAppointments.length > 0 ? (
					filteredAppointments.map((appointment) => (
						<AppointmentExpandableRow
							appointment={appointment}
							key={appointment.id}
						/>
					))
				) : (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<Calendar className="text-muted-foreground mb-3 size-12" />
						<p className="text-muted-foreground text-sm">
							{searchQuery || statusFilter !== "all"
								? "No appointments match your filters"
								: "No appointments scheduled"}
						</p>
						{(searchQuery || statusFilter !== "all") && (
							<Button
								className="mt-3"
								onClick={() => {
									setSearchQuery("");
									setStatusFilter("all");
								}}
								size="sm"
								variant="outline"
							>
								Clear Filters
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
