/**
 * Invoice queries and mutations
 * Replaces apps/web/src/lib/queries/invoices.ts and apps/web/src/actions/invoices.ts
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
import { invoiceStatus } from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate invoice number
 */
async function generateInvoiceNumber(ctx: any, companyId: any): Promise<string> {
  const invoices = await ctx.db
    .query("invoices")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const nextNumber = invoices.length + 1;
  return `INV-${nextNumber.toString().padStart(5, "0")}`;
}

/**
 * Calculate invoice totals from line items
 */
function calculateInvoiceTotals(
  lineItems: Array<{ quantity: number; unitPrice: number; taxable?: boolean }>,
  taxRate: number = 0,
  discountAmount: number = 0
): { subtotal: number; taxAmount: number; totalAmount: number } {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const taxableAmount = lineItems
    .filter((item) => item.taxable !== false)
    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const taxAmount = Math.round(taxableAmount * (taxRate / 100));
  const totalAmount = subtotal + taxAmount - discountAmount;

  return { subtotal, taxAmount, totalAmount };
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List invoices for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(invoiceStatus),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_payments");

    let query = ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = ctx.db
        .query("invoices")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    if (args.customerId) {
      query = ctx.db
        .query("invoices")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId!));
    }

    if (args.jobId) {
      query = ctx.db
        .query("invoices")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId!));
    }

    let invoices = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId || args.jobId) {
      invoices = invoices.filter((inv) => inv.companyId === args.companyId);
    }

    invoices = excludeDeleted(invoices);

    if (!args.includeArchived) {
      invoices = invoices.filter((inv) => !inv.archivedAt);
    }

    const limit = args.limit ?? 50;
    invoices = invoices.slice(0, limit);

    return {
      invoices,
      total: invoices.length,
      hasMore: invoices.length === limit,
    };
  },
});

/**
 * Get a single invoice by ID
 */
export const get = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    await requireCompanyAccess(ctx, invoice.companyId);

    if (invoice.deletedAt) {
      throw new Error("Invoice not found");
    }

    return invoice;
  },
});

/**
 * Get invoice with related data
 */
export const getComplete = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    await requireCompanyAccess(ctx, invoice.companyId);

    const [customer, job, payments, estimate] = await Promise.all([
      ctx.db.get(invoice.customerId),
      invoice.jobId ? ctx.db.get(invoice.jobId) : null,
      ctx.db
        .query("payments")
        .withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      invoice.estimateId ? ctx.db.get(invoice.estimateId) : null,
    ]);

    return {
      invoice,
      customer,
      job,
      payments,
      estimate,
      stats: {
        totalPayments: payments.length,
        totalPaid: payments
          .filter((p) => p.status === "completed")
          .reduce((sum, p) => sum + p.amount, 0),
      },
    };
  },
});

/**
 * Get invoice stats for dashboard
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const active = invoices.filter((inv) => !inv.archivedAt);

    return {
      total: invoices.length,
      draft: active.filter((inv) => inv.status === "draft").length,
      sent: active.filter((inv) => inv.status === "sent").length,
      viewed: active.filter((inv) => inv.status === "viewed").length,
      partial: active.filter((inv) => inv.status === "partial").length,
      paid: active.filter((inv) => inv.status === "paid").length,
      overdue: active.filter((inv) => inv.status === "overdue").length,
      cancelled: active.filter((inv) => inv.status === "cancelled").length,
      totalAmount: active.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPaid: active.reduce((sum, inv) => sum + inv.amountPaid, 0),
      totalOutstanding: active.reduce((sum, inv) => sum + inv.amountDue, 0),
    };
  },
});

/**
 * Get overdue invoices
 */
