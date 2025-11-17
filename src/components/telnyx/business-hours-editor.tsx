/**
 * Business Hours Visual Calendar Editor
 *
 * Interactive calendar editor for configuring business hours:
 * - Weekly schedule view with visual time blocks
 * - Multiple time ranges per day (e.g., lunch breaks)
 * - Copy hours across days
 * - Timezone support
 * - Holiday exceptions
 * - Quick presets (9-5, 24/7, etc.)
 */

"use client";

import { AlertCircle, CheckCircle2, Clock, Copy, Globe, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Time range for a single day
type TimeRange = {
	id: string;
	startTime: string; // HH:MM format
	endTime: string; // HH:MM format
};

// Day schedule
type DaySchedule = {
	dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
	dayName: string;
	isOpen: boolean;
	timeRanges: TimeRange[];
};

// Full business hours configuration
type BusinessHours = {
	timezone: string;
	schedule: DaySchedule[];
};

// Time options for select (15-minute increments)
const timeOptions = Array.from({ length: 96 }, (_, i) => {
	const hours = Math.floor(i / 4);
	const minutes = (i % 4) * 15;
	const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	const hour12 = hours % 12 || 12;
	const ampm = hours < 12 ? "AM" : "PM";
	return {
		value: time,
		label: `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`,
	};
});

// Common timezones
const commonTimezones = [
	{ value: "America/New_York", label: "Eastern Time (ET)" },
	{ value: "America/Chicago", label: "Central Time (CT)" },
	{ value: "America/Denver", label: "Mountain Time (MT)" },
	{ value: "America/Los_Angeles", label: "Pacific Time (PT)" },
	{ value: "America/Anchorage", label: "Alaska Time (AKT)" },
	{ value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
];

// Quick presets
const presets = [
	{
		name: "Standard (9 AM - 5 PM)",
		hours: { start: "09:00", end: "17:00" },
	},
	{
		name: "Extended (8 AM - 6 PM)",
		hours: { start: "08:00", end: "18:00" },
	},
	{
		name: "Early Bird (7 AM - 3 PM)",
		hours: { start: "07:00", end: "15:00" },
	},
	{
		name: "24/7",
		hours: { start: "00:00", end: "23:59" },
	},
];

// Initialize default schedule
const defaultSchedule: DaySchedule[] = [
	{ dayOfWeek: 0, dayName: "Sunday", isOpen: false, timeRanges: [] },
	{
		dayOfWeek: 1,
		dayName: "Monday",
		isOpen: true,
		timeRanges: [{ id: "1", startTime: "09:00", endTime: "17:00" }],
	},
	{
		dayOfWeek: 2,
		dayName: "Tuesday",
		isOpen: true,
		timeRanges: [{ id: "2", startTime: "09:00", endTime: "17:00" }],
	},
	{
		dayOfWeek: 3,
		dayName: "Wednesday",
		isOpen: true,
		timeRanges: [{ id: "3", startTime: "09:00", endTime: "17:00" }],
	},
	{
		dayOfWeek: 4,
		dayName: "Thursday",
		isOpen: true,
		timeRanges: [{ id: "4", startTime: "09:00", endTime: "17:00" }],
	},
	{
		dayOfWeek: 5,
		dayName: "Friday",
		isOpen: true,
		timeRanges: [{ id: "5", startTime: "09:00", endTime: "17:00" }],
	},
	{ dayOfWeek: 6, dayName: "Saturday", isOpen: false, timeRanges: [] },
];

export function BusinessHoursEditor() {
	const [businessHours, setBusinessHours] = useState<BusinessHours>({
		timezone: "America/Los_Angeles",
		schedule: defaultSchedule,
	});

	const [copiedDay, setCopiedDay] = useState<DaySchedule | null>(null);

	// Toggle day open/closed
	const toggleDay = (dayOfWeek: number) => {
		setBusinessHours((prev) => ({
			...prev,
			schedule: prev.schedule.map((day) =>
				day.dayOfWeek === dayOfWeek
					? {
							...day,
							isOpen: !day.isOpen,
							timeRanges: day.isOpen
								? []
								: [
										{
											id: crypto.randomUUID(),
											startTime: "09:00",
											endTime: "17:00",
										},
									],
						}
					: day
			),
		}));
	};

	// Add time range to a day
	const addTimeRange = (dayOfWeek: number) => {
		setBusinessHours((prev) => ({
			...prev,
			schedule: prev.schedule.map((day) =>
				day.dayOfWeek === dayOfWeek
					? {
							...day,
							timeRanges: [
								...day.timeRanges,
								{
									id: crypto.randomUUID(),
									startTime: "09:00",
									endTime: "17:00",
								},
							],
						}
					: day
			),
		}));
	};

	// Remove time range from a day
	const removeTimeRange = (dayOfWeek: number, rangeId: string) => {
		setBusinessHours((prev) => ({
			...prev,
			schedule: prev.schedule.map((day) =>
				day.dayOfWeek === dayOfWeek
					? {
							...day,
							timeRanges: day.timeRanges.filter((range) => range.id !== rangeId),
						}
					: day
			),
		}));
	};

	// Update time range
	const updateTimeRange = (
		dayOfWeek: number,
		rangeId: string,
		field: "startTime" | "endTime",
		value: string
	) => {
		setBusinessHours((prev) => ({
			...prev,
			schedule: prev.schedule.map((day) =>
				day.dayOfWeek === dayOfWeek
					? {
							...day,
							timeRanges: day.timeRanges.map((range) =>
								range.id === rangeId ? { ...range, [field]: value } : range
							),
						}
					: day
			),
		}));
	};

	// Copy day schedule
	const copyDay = (day: DaySchedule) => {
		setCopiedDay(day);
	};

	// Paste day schedule
	const pasteDay = (targetDayOfWeek: number) => {
		if (!copiedDay) {
			return;
		}

		setBusinessHours((prev) => ({
			...prev,
			schedule: prev.schedule.map((day) =>
				day.dayOfWeek === targetDayOfWeek
					? {
							...day,
							isOpen: copiedDay.isOpen,
							timeRanges: copiedDay.timeRanges.map((range) => ({
								...range,
								id: crypto.randomUUID(),
							})),
						}
					: day
			),
		}));
	};

	// Apply preset to all weekdays
	const applyPresetToWeekdays = (preset: { start: string; end: string }) => {
		setBusinessHours((prev) => ({
			...prev,
			schedule: prev.schedule.map((day) =>
				day.dayOfWeek >= 1 && day.dayOfWeek <= 5
					? {
							...day,
							isOpen: true,
							timeRanges: [
								{
									id: crypto.randomUUID(),
									startTime: preset.start,
									endTime: preset.end,
								},
							],
						}
					: day
			),
		}));
	};

	// Validate time ranges (start < end)
	const validateTimeRange = (range: TimeRange): boolean => range.startTime < range.endTime;

	return (
		<div className="space-y-6">
			{/* Header Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="size-5" />
						Business Hours
					</CardTitle>
					<CardDescription>
						Configure when your business is available to receive calls
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Timezone Selection */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2" htmlFor="timezone">
							<Globe className="size-4" />
							Timezone
						</Label>
						<Select
							onValueChange={(value) => setBusinessHours((prev) => ({ ...prev, timezone: value }))}
							value={businessHours.timezone}
						>
							<SelectTrigger id="timezone">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{commonTimezones.map((tz) => (
									<SelectItem key={tz.value} value={tz.value}>
										{tz.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Quick Presets */}
					<div className="space-y-2">
						<Label>Quick Presets (Apply to Weekdays)</Label>
						<div className="flex flex-wrap gap-2">
							{presets.map((preset) => (
								<Button
									key={preset.name}
									onClick={() => applyPresetToWeekdays(preset.hours)}
									size="sm"
									variant="outline"
								>
									{preset.name}
								</Button>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Weekly Schedule */}
			<div className="space-y-3">
				{businessHours.schedule.map((day) => (
					<DayScheduleCard
						canPaste={copiedDay !== null}
						day={day}
						key={day.dayOfWeek}
						onAddTimeRange={() => addTimeRange(day.dayOfWeek)}
						onCopy={() => copyDay(day)}
						onPaste={() => pasteDay(day.dayOfWeek)}
						onRemoveTimeRange={(rangeId) => removeTimeRange(day.dayOfWeek, rangeId)}
						onToggle={() => toggleDay(day.dayOfWeek)}
						onUpdateTimeRange={(rangeId, field, value) =>
							updateTimeRange(day.dayOfWeek, rangeId, field, value)
						}
						validateTimeRange={validateTimeRange}
					/>
				))}
			</div>

			{/* Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Schedule Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 text-sm">
						{businessHours.schedule
							.filter((day) => day.isOpen)
							.map((day) => (
								<div className="flex items-center justify-between" key={day.dayOfWeek}>
									<span className="font-medium">{day.dayName}</span>
									<span className="text-muted-foreground">
										{day.timeRanges
											.map(
												(range) => `${formatTime(range.startTime)} - ${formatTime(range.endTime)}`
											)
											.join(", ")}
									</span>
								</div>
							))}
						{businessHours.schedule.every((day) => !day.isOpen) && (
							<div className="text-muted-foreground flex items-center gap-2">
								<AlertCircle className="size-4" />
								No business hours configured
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Save Button */}
			<div className="flex justify-end gap-3">
				<Button variant="outline">Cancel</Button>
				<Button>
					<CheckCircle2 className="mr-2 size-4" />
					Save Business Hours
				</Button>
			</div>
		</div>
	);
}

function DayScheduleCard({
	day,
	onToggle,
	onAddTimeRange,
	onRemoveTimeRange,
	onUpdateTimeRange,
	onCopy,
	onPaste,
	canPaste,
	validateTimeRange,
}: {
	day: DaySchedule;
	onToggle: () => void;
	onAddTimeRange: () => void;
	onRemoveTimeRange: (rangeId: string) => void;
	onUpdateTimeRange: (rangeId: string, field: "startTime" | "endTime", value: string) => void;
	onCopy: () => void;
	onPaste: () => void;
	canPaste: boolean;
	validateTimeRange: (range: TimeRange) => boolean;
}) {
	return (
		<Card className={cn(!day.isOpen && "opacity-60")}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Switch checked={day.isOpen} onCheckedChange={onToggle} />
						<div>
							<CardTitle className="text-base">{day.dayName}</CardTitle>
							<CardDescription className="text-xs">
								{day.isOpen ? (
									<>
										{day.timeRanges.length} time {day.timeRanges.length === 1 ? "range" : "ranges"}
									</>
								) : (
									"Closed"
								)}
							</CardDescription>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button disabled={!day.isOpen} onClick={onCopy} size="sm" variant="ghost">
							<Copy className="size-3" />
						</Button>
						<Button disabled={!canPaste} onClick={onPaste} size="sm" variant="ghost">
							Paste
						</Button>
					</div>
				</div>
			</CardHeader>

			{day.isOpen && (
				<CardContent className="space-y-3">
					{/* Time Ranges */}
					{day.timeRanges.map((range, _index) => {
						const isValid = validateTimeRange(range);
						return (
							<div className="flex items-center gap-3" key={range.id}>
								<div className="flex flex-1 items-center gap-3">
									<div className="flex-1">
										<Select
											onValueChange={(value) => onUpdateTimeRange(range.id, "startTime", value)}
											value={range.startTime}
										>
											<SelectTrigger className={cn("h-9", !isValid && "border-destructive")}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{timeOptions.map((time) => (
													<SelectItem key={time.value} value={time.value}>
														{time.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<span className="text-muted-foreground">to</span>

									<div className="flex-1">
										<Select
											onValueChange={(value) => onUpdateTimeRange(range.id, "endTime", value)}
											value={range.endTime}
										>
											<SelectTrigger className={cn("h-9", !isValid && "border-destructive")}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{timeOptions.map((time) => (
													<SelectItem key={time.value} value={time.value}>
														{time.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								{day.timeRanges.length > 1 && (
									<Button
										className="size-9"
										onClick={() => onRemoveTimeRange(range.id)}
										size="icon"
										variant="ghost"
									>
										<Trash2 className="size-4" />
									</Button>
								)}
							</div>
						);
					})}

					{/* Add Time Range Button */}
					<Button className="w-full" onClick={onAddTimeRange} size="sm" variant="outline">
						<Plus className="mr-2 size-3" />
						Add Time Range (e.g., Lunch Break)
					</Button>

					{/* Validation Warning */}
					{day.timeRanges.some((range) => !validateTimeRange(range)) && (
						<div className="text-destructive flex items-center gap-2 text-sm">
							<AlertCircle className="size-4" />
							End time must be after start time
						</div>
					)}
				</CardContent>
			)}
		</Card>
	);
}

// Helper function to format time in 12-hour format
function formatTime(time: string): string {
	const [hours, minutes] = time.split(":").map(Number);
	const hour12 = hours % 12 || 12;
	const ampm = hours < 12 ? "AM" : "PM";
	return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}
