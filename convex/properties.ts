/**
 * Property queries and mutations
 * Replaces apps/web/src/lib/queries/properties.ts and apps/web/src/actions/properties.ts
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
import { propertyType } from "./lib/validators";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List properties for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    customerId: v.optional(v.id("customers")),
    activeOnly: v.optional(v.boolean()),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_customers");

    let query = ctx.db
      .query("properties")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.customerId) {
      query = ctx.db
        .query("properties")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId!));
    }

    if (args.activeOnly) {
      query = ctx.db
        .query("properties")
        .withIndex("by_company_active", (q) =>
          q.eq("companyId", args.companyId).eq("isActive", true)
        );
    }

    let properties = await query.collect();

    // Filter by company if we used customer index
    if (args.customerId) {
      properties = properties.filter((p) => p.companyId === args.companyId);
    }

    properties = excludeDeleted(properties);

    if (!args.includeArchived) {
      properties = properties.filter((p) => !p.archivedAt);
    }

    const limit = args.limit ?? 100;
    properties = properties.slice(0, limit);

    return {
      properties,
      total: properties.length,
      hasMore: properties.length === limit,
    };
  },
});

/**
 * Get a single property by ID
 */
export const get = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    await requireCompanyAccess(ctx, property.companyId);

    if (property.deletedAt) {
      throw new Error("Property not found");
    }

    return property;
  },
});

/**
 * Get property with related data
 */
export const getComplete = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    await requireCompanyAccess(ctx, property.companyId);

    const [customer, jobs, equipment, allServicePlans] = await Promise.all([
      ctx.db.get(property.customerId),
      // Get jobs at this property
      ctx.db
        .query("jobs")
        .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .order("desc")
        .take(10),
      // Get equipment at this property
      ctx.db
        .query("equipment")
        .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      // Get service plans for this property (query by company, filter by property)
      ctx.db
        .query("servicePlans")
        .withIndex("by_company", (q) => q.eq("companyId", property.companyId))
        .filter((q) =>
          q.and(
            q.eq(q.field("deletedAt"), undefined),
            q.eq(q.field("status"), "active")
          )
        )
        .collect(),
    ]);

    // Filter service plans by property
    const servicePlans = allServicePlans.filter(
      (plan) => plan.propertyId === args.propertyId
    );

    return {
      property,
      customer,
      jobs,
      equipment,
      servicePlans,
      stats: {
        totalJobs: jobs.length,
        totalEquipment: equipment.length,
        activeServicePlans: servicePlans.length,
      },
    };
  },
});

/**
 * Get properties by customer
 */
export const getByCustomer = query({
  args: {
    customerId: v.id("customers"),
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    await requireCompanyAccess(ctx, customer.companyId);

    let properties = await ctx.db
      .query("properties")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (!args.includeInactive) {
      properties = properties.filter((p) => p.isActive);
    }

    // Sort primary first, then by name/address
    properties.sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return (a.name || a.address).localeCompare(b.name || b.address);
    });

    return properties;
  },
});

/**
 * Search properties
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const properties = await ctx.db
      .query("properties")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();
    const filtered = properties.filter(
      (p) =>
        p.address.toLowerCase().includes(searchLower) ||
        p.city.toLowerCase().includes(searchLower) ||
        p.zipCode.toLowerCase().includes(searchLower) ||
        p.name?.toLowerCase().includes(searchLower)
    );

    const limit = args.limit ?? 20;
    return filtered.slice(0, limit);
  },
});

/**
 * Get property stats for dashboard
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const properties = await ctx.db
      .query("properties")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const active = properties.filter((p) => !p.archivedAt && p.isActive);

    return {
      total: properties.length,
      active: active.length,
      inactive: properties.filter((p) => !p.archivedAt && !p.isActive).length,
      archived: properties.filter((p) => p.archivedAt).length,
      byType: {
        residential: active.filter((p) => p.type === "residential").length,
        commercial: active.filter((p) => p.type === "commercial").length,
        industrial: active.filter((p) => p.type === "industrial").length,
        mixed_use: active.filter((p) => p.type === "mixed_use").length,
      },
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new property
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    type: propertyType,

    name: v.optional(v.string()),
    address: v.string(),
    address2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    country: v.optional(v.string()),

    squareFootage: v.optional(v.number()),
    yearBuilt: v.optional(v.number()),
    numberOfUnits: v.optional(v.number()),

    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),

    isPrimary: v.optional(v.boolean()),
    accessNotes: v.optional(v.string()),
    gateCode: v.optional(v.string()),
    notes: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_customers");

    // Validate customer
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.companyId !== args.companyId) {
      throw new Error("Invalid customer");
    }

    // Check if this should be primary
    const existingProperties = await ctx.db
      .query("properties")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    // If this is the first property or explicitly set as primary, make it primary
    const isPrimary = args.isPrimary ?? existingProperties.length === 0;

    // If setting as primary, unset others
    if (isPrimary) {
      for (const prop of existingProperties) {
        if (prop.isPrimary) {
          await ctx.db.patch(prop._id, { isPrimary: false });
        }
      }
    }

    const propertyId = await ctx.db.insert("properties", {
      companyId: args.companyId,
      customerId: args.customerId,
      type: args.type,
      name: args.name?.trim(),
      address: args.address.trim(),
      address2: args.address2?.trim(),
      city: args.city.trim(),
      state: args.state.trim(),
      zipCode: args.zipCode.trim(),
      country: args.country?.trim() ?? "USA",
      squareFootage: args.squareFootage,
      yearBuilt: args.yearBuilt,
      numberOfUnits: args.numberOfUnits,
      latitude: args.latitude,
      longitude: args.longitude,
      isPrimary,
      isActive: true,
      accessNotes: args.accessNotes,
      gateCode: args.gateCode,
      notes: args.notes,
      customFields: args.customFields,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "property",
      entityId: propertyId,
      metadata: { address: args.address, customerId: args.customerId },
    });

    return propertyId;
  },
});

/**
 * Update a property
 */
