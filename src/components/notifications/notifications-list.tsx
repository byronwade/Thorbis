"use client";

/**
 * NotificationsList - Client Component
 *
 * Client-side features:
 * - Interactive notification list with filtering
 * - Real-time updates via Zustand store
 * - Pagination
 * - Mark as read/delete actions
 */

import {
	AlertCircle,
	Bell,
	Check,
	CheckCheck,
	Clock,
	DollarSign,
	MessageSquare,
	Settings,
	Trash2,
	UserPlus,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	deleteNotification as deleteNotificationAction,
	getNotifications,
	markAllAsRead as markAllAsReadAction,
	markAsRead as markAsReadAction,
} from "@/actions/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { NotificationPriority, NotificationType } from "@/lib/stores/notifications-store";
import { useNotificationsStore } from "@/lib/stores/notifications-store";
import { createClient } from "@/lib/supabase/client";

// Time constants
const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

const notificationIcons: Record<NotificationType, typeof Bell> = {
	message: MessageSquare,
	alert: AlertCircle,
	payment: DollarSign,
	job: Wrench,
	team: UserPlus,
	system: Settings,
};

const notificationColors: Record<NotificationType, string> = {
	message: "text-primary",
	alert: "text-warning",
	payment: "text-success",
	job: "text-accent-foreground",
	team: "text-cyan-500",
	system: "text-muted-foreground",
};

const priorityColors: Record<NotificationPriority, string> = {
	low: "bg-muted text-foreground dark:bg-foreground dark:text-muted-foreground",
	medium: "bg-primary text-primary dark:bg-primary dark:text-primary",
	high: "bg-warning text-warning dark:bg-warning dark:text-warning",
	urgent: "bg-destructive text-destructive dark:bg-destructive dark:text-destructive",
};

function formatTimestamp(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
	const diffHours = Math.floor(diffMs / MS_PER_HOUR);
	const diffDays = Math.floor(diffMs / (MS_PER_HOUR * 24));

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < 60) {
		return `${diffMins}m ago`;
	}
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	if (diffDays < 7) {
		return `${diffDays}d ago`;
	}

	return date.toLocaleDateString();
}

