/**
 * Service Plan queries and mutations
 * Replaces apps/web/src/lib/queries/service-plans.ts and related actions
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
import {
  servicePlanType,
  servicePlanFrequency,
  servicePlanStatus,
  renewalType,
} from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate service plan number
 */
async function generatePlanNumber(ctx: any, companyId: any): Promise<string> {
  const plans = await ctx.db
    .query("servicePlans")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const nextNumber = plans.length + 1;
  return `SP-${nextNumber.toString().padStart(5, "0")}`;
}

/**
 * Calculate next service due date based on frequency
 */
function calculateNextServiceDue(
  lastServiceDate: number,
  frequency: string
): number {
  const date = new Date(lastServiceDate);

  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "bi_weekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "semi_annually":
      date.setMonth(date.getMonth() + 6);
      break;
    case "annually":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }

  return date.getTime();
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List service plans for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(servicePlanStatus),
    customerId: v.optional(v.id("customers")),
    type: v.optional(servicePlanType),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_service_plans");

    let query = ctx.db
      .query("servicePlans")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = ctx.db
        .query("servicePlans")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    if (args.customerId) {
      query = ctx.db
        .query("servicePlans")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId!));
    }

    let plans = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId) {
      plans = plans.filter((p) => p.companyId === args.companyId);
    }

    // Apply additional filters
    if (args.type) {
      plans = plans.filter((p) => p.type === args.type);
    }

    plans = excludeDeleted(plans);

    if (!args.includeArchived) {
      plans = plans.filter((p) => !p.archivedAt);
    }

    const limit = args.limit ?? 50;
    plans = plans.slice(0, limit);

    return {
      servicePlans: plans,
      total: plans.length,
      hasMore: plans.length === limit,
    };
  },
});

/**
 * Get a single service plan by ID
 */
export const get = query({
  args: { planId: v.id("servicePlans") },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    await requireCompanyAccess(ctx, plan.companyId);

    if (plan.deletedAt) {
      throw new Error("Service plan not found");
    }

    return plan;
  },
});

/**
 * Get service plan with related data
 */
export const getComplete = query({
  args: { planId: v.id("servicePlans") },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    await requireCompanyAccess(ctx, plan.companyId);

    const [customer, property, assignee, recentJobs, equipment] = await Promise.all([
      ctx.db.get(plan.customerId),
      plan.propertyId ? ctx.db.get(plan.propertyId) : null,
      plan.assignedTechnician ? ctx.db.get(plan.assignedTechnician) : null,
      // Get recent jobs for the property/customer associated with this plan
      plan.propertyId
        ? ctx.db
            .query("jobs")
            .withIndex("by_property", (q) => q.eq("propertyId", plan.propertyId!))
            .filter((q) => q.eq(q.field("deletedAt"), undefined))
            .order("desc")
            .take(10)
        : ctx.db
            .query("jobs")
            .withIndex("by_customer", (q) => q.eq("customerId", plan.customerId))
            .filter((q) => q.eq(q.field("deletedAt"), undefined))
            .order("desc")
            .take(10),
      // Get equipment covered by this plan
      plan.propertyId
        ? ctx.db
            .query("equipment")
            .withIndex("by_property", (q) => q.eq("propertyId", plan.propertyId!))
            .filter((q) =>
              q.and(
                q.eq(q.field("deletedAt"), undefined),
                q.eq(q.field("servicePlanId"), args.planId)
              )
            )
            .collect()
        : [],
    ]);

    // Get price book items if referenced
    const priceBookItems = plan.priceBookItemIds
      ? await Promise.all(
          plan.priceBookItemIds.map((id) => ctx.db.get(id))
        ).then((items) => items.filter(Boolean))
      : [];

    return {
      plan,
      customer,
      property,
      assignee: assignee
        ? { _id: assignee._id, name: assignee.name, email: assignee.email }
        : null,
      recentJobs,
      equipment,
      priceBookItems,
      isOverdue: plan.nextServiceDue < Date.now(),
      daysUntilService: Math.ceil(
        (plan.nextServiceDue - Date.now()) / (24 * 60 * 60 * 1000)
      ),
    };
  },
});

/**
 * Get service plans by customer
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

    let plans = await ctx.db
      .query("servicePlans")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (args.activeOnly) {
      plans = plans.filter((p) => p.status === "active");
    }

    return plans;
  },
});

/**
 * Get service plans due for service
 */
