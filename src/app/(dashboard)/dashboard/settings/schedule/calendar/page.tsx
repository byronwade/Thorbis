import { getCalendarSettings } from "@/actions/settings";
import CalendarSettingsClient from "./calendar-client";
import {
  DEFAULT_CALENDAR_SETTINGS,
  mapCalendarSettings,
} from "./calendar-config";

export default async function CalendarSettingsPage() {
  const result = await getCalendarSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load calendar settings");
  }

  const initialSettings = {
    ...DEFAULT_CALENDAR_SETTINGS,
    ...mapCalendarSettings(result.data ?? null),
  };

  return <CalendarSettingsClient initialSettings={initialSettings} />;
}
