/**
 * Notification queries and mutations
 * Replaces Supabase real-time subscriptions with Convex's built-in reactivity
 */
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser, excludeDeleted } from "./lib/auth";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List notifications for current user
 * This query is reactive - UI will automatically update when data changes
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    let query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined));

    if (args.unreadOnly) {
      query = ctx.db
        .query("notifications")
        .withIndex("by_user_unread", (q) =>
          q.eq("userId", userId).eq("readAt", undefined)
        )
        .filter((q) => q.eq(q.field("deletedAt"), undefined));
    }

    const notifications = await query
      .order("desc")
      .take(args.limit ?? 50);

    return notifications;
  },
});

/**
 * Get unread notification count
 * Reactive - perfect for badge counters
 */
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) =>
        q.eq("userId", userId).eq("readAt", undefined)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("dismissedAt"), undefined)
        )
      )
      .collect();

    return unread.length;
  },
});

/**
 * Get a single notification
 */
export const get = query({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Access denied");
    }

    return notification;
  },
});

/**
 * Get notifications by type
 */
export const getByType = query({
  args: {
    type: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("type"), args.type)
        )
      )
      .order("desc")
      .take(args.limit ?? 20);

    return notifications;
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Mark a notification as read
 */
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Access denied");
    }

    if (!notification.readAt) {
      await ctx.db.patch(args.notificationId, {
        readAt: Date.now(),
      });
    }

    return args.notificationId;
  },
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) =>
        q.eq("userId", userId).eq("readAt", undefined)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const now = Date.now();
    for (const notification of unread) {
      await ctx.db.patch(notification._id, { readAt: now });
    }

    return { count: unread.length };
  },
});

/**
 * Dismiss a notification
 */
export const dismiss = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(args.notificationId, {
      dismissedAt: Date.now(),
    });

    return args.notificationId;
  },
});

/**
 * Delete a notification (soft delete)
 */
export const remove = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(args.notificationId, {
      deletedAt: Date.now(),
      deletedBy: userId,
    });

    return { success: true };
  },
});

/**
 * Clear all notifications
 */
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const now = Date.now();
    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        deletedAt: now,
        deletedBy: userId,
      });
    }

    return { count: notifications.length };
  },
});

// ============================================================================
// INTERNAL MUTATIONS (for creating notifications from other modules)
// ============================================================================

/**
 * Create a notification (internal - called by other modules)
 */
export const create = internalMutation({
  args: {
    userId: v.id("users"),
    companyId: v.id("companies"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      companyId: args.companyId,
      type: args.type,
      title: args.title,
      message: args.message,
      entityType: args.entityType,
      entityId: args.entityId,
      actionUrl: args.actionUrl,
      actionLabel: args.actionLabel,
      data: args.data,
    });

    return notificationId;
  },
});

/**
 * Create notification for multiple users (internal)
 */
export const createBulk = internalMutation({
  args: {
    userIds: v.array(v.id("users")),
    companyId: v.id("companies"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const notificationIds: string[] = [];

    for (const userId of args.userIds) {
      const notificationId = await ctx.db.insert("notifications", {
        userId,
        companyId: args.companyId,
        type: args.type,
        title: args.title,
        message: args.message,
        entityType: args.entityType,
        entityId: args.entityId,
        actionUrl: args.actionUrl,
        data: args.data,
      });
      notificationIds.push(notificationId);
    }

    return { count: notificationIds.length, ids: notificationIds };
  },
});

/**
 * Notify company team members (internal)
 */
export const notifyTeam = internalMutation({
  args: {
    companyId: v.id("companies"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
    data: v.optional(v.any()),
    roles: v.optional(v.array(v.string())), // Filter by roles
    excludeUserId: v.optional(v.id("users")), // Exclude specific user (e.g., the actor)
  },
  handler: async (ctx, args) => {
    // Get team members
    let query = ctx.db
      .query("teamMembers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("deletedAt"), undefined)
        )
      );

    let members = await query.collect();

    // Filter by roles if specified
    if (args.roles && args.roles.length > 0) {
      members = members.filter((m) => args.roles!.includes(m.role));
    }

    // Exclude specific user
    if (args.excludeUserId) {
      members = members.filter((m) => m.userId !== args.excludeUserId);
    }

    // Create notifications
    const notificationIds: string[] = [];
    for (const member of members) {
      const notificationId = await ctx.db.insert("notifications", {
        userId: member.userId,
        companyId: args.companyId,
        type: args.type,
        title: args.title,
        message: args.message,
        entityType: args.entityType,
        entityId: args.entityId,
        actionUrl: args.actionUrl,
        data: args.data,
      });
      notificationIds.push(notificationId);
    }

    return { count: notificationIds.length };
  },
});

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

/**
 * Common notification types for reference:
 *
 * Job notifications:
 * - job_created: New job created
 * - job_assigned: Job assigned to technician
 * - job_status_changed: Job status updated
 * - job_completed: Job marked complete
 *
 * Invoice notifications:
 * - invoice_sent: Invoice sent to customer
 * - invoice_viewed: Customer viewed invoice
 * - invoice_paid: Payment received
 * - invoice_overdue: Invoice past due date
 *
 * Payment notifications:
 * - payment_received: Payment completed
 * - payment_failed: Payment failed
 * - payment_refunded: Refund processed
 *
 * Team notifications:
 * - team_member_joined: New team member
 * - team_member_removed: Team member removed
 * - role_changed: Role updated
 *
 * Customer notifications:
 * - customer_created: New customer
 * - customer_message: Customer sent message
 *
 * System notifications:
 * - system_announcement: Platform announcements
 * - subscription_warning: Subscription issues
 */
