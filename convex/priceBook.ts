import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import {
  requireCompanyAccess,
  requirePermissionForAction,
  excludeDeleted,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { priceBookItemType } from "./lib/validators";

// ==========================================================================
// QUERIES
// ==========================================================================

/**
 * List all price book items for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    type: v.optional(priceBookItemType),
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    trackInventory: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let itemsQuery;

    if (args.type) {
      itemsQuery = ctx.db
        .query("priceBookItems")
        .withIndex("by_company_type", (q) =>
          q.eq("companyId", args.companyId).eq("type", args.type!)
        );
    } else if (args.category) {
      itemsQuery = ctx.db
        .query("priceBookItems")
        .withIndex("by_company_category", (q) =>
          q.eq("companyId", args.companyId).eq("category", args.category!)
        );
    } else {
      itemsQuery = ctx.db
        .query("priceBookItems")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId));
    }

    let items = await itemsQuery.collect();

    // Apply filters
    items = excludeDeleted(items);

    if (args.isActive !== undefined) {
      items = items.filter((item) => item.isActive === args.isActive);
    }

    if (args.trackInventory !== undefined) {
      items = items.filter(
        (item) => item.trackInventory === args.trackInventory
      );
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    const limit = args.limit ?? 50;
    return items.slice(0, limit);
  },
});

/**
 * Get a single price book item by ID
 */
export const get = query({
  args: { id: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) return null;

    await requireCompanyAccess(ctx, item.companyId);
    return item;
  },
});

/**
 * Get price book item with inventory data
 */
export const getComplete = query({
  args: { id: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) return null;

    await requireCompanyAccess(ctx, item.companyId);

    // Get inventory if tracking is enabled
    let inventory = null;
    if (item.trackInventory) {
      const inventoryRecords = await ctx.db
        .query("inventory")
        .withIndex("by_price_book_item", (q) =>
          q.eq("priceBookItemId", args.id)
        )
        .first();
      inventory = inventoryRecords;
    }

    // Calculate profit margin
    const profitMargin = item.costPrice
      ? ((item.unitPrice - item.costPrice) / item.unitPrice) * 100
      : null;

    return {
      ...item,
      inventory,
      profitMargin,
    };
  },
});

/**
 * Get price book item by SKU
 */
export const getBySku = query({
  args: {
    companyId: v.id("companies"),
    sku: v.string(),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const item = await ctx.db
      .query("priceBookItems")
      .withIndex("by_company_sku", (q) =>
        q.eq("companyId", args.companyId).eq("sku", args.sku)
      )
      .first();

    if (!item || item.deletedAt) return null;
    return item;
  },
});

/**
 * Search price book items
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    searchQuery: v.string(),
    type: v.optional(priceBookItemType),
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let results = await ctx.db
      .query("priceBookItems")
      .withSearchIndex("search_price_book", (q) => {
        let search = q
          .search("searchText", args.searchQuery)
          .eq("companyId", args.companyId);

        if (args.type) {
          search = search.eq("type", args.type);
        }
        if (args.category) {
          search = search.eq("category", args.category);
        }
        if (args.isActive !== undefined) {
          search = search.eq("isActive", args.isActive);
        }

        return search;
      })
      .take(args.limit ?? 20);

    return excludeDeleted(results);
  },
});

/**
 * Get all categories for a company
 */
export const getCategories = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const items = await ctx.db
      .query("priceBookItems")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const activeItems = excludeDeleted(items).filter((item) => item.isActive);

    // Extract unique categories and subcategories
    const categoryMap = new Map<
      string,
      { count: number; subcategories: Set<string> }
    >();

    for (const item of activeItems) {
      if (item.category) {
        const existing = categoryMap.get(item.category);
        if (existing) {
          existing.count++;
          if (item.subcategory) {
            existing.subcategories.add(item.subcategory);
          }
        } else {
          const subcategories = new Set<string>();
          if (item.subcategory) {
            subcategories.add(item.subcategory);
          }
          categoryMap.set(item.category, { count: 1, subcategories });
        }
      }
    }

    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      subcategories: Array.from(data.subcategories).sort(),
    }));
  },
});

