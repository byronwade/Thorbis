import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import {
  requireCompanyAccess,
  requirePermission,
  excludeDeleted,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { vendorCategory, vendorPaymentTerms } from "./lib/validators";

// Status validator
const vendorStatus = v.union(v.literal("active"), v.literal("inactive"));

// ==========================================================================
// QUERIES
// ==========================================================================

/**
 * List all vendors for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(vendorStatus),
    category: v.optional(vendorCategory),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let vendorsQuery;

    if (args.status) {
      vendorsQuery = ctx.db
        .query("vendors")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    } else {
      vendorsQuery = ctx.db
        .query("vendors")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId));
    }

    let vendors = await vendorsQuery.collect();
    vendors = excludeDeleted(vendors);

    // Filter by category if provided
    if (args.category) {
      vendors = vendors.filter((v) => v.category === args.category);
    }

    // Sort by name
    vendors.sort((a, b) => a.name.localeCompare(b.name));

    const limit = args.limit ?? 50;
    return vendors.slice(0, limit);
  },
});

/**
 * Get a single vendor by ID
 */
export const get = query({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) return null;

    await requireCompanyAccess(ctx, vendor.companyId);
    return vendor;
  },
});

/**
 * Get vendor with complete details including purchase history
 */
export const getComplete = query({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) return null;

    await requireCompanyAccess(ctx, vendor.companyId);

    // Get recent purchase orders
    const purchaseOrders = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_vendor", (q) => q.eq("vendorId", args.id))
      .collect();

    const activePOs = excludeDeleted(purchaseOrders);

    // Calculate totals
    let totalOrders = 0;
    let totalSpent = 0;
    let pendingAmount = 0;

    for (const po of activePOs) {
      totalOrders++;
      if (po.status === "received") {
        totalSpent += po.totalAmount;
      } else if (
        po.status === "ordered" ||
        po.status === "partially_received"
      ) {
        pendingAmount += po.totalAmount;
      }
    }

    // Get recent orders
    const recentOrders = activePOs
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 5);

    return {
      ...vendor,
      stats: {
        totalOrders,
        totalSpent,
        pendingAmount,
        averageOrderValue: totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0,
      },
      recentOrders,
    };
  },
});

/**
 * Get vendor by vendor number
 */
export const getByVendorNumber = query({
  args: {
    companyId: v.id("companies"),
    vendorNumber: v.string(),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const vendor = await ctx.db
      .query("vendors")
      .withIndex("by_vendor_number", (q) =>
        q.eq("companyId", args.companyId).eq("vendorNumber", args.vendorNumber)
      )
      .first();

    if (!vendor || vendor.deletedAt) return null;
    return vendor;
  },
});

/**
 * Search vendors by name
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    searchQuery: v.string(),
    status: v.optional(vendorStatus),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const searchLower = args.searchQuery.toLowerCase();
    let filtered = excludeDeleted(vendors).filter(
      (v) =>
        v.name.toLowerCase().includes(searchLower) ||
        v.displayName.toLowerCase().includes(searchLower) ||
        v.vendorNumber.toLowerCase().includes(searchLower) ||
        v.email?.toLowerCase().includes(searchLower)
    );

    if (args.status) {
      filtered = filtered.filter((v) => v.status === args.status);
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered.slice(0, args.limit ?? 20);
  },
});

/**
 * Get vendor statistics
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const activeVendors = excludeDeleted(vendors);

    const byCategory = {
      supplier: 0,
      distributor: 0,
      manufacturer: 0,
      service_provider: 0,
      other: 0,
    };

    let activeCount = 0;
    let inactiveCount = 0;

    for (const vendor of activeVendors) {
      if (vendor.status === "active") {
        activeCount++;
      } else {
        inactiveCount++;
      }

      if (vendor.category) {
        byCategory[vendor.category as keyof typeof byCategory]++;
      }
    }

    return {
      total: activeVendors.length,
      active: activeCount,
      inactive: inactiveCount,
      byCategory,
    };
  },
});

/**
 * Get active vendors for dropdowns
 */