export const getOverdue = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const now = Date.now();

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company_due_date", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.neq(q.field("status"), "paid"),
          q.neq(q.field("status"), "cancelled"),
          q.lt(q.field("dueDate"), now)
        )
      )
      .take(args.limit ?? 50);

    // Enrich with customer data
    const enriched = await Promise.all(
      invoices.map(async (invoice) => {
        const customer = await ctx.db.get(invoice.customerId);
        return {
          ...invoice,
          customer: customer
            ? { _id: customer._id, displayName: customer.displayName, email: customer.email }
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
 * Create a new invoice
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    jobId: v.optional(v.id("jobs")),
    estimateId: v.optional(v.id("estimates")),
    propertyId: v.optional(v.id("properties")),

    title: v.string(),
    description: v.optional(v.string()),

    lineItems: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        quantity: v.number(),
        unitPrice: v.number(),
        taxable: v.optional(v.boolean()),
      })
    ),

    taxRate: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    paymentTerms: v.optional(v.string()),

    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_invoices");

    // Validate customer
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.companyId !== args.companyId) {
      throw new Error("Invalid customer");
    }

    // Validate job if provided
    if (args.jobId) {
      const job = await ctx.db.get(args.jobId);
      if (!job || job.companyId !== args.companyId) {
        throw new Error("Invalid job");
      }
    }

    // Validate estimate if provided
    if (args.estimateId) {
      const estimate = await ctx.db.get(args.estimateId);
      if (!estimate || estimate.companyId !== args.companyId) {
        throw new Error("Invalid estimate");
      }
    }

    // Calculate totals
    const { subtotal, taxAmount, totalAmount } = calculateInvoiceTotals(
      args.lineItems,
      args.taxRate ?? 0,
      args.discountAmount ?? 0
    );

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(ctx, args.companyId);

    // Set default due date (30 days from now if not provided)
    const dueDate = args.dueDate ?? Date.now() + 30 * 24 * 60 * 60 * 1000;

    const invoiceId = await ctx.db.insert("invoices", {
      companyId: args.companyId,
      customerId: args.customerId,
      jobId: args.jobId,
      estimateId: args.estimateId,
      propertyId: args.propertyId,
      invoiceNumber,
      title: args.title.trim(),
      description: args.description?.trim(),
      status: "draft",
      lineItems: args.lineItems,
      subtotal,
      taxRate: args.taxRate ?? 0,
      taxAmount,
      discountAmount: args.discountAmount ?? 0,
      totalAmount,
      amountPaid: 0,
      amountDue: totalAmount,
      dueDate,
      paymentTerms: args.paymentTerms,
      terms: args.terms,
      notes: args.notes,
      internalNotes: args.internalNotes,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "invoice",
      entityId: invoiceId,
      metadata: { invoiceNumber, totalAmount },
    });

    return invoiceId;
  },
});

/**
 * Update an invoice
 */
export const update = mutation({
  args: {
    invoiceId: v.id("invoices"),

    title: v.optional(v.string()),
    description: v.optional(v.string()),
    lineItems: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.optional(v.string()),
          quantity: v.number(),
          unitPrice: v.number(),
          taxable: v.optional(v.boolean()),
        })
      )
    ),
    taxRate: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    paymentTerms: v.optional(v.string()),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { invoiceId, ...updates } = args;

    const invoice = await ctx.db.get(invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const authCtx = await requireCompanyAccess(ctx, invoice.companyId);
    requirePermission(authCtx, "create_invoices");

    if (invoice.deletedAt) {
      throw new Error("Cannot update deleted invoice");
    }

    // Cannot edit paid/cancelled invoices
    if (invoice.status === "paid" || invoice.status === "cancelled") {
      throw new Error(`Cannot update ${invoice.status} invoice`);
    }

    const changes = trackChanges(invoice, updates);

    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    // Recalculate totals if line items or tax changed
    if (updates.lineItems || updates.taxRate !== undefined || updates.discountAmount !== undefined) {
      const lineItems = updates.lineItems ?? invoice.lineItems;
      const taxRate = updates.taxRate ?? invoice.taxRate ?? 0;
      const discountAmount = updates.discountAmount ?? invoice.discountAmount;

      const { subtotal, taxAmount, totalAmount } = calculateInvoiceTotals(
        lineItems,
        taxRate,
        discountAmount
      );

      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.totalAmount = totalAmount;
      updateData.amountDue = totalAmount - invoice.amountPaid;
    }

    await ctx.db.patch(invoiceId, updateData);

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: invoice.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "invoice",
        entityId: invoiceId,
        changes,
      });
    }

    return invoiceId;
  },
});

/**
 * Send an invoice
 */
export const send = mutation({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const authCtx = await requireCompanyAccess(ctx, invoice.companyId);
    requirePermission(authCtx, "create_invoices");

    if (invoice.status !== "draft") {
      throw new Error("Only draft invoices can be sent");
    }

    await ctx.db.patch(args.invoiceId, {
      status: "sent",
      sentAt: Date.now(),
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: invoice.companyId,
      userId: authCtx.userId,
      action: "send",
      entityType: "invoice",
      entityId: args.invoiceId,
    });

    // TODO: Trigger email notification via action

    return args.invoiceId;
  },
});

/**
 * Mark invoice as viewed
 */
export const markViewed = mutation({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Only update if sent and not already viewed
    if (invoice.status === "sent" && !invoice.viewedAt) {
      await ctx.db.patch(args.invoiceId, {
        status: "viewed",
        viewedAt: Date.now(),
      });
    }

    return args.invoiceId;
  },
});

/**
 * Record a payment on an invoice
 */
