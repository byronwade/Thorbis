"use client";

import { Calendar, Clock, Repeat } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

/**
 * Enhanced Scheduling Component - Client Component
 *
 * Features:
 * - Time window selection (Morning, Afternoon, Evening)
 * - Specific time scheduling with presets
 * - Smart duration calculation
 * - Auto-calculate end time from start + duration
 * - Recurring schedule options (daily, weekly, monthly)
 * - Flexible time option (anytime during business hours)
 * - Simple and intuitive UX for service companies
 *
 * Performance:
 * - Minimal bundle impact (only schedule logic)
 * - No external dependencies except lucide icons
 */

type EnhancedSchedulingProps = {
	defaultStart?: string;
	defaultEnd?: string;
};

type TimeWindow = {
	label: string;
	value: string;
	start: string; // HH:MM format
	end: string; // HH:MM format
	description: string;
};

const TIME_WINDOWS: TimeWindow[] = [
	{
		label: "Morning",
		value: "morning",
		start: "08:00",
		end: "12:00",
		description: "8:00 AM - 12:00 PM",
	},
	{
		label: "Midday",
		value: "midday",
		start: "11:00",
		end: "14:00",
		description: "11:00 AM - 2:00 PM",
	},
	{
		label: "Afternoon",
		value: "afternoon",
		start: "12:00",
		end: "17:00",
		description: "12:00 PM - 5:00 PM",
	},
	{
		label: "Evening",
		value: "evening",
		start: "17:00",
		end: "20:00",
		description: "5:00 PM - 8:00 PM",
	},
	{
		label: "All Day",
		value: "allday",
		start: "08:00",
		end: "17:00",
		description: "8:00 AM - 5:00 PM",
	},
	{
		label: "Flexible",
		value: "flexible",
		start: "08:00",
		end: "17:00",
		description: "Anytime during business hours",
	},
] as const;

const DURATION_PRESETS = [
	{ label: "15 min", minutes: 15 },
	{ label: "30 min", minutes: 30 },
	{ label: "1 hour", minutes: 60 },
	{ label: "2 hours", minutes: 120 },
	{ label: "4 hours", minutes: 240 },
	{ label: "8 hours", minutes: 480 },
] as const;

