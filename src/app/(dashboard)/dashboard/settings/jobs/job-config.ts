import type { Database } from "@/types/supabase";

type JobSettingsRow = Database["public"]["Tables"]["job_settings"]["Row"] | null;

export type JobSettingsState = {
	jobNumberPrefix: string;
	jobNumberFormat: string;
	nextJobNumber: number;
	defaultJobStatus: string;
	defaultPriority: string;
	requireCustomerSignature: boolean;
	requirePhotoCompletion: boolean;
	autoInvoiceOnCompletion: boolean;
	autoSendCompletionEmail: boolean;
	trackTechnicianTime: boolean;
	requireArrivalConfirmation: boolean;
	requireCompletionNotes: boolean;
};

export const JOB_STATUSES = ["scheduled", "in-progress", "completed", "cancelled"];
export const JOB_PRIORITIES = ["low", "normal", "high", "urgent"];

export const DEFAULT_JOB_SETTINGS: JobSettingsState = {
	jobNumberPrefix: "JOB",
	jobNumberFormat: "{PREFIX}-{YYYY}{MM}{DD}-{XXXX}",
	nextJobNumber: 1,
	defaultJobStatus: "scheduled",
	defaultPriority: "normal",
	requireCustomerSignature: false,
	requirePhotoCompletion: false,
	autoInvoiceOnCompletion: false,
	autoSendCompletionEmail: true,
	trackTechnicianTime: true,
	requireArrivalConfirmation: false,
	requireCompletionNotes: true,
};

export function mapJobSettings(row: JobSettingsRow): Partial<JobSettingsState> {
	if (!row) {
		return {};
	}

	return {
		jobNumberPrefix: row.job_number_prefix || "JOB",
		jobNumberFormat: row.job_number_format || "{PREFIX}-{YYYY}{MM}{DD}-{XXXX}",
		nextJobNumber: row.next_job_number ?? 1,
		defaultJobStatus: row.default_job_status || "scheduled",
		defaultPriority: row.default_priority || "normal",
		requireCustomerSignature: row.require_customer_signature ?? false,
		requirePhotoCompletion: row.require_photo_completion ?? false,
		autoInvoiceOnCompletion: row.auto_invoice_on_completion ?? false,
		autoSendCompletionEmail: row.auto_send_completion_email ?? true,
		trackTechnicianTime: row.track_technician_time ?? true,
		requireArrivalConfirmation: row.require_arrival_confirmation ?? false,
		requireCompletionNotes: row.require_completion_notes ?? true,
	};
}
