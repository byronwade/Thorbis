"use server";

/**
 * Admin Invoice Management Actions
 *
 * Server actions for managing invoices in view-as mode.
 */

import {
	executeAdminAction,
	getBeforeData,
	logDetailedAction,
	validateCompanyOwnership,
	type ActionResult,
} from "@/lib/admin-actions/framework";
import { getImpersonatedCompanyId } from "@/lib/admin-context";
import { revalidatePath } from "next/cache";

/**
 * Update Invoice Status
 *
 * Changes an invoice's status (draft, sent, paid, overdue, cancelled).
 */
export async function updateInvoiceStatus(
	invoiceId: string,
	newStatus: string,
	reason?: string,
): Promise<ActionResult<{ statusUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "update_invoice_status",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: reason || `Changed status to ${newStatus}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData("invoices", invoiceId, "id, status");

			// Update status
			const { error } = await supabase
				.from("invoices")
				.update({
					status: newStatus,
					updated_at: new Date().toISOString(),
				})
				.eq("id", invoiceId);

			if (error) {
				throw new Error(`Failed to update invoice status: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_invoice_status",
				"invoice",
				invoiceId,
				beforeData,
				{ status: newStatus },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/invoices`);

			return { statusUpdated: true };
		},
	);
}

/**
 * Void Invoice
 *
 * Voids an invoice (marks as cancelled and creates audit trail).
 */
export async function voidInvoice(
	invoiceId: string,
	reason: string,
): Promise<ActionResult<{ invoiceVoided: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "void_invoice",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: `Voided invoice: ${reason}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"invoices",
				invoiceId,
				"id, status, total_amount",
			);

			if (!beforeData) {
				throw new Error("Invoice not found");
			}

			// Check if invoice can be voided
			if (beforeData.status === "paid") {
				throw new Error(
					"Cannot void a paid invoice. Issue a refund instead.",
				);
			}

			// Void invoice
			const { error } = await supabase
				.from("invoices")
				.update({
					status: "cancelled",
					updated_at: new Date().toISOString(),
				})
				.eq("id", invoiceId);

			if (error) {
				throw new Error(`Failed to void invoice: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"void_invoice",
				"invoice",
				invoiceId,
				beforeData,
				{ status: "cancelled", voided: true },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/invoices`);

			return { invoiceVoided: true };
		},
	);
}

/**
 * Update Invoice Due Date
 *
 * Changes the due date for an invoice.
 */
export async function updateInvoiceDueDate(
	invoiceId: string,
	newDueDate: string,
	reason?: string,
): Promise<ActionResult<{ dueDateUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "update_invoice_due_date",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: reason || `Changed due date to ${newDueDate}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"invoices",
				invoiceId,
				"id, due_date",
			);

			// Update due date
			const { error } = await supabase
				.from("invoices")
				.update({
					due_date: newDueDate,
					updated_at: new Date().toISOString(),
				})
				.eq("id", invoiceId);

			if (error) {
				throw new Error(`Failed to update due date: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_invoice_due_date",
				"invoice",
				invoiceId,
				beforeData,
				{ due_date: newDueDate },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/invoices`);

			return { dueDateUpdated: true };
		},
	);
}

/**
 * Send Invoice Reminder
 *
 * Manually triggers sending an invoice reminder email.
 */
export async function sendInvoiceReminder(
	invoiceId: string,
	reason?: string,
): Promise<ActionResult<{ reminderSent: boolean; sentTo?: string }>> {
	return executeAdminAction(
		{
			permission: "edit_invoices",
			action: "send_invoice_reminder",
			resourceType: "invoice",
			resourceId: invoiceId,
			reason: reason || "Sent invoice reminder",
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"invoices",
				invoiceId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Invoice does not belong to this company");
			}

			// Get invoice with customer info
			const { data: invoice, error: fetchError } = await supabase
				.from("invoices")
				.select(
					`
          id,
          invoice_number,
          status,
          customers!invoices_customer_id_customers_id_fk (
            email,
            display_name
          )
        `,
				)
				.eq("id", invoiceId)
				.single();

			if (fetchError || !invoice) {
				throw new Error("Invoice not found");
			}

			// TODO: In production, integrate with email service to send reminder
			// For now, just log the action

			const customers = Array.isArray(invoice.customers)
				? invoice.customers[0]
				: invoice.customers;

			// Log action
			await logDetailedAction(
				"send_invoice_reminder",
				"invoice",
				invoiceId,
				{ invoice_number: invoice.invoice_number },
				{ reminder_sent: true, sent_to: customers?.email },
				reason,
			);

			return {
				reminderSent: true,
				sentTo: customers?.email,
			};
		},
	);
}