export function EnhancedScheduling({
	defaultStart,
	defaultEnd,
}: EnhancedSchedulingProps) {
	const [scheduledStart, setScheduledStart] = useState(defaultStart || "");
	const [scheduledEnd, setScheduledEnd] = useState(defaultEnd || "");
	const [schedulingMode, setSchedulingMode] = useState<"specific" | "window">(
		defaultStart && defaultEnd ? "specific" : "window",
	);
	const [selectedTimeWindow, setSelectedTimeWindow] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState(
		defaultStart ? defaultStart.split("T")[0] : "",
	);
	const [isRecurring, setIsRecurring] = useState(false);
	const [duration, setDuration] = useState<number | null>(null);

	// Calculate duration when start/end changes
	useEffect(() => {
		if (scheduledStart && scheduledEnd) {
			const start = new Date(scheduledStart);
			const end = new Date(scheduledEnd);
			const diffMs = end.getTime() - start.getTime();
			const diffMinutes = Math.floor(diffMs / 60_000);

			if (diffMinutes > 0) {
				setDuration(diffMinutes);
			} else {
				setDuration(null);
			}
		} else {
			setDuration(null);
		}
	}, [scheduledStart, scheduledEnd]);

	// Apply time window to a date
	const applyTimeWindow = (windowValue: string, date?: string) => {
		const targetDate = date || selectedDate;
		if (!targetDate) {
			// If no date selected, use tomorrow
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			const dateStr = tomorrow.toISOString().slice(0, 10);
			setSelectedDate(dateStr);
			applyTimeWindow(windowValue, dateStr);
			return;
		}

		const timeWindow = TIME_WINDOWS.find((w) => w.value === windowValue);
		if (!timeWindow) {
			return;
		}

		setSelectedTimeWindow(windowValue);

		// Set start and end times
		const startDateTime = `${targetDate}T${timeWindow.start}`;
		const endDateTime = `${targetDate}T${timeWindow.end}`;

		setScheduledStart(startDateTime);
		setScheduledEnd(endDateTime);
	};

	// Apply duration preset (for specific time mode)
	const applyDurationPreset = (minutes: number) => {
		if (scheduledStart) {
			// Calculate end from start + duration
			const start = new Date(scheduledStart);
			const end = new Date(start.getTime() + minutes * 60_000);
			setScheduledEnd(end.toISOString().slice(0, 16));
		} else {
			// If no start time, set to tomorrow at 9 AM
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			tomorrow.setHours(9, 0, 0, 0);
			const startStr = tomorrow.toISOString().slice(0, 16);
			setScheduledStart(startStr);

			const end = new Date(tomorrow.getTime() + minutes * 60_000);
			setScheduledEnd(end.toISOString().slice(0, 16));
		}
	};

	// Handle date change in window mode
	const handleDateChange = (date: string) => {
		setSelectedDate(date);
		if (selectedTimeWindow) {
			applyTimeWindow(selectedTimeWindow, date);
		}
	};

	// Format duration display
	const formatDuration = (minutes: number): string => {
		if (minutes < 60) {
			return `${minutes} min`;
		}
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	};

	return (
		<div className="space-y-6">
			{/* Scheduling Mode Selection */}
			<div className="space-y-3">
				<Label className="font-medium text-sm">Scheduling Type</Label>
				<RadioGroup
					className="flex gap-4"
					onValueChange={(value: "specific" | "window") =>
						setSchedulingMode(value)
					}
					value={schedulingMode}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem id="window" value="window" />
						<Label className="cursor-pointer font-normal" htmlFor="window">
							Time Window
							<span className="ml-2 text-muted-foreground text-xs">
								(Recommended)
							</span>
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem id="specific" value="specific" />
						<Label className="cursor-pointer font-normal" htmlFor="specific">
							Specific Time
						</Label>
					</div>
				</RadioGroup>
			</div>

			{/* Time Window Mode */}
			{schedulingMode === "window" && (
				<div className="space-y-4">
					{/* Date Selection */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2" htmlFor="serviceDate">
							<Calendar className="size-4 text-primary" />
							Service Date
						</Label>
						<Input
							className="font-mono"
							id="serviceDate"
							min={new Date().toISOString().split("T")[0]}
							onChange={(e) => handleDateChange(e.target.value)}
							type="date"
							value={selectedDate}
						/>
					</div>

					{/* Time Window Selection */}
					<div className="space-y-3">
						<Label className="font-medium text-sm">Preferred Time Window</Label>
						<div className="grid grid-cols-2 gap-2 md:grid-cols-3">
							{TIME_WINDOWS.map((window) => (
								<Button
									className="h-auto flex-col gap-1 py-3"
									disabled={!selectedDate}
									key={window.value}
									onClick={() => applyTimeWindow(window.value)}
									size="sm"
									type="button"
									variant={
										selectedTimeWindow === window.value ? "default" : "outline"
									}
								>
									<span className="font-semibold">{window.label}</span>
									<span className="text-xs opacity-80">
										{window.description}
									</span>
								</Button>
							))}
						</div>
						<p className="text-muted-foreground text-xs">
							{selectedDate
								? "Select your preferred arrival time window"
								: "Select a date first to choose a time window"}
						</p>
					</div>
				</div>
			)}

			{/* Specific Time Mode */}
			{schedulingMode === "specific" && (
				<div className="space-y-4">
					{/* Quick Duration Presets */}
					<div className="space-y-3">
						<Label className="font-medium text-sm">Estimated Duration</Label>
						<div className="flex flex-wrap gap-2">
							{DURATION_PRESETS.map((preset) => (
								<Button
									className="h-8"
									key={preset.minutes}
									onClick={() => applyDurationPreset(preset.minutes)}
									size="sm"
									type="button"
									variant={duration === preset.minutes ? "default" : "outline"}
								>
									<Clock className="mr-1.5 size-3.5" />
									{preset.label}
								</Button>
							))}
						</div>
					</div>

					{/* Date & Time Selection */}
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label
								className="flex items-center gap-2"
								htmlFor="scheduledStart"
							>
								<Calendar className="size-4 text-primary" />
								Start Date & Time
							</Label>
							<Input
								className="font-mono"
								id="scheduledStart"
								name="scheduledStart"
								onChange={(e) => setScheduledStart(e.target.value)}
								type="datetime-local"
								value={scheduledStart}
							/>
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2" htmlFor="scheduledEnd">
								<Calendar className="size-4 text-primary" />
								End Date & Time
							</Label>
							<Input
								className="font-mono"
								id="scheduledEnd"
								name="scheduledEnd"
								onChange={(e) => setScheduledEnd(e.target.value)}
								type="datetime-local"
								value={scheduledEnd}
							/>
						</div>
					</div>

					{/* Duration Display */}
					{duration && duration > 0 && (
						<div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
							<Clock className="size-4 text-primary" />
							<span className="font-medium text-sm">
								Duration: {formatDuration(duration)}
							</span>
						</div>
					)}
				</div>
			)}

			{/* Recurring Schedule */}
			<div className="space-y-4 rounded-lg border bg-card p-4">
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label
							className="flex items-center gap-2 font-medium text-sm"
							htmlFor="recurring"
						>
							<Repeat className="size-4 text-primary" />
							Recurring Schedule
						</Label>
						<p className="text-muted-foreground text-xs">
							Set up a repeating schedule
						</p>
					</div>
					<Switch
						checked={isRecurring}
						id="recurring"
						onCheckedChange={setIsRecurring}
					/>
				</div>

				{isRecurring && (
					<div className="space-y-4 pt-2">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="recurrenceType">Repeat</Label>
								<Select defaultValue="weekly" name="recurrenceType">
									<SelectTrigger id="recurrenceType">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="daily">Daily</SelectItem>
										<SelectItem value="weekly">Weekly</SelectItem>
										<SelectItem value="biweekly">Every 2 weeks</SelectItem>
										<SelectItem value="monthly">Monthly</SelectItem>
										<SelectItem value="quarterly">Quarterly</SelectItem>
										<SelectItem value="yearly">Yearly</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="recurrenceEndDate">Ends on</Label>
								<Input
									className="font-mono"
									id="recurrenceEndDate"
									name="recurrenceEndDate"
									type="date"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="recurrenceCount">
								Number of occurrences (optional)
							</Label>
							<Input
								id="recurrenceCount"
								max="365"
								min="1"
								name="recurrenceCount"
								placeholder="Leave empty for indefinite"
								type="number"
							/>
							<p className="text-muted-foreground text-xs">
								Or leave the end date empty and specify how many times to repeat
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Hidden fields to track scheduling details */}
			<input
				name="isRecurring"
				type="hidden"
				value={isRecurring ? "true" : "false"}
			/>
			<input name="schedulingMode" type="hidden" value={schedulingMode} />
			<input name="timeWindow" type="hidden" value={selectedTimeWindow} />
			<input name="scheduledStart" type="hidden" value={scheduledStart} />
			<input name="scheduledEnd" type="hidden" value={scheduledEnd} />
		</div>
	);
}
