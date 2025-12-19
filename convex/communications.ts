/**
 * Communication queries and mutations
 * Replaces apps/web/src/lib/queries/communications.ts and related actions
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
  communicationType,
  communicationDirection,
  communicationStatus,
  communicationPriority,
} from "./lib/validators";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List communications for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    type: v.optional(communicationType),
    status: v.optional(communicationStatus),
    direction: v.optional(communicationDirection),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    assignedTo: v.optional(v.id("users")),
    includeArchived: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_communications");

    let query = ctx.db
      .query("communications")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.type) {
      query = ctx.db
        .query("communications")
        .withIndex("by_company_type", (q) =>
          q.eq("companyId", args.companyId).eq("type", args.type!)
        );
    }

    if (args.status) {
      query = ctx.db
        .query("communications")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    if (args.customerId) {
      query = ctx.db
        .query("communications")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId));
    }

    if (args.jobId) {
      query = ctx.db
        .query("communications")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId));
    }

    if (args.assignedTo) {
      query = ctx.db
        .query("communications")
        .withIndex("by_assigned", (q) => q.eq("assignedTo", args.assignedTo));
    }

    let communications = await query.collect();

    // Filter by company if we used a different index
    if (args.customerId || args.jobId || args.assignedTo) {
      communications = communications.filter((c) => c.companyId === args.companyId);
    }

    // Apply additional filters
    if (args.direction) {
      communications = communications.filter((c) => c.direction === args.direction);
    }

    communications = excludeDeleted(communications);

    if (!args.includeArchived) {
      communications = communications.filter((c) => !c.isArchived);
    }

    // Sort by creation time descending (newest first)
    communications.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0));

    const limit = args.limit ?? 50;
    communications = communications.slice(0, limit);

    return {
      communications,
      total: communications.length,
      hasMore: communications.length === limit,
    };
  },
});

/**
 * Get a single communication by ID
 */
export const get = query({
  args: { communicationId: v.id("communications") },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    await requireCompanyAccess(ctx, communication.companyId);

    if (communication.deletedAt) {
      throw new Error("Communication not found");
    }

    return communication;
  },
});

/**
 * Get communication with related data
 */
export const getComplete = query({
  args: { communicationId: v.id("communications") },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    await requireCompanyAccess(ctx, communication.companyId);

    const [customer, job, estimate, invoice, sentBy, assignee, parentMessage] =
      await Promise.all([
        communication.customerId ? ctx.db.get(communication.customerId) : null,
        communication.jobId ? ctx.db.get(communication.jobId) : null,
        communication.estimateId ? ctx.db.get(communication.estimateId) : null,
        communication.invoiceId ? ctx.db.get(communication.invoiceId) : null,
        communication.sentBy ? ctx.db.get(communication.sentBy) : null,
        communication.assignedTo ? ctx.db.get(communication.assignedTo) : null,
        communication.parentId ? ctx.db.get(communication.parentId) : null,
      ]);

    return {
      communication,
      customer,
      job,
      estimate,
      invoice,
      sentBy: sentBy
        ? { _id: sentBy._id, name: sentBy.name, email: sentBy.email }
        : null,
      assignee: assignee
        ? { _id: assignee._id, name: assignee.name, email: assignee.email }
        : null,
      parentMessage,
    };
  },
});

/**
 * Get communications in a thread
 */
export const getByThread = query({
  args: {
    threadId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const communications = await ctx.db
      .query("communications")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    // Sort by creation time ascending (oldest first for thread view)
    communications.sort((a, b) => (a._creationTime ?? 0) - (b._creationTime ?? 0));

    const limit = args.limit ?? 100;
    return communications.slice(0, limit);
  },
});

/**
 * Get communications for a customer
 */
export const getByCustomer = query({
  args: {
    customerId: v.id("customers"),
    type: v.optional(communicationType),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    await requireCompanyAccess(ctx, customer.companyId);

    let communications = await ctx.db
      .query("communications")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("isArchived"), false)
        )
      )
      .collect();

    if (args.type) {
      communications = communications.filter((c) => c.type === args.type);
    }

    // Sort by creation time descending
    communications.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0));

    const limit = args.limit ?? 50;
    return communications.slice(0, limit);
  },
});

/**
 * Get communications for a job
 */
export const getByJob = query({
  args: {
    jobId: v.id("jobs"),
    type: v.optional(communicationType),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    await requireCompanyAccess(ctx, job.companyId);

    let communications = await ctx.db
      .query("communications")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    if (args.type) {
      communications = communications.filter((c) => c.type === args.type);
    }

    // Sort by creation time descending
    communications.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0));

    const limit = args.limit ?? 50;
    return communications.slice(0, limit);
  },
});

