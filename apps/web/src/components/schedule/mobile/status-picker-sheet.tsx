"use client";

import {
	Calendar,
	CheckCircle,
	CheckCircle2,
	Clock,
	MapPin,
	Navigation,
	Truck,
	X,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Job } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";

/**
 * StatusPickerSheet - Status selection for job workflow
 *
 * Features:
 * - Visual status options with icons and colors
 * - Status descriptions for clarity
 * - Workflow suggestions (next logical status)
 * - Touch-friendly 64px+ buttons
 * - Disabled states for invalid transitions
 */

type StatusPickerSheetProps = {
	job: Job | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (job: Job, newStatus: string) => void;
};

// Status configuration
const STATUS_OPTIONS = [
	{
		id: "unscheduled",
		label: "Unscheduled",
		icon: Clock,
		color: "bg-gray-500",
		borderColor: "border-gray-500",
		description: "No date/time assigned",
	},
	{
		id: "scheduled",
		label: "Scheduled",
		icon: Calendar,
		color: "bg-blue-500",
		borderColor: "border-blue-500",
		description: "Date and time confirmed",
	},
	{
		id: "dispatched",
		label: "Dispatched",
		icon: Truck,
		color: "bg-sky-500",
		borderColor: "border-sky-500",
		description: "Technician on the way",
	},
	{
		id: "arrived",
		label: "Arrived",
		icon: MapPin,
		color: "bg-emerald-400",
		borderColor: "border-emerald-400",
		description: "Technician at location",
	},
	{
		id: "in_progress",
		label: "In Progress",
		icon: Navigation,
		color: "bg-amber-500 animate-pulse",
		borderColor: "border-amber-500",
		description: "Work actively underway",
	},
	{
		id: "closed",
		label: "Closed",
		icon: CheckCircle,
		color: "bg-emerald-600",
		borderColor: "border-emerald-600",
		description: "Work completed, awaiting review",
	},
	{
		id: "completed",
		label: "Completed",
		icon: CheckCircle2,
		color: "bg-green-700",
		borderColor: "border-green-700",
		description: "Fully complete and approved",
	},
	{
		id: "cancelled",
		label: "Cancelled",
		icon: XCircle,
		color: "bg-red-500",
		borderColor: "border-red-500",
		description: "Job cancelled or abandoned",
	},
] as const;

// Workflow logic: what statuses make sense from current status
const getValidTransitions = (currentStatus?: string): string[] => {
	const status = currentStatus?.toLowerCase() || "unscheduled";

	switch (status) {
		case "unscheduled":
			return ["scheduled"];
		case "scheduled":
			return ["dispatched", "cancelled"];
		case "dispatched":
			return ["arrived", "scheduled", "cancelled"];
		case "arrived":
			return ["in_progress", "dispatched", "cancelled"];
		case "in_progress":
			return ["closed", "arrived"];
		case "closed":
			return ["completed", "in_progress"];
		case "completed":
			return []; // Terminal state
		case "cancelled":
			return ["scheduled"]; // Can re-schedule
		default:
			return ["scheduled"];
	}
};

