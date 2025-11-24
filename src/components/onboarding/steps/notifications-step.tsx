"use client";

/**
 * Notifications Step - Alert Preferences
 *
 * Configures how users want to be notified about:
 * - New bookings
 * - Job updates
 * - Payments
 * - Customer messages
 * - Reports & summaries
 */

import { useOnboardingStore, DEFAULT_NOTIFICATIONS } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Bell,
	Mail,
	MessageSquare,
	Smartphone,
	Calendar,
	Briefcase,
	DollarSign,
	Users,
	BarChart3,
	Clock,
	Moon,
	Sparkles,
	Volume2,
	VolumeX,
} from "lucide-react";

const NOTIFICATION_CATEGORIES = [
	{
		id: "new_booking",
		title: "New Bookings",
		description: "When a customer books a service",
		icon: Calendar,
		recommended: { push: true, email: true, sms: false },
	},
	{
		id: "job_updates",
		title: "Job Updates",
		description: "Status changes, tech arrivals, completions",
		icon: Briefcase,
		recommended: { push: true, email: false, sms: false },
	},
	{
		id: "payment_received",
		title: "Payments Received",
		description: "When customers pay invoices",
		icon: DollarSign,
		recommended: { push: true, email: true, sms: false },
	},
	{
		id: "customer_messages",
		title: "Customer Messages",
		description: "Emails, texts, and calls from customers",
		icon: Users,
		recommended: { push: true, email: true, sms: true },
	},
	{
		id: "daily_summary",
		title: "Daily Summary",
		description: "Overview of the day's activity",
		icon: BarChart3,
		recommended: { push: false, email: true, sms: false },
	},
	{
		id: "weekly_report",
		title: "Weekly Report",
		description: "Business performance digest",
		icon: BarChart3,
		recommended: { push: false, email: true, sms: false },
	},
];

export function NotificationsStep() {
	const { data, updateData } = useOnboardingStore();

	const updateNotification = (
		categoryId: string,
		channel: "push" | "email" | "sms",
		enabled: boolean
	) => {
		const updated = data.notifications.map((n) =>
			n.category === categoryId ? { ...n, [channel]: enabled } : n
		);
		updateData({ notifications: updated });
	};

	const getNotificationSetting = (categoryId: string) => {
		return data.notifications.find((n) => n.category === categoryId) || {
			category: categoryId,
			push: false,
			email: false,
			sms: false,
		};
	};

	const setAllToRecommended = () => {
		const recommended = NOTIFICATION_CATEGORIES.map((cat) => ({
			category: cat.id,
			...cat.recommended,
		}));
		updateData({ notifications: recommended });
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Notification preferences</h2>
				<p className="text-sm text-muted-foreground">
					Choose how you want to stay informed. You can change these anytime in settings.
				</p>
			</div>

			{/* Info Card */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Stay informed, not overwhelmed"
				description="We've pre-selected recommended settings based on what most businesses find helpful. Adjust to match your workflow."
				variant="tip"
			/>

			{/* Quick Actions */}
			<div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
				<div className="flex items-center gap-3">
					<Bell className="h-5 w-5 text-primary" />
					<div>
						<p className="font-medium">Use recommended settings</p>
						<p className="text-sm text-muted-foreground">
							Optimized for most field service businesses
						</p>
					</div>
				</div>
				<button
					onClick={setAllToRecommended}
					className="text-sm font-medium text-primary hover:underline"
				>
					Apply
				</button>
			</div>

			{/* Notification Categories */}
			<div className="space-y-4">
				{/* Header Row */}
				<div className="flex items-center gap-4 px-4 text-xs font-medium text-muted-foreground">
					<div className="flex-1">Notification Type</div>
					<div className="w-16 text-center">
						<Smartphone className="h-4 w-4 mx-auto mb-1" />
						Push
					</div>
					<div className="w-16 text-center">
						<Mail className="h-4 w-4 mx-auto mb-1" />
						Email
					</div>
					<div className="w-16 text-center">
						<MessageSquare className="h-4 w-4 mx-auto mb-1" />
						SMS
					</div>
				</div>

				{/* Category Rows */}
				{NOTIFICATION_CATEGORIES.map((category) => {
					const Icon = category.icon;
					const settings = getNotificationSetting(category.id);

					return (
						<div
							key={category.id}
							className="flex items-center gap-4 rounded-xl bg-muted/30 p-4"
						>
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
									<Icon className="h-5 w-5" />
								</div>
								<div className="min-w-0">
									<p className="font-medium truncate">{category.title}</p>
									<p className="text-sm text-muted-foreground truncate">
										{category.description}
									</p>
								</div>
							</div>

							<div className="w-16 flex justify-center">
								<Switch
									checked={settings.push}
									onCheckedChange={(v) =>
										updateNotification(category.id, "push", v)
									}
								/>
							</div>

							<div className="w-16 flex justify-center">
								<Switch
									checked={settings.email}
									onCheckedChange={(v) =>
										updateNotification(category.id, "email", v)
									}
								/>
							</div>

							<div className="w-16 flex justify-center">
								<Switch
									checked={settings.sms}
									onCheckedChange={(v) =>
										updateNotification(category.id, "sms", v)
									}
									disabled={!data.smsEnabled}
								/>
							</div>
						</div>
					);
				})}
			</div>

			{/* SMS Disabled Notice */}
			{!data.smsEnabled && (
				<div className="rounded-xl bg-amber-500/10 p-4 text-sm">
					<p className="font-medium text-amber-600 dark:text-amber-400 mb-1">
						SMS notifications disabled
					</p>
					<p className="text-muted-foreground">
						You didn't set up SMS in the phone step. Go back to enable SMS notifications.
					</p>
				</div>
			)}

			{/* Quiet Hours */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
							<Moon className="h-5 w-5" />
						</div>
						<div>
							<p className="font-medium">Quiet Hours</p>
							<p className="text-sm text-muted-foreground">
								Pause non-urgent notifications during set times
							</p>
						</div>
					</div>
					<Switch
						checked={data.quietHoursEnabled}
						onCheckedChange={(v) => updateData({ quietHoursEnabled: v })}
					/>
				</div>

				{data.quietHoursEnabled && (
					<div className="flex items-center gap-4 pt-2 border-t">
						<div className="flex items-center gap-2">
							<VolumeX className="h-4 w-4 text-muted-foreground" />
							<Input
								type="time"
								value={data.quietHoursStart}
								onChange={(e) => updateData({ quietHoursStart: e.target.value })}
								className="w-[120px]"
							/>
						</div>
						<span className="text-muted-foreground">to</span>
						<div className="flex items-center gap-2">
							<Volume2 className="h-4 w-4 text-muted-foreground" />
							<Input
								type="time"
								value={data.quietHoursEnd}
								onChange={(e) => updateData({ quietHoursEnd: e.target.value })}
								className="w-[120px]"
							/>
						</div>
					</div>
				)}
			</div>

			{/* Preview */}
			<div className="rounded-xl bg-muted/30 p-4 space-y-3">
				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
					Preview - What a notification looks like
				</p>
				<div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
						<DollarSign className="h-5 w-5 text-primary" />
					</div>
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<p className="font-medium">Payment Received</p>
							<span className="text-xs text-muted-foreground">Just now</span>
						</div>
						<p className="text-sm text-muted-foreground">
							John Smith paid $350.00 for Invoice #1234
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
