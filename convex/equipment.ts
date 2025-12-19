/**
 * Equipment queries and mutations
 * Replaces apps/web/src/lib/queries/equipment.ts and apps/web/src/actions/equipment.ts
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
import { equipmentType, equipmentCondition, equipmentStatus } from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate equipment number
 */
async function generateEquipmentNumber(ctx: any, companyId: any): Promise<string> {
  const equipment = await ctx.db
    .query("equipment")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const nextNumber = equipment.length + 1;
  return `EQ-${nextNumber.toString().padStart(5, "0")}`;
}

/**
 * Build search text for full-text search
 */
function buildSearchText(
  name: string,
  manufacturer?: string,
  model?: string,
  serialNumber?: string,
  category?: string
): string {
  return [name, manufacturer, model, serialNumber, category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List equipment for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(equipmentStatus),
    type: v.optional(equipmentType),
    customerId: v.optional(v.id("customers")),
    propertyId: v.optional(v.id("properties")),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_equipment");

    let query = ctx.db
      .query("equipment")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = ctx.db
        .query("equipment")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    if (args.type) {
      query = ctx.db
        .query("equipment")
        .withIndex("by_company_type", (q) =>
          q.eq("companyId", args.companyId).eq("type", args.type!)
        );
    }

    if (args.customerId) {
      query = ctx.db
        .query("equipment")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId!));
    }

    if (args.propertyId) {
      query = ctx.db
        .query("equipment")
        .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId!));
    }

    let equipment = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId || args.propertyId) {
      equipment = equipment.filter((eq) => eq.companyId === args.companyId);
    }

    equipment = excludeDeleted(equipment);

    if (!args.includeArchived) {
      equipment = equipment.filter((eq) => !eq.archivedAt);
    }

    const limit = args.limit ?? 100;
    equipment = equipment.slice(0, limit);

    return {
      equipment,
      total: equipment.length,
      hasMore: equipment.length === limit,
    };
  },
});

/**
 * Get a single equipment by ID
 */
export const get = query({
  args: { equipmentId: v.id("equipment") },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    await requireCompanyAccess(ctx, equipment.companyId);

    if (equipment.deletedAt) {
      throw new Error("Equipment not found");
    }

    return equipment;
  },
});

/**
 * Get equipment with related data
 */
export const getComplete = query({
  args: { equipmentId: v.id("equipment") },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    await requireCompanyAccess(ctx, equipment.companyId);

    const [customer, property, servicePlan, recentJobs, installedBy, lastServiceJob] =
      await Promise.all([
        ctx.db.get(equipment.customerId),
        ctx.db.get(equipment.propertyId),
        equipment.servicePlanId ? ctx.db.get(equipment.servicePlanId) : null,
        // Get recent jobs for this equipment
        ctx.db
          .query("jobEquipment")
          .withIndex("by_equipment", (q) => q.eq("equipmentId", args.equipmentId))
          .take(10),
        equipment.installedBy ? ctx.db.get(equipment.installedBy) : null,
        equipment.lastServiceJobId ? ctx.db.get(equipment.lastServiceJobId) : null,
      ]);

    // Fetch the actual jobs
    const jobs = await Promise.all(
      recentJobs.map(async (je) => {
        const job = await ctx.db.get(je.jobId);
        return job ? { ...job, notes: je.notes } : null;
      })
    );

    return {
      equipment,
      customer,
      property,
      servicePlan,
      installedBy,
      lastServiceJob,
      recentJobs: jobs.filter(Boolean),
      warranty: equipment.warrantyExpiration
        ? {
            isActive: equipment.warrantyExpiration > Date.now(),
            expiresAt: equipment.warrantyExpiration,
            provider: equipment.warrantyProvider,
            notes: equipment.warrantyNotes,
          }
        : null,
    };
  },
});

/**
 * Get equipment by property
 */
export const getByProperty = query({
  args: {
    propertyId: v.id("properties"),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    await requireCompanyAccess(ctx, property.companyId);

    let equipment = await ctx.db
      .query("equipment")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (args.activeOnly) {
      equipment = equipment.filter((eq) => eq.status === "active");
    }

    return equipment;
  },
});