export function StatusPickerSheet({
	job,
	isOpen,
	onClose,
	onConfirm,
}: StatusPickerSheetProps) {
	const [selectedStatus, setSelectedStatus] = useState<string | null>(
		job?.status?.toLowerCase() || null,
	);

	const currentStatus = job?.status?.toLowerCase() || "unscheduled";
	const validTransitions = getValidTransitions(currentStatus);

	const handleConfirm = () => {
		if (!job || !selectedStatus) return;
		onConfirm(job, selectedStatus);
		onClose();
	};

	if (!job) return null;

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 animate-in fade-in"
					onClick={onClose}
				/>
			)}

			{/* Bottom Sheet */}
			<div
				className={cn(
					"fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl",
					"transform transition-transform duration-300 ease-out",
					isOpen ? "translate-y-0" : "translate-y-full",
				)}
				style={{ maxHeight: "85vh" }}
			>
				{/* Drag Handle */}
				<div className="flex justify-center pt-3 pb-2">
					<div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
				</div>

				{/* Header */}
				<div className="flex items-start justify-between gap-3 px-4 pb-4 border-b">
					<div className="flex-1">
						<h2 className="text-lg font-semibold mb-1">Change Status</h2>
						<p className="text-sm text-muted-foreground">
							{job.customer?.name || "Unknown Customer"}
						</p>
						<p className="text-xs text-muted-foreground capitalize">
							Current: {currentStatus.replace(/_/g, " ")}
						</p>
					</div>

					{/* Close button */}
					<Button
						className="h-9 w-9 shrink-0"
						onClick={onClose}
						size="icon"
						variant="ghost"
					>
						<X className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</Button>
				</div>

				{/* Status Options */}
				<ScrollArea
					className="flex-1"
					style={{ maxHeight: "calc(85vh - 220px)" }}
				>
					<div className="p-4 space-y-3">
						{/* Suggested next statuses */}
						{validTransitions.length > 0 && (
							<div className="mb-4">
								<p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
									Suggested Next Steps
								</p>
							</div>
						)}

						{STATUS_OPTIONS.map((statusOption) => {
							const isSelected = selectedStatus === statusOption.id;
							const isCurrent = currentStatus === statusOption.id;
							const isValid = validTransitions.includes(statusOption.id);
							const isSuggested = isValid && !isCurrent;
							const isDisabled =
								isCurrent || (!isValid && validTransitions.length > 0);

							const StatusIcon = statusOption.icon;

							return (
								<button
									className={cn(
										"flex w-full items-start gap-3 rounded-lg border-2 p-4 transition-all text-left",
										isDisabled
											? "opacity-50 cursor-not-allowed"
											: "hover:border-primary/50 active:scale-98",
										isSelected && !isDisabled && "border-primary bg-primary/5",
										isSuggested &&
											!isSelected &&
											"border-green-500/30 bg-green-50 dark:bg-green-950/20",
										isCurrent && "border-muted-foreground bg-muted",
										!isSelected &&
											!isSuggested &&
											!isCurrent &&
											"border-border",
									)}
									disabled={isDisabled}
									key={statusOption.id}
									onClick={() =>
										!isDisabled && setSelectedStatus(statusOption.id)
									}
									type="button"
								>
									{/* Icon */}
									<div
										className={cn(
											"flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
											statusOption.color,
											isDisabled && "opacity-50",
										)}
									>
										<StatusIcon className="h-6 w-6 text-white" />
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<p className="text-base font-semibold">
												{statusOption.label}
											</p>
											{isCurrent && (
												<span className="text-[10px] px-2 py-0.5 bg-muted-foreground/20 rounded-full font-medium">
													Current
												</span>
											)}
											{isSuggested && !isSelected && (
												<span className="text-[10px] px-2 py-0.5 bg-green-500 text-white rounded-full font-medium">
													Recommended
												</span>
											)}
										</div>
										<p className="text-xs text-muted-foreground">
											{statusOption.description}
										</p>
									</div>

									{/* Selection indicator */}
									{isSelected && !isDisabled && (
										<div className="flex shrink-0 items-center justify-center h-6 w-6 rounded-full bg-primary">
											<CheckCircle className="h-4 w-4 text-primary-foreground" />
										</div>
									)}
								</button>
							);
						})}

						{/* All other statuses */}
						{validTransitions.length > 0 && (
							<div className="pt-4 border-t">
								<p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
									Other Statuses
								</p>
								<p className="text-xs text-muted-foreground mb-3">
									These transitions may not be typical for the current workflow
								</p>
							</div>
						)}
					</div>
				</ScrollArea>

				{/* Actions */}
				<div className="border-t bg-muted/30 p-4 safe-bottom">
					<div className="flex gap-2">
						<Button
							className="flex-1 h-12"
							onClick={onClose}
							size="lg"
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							className="flex-1 h-12"
							disabled={!selectedStatus || selectedStatus === currentStatus}
							onClick={handleConfirm}
							size="lg"
							variant="default"
						>
							Update Status
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
