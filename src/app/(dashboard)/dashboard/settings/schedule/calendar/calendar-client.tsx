"use client";

import { CalendarDays, Palette, PlugZap, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import {
	getCalendarSettings,
	updateCalendarSettings,
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import {
	type CalendarSettingsState,
	DEFAULT_CALENDAR_SETTINGS,
	mapCalendarSettings,
} from "./calendar-config";

type CalendarSettingsClientProps = {
	initialSettings: Partial<CalendarSettingsState> | null;
};

export function CalendarSettingsClient({
	initialSettings,
}: CalendarSettingsClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<CalendarSettingsState>({
		getter: getCalendarSettings,
		setter: updateCalendarSettings,
		initialState: DEFAULT_CALENDAR_SETTINGS,
		settingsName: "schedule calendar",
		prefetchedData: initialSettings ?? undefined,
		transformLoad: (data) => mapCalendarSettings(data),
		transformSave: (state) => {
			const formData = new FormData();
			formData.append("defaultView", state.defaultView);
			formData.append(
				"startDayOfWeek",
				state.startDayOfWeek === "sunday" ? "0" : "1",
			);
			formData.append(
				"timeSlotDurationMinutes",
				state.timeSlotDurationMinutes.toString(),
			);
			formData.append(
				"showTechnicianColors",
				state.showTechnicianColors.toString(),
			);
			formData.append(
				"showJobStatusColors",
				state.showJobStatusColors.toString(),
			);
			formData.append("showTravelTime", state.showTravelTime.toString());
			formData.append("showCustomerName", state.showCustomerName.toString());
			formData.append("showJobType", state.showJobType.toString());
			formData.append(
				"syncWithGoogleCalendar",
				state.syncWithGoogleCalendar.toString(),
			);
			formData.append("syncWithOutlook", state.syncWithOutlook.toString());
			return formData;
		},
	});

	const handleSave = useCallback(() => {
		saveSettings().catch(() => {});
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		reload().catch(() => {});
	}, [reload]);

	return (
		<SettingsPageLayout
			description="Control default calendar view, color coding, and synced integrations."
			hasChanges={hasUnsavedChanges}
			helpText="These preferences apply to every dispatcher using the web calendar."
			isLoading={isLoading}
			isPending={isPending}
			onCancel={handleCancel}
			onSave={handleSave}
			saveButtonText="Save calendar settings"
			title="Calendar"
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
							<BreadcrumbPage>Calendar</BreadcrumbPage>
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
						<CalendarDays className="size-4" />
						Default view
					</CardTitle>
					<CardDescription>Choose layout and starting day</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2">
					<div>
						<Label>Calendar view</Label>
						<Select
							onValueChange={(value) =>
								updateSetting(
									"defaultView",
									value as CalendarSettingsState["defaultView"],
								)
							}
							value={settings.defaultView}
						>
							<SelectTrigger className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="day">Day</SelectItem>
								<SelectItem value="week">Week</SelectItem>
								<SelectItem value="month">Month</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label>First day of week</Label>
						<Select
							onValueChange={(value) =>
								updateSetting("startDayOfWeek", value as "sunday" | "monday")
							}
							value={settings.startDayOfWeek}
						>
							<SelectTrigger className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="sunday">Sunday</SelectItem>
								<SelectItem value="monday">Monday</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UserCircle2 className="size-4" />
						Time slots
					</CardTitle>
					<CardDescription>
						Control spacing between bookable times
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2">
					<div>
						<Label>Slot duration</Label>
						<Select
							onValueChange={(value) =>
								updateSetting(
									"timeSlotDurationMinutes",
									Number.parseInt(value, 10),
								)
							}
							value={settings.timeSlotDurationMinutes.toString()}
						>
							<SelectTrigger className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="15">15 min</SelectItem>
								<SelectItem value="30">30 min</SelectItem>
								<SelectItem value="45">45 min</SelectItem>
								<SelectItem value="60">60 min</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Palette className="size-4" />
						Color coding & display
					</CardTitle>
					<CardDescription>Highlight jobs by tech or status</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{[
						{
							key: "showTechnicianColors",
							label: "Technician colors",
							description: "Fill events with each technician’s color.",
						},
						{
							key: "showJobStatusColors",
							label: "Status colors",
							description: "Colorize jobs by workflow stage.",
						},
						{
							key: "showTravelTime",
							label: "Show travel buffers",
							description: "Visualize drive time between appointments.",
						},
						{
							key: "showCustomerName",
							label: "Customer name",
							description: "Display customer names on the calendar card.",
						},
						{
							key: "showJobType",
							label: "Job type",
							description: "Show the job category/bundle on each event.",
						},
					].map((item) => (
						<div
							className="flex items-center justify-between rounded-lg border p-3"
							key={item.key}
						>
							<div>
								<p className="font-medium text-sm">{item.label}</p>
								<p className="text-muted-foreground text-xs">
									{item.description}
								</p>
							</div>
							<Switch
								checked={
									settings[item.key as keyof CalendarSettingsState] as boolean
								}
								onCheckedChange={(checked) =>
									updateSetting(
										item.key as keyof CalendarSettingsState,
										checked,
									)
								}
							/>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<PlugZap className="size-4" />
						Integrations
					</CardTitle>
					<CardDescription>
						Keep Thorbis in sync with your external calendars
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between rounded-lg border p-3">
						<div>
							<p className="font-medium text-sm">Sync with Google Calendar</p>
							<p className="text-muted-foreground text-xs">
								Push job updates to connected Google calendars.
							</p>
						</div>
						<Switch
							checked={settings.syncWithGoogleCalendar}
							onCheckedChange={(checked) =>
								updateSetting("syncWithGoogleCalendar", checked)
							}
						/>
					</div>
					<div className="flex items-center justify-between rounded-lg border p-3">
						<div>
							<p className="font-medium text-sm">Sync with Outlook</p>
							<p className="text-muted-foreground text-xs">
								Mirror events to Microsoft 365 or Exchange calendars.
							</p>
						</div>
						<Switch
							checked={settings.syncWithOutlook}
							onCheckedChange={(checked) =>
								updateSetting("syncWithOutlook", checked)
							}
						/>
					</div>
				</CardContent>
			</Card>
		</SettingsPageLayout>
	);
}

export default CalendarSettingsClient;
