import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import {
  requireCompanyAccess,
  requirePermission,
  hasMinimumRole,
  excludeDeleted,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { purchaseOrderStatus, jobPriority } from "./lib/validators";

// ==========================================================================
// QUERIES
// ==========================================================================

/**
 * List all purchase orders for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(purchaseOrderStatus),
    vendorId: v.optional(v.id("vendors")),
    jobId: v.optional(v.id("jobs")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let ordersQuery;

    if (args.status) {
      ordersQuery = ctx.db
        .query("purchaseOrders")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    } else if (args.vendorId) {
      ordersQuery = ctx.db
        .query("purchaseOrders")
        .withIndex("by_vendor", (q) => q.eq("vendorId", args.vendorId!));
    } else if (args.jobId) {
      ordersQuery = ctx.db
        .query("purchaseOrders")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId!));
    } else {
      ordersQuery = ctx.db
        .query("purchaseOrders")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId));
    }

    let orders = await ordersQuery.collect();
    orders = excludeDeleted(orders);

    // Sort by creation date descending
    orders.sort((a, b) => b._creationTime - a._creationTime);

    const limit = args.limit ?? 50;
    return orders.slice(0, limit);
  },
});

/**
 * Get a single purchase order by ID
 */
export const get = query({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) return null;

    await requireCompanyAccess(ctx, order.companyId);
    return order;
  },
});

/**
 * Get purchase order with complete details
 */
export const getComplete = query({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) return null;

    await requireCompanyAccess(ctx, order.companyId);

    const [vendor, job, requestedByUser, approvedByUser] = await Promise.all([
      order.vendorId ? ctx.db.get(order.vendorId) : null,
      order.jobId ? ctx.db.get(order.jobId) : null,
      ctx.db.get(order.requestedBy),
      order.approvedBy ? ctx.db.get(order.approvedBy) : null,
    ]);

    // Calculate days until expected delivery
    const daysUntilDelivery = order.expectedDelivery
      ? Math.ceil((order.expectedDelivery - Date.now()) / (24 * 60 * 60 * 1000))
      : null;

    return {
      ...order,
      vendor,
      job,
      requestedByUser,
      approvedByUser,
      daysUntilDelivery,
      isOverdue:
        order.expectedDelivery !== undefined &&
        order.expectedDelivery < Date.now() &&
        order.status !== "received",
    };
  },
});

/**
 * Get purchase order by PO number
 */
export const getByPoNumber = query({
  args: {
    companyId: v.id("companies"),
    poNumber: v.string(),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const order = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_po_number", (q) =>
        q.eq("companyId", args.companyId).eq("poNumber", args.poNumber)
      )
      .first();

    if (!order || order.deletedAt) return null;
    return order;
  },
});

/**
 * Get purchase orders pending approval
 */
export const getPendingApproval = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const orders = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_company_status", (q) =>
        q.eq("companyId", args.companyId).eq("status", "pending_approval")
      )
      .collect();

    const filtered = excludeDeleted(orders);
    filtered.sort((a, b) => a._creationTime - b._creationTime);

    return filtered.slice(0, args.limit ?? 20);
  },
});

/**
 * Get purchase orders awaiting delivery
 */
export const getAwaitingDelivery = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const orders = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const awaiting = excludeDeleted(orders).filter(
      (o) => o.status === "ordered" || o.status === "partially_received"
    );

    // Sort by expected delivery (earliest first)
    awaiting.sort((a, b) => {
      if (!a.expectedDelivery && !b.expectedDelivery) return 0;
      if (!a.expectedDelivery) return 1;
      if (!b.expectedDelivery) return -1;
      return a.expectedDelivery - b.expectedDelivery;
    });

    return awaiting.slice(0, args.limit ?? 20);
  },
});

/**
 * Get purchase order statistics
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const orders = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const activeOrders = excludeDeleted(orders);

    const byStatus = {
      draft: 0,
      pending_approval: 0,
      approved: 0,
      ordered: 0,
      partially_received: 0,
      received: 0,
      cancelled: 0,
    };

    let totalPending = 0;
    let totalOrdered = 0;
    let totalReceived = 0;
    let overdueCount = 0;

    const now = Date.now();

    for (const order of activeOrders) {
      byStatus[order.status as keyof typeof byStatus]++;

      if (
        order.status === "draft" ||
        order.status === "pending_approval" ||
        order.status === "approved"
      ) {
        totalPending += order.totalAmount;
      } else if (
        order.status === "ordered" ||
        order.status === "partially_received"
      ) {
        totalOrdered += order.totalAmount;

        // Check if overdue
        if (order.expectedDelivery && order.expectedDelivery < now) {
          overdueCount++;
        }
      } else if (order.status === "received") {
        totalReceived += order.totalAmount;
      }
    }

    return {
      total: activeOrders.length,
      byStatus,
      totalPending,
      totalOrdered,
      totalReceived,
      overdueCount,
      averageOrderValue:
        activeOrders.length > 0
          ? Math.round(
              activeOrders.reduce((sum, o) => sum + o.totalAmount, 0) /
                activeOrders.length
            )
          : 0,
    };
  },
});

/**
 * Get orders by vendor
 */
