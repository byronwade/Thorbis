"use server";

import { revalidatePath } from "next/cache";
import { notifyPaymentReceived } from "@/lib/notifications/triggers";
import { createClient } from "@/lib/supabase/server";
import {
	type PaymentInsert,
	type PaymentUpdate,
	paymentInsertSchema,
	paymentUpdateSchema,
} from "@/lib/validations/database-schemas";

/**
 * Server Actions for Payment Management
 *
 * Handles payment transactions with:
 * - Server-side validation using Zod
 * - Supabase database operations
 * - Refund support
 * - Reconciliation tracking
 * - Company-based multi-tenancy via RLS
 */

// ============================================================================
// CREATE
// ============================================================================

type CreatePaymentResult = {
	success: boolean;
	error?: string;
	paymentId?: string;
};

export async function createPayment(
	input: PaymentInsert | FormData,
): Promise<CreatePaymentResult> {
	if (input instanceof FormData) {
		return createPaymentFromForm(input);
	}

	return createPaymentWithData(input);
}

async function createPaymentWithData(
	data: PaymentInsert,
	existingSupabase?: Awaited<ReturnType<typeof createClient>> | null,
): Promise<CreatePaymentResult> {
	try {
		const validated = paymentInsertSchema.parse(data);
		const supabase = existingSupabase ?? (await createClient());

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const { data: payment, error } = await supabase
			.from("payments")
			.insert(validated)
			.select("id, amount, company_id, customer_id, invoice_id")
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		// Fetch customer info for notification
		const { data: customer } = await supabase
			.from("customers")
			.select("name")
			.eq("id", payment.customer_id)
			.single();

		// Get company owner/managers to notify about payment
		const { data: companyUsers } = await supabase
			.from("team_members")
			.select("user_id")
			.eq("company_id", payment.company_id)
			.eq("status", "active")
			.limit(5);

		// Send notification to company users about payment received
		if (customer && companyUsers && companyUsers.length > 0) {
			for (const teamMember of companyUsers) {
				await notifyPaymentReceived({
					userId: teamMember.user_id,
					companyId: payment.company_id,
					amount: payment.amount,
					customerName: customer.name,
					invoiceId: payment.invoice_id || undefined,
					priority: "high",
					actionUrl: "/dashboard/finance/invoices",
				});
			}
		}

		revalidatePath("/dashboard/finance/payments");
		return { success: true, paymentId: payment.id };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to create payment" };
	}
}

async function createPaymentFromForm(
	formData: FormData,
): Promise<CreatePaymentResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const invoiceId = formData.get("invoiceId")?.toString();
		if (!invoiceId) {
			return { success: false, error: "Invoice is required" };
		}

		const rawAmount = formData.get("amount");
		const amountNumber = Number.parseFloat(rawAmount as string);
		if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
			return { success: false, error: "Payment amount must be greater than 0" };
		}
		const amount = Math.round(amountNumber * 100);

		const { data: invoice, error: invoiceError } = await supabase
			.from("invoices")
			.select("id, company_id, customer_id, job_id, invoice_number, currency")
			.eq("id", invoiceId)
			.single();

		if (invoiceError || !invoice) {
			return { success: false, error: "Invoice not found" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		const paymentMethod =
			(formData.get("paymentMethod") as PaymentInsert["payment_method"]) ||
			"cash";
		const paymentDateValue = formData.get("paymentDate")?.toString();
		const checkNumber = formData.get("checkNumber")?.toString() || null;
		const notes = formData.get("notes")?.toString() || null;

		const paymentNumber = `PAY-${Date.now()}`;

		const paymentData: PaymentInsert = {
			company_id: invoice.company_id,
			customer_id: invoice.customer_id,
			invoice_id: invoice.id,
			job_id: invoice.job_id ?? null,
			payment_number: paymentNumber,
			amount,
			currency: (invoice.currency || "USD") as PaymentInsert["currency"],
			payment_method: paymentMethod,
			payment_type: "payment",
			status: "completed",
			check_number: checkNumber,
			notes,
			net_amount: amount,
			processor_fee: 0,
			refunded_amount: 0,
			is_reconciled: false,
			processed_at: paymentDateValue ? new Date(paymentDateValue) : new Date(),
			processed_by: user?.id ?? null,
		};

		return createPaymentWithData(paymentData, supabase);
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to create payment" };
	}
}

// ============================================================================
// READ
// ============================================================================

export async function getPayment(
	paymentId: string,
): Promise<{ success: boolean; error?: string; payment?: any }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const { data: payment, error } = await supabase
			.from("payments")
			.select("*, customer:customers(*), invoice:invoices(*)")
			.eq("id", paymentId)
			.is("deleted_at", null)
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, payment };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to get payment" };
	}
}

export async function getPayments(filters?: {
	paymentMethod?: string;
	status?: string;
	customerId?: string;
	isReconciled?: boolean;
	dateFrom?: string;
	dateTo?: string;
}): Promise<{ success: boolean; error?: string; payments?: any[] }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		let query = supabase
			.from("payments")
			.select("*, customer:customers(first_name, last_name, email)")
			.is("deleted_at", null)
			.order("created_at", { ascending: false });

		// Apply filters
		if (filters?.paymentMethod && filters.paymentMethod !== "all") {
			query = query.eq("payment_method", filters.paymentMethod);
		}
		if (filters?.status && filters.status !== "all") {
			query = query.eq("status", filters.status);
		}
		if (filters?.customerId) {
			query = query.eq("customer_id", filters.customerId);
		}
		if (filters?.isReconciled !== undefined) {
			query = query.eq("is_reconciled", filters.isReconciled);
		}
		if (filters?.dateFrom) {
			query = query.gte("created_at", filters.dateFrom);
		}
		if (filters?.dateTo) {
			query = query.lte("created_at", filters.dateTo);
		}

		const { data: payments, error } = await query;

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, payments };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to get payments" };
	}
}

