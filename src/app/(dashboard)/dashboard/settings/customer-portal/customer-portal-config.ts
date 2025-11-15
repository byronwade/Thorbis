import type { Database } from "@/types/supabase";

type CustomerPortalRow =
  | Database["public"]["Tables"]["customer_portal_settings"]["Row"]
  | null;

export type CustomerPortalSettingsState = {
  portalEnabled: boolean;
  requireAccountApproval: boolean;
  allowBooking: boolean;
  allowInvoicePayment: boolean;
  allowEstimateApproval: boolean;
  showServiceHistory: boolean;
  showInvoices: boolean;
  showEstimates: boolean;
  allowMessaging: boolean;
  portalLogoUrl: string;
  primaryColor: string;
  welcomeMessage: string;
  notifyOnNewInvoice: boolean;
  notifyOnNewEstimate: boolean;
  notifyOnAppointment: boolean;
};

export const DEFAULT_CUSTOMER_PORTAL_SETTINGS: CustomerPortalSettingsState = {
  portalEnabled: false,
  requireAccountApproval: false,
  allowBooking: true,
  allowInvoicePayment: true,
  allowEstimateApproval: true,
  showServiceHistory: true,
  showInvoices: true,
  showEstimates: true,
  allowMessaging: true,
  portalLogoUrl: "",
  primaryColor: "#3b82f6",
  welcomeMessage: "",
  notifyOnNewInvoice: true,
  notifyOnNewEstimate: true,
  notifyOnAppointment: true,
};

export function mapCustomerPortalSettings(
  row: CustomerPortalRow
): Partial<CustomerPortalSettingsState> {
  if (!row) {
    return {};
  }

  return {
    portalEnabled: row.portal_enabled ?? false,
    requireAccountApproval: row.require_account_approval ?? false,
    allowBooking: row.allow_booking ?? true,
    allowInvoicePayment: row.allow_invoice_payment ?? true,
    allowEstimateApproval: row.allow_estimate_approval ?? true,
    showServiceHistory: row.show_service_history ?? true,
    showInvoices: row.show_invoices ?? true,
    showEstimates: row.show_estimates ?? true,
    allowMessaging: row.allow_messaging ?? true,
    portalLogoUrl: row.portal_logo_url ?? "",
    primaryColor: row.primary_color ?? "#3b82f6",
    welcomeMessage: row.welcome_message ?? "",
    notifyOnNewInvoice: row.notify_on_new_invoice ?? true,
    notifyOnNewEstimate: row.notify_on_new_estimate ?? true,
    notifyOnAppointment: row.notify_on_appointment ?? true,
  };
}
