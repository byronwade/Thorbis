"use client";

import {
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	Columns3,
	HelpCircle,
	LayoutGrid,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";

const jobTypeLegend = [
	{
		label: "Emergency / Urgent",
		classes: "border-red-400 bg-red-50 text-red-700 dark:bg-red-950",
	},
	{
		label: "Callback / Follow Up",
		classes:
			"border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950",
	},
	{
		label: "Meetings / Events",
		classes:
			"border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950",
	},
	{
		label: "Install / New Work",
		classes: "border-green-400 bg-green-50 text-green-700 dark:bg-green-950",
	},
	{
		label: "Service / Maintenance",
		classes: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950",
	},
	{
		label: "Standard / Other",
		classes: "border-slate-300 bg-slate-50 text-slate-700 dark:bg-slate-900",
	},
];

const statusLegend = [
	{ label: "Scheduled", classes: "bg-blue-500" },
	{ label: "Dispatched", classes: "bg-sky-500" },
	{ label: "Arrived", classes: "bg-emerald-400" },
	{ label: "In Progress", classes: "bg-amber-500 animate-pulse" },
	{ label: "Closed", classes: "bg-emerald-600" },
	{ label: "Cancelled", classes: "bg-slate-400" },
];

export function ScheduleToolbarActions() {
	const [mounted, setMounted] = useState(false);
	const { goToToday, navigatePrevious, navigateNext, viewMode, setViewMode } =
		useScheduleViewStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex items-center gap-3">
				<div className="bg-muted h-8 w-8 rounded-md" />
				<div className="bg-muted h-8 w-20 rounded-md" />
				<div className="bg-muted h-8 w-32 rounded-md" />
				<div className="bg-muted h-8 w-10 rounded-md" />
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Button onClick={goToToday} size="sm" variant="outline">
				Today
			</Button>

			<TooltipProvider>
				<ToggleGroup
					className="border"
					onValueChange={(value) => {
						if (value) {
							setViewMode(value as "day" | "week" | "month");
						}
					}}
					size="sm"
					type="single"
					value={viewMode}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<ToggleGroupItem aria-label="Timeline view" value="day">
								<Columns3 className="size-4" />
							</ToggleGroupItem>
						</TooltipTrigger>
						<TooltipContent>
							<p>Timeline View</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<ToggleGroupItem aria-label="Monthly view" value="month">
								<CalendarDays className="size-4" />
							</ToggleGroupItem>
						</TooltipTrigger>
						<TooltipContent>
							<p>Monthly Calendar</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<ToggleGroupItem aria-label="Kanban view" value="week">
								<LayoutGrid className="size-4" />
							</ToggleGroupItem>
						</TooltipTrigger>
						<TooltipContent>
							<p>Status Board</p>
						</TooltipContent>
					</Tooltip>
				</ToggleGroup>
			</TooltipProvider>

			<div className="flex items-center gap-1">
				<Button onClick={navigatePrevious} size="icon" variant="ghost">
					<ChevronLeft className="size-4" />
				</Button>
				<Button onClick={navigateNext} size="icon" variant="ghost">
					<ChevronRight className="size-4" />
				</Button>
			</div>

			<Popover>
				<PopoverTrigger asChild>
					<Button aria-label="Show schedule legend" size="icon" variant="ghost">
						<HelpCircle className="size-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-64 space-y-4 text-sm">
					<div>
						<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
							Job Type Colors
						</p>
						<div className="space-y-1.5">
							{jobTypeLegend.map((item) => (
								<div
									className="bg-card/70 flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs"
									key={item.label}
								>
									<span
										className={cn("h-4 w-4 rounded-full border", item.classes)}
									/>
									<span className="text-foreground">{item.label}</span>
								</div>
							))}
						</div>
					</div>

					<div>
						<p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
							Status Dot Legend
						</p>
						<div className="grid grid-cols-2 gap-2 text-xs">
							{statusLegend.map((item) => (
								<div className="flex items-center gap-2" key={item.label}>
									<span
										className={cn("h-2.5 w-2.5 rounded-full", item.classes)}
									/>
									<span>{item.label}</span>
								</div>
							))}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