/**
 * Get equipment by customer
 */
export const getByCustomer = query({
  args: {
    customerId: v.id("customers"),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    await requireCompanyAccess(ctx, customer.companyId);

    let equipment = await ctx.db
      .query("equipment")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (args.activeOnly) {
      equipment = equipment.filter((eq) => eq.status === "active");
    }

    return equipment;
  },
});

/**
 * Search equipment
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
    status: v.optional(equipmentStatus),
    type: v.optional(equipmentType),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    // Use search index if available
    const searchResults = await ctx.db
      .query("equipment")
      .withSearchIndex("search_equipment", (q) => {
        let query = q.search("searchText", args.searchTerm);
        query = query.eq("companyId", args.companyId);
        if (args.status) {
          query = query.eq("status", args.status);
        }
        if (args.type) {
          query = query.eq("type", args.type);
        }
        return query;
      })
      .take(args.limit ?? 20);

    return excludeDeleted(searchResults);
  },
});

/**
 * Get equipment stats for dashboard
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const equipment = await ctx.db
      .query("equipment")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const active = equipment.filter((eq) => !eq.archivedAt);
    const now = Date.now();
    const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

    return {
      total: equipment.length,
      active: active.filter((eq) => eq.status === "active").length,
      inactive: active.filter((eq) => eq.status === "inactive").length,
      retired: active.filter((eq) => eq.status === "retired").length,
      replaced: active.filter((eq) => eq.status === "replaced").length,
      underWarranty: active.filter(
        (eq) => eq.isUnderWarranty || (eq.warrantyExpiration && eq.warrantyExpiration > now)
      ).length,
      warrantyExpiringSoon: active.filter(
        (eq) =>
          eq.warrantyExpiration &&
          eq.warrantyExpiration > now &&
          eq.warrantyExpiration < thirtyDaysFromNow
      ).length,
      serviceDueSoon: active.filter(
        (eq) =>
          eq.nextServiceDue &&
          eq.nextServiceDue > now &&
          eq.nextServiceDue < thirtyDaysFromNow
      ).length,
      serviceOverdue: active.filter(
        (eq) => eq.nextServiceDue && eq.nextServiceDue < now
      ).length,
      byType: {
        hvac: active.filter((eq) => eq.type === "hvac").length,
        plumbing: active.filter((eq) => eq.type === "plumbing").length,
        electrical: active.filter((eq) => eq.type === "electrical").length,
        appliance: active.filter((eq) => eq.type === "appliance").length,
        water_heater: active.filter((eq) => eq.type === "water_heater").length,
        furnace: active.filter((eq) => eq.type === "furnace").length,
        ac_unit: active.filter((eq) => eq.type === "ac_unit").length,
        other: active.filter((eq) => eq.type === "other").length,
      },
      byCondition: {
        excellent: active.filter((eq) => eq.condition === "excellent").length,
        good: active.filter((eq) => eq.condition === "good").length,
        fair: active.filter((eq) => eq.condition === "fair").length,
        poor: active.filter((eq) => eq.condition === "poor").length,
        needs_replacement: active.filter((eq) => eq.condition === "needs_replacement").length,
      },
    };
  },
});

/**
 * Get equipment with service due soon
 */
