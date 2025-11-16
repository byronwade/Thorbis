"use client";

import { Bell, HelpCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getNotificationSettings, updateNotificationSettings } from "@/actions/settings";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import {
	DEFAULT_NOTIFICATION_SETTINGS,
	mapNotificationSettings,
	type NotificationSettingsState,
} from "./notifications-config";

type NotificationsClientProps = {
	initialSettings: Partial<NotificationSettingsState> | null;
};

type BooleanSettingKey = {
	[K in keyof NotificationSettingsState]: NotificationSettingsState[K] extends boolean ? K : never;
}[keyof NotificationSettingsState];

const CUSTOMER_TOGGLES: Array<{
	key: BooleanSettingKey;
	label: string;
	description: string;
}> = [
	{
		key: "sendJobConfirmation",
		label: "Job confirmation",
		description: "Confirm bookings as soon as they’re scheduled.",
	},
	{
		key: "sendDayBeforeReminder",
		label: "Day-before reminder",
		description: "Remind customers 24 hours before the job.",
	},
	{
		key: "sendJobCompletionSummary",
		label: "Completion summary",
		description: "Send a recap once the job is complete.",
	},
	{
		key: "sendPaymentReceipt",
		label: "Payment receipt",
		description: "Email a receipt whenever payment is recorded.",
	},
] as const;

const INTERNAL_ALERTS: Array<{
	key: BooleanSettingKey;
	label: string;
	description: string;
}> = [
	{
		key: "notifyJobScheduled",
		label: "Job scheduled",
		description: "Alert ops whenever a new job enters the calendar.",
	},
	{
		key: "notifyJobCompleted",
		label: "Job completed",
		description: "Send a summary when technicians mark a job done.",
	},
	{
		key: "notifyTechnicianAssignment",
		label: "Technician assignment",
		description: "Alert assigned techs and office simultaneously.",
	},
	{
		key: "notifyPaymentReceived",
		label: "Payment received",
		description: "Ping finance when invoices are paid.",
	},
] as const;

const CHANNEL_TOGGLES: Array<{
	key: BooleanSettingKey;
	label: string;
	description: string;
}> = [
	{
		key: "emailNotifications",
		label: "Email",
		description: "Send notifications via email.",
	},
	{
		key: "smsNotifications",
		label: "SMS",
		description: "Requires an active SMS number.",
	},
	{
		key: "pushNotifications",
		label: "Push",
		description: "Thorbis mobile push notifications.",
	},
	{
		key: "inAppNotifications",
		label: "In-app",
		description: "Bell icon + notification drawer.",
	},
] as const;

const FIFTEEN_MINUTES = 15;
const THIRTY_MINUTES = 30;
const FORTY_FIVE_MINUTES = 45;
const SIXTY_MINUTES = 60;

const ON_THE_WAY_MINUTES = [FIFTEEN_MINUTES, THIRTY_MINUTES, FORTY_FIVE_MINUTES, SIXTY_MINUTES] as const;

