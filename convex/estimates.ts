/**
 * Estimate queries and mutations
 * Replaces apps/web/src/lib/queries/estimates.ts and apps/web/src/actions/estimates.ts
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
import { estimateStatus } from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate estimate number
 */
async function generateEstimateNumber(ctx: any, companyId: any): Promise<string> {
  const estimates = await ctx.db
    .query("estimates")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const nextNumber = estimates.length + 1;
  return `EST-${nextNumber.toString().padStart(5, "0")}`;
}

/**
 * Calculate estimate totals from line items
 */
function calculateEstimateTotals(
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
 * List estimates for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(estimateStatus),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_estimates");

    let query = ctx.db
      .query("estimates")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = ctx.db
        .query("estimates")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    if (args.customerId) {
      query = ctx.db
        .query("estimates")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId));
    }

    if (args.jobId) {
      query = ctx.db
        .query("estimates")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId));
    }

    let estimates = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId || args.jobId) {
      estimates = estimates.filter((est) => est.companyId === args.companyId);
    }

    estimates = excludeDeleted(estimates);

    if (!args.includeArchived) {
      estimates = estimates.filter((est) => !est.archivedAt);
    }

    const limit = args.limit ?? 50;
    estimates = estimates.slice(0, limit);

    return {
      estimates,
      total: estimates.length,
      hasMore: estimates.length === limit,
    };
  },
});

/**
 * Get a single estimate by ID
 */
export const get = query({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    await requireCompanyAccess(ctx, estimate.companyId);

    if (estimate.deletedAt) {
      throw new Error("Estimate not found");
    }

    return estimate;
  },
});

/**
 * Get estimate with related data
 */
export const getComplete = query({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    await requireCompanyAccess(ctx, estimate.companyId);

    const [customer, job, property, invoice] = await Promise.all([
      estimate.customerId ? ctx.db.get(estimate.customerId) : null,
      estimate.jobId ? ctx.db.get(estimate.jobId) : null,
      estimate.propertyId ? ctx.db.get(estimate.propertyId) : null,
      // Check if an invoice was created from this estimate
      ctx.db
        .query("invoices")
        .withIndex("by_company", (q) => q.eq("companyId", estimate.companyId))
        .filter((q) =>
          q.and(
            q.eq(q.field("deletedAt"), undefined),
            q.eq(q.field("estimateId"), args.estimateId)
          )
        )
        .first(),
    ]);

    return {
      estimate,
      customer,
      job,
      property,
      invoice,
      isConverted: !!invoice,
    };
  },
});

/**
 * Get estimate stats for dashboard
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const estimates = await ctx.db
      .query("estimates")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const active = estimates.filter((est) => !est.archivedAt);
    const now = Date.now();

    return {
      total: estimates.length,
      draft: active.filter((est) => est.status === "draft").length,
      sent: active.filter((est) => est.status === "sent").length,
      viewed: active.filter((est) => est.status === "viewed").length,
      accepted: active.filter((est) => est.status === "accepted").length,
      declined: active.filter((est) => est.status === "declined").length,
      expired: active.filter((est) => est.status === "expired").length,
      totalValue: active.reduce((sum, est) => sum + est.totalAmount, 0),
      acceptedValue: active
        .filter((est) => est.status === "accepted")
        .reduce((sum, est) => sum + est.totalAmount, 0),
      conversionRate:
        active.length > 0
          ? Math.round(
              (active.filter((est) => est.status === "accepted").length /
                active.filter((est) =>
                  ["accepted", "declined", "expired"].includes(est.status)
                ).length) *
                100
            ) || 0
          : 0,
      pendingCount: active.filter((est) =>
        ["sent", "viewed"].includes(est.status)
      ).length,
      expiringWithin7Days: active.filter(
        (est) =>
          ["sent", "viewed"].includes(est.status) &&
          est.validUntil &&
          est.validUntil > now &&
          est.validUntil < now + 7 * 24 * 60 * 60 * 1000
      ).length,
    };
  },
});

/**
 * Search estimates
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const estimates = await ctx.db
      .query("estimates")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();
    const filtered = estimates.filter(
      (est) =>
        est.estimateNumber.toLowerCase().includes(searchLower) ||
        est.title.toLowerCase().includes(searchLower) ||
        est.description?.toLowerCase().includes(searchLower)
    );

    const limit = args.limit ?? 20;
    return filtered.slice(0, limit);
  },
});

/**
 * Get pending estimates (sent/viewed but not accepted/declined/expired)
 */
