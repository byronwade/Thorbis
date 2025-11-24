/**
 * Collect Manual Payment Server Action
 *
 * Handles payment collection by CSRs/staff for customer invoices.
 *
 * Supports:
 * - Cash payments (manual record)
 * - Check payments (manual record with check number)
 * - Card payments (processed via Adyen)
 * - ACH payments (processed via Adyen)
 */

"use server";

import { revalidatePath } from "next/cache";
import {
	getPaymentProcessor,
	updateTrustScoreAfterPayment,
} from "@/lib/payments/processor";
import type { PaymentChannel } from "@/lib/payments/processor-types";
import { createClient } from "@/lib/supabase/server";

type CollectPaymentResult = {
	success: boolean;
	error?: string;
	paymentId?: string;
	transactionId?: string;
};

type CollectPaymentParams = {
	invoiceId: string;
	companyId: string;
	customerId: string;
	paymentMethod: "cash" | "check" | "card" | "ach";
	amount: number; // In cents
	notes?: string;
	checkNumber?: string;
	cardDetails?: {
		cardNumber: string;
		cardExpiry: string;
		cardCvc: string;
		cardName: string;
	};
	achDetails?: {
		accountNumber: string;
		routingNumber: string;
		accountName: string;
	};
};

export async function collectManualPayment(
	params: CollectPaymentParams,
): Promise<CollectPaymentResult> {
	try {
		const {
			invoiceId,
			companyId,
			customerId,
			paymentMethod,
			amount,
			notes,
			checkNumber,
			cardDetails: _cardDetails,
			achDetails: _achDetails,
		} = params;

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database unavailable" };
		}

		// Verify user is authenticated
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		// Verify user has access to this company
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", companyId)
			.eq("status", "active")
			.single();

		if (!membership) {
			return { success: false, error: "No access to this company" };
		}

		// Get invoice details
		const { data: invoice, error: invoiceError } = await supabase
			.from("invoices")
			.select("id, invoice_number, total_amount, status, job_id")
			.eq("id", invoiceId)
			.eq("company_id", companyId)
			.single();

		if (invoiceError || !invoice) {
			return { success: false, error: "Invoice not found" };
		}

		if (invoice.status === "paid") {
			return { success: false, error: "Invoice is already paid" };
		}

		let transactionId: string;
		let processorType: string = "manual";

		// Process payment based on method
		if (paymentMethod === "cash" || paymentMethod === "check") {
			// Manual payments - just record them
			transactionId = `manual_${Date.now()}`;
			processorType = "manual";
		} else {
			// Card or ACH - use payment processor
			const channel: PaymentChannel = paymentMethod === "card" ? "online" : "ach";

			const processor = await getPaymentProcessor(companyId, {
				amount,
				channel,
			});

			if (!processor) {
				// No processor configured - allow in development
				const isDevelopment = process.env.NODE_ENV === "development";

				if (isDevelopment) {
					transactionId = `dev_txn_${Date.now()}`;
					processorType = "manual";
				} else {
					return {
						success: false,
						error:
							"Payment processing is not configured. Please set up payment processors in settings.",
					};
				}
			} else {
				// Process through the payment processor
				const paymentResponse = await processor.processPayment({
					amount,
					currency: "USD",
					invoiceId,
					customerId,
					channel,
					metadata: {
						invoice_number: invoice.invoice_number,
						payment_method: paymentMethod,
						collected_by: user.id,
					},
				});

				if (!paymentResponse.success) {
					await updateTrustScoreAfterPayment(companyId, false, amount);

					return {
						success: false,
						error:
							paymentResponse.error ||
							paymentResponse.failureMessage ||
							"Payment processing failed",
					};
				}

				if (paymentResponse.status === "requires_action") {
					return {
						success: false,
						error:
							"Additional authentication required. Customer should use the online payment portal.",
					};
				}

				transactionId = paymentResponse.transactionId || `txn_${Date.now()}`;
				processorType = "adyen";

				await updateTrustScoreAfterPayment(companyId, true, amount);
			}
		}

		// Calculate if this is a partial or full payment
		const remainingAmount = invoice.total_amount - amount;
		const newStatus = remainingAmount <= 0 ? "paid" : "partial";

		// Create payment record
		const paymentNumber = `PAY-${Date.now()}`;

		const { data: payment, error: paymentError } = await supabase
			.from("payments")
			.insert({
				company_id: companyId,
				customer_id: customerId,
				invoice_id: invoiceId,
				job_id: invoice.job_id,
				payment_number: paymentNumber,
				amount,
				currency: "USD",
				payment_method: paymentMethod,
				payment_type: "payment",
				status: "completed",
				check_number: checkNumber || null,
				notes,
				net_amount: amount,
				processor_fee: 0,
				refunded_amount: 0,
				is_reconciled: false,
				processed_at: new Date().toISOString(),
				processed_by: user.id,
			})
			.select("id")
			.single();

		if (paymentError) {
			return { success: false, error: paymentError.message };
		}

		// Update invoice status
		const invoiceUpdate: Record<string, unknown> = {
			status: newStatus,
			updated_at: new Date().toISOString(),
		};

		if (newStatus === "paid") {
			invoiceUpdate.paid_at = new Date().toISOString();
			invoiceUpdate.payment_method = paymentMethod;
		}

		const { error: updateError } = await supabase
			.from("invoices")
			.update(invoiceUpdate)
			.eq("id", invoiceId);

		if (updateError) {
			// Payment was created but invoice update failed - log but don't fail
			console.error("[CollectPayment] Failed to update invoice:", updateError);
		}

		// Log transaction
		await supabase.from("payment_processor_transactions").insert({
			company_id: companyId,
			invoice_id: invoiceId,
			processor_type: processorType,
			transaction_id: transactionId,
			amount,
			currency: "USD",
			status: "success",
			channel: paymentMethod === "card" ? "online" : paymentMethod === "ach" ? "ach" : "manual",
			metadata: {
				payment_method: paymentMethod,
				check_number: checkNumber,
				collected_by: user.id,
				notes,
			},
		});

		// Revalidate paths
		revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
		revalidatePath("/dashboard/work/invoices");
		revalidatePath("/dashboard/work/payments");

		return {
			success: true,
			paymentId: payment.id,
			transactionId,
		};
	} catch (error) {
		console.error("[CollectPayment] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Payment collection failed",
		};
	}
}