/**
 * Get unread communications
 */
export const getUnread = query({
  args: {
    companyId: v.id("companies"),
    type: v.optional(communicationType),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let communications = await ctx.db
      .query("communications")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("direction"), "inbound"),
          q.eq(q.field("readAt"), undefined)
        )
      )
      .collect();

    if (args.type) {
      communications = communications.filter((c) => c.type === args.type);
    }

    // Sort by creation time descending (newest first)
    communications.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0));

    const limit = args.limit ?? 50;
    return communications.slice(0, limit);
  },
});

/**
 * Get communication stats for dashboard
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

    const communications = await ctx.db
      .query("communications")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.gte(q.field("_creationTime"), startDate)
        )
      )
      .collect();

    const active = communications.filter((c) => !c.isArchived);

    return {
      total: communications.length,
      byType: {
        email: active.filter((c) => c.type === "email").length,
        sms: active.filter((c) => c.type === "sms").length,
        phone: active.filter((c) => c.type === "phone").length,
        chat: active.filter((c) => c.type === "chat").length,
        note: active.filter((c) => c.type === "note").length,
      },
      byDirection: {
        inbound: active.filter((c) => c.direction === "inbound").length,
        outbound: active.filter((c) => c.direction === "outbound").length,
      },
      byStatus: {
        draft: active.filter((c) => c.status === "draft").length,
        queued: active.filter((c) => c.status === "queued").length,
        sending: active.filter((c) => c.status === "sending").length,
        sent: active.filter((c) => c.status === "sent").length,
        delivered: active.filter((c) => c.status === "delivered").length,
        failed: active.filter((c) => c.status === "failed").length,
        read: active.filter((c) => c.status === "read").length,
      },
      unread: active.filter(
        (c) => c.direction === "inbound" && !c.readAt
      ).length,
      avgResponseTime: 0, // Would need more complex calculation
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new communication
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    estimateId: v.optional(v.id("estimates")),
    invoiceId: v.optional(v.id("invoices")),

    type: communicationType,
    direction: communicationDirection,
    channel: v.optional(v.string()),

    fromAddress: v.optional(v.string()),
    fromName: v.optional(v.string()),
    toAddress: v.string(),
    toName: v.optional(v.string()),
    ccAddresses: v.optional(v.array(v.string())),
    bccAddresses: v.optional(v.array(v.string())),

    subject: v.optional(v.string()),
    body: v.string(),
    bodyHtml: v.optional(v.string()),

    attachments: v.optional(v.array(v.any())),

    threadId: v.optional(v.string()),
    parentId: v.optional(v.id("communications")),

    priority: v.optional(communicationPriority),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),

    templateId: v.optional(v.string()),
    isAutomated: v.optional(v.boolean()),
    isInternal: v.optional(v.boolean()),

    scheduledFor: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "create_communications");

    // Validate customer if provided
    if (args.customerId) {
      const customer = await ctx.db.get(args.customerId);
      if (!customer || customer.companyId !== args.companyId) {
        throw new Error("Invalid customer");
      }
    }

    // Generate thread ID if this is a new thread
    const threadId = args.threadId ?? `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const isThreadStarter = !args.parentId;

    const communicationId = await ctx.db.insert("communications", {
      companyId: args.companyId,
      customerId: args.customerId,
      jobId: args.jobId,
      estimateId: args.estimateId,
      invoiceId: args.invoiceId,
      type: args.type,
      direction: args.direction,
      channel: args.channel,
      fromAddress: args.fromAddress,
      fromName: args.fromName,
      toAddress: args.toAddress,
      toName: args.toName,
      ccAddresses: args.ccAddresses,
      bccAddresses: args.bccAddresses,
      subject: args.subject?.trim(),
      body: args.body,
      bodyHtml: args.bodyHtml,
      bodyPlain: args.body.replace(/<[^>]*>/g, ""), // Strip HTML
      attachments: args.attachments,
      attachmentCount: args.attachments?.length ?? 0,
      threadId,
      parentId: args.parentId,
      isThreadStarter,
      status: args.scheduledFor ? "queued" : "draft",
      priority: args.priority ?? "normal",
      category: args.category,
      tags: args.tags,
      templateId: args.templateId,
      isAutomated: args.isAutomated ?? false,
      isInternal: args.isInternal ?? false,
      isArchived: false,
      scheduledFor: args.scheduledFor,
      sentBy: authCtx.userId,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "communication",
      entityId: communicationId,
      metadata: { type: args.type, direction: args.direction },
    });

    return communicationId;
  },
});

/**
 * Send a communication
 */
