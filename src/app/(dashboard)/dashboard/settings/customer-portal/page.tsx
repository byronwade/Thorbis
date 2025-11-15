import { getPortalSettings } from "@/actions/settings";
import CustomerPortalClient from "./customer-portal-client";
import {
  DEFAULT_CUSTOMER_PORTAL_SETTINGS,
  mapCustomerPortalSettings,
} from "./customer-portal-config";

export default async function CustomerPortalPage() {
  const result = await getPortalSettings();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load portal settings");
  }

  const initialSettings = {
    ...DEFAULT_CUSTOMER_PORTAL_SETTINGS,
    ...mapCustomerPortalSettings(result.data ?? null),
  };

  return <CustomerPortalClient initialSettings={initialSettings} />;
}
