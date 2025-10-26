"use client";

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

type NotificationType =
  | "message"
  | "alert"
  | "payment"
  | "job"
  | "team"
  | "system";

type NotificationPriority = "low" | "medium" | "high" | "urgent";

type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
};

// Time constants in milliseconds
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
// biome-ignore lint/style/noMagicNumbers: Timestamp constants for mock data - numbers are self-documenting
const FIVE_MINUTES = 5 * MS_PER_MINUTE;
// biome-ignore lint/style/noMagicNumbers: Timestamp constants for mock data
const FIFTEEN_MINUTES = 15 * MS_PER_MINUTE;
// biome-ignore lint/style/noMagicNumbers: Timestamp constants for mock data
const THIRTY_MINUTES = 30 * MS_PER_MINUTE;
const TWO_HOURS = 2 * MS_PER_HOUR;
// biome-ignore lint/style/noMagicNumbers: Timestamp constants for mock data
const FOUR_HOURS = 4 * MS_PER_HOUR;
const ONE_DAY = 24 * MS_PER_HOUR;

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "payment",
    priority: "high",
    title: "Payment Received",
    message: "Payment of $2,450 received from John's HVAC Inc.",
    timestamp: new Date(Date.now() - FIVE_MINUTES),
    read: false,
    actionUrl: "/dashboard/finance/invoices/inv-123",
    actionLabel: "View",
  },
  {
    id: "2",
    type: "job",
    priority: "urgent",
    title: "Urgent Job Assignment",
    message: "Emergency service call assigned to you at 123 Main St.",
    timestamp: new Date(Date.now() - FIFTEEN_MINUTES),
    read: false,
    actionUrl: "/dashboard/work/job-456",
    actionLabel: "View",
  },
  {
    id: "3",
    type: "message",
    priority: "medium",
    title: "New Message from Sarah Chen",
    message: "Can you provide an update on the HVAC installation project?",
    timestamp: new Date(Date.now() - THIRTY_MINUTES),
    read: false,
    actionUrl: "/dashboard/communication/messages/msg-789",
    actionLabel: "Reply",
  },
  {
    id: "4",
    type: "team",
    priority: "low",
    title: "New Team Member",
    message: "Mike Johnson has joined your team as a technician.",
    timestamp: new Date(Date.now() - TWO_HOURS),
    read: true,
    actionUrl: "/dashboard/settings/team",
    actionLabel: "View",
  },
  {
    id: "5",
    type: "alert",
    priority: "high",
    title: "Equipment Maintenance Due",
    message: "3 vehicles require scheduled maintenance this week.",
    timestamp: new Date(Date.now() - FOUR_HOURS),
    read: true,
    actionUrl: "/dashboard/work/equipment",
    actionLabel: "View",
  },
  {
    id: "6",
    type: "system",
    priority: "low",
    title: "System Update Available",
    message: "New features and improvements are ready to install.",
    timestamp: new Date(Date.now() - ONE_DAY),
    read: true,
    actionUrl: "/changelog",
    actionLabel: "View",
  },
];

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
const MAX_BADGE_COUNT = 9;

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
    <span className="-right-0.5 -top-0.5 absolute flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 font-bold text-[0.6rem] text-white">
      {count > MAX_BADGE_COUNT ? "9+" : count}
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
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
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
                              {formatTimestamp(notification.timestamp)}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {notification.actionUrl && (
                                <Link
                                  className="rounded px-2 py-1 font-medium text-primary text-xs transition-colors hover:bg-primary/10"
                                  href={notification.actionUrl}
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    setIsOpen(false);
                                  }}
                                >
                                  {notification.actionLabel}
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
