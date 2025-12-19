import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import {
  requireCompanyAccess,
  requirePermission,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { tagCategory } from "./lib/validators";

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================

/**
 * Generate a URL-friendly slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ==========================================================================
// QUERIES
// ==========================================================================

/**
 * List all tags for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    category: v.optional(tagCategory),
    isActive: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let tagsQuery;

    if (args.category) {
      tagsQuery = ctx.db
        .query("tags")
        .withIndex("by_company_category", (q) =>
          q.eq("companyId", args.companyId).eq("category", args.category!)
        );
    } else {
      tagsQuery = ctx.db
        .query("tags")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId));
    }

    let tags = await tagsQuery.collect();

    // Filter by active status
    if (args.isActive !== undefined) {
      tags = tags.filter((t) => t.isActive === args.isActive);
    }

    // Sort by name
    tags.sort((a, b) => a.name.localeCompare(b.name));

    const limit = args.limit ?? 100;
    return tags.slice(0, limit);
  },
});

/**
 * Get a single tag by ID
 */
export const get = query({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) return null;

    await requireCompanyAccess(ctx, tag.companyId);
    return tag;
  },
});

/**
 * Get tag by slug
 */
export const getBySlug = query({
  args: {
    companyId: v.id("companies"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const tag = await ctx.db
      .query("tags")
      .withIndex("by_company_slug", (q) =>
        q.eq("companyId", args.companyId).eq("slug", args.slug)
      )
      .first();

    return tag;
  },
});

/**
 * Search tags by name
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    searchQuery: v.string(),
    category: v.optional(tagCategory),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const tags = await ctx.db
      .query("tags")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const searchLower = args.searchQuery.toLowerCase();
    let filtered = tags.filter(
      (t) =>
        t.isActive &&
        (t.name.toLowerCase().includes(searchLower) ||
          t.slug.includes(searchLower))
    );

    if (args.category) {
      filtered = filtered.filter((t) => t.category === args.category);
    }

    // Sort by relevance (exact matches first) then by usage count
    filtered.sort((a, b) => {
      const aExact = a.name.toLowerCase() === searchLower;
      const bExact = b.name.toLowerCase() === searchLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return b.usageCount - a.usageCount;
    });

    return filtered.slice(0, args.limit ?? 20);
  },
});

/**
 * Get popular tags
 */
export const getPopular = query({
  args: {
    companyId: v.id("companies"),
    category: v.optional(tagCategory),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let tags;
    if (args.category) {
      tags = await ctx.db
        .query("tags")
        .withIndex("by_company_category", (q) =>
          q.eq("companyId", args.companyId).eq("category", args.category!)
        )
        .collect();
    } else {
      tags = await ctx.db
        .query("tags")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
        .collect();
    }

    // Filter active tags and sort by usage
    const activeTags = tags.filter((t) => t.isActive);
    activeTags.sort((a, b) => b.usageCount - a.usageCount);

    return activeTags.slice(0, args.limit ?? 10);
  },
});

/**
 * Get tag statistics
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const tags = await ctx.db
      .query("tags")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const byCategory = {
      customer: 0,
      job: 0,
      equipment: 0,
      general: 0,
      status: 0,
      priority: 0,
    };

    let activeCount = 0;
    let totalUsage = 0;
    let systemCount = 0;

    for (const tag of tags) {
      if (tag.isActive) {
        activeCount++;
      }
      totalUsage += tag.usageCount;
      if (tag.isSystem) {
        systemCount++;
      }
      if (tag.category) {
        byCategory[tag.category as keyof typeof byCategory]++;
      }
    }

    return {
      total: tags.length,
      active: activeCount,
      inactive: tags.length - activeCount,
      system: systemCount,
      custom: tags.length - systemCount,
      totalUsage,
      byCategory,
      averageUsage: tags.length > 0 ? Math.round(totalUsage / tags.length) : 0,
    };
  },
});

/**
 * Get recently used tags
 */
export const getRecentlyUsed = query({
  args: {
    companyId: v.id("companies"),
    category: v.optional(tagCategory),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const tags = await ctx.db
      .query("tags")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    let filtered = tags.filter((t) => t.isActive && t.lastUsedAt);

    if (args.category) {
      filtered = filtered.filter((t) => t.category === args.category);
    }

    // Sort by last used date
    filtered.sort((a, b) => (b.lastUsedAt ?? 0) - (a.lastUsedAt ?? 0));

    return filtered.slice(0, args.limit ?? 10);
  },
});

/**
 * Get tags by category for UI
 */
export const getByCategory = query({
  args: {
    companyId: v.id("companies"),
    category: tagCategory,
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const tags = await ctx.db
      .query("tags")
      .withIndex("by_company_category", (q) =>
        q.eq("companyId", args.companyId).eq("category", args.category)
      )
      .collect();

    const activeTags = tags.filter((t) => t.isActive);
    activeTags.sort((a, b) => a.name.localeCompare(b.name));

    return activeTags;
  },
});

// ==========================================================================
// MUTATIONS
// ==========================================================================

/**
 * Create a new tag
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.optional(tagCategory),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "manage_jobs");

    const slug = generateSlug(args.name);

    // Check for existing tag with same slug
    const existing = await ctx.db
      .query("tags")
      .withIndex("by_company_slug", (q) =>
        q.eq("companyId", args.companyId).eq("slug", slug)
      )
      .first();

    if (existing) {
      throw new Error(`Tag "${args.name}" already exists`);
    }

    const tagId = await ctx.db.insert("tags", {
      companyId: args.companyId,
      name: args.name,
      slug,
      description: args.description,
      category: args.category ?? "general",
      color: args.color,
      icon: args.icon,
      usageCount: 0,
      isActive: true,
      isSystem: false,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "tag.created",
      entityType: "tag",
      entityId: tagId,
      newValues: { name: args.name, slug, category: args.category },
    });

    return tagId;
  },
});

/**
 * Update a tag
 */
export const update = mutation({
  args: {
    id: v.id("tags"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(tagCategory),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("Tag not found");
    }

    if (tag.isSystem) {
      throw new Error("Cannot modify system tags");
    }

    const authCtx = await requireCompanyAccess(ctx, tag.companyId);
    requirePermission(authCtx, "manage_jobs");

    const { id, ...updates } = args;

    // Update slug if name changed
    let slug = tag.slug;
    if (args.name && args.name !== tag.name) {
      slug = generateSlug(args.name);

      // Check for existing tag with same slug
      const existing = await ctx.db
        .query("tags")
        .withIndex("by_company_slug", (q) =>
          q.eq("companyId", tag.companyId).eq("slug", slug)
        )
        .first();

      if (existing && existing._id !== args.id) {
        throw new Error(`Tag "${args.name}" already exists`);
      }
    }

    const changes = trackChanges(tag, updates);

    await ctx.db.patch(args.id, {
      ...updates,
      slug,
    });

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: tag.companyId,
        userId: authCtx.userId,
        action: "tag.updated",
        entityType: "tag",
        entityId: args.id,
        previousValues: Object.fromEntries(
          Object.keys(changes).map((k) => [k, tag[k as keyof typeof tag]])
        ),
        newValues: changes,
      });
    }

    return args.id;
  },
});

