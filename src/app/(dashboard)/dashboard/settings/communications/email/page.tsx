import { getEmailSettings } from "@/actions/settings";
import { getEmailInfrastructure } from "@/actions/settings/communications";
import EmailSettingsClient from "./email-client";
import { DEFAULT_EMAIL_SETTINGS, mapEmailSettings } from "./email-config";

export default async function EmailSettingsPage() {
  const result = await getEmailSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load email settings");
  }

  const initialSettings = {
    ...DEFAULT_EMAIL_SETTINGS,
    ...mapEmailSettings(result.data ?? null),
  };

  const infrastructureResult = await getEmailInfrastructure();

  if (!infrastructureResult.success) {
    throw new Error(
      infrastructureResult.error ?? "Failed to load email infrastructure"
    );
  }

  return (
    <EmailSettingsClient
      initialInfrastructure={infrastructureResult.data ?? undefined}
      initialSettings={initialSettings}
    />
  );
}
