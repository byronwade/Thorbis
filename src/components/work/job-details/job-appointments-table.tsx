"use client";

import { Calendar, CheckCircle, Eye, MapPin, MoreHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { updateSchedule } from "@/actions/schedules";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { useToast } from "@/hooks/use-toast";

type Appointment = {
	id: string;
	title?: string;
	description?: string;
	start_time: string;
	end_time: string;
	duration?: number | null;
	actual_duration?: number | null;
	dispatch_time?: string | null;
	actual_start_time?: string | null;
	actual_end_time?: string | null;
	status?: string | null;
	type?: string | null;
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

type JobAppointmentsTableProps = {
	appointments: Appointment[];
};

export function JobAppointmentsTable({ appointments }: JobAppointmentsTableProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loadingAppointmentId, setLoadingAppointmentId] = useState<string | null>(null);

	// Check if appointment is scheduled for today
	const isToday = useCallback((dateString: string) => {
		if (!dateString) {
			return false;
		}
		const appointmentDate = new Date(dateString);
		const today = new Date();
		return (
			appointmentDate.getDate() === today.getDate() &&
			appointmentDate.getMonth() === today.getMonth() &&
			appointmentDate.getFullYear() === today.getFullYear()
		);
	}, []);

	// Handle dispatch
	const handleDispatch = useCallback(
		async (appointmentId: string) => {
			setLoadingAppointmentId(appointmentId);
			try {
				const result = await updateSchedule(appointmentId, {
					dispatch_time: new Date(),
					status: "confirmed",
				});
				if (result.success) {
					toast.success("Appointment dispatched");
					router.refresh();
				} else {
					toast.error(result.error || "Failed to dispatch appointment");
				}
			} catch (_error) {
    console.error("Error:", _error);
				toast.error("Failed to dispatch appointment");
			} finally {
				setLoadingAppointmentId(null);
			}
		},
		[router, toast]
	);

	// Handle arrive
	const handleArrive = useCallback(
		async (appointmentId: string) => {
			setLoadingAppointmentId(appointmentId);
			try {
				const result = await updateSchedule(appointmentId, {
					actual_start_time: new Date(),
					status: "in_progress",
				});
				if (result.success) {
					toast.success("Technician arrived");
					router.refresh();
				} else {
					toast.error(result.error || "Failed to mark as arrived");
				}
			} catch (_error) {
    console.error("Error:", _error);
				toast.error("Failed to mark as arrived");
			} finally {
				setLoadingAppointmentId(null);
			}
		},
		[router, toast]
	);

	// Handle close
	const handleClose = useCallback(
		async (appointment: Appointment) => {
			setLoadingAppointmentId(appointment.id);
			try {
				const now = new Date();
				const startTime = appointment.actual_start_time
					? new Date(appointment.actual_start_time)
					: appointment.start_time
						? new Date(appointment.start_time)
						: null;

				// Calculate duration in minutes
				let duration: number | null = null;
				if (startTime) {
					duration = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));
				}

				const result = await updateSchedule(appointment.id, {
					actual_end_time: now,
					actual_duration: duration,
					status: "completed",
				});
				if (result.success) {
					toast.success("Appointment closed");
					router.refresh();
				} else {
					toast.error(result.error || "Failed to close appointment");
				}
			} catch (_error) {
    console.error("Error:", _error);
				toast.error("Failed to close appointment");
			} finally {
				setLoadingAppointmentId(null);
			}
		},
		[router, toast]
	);

	const formatDate = useCallback((date: string | null) => {
		if (!date) {
			return "—";
		}
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(new Date(date));
	}, []);

	const formatTime = useCallback((date: string | null) => {
		if (!date) {
			return "—";
		}
		return new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
		}).format(new Date(date));
	}, []);

	const _formatDateTime = useCallback((date: string | null) => {
		if (!date) {
			return "—";
		}
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
		}).format(new Date(date));
	}, []);

	const formatDuration = useCallback((minutes: number | null) => {
		if (!minutes) {
			return "—";
		}
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0 && mins > 0) {
			return `${hours}h ${mins}m`;
		}
		if (hours > 0) {
			return `${hours}h`;
		}
		return `${mins}m`;
	}, []);

	const getStatusBadge = useCallback((status: string) => {
		const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
			completed: "default",
			confirmed: "secondary",
			scheduled: "secondary",
			in_progress: "default",
			cancelled: "destructive",
			no_show: "destructive",
			rescheduled: "outline",
		};

		return (
			<Badge className="text-xs" variant={variants[status] || "outline"}>
				{status.replace(/_/g, " ")}
			</Badge>
		);
	}, []);

	const columns: ColumnDef<Appointment>[] = useMemo(
		() => [
			{
				key: "scheduled",
				header: "Scheduled",
				width: "w-40",
				shrink: true,
				render: (appointment) => (
					<div className="space-y-1">
						<div className="font-medium text-sm">{formatDate(appointment.start_time)}</div>
						<div className="text-muted-foreground text-xs">
							{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
						</div>
					</div>
				),
			},
			{
				key: "dispatch",
				header: "Dispatch",
				width: "w-36",
				shrink: true,
				hideOnMobile: true,
				render: (appointment) => (
					<div className="text-sm">
						{appointment.dispatch_time ? (
							<div className="space-y-1">
								<div>{formatDate(appointment.dispatch_time)}</div>
								<div className="text-muted-foreground text-xs">{formatTime(appointment.dispatch_time)}</div>
							</div>
						) : (
							<span className="text-muted-foreground text-xs">Not dispatched</span>
						)}
					</div>
				),
			},
			{
				key: "arrive",
				header: "Arrive",
				width: "w-36",
				shrink: true,
				hideOnMobile: true,
				render: (appointment) => (
					<div className="text-sm">
						{appointment.actual_start_time ? (
							<div className="space-y-1">
								<div>{formatDate(appointment.actual_start_time)}</div>
								<div className="text-muted-foreground text-xs">{formatTime(appointment.actual_start_time)}</div>
							</div>
						) : (
							<span className="text-muted-foreground text-xs">Not arrived</span>
						)}
					</div>
				),
			},
			{
				key: "close",
				header: "Close",
				width: "w-36",
				shrink: true,
				hideOnMobile: true,
				render: (appointment) => (
					<div className="text-sm">
						{appointment.actual_end_time ? (
							<div className="space-y-1">
								<div>{formatDate(appointment.actual_end_time)}</div>
								<div className="text-muted-foreground text-xs">{formatTime(appointment.actual_end_time)}</div>
							</div>
						) : (
							<span className="text-muted-foreground text-xs">Not closed</span>
						)}
					</div>
				),
			},
			{
				key: "duration",
				header: "Duration",
				width: "w-24",
				shrink: true,
				render: (appointment) => (
					<span className="text-sm">
						{appointment.actual_duration
							? formatDuration(appointment.actual_duration)
							: formatDuration(appointment.duration ?? null)}
					</span>
				),
			},
			{
				key: "technician",
				header: "Technician",
				width: "w-40",
				shrink: true,
				render: (appointment) => {
					const assignedUser = Array.isArray(appointment.assigned_user)
						? appointment.assigned_user[0]
						: appointment.assigned_user;

					return assignedUser ? (
						<div className="flex items-center gap-2">
							<Avatar className="h-6 w-6">
								<AvatarImage alt={assignedUser.name || ""} src={assignedUser.avatar || undefined} />
								<AvatarFallback>
									{(assignedUser.name || "U")
										.split(" ")
										.map((n: string) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm">{assignedUser.name || "Unassigned"}</span>
						</div>
					) : (
						<span className="text-muted-foreground text-sm">Unassigned</span>
					);
				},
			},
			{
				key: "status",
				header: "Status",
				width: "w-28",
				shrink: true,
				render: (appointment) => getStatusBadge(appointment.status || "scheduled"),
			},
			{
				key: "type",
				header: "Type",
				width: "w-24",
				shrink: true,
				hideOnMobile: true,
				render: (appointment) => (
					<Badge className="text-xs" variant="outline">
						{appointment.type || "appointment"}
					</Badge>
				),
			},
			{
				key: "actions",
				header: "Actions",
				width: "w-48",
				shrink: true,
				align: "right",
				render: (appointment) => {
					const appointmentIsToday = isToday(appointment.start_time);
					const isLoading = loadingAppointmentId === appointment.id;
					const canDispatch = appointmentIsToday && !appointment.dispatch_time;
					const canArrive = appointmentIsToday && appointment.dispatch_time && !appointment.actual_start_time;
					const canClose = appointmentIsToday && appointment.actual_start_time && !appointment.actual_end_time;

					if (!appointmentIsToday) {
						return (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="size-8 p-0" size="sm" variant="ghost">
										<MoreHorizontal className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuItem className="cursor-pointer">
										<Eye className="mr-2 size-4" />
										View Details
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="cursor-pointer">
										<Calendar className="mr-2 size-4" />
										Edit Appointment
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						);
					}

					return (
						<div className="flex items-center justify-end gap-1">
							{canDispatch && (
								<Button
									className="h-8 bg-primary px-3 text-xs hover:bg-primary"
									disabled={isLoading}
									onClick={() => handleDispatch(appointment.id)}
									size="sm"
								>
									<MapPin className="mr-1.5 size-3" />
									Dispatch
								</Button>
							)}
							{canArrive && (
								<Button
									className="h-8 bg-success px-3 text-xs hover:bg-success"
									disabled={isLoading}
									onClick={() => handleArrive(appointment.id)}
									size="sm"
								>
									<CheckCircle className="mr-1.5 size-3" />
									Arrive
								</Button>
							)}
							{canClose && (
								<Button
									className="h-8 bg-accent px-3 text-xs hover:bg-accent"
									disabled={isLoading}
									onClick={() => handleClose(appointment)}
									size="sm"
								>
									<X className="mr-1.5 size-3" />
									Close
								</Button>
							)}
							{!(canDispatch || canArrive || canClose) && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="size-8 p-0" size="sm" variant="ghost">
											<MoreHorizontal className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-48">
										<DropdownMenuItem className="cursor-pointer">
											<Eye className="mr-2 size-4" />
											View Details
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="cursor-pointer">
											<Calendar className="mr-2 size-4" />
											Edit Appointment
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					);
				},
			},
		],
		[
			formatDate,
			formatTime,
			formatDuration,
			getStatusBadge,
			isToday,
			loadingAppointmentId,
			handleDispatch,
			handleArrive,
			handleClose,
		]
	);

	return (
		<FullWidthDataTable
			columns={columns}
			data={appointments}
			emptyIcon={<Calendar className="size-12 text-muted-foreground/50" />}
			emptyMessage="No appointments scheduled for this job"
			getItemId={(appointment) => appointment.id}
			searchFilter={(appointment, query) => {
				const searchLower = query.toLowerCase();
				const assignedUserName = Array.isArray(appointment.assigned_user)
					? appointment.assigned_user[0]?.name || ""
					: appointment.assigned_user?.name || "";
				return (
					(appointment.title || "").toLowerCase().includes(searchLower) ||
					(appointment.description || "").toLowerCase().includes(searchLower) ||
					(appointment.status || "").toLowerCase().includes(searchLower) ||
					(appointment.type || "").toLowerCase().includes(searchLower) ||
					assignedUserName.toLowerCase().includes(searchLower)
				);
			}}
			searchPlaceholder="Search appointments..."
			showPagination={true}
		/>
	);
}