// ============================================================================
// UPDATE
// ============================================================================

export async function updatePayment(
	paymentId: string,
	data: PaymentUpdate,
): Promise<{ success: boolean; error?: string }> {
	try {
		const validated = paymentUpdateSchema.parse(data);
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const { error } = await supabase
			.from("payments")
			.update(validated)
			.eq("id", paymentId)
			.is("deleted_at", null);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/finance/payments");
		revalidatePath(`/dashboard/finance/payments/${paymentId}`);
		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to update payment" };
	}
}

// ============================================================================
// REFUND
// ============================================================================

export async function refundPayment(
	paymentId: string,
	refundAmount: number,
	refundReason?: string,
): Promise<{ success: boolean; error?: string; refundId?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		// Get original payment
		const { data: originalPayment, error: fetchError } = await supabase
			.from("payments")
			.select("*")
			.eq("id", paymentId)
			.single();

		if (fetchError || !originalPayment) {
			return { success: false, error: "Payment not found" };
		}

		// Validate refund amount
		const alreadyRefunded = originalPayment.refunded_amount || 0;
		const maxRefundable = originalPayment.amount - alreadyRefunded;

		if (refundAmount > maxRefundable) {
			return {
				success: false,
				error: `Cannot refund more than ${maxRefundable / 100} (already refunded ${alreadyRefunded / 100})`,
			};
		}

		// Create refund record
		const refundData = {
			company_id: originalPayment.company_id,
			customer_id: originalPayment.customer_id,
			invoice_id: originalPayment.invoice_id,
			payment_number: `REFUND-${originalPayment.payment_number}`,
			amount: refundAmount,
			currency: originalPayment.currency,
			payment_method: originalPayment.payment_method,
			payment_type: "refund",
			status: "completed",
			original_payment_id: paymentId,
			refund_reason: refundReason,
			processed_at: new Date().toISOString(),
		};

		const { data: refund, error: refundError } = await supabase
			.from("payments")
			.insert(refundData)
			.select("id")
			.single();

		if (refundError) {
			return { success: false, error: refundError.message };
		}

		// Update original payment
		const newRefundedAmount = alreadyRefunded + refundAmount;
		const newStatus =
			newRefundedAmount === originalPayment.amount
				? "refunded"
				: "partially_refunded";

		const { error: updateError } = await supabase
			.from("payments")
			.update({
				refunded_amount: newRefundedAmount,
				status: newStatus,
			})
			.eq("id", paymentId);

		if (updateError) {
			return { success: false, error: updateError.message };
		}

		revalidatePath("/dashboard/finance/payments");
		revalidatePath(`/dashboard/finance/payments/${paymentId}`);
		return { success: true, refundId: refund.id };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to refund payment" };
	}
}

// ============================================================================
// RECONCILIATION
// ============================================================================

export async function reconcilePayment(
	paymentId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { error } = await supabase
			.from("payments")
			.update({
				is_reconciled: true,
				reconciled_at: new Date().toISOString(),
				reconciled_by: user.id,
			})
			.eq("id", paymentId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/finance/payments");
		revalidatePath(`/dashboard/finance/payments/${paymentId}`);
		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to reconcile payment" };
	}
}

export async function unreconcilePayment(
	paymentId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const { error } = await supabase
			.from("payments")
			.update({
				is_reconciled: false,
				reconciled_at: null,
				reconciled_by: null,
			})
			.eq("id", paymentId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/finance/payments");
		revalidatePath(`/dashboard/finance/payments/${paymentId}`);
		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to unreconcile payment" };
	}
}

// ============================================================================
// DELETE
// ============================================================================

export async function deletePayment(
	paymentId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { error } = await supabase
			.from("payments")
			.update({
				deleted_at: new Date().toISOString(),
				deleted_by: user.id,
			})
			.eq("id", paymentId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/finance/payments");
		revalidatePath("/dashboard/work/payments");
		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to delete payment" };
	}
}

/**
 * Archive payment (alias for deletePayment - uses soft delete)
 */
export async function archivePayment(
	paymentId: string,
): Promise<{ success: boolean; error?: string }> {
	return deletePayment(paymentId);
}

/**
 * Unlink payment from job
 * Removes the job association (sets job_id to NULL)
 * Bidirectional operation - updates both payment and job views
 */
export async function unlinkPaymentFromJob(
	paymentId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		// Get current payment to verify exists and get job_id for revalidation
		const { data: payment, error: fetchError } = await supabase
			.from("payments")
			.select("id, job_id")
			.eq("id", paymentId)
			.is("deleted_at", null)
			.single();

		if (fetchError || !payment) {
			return { success: false, error: "Payment not found" };
		}

		const previousJobId = payment.job_id;

		// Unlink payment from job (set job_id to NULL)
		const { error: unlinkError } = await supabase
			.from("payments")
			.update({ job_id: null })
			.eq("id", paymentId);

		if (unlinkError) {
			return { success: false, error: unlinkError.message };
		}

		// Revalidate both pages
		revalidatePath(`/dashboard/work/payments/${paymentId}`);
		if (previousJobId) {
			revalidatePath(`/dashboard/work/${previousJobId}`);
		}
		revalidatePath("/dashboard/work/payments");

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to unlink payment from job" };
	}
}
