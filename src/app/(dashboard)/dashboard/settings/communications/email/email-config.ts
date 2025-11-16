import type { Database } from "@/types/supabase";

export type EmailSettingsRow = Database["public"]["Tables"]["communication_email_settings"]["Row"];

export type EmailSettingsState = {
	smtpEnabled: boolean;
	smtpHost: string;
	smtpPort: string;
	smtpUsername: string;
	smtpPassword: string;
	smtpFromEmail: string;
	smtpFromName: string;
	smtpUseTls: boolean;
	defaultSignature: string;
	autoCcEnabled: boolean;
	autoCcEmail: string;
	trackOpens: boolean;
	trackClicks: boolean;
	emailLogoUrl: string;
	primaryColor: string;
};

export const DEFAULT_EMAIL_SETTINGS: EmailSettingsState = {
	smtpEnabled: false,
	smtpHost: "",
	smtpPort: "",
	smtpUsername: "",
	smtpPassword: "",
	smtpFromEmail: "",
	smtpFromName: "",
	smtpUseTls: true,
	defaultSignature: "",
	autoCcEnabled: false,
	autoCcEmail: "",
	trackOpens: true,
	trackClicks: true,
	emailLogoUrl: "",
	primaryColor: "#3b82f6",
};

export function mapEmailSettings(row: EmailSettingsRow | null): Partial<EmailSettingsState> {
	if (!row) {
		return {};
	}

	return {
		smtpEnabled: row.smtp_enabled ?? false,
		smtpHost: row.smtp_host ?? "",
		smtpPort: row.smtp_port ? String(row.smtp_port) : "",
		smtpUsername: row.smtp_username ?? "",
		// Never expose encrypted password; keep empty for input
		smtpPassword: "",
		smtpFromEmail: row.smtp_from_email ?? "",
		smtpFromName: row.smtp_from_name ?? "",
		smtpUseTls: row.smtp_use_tls ?? true,
		defaultSignature: row.default_signature ?? "",
		autoCcEnabled: row.auto_cc_enabled ?? false,
		autoCcEmail: row.auto_cc_email ?? "",
		trackOpens: row.track_opens ?? true,
		trackClicks: row.track_clicks ?? true,
		emailLogoUrl: row.email_logo_url ?? "",
		primaryColor: row.primary_color ?? "#3b82f6",
	};
}
