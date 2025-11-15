import { getSmsSettings } from "@/actions/settings";
import SmsSettingsClient from "./sms-client";
import { DEFAULT_SMS_SETTINGS, mapSmsSettings } from "./sms-config";

export default async function SmsSettingsPage() {
  const result = await getSmsSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load SMS settings");
  }

  const initialSettings = {
    ...DEFAULT_SMS_SETTINGS,
    ...mapSmsSettings(result.data ?? null),
  };

  return <SmsSettingsClient initialSettings={initialSettings} />;
}
