import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import {
  requireCompanyAccess,
  requirePermissionForAction,
  excludeDeleted,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { inventoryStatus } from "./lib/validators";

// ==========================================================================
// QUERIES
// ==========================================================================

/**
 * List all inventory items for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(inventoryStatus),
    isLowStock: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    // Always query with company index, then filter in memory
    const allItems = await ctx.db
      .query("inventory")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    // Filter by criteria
    let items = excludeDeleted(allItems);

    if (args.isLowStock !== undefined) {
      items = items.filter((inv) => inv.isLowStock === args.isLowStock);
    }

    if (args.status) {
      items = items.filter((inv) => inv.status === args.status);
    }

    // Enrich with price book item details
    const enriched = await Promise.all(
      items.map(async (inv) => {
        const priceBookItem = await ctx.db.get(inv.priceBookItemId);
        return {
          ...inv,
          priceBookItem,
        };
      })
    );

    const limit = args.limit ?? 50;
    return enriched.slice(0, limit);
  },
});

/**
 * Get a single inventory item by ID
 */
export const get = query({
  args: { id: v.id("inventory") },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) return null;

    await requireCompanyAccess(ctx, inventory.companyId);
    return inventory;
  },
});

/**
 * Get inventory with complete details
 */
export const getComplete = query({
  args: { id: v.id("inventory") },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) return null;

    await requireCompanyAccess(ctx, inventory.companyId);

    const [priceBookItem, lastPurchaseOrder, lastJob] = await Promise.all([
      ctx.db.get(inventory.priceBookItemId),
      inventory.lastRestockPurchaseOrderId
        ? ctx.db.get(inventory.lastRestockPurchaseOrderId)
        : null,
      inventory.lastUsedJobId ? ctx.db.get(inventory.lastUsedJobId) : null,
    ]);

    // Get recent movements (inventory transactions would need separate tracking)
    return {
      ...inventory,
      priceBookItem,
      lastPurchaseOrder,
      lastJob,
      valuationCost: inventory.quantityOnHand * (inventory.costPerUnit ?? 0),
    };
  },
});

/**
 * Get inventory by price book item
 */
export const getByPriceBookItem = query({
  args: { priceBookItemId: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const inventory = await ctx.db
      .query("inventory")
      .withIndex("by_price_book_item", (q) =>
        q.eq("priceBookItemId", args.priceBookItemId)
      )
      .first();

    if (!inventory || inventory.deletedAt) return null;

    await requireCompanyAccess(ctx, inventory.companyId);
    return inventory;
  },
});

/**
 * Get low stock items
 */
export const getLowStock = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const items = await ctx.db
      .query("inventory")
      .withIndex("by_company_low_stock", (q) =>
        q.eq("companyId", args.companyId).eq("isLowStock", true)
      )
      .collect();

    const filtered = excludeDeleted(items);

    // Enrich with price book item details
    const enriched = await Promise.all(
      filtered.map(async (inv) => {
        const priceBookItem = await ctx.db.get(inv.priceBookItemId);
        return {
          ...inv,
          priceBookItem,
          shortfall: (inv.reorderPoint ?? 0) - inv.quantityAvailable,
        };
      })
    );

    // Sort by shortfall (most critical first)
    enriched.sort((a, b) => (b.shortfall ?? 0) - (a.shortfall ?? 0));

    return enriched.slice(0, args.limit ?? 20);
  },
});

/**
 * Get inventory statistics
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const items = await ctx.db
      .query("inventory")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const activeItems = excludeDeleted(items);

    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalItems = 0;
    let totalQuantity = 0;

    const byStatus = {
      active: 0,
      discontinued: 0,
      on_order: 0,
    };

    for (const inv of activeItems) {
      totalItems++;
      totalQuantity += inv.quantityOnHand;
      totalValue += inv.totalCostValue ?? 0;

      byStatus[inv.status as keyof typeof byStatus]++;

      if (inv.isLowStock) {
        lowStockCount++;
      }
      if (inv.quantityAvailable <= 0) {
        outOfStockCount++;
      }
    }

    return {
      totalItems,
      totalQuantity,
      totalValue,
      lowStockCount,
      outOfStockCount,
      byStatus,
      averageValue: totalItems > 0 ? Math.round(totalValue / totalItems) : 0,
    };
  },
});

/**
 * Search inventory by location
 */
