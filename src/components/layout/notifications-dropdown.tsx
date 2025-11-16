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
	getNotifications,
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
		<span className="-right-1 -top-1 absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1.5 font-bold text-[0.625rem] text-white leading-none">
			{formatBadgeCount(count)}
		</span>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<Bell className="mb-3 size-12 text-muted-foreground/30" />
			<p className="font-medium text-muted-foreground text-sm">
				All caught up!
			</p>
			<p className="text-muted-foreground text-xs">No new notifications</p>
		</div>
	);
}

export function NotificationsDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
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
	useEffect(() => {
		async function initialize() {
			try {
				// Get current user
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

				// Load initial notifications
				const result = await getNotifications({ limit: 50 });

				if (result.success && result.data) {
					setNotifications(result.data);
				}

				// Set up Supabase Realtime subscription
				await subscribe(user.id);
				setIsInitialized(true);
			} catch (_error) {}
		}

		if (!isInitialized) {
			initialize();
		}

		// Cleanup on unmount
		return () => {
			unsubscribe();
		};
	}, [isInitialized, setNotifications, subscribe, unsubscribe]);

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
				className="hover-gradient relative flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
				onClick={() => setIsOpen(!isOpen)}
				title={
					hasSyncActivity ? "Notifications & Sync Status" : "Notifications"
				}
				type="button"
			>
				<div className="relative">
					<Bell className="size-4" />
					{hasSyncActivity && (
						<Loader2 className="-right-1 -top-1 absolute size-2.5 animate-spin text-primary" />
					)}
				</div>
				<NotificationBadge count={totalBadgeCount} />
				<span className="sr-only">
					Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
					{hasSyncActivity && ` • ${syncBadgeCount} syncing`}
				</span>
			</button>

			{isOpen && (
				<div className="absolute top-full right-0 z-50 mt-2 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-lg border bg-popover text-popover-foreground shadow-lg">
					{/* Header */}
					<div className="flex items-center justify-between border-b px-4 py-2.5">
						<div>
							<h3 className="font-semibold text-sm">
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
									className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-accent"
									onClick={markAllAsRead}
									title="Mark all as read"
									type="button"
								>
									<CheckCheck className="size-3.5" />
								</button>
							)}
							<button
								className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-accent"
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
									<p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
										Active
									</p>
									{activeOperations.map((op) => (
										<div
											className="flex items-start gap-2 rounded-md bg-primary/5 p-2"
											key={op.id}
										>
											<Loader2 className="mt-0.5 size-3.5 shrink-0 animate-spin text-primary" />
											<div className="min-w-0 flex-1">
												<p className="font-medium text-sm leading-tight">
													{op.title}
												</p>
												{op.description && (
													<p className="text-muted-foreground text-xs">
														{op.description}
													</p>
												)}
												{op.total && op.total > 0 && (
													<div className="mt-1 space-y-0.5">
														<div className="h-1 overflow-hidden rounded-full bg-muted">
															<div
																className="h-full bg-primary transition-all"
																style={{
																	width: `${((op.current ?? 0) / op.total) * 100}%`,
																}}
															/>
														</div>
														<p className="text-[0.625rem] text-muted-foreground">
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
									<p className="mb-2 flex items-center gap-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
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
												<p className="font-medium text-sm leading-tight">
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
										<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
											Recent
										</p>
										<button
											className="text-muted-foreground text-xs hover:text-foreground"
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
												<p className="font-medium text-sm leading-tight">
													{op.title}
												</p>
												{op.error && (
													<p className="text-red-600 text-xs dark:text-red-400">
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
											className={`group relative px-4 py-3 transition-colors hover:bg-accent/50 ${
												notification.read ? "" : "bg-primary/5"
											}`}
											key={notification.id}
										>
											{/* Unread indicator */}
											{!notification.read && (
												<div className="absolute top-0 left-0 h-full w-0.5 bg-primary" />
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
													<p className="font-medium text-sm leading-snug">
														{notification.title}
													</p>
													<p className="text-muted-foreground text-xs leading-relaxed">
														{notification.message}
													</p>

													{/* Footer */}
													<div className="flex items-center justify-between gap-2 pt-1">
														<div className="flex items-center gap-1 text-muted-foreground text-xs">
															<Clock className="size-3" />
															{formatTimestamp(
																new Date(notification.created_at),
															)}
														</div>

														{/* Actions */}
														<div className="flex items-center gap-1">
															{notification.action_url && (
																<Link
																	className="rounded px-2 py-1 font-medium text-primary text-xs transition-colors hover:bg-primary/10"
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
																	className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-accent"
																	onClick={() => markAsRead(notification.id)}
																	title="Mark as read"
																	type="button"
																>
																	<Check className="size-3" />
																</button>
															)}
															<button
																className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-destructive/10 hover:text-destructive"
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
								className="flex items-center justify-center rounded-md py-1.5 font-medium text-primary text-xs transition-colors hover:bg-accent"
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
