"use client";

/**
 * Schedule Step - Business Hours & Availability
 *
 * Configures:
 * - Business operating hours
 * - Service area/zones
 * - Scheduling preferences
 * - Buffer times between appointments
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
	Calendar,
	Clock,
	MapPin,
	Sparkles,
	CheckCircle2,
	Sun,
	Moon,
	Coffee,
	AlertTriangle,
	Truck,
} from "lucide-react";

const DAYS_OF_WEEK = [
	{ id: "monday", label: "Mon", fullLabel: "Monday" },
	{ id: "tuesday", label: "Tue", fullLabel: "Tuesday" },
	{ id: "wednesday", label: "Wed", fullLabel: "Wednesday" },
	{ id: "thursday", label: "Thu", fullLabel: "Thursday" },
	{ id: "friday", label: "Fri", fullLabel: "Friday" },
	{ id: "saturday", label: "Sat", fullLabel: "Saturday" },
	{ id: "sunday", label: "Sun", fullLabel: "Sunday" },
];

const TIME_SLOTS = [
	"06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
	"10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
	"14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
	"18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

const BUFFER_OPTIONS = [
	{ value: "0", label: "No buffer" },
	{ value: "15", label: "15 minutes" },
	{ value: "30", label: "30 minutes" },
	{ value: "45", label: "45 minutes" },
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
		data.businessHours || DEFAULT_SCHEDULE
	);
	const [bufferTime, setBufferTime] = useState(data.bufferTime || "15");
	const [emergencyService, setEmergencyService] = useState(data.emergencyService || false);

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

	const enabledDays = DAYS_OF_WEEK.filter((d) => schedule[d.id]?.enabled);

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Set your schedule</h2>
				<p className="text-sm text-muted-foreground">
					Define when you're available for appointments. This helps with online booking and dispatch optimization.
				</p>
			</div>

			{/* Why This Matters */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Smart scheduling saves time"
				description="Your schedule powers automatic booking windows and route optimization."
				bullets={[
					"Customers only see available time slots",
					"Dispatch suggests optimal job timing",
					"Buffer time prevents back-to-back stress",
					"Emergency availability clearly communicated",
				]}
				variant="tip"
			/>

			{/* Weekly Schedule */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold">Business Hours</h3>
					<Button variant="outline" size="sm" onClick={applyToAllWeekdays}>
						Copy Monday to Weekdays
					</Button>
				</div>

				<div className="space-y-2">
					{DAYS_OF_WEEK.map((day) => {
						const daySchedule = schedule[day.id];
						const isWeekend = day.id === "saturday" || day.id === "sunday";

						return (
							<div
								key={day.id}
								className={cn(
									"flex items-center gap-4 rounded-xl p-3 transition-colors",
									daySchedule?.enabled ? "bg-muted/30" : "bg-muted/10"
								)}
							>
								<Switch
									checked={daySchedule?.enabled}
									onCheckedChange={(v) => updateDaySchedule(day.id, { enabled: v })}
								/>
								<span className={cn(
									"w-10 font-medium",
									!daySchedule?.enabled && "text-muted-foreground"
								)}>
									{day.label}
								</span>

								{daySchedule?.enabled ? (
									<div className="flex items-center gap-2 flex-1">
										<Select
											value={daySchedule.start}
											onValueChange={(v) => updateDaySchedule(day.id, { start: v })}
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
											onValueChange={(v) => updateDaySchedule(day.id, { end: v })}
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

								{isWeekend && daySchedule?.enabled && (
									<Badge variant="secondary" className="text-xs">Weekend</Badge>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Buffer Time */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
						<Coffee className="h-5 w-5" />
					</div>
					<div className="flex-1">
						<p className="font-medium">Buffer Time Between Jobs</p>
						<p className="text-sm text-muted-foreground">
							Add travel time between appointments
						</p>
					</div>
				</div>

				<Select value={bufferTime} onValueChange={handleBufferChange}>
					<SelectTrigger>
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

				<p className="text-xs text-muted-foreground">
					Recommended: 15-30 minutes for most service areas
				</p>
			</div>

			{/* Emergency Service */}
			<div className="rounded-xl bg-muted/30 p-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
							<AlertTriangle className="h-5 w-5 text-amber-500" />
						</div>
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

				{emergencyService && (
					<div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
						<p>Emergency calls will show an after-hours surcharge option and notify your on-call technician.</p>
					</div>
				)}
			</div>

			{/* Schedule Preview */}
			<div className="rounded-xl bg-muted/30 p-4 space-y-3">
				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
					Schedule Summary
				</p>

				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Sun className="h-4 w-4 text-amber-500" />
						<span className="text-sm">
							{enabledDays.length === 7
								? "Open 7 days a week"
								: enabledDays.length === 5
								? "Monday - Friday"
								: `${enabledDays.length} days per week`}
						</span>
					</div>

					{schedule.monday?.enabled && (
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								{formatTime(schedule.monday.start)} - {formatTime(schedule.monday.end)}
							</span>
						</div>
					)}

					{bufferTime !== "0" && (
						<div className="flex items-center gap-2">
							<Truck className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">{bufferTime} min buffer between jobs</span>
						</div>
					)}

					{emergencyService && (
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4 text-amber-500" />
							<span className="text-sm">24/7 emergency service enabled</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