export const send = mutation({
  args: {
    communicationId: v.id("communications"),
  },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, communication.companyId);
    requirePermission(authCtx, "create_communications");

    if (communication.status !== "draft") {
      throw new Error("Only draft communications can be sent");
    }

    // Mark as sending
    await ctx.db.patch(args.communicationId, {
      status: "sending",
      sentAt: Date.now(),
      updatedBy: authCtx.userId,
    });

    // TODO: Trigger actual send via provider (email, SMS, etc.)
    // This would be handled by an action that calls external APIs

    // For now, just mark as sent
    await ctx.db.patch(args.communicationId, {
      status: "sent",
    });

    await createAuditLog(ctx, {
      companyId: communication.companyId,
      userId: authCtx.userId,
      action: "send",
      entityType: "communication",
      entityId: args.communicationId,
    });

    return args.communicationId;
  },
});

/**
 * Reply to a communication
 */
export const reply = mutation({
  args: {
    parentId: v.id("communications"),
    body: v.string(),
    bodyHtml: v.optional(v.string()),
    attachments: v.optional(v.array(v.any())),
    sendImmediately: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const parent = await ctx.db.get(args.parentId);
    if (!parent) {
      throw new Error("Parent communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, parent.companyId);
    requirePermission(authCtx, "create_communications");

    // Create reply
    const replyId = await ctx.db.insert("communications", {
      companyId: parent.companyId,
      customerId: parent.customerId,
      jobId: parent.jobId,
      estimateId: parent.estimateId,
      invoiceId: parent.invoiceId,
      type: parent.type,
      direction: "outbound",
      channel: parent.channel,
      fromAddress: parent.toAddress, // Swap from/to
      fromName: parent.toName,
      toAddress: parent.fromAddress ?? parent.toAddress,
      toName: parent.fromName ?? parent.toName,
      subject: parent.subject ? `Re: ${parent.subject.replace(/^Re: /i, "")}` : undefined,
      body: args.body,
      bodyHtml: args.bodyHtml,
      bodyPlain: args.body.replace(/<[^>]*>/g, ""),
      attachments: args.attachments,
      attachmentCount: args.attachments?.length ?? 0,
      threadId: parent.threadId,
      parentId: args.parentId,
      isThreadStarter: false,
      status: args.sendImmediately ? "sending" : "draft",
      priority: parent.priority,
      isAutomated: false,
      isInternal: parent.isInternal,
      isArchived: false,
      sentBy: authCtx.userId,
      sentAt: args.sendImmediately ? Date.now() : undefined,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    if (args.sendImmediately) {
      // TODO: Trigger actual send
      await ctx.db.patch(replyId, { status: "sent" });
    }

    await createAuditLog(ctx, {
      companyId: parent.companyId,
      userId: authCtx.userId,
      action: "reply",
      entityType: "communication",
      entityId: replyId,
      metadata: { parentId: args.parentId },
    });

    return replyId;
  },
});

/**
 * Forward a communication
 */
export const forward = mutation({
  args: {
    communicationId: v.id("communications"),
    toAddress: v.string(),
    toName: v.optional(v.string()),
    additionalBody: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const original = await ctx.db.get(args.communicationId);
    if (!original) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, original.companyId);
    requirePermission(authCtx, "create_communications");

    const forwardBody = args.additionalBody
      ? `${args.additionalBody}\n\n---------- Forwarded message ----------\n${original.body}`
      : `---------- Forwarded message ----------\n${original.body}`;

    const forwardId = await ctx.db.insert("communications", {
      companyId: original.companyId,
      customerId: original.customerId,
      jobId: original.jobId,
      type: original.type,
      direction: "outbound",
      channel: original.channel,
      toAddress: args.toAddress,
      toName: args.toName,
      subject: original.subject ? `Fwd: ${original.subject.replace(/^Fwd: /i, "")}` : undefined,
      body: forwardBody,
      bodyPlain: forwardBody.replace(/<[^>]*>/g, ""),
      attachments: original.attachments,
      attachmentCount: original.attachmentCount,
      isThreadStarter: true,
      status: "draft",
      priority: original.priority,
      isAutomated: false,
      isInternal: false,
      isArchived: false,
      sentBy: authCtx.userId,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: original.companyId,
      userId: authCtx.userId,
      action: "forward",
      entityType: "communication",
      entityId: forwardId,
      metadata: { originalId: args.communicationId, toAddress: args.toAddress },
    });

    return forwardId;
  },
});

/**
 * Mark communication as read
 */
export const markAsRead = mutation({
  args: { communicationId: v.id("communications") },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, communication.companyId);

    if (!communication.readAt) {
      await ctx.db.patch(args.communicationId, {
        readAt: Date.now(),
        status: "read",
        updatedBy: authCtx.userId,
      });
    }

    return args.communicationId;
  },
});

/**
 * Mark communication as unread
 */
export const markAsUnread = mutation({
  args: { communicationId: v.id("communications") },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, communication.companyId);

    if (communication.readAt) {
      await ctx.db.patch(args.communicationId, {
        readAt: undefined,
        status: communication.status === "read" ? "delivered" : communication.status,
        updatedBy: authCtx.userId,
      });
    }

    return args.communicationId;
  },
});

