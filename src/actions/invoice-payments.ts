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

const PAYMENT_NUMBER_PADDING_LENGTH = 3;
const CENTS_PER_DOLLAR = 100;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_NOT_FOUND = 404;

const PAYMENT_NUMBER_REGEX = /PAY-\d{4}-(\d+)/;

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

  const match = latestPayment.payment_number.match(PAYMENT_NUMBER_REGEX);
  if (match) {
    const nextNumber = Number.parseInt(match[1], 10) + 1;
    return `PAY-${new Date().getFullYear()}-${nextNumber
      .toString()
      .padStart(PAYMENT_NUMBER_PADDING_LENGTH, "0")}`;
  }

  return `PAY-${new Date().getFullYear()}-${Date.now()
    .toString()
    .slice(-PAYMENT_NUMBER_PADDING_LENGTH)}`;
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
        HTTP_STATUS_UNAUTHORIZED
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
        HTTP_STATUS_NOT_FOUND
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
      ? Math.round(amount * CENTS_PER_DOLLAR)
      : invoice.balance_amount;

    if (paymentAmount > invoice.balance_amount) {
      throw new ActionError(
        "Payment amount exceeds invoice balance",
        ERROR_CODES.PAYMENT_INVALID_AMOUNT
      );
    }

    // Check if company has a bank account configured (required for payments)
    const { data: bankAccounts } = await supabase
      .from("finance_bank_accounts")
      .select("id")
      .eq("company_id", invoice.company_id)
      .eq("is_active", true)
      .limit(1);

    if (!bankAccounts || bankAccounts.length === 0) {
      throw new ActionError(
        "Bank account required. Please set up a bank account in Settings → Finance → Bank Accounts before collecting payments.",
        ERROR_CODES.OPERATION_NOT_ALLOWED
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

    const paymentRequest = buildProcessPaymentRequest({
      invoice,
      invoiceId,
      paymentAmount,
      paymentMethodId,
      channel,
    });
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

    await recordProcessorTransaction({
      supabase,
      processor,
      companyId: invoice.company_id,
      paymentResponse,
      channel,
      paymentAmount,
    });

    // Generate payment number
    const paymentNumber = await generatePaymentNumber(
      supabase,
      invoice.company_id
    );

    const paymentRecord = await createPayment(
      buildPaymentInsertPayload({
        invoice,
        invoiceId,
        paymentNumber,
        paymentAmount,
        channel,
        paymentResponse,
        processor,
      })
    );

    if (!paymentRecord.success) {
      throw new ActionError(
        paymentRecord.error || "Failed to create payment record",
        ERROR_CODES.DB_QUERY_ERROR
      );
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

type BuildPaymentRequestOptions = {
  invoice: {
    company_id: string;
    customer_id: string;
    invoice_number: string;
    title?: string | null;
  };
  invoiceId: string;
  paymentAmount: number;
  paymentMethodId: string | undefined;
  channel: "online" | "card_present" | "tap_to_pay" | "ach";
};

function buildProcessPaymentRequest(
  options: BuildPaymentRequestOptions
): ProcessPaymentRequest {
  const { invoice, invoiceId, paymentAmount, paymentMethodId, channel } =
    options;
  const descriptionSuffix = invoice.title ? ` - ${invoice.title}` : "";
  const description = `Invoice ${invoice.invoice_number}${descriptionSuffix}`;

  return {
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
    description,
  };
}

type RecordProcessorTransactionOptions = {
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
  processor: { constructor: { name: string } };
  companyId: string;
  paymentResponse: {
    processorTransactionId?: string;
    transactionId?: string;
    status: string;
    processorMetadata?: Record<string, unknown>;
  };
  channel: "online" | "card_present" | "tap_to_pay" | "ach";
  paymentAmount: number;
};

async function recordProcessorTransaction(
  options: RecordProcessorTransactionOptions
) {
  const {
    supabase,
    processor,
    companyId,
    paymentResponse,
    channel,
    paymentAmount,
  } = options;
  await supabase.from("payment_processor_transactions").insert({
    company_id: companyId,
    processor_type: processor.constructor.name
      .toLowerCase()
      .replace("processor", ""),
    processor_transaction_id:
      paymentResponse.processorTransactionId ||
      paymentResponse.transactionId ||
      "",
    channel,
    amount: paymentAmount,
    currency: "USD",
    status: paymentResponse.status,
    processor_metadata: paymentResponse.processorMetadata || {},
    processor_response: paymentResponse as unknown as Record<string, unknown>,
    processed_at: new Date().toISOString(),
  });
}

type PaymentInsertParams = {
  invoice: {
    company_id: string;
    customer_id: string;
  };
  invoiceId: string;
  paymentNumber: string;
  paymentAmount: number;
  channel: "online" | "card_present" | "tap_to_pay" | "ach";
  paymentResponse: {
    status: string;
    transactionId?: string;
    processorTransactionId?: string;
    processorMetadata?: Record<string, unknown>;
  };
  processor: { constructor: { name: string } };
};

function resolvePaymentMethod(
  channel: "online" | "card_present" | "tap_to_pay" | "ach"
): string {
  if (channel === "ach") {
    return "ach";
  }
  return "credit_card";
}

function buildPaymentInsertPayload(params: PaymentInsertParams) {
  const {
    invoice,
    invoiceId,
    paymentNumber,
    paymentAmount,
    channel,
    paymentResponse,
    processor,
  } = params;

  return {
    company_id: invoice.company_id,
    customer_id: invoice.customer_id,
    invoice_id: invoiceId,
    payment_number: paymentNumber,
    amount: paymentAmount,
    currency: "USD",
    payment_method: resolvePaymentMethod(channel),
    payment_type: "payment",
    status: paymentResponse.status === "succeeded" ? "completed" : "processing",
    processor_name: processor.constructor.name
      .toLowerCase()
      .replace("processor", ""),
    processor_transaction_id:
      paymentResponse.processorTransactionId ||
      paymentResponse.transactionId ||
      "",
    processor_fee: 0,
    net_amount: paymentAmount,
    processor_metadata: paymentResponse.processorMetadata || {},
    refunded_amount: 0,
    is_reconciled: false,
    processed_at: new Date(),
  };
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
      ? Math.round(amount * CENTS_PER_DOLLAR)
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
    return {
      requiresApproval: true,
      reason: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get payment processor status for an invoice
 */
export async function getInvoicePaymentProcessorStatus(invoiceId: string): Promise<{
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

/**
 * Remove payment from invoice
 *
 * Removes the association between a payment and an invoice via the invoice_payments junction table.
 * This is critical for correcting payment applications to invoices.
 *
 * IMPORTANT: After removing payment, this recalculates invoice balance:
 * 1. Sums remaining payments for this invoice
 * 2. Updates invoice.paid_amount to the new total
 * 3. Updates invoice.balance_amount = total_amount - paid_amount
 * 4. Updates invoice.status based on balance (paid/partial/sent)
 *
 * Pattern: DELETE from junction table → Recalculate balance → Revalidate paths
 *
 * @param invoicePaymentId - ID of the invoice_payments junction table record
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function removePaymentFromInvoice(
  invoicePaymentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // 1. Get junction record to find invoice_id and payment_id for revalidation
    const { data: junctionRecord, error: fetchError } = await supabase
      .from("invoice_payments")
      .select("id, invoice_id, payment_id, amount_applied")
      .eq("id", invoicePaymentId)
      .single();

    if (fetchError || !junctionRecord) {
      return { success: false, error: "Payment application record not found" };
    }

    const { invoice_id, payment_id, amount_applied } = junctionRecord;

    // Get invoice details for balance recalculation
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id, total_amount, paid_amount, balance_amount, status")
      .eq("id", invoice_id)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // 2. DELETE the junction table row
    const { error: deleteError } = await supabase
      .from("invoice_payments")
      .delete()
      .eq("id", invoicePaymentId);

    if (deleteError) {
      return {
        success: false,
        error: `Failed to remove payment: ${deleteError.message}`,
      };
    }

    // 3. Recalculate invoice balance (CRITICAL)
    // Sum remaining payments for this invoice
    const { data: remainingPayments } = await supabase
      .from("invoice_payments")
      .select("amount_applied")
      .eq("invoice_id", invoice_id);

    const newPaidAmount = remainingPayments
      ? remainingPayments.reduce(
          (sum, payment) => sum + payment.amount_applied,
          0
        )
      : Math.max(0, invoice.paid_amount - amount_applied);

    // Calculate new balance
    const newBalanceAmount = invoice.total_amount - newPaidAmount;

    // Determine new status based on balance
    let newStatus = invoice.status;
    if (newBalanceAmount === 0) {
      newStatus = "paid";
    } else if (newPaidAmount > 0 && newBalanceAmount > 0) {
      newStatus = "partial";
    } else if (newPaidAmount === 0 && newBalanceAmount > 0) {
      // No payments remaining - revert to sent or viewed
      newStatus = invoice.status === "paid" ? "sent" : invoice.status;
    }

    // 4. Update invoice with recalculated amounts
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        paid_amount: newPaidAmount,
        balance_amount: newBalanceAmount,
        status: newStatus,
        paid_at: newBalanceAmount === 0 ? new Date().toISOString() : null,
      })
      .eq("id", invoice_id);

    if (updateError) {
      return {
        success: false,
        error: `Payment removed but failed to update invoice balance: ${updateError.message}`,
      };
    }

    // 5. Revalidate BOTH sides (invoice + payment pages)
    revalidatePath(`/dashboard/work/invoices/${invoice_id}`);
    revalidatePath(`/dashboard/work/payments/${payment_id}`);
    revalidatePath("/dashboard/work/invoices");
    revalidatePath("/dashboard/work/payments");
    revalidatePath("/dashboard/finance");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove payment from invoice",
    };
  }
}
