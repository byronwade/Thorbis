/**
 * Job queries and mutations
 * Replaces apps/web/src/lib/queries/jobs.ts and apps/web/src/actions/jobs.ts
 */
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
  requireCompanyAccess,
  requirePermission,
  hasPermission,
  hasMinimumRole,
  canAccessEntity,
  filterAccessibleEntities,
  excludeDeleted,
  excludeArchived,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { jobStatus, jobPriority, jobType } from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate job number
 */
async function generateJobNumber(
  ctx: any,
  companyId: any
): Promise<string> {
  // Get count of jobs for this company
  const jobs = await ctx.db
    .query("jobs")
    .withIndex("by_company", (q: any) => q.eq("companyId", companyId))
    .collect();

  const nextNumber = jobs.length + 1;
  return `JOB-${nextNumber.toString().padStart(5, "0")}`;
}

/**
 * Generate search text for full-text search
 */
function generateSearchText(job: {
  jobNumber: string;
  title: string;
  description?: string;
  notes?: string;
}): string {
  return [job.jobNumber, job.title, job.description, job.notes]
    .filter(Boolean)
    .join(" ");
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List jobs for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(jobStatus),
    priority: v.optional(jobPriority),
    assignedTo: v.optional(v.id("users")),
    customerId: v.optional(v.id("customers")),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_jobs");

    let query = ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    // Use status index if provided
    if (args.status) {
      query = ctx.db
        .query("jobs")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    // Use customer index if provided
    if (args.customerId) {
      query = ctx.db
        .query("jobs")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId));
    }

    // Use assigned index if provided
    if (args.assignedTo) {
      query = ctx.db
        .query("jobs")
        .withIndex("by_assigned", (q) => q.eq("assignedTo", args.assignedTo));
    }

    let jobs = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId || args.assignedTo) {
      jobs = jobs.filter((j) => j.companyId === args.companyId);
    }

    // Apply soft delete filters
    jobs = excludeDeleted(jobs);
    if (!args.includeArchived) {
      jobs = excludeArchived(jobs);
    }

    // Apply additional filters
    if (args.priority) {
      jobs = jobs.filter((j) => j.priority === args.priority);
    }
    if (args.status && !args.status) {
      jobs = jobs.filter((j) => j.status === args.status);
    }

    // Filter by access permissions (technicians only see assigned)
    jobs = filterAccessibleEntities(authCtx, jobs);

    // Apply limit
    const limit = args.limit ?? 50;
    jobs = jobs.slice(0, limit);

    return {
      jobs,
      total: jobs.length,
      hasMore: jobs.length === limit,
    };
  },
});

/**
 * Get a single job by ID
 */
export const get = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);
    requirePermission(authCtx, "view_jobs");

    // Check entity-level access
    if (!canAccessEntity(authCtx, job)) {
      throw new Error("Access denied to this job");
    }

    if (job.deletedAt && !hasPermission(authCtx, "view_deleted")) {
      throw new Error("Job not found");
    }

    return job;
  },
});

/**
 * Get job with all related data
 * Replaces get_job_complete RPC function
 */
export const getComplete = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);
    requirePermission(authCtx, "view_jobs");

    if (!canAccessEntity(authCtx, job)) {
      throw new Error("Access denied to this job");
    }

    // Fetch all related data in parallel
    const [
      customer,
      property,
      financial,
      timeTracking,
      teamAssignments,
      equipment,
      materials,
      notes,
      invoices,
      estimates,
      payments,
      appointments,
    ] = await Promise.all([
      job.customerId ? ctx.db.get(job.customerId) : null,
      job.propertyId ? ctx.db.get(job.propertyId) : null,
      ctx.db
        .query("jobFinancial")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .unique(),
      ctx.db
        .query("jobTimeTracking")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .unique(),
      ctx.db
        .query("jobTeamAssignments")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("jobEquipment")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .collect(),
      ctx.db
        .query("jobMaterials")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .collect(),
      ctx.db
        .query("jobNotes")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("invoices")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("estimates")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      job.customerId
        ? ctx.db
            .query("payments")
            .withIndex("by_customer", (q) => q.eq("customerId", job.customerId!))
            .filter((q) =>
              q.and(
                q.eq(q.field("deletedAt"), undefined),
                q.eq(q.field("jobId"), args.jobId)
              )
            )
            .collect()
        : [],
      ctx.db
        .query("schedules")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
    ]);

    // Enrich team assignments with user details
    const enrichedTeamAssignments = await Promise.all(
      teamAssignments.map(async (ta) => {
        const user = await ctx.db.get(ta.userId);
        return {
          ...ta,
          user: user
            ? { _id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }
            : null,
        };
      })
    );

    // Enrich equipment with details
    const enrichedEquipment = await Promise.all(
      equipment.map(async (je) => {
        const equip = await ctx.db.get(je.equipmentId);
        return { ...je, equipment: equip };
      })
    );

    return {
      job,
      customer,
      property,
      financial,
      timeTracking,
      teamAssignments: enrichedTeamAssignments,
      equipment: enrichedEquipment,
      materials,
      notes,
      invoices,
      estimates,
      payments,
      appointments,
    };
  },
});

