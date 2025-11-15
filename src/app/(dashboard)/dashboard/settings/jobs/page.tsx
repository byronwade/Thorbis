import { getJobSettings } from "@/actions/settings";
import { DEFAULT_JOB_SETTINGS, mapJobSettings } from "./job-config";
import JobSettingsClient from "./job-settings-client";

export default async function JobsSettingsPage() {
  const result = await getJobSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load job settings");
  }

  const initialSettings = {
    ...DEFAULT_JOB_SETTINGS,
    ...mapJobSettings(result.data ?? null),
  };

  return <JobSettingsClient initialSettings={initialSettings} />;
}