export const getDueForService = query({
  args: {
    companyId: v.id("companies"),
    daysAhead: v.optional(v.number()),
    includeOverdue: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const now = Date.now();
    const daysAhead = args.daysAhead ?? 14;
    const futureDate = now + daysAhead * 24 * 60 * 60 * 1000;

    let plans = await ctx.db
      .query("servicePlans")
      .withIndex("by_next_service", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("status"), "active")
        )
      )
      .collect();

    if (args.includeOverdue) {
      plans = plans.filter((p) => p.nextServiceDue <= futureDate);
    } else {
      plans = plans.filter(
        (p) => p.nextServiceDue >= now && p.nextServiceDue <= futureDate
      );
    }

    // Sort by next service due
    plans.sort((a, b) => a.nextServiceDue - b.nextServiceDue);

    const limit = args.limit ?? 50;
    const results = plans.slice(0, limit);

    // Enrich with customer/property data
    const enriched = await Promise.all(
      results.map(async (plan) => {
        const [customer, property] = await Promise.all([
          ctx.db.get(plan.customerId),
          plan.propertyId ? ctx.db.get(plan.propertyId) : null,
        ]);
        return {
          ...plan,
          customer: customer
            ? { _id: customer._id, displayName: customer.displayName, phone: customer.phone }
            : null,
          property: property
            ? { _id: property._id, address: property.address }
            : null,
          isOverdue: plan.nextServiceDue < now,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get service plan stats for dashboard
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const plans = await ctx.db
      .query("servicePlans")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const active = plans.filter((p) => !p.archivedAt);
    const now = Date.now();
    const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

    return {
      total: plans.length,
      draft: active.filter((p) => p.status === "draft").length,
      active: active.filter((p) => p.status === "active").length,
      paused: active.filter((p) => p.status === "paused").length,
      cancelled: active.filter((p) => p.status === "cancelled").length,
      expired: active.filter((p) => p.status === "expired").length,
      completed: active.filter((p) => p.status === "completed").length,
      totalMonthlyRevenue: active
        .filter((p) => p.status === "active")
        .reduce((sum, p) => {
          // Convert to monthly equivalent
          const monthlyPrice = p.billingFrequency === "annually" ? p.price / 12 : p.price;
          return sum + monthlyPrice;
        }, 0),
      serviceDueSoon: active.filter(
        (p) =>
          p.status === "active" &&
          p.nextServiceDue > now &&
          p.nextServiceDue < thirtyDaysFromNow
      ).length,
      serviceOverdue: active.filter(
        (p) => p.status === "active" && p.nextServiceDue < now
      ).length,
      renewingWithin30Days: active.filter(
        (p) =>
          p.status === "active" &&
          p.renewalType !== "none" &&
          p.endDate &&
          p.endDate > now &&
          p.endDate < thirtyDaysFromNow
      ).length,
      byType: {
        preventive: active.filter((p) => p.type === "preventive").length,
        warranty: active.filter((p) => p.type === "warranty").length,
        subscription: active.filter((p) => p.type === "subscription").length,
        contract: active.filter((p) => p.type === "contract").length,
      },
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new service plan
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    propertyId: v.optional(v.id("properties")),

    name: v.string(),
    description: v.optional(v.string()),

    type: servicePlanType,
    frequency: servicePlanFrequency,
    visitsPerTerm: v.number(),

    startDate: v.number(),
    endDate: v.optional(v.number()),
    renewalType: renewalType,
    renewalNoticeDays: v.optional(v.number()),

    price: v.number(),
    billingFrequency: v.optional(v.string()),
    taxable: v.optional(v.boolean()),

    includedServices: v.array(v.any()),
    includedEquipmentTypes: v.optional(v.array(v.string())),
    priceBookItemIds: v.optional(v.array(v.id("priceBookItems"))),

    autoGenerateJobs: v.optional(v.boolean()),
    assignedTechnician: v.optional(v.id("users")),

    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_service_plans");

    // Validate customer
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.companyId !== args.companyId) {
      throw new Error("Invalid customer");
    }

    // Validate property if provided
    if (args.propertyId) {
      const property = await ctx.db.get(args.propertyId);
      if (!property || property.companyId !== args.companyId) {
        throw new Error("Invalid property");
      }
    }

    // Generate plan number
    const planNumber = await generatePlanNumber(ctx, args.companyId);

    // Calculate first service due date
    const nextServiceDue = calculateNextServiceDue(args.startDate, args.frequency);

    const planId = await ctx.db.insert("servicePlans", {
      companyId: args.companyId,
      customerId: args.customerId,
      propertyId: args.propertyId,
      planNumber,
      name: args.name.trim(),
      description: args.description?.trim(),
      type: args.type,
      frequency: args.frequency,
      visitsPerTerm: args.visitsPerTerm,
      startDate: args.startDate,
      endDate: args.endDate,
      renewalType: args.renewalType,
      renewalNoticeDays: args.renewalNoticeDays ?? 30,
      price: args.price,
      billingFrequency: args.billingFrequency ?? "monthly",
      taxable: args.taxable ?? false,
      includedServices: args.includedServices,
      includedEquipmentTypes: args.includedEquipmentTypes,
      priceBookItemIds: args.priceBookItemIds,
      nextServiceDue,
      autoGenerateJobs: args.autoGenerateJobs ?? true,
      assignedTechnician: args.assignedTechnician,
      status: "draft",
      totalVisitsCompleted: 0,
      totalRevenue: 0,
      terms: args.terms,
      notes: args.notes,
      customerNotes: args.customerNotes,
      metadata: args.metadata,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "servicePlan",
      entityId: planId,
      metadata: { planNumber, name: args.name, type: args.type },
    });

    return planId;
  },
});

/**
 * Update a service plan
 */
export const update = mutation({
  args: {
    planId: v.id("servicePlans"),

    name: v.optional(v.string()),
    description: v.optional(v.string()),
    frequency: v.optional(servicePlanFrequency),
    visitsPerTerm: v.optional(v.number()),
    endDate: v.optional(v.number()),
    renewalType: v.optional(renewalType),
    renewalNoticeDays: v.optional(v.number()),
    price: v.optional(v.number()),
    billingFrequency: v.optional(v.string()),
    taxable: v.optional(v.boolean()),
    includedServices: v.optional(v.array(v.any())),
    includedEquipmentTypes: v.optional(v.array(v.string())),
    priceBookItemIds: v.optional(v.array(v.id("priceBookItems"))),
    autoGenerateJobs: v.optional(v.boolean()),
    assignedTechnician: v.optional(v.id("users")),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { planId, ...updates } = args;

    const plan = await ctx.db.get(planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (plan.deletedAt) {
      throw new Error("Cannot update deleted service plan");
    }

    const changes = trackChanges(plan, updates);

    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    // Recalculate next service due if frequency changed
    if (updates.frequency && plan.lastServiceDate) {
      updateData.nextServiceDue = calculateNextServiceDue(
        plan.lastServiceDate,
        updates.frequency
      );
    }

    await ctx.db.patch(planId, updateData);

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: plan.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "servicePlan",
        entityId: planId,
        changes,
      });
    }

    return planId;
  },
});

