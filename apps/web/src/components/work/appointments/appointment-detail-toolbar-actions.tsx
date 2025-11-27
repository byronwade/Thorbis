"use client";

/**
 * Appointment Detail Toolbar Actions - Client Component
 *
 * Provides appointment-specific toolbar actions:
 * - Status update dropdown (inline)
 * - Link to Job (assign/reassign) with job selection dialog
 * - Reschedule with date/time picker dialog
 * - Copy/Clone
 * - Archive with confirmation
 *
 * Design: Clean, compact, outline variant buttons
 */

import { Archive, Briefcase, Calendar, Copy, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	archiveAppointment,
	linkAppointmentToJob,
	rescheduleAppointmentSimple,
	updateAppointmentStatus,
} from "@/actions/appointments";
import { StatusUpdateDropdown } from "@/components/work/shared/quick-actions/status-update-dropdown";
import { ImportExportDropdownLazy as ImportExportDropdown } from "@/components/data/import-export-dropdown-lazy";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

type Job = {
	id: string;
	title: string;
	status: string;
	customer?: { name: string } | null;
};

type AppointmentDetailToolbarActionsProps = {
	/** Appointment data for status and actions */
	appointment?: {
		id: string;
		status?: string;
		scheduled_start?: string;
		scheduled_end?: string;
		job_id?: string | null;
	};
};

