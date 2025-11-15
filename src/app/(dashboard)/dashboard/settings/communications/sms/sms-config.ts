import type { Database } from "@/types/supabase";

export type SmsSettingsRow =
  Database["public"]["Tables"]["communication_sms_settings"]["Row"];

export type SmsSettingsState = {
  provider: "telnyx" | "twilio" | "other";
  providerApiKey: string;
  senderNumber: string;
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
  optOutMessage: string;
  includeOptOut: boolean;
  consentRequired: boolean;
};

export const DEFAULT_SMS_SETTINGS: SmsSettingsState = {
  provider: "telnyx",
  providerApiKey: "",
  senderNumber: "",
  autoReplyEnabled: false,
  autoReplyMessage: "",
  optOutMessage: "Reply STOP to unsubscribe",
  includeOptOut: true,
  consentRequired: true,
};

export function mapSmsSettings(
  row: SmsSettingsRow | null
): Partial<SmsSettingsState> {
  if (!row) {
    return {};
  }

  return {
    provider: (row.provider as SmsSettingsState["provider"]) ?? "telnyx",
    senderNumber: row.sender_number ?? "",
    autoReplyEnabled: row.auto_reply_enabled ?? false,
    autoReplyMessage: row.auto_reply_message ?? "",
    optOutMessage: row.opt_out_message ?? "Reply STOP to unsubscribe",
    includeOptOut: row.include_opt_out ?? true,
    consentRequired: row.consent_required ?? true,
  };
}
