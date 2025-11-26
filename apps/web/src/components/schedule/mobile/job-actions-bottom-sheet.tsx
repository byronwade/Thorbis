"use client";

import { format } from "date-fns";
import {
	ArrowRight,
	Calendar,
	CheckCircle2,
	Clock,
	MapPin,
	Navigation,
	Repeat,
	Trash2,
	User,
	Users,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";
import { ReschedulePickerSheet } from "./reschedule-picker-sheet";
import { StatusPickerSheet } from "./status-picker-sheet";
import { TechnicianPickerSheet } from "./technician-picker-sheet";

/**
 * JobActionsBottomSheet - Mobile bottom drawer for job actions
 *
 * Replaces desktop context menus and drag-and-drop interactions.
 * Provides large touch-friendly buttons for all job actions.
 *
 * Design:
 * - Slides up from bottom (native iOS/Android pattern)
 * - Backdrop dims background
 * - Swipe down to dismiss
 * - Large action buttons (56px height minimum)
 * - Context-aware actions (only show relevant actions based on status)
 * - Nested pickers for reschedule/reassign/status changes
 *
 * Actions:
 * - View Details: Navigate to full job page
 * - Dispatch: Change status to dispatched
 * - Arrive: Change status to arrived
 * - Start: Change status to in progress
 * - Complete: Change status to completed
 * - Reschedule: Open date/time picker (nested)
 * - Reassign: Open technician picker (nested)
 * - Move to Status: Open status picker (nested)
 * - Cancel Job: Confirmation modal + change to cancelled
 *
 * Props:
 * - isOpen: Controls visibility
 * - onClose: Callback to close sheet
 * - job: Job data to display
 * - onAction: Callback when action is selected
 */

type JobAction =
	| "view_details"
	| "dispatch"
	| "arrive"
	| "start"
	| "complete"
	| "reschedule"
	| "reassign"
	| "move_to_status"
	| "cancel";

type JobActionsBottomSheetProps = {
	isOpen: boolean;
	onClose: () => void;
	job: Job | null;
	onAction: (action: string, job: Job, ...args: any[]) => void;
};

// Animation duration (must match CSS transition)
const ANIMATION_DURATION = 300;

export function JobActionsBottomSheet({
	isOpen,
	onClose,
	job,
	onAction,
}: JobActionsBottomSheetProps) {
	const [isClosing, setIsClosing] = useState(false);
	const [activePickerJob, setActivePickerJob] = useState<Job | null>(null);
	const [activePicker, setActivePicker] = useState<
		"reschedule" | "reassign" | "status" | null
	>(null);
	const sheetRef = useRef<HTMLDivElement>(null);

	// Handle closing animation
	const handleClose = useCallback(() => {
		setIsClosing(true);
		setTimeout(() => {
			onClose();
			setIsClosing(false);
		}, ANIMATION_DURATION);
	}, [onClose]);

	// Close on backdrop click
	useEffect(() => {
		const handleBackdropClick = (event: MouseEvent) => {
			if (
				sheetRef.current &&
				!sheetRef.current.contains(event.target as Node)
			) {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleBackdropClick);
		}

		return () => {
			document.removeEventListener("mousedown", handleBackdropClick);
		};
	}, [isOpen, handleClose]);

	// Close on escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, handleClose]);

	// Reset picker state when main sheet opens/closes
	useEffect(() => {
		if (!isOpen) {
			setActivePicker(null);
			setActivePickerJob(null);
		}
	}, [isOpen]);

	// Handle action button clicks
	const handleActionClick = useCallback(
		(action: JobAction, currentJob: Job) => {
			// For actions that need a picker, open the picker instead of directly calling onAction
			if (action === "reschedule") {
				setActivePickerJob(currentJob);
				setActivePicker("reschedule");
				return;
			}

			if (action === "reassign") {
				setActivePickerJob(currentJob);
				setActivePicker("reassign");
				return;
			}

			if (action === "move_to_status") {
				setActivePickerJob(currentJob);
				setActivePicker("status");
				return;
			}

			// For direct actions, call onAction immediately
			onAction(action, currentJob);
			handleClose();
		},
		[onAction, handleClose],
	);

	// Handle picker confirmations
	const handleRescheduleConfirm = useCallback(
		(currentJob: Job, newStart: Date, newEnd: Date) => {
			onAction("reschedule", currentJob, newStart, newEnd);
			setActivePicker(null);
			setActivePickerJob(null);
			handleClose();
		},
		[onAction, handleClose],
	);

	const handleReassignConfirm = useCallback(
		(currentJob: Job, technicianId: string | null) => {
			onAction("reassign", currentJob, technicianId);
			setActivePicker(null);
			setActivePickerJob(null);
			handleClose();
		},
		[onAction, handleClose],
	);

	const handleStatusConfirm = useCallback(
		(currentJob: Job, newStatus: string) => {
			onAction("move_to_status", currentJob, newStatus);
			setActivePicker(null);
			setActivePickerJob(null);
			handleClose();
		},
		[onAction, handleClose],
	);

	const handlePickerClose = useCallback(() => {
		setActivePicker(null);
		setActivePickerJob(null);
	}, []);

	if (!isOpen && !isClosing) {
		return null;
	}

	if (!job) {
		return null;
	}

	// Get current status
	const status = (job.status?.toLowerCase().replace(/ /g, "_") ||
		"unscheduled") as string;

	// Determine which actions to show based on current status
	const availableActions: JobAction[] = [];

	// Status-specific actions
	if (status === "scheduled") {
		availableActions.push("dispatch");
	}
	if (status === "dispatched") {
		availableActions.push("arrive");
	}
	if (status === "arrived") {
		availableActions.push("start");
	}
	if (status === "in_progress") {
		availableActions.push("complete");
	}

	// Always available actions
	availableActions.push("reschedule", "reassign", "move_to_status");

	// Cancel action (always last)
	if (status !== "cancelled" && status !== "completed") {
		availableActions.push("cancel");
	}

	// Always show view details
	availableActions.unshift("view_details");

	// Format job details
	const customerName = job.customer?.name || "No Customer";
	const propertyAddress = job.location?.address?.street || "No location";
	const startTime = job.startTime
		? format(new Date(job.startTime), "MMM d, h:mm a")
		: "Not scheduled";
	const endTime = job.endTime ? format(new Date(job.endTime), "h:mm a") : "";
	const timeDisplay = endTime ? `${startTime} - ${endTime}` : startTime;

	// Get primary technician from assignments
	const primaryAssignment = job.assignments.find((a) => a.role === "primary");
	const techInitials = primaryAssignment?.displayName
		? primaryAssignment.displayName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "?";

	// Calculate duration
	const duration =
		job.startTime && job.endTime
			? Math.round(
					(new Date(job.endTime).getTime() -
						new Date(job.startTime).getTime()) /
						(1000 * 60 * 60),
				)
			: 0;

	// Action button configuration
	const actionConfig: Record<
		JobAction,
		{
			icon: React.ElementType;
			label: string;
			variant?: "default" | "destructive";
		}
	> = {
		view_details: { icon: ArrowRight, label: "View Full Details" },
		dispatch: { icon: Navigation, label: "Dispatch Job" },
		arrive: { icon: MapPin, label: "Mark as Arrived" },
		start: { icon: Clock, label: "Start Job" },
		complete: { icon: CheckCircle2, label: "Mark as Complete" },
		reschedule: { icon: Calendar, label: "Reschedule" },
		reassign: { icon: Users, label: "Reassign Technician" },
		move_to_status: { icon: Repeat, label: "Move to Status..." },
		cancel: { icon: Trash2, label: "Cancel Job", variant: "destructive" },
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className={cn(
					"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
					isClosing
						? "animate-out fade-out duration-300"
						: "animate-in fade-in duration-300",
				)}
			/>

			{/* Bottom Sheet */}
			<div
				className={cn(
					"safe-bottom fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border bg-background shadow-2xl",
					isClosing
						? "animate-out slide-out-to-bottom duration-300"
						: "animate-in slide-in-from-bottom duration-300",
				)}
				ref={sheetRef}
			>
				{/* Handle indicator */}
				<div className="flex justify-center py-4">
					<div className="h-1.5 w-10 rounded-full bg-muted" />
				</div>

				{/* Scrollable content */}
				<div className="max-h-[80vh] overflow-y-auto px-6 pb-6">
					{/* Header: Close button */}
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">Job Actions</h2>
						<Button
							className="h-9 w-9"
							onClick={handleClose}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</div>

					{/* Job Summary */}
					<div className="mb-6 space-y-3 rounded-lg border bg-muted/50 p-4">
						{/* Customer & Title */}
						<div>
							<h3 className="text-base font-medium leading-tight">
								{customerName}
							</h3>
							<p className="text-sm text-muted-foreground mt-0.5">
								{job.title || "Untitled Job"}
							</p>
						</div>

						{/* Details grid */}
						<div className="space-y-2 text-sm">
							{/* Time */}
							<div className="flex items-start gap-2">
								<Clock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
								<div>
									<p className="font-medium">{timeDisplay}</p>
									{duration > 0 && (
										<p className="text-xs text-muted-foreground">
											{duration} {duration === 1 ? "hour" : "hours"}
										</p>
									)}
								</div>
							</div>

							{/* Location */}
							{propertyAddress !== "No location" && (
								<div className="flex items-start gap-2">
									<MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
									<p>{propertyAddress}</p>
								</div>
							)}

							{/* Assigned Technician */}
							<div className="flex items-center gap-2">
								<User className="h-4 w-4 shrink-0 text-muted-foreground" />
								<div className="flex items-center gap-2">
									<Avatar className="h-6 w-6">
										<AvatarImage
											alt={primaryAssignment?.displayName || "Unassigned"}
											src={primaryAssignment?.avatar || undefined}
										/>
										<AvatarFallback className="text-xs">
											{techInitials}
										</AvatarFallback>
									</Avatar>
									<span className="font-medium">
										{primaryAssignment?.displayName || "Unassigned"}
									</span>
								</div>
							</div>

							{/* Status Badge */}
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="capitalize">
									{job.status || "Unscheduled"}
								</Badge>
							</div>
						</div>

						{/* Description (if exists) */}
						{job.description && (
							<div className="pt-2 border-t">
								<p className="text-sm text-muted-foreground line-clamp-2">
									{job.description}
								</p>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground mb-3">
							Actions
						</h3>

						{availableActions.map((action) => {
							const config = actionConfig[action];
							const Icon = config.icon;
							const isDestructive = config.variant === "destructive";

							return (
								<Button
									className={cn(
										"h-14 w-full justify-start gap-3 text-base font-medium",
										isDestructive && "text-destructive hover:text-destructive",
									)}
									key={action}
									onClick={() => handleActionClick(action, job)}
									variant={isDestructive ? "ghost" : "outline"}
								>
									<Icon className="h-5 w-5" />
									{config.label}
								</Button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Nested Picker Sheets */}
			<ReschedulePickerSheet
				isOpen={activePicker === "reschedule"}
				job={activePickerJob}
				onClose={handlePickerClose}
				onConfirm={handleRescheduleConfirm}
			/>

			<TechnicianPickerSheet
				isOpen={activePicker === "reassign"}
				job={activePickerJob}
				onClose={handlePickerClose}
				onConfirm={handleReassignConfirm}
			/>

			<StatusPickerSheet
				isOpen={activePicker === "status"}
				job={activePickerJob}
				onClose={handlePickerClose}
				onConfirm={handleStatusConfirm}
			/>
		</>
	);
}