export const getByLocation = query({
  args: {
    companyId: v.id("companies"),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const items = await ctx.db
      .query("inventory")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const filtered = excludeDeleted(items).filter(
      (inv) =>
        inv.warehouseLocation === args.location ||
        inv.primaryLocation === args.location ||
        (inv.secondaryLocations?.includes(args.location) ?? false)
    );

    // Enrich with price book item details
    const enriched = await Promise.all(
      filtered.map(async (inv) => {
        const priceBookItem = await ctx.db.get(inv.priceBookItemId);
        return {
          ...inv,
          priceBookItem,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get items needing reorder
 */
export const getNeedingReorder = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const items = await ctx.db
      .query("inventory")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const needsReorder = excludeDeleted(items).filter(
      (inv) =>
        inv.reorderPoint !== undefined &&
        inv.quantityAvailable <= inv.reorderPoint &&
        inv.status === "active"
    );

    // Enrich with price book item details
    const enriched = await Promise.all(
      needsReorder.map(async (inv) => {
        const priceBookItem = await ctx.db.get(inv.priceBookItemId);
        return {
          ...inv,
          priceBookItem,
          suggestedOrderQuantity: inv.reorderQuantity ?? inv.reorderPoint ?? 10,
        };
      })
    );

    // Sort by urgency (most critical first)
    enriched.sort(
      (a, b) =>
        (a.quantityAvailable - (a.reorderPoint ?? 0)) -
        (b.quantityAvailable - (b.reorderPoint ?? 0))
    );

    return enriched.slice(0, args.limit ?? 20);
  },
});

// ==========================================================================
// MUTATIONS
// ==========================================================================

/**
 * Create a new inventory record
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    priceBookItemId: v.id("priceBookItems"),
    quantityOnHand: v.optional(v.number()),
    minimumQuantity: v.optional(v.number()),
    maximumQuantity: v.optional(v.number()),
    reorderPoint: v.optional(v.number()),
    reorderQuantity: v.optional(v.number()),
    warehouseLocation: v.optional(v.string()),
    primaryLocation: v.optional(v.string()),
    secondaryLocations: v.optional(v.array(v.string())),
    costPerUnit: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requirePermissionForAction(
      ctx,
      args.companyId,
      "inventory",
      "create"
    );

    // Check if inventory already exists for this price book item
    const existing = await ctx.db
      .query("inventory")
      .withIndex("by_price_book_item", (q) =>
        q.eq("priceBookItemId", args.priceBookItemId)
      )
      .first();

    if (existing && !existing.deletedAt) {
      throw new Error("Inventory record already exists for this item");
    }

    const quantityOnHand = args.quantityOnHand ?? 0;
    const costPerUnit = args.costPerUnit ?? 0;
    const isLowStock =
      args.reorderPoint !== undefined && quantityOnHand <= args.reorderPoint;

    const now = Date.now();
    const inventoryId = await ctx.db.insert("inventory", {
      companyId: args.companyId,
      priceBookItemId: args.priceBookItemId,
      quantityOnHand,
      quantityReserved: 0,
      quantityAvailable: quantityOnHand,
      minimumQuantity: args.minimumQuantity,
      maximumQuantity: args.maximumQuantity,
      reorderPoint: args.reorderPoint,
      reorderQuantity: args.reorderQuantity,
      warehouseLocation: args.warehouseLocation,
      primaryLocation: args.primaryLocation,
      secondaryLocations: args.secondaryLocations,
      costPerUnit,
      totalCostValue: quantityOnHand * costPerUnit,
      isLowStock,
      lowStockAlertSent: false,
      status: "active",
      notes: args.notes,
      createdBy: userId,
      updatedBy: userId,
    });

    // Update price book item to track inventory
    await ctx.db.patch(args.priceBookItemId, {
      trackInventory: true,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId,
      action: "inventory.created",
      entityType: "inventory",
      entityId: inventoryId,
      newValues: { priceBookItemId: args.priceBookItemId, quantityOnHand },
    });

    return inventoryId;
  },
});

/**
 * Update inventory record
 */
export const update = mutation({
  args: {
    id: v.id("inventory"),
    minimumQuantity: v.optional(v.number()),
    maximumQuantity: v.optional(v.number()),
    reorderPoint: v.optional(v.number()),
    reorderQuantity: v.optional(v.number()),
    warehouseLocation: v.optional(v.string()),
    primaryLocation: v.optional(v.string()),
    secondaryLocations: v.optional(v.array(v.string())),
    costPerUnit: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.optional(inventoryStatus),
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    const { id, ...updates } = args;
    const changes = trackChanges(inventory, updates);

    // Recalculate low stock if reorder point changed
    const reorderPoint = args.reorderPoint ?? inventory.reorderPoint;
    const isLowStock =
      reorderPoint !== undefined &&
      inventory.quantityAvailable <= reorderPoint;

    // Recalculate total value if cost changed
    const costPerUnit = args.costPerUnit ?? inventory.costPerUnit ?? 0;
    const totalCostValue = inventory.quantityOnHand * costPerUnit;

    await ctx.db.patch(args.id, {
      ...updates,
      isLowStock,
      totalCostValue,
      updatedBy: userId,
    });

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: inventory.companyId,
        userId,
        action: "inventory.updated",
        entityType: "inventory",
        entityId: args.id,
        previousValues: Object.fromEntries(
          Object.keys(changes).map((k) => [
            k,
            inventory[k as keyof typeof inventory],
          ])
        ),
        newValues: changes,
      });
    }

    return args.id;
  },
});

/**
 * Adjust stock quantity (add or subtract)
 */
export const adjustStock = mutation({
  args: {
    id: v.id("inventory"),
    adjustment: v.number(),
    reason: v.string(),
    jobId: v.optional(v.id("jobs")),
    purchaseOrderId: v.optional(v.id("purchaseOrders")),
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    const newQuantityOnHand = inventory.quantityOnHand + args.adjustment;
    if (newQuantityOnHand < 0) {
      throw new Error("Cannot reduce stock below zero");
    }

    const newQuantityAvailable =
      newQuantityOnHand - inventory.quantityReserved;
    const isLowStock =
      inventory.reorderPoint !== undefined &&
      newQuantityAvailable <= inventory.reorderPoint;

    const costPerUnit = inventory.costPerUnit ?? 0;
    const totalCostValue = newQuantityOnHand * costPerUnit;

    const now = Date.now();
    const updates: Record<string, unknown> = {
      quantityOnHand: newQuantityOnHand,
      quantityAvailable: newQuantityAvailable,
      totalCostValue,
      isLowStock,
      updatedBy: userId,
    };

    // Track last usage if this is a consumption
    if (args.adjustment < 0 && args.jobId) {
      updates.lastUsedDate = now;
      updates.lastUsedJobId = args.jobId;
    }

    // Track last restock if this is an addition
    if (args.adjustment > 0) {
      updates.lastRestockDate = now;
      updates.lastRestockQuantity = args.adjustment;
      if (args.purchaseOrderId) {
        updates.lastRestockPurchaseOrderId = args.purchaseOrderId;
      }
    }

    // Reset low stock alert if no longer low
    if (!isLowStock && inventory.lowStockAlertSent) {
      updates.lowStockAlertSent = false;
      updates.lowStockAlertSentAt = undefined;
    }

    await ctx.db.patch(args.id, updates);

    await createAuditLog(ctx, {
      companyId: inventory.companyId,
      userId,
      action: args.adjustment > 0 ? "inventory.restocked" : "inventory.consumed",
      entityType: "inventory",
      entityId: args.id,
      previousValues: { quantityOnHand: inventory.quantityOnHand },
      newValues: {
        quantityOnHand: newQuantityOnHand,
        adjustment: args.adjustment,
        reason: args.reason,
        jobId: args.jobId,
        purchaseOrderId: args.purchaseOrderId,
      },
    });

    return args.id;
  },
});

/**
 * Reserve stock for a job
 */
export const reserveStock = mutation({
  args: {
    id: v.id("inventory"),
    quantity: v.number(),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    if (args.quantity > inventory.quantityAvailable) {
      throw new Error("Insufficient available stock");
    }

    const newQuantityReserved = inventory.quantityReserved + args.quantity;
    const newQuantityAvailable = inventory.quantityOnHand - newQuantityReserved;
    const isLowStock =
      inventory.reorderPoint !== undefined &&
      newQuantityAvailable <= inventory.reorderPoint;

    await ctx.db.patch(args.id, {
      quantityReserved: newQuantityReserved,
      quantityAvailable: newQuantityAvailable,
      isLowStock,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: inventory.companyId,
      userId,
      action: "inventory.reserved",
      entityType: "inventory",
      entityId: args.id,
      newValues: {
        quantity: args.quantity,
        jobId: args.jobId,
        newQuantityReserved,
        newQuantityAvailable,
      },
    });

    return args.id;
  },
});

/**
 * Release reserved stock
 */
export const releaseReservedStock = mutation({
  args: {
    id: v.id("inventory"),
    quantity: v.number(),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    if (args.quantity > inventory.quantityReserved) {
      throw new Error("Cannot release more than reserved");
    }

    const newQuantityReserved = inventory.quantityReserved - args.quantity;
    const newQuantityAvailable = inventory.quantityOnHand - newQuantityReserved;
    const isLowStock =
      inventory.reorderPoint !== undefined &&
      newQuantityAvailable <= inventory.reorderPoint;

    await ctx.db.patch(args.id, {
      quantityReserved: newQuantityReserved,
      quantityAvailable: newQuantityAvailable,
      isLowStock,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: inventory.companyId,
      userId,
      action: "inventory.released",
      entityType: "inventory",
      entityId: args.id,
      newValues: {
        quantity: args.quantity,
        jobId: args.jobId,
        newQuantityReserved,
        newQuantityAvailable,
      },
    });

    return args.id;
  },
});

/**
 * Consume reserved stock (convert reservation to actual usage)
 */
export const consumeReservedStock = mutation({
  args: {
    id: v.id("inventory"),
    quantity: v.number(),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    if (args.quantity > inventory.quantityReserved) {
      throw new Error("Cannot consume more than reserved");
    }

    const newQuantityOnHand = inventory.quantityOnHand - args.quantity;
    const newQuantityReserved = inventory.quantityReserved - args.quantity;
    const newQuantityAvailable = newQuantityOnHand - newQuantityReserved;
    const isLowStock =
      inventory.reorderPoint !== undefined &&
      newQuantityAvailable <= inventory.reorderPoint;

    const costPerUnit = inventory.costPerUnit ?? 0;
    const totalCostValue = newQuantityOnHand * costPerUnit;

    const now = Date.now();
    await ctx.db.patch(args.id, {
      quantityOnHand: newQuantityOnHand,
      quantityReserved: newQuantityReserved,
      quantityAvailable: newQuantityAvailable,
      totalCostValue,
      isLowStock,
      lastUsedDate: now,
      lastUsedJobId: args.jobId,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: inventory.companyId,
      userId,
      action: "inventory.consumed_reserved",
      entityType: "inventory",
      entityId: args.id,
      previousValues: {
        quantityOnHand: inventory.quantityOnHand,
        quantityReserved: inventory.quantityReserved,
      },
      newValues: {
        quantity: args.quantity,
        jobId: args.jobId,
        newQuantityOnHand,
        newQuantityReserved,
      },
    });

    return args.id;
  },
});

/**
 * Perform stock check/count
 */
export const performStockCheck = mutation({
  args: {
    id: v.id("inventory"),
    countedQuantity: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    const adjustment = args.countedQuantity - inventory.quantityOnHand;
    const newQuantityOnHand = args.countedQuantity;
    const newQuantityAvailable = newQuantityOnHand - inventory.quantityReserved;
    const isLowStock =
      inventory.reorderPoint !== undefined &&
      newQuantityAvailable <= inventory.reorderPoint;

    const costPerUnit = inventory.costPerUnit ?? 0;
    const totalCostValue = newQuantityOnHand * costPerUnit;

    const now = Date.now();
    await ctx.db.patch(args.id, {
      quantityOnHand: newQuantityOnHand,
      quantityAvailable: newQuantityAvailable,
      totalCostValue,
      isLowStock,
      lastStockCheckDate: now,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: inventory.companyId,
      userId,
      action: "inventory.stock_check",
      entityType: "inventory",
      entityId: args.id,
      previousValues: { quantityOnHand: inventory.quantityOnHand },
      newValues: {
        countedQuantity: args.countedQuantity,
        adjustment,
        notes: args.notes,
      },
    });

    return args.id;
  },
});

/**
 * Mark low stock alert as sent
 */
export const markLowStockAlertSent = mutation({
  args: { id: v.id("inventory") },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    await ctx.db.patch(args.id, {
      lowStockAlertSent: true,
      lowStockAlertSentAt: Date.now(),
      updatedBy: userId,
    });

    return args.id;
  },
});