/**
 * Activate a service plan
 */
export const activate = mutation({
  args: {
    planId: v.id("servicePlans"),
    customerSignature: v.optional(v.string()),
    signedByName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (plan.status !== "draft" && plan.status !== "paused") {
      throw new Error("Only draft or paused plans can be activated");
    }

    const updateData: Record<string, unknown> = {
      status: "active",
      updatedBy: authCtx.userId,
    };

    if (args.customerSignature) {
      updateData.customerSignature = args.customerSignature;
      updateData.signedAt = Date.now();
      updateData.signedByName = args.signedByName;
    }

    // Clear pause fields if resuming
    if (plan.status === "paused") {
      updateData.pausedAt = undefined;
      updateData.pausedReason = undefined;
    }

    await ctx.db.patch(args.planId, updateData);

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "activate",
      entityType: "servicePlan",
      entityId: args.planId,
    });

    return args.planId;
  },
});

/**
 * Pause a service plan
 */
export const pause = mutation({
  args: {
    planId: v.id("servicePlans"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (plan.status !== "active") {
      throw new Error("Only active plans can be paused");
    }

    await ctx.db.patch(args.planId, {
      status: "paused",
      pausedAt: Date.now(),
      pausedReason: args.reason,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "pause",
      entityType: "servicePlan",
      entityId: args.planId,
      metadata: { reason: args.reason },
    });

    return args.planId;
  },
});

/**
 * Resume a paused service plan (alias for activate)
 */
export const resume = mutation({
  args: { planId: v.id("servicePlans") },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (plan.status !== "paused") {
      throw new Error("Only paused plans can be resumed");
    }

    await ctx.db.patch(args.planId, {
      status: "active",
      pausedAt: undefined,
      pausedReason: undefined,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "resume",
      entityType: "servicePlan",
      entityId: args.planId,
    });

    return args.planId;
  },
});

/**
 * Cancel a service plan
 */
export const cancel = mutation({
  args: {
    planId: v.id("servicePlans"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can cancel service plans");
    }

    if (["cancelled", "completed"].includes(plan.status)) {
      throw new Error(`Cannot cancel ${plan.status} plan`);
    }

    await ctx.db.patch(args.planId, {
      status: "cancelled",
      cancelledAt: Date.now(),
      cancelledReason: args.reason,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "cancel",
      entityType: "servicePlan",
      entityId: args.planId,
      metadata: { reason: args.reason },
    });

    return args.planId;
  },
});

/**
 * Mark a service plan as completed
 */