export const getPending = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const estimates = await ctx.db
      .query("estimates")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("archivedAt"), undefined),
          q.or(
            q.eq(q.field("status"), "sent"),
            q.eq(q.field("status"), "viewed")
          )
        )
      )
      .take(args.limit ?? 50);

    // Enrich with customer data
    const enriched = await Promise.all(
      estimates.map(async (estimate) => {
        const customer = estimate.customerId
          ? await ctx.db.get(estimate.customerId)
          : null;
        return {
          ...estimate,
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
 * Create a new estimate
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.optional(v.id("customers")),
    propertyId: v.optional(v.id("properties")),
    jobId: v.optional(v.id("jobs")),

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
    validUntil: v.optional(v.number()),

    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_estimates");

    // Validate customer if provided
    if (args.customerId) {
      const customer = await ctx.db.get(args.customerId);
      if (!customer || customer.companyId !== args.companyId) {
        throw new Error("Invalid customer");
      }
    }

    // Validate job if provided
    if (args.jobId) {
      const job = await ctx.db.get(args.jobId);
      if (!job || job.companyId !== args.companyId) {
        throw new Error("Invalid job");
      }
    }

    // Validate property if provided
    if (args.propertyId) {
      const property = await ctx.db.get(args.propertyId);
      if (!property || property.companyId !== args.companyId) {
        throw new Error("Invalid property");
      }
    }

    // Calculate totals
    const { subtotal, taxAmount, totalAmount } = calculateEstimateTotals(
      args.lineItems,
      args.taxRate ?? 0,
      args.discountAmount ?? 0
    );

    // Generate estimate number
    const estimateNumber = await generateEstimateNumber(ctx, args.companyId);

    // Set default validity (30 days from now if not provided)
    const validUntil = args.validUntil ?? Date.now() + 30 * 24 * 60 * 60 * 1000;

    const estimateId = await ctx.db.insert("estimates", {
      companyId: args.companyId,
      customerId: args.customerId,
      propertyId: args.propertyId,
      jobId: args.jobId,
      estimateNumber,
      title: args.title.trim(),
      description: args.description?.trim(),
      status: "draft",
      lineItems: args.lineItems,
      subtotal,
      taxRate: args.taxRate ?? 0,
      taxAmount,
      discountAmount: args.discountAmount ?? 0,
      totalAmount,
      validUntil,
      terms: args.terms,
      notes: args.notes,
      internalNotes: args.internalNotes,
      customFields: args.customFields,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "estimate",
      entityId: estimateId,
      metadata: { estimateNumber, totalAmount },
    });

    return estimateId;
  },
});

/**
 * Update an estimate
 */
export const update = mutation({
  args: {
    estimateId: v.id("estimates"),

    title: v.optional(v.string()),
    description: v.optional(v.string()),
    customerId: v.optional(v.id("customers")),
    propertyId: v.optional(v.id("properties")),
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
    validUntil: v.optional(v.number()),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { estimateId, ...updates } = args;

    const estimate = await ctx.db.get(estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);
    requirePermission(authCtx, "create_estimates");

    if (estimate.deletedAt) {
      throw new Error("Cannot update deleted estimate");
    }

    // Cannot edit accepted/declined estimates
    if (["accepted", "declined"].includes(estimate.status)) {
      throw new Error(`Cannot update ${estimate.status} estimate`);
    }

    // Validate customer if being updated
    if (updates.customerId) {
      const customer = await ctx.db.get(updates.customerId);
      if (!customer || customer.companyId !== estimate.companyId) {
        throw new Error("Invalid customer");
      }
    }

    const changes = trackChanges(estimate, updates);

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
    if (
      updates.lineItems ||
      updates.taxRate !== undefined ||
      updates.discountAmount !== undefined
    ) {
      const lineItems = updates.lineItems ?? estimate.lineItems;
      const taxRate = updates.taxRate ?? estimate.taxRate ?? 0;
      const discountAmount = updates.discountAmount ?? estimate.discountAmount;

      const { subtotal, taxAmount, totalAmount } = calculateEstimateTotals(
        lineItems,
        taxRate,
        discountAmount
      );

      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.totalAmount = totalAmount;
    }

    await ctx.db.patch(estimateId, updateData);

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: estimate.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "estimate",
        entityId: estimateId,
        changes,
      });
    }

    return estimateId;
  },
});

/**
 * Send an estimate to customer
 */
export const send = mutation({
  args: {
    estimateId: v.id("estimates"),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);
    requirePermission(authCtx, "create_estimates");

    if (estimate.status !== "draft") {
      throw new Error("Only draft estimates can be sent");
    }

    if (!estimate.customerId) {
      throw new Error("Estimate must have a customer before sending");
    }

    await ctx.db.patch(args.estimateId, {
      status: "sent",
      sentAt: Date.now(),
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: authCtx.userId,
      action: "send",
      entityType: "estimate",
      entityId: args.estimateId,
    });

    // TODO: Trigger email notification via action

    return args.estimateId;
  },
});