export function NotificationsList() {
	const [isInitialized, setIsInitialized] = useState(false);
	const [filterType, setFilterType] = useState<NotificationType | "all">("all");
	const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

	// Get notifications from Zustand store
	const notifications = useNotificationsStore((state) => state.notifications);
	const setNotifications = useNotificationsStore((state) => state.setNotifications);
	const optimisticMarkAsRead = useNotificationsStore((state) => state.optimisticMarkAsRead);
	const optimisticMarkAllAsRead = useNotificationsStore((state) => state.optimisticMarkAllAsRead);
	const optimisticDelete = useNotificationsStore((state) => state.optimisticDelete);
	const subscribe = useNotificationsStore((state) => state.subscribe);
	const unsubscribe = useNotificationsStore((state) => state.unsubscribe);

	// Load notifications and set up realtime subscription
	useEffect(() => {
		async function initialize() {
			try {
				const supabase = createClient();

				if (!supabase) {
					return;
				}

				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					return;
				}

				// Load all notifications (not just 50 like in dropdown)
				const result = await getNotifications({ limit: 100 });

				if (result.success && result.data) {
					setNotifications(result.data);
				}

				// Set up Supabase Realtime subscription
				await subscribe(user.id);
				setIsInitialized(true);
			} catch (_error) {
				console.error("Error:", _error);
			}
		}

		if (!isInitialized) {
			initialize();
		}

		return () => {
			unsubscribe();
		};
	}, [isInitialized, setNotifications, subscribe, unsubscribe]);

	// Mark notification as read
	const markAsRead = async (id: string) => {
		optimisticMarkAsRead(id);
		const result = await markAsReadAction(id);
		if (!result.success) {
			// TODO: Handle error case
		}
	};

	// Mark all as read
	const markAllAsRead = async () => {
		optimisticMarkAllAsRead();
		const result = await markAllAsReadAction();
		if (!result.success) {
			// TODO: Handle error case
		}
	};

	// Delete notification
	const deleteNotification = async (id: string) => {
		optimisticDelete(id);
		const result = await deleteNotificationAction(id);
		if (!result.success) {
			// TODO: Handle error case
		}
	};

	// Filter notifications
	const filteredNotifications = notifications.filter((notification) => {
		if (filterType !== "all" && notification.type !== filterType) {
			return false;
		}
		if (filterRead === "unread" && notification.read) {
			return false;
		}
		if (filterRead === "read" && !notification.read) {
			return false;
		}
		return true;
	});

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<div className="space-y-4">
			{/* Filters and Actions */}
			<Card className="p-4">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() => setFilterRead("all")}
							size="sm"
							variant={filterRead === "all" ? "default" : "outline"}
						>
							All
						</Button>
						<Button
							onClick={() => setFilterRead("unread")}
							size="sm"
							variant={filterRead === "unread" ? "default" : "outline"}
						>
							Unread ({unreadCount})
						</Button>
						<Button
							onClick={() => setFilterRead("read")}
							size="sm"
							variant={filterRead === "read" ? "default" : "outline"}
						>
							Read
						</Button>
					</div>

					<div className="flex gap-2">
						{unreadCount > 0 && (
							<Button onClick={markAllAsRead} size="sm" variant="outline">
								<CheckCheck className="mr-2 size-4" />
								Mark All Read
							</Button>
						)}
					</div>
				</div>

				{/* Type filters */}
				<div className="mt-4 flex flex-wrap gap-2">
					<Button onClick={() => setFilterType("all")} size="sm" variant={filterType === "all" ? "default" : "ghost"}>
						All Types
					</Button>
					{(["message", "alert", "payment", "job", "team", "system"] as NotificationType[]).map((type) => {
						const Icon = notificationIcons[type];
						return (
							<Button
								key={type}
								onClick={() => setFilterType(type)}
								size="sm"
								variant={filterType === type ? "default" : "ghost"}
							>
								<Icon className="mr-2 size-3" />
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</Button>
						);
					})}
				</div>
			</Card>

			{/* Notifications List */}
			{filteredNotifications.length === 0 ? (
				<Card className="p-12">
					<div className="flex flex-col items-center justify-center text-center">
						<Bell className="mb-4 size-16 text-muted-foreground/30" />
						<h3 className="mb-2 font-semibold text-lg">No notifications</h3>
						<p className="text-muted-foreground text-sm">
							{filterRead === "unread"
								? "You're all caught up! No unread notifications."
								: filterType !== "all"
									? `No ${filterType} notifications found.`
									: "You don't have any notifications yet."}
						</p>
					</div>
				</Card>
			) : (
				<div className="space-y-2">
					{filteredNotifications.map((notification) => {
						const Icon = notificationIcons[notification.type];
						return (
							<Card
								className={`p-4 transition-colors ${notification.read ? "bg-background" : "bg-primary/5"}`}
								key={notification.id}
							>
								<div className="flex gap-4">
									{/* Icon */}
									<div className={`mt-1 shrink-0 ${notificationColors[notification.type]}`}>
										<Icon className="size-5" />
									</div>

									{/* Content */}
									<div className="min-w-0 flex-1 space-y-2">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<h3 className="font-semibold text-base">{notification.title}</h3>
												<p className="mt-1 text-muted-foreground text-sm">{notification.message}</p>
											</div>
											<Badge className={priorityColors[notification.priority]} variant="outline">
												{notification.priority}
											</Badge>
										</div>

										{/* Footer */}
										<div className="flex flex-wrap items-center justify-between gap-2">
											<div className="flex items-center gap-1 text-muted-foreground text-xs">
												<Clock className="size-3" />
												{formatTimestamp(new Date(notification.created_at))}
											</div>

											<div className="flex items-center gap-2">
												{notification.action_url && (
													<Link href={notification.action_url}>
														<Button onClick={() => markAsRead(notification.id)} size="sm" variant="ghost">
															{notification.action_label || "View"}
														</Button>
													</Link>
												)}
												{!notification.read && (
													<Button
														onClick={() => markAsRead(notification.id)}
														size="sm"
														title="Mark as read"
														variant="ghost"
													>
														<Check className="size-4" />
													</Button>
												)}
												<Button
													className="hover:text-destructive"
													onClick={() => deleteNotification(notification.id)}
													size="sm"
													title="Delete"
													variant="ghost"
												>
													<Trash2 className="size-4" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
