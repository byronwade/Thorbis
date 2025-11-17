"use client";

import { Bell, HelpCircle, Mail, MessageSquare, Smartphone } from "lucide-react";
import { getNotificationPreferences, updateNotificationPreferences } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import {
	DEFAULT_NOTIFICATION_PREFERENCES,
	mapNotificationPreferences,
	type NotificationPreferencesState,
} from "./notification-config";

type ToggleConfig = {
	key: keyof NotificationPreferencesState;
	label: string;
	description: string;
	tooltip: string;
};

const emailToggleConfig: ToggleConfig[] = [
	{
		key: "emailNewJobs",
		label: "New job assignments",
		description: "Get notified when new jobs are assigned to you or your team.",
		tooltip: "Recommended so you never miss an assignment.",
	},
	{
		key: "emailJobUpdates",
		label: "Job status changes",
		description: "Receive updates when job dates or statuses change.",
		tooltip: "Great for keeping customers in the loop.",
	},
	{
		key: "emailMentions",
		label: "Mentions & comments",
		description: "Alerts when teammates mention you in notes or comments.",
		tooltip: "Helps you stay on top of collaboration.",
	},
	{
		key: "emailMessages",
		label: "Customer messages",
		description: "Notifications for inbound customer replies or chats.",
		tooltip: "Ensure you respond quickly to customers.",
	},
];

const pushToggleConfig: ToggleConfig[] = [
	{
		key: "pushNewJobs",
		label: "New job alerts",
		description: "Push notification whenever a job hits your queue.",
		tooltip: "Perfect for on-the-go technicians.",
	},
	{
		key: "pushJobUpdates",
		label: "Job updates",
		description: "Reschedules, cancellations, and important job changes.",
		tooltip: "Keep your day coordinated from your phone.",
	},
	{
		key: "pushMentions",
		label: "Mentions",
		description: "Get pinged when someone tags you in a discussion.",
		tooltip: "Prevents missed follow-ups.",
	},
	{
		key: "pushMessages",
		label: "Messages",
		description: "Push alerts for new customer chats or SMS threads.",
		tooltip: "Reply faster and improve experience.",
	},
];

const smsToggleConfig: ToggleConfig[] = [
	{
		key: "smsUrgentJobs",
		label: "Urgent job alerts",
		description: "Critical outages, emergencies, and escalations.",
		tooltip: "Best for managers and on-call crews.",
	},
	{
		key: "smsScheduleChanges",
		label: "Schedule changes",
		description: "Same-day schedule adjustments and reroutes.",
		tooltip: "Only the most important schedule texts.",
	},
];

type NotificationsClientProps = {
	initialSettings: NotificationPreferencesState;
};

