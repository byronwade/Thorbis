"use client";

import { format, isToday, isTomorrow } from "date-fns";
import { Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Job } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";
import { JobCardMobile } from "./job-card-mobile";

/**
 * DayDetailBottomSheet - Shows all jobs for a specific day
 *
 * Triggered by tapping a day cell in the month view.
 * Displays:
 * - Day header with date
 * - All jobs for that day
 * - Actions: Create appointment, View day schedule
 */

type DayDetailBottomSheetProps = {
	date: Date | null;
	jobs: Job[];
	isOpen: boolean;
	onClose: () => void;
	onJobTap: (job: Job) => void;
	onAction: (action: string, date: Date) => void;
};

export function DayDetailBottomSheet({
	date,
	jobs,
	isOpen,
	onClose,
	onJobTap,
	onAction,
}: DayDetailBottomSheetProps) {
	if (!date) return null;

	// Format date display
	const dateDisplay = (() => {
		if (isToday(date)) return "Today";
		if (isTomorrow(date)) return "Tomorrow";
		return format(date, "EEEE, MMMM d");
	})();

	const totalHours = jobs.reduce((sum, job) => {
		if (!job.scheduled_start || !job.scheduled_end) return sum;
		const start = new Date(job.scheduled_start);
		const end = new Date(job.scheduled_end);
		return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
	}, 0);

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
						<div className="flex items-center gap-2 mb-1">
							<Calendar className="h-5 w-5 text-primary" />
							<h2 className="text-lg font-semibold">{dateDisplay}</h2>
						</div>
						<p className="text-sm text-muted-foreground">
							{format(date, "MMMM d, yyyy")}
						</p>
						{jobs.length > 0 && (
							<p className="text-xs text-muted-foreground mt-1">
								{jobs.length} {jobs.length === 1 ? "job" : "jobs"} ·{" "}
								{totalHours.toFixed(1)}h total
							</p>
						)}
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

				{/* Content */}
				<ScrollArea
					className="flex-1"
					style={{ maxHeight: "calc(85vh - 200px)" }}
				>
					<div className="p-4">
						{jobs.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" />
								<p className="text-sm font-medium mb-1">No jobs scheduled</p>
								<p className="text-xs text-muted-foreground mb-4">
									Schedule an appointment for this day
								</p>
								<Button
									onClick={() => {
										onAction("create_appointment", date);
									}}
									size="sm"
									variant="default"
								>
									<Plus className="h-4 w-4 mr-2" />
									New Appointment
								</Button>
							</div>
						) : (
							<div className="space-y-2">
								{jobs.map((job) => (
									<JobCardMobile
										job={job}
										key={job.id}
										onClick={() => onJobTap(job)}
										showDate={false}
										showTechnician={true}
									/>
								))}
							</div>
						)}
					</div>
				</ScrollArea>

				{/* Actions */}
				{jobs.length > 0 && (
					<div className="border-t bg-muted/30 p-4 safe-bottom">
						<div className="flex gap-2">
							<Button
								className="flex-1"
								onClick={() => {
									onAction("create_appointment", date);
								}}
								size="default"
								variant="outline"
							>
								<Plus className="h-4 w-4 mr-2" />
								New Appointment
							</Button>
							<Button
								className="flex-1"
								onClick={() => {
									onAction("view_day", date);
								}}
								size="default"
								variant="default"
							>
								<Calendar className="h-4 w-4 mr-2" />
								View Day Schedule
							</Button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
