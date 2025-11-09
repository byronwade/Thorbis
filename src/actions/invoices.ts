/**
 * Invoices Server Actions
 *
 * Handles invoice management with CRUD operations, payment tracking,
 * customer interactions, and payment status management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionError,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "@/lib/errors/action-error";
import {
  type ActionResult,
  assertAuthenticated,
  assertExists,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// Validation Schemas
const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Price must be positive"),
  total: z.number().min(0, "Total must be positive"),
});

const createInvoiceSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
  jobId: z.string().uuid("Invalid job ID").optional(),
  title: z.string().min(1, "Invoice title is required"),
  description: z.string().optional(),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
  taxRate: z.number().min(0).max(100).default(0),
  discountAmount: z.number().min(0).default(0),
  dueDays: z.number().min(0).default(30),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

const updateInvoiceSchema = z.object({
  title: z.string().min(1, "Invoice title is required").optional(),
  description: z.string().optional(),
  lineItems: z.array(lineItemSchema).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  dueDays: z.number().min(0).optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

const recordPaymentSchema = z.object({
  amount: z.number().min(0.01, "Payment amount must be greater than 0"),
  method: z.enum(["cash", "check", "card", "bank_transfer", "other"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Generate unique invoice number
 */
async function generateInvoiceNumber(
  supabase: any,
  companyId: string
): Promise<string> {
  const { data: latestInvoice } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!latestInvoice) {
    return `INV-${new Date().getFullYear()}-001`;
  }

  const match = latestInvoice.invoice_number.match(/INV-\d{4}-(\d+)/);
  if (match) {
    const nextNumber = Number.parseInt(match[1]) + 1;
    return `INV-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, "0")}`;
  }

  return `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
}

/**
 * Calculate invoice totals
 */
function calculateTotals(
  lineItems: any[],
  taxRate: number,
  discountAmount: number
) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const totalAmount = subtotal + taxAmount - discountAmount;

  return {
    subtotal: Math.round(subtotal * 100), // Convert to cents
    taxAmount: Math.round(taxAmount * 100),
    discountAmount: Math.round(discountAmount * 100),
    totalAmount: Math.round(totalAmount * 100),
  };
}

/**
 * Create a new invoice
 */
export async function createInvoice(
  formData: FormData
): Promise<ActionResult<string>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Parse line items from JSON
    const lineItemsJson = formData.get("lineItems") as string;
    const lineItems = lineItemsJson ? JSON.parse(lineItemsJson) : [];

    const data = createInvoiceSchema.parse({
      customerId: formData.get("customerId"),
      jobId: formData.get("jobId") || undefined,
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      lineItems,
      taxRate: formData.get("taxRate")
        ? Number.parseFloat(formData.get("taxRate") as string)
        : 0,
      discountAmount: formData.get("discountAmount")
        ? Number.parseFloat(formData.get("discountAmount") as string)
        : 0,
      dueDays: formData.get("dueDays")
        ? Number.parseInt(formData.get("dueDays") as string)
        : 30,
      terms: formData.get("terms") || undefined,
      notes: formData.get("notes") || undefined,
    });

    // Calculate totals
    const totals = calculateTotals(
      data.lineItems,
      data.taxRate,
      data.discountAmount
    );

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + data.dueDays);

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(
      supabase,
      teamMember.company_id
    );

    // Create invoice
    const { data: newInvoice, error: createError } = await supabase
      .from("invoices")
      .insert({
        company_id: teamMember.company_id,
        customer_id: data.customerId,
        job_id: data.jobId,
        invoice_number: invoiceNumber,
        title: data.title,
        description: data.description,
        status: "draft",
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        discount_amount: totals.discountAmount,
        total_amount: totals.totalAmount,
        paid_amount: 0,
        balance_amount: totals.totalAmount,
        due_date: dueDate.toISOString(),
        line_items: data.lineItems,
        terms: data.terms,
        notes: data.notes,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create invoice"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath("/dashboard/finance/invoices");
    return newInvoice.id;
  });
}

/**
 * Update an invoice
 */
export async function updateInvoice(
  invoiceId: string,
  formData: FormData
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify invoice belongs to company
    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("company_id, status")
      .eq("id", invoiceId)
      .single();

    assertExists(existingInvoice, "Invoice");

    if (existingInvoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Only draft invoices can be edited
    if (existingInvoice.status !== "draft") {
      throw new ActionError(
        "Only draft invoices can be edited",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Parse line items if provided
    const lineItemsJson = formData.get("lineItems") as string;
    const lineItems = lineItemsJson ? JSON.parse(lineItemsJson) : undefined;

    const data = updateInvoiceSchema.parse({
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      lineItems,
      taxRate: formData.get("taxRate")
        ? Number.parseFloat(formData.get("taxRate") as string)
        : undefined,
      discountAmount: formData.get("discountAmount")
        ? Number.parseFloat(formData.get("discountAmount") as string)
        : undefined,
      dueDays: formData.get("dueDays")
        ? Number.parseInt(formData.get("dueDays") as string)
        : undefined,
      terms: formData.get("terms") || undefined,
      notes: formData.get("notes") || undefined,
    });

    // Prepare update data
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.terms !== undefined) updateData.terms = data.terms;
    if (data.notes !== undefined) updateData.notes = data.notes;

    // Recalculate totals if line items changed
    if (data.lineItems) {
      const taxRate = data.taxRate ?? 0;
      const discountAmount = data.discountAmount ?? 0;
      const totals = calculateTotals(data.lineItems, taxRate, discountAmount);

      updateData.line_items = data.lineItems;
      updateData.subtotal = totals.subtotal;
      updateData.tax_amount = totals.taxAmount;
      updateData.discount_amount = totals.discountAmount;
      updateData.total_amount = totals.totalAmount;
      updateData.balance_amount = totals.totalAmount; // Reset balance on edit
    }

    // Update due date if dueDays changed
    if (data.dueDays !== undefined) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + data.dueDays);
      updateData.due_date = dueDate.toISOString();
    }

    // Update invoice
    const { error: updateError } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", invoiceId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update invoice"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
  });
}

/**
 * Send invoice to customer
 */
export async function sendInvoice(
  invoiceId: string
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify invoice belongs to company
    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("company_id, status, customer_id")
      .eq("id", invoiceId)
      .single();

    assertExists(existingInvoice, "Invoice");

    if (existingInvoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Can only send draft invoices
    if (existingInvoice.status !== "draft") {
      throw new ActionError(
        "Invoice has already been sent",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // TODO: Send email to customer with invoice PDF
    // await sendInvoiceEmail(invoiceId, existingInvoice.customer_id);

    // Update status to sent
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("send invoice"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
  });
}

/**
 * Mark invoice as viewed (customer opened it)
 */
export async function markInvoiceViewed(
  invoiceId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // This can be called publicly by customer, so no auth check
    const { data: invoice } = await supabase
      .from("invoices")
      .select("status, viewed_at")
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    // Only mark as viewed if sent and not already viewed
    if (invoice.status === "sent" && !invoice.viewed_at) {
      const { error: updateError } = await supabase
        .from("invoices")
        .update({
          status: "viewed",
          viewed_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      if (updateError) {
        throw new ActionError(
          ERROR_MESSAGES.operationFailed("mark invoice as viewed"),
          ERROR_CODES.DB_QUERY_ERROR
        );
      }
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
  });
}

/**
 * Record a payment for an invoice
 */
export async function recordPayment(
  invoiceId: string,
  formData: FormData
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const data = recordPaymentSchema.parse({
      amount: formData.get("amount")
        ? Number.parseFloat(formData.get("amount") as string)
        : 0,
      method: formData.get("method"),
      reference: formData.get("reference") || undefined,
      notes: formData.get("notes") || undefined,
    });

    // Get invoice
    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, total_amount, paid_amount, balance_amount, status")
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    if (invoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Cannot record payment on cancelled invoices
    if (invoice.status === "cancelled") {
      throw new ActionError(
        "Cannot record payment on cancelled invoices",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Convert payment amount to cents
    const paymentAmountCents = Math.round(data.amount * 100);

    // Validate payment amount
    if (paymentAmountCents > invoice.balance_amount) {
      throw new ActionError(
        "Payment amount exceeds remaining balance",
        ERROR_CODES.PAYMENT_INVALID_AMOUNT
      );
    }

    // Calculate new amounts
    const newPaidAmount = invoice.paid_amount + paymentAmountCents;
    const newBalanceAmount = invoice.total_amount - newPaidAmount;

    // Determine new status
    let newStatus = invoice.status;
    if (newBalanceAmount === 0) {
      newStatus = "paid";
    } else if (newPaidAmount > 0 && newBalanceAmount > 0) {
      newStatus = "partial";
    }

    // Update invoice
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        paid_amount: newPaidAmount,
        balance_amount: newBalanceAmount,
        status: newStatus,
        paid_at: newBalanceAmount === 0 ? new Date().toISOString() : null,
      })
      .eq("id", invoiceId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("record payment"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // TODO: Create payment record in payments table
    // await supabase.from("payments").insert({
    //   invoice_id: invoiceId,
    //   amount: paymentAmountCents,
    //   method: data.method,
    //   reference: data.reference,
    //   notes: data.notes,
    // });

    revalidatePath("/dashboard/work/invoices");
    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
    revalidatePath("/dashboard/finance");
  });
}

/**
 * Mark invoice as overdue (automated or manual)
 */
export async function markInvoiceOverdue(
  invoiceId: string
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Get invoice
    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, status, due_date, balance_amount")
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    if (invoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Only sent, viewed, or partial invoices can be marked overdue
    if (!["sent", "viewed", "partial"].includes(invoice.status)) {
      throw new ActionError(
        "Invoice cannot be marked as overdue",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Verify invoice is actually overdue
    const dueDate = new Date(invoice.due_date);
    if (dueDate > new Date()) {
      throw new ActionError(
        "Invoice is not yet due",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Update status to overdue
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ status: "overdue" })
      .eq("id", invoiceId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("mark invoice as overdue"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
  });
}

/**
 * Cancel invoice
 */
export async function cancelInvoice(
  invoiceId: string,
  reason?: string
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Get invoice
    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, status, paid_amount, notes")
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    if (invoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Cannot cancel paid invoices
    if (invoice.status === "paid") {
      throw new ActionError(
        "Cannot cancel paid invoices. Please issue a refund instead",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Cannot cancel if partially paid without explicit reason
    if (invoice.paid_amount > 0 && !reason) {
      throw new ActionError(
        "Cancellation reason is required for partially paid invoices",
        ERROR_CODES.VALIDATION_REQUIRED_FIELD
      );
    }

    // Add cancellation reason to notes
    const updatedNotes = reason
      ? `${invoice.notes || ""}\n\n[CANCELLED]: ${reason}`.trim()
      : invoice.notes;

    // Cancel invoice
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "cancelled",
        notes: updatedNotes,
      })
      .eq("id", invoiceId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("cancel invoice"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
  });
}

/**
 * Archive invoice (soft delete)
 *
 * Replaces deleteInvoice - now archives instead of permanently deleting.
 * Archived invoices can be restored within 90 days.
 */
export async function archiveInvoice(
  invoiceId: string
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify invoice belongs to company
    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, status")
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    if (invoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Cannot archive paid invoices (business rule)
    if (invoice.status === "paid") {
      throw new ActionError(
        "Cannot archive paid invoices. Paid invoices must be retained for records.",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Archive invoice (soft delete)
    const now = new Date().toISOString();
    const scheduledDeletion = new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ).toISOString(); // 90 days from now

    const { error: archiveError } = await supabase
      .from("invoices")
      .update({
        deleted_at: now,
        deleted_by: user.id,
        archived_at: now,
        permanent_delete_scheduled_at: scheduledDeletion,
        status: "archived",
      })
      .eq("id", invoiceId);

    if (archiveError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("archive invoice"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath("/dashboard/settings/archive");
  });
}

/**
 * Restore archived invoice
 *
 * Restores an archived invoice back to its previous status (draft/sent/viewed/etc.)
 */
export async function restoreInvoice(
  invoiceId: string
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify invoice belongs to company and is archived
    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id, deleted_at, status")
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    if (invoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (!invoice.deleted_at) {
      throw new ActionError(
        "Invoice is not archived",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Restore invoice
    const { error: restoreError } = await supabase
      .from("invoices")
      .update({
        deleted_at: null,
        deleted_by: null,
        archived_at: null,
        permanent_delete_scheduled_at: null,
        status: invoice.status === "archived" ? "draft" : invoice.status, // Restore to draft if was archived
      })
      .eq("id", invoiceId);

    if (restoreError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("restore invoice"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/invoices");
    revalidatePath("/dashboard/settings/archive");
  });
}

/**
 * Delete invoice (legacy - deprecated, use archiveInvoice instead)
 * @deprecated Use archiveInvoice() instead
 */
export async function deleteInvoice(
  invoiceId: string
): Promise<ActionResult<void>> {
  // Redirect to archive function
  return archiveInvoice(invoiceId);
}

/**
 * Update Invoice Content (TipTap JSON)
 *
 * Saves the TipTap editor content for the invoice
 */
export async function updateInvoiceContent(
  invoiceId: string,
  content: any
): Promise<ActionResult<void>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify invoice belongs to company
    const { data: invoice } = await supabase
      .from("invoices")
      .select("company_id")
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    if (invoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Update invoice content
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        page_content: content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update invoice content"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/work/invoices/${invoiceId}`);
  });
}

/**
 * Generate Invoice PDF
 *
 * Generates a PDF from the invoice TipTap content
 * Returns a URL to the generated PDF
 */
export async function generateInvoicePDF(
  invoiceId: string
): Promise<ActionResult<{ pdfUrl: string; invoice: any }>> {
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
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Get full invoice data with relations
    const { data: invoice } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          email,
          phone,
          billing_address,
          billing_city,
          billing_state,
          billing_zip
        ),
        company:companies!company_id(
          id,
          name,
          email,
          phone,
          website,
          tax_id
        )
      `
      )
      .eq("id", invoiceId)
      .single();

    assertExists(invoice, "Invoice");

    if (invoice.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("invoice"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // TODO: Generate PDF using @react-pdf/renderer
    // This would convert the page_content JSON to PDF
    // For now, return a placeholder

    return {
      success: true,
      pdfUrl: `/api/invoices/${invoiceId}/pdf`,
      invoice,
    };
  });
}
