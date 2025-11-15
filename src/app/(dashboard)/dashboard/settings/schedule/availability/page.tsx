import { getAvailabilitySettings } from "@/actions/settings";
import AvailabilityClient from "./availability-client";
import {
  DEFAULT_AVAILABILITY_SETTINGS,
  mapAvailabilitySettings,
} from "./availability-config";

export default async function AvailabilitySettingsPage() {
  const result = await getAvailabilitySettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load availability settings");
  }

  const initialSettings = {
    ...DEFAULT_AVAILABILITY_SETTINGS,
    ...mapAvailabilitySettings(result.data ?? null),
  };

  return <AvailabilityClient initialSettings={initialSettings} />;
}
