"use client";

import {
	ArrowLeft,
	Bell,
	Clock,
	Loader2,
	MapPin,
	Monitor,
	Settings,
	Smartphone,
	Tablet,
	Trash2,
	Volume2,
	VolumeX,
} from "lucide-react";
import Link from "next/link";
import { getNotificationPreferences, updateNotificationPreferences } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import {
	DEFAULT_NOTIFICATION_PREFERENCES,
	mapNotificationPreferences,
	type NotificationPreferencesState,
} from "../notification-config";

type ConnectedDevice = {
	id: string;
	name: string;
	subtitle: string;
	lastActive: string;
	icon: "phone" | "desktop" | "tablet";
	enabled: boolean;
};

const connectedDevices: ConnectedDevice[] = [
	{
		id: "iphone",
		name: "iPhone 13",
		subtitle: "Thorbis Mobile App",
		lastActive: "Last active 2 hours ago",
		icon: "phone",
		enabled: true,
	},
	{
		id: "macbook",
		name: "MacBook Pro",
		subtitle: "Chrome Browser",
		lastActive: "Last active now",
		icon: "desktop",
		enabled: true,
	},
	{
		id: "ipad",
		name: "iPad Pro",
		subtitle: "Safari Browser",
		lastActive: "Last active 1 day ago",
		icon: "tablet",
		enabled: false,
	},
];

type PushNotificationSettings = Pick<NotificationPreferencesState, "pushNewJobs" | "pushMessages">;

const DEFAULT_PUSH_SETTINGS: PushNotificationSettings = {
	pushNewJobs: true,
	pushMessages: true,
};

const pickPushSettings = (prefs: NotificationPreferencesState): PushNotificationSettings => ({
	pushNewJobs: prefs.pushNewJobs,
	pushMessages: prefs.pushMessages,
});

type NotificationsPushClientProps = {
	initialPreferences: NotificationPreferencesState;
};

