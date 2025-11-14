import { getNotificationPreferences } from "@/actions/settings";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  mapNotificationPreferences,
} from "../notification-config";
import NotificationsEmailClient from "./notifications-email-client";

export default async function EmailPreferencesPage() {
  const result = await getNotificationPreferences();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load notification preferences");
  }

  const initialPreferences =
    result.data !== undefined
      ? mapNotificationPreferences(result.data ?? null)
      : DEFAULT_NOTIFICATION_PREFERENCES;

  return <NotificationsEmailClient initialPreferences={initialPreferences} />;
}

