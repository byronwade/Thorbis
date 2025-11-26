"use server";

/**
 * Admin Payment Management Actions
 *
 * Server actions for managing payments in view-as mode.
 * Critical actions for support troubleshooting.
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
 * Issue Payment Refund
 *
 * Issues a full or partial refund for a payment.
 * CRITICAL: This action should have additional approval workflows in production.
 */
export async function issuePaymentRefund(
	paymentId: string,
	refundAmount: number,
	reason: string,
): Promise<ActionResult<{ refundIssued: boolean; refundAmount: number; newStatus: string }>> {
	return executeAdminAction(
		{
			permission: "refund",
			action: "issue_payment_refund",
			resourceType: "payment",
			resourceId: paymentId,
			reason: `Refund $${(refundAmount / 100).toFixed(2)}: ${reason}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"payments",
				paymentId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Payment does not belong to this company");
			}

			// Get payment data
			const beforeData = await getBeforeData(
				"payments",
				paymentId,
				"id, amount, status, refunded_amount",
			);

			if (!beforeData) {
				throw new Error("Payment not found");
			}

			// Validate refund amount
			const totalPaid = beforeData.amount || 0;
			const alreadyRefunded = beforeData.refunded_amount || 0;
			const maxRefund = totalPaid - alreadyRefunded;

			if (refundAmount > maxRefund) {
				throw new Error(
					`Refund amount ($${(refundAmount / 100).toFixed(2)}) exceeds available amount ($${(maxRefund / 100).toFixed(2)})`,
				);
			}

			if (refundAmount <= 0) {
				throw new Error("Refund amount must be greater than zero");
			}

			// Calculate new refunded amount
			const newRefundedAmount = alreadyRefunded + refundAmount;
			const newStatus =
				newRefundedAmount >= totalPaid ? "refunded" : "partially_refunded";

			// Update payment record
			const { error } = await supabase
				.from("payments")
				.update({
					refunded_amount: newRefundedAmount,
					status: newStatus,
					updated_at: new Date().toISOString(),
				})
				.eq("id", paymentId);

			if (error) {
				throw new Error(`Failed to issue refund: ${error.message}`);
			}

			// TODO: In production, integrate with payment processor (Stripe, etc.)
			// to actually process the refund

			// Log with before/after data
			await logDetailedAction(
				"issue_payment_refund",
				"payment",
				paymentId,
				beforeData,
				{
					refunded_amount: newRefundedAmount,
					status: newStatus,
					refund_amount: refundAmount,
				},
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/payments`);

			return {
				refundIssued: true,
				refundAmount,
				newStatus,
			};
		},
	);
}

/**
 * Retry Failed Payment
 *
 * Marks a failed payment for retry or resets its status.
 */
export async function retryFailedPayment(
	paymentId: string,
	reason?: string,
): Promise<ActionResult<{ paymentRetried: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_payments",
			action: "retry_failed_payment",
			resourceType: "payment",
			resourceId: paymentId,
			reason: reason || "Retrying failed payment",
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"payments",
				paymentId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Payment does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"payments",
				paymentId,
				"id, status, failure_reason",
			);

			if (!beforeData) {
				throw new Error("Payment not found");
			}

			if (beforeData.status !== "failed") {
				throw new Error("Only failed payments can be retried");
			}

			// Mark for retry
			const { error } = await supabase
				.from("payments")
				.update({
					status: "pending",
					failure_reason: null,
					updated_at: new Date().toISOString(),
				})
				.eq("id", paymentId);

			if (error) {
				throw new Error(`Failed to retry payment: ${error.message}`);
			}

			// TODO: In production, trigger actual payment retry via processor

			// Log with before/after data
			await logDetailedAction(
				"retry_failed_payment",
				"payment",
				paymentId,
				beforeData,
				{ status: "pending", failure_reason: null },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/payments`);

			return { paymentRetried: true };
		},
	);
}

/**
 * Mark Payment as Completed
 *
 * Manually marks a payment as completed (e.g., for offline payments).
 */
export async function markPaymentCompleted(
	paymentId: string,
	reason: string,
): Promise<ActionResult<{ paymentCompleted: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_payments",
			action: "mark_payment_completed",
			resourceType: "payment",
			resourceId: paymentId,
			reason: `Marked as completed: ${reason}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"payments",
				paymentId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Payment does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData("payments", paymentId, "id, status");

			if (!beforeData) {
				throw new Error("Payment not found");
			}

			if (beforeData.status === "completed") {
				throw new Error("Payment is already completed");
			}

			// Mark as completed
			const { error } = await supabase
				.from("payments")
				.update({
					status: "completed",
					updated_at: new Date().toISOString(),
				})
				.eq("id", paymentId);

			if (error) {
				throw new Error(`Failed to mark payment as completed: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"mark_payment_completed",
				"payment",
				paymentId,
				beforeData,
				{ status: "completed" },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/payments`);

			return { paymentCompleted: true };
		},
	);
}

/**
 * Update Payment Method
 *
 * Changes the payment method for a payment record.
 */
export async function updatePaymentMethod(
	paymentId: string,
	newPaymentMethod: string,
	reason?: string,
): Promise<ActionResult<{ paymentMethodUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_payments",
			action: "update_payment_method",
			resourceType: "payment",
			resourceId: paymentId,
			reason: reason || `Changed payment method to ${newPaymentMethod}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"payments",
				paymentId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Payment does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"payments",
				paymentId,
				"id, payment_method",
			);

			// Update payment method
			const { error } = await supabase
				.from("payments")
				.update({
					payment_method: newPaymentMethod,
					updated_at: new Date().toISOString(),
				})
				.eq("id", paymentId);

			if (error) {
				throw new Error(`Failed to update payment method: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_payment_method",
				"payment",
				paymentId,
				beforeData,
				{ payment_method: newPaymentMethod },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/payments`);

			return { paymentMethodUpdated: true };
		},
	);
}
