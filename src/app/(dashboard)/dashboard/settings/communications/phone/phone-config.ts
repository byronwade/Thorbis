import type { Database } from "@/types/supabase";

type PhoneSettingsRow = Database["public"]["Tables"]["communication_phone_settings"]["Row"] | null;

export type PhoneSettingsState = {
	routingStrategy: "round_robin" | "skills_based" | "priority" | "simultaneous";
	fallbackNumber: string;
	businessHoursOnly: boolean;
	voicemailEnabled: boolean;
	voicemailGreetingUrl: string;
	voicemailEmailNotifications: boolean;
	voicemailTranscriptionEnabled: boolean;
	recordingEnabled: boolean;
	recordingAnnouncement: string;
	recordingConsentRequired: boolean;
	ivrEnabled: boolean;
	ivrMenu: string;
};

export const DEFAULT_PHONE_SETTINGS: PhoneSettingsState = {
	routingStrategy: "round_robin",
	fallbackNumber: "",
	businessHoursOnly: false,
	voicemailEnabled: true,
	voicemailGreetingUrl: "",
	voicemailEmailNotifications: true,
	voicemailTranscriptionEnabled: false,
	recordingEnabled: false,
	recordingAnnouncement: "This call may be recorded for quality assurance purposes.",
	recordingConsentRequired: true,
	ivrEnabled: false,
	ivrMenu: "{}",
};

export function mapPhoneSettings(row: PhoneSettingsRow): Partial<PhoneSettingsState> {
	if (!row) {
		return {};
	}

	return {
		routingStrategy:
			(row.routing_strategy as PhoneSettingsState["routingStrategy"]) ?? "round_robin",
		fallbackNumber: row.fallback_number ?? "",
		businessHoursOnly: row.business_hours_only ?? false,
		voicemailEnabled: row.voicemail_enabled ?? true,
		voicemailGreetingUrl: row.voicemail_greeting_url ?? "",
		voicemailEmailNotifications: row.voicemail_email_notifications ?? true,
		voicemailTranscriptionEnabled: row.voicemail_transcription_enabled ?? false,
		recordingEnabled: row.recording_enabled ?? false,
		recordingAnnouncement:
			row.recording_announcement || "This call may be recorded for quality assurance purposes.",
		recordingConsentRequired: row.recording_consent_required ?? true,
		ivrEnabled: row.ivr_enabled ?? false,
		ivrMenu: row.ivr_menu ? JSON.stringify(row.ivr_menu) : "{}",
	};
}
