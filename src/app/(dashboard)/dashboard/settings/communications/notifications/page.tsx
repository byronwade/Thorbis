import { getNotificationSettings } from "@/actions/settings";
import NotificationsClient from "./notifications-client";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  mapNotificationSettings,
} from "./notifications-config";

export default async function NotificationsSettingsPage() {
  const result = await getNotificationSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load notification settings");
  }

  const initialSettings = {
    ...DEFAULT_NOTIFICATION_SETTINGS,
    ...mapNotificationSettings(result.data ?? null),
  };

  return <NotificationsClient initialSettings={initialSettings} />;
}