/**
 * Get jobs for dashboard
 * Replaces get_jobs_dashboard RPC function
 */
export const getDashboard = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(jobStatus),
    since: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_jobs");

    let query = ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = ctx.db
        .query("jobs")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    let jobs = await query.collect();
    jobs = excludeDeleted(jobs);

    // Filter by since date
    if (args.since) {
      jobs = jobs.filter((j) => j._creationTime >= args.since!);
    }

    // Filter by access
    jobs = filterAccessibleEntities(authCtx, jobs);

    // Apply limit
    const limit = args.limit ?? 50;
    jobs = jobs.slice(0, limit);

    // Batch fetch related data
    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const [customer, property, financial, timeTracking] = await Promise.all([
          job.customerId ? ctx.db.get(job.customerId) : null,
          job.propertyId ? ctx.db.get(job.propertyId) : null,
          ctx.db
            .query("jobFinancial")
            .withIndex("by_job", (q) => q.eq("jobId", job._id))
            .unique(),
          ctx.db
            .query("jobTimeTracking")
            .withIndex("by_job", (q) => q.eq("jobId", job._id))
            .unique(),
        ]);

        return {
          ...job,
          customer: customer
            ? {
                _id: customer._id,
                displayName: customer.displayName,
                email: customer.email,
                phone: customer.phone,
              }
            : null,
          property: property
            ? {
                _id: property._id,
                address: property.address,
                city: property.city,
                state: property.state,
              }
            : null,
          financial,
          timeTracking,
        };
      })
    );

    return enrichedJobs;
  },
});

