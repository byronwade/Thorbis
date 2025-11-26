"use client";

import {
	Archive,
	Calendar,
	CheckCircle2,
	ChevronRight,
	Clock,
	Copy,
	ExternalLink,
	MapPin,
	MessageSquare,
	MoreHorizontal,
	Navigation,
	Phone,
	Send,
	Trash2,
	Truck,
	UserCheck,
	UserMinus,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	archiveAppointment,
	arriveAppointment,
	cancelAppointment,
	cancelJobAndAppointment,
	closeAppointment,
	completeAppointment,
	dispatchAppointment,
	sendOnMyWayNotification,
	unassignAppointment,
} from "@/actions/schedule-assignments";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import type { Job } from "./schedule-types";

type ScheduleJobContextMenuProps = {
	job: Job;
	children: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
};

// Status workflow order for visual display
const STATUS_ORDER = [
	"scheduled",
	"dispatched",
	"arrived",
	"in-progress",
	"closed",
	"completed",
];

// Get current status step for progress indicator
function getStatusStep(status: Job["status"]) {
	const idx = STATUS_ORDER.indexOf(status);
	return idx === -1 ? 0 : idx;
}

export function ScheduleJobContextMenu({
	job,
	children,
	onOpenChange,
}: ScheduleJobContextMenuProps) {
	const router = useRouter();
	const currentStep = getStatusStep(job.status);
	const isCancelled = job.status === "cancelled";
	const isClosed = job.status === "closed" || job.status === "completed";

	const handleAction = async (
		action: string,
		actionFn: (
			id: string,
			...args: unknown[]
		) => Promise<{ success: boolean; error?: string }>,
		...args: unknown[]
	) => {
		const toastId = toast.loading(`${action}...`);
		const result = await actionFn(job.id, ...args);

		if (result.success) {
			toast.success(`${action} successful`, { id: toastId });
		} else {
			toast.error(result.error || `Failed to ${action.toLowerCase()}`, {
				id: toastId,
			});
		}
	};

	const handleSendOnMyWay = async () => {
		if (!job.customer?.phone) {
			toast.error("Customer has no phone number");
			return;
		}
		const techName = job.assignments[0]?.displayName || "Your technician";
		const address = job.location?.address
			? `${job.location.address.street}, ${job.location.address.city}, ${job.location.address.state}`
			: undefined;

		toast.loading("Sending On My Way notification...");
		const result = await sendOnMyWayNotification(
			job.id,
			techName,
			job.customer.phone,
			address,
		);
		toast.dismiss();

		if (result.success) {
			toast.success("On My Way notification sent!");
		} else {
			toast.error(result.error || "Failed to send notification");
		}
	};

	return (
		<ContextMenu onOpenChange={onOpenChange}>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

			<ContextMenuContent className="w-64">
				{/* Header - Job Info */}
				<div className="px-2 py-2 border-b mb-1">
					<div className="flex items-center gap-2">
						<div
							className={cn(
								"size-2 rounded-full shrink-0",
								job.status === "scheduled" && "bg-blue-500",
								job.status === "dispatched" && "bg-sky-500",
								job.status === "arrived" && "bg-emerald-400",
								job.status === "in-progress" && "bg-amber-500 animate-pulse",
								job.status === "closed" && "bg-emerald-600",
								job.status === "completed" && "bg-emerald-600",
								job.status === "cancelled" && "bg-slate-400",
							)}
						/>
						<span className="text-sm font-semibold truncate flex-1">
							{job.customer?.name || "Unknown Customer"}
						</span>
					</div>
					<p className="text-xs text-muted-foreground mt-0.5 truncate pl-4">
						{job.title}
					</p>
				</div>

				{/* View Actions */}
				<ContextMenuLabel className="text-xs text-muted-foreground font-normal">
					View
				</ContextMenuLabel>
				<ContextMenuItem
					disabled={!job.jobId}
					onClick={() => {
						if (job.jobId) {
							router.push(`/dashboard/work/${job.jobId}`);
						}
					}}
				>
					<ExternalLink className="size-4" />
					<span>View Job Details</span>
					<ContextMenuShortcut>⌘O</ContextMenuShortcut>
				</ContextMenuItem>

				{job.location?.address && (
					<ContextMenuItem
						onClick={() => {
							const address = `${job.location?.address?.street}, ${job.location?.address?.city}, ${job.location?.address?.state}`;
							window.open(
								`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
								"_blank",
							);
						}}
					>
						<Navigation className="size-4" />
						<span>Open in Maps</span>
					</ContextMenuItem>
				)}

				<ContextMenuSeparator />

				{/* Status Progression */}
				<ContextMenuLabel className="text-xs text-muted-foreground font-normal">
					Update Status
				</ContextMenuLabel>

				{/* Progress indicator */}
				{!isCancelled && (
					<div className="px-2 py-1.5 mb-1">
						<div className="flex items-center gap-0.5">
							{STATUS_ORDER.slice(0, -1).map((status, idx) => (
								<div key={status} className="flex items-center flex-1">
									<div
										className={cn(
											"h-1 flex-1 rounded-full transition-colors",
											idx < currentStep
												? "bg-emerald-500"
												: idx === currentStep
													? "bg-blue-500"
													: "bg-muted",
										)}
									/>
								</div>
							))}
						</div>
						<p className="text-[10px] text-muted-foreground mt-1 text-center capitalize">
							Current: {job.status.replace("-", " ")}
						</p>
					</div>
				)}

				<ContextMenuItem
					disabled={currentStep >= 1 || isCancelled}
					onClick={() => handleAction("Dispatching", dispatchAppointment)}
				>
					<Truck className="size-4" />
					<span>Mark Dispatched</span>
					{currentStep >= 1 && !isCancelled && (
						<CheckCircle2 className="size-3.5 text-emerald-500 ml-auto" />
					)}
				</ContextMenuItem>

				{job.customer?.phone && (
					<ContextMenuItem
						disabled={currentStep >= 2 || isCancelled}
						onClick={handleSendOnMyWay}
						className="text-sky-600 dark:text-sky-400"
					>
						<Send className="size-4" />
						<span>Send "On My Way" SMS</span>
					</ContextMenuItem>
				)}

				<ContextMenuItem
					disabled={currentStep >= 2 || isCancelled}
					onClick={() => handleAction("Marking arrived", arriveAppointment)}
				>
					<MapPin className="size-4" />
					<span>Mark Arrived</span>
					{currentStep >= 2 && !isCancelled && (
						<CheckCircle2 className="size-3.5 text-emerald-500 ml-auto" />
					)}
				</ContextMenuItem>

				<ContextMenuItem
					disabled={currentStep >= 4 || isCancelled}
					onClick={() => handleAction("Closing", closeAppointment)}
				>
					<UserCheck className="size-4" />
					<span>Mark Closed</span>
					{currentStep >= 4 && !isCancelled && (
						<CheckCircle2 className="size-3.5 text-emerald-500 ml-auto" />
					)}
				</ContextMenuItem>

				<ContextMenuItem
					disabled={isClosed || isCancelled}
					onClick={() => handleAction("Completing", completeAppointment)}
				>
					<CheckCircle2 className="size-4" />
					<span>Mark Complete</span>
					{job.status === "completed" && (
						<CheckCircle2 className="size-3.5 text-emerald-500 ml-auto" />
					)}
				</ContextMenuItem>

				<ContextMenuSeparator />

				{/* Communication */}
				{(job.customer?.phone || job.customer?.email) && (
					<>
						<ContextMenuSub>
							<ContextMenuSubTrigger>
								<MessageSquare className="size-4" />
								<span>Contact Customer</span>
							</ContextMenuSubTrigger>
							<ContextMenuSubContent className="w-48">
								{job.customer?.phone && (
									<ContextMenuItem
										onClick={() => {
											window.location.href = `tel:${job.customer?.phone}`;
										}}
									>
										<Phone className="size-4" />
										<span>Call {job.customer.phone}</span>
									</ContextMenuItem>
								)}
								{job.customer?.phone && (
									<ContextMenuItem
										onClick={() => {
											window.location.href = `sms:${job.customer?.phone}`;
										}}
									>
										<MessageSquare className="size-4" />
										<span>Send SMS</span>
									</ContextMenuItem>
								)}
							</ContextMenuSubContent>
						</ContextMenuSub>
						<ContextMenuSeparator />
					</>
				)}

				{/* Scheduling Actions */}
				<ContextMenuLabel className="text-xs text-muted-foreground font-normal">
					Schedule
				</ContextMenuLabel>

				<ContextMenuItem>
					<Calendar className="size-4" />
					<span>Reschedule</span>
					<ContextMenuShortcut>⌘R</ContextMenuShortcut>
				</ContextMenuItem>

				<ContextMenuItem>
					<Copy className="size-4" />
					<span>Duplicate</span>
					<ContextMenuShortcut>⌘D</ContextMenuShortcut>
				</ContextMenuItem>

				<ContextMenuItem
					onClick={() =>
						handleAction("Moving to Unscheduled", unassignAppointment)
					}
				>
					<UserMinus className="size-4" />
					<span>Move to Unscheduled</span>
				</ContextMenuItem>

				<ContextMenuSeparator />

				{/* Danger Zone */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="text-destructive focus:text-destructive">
						<MoreHorizontal className="size-4" />
						<span>More Actions</span>
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className="w-56">
						<ContextMenuItem
							className="text-orange-600 focus:text-orange-600 dark:text-orange-400 dark:focus:text-orange-400"
							disabled={isCancelled}
							onClick={() =>
								handleAction("Cancelling appointment", cancelAppointment)
							}
						>
							<XCircle className="size-4" />
							<span>Cancel Appointment Only</span>
						</ContextMenuItem>

						<ContextMenuItem
							variant="destructive"
							disabled={isCancelled || !job.jobId}
							onClick={() =>
								handleAction("Cancelling job & appointment", (scheduleId) =>
									cancelJobAndAppointment(
										scheduleId as string,
										job.jobId ?? "",
									),
								)
							}
						>
							<Trash2 className="size-4" />
							<span>Cancel Job & Appointment</span>
						</ContextMenuItem>

						<ContextMenuSeparator />

						<ContextMenuItem
							variant="destructive"
							onClick={() => handleAction("Archiving", archiveAppointment)}
						>
							<Archive className="size-4" />
							<span>Archive</span>
						</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
			</ContextMenuContent>
		</ContextMenu>
	);
}