export function NotificationsClient({ initialSettings }: NotificationsClientProps) {
	const { settings, isLoading, isPending, hasUnsavedChanges, updateSetting, saveSettings, reload } =
		useSettings<NotificationSettingsState>({
			getter: getNotificationSettings,
			setter: updateNotificationSettings,
			initialState: DEFAULT_NOTIFICATION_SETTINGS,
			settingsName: "notifications",
			prefetchedData: initialSettings ?? undefined,
			transformLoad: (data) => mapNotificationSettings(data),
			transformSave: (state) => {
				const formData = new FormData();
				formData.append("notifyNewJobs", state.notifyJobScheduled.toString());
				formData.append("notifyJobUpdates", state.notifyTechnicianJobUpdate.toString());
				formData.append("notifyJobCompletions", state.notifyJobCompleted.toString());
				formData.append("notifyNewCustomers", state.notifyNewLeads.toString());
				formData.append("notifyInvoicePaid", state.notifyPaymentReceived.toString());
				formData.append("notifyTechnicianAssigned", state.notifyTechnicianAssignment.toString());
				formData.append("emailNotifications", state.emailNotifications.toString());
				formData.append("smsNotifications", state.smsNotifications.toString());
				formData.append("pushNotifications", state.pushNotifications.toString());
				formData.append("inAppNotifications", state.inAppNotifications.toString());
				return formData;
			},
		});

	const handleSave = useCallback(() => {
		saveSettings().catch(() => {
			// handled in hook
		});
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		reload().catch(() => {
			// handled in hook
		});
	}, [reload]);

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Manage customer and team notifications across every channel."
				hasChanges={hasUnsavedChanges}
				helpText="Applies workspace-wide. Personal overrides live under Profile > Notifications."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save notification settings"
				title="Notifications"
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
									<Link href="/dashboard/settings/communications">Communications</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Notifications</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button asChild variant="ghost">
						<Link href="/dashboard/settings/communications">Back to communications</Link>
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Smartphone className="size-4" />
							Customer notifications
						</CardTitle>
						<CardDescription>Automatic touchpoints sent to customers</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{CUSTOMER_TOGGLES.map((item) => (
							<div className="space-y-1" key={item.key}>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label className="font-medium text-sm">{item.label}</Label>
										<p className="text-muted-foreground text-xs">{item.description}</p>
									</div>
									<Switch
										checked={settings[item.key]}
										onCheckedChange={(checked) => updateSetting(item.key, checked)}
									/>
								</div>
								<Separator />
							</div>
						))}

						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="flex items-center gap-2 font-medium text-sm">
									“On the way” alert
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className="size-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>Notify customers when the technician departs.</TooltipContent>
									</Tooltip>
								</Label>
								<p className="text-muted-foreground text-xs">Includes ETA and technician name.</p>
							</div>
							<Switch
								checked={settings.sendOnTheWayAlert}
								onCheckedChange={(checked) => updateSetting("sendOnTheWayAlert", checked)}
							/>
						</div>
						{settings.sendOnTheWayAlert && (
							<div className={cn("space-y-2", "ml-6")}>
								<Label className="text-sm">Send alert when technician is</Label>
								<Select
									onValueChange={(value) => updateSetting("onTheWayMinutes", Number.parseInt(value, 10))}
									value={settings.onTheWayMinutes.toString()}
								>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ON_THE_WAY_MINUTES.map((value) => (
											<SelectItem key={value} value={value.toString()}>
												{value} minutes away
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bell className="size-4" />
							Internal alerts
						</CardTitle>
						<CardDescription>Keep the team informed of key events</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<Label className="font-medium text-sm">New leads</Label>
								<p className="text-muted-foreground text-xs">Notify sales when a new inquiry arrives.</p>
							</div>
							<Switch
								checked={settings.notifyNewLeads}
								onCheckedChange={(checked) => updateSetting("notifyNewLeads", checked)}
							/>
						</div>
						{settings.notifyNewLeads && (
							<div className={cn("grid gap-3 md:grid-cols-2", "ml-6")}>
								<div>
									<Label className="text-sm">Email recipients</Label>
									<Input
										className="mt-2"
										onChange={(event) => updateSetting("notifyNewLeadsEmail", event.target.value)}
										placeholder="sales@yourco.com"
										type="email"
										value={settings.notifyNewLeadsEmail}
									/>
								</div>
								<div className={cn("flex items-center justify-between", "rounded-lg border", "p-3")}>
									<div>
										<p className="font-medium text-sm">Send SMS too</p>
										<p className="text-muted-foreground text-xs">Uses the workspace SMS number.</p>
									</div>
									<Switch
										checked={settings.notifyNewLeadsSMS}
										onCheckedChange={(checked) => updateSetting("notifyNewLeadsSMS", checked)}
									/>
								</div>
							</div>
						)}
						<Separator />
						{INTERNAL_ALERTS.map((item, index, array) => (
							<div key={item.key}>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<Label className="font-medium text-sm">{item.label}</Label>
										<p className="text-muted-foreground text-xs">{item.description}</p>
									</div>
									<Switch
										checked={settings[item.key]}
										onCheckedChange={(checked) => updateSetting(item.key, checked)}
									/>
								</div>
								{index < array.length - 1 && <Separator className="my-3" />}
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Notification channels</CardTitle>
						<CardDescription>Choose which delivery methods are active by default</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{CHANNEL_TOGGLES.map((channel, index, array) => (
							<div key={channel.key}>
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-sm">{channel.label}</p>
										<p className="text-muted-foreground text-xs">{channel.description}</p>
									</div>
									<Switch
										checked={settings[channel.key]}
										onCheckedChange={(checked) => updateSetting(channel.key, checked)}
									/>
								</div>
								{index < array.length - 1 && <Separator className="my-3" />}
							</div>
						))}
					</CardContent>
				</Card>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default NotificationsClient;
