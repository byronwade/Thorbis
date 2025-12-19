/**
 * User queries and mutations
 */
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser, getOptionalUser, getUserCompanies } from "./lib/auth";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get the current authenticated user
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const auth = await getOptionalUser(ctx);
    if (!auth) return null;
    return auth.user;
  },
});

/**
 * Get the current user with their companies
 */
export const currentWithCompanies = query({
  args: {},
  handler: async (ctx) => {
    const auth = await getOptionalUser(ctx);
    if (!auth) return null;

    const companies = await getUserCompanies(ctx, auth.userId);

    return {
      user: auth.user,
      companies: companies.map(({ company, membership }) => ({
        ...company,
        role: membership.role,
        status: membership.status,
      })),
    };
  },
});

/**
 * Get user by ID (requires authentication)
 */
export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);
    return await ctx.db.get(args.userId);
  },
});

/**
 * Get user by email
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .unique();
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Update current user's profile
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const updates: Record<string, unknown> = {};

    if (args.name !== undefined) {
      if (!args.name.trim()) {
        throw new Error("Name cannot be empty");
      }
      updates.name = args.name.trim();
    }

    if (args.phone !== undefined) {
      updates.phone = args.phone.trim() || undefined;
    }

    if (args.avatarUrl !== undefined) {
      updates.avatarUrl = args.avatarUrl || undefined;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }

    return userId;
  },
});

/**
 * Update user's last login timestamp
 */
export const recordLogin = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await getAuthenticatedUser(ctx);
    await ctx.db.patch(userId, { lastLoginAt: Date.now() });
  },
});

// ============================================================================
// INTERNAL MUTATIONS (for auth hooks)
// ============================================================================

/**
 * Create or update user from auth provider
 * Called by Convex Auth after successful authentication
 */
export const createOrUpdateFromAuth = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        lastLoginAt: Date.now(),
        ...(args.name && { name: args.name }),
        ...(args.avatarUrl && { avatarUrl: args.avatarUrl }),
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email.toLowerCase(),
      name: args.name || args.email.split("@")[0],
      avatarUrl: args.avatarUrl,
      isActive: true,
      emailVerified: false,
      lastLoginAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Import user from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    emailVerified: v.optional(v.boolean()),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already migrated
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .unique();

    if (existing) {
      return existing._id;
    }

    // Create user with migrated token identifier
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: `migrated:${args.supabaseId}`,
      email: args.email.toLowerCase(),
      name: args.name || args.email.split("@")[0],
      phone: args.phone,
      avatarUrl: args.avatarUrl,
      isActive: args.isActive ?? true,
      emailVerified: args.emailVerified,
      _migratedFromSupabase: args.supabaseId,
    });

    // Track migration mapping
    await ctx.db.insert("migrationMappings", {
      tableName: "users",
      supabaseId: args.supabaseId,
      convexId: userId,
      migratedAt: Date.now(),
    });

    return userId;
  },
});
