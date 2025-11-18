"use client";

/**
 * NotificationsDropdown - Client Component
 *
 * Client-side features:
 * - Interactive dropdown with notifications
 * - Real-time updates via Zustand store and Supabase Realtime
 * - Optimistic updates for better UX
 * - Mark as read/delete functionality
 */

import {
	AlertCircle,
	Bell,
	Check,
	CheckCheck,
	CheckCircle2,
	Clock,
	DollarSign,
	Loader2,
	MessageSquare,
	Settings,
	Trash2,
	UserPlus,
	Wrench,
	X,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	deleteNotification as deleteNotificationAction,
	markAllAsRead as markAllAsReadAction,
	markAsRead as markAsReadAction,
} from "@/actions/notifications";
import type { NotificationType } from "@/lib/stores/notifications-store";
import { useNotificationsStore } from "@/lib/stores/notifications-store";
import { useSyncStore } from "@/lib/stores/sync-store";
import { createClient } from "@/lib/supabase/client";

// Time constants in milliseconds
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
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

// Display constants
const ONE_MINUTE = 60;
const ONE_HOUR = 24;
const ONE_WEEK = 7;

function formatBadgeCount(count: number): string {
	if (count <= 9) {
		return count.toString();
	}
	if (count <= 99) {
		return "99+";
	}
	if (count <= 999) {
		return "999+";
	}
	return "1K+";
}

function formatTimestamp(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
	const diffHours = Math.floor(diffMs / MS_PER_HOUR);
	const diffDays = Math.floor(diffMs / (MS_PER_HOUR * 24));

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < ONE_MINUTE) {
		return `${diffMins}m ago`;
	}
	if (diffHours < ONE_HOUR) {
		return `${diffHours}h ago`;
	}
	if (diffDays < ONE_WEEK) {
		return `${diffDays}d ago`;
	}

	return date.toLocaleDateString();
}

function NotificationBadge({ count }: { count: number }) {
	if (count === 0) {
		return null;
	}
	return (
		<span className="bg-destructive absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[0.625rem] leading-none font-bold text-white">
			{formatBadgeCount(count)}
		</span>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<Bell className="text-muted-foreground/30 mb-3 size-12" />
			<p className="text-muted-foreground text-sm font-medium">
				All caught up!
			</p>
			<p className="text-muted-foreground text-xs">No new notifications</p>
		</div>
	);
}