/**
 * Get price book statistics
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const items = await ctx.db
      .query("priceBookItems")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const activeItems = excludeDeleted(items);

    const byType = {
      service: 0,
      material: 0,
      labor: 0,
      equipment: 0,
      flat_rate: 0,
    };

    let totalValue = 0;
    let totalCost = 0;
    let taxableCount = 0;
    let inventoryTrackedCount = 0;

    for (const item of activeItems) {
      if (item.isActive) {
        byType[item.type as keyof typeof byType]++;
        totalValue += item.unitPrice;
        if (item.costPrice) {
          totalCost += item.costPrice;
        }
        if (item.taxable) {
          taxableCount++;
        }
        if (item.trackInventory) {
          inventoryTrackedCount++;
        }
      }
    }

    const activeCount = activeItems.filter((i) => i.isActive).length;
    const inactiveCount = activeItems.filter((i) => !i.isActive).length;

    return {
      total: activeItems.length,
      active: activeCount,
      inactive: inactiveCount,
      byType,
      averagePrice: activeCount > 0 ? Math.round(totalValue / activeCount) : 0,
      averageCost: activeCount > 0 ? Math.round(totalCost / activeCount) : 0,
      taxableCount,
      inventoryTrackedCount,
      categoriesCount: new Set(activeItems.map((i) => i.category).filter(Boolean))
        .size,
    };
  },
});

/**
 * Get items by type
 */
export const getByType = query({
  args: {
    companyId: v.id("companies"),
    type: priceBookItemType,
    activeOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const items = await ctx.db
      .query("priceBookItems")
      .withIndex("by_company_type", (q) =>
        q.eq("companyId", args.companyId).eq("type", args.type)
      )
      .collect();

    let filtered = excludeDeleted(items);

    if (args.activeOnly !== false) {
      filtered = filtered.filter((item) => item.isActive);
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered.slice(0, args.limit ?? 100);
  },
});

// ==========================================================================
// MUTATIONS
// ==========================================================================

/**
 * Create a new price book item
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    sku: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    type: priceBookItemType,
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    unitPrice: v.number(),
    costPrice: v.optional(v.number()),
    laborHours: v.optional(v.number()),
    taxable: v.boolean(),
    taxRate: v.optional(v.number()),
    trackInventory: v.boolean(),
    isActive: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requirePermissionForAction(
      ctx,
      args.companyId,
      "price_book",
      "create"
    );

    // Check SKU uniqueness
    const existingSku = await ctx.db
      .query("priceBookItems")
      .withIndex("by_company_sku", (q) =>
        q.eq("companyId", args.companyId).eq("sku", args.sku)
      )
      .first();

    if (existingSku && !existingSku.deletedAt) {
      throw new Error(`SKU "${args.sku}" already exists`);
    }

    // Build search text
    const searchText = [args.name, args.sku, args.description, args.category]
      .filter(Boolean)
      .join(" ");

    const now = Date.now();
    const itemId = await ctx.db.insert("priceBookItems", {
      companyId: args.companyId,
      sku: args.sku,
      name: args.name,
      description: args.description,
      type: args.type,
      category: args.category,
      subcategory: args.subcategory,
      unitPrice: args.unitPrice,
      costPrice: args.costPrice,
      laborHours: args.laborHours,
      taxable: args.taxable,
      taxRate: args.taxRate,
      trackInventory: args.trackInventory,
      isActive: args.isActive ?? true,
      tags: args.tags,
      metadata: args.metadata,
      searchText,
      createdBy: userId,
      updatedBy: userId,
    });

    // Create inventory record if tracking is enabled
    if (args.trackInventory) {
      await ctx.db.insert("inventory", {
        companyId: args.companyId,
        priceBookItemId: itemId,
        quantityOnHand: 0,
        quantityReserved: 0,
        quantityAvailable: 0,
        costPerUnit: args.costPrice,
        totalCostValue: 0,
        isLowStock: false,
        lowStockAlertSent: false,
        status: "active",
        createdBy: userId,
        updatedBy: userId,
      });
    }

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId,
      action: "price_book_item.created",
      entityType: "price_book_item",
      entityId: itemId,
      newValues: { name: args.name, sku: args.sku, type: args.type },
    });

    return itemId;
  },
});

/**
 * Update a price book item
 */
export const update = mutation({
  args: {
    id: v.id("priceBookItems"),
    sku: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(priceBookItemType),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    unitPrice: v.optional(v.number()),
    costPrice: v.optional(v.number()),
    laborHours: v.optional(v.number()),
    taxable: v.optional(v.boolean()),
    taxRate: v.optional(v.number()),
    trackInventory: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "update"
    );

    // Check SKU uniqueness if changing
    if (args.sku && args.sku !== item.sku) {
      const existingSku = await ctx.db
        .query("priceBookItems")
        .withIndex("by_company_sku", (q) =>
          q.eq("companyId", item.companyId).eq("sku", args.sku!)
        )
        .first();

      if (existingSku && existingSku._id !== args.id && !existingSku.deletedAt) {
        throw new Error(`SKU "${args.sku}" already exists`);
      }
    }

    const { id, ...updates } = args;
    const changes = trackChanges(item, updates);

    // Rebuild search text if relevant fields changed
    const name = args.name ?? item.name;
    const sku = args.sku ?? item.sku;
    const description = args.description ?? item.description;
    const category = args.category ?? item.category;
    const searchText = [name, sku, description, category]
      .filter(Boolean)
      .join(" ");

    await ctx.db.patch(args.id, {
      ...updates,
      searchText,
      updatedBy: userId,
    });

    // Handle inventory tracking changes
    if (args.trackInventory !== undefined && args.trackInventory !== item.trackInventory) {
      if (args.trackInventory) {
        // Create inventory record
        await ctx.db.insert("inventory", {
          companyId: item.companyId,
          priceBookItemId: args.id,
          quantityOnHand: 0,
          quantityReserved: 0,
          quantityAvailable: 0,
          costPerUnit: args.costPrice ?? item.costPrice,
          totalCostValue: 0,
          isLowStock: false,
          lowStockAlertSent: false,
          status: "active",
          createdBy: userId,
          updatedBy: userId,
        });
      }
      // Note: We don't delete inventory records when tracking is disabled
    }

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: item.companyId,
        userId,
        action: "price_book_item.updated",
        entityType: "price_book_item",
        entityId: args.id,
        previousValues: Object.fromEntries(
          Object.keys(changes).map((k) => [k, item[k as keyof typeof item]])
        ),
        newValues: changes,
      });
    }

    return args.id;
  },
});

