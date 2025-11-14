import { getUserPreferences } from "@/actions/settings";
import {
  DEFAULT_PREFERENCE_SETTINGS,
  mapPreferencesFromDb,
} from "./preferences-config";
import { PreferencesClient } from "./preferences-client";

export default async function PreferencesPage() {
  const result = await getUserPreferences();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load user preferences");
  }

  const initialSettings =
    result.data !== undefined
      ? mapPreferencesFromDb(result.data ?? null)
      : DEFAULT_PREFERENCE_SETTINGS;

  return <PreferencesClient initialSettings={initialSettings} />;
}

