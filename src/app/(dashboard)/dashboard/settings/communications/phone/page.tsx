/**
 * Settings > Communications > Phone Page - Advanced VoIP System
 *
 * Server Component that checks company membership before rendering
 * Prevents "Company not found" errors by validating access
 *
 * Features:
 * - Comprehensive call routing and extension management
 * - Team member extension assignment and configuration
 * - Vacation mode and holiday scheduling
 * - Advanced voicemail settings with greeting management
 * - Call flow designer with visual routing builder
 * - Business hours configuration
 * - Call analytics and reporting
 */

import { getPhoneSettings } from "@/actions/settings";
import { DEFAULT_PHONE_SETTINGS, mapPhoneSettings } from "./phone-config";
import PhoneSettingsClient from "./phone-settings-client";

export default async function PhoneSettingsPage() {
  const result = await getPhoneSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load phone settings");
  }

  const initialSettings = {
    ...DEFAULT_PHONE_SETTINGS,
    ...mapPhoneSettings(result.data ?? null),
  };

  return <PhoneSettingsClient initialSettings={initialSettings} />;
}