/**
 * Mark estimate as viewed
 */
export const markViewed = mutation({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    // Only update if sent and not already viewed
    if (estimate.status === "sent" && !estimate.viewedAt) {
      await ctx.db.patch(args.estimateId, {
        status: "viewed",
        viewedAt: Date.now(),
      });
    }

    return args.estimateId;
  },
});

/**
 * Accept an estimate
 */
export const accept = mutation({
  args: {
    estimateId: v.id("estimates"),
    signature: v.optional(v.string()),
    acceptedByName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    // Accepting doesn't require full company access (customer can accept)
    if (!["sent", "viewed"].includes(estimate.status)) {
      throw new Error("Estimate cannot be accepted in current status");
    }

    // Check if expired
    if (estimate.validUntil && estimate.validUntil < Date.now()) {
      throw new Error("Estimate has expired");
    }

    await ctx.db.patch(args.estimateId, {
      status: "accepted",
      acceptedAt: Date.now(),
      customFields: {
        ...estimate.customFields,
        acceptedSignature: args.signature,
        acceptedByName: args.acceptedByName,
      },
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: undefined, // May be customer accepting
      action: "accept",
      entityType: "estimate",
      entityId: args.estimateId,
      metadata: { acceptedByName: args.acceptedByName },
    });

    return args.estimateId;
  },
});

/**
 * Decline an estimate
 */
export const decline = mutation({
  args: {
    estimateId: v.id("estimates"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    if (!["sent", "viewed"].includes(estimate.status)) {
      throw new Error("Estimate cannot be declined in current status");
    }

    await ctx.db.patch(args.estimateId, {
      status: "declined",
      declinedAt: Date.now(),
      declineReason: args.reason,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: undefined,
      action: "decline",
      entityType: "estimate",
      entityId: args.estimateId,
      metadata: { reason: args.reason },
    });

    return args.estimateId;
  },
});

/**
 * Mark estimate as expired
 */
export const expire = mutation({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);

    if (!["sent", "viewed"].includes(estimate.status)) {
      throw new Error("Only pending estimates can be expired");
    }

    await ctx.db.patch(args.estimateId, {
      status: "expired",
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: authCtx.userId,
      action: "expire",
      entityType: "estimate",
      entityId: args.estimateId,
    });

    return args.estimateId;
  },
});

/**
 * Convert estimate to invoice
 */
export const convertToInvoice = mutation({
  args: {
    estimateId: v.id("estimates"),
    dueDate: v.optional(v.number()),
    paymentTerms: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);
    requirePermission(authCtx, "create_invoices");

    if (estimate.status !== "accepted") {
      throw new Error("Only accepted estimates can be converted to invoices");
    }

    if (!estimate.customerId) {
      throw new Error("Estimate must have a customer to convert to invoice");
    }

    // Check if already converted
    const existingInvoice = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", estimate.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("estimateId"), args.estimateId)
        )
      )
      .first();

    if (existingInvoice) {
      throw new Error("Estimate has already been converted to an invoice");
    }

    // Generate invoice number
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", estimate.companyId))
      .collect();
    const invoiceNumber = `INV-${(invoices.length + 1).toString().padStart(5, "0")}`;

    // Set default due date (30 days from now if not provided)
    const dueDate = args.dueDate ?? Date.now() + 30 * 24 * 60 * 60 * 1000;

    const invoiceId = await ctx.db.insert("invoices", {
      companyId: estimate.companyId,
      customerId: estimate.customerId,
      propertyId: estimate.propertyId,
      jobId: estimate.jobId,
      estimateId: args.estimateId,
      invoiceNumber,
      title: estimate.title,
      description: estimate.description,
      status: "draft",
      lineItems: estimate.lineItems,
      subtotal: estimate.subtotal,
      taxRate: estimate.taxRate ?? 0,
      taxAmount: estimate.taxAmount,
      discountAmount: estimate.discountAmount,
      totalAmount: estimate.totalAmount,
      amountPaid: 0,
      amountDue: estimate.totalAmount,
      dueDate,
      paymentTerms: args.paymentTerms,
      terms: estimate.terms,
      notes: estimate.notes,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: authCtx.userId,
      action: "convert_to_invoice",
      entityType: "estimate",
      entityId: args.estimateId,
      metadata: { invoiceId, invoiceNumber },
    });

    return invoiceId;
  },
});

/**
 * Archive an estimate
 */
