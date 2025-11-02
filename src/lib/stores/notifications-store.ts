/**
 * Notifications Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand (no provider wrapper)
 * - Selective subscriptions prevent unnecessary re-renders
 * - Real-time updates via Supabase Realtime
 * - Optimistic updates for better UX
 * - Organized in /src/lib/stores/ directory
 *
 * Usage in components:
 * ```typescript
 * const notifications = useNotificationsStore((state) => state.notifications);
 * const unreadCount = useNotificationsStore((state) => state.unreadCount);
 * const markAsRead = useNotificationsStore((state) => state.markAsRead);
 * ```
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// =====================================================================================
// Types
// =====================================================================================

export type NotificationType =
  | "message"
  | "alert"
  | "payment"
  | "job"
  | "team"
  | "system";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  user_id: string;
  company_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  read_at: string | null;
  action_url: string | null;
  action_label: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface NotificationsState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isSubscribed: boolean;
  error: string | null;
  realtimeChannel: RealtimeChannel | null;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  removeNotification: (id: string) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Optimistic updates
  optimisticMarkAsRead: (id: string) => void;
  optimisticMarkAsUnread: (id: string) => void;
  optimisticMarkAllAsRead: () => void;
  optimisticDelete: (id: string) => void;

  // Realtime subscription management
  subscribe: (userId: string) => Promise<void>;
  unsubscribe: () => void;

  // Utility
  reset: () => void;
}

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isSubscribed: false,
  error: null,
  realtimeChannel: null,
};

// =====================================================================================
// Zustand Store
// =====================================================================================

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ===============================================================================
      // Basic State Setters
      // ===============================================================================

      setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount });
      },

      addNotification: (notification) =>
        set((state) => {
          const exists = state.notifications.some((n) => n.id === notification.id);
          if (exists) return state;

          const newNotifications = [notification, ...state.notifications];
          const unreadCount = newNotifications.filter((n) => !n.read).length;

          return {
            notifications: newNotifications,
            unreadCount,
          };
        }),

      updateNotification: (id, updates) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          );
          const unreadCount = notifications.filter((n) => !n.read).length;

          return { notifications, unreadCount };
        }),

      removeNotification: (id) =>
        set((state) => {
          const notifications = state.notifications.filter((n) => n.id !== id);
          const unreadCount = notifications.filter((n) => !n.read).length;

          return { notifications, unreadCount };
        }),

      setUnreadCount: (unreadCount) => set({ unreadCount }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // ===============================================================================
      // Optimistic Updates
      // ===============================================================================

      optimisticMarkAsRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
          );
          const unreadCount = notifications.filter((n) => !n.read).length;

          return { notifications, unreadCount };
        }),

      optimisticMarkAsUnread: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: false, read_at: null } : n
          );
          const unreadCount = notifications.filter((n) => !n.read).length;

          return { notifications, unreadCount };
        }),

      optimisticMarkAllAsRead: () =>
        set((state) => {
          const notifications = state.notifications.map((n) => ({
            ...n,
            read: true,
            read_at: n.read_at || new Date().toISOString(),
          }));

          return { notifications, unreadCount: 0 };
        }),

      optimisticDelete: (id) =>
        set((state) => {
          const notifications = state.notifications.filter((n) => n.id !== id);
          const unreadCount = notifications.filter((n) => !n.read).length;

          return { notifications, unreadCount };
        }),

      // ===============================================================================
      // Realtime Subscription Management
      // ===============================================================================

      subscribe: async (userId: string) => {
        try {
          const state = get();

          // Don't subscribe if already subscribed
          if (state.isSubscribed || state.realtimeChannel) {
            console.log("Already subscribed to notifications");
            return;
          }

          const supabase = createClient();

          if (!supabase) {
            console.error("Supabase client not configured");
            set({ error: "Failed to initialize realtime updates" });
            return;
          }

          // Create realtime channel for notifications
          const channel = supabase
            .channel("notifications-changes")
            .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${userId}`,
              },
              (payload: RealtimePostgresChangesPayload<Notification>) => {
                console.log("New notification received:", payload.new);
                if (payload.new) {
                  get().addNotification(payload.new as Notification);

                  // Play notification sound if enabled
                  if (typeof window !== "undefined") {
                    // Check user preferences for sound (could be stored in localStorage)
                    const soundEnabled = localStorage.getItem(
                      "notifications_sound_enabled"
                    );
                    if (soundEnabled !== "false") {
                      // Play a subtle notification sound
                      const audio = new Audio("/sounds/notification.mp3");
                      audio.volume = 0.3;
                      audio.play().catch(() => {
                        // Ignore errors (user hasn't interacted with page yet)
                      });
                    }

                    // Show desktop notification if enabled and permission granted
                    const desktopEnabled = localStorage.getItem(
                      "notifications_desktop_enabled"
                    );
                    if (
                      desktopEnabled !== "false" &&
                      "Notification" in window &&
                      Notification.permission === "granted"
                    ) {
                      const notification = payload.new as Notification;
                      new Notification(notification.title, {
                        body: notification.message,
                        icon: "/icon-192x192.svg",
                        badge: "/icon-192x192.svg",
                        tag: notification.id,
                      });
                    }
                  }
                }
              }
            )
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${userId}`,
              },
              (payload: RealtimePostgresChangesPayload<Notification>) => {
                console.log("Notification updated:", payload.new);
                if (payload.new) {
                  const notification = payload.new as Notification;
                  get().updateNotification(notification.id, notification);
                }
              }
            )
            .on(
              "postgres_changes",
              {
                event: "DELETE",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${userId}`,
              },
              (payload: RealtimePostgresChangesPayload<Notification>) => {
                console.log("Notification deleted:", payload.old);
                if (payload.old) {
                  get().removeNotification((payload.old as Notification).id);
                }
              }
            )
            .subscribe((status) => {
              if (status === "SUBSCRIBED") {
                console.log("Successfully subscribed to notifications channel");
                set({ isSubscribed: true });
              } else if (status === "CHANNEL_ERROR") {
                console.error("Error subscribing to notifications channel");
                set({ error: "Failed to subscribe to real-time updates" });
              } else if (status === "TIMED_OUT") {
                console.error("Subscription timed out");
                set({ error: "Real-time subscription timed out" });
              }
            });

          set({ realtimeChannel: channel });
        } catch (error) {
          console.error("Error setting up realtime subscription:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to set up real-time updates",
          });
        }
      },

      unsubscribe: () => {
        const state = get();

        if (state.realtimeChannel) {
          console.log("Unsubscribing from notifications channel");
          state.realtimeChannel.unsubscribe();
          set({ realtimeChannel: null, isSubscribed: false });
        }
      },

      // ===============================================================================
      // Utility
      // ===============================================================================

      reset: () => set(initialState),
    }),
    { name: "NotificationsStore" }
  )
);

// =====================================================================================
// Selectors (for optimized re-renders)
// =====================================================================================

/**
 * Get only unread notifications
 */
export const selectUnreadNotifications = (state: NotificationsState) =>
  state.notifications.filter((n) => !n.read);

/**
 * Get notifications by type
 */
export const selectNotificationsByType = (type: NotificationType) => (
  state: NotificationsState
) => state.notifications.filter((n) => n.type === type);

/**
 * Get notifications by priority
 */
export const selectNotificationsByPriority = (priority: NotificationPriority) => (
  state: NotificationsState
) => state.notifications.filter((n) => n.priority === priority);

/**
 * Get urgent unread notifications
 */
export const selectUrgentUnreadNotifications = (state: NotificationsState) =>
  state.notifications.filter((n) => !n.read && n.priority === "urgent");
