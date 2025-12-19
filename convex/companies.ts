/**
 * Company queries and mutations
 */
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
  getAuthenticatedUser,
  requireCompanyAccess,
  requireCompanyOwner,
  hasMinimumRole,
  getUserCompanies,
  createAuditLog,
  trackChanges,
} from "./lib/auth";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get company by ID
 */
export const get = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    return await ctx.db.get(args.companyId);
  },
});

/**
 * Get company by slug
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    const company = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .unique();

    if (!company) {
      throw new Error("Company not found");
    }

    // Verify user has access
    await requireCompanyAccess(ctx, company._id);

    return company;
  },
});

/**
 * List all companies the current user has access to
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await getAuthenticatedUser(ctx);
    const companies = await getUserCompanies(ctx, userId);

    return companies.map(({ company, membership }) => ({
      ...company,
      role: membership.role,
      membershipStatus: membership.status,
    }));
  },
});

/**
 * Get company team members
 */
export const getTeamMembers = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let query = ctx.db
      .query("teamMembers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined));

    const members = await query.collect();

    // Apply filters
    let filtered = members;
    if (args.status) {
      filtered = filtered.filter((m) => m.status === args.status);
    }
    if (args.role) {
      filtered = filtered.filter((m) => m.role === args.role);
    }

    // Fetch user details for each member
    const enriched = await Promise.all(
      filtered.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                phone: user.phone,
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
 * Create a new company
 */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getAuthenticatedUser(ctx);

    // Validate name
    if (!args.name.trim()) {
      throw new Error("Company name is required");
    }

    // Generate slug if not provided
    const slug =
      args.slug ||
      args.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Check slug uniqueness
    const existingSlug = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .unique();

    if (existingSlug) {
      throw new Error("A company with this slug already exists");
    }

    // Create company
    const companyId = await ctx.db.insert("companies", {
      name: args.name.trim(),
      slug,
      ownerId: userId,
      email: args.email?.toLowerCase().trim(),
      phone: args.phone?.trim(),
      address: args.address?.trim(),
      city: args.city?.trim(),
      state: args.state?.trim(),
      zipCode: args.zipCode?.trim(),
      country: args.country?.trim() || "USA",
      website: args.website?.trim(),
      onboardingCompleted: false,
      createdBy: userId,
      updatedBy: userId,
    });

    // Add owner as team member
    await ctx.db.insert("teamMembers", {
      companyId,
      userId,
      role: "owner",
      status: "active",
      joinedAt: Date.now(),
      createdBy: userId,
      updatedBy: userId,
    });

    // Create audit log
    await createAuditLog(ctx, {
      companyId,
      userId,
      action: "create",
      entityType: "company",
      entityId: companyId,
      metadata: { name: args.name },
    });

    return companyId;
  },
});

/**
 * Update company details
 */
export const update = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    website: v.optional(v.string()),
    logo: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    settings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);

    // Only managers+ can update company details
    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Insufficient permissions to update company");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    const { companyId, ...updates } = args;

    // Track changes for audit log
    const changes = trackChanges(company, updates);

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        throw new Error("Company name cannot be empty");
      }
      updateData.name = updates.name.trim();
    }
    if (updates.email !== undefined) {
      updateData.email = updates.email?.toLowerCase().trim() || undefined;
    }
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone?.trim() || undefined;
    }
    if (updates.address !== undefined) {
      updateData.address = updates.address?.trim() || undefined;
    }
    if (updates.city !== undefined) {
      updateData.city = updates.city?.trim() || undefined;
    }
    if (updates.state !== undefined) {
      updateData.state = updates.state?.trim() || undefined;
    }
    if (updates.zipCode !== undefined) {
      updateData.zipCode = updates.zipCode?.trim() || undefined;
    }
    if (updates.country !== undefined) {
      updateData.country = updates.country?.trim() || undefined;
    }
    if (updates.website !== undefined) {
      updateData.website = updates.website?.trim() || undefined;
    }
    if (updates.logo !== undefined) {
      updateData.logo = updates.logo || undefined;
    }
    if (updates.primaryColor !== undefined) {
      updateData.primaryColor = updates.primaryColor || undefined;
    }
    if (updates.settings !== undefined) {
      updateData.settings = updates.settings;
    }

    await ctx.db.patch(args.companyId, updateData);

    // Audit log if there were changes
    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: args.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "company",
        entityId: args.companyId,
        changes,
      });
    }

    return args.companyId;
  },
});

/**
 * Complete onboarding
 */
export const completeOnboarding = mutation({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);

    await ctx.db.patch(args.companyId, {
      onboardingCompleted: true,
      onboardingCompletedAt: Date.now(),
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "complete_onboarding",
      entityType: "company",
      entityId: args.companyId,
    });

    return args.companyId;
  },
});

/**
 * Update onboarding progress
 */
export const updateOnboardingProgress = mutation({
  args: {
    companyId: v.id("companies"),
    progress: v.any(),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);

    await ctx.db.patch(args.companyId, {
      onboardingProgress: args.progress,
      updatedBy: authCtx.userId,
    });

    return args.companyId;
  },
});

/**
 * Delete company (soft delete - owner only)
 */