export function NotificationsClient({ initialSettings }: NotificationsClientProps) {
	const { settings, isLoading, isPending, hasUnsavedChanges, updateSetting, saveSettings, reload } =
		useSettings<NotificationPreferencesState>({
			getter: getNotificationPreferences,
			setter: updateNotificationPreferences,
			initialState: DEFAULT_NOTIFICATION_PREFERENCES,
			settingsName: "notifications",
			prefetchedData: initialSettings,
			transformLoad: (data) => mapNotificationPreferences(data),
			transformSave: (state) => {
				const fd = new FormData();
				fd.append("emailNewJobs", state.emailNewJobs.toString());
				fd.append("emailJobUpdates", state.emailJobUpdates.toString());
				fd.append("emailMentions", state.emailMentions.toString());
				fd.append("emailMessages", state.emailMessages.toString());
				fd.append("pushNewJobs", state.pushNewJobs.toString());
				fd.append("pushJobUpdates", state.pushJobUpdates.toString());
				fd.append("pushMentions", state.pushMentions.toString());
				fd.append("pushMessages", state.pushMessages.toString());
				fd.append("smsUrgentJobs", state.smsUrgentJobs.toString());
				fd.append("smsScheduleChanges", state.smsScheduleChanges.toString());
				fd.append("inAppAll", state.inAppAll.toString());
				fd.append("digestEnabled", "false");
				fd.append("digestFrequency", "daily");
				return fd;
			},
		});

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Manage how and when you receive notifications."
				hasChanges={hasUnsavedChanges}
				helpText="These preferences apply only to you and can be updated whenever your communication needs change."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={() => {
					reload();
				}}
				onSave={() => saveSettings()}
				saveButtonText="Save notification settings"
				title="Notifications"
			>
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Mail className="size-4" />
								Email Notifications
							</CardTitle>
							<CardDescription>Choose which events should send you an email.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{emailToggleConfig.map((option, index) => (
								<div key={option.key}>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label className="flex items-center gap-2 text-sm font-medium">
												{option.label}
												<Tooltip>
													<TooltipTrigger asChild>
														<button type="button">
															<HelpCircle className="text-muted-foreground h-3 w-3" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-xs text-sm">{option.tooltip}</p>
													</TooltipContent>
												</Tooltip>
											</Label>
											<p className="text-muted-foreground text-xs">{option.description}</p>
										</div>
										<Switch
											checked={settings[option.key]}
											onCheckedChange={(checked) => updateSetting(option.key, checked)}
										/>
									</div>
									{index < emailToggleConfig.length - 1 && <Separator className="my-4" />}
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Smartphone className="size-4" />
								Push Notifications
							</CardTitle>
							<CardDescription>Real-time alerts delivered to your devices.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{pushToggleConfig.map((option, index) => (
								<div key={option.key}>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label className="flex items-center gap-2 text-sm font-medium">
												{option.label}
												<Tooltip>
													<TooltipTrigger asChild>
														<button type="button">
															<HelpCircle className="text-muted-foreground h-3 w-3" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-xs text-sm">{option.tooltip}</p>
													</TooltipContent>
												</Tooltip>
											</Label>
											<p className="text-muted-foreground text-xs">{option.description}</p>
										</div>
										<Switch
											checked={settings[option.key]}
											onCheckedChange={(checked) => updateSetting(option.key, checked)}
										/>
									</div>
									{index < pushToggleConfig.length - 1 && <Separator className="my-4" />}
								</div>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<MessageSquare className="size-4" />
								SMS Notifications
							</CardTitle>
							<CardDescription>Only the most urgent alerts via text.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{smsToggleConfig.map((option, index) => (
								<div key={option.key}>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Label className="flex items-center gap-2 text-sm font-medium">
												{option.label}
												<Tooltip>
													<TooltipTrigger asChild>
														<button type="button">
															<HelpCircle className="text-muted-foreground h-3 w-3" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-xs text-sm">{option.tooltip}</p>
													</TooltipContent>
												</Tooltip>
											</Label>
											<p className="text-muted-foreground text-xs">{option.description}</p>
										</div>
										<Switch
											checked={settings[option.key]}
											onCheckedChange={(checked) => updateSetting(option.key, checked)}
										/>
									</div>
									{index < smsToggleConfig.length - 1 && <Separator className="my-4" />}
								</div>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Bell className="size-4" />
								In-App Notifications
							</CardTitle>
							<CardDescription>
								Badges, toasts, and notification drawer preferences.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<Label className="flex items-center gap-2 text-sm font-medium">
										Everything in-app
										<Tooltip>
											<TooltipTrigger asChild>
												<button type="button">
													<HelpCircle className="text-muted-foreground h-3 w-3" />
												</button>
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs text-sm">
													Toggle all in-app badges, sounds, and alerts.
												</p>
											</TooltipContent>
										</Tooltip>
									</Label>
									<p className="text-muted-foreground text-xs">
										Turn this off if you only want email or push updates.
									</p>
								</div>
								<Switch
									checked={settings.inAppAll}
									onCheckedChange={(checked) => updateSetting("inAppAll", checked)}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default NotificationsClient;