/**
 * Archive a communication
 */
export const archive = mutation({
  args: { communicationId: v.id("communications") },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, communication.companyId);
    requirePermission(authCtx, "create_communications");

    await ctx.db.patch(args.communicationId, {
      isArchived: true,
      updatedBy: authCtx.userId,
    });

    return args.communicationId;
  },
});

/**
 * Unarchive a communication
 */
export const unarchive = mutation({
  args: { communicationId: v.id("communications") },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, communication.companyId);
    requirePermission(authCtx, "create_communications");

    await ctx.db.patch(args.communicationId, {
      isArchived: false,
      updatedBy: authCtx.userId,
    });

    return args.communicationId;
  },
});

/**
 * Update communication status (for webhook updates from providers)
 */
export const updateStatus = mutation({
  args: {
    communicationId: v.id("communications"),
    status: communicationStatus,
    providerStatus: v.optional(v.string()),
    providerMetadata: v.optional(v.any()),
    deliveredAt: v.optional(v.number()),
    failureReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const updateData: Record<string, unknown> = {
      status: args.status,
    };

    if (args.providerStatus) updateData.providerStatus = args.providerStatus;
    if (args.providerMetadata) updateData.providerMetadata = args.providerMetadata;
    if (args.deliveredAt) updateData.deliveredAt = args.deliveredAt;
    if (args.failureReason) updateData.failureReason = args.failureReason;

    if (args.status === "failed") {
      updateData.retryCount = (communication.retryCount ?? 0) + 1;
    }

    await ctx.db.patch(args.communicationId, updateData);

    return args.communicationId;
  },
});

/**
 * Assign communication to a team member
 */
export const assign = mutation({
  args: {
    communicationId: v.id("communications"),
    assignedTo: v.id("users"),
  },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, communication.companyId);
    requirePermission(authCtx, "create_communications");

    await ctx.db.patch(args.communicationId, {
      assignedTo: args.assignedTo,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: communication.companyId,
      userId: authCtx.userId,
      action: "assign",
      entityType: "communication",
      entityId: args.communicationId,
      metadata: { assignedTo: args.assignedTo },
    });

    return args.communicationId;
  },
});

/**
 * Delete a communication (soft delete)
 */
export const remove = mutation({
  args: {
    communicationId: v.id("communications"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const communication = await ctx.db.get(args.communicationId);
    if (!communication) {
      throw new Error("Communication not found");
    }

    const authCtx = await requireCompanyAccess(ctx, communication.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can delete communications");
    }

    await ctx.db.patch(args.communicationId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: communication.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "communication",
      entityId: args.communicationId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import communication from Supabase during migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    customerSupabaseId: v.optional(v.string()),
    jobSupabaseId: v.optional(v.string()),
    type: v.string(),
    direction: v.string(),
    toAddress: v.string(),
    subject: v.optional(v.string()),
    body: v.string(),
    status: v.string(),
    priority: v.string(),
    isInternal: v.boolean(),
    isArchived: v.boolean(),
    sentAt: v.optional(v.number()),
    readAt: v.optional(v.number()),
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
        q.eq("tableName", "communications").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    // Look up optional mappings
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

    const communicationId = await ctx.db.insert("communications", {
      companyId: companyMapping.convexId as any,
      customerId,
      jobId,
      type: args.type as any,
      direction: args.direction as any,
      toAddress: args.toAddress,
      subject: args.subject,
      body: args.body,
      bodyPlain: args.body.replace(/<[^>]*>/g, ""),
      isThreadStarter: true,
      status: args.status as any,
      priority: args.priority as any,
      isAutomated: false,
      isInternal: args.isInternal,
      isArchived: args.isArchived,
      sentAt: args.sentAt,
      readAt: args.readAt,
    });

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "communications",
      supabaseId: args.supabaseId,
      convexId: communicationId,
      migratedAt: Date.now(),
    });

    return communicationId;
  },
});