export const archive = mutation({
  args: {
    estimateId: v.id("estimates"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);
    requirePermission(authCtx, "create_estimates");

    if (estimate.archivedAt) {
      throw new Error("Estimate is already archived");
    }

    await ctx.db.patch(args.estimateId, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: authCtx.userId,
      action: "archive",
      entityType: "estimate",
      entityId: args.estimateId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Unarchive an estimate
 */
export const unarchive = mutation({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);
    requirePermission(authCtx, "create_estimates");

    if (!estimate.archivedAt) {
      throw new Error("Estimate is not archived");
    }

    await ctx.db.patch(args.estimateId, {
      archivedAt: undefined,
      archivedBy: undefined,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: authCtx.userId,
      action: "unarchive",
      entityType: "estimate",
      entityId: args.estimateId,
    });

    return { success: true };
  },
});

/**
 * Delete an estimate (soft delete)
 */
export const remove = mutation({
  args: {
    estimateId: v.id("estimates"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete estimates");
    }

    // Check for linked invoice
    const linkedInvoice = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", estimate.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("estimateId"), args.estimateId)
        )
      )
      .first();

    if (linkedInvoice) {
      throw new Error("Cannot delete estimate with linked invoice");
    }

    await ctx.db.patch(args.estimateId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "estimate",
      entityId: args.estimateId,
      metadata: { estimateNumber: estimate.estimateNumber, reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Duplicate an estimate
 */
export const duplicate = mutation({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const authCtx = await requireCompanyAccess(ctx, estimate.companyId);
    requirePermission(authCtx, "create_estimates");

    // Generate new estimate number
    const estimateNumber = await generateEstimateNumber(ctx, estimate.companyId);

    // Set new validity (30 days from now)
    const validUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const newEstimateId = await ctx.db.insert("estimates", {
      companyId: estimate.companyId,
      customerId: estimate.customerId,
      propertyId: estimate.propertyId,
      jobId: undefined, // Don't link to same job
      estimateNumber,
      title: `Copy of ${estimate.title}`,
      description: estimate.description,
      status: "draft",
      lineItems: estimate.lineItems,
      subtotal: estimate.subtotal,
      taxRate: estimate.taxRate,
      taxAmount: estimate.taxAmount,
      discountAmount: estimate.discountAmount,
      totalAmount: estimate.totalAmount,
      validUntil,
      terms: estimate.terms,
      notes: estimate.notes,
      internalNotes: estimate.internalNotes,
      customFields: estimate.customFields,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: estimate.companyId,
      userId: authCtx.userId,
      action: "duplicate",
      entityType: "estimate",
      entityId: newEstimateId,
      metadata: { sourceEstimateId: args.estimateId },
    });

    return newEstimateId;
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import estimate from Supabase during migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.optional(v.string()),
    jobSupabaseId: v.optional(v.string()),
    propertySupabaseId: v.optional(v.string()),
    estimateNumber: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    lineItems: v.array(v.any()),
    subtotal: v.number(),
    taxRate: v.optional(v.number()),
    taxAmount: v.number(),
    discountAmount: v.number(),
    totalAmount: v.number(),
    validUntil: v.optional(v.number()),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    viewedAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
    declinedAt: v.optional(v.number()),
    declineReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Look up company mapping
    const companyMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "companies").eq("supabaseId", args.companySupabaseId)
      )
      .unique();

    if (!companyMapping) {
      throw new Error(`Company not found: ${args.companySupabaseId}`);
    }

    // Check if already migrated
    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "estimates").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    // Look up customer mapping if provided
    let customerId: any = undefined;
    if (args.customerSupabaseId) {
      const customerMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "customers").eq("supabaseId", args.customerSupabaseId!)
        )
        .unique();
      if (customerMapping) customerId = customerMapping.convexId;
    }

    // Look up job mapping if provided
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

    // Look up property mapping if provided
    let propertyId: any = undefined;
    if (args.propertySupabaseId) {
      const propertyMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "properties").eq("supabaseId", args.propertySupabaseId!)
        )
        .unique();
      if (propertyMapping) propertyId = propertyMapping.convexId;
    }

    const estimateId = await ctx.db.insert("estimates", {
      companyId: companyMapping.convexId as any,
      customerId,
      jobId,
      propertyId,
      estimateNumber: args.estimateNumber,
      title: args.title,
      description: args.description,
      status: args.status as any,
      lineItems: args.lineItems,
      subtotal: args.subtotal,
      taxRate: args.taxRate ?? 0,
      taxAmount: args.taxAmount,
      discountAmount: args.discountAmount,
      totalAmount: args.totalAmount,
      validUntil: args.validUntil,
      terms: args.terms,
      notes: args.notes,
      sentAt: args.sentAt,
      viewedAt: args.viewedAt,
      acceptedAt: args.acceptedAt,
      declinedAt: args.declinedAt,
      declineReason: args.declineReason,
    });

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "estimates",
      supabaseId: args.supabaseId,
      convexId: estimateId,
      migratedAt: Date.now(),
    });

    return estimateId;
  },
});
