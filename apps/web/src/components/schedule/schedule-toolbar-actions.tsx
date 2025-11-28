"use client";

import {
	AlertTriangle,
	ArrowRight,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	CircleDot,
	Columns3,
	HelpCircle,
	Keyboard,
	LayoutGrid,
	Map as MapIcon,
	Palette,
	Phone,
	Repeat,
	Route,
	Settings2,
	Wrench,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchedule } from "@/hooks/use-schedule";
import type { TimelineViewMode } from "@/lib/stores/schedule-view-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";
import type { Job, Technician } from "./schedule-types";

const jobTypeLegend = [
	{
		label: "Emergency / Urgent",
		description: "High priority service calls",
		icon: AlertTriangle,
		borderClass: "border-l-red-400 dark:border-l-red-700",
		dotClass: "bg-red-500",
	},
	{
		label: "Callback / Follow Up",
		description: "Return visits & follow-ups",
		icon: Phone,
		borderClass: "border-l-orange-400 dark:border-l-orange-700",
		dotClass: "bg-orange-500",
	},
	{
		label: "Meetings / Events",
		description: "Training & team events",
		icon: CalendarDays,
		borderClass: "border-l-purple-400 dark:border-l-purple-700",
		dotClass: "bg-purple-500",
	},
	{
		label: "Install / New Work",
		description: "New installations & setups",
		icon: Settings2,
		borderClass: "border-l-green-400 dark:border-l-green-700",
		dotClass: "bg-green-500",
	},
	{
		label: "Service / Maintenance",
		description: "Regular service calls",
		icon: Wrench,
		borderClass: "border-l-blue-400 dark:border-l-blue-700",
		dotClass: "bg-blue-500",
	},
	{
		label: "Standard / Other",
		description: "General appointments",
		icon: CircleDot,
		borderClass: "border-l-slate-300 dark:border-l-slate-700",
		dotClass: "bg-slate-400",
	},
];

const statusWorkflow = [
	{
		label: "Scheduled",
		description: "Job is booked",
		color: "bg-blue-500",
		step: 1,
	},
	{
		label: "Dispatched",
		description: "Tech en route",
		color: "bg-sky-500",
		step: 2,
	},
	{
		label: "Arrived",
		description: "Tech on site",
		color: "bg-emerald-400",
		step: 3,
	},
	{
		label: "In Progress",
		description: "Work started",
		color: "bg-amber-500",
		step: 4,
		pulse: true,
	},
	{
		label: "Closed",
		description: "Work complete",
		color: "bg-emerald-600",
		step: 5,
	},
];

const keyboardShortcuts = [
	{ keys: ["T"], description: "Go to Today" },
	{ keys: ["N"], description: "New Job" },
	{ keys: ["["], description: "Previous Period" },
	{ keys: ["]"], description: "Next Period" },
	{ keys: ["1"], description: "Timeline View" },
	{ keys: ["2"], description: "Monthly View" },
	{ keys: ["3"], description: "Kanban View" },
];

