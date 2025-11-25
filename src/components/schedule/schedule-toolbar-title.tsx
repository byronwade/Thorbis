"use client";

import {
	addDays,
	addMonths,
	addWeeks,
	format,
	isToday,
	startOfWeek,
} from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronDown,
	Clock,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";

// Quick jump options
const getQuickJumpOptions = (viewMode: string) => {
	const today = new Date();

	if (viewMode === "month") {
		return [
			{ label: "This Month", date: today },
			{ label: "Next Month", date: addMonths(today, 1) },
			{ label: "In 2 Months", date: addMonths(today, 2) },
		];
	}

	if (viewMode === "week") {
		return [
			{ label: "This Week", date: startOfWeek(today) },
			{ label: "Next Week", date: addWeeks(today, 1) },
			{ label: "In 2 Weeks", date: addWeeks(today, 2) },
		];
	}

	return [
		{ label: "Today", date: today },
		{ label: "Tomorrow", date: addDays(today, 1) },
		{ label: "Next Week", date: addWeeks(today, 1) },
	];
};

export function ScheduleToolbarTitle() {
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { currentDate, setCurrentDate, viewMode } = useScheduleViewStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	const dateObj =
		currentDate instanceof Date ? currentDate : new Date(currentDate);

	const getDateFormat = () => {
		switch (viewMode) {
			case "month":
				return format(dateObj, "MMMM yyyy");
			case "week":
				return format(dateObj, "MMM dd, yyyy");
			default:
				return format(dateObj, "EEEE, MMMM dd, yyyy");
		}
	};

	const quickJumpOptions = getQuickJumpOptions(viewMode);
	const showTodayBadge = isToday(dateObj);

	if (!mounted) {
		return <div className="bg-muted h-8 w-[220px] rounded-md" />;
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className={cn(
						"group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
						"hover:bg-accent/50",
					)}
					type="button"
				>
					<div className="flex items-center gap-2">
						<span className="text-foreground text-xl font-semibold tracking-tight">
							{getDateFormat()}
						</span>
						{showTodayBadge && (
							<span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
								Today
							</span>
						)}
					</div>
					<ChevronDown
						className={cn(
							"text-muted-foreground size-4 transition-transform",
							isOpen && "rotate-180",
						)}
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-0">
				{/* Quick Jump Header */}
				<div className="border-b p-3">
					<div className="mb-2 flex items-center gap-2">
						<Sparkles className="text-primary size-3.5" />
						<span className="text-xs font-medium">Quick Jump</span>
					</div>
					<div className="flex gap-1.5">
						{quickJumpOptions.map((option) => (
							<Button
								key={option.label}
								size="sm"
								variant="outline"
								className="h-7 text-xs"
								onClick={() => {
									setCurrentDate(option.date);
									setIsOpen(false);
								}}
							>
								{option.label}
							</Button>
						))}
					</div>
				</div>

				{/* Calendar */}
				<Calendar
					initialFocus
					mode="single"
					onSelect={(newDate) => {
						if (newDate) {
							setCurrentDate(newDate);
							setIsOpen(false);
						}
					}}
					selected={dateObj}
					className="p-3"
					modifiers={{
						today: new Date(),
					}}
					modifiersClassNames={{
						today: "bg-primary text-primary-foreground",
					}}
				/>

				<Separator />

				{/* Current time indicator */}
				<div className="flex items-center justify-between px-3 py-2">
					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<Clock className="size-3" />
						<span>Current time: {format(new Date(), "h:mm a")}</span>
					</div>
					<Button
						size="sm"
						variant="ghost"
						className="h-6 text-xs"
						onClick={() => {
							setCurrentDate(new Date());
							setIsOpen(false);
						}}
					>
						Go to now
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