export const getByVendor = query({
  args: {
    vendorId: v.id("vendors"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.vendorId);
    if (!vendor) return [];

    await requireCompanyAccess(ctx, vendor.companyId);

    const orders = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_vendor", (q) => q.eq("vendorId", args.vendorId))
      .collect();

    const filtered = excludeDeleted(orders);
    filtered.sort((a, b) => b._creationTime - a._creationTime);

    return filtered.slice(0, args.limit ?? 20);
  },
});

// ==========================================================================
// MUTATIONS
// ==========================================================================

/**
 * Generate next PO number
 */
async function generatePoNumber(
  ctx: { db: any },
  companyId: string
): Promise<string> {
  const orders = await ctx.db
    .query("purchaseOrders")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const maxNumber = (orders as Array<{ poNumber: string }>).reduce((max, order) => {
    const match = order.poNumber.match(/^PO-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);

  return `PO-${String(maxNumber + 1).padStart(6, "0")}`;
}

/**
 * Create a new purchase order
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    jobId: v.optional(v.id("jobs")),
    vendorId: v.optional(v.id("vendors")),
    vendor: v.string(),
    vendorEmail: v.optional(v.string()),
    vendorPhone: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(jobPriority),
    lineItems: v.array(v.any()),
    subtotal: v.number(),
    taxAmount: v.number(),
    shippingAmount: v.number(),
    totalAmount: v.number(),
    expectedDelivery: v.optional(v.number()),
    deliveryAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    autoGenerated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_jobs");

    const poNumber = await generatePoNumber(ctx, args.companyId);

    const orderId = await ctx.db.insert("purchaseOrders", {
      companyId: args.companyId,
      jobId: args.jobId,
      vendorId: args.vendorId,
      poNumber,
      vendor: args.vendor,
      vendorEmail: args.vendorEmail,
      vendorPhone: args.vendorPhone,
      title: args.title,
      description: args.description,
      status: "draft",
      priority: args.priority ?? "medium",
      requestedBy: authCtx.userId,
      lineItems: args.lineItems,
      subtotal: args.subtotal,
      taxAmount: args.taxAmount,
      shippingAmount: args.shippingAmount,
      totalAmount: args.totalAmount,
      expectedDelivery: args.expectedDelivery,
      deliveryAddress: args.deliveryAddress,
      notes: args.notes,
      internalNotes: args.internalNotes,
      autoGenerated: args.autoGenerated ?? false,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "purchase_order.created",
      entityType: "purchase_order",
      entityId: orderId,
      newValues: { poNumber, vendor: args.vendor, totalAmount: args.totalAmount },
    });

    return orderId;
  },
});

/**
 * Update a purchase order
 */
export const update = mutation({
  args: {
    id: v.id("purchaseOrders"),
    vendorId: v.optional(v.id("vendors")),
    vendor: v.optional(v.string()),
    vendorEmail: v.optional(v.string()),
    vendorPhone: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(jobPriority),
    lineItems: v.optional(v.array(v.any())),
    subtotal: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    shippingAmount: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
    expectedDelivery: v.optional(v.number()),
    deliveryAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    // Can only edit draft orders
    if (order.status !== "draft") {
      throw new Error("Can only edit draft purchase orders");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    const { id, ...updates } = args;
    const changes = trackChanges(order, updates);

    await ctx.db.patch(args.id, {
      ...updates,
    });

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: order.companyId,
        userId: authCtx.userId,
        action: "purchase_order.updated",
        entityType: "purchase_order",
        entityId: args.id,
        previousValues: Object.fromEntries(
          Object.keys(changes).map((k) => [k, order[k as keyof typeof order]])
        ),
        newValues: changes,
      });
    }

    return args.id;
  },
});

/**
 * Submit for approval
 */