/**
 * Search jobs
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    query: v.string(),
    status: v.optional(jobStatus),
    priority: v.optional(jobPriority),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_jobs");

    if (!args.query.trim()) {
      // Return recent jobs if no query
      const jobs = await ctx.db
        .query("jobs")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .take(args.limit ?? 20);
      return filterAccessibleEntities(authCtx, jobs);
    }

    const results = await ctx.db
      .query("jobs")
      .withSearchIndex("search_jobs", (q) => {
        let search = q.search("searchText", args.query.toLowerCase());
        search = search.eq("companyId", args.companyId);
        if (args.status) {
          search = search.eq("status", args.status);
        }
        if (args.priority) {
          search = search.eq("priority", args.priority);
        }
        return search;
      })
      .take(args.limit ?? 20);

    return filterAccessibleEntities(authCtx, excludeDeleted(results));
  },
});

/**
 * Get job stats for dashboard
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_jobs");

    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    // Filter by access
    jobs = filterAccessibleEntities(authCtx, jobs);

    const active = jobs.filter((j) => !j.archivedAt);

    return {
      total: jobs.length,
      quoted: active.filter((j) => j.status === "quoted").length,
      scheduled: active.filter((j) => j.status === "scheduled").length,
      inProgress: active.filter((j) => j.status === "in_progress").length,
      onHold: active.filter((j) => j.status === "on_hold").length,
      completed: active.filter((j) => j.status === "completed").length,
      cancelled: active.filter((j) => j.status === "cancelled").length,
      invoiced: active.filter((j) => j.status === "invoiced").length,
      paid: active.filter((j) => j.status === "paid").length,
      byPriority: {
        low: active.filter((j) => j.priority === "low").length,
        medium: active.filter((j) => j.priority === "medium").length,
        high: active.filter((j) => j.priority === "high").length,
        urgent: active.filter((j) => j.priority === "urgent").length,
      },
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new job
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.optional(v.id("customers")),
    propertyId: v.optional(v.id("properties")),
    assignedTo: v.optional(v.id("users")),

    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(jobStatus),
    priority: v.optional(jobPriority),
    jobType: v.optional(jobType),
    serviceType: v.optional(v.string()),

    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),

    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    totalAmount: v.optional(v.number()),

    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    source: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_jobs");

    // Validate title
    if (!args.title.trim()) {
      throw new Error("Job title is required");
    }

    // Validate customer if provided
    if (args.customerId) {
      const customer = await ctx.db.get(args.customerId);
      if (!customer || customer.companyId !== args.companyId) {
        throw new Error("Invalid customer");
      }
    }

    // Validate property if provided
    if (args.propertyId) {
      const property = await ctx.db.get(args.propertyId);
      if (!property || property.companyId !== args.companyId) {
        throw new Error("Invalid property");
      }
    }

    // Validate assigned user if provided
    if (args.assignedTo) {
      const membership = await ctx.db
        .query("teamMembers")
        .withIndex("by_company_user", (q) =>
          q.eq("companyId", args.companyId).eq("userId", args.assignedTo!)
        )
        .filter((q) => q.eq(q.field("status"), "active"))
        .unique();

      if (!membership) {
        throw new Error("Assigned user is not a member of this company");
      }
    }

    // Generate job number
    const jobNumber = await generateJobNumber(ctx, args.companyId);

    const jobId = await ctx.db.insert("jobs", {
      companyId: args.companyId,
      customerId: args.customerId,
      propertyId: args.propertyId,
      assignedTo: args.assignedTo,
      jobNumber,
      title: args.title.trim(),
      description: args.description?.trim(),
      status: args.status ?? "quoted",
      priority: args.priority ?? "medium",
      jobType: args.jobType,
      serviceType: args.serviceType,
      scheduledStart: args.scheduledStart,
      scheduledEnd: args.scheduledEnd,
      subtotal: args.subtotal,
      taxRate: args.taxRate,
      taxAmount: args.taxAmount,
      discountAmount: args.discountAmount,
      totalAmount: args.totalAmount,
      internalNotes: args.internalNotes,
      source: args.source,
      metadata: args.metadata,
      searchText: generateSearchText({
        jobNumber,
        title: args.title,
        description: args.description,
        notes: args.notes,
      }),
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    // Create financial record if amounts provided
    if (args.totalAmount !== undefined) {
      await ctx.db.insert("jobFinancial", {
        jobId,
        subtotal: args.subtotal ?? 0,
        taxRate: args.taxRate ?? 0,
        taxAmount: args.taxAmount ?? 0,
        discountAmount: args.discountAmount ?? 0,
        totalAmount: args.totalAmount,
        paidAmount: 0,
        createdBy: authCtx.userId,
        updatedBy: authCtx.userId,
      });
    }

    // Create time tracking record
    await ctx.db.insert("jobTimeTracking", {
      jobId,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    // Create team assignment if assigned
    if (args.assignedTo) {
      await ctx.db.insert("jobTeamAssignments", {
        jobId,
        userId: args.assignedTo,
        role: "lead",
        assignedAt: Date.now(),
        assignedBy: authCtx.userId,
      });
    }

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "job",
      entityId: jobId,
      metadata: { jobNumber, title: args.title },
    });

    return jobId;
  },
});

/**
 * Update a job
 */
