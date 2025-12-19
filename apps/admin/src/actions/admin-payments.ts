"use server";

/**
 * Admin Payment Management Actions
 *
 * Server actions for managing payments in view-as mode.
 * Critical actions for support troubleshooting.
 * Uses Stripe for payment processing.
 */

import Stripe from "stripe";
import {
	executeAdminAction,
	getBeforeData,
	logDetailedAction,
	validateCompanyOwnership,
	type ActionResult,
} from "@/lib/admin-actions/framework";
import { getImpersonatedCompanyId } from "@/lib/admin-context";
import { revalidatePath } from "next/cache";

// Initialize Stripe client
function getStripeClient(): Stripe | null {
	const secretKey = process.env.STRIPE_SECRET_KEY;
	if (!secretKey) {
		console.warn("[AdminPayments] Stripe secret key not configured");
		return null;
	}
	return new Stripe(secretKey, {
		apiVersion: "2025-10-29.clover",
		typescript: true,
	});
}

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

			// Process refund via Stripe if payment has a Stripe payment intent
			const stripe = getStripeClient();
			let stripeRefundId: string | null = null;

			if (stripe && beforeData.stripe_payment_intent_id) {
				try {
					const stripeRefund = await stripe.refunds.create({
						payment_intent: beforeData.stripe_payment_intent_id,
						amount: refundAmount,
						reason: "requested_by_customer",
						metadata: {
							admin_reason: reason,
							payment_id: paymentId,
							company_id: companyId,
						},
					});
					stripeRefundId = stripeRefund.id;
				} catch (stripeError: any) {
					// Rollback database changes if Stripe refund fails
					await supabase
						.from("payments")
						.update({
							refunded_amount: beforeData.refunded_amount || 0,
							status: beforeData.status,
							updated_at: new Date().toISOString(),
						})
						.eq("id", paymentId);

					throw new Error(`Stripe refund failed: ${stripeError.message}`);
				}

				// Update payment with Stripe refund ID
				await supabase
					.from("payments")
					.update({
						stripe_refund_id: stripeRefundId,
						updated_at: new Date().toISOString(),
					})
					.eq("id", paymentId);
			}

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
					stripe_refund_id: stripeRefundId,
				},
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/payments`);

			return {
				refundIssued: true,
				refundAmount,
				newStatus,
				stripeRefundId,
			};
		},
	);
}

/**
 * Retry Failed Payment
 *
 * Retries a failed payment via Stripe or marks for manual retry.
 */
export async function retryFailedPayment(
	paymentId: string,
	reason?: string,
): Promise<ActionResult<{ paymentRetried: boolean; stripePaymentIntentId?: string }>> {
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

			// Get before data with Stripe details
			const beforeData = await getBeforeData(
				"payments",
				paymentId,
				"id, status, failure_reason, stripe_payment_intent_id, stripe_customer_id, amount, payment_method_id",
			);

			if (!beforeData) {
				throw new Error("Payment not found");
			}

			if (beforeData.status !== "failed") {
				throw new Error("Only failed payments can be retried");
			}

			const stripe = getStripeClient();
			let newPaymentIntentId: string | null = null;
			let retrySuccessful = false;

			// Attempt Stripe retry if we have a payment intent
			if (stripe && beforeData.stripe_payment_intent_id) {
				try {
					// First, check the current state of the payment intent
					const currentIntent = await stripe.paymentIntents.retrieve(
						beforeData.stripe_payment_intent_id
					);

					if (currentIntent.status === "requires_payment_method") {
						// Need to confirm with a payment method
						if (beforeData.stripe_customer_id) {
							// Get customer's default payment method
							const customer = await stripe.customers.retrieve(
								beforeData.stripe_customer_id
							);

							if (!customer.deleted && customer.invoice_settings?.default_payment_method) {
								const confirmedIntent = await stripe.paymentIntents.confirm(
									beforeData.stripe_payment_intent_id,
									{
										payment_method: customer.invoice_settings.default_payment_method as string,
									}
								);
								retrySuccessful = confirmedIntent.status === "succeeded";
								newPaymentIntentId = confirmedIntent.id;
							}
						}
					} else if (currentIntent.status === "requires_confirmation") {
						// Just needs confirmation
						const confirmedIntent = await stripe.paymentIntents.confirm(
							beforeData.stripe_payment_intent_id
						);
						retrySuccessful = confirmedIntent.status === "succeeded";
						newPaymentIntentId = confirmedIntent.id;
					} else if (currentIntent.status === "canceled" || currentIntent.status === "succeeded") {
						// Create a new payment intent
						if (beforeData.stripe_customer_id && beforeData.amount) {
							const newIntent = await stripe.paymentIntents.create({
								amount: beforeData.amount,
								currency: "usd",
								customer: beforeData.stripe_customer_id,
								metadata: {
									payment_id: paymentId,
									company_id: companyId,
									retry_reason: reason || "Admin retry",
								},
								automatic_payment_methods: {
									enabled: true,
									allow_redirects: "never",
								},
							});

							// Try to confirm if customer has a default payment method
							const customer = await stripe.customers.retrieve(
								beforeData.stripe_customer_id
							);

							if (!customer.deleted && customer.invoice_settings?.default_payment_method) {
								const confirmedIntent = await stripe.paymentIntents.confirm(
									newIntent.id,
									{
										payment_method: customer.invoice_settings.default_payment_method as string,
									}
								);
								retrySuccessful = confirmedIntent.status === "succeeded";
								newPaymentIntentId = confirmedIntent.id;
							} else {
								newPaymentIntentId = newIntent.id;
							}
						}
					}
				} catch (stripeError: any) {
					console.error("[AdminPayments] Stripe retry error:", stripeError);
					// Continue with marking as pending for manual retry
				}
			}

			// Update payment record
			const newStatus = retrySuccessful ? "completed" : "pending";
			const { error } = await supabase
				.from("payments")
				.update({
					status: newStatus,
					failure_reason: null,
					stripe_payment_intent_id: newPaymentIntentId || beforeData.stripe_payment_intent_id,
					updated_at: new Date().toISOString(),
				})
				.eq("id", paymentId);

			if (error) {
				throw new Error(`Failed to retry payment: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"retry_failed_payment",
				"payment",
				paymentId,
				beforeData,
				{
					status: newStatus,
					failure_reason: null,
					stripe_payment_intent_id: newPaymentIntentId,
					stripe_retry_successful: retrySuccessful,
				},
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/payments`);

			return {
				paymentRetried: true,
				stripePaymentIntentId: newPaymentIntentId || undefined,
			};
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
