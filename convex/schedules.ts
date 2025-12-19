/**
 * Schedule queries and mutations
 * Replaces apps/web/src/lib/queries/schedules.ts and apps/web/src/actions/appointments.ts
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
import { scheduleType, scheduleStatus } from "./lib/validators";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List schedules for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(scheduleStatus),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    assignedTo: v.optional(v.id("users")),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_schedules");

    let query = ctx.db
      .query("schedules")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = ctx.db
        .query("schedules")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    if (args.customerId) {
      query = ctx.db
        .query("schedules")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId!));
    }

    if (args.jobId) {
      query = ctx.db
        .query("schedules")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId!));
    }

    if (args.assignedTo) {
      query = ctx.db
        .query("schedules")
        .withIndex("by_assigned", (q) => q.eq("assignedTo", args.assignedTo!));
    }

    let schedules = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId || args.jobId || args.assignedTo) {
      schedules = schedules.filter((s) => s.companyId === args.companyId);
    }

    // Filter by date range
    if (args.startDate) {
      schedules = schedules.filter((s) => s.startTime >= args.startDate!);
    }
    if (args.endDate) {
      schedules = schedules.filter((s) => s.startTime <= args.endDate!);
    }

    schedules = excludeDeleted(schedules);

    if (!args.includeArchived) {
      schedules = schedules.filter((s) => !s.archivedAt);
    }

    // Sort by start time
    schedules.sort((a, b) => a.startTime - b.startTime);

    const limit = args.limit ?? 100;
    schedules = schedules.slice(0, limit);

    return {
      schedules,
      total: schedules.length,
      hasMore: schedules.length === limit,
    };
  },
});

/**
 * Get a single schedule by ID
 */
export const get = query({
  args: { scheduleId: v.id("schedules") },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    await requireCompanyAccess(ctx, schedule.companyId);

    if (schedule.deletedAt) {
      throw new Error("Schedule not found");
    }

    return schedule;
  },
});

/**
 * Get schedule with related data
 */
export const getComplete = query({
  args: { scheduleId: v.id("schedules") },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    await requireCompanyAccess(ctx, schedule.companyId);

    const [customer, property, job, assignee, servicePlan] = await Promise.all([
      ctx.db.get(schedule.customerId),
      ctx.db.get(schedule.propertyId),
      schedule.jobId ? ctx.db.get(schedule.jobId) : null,
      schedule.assignedTo ? ctx.db.get(schedule.assignedTo) : null,
      schedule.servicePlanId ? ctx.db.get(schedule.servicePlanId) : null,
    ]);

    return {
      schedule,
      customer,
      property,
      job,
      assignee: assignee
        ? { _id: assignee._id, name: assignee.name, email: assignee.email }
        : null,
      servicePlan,
    };
  },
});

/**
 * Get schedules by date range (for calendar view)
 */
