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

export async function createPayment(
  data: PaymentInsert
): Promise<{ success: boolean; error?: string; paymentId?: string }> {
  try {
    const validated = paymentInsertSchema.parse(data);
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .insert(validated)
      .select("id, amount, company_id, customer_id, invoice_id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
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
    console.error("Create payment error:", error);
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
  paymentId: string
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
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, payment };
  } catch (error) {
    console.error("Get payment error:", error);
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
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, payments };
  } catch (error) {
    console.error("Get payments error:", error);
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
  data: PaymentUpdate
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
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/finance/payments");
    revalidatePath(`/dashboard/finance/payments/${paymentId}`);
    return { success: true };
  } catch (error) {
    console.error("Update payment error:", error);
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
  refundReason?: string
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
      console.error("Supabase error:", refundError);
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
      console.error("Supabase error:", updateError);
      return { success: false, error: updateError.message };
    }

    revalidatePath("/dashboard/finance/payments");
    revalidatePath(`/dashboard/finance/payments/${paymentId}`);
    return { success: true, refundId: refund.id };
  } catch (error) {
    console.error("Refund payment error:", error);
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
  paymentId: string
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
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/finance/payments");
    revalidatePath(`/dashboard/finance/payments/${paymentId}`);
    return { success: true };
  } catch (error) {
    console.error("Reconcile payment error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to reconcile payment" };
  }
}

export async function unreconcilePayment(
  paymentId: string
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
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/finance/payments");
    revalidatePath(`/dashboard/finance/payments/${paymentId}`);
    return { success: true };
  } catch (error) {
    console.error("Unreconcile payment error:", error);
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
  paymentId: string
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
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/finance/payments");
    revalidatePath("/dashboard/work/payments");
    return { success: true };
  } catch (error) {
    console.error("Delete payment error:", error);
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
  paymentId: string
): Promise<{ success: boolean; error?: string }> {
  return deletePayment(paymentId);
}