export const submitForApproval = mutation({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    if (order.status !== "draft") {
      throw new Error("Can only submit draft orders for approval");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      status: "pending_approval",
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.submitted_for_approval",
      entityType: "purchase_order",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Approve purchase order
 */
export const approve = mutation({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    if (order.status !== "pending_approval") {
      throw new Error("Can only approve orders pending approval");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "approve_estimates");

    // Need manager or admin role to approve
    if (!hasMinimumRole(authCtx.role, "manager")) {
      throw new Error("Insufficient permissions to approve purchase orders");
    }

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "approved",
      approvedBy: authCtx.userId,
      approvedAt: now,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.approved",
      entityType: "purchase_order",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Reject purchase order
 */
export const reject = mutation({
  args: {
    id: v.id("purchaseOrders"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    if (order.status !== "pending_approval") {
      throw new Error("Can only reject orders pending approval");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "approve_estimates");

    if (!hasMinimumRole(authCtx.role, "manager")) {
      throw new Error("Insufficient permissions to reject purchase orders");
    }

    await ctx.db.patch(args.id, {
      status: "draft",
      internalNotes: args.reason
        ? `${order.internalNotes ?? ""}\n[Rejected]: ${args.reason}`.trim()
        : order.internalNotes,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.rejected",
      entityType: "purchase_order",
      entityId: args.id,
      newValues: { reason: args.reason },
    });

    return args.id;
  },
});

/**
 * Mark as ordered
 */
export const markOrdered = mutation({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    if (order.status !== "approved") {
      throw new Error("Can only mark approved orders as ordered");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "ordered",
      orderedAt: now,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.ordered",
      entityType: "purchase_order",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Mark as partially received
 */
export const markPartiallyReceived = mutation({
  args: {
    id: v.id("purchaseOrders"),
    receivedItems: v.array(v.any()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    if (order.status !== "ordered" && order.status !== "partially_received") {
      throw new Error("Can only receive ordered items");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      status: "partially_received",
      notes: args.notes ?? order.notes,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.partially_received",
      entityType: "purchase_order",
      entityId: args.id,
      newValues: { receivedItems: args.receivedItems },
    });

    return args.id;
  },
});

/**
 * Mark as fully received
 */
export const markReceived = mutation({
  args: {
    id: v.id("purchaseOrders"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    if (
      order.status !== "ordered" &&
      order.status !== "partially_received"
    ) {
      throw new Error("Can only receive ordered items");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "received",
      actualDelivery: now,
      receivedAt: now,
      notes: args.notes ?? order.notes,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.received",
      entityType: "purchase_order",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Cancel purchase order
 */
export const cancel = mutation({
  args: {
    id: v.id("purchaseOrders"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    if (order.status === "received" || order.status === "cancelled") {
      throw new Error("Cannot cancel this order");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      status: "cancelled",
      internalNotes: args.reason
        ? `${order.internalNotes ?? ""}\n[Cancelled]: ${args.reason}`.trim()
        : order.internalNotes,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.cancelled",
      entityType: "purchase_order",
      entityId: args.id,
      newValues: { reason: args.reason },
    });

    return args.id;
  },
});

/**
 * Update expected delivery date
 */
export const updateExpectedDelivery = mutation({
  args: {
    id: v.id("purchaseOrders"),
    expectedDelivery: v.number(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      expectedDelivery: args.expectedDelivery,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.delivery_updated",
      entityType: "purchase_order",
      entityId: args.id,
      previousValues: { expectedDelivery: order.expectedDelivery },
      newValues: { expectedDelivery: args.expectedDelivery },
    });

    return args.id;
  },
});

/**
 * Archive a purchase order (soft delete)
 */
export const archive = mutation({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "delete_records");

    await ctx.db.patch(args.id, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.archived",
      entityType: "purchase_order",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Unarchive a purchase order
 */
export const unarchive = mutation({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.deletedAt) {
      throw new Error("Purchase order not found");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      archivedAt: undefined,
      archivedBy: undefined,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.unarchived",
      entityType: "purchase_order",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Permanently remove a purchase order
 */
export const remove = mutation({
  args: { id: v.id("purchaseOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) {
      throw new Error("Purchase order not found");
    }

    const authCtx = await requireCompanyAccess(ctx, order.companyId);
    requirePermission(authCtx, "delete_records");

    // Soft delete
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: order.companyId,
      userId: authCtx.userId,
      action: "purchase_order.removed",
      entityType: "purchase_order",
      entityId: args.id,
    });

    return args.id;
  },
});

// ==========================================================================
// INTERNAL MUTATIONS (for migration)
// ==========================================================================

/**
 * Import purchase order from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companyId: v.id("companies"),
    jobId: v.optional(v.id("jobs")),
    vendorId: v.optional(v.id("vendors")),
    poNumber: v.string(),
    vendor: v.string(),
    vendorEmail: v.optional(v.string()),
    vendorPhone: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    status: purchaseOrderStatus,
    priority: jobPriority,
    requestedBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    lineItems: v.array(v.any()),
    subtotal: v.number(),
    taxAmount: v.number(),
    shippingAmount: v.number(),
    totalAmount: v.number(),
    expectedDelivery: v.optional(v.number()),
    actualDelivery: v.optional(v.number()),
    deliveryAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    autoGenerated: v.boolean(),
    approvedAt: v.optional(v.number()),
    orderedAt: v.optional(v.number()),
    receivedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { supabaseId, ...orderData } = args;

    // Check if already migrated
    const existing = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "purchase_orders").eq("supabaseId", supabaseId)
      )
      .first();

    if (existing) {
      return existing.convexId;
    }

    const orderId = await ctx.db.insert("purchaseOrders", orderData);

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "purchase_orders",
      supabaseId,
      convexId: orderId,
      migratedAt: Date.now(),
    });

    return orderId;
  },
});