export const getByDateRange = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.number(),
    endDate: v.number(),
    assignedTo: v.optional(v.id("users")),
    statuses: v.optional(v.array(scheduleStatus)),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let schedules = await ctx.db
      .query("schedules")
      .withIndex("by_company_time", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.gte(q.field("startTime"), args.startDate),
          q.lte(q.field("startTime"), args.endDate)
        )
      )
      .collect();

    if (args.assignedTo) {
      schedules = schedules.filter((s) => s.assignedTo === args.assignedTo);
    }

    if (args.statuses && args.statuses.length > 0) {
      schedules = schedules.filter((s) => args.statuses!.includes(s.status as any));
    }

    // Enrich with basic customer/property info
    const enriched = await Promise.all(
      schedules.map(async (schedule) => {
        const [customer, property, assignee] = await Promise.all([
          ctx.db.get(schedule.customerId),
          ctx.db.get(schedule.propertyId),
          schedule.assignedTo ? ctx.db.get(schedule.assignedTo) : null,
        ]);
        return {
          ...schedule,
          customer: customer
            ? { _id: customer._id, displayName: customer.displayName, phone: customer.phone }
            : null,
          property: property
            ? { _id: property._id, address: property.address, city: property.city }
            : null,
          assignee: assignee
            ? { _id: assignee._id, name: assignee.name }
            : null,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get schedules by assignee
 */
export const getByAssignee = query({
  args: {
    assigneeId: v.id("users"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    statuses: v.optional(v.array(scheduleStatus)),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get user's company membership
    const user = await ctx.db.get(args.assigneeId);
    if (!user) {
      throw new Error("User not found");
    }

    let schedules = await ctx.db
      .query("schedules")
      .withIndex("by_assigned", (q) => q.eq("assignedTo", args.assigneeId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (args.startDate) {
      schedules = schedules.filter((s) => s.startTime >= args.startDate!);
    }
    if (args.endDate) {
      schedules = schedules.filter((s) => s.startTime <= args.endDate!);
    }
    if (args.statuses && args.statuses.length > 0) {
      schedules = schedules.filter((s) => args.statuses!.includes(s.status as any));
    }

    schedules.sort((a, b) => a.startTime - b.startTime);

    const limit = args.limit ?? 50;
    return schedules.slice(0, limit);
  },
});

/**
 * Get upcoming schedules
 */
export const getUpcoming = query({
  args: {
    companyId: v.id("companies"),
    daysAhead: v.optional(v.number()),
    assignedTo: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const now = Date.now();
    const daysAhead = args.daysAhead ?? 7;
    const endDate = now + daysAhead * 24 * 60 * 60 * 1000;

    let schedules = await ctx.db
      .query("schedules")
      .withIndex("by_company_time", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.gte(q.field("startTime"), now),
          q.lte(q.field("startTime"), endDate),
          q.or(
            q.eq(q.field("status"), "scheduled"),
            q.eq(q.field("status"), "confirmed")
          )
        )
      )
      .collect();

    if (args.assignedTo) {
      schedules = schedules.filter((s) => s.assignedTo === args.assignedTo);
    }

    schedules.sort((a, b) => a.startTime - b.startTime);

    const limit = args.limit ?? 20;
    const results = schedules.slice(0, limit);

    // Enrich with customer/property data
    const enriched = await Promise.all(
      results.map(async (schedule) => {
        const [customer, property] = await Promise.all([
          ctx.db.get(schedule.customerId),
          ctx.db.get(schedule.propertyId),
        ]);
        return {
          ...schedule,
          customer: customer
            ? { _id: customer._id, displayName: customer.displayName, phone: customer.phone }
            : null,
          property: property
            ? { _id: property._id, address: property.address }
            : null,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get schedule stats for dashboard
 */
export const getStats = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const now = Date.now();
    const startDate = args.startDate ?? now - 30 * 24 * 60 * 60 * 1000;
    const endDate = args.endDate ?? now + 30 * 24 * 60 * 60 * 1000;

    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.gte(q.field("startTime"), startDate),
          q.lte(q.field("startTime"), endDate)
        )
      )
      .collect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;

    const todaysSchedules = schedules.filter(
      (s) => s.startTime >= todayStart && s.startTime < todayEnd
    );

    return {
      total: schedules.length,
      scheduled: schedules.filter((s) => s.status === "scheduled").length,
      confirmed: schedules.filter((s) => s.status === "confirmed").length,
      inProgress: schedules.filter((s) => s.status === "in_progress").length,
      completed: schedules.filter((s) => s.status === "completed").length,
      cancelled: schedules.filter((s) => s.status === "cancelled").length,
      noShow: schedules.filter((s) => s.status === "no_show").length,
      rescheduled: schedules.filter((s) => s.status === "rescheduled").length,
      today: todaysSchedules.length,
      todayCompleted: todaysSchedules.filter((s) => s.status === "completed").length,
      completionRate:
        schedules.filter((s) => ["completed", "cancelled", "no_show"].includes(s.status))
          .length > 0
          ? Math.round(
              (schedules.filter((s) => s.status === "completed").length /
                schedules.filter((s) =>
                  ["completed", "cancelled", "no_show"].includes(s.status)
                ).length) *
                100
            )
          : 0,
      averageDuration:
        schedules.filter((s) => s.actualDuration).length > 0
          ? Math.round(
              schedules
                .filter((s) => s.actualDuration)
                .reduce((sum, s) => sum + (s.actualDuration ?? 0), 0) /
                schedules.filter((s) => s.actualDuration).length
            )
          : 0,
    };
  },
});

/**
 * Get today's schedule for a technician
 */
export const getTodayForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;

    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_assigned", (q) => q.eq("assignedTo", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.gte(q.field("startTime"), todayStart),
          q.lt(q.field("startTime"), todayEnd)
        )
      )
      .collect();

    schedules.sort((a, b) => a.startTime - b.startTime);

    // Enrich with customer/property data
    const enriched = await Promise.all(
      schedules.map(async (schedule) => {
        const [customer, property] = await Promise.all([
          ctx.db.get(schedule.customerId),
          ctx.db.get(schedule.propertyId),
        ]);
        return {
          ...schedule,
          customer: customer
            ? {
                _id: customer._id,
                displayName: customer.displayName,
                phone: customer.phone,
                email: customer.email,
              }
            : null,
          property: property
            ? {
                _id: property._id,
                address: property.address,
                city: property.city,
                accessNotes: property.accessNotes,
                gateCode: property.gateCode,
              }
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
 * Create a new schedule
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    propertyId: v.id("properties"),
    jobId: v.optional(v.id("jobs")),
    servicePlanId: v.optional(v.id("servicePlans")),
    assignedTo: v.optional(v.id("users")),

    type: scheduleType,
    title: v.string(),
    description: v.optional(v.string()),

    startTime: v.number(),
    endTime: v.number(),
    duration: v.optional(v.number()),
    allDay: v.optional(v.boolean()),

    isRecurring: v.optional(v.boolean()),
    recurrenceRule: v.optional(v.any()),
    recurrenceEndDate: v.optional(v.number()),

    serviceTypes: v.optional(v.array(v.string())),
    estimatedCost: v.optional(v.number()),

    location: v.optional(v.string()),
    accessInstructions: v.optional(v.string()),

    reminderHoursBefore: v.optional(v.number()),

    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    color: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "manage_schedules");

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

    // Validate job if provided
    if (args.jobId) {
      const job = await ctx.db.get(args.jobId);
      if (!job || job.companyId !== args.companyId) {
        throw new Error("Invalid job");
      }
    }

    // Calculate duration if not provided
    const duration = args.duration ?? Math.round((args.endTime - args.startTime) / 60000);

    const scheduleId = await ctx.db.insert("schedules", {
      companyId: args.companyId,
      customerId: args.customerId,
      propertyId: args.propertyId,
      jobId: args.jobId,
      servicePlanId: args.servicePlanId,
      assignedTo: args.assignedTo,
      type: args.type,
      title: args.title.trim(),
      description: args.description?.trim(),
      startTime: args.startTime,
      endTime: args.endTime,
      duration,
      allDay: args.allDay ?? false,
      isRecurring: args.isRecurring ?? false,
      recurrenceRule: args.recurrenceRule,
      recurrenceEndDate: args.recurrenceEndDate,
      status: "scheduled",
      serviceTypes: args.serviceTypes,
      estimatedCost: args.estimatedCost,
      location: args.location,
      accessInstructions: args.accessInstructions,
      reminderSent: false,
      reminderHoursBefore: args.reminderHoursBefore ?? 24,
      notes: args.notes,
      customerNotes: args.customerNotes,
      color: args.color,
      metadata: args.metadata,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "schedule",
      entityId: scheduleId,
      metadata: { title: args.title, startTime: args.startTime },
    });

    return scheduleId;
  },
});

/**
 * Update a schedule
 */
export const update = mutation({
  args: {
    scheduleId: v.id("schedules"),

    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()),
    allDay: v.optional(v.boolean()),
    recurrenceRule: v.optional(v.any()),
    recurrenceEndDate: v.optional(v.number()),
    serviceTypes: v.optional(v.array(v.string())),
    estimatedCost: v.optional(v.number()),
    location: v.optional(v.string()),
    accessInstructions: v.optional(v.string()),
    reminderHoursBefore: v.optional(v.number()),
    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    color: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { scheduleId, ...updates } = args;

    const schedule = await ctx.db.get(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);
    requirePermission(authCtx, "manage_schedules");

    if (schedule.deletedAt) {
      throw new Error("Cannot update deleted schedule");
    }

    if (["completed", "cancelled"].includes(schedule.status)) {
      throw new Error(`Cannot update ${schedule.status} schedule`);
    }

    const changes = trackChanges(schedule, updates);

    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    // Recalculate duration if times changed
    if (updates.startTime || updates.endTime) {
      const startTime = updates.startTime ?? schedule.startTime;
      const endTime = updates.endTime ?? schedule.endTime;
      updateData.duration = Math.round((endTime - startTime) / 60000);
    }

    await ctx.db.patch(scheduleId, updateData);

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: schedule.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "schedule",
        entityId: scheduleId,
        changes,
      });
    }

    return scheduleId;
  },
});

/**
 * Update schedule status
 */
export const updateStatus = mutation({
  args: {
    scheduleId: v.id("schedules"),
    status: scheduleStatus,
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);
    requirePermission(authCtx, "manage_schedules");

    const updateData: Record<string, unknown> = {
      status: args.status,
      updatedBy: authCtx.userId,
    };

    await ctx.db.patch(args.scheduleId, updateData);

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "update_status",
      entityType: "schedule",
      entityId: args.scheduleId,
      metadata: {
        oldStatus: schedule.status,
        newStatus: args.status,
        reason: args.reason,
      },
    });

    return args.scheduleId;
  },
});

