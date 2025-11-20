"use client";

import {
	Archive,
	Calendar,
	CheckCircle,
	Eye,
	Link2Off,
	MapPin,
	MoreHorizontal,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
	archiveAppointment,
	unlinkScheduleFromJob,
} from "@/actions/appointments";
import { updateSchedule } from "@/actions/schedules";
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
import {
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { useToast } from "@/hooks/use-toast";
import { TablePresets } from "@/lib/datatable/table-presets";

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

export function JobAppointmentsTable({
	appointments,
}: JobAppointmentsTableProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loadingAppointmentId, setLoadingAppointmentId] = useState<
		string | null
	>(null);
	const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
	const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
					// Server Action handles revalidation automatically
				} else {
					toast.error(result.error || "Failed to dispatch appointment");
				}
			} catch (_error) {
				toast.error("Failed to dispatch appointment");
			} finally {
				setLoadingAppointmentId(null);
			}
		},
		[router, toast],
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
					// Server Action handles revalidation automatically
				} else {
					toast.error(result.error || "Failed to mark as arrived");
				}
			} catch (_error) {
				toast.error("Failed to mark as arrived");
			} finally {
				setLoadingAppointmentId(null);
			}
		},
		[router, toast],
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
					duration = Math.round(
						(now.getTime() - startTime.getTime()) / (1000 * 60),
					);
				}

				const result = await updateSchedule(appointment.id, {
					actual_end_time: now,
					actual_duration: duration,
					status: "completed",
				});
				if (result.success) {
					toast.success("Appointment closed");
					// Server Action handles revalidation automatically
				} else {
					toast.error(result.error || "Failed to close appointment");
				}
			} catch (_error) {
				toast.error("Failed to close appointment");
			} finally {
				setLoadingAppointmentId(null);
			}
		},
		[router, toast],
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
		const variants: Record<
			string,
			"default" | "secondary" | "destructive" | "outline"
		> = {
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
						<div className="text-xs font-medium">
							{formatDate(appointment.start_time)}
						</div>
						<div className="text-muted-foreground text-xs">
							{formatTime(appointment.start_time)} -{" "}
							{formatTime(appointment.end_time)}
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
					<div className="text-xs">
						{appointment.dispatch_time ? (
							<div className="space-y-1">
								<div>{formatDate(appointment.dispatch_time)}</div>
								<div className="text-muted-foreground text-xs">
									{formatTime(appointment.dispatch_time)}
								</div>
							</div>
						) : (
							<span className="text-muted-foreground text-xs">
								Not dispatched
							</span>
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
					<div className="text-xs">
						{appointment.actual_start_time ? (
							<div className="space-y-1">
								<div>{formatDate(appointment.actual_start_time)}</div>
								<div className="text-muted-foreground text-xs">
									{formatTime(appointment.actual_start_time)}
								</div>
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
					<div className="text-xs">
						{appointment.actual_end_time ? (
							<div className="space-y-1">
								<div>{formatDate(appointment.actual_end_time)}</div>
								<div className="text-muted-foreground text-xs">
									{formatTime(appointment.actual_end_time)}
								</div>
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
					<span className="text-xs">
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
								<AvatarImage
									alt={assignedUser.name || ""}
									src={assignedUser.avatar || undefined}
								/>
								<AvatarFallback>
									{(assignedUser.name || "U")
										.split(" ")
										.map((n: string) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<span className="text-xs">
								{assignedUser.name || "Unassigned"}
							</span>
						</div>
					) : (
						<span className="text-muted-foreground text-xs">Unassigned</span>
					);
				},
			},
			{
				key: "status",
				header: "Status",
				width: "w-28",
				shrink: true,
				render: (appointment) =>
					getStatusBadge(appointment.status || "scheduled"),
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
					const canArrive =
						appointmentIsToday &&
						appointment.dispatch_time &&
						!appointment.actual_start_time;
					const canClose =
						appointmentIsToday &&
						appointment.actual_start_time &&
						!appointment.actual_end_time;

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
									className="bg-primary hover:bg-primary h-8 px-3 text-xs"
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
									className="bg-success hover:bg-success h-8 px-3 text-xs"
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
									className="bg-accent hover:bg-accent h-8 px-3 text-xs"
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
		],
	);

	const handleArchive = useCallback(async () => {
		if (selectedIds.length === 0) return;

		try {
			// Archive each appointment
			const results = await Promise.all(
				selectedIds.map((id) => archiveAppointment(id)),
			);

			// Check for failures
			const failed = results.filter((r) => !r.success);
			if (failed.length > 0) {
				toast({
					variant: "destructive",
					title: "Some appointments failed to archive",
					description: failed.map((r) => r.error).join(", "),
				});
			} else {
				toast({
					title: "Success",
					description: `${selectedIds.length} appointment(s) archived successfully`,
				});
				router.refresh(); // Refresh to show updated data
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to archive appointments",
			});
		} finally {
			setArchiveDialogOpen(false);
			setSelectedIds([]);
		}
	}, [selectedIds, toast, router]);

	const handleUnlink = useCallback(async () => {
		if (selectedIds.length === 0) return;

		try {
			// Unlink each appointment from the job
			const results = await Promise.all(
				selectedIds.map((id) => unlinkScheduleFromJob(id)),
			);

			// Check for failures
			const failed = results.filter((r) => !r.success);
			if (failed.length > 0) {
				toast({
					variant: "destructive",
					title: "Some appointments failed to unlink",
					description: failed.map((r) => r.error).join(", "),
				});
			} else {
				toast({
					title: "Success",
					description: `${selectedIds.length} appointment(s) unlinked from job successfully`,
				});
				router.refresh(); // Refresh to show updated data
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to unlink appointments",
			});
		} finally {
			setUnlinkDialogOpen(false);
			setSelectedIds([]);
		}
	}, [selectedIds, toast, router]);

	const toolbarActions = useMemo(
		() =>
			selectedIds.length > 0
				? [
						<Button
							key="archive"
							onClick={() => setArchiveDialogOpen(true)}
							size="sm"
							variant="outline"
						>
							<Archive className="mr-2 size-4" />
							Archive ({selectedIds.length})
						</Button>,
						<Button
							key="unlink"
							onClick={() => setUnlinkDialogOpen(true)}
							size="sm"
							variant="outline"
						>
							<Link2Off className="mr-2 size-4" />
							Unlink ({selectedIds.length})
						</Button>,
					]
				: [],
		[selectedIds],
	);

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.compact()}
				columns={columns}
				data={appointments}
				emptyIcon={<Calendar className="text-muted-foreground/50 size-12" />}
				emptyMessage="No appointments scheduled for this job"
				getItemId={(appointment) => appointment.id}
				noPadding={true}
				onSelectionChange={setSelectedIds}
				searchFilter={(appointment, query) => {
					const searchLower = query.toLowerCase();
					const assignedUserName = Array.isArray(appointment.assigned_user)
						? appointment.assigned_user[0]?.name || ""
						: appointment.assigned_user?.name || "";
					return (
						(appointment.title || "").toLowerCase().includes(searchLower) ||
						(appointment.description || "")
							.toLowerCase()
							.includes(searchLower) ||
						(appointment.status || "").toLowerCase().includes(searchLower) ||
						(appointment.type || "").toLowerCase().includes(searchLower) ||
						assignedUserName.toLowerCase().includes(searchLower)
					);
				}}
				searchPlaceholder="Search appointments..."
				showSelection={true}
				toolbarActions={toolbarActions}
			/>

			{/* Archive Dialog */}
			<AlertDialog onOpenChange={setArchiveDialogOpen} open={archiveDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Appointments?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to archive {selectedIds.length}{" "}
							appointment(s)? Archived appointments will be hidden from view but
							can be restored later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleArchive}>
							Archive
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Unlink Dialog */}
			<AlertDialog onOpenChange={setUnlinkDialogOpen} open={unlinkDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unlink Appointments?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to unlink {selectedIds.length}{" "}
							appointment(s) from this job? This will remove the association but
							the appointments will still exist in the schedule.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleUnlink}>Unlink</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