/**
 * Increment usage count and update last used time
 */
export const recordUsage = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("Tag not found");
    }

    await requireCompanyAccess(ctx, tag.companyId);

    await ctx.db.patch(args.id, {
      usageCount: tag.usageCount + 1,
      lastUsedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Decrement usage count
 */
export const decrementUsage = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("Tag not found");
    }

    await requireCompanyAccess(ctx, tag.companyId);

    await ctx.db.patch(args.id, {
      usageCount: Math.max(0, tag.usageCount - 1),
    });

    return args.id;
  },
});

/**
 * Activate a tag
 */
export const activate = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("Tag not found");
    }

    const authCtx = await requireCompanyAccess(ctx, tag.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      isActive: true,
    });

    await createAuditLog(ctx, {
      companyId: tag.companyId,
      userId: authCtx.userId,
      action: "tag.activated",
      entityType: "tag",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Deactivate a tag
 */
export const deactivate = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("Tag not found");
    }

    if (tag.isSystem) {
      throw new Error("Cannot deactivate system tags");
    }

    const authCtx = await requireCompanyAccess(ctx, tag.companyId);
    requirePermission(authCtx, "manage_jobs");

    await ctx.db.patch(args.id, {
      isActive: false,
    });

    await createAuditLog(ctx, {
      companyId: tag.companyId,
      userId: authCtx.userId,
      action: "tag.deactivated",
      entityType: "tag",
      entityId: args.id,
    });

    return args.id;
  },
});

