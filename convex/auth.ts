/**
 * Convex Better Auth Configuration
 * Handles authentication with email/password and social providers
 */
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { betterAuth } from "better-auth";
import { authConfig } from "./auth.config";

// Environment variables
const siteUrl = process.env.SITE_URL || "http://localhost:3000";

// Create the Better Auth component client
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Factory function to create Better Auth instance
 * Used in HTTP routes for handling auth requests
 */
export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth({
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		trustedOrigins: [
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
			siteUrl,
			process.env.SITE_URL || "",
		].filter(Boolean),
		plugins: [convex({ authConfig })],
	});
};

// ============================================================================
// AUTH QUERIES
// ============================================================================

/**
 * Get current authenticated user from Better Auth
 */
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.getAuthUser(ctx);
	},
});

/**
 * Get user by ID
 */
export const getUserById = query({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.userId);
	},
});

/**
 * Check if user is authenticated
 */
export const isAuthenticated = query({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);
		return user !== null;
	},
});

/**
 * Get user's active company memberships
 */
export const getUserMemberships = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) {
			return [];
		}

		// Find user in our users table by email
		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", authUser.email))
			.unique();

		if (!user) {
			return [];
		}

		const memberships = await ctx.db
			.query("teamMembers")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.filter((q) =>
				q.and(
					q.eq(q.field("status"), "active"),
					q.eq(q.field("deletedAt"), undefined)
				)
			)
			.collect();

		// Fetch company details for each membership
		const results = await Promise.all(
			memberships.map(async (membership) => {
				const company = await ctx.db.get(membership.companyId);
				if (!company || company.deletedAt) {
					return null;
				}
				return {
					membership,
					company,
				};
			})
		);

		return results.filter((r): r is NonNullable<typeof r> => r !== null);
	},
});

// ============================================================================
// AUTH MUTATIONS
// ============================================================================

/**
 * Update user profile
 */
export const updateProfile = mutation({
	args: {
		name: v.optional(v.string()),
		phone: v.optional(v.string()),
		avatarUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		// Find user in our users table
		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", authUser.email))
			.unique();

		if (!user) {
			throw new Error("User not found");
		}

		await ctx.db.patch(user._id, {
			...(args.name !== undefined && { name: args.name }),
			...(args.phone !== undefined && { phone: args.phone }),
			...(args.avatarUrl !== undefined && { avatarUrl: args.avatarUrl }),
		});

		return user._id;
	},
});

/**
 * Sync Better Auth user to our users table
 * Called after successful sign up to create user record
 */
export const syncUserFromAuth = mutation({
	args: {
		email: v.string(),
		name: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Check if user already exists
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.unique();

		if (existingUser) {
			// Update last login
			await ctx.db.patch(existingUser._id, {
				lastLoginAt: Date.now(),
			});
			return existingUser._id;
		}

		// Create new user
		const userId = await ctx.db.insert("users", {
			email: args.email,
			name: args.name ?? args.email.split("@")[0],
			tokenIdentifier: `email:${args.email}`,
			isActive: true,
			emailVerified: false,
			lastLoginAt: Date.now(),
		});

		return userId;
	},
});

// ============================================================================
// INTERNAL MUTATIONS (for admin/system use)
// ============================================================================

/**
 * Deactivate user account (admin only)
 */
export const deactivateUser = internalMutation({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.userId);
		if (!user) {
			throw new Error("User not found");
		}

		await ctx.db.patch(args.userId, {
			isActive: false,
		});

		return args.userId;
	},
});

/**
 * Reactivate user account (admin only)
 */
export const reactivateUser = internalMutation({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.userId);
		if (!user) {
			throw new Error("User not found");
		}

		await ctx.db.patch(args.userId, {
			isActive: true,
		});

		return args.userId;
	},
});

/**
 * Delete user account permanently (admin only)
 */
export const deleteUser = internalMutation({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.userId);
		if (!user) {
			throw new Error("User not found");
		}

		// Delete all team memberships
		const memberships = await ctx.db
			.query("teamMembers")
			.withIndex("by_user", (q) => q.eq("userId", args.userId))
			.collect();

		for (const membership of memberships) {
			await ctx.db.delete(membership._id);
		}

		// Delete user
		await ctx.db.delete(args.userId);

		return args.userId;
	},
});
