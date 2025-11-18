"use client";

/**
 * Settings > Profile > Notifications > Email Page
 *
 * Sub-page of notifications - uses same data
 */

import {
	Archive,
	ArrowLeft,
	Calendar,
	Clock,
	CreditCard,
	Loader2,
	Mail,
	MessageSquare,
	Send,
	Shield,
	Trash2,
	Users,
} from "lucide-react";
import Link from "next/link";
import {
	getNotificationPreferences,
	updateNotificationPreferences,
} from "@/actions/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import {
	DEFAULT_NOTIFICATION_PREFERENCES,
	mapNotificationPreferences,
	type NotificationPreferencesState,
} from "../notification-config";

type EmailNotificationSettings = Pick<
	NotificationPreferencesState,
	"emailNewJobs" | "emailJobUpdates" | "emailMentions" | "emailMessages"
>;

const DEFAULT_EMAIL_SETTINGS: EmailNotificationSettings = {
	emailNewJobs: true,
	emailJobUpdates: true,
	emailMentions: true,
	emailMessages: true,
};

const pickEmailSettings = (
	prefs: NotificationPreferencesState,
): EmailNotificationSettings => ({
	emailNewJobs: prefs.emailNewJobs,
	emailJobUpdates: prefs.emailJobUpdates,
	emailMentions: prefs.emailMentions,
	emailMessages: prefs.emailMessages,
});

const emailToggleConfig = [
	{
		key: "emailNewJobs",
		label: "New job assignments",
		description: "Get notified when new jobs are assigned to you or your team.",
	},
	{
		key: "emailJobUpdates",
		label: "Job status changes",
		description: "Receive updates when job dates or statuses change.",
	},
	{
		key: "emailMentions",
		label: "Mentions & comments",
		description: "Alerts when teammates mention you in notes or comments.",
	},
	{
		key: "emailMessages",
		label: "Customer messages",
		description: "Notifications for inbound customer replies or chats.",
	},
] as const;

type NotificationsEmailClientProps = {
	initialPreferences: NotificationPreferencesState;
};

