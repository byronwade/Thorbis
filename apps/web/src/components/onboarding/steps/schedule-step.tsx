"use client";

/**
 * Schedule Step - Business Hours & Availability
 */

import { AlertTriangle, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
	{ id: "monday", label: "Mon" },
	{ id: "tuesday", label: "Tue" },
	{ id: "wednesday", label: "Wed" },
	{ id: "thursday", label: "Thu" },
	{ id: "friday", label: "Fri" },
	{ id: "saturday", label: "Sat" },
	{ id: "sunday", label: "Sun" },
];

const TIME_SLOTS = [
	"06:00",
	"06:30",
	"07:00",
	"07:30",
	"08:00",
	"08:30",
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30",
	"18:00",
	"18:30",
	"19:00",
	"19:30",
	"20:00",
	"20:30",
	"21:00",
];

const BUFFER_OPTIONS = [
	{ value: "0", label: "No buffer" },
	{ value: "15", label: "15 minutes" },
	{ value: "30", label: "30 minutes" },
	{ value: "60", label: "1 hour" },
];

interface DaySchedule {
	enabled: boolean;
	start: string;
	end: string;
}

type WeekSchedule = Record<string, DaySchedule>;

const DEFAULT_SCHEDULE: WeekSchedule = {
	monday: { enabled: true, start: "08:00", end: "17:00" },
	tuesday: { enabled: true, start: "08:00", end: "17:00" },
	wednesday: { enabled: true, start: "08:00", end: "17:00" },
	thursday: { enabled: true, start: "08:00", end: "17:00" },
	friday: { enabled: true, start: "08:00", end: "17:00" },
	saturday: { enabled: false, start: "09:00", end: "14:00" },
	sunday: { enabled: false, start: "09:00", end: "14:00" },
};

export function ScheduleStep() {
	const { data, updateData } = useOnboardingStore();
	const [schedule, setSchedule] = useState<WeekSchedule>(
		data.businessHours || DEFAULT_SCHEDULE,
	);
	const [bufferTime, setBufferTime] = useState(data.bufferTime || "15");
	const [emergencyService, setEmergencyService] = useState(
		data.emergencyService || false,
	);

	const updateDaySchedule = (day: string, updates: Partial<DaySchedule>) => {
		const updated = {
			...schedule,
			[day]: { ...schedule[day], ...updates },
		};
		setSchedule(updated);
		updateData({ businessHours: updated });
	};

	const applyToAllWeekdays = () => {
		const mondaySchedule = schedule.monday;
		const updated = { ...schedule };
		["tuesday", "wednesday", "thursday", "friday"].forEach((day) => {
			updated[day] = { ...mondaySchedule };
		});
		setSchedule(updated);
		updateData({ businessHours: updated });
	};

	const handleBufferChange = (value: string) => {
		setBufferTime(value);
		updateData({ bufferTime: value });
	};

	const handleEmergencyChange = (enabled: boolean) => {
		setEmergencyService(enabled);
		updateData({ emergencyService: enabled });
	};

	const formatTime = (time: string) => {
		const [hours, minutes] = time.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Set your schedule</h2>
				<p className="text-muted-foreground">
					Define when you're available for appointments.
				</p>
			</div>

			{/* Weekly Schedule */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="font-medium">Business Hours</span>
					<Button variant="outline" size="sm" onClick={applyToAllWeekdays}>
						Copy Monday to Weekdays
					</Button>
				</div>

				<div className="space-y-2">
					{DAYS_OF_WEEK.map((day) => {
						const daySchedule = schedule[day.id];

						return (
							<div
								key={day.id}
								className={cn(
									"flex items-center gap-4 rounded-lg p-3",
									daySchedule?.enabled ? "bg-muted/40" : "bg-muted/20",
								)}
							>
								<Switch
									checked={daySchedule?.enabled}
									onCheckedChange={(v) =>
										updateDaySchedule(day.id, { enabled: v })
									}
								/>
								<span
									className={cn(
										"w-10 font-medium",
										!daySchedule?.enabled && "text-muted-foreground",
									)}
								>
									{day.label}
								</span>

								{daySchedule?.enabled ? (
									<div className="flex items-center gap-2 flex-1">
										<Select
											value={daySchedule.start}
											onValueChange={(v) =>
												updateDaySchedule(day.id, { start: v })
											}
										>
											<SelectTrigger className="w-[110px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{TIME_SLOTS.map((time) => (
													<SelectItem key={time} value={time}>
														{formatTime(time)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<span className="text-muted-foreground">to</span>
										<Select
											value={daySchedule.end}
											onValueChange={(v) =>
												updateDaySchedule(day.id, { end: v })
											}
										>
											<SelectTrigger className="w-[110px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{TIME_SLOTS.map((time) => (
													<SelectItem key={time} value={time}>
														{formatTime(time)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								) : (
									<span className="text-sm text-muted-foreground">Closed</span>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Buffer Time */}
			<div className="space-y-3">
				<div>
					<p className="font-medium">Buffer Time Between Jobs</p>
					<p className="text-sm text-muted-foreground">
						Add travel time between appointments
					</p>
				</div>

				<Select value={bufferTime} onValueChange={handleBufferChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{BUFFER_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Emergency Service */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<AlertTriangle className="h-5 w-5 text-amber-500" />
					<div>
						<p className="font-medium">24/7 Emergency Service</p>
						<p className="text-sm text-muted-foreground">
							Accept emergency calls outside business hours
						</p>
					</div>
				</div>
				<Switch
					checked={emergencyService}
					onCheckedChange={handleEmergencyChange}
				/>
			</div>
		</div>
	);
}