export const recordPayment = mutation({
  args: {
    invoiceId: v.id("invoices"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const authCtx = await requireCompanyAccess(ctx, invoice.companyId);
    requirePermission(authCtx, "process_payments");

    if (invoice.status === "paid" || invoice.status === "cancelled") {
      throw new Error(`Cannot record payment on ${invoice.status} invoice`);
    }

    const newAmountPaid = invoice.amountPaid + args.amount;
    const newAmountDue = invoice.totalAmount - newAmountPaid;

    const updateData: Record<string, unknown> = {
      amountPaid: newAmountPaid,
      amountDue: Math.max(0, newAmountDue),
      updatedBy: authCtx.userId,
    };

    if (newAmountDue <= 0) {
      updateData.status = "paid";
      updateData.paidAt = Date.now();
    } else if (newAmountPaid > 0) {
      updateData.status = "partial";
    }

    await ctx.db.patch(args.invoiceId, updateData);

    // Update customer metrics
    const { internal } = await import("./_generated/api");
    await ctx.scheduler.runAfter(0, internal.customers.updateMetrics, {
      customerId: invoice.customerId,
    });

    await createAuditLog(ctx, {
      companyId: invoice.companyId,
      userId: authCtx.userId,
      action: "record_payment",
      entityType: "invoice",
      entityId: args.invoiceId,
      metadata: { amount: args.amount, newAmountPaid, newAmountDue },
    });

    return args.invoiceId;
  },
});

/**
 * Internal mutation to record a payment on an invoice (for scheduler use)
 */
export const recordPaymentInternal = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    if (invoice.status === "paid" || invoice.status === "cancelled") {
      // Silently ignore - payment already processed
      return args.invoiceId;
    }

    const newAmountPaid = invoice.amountPaid + args.amount;
    const newAmountDue = invoice.totalAmount - newAmountPaid;

    const updateData: Record<string, unknown> = {
      amountPaid: newAmountPaid,
      amountDue: Math.max(0, newAmountDue),
    };

    if (newAmountDue <= 0) {
      updateData.status = "paid";
      updateData.paidAt = Date.now();
    } else if (newAmountPaid > 0) {
      updateData.status = "partial";
    }

    await ctx.db.patch(args.invoiceId, updateData);

    return args.invoiceId;
  },
});

/**
 * Cancel an invoice
 */
export const cancel = mutation({
  args: {
    invoiceId: v.id("invoices"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const authCtx = await requireCompanyAccess(ctx, invoice.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can cancel invoices");
    }

    if (invoice.status === "paid") {
      throw new Error("Cannot cancel a paid invoice");
    }

    if (invoice.status === "cancelled") {
      throw new Error("Invoice is already cancelled");
    }

    await ctx.db.patch(args.invoiceId, {
      status: "cancelled",
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: invoice.companyId,
      userId: authCtx.userId,
      action: "cancel",
      entityType: "invoice",
      entityId: args.invoiceId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Delete an invoice (soft delete)
 */
export const remove = mutation({
  args: {
    invoiceId: v.id("invoices"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const authCtx = await requireCompanyAccess(ctx, invoice.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete invoices");
    }

    if (invoice.status === "paid") {
      throw new Error("Cannot delete a paid invoice");
    }

    // Check for linked payments
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("status"), "completed")
        )
      )
      .take(1);

    if (payments.length > 0) {
      throw new Error("Cannot delete invoice with recorded payments");
    }

    await ctx.db.patch(args.invoiceId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: invoice.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "invoice",
      entityId: args.invoiceId,
      metadata: { invoiceNumber: invoice.invoiceNumber, reason: args.reason },
    });

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
    jobSupabaseId: v.optional(v.string()),
    invoiceNumber: v.string(),
    title: v.string(),
    status: v.string(),
    lineItems: v.array(v.any()),
    subtotal: v.number(),
    taxAmount: v.number(),
    totalAmount: v.number(),
    amountPaid: v.number(),
    dueDate: v.optional(v.number()),
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
        q.eq("tableName", "invoices").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    let jobId: any = undefined;
    if (args.jobSupabaseId) {
      const jobMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "jobs").eq("supabaseId", args.jobSupabaseId!)
        )
        .unique();
      if (jobMapping) jobId = jobMapping.convexId;
    }

    const invoiceId = await ctx.db.insert("invoices", {
      companyId: companyMapping.convexId as any,
      customerId: customerMapping.convexId as any,
      jobId,
      invoiceNumber: args.invoiceNumber,
      title: args.title,
      status: args.status as any,
      lineItems: args.lineItems,
      subtotal: args.subtotal,
      taxRate: 0,
      taxAmount: args.taxAmount,
      discountAmount: 0,
      totalAmount: args.totalAmount,
      amountPaid: args.amountPaid,
      amountDue: args.totalAmount - args.amountPaid,
      dueDate: args.dueDate,
    });

    await ctx.db.insert("migrationMappings", {
      tableName: "invoices",
      supabaseId: args.supabaseId,
      convexId: invoiceId,
      migratedAt: Date.now(),
    });

    return invoiceId;
  },
});
