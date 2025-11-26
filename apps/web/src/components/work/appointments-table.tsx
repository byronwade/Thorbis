"use client";

import { useRouter } from "next/navigation";
import { archiveAppointment } from "@/actions/appointments";

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
import { useArchiveDialog } from "@/components/ui/archive-dialog-manager";
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
import { useTableActions } from "@/hooks/use-table-actions";
import { TablePresets } from "@/lib/datatable/table-presets";
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
	totalCount?: number;
	currentPage?: number;
	initialSearchQuery?: string;
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
			className={cn("text-xs font-medium", config.className)}
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
	totalCount,
	currentPage = 1,
	initialSearchQuery = "",
}: AppointmentsTableProps) {
	const router = useRouter();

	// Archive filter state
	const archiveFilter = useArchiveStore((state) => state.filters.appointments);

	// Table actions hook
	const { handleRefresh } = useTableActions({ entityType: "appointments" });

	// Archive dialog
	const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
		onConfirm: async (id) => {
			const result = await archiveAppointment(id);
			if (result.success) {
				handleRefresh();
			}
		},
		title: "Archive Appointment?",
		description:
			"This appointment will be archived and can be restored within 90 days.",
	});

	// Bulk archive state
	const [_isPermanentDeleteOpen, _setIsPermanentDeleteOpen] = useState(false);
	const [_appointmentToDelete, _setAppointmentToDelete] = useState<
		string | null
	>(null);
	const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<
		Set<string>
	>(new Set());

	// Bulk archive dialog
	const {
		openArchiveDialog: openBulkArchiveDialog,
		ArchiveDialogComponent: BulkArchiveDialogComponent,
	} = useArchiveDialog({
		onConfirm: async () => {
			let archived = 0;
			for (const id of selectedAppointmentIds) {
				const result = await archiveAppointment(id);
				if (result.success) {
					archived++;
				}
			}
			if (archived > 0) {
				handleRefresh();
			}
		},
		title: `Archive ${selectedAppointmentIds.size} Appointment(s)?`,
		description: `${selectedAppointmentIds.size} appointment(s) will be archived and can be restored within 90 days.`,
	});

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
					<div className="truncate text-xs leading-tight font-medium hover:underline">
						{appointment.title}
					</div>
					{appointment.description && (
						<div className="text-muted-foreground mt-0.5 truncate text-xs leading-tight">
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
				<span className="text-muted-foreground text-xs">
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
				<span className="text-muted-foreground text-xs">
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
									openArchiveDialog(appointment.id);
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
				openBulkArchiveDialog("");
			},
			variant: "destructive",
		},
	];

	const handleRowClick = (appointment: Appointment) => {
		if (onAppointmentClick) {
			onAppointmentClick(appointment);
		} else {
			window.location.href = `/dashboard/work/appointments/${appointment.id}`;
		}
	};

	const handleAddAppointment = () => {
		window.location.href = "/dashboard/work/appointments/new";
	};

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.fullList({
					entity: "appointments",
					enableSelection: true,
					searchPlaceholder:
						"Search appointments by title, description, or status...",
					itemsPerPage,
					showRefresh,
				})}
				data={filteredAppointments}
				columns={columns}
				getItemId={(appointment) => appointment.id}
				bulkActions={bulkActions}
				onRowClick={handleRowClick}
				totalCount={totalCount}
				currentPageFromServer={currentPage}
				initialSearchQuery={initialSearchQuery}
				serverPagination
				serverSearch
				searchParamKey="search"
				onRefresh={handleRefresh}
				emptyMessage="No appointments found"
				emptyIcon={<Calendar className="text-muted-foreground h-8 w-8" />}
				emptyAction={
					<Button onClick={handleAddAppointment} size="sm">
						<Plus className="mr-2 size-4" />
						Add Appointment
					</Button>
				}
				isArchived={(apt) => Boolean(apt.archived_at || apt.deleted_at)}
				showArchived={archiveFilter !== "active"}
			/>

			<ArchiveDialogComponent />
			<BulkArchiveDialogComponent />
		</>
	);
}