/**
 * Confirm a schedule
 */
export const confirm = mutation({
  args: {
    scheduleId: v.id("schedules"),
    confirmedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);

    if (schedule.status !== "scheduled") {
      throw new Error("Only scheduled appointments can be confirmed");
    }

    await ctx.db.patch(args.scheduleId, {
      status: "confirmed",
      confirmedAt: Date.now(),
      confirmedBy: args.confirmedBy ?? "Customer",
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "confirm",
      entityType: "schedule",
      entityId: args.scheduleId,
    });

    return args.scheduleId;
  },
});

/**
 * Start a scheduled job
 */
export const startJob = mutation({
  args: { scheduleId: v.id("schedules") },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);
    requirePermission(authCtx, "manage_schedules");

    if (!["scheduled", "confirmed"].includes(schedule.status)) {
      throw new Error("Cannot start this schedule");
    }

    const now = Date.now();

    await ctx.db.patch(args.scheduleId, {
      status: "in_progress",
      actualStartTime: now,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "start",
      entityType: "schedule",
      entityId: args.scheduleId,
    });

    return args.scheduleId;
  },
});

/**
 * Complete a schedule
 */
export const complete = mutation({
  args: {
    scheduleId: v.id("schedules"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);
    requirePermission(authCtx, "manage_schedules");

    if (schedule.status !== "in_progress") {
      throw new Error("Only in-progress schedules can be completed");
    }

    const now = Date.now();
    const actualDuration = schedule.actualStartTime
      ? Math.round((now - schedule.actualStartTime) / 60000)
      : schedule.duration;

    await ctx.db.patch(args.scheduleId, {
      status: "completed",
      actualEndTime: now,
      actualDuration,
      completedBy: authCtx.userId,
      notes: args.notes ?? schedule.notes,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "complete",
      entityType: "schedule",
      entityId: args.scheduleId,
      metadata: { actualDuration },
    });

    return args.scheduleId;
  },
});

