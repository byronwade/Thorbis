import type { Database } from "@/types/supabase";

export type SmsSettingsRow =
	Database["public"]["Tables"]["communication_sms_settings"]["Row"];

export type QuickRepliesConfig = {
	greeting_enabled: boolean;
	greeting_message: string;
	after_hours_enabled: boolean;
	after_hours_message: string;
	appointment_reminder_enabled: boolean;
	appointment_reminder_hours_before: number;
	appointment_reminder_message: string;
	job_complete_enabled: boolean;
	job_complete_message: string;
	review_request_enabled: boolean;
	review_request_delay_hours: number;
	review_request_message: string;
};

export type SmsSettingsState = {
	provider: "twilio" | "other";
	providerApiKey: string;
	senderNumber: string;
	autoReplyEnabled: boolean;
	autoReplyMessage: string;
	optOutMessage: string;
	includeOptOut: boolean;
	consentRequired: boolean;
	quickRepliesEnabled: boolean;
	quickRepliesConfig: QuickRepliesConfig;
};

export const DEFAULT_QUICK_REPLIES_CONFIG: QuickRepliesConfig = {
	greeting_enabled: false,
	greeting_message:
		"Hi! Thanks for reaching out to {{company_name}}. How can we help you today?",
	after_hours_enabled: false,
	after_hours_message:
		"Thanks for your message! We're currently closed but will respond first thing in the morning. For emergencies, call {{emergency_phone}}.",
	appointment_reminder_enabled: false,
	appointment_reminder_hours_before: 24,
	appointment_reminder_message:
		"Reminder: You have an appointment with {{company_name}} tomorrow at {{appointment_time}}. Reply YES to confirm or call us to reschedule.",
	job_complete_enabled: false,
	job_complete_message:
		"Your service has been completed! Thank you for choosing {{company_name}}. Please let us know if you have any questions.",
	review_request_enabled: false,
	review_request_delay_hours: 24,
	review_request_message:
		"Thank you for choosing {{company_name}}! We'd love to hear about your experience. Please leave us a review: {{review_link}}",
};

export const DEFAULT_SMS_SETTINGS: SmsSettingsState = {
	provider: "twilio",
	providerApiKey: "",
	senderNumber: "",
	autoReplyEnabled: false,
	autoReplyMessage: "",
	optOutMessage: "Reply STOP to unsubscribe",
	includeOptOut: true,
	consentRequired: true,
	quickRepliesEnabled: false,
	quickRepliesConfig: DEFAULT_QUICK_REPLIES_CONFIG,
};

export function mapSmsSettings(
	row: SmsSettingsRow | null,
): Partial<SmsSettingsState> {
	if (!row) {
		return {};
	}

	// Parse quick replies config from JSONB
	const quickRepliesConfig =
		typeof row.quick_replies_config === "object" && row.quick_replies_config
			? { ...DEFAULT_QUICK_REPLIES_CONFIG, ...(row.quick_replies_config as Partial<QuickRepliesConfig>) }
			: DEFAULT_QUICK_REPLIES_CONFIG;

	return {
		provider: (row.provider as SmsSettingsState["provider"]) ?? "twilio",
		senderNumber: row.sender_number ?? "",
		autoReplyEnabled: row.auto_reply_enabled ?? false,
		autoReplyMessage: row.auto_reply_message ?? "",
		optOutMessage: row.opt_out_message ?? "Reply STOP to unsubscribe",
		includeOptOut: row.include_opt_out ?? true,
		consentRequired: row.consent_required ?? true,
		quickRepliesEnabled: row.quick_replies_enabled ?? false,
		quickRepliesConfig,
	};
}
