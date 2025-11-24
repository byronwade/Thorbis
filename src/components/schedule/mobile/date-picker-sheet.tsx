"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

/**
 * DatePickerSheet - Mobile date picker for schedule
 *
 * Features:
 * - Full calendar view
 * - Quick date selection
 * - Today button for quick reset
 * - Visual indicator for selected date
 * - Swipe to dismiss
 */

type DatePickerSheetProps = {
	isOpen: boolean;
	onClose: () => void;
	currentDate: Date;
	onDateSelect: (date: Date) => void;
};

export function DatePickerSheet({
	isOpen,
	onClose,
	currentDate,
	onDateSelect,
}: DatePickerSheetProps) {
	const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setSelectedDate(date);
		}
	};

	const handleConfirm = () => {
		onDateSelect(selectedDate);
		onClose();
	};

	const handleToday = () => {
		const today = new Date();
		setSelectedDate(today);
		onDateSelect(today);
		onClose();
	};

	const handleCancel = () => {
		setSelectedDate(currentDate); // Reset to original
		onClose();
	};

	return (
		<Sheet open={isOpen} onOpenChange={handleCancel}>
			<SheetContent side="bottom" className="h-[500px] flex flex-col">
				<SheetHeader>
					<SheetTitle className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							<CalendarIcon className="h-5 w-5" />
							Select Date
						</span>
						<Button
							className="h-8 w-8 p-0"
							onClick={handleCancel}
							size="icon"
							variant="ghost"
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</SheetTitle>
				</SheetHeader>

				{/* Calendar */}
				<div className="flex-1 flex items-center justify-center overflow-y-auto py-4">
					<Calendar
						className="rounded-md border"
						mode="single"
						onSelect={handleDateSelect}
						selected={selectedDate}
					/>
				</div>

				{/* Footer Actions */}
				<div className="shrink-0 space-y-2 border-t pt-4">
					<div className="flex gap-2">
						<Button
							className="flex-1"
							onClick={handleToday}
							size="default"
							variant="outline"
						>
							Today
						</Button>
						<Button
							className="flex-1"
							onClick={handleConfirm}
							size="default"
						>
							Go to {format(selectedDate, "MMM d, yyyy")}
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
