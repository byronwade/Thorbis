"use client";

/**
 * Communication Notifications Handler - Client Component
 *
 * Automatically handles toast notifications for incoming communications:
 * - Phone calls (incoming, missed, completed)
 * - Voicemails (new messages)
 * - Text messages/SMS (incoming)
 * - Emails (incoming)
 *
 * This component should be included once in the root layout to enable
 * automatic toast notifications for all communication events.
 *
 * Performance optimizations:
 * - Uses Zustand for state management (no provider needed)
 * - Subscribes to Supabase Realtime for instant updates
 * - Integrated with existing notifications system
 */

import { useEffect, useState } from "react";
import { useCommunicationNotificationsStore } from "@/lib/stores/communication-notifications-store";
import { useNotificationsStore } from "@/lib/stores/notifications-store";

export function CommunicationNotificationsHandler() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Get notification store state
  const notifications = useNotificationsStore((state) => state.notifications);

  // Initialize on mount
  useEffect(() => {
    // Request desktop notification permission if enabled
    const initializePermissions = async () => {
      const desktopEnabled =
        useCommunicationNotificationsStore.getState()
          .desktopNotificationsEnabled;

      if (desktopEnabled && typeof window !== "undefined") {
        await useCommunicationNotificationsStore
          .getState()
          .requestDesktopNotificationPermission();
      }

      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializePermissions();
    }
  }, [isInitialized]);

  // Monitor for new communication notifications
  // (Toasts are automatically shown via the notifications store integration)
  // This component exists primarily to request permissions and provide a centralized handler

  return null; // No UI needed - this is a pure logic component
}

/**
 * Settings Panel Component
 *
 * Optional UI component to allow users to configure communication notification settings.
 * Can be added to the settings page.
 */
export function CommunicationNotificationsSettings() {
  const soundEnabled = useCommunicationNotificationsStore(
    (state) => state.soundEnabled
  );
  const desktopNotificationsEnabled = useCommunicationNotificationsStore(
    (state) => state.desktopNotificationsEnabled
  );
  const toastDuration = useCommunicationNotificationsStore(
    (state) => state.toastDuration
  );

  const setSoundEnabled = useCommunicationNotificationsStore(
    (state) => state.setSoundEnabled
  );
  const setDesktopNotificationsEnabled = useCommunicationNotificationsStore(
    (state) => state.setDesktopNotificationsEnabled
  );
  const setToastDuration = useCommunicationNotificationsStore(
    (state) => state.setToastDuration
  );

  const requestPermission = async () => {
    const granted = await useCommunicationNotificationsStore
      .getState()
      .requestDesktopNotificationPermission();

    if (granted) {
      setDesktopNotificationsEnabled(true);
    } else {
      alert(
        "Desktop notifications permission denied. Please enable in your browser settings."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-base">
          Communication Notifications
        </h3>
        <p className="mb-4 text-muted-foreground text-sm">
          Configure how you receive notifications for phone calls, text
          messages, emails, and voicemails.
        </p>
      </div>

      {/* Sound Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <label className="font-medium text-sm" htmlFor="sound-enabled">
            Sound Notifications
          </label>
          <p className="text-muted-foreground text-xs">
            Play a sound when receiving communications
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            checked={soundEnabled}
            className="peer sr-only"
            id="sound-enabled"
            onChange={(e) => setSoundEnabled(e.target.checked)}
            type="checkbox"
          />
          <div className="peer h-6 w-11 rounded-full bg-input after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-card after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-card peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2" />
        </label>
      </div>

      {/* Desktop Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <label
            className="font-medium text-sm"
            htmlFor="desktop-notifications-enabled"
          >
            Desktop Notifications
          </label>
          <p className="text-muted-foreground text-xs">
            Show native desktop notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "default" && (
              <button
                className="rounded-md bg-primary px-3 py-1 text-white text-xs hover:bg-primary/90"
                onClick={requestPermission}
                type="button"
              >
                Enable
              </button>
            )}
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              checked={desktopNotificationsEnabled}
              className="peer sr-only"
              disabled={
                typeof window !== "undefined" &&
                "Notification" in window &&
                Notification.permission !== "granted"
              }
              id="desktop-notifications-enabled"
              onChange={(e) => setDesktopNotificationsEnabled(e.target.checked)}
              type="checkbox"
            />
            <div className="peer h-6 w-11 rounded-full bg-input after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-card after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-card peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" />
          </label>
        </div>
      </div>

      {/* Toast Duration */}
      <div>
        <label
          className="mb-2 block font-medium text-sm"
          htmlFor="toast-duration"
        >
          Toast Duration
        </label>
        <p className="mb-2 text-muted-foreground text-xs">
          How long toast notifications remain visible
        </p>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          id="toast-duration"
          onChange={(e) =>
            setToastDuration(Number.parseInt(e.target.value, 10))
          }
          value={toastDuration}
        >
          <option value="3000">3 seconds</option>
          <option value="5000">5 seconds (default)</option>
          <option value="7000">7 seconds</option>
          <option value="10000">10 seconds</option>
        </select>
      </div>

      {/* Notification Preview */}
      <div className="rounded-lg border border-border p-4">
        <h4 className="mb-2 font-medium text-sm">Test Notifications</h4>
        <p className="mb-3 text-muted-foreground text-xs">
          Click a button to preview how notifications will appear
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() =>
              useCommunicationNotificationsStore
                .getState()
                .showCallToast("John Smith", "(555) 123-4567", "incoming")
            }
            type="button"
          >
            📞 Incoming Call
          </button>
          <button
            className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() =>
              useCommunicationNotificationsStore
                .getState()
                .showVoicemailToast("Jane Doe", "(555) 987-6543", 45)
            }
            type="button"
          >
            🎙️ Voicemail
          </button>
          <button
            className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() =>
              useCommunicationNotificationsStore
                .getState()
                .showSMSToast(
                  "Mike Johnson",
                  "(555) 456-7890",
                  "Hey, when can you come take a look at my HVAC system?"
                )
            }
            type="button"
          >
            💬 Text Message
          </button>
          <button
            className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() =>
              useCommunicationNotificationsStore
                .getState()
                .showEmailToast(
                  "Sarah Williams",
                  "sarah@example.com",
                  "Question about invoice #12345"
                )
            }
            type="button"
          >
            📧 Email
          </button>
        </div>
      </div>
    </div>
  );
}
