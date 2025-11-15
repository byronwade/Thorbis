import { getNotificationPreferences } from "@/actions/settings";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  mapNotificationPreferences,
} from "../notification-config";
import NotificationsPushClient from "./notifications-push-client";

export default async function PushNotificationsPage() {
  const result = await getNotificationPreferences();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load notification preferences");
  }

  const initialPreferences =
    result.data !== undefined
      ? mapNotificationPreferences(result.data ?? null)
      : DEFAULT_NOTIFICATION_PREFERENCES;

  return <NotificationsPushClient initialPreferences={initialPreferences} />;
}
