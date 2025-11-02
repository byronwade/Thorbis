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
  Clock,
  DollarSign,
  MessageSquare,
  Settings,
  Trash2,
  UserPlus,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useNotificationsStore } from "@/lib/stores/notifications-store";
import type {
  NotificationType,
  NotificationPriority,
} from "@/lib/stores/notifications-store";
import {
  getNotifications,
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
  deleteNotification as deleteNotificationAction,
} from "@/actions/notifications";
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
  message: "text-blue-500",
  alert: "text-orange-500",
  payment: "text-green-500",
  job: "text-purple-500",
  team: "text-cyan-500",
  system: "text-gray-500",
};

// Display constants
const ONE_MINUTE = 60;
const ONE_HOUR = 24;
const ONE_WEEK = 7;

function formatBadgeCount(count: number): string {
  if (count <= 9) return count.toString();
  if (count <= 99) return "99+";
  if (count <= 999) return "999+";
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
    <span className="-right-1 -top-1 absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1.5 font-bold text-[0.625rem] text-white leading-none">
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
  const setNotifications = useNotificationsStore((state) => state.setNotifications);
  const optimisticMarkAsRead = useNotificationsStore(
    (state) => state.optimisticMarkAsRead
  );
  const optimisticMarkAllAsRead = useNotificationsStore(
    (state) => state.optimisticMarkAllAsRead
  );
  const optimisticDelete = useNotificationsStore((state) => state.optimisticDelete);
  const subscribe = useNotificationsStore((state) => state.subscribe);
  const unsubscribe = useNotificationsStore((state) => state.unsubscribe);

  // Load notifications and set up realtime subscription on mount
  useEffect(() => {
    async function initialize() {
      try {
        // Get current user
        const supabase = createClient();

        if (!supabase) {
          console.error("Supabase client not configured");
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("No authenticated user found");
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
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
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
      console.error("Failed to mark notification as read:", result.error);
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
      console.error("Failed to mark all notifications as read:", result.error);
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
      console.error("Failed to delete notification:", result.error);
      // TODO: Revert optimistic update on error
    }
  };

  return (
    <div className="relative overflow-visible" ref={dropdownRef}>
      <button
        className="hover-gradient relative flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        type="button"
      >
        <Bell className="size-4" />
        <NotificationBadge count={unreadCount} />
        <span className="sr-only">
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-lg border bg-popover text-popover-foreground shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <div>
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-muted-foreground text-xs">
                  {unreadCount} unread
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
                              {formatTimestamp(new Date(notification.created_at))}
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