export const complete = mutation({
  args: {
    planId: v.id("servicePlans"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (plan.status !== "active") {
      throw new Error("Only active plans can be completed");
    }

    await ctx.db.patch(args.planId, {
      status: "completed",
      completedAt: Date.now(),
      notes: args.notes ?? plan.notes,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "complete",
      entityType: "servicePlan",
      entityId: args.planId,
    });

    return args.planId;
  },
});

/**
 * Renew a service plan
 */
export const renew = mutation({
  args: {
    planId: v.id("servicePlans"),
    newEndDate: v.optional(v.number()),
    newPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (!["active", "expired"].includes(plan.status)) {
      throw new Error("Only active or expired plans can be renewed");
    }

    // Calculate new end date based on original term length or provided
    let newEndDate = args.newEndDate;
    if (!newEndDate && plan.startDate && plan.endDate) {
      const termLength = plan.endDate - plan.startDate;
      newEndDate = Date.now() + termLength;
    }

    await ctx.db.patch(args.planId, {
      status: "active",
      endDate: newEndDate,
      price: args.newPrice ?? plan.price,
      totalVisitsCompleted: 0, // Reset for new term
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "renew",
      entityType: "servicePlan",
      entityId: args.planId,
      metadata: { newEndDate, newPrice: args.newPrice },
    });

    return args.planId;
  },
});

/**
 * Record a service visit completion
 */
export const recordVisit = mutation({
  args: {
    planId: v.id("servicePlans"),
    jobId: v.optional(v.id("jobs")),
    serviceCost: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    const now = Date.now();
    const newVisitsCompleted = (plan.totalVisitsCompleted ?? 0) + 1;
    const newTotalRevenue = (plan.totalRevenue ?? 0) + (args.serviceCost ?? plan.price);

    // Calculate next service due
    const nextServiceDue = calculateNextServiceDue(now, plan.frequency);

    await ctx.db.patch(args.planId, {
      lastServiceDate: now,
      nextServiceDue,
      totalVisitsCompleted: newVisitsCompleted,
      totalRevenue: newTotalRevenue,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "record_visit",
      entityType: "servicePlan",
      entityId: args.planId,
      metadata: { jobId: args.jobId, visitNumber: newVisitsCompleted },
    });

    return args.planId;
  },
});

/**
 * Archive a service plan
 */
export const archive = mutation({
  args: {
    planId: v.id("servicePlans"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (plan.archivedAt) {
      throw new Error("Service plan is already archived");
    }

    await ctx.db.patch(args.planId, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "archive",
      entityType: "servicePlan",
      entityId: args.planId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Unarchive a service plan
 */
export const unarchive = mutation({
  args: { planId: v.id("servicePlans") },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);
    requirePermission(authCtx, "create_service_plans");

    if (!plan.archivedAt) {
      throw new Error("Service plan is not archived");
    }

    await ctx.db.patch(args.planId, {
      archivedAt: undefined,
      archivedBy: undefined,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "unarchive",
      entityType: "servicePlan",
      entityId: args.planId,
    });

    return { success: true };
  },
});

/**
 * Delete a service plan (soft delete)
 */
export const remove = mutation({
  args: {
    planId: v.id("servicePlans"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) {
      throw new Error("Service plan not found");
    }

    const authCtx = await requireCompanyAccess(ctx, plan.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete service plans");
    }

    await ctx.db.patch(args.planId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: plan.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "servicePlan",
      entityId: args.planId,
      metadata: { planNumber: plan.planNumber, reason: args.reason },
    });

    return { success: true };
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import service plan from Supabase during migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.string(),
    propertySupabaseId: v.optional(v.string()),
    planNumber: v.string(),
    name: v.string(),
    type: v.string(),
    frequency: v.string(),
    visitsPerTerm: v.number(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    renewalType: v.string(),
    price: v.number(),
    taxable: v.boolean(),
    includedServices: v.array(v.any()),
    nextServiceDue: v.number(),
    autoGenerateJobs: v.boolean(),
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

    // Check if already migrated
    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "servicePlans").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    // Look up optional property mapping
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

    const planId = await ctx.db.insert("servicePlans", {
      companyId: companyMapping.convexId as any,
      customerId: customerMapping.convexId as any,
      propertyId,
      planNumber: args.planNumber,
      name: args.name,
      type: args.type as any,
      frequency: args.frequency as any,
      visitsPerTerm: args.visitsPerTerm,
      startDate: args.startDate,
      endDate: args.endDate,
      renewalType: args.renewalType as any,
      price: args.price,
      taxable: args.taxable,
      includedServices: args.includedServices,
      nextServiceDue: args.nextServiceDue,
      autoGenerateJobs: args.autoGenerateJobs,
      status: args.status as any,
      totalVisitsCompleted: 0,
      totalRevenue: 0,
      notes: args.notes,
    });

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "servicePlans",
      supabaseId: args.supabaseId,
      convexId: planId,
      migratedAt: Date.now(),
    });

    return planId;
  },
});
