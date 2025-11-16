"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";

export function ScheduleToolbarTitle() {
	const [mounted, setMounted] = useState(false);
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

	if (!mounted) {
		return <div className="h-8 w-[220px] rounded-md bg-muted" />;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					className={cn(
						"group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
						"hover:bg-accent/50",
					)}
					type="button"
				>
					<span className="font-semibold text-foreground text-xl tracking-tight">
						{getDateFormat()}
					</span>
					<CalendarIcon className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-0">
				<Calendar
					initialFocus
					mode="single"
					onSelect={(newDate) => {
						if (newDate) {
							setCurrentDate(newDate);
						}
					}}
					selected={dateObj}
				/>
			</PopoverContent>
		</Popover>
	);
}
