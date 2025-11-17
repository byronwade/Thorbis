import type { Database } from "@/types/supabase";

type NotificationSettingsRow =
	| Database["public"]["Tables"]["communication_notification_settings"]["Row"]
	| null;

export type NotificationSettingsState = {
	// Customer notifications
	sendJobConfirmation: boolean;
	sendDayBeforeReminder: boolean;
	sendOnTheWayAlert: boolean;
	onTheWayMinutes: number;
	sendJobCompletionSummary: boolean;
	sendPaymentReceipt: boolean;
	// Internal
	notifyNewLeads: boolean;
	notifyNewLeadsEmail: string;
	notifyNewLeadsSMS: boolean;
	notifyJobScheduled: boolean;
	notifyJobCompleted: boolean;
	notifyPaymentReceived: boolean;
	notifyTechnicianAssignment: boolean;
	notifyTechnicianJobUpdate: boolean;
	// Channels
	emailNotifications: boolean;
	smsNotifications: boolean;
	pushNotifications: boolean;
	inAppNotifications: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsState = {
	sendJobConfirmation: true,
	sendDayBeforeReminder: true,
	sendOnTheWayAlert: true,
	onTheWayMinutes: 30,
	sendJobCompletionSummary: true,
	sendPaymentReceipt: true,
	notifyNewLeads: false,
	notifyNewLeadsEmail: "",
	notifyNewLeadsSMS: false,
	notifyJobScheduled: true,
	notifyJobCompleted: true,
	notifyPaymentReceived: true,
	notifyTechnicianAssignment: true,
	notifyTechnicianJobUpdate: true,
	emailNotifications: true,
	smsNotifications: false,
	pushNotifications: true,
	inAppNotifications: true,
};

export function mapNotificationSettings(
	row: NotificationSettingsRow
): Partial<NotificationSettingsState> {
	if (!row) {
		return {};
	}

	return {
		notifyJobScheduled: row.notify_new_jobs ?? true,
		notifyTechnicianJobUpdate: row.notify_job_updates ?? true,
		notifyJobCompleted: row.notify_job_completions ?? true,
		notifyNewLeads: row.notify_new_customers ?? false,
		notifyPaymentReceived: row.notify_invoice_paid ?? true,
		notifyTechnicianAssignment: row.notify_technician_assigned ?? true,
		emailNotifications: row.email_notifications ?? true,
		smsNotifications: row.sms_notifications ?? false,
		pushNotifications: row.push_notifications ?? true,
		inAppNotifications: row.in_app_notifications ?? true,
	};
}