export const update = mutation({
  args: {
    jobId: v.id("jobs"),

    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(jobStatus),
    priority: v.optional(jobPriority),
    jobType: v.optional(jobType),
    serviceType: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),

    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
    actualStart: v.optional(v.number()),
    actualEnd: v.optional(v.number()),

    completionNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { jobId, ...updates } = args;

    const job = await ctx.db.get(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);
    requirePermission(authCtx, "update_job_status");

    if (job.deletedAt) {
      throw new Error("Cannot update deleted job");
    }

    // Validate assigned user if changing
    if (updates.assignedTo && updates.assignedTo !== job.assignedTo) {
      const membership = await ctx.db
        .query("teamMembers")
        .withIndex("by_company_user", (q) =>
          q.eq("companyId", job.companyId).eq("userId", updates.assignedTo!)
        )
        .filter((q) => q.eq(q.field("status"), "active"))
        .unique();

      if (!membership) {
        throw new Error("Assigned user is not a member of this company");
      }
    }

    // Track changes
    const changes = trackChanges(job, updates);

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = typeof value === "string" ? value.trim() : value;
      }
    }

    // Update search text if title changed
    if (updates.title || updates.description) {
      updateData.searchText = generateSearchText({
        jobNumber: job.jobNumber,
        title: updates.title ?? job.title,
        description: updates.description ?? job.description,
        notes: job.internalNotes,
      });
    }

    await ctx.db.patch(jobId, updateData);

    // Update time tracking if actual times changed
    if (updates.actualStart !== undefined || updates.actualEnd !== undefined) {
      const timeTracking = await ctx.db
        .query("jobTimeTracking")
        .withIndex("by_job", (q) => q.eq("jobId", jobId))
        .unique();

      if (timeTracking) {
        const ttUpdates: Record<string, unknown> = { updatedBy: authCtx.userId };
        if (updates.actualStart !== undefined) ttUpdates.actualStart = updates.actualStart;
        if (updates.actualEnd !== undefined) ttUpdates.actualEnd = updates.actualEnd;

        // Calculate total minutes
        const start = updates.actualStart ?? timeTracking.actualStart;
        const end = updates.actualEnd ?? timeTracking.actualEnd;
        if (start && end) {
          ttUpdates.totalMinutes = Math.round((end - start) / 60000);
        }

        await ctx.db.patch(timeTracking._id, ttUpdates);
      }
    }

    // Create team assignment if assigned to someone new
    if (updates.assignedTo && updates.assignedTo !== job.assignedTo) {
      // Check if already assigned
      const existingAssignment = await ctx.db
        .query("jobTeamAssignments")
        .withIndex("by_job", (q) => q.eq("jobId", jobId))
        .filter((q) =>
          q.and(
            q.eq(q.field("userId"), updates.assignedTo),
            q.eq(q.field("deletedAt"), undefined)
          )
        )
        .unique();

      if (!existingAssignment) {
        await ctx.db.insert("jobTeamAssignments", {
          jobId,
          userId: updates.assignedTo,
          role: "lead",
          assignedAt: Date.now(),
          assignedBy: authCtx.userId,
        });
      }
    }

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: job.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "job",
        entityId: jobId,
        changes,
      });
    }

    return jobId;
  },
});

/**
 * Update job status
 */
export const updateStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: jobStatus,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);
    requirePermission(authCtx, "update_job_status");

    // Check entity access for technicians
    if (!canAccessEntity(authCtx, job)) {
      throw new Error("Access denied to update this job");
    }

    const oldStatus = job.status;

    const updateData: Record<string, unknown> = {
      status: args.status,
      updatedBy: authCtx.userId,
    };

    // Handle status-specific updates
    if (args.status === "in_progress" && oldStatus !== "in_progress") {
      updateData.actualStart = Date.now();

      // Update time tracking
      const timeTracking = await ctx.db
        .query("jobTimeTracking")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .unique();
      if (timeTracking) {
        await ctx.db.patch(timeTracking._id, { actualStart: Date.now() });
      }
    }

    if (args.status === "completed" && oldStatus !== "completed") {
      updateData.actualEnd = Date.now();
      if (args.notes) {
        updateData.completionNotes = args.notes;
      }

      // Update time tracking
      const timeTracking = await ctx.db
        .query("jobTimeTracking")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
        .unique();
      if (timeTracking) {
        const actualEnd = Date.now();
        const totalMinutes = timeTracking.actualStart
          ? Math.round((actualEnd - timeTracking.actualStart) / 60000)
          : 0;
        await ctx.db.patch(timeTracking._id, { actualEnd, totalMinutes });
      }
    }

    await ctx.db.patch(args.jobId, updateData);

    await createAuditLog(ctx, {
      companyId: job.companyId,
      userId: authCtx.userId,
      action: "status_change",
      entityType: "job",
      entityId: args.jobId,
      changes: { status: { old: oldStatus, new: args.status } },
      metadata: { notes: args.notes },
    });

    return args.jobId;
  },
});

/**
 * Archive a job
 */