export const getServiceDue = query({
  args: {
    companyId: v.id("companies"),
    daysAhead: v.optional(v.number()),
    includeOverdue: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const now = Date.now();
    const daysAhead = args.daysAhead ?? 30;
    const futureDate = now + daysAhead * 24 * 60 * 60 * 1000;

    let equipment = await ctx.db
      .query("equipment")
      .withIndex("by_service_due", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("status"), "active"),
          q.neq(q.field("nextServiceDue"), undefined)
        )
      )
      .collect();

    if (args.includeOverdue) {
      equipment = equipment.filter((eq) => eq.nextServiceDue! <= futureDate);
    } else {
      equipment = equipment.filter(
        (eq) => eq.nextServiceDue! >= now && eq.nextServiceDue! <= futureDate
      );
    }

    // Sort by service due date
    equipment.sort((a, b) => (a.nextServiceDue ?? 0) - (b.nextServiceDue ?? 0));

    const limit = args.limit ?? 50;
    const results = equipment.slice(0, limit);

    // Enrich with customer/property data
    const enriched = await Promise.all(
      results.map(async (eq) => {
        const [customer, property] = await Promise.all([
          ctx.db.get(eq.customerId),
          ctx.db.get(eq.propertyId),
        ]);
        return {
          ...eq,
          customer: customer
            ? { _id: customer._id, displayName: customer.displayName }
            : null,
          property: property
            ? { _id: property._id, address: property.address }
            : null,
          isOverdue: eq.nextServiceDue! < now,
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
 * Create new equipment
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    propertyId: v.id("properties"),

    name: v.string(),
    type: equipmentType,
    category: v.optional(v.string()),

    manufacturer: v.optional(v.string()),
    model: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    modelYear: v.optional(v.number()),

    installDate: v.optional(v.number()),
    installJobId: v.optional(v.id("jobs")),

    warrantyExpiration: v.optional(v.number()),
    warrantyProvider: v.optional(v.string()),
    warrantyNotes: v.optional(v.string()),

    serviceIntervalDays: v.optional(v.number()),
    servicePlanId: v.optional(v.id("servicePlans")),

    capacity: v.optional(v.string()),
    efficiency: v.optional(v.string()),
    fuelType: v.optional(v.string()),
    location: v.optional(v.string()),

    condition: v.optional(equipmentCondition),
    photos: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_equipment");

    // Validate customer
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.companyId !== args.companyId) {
      throw new Error("Invalid customer");
    }

    // Validate property
    const property = await ctx.db.get(args.propertyId);
    if (!property || property.companyId !== args.companyId) {
      throw new Error("Invalid property");
    }

    // Generate equipment number
    const equipmentNumber = await generateEquipmentNumber(ctx, args.companyId);

    // Check warranty status
    const isUnderWarranty = args.warrantyExpiration
      ? args.warrantyExpiration > Date.now()
      : false;

    // Calculate next service due if interval provided
    const nextServiceDue = args.serviceIntervalDays
      ? Date.now() + args.serviceIntervalDays * 24 * 60 * 60 * 1000
      : undefined;

    // Build search text
    const searchText = buildSearchText(
      args.name,
      args.manufacturer,
      args.model,
      args.serialNumber,
      args.category
    );

    const equipmentId = await ctx.db.insert("equipment", {
      companyId: args.companyId,
      customerId: args.customerId,
      propertyId: args.propertyId,
      equipmentNumber,
      name: args.name.trim(),
      type: args.type,
      category: args.category?.trim(),
      manufacturer: args.manufacturer?.trim(),
      model: args.model?.trim(),
      serialNumber: args.serialNumber?.trim(),
      modelYear: args.modelYear,
      installDate: args.installDate,
      installedBy: authCtx.userId,
      installJobId: args.installJobId,
      warrantyExpiration: args.warrantyExpiration,
      warrantyProvider: args.warrantyProvider?.trim(),
      warrantyNotes: args.warrantyNotes,
      isUnderWarranty,
      serviceIntervalDays: args.serviceIntervalDays,
      nextServiceDue,
      servicePlanId: args.servicePlanId,
      capacity: args.capacity?.trim(),
      efficiency: args.efficiency?.trim(),
      fuelType: args.fuelType?.trim(),
      location: args.location?.trim(),
      condition: args.condition ?? "good",
      status: "active",
      photos: args.photos,
      notes: args.notes,
      customerNotes: args.customerNotes,
      metadata: args.metadata,
      searchText,
      totalServiceCount: 0,
      totalServiceCost: 0,
      averageServiceCost: 0,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "equipment",
      entityId: equipmentId,
      metadata: { equipmentNumber, name: args.name, type: args.type },
    });

    return equipmentId;
  },
});

/**
 * Update equipment
 */
export const update = mutation({
  args: {
    equipmentId: v.id("equipment"),

    name: v.optional(v.string()),
    type: v.optional(equipmentType),
    category: v.optional(v.string()),
    manufacturer: v.optional(v.string()),
    model: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    modelYear: v.optional(v.number()),
    installDate: v.optional(v.number()),
    warrantyExpiration: v.optional(v.number()),
    warrantyProvider: v.optional(v.string()),
    warrantyNotes: v.optional(v.string()),
    serviceIntervalDays: v.optional(v.number()),
    servicePlanId: v.optional(v.id("servicePlans")),
    capacity: v.optional(v.string()),
    efficiency: v.optional(v.string()),
    fuelType: v.optional(v.string()),
    location: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { equipmentId, ...updates } = args;

    const equipment = await ctx.db.get(equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, equipment.companyId);
    requirePermission(authCtx, "create_equipment");

    if (equipment.deletedAt) {
      throw new Error("Cannot update deleted equipment");
    }

    const changes = trackChanges(equipment, updates);

    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    // Update warranty status if warranty date changed
    if (updates.warrantyExpiration !== undefined) {
      updateData.isUnderWarranty = updates.warrantyExpiration > Date.now();
    }

    // Rebuild search text if relevant fields changed
    if (updates.name || updates.manufacturer || updates.model || updates.serialNumber || updates.category) {
      updateData.searchText = buildSearchText(
        updates.name ?? equipment.name,
        updates.manufacturer ?? equipment.manufacturer,
        updates.model ?? equipment.model,
        updates.serialNumber ?? equipment.serialNumber,
        updates.category ?? equipment.category
      );
    }

    await ctx.db.patch(equipmentId, updateData);

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: equipment.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "equipment",
        entityId: equipmentId,
        changes,
      });
    }

    return equipmentId;
  },
});

