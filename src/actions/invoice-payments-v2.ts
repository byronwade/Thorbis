"use server";

/**
 * Invoice Payment Server Actions V2
 *
 * Updated to use the payment processor abstraction layer:
 * - Automatically routes to appropriate processor (Adyen for high-value, etc.)
 * - Checks trust scores before processing
 * - Records processor transactions
 * - Updates trust scores after payment
 */

import { revalidatePath } from "next/cache";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import { withErrorHandling } from "@/lib/errors/with-error-handling";
import {
  calculatePaymentTrustScore,
  getPaymentProcessor,
  type ProcessPaymentRequest,
  updateTrustScoreAfterPayment,
} from "@/lib/payments/processor";
import { createClient } from "@/lib/supabase/server";
import { createPayment } from "./payments";

/**
 * Generate unique payment number
 */
async function generatePaymentNumber(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  companyId: string
): Promise<string> {
  const { data: latestPayment } = await supabase
    .from("payments")
    .select("payment_number")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!latestPayment) {
    return `PAY-${new Date().getFullYear()}-001`;
  }

  const match = latestPayment.payment_number.match(/PAY-\d{4}-(\d+)/);
  if (match) {
    const nextNumber = Number.parseInt(match[1], 10) + 1;
    return `PAY-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, "0")}`;
  }

  return `PAY-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
}

/**
 * Process invoice payment using appropriate processor
 */
export async function processInvoicePayment({
  invoiceId,
  paymentMethodId,
  channel = "online",
  amount,
}: {
  invoiceId: string;
  paymentMethodId?: string;
  channel?: "online" | "card_present" | "tap_to_pay" | "ach";
  amount?: number; // Override invoice amount if partial payment
}): Promise<{
  success: boolean;
  error?: string;
  transactionId?: string;
  requiresApproval?: boolean;
  clientSecret?: string;
}> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new ActionError(
        "Not authenticated",
        ERROR_CODES.AUTH_UNAUTHORIZED,
        401
      );
    }

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(
        "*, customer:customers!customer_id(*), company:companies!company_id(*)"
      )
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      throw new ActionError(
        "Invoice not found",
        ERROR_CODES.DB_RECORD_NOT_FOUND,
        404
      );
    }

    if (invoice.balance_amount <= 0) {
      throw new ActionError(
        "Invoice is already paid",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Determine payment amount
    const paymentAmount = amount
      ? Math.round(amount * 100)
      : invoice.balance_amount; // Convert to cents if needed

    if (paymentAmount > invoice.balance_amount) {
      throw new ActionError(
        "Payment amount exceeds invoice balance",
        ERROR_CODES.PAYMENT_INVALID_AMOUNT
      );
    }

    // Check trust score and payment limits
    const trustCheck = await calculatePaymentTrustScore(
      invoice.company_id,
      paymentAmount
    );

    if (!trustCheck.allowed) {
      throw new ActionError(
        trustCheck.reason || "Payment not allowed based on trust score",
        ERROR_CODES.PAYMENT_INVALID_AMOUNT
      );
    }

    if (trustCheck.requiresApproval) {
      // Return early - payment requires manual approval
      return {
        success: false,
        error: trustCheck.reason || "Payment requires manual approval",
        requiresApproval: true,
      };
    }

    // Get appropriate payment processor
    const processor = await getPaymentProcessor(invoice.company_id, {
      amount: paymentAmount,
      channel,
    });

    if (!processor) {
      throw new ActionError(
        "No payment processor configured. Please configure a payment processor in settings.",
        ERROR_CODES.PAYMENT_INVALID_AMOUNT
      );
    }

    // Process payment
    const paymentRequest: ProcessPaymentRequest = {
      amount: paymentAmount,
      currency: "USD",
      invoiceId,
      customerId: invoice.customer_id,
      paymentMethodId,
      channel,
      metadata: {
        invoice_number: invoice.invoice_number,
        company_id: invoice.company_id,
      },
      description: `Invoice ${invoice.invoice_number}${invoice.title ? ` - ${invoice.title}` : ""}`,
    };

    const paymentResponse = await processor.processPayment(paymentRequest);

    if (!paymentResponse.success) {
      // Update trust score (failed payment)
      await updateTrustScoreAfterPayment(
        invoice.company_id,
        false,
        paymentAmount
      );

      throw new ActionError(
        paymentResponse.error || "Payment processing failed",
        ERROR_CODES.PAYMENT_FAILED
      );
    }

    // Record processor transaction
    const { data: processorTransaction, error: transactionError } =
      await supabase
        .from("payment_processor_transactions")
        .insert({
          company_id: invoice.company_id,
          processor_type: processor.constructor.name
            .toLowerCase()
            .replace("processor", ""), // Extract processor type
          processor_transaction_id:
            paymentResponse.processorTransactionId ||
            paymentResponse.transactionId ||
            "",
          channel,
          amount: paymentAmount,
          currency: "USD",
          status: paymentResponse.status,
          processor_metadata: paymentResponse.processorMetadata || {},
          processor_response: paymentResponse as unknown as Record<
            string,
            unknown
          >,
          processed_at: new Date().toISOString(),
        })
        .select("id")
        .single();

    if (transactionError) {
      console.error("Error recording processor transaction:", transactionError);
    }

    // Generate payment number
    const paymentNumber = await generatePaymentNumber(
      supabase,
      invoice.company_id
    );

    // Create payment record
    const paymentRecord = await createPayment({
      company_id: invoice.company_id,
      customer_id: invoice.customer_id,
      invoice_id: invoiceId,
      payment_number: paymentNumber,
      amount: paymentAmount,
      currency: "USD",
      payment_method:
        channel === "ach"
          ? "ach"
          : channel === "card_present" || channel === "tap_to_pay"
            ? "credit_card"
            : "credit_card",
      payment_type: "payment",
      status:
        paymentResponse.status === "succeeded" ? "completed" : "processing",
      processor_name: processor.constructor.name
        .toLowerCase()
        .replace("processor", ""),
      processor_transaction_id:
        paymentResponse.processorTransactionId ||
        paymentResponse.transactionId ||
        "",
      processor_fee: 0, // Will be updated from processor response
      net_amount: paymentAmount, // Will be updated after fees calculated
      processor_metadata: paymentResponse.processorMetadata || {},
      refunded_amount: 0,
      is_reconciled: false,
      processed_at: new Date(),
    });

    if (!paymentRecord.success) {
      console.error("Error creating payment record:", paymentRecord.error);
    }

    // Update invoice if payment succeeded
    if (paymentResponse.status === "succeeded") {
      const newPaidAmount = invoice.paid_amount + paymentAmount;
      const newBalanceAmount = invoice.total_amount - newPaidAmount;
      const newStatus = newBalanceAmount === 0 ? "paid" : "partial";

      await supabase
        .from("invoices")
        .update({
          paid_amount: newPaidAmount,
          balance_amount: newBalanceAmount,
          status: newStatus,
          paid_at: newBalanceAmount === 0 ? new Date().toISOString() : null,
        })
        .eq("id", invoiceId);

      // Update trust score (successful payment)
      await updateTrustScoreAfterPayment(
        invoice.company_id,
        true,
        paymentAmount
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
    revalidatePath("/dashboard/finance");

    return {
      success: true,
      transactionId: paymentResponse.transactionId,
      clientSecret: paymentResponse.clientSecret,
    };
  });
}

/**
 * Check if payment requires approval before processing
 */
export async function checkPaymentApproval(
  invoiceId: string,
  amount?: number
): Promise<{
  requiresApproval: boolean;
  reason?: string;
  trustScore?: number;
}> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { requiresApproval: true, reason: "Database connection failed" };
    }

    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, balance_amount")
      .eq("id", invoiceId)
      .single();

    if (!invoice) {
      return { requiresApproval: true, reason: "Invoice not found" };
    }

    const paymentAmount = amount
      ? Math.round(amount * 100)
      : invoice.balance_amount;
    const trustCheck = await calculatePaymentTrustScore(
      invoice.company_id,
      paymentAmount
    );

    return {
      requiresApproval: trustCheck.requiresApproval,
      reason: trustCheck.reason,
      trustScore: trustCheck.score,
    };
  } catch (error) {
    console.error("Error checking payment approval:", error);
    return {
      requiresApproval: true,
      reason: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get payment processor status for an invoice
 */
export async function getInvoicePaymentProcessorStatus(
  invoiceId: string
): Promise<{
  success: boolean;
  error?: string;
  processor?: string;
  trustScore?: number;
  maxAmount?: number;
}> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, balance_amount")
      .eq("id", invoiceId)
      .single();

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Get company's payment processors
    const { data: processors } = await supabase
      .from("company_payment_processors")
      .select("processor_type, max_payment_amount")
      .eq("company_id", invoice.company_id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    const processor = processors?.[0];
    const trustCheck = await calculatePaymentTrustScore(
      invoice.company_id,
      invoice.balance_amount
    );

    return {
      success: true,
      processor: processor?.processor_type,
      trustScore: trustCheck.score,
      maxAmount: processor?.max_payment_amount,
    };
  });
}