export const archive = mutation({
  args: {
    jobId: v.id("jobs"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can archive jobs");
    }

    if (job.archivedAt) {
      throw new Error("Job is already archived");
    }

    await ctx.db.patch(args.jobId, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
      status: "archived",
    });

    await createAuditLog(ctx, {
      companyId: job.companyId,
      userId: authCtx.userId,
      action: "archive",
      entityType: "job",
      entityId: args.jobId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Delete a job (soft delete)
 */
export const remove = mutation({
  args: {
    jobId: v.id("jobs"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete jobs");
    }

    if (job.deletedAt) {
      throw new Error("Job is already deleted");
    }

    // Check for linked invoices
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .take(1);

    if (invoices.length > 0) {
      throw new Error("Cannot delete job with linked invoices");
    }

    await ctx.db.patch(args.jobId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: job.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "job",
      entityId: args.jobId,
      metadata: { jobNumber: job.jobNumber, reason: args.reason },
    });

    return { success: true };
  },
});

// ============================================================================
// TEAM ASSIGNMENT MUTATIONS
// ============================================================================

/**
 * Add team member to job
 */
export const addTeamMember = mutation({
  args: {
    jobId: v.id("jobs"),
    userId: v.id("users"),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);
    requirePermission(authCtx, "dispatch_jobs");

    // Verify user is a team member
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_company_user", (q) =>
        q.eq("companyId", job.companyId).eq("userId", args.userId)
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .unique();

    if (!membership) {
      throw new Error("User is not a member of this company");
    }

    // Check if already assigned
    const existing = await ctx.db
      .query("jobTeamAssignments")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("deletedAt"), undefined)
        )
      )
      .unique();

    if (existing) {
      throw new Error("User is already assigned to this job");
    }

    const assignmentId = await ctx.db.insert("jobTeamAssignments", {
      jobId: args.jobId,
      userId: args.userId,
      role: args.role ?? "helper",
      assignedAt: Date.now(),
      assignedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: job.companyId,
      userId: authCtx.userId,
      action: "add_team_member",
      entityType: "job",
      entityId: args.jobId,
      metadata: { assignedUserId: args.userId, role: args.role },
    });

    return assignmentId;
  },
});

/**
 * Remove team member from job
 */
export const removeTeamMember = mutation({
  args: {
    jobId: v.id("jobs"),
    assignmentId: v.id("jobTeamAssignments"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const authCtx = await requireCompanyAccess(ctx, job.companyId);
    requirePermission(authCtx, "dispatch_jobs");

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || assignment.jobId !== args.jobId) {
      throw new Error("Assignment not found");
    }

    await ctx.db.patch(args.assignmentId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: job.companyId,
      userId: authCtx.userId,
      action: "remove_team_member",
      entityType: "job",
      entityId: args.jobId,
      metadata: { removedUserId: assignment.userId },
    });

    return { success: true };
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import job from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.optional(v.string()),
    propertySupabaseId: v.optional(v.string()),
    assignedToSupabaseId: v.optional(v.string()),
    jobNumber: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Find company mapping
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
        q.eq("tableName", "jobs").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    // Find optional mappings
    let customerId: any = undefined;
    let propertyId: any = undefined;
    let assignedTo: any = undefined;

    if (args.customerSupabaseId) {
      const customerMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "customers").eq("supabaseId", args.customerSupabaseId!)
        )
        .unique();
      if (customerMapping) customerId = customerMapping.convexId;
    }

    if (args.propertySupabaseId) {
      const propertyMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "properties").eq("supabaseId", args.propertySupabaseId!)
        )
        .unique();
      if (propertyMapping) propertyId = propertyMapping.convexId;
    }

    if (args.assignedToSupabaseId) {
      const userMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "users").eq("supabaseId", args.assignedToSupabaseId!)
        )
        .unique();
      if (userMapping) assignedTo = userMapping.convexId;
    }

    const jobId = await ctx.db.insert("jobs", {
      companyId: companyMapping.convexId as any,
      customerId,
      propertyId,
      assignedTo,
      jobNumber: args.jobNumber,
      title: args.title,
      description: args.description,
      status: args.status as any,
      priority: args.priority as any,
      scheduledStart: args.scheduledStart,
      scheduledEnd: args.scheduledEnd,
      totalAmount: args.totalAmount,
      metadata: args.metadata,
      searchText: generateSearchText({
        jobNumber: args.jobNumber,
        title: args.title,
        description: args.description,
      }),
    });

    await ctx.db.insert("migrationMappings", {
      tableName: "jobs",
      supabaseId: args.supabaseId,
      convexId: jobId,
      migratedAt: Date.now(),
    });

    return jobId;
  },
});
