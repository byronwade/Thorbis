/**
 * Notification Triggers
 *
 * Helper functions to create notifications for system events.
 * These functions check user preferences before creating notifications
 * and provide a consistent interface for triggering notifications across the app.
 *
 * Usage:
 * ```typescript
 * import { notifyJobCreated } from "@/lib/notifications/triggers";
 *
 * // In your server action:
 * await notifyJobCreated({
 *   userId: technician.id,
 *   companyId: job.company_id,
 *   jobId: job.id,
 *   jobTitle: job.title,
 *   address: job.property.address,
 *   priority: "urgent",
 * });
 * ```
 */

import type {
	NotificationPriority,
	NotificationType,
} from "@/lib/notifications/types";
import { createClient } from "@/lib/supabase/server";

// =====================================================================================
// Types
// =====================================================================================

type BaseNotificationParams = {
	userId: string;
	companyId: string;
	priority?: NotificationPriority;
	actionUrl?: string;
};

interface JobNotificationParams extends BaseNotificationParams {
	jobId: string;
	jobTitle: string;
	address: string;
}

interface PaymentNotificationParams extends BaseNotificationParams {
	amount: number;
	customerName: string;
	invoiceId?: string;
}

interface MessageNotificationParams extends BaseNotificationParams {
	from: string;
	messagePreview: string;
	messageId: string;
}

interface TeamNotificationParams extends BaseNotificationParams {
	memberName: string;
	role?: string;
}

interface AlertNotificationParams extends BaseNotificationParams {
	alertTitle: string;
	alertMessage: string;
}

interface SystemNotificationParams extends BaseNotificationParams {
	systemTitle: string;
	systemMessage: string;
}

// =====================================================================================
// Helper Functions
// =====================================================================================

/**
 * Create a notification in the database
 * Internal helper function used by all trigger functions
 */
async function createNotification(
	type: NotificationType,
	userId: string,
	companyId: string,
	title: string,
	message: string,
	priority: NotificationPriority = "medium",
	actionUrl?: string,
	actionLabel?: string,
	metadata?: Record<string, any>,
) {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Supabase client not configured" };
		}

		const { data, error } = await supabase
			.from("notifications")
			.insert({
				user_id: userId,
				company_id: companyId,
				type,
				priority,
				title,
				message,
				action_url: actionUrl,
				action_label: actionLabel,
				metadata: metadata || {},
			})
			.select()
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Check if user has notifications enabled for a specific event type
 * TODO: Implement this to check notification_preferences table
 */
async function isNotificationEnabled(
	userId: string,
	companyId: string,
	eventType: string,
): Promise<boolean> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return true; // Default to enabled if Supabase not configured
		}

		const { data, error } = await supabase
			.from("notification_preferences")
			.select("enabled")
			.eq("user_id", userId)
			.eq("company_id", companyId)
			.eq("channel", "in_app")
			.eq("event_type", eventType)
			.single();

		if (error || !data) {
			// If no preference set, default to enabled
			return true;
		}

		return data.enabled;
	} catch {
		// Default to enabled on error
		return true;
	}
}

// =====================================================================================
// Job Notifications
// =====================================================================================

/**
 * Notify user when a new job is created/assigned
 */
export async function notifyJobCreated(params: JobNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"job_created",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"job",
		params.userId,
		params.companyId,
		"New Job Assignment",
		`Job "${params.jobTitle}" has been assigned to you at ${params.address}`,
		params.priority || "medium",
		params.actionUrl || "/dashboard/work",
		"View Job",
		{
			job_id: params.jobId,
			address: params.address,
		},
	);
}

/**
 * Notify user when a job is updated
 */
export async function notifyJobUpdated(params: JobNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"job_updated",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"job",
		params.userId,
		params.companyId,
		"Job Updated",
		`Job "${params.jobTitle}" has been updated`,
		params.priority || "low",
		params.actionUrl || "/dashboard/work",
		"View Job",
		{
			job_id: params.jobId,
		},
	);
}

/**
 * Notify user when a job is completed
 */
