/**
 * Payment queries and mutations
 * Replaces apps/web/src/lib/queries/payments.ts and apps/web/src/actions/payments.ts
 */
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
  requireCompanyAccess,
  requirePermission,
  hasMinimumRole,
  excludeDeleted,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { paymentMethod, paymentStatus, paymentType, cardBrand } from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate payment number
 */
async function generatePaymentNumber(ctx: any, companyId: any): Promise<string> {
  const payments = await ctx.db
    .query("payments")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const nextNumber = payments.length + 1;
  return `PMT-${nextNumber.toString().padStart(5, "0")}`;
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List payments for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(paymentStatus),
    customerId: v.optional(v.id("customers")),
    invoiceId: v.optional(v.id("invoices")),
    paymentMethod: v.optional(paymentMethod),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_payments");

    let query = ctx.db
      .query("payments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = ctx.db
        .query("payments")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    if (args.customerId) {
      query = ctx.db
        .query("payments")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId!));
    }

    if (args.invoiceId) {
      query = ctx.db
        .query("payments")
        .withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId!));
    }

    let payments = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId || args.invoiceId) {
      payments = payments.filter((p) => p.companyId === args.companyId);
    }

    payments = excludeDeleted(payments);

    // Apply additional filters
    if (args.paymentMethod) {
      payments = payments.filter((p) => p.paymentMethod === args.paymentMethod);
    }

    const limit = args.limit ?? 50;
    payments = payments.slice(0, limit);

    return {
      payments,
      total: payments.length,
      hasMore: payments.length === limit,
    };
  },
});

/**
 * Get a single payment by ID
 */
export const get = query({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    await requireCompanyAccess(ctx, payment.companyId);

    if (payment.deletedAt) {
      throw new Error("Payment not found");
    }

    return payment;
  },
});

/**
 * Get payment with related data
 */
export const getComplete = query({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    await requireCompanyAccess(ctx, payment.companyId);

    const [customer, invoice, job, processedBy] = await Promise.all([
      ctx.db.get(payment.customerId),
      payment.invoiceId ? ctx.db.get(payment.invoiceId) : null,
      payment.jobId ? ctx.db.get(payment.jobId) : null,
      payment.processedBy ? ctx.db.get(payment.processedBy) : null,
    ]);

    return {
      payment,
      customer,
      invoice,
      job,
      processedBy: processedBy
        ? { _id: processedBy._id, name: processedBy.name, email: processedBy.email }
        : null,
    };
  },
});

/**
 * Get payment stats for dashboard
 */
export const getStats = query({
  args: {
    companyId: v.id("companies"),
    since: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let payments = await ctx.db
      .query("payments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (args.since) {
      payments = payments.filter((p) => p._creationTime >= args.since!);
    }

    const completed = payments.filter((p) => p.status === "completed");
    const pending = payments.filter((p) => p.status === "pending" || p.status === "processing");
    const failed = payments.filter((p) => p.status === "failed");
    const refunded = payments.filter((p) => p.status === "refunded" || p.status === "partially_refunded");

    // Group by payment method
    const byMethod: Record<string, number> = {};
    for (const p of completed) {
      byMethod[p.paymentMethod] = (byMethod[p.paymentMethod] || 0) + p.amount;
    }

    return {
      total: payments.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      refunded: refunded.length,
      totalAmount: completed.reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
      refundedAmount: refunded.reduce((sum, p) => sum + (p.refundedAmount || 0), 0),
      processorFees: completed.reduce((sum, p) => sum + (p.processorFee || 0), 0),
      netAmount: completed.reduce((sum, p) => sum + (p.netAmount || p.amount), 0),
      byMethod,
    };
  },
});

/**
 * Get recent payments
 */
