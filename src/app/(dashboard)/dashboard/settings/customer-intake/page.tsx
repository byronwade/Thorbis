import { getIntakeSettings } from "@/actions/settings";
import CustomerIntakeClient from "./customer-intake-client";
import {
  DEFAULT_CUSTOMER_INTAKE_SETTINGS,
  mapCustomerIntakeSettings,
} from "./customer-intake-config";

export default async function CustomerIntakePage() {
  const result = await getIntakeSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load intake settings");
  }

  const initialSettings = {
    ...DEFAULT_CUSTOMER_INTAKE_SETTINGS,
    ...mapCustomerIntakeSettings(result.data ?? null),
  };

  return <CustomerIntakeClient initialSettings={initialSettings} />;
}