export const getActive = query({
  args: {
    companyId: v.id("companies"),
    category: v.optional(vendorCategory),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_company_status", (q) =>
        q.eq("companyId", args.companyId).eq("status", "active")
      )
      .collect();

    let filtered = excludeDeleted(vendors);

    if (args.category) {
      filtered = filtered.filter((v) => v.category === args.category);
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered.map((v) => ({
      _id: v._id,
      name: v.name,
      displayName: v.displayName,
      vendorNumber: v.vendorNumber,
      category: v.category,
    }));
  },
});

// ==========================================================================
// MUTATIONS
// ==========================================================================

/**
 * Generate next vendor number
 */
async function generateVendorNumber(
  ctx: { db: any },
  companyId: string
): Promise<string> {
  const vendors = await ctx.db
    .query("vendors")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const maxNumber = (vendors as Array<{ vendorNumber: string }>).reduce((max, vendor) => {
    const match = vendor.vendorNumber.match(/^V-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);

  return `V-${String(maxNumber + 1).padStart(5, "0")}`;
}

/**
 * Create a new vendor
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    secondaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    taxId: v.optional(v.string()),
    paymentTerms: v.optional(vendorPaymentTerms),
    creditLimit: v.optional(v.number()),
    preferredPaymentMethod: v.optional(v.string()),
    category: v.optional(vendorCategory),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "manage_jobs");

    const vendorNumber = await generateVendorNumber(ctx, args.companyId);

    const vendorId = await ctx.db.insert("vendors", {
      companyId: args.companyId,
      name: args.name,
      displayName: args.displayName ?? args.name,
      vendorNumber,
      email: args.email,
      phone: args.phone,
      secondaryPhone: args.secondaryPhone,
      website: args.website,
      address: args.address,
      address2: args.address2,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      country: args.country,
      taxId: args.taxId,
      paymentTerms: args.paymentTerms ?? "net_30",
      creditLimit: args.creditLimit,
      preferredPaymentMethod: args.preferredPaymentMethod,
      category: args.category,
      tags: args.tags,
      status: "active",
      notes: args.notes,
      internalNotes: args.internalNotes,
      customFields: args.customFields,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "vendor.created",
      entityType: "vendor",
      entityId: vendorId,
      newValues: { name: args.name, vendorNumber },
    });

    return vendorId;
  },
});

/**
 * Update a vendor
 */
export const update = mutation({
  args: {
    id: v.id("vendors"),
    name: v.optional(v.string()),
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    secondaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    taxId: v.optional(v.string()),
    paymentTerms: v.optional(vendorPaymentTerms),
    creditLimit: v.optional(v.number()),
    preferredPaymentMethod: v.optional(v.string()),
    category: v.optional(vendorCategory),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) {
      throw new Error("Vendor not found");
    }

    const authCtx = await requireCompanyAccess(ctx, vendor.companyId);
    requirePermission(authCtx, "manage_jobs");

    const { id, ...updates } = args;
    const changes = trackChanges(vendor, updates);

    await ctx.db.patch(args.id, {
      ...updates,
    });

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: vendor.companyId,
        userId: authCtx.userId,
        action: "vendor.updated",
        entityType: "vendor",
        entityId: args.id,
        previousValues: Object.fromEntries(
          Object.keys(changes).map((k) => [k, vendor[k as keyof typeof vendor]])
        ),
        newValues: changes,
      });
    }

    return args.id;
  },
});

/**
 * Activate a vendor
 */