export const update = mutation({
  args: {
    propertyId: v.id("properties"),

    type: v.optional(propertyType),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    squareFootage: v.optional(v.number()),
    yearBuilt: v.optional(v.number()),
    numberOfUnits: v.optional(v.number()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    accessNotes: v.optional(v.string()),
    gateCode: v.optional(v.string()),
    notes: v.optional(v.string()),
    customFields: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { propertyId, ...updates } = args;

    const property = await ctx.db.get(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const authCtx = await requireCompanyAccess(ctx, property.companyId);
    requirePermission(authCtx, "create_customers");

    if (property.deletedAt) {
      throw new Error("Cannot update deleted property");
    }

    const changes = trackChanges(property, updates);

    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    await ctx.db.patch(propertyId, updateData);

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: property.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "property",
        entityId: propertyId,
        changes,
      });
    }

    return propertyId;
  },
});

/**
 * Set a property as primary for its customer
 */
export const setAsPrimary = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const authCtx = await requireCompanyAccess(ctx, property.companyId);
    requirePermission(authCtx, "create_customers");

    if (property.isPrimary) {
      return args.propertyId; // Already primary
    }

    // Unset current primary
    const currentPrimary = await ctx.db
      .query("properties")
      .withIndex("by_customer", (q) => q.eq("customerId", property.customerId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("isPrimary"), true)
        )
      )
      .first();

    if (currentPrimary) {
      await ctx.db.patch(currentPrimary._id, { isPrimary: false });
    }

    // Set new primary
    await ctx.db.patch(args.propertyId, {
      isPrimary: true,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: property.companyId,
      userId: authCtx.userId,
      action: "set_primary",
      entityType: "property",
      entityId: args.propertyId,
    });

    return args.propertyId;
  },
});

/**
 * Archive a property
 */
export const archive = mutation({
  args: {
    propertyId: v.id("properties"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const authCtx = await requireCompanyAccess(ctx, property.companyId);
    requirePermission(authCtx, "create_customers");

    if (property.archivedAt) {
      throw new Error("Property is already archived");
    }

    await ctx.db.patch(args.propertyId, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
      isActive: false,
    });

    await createAuditLog(ctx, {
      companyId: property.companyId,
      userId: authCtx.userId,
      action: "archive",
      entityType: "property",
      entityId: args.propertyId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Unarchive a property
 */
export const unarchive = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const authCtx = await requireCompanyAccess(ctx, property.companyId);
    requirePermission(authCtx, "create_customers");

    if (!property.archivedAt) {
      throw new Error("Property is not archived");
    }

    await ctx.db.patch(args.propertyId, {
      archivedAt: undefined,
      archivedBy: undefined,
      isActive: true,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: property.companyId,
      userId: authCtx.userId,
      action: "unarchive",
      entityType: "property",
      entityId: args.propertyId,
    });

    return { success: true };
  },
});

/**
 * Delete a property (soft delete)
 */
export const remove = mutation({
  args: {
    propertyId: v.id("properties"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const authCtx = await requireCompanyAccess(ctx, property.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete properties");
    }

    // Check for active jobs
    const activeJobs = await ctx.db
      .query("jobs")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.neq(q.field("status"), "completed"),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .take(1);

    if (activeJobs.length > 0) {
      throw new Error("Cannot delete property with active jobs");
    }

    await ctx.db.patch(args.propertyId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: property.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "property",
      entityId: args.propertyId,
      metadata: { address: property.address, reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Geocode a property address (update lat/lng)
 */
export const updateLocation = mutation({
  args: {
    propertyId: v.id("properties"),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const authCtx = await requireCompanyAccess(ctx, property.companyId);
    requirePermission(authCtx, "create_customers");

    await ctx.db.patch(args.propertyId, {
      latitude: args.latitude,
      longitude: args.longitude,
      updatedBy: authCtx.userId,
    });

    return args.propertyId;
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import property from Supabase during migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.string(),
    type: v.string(),
    name: v.optional(v.string()),
    address: v.string(),
    address2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    country: v.optional(v.string()),
    squareFootage: v.optional(v.number()),
    yearBuilt: v.optional(v.number()),
    numberOfUnits: v.optional(v.number()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isPrimary: v.boolean(),
    isActive: v.boolean(),
    accessNotes: v.optional(v.string()),
    gateCode: v.optional(v.string()),
    notes: v.optional(v.string()),
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

    // Look up customer mapping
    const customerMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "customers").eq("supabaseId", args.customerSupabaseId)
      )
      .unique();

    if (!customerMapping) {
      throw new Error(`Customer not found: ${args.customerSupabaseId}`);
    }

    // Check if already migrated
    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "properties").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    const propertyId = await ctx.db.insert("properties", {
      companyId: companyMapping.convexId as any,
      customerId: customerMapping.convexId as any,
      type: args.type as any,
      name: args.name,
      address: args.address,
      address2: args.address2,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      country: args.country ?? "USA",
      squareFootage: args.squareFootage,
      yearBuilt: args.yearBuilt,
      numberOfUnits: args.numberOfUnits,
      latitude: args.latitude,
      longitude: args.longitude,
      isPrimary: args.isPrimary,
      isActive: args.isActive,
      accessNotes: args.accessNotes,
      gateCode: args.gateCode,
      notes: args.notes,
    });

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "properties",
      supabaseId: args.supabaseId,
      convexId: propertyId,
      migratedAt: Date.now(),
    });

    return propertyId;
  },
});
