"use client";

/**
 * AppointmentsTable Component
 * Full-width Gmail-style table for displaying appointments
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status badges
 * - Click to view appointment details
 */

import {
	Archive,
	Calendar,
	Edit,
	Eye,
	MoreHorizontal,
	Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { useArchiveStore } from "@/lib/stores/archive-store";
import { cn } from "@/lib/utils";

type Appointment = {
	id: string;
	title: string;
	description?: string | null;
	start_time: string | Date;
	end_time: string | Date;
	status: string;
	archived_at?: string | null;
	deleted_at?: string | null;
	customer?: {
		first_name?: string | null;
		last_name?: string | null;
		display_name?: string | null;
	} | null;
	assigned_user?: {
		name?: string | null;
	} | null;
	job_id?: string | null;
};

type AppointmentsTableProps = {
	appointments: Appointment[];
	itemsPerPage?: number;
	onAppointmentClick?: (appointment: Appointment) => void;
	showRefresh?: boolean;
};

function formatDate(date: Date | string | null): string {
	if (!date) {
		return "—";
	}
	const d = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(d);
}

function formatTime(date: Date | string | null): string {
	if (!date) {
		return "—";
	}
	const d = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
	}).format(d);
}

function getStatusBadge(status: string) {
	const variants: Record<
		string,
		{
			className: string;
			label: string;
		}
	> = {
		scheduled: {
			className:
				"border-primary bg-primary text-primary-foreground hover:bg-primary/90 dark:border-primary dark:bg-primary dark:text-primary-foreground",
			label: "Scheduled",
		},
		confirmed: {
			className:
				"border-success bg-success text-white hover:bg-success/90 dark:border-success dark:bg-success dark:text-white",
			label: "Confirmed",
		},
		in_progress: {
			className: "border-primary/50 bg-primary text-white hover:bg-primary",
			label: "In Progress",
		},
		completed: {
			className: "border-success/50 bg-success text-white hover:bg-success",
			label: "Completed",
		},
		cancelled: {
			className:
				"border-destructive/50 bg-destructive text-white hover:bg-destructive",
			label: "Cancelled",
		},
		no_show: {
			className: "border-warning/50 bg-warning text-white hover:bg-warning",
			label: "No Show",
		},
	};

	const config = variants[status] || {
		className: "border-border/50 bg-background text-muted-foreground",
		label: status,
	};

	return (
		<Badge
			className={cn("font-medium text-xs", config.className)}
			variant="outline"
		>
			{config.label}
		</Badge>
	);
}

function getCustomerName(appointment: Appointment): string {
	if (appointment.customer?.display_name) {
		return appointment.customer.display_name;
	}
	if (appointment.customer?.first_name || appointment.customer?.last_name) {
		return `${appointment.customer.first_name || ""} ${appointment.customer.last_name || ""}`.trim();
	}
	return "Unknown Customer";
}