/**
 * Cancel a schedule
 */
export const cancel = mutation({
  args: {
    scheduleId: v.id("schedules"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);
    requirePermission(authCtx, "manage_schedules");

    if (["completed", "cancelled"].includes(schedule.status)) {
      throw new Error(`Cannot cancel ${schedule.status} schedule`);
    }

    await ctx.db.patch(args.scheduleId, {
      status: "cancelled",
      cancelledAt: Date.now(),
      cancelledBy: authCtx.userId,
      cancellationReason: args.reason,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "cancel",
      entityType: "schedule",
      entityId: args.scheduleId,
      metadata: { reason: args.reason },
    });

    return args.scheduleId;
  },
});

/**
 * Reschedule an appointment
 */
export const reschedule = mutation({
  args: {
    scheduleId: v.id("schedules"),
    newStartTime: v.number(),
    newEndTime: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);
    requirePermission(authCtx, "manage_schedules");

    if (["completed", "cancelled"].includes(schedule.status)) {
      throw new Error(`Cannot reschedule ${schedule.status} schedule`);
    }

    // Mark old schedule as rescheduled
    await ctx.db.patch(args.scheduleId, {
      status: "rescheduled",
      updatedBy: authCtx.userId,
    });

    // Calculate new duration
    const duration = Math.round((args.newEndTime - args.newStartTime) / 60000);

    // Create new schedule
    const newScheduleId = await ctx.db.insert("schedules", {
      companyId: schedule.companyId,
      customerId: schedule.customerId,
      propertyId: schedule.propertyId,
      jobId: schedule.jobId,
      servicePlanId: schedule.servicePlanId,
      assignedTo: schedule.assignedTo,
      type: schedule.type,
      title: schedule.title,
      description: schedule.description,
      startTime: args.newStartTime,
      endTime: args.newEndTime,
      duration,
      allDay: schedule.allDay,
      isRecurring: false, // Rescheduled appointments are not recurring
      status: "scheduled",
      serviceTypes: schedule.serviceTypes,
      estimatedCost: schedule.estimatedCost,
      location: schedule.location,
      accessInstructions: schedule.accessInstructions,
      reminderSent: false,
      reminderHoursBefore: schedule.reminderHoursBefore,
      notes: schedule.notes,
      customerNotes: schedule.customerNotes,
      rescheduledFromId: args.scheduleId,
      color: schedule.color,
      metadata: schedule.metadata,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    // Update old schedule with reference to new one
    await ctx.db.patch(args.scheduleId, {
      rescheduledToId: newScheduleId,
    });

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "reschedule",
      entityType: "schedule",
      entityId: args.scheduleId,
      metadata: {
        oldStartTime: schedule.startTime,
        newStartTime: args.newStartTime,
        newScheduleId,
        reason: args.reason,
      },
    });

    return newScheduleId;
  },
});