/**
 * Merge tags (combine multiple tags into one)
 */
export const merge = mutation({
  args: {
    targetId: v.id("tags"),
    sourceIds: v.array(v.id("tags")),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.targetId);
    if (!target) {
      throw new Error("Target tag not found");
    }

    const authCtx = await requireCompanyAccess(ctx, target.companyId);
    requirePermission(authCtx, "delete_records");

    let totalUsage = target.usageCount;

    for (const sourceId of args.sourceIds) {
      const source = await ctx.db.get(sourceId);
      if (!source || source.companyId !== target.companyId) {
        continue;
      }

      if (source.isSystem) {
        throw new Error("Cannot merge system tags");
      }

      totalUsage += source.usageCount;

      // Delete the source tag
      await ctx.db.delete(sourceId);
    }

    // Update target with combined usage
    await ctx.db.patch(args.targetId, {
      usageCount: totalUsage,
    });

    await createAuditLog(ctx, {
      companyId: target.companyId,
      userId: authCtx.userId,
      action: "tag.merged",
      entityType: "tag",
      entityId: args.targetId,
      newValues: {
        mergedFrom: args.sourceIds,
        newUsageCount: totalUsage,
      },
    });

    return args.targetId;
  },
});

/**
 * Delete a tag
 */
export const remove = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("Tag not found");
    }

    if (tag.isSystem) {
      throw new Error("Cannot delete system tags");
    }

    const authCtx = await requireCompanyAccess(ctx, tag.companyId);
    requirePermission(authCtx, "delete_records");

    await ctx.db.delete(args.id);

    await createAuditLog(ctx, {
      companyId: tag.companyId,
      userId: authCtx.userId,
      action: "tag.deleted",
      entityType: "tag",
      entityId: args.id,
      previousValues: { name: tag.name, slug: tag.slug },
    });

    return args.id;
  },
});

// ==========================================================================
// INTERNAL MUTATIONS (for migration and system)
// ==========================================================================

/**
 * Import tag from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companyId: v.id("companies"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    category: v.optional(tagCategory),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    usageCount: v.number(),
    lastUsedAt: v.optional(v.number()),
    isActive: v.boolean(),
    isSystem: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { supabaseId, ...tagData } = args;

    // Check if already migrated
    const existing = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "tags").eq("supabaseId", supabaseId)
      )
      .first();

    if (existing) {
      return existing.convexId;
    }

    const tagId = await ctx.db.insert("tags", tagData);

    // Create migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "tags",
      supabaseId,
      convexId: tagId,
      migratedAt: Date.now(),
    });

    return tagId;
  },
});

/**
 * Create system tags for a new company
 */
export const createSystemTags = internalMutation({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const systemTags = [
      // Status tags
      { name: "Urgent", category: "status", color: "#ef4444" },
      { name: "Priority", category: "priority", color: "#f97316" },
      { name: "VIP", category: "customer", color: "#a855f7" },
      { name: "New Customer", category: "customer", color: "#22c55e" },
      // Job tags
      { name: "Recurring", category: "job", color: "#3b82f6" },
      { name: "Emergency", category: "job", color: "#dc2626" },
      { name: "Maintenance", category: "job", color: "#6b7280" },
      // General tags
      { name: "Follow Up", category: "general", color: "#eab308" },
      { name: "Resolved", category: "general", color: "#10b981" },
    ];

    const tagIds = [];

    for (const tagData of systemTags) {
      const slug = generateSlug(tagData.name);

      const tagId = await ctx.db.insert("tags", {
        companyId: args.companyId,
        name: tagData.name,
        slug,
        category: tagData.category as "customer" | "job" | "equipment" | "general" | "status" | "priority",
        color: tagData.color,
        usageCount: 0,
        isActive: true,
        isSystem: true,
      });

      tagIds.push(tagId);
    }

    return tagIds;
  },
});