/**
 * Update equipment status
 */
export const updateStatus = mutation({
  args: {
    equipmentId: v.id("equipment"),
    status: equipmentStatus,
    replacedByEquipmentId: v.optional(v.id("equipment")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, equipment.companyId);
    requirePermission(authCtx, "create_equipment");

    const updateData: Record<string, unknown> = {
      status: args.status,
      updatedBy: authCtx.userId,
    };

    if (args.status === "replaced") {
      updateData.replacedDate = Date.now();
      if (args.replacedByEquipmentId) {
        updateData.replacedByEquipmentId = args.replacedByEquipmentId;
      }
    }

    await ctx.db.patch(args.equipmentId, updateData);

    await createAuditLog(ctx, {
      companyId: equipment.companyId,
      userId: authCtx.userId,
      action: "update_status",
      entityType: "equipment",
      entityId: args.equipmentId,
      metadata: {
        oldStatus: equipment.status,
        newStatus: args.status,
        reason: args.reason,
      },
    });

    return args.equipmentId;
  },
});

/**
 * Update equipment condition
 */
export const updateCondition = mutation({
  args: {
    equipmentId: v.id("equipment"),
    condition: equipmentCondition,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, equipment.companyId);
    requirePermission(authCtx, "create_equipment");

    await ctx.db.patch(args.equipmentId, {
      condition: args.condition,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: equipment.companyId,
      userId: authCtx.userId,
      action: "update_condition",
      entityType: "equipment",
      entityId: args.equipmentId,
      metadata: {
        oldCondition: equipment.condition,
        newCondition: args.condition,
        notes: args.notes,
      },
    });

    return args.equipmentId;
  },
});

/**
 * Record service performed on equipment
 */
export const recordService = mutation({
  args: {
    equipmentId: v.id("equipment"),
    jobId: v.id("jobs"),
    serviceCost: v.optional(v.number()), // cents
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, equipment.companyId);
    requirePermission(authCtx, "create_equipment");

    const now = Date.now();
    const newServiceCount = (equipment.totalServiceCount ?? 0) + 1;
    const newTotalCost = (equipment.totalServiceCost ?? 0) + (args.serviceCost ?? 0);
    const newAverageCost = Math.round(newTotalCost / newServiceCount);

    // Calculate next service due
    const nextServiceDue = equipment.serviceIntervalDays
      ? now + equipment.serviceIntervalDays * 24 * 60 * 60 * 1000
      : equipment.nextServiceDue;

    await ctx.db.patch(args.equipmentId, {
      lastServiceDate: now,
      lastServiceJobId: args.jobId,
      nextServiceDue,
      totalServiceCount: newServiceCount,
      totalServiceCost: newTotalCost,
      averageServiceCost: newAverageCost,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: equipment.companyId,
      userId: authCtx.userId,
      action: "record_service",
      entityType: "equipment",
      entityId: args.equipmentId,
      metadata: { jobId: args.jobId, serviceCost: args.serviceCost, notes: args.notes },
    });

    return args.equipmentId;
  },
});