/**
 * Mark reminder as sent
 */
export const markReminderSent = mutation({
  args: {
    scheduleId: v.id("schedules"),
    method: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    await ctx.db.patch(args.scheduleId, {
      reminderSent: true,
      reminderSentAt: Date.now(),
      reminderMethod: args.method ?? "email",
    });

    return args.scheduleId;
  },
});

/**
 * Mark as no-show
 */
export const markNoShow = mutation({
  args: {
    scheduleId: v.id("schedules"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);
    requirePermission(authCtx, "manage_schedules");

    await ctx.db.patch(args.scheduleId, {
      status: "no_show",
      notes: args.notes ?? schedule.notes,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "mark_no_show",
      entityType: "schedule",
      entityId: args.scheduleId,
      metadata: { notes: args.notes },
    });

    return args.scheduleId;
  },
});

/**
 * Delete a schedule (soft delete)
 */
export const remove = mutation({
  args: {
    scheduleId: v.id("schedules"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const authCtx = await requireCompanyAccess(ctx, schedule.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete schedules");
    }

    await ctx.db.patch(args.scheduleId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: schedule.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "schedule",
      entityId: args.scheduleId,
      metadata: { title: schedule.title, reason: args.reason },
    });

    return { success: true };
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import schedule from Supabase during migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.string(),
    propertySupabaseId: v.string(),
    jobSupabaseId: v.optional(v.string()),
    assignedToSupabaseId: v.optional(v.string()),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    duration: v.number(),
    allDay: v.boolean(),
    isRecurring: v.boolean(),
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
        q.eq("tableName", "schedules").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    // Look up optional mappings
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

    let assignedTo: any = undefined;
    if (args.assignedToSupabaseId) {
      const userMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "users").eq("supabaseId", args.assignedToSupabaseId!)
        )
        .unique();
      if (userMapping) assignedTo = userMapping.convexId;
    }

    const scheduleId = await ctx.db.insert("schedules", {
      companyId: companyMapping.convexId as any,
      customerId: customerMapping.convexId as any,
      propertyId: propertyMapping.convexId as any,
      jobId,
      assignedTo,
      type: args.type as any,
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      duration: args.duration,
      allDay: args.allDay,
      isRecurring: args.isRecurring,
      status: args.status as any,
      reminderSent: false,
      notes: args.notes,
    });

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "schedules",
      supabaseId: args.supabaseId,
      convexId: scheduleId,
      migratedAt: Date.now(),
    });

    return scheduleId;
  },
});