export const getRecent = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("status"), "completed")
        )
      )
      .order("desc")
      .take(args.limit ?? 10);

    // Enrich with customer data
    const enriched = await Promise.all(
      payments.map(async (payment) => {
        const customer = await ctx.db.get(payment.customerId);
        return {
          ...payment,
          customer: customer
            ? { _id: customer._id, displayName: customer.displayName }
            : null,
        };
      })
    );

    return enriched;
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new payment
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    invoiceId: v.optional(v.id("invoices")),
    jobId: v.optional(v.id("jobs")),

    amount: v.number(),
    paymentMethod: paymentMethod,
    paymentType: v.optional(paymentType),

    // Card details
    cardBrand: v.optional(cardBrand),
    cardLast4: v.optional(v.string()),
    checkNumber: v.optional(v.string()),
    referenceNumber: v.optional(v.string()),

    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "process_payments");

    // Validate customer
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.companyId !== args.companyId) {
      throw new Error("Invalid customer");
    }

    // Validate invoice if provided
    if (args.invoiceId) {
      const invoice = await ctx.db.get(args.invoiceId);
      if (!invoice || invoice.companyId !== args.companyId) {
        throw new Error("Invalid invoice");
      }
      if (invoice.status === "paid" || invoice.status === "cancelled") {
        throw new Error(`Cannot add payment to ${invoice.status} invoice`);
      }
    }

    // Validate job if provided
    if (args.jobId) {
      const job = await ctx.db.get(args.jobId);
      if (!job || job.companyId !== args.companyId) {
        throw new Error("Invalid job");
      }
    }

    // Validate amount
    if (args.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const paymentNumber = await generatePaymentNumber(ctx, args.companyId);

    const paymentId = await ctx.db.insert("payments", {
      companyId: args.companyId,
      customerId: args.customerId,
      invoiceId: args.invoiceId,
      jobId: args.jobId,
      paymentNumber,
      referenceNumber: args.referenceNumber,
      amount: args.amount,
      paymentMethod: args.paymentMethod,
      paymentType: args.paymentType ?? "payment",
      cardBrand: args.cardBrand,
      cardLast4: args.cardLast4,
      checkNumber: args.checkNumber,
      status: "pending",
      receiptEmailed: false,
      isReconciled: false,
      notes: args.notes,
      customerNotes: args.customerNotes,
      processedBy: authCtx.userId,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "payment",
      entityId: paymentId,
      metadata: { paymentNumber, amount: args.amount, method: args.paymentMethod },
    });

    return paymentId;
  },
});

/**
 * Process/complete a payment
 */
export const process = mutation({
  args: {
    paymentId: v.id("payments"),
    processorTransactionId: v.optional(v.string()),
    processorFee: v.optional(v.number()),
    processorMetadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, payment.companyId);
    requirePermission(authCtx, "process_payments");

    if (payment.status !== "pending" && payment.status !== "processing") {
      throw new Error(`Cannot process ${payment.status} payment`);
    }

    const now = Date.now();
    const netAmount = args.processorFee
      ? payment.amount - args.processorFee
      : payment.amount;

    await ctx.db.patch(args.paymentId, {
      status: "completed",
      processorTransactionId: args.processorTransactionId,
      processorFee: args.processorFee,
      processorMetadata: args.processorMetadata,
      netAmount,
      processedAt: now,
      completedAt: now,
      updatedBy: authCtx.userId,
    });

    // Update invoice if linked
    if (payment.invoiceId) {
      const { internal } = await import("./_generated/api");
      await ctx.scheduler.runAfter(0, internal.invoices.recordPaymentInternal, {
        invoiceId: payment.invoiceId,
        amount: payment.amount,
      });
    }

    // Update customer metrics
    const { internal } = await import("./_generated/api");
    await ctx.scheduler.runAfter(0, internal.customers.updateMetrics, {
      customerId: payment.customerId,
    });

    await createAuditLog(ctx, {
      companyId: payment.companyId,
      userId: authCtx.userId,
      action: "process",
      entityType: "payment",
      entityId: args.paymentId,
      metadata: { transactionId: args.processorTransactionId },
    });

    return args.paymentId;
  },
});

/**
 * Mark payment as failed
 */
export const fail = mutation({
  args: {
    paymentId: v.id("payments"),
    failureCode: v.optional(v.string()),
    failureMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, payment.companyId);
    requirePermission(authCtx, "process_payments");

    if (payment.status === "completed" || payment.status === "refunded") {
      throw new Error(`Cannot mark ${payment.status} payment as failed`);
    }

    await ctx.db.patch(args.paymentId, {
      status: "failed",
      failureCode: args.failureCode,
      failureMessage: args.failureMessage,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: payment.companyId,
      userId: authCtx.userId,
      action: "fail",
      entityType: "payment",
      entityId: args.paymentId,
      metadata: { failureCode: args.failureCode, failureMessage: args.failureMessage },
    });

    return args.paymentId;
  },
});

/**
 * Refund a payment
 */
