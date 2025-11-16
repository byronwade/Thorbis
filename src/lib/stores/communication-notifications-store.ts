/**
 * Communication Notifications Store - Zustand State Management
 *
 * Handles real-time toast notifications for:
 * - Phone calls (incoming, missed, completed)
 * - Voicemails (new messages)
 * - Text messages/SMS (incoming)
 * - Emails (incoming)
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - Automatic toast display on new communications
 * - Integrated with existing notifications system
 * - Sound and desktop notification support
 */

import { toast } from "sonner";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  COMMUNICATION_MARK_AS_READ_EVENT,
  type CommunicationMarkAsReadDetail,
} from "./notification-events";
import type { Notification } from "./notifications-types";

// =====================================================================================
// Types
// =====================================================================================

export type CommunicationType = "call" | "sms" | "email" | "voicemail";

export type CommunicationToastOptions = {
  id?: string;
  duration?: number;
  closeButton?: boolean;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type CommunicationNotificationsState = {
  // State
  toastQueue: string[]; // Track active toast IDs
  soundEnabled: boolean;
  desktopNotificationsEnabled: boolean;
  toastDuration: number;

  // Actions
  showCommunicationToast: (
    notification: Notification,
    options?: CommunicationToastOptions
  ) => string | number;
  showCallToast: (
    customerName: string,
    phoneNumber: string,
    status: "incoming" | "missed" | "completed",
    metadata?: Record<string, any>
  ) => void;
  showVoicemailToast: (
    customerName: string,
    phoneNumber: string,
    duration?: number
  ) => void;
  showSMSToast: (
    customerName: string,
    phoneNumber: string,
    message: string
  ) => void;
  showEmailToast: (
    customerName: string,
    fromAddress: string,
    subject: string
  ) => void;
  dismissToast: (id: string | number) => void;
  dismissAllToasts: () => void;

  // Settings
  setSoundEnabled: (enabled: boolean) => void;
  setDesktopNotificationsEnabled: (enabled: boolean) => void;
  setToastDuration: (duration: number) => void;

  // Utility
  playNotificationSound: () => void;
  requestDesktopNotificationPermission: () => Promise<boolean>;
  showDesktopNotification: (
    title: string,
    body: string,
    data?: Record<string, any>
  ) => void;
};

// Initial state (load from localStorage if available)
const loadSettings = () => {
  if (typeof window === "undefined") {
    return {
      soundEnabled: true,
      desktopNotificationsEnabled: true,
      toastDuration: 5000,
    };
  }

  return {
    soundEnabled:
      localStorage.getItem("communication_sound_enabled") !== "false",
    desktopNotificationsEnabled:
      localStorage.getItem("communication_desktop_enabled") !== "false",
    toastDuration: Number.parseInt(
      localStorage.getItem("communication_toast_duration") || "5000",
      10
    ),
  };
};

// =====================================================================================
// Zustand Store
// =====================================================================================

export const useCommunicationNotificationsStore =
  create<CommunicationNotificationsState>()(
    devtools(
      (set, get) => ({
        ...loadSettings(),
        toastQueue: [],

        // ===============================================================================
        // Toast Display
        // ===============================================================================

        showCommunicationToast: (notification, options = {}) => {
          const { metadata } = notification;
          const communicationType = metadata?.communication_type as
            | CommunicationType
            | undefined;

          // Determine toast appearance based on communication type
          let icon = "📩"; // Default
          let _toastType: "info" | "success" | "error" = "info";

          switch (communicationType) {
            case "call":
              icon = "📞";
              if (notification.priority === "high") {
                icon = "📵"; // Missed call
                _toastType = "error";
              }
              break;
            case "sms":
              icon = "💬";
              break;
            case "email":
              icon = "📧";
              break;
            case "voicemail":
              icon = "🎙️";
              if (notification.priority === "urgent") {
                _toastType = "error";
              }
              break;
          }

          // Play sound if enabled
          const { soundEnabled } = get();
          if (soundEnabled) {
            get().playNotificationSound();
          }

          // Show desktop notification if enabled
          const { desktopNotificationsEnabled } = get();
          if (desktopNotificationsEnabled) {
            get().showDesktopNotification(
              notification.title,
              notification.message,
              metadata ?? undefined
            );
          }

          // Create toast with custom styling
          const toastId = toast(notification.title, {
            description: notification.message,
            duration: options.duration || get().toastDuration,
            icon,
            closeButton: options.closeButton ?? true,
            dismissible: options.dismissible ?? true,
            action: notification.action_url
              ? {
                  label: notification.action_label || "View",
                  onClick: () => {
                    if (typeof window !== "undefined") {
                      const detail: CommunicationMarkAsReadDetail = {
                        notificationId: notification.id,
                      };
                      window.dispatchEvent(
                        new CustomEvent(COMMUNICATION_MARK_AS_READ_EVENT, {
                          detail,
                        })
                      );
                    }

                    if (notification.action_url) {
                      window.location.href = notification.action_url;
                    }
                  },
                }
              : options.action,
            className:
              notification.priority === "urgent"
                ? "border-destructive bg-destructive/10"
                : "",
          });

          // Track toast ID
          set((state) => ({
            toastQueue: [...state.toastQueue, String(toastId)],
          }));

          return toastId;
        },

        showCallToast: (customerName, phoneNumber, status, metadata = {}) => {
          let title = "";
          let message = "";
          let _priority: "low" | "medium" | "high" = "medium";
          let icon = "📞";

          switch (status) {
            case "incoming":
              title = `Incoming call from ${customerName}`;
              message = phoneNumber;
              _priority = "high";
              icon = "📞";
              break;
            case "missed":
              title = `Missed call from ${customerName}`;
              message = phoneNumber;
              _priority = "high";
              icon = "📵";
              break;
            case "completed":
              title = `Call with ${customerName}`;
              message = `Duration: ${metadata.duration || "Unknown"}`;
              _priority = "low";
              icon = "✅";
              break;
          }

          const toastId = toast(title, {
            description: message,
            icon,
            duration: get().toastDuration,
            closeButton: true,
            action: {
              label: "View",
              onClick: () => {
                window.location.href =
                  "/dashboard/customers/communication?filter=calls";
              },
            },
            className: status === "missed" ? "border-destructive" : "",
          });

          if (get().soundEnabled) {
            get().playNotificationSound();
          }

          if (get().desktopNotificationsEnabled) {
            get().showDesktopNotification(title, message, {
              status,
              ...metadata,
            });
          }

          return toastId;
        },

        showVoicemailToast: (customerName, phoneNumber, duration) => {
          const title = `New voicemail from ${customerName}`;
          const message = duration
            ? `${phoneNumber} • ${duration}s`
            : phoneNumber;

          const toastId = toast(title, {
            description: message,
            icon: "🎙️",
            duration: get().toastDuration,
            closeButton: true,
            action: {
              label: "Listen",
              onClick: () => {
                window.location.href =
                  "/dashboard/customers/communication?filter=voicemails";
              },
            },
          });

          if (get().soundEnabled) {
            get().playNotificationSound();
          }

          if (get().desktopNotificationsEnabled) {
            get().showDesktopNotification(title, message, {
              type: "voicemail",
              duration,
            });
          }

          return toastId;
        },

        showSMSToast: (customerName, phoneNumber, message) => {
          const title = `Text from ${customerName}`;
          const preview =
            message.length > 100 ? `${message.substring(0, 100)}...` : message;

          const toastId = toast(title, {
            description: preview,
            icon: "💬",
            duration: get().toastDuration,
            closeButton: true,
            action: {
              label: "Reply",
              onClick: () => {
                window.location.href =
                  "/dashboard/customers/communication?filter=sms";
              },
            },
          });

          if (get().soundEnabled) {
            get().playNotificationSound();
          }

          if (get().desktopNotificationsEnabled) {
            get().showDesktopNotification(title, preview, {
              type: "sms",
              from: phoneNumber,
            });
          }

          return toastId;
        },

        showEmailToast: (customerName, fromAddress, subject) => {
          const title = `Email from ${customerName}`;
          const message = subject || "No subject";

          const toastId = toast(title, {
            description: message,
            icon: "📧",
            duration: get().toastDuration,
            closeButton: true,
            action: {
              label: "View",
              onClick: () => {
                window.location.href =
                  "/dashboard/customers/communication?filter=emails";
              },
            },
          });

          if (get().soundEnabled) {
            get().playNotificationSound();
          }

          if (get().desktopNotificationsEnabled) {
            get().showDesktopNotification(title, message, {
              type: "email",
              from: fromAddress,
            });
          }

          return toastId;
        },

        dismissToast: (id) => {
          toast.dismiss(id);
          set((state) => ({
            toastQueue: state.toastQueue.filter(
              (toastId) => toastId !== String(id)
            ),
          }));
        },

        dismissAllToasts: () => {
          toast.dismiss();
          set({ toastQueue: [] });
        },

        // ===============================================================================
        // Settings
        // ===============================================================================

        setSoundEnabled: (enabled) => {
          set({ soundEnabled: enabled });
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "communication_sound_enabled",
              enabled.toString()
            );
          }
        },

        setDesktopNotificationsEnabled: (enabled) => {
          set({ desktopNotificationsEnabled: enabled });
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "communication_desktop_enabled",
              enabled.toString()
            );
          }

          // Request permission if enabling
          if (enabled) {
            get().requestDesktopNotificationPermission();
          }
        },

        setToastDuration: (duration) => {
          set({ toastDuration: duration });
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "communication_toast_duration",
              duration.toString()
            );
          }
        },

        // ===============================================================================
        // Utility
        // ===============================================================================

        playNotificationSound: () => {
          if (typeof window === "undefined") {
            return;
          }

          try {
            // Create audio element for notification sound
            const audio = new Audio("/sounds/notification.mp3");
            audio.volume = 0.4;
            audio.play().catch((_error) => {});
          } catch (_error) {}
        },

        requestDesktopNotificationPermission: async () => {
          if (typeof window === "undefined" || !("Notification" in window)) {
            return false;
          }

          if (Notification.permission === "granted") {
            return true;
          }

          if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
          }

          return false;
        },

        showDesktopNotification: (title, body, data = {}) => {
          if (typeof window === "undefined" || !("Notification" in window)) {
            return;
          }

          if (Notification.permission !== "granted") {
            return;
          }

          try {
            const notification = new Notification(title, {
              body,
              icon: "/icon-192x192.svg",
              badge: "/icon-192x192.svg",
              tag: `communication-${data.type || "general"}`,
              data,
              requireInteraction:
                data.type === "call" && data.status === "incoming",
            });

            // Handle notification click
            notification.onclick = () => {
              window.focus();
              if (data.action_url) {
                window.location.href = data.action_url;
              }
              notification.close();
            };
          } catch (_error) {}
        },
      }),
      { name: "CommunicationNotificationsStore" }
    )
  );