export function ScheduleToolbarActions() {
	const [mounted, setMounted] = useState(false);
	const { goToToday, navigatePrevious, navigateNext, viewMode, setViewMode, currentDate } =
		useScheduleViewStore();
	const { jobs, technicians } = useSchedule();

	const isMapView = viewMode === "map";

	// Group jobs by technician for route optimization
	const jobsByTechnician = new Map<string, Job[]>();
	for (const job of jobs.values()) {
		for (const assignment of job.assignments) {
			if (assignment.technicianId) {
				const existing = jobsByTechnician.get(assignment.technicianId) || [];
				existing.push(job);
				jobsByTechnician.set(assignment.technicianId, existing);
			}
		}
	}

	useEffect(() => {
		setMounted(true);
	}, []);

	// Handle view mode change with navigation for map
	const handleViewModeChange = (value: string) => {
		if (!value) return;
		setViewMode(value as TimelineViewMode);
	};

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
			{!isMapView && (
				<Button onClick={goToToday} size="sm" variant="outline">
					Today
				</Button>
			)}

			<TooltipProvider>
				{/* View Mode Toggle Group */}
				<ToggleGroup
					className="border"
					onValueChange={handleViewModeChange}
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

					<Tooltip>
						<TooltipTrigger asChild>
							<ToggleGroupItem aria-label="Map view" value="map">
								<MapIcon className="size-4" />
							</ToggleGroupItem>
						</TooltipTrigger>
						<TooltipContent>
							<p>Dispatch Map</p>
						</TooltipContent>
					</Tooltip>
				</ToggleGroup>
			</TooltipProvider>

			{!isMapView && (
				<div className="flex items-center gap-1">
					<Button onClick={navigatePrevious} size="icon" variant="ghost">
						<ChevronLeft className="size-4" />
					</Button>
					<Button onClick={navigateNext} size="icon" variant="ghost">
						<ChevronRight className="size-4" />
					</Button>
				</div>
			)}

			{!isMapView && (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							aria-label="Show schedule legend"
							size="icon"
							variant="ghost"
						>
							<HelpCircle className="size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="end" className="w-80 p-0">
						{/* Header */}
						<div className="border-b px-4 py-3">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex size-8 items-center justify-center rounded-md">
									<Palette className="text-primary size-4" />
								</div>
								<div>
									<h4 className="text-sm font-semibold">Schedule Guide</h4>
									<p className="text-muted-foreground text-xs">
										Colors, statuses & shortcuts
									</p>
								</div>
							</div>
						</div>

						<div className="max-h-[400px] overflow-y-auto">
							{/* Job Type Colors */}
							<div className="p-4">
								<div className="mb-3 flex items-center gap-2">
									<Zap className="text-muted-foreground size-3.5" />
									<span className="text-xs font-semibold uppercase tracking-wide">
										Job Types
									</span>
								</div>
								<div className="space-y-2">
									{jobTypeLegend.map((item) => {
										const Icon = item.icon;
										return (
											<div
												className={cn(
													"flex items-center gap-3 rounded-lg border-l-4 bg-card/50 px-3 py-2",
													item.borderClass,
												)}
												key={item.label}
											>
												<div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-md">
													<Icon className="text-muted-foreground size-3.5" />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{item.label}
													</p>
													<p className="text-muted-foreground text-xs truncate">
														{item.description}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							<Separator />

							{/* Status Workflow */}
							<div className="p-4">
								<div className="mb-3 flex items-center gap-2">
									<ArrowRight className="text-muted-foreground size-3.5" />
									<span className="text-xs font-semibold uppercase tracking-wide">
										Status Workflow
									</span>
								</div>

								{/* Visual workflow diagram */}
								<div className="mb-3">
									<div className="flex items-center justify-between gap-1">
										{statusWorkflow.map((status, idx) => (
											<div
												key={status.label}
												className="flex items-center flex-1"
											>
												<div
													className={cn(
														"h-1.5 flex-1 rounded-full",
														status.color,
														status.pulse && "animate-pulse",
													)}
												/>
												{idx < statusWorkflow.length - 1 && (
													<ArrowRight className="text-muted-foreground mx-0.5 size-2.5 shrink-0" />
												)}
											</div>
										))}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2">
									{statusWorkflow.map((status) => (
										<div
											className="flex items-center gap-2 rounded-md px-2 py-1.5"
											key={status.label}
										>
											<span
												className={cn(
													"size-2.5 rounded-full shrink-0",
													status.color,
													status.pulse && "animate-pulse",
												)}
											/>
											<div className="min-w-0">
												<p className="text-xs font-medium">{status.label}</p>
												<p className="text-muted-foreground text-[10px] truncate">
													{status.description}
												</p>
											</div>
										</div>
									))}
									{/* Cancelled status - separate */}
									<div className="flex items-center gap-2 rounded-md px-2 py-1.5">
										<span className="bg-slate-400 size-2.5 rounded-full shrink-0" />
										<div className="min-w-0">
											<p className="text-xs font-medium">Cancelled</p>
											<p className="text-muted-foreground text-[10px]">
												Job cancelled
											</p>
										</div>
									</div>
								</div>
							</div>

							<Separator />

							{/* Special Indicators */}
							<div className="p-4">
								<div className="mb-3 flex items-center gap-2">
									<Repeat className="text-muted-foreground size-3.5" />
									<span className="text-xs font-semibold uppercase tracking-wide">
										Special Indicators
									</span>
								</div>
								<div className="space-y-2">
									<div className="bg-card/50 flex items-center gap-3 rounded-lg border px-3 py-2">
										<Repeat className="text-primary size-4 shrink-0" />
										<div>
											<p className="text-xs font-medium">Recurring Job</p>
											<p className="text-muted-foreground text-[10px]">
												Repeats on a schedule
											</p>
										</div>
									</div>
									<div className="bg-card/50 flex items-center gap-3 rounded-lg border px-3 py-2">
										<div className="flex -space-x-1">
											<div className="bg-primary size-4 rounded-full border-2 border-background" />
											<div className="bg-emerald-500 size-4 rounded-full border-2 border-background" />
										</div>
										<div>
											<p className="text-xs font-medium">Multi-Tech Job</p>
											<p className="text-muted-foreground text-[10px]">
												Multiple technicians assigned
											</p>
										</div>
									</div>
								</div>
							</div>

							<Separator />

							{/* Keyboard Shortcuts */}
							<div className="p-4">
								<div className="mb-3 flex items-center gap-2">
									<Keyboard className="text-muted-foreground size-3.5" />
									<span className="text-xs font-semibold uppercase tracking-wide">
										Keyboard Shortcuts
									</span>
								</div>
								<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
									{keyboardShortcuts.map((shortcut) => (
										<div
											className="flex items-center justify-between"
											key={shortcut.description}
										>
											<span className="text-muted-foreground text-xs">
												{shortcut.description}
											</span>
											<div className="flex gap-0.5">
												{shortcut.keys.map((key) => (
													<kbd
														className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]"
														key={key}
													>
														{key}
													</kbd>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}
