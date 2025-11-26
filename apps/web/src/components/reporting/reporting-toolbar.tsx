"use client";

/**
 * Reporting Toolbar - Global Date Filtering & Actions
 *
 * Features:
 * - Beautiful date range picker with presets
 * - Quick preset buttons (7D, 30D, 90D, 1Y)
 * - Export, Schedule, Notifications
 * - Create Report CTA
 */

import {
	endOfMonth,
	format,
	startOfMonth,
	startOfYear,
	subDays,
	subMonths,
	subYears,
} from "date-fns";
import {
	Bell,
	CalendarIcon,
	Calendar as CalendarScheduleIcon,
	ChevronDown,
	Clock,
	Download,
	PanelLeft,
	Plus,
	RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { ExportDialog } from "@/components/reports/export-dialog";
import { NotificationPreferencesDialog } from "@/components/reports/notification-preferences-dialog";
import { ScheduleReportDialog } from "@/components/reports/schedule-report-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Date range presets
const DATE_PRESETS = [
	{ label: "Today", value: "today", days: 0 },
	{ label: "Yesterday", value: "yesterday", days: 1 },
	{ label: "Last 7 days", value: "7d", days: 7 },
	{ label: "Last 14 days", value: "14d", days: 14 },
	{ label: "Last 30 days", value: "30d", days: 30 },
	{ label: "Last 90 days", value: "90d", days: 90 },
	{ label: "Last 12 months", value: "12m", days: 365 },
	{ label: "Month to date", value: "mtd", days: -1 },
	{ label: "Year to date", value: "ytd", days: -2 },
	{ label: "Last year", value: "ly", days: -3 },
] as const;

// Quick filter buttons
const QUICK_FILTERS = [
	{ label: "7D", value: "7d", days: 7 },
	{ label: "30D", value: "30d", days: 30 },
	{ label: "90D", value: "90d", days: 90 },
	{ label: "1Y", value: "12m", days: 365 },
] as const;

function getDateRangeFromPreset(preset: string): DateRange {
	const today = new Date();
	today.setHours(23, 59, 59, 999);

	switch (preset) {
		case "today": {
			const todayStart = new Date();
			todayStart.setHours(0, 0, 0, 0);
			return { from: todayStart, to: today };
		}
		case "yesterday": {
			const yesterday = subDays(today, 1);
			yesterday.setHours(0, 0, 0, 0);
			const yesterdayEnd = subDays(today, 1);
			yesterdayEnd.setHours(23, 59, 59, 999);
			return { from: yesterday, to: yesterdayEnd };
		}
		case "7d":
			return { from: subDays(today, 7), to: today };
		case "14d":
			return { from: subDays(today, 14), to: today };
		case "30d":
			return { from: subDays(today, 30), to: today };
		case "90d":
			return { from: subDays(today, 90), to: today };
		case "12m":
			return { from: subDays(today, 365), to: today };
		case "mtd":
			return { from: startOfMonth(today), to: today };
		case "ytd":
			return { from: startOfYear(today), to: today };
		case "ly": {
			const lastYearStart = startOfYear(subYears(today, 1));
			const lastYearEnd = endOfMonth(subMonths(startOfYear(today), 1));
			return { from: lastYearStart, to: lastYearEnd };
		}
		default:
			return { from: subDays(today, 30), to: today };
	}
}

interface ReportingToolbarProps {
	onDateChange?: (range: DateRange) => void;
	onRefresh?: () => void;
	showRefresh?: boolean;
}

export function ReportingToolbar({
	onDateChange,
	onRefresh,
	showRefresh = true,
}: ReportingToolbarProps) {
	const [selectedPreset, setSelectedPreset] = useState("30d");
	const [dateRange, setDateRange] = useState<DateRange>(() =>
		getDateRangeFromPreset("30d"),
	);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [isCustomRange, setIsCustomRange] = useState(false);

	const handlePresetChange = useCallback(
		(preset: string) => {
			setSelectedPreset(preset);
			setIsCustomRange(false);
			const newRange = getDateRangeFromPreset(preset);
			setDateRange(newRange);
			onDateChange?.(newRange);
		},
		[onDateChange],
	);

	const handleCalendarSelect = useCallback(
		(range: DateRange | undefined) => {
			if (range) {
				setDateRange(range);
				setIsCustomRange(true);
				setSelectedPreset("custom");
				onDateChange?.(range);
			}
		},
		[onDateChange],
	);

	const handleQuickFilter = useCallback(
		(preset: string) => {
			handlePresetChange(preset);
		},
		[handlePresetChange],
	);

	// Format the date display
	const dateDisplayText = dateRange?.from ? (
		dateRange.to ? (
			<>
				{format(dateRange.from, "MMM d, yyyy")} -{" "}
				{format(dateRange.to, "MMM d, yyyy")}
			</>
		) : (
			format(dateRange.from, "MMM d, yyyy")
		)
	) : (
		"Select date range"
	);

	// Find current preset label
	const currentPresetLabel = isCustomRange
		? "Custom"
		: DATE_PRESETS.find((p) => p.value === selectedPreset)?.label ||
			"Last 30 days";

	return (
		<div className="flex flex-col gap-4 border-b bg-background px-6 py-4">
			{/* Top Row: Title & Actions */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="h-6" />
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Business Intelligence
						</h1>
						<p className="text-sm text-muted-foreground">
							Real-time analytics and insights for your business
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{showRefresh && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onRefresh}
							title="Refresh data"
						>
							<RefreshCw className="h-4 w-4" />
						</Button>
					)}

					<NotificationPreferencesDialog
						reportType="financial"
						reportTitle="Business Intelligence"
						trigger={
							<Button
								variant="ghost"
								size="icon"
								title="Notification preferences"
							>
								<Bell className="h-4 w-4" />
							</Button>
						}
					/>

					<Separator orientation="vertical" className="h-6" />

					<ScheduleReportDialog
						reportType="financial"
						reportTitle="Business Intelligence"
						trigger={
							<Button variant="outline" size="sm">
								<CalendarScheduleIcon className="mr-2 h-4 w-4" />
								Schedule
							</Button>
						}
					/>

					<ExportDialog
						reportType="financial"
						reportTitle="Business Intelligence"
						trigger={
							<Button variant="outline" size="sm">
								<Download className="mr-2 h-4 w-4" />
								Export
							</Button>
						}
					/>

					<Button size="sm" asChild>
						<Link href="/dashboard/reporting/builder">
							<Plus className="mr-2 h-4 w-4" />
							Custom Report Builder
						</Link>
					</Button>
				</div>
			</div>

			{/* Bottom Row: Date Filtering */}
			<div className="flex items-center gap-3">
				{/* Quick Filter Buttons */}
				<div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
					{QUICK_FILTERS.map((filter) => (
						<Button
							key={filter.value}
							variant={
								selectedPreset === filter.value && !isCustomRange
									? "secondary"
									: "ghost"
							}
							size="sm"
							className={cn(
								"h-7 px-3 text-xs font-medium",
								selectedPreset === filter.value &&
									!isCustomRange &&
									"bg-background shadow-sm",
							)}
							onClick={() => handleQuickFilter(filter.value)}
						>
							{filter.label}
						</Button>
					))}
				</div>

				<Separator orientation="vertical" className="h-6" />

				{/* Preset Dropdown */}
				<Select value={selectedPreset} onValueChange={handlePresetChange}>
					<SelectTrigger className="h-8 w-[140px] text-xs">
						<Clock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
						<SelectValue placeholder="Select range" />
					</SelectTrigger>
					<SelectContent>
						{DATE_PRESETS.map((preset) => (
							<SelectItem key={preset.value} value={preset.value}>
								{preset.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Calendar Popover */}
				<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className={cn(
								"h-8 justify-start text-left font-normal",
								!dateRange && "text-muted-foreground",
								isCustomRange && "border-primary",
							)}
						>
							<CalendarIcon className="mr-2 h-3.5 w-3.5" />
							<span className="text-xs">{dateDisplayText}</span>
							<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<div className="flex">
							{/* Preset Sidebar - Fixed width */}
							<div className="w-[130px] border-r p-2 space-y-0.5">
								<p className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
									Quick Select
								</p>
								{DATE_PRESETS.map((preset) => (
									<Button
										key={preset.value}
										variant={
											selectedPreset === preset.value && !isCustomRange
												? "secondary"
												: "ghost"
										}
										size="sm"
										className="w-full justify-start text-xs h-7 px-2"
										onClick={() => {
											handlePresetChange(preset.value);
											setIsCalendarOpen(false);
										}}
									>
										{preset.label}
									</Button>
								))}
							</div>

							{/* Calendar */}
							<div className="p-3">
								<Calendar
									mode="range"
									defaultMonth={dateRange?.from}
									selected={dateRange}
									onSelect={handleCalendarSelect}
									numberOfMonths={2}
								/>
								<div className="mt-3 flex items-center justify-between border-t pt-3">
									<div className="text-xs text-muted-foreground">
										{dateRange?.from && dateRange?.to && (
											<>
												{Math.ceil(
													(dateRange.to.getTime() - dateRange.from.getTime()) /
														(1000 * 60 * 60 * 24),
												)}{" "}
												days selected
											</>
										)}
									</div>
									<div className="flex gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												handlePresetChange("30d");
												setIsCalendarOpen(false);
											}}
										>
											Reset
										</Button>
										<Button size="sm" onClick={() => setIsCalendarOpen(false)}>
											Apply
										</Button>
									</div>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				{/* Current Range Badge */}
				<div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
					<span>Showing:</span>
					<span className="font-medium text-foreground">
						{currentPresetLabel}
					</span>
				</div>
			</div>
		</div>
	);
}