/**
 * Activate a price book item
 */
export const activate = mutation({
  args: { id: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "update"
    );

    await ctx.db.patch(args.id, {
      isActive: true,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: item.companyId,
      userId,
      action: "price_book_item.activated",
      entityType: "price_book_item",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Deactivate a price book item
 */
export const deactivate = mutation({
  args: { id: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "update"
    );

    await ctx.db.patch(args.id, {
      isActive: false,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: item.companyId,
      userId,
      action: "price_book_item.deactivated",
      entityType: "price_book_item",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Update price
 */
export const updatePrice = mutation({
  args: {
    id: v.id("priceBookItems"),
    unitPrice: v.number(),
    costPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "update"
    );

    const updates: Record<string, unknown> = {
      unitPrice: args.unitPrice,
      updatedBy: userId,
    };

    if (args.costPrice !== undefined) {
      updates.costPrice = args.costPrice;
    }

    await ctx.db.patch(args.id, updates);

    await createAuditLog(ctx, {
      companyId: item.companyId,
      userId,
      action: "price_book_item.price_updated",
      entityType: "price_book_item",
      entityId: args.id,
      previousValues: {
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
      },
      newValues: {
        unitPrice: args.unitPrice,
        costPrice: args.costPrice ?? item.costPrice,
      },
    });

    return args.id;
  },
});

/**
 * Bulk price adjustment
 */
export const bulkPriceAdjust = mutation({
  args: {
    companyId: v.id("companies"),
    itemIds: v.array(v.id("priceBookItems")),
    adjustmentType: v.union(v.literal("percentage"), v.literal("fixed")),
    adjustmentValue: v.number(),
    adjustField: v.union(v.literal("unitPrice"), v.literal("costPrice")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requirePermissionForAction(
      ctx,
      args.companyId,
      "price_book",
      "update"
    );

    const now = Date.now();
    let updatedCount = 0;

    for (const itemId of args.itemIds) {
      const item = await ctx.db.get(itemId);
      if (!item || item.deletedAt || item.companyId !== args.companyId) {
        continue;
      }

      const currentPrice = args.adjustField === "unitPrice"
        ? item.unitPrice
        : (item.costPrice ?? 0);

      let newPrice: number;
      if (args.adjustmentType === "percentage") {
        newPrice = Math.round(currentPrice * (1 + args.adjustmentValue / 100));
      } else {
        newPrice = currentPrice + args.adjustmentValue;
      }

      // Ensure price doesn't go negative
      newPrice = Math.max(0, newPrice);

      await ctx.db.patch(itemId, {
        [args.adjustField]: newPrice,
        updatedBy: userId,
      });

      updatedCount++;
    }

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId,
      action: "price_book_item.bulk_price_adjusted",
      entityType: "price_book_item",
      newValues: {
        itemCount: updatedCount,
        adjustmentType: args.adjustmentType,
        adjustmentValue: args.adjustmentValue,
        adjustField: args.adjustField,
      },
    });

    return { updatedCount };
  },
});

/**
 * Duplicate a price book item
 */
export const duplicate = mutation({
  args: {
    id: v.id("priceBookItems"),
    newSku: v.string(),
    newName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "create"
    );

    // Check SKU uniqueness
    const existingSku = await ctx.db
      .query("priceBookItems")
      .withIndex("by_company_sku", (q) =>
        q.eq("companyId", item.companyId).eq("sku", args.newSku)
      )
      .first();

    if (existingSku && !existingSku.deletedAt) {
      throw new Error(`SKU "${args.newSku}" already exists`);
    }

    const newName = args.newName ?? `${item.name} (Copy)`;
    const searchText = [newName, args.newSku, item.description, item.category]
      .filter(Boolean)
      .join(" ");

    const now = Date.now();
    const newItemId = await ctx.db.insert("priceBookItems", {
      companyId: item.companyId,
      sku: args.newSku,
      name: newName,
      description: item.description,
      type: item.type,
      category: item.category,
      subcategory: item.subcategory,
      unitPrice: item.unitPrice,
      costPrice: item.costPrice,
      laborHours: item.laborHours,
      taxable: item.taxable,
      taxRate: item.taxRate,
      trackInventory: item.trackInventory,
      isActive: item.isActive,
      tags: item.tags,
      metadata: item.metadata,
      searchText,
      createdBy: userId,
      updatedBy: userId,
    });

    // Create inventory record if tracking is enabled
    if (item.trackInventory) {
      await ctx.db.insert("inventory", {
        companyId: item.companyId,
        priceBookItemId: newItemId,
        quantityOnHand: 0,
        quantityReserved: 0,
        quantityAvailable: 0,
        costPerUnit: item.costPrice,
        totalCostValue: 0,
        isLowStock: false,
        lowStockAlertSent: false,
        status: "active",
        createdBy: userId,
        updatedBy: userId,
      });
    }

    await createAuditLog(ctx, {
      companyId: item.companyId,
      userId,
      action: "price_book_item.duplicated",
      entityType: "price_book_item",
      entityId: newItemId,
      newValues: {
        sku: args.newSku,
        name: newName,
        sourceItemId: args.id,
      },
    });

    return newItemId;
  },
});

/**
 * Archive a price book item (soft delete)
 */
export const archive = mutation({
  args: { id: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "delete"
    );

    await ctx.db.patch(args.id, {
      archivedAt: Date.now(),
      archivedBy: userId,
      isActive: false,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: item.companyId,
      userId,
      action: "price_book_item.archived",
      entityType: "price_book_item",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Unarchive a price book item
 */
export const unarchive = mutation({
  args: { id: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || item.deletedAt) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "update"
    );

    await ctx.db.patch(args.id, {
      archivedAt: undefined,
      archivedBy: undefined,
      updatedBy: userId,
    });

    await createAuditLog(ctx, {
      companyId: item.companyId,
      userId,
      action: "price_book_item.unarchived",
      entityType: "price_book_item",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Permanently remove a price book item
 */
export const remove = mutation({
  args: { id: v.id("priceBookItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Price book item not found");
    }

    const { userId } = await requirePermissionForAction(
      ctx,
      item.companyId,
      "price_book",
      "delete"
    );

    // Soft delete
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      deletedBy: userId,
      isActive: false,
      updatedBy: userId,
    });

    // Also soft delete associated inventory record
    const inventory = await ctx.db
      .query("inventory")
      .withIndex("by_price_book_item", (q) =>
        q.eq("priceBookItemId", args.id)
      )
      .first();

    if (inventory) {
      await ctx.db.patch(inventory._id, {
        deletedAt: Date.now(),
        deletedBy: userId,
        updatedBy: userId,
      });
    }

    await createAuditLog(ctx, {
      companyId: item.companyId,
      userId,
      action: "price_book_item.removed",
      entityType: "price_book_item",
      entityId: args.id,
    });

    return args.id;
  },
});

// ==========================================================================
// INTERNAL MUTATIONS (for migration)
// ==========================================================================

/**
 * Import price book item from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companyId: v.id("companies"),
    sku: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    type: priceBookItemType,
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    unitPrice: v.number(),
    costPrice: v.optional(v.number()),
    laborHours: v.optional(v.number()),
    taxable: v.boolean(),
    taxRate: v.optional(v.number()),
    trackInventory: v.boolean(),
    isActive: v.boolean(),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
    // Note: createdAt and updatedAt are not stored - Convex uses _creationTime
  },
  handler: async (ctx, args) => {
    const { supabaseId, ...itemData } = args;

    // Check if already migrated
    const existing = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "price_book_items").eq("supabaseId", supabaseId)
      )
      .first();

    if (existing) {
      return existing.convexId;
    }

    // Build search text
    const searchText = [
      itemData.name,
      itemData.sku,
      itemData.description,
      itemData.category,
    ]
      .filter(Boolean)
      .join(" ");

    const itemId = await ctx.db.insert("priceBookItems", {
      ...itemData,
      searchText,
    });

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "price_book_items",
      supabaseId,
      convexId: itemId,
      migratedAt: Date.now(),
    });

    return itemId;
  },
});