export default function NotificationsEmailClient({
	initialPreferences,
}: NotificationsEmailClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<EmailNotificationSettings>({
		getter: getNotificationPreferences,
		setter: updateNotificationPreferences,
		initialState: DEFAULT_EMAIL_SETTINGS,
		settingsName: "email notifications",
		prefetchedData: pickEmailSettings(initialPreferences),
		transformLoad: (data) =>
			pickEmailSettings(
				mapNotificationPreferences(data) ?? DEFAULT_NOTIFICATION_PREFERENCES,
			),
		transformSave: (s) => {
			const fd = new FormData();
			fd.append("emailNewJobs", s.emailNewJobs.toString());
			fd.append("emailJobUpdates", s.emailJobUpdates.toString());
			fd.append("emailMentions", s.emailMentions.toString());
			fd.append("emailMessages", s.emailMessages.toString());
			fd.append("pushNewJobs", "true");
			fd.append("pushJobUpdates", "true");
			fd.append("pushMentions", "true");
			fd.append("pushMessages", "true");
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
				<Loader2 className="text-muted-foreground size-8 animate-spin" />
			</div>
		);
	}
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button asChild size="icon" variant="outline">
					<Link href="/dashboard/settings/profile/notifications">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-4xl font-bold tracking-tight">
						Email Preferences
					</h1>
					<p className="text-muted-foreground">
						Control how and when you receive email notifications
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<Button
					disabled={!hasUnsavedChanges || isPending}
					onClick={() => saveSettings()}
				>
					{isPending ? "Saving..." : "Save Email Preferences"}
				</Button>
				<Button
					disabled={isPending}
					onClick={() => {
						reload();
					}}
					type="button"
					variant="outline"
				>
					Reset from Account
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Key Email Alerts</CardTitle>
					<CardDescription>
						Toggle the most common notification categories.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{emailToggleConfig.map((option, index) => (
						<div key={option.key}>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium">{option.label}</p>
									<p className="text-muted-foreground text-xs">
										{option.description}
									</p>
								</div>
								<Switch
									checked={settings[option.key]}
									onCheckedChange={(checked) =>
										updateSetting(option.key, checked)
									}
								/>
							</div>
							{index < emailToggleConfig.length - 1 && (
								<Separator className="my-4" />
							)}
						</div>
					))}
				</CardContent>
			</Card>

			{/* Email Overview */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<Mail className="text-primary h-4 w-4" />
							<span className="text-sm font-medium">Total Emails</span>
						</div>
						<div className="text-2xl font-bold">247</div>
						<p className="text-muted-foreground text-xs">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<Archive className="text-success h-4 w-4" />
							<span className="text-sm font-medium">Read Rate</span>
						</div>
						<div className="text-2xl font-bold">68%</div>
						<p className="text-muted-foreground text-xs">Average open rate</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<Clock className="text-warning h-4 w-4" />
							<span className="text-sm font-medium">Unsubscribe Rate</span>
						</div>
						<div className="text-2xl font-bold">2.1%</div>
						<p className="text-muted-foreground text-xs">Below industry avg</p>
					</CardContent>
				</Card>
			</div>

			{/* Email Delivery Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Send className="h-5 w-5" />
						Email Delivery
					</CardTitle>
					<CardDescription>
						Configure how emails are delivered to your inbox
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Email Notifications</div>
							<div className="text-muted-foreground text-sm">
								Receive email notifications for important updates
							</div>
						</div>
						<Switch defaultChecked />
					</div>

					<div className="space-y-2">
						<p className="text-sm font-medium">Email Frequency</p>
						<Select defaultValue="immediate">
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="immediate">Immediate</SelectItem>
								<SelectItem value="hourly">Hourly Digest</SelectItem>
								<SelectItem value="daily">Daily Digest</SelectItem>
								<SelectItem value="weekly">Weekly Summary</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Smart Filtering</div>
							<div className="text-muted-foreground text-sm">
								Automatically filter and prioritize important emails
							</div>
						</div>
						<Switch defaultChecked />
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Auto-Archive</div>
							<div className="text-muted-foreground text-sm">
								Automatically archive read notification emails after 30 days
							</div>
						</div>
						<Switch defaultChecked />
					</div>
				</CardContent>
			</Card>

			{/* Email Types */}
			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="text-primary h-5 w-5" />
							Job & Schedule Emails
						</CardTitle>
						<CardDescription>
							Emails related to job assignments, scheduling, and work updates
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<div className="bg-primary dark:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
										<Calendar className="text-primary h-5 w-5" />
									</div>
									<div>
										<div className="font-medium">New Job Assignments</div>
										<div className="text-muted-foreground text-sm">
											When jobs are assigned to you
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Switch defaultChecked />
									<Badge variant="secondary">High Priority</Badge>
								</div>
							</div>

							<div className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<div className="bg-success dark:bg-success/20 flex h-10 w-10 items-center justify-center rounded-full">
										<Clock className="text-success h-5 w-5" />
									</div>
									<div>
										<div className="font-medium">Schedule Changes</div>
										<div className="text-muted-foreground text-sm">
											When job times or dates change
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Switch defaultChecked />
									<Badge variant="secondary">High Priority</Badge>
								</div>
							</div>

							<div className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<div className="bg-accent dark:bg-accent/20 flex h-10 w-10 items-center justify-center rounded-full">
										<Users className="text-accent-foreground h-5 w-5" />
									</div>
									<div>
										<div className="font-medium">Job Updates</div>
										<div className="text-muted-foreground text-sm">
											Status changes and completion notices
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Switch defaultChecked />
									<Badge variant="outline">Normal</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="text-success h-5 w-5" />
							Customer Communication
						</CardTitle>
						<CardDescription>
							Emails from customers and client interactions
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<div className="bg-success dark:bg-success/20 flex h-10 w-10 items-center justify-center rounded-full">
										<MessageSquare className="text-success h-5 w-5" />
									</div>
									<div>
										<div className="font-medium">Customer Messages</div>
										<div className="text-muted-foreground text-sm">
											Direct messages from customers
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Switch defaultChecked />
									<Badge variant="secondary">High Priority</Badge>
								</div>
							</div>

							<div className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<div className="bg-warning dark:bg-warning/20 flex h-10 w-10 items-center justify-center rounded-full">
										<CreditCard className="text-warning h-5 w-5" />
									</div>
									<div>
										<div className="font-medium">Payment Notifications</div>
										<div className="text-muted-foreground text-sm">
											Payment status and reminders
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Switch defaultChecked />
									<Badge variant="outline">Normal</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="text-destructive h-5 w-5" />
							Security & System
						</CardTitle>
						<CardDescription>
							Security alerts and important system notifications
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<div className="bg-destructive dark:bg-destructive/20 flex h-10 w-10 items-center justify-center rounded-full">
										<Shield className="text-destructive h-5 w-5" />
									</div>
									<div>
										<div className="font-medium">Security Alerts</div>
										<div className="text-muted-foreground text-sm">
											Login attempts and security events
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Switch defaultChecked />
									<Badge variant="destructive">Critical</Badge>
								</div>
							</div>

							<div className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<div className="bg-warning dark:bg-warning/20 flex h-10 w-10 items-center justify-center rounded-full">
										<Mail className="text-warning h-5 w-5" />
									</div>
									<div>
										<div className="font-medium">Account Changes</div>
										<div className="text-muted-foreground text-sm">
											Password changes and account updates
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Switch defaultChecked />
									<Badge variant="secondary">High Priority</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Email Management */}
			<Card>
				<CardHeader>
					<CardTitle>Email Management</CardTitle>
					<CardDescription>
						Manage your email subscriptions and preferences
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Marketing Emails</div>
							<div className="text-muted-foreground text-sm">
								Product updates, tips, and promotional content
							</div>
						</div>
						<Switch />
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Weekly Reports</div>
							<div className="text-muted-foreground text-sm">
								Weekly summary of your account activity
							</div>
						</div>
						<Switch defaultChecked />
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Tips & Tutorials</div>
							<div className="text-muted-foreground text-sm">
								Helpful guides and best practices
							</div>
						</div>
						<Switch />
					</div>

					<Separator />

					<div className="space-y-2">
						<p className="text-sm font-medium">Email Format</p>
						<Select defaultValue="html">
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="html">Rich HTML</SelectItem>
								<SelectItem value="text">Plain Text</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<div className="font-medium">Unsubscribe from All</div>
							<div className="text-muted-foreground text-sm">
								Stop receiving all marketing and promotional emails
							</div>
						</div>
						<Button size="sm" variant="destructive">
							<Trash2 className="mr-2 size-4" />
							Unsubscribe All
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Email Templates Preview */}
			<Card>
				<CardHeader>
					<CardTitle>Email Template Preview</CardTitle>
					<CardDescription>
						See how your emails will look in your inbox
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="bg-secondary dark:bg-foreground/50 rounded-lg border p-4">
							<div className="flex items-start gap-3">
								<div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white">
									S
								</div>
								<div className="min-w-0 flex-1">
									<div className="mb-1 flex items-center gap-2">
										<span className="text-sm font-medium">Thorbis</span>
										<Badge className="text-xs" variant="secondary">
											Job Update
										</Badge>
									</div>
									<div className="mb-1 text-sm font-medium">
										New job assigned: Kitchen Repair
									</div>
									<div className="text-muted-foreground mb-2 text-xs">
										A new job has been assigned to you. Please review the
										details and confirm your availability.
									</div>
									<div className="text-muted-foreground text-xs">
										2 minutes ago • noreply@thorbis.com
									</div>
								</div>
							</div>
						</div>

						<div className="flex gap-3">
							<Button size="sm" variant="outline">
								View Sample Email
							</Button>
							<Button size="sm" variant="outline">
								Test Email Settings
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