export const refund = mutation({
  args: {
    paymentId: v.id("payments"),
    amount: v.optional(v.number()), // Partial refund if specified
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, payment.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can process refunds");
    }

    if (payment.status !== "completed") {
      throw new Error("Can only refund completed payments");
    }

    const refundAmount = args.amount ?? payment.amount;
    const previousRefunded = payment.refundedAmount ?? 0;
    const maxRefundable = payment.amount - previousRefunded;

    if (refundAmount > maxRefundable) {
      throw new Error(`Maximum refundable amount is ${maxRefundable}`);
    }

    const totalRefunded = previousRefunded + refundAmount;
    const isFullRefund = totalRefunded >= payment.amount;

    await ctx.db.patch(args.paymentId, {
      status: isFullRefund ? "refunded" : "partially_refunded",
      refundedAmount: totalRefunded,
      refundReason: args.reason,
      refundedAt: Date.now(),
      updatedBy: authCtx.userId,
    });

    // Create refund payment record
    const refundPaymentNumber = await generatePaymentNumber(ctx, payment.companyId);
    await ctx.db.insert("payments", {
      companyId: payment.companyId,
      customerId: payment.customerId,
      invoiceId: payment.invoiceId,
      jobId: payment.jobId,
      paymentNumber: refundPaymentNumber,
      amount: -refundAmount, // Negative for refund
      paymentMethod: payment.paymentMethod,
      paymentType: "refund",
      status: "completed",
      originalPaymentId: args.paymentId,
      notes: args.reason,
      receiptEmailed: false,
      isReconciled: false,
      processedBy: authCtx.userId,
      processedAt: Date.now(),
      completedAt: Date.now(),
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    // Update customer metrics
    const { internal } = await import("./_generated/api");
    await ctx.scheduler.runAfter(0, internal.customers.updateMetrics, {
      customerId: payment.customerId,
    });

    await createAuditLog(ctx, {
      companyId: payment.companyId,
      userId: authCtx.userId,
      action: "refund",
      entityType: "payment",
      entityId: args.paymentId,
      metadata: { refundAmount, reason: args.reason, isFullRefund },
    });

    return args.paymentId;
  },
});

/**
 * Send receipt email
 */
export const sendReceipt = mutation({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, payment.companyId);
    requirePermission(authCtx, "process_payments");

    if (payment.status !== "completed") {
      throw new Error("Can only send receipt for completed payments");
    }

    // TODO: Trigger email via action

    await ctx.db.patch(args.paymentId, {
      receiptEmailed: true,
      receiptEmailedAt: Date.now(),
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: payment.companyId,
      userId: authCtx.userId,
      action: "send_receipt",
      entityType: "payment",
      entityId: args.paymentId,
    });

    return args.paymentId;
  },
});

/**
 * Delete a payment (soft delete)
 */
export const remove = mutation({
  args: {
    paymentId: v.id("payments"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, payment.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete payments");
    }

    if (payment.status === "completed") {
      throw new Error("Cannot delete completed payment. Use refund instead.");
    }

    await ctx.db.patch(args.paymentId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: payment.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "payment",
      entityId: args.paymentId,
      metadata: { paymentNumber: payment.paymentNumber, reason: args.reason },
    });

    return { success: true };
  },
});

// ============================================================================
// INTERNAL MUTATIONS
// ============================================================================

/**
 * Record payment from invoice (internal)
 */
export const recordFromInvoice = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // This is called internally when recording payment on invoice
    // The invoice mutation handles the actual invoice update
    return { success: true };
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.string(),
    invoiceSupabaseId: v.optional(v.string()),
    paymentNumber: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    status: v.string(),
    processedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const companyMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "companies").eq("supabaseId", args.companySupabaseId)
      )
      .unique();

    if (!companyMapping) {
      throw new Error(`Company not found: ${args.companySupabaseId}`);
    }

    const customerMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "customers").eq("supabaseId", args.customerSupabaseId)
      )
      .unique();

    if (!customerMapping) {
      throw new Error(`Customer not found: ${args.customerSupabaseId}`);
    }

    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "payments").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    let invoiceId: any = undefined;
    if (args.invoiceSupabaseId) {
      const invoiceMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "invoices").eq("supabaseId", args.invoiceSupabaseId!)
        )
        .unique();
      if (invoiceMapping) invoiceId = invoiceMapping.convexId;
    }

    const paymentId = await ctx.db.insert("payments", {
      companyId: companyMapping.convexId as any,
      customerId: customerMapping.convexId as any,
      invoiceId,
      paymentNumber: args.paymentNumber,
      amount: args.amount,
      paymentMethod: args.paymentMethod as any,
      paymentType: "payment",
      status: args.status as any,
      processedAt: args.processedAt,
      completedAt: args.status === "completed" ? args.processedAt : undefined,
      receiptEmailed: false,
      isReconciled: false,
    });

    await ctx.db.insert("migrationMappings", {
      tableName: "payments",
      supabaseId: args.supabaseId,
      convexId: paymentId,
      migratedAt: Date.now(),
    });

    return paymentId;
  },
});
