"use client";

import { CalendarClock, Route, Sandwich, Timer } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import {
	getAvailabilitySettings,
	updateAvailabilitySettings,
} from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import {
	type AvailabilitySettingsState,
	type DayAvailability,
	DEFAULT_AVAILABILITY_SETTINGS,
	mapAvailabilitySettings,
	serializeWorkHours,
} from "./availability-config";

type AvailabilityClientProps = {
	initialSettings: Partial<AvailabilitySettingsState> | null;
};

export function AvailabilityClient({
	initialSettings,
}: AvailabilityClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<AvailabilitySettingsState>({
		getter: getAvailabilitySettings,
		setter: updateAvailabilitySettings,
		initialState: DEFAULT_AVAILABILITY_SETTINGS,
		settingsName: "schedule availability",
		prefetchedData: initialSettings ?? undefined,
		transformLoad: (data) => mapAvailabilitySettings(data),
		transformSave: (state) => {
			const formData = new FormData();
			formData.append("defaultWorkHours", serializeWorkHours(state.week));
			formData.append(
				"defaultAppointmentDurationMinutes",
				state.defaultAppointmentDurationMinutes.toString(),
			);
			formData.append("bufferTimeMinutes", state.bufferTimeMinutes.toString());
			formData.append(
				"minBookingNoticeHours",
				state.minBookingNoticeHours.toString(),
			);
			formData.append(
				"maxBookingAdvanceDays",
				state.maxBookingAdvanceDays.toString(),
			);
			formData.append("lunchBreakEnabled", state.lunchBreakEnabled.toString());
			formData.append("lunchBreakStart", state.lunchBreakStart);
			formData.append(
				"lunchBreakDurationMinutes",
				state.lunchBreakDurationMinutes.toString(),
			);
			return formData;
		},
	});

	const updateDay = useCallback(
		(index: number, updates: Partial<DayAvailability>) => {
			const nextWeek = settings.week.map((day, idx) =>
				idx === index ? { ...day, ...updates } : day,
			);
			updateSetting("week", nextWeek);
		},
		[settings.week, updateSetting],
	);

	const handleSave = useCallback(() => {
		saveSettings().catch(() => {});
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		reload().catch(() => {});
	}, [reload]);

	return (
		<SettingsPageLayout
			description="Define weekly availability, booking windows, and buffer policies for your field teams."
			hasChanges={hasUnsavedChanges}
			helpText="These defaults seed booking rules across automations, portal flows, and dispatch."
			isLoading={isLoading}
			isPending={isPending}
			onCancel={handleCancel}
			onSave={handleSave}
			saveButtonText="Save availability"
			title="Availability"
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/dashboard/settings">Settings</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/dashboard/settings/schedule">Scheduling</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Availability</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<Button asChild variant="ghost">
					<Link href="/dashboard/settings/schedule">Back to scheduling</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CalendarClock className="size-4" />
						Weekly hours
					</CardTitle>
					<CardDescription>
						Toggle standard operating hours for each day of week
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{settings.week.map((day, index) => (
						<div key={day.key}>
							<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div className="flex items-center gap-3">
									<Switch
										checked={day.enabled}
										onCheckedChange={(checked) =>
											updateDay(index, { enabled: checked })
										}
									/>
									<p className="font-medium text-sm">{day.label}</p>
								</div>
								{day.enabled ? (
									<div className="flex flex-wrap items-center gap-3">
										<Input
											className="w-28"
											onChange={(event) =>
												updateDay(index, { start: event.target.value })
											}
											type="time"
											value={day.start}
										/>
										<span className="text-muted-foreground text-sm">to</span>
										<Input
											className="w-28"
											onChange={(event) =>
												updateDay(index, { end: event.target.value })
											}
											type="time"
											value={day.end}
										/>
									</div>
								) : (
									<p className="text-muted-foreground text-sm">Marked closed</p>
								)}
							</div>
							{index < settings.week.length - 1 && (
								<Separator className="my-4" />
							)}
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Route className="size-4" />
						Booking windows
					</CardTitle>
					<CardDescription>
						How far in advance customers can schedule work
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2">
					<div>
						<Label>Minimum notice (hours)</Label>
						<Input
							className="mt-2"
							min={0}
							onChange={(event) =>
								updateSetting(
									"minBookingNoticeHours",
									Number(event.target.value),
								)
							}
							type="number"
							value={settings.minBookingNoticeHours}
						/>
					</div>
					<div>
						<Label>Max advance (days)</Label>
						<Input
							className="mt-2"
							min={0}
							onChange={(event) =>
								updateSetting(
									"maxBookingAdvanceDays",
									Number(event.target.value),
								)
							}
							type="number"
							value={settings.maxBookingAdvanceDays}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Timer className="size-4" />
						Appointment defaults
					</CardTitle>
					<CardDescription>
						Duration and buffers used when no service-specific rule exists
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2">
					<div>
						<Label>Default duration (minutes)</Label>
						<Input
							className="mt-2"
							min={15}
							onChange={(event) =>
								updateSetting(
									"defaultAppointmentDurationMinutes",
									Number(event.target.value),
								)
							}
							type="number"
							value={settings.defaultAppointmentDurationMinutes}
						/>
					</div>
					<div>
						<Label>Buffer between jobs (minutes)</Label>
						<Input
							className="mt-2"
							min={0}
							onChange={(event) =>
								updateSetting("bufferTimeMinutes", Number(event.target.value))
							}
							type="number"
							value={settings.bufferTimeMinutes}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sandwich className="size-4" />
						Lunch break
					</CardTitle>
					<CardDescription>
						Apply a midday break across the schedule
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between rounded-lg border p-3">
						<div>
							<p className="font-medium text-sm">Enable lunch break</p>
							<p className="text-muted-foreground text-xs">
								Block out a window in the middle of each day.
							</p>
						</div>
						<Switch
							checked={settings.lunchBreakEnabled}
							onCheckedChange={(checked) =>
								updateSetting("lunchBreakEnabled", checked)
							}
						/>
					</div>

					{settings.lunchBreakEnabled && (
						<div className="flex flex-wrap gap-4">
							<div>
								<Label>Start</Label>
								<Input
									className="mt-2 w-32"
									onChange={(event) =>
										updateSetting("lunchBreakStart", event.target.value)
									}
									type="time"
									value={settings.lunchBreakStart}
								/>
							</div>
							<div>
								<Label>Duration (minutes)</Label>
								<Input
									className="mt-2 w-32"
									min={15}
									onChange={(event) =>
										updateSetting(
											"lunchBreakDurationMinutes",
											Number(event.target.value),
										)
									}
									type="number"
									value={settings.lunchBreakDurationMinutes}
								/>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</SettingsPageLayout>
	);
}

export default AvailabilityClient;