/**
 * Archive equipment
 */
export const archive = mutation({
  args: {
    equipmentId: v.id("equipment"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, equipment.companyId);
    requirePermission(authCtx, "create_equipment");

    if (equipment.archivedAt) {
      throw new Error("Equipment is already archived");
    }

    await ctx.db.patch(args.equipmentId, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
      status: "inactive",
    });

    await createAuditLog(ctx, {
      companyId: equipment.companyId,
      userId: authCtx.userId,
      action: "archive",
      entityType: "equipment",
      entityId: args.equipmentId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Unarchive equipment
 */
export const unarchive = mutation({
  args: { equipmentId: v.id("equipment") },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, equipment.companyId);
    requirePermission(authCtx, "create_equipment");

    if (!equipment.archivedAt) {
      throw new Error("Equipment is not archived");
    }

    await ctx.db.patch(args.equipmentId, {
      archivedAt: undefined,
      archivedBy: undefined,
      status: "active",
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: equipment.companyId,
      userId: authCtx.userId,
      action: "unarchive",
      entityType: "equipment",
      entityId: args.equipmentId,
    });

    return { success: true };
  },
});

/**
 * Delete equipment (soft delete)
 */
export const remove = mutation({
  args: {
    equipmentId: v.id("equipment"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, equipment.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete equipment");
    }

    await ctx.db.patch(args.equipmentId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: equipment.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "equipment",
      entityId: args.equipmentId,
      metadata: {
        equipmentNumber: equipment.equipmentNumber,
        name: equipment.name,
        reason: args.reason,
      },
    });

    return { success: true };
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import equipment from Supabase during migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.string(),
    propertySupabaseId: v.string(),
    equipmentNumber: v.string(),
    name: v.string(),
    type: v.string(),
    category: v.optional(v.string()),
    manufacturer: v.optional(v.string()),
    model: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    modelYear: v.optional(v.number()),
    installDate: v.optional(v.number()),
    warrantyExpiration: v.optional(v.number()),
    warrantyProvider: v.optional(v.string()),
    isUnderWarranty: v.boolean(),
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    serviceIntervalDays: v.optional(v.number()),
    condition: v.string(),
    status: v.string(),
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

    // Look up property mapping
    const propertyMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "properties").eq("supabaseId", args.propertySupabaseId)
      )
      .unique();

    if (!propertyMapping) {
      throw new Error(`Property not found: ${args.propertySupabaseId}`);
    }

    // Check if already migrated
    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "equipment").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    const searchText = buildSearchText(
      args.name,
      args.manufacturer,
      args.model,
      args.serialNumber,
      args.category
    );

    const equipmentId = await ctx.db.insert("equipment", {
      companyId: companyMapping.convexId as any,
      customerId: customerMapping.convexId as any,
      propertyId: propertyMapping.convexId as any,
      equipmentNumber: args.equipmentNumber,
      name: args.name,
      type: args.type as any,
      category: args.category,
      manufacturer: args.manufacturer,
      model: args.model,
      serialNumber: args.serialNumber,
      modelYear: args.modelYear,
      installDate: args.installDate,
      warrantyExpiration: args.warrantyExpiration,
      warrantyProvider: args.warrantyProvider,
      isUnderWarranty: args.isUnderWarranty,
      lastServiceDate: args.lastServiceDate,
      nextServiceDue: args.nextServiceDue,
      serviceIntervalDays: args.serviceIntervalDays,
      condition: args.condition as any,
      status: args.status as any,
      notes: args.notes,
      searchText,
      totalServiceCount: 0,
      totalServiceCost: 0,
      averageServiceCost: 0,
    });

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "equipment",
      supabaseId: args.supabaseId,
      convexId: equipmentId,
      migratedAt: Date.now(),
    });

    return equipmentId;
  },
});
