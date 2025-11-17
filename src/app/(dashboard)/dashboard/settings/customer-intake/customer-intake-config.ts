import type { Tables } from "@/types/supabase";

type CustomerIntakeRow = Tables<"customer_intake_settings"> | null;

export type CustomerIntakeSettingsState = {
	requirePhone: boolean;
	requireEmail: boolean;
	requireAddress: boolean;
	requirePropertyType: boolean;
	trackLeadSource: boolean;
	requireLeadSource: boolean;
	autoAssignTechnician: boolean;
	autoCreateJob: boolean;
	sendWelcomeEmail: boolean;
	welcomeEmailTemplateId: string;
	customQuestions: string;
};

export const DEFAULT_CUSTOMER_INTAKE_SETTINGS: CustomerIntakeSettingsState = {
	requirePhone: true,
	requireEmail: true,
	requireAddress: true,
	requirePropertyType: false,
	trackLeadSource: true,
	requireLeadSource: false,
	autoAssignTechnician: false,
	autoCreateJob: false,
	sendWelcomeEmail: true,
	welcomeEmailTemplateId: "",
	customQuestions: "[]",
};

export function mapCustomerIntakeSettings(
	row: CustomerIntakeRow
): Partial<CustomerIntakeSettingsState> {
	if (!row) {
		return {};
	}

	return {
		requirePhone: row.require_phone ?? true,
		requireEmail: row.require_email ?? true,
		requireAddress: row.require_address ?? true,
		requirePropertyType: row.require_property_type ?? false,
		trackLeadSource: row.track_lead_source ?? true,
		requireLeadSource: row.require_lead_source ?? false,
		autoAssignTechnician: row.auto_assign_technician ?? false,
		autoCreateJob: row.auto_create_job ?? false,
		sendWelcomeEmail: row.send_welcome_email ?? true,
		welcomeEmailTemplateId: row.welcome_email_template_id ?? "",
		customQuestions: JSON.stringify(row.custom_questions ?? [], null, 2),
	};
}