export async function notifyJobCompleted(params: JobNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"job_completed",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"job",
		params.userId,
		params.companyId,
		"Job Completed",
		`Job "${params.jobTitle}" at ${params.address} has been completed`,
		params.priority || "low",
		params.actionUrl || "/dashboard/work",
		"View Job",
		{
			job_id: params.jobId,
			status: "completed",
		},
	);
}

// =====================================================================================
// Payment Notifications
// =====================================================================================

/**
 * Notify user when a payment is received
 */
export async function notifyPaymentReceived(params: PaymentNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"payment_received",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"payment",
		params.userId,
		params.companyId,
		"Payment Received",
		`Payment of $${params.amount.toFixed(2)} received from ${params.customerName}`,
		params.priority || "high",
		params.actionUrl || "/dashboard/finance/invoices",
		"View Invoice",
		{
			amount: params.amount,
			customer: params.customerName,
			invoice_id: params.invoiceId,
		},
	);
}

/**
 * Notify user when an invoice payment is due soon
 */
export async function notifyPaymentDue(
	params: PaymentNotificationParams & { daysUntilDue: number },
) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"payment_due",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"payment",
		params.userId,
		params.companyId,
		"Payment Reminder",
		`Invoice payment of $${params.amount.toFixed(2)} from ${params.customerName} is due in ${params.daysUntilDue} days`,
		params.priority || "medium",
		params.actionUrl || "/dashboard/finance/invoices",
		"View Invoice",
		{
			amount: params.amount,
			customer: params.customerName,
			invoice_id: params.invoiceId,
			days_until_due: params.daysUntilDue,
		},
	);
}

// =====================================================================================
// Message/Communication Notifications
// =====================================================================================

/**
 * Notify user when they receive a new message
 */
export async function notifyNewMessage(params: MessageNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"new_message",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"message",
		params.userId,
		params.companyId,
		`New Message from ${params.from}`,
		params.messagePreview,
		params.priority || "medium",
		params.actionUrl || "/dashboard/communication",
		"Reply",
		{
			from: params.from,
			message_id: params.messageId,
		},
	);
}

/**
 * Notify user when they miss a call
 */
export async function notifyMissedCall(params: MessageNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"missed_call",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"message",
		params.userId,
		params.companyId,
		"Missed Call",
		`You missed a call from ${params.from}`,
		params.priority || "high",
		params.actionUrl || "/dashboard/communication",
		"View Details",
		{
			from: params.from,
			call_id: params.messageId,
		},
	);
}

// =====================================================================================
// Team Notifications
// =====================================================================================

/**
 * Notify user when a new team member joins
 */
export async function notifyTeamMemberAdded(params: TeamNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"team_member_added",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"team",
		params.userId,
		params.companyId,
		"New Team Member",
		`${params.memberName} has joined your team${params.role ? ` as a ${params.role}` : ""}`,
		params.priority || "low",
		params.actionUrl || "/dashboard/settings/team",
		"View Team",
		{
			member_name: params.memberName,
			role: params.role,
		},
	);
}

/**
 * Notify user when they're assigned to a team
 */
export async function notifyTeamAssignment(params: TeamNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"team_assignment",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"team",
		params.userId,
		params.companyId,
		"Team Assignment",
		`You've been assigned to work with ${params.memberName}`,
		params.priority || "medium",
		params.actionUrl || "/dashboard/settings/team",
		"View Details",
		{
			member_name: params.memberName,
		},
	);
}

// =====================================================================================
// Alert Notifications
// =====================================================================================

/**
 * Notify user with a custom alert
 */
export async function notifyAlert(params: AlertNotificationParams) {
	const enabled = await isNotificationEnabled(
		params.userId,
		params.companyId,
		"system_alert",
	);

	if (!enabled) {
		return { success: true, skipped: true };
	}

	return createNotification(
		"alert",
		params.userId,
		params.companyId,
		params.alertTitle,
		params.alertMessage,
		params.priority || "medium",
		params.actionUrl,
		"View Details",
	);
}

// =====================================================================================
// System Notifications
// =====================================================================================

/**
 * Notify user with a system message
 */
export async function notifySystem(params: SystemNotificationParams) {
	return createNotification(
		"system",
		params.userId,
		params.companyId,
		params.systemTitle,
		params.systemMessage,
		params.priority || "low",
		params.actionUrl,
		"View Details",
	);
}
