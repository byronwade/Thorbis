import { getNotificationPreferences } from "@/actions/settings";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  mapNotificationPreferences,
} from "./notification-config";
import { NotificationsClient } from "./notifications-client";

export default async function NotificationsPage() {
  const result = await getNotificationPreferences();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load notification preferences");
  }

  const initialSettings =
    result.data !== undefined
      ? mapNotificationPreferences(result.data ?? null)
      : DEFAULT_NOTIFICATION_PREFERENCES;

  return <NotificationsClient initialSettings={initialSettings} />;
}