export const activate = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) {
      throw new Error("Vendor not found");
    }

    const authCtx = await requireCompanyAccess(ctx, vendor.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      status: "active",
    });

    await createAuditLog(ctx, {
      companyId: vendor.companyId,
      userId: authCtx.userId,
      action: "vendor.activated",
      entityType: "vendor",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Deactivate a vendor
 */
export const deactivate = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) {
      throw new Error("Vendor not found");
    }

    const authCtx = await requireCompanyAccess(ctx, vendor.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      status: "inactive",
    });

    await createAuditLog(ctx, {
      companyId: vendor.companyId,
      userId: authCtx.userId,
      action: "vendor.deactivated",
      entityType: "vendor",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Update payment terms
 */
export const updatePaymentTerms = mutation({
  args: {
    id: v.id("vendors"),
    paymentTerms: vendorPaymentTerms,
    creditLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) {
      throw new Error("Vendor not found");
    }

    const authCtx = await requireCompanyAccess(ctx, vendor.companyId);
    requirePermission(authCtx, "manage_jobs");

    const updates: Record<string, unknown> = {
      paymentTerms: args.paymentTerms,
    };

    if (args.creditLimit !== undefined) {
      updates.creditLimit = args.creditLimit;
    }

    await ctx.db.patch(args.id, updates);

    await createAuditLog(ctx, {
      companyId: vendor.companyId,
      userId: authCtx.userId,
      action: "vendor.payment_terms_updated",
      entityType: "vendor",
      entityId: args.id,
      previousValues: {
        paymentTerms: vendor.paymentTerms,
        creditLimit: vendor.creditLimit,
      },
      newValues: {
        paymentTerms: args.paymentTerms,
        creditLimit: args.creditLimit,
      },
    });

    return args.id;
  },
});

/**
 * Archive a vendor (soft delete)
 */
export const archive = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) {
      throw new Error("Vendor not found");
    }

    const authCtx = await requireCompanyAccess(ctx, vendor.companyId);
    requirePermission(authCtx, "delete_records");

    await ctx.db.patch(args.id, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
      status: "inactive",
    });

    await createAuditLog(ctx, {
      companyId: vendor.companyId,
      userId: authCtx.userId,
      action: "vendor.archived",
      entityType: "vendor",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Unarchive a vendor
 */
export const unarchive = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor || vendor.deletedAt) {
      throw new Error("Vendor not found");
    }

    const authCtx = await requireCompanyAccess(ctx, vendor.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      archivedAt: undefined,
      archivedBy: undefined,
    });

    await createAuditLog(ctx, {
      companyId: vendor.companyId,
      userId: authCtx.userId,
      action: "vendor.unarchived",
      entityType: "vendor",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Permanently remove a vendor
 */
export const remove = mutation({
  args: { id: v.id("vendors") },
  handler: async (ctx, args) => {
    const vendor = await ctx.db.get(args.id);
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const authCtx = await requireCompanyAccess(ctx, vendor.companyId);
    requirePermission(authCtx, "delete_records");

    // Check for associated purchase orders
    const purchaseOrders = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_vendor", (q) => q.eq("vendorId", args.id))
      .first();

    if (purchaseOrders) {
      throw new Error(
        "Cannot delete vendor with associated purchase orders. Archive instead."
      );
    }

    // Soft delete
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: vendor.companyId,
      userId: authCtx.userId,
      action: "vendor.removed",
      entityType: "vendor",
      entityId: args.id,
    });

    return args.id;
  },
});

// ==========================================================================
// INTERNAL MUTATIONS (for migration)
// ==========================================================================

/**
 * Import vendor from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companyId: v.id("companies"),
    name: v.string(),
    displayName: v.string(),
    vendorNumber: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    secondaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    taxId: v.optional(v.string()),
    paymentTerms: vendorPaymentTerms,
    creditLimit: v.optional(v.number()),
    preferredPaymentMethod: v.optional(v.string()),
    category: v.optional(vendorCategory),
    tags: v.optional(v.array(v.string())),
    status: vendorStatus,
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { supabaseId, ...vendorData } = args;

    // Check if already migrated
    const existing = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "vendors").eq("supabaseId", supabaseId)
      )
      .first();

    if (existing) {
      return existing.convexId;
    }

    const vendorId = await ctx.db.insert("vendors", vendorData);

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "vendors",
      supabaseId,
      convexId: vendorId,
      migratedAt: Date.now(),
    });

    return vendorId;
  },
});