export function AppointmentsTable({
	appointments,
	itemsPerPage = 50,
	onAppointmentClick,
	showRefresh = false,
}: AppointmentsTableProps) {
	// Archive filter state
	const archiveFilter = useArchiveStore((state) => state.filters.appointments);

	// State for archive confirmation dialogs
	const [isSingleArchiveOpen, setIsSingleArchiveOpen] = useState(false);
	const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
	const [_isPermanentDeleteOpen, _setIsPermanentDeleteOpen] = useState(false);
	const [appointmentToArchive, setAppointmentToArchive] = useState<
		string | null
	>(null);
	const [_appointmentToDelete, _setAppointmentToDelete] = useState<
		string | null
	>(null);
	const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<
		Set<string>
	>(new Set());

	// Filter appointments based on archive status
	const filteredAppointments = appointments.filter((apt) => {
		const isArchived = Boolean(apt.archived_at || apt.deleted_at);
		if (archiveFilter === "active") {
			return !isArchived;
		}
		if (archiveFilter === "archived") {
			return isArchived;
		}
		return true; // "all"
	});

	const columns: ColumnDef<Appointment>[] = [
		{
			key: "title",
			header: "Title",
			width: "flex-1",
			render: (appointment) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/appointments/${appointment.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="truncate font-medium text-sm leading-tight hover:underline">
						{appointment.title}
					</div>
					{appointment.description && (
						<div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
							{appointment.description}
						</div>
					)}
				</Link>
			),
		},
		{
			key: "customer",
			header: "Customer",
			width: "w-48",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (appointment) => (
				<span className="text-muted-foreground text-sm">
					{getCustomerName(appointment)}
				</span>
			),
		},
		{
			key: "start_time",
			header: "Date & Time",
			width: "w-40",
			shrink: true,
			hideable: false, // CRITICAL: Date/time essential for scheduling
			render: (appointment) => (
				<div className="text-muted-foreground text-xs tabular-nums">
					<div className="leading-tight">
						{formatDate(appointment.start_time)}
					</div>
					<div className="text-xs leading-tight">
						{formatTime(appointment.start_time)} -{" "}
						{formatTime(appointment.end_time)}
					</div>
				</div>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-32",
			shrink: true,
			hideable: false, // CRITICAL: Status key for action items
			render: (appointment) => getStatusBadge(appointment.status),
		},
		{
			key: "assigned_user",
			header: "Assigned To",
			width: "w-36",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (appointment) => (
				<span className="text-muted-foreground text-sm">
					{appointment.assigned_user?.name || "Unassigned"}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (appointment) => (
				<div data-no-row-click>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<MoreHorizontal className="size-4" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href={`/dashboard/work/appointments/${appointment.id}`}>
									<Eye className="mr-2 size-4" />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href={`/dashboard/work/appointments/${appointment.id}/edit`}
								>
									<Edit className="mr-2 size-4" />
									Edit Appointment
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									setAppointmentToArchive(appointment.id);
									setIsSingleArchiveOpen(true);
								}}
							>
								<Archive className="mr-2 size-4" />
								Archive Appointment
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	// Bulk actions
	const bulkActions: BulkAction[] = [
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			onClick: async (selectedIds) => {
				setSelectedAppointmentIds(selectedIds);
				setIsBulkArchiveOpen(true);
			},
			variant: "destructive",
		},
	];

	// Search filter function
	const searchFilter = (appointment: Appointment, query: string) => {
		const searchStr = query.toLowerCase();

		return (
			appointment.title.toLowerCase().includes(searchStr) ||
			appointment.status.toLowerCase().includes(searchStr) ||
			(appointment.description?.toLowerCase() || "").includes(searchStr) ||
			getCustomerName(appointment).toLowerCase().includes(searchStr) ||
			(appointment.assigned_user?.name?.toLowerCase() || "").includes(searchStr)
		);
	};

	const handleRowClick = (appointment: Appointment) => {
		if (onAppointmentClick) {
			onAppointmentClick(appointment);
		} else {
			window.location.href = `/dashboard/work/appointments/${appointment.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	const handleAddAppointment = () => {
		window.location.href = "/dashboard/work/appointments/new";
	};

	return (
		<>
			<FullWidthDataTable
				bulkActions={bulkActions}
				columns={columns}
				data={filteredAppointments}
				emptyAction={
					<Button onClick={handleAddAppointment} size="sm">
						<Plus className="mr-2 size-4" />
						Add Appointment
					</Button>
				}
				emptyIcon={<Calendar className="h-8 w-8 text-muted-foreground" />}
				emptyMessage="No appointments found"
				enableSelection={true}
				entity="appointments"
				getItemId={(appointment) => appointment.id}
				isArchived={(apt) => Boolean(apt.archived_at || apt.deleted_at)}
				itemsPerPage={itemsPerPage}
				onRefresh={handleRefresh}
				onRowClick={handleRowClick}
				searchFilter={searchFilter}
				searchPlaceholder="Search appointments by title, customer, or assigned user..."
				showArchived={archiveFilter !== "active"}
				showRefresh={showRefresh}
			/>

			{/* Single Appointment Archive Dialog */}
			<AlertDialog
				onOpenChange={setIsSingleArchiveOpen}
				open={isSingleArchiveOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Appointment?</AlertDialogTitle>
						<AlertDialogDescription>
							This appointment will be archived and can be restored within 90
							days. After 90 days, it will be permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								if (appointmentToArchive) {
									const { archiveAppointment } = await import(
										"@/actions/appointments"
									);
									await archiveAppointment(appointmentToArchive);
									window.location.reload();
								}
							}}
						>
							Archive
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Bulk Archive Dialog */}
			<AlertDialog onOpenChange={setIsBulkArchiveOpen} open={isBulkArchiveOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Archive {selectedAppointmentIds.size} Appointment(s)?
						</AlertDialogTitle>
						<AlertDialogDescription>
							These appointments will be archived and can be restored within 90
							days. After 90 days, they will be permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								const { archiveAppointment } = await import(
									"@/actions/appointments"
								);
								for (const appointmentId of selectedAppointmentIds) {
									await archiveAppointment(appointmentId);
								}
								window.location.reload();
							}}
						>
							Archive All
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
