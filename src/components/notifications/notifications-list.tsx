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

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  message: "text-blue-500",
  alert: "text-orange-500",
  payment: "text-green-500",
  job: "text-purple-500",
  team: "text-cyan-500",
  system: "text-gray-500",
};

const priorityColors: Record<NotificationPriority, string> = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / (MS_PER_HOUR * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export function NotificationsList() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

  // Get notifications from Zustand store
  const notifications = useNotificationsStore((state) => state.notifications);
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

  // Load notifications and set up realtime subscription
  useEffect(() => {
    async function initialize() {
      try {
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

        // Load all notifications (not just 50 like in dropdown)
        const result = await getNotifications({ limit: 100 });

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

    return () => {
      unsubscribe();
    };
  }, [isInitialized, setNotifications, subscribe, unsubscribe]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    optimisticMarkAsRead(id);
    const result = await markAsReadAction(id);
    if (!result.success) {
      console.error("Failed to mark notification as read:", result.error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    optimisticMarkAllAsRead();
    const result = await markAllAsReadAction();
    if (!result.success) {
      console.error("Failed to mark all notifications as read:", result.error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    optimisticDelete(id);
    const result = await deleteNotificationAction(id);
    if (!result.success) {
      console.error("Failed to delete notification:", result.error);
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
              variant={filterRead === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRead("all")}
            >
              All
            </Button>
            <Button
              variant={filterRead === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRead("unread")}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filterRead === "read" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRead("read")}
            >
              Read
            </Button>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="mr-2 size-4" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Type filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={filterType === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterType("all")}
          >
            All Types
          </Button>
          {(
            ["message", "alert", "payment", "job", "team", "system"] as NotificationType[]
          ).map((type) => {
            const Icon = notificationIcons[type];
            return (
              <Button
                key={type}
                variant={filterType === type ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterType(type)}
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
                key={notification.id}
                className={`p-4 transition-colors ${
                  notification.read ? "bg-background" : "bg-primary/5"
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`mt-1 shrink-0 ${notificationColors[notification.type]}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          {notification.message}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={priorityColors[notification.priority]}
                      >
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              {notification.action_label || "View"}
                            </Button>
                          </Link>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete"
                          className="hover:text-destructive"
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