export const remove = mutation({
  args: {
    companyId: v.id("companies"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    await requireCompanyOwner(ctx, authCtx);

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    if (company.deletedAt) {
      throw new Error("Company is already deleted");
    }

    // Soft delete company
    await ctx.db.patch(args.companyId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    // Soft delete all team memberships
    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const member of members) {
      await ctx.db.patch(member._id, {
        deletedAt: Date.now(),
        deletedBy: authCtx.userId,
      });
    }

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "company",
      entityId: args.companyId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

// ============================================================================
// TEAM MEMBER MUTATIONS
// ============================================================================

/**
 * Invite a team member
 */
export const inviteTeamMember = mutation({
  args: {
    companyId: v.id("companies"),
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);

    // Only admins+ can invite
    if (!hasMinimumRole(authCtx, "admin")) {
      throw new Error("Only admins can invite team members");
    }

    // Validate email
    if (!args.email.trim() || !args.email.includes("@")) {
      throw new Error("Valid email is required");
    }

    // Check if already a member
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .unique();

    if (existingUser) {
      const existingMember = await ctx.db
        .query("teamMembers")
        .withIndex("by_company_user", (q) =>
          q.eq("companyId", args.companyId).eq("userId", existingUser._id)
        )
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .unique();

      if (existingMember) {
        throw new Error("User is already a team member");
      }
    }

    // Check for existing invitation
    const existingInvite = await ctx.db
      .query("teamInvitations")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), args.companyId),
          q.gt(q.field("expiresAt"), Date.now()),
          q.eq(q.field("acceptedAt"), undefined)
        )
      )
      .unique();

    if (existingInvite) {
      throw new Error("An invitation is already pending for this email");
    }

    // Generate invitation token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const invitationId = await ctx.db.insert("teamInvitations", {
      companyId: args.companyId,
      email: args.email.toLowerCase(),
      role: args.role as "admin" | "manager" | "dispatcher" | "technician" | "csr",
      token,
      invitedBy: authCtx.userId,
      expiresAt,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "invite_team_member",
      entityType: "teamInvitations",
      entityId: invitationId,
      metadata: { email: args.email, role: args.role },
    });

    return { invitationId, token };
  },
});

/**
 * Update team member role
 */
export const updateTeamMemberRole = mutation({
  args: {
    companyId: v.id("companies"),
    memberId: v.id("teamMembers"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);

    // Only admins+ can change roles
    if (!hasMinimumRole(authCtx, "admin")) {
      throw new Error("Only admins can change team member roles");
    }

    const member = await ctx.db.get(args.memberId);
    if (!member || member.companyId !== args.companyId) {
      throw new Error("Team member not found");
    }

    // Cannot change owner role
    if (member.role === "owner") {
      throw new Error("Cannot change owner role");
    }

    // Cannot set someone as owner (use transfer ownership instead)
    if (args.role === "owner") {
      throw new Error("Use transfer ownership to change owner");
    }

    const oldRole = member.role;
    await ctx.db.patch(args.memberId, {
      role: args.role as "admin" | "manager" | "dispatcher" | "technician" | "csr",
      updatedBy: authCtx.userId,
    });

    // Log role change
    await ctx.db.insert("roleChangeLogs", {
      teamMemberId: args.memberId,
      changedBy: authCtx.userId,
      oldRole: oldRole as "admin" | "manager" | "dispatcher" | "technician" | "csr",
      newRole: args.role as "admin" | "manager" | "dispatcher" | "technician" | "csr",
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "update_role",
      entityType: "teamMembers",
      entityId: args.memberId,
      changes: { role: { old: oldRole, new: args.role } },
    });

    return args.memberId;
  },
});

/**
 * Remove team member
 */
export const removeTeamMember = mutation({
  args: {
    companyId: v.id("companies"),
    memberId: v.id("teamMembers"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);

    // Only admins+ can remove members
    if (!hasMinimumRole(authCtx, "admin")) {
      throw new Error("Only admins can remove team members");
    }

    const member = await ctx.db.get(args.memberId);
    if (!member || member.companyId !== args.companyId) {
      throw new Error("Team member not found");
    }

    // Cannot remove owner
    if (member.role === "owner") {
      throw new Error("Cannot remove company owner");
    }

    // Cannot remove yourself
    if (member.userId === authCtx.userId) {
      throw new Error("Cannot remove yourself");
    }

    // Soft delete
    await ctx.db.patch(args.memberId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
      status: "inactive",
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "remove_team_member",
      entityType: "teamMembers",
      entityId: args.memberId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

// ============================================================================
// INTERNAL MUTATIONS (for migration)
// ============================================================================

/**
 * Import company from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    name: v.string(),
    slug: v.string(),
    ownerSupabaseId: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
    settings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Find owner by Supabase ID mapping
    const ownerMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "users").eq("supabaseId", args.ownerSupabaseId)
      )
      .unique();

    if (!ownerMapping) {
      throw new Error(`Owner not found for Supabase ID: ${args.ownerSupabaseId}`);
    }

    // Check if company already migrated
    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "companies").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    // Create company
    const companyId = await ctx.db.insert("companies", {
      name: args.name,
      slug: args.slug,
      ownerId: ownerMapping.convexId as any,
      email: args.email,
      phone: args.phone,
      address: args.address,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      country: args.country || "USA",
      stripeCustomerId: args.stripeCustomerId,
      subscriptionStatus: args.subscriptionStatus as any,
      onboardingCompleted: args.onboardingCompleted ?? false,
      settings: args.settings,
    });

    // Track migration
    await ctx.db.insert("migrationMappings", {
      tableName: "companies",
      supabaseId: args.supabaseId,
      convexId: companyId,
      migratedAt: Date.now(),
    });

    return companyId;
  },
});