/**
 * Update inventory status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("inventory"),
    status: inventoryStatus,
  },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory || inventory.deletedAt) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "update"
    );

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: inventory.companyId,
      userId,
      action: "inventory.status_updated",
      entityType: "inventory",
      entityId: args.id,
      previousValues: { status: inventory.status },
      newValues: { status: args.status },
    });

    return args.id;
  },
});

/**
 * Permanently remove inventory record
 */
export const remove = mutation({
  args: { id: v.id("inventory") },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.get(args.id);
    if (!inventory) {
      throw new Error("Inventory record not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      inventory.companyId,
      "inventory",
      "delete"
    );

    // Soft delete
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      deletedBy: userId,
      updatedBy: userId,
    });

    // Update price book item to not track inventory
    await ctx.db.patch(inventory.priceBookItemId, {
      trackInventory: false,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: inventory.companyId,
      userId,
      action: "inventory.removed",
      entityType: "inventory",
      entityId: args.id,
    });

    return args.id;
  },
});

// ==========================================================================
// INTERNAL MUTATIONS (for migration)
// ==========================================================================

/**
 * Import inventory from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companyId: v.id("companies"),
    priceBookItemId: v.id("priceBookItems"),
    quantityOnHand: v.number(),
    quantityReserved: v.number(),
    quantityAvailable: v.number(),
    minimumQuantity: v.optional(v.number()),
    maximumQuantity: v.optional(v.number()),
    reorderPoint: v.optional(v.number()),
    reorderQuantity: v.optional(v.number()),
    warehouseLocation: v.optional(v.string()),
    primaryLocation: v.optional(v.string()),
    secondaryLocations: v.optional(v.array(v.string())),
    costPerUnit: v.optional(v.number()),
    totalCostValue: v.optional(v.number()),
    lastPurchaseCost: v.optional(v.number()),
    lastRestockDate: v.optional(v.number()),
    lastRestockQuantity: v.optional(v.number()),
    lastStockCheckDate: v.optional(v.number()),
    lastUsedDate: v.optional(v.number()),
    isLowStock: v.boolean(),
    lowStockAlertSent: v.boolean(),
    lowStockAlertSentAt: v.optional(v.number()),
    status: inventoryStatus,
    notes: v.optional(v.string()),
    // Note: createdAt and updatedAt are not stored - Convex uses _creationTime
  },
  handler: async (ctx, args) => {
    const { supabaseId, ...inventoryData } = args;

    // Check if already migrated
    const existing = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "inventory").eq("supabaseId", supabaseId)
      )
      .first();

    if (existing) {
      return existing.convexId;
    }

    const inventoryId = await ctx.db.insert("inventory", inventoryData);

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "inventory",
      supabaseId,
      convexId: inventoryId,
      migratedAt: Date.now(),
    });

    return inventoryId;
  },
});
