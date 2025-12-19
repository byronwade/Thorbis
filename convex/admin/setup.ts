/**
 * Admin Setup Mutations
 *
 * Internal mutations for setting up admin users
 */
import { internalMutation, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";

/**
 * Create an admin user with full access to both dashboards
 * This creates:
 * 1. A user record in the users table
 * 2. A company (or uses existing demo company)
 * 3. Team membership with owner/admin role
 */
export const createAdminUser = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .unique();

    let userId;
    if (existingUser) {
      console.log(`User already exists: ${existingUser._id}`);
      userId = existingUser._id;

      // Update token identifier if needed
      if (existingUser.tokenIdentifier !== args.tokenIdentifier) {
        await ctx.db.patch(existingUser._id, {
          tokenIdentifier: args.tokenIdentifier,
          name: args.name,
        });
      }
    } else {
      // Create new user
      userId = await ctx.db.insert("users", {
        tokenIdentifier: args.tokenIdentifier,
        name: args.name,
        email: args.email.toLowerCase(),
        isActive: true,
        emailVerified: true,
        lastLoginAt: Date.now(),
      });
      console.log(`Created user: ${userId}`);
    }

    // Find or create the demo company
    let company = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", "demo-hvac-services"))
      .unique();

    if (!company) {
      // Create demo company with this user as owner
      const companyId = await ctx.db.insert("companies", {
        name: "Demo HVAC Services",
        slug: "demo-hvac-services",
        ownerId: userId,
        email: "info@demo-hvac.com",
        phone: "+15551234567",
        website: "https://demo-hvac.com",
        address: "123 Main Street",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        country: "USA",
        onboardingCompleted: true,
        settings: {
          timezone: "America/Chicago",
          currency: "USD",
          dateFormat: "MM/DD/YYYY",
        },
        createdBy: userId,
        updatedBy: userId,
      });
      console.log(`Created company: ${companyId}`);
      company = await ctx.db.get(companyId);
    }

    if (!company) {
      throw new Error("Failed to create or find company");
    }

    // Check if team membership already exists
    const existingMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_company_user", (q) =>
        q.eq("companyId", company!._id).eq("userId", userId)
      )
      .unique();

    if (existingMembership) {
      // Update to owner role if not already
      if (existingMembership.role !== "owner") {
        await ctx.db.patch(existingMembership._id, {
          role: "owner",
          status: "active",
        });
        console.log(`Updated membership to owner role`);
      }
    } else {
      // Create team membership as owner
      const membershipId = await ctx.db.insert("teamMembers", {
        companyId: company._id,
        userId: userId,
        role: "owner",
        department: "Management",
        jobTitle: "Owner/Admin",
        status: "active",
        joinedAt: Date.now(),
        createdBy: userId,
        updatedBy: userId,
      });
      console.log(`Created team membership: ${membershipId}`);
    }

    return {
      userId,
      companyId: company._id,
      email: args.email,
      message: "Admin user created successfully",
    };
  },
});

/**
 * Setup admin action - wraps the mutation for CLI access
 */
export const setupAdminUser = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<{
    userId: Id<"users">;
    companyId: Id<"companies">;
    email: string;
    message: string;
    instructions: string[];
  }> => {
    // For Password auth, the token identifier follows a specific format
    // We'll use a placeholder that will be updated when the user signs up
    const tokenIdentifier = `password|${args.email.toLowerCase()}`;

    const result = await ctx.runMutation(internal.admin.setup.createAdminUser, {
      email: args.email,
      name: args.name,
      tokenIdentifier,
    });

    return {
      ...result,
      instructions: [
        "User record created in database.",
        "To complete setup:",
        "1. Go to the app login page",
        "2. Click 'Sign Up' and register with this email",
        `3. Use email: ${args.email}`,
        "4. Set your password",
        "The system will link your auth to this user record.",
      ],
    };
  },
});
