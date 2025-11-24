"use client";

/**
 * Notifications Step - Alert Preferences
 */

import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
	Moon,
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
		description: "Status changes, completions",
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
		description: "Emails, texts from customers",
		icon: Users,
		recommended: { push: true, email: true, sms: true },
	},
	{
		id: "daily_summary",
		title: "Daily Summary",
		description: "Overview of the day",
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
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Notification preferences</h2>
				<p className="text-muted-foreground">
					Choose how you want to stay informed. You can change these anytime.
				</p>
			</div>

			{/* Quick Actions */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Bell className="h-5 w-5 text-muted-foreground" />
					<span className="text-sm text-muted-foreground">
						Optimized for most field service businesses
					</span>
				</div>
				<button
					onClick={setAllToRecommended}
					className="text-sm font-medium text-primary hover:underline"
				>
					Use recommended
				</button>
			</div>

			{/* Notification Grid */}
			<div className="space-y-3">
				{/* Header Row */}
				<div className="flex items-center gap-4 px-4 text-xs font-medium text-muted-foreground">
					<div className="flex-1" />
					<div className="w-14 text-center">
						<Smartphone className="h-4 w-4 mx-auto mb-1" />
						Push
					</div>
					<div className="w-14 text-center">
						<Mail className="h-4 w-4 mx-auto mb-1" />
						Email
					</div>
					<div className="w-14 text-center">
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
							className="flex items-center gap-4 rounded-lg bg-muted/40 p-4"
						>
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
								<div className="min-w-0">
									<p className="font-medium">{category.title}</p>
									<p className="text-sm text-muted-foreground truncate">
										{category.description}
									</p>
								</div>
							</div>

							<div className="w-14 flex justify-center">
								<Switch
									checked={settings.push}
									onCheckedChange={(v) =>
										updateNotification(category.id, "push", v)
									}
								/>
							</div>

							<div className="w-14 flex justify-center">
								<Switch
									checked={settings.email}
									onCheckedChange={(v) =>
										updateNotification(category.id, "email", v)
									}
								/>
							</div>

							<div className="w-14 flex justify-center">
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
				<p className="text-sm text-muted-foreground">
					SMS notifications require phone setup. Go back to enable.
				</p>
			)}

			{/* Quiet Hours */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Moon className="h-5 w-5 text-muted-foreground" />
						<div>
							<p className="font-medium">Quiet Hours</p>
							<p className="text-sm text-muted-foreground">
								Pause non-urgent notifications
							</p>
						</div>
					</div>
					<Switch
						checked={data.quietHoursEnabled}
						onCheckedChange={(v) => updateData({ quietHoursEnabled: v })}
					/>
				</div>

				{data.quietHoursEnabled && (
					<div className="flex items-center gap-4">
						<Input
							type="time"
							value={data.quietHoursStart}
							onChange={(e) => updateData({ quietHoursStart: e.target.value })}
							className="w-[120px]"
						/>
						<span className="text-muted-foreground">to</span>
						<Input
							type="time"
							value={data.quietHoursEnd}
							onChange={(e) => updateData({ quietHoursEnd: e.target.value })}
							className="w-[120px]"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
