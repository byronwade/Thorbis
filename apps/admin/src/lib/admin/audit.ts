/**
 * Admin Audit Logging
 *
 * All admin actions that modify customer data in the web database
 * MUST be logged to the admin_audit_logs table for compliance and security.
 */

import { createAdminClient } from "@/lib/supabase/admin-client";

export interface AuditLogEntry {
	adminUserId: string;
	adminEmail: string;
	action: string;
	resourceType?: string;
	resourceId?: string;
	details?: Record<string, unknown>;
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Log an admin action to the audit trail.
 *
 * @example
 * await logAdminAction({
 *   adminUserId: session.user.id,
 *   adminEmail: session.user.email,
 *   action: "refund_issued",
 *   resourceType: "payment",
 *   resourceId: paymentId,
 *   details: { amount: 100, reason: "Customer request" }
 * });
 */
export async function logAdminAction(entry: AuditLogEntry) {
	const supabase = createAdminClient();

	const { error } = await supabase.from("admin_audit_logs").insert({
		admin_user_id: entry.adminUserId,
		admin_email: entry.adminEmail,
		action: entry.action,
		resource_type: entry.resourceType,
		resource_id: entry.resourceId,
		details: entry.details,
		ip_address: entry.ipAddress,
		user_agent: entry.userAgent,
	});

	if (error) {
		console.error("Failed to log admin action:", error);
		// Don't throw - audit logging failures shouldn't break the main operation
	}
}

/**
 * Common admin actions for consistent logging
 */
export const ADMIN_ACTIONS = {
	// Customer Management
	CUSTOMER_VIEWED: "customer_viewed",
	CUSTOMER_EDITED: "customer_edited",
	CUSTOMER_DELETED: "customer_deleted",
	CUSTOMER_RESTORED: "customer_restored",

	// Payment Management
	PAYMENT_VIEWED: "payment_viewed",
	PAYMENT_REFUNDED: "payment_refunded",
	PAYMENT_EDITED: "payment_edited",

	// Invoice Management
	INVOICE_VIEWED: "invoice_viewed",
	INVOICE_EDITED: "invoice_edited",
	INVOICE_VOIDED: "invoice_voided",
	INVOICE_RESENT: "invoice_resent",

	// Job Management
	JOB_VIEWED: "job_viewed",
	JOB_EDITED: "job_edited",
	JOB_STATUS_CHANGED: "job_status_changed",

	// Subscription Management
	SUBSCRIPTION_EDITED: "subscription_edited",
	SUBSCRIPTION_CANCELED: "subscription_canceled",
	SUBSCRIPTION_PAUSED: "subscription_paused",
	SUBSCRIPTION_RESUMED: "subscription_resumed",

	// Support Actions
	SUPPORT_TICKET_CREATED: "support_ticket_created",
	SUPPORT_TICKET_UPDATED: "support_ticket_updated",
	SUPPORT_MESSAGE_SENT: "support_message_sent",

	// Email Campaigns
	CAMPAIGN_CREATED: "campaign_created",
	CAMPAIGN_SENT: "campaign_sent",
	CAMPAIGN_PAUSED: "campaign_paused",

	// Company Management
	COMPANY_VIEWED: "company_viewed",
	COMPANY_EDITED: "company_edited",
	COMPANY_SUSPENDED: "company_suspended",
	COMPANY_REACTIVATED: "company_reactivated",

	// Bulk Operations
	BULK_EDIT: "bulk_edit",
	BULK_DELETE: "bulk_delete",
	DATA_EXPORT: "data_export",
	DATA_IMPORT: "data_import",
} as const;

export type AdminAction = (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS];