export function AppointmentDetailToolbarActions({
	appointment,
}: AppointmentDetailToolbarActionsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const appointmentId = appointment?.id || pathname?.split("/").pop() || "";

	// Dialog states
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);
	const [isLinkJobDialogOpen, setIsLinkJobDialogOpen] = useState(false);
	const [isLinkingJob, setIsLinkingJob] = useState(false);
	const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
	const [isRescheduling, setIsRescheduling] = useState(false);

	// Link to Job state
	const [jobSearchQuery, setJobSearchQuery] = useState("");
	const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
	const [isLoadingJobs, setIsLoadingJobs] = useState(false);

	// Reschedule state
	const [rescheduleStart, setRescheduleStart] = useState("");
	const [rescheduleEnd, setRescheduleEnd] = useState("");
	const [rescheduleReason, setRescheduleReason] = useState("");

	/**
	 * Load available jobs for linking
	 */
	const loadAvailableJobs = useCallback(async (search?: string) => {
		setIsLoadingJobs(true);
		try {
			const supabase = createClient();
			let query = supabase
				.from("jobs")
				.select("id, title, status, customer:customers(name)")
				.in("status", ["pending", "scheduled", "in_progress"])
				.order("created_at", { ascending: false })
				.limit(20);

			if (search && search.trim()) {
				query = query.ilike("title", `%${search}%`);
			}

			const { data, error } = await query;
			if (error) throw error;
			setAvailableJobs(data || []);
		} catch (error) {
			console.error("Failed to load jobs:", error);
			toast.error("Failed to load available jobs");
		} finally {
			setIsLoadingJobs(false);
		}
	}, [toast]);

	// Load jobs when dialog opens
	useEffect(() => {
		if (isLinkJobDialogOpen) {
			loadAvailableJobs();
		}
	}, [isLinkJobDialogOpen, loadAvailableJobs]);

	// Initialize reschedule form with current values
	useEffect(() => {
		if (isRescheduleDialogOpen && appointment) {
			if (appointment.scheduled_start) {
				// Convert to datetime-local format
				const startDate = new Date(appointment.scheduled_start);
				setRescheduleStart(startDate.toISOString().slice(0, 16));
			}
			if (appointment.scheduled_end) {
				const endDate = new Date(appointment.scheduled_end);
				setRescheduleEnd(endDate.toISOString().slice(0, 16));
			}
			setRescheduleReason("");
		}
	}, [isRescheduleDialogOpen, appointment]);

	/**
	 * Handle appointment status update via server action
	 */
	const handleStatusChange = async (
		entityId: string,
		newStatus: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const result = await updateAppointmentStatus(entityId, newStatus);
			return {
				success: result.success,
				error: result.error,
			};
		} catch (error) {
			console.error("Appointment status update error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to update status",
			};
		}
	};

	/**
	 * Handle linking appointment to a job
	 */
	const handleLinkToJob = async () => {
		if (!appointmentId) {
			toast.error("Appointment ID not found");
			return;
		}
		if (!selectedJobId) {
			toast.error("Please select a job");
			return;
		}

		setIsLinkingJob(true);
		try {
			const result = await linkAppointmentToJob(appointmentId, selectedJobId);
			if (result.success) {
				toast.success("Appointment linked to job successfully");
				setIsLinkJobDialogOpen(false);
				setSelectedJobId(null);
				setJobSearchQuery("");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to link appointment to job");
			}
		} catch (_error) {
			toast.error("Failed to link appointment to job");
		} finally {
			setIsLinkingJob(false);
		}
	};

	/**
	 * Handle rescheduling the appointment
	 */
	const handleReschedule = async () => {
		if (!appointmentId) {
			toast.error("Appointment ID not found");
			return;
		}
		if (!rescheduleStart || !rescheduleEnd) {
			toast.error("Please select start and end times");
			return;
		}

		// Validate end is after start
		if (new Date(rescheduleEnd) <= new Date(rescheduleStart)) {
			toast.error("End time must be after start time");
			return;
		}

		setIsRescheduling(true);
		try {
			const result = await rescheduleAppointmentSimple(
				appointmentId,
				new Date(rescheduleStart).toISOString(),
				new Date(rescheduleEnd).toISOString(),
				rescheduleReason || undefined
			);
			if (result.success) {
				toast.success("Appointment rescheduled successfully");
				setIsRescheduleDialogOpen(false);
				setRescheduleReason("");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to reschedule appointment");
			}
		} catch (_error) {
			toast.error("Failed to reschedule appointment");
		} finally {
			setIsRescheduling(false);
		}
	};

	/**
	 * Handle archiving the appointment
	 */
	const handleArchive = async () => {
		if (!appointmentId) {
			toast.error("Appointment ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveAppointment(appointmentId);
			if (result.success) {
				toast.success("Appointment archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/appointments");
			} else {
				toast.error(result.error || "Failed to archive appointment");
			}
		} catch (_error) {
			toast.error("Failed to archive appointment");
		} finally {
			setIsArchiving(false);
		}
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Status Update Dropdown - First Position */}
				{appointment?.status && appointmentId && (
					<StatusUpdateDropdown
						currentStatus={appointment.status}
						entityId={appointmentId}
						entityType="appointment"
						onStatusChange={handleStatusChange}
						size="sm"
					/>
				)}

				{/* Quick Actions */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5"
								onClick={() => setIsLinkJobDialogOpen(true)}
								size="sm"
								variant="outline"
							>
								<Briefcase className="size-3.5" />
								<span className="hidden md:inline">
									{appointment?.job_id ? "Change Job" : "Link to Job"}
								</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{appointment?.job_id ? "Reassign to different job" : "Assign to existing job"}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5"
								onClick={() => setIsRescheduleDialogOpen(true)}
								size="sm"
								variant="outline"
							>
								<Calendar className="size-3.5" />
								<span className="hidden lg:inline">Reschedule</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Reschedule appointment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								asChild
								className="h-8 gap-1.5"
								size="sm"
								variant="outline"
							>
								<a
									href={`/dashboard/work/appointments/new?cloneFrom=${appointmentId}`}
								>
									<Copy className="size-3.5" />
									<span className="hidden lg:inline">Copy</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate appointment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Archive Button */}
				<Separator className="h-6" orientation="vertical" />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="border-destructive/40 text-destructive hover:bg-destructive/10 h-8 gap-1.5"
								onClick={() => setIsArchiveDialogOpen(true)}
								size="sm"
								variant="outline"
							>
								<Archive className="size-3.5" />
								<span className="hidden lg:inline">Archive</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Archive appointment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Ellipsis Menu */}
				<Separator className="h-6" orientation="vertical" />
				<ImportExportDropdown dataType="schedule" />
			</div>

			{/* Archive Confirmation Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Appointment</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this appointment? Archived
							appointments can be restored within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isArchiving}
							onClick={() => setIsArchiveDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isArchiving}
							onClick={handleArchive}
							variant="destructive"
						>
							{isArchiving ? "Archiving..." : "Archive Appointment"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Link to Job Dialog */}
			<Dialog onOpenChange={setIsLinkJobDialogOpen} open={isLinkJobDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{appointment?.job_id ? "Change Linked Job" : "Link to Job"}
						</DialogTitle>
						<DialogDescription>
							{appointment?.job_id
								? "Select a different job to link this appointment to."
								: "Select a job to link this appointment to."}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						{/* Search Input */}
						<div className="relative">
							<Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
							<Input
								className="pl-9"
								onChange={(e) => {
									setJobSearchQuery(e.target.value);
									loadAvailableJobs(e.target.value);
								}}
								placeholder="Search jobs..."
								value={jobSearchQuery}
							/>
						</div>

						{/* Job List */}
						<div className="max-h-60 space-y-2 overflow-y-auto">
							{isLoadingJobs ? (
								<p className="text-muted-foreground py-4 text-center text-sm">
									Loading jobs...
								</p>
							) : availableJobs.length === 0 ? (
								<p className="text-muted-foreground py-4 text-center text-sm">
									No active jobs found
								</p>
							) : (
								availableJobs.map((job) => (
									<button
										className={`w-full rounded-md border p-3 text-left transition-colors ${
											selectedJobId === job.id
												? "border-primary bg-primary/5"
												: "hover:bg-muted/50"
										}`}
										key={job.id}
										onClick={() => setSelectedJobId(job.id)}
										type="button"
									>
										<div className="font-medium">{job.title}</div>
										<div className="text-muted-foreground text-sm">
											{job.customer?.name || "No customer"} • {job.status}
										</div>
									</button>
								))
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							disabled={isLinkingJob}
							onClick={() => {
								setIsLinkJobDialogOpen(false);
								setSelectedJobId(null);
								setJobSearchQuery("");
							}}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isLinkingJob || !selectedJobId}
							onClick={handleLinkToJob}
						>
							{isLinkingJob ? "Linking..." : "Link to Job"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Reschedule Dialog */}
			<Dialog onOpenChange={setIsRescheduleDialogOpen} open={isRescheduleDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Reschedule Appointment</DialogTitle>
						<DialogDescription>
							Select new start and end times for this appointment.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="reschedule-start">Start Time</Label>
							<Input
								id="reschedule-start"
								onChange={(e) => setRescheduleStart(e.target.value)}
								type="datetime-local"
								value={rescheduleStart}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="reschedule-end">End Time</Label>
							<Input
								id="reschedule-end"
								onChange={(e) => setRescheduleEnd(e.target.value)}
								type="datetime-local"
								value={rescheduleEnd}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="reschedule-reason">Reason (optional)</Label>
							<Textarea
								id="reschedule-reason"
								onChange={(e) => setRescheduleReason(e.target.value)}
								placeholder="Customer request, scheduling conflict, etc."
								rows={2}
								value={rescheduleReason}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							disabled={isRescheduling}
							onClick={() => {
								setIsRescheduleDialogOpen(false);
								setRescheduleReason("");
							}}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isRescheduling || !rescheduleStart || !rescheduleEnd}
							onClick={handleReschedule}
						>
							{isRescheduling ? "Rescheduling..." : "Reschedule"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