export function NotificationsDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Get notifications from Zustand store
	const notifications = useNotificationsStore((state) => state.notifications);
	const unreadCount = useNotificationsStore((state) => state.unreadCount);
	const setNotifications = useNotificationsStore(
		(state) => state.setNotifications,
	);
	const optimisticMarkAsRead = useNotificationsStore(
		(state) => state.optimisticMarkAsRead,
	);
	const optimisticMarkAllAsRead = useNotificationsStore(
		(state) => state.optimisticMarkAllAsRead,
	);
	const optimisticDelete = useNotificationsStore(
		(state) => state.optimisticDelete,
	);
	const subscribe = useNotificationsStore((state) => state.subscribe);
	const unsubscribe = useNotificationsStore((state) => state.unsubscribe);

	// Get sync operations from sync store
	const operations = useSyncStore((state) => state.operations ?? []);
	const offlineQueue = useSyncStore((state) => state.offlineQueue ?? []);
	const clearCompleted = useSyncStore((state) => state.clearCompleted);

	// Filter for active operations
	const activeOperations = operations.filter(
		(op) => op.status === "in_progress",
	);
	const recentOperations = operations.filter(
		(op) => op.status === "completed" || op.status === "failed",
	);

	const hasSyncActivity =
		activeOperations.length > 0 || offlineQueue.length > 0;
	const syncBadgeCount = activeOperations.length + offlineQueue.length;
	const totalBadgeCount = unreadCount + syncBadgeCount;

	// Load notifications and set up realtime subscription on mount
	const hasInitializedRef = useRef(false);

	useEffect(() => {
		if (!isOpen || hasInitializedRef.current) {
			return;
		}

		let cancelled = false;

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

				const { data, error } = await supabase
					.from("notifications")
					.select("*")
					.eq("user_id", user.id)
					.order("created_at", { ascending: false })
					.range(0, 49);

				if (!cancelled && !error && data) {
					setNotifications(data);
				}

				if (!cancelled) {
					await subscribe(user.id);
					hasInitializedRef.current = true;
				}
			} catch (_error) {
				// Ignore initialization errors - component can retry later
			}
		}

		initialize();

		return () => {
			cancelled = true;
		};
	}, [isOpen, setNotifications, subscribe]);

	useEffect(() => {
		return () => {
			unsubscribe();
		};
	}, [unsubscribe]);

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Mark notification as read with optimistic update
	const markAsRead = async (id: string) => {
		// Optimistic update
		optimisticMarkAsRead(id);

		// Server action
		const result = await markAsReadAction(id);
		if (!result.success) {
			// TODO: Revert optimistic update on error
		}
	};

	// Mark all notifications as read with optimistic update
	const markAllAsRead = async () => {
		// Optimistic update
		optimisticMarkAllAsRead();

		// Server action
		const result = await markAllAsReadAction();
		if (!result.success) {
			// TODO: Revert optimistic update on error
		}
	};

	// Delete notification with optimistic update
	const deleteNotification = async (id: string) => {
		// Optimistic update
		optimisticDelete(id);

		// Server action
		const result = await deleteNotificationAction(id);
		if (!result.success) {
			// TODO: Revert optimistic update on error
		}
	};

	return (
		<div className="relative overflow-visible" ref={dropdownRef}>
			<button
				className="hover-gradient hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-ring/50 relative flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition-all outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
				onClick={() => setIsOpen(!isOpen)}
				title={
					hasSyncActivity ? "Notifications & Sync Status" : "Notifications"
				}
				type="button"
			>
				<div className="relative">
					<Bell className="size-4" />
					{hasSyncActivity && (
						<Loader2 className="text-primary absolute -top-1 -right-1 size-2.5 animate-spin" />
					)}
				</div>
				<NotificationBadge count={totalBadgeCount} />
				<span className="sr-only">
					Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
					{hasSyncActivity && ` • ${syncBadgeCount} syncing`}
				</span>
			</button>

			{isOpen && (
				<div className="bg-popover text-popover-foreground absolute top-full right-0 z-50 mt-2 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-lg border shadow-lg">
					{/* Header */}
					<div className="flex items-center justify-between border-b px-4 py-2.5">
						<div>
							<h3 className="text-sm font-semibold">
								{hasSyncActivity ? "Sync & Notifications" : "Notifications"}
							</h3>
							{(unreadCount > 0 || hasSyncActivity) && (
								<p className="text-muted-foreground text-xs">
									{hasSyncActivity && `${syncBadgeCount} syncing`}
									{hasSyncActivity && unreadCount > 0 && " • "}
									{unreadCount > 0 && `${unreadCount} unread`}
								</p>
							)}
						</div>
						<div className="flex items-center gap-1">
							{unreadCount > 0 && (
								<button
									className="hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors"
									onClick={markAllAsRead}
									title="Mark all as read"
									type="button"
								>
									<CheckCheck className="size-3.5" />
								</button>
							)}
							<button
								className="hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors"
								onClick={() => setIsOpen(false)}
								type="button"
							>
								<X className="size-3.5" />
							</button>
						</div>
					</div>

					{/* Sync Operations */}
					{(activeOperations.length > 0 ||
						offlineQueue.length > 0 ||
						recentOperations.length > 0) && (
						<div className="border-b">
							{/* Active Operations */}
							{activeOperations.length > 0 && (
								<div className="space-y-1 px-4 py-3">
									<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
										Active
									</p>
									{activeOperations.map((op) => (
										<div
											className="bg-primary/5 flex items-start gap-2 rounded-md p-2"
											key={op.id}
										>
											<Loader2 className="text-primary mt-0.5 size-3.5 shrink-0 animate-spin" />
											<div className="min-w-0 flex-1">
												<p className="text-sm leading-tight font-medium">
													{op.title}
												</p>
												{op.description && (
													<p className="text-muted-foreground text-xs">
														{op.description}
													</p>
												)}
												{op.total && op.total > 0 && (
													<div className="mt-1 space-y-0.5">
														<div className="bg-muted h-1 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full transition-all"
																style={{
																	width: `${((op.current ?? 0) / op.total) * 100}%`,
																}}
															/>
														</div>
														<p className="text-muted-foreground text-[0.625rem]">
															{op.current ?? 0} / {op.total}
														</p>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							)}

							{/* Offline Queue */}
							{offlineQueue.length > 0 && (
								<div className="space-y-1 px-4 py-3">
									<p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
										<span className="size-1.5 animate-pulse rounded-full bg-orange-500" />
										Queued (Offline)
									</p>
									{offlineQueue.map((op) => (
										<div
											className="flex items-start gap-2 rounded-md bg-orange-50 p-2 dark:bg-orange-950/20"
											key={op.id}
										>
											<Clock className="mt-0.5 size-3.5 shrink-0 text-orange-500" />
											<div className="min-w-0 flex-1">
												<p className="text-sm leading-tight font-medium">
													{op.action}
												</p>
												<p className="mt-0.5 text-[0.625rem] text-orange-600 dark:text-orange-400">
													Will sync when online
												</p>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Recent Operations */}
							{recentOperations.length > 0 && (
								<div className="space-y-1 px-4 py-3">
									<div className="mb-2 flex items-center justify-between">
										<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
											Recent
										</p>
										<button
											className="text-muted-foreground hover:text-foreground text-xs"
											onClick={clearCompleted}
											type="button"
										>
											Clear
										</button>
									</div>
									{recentOperations.map((op) => (
										<div
											className={`flex items-start gap-2 rounded-md p-2 ${
												op.status === "completed"
													? "bg-green-50 dark:bg-green-950/20"
													: "bg-red-50 dark:bg-red-950/20"
											}`}
											key={op.id}
										>
											{op.status === "completed" ? (
												<CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-600 dark:text-green-400" />
											) : (
												<XCircle className="mt-0.5 size-3.5 shrink-0 text-red-600 dark:text-red-400" />
											)}
											<div className="min-w-0 flex-1">
												<p className="text-sm leading-tight font-medium">
													{op.title}
												</p>
												{op.error && (
													<p className="text-xs text-red-600 dark:text-red-400">
														{op.error}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Notifications List */}
					<div className="max-h-[450px] overflow-y-auto">
						{notifications.length === 0 ? (
							<EmptyState />
						) : (
							<div className="divide-y">
								{notifications.map((notification) => {
									const Icon = notificationIcons[notification.type];
									return (
										<div
											className={`group hover:bg-accent/50 relative px-4 py-3 transition-colors ${
												notification.read ? "" : "bg-primary/5"
											}`}
											key={notification.id}
										>
											{/* Unread indicator */}
											{!notification.read && (
												<div className="bg-primary absolute top-0 left-0 h-full w-0.5" />
											)}

											<div className="flex gap-3">
												{/* Icon */}
												<div
													className={`mt-0.5 shrink-0 ${notificationColors[notification.type]}`}
												>
													<Icon className="size-4" />
												</div>

												{/* Content */}
												<div className="min-w-0 flex-1 space-y-1">
													<p className="text-sm leading-snug font-medium">
														{notification.title}
													</p>
													<p className="text-muted-foreground text-xs leading-relaxed">
														{notification.message}
													</p>

													{/* Footer */}
													<div className="flex items-center justify-between gap-2 pt-1">
														<div className="text-muted-foreground flex items-center gap-1 text-xs">
															<Clock className="size-3" />
															{formatTimestamp(
																new Date(notification.created_at),
															)}
														</div>

														{/* Actions */}
														<div className="flex items-center gap-1">
															{notification.action_url && (
																<Link
																	className="text-primary hover:bg-primary/10 rounded px-2 py-1 text-xs font-medium transition-colors"
																	href={notification.action_url}
																	onClick={() => {
																		markAsRead(notification.id);
																		setIsOpen(false);
																	}}
																>
																	{notification.action_label || "View"}
																</Link>
															)}
															{!notification.read && (
																<button
																	className="hover:bg-accent flex h-6 w-6 items-center justify-center rounded transition-colors"
																	onClick={() => markAsRead(notification.id)}
																	title="Mark as read"
																	type="button"
																>
																	<Check className="size-3" />
																</button>
															)}
															<button
																className="hover:bg-destructive/10 hover:text-destructive flex h-6 w-6 items-center justify-center rounded transition-colors"
																onClick={() =>
																	deleteNotification(notification.id)
																}
																title="Delete"
																type="button"
															>
																<Trash2 className="size-3" />
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Footer */}
					{notifications.length > 0 && (
						<div className="border-t px-4 py-2">
							<Link
								className="text-primary hover:bg-accent flex items-center justify-center rounded-md py-1.5 text-xs font-medium transition-colors"
								href="/dashboard/notifications"
								onClick={() => setIsOpen(false)}
							>
								View all notifications
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