export default function NotificationsPushClient({ initialPreferences }: NotificationsPushClientProps) {
	const { settings, isLoading, isPending, hasUnsavedChanges, updateSetting, saveSettings, reload } =
		useSettings<PushNotificationSettings>({
			getter: getNotificationPreferences,
			setter: updateNotificationPreferences,
			initialState: DEFAULT_PUSH_SETTINGS,
			settingsName: "push notifications",
			prefetchedData: pickPushSettings(initialPreferences),
			transformLoad: (data) => pickPushSettings(mapNotificationPreferences(data) ?? DEFAULT_NOTIFICATION_PREFERENCES),
			transformSave: (s) => {
				const fd = new FormData();
				fd.append("pushNewJobs", s.pushNewJobs.toString());
				fd.append("pushMessages", s.pushMessages.toString());
				fd.append("pushJobUpdates", "true");
				fd.append("pushMentions", "true");
				fd.append("emailNewJobs", "true");
				fd.append("emailJobUpdates", "true");
				fd.append("emailMentions", "true");
				fd.append("emailMessages", "true");
				fd.append("smsUrgentJobs", "false");
				fd.append("smsScheduleChanges", "false");
				fd.append("inAppAll", "true");
				fd.append("digestEnabled", "false");
				fd.append("digestFrequency", "daily");
				return fd;
			},
		});

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="size-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const iconLookup = {
		phone: Smartphone,
		desktop: Monitor,
		tablet: Tablet,
	} as const;

	return (
		<SettingsPageLayout
			description="Manage push notifications on each device and keep alerts focused."
			hasChanges={hasUnsavedChanges}
			helpText="Enable notifications only on devices you trust, choose the categories you care about, and schedule quiet hours."
			isPending={isPending}
			onCancel={() => {
				reload();
			}}
			onSave={() => saveSettings()}
			saveButtonText="Save push preferences"
			title="Push Notifications"
		>
			<div className="flex items-center gap-3 text-muted-foreground text-sm">
				<Button asChild size="icon" variant="outline">
					<Link href="/dashboard/settings/profile/notifications">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<span>Back to notification overview</span>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Smartphone className="h-5 w-5" />
						Connected Devices
					</CardTitle>
					<CardDescription>Manage push notifications per device and browser.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						{connectedDevices.map((device) => {
							const Icon = iconLookup[device.icon];
							return (
								<div className="flex items-center justify-between rounded-lg border p-4" key={device.id}>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
											<Icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<div className="font-medium">{device.name}</div>
											<div className="text-muted-foreground text-sm">{device.subtitle}</div>
											<div className="text-muted-foreground text-xs">{device.lastActive}</div>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex items-center gap-2">
											<Switch defaultChecked={device.enabled} />
											<span className="text-sm">{device.enabled ? "Enabled" : "Disabled"}</span>
										</div>
										<Button size="sm" variant="outline">
											<Trash2 className="size-4" />
										</Button>
									</div>
								</div>
							);
						})}
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Browser Permissions</div>
							<div className="text-muted-foreground text-sm">Allow this browser to show push notifications.</div>
						</div>
						<Button variant="outline">
							<Settings className="mr-2 size-4" />
							Browser Settings
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Notification Types
					</CardTitle>
					<CardDescription>Choose which push alerts you want to receive.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15">
									<Volume2 className="h-4 w-4 text-destructive" />
								</div>
								<div>
									<div className="font-medium">Critical Alerts</div>
									<div className="text-muted-foreground text-sm">Security issues and emergency notifications</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Switch defaultChecked disabled />
								<Badge variant="destructive">Always</Badge>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
									<MapPin className="h-4 w-4 text-primary" />
								</div>
								<div>
									<div className="font-medium">Job Updates</div>
									<div className="text-muted-foreground text-sm">New assignments, schedule changes, and reminders</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Switch
									checked={settings.pushNewJobs}
									onCheckedChange={(checked) => updateSetting("pushNewJobs", checked)}
								/>
								<Badge variant="secondary">High</Badge>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
									<Volume2 className="h-4 w-4 text-success" />
								</div>
								<div>
									<div className="font-medium">Customer Messages</div>
									<div className="text-muted-foreground text-sm">Direct messages from customers</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Switch
									checked={settings.pushMessages}
									onCheckedChange={(checked) => updateSetting("pushMessages", checked)}
								/>
								<Badge variant="secondary">High</Badge>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/15">
									<Clock className="h-4 w-4 text-warning" />
								</div>
								<div>
									<div className="font-medium">Schedule Reminders</div>
									<div className="text-muted-foreground text-sm">Upcoming appointments and deadlines</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Switch defaultChecked />
								<Badge variant="outline">Normal</Badge>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15">
									<VolumeX className="h-4 w-4 text-accent-foreground" />
								</div>
								<div>
									<div className="font-medium">System Updates</div>
									<div className="text-muted-foreground text-sm">Maintenance windows and product updates</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Switch />
								<Badge variant="outline">Low</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Sound & Appearance</CardTitle>
					<CardDescription>Customize the look and sound of push notifications.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{[
						{
							label: "Notification Sounds",
							description: "Play sounds when notifications arrive",
						},
						{
							label: "Show Previews",
							description: "Display notification content on the lock screen",
						},
						{
							label: "Badge App Icon",
							description: "Show unread counts on app icons",
						},
						{
							label: "Group Notifications",
							description: "Group similar notifications together",
						},
						{
							label: "Auto-Hide",
							description: "Automatically dismiss notifications after 5 seconds",
						},
					].map((item) => (
						<div className="flex items-center justify-between" key={item.label}>
							<div className="space-y-0.5">
								<div className="font-medium">{item.label}</div>
								<div className="text-muted-foreground text-sm">{item.description}</div>
							</div>
							<Switch defaultChecked />
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Quiet Hours
					</CardTitle>
					<CardDescription>Automatically mute push notifications during certain hours.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Enable Quiet Hours</div>
							<div className="text-muted-foreground text-sm">Mute push notifications during the specified range.</div>
						</div>
						<Switch defaultChecked />
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<label className="font-medium text-sm">Start Time</label>
							<input
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
								defaultValue="21:00"
								type="time"
							/>
						</div>
						<div className="space-y-2">
							<label className="font-medium text-sm">End Time</label>
							<input
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
								defaultValue="06:00"
								type="time"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="font-medium text-sm">Days</label>
						<div className="flex flex-wrap gap-2">
							{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
								<Button key={day} size="sm" variant="outline">
									{day}
								</Button>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</SettingsPageLayout>
	);
}
