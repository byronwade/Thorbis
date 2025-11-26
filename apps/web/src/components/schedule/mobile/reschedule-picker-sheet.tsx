"use client";

import { addDays, format, setHours, setMinutes, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Job } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";

/**
 * ReschedulePickerSheet - Date and time picker for rescheduling jobs
 *
 * Features:
 * - Calendar date picker
 * - Time slot selection (30-minute intervals)
 * - Duration estimation based on job type
 * - Visual feedback for selected date/time
 * - Touch-friendly 56px+ buttons
 */

type ReschedulePickerSheetProps = {
	job: Job | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (job: Job, newStart: Date, newEnd: Date) => void;
};

// Generate time slots in 30-minute intervals
const generateTimeSlots = () => {
	const slots: { label: string; time: string }[] = [];
	for (let hour = 0; hour < 24; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
			const date = new Date();
			date.setHours(hour, minute, 0, 0);
			slots.push({
				label: format(date, "h:mm a"),
				time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
			});
		}
	}
	return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Business hours shortcuts (6am - 6pm)
const BUSINESS_HOURS = TIME_SLOTS.filter((slot) => {
	const [hour] = slot.time.split(":").map(Number);
	return hour >= 6 && hour < 18;
});

export function ReschedulePickerSheet({
	job,
	isOpen,
	onClose,
	onConfirm,
}: ReschedulePickerSheetProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		job?.scheduled_start ? new Date(job.scheduled_start) : new Date(),
	);
	const [selectedTime, setSelectedTime] = useState<string>(
		job?.scheduled_start
			? format(new Date(job.scheduled_start), "HH:mm")
			: "09:00",
	);
	const [showAllHours, setShowAllHours] = useState(false);

	// Estimate duration based on job type or use actual duration
	const estimatedDuration = useMemo(() => {
		if (job?.scheduled_start && job?.scheduled_end) {
			const start = new Date(job.scheduled_start);
			const end = new Date(job.scheduled_end);
			return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
		}

		// Default estimates based on job title keywords
		const title = job?.title?.toLowerCase() || "";
		if (title.includes("emergency")) return 3;
		if (title.includes("install")) return 4;
		if (title.includes("inspection")) return 1;
		if (title.includes("maintenance")) return 2;
		return 2; // Default 2 hours
	}, [job]);

	// Calculate new end time
	const newEndTime = useMemo(() => {
		if (!selectedDate || !selectedTime) return null;

		const [hours, minutes] = selectedTime.split(":").map(Number);
		const newStart = startOfDay(selectedDate);
		setHours(newStart, hours);
		setMinutes(newStart, minutes);

		const newEnd = new Date(newStart);
		newEnd.setHours(newStart.getHours() + Math.floor(estimatedDuration));
		newEnd.setMinutes(newStart.getMinutes() + (estimatedDuration % 1) * 60);

		return newEnd;
	}, [selectedDate, selectedTime, estimatedDuration]);

	const handleConfirm = () => {
		if (!job || !selectedDate || !selectedTime || !newEndTime) return;

		const [hours, minutes] = selectedTime.split(":").map(Number);
		const newStart = startOfDay(selectedDate);
		setHours(newStart, hours);
		setMinutes(newStart, minutes);

		onConfirm(job, newStart, newEndTime);
		onClose();
	};

	if (!job) return null;

	const displaySlots = showAllHours ? TIME_SLOTS : BUSINESS_HOURS;

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
				style={{ maxHeight: "90vh" }}
			>
				{/* Drag Handle */}
				<div className="flex justify-center pt-3 pb-2">
					<div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
				</div>

				{/* Header */}
				<div className="flex items-start justify-between gap-3 px-4 pb-4 border-b">
					<div className="flex-1">
						<h2 className="text-lg font-semibold mb-1">
							Reschedule Appointment
						</h2>
						<p className="text-sm text-muted-foreground">
							{job.customer?.name || "Unknown Customer"}
						</p>
						<p className="text-xs text-muted-foreground">
							Current:{" "}
							{job.scheduled_start
								? format(new Date(job.scheduled_start), "MMM d, h:mm a")
								: "Not scheduled"}
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

				{/* Content */}
				<ScrollArea
					className="flex-1"
					style={{ maxHeight: "calc(90vh - 240px)" }}
				>
					<div className="p-4 space-y-6">
						{/* Calendar */}
						<div>
							<Label className="text-sm font-medium mb-2 flex items-center gap-2">
								<CalendarIcon className="h-4 w-4" />
								Select Date
							</Label>
							<div className="flex justify-center">
								<Calendar
									disabled={(date) => date < startOfDay(new Date())}
									mode="single"
									onSelect={setSelectedDate}
									selected={selectedDate}
								/>
							</div>
						</div>

						{/* Time Slots */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<Label className="text-sm font-medium flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Select Time
								</Label>
								<Button
									onClick={() => setShowAllHours(!showAllHours)}
									size="sm"
									variant="ghost"
								>
									{showAllHours ? "Business Hours" : "All Hours"}
								</Button>
							</div>

							<div className="grid grid-cols-3 gap-2">
								{displaySlots.map((slot) => (
									<Button
										className={cn(
											"h-12 text-sm font-medium",
											selectedTime === slot.time &&
												"bg-primary text-primary-foreground hover:bg-primary/90",
										)}
										key={slot.time}
										onClick={() => setSelectedTime(slot.time)}
										variant={selectedTime === slot.time ? "default" : "outline"}
									>
										{slot.label}
									</Button>
								))}
							</div>
						</div>

						{/* Preview */}
						{selectedDate && selectedTime && newEndTime && (
							<div className="bg-muted/50 rounded-lg p-4 space-y-2">
								<p className="text-sm font-medium">New Schedule Preview</p>
								<div className="space-y-1 text-sm text-muted-foreground">
									<div className="flex justify-between">
										<span>Date:</span>
										<span className="font-medium text-foreground">
											{format(selectedDate, "EEEE, MMMM d, yyyy")}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Start:</span>
										<span className="font-medium text-foreground">
											{format(
												setHours(
													setMinutes(
														selectedDate,
														parseInt(selectedTime.split(":")[1]),
													),
													parseInt(selectedTime.split(":")[0]),
												),
												"h:mm a",
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span>End:</span>
										<span className="font-medium text-foreground">
											{format(newEndTime, "h:mm a")}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Duration:</span>
										<span className="font-medium text-foreground">
											{estimatedDuration}h
										</span>
									</div>
								</div>
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
							disabled={!selectedDate || !selectedTime}
							onClick={handleConfirm}
							size="lg"
							variant="default"
						>
							Confirm Reschedule
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
