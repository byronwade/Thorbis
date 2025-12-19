/**
 * Customer queries and mutations
 * Replaces apps/web/src/lib/queries/customers.ts and apps/web/src/actions/customers.ts
 */
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
  requireCompanyAccess,
  requirePermission,
  hasPermission,
  hasMinimumRole,
  excludeDeleted,
  excludeArchived,
  excludeDeletedAndArchived,
  createAuditLog,
  trackChanges,
} from "./lib/auth";
import { customerType, customerStatus } from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate search text for full-text search
 */
function generateSearchText(customer: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  city?: string;
  notes?: string;
}): string {
  return [
    customer.firstName,
    customer.lastName,
    customer.companyName,
    customer.email,
    customer.phone,
    customer.address,
    customer.city,
    customer.notes,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  return emailRegex.test(email);
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List customers for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(customerStatus),
    type: v.optional(customerType),
    includeArchived: v.optional(v.boolean()),
    includeDeleted: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify company access
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_customers");

    // Build query with appropriate index
    let query = ctx.db
      .query("customers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    // If status filter provided, use status index instead
    if (args.status) {
      query = ctx.db
        .query("customers")
        .withIndex("by_company_status", (q) =>
          q.eq("companyId", args.companyId).eq("status", args.status!)
        );
    }

    let customers = await query.collect();

    // Apply soft delete filters
    if (!args.includeDeleted) {
      customers = excludeDeleted(customers);
    }
    if (!args.includeArchived) {
      customers = excludeArchived(customers);
    }

    // Apply type filter (post-query)
    if (args.type) {
      customers = customers.filter((c) => c.type === args.type);
    }

    // Apply limit
    const limit = args.limit ?? 50;
    customers = customers.slice(0, limit);

    return {
      customers,
      total: customers.length,
      hasMore: customers.length === limit,
    };
  },
});

/**
 * Get a single customer by ID
 */
export const get = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const authCtx = await requireCompanyAccess(ctx, customer.companyId);
    requirePermission(authCtx, "view_customers");

    if (customer.deletedAt && !hasPermission(authCtx, "view_deleted")) {
      throw new Error("Customer not found");
    }

    return customer;
  },
});

/**
 * Get customer with all related data (properties, jobs, invoices, payments)
 */
export const getWithRelations = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const authCtx = await requireCompanyAccess(ctx, customer.companyId);
    requirePermission(authCtx, "view_customers");

    // Fetch related data in parallel
    const [properties, jobs, invoices, payments, equipment, servicePlans] = await Promise.all([
      ctx.db
        .query("properties")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .collect()
        .then(excludeDeleted),

      ctx.db
        .query("jobs")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .collect()
        .then(excludeDeleted),

      ctx.db
        .query("invoices")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .collect()
        .then(excludeDeleted),

      ctx.db
        .query("payments")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .collect()
        .then(excludeDeleted),

      ctx.db
        .query("equipment")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .collect()
        .then(excludeDeleted),

      ctx.db
        .query("servicePlans")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .collect()
        .then(excludeDeleted),
    ]);

    return {
      customer,
      properties,
      jobs,
      invoices,
      payments,
      equipment,
      servicePlans,
      stats: {
        totalProperties: properties.length,
        totalJobs: jobs.length,
        totalInvoices: invoices.length,
        totalPayments: payments.length,
        totalEquipment: equipment.length,
        activeServicePlans: servicePlans.filter((sp) => sp.status === "active").length,
      },
    };
  },
});

/**
 * Search customers using full-text search
 */
export const search = query({
  args: {
    companyId: v.id("companies"),
    query: v.string(),
    status: v.optional(customerStatus),
    type: v.optional(customerType),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_customers");

    if (!args.query.trim()) {
      // Return recent customers if no query
      const customers = await ctx.db
        .query("customers")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .take(args.limit ?? 20);
      return customers;
    }

    // Use search index
    const results = await ctx.db
      .query("customers")
      .withSearchIndex("search_customers", (q) => {
        let search = q.search("searchText", args.query.toLowerCase());
        search = search.eq("companyId", args.companyId);
        if (args.status) {
          search = search.eq("status", args.status);
        }
        if (args.type) {
          search = search.eq("type", args.type);
        }
        return search;
      })
      .take(args.limit ?? 20);

    return excludeDeleted(results);
  },
});

/**
 * Get customer stats for dashboard
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "view_customers");

    const customers = await ctx.db
      .query("customers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const active = customers.filter((c) => c.status === "active" && !c.archivedAt);
    const inactive = customers.filter((c) => c.status === "inactive" && !c.archivedAt);
    const archived = customers.filter((c) => c.archivedAt);

    return {
      total: customers.length,
      active: active.length,
      inactive: inactive.length,
      archived: archived.length,
      residential: customers.filter((c) => c.type === "residential").length,
      commercial: customers.filter((c) => c.type === "commercial").length,
      industrial: customers.filter((c) => c.type === "industrial").length,
      totalRevenue: customers.reduce((sum, c) => sum + (c.totalRevenue ?? 0), 0),
      totalOutstanding: customers.reduce((sum, c) => sum + (c.outstandingBalance ?? 0), 0),
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new customer
 */
export const create = mutation({
  args: {
    companyId: v.id("companies"),

    // Required
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),

    // Optional
    type: v.optional(customerType),
    companyName: v.optional(v.string()),
    secondaryPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    referredBy: v.optional(v.id("customers")),
    portalEnabled: v.optional(v.boolean()),
    taxExempt: v.optional(v.boolean()),
    taxExemptNumber: v.optional(v.string()),
    preferredContactMethod: v.optional(v.string()),
    billingEmail: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    creditLimit: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "manage_customers");

    // Validate required fields
    if (!args.firstName.trim()) {
      throw new Error("First name is required");
    }
    if (!args.lastName.trim()) {
      throw new Error("Last name is required");
    }
    if (!args.email.trim() || !isValidEmail(args.email)) {
      throw new Error("Valid email is required");
    }
    if (!args.phone.trim()) {
      throw new Error("Phone is required");
    }

    // Check for duplicate email in company
    const existingEmail = await ctx.db
      .query("customers")
      .withIndex("by_company_email", (q) =>
        q.eq("companyId", args.companyId).eq("email", args.email.toLowerCase())
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .unique();

    if (existingEmail) {
      throw new Error("A customer with this email already exists");
    }

    // Validate referredBy if provided
    if (args.referredBy) {
      const referrer = await ctx.db.get(args.referredBy);
      if (!referrer || referrer.companyId !== args.companyId) {
        throw new Error("Invalid referrer");
      }
    }

    // Create display name
    const displayName = args.companyName
      ? `${args.companyName} (${args.firstName} ${args.lastName})`
      : `${args.firstName} ${args.lastName}`;

    // Create search text
    const searchText = generateSearchText({
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      companyName: args.companyName,
      address: args.address,
      city: args.city,
      notes: args.notes,
    });

    const customerId = await ctx.db.insert("customers", {
      companyId: args.companyId,
      type: args.type ?? "residential",
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      companyName: args.companyName?.trim(),
      displayName,
      email: args.email.toLowerCase().trim(),
      phone: args.phone.trim(),
      secondaryPhone: args.secondaryPhone?.trim(),
      address: args.address?.trim(),
      address2: args.address2?.trim(),
      city: args.city?.trim(),
      state: args.state?.trim(),
      zipCode: args.zipCode?.trim(),
      country: args.country?.trim() ?? "USA",
      tags: args.tags ?? [],
      source: args.source,
      referredBy: args.referredBy,
      status: "active",
      notes: args.notes,
      internalNotes: args.internalNotes,
      portalEnabled: args.portalEnabled ?? false,
      taxExempt: args.taxExempt ?? false,
      taxExemptNumber: args.taxExemptNumber,
      preferredContactMethod: args.preferredContactMethod,
      billingEmail: args.billingEmail?.toLowerCase().trim(),
      paymentTerms: args.paymentTerms,
      creditLimit: args.creditLimit,
      // Initialize metrics
      totalRevenue: 0,
      totalJobs: 0,
      totalInvoices: 0,
      averageJobValue: 0,
      outstandingBalance: 0,
      metadata: args.metadata,
      searchText,
      createdBy: authCtx.userId,
      updatedBy: authCtx.userId,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "create",
      entityType: "customer",
      entityId: customerId,
      metadata: { displayName, email: args.email },
    });

    return customerId;
  },
});

/**
 * Update a customer
 */
export const update = mutation({
  args: {
    customerId: v.id("customers"),

    // All fields optional for update
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.optional(customerType),
    companyName: v.optional(v.string()),
    secondaryPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("blocked"))),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    portalEnabled: v.optional(v.boolean()),
    taxExempt: v.optional(v.boolean()),
    taxExemptNumber: v.optional(v.string()),
    preferredContactMethod: v.optional(v.string()),
    preferredTechnician: v.optional(v.id("users")),
    communicationPreferences: v.optional(v.any()),
    billingEmail: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    creditLimit: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { customerId, ...updates } = args;

    const customer = await ctx.db.get(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const authCtx = await requireCompanyAccess(ctx, customer.companyId);
    requirePermission(authCtx, "manage_customers");

    if (customer.deletedAt) {
      throw new Error("Cannot update deleted customer");
    }

    // Validate email uniqueness if changing
    if (updates.email && updates.email.toLowerCase() !== customer.email) {
      if (!isValidEmail(updates.email)) {
        throw new Error("Invalid email format");
      }

      const existingEmail = await ctx.db
        .query("customers")
        .withIndex("by_company_email", (q) =>
          q.eq("companyId", customer.companyId).eq("email", updates.email!.toLowerCase())
        )
        .filter((q) =>
          q.and(
            q.eq(q.field("deletedAt"), undefined),
            q.neq(q.field("_id"), customerId)
          )
        )
        .unique();

      if (existingEmail) {
        throw new Error("A customer with this email already exists");
      }
    }

    // Validate preferred technician
    if (updates.preferredTechnician) {
      const techMembership = await ctx.db
        .query("teamMembers")
        .withIndex("by_company_user", (q) =>
          q.eq("companyId", customer.companyId).eq("userId", updates.preferredTechnician!)
        )
        .filter((q) => q.eq(q.field("status"), "active"))
        .unique();

      if (!techMembership) {
        throw new Error("Preferred technician is not a member of this company");
      }
    }

    // Track changes
    const changes = trackChanges(customer, updates);

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedBy: authCtx.userId,
    };

    // Process each update field
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        if (key === "email") {
          updateData[key] = (value as string).toLowerCase().trim();
        } else if (typeof value === "string") {
          updateData[key] = value.trim();
        } else {
          updateData[key] = value;
        }
      }
    }

    // Update display name if name fields changed
    if (updates.firstName || updates.lastName || updates.companyName !== undefined) {
      const firstName = updates.firstName ?? customer.firstName;
      const lastName = updates.lastName ?? customer.lastName;
      const companyName = updates.companyName !== undefined ? updates.companyName : customer.companyName;

      updateData.displayName = companyName
        ? `${companyName} (${firstName} ${lastName})`
        : `${firstName} ${lastName}`;
    }

    // Update search text
    updateData.searchText = generateSearchText({
      firstName: updates.firstName ?? customer.firstName,
      lastName: updates.lastName ?? customer.lastName,
      email: updates.email ?? customer.email,
      phone: updates.phone ?? customer.phone,
      companyName: updates.companyName !== undefined ? updates.companyName : customer.companyName,
      address: updates.address ?? customer.address,
      city: updates.city ?? customer.city,
      notes: updates.notes ?? customer.notes,
    });

    await ctx.db.patch(customerId, updateData);

    if (Object.keys(changes).length > 0) {
      await createAuditLog(ctx, {
        companyId: customer.companyId,
        userId: authCtx.userId,
        action: "update",
        entityType: "customer",
        entityId: customerId,
        changes,
      });
    }

    return customerId;
  },
});

/**
 * Archive a customer
 */
export const archive = mutation({
  args: {
    customerId: v.id("customers"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const authCtx = await requireCompanyAccess(ctx, customer.companyId);
    requirePermission(authCtx, "manage_customers");

    if (customer.deletedAt) {
      throw new Error("Customer is deleted");
    }

    if (customer.archivedAt) {
      throw new Error("Customer is already archived");
    }

    await ctx.db.patch(args.customerId, {
      archivedAt: Date.now(),
      archivedBy: authCtx.userId,
      status: "archived",
    });

    await createAuditLog(ctx, {
      companyId: customer.companyId,
      userId: authCtx.userId,
      action: "archive",
      entityType: "customer",
      entityId: args.customerId,
      metadata: { reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Restore an archived customer
 */
export const restore = mutation({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const authCtx = await requireCompanyAccess(ctx, customer.companyId);
    requirePermission(authCtx, "manage_customers");

    if (customer.deletedAt) {
      throw new Error("Cannot restore deleted customer");
    }

    if (!customer.archivedAt) {
      throw new Error("Customer is not archived");
    }

    await ctx.db.patch(args.customerId, {
      archivedAt: undefined,
      archivedBy: undefined,
      status: "active",
    });

    await createAuditLog(ctx, {
      companyId: customer.companyId,
      userId: authCtx.userId,
      action: "restore",
      entityType: "customer",
      entityId: args.customerId,
    });

    return { success: true };
  },
});

/**
 * Delete a customer (soft delete)
 */
export const remove = mutation({
  args: {
    customerId: v.id("customers"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const authCtx = await requireCompanyAccess(ctx, customer.companyId);

    // Only managers+ can delete
    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Insufficient permissions to delete customers");
    }

    if (customer.deletedAt) {
      throw new Error("Customer is already deleted");
    }

    // Check for active jobs
    const activeJobs = await ctx.db
      .query("jobs")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.or(
            q.eq(q.field("status"), "scheduled"),
            q.eq(q.field("status"), "in_progress")
          )
        )
      )
      .take(1);

    if (activeJobs.length > 0) {
      throw new Error("Cannot delete customer with active jobs");
    }

    // Check for unpaid invoices
    const unpaidInvoices = await ctx.db
      .query("invoices")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.or(
            q.eq(q.field("status"), "sent"),
            q.eq(q.field("status"), "partial"),
            q.eq(q.field("status"), "overdue")
          )
        )
      )
      .take(1);

    if (unpaidInvoices.length > 0) {
      throw new Error("Cannot delete customer with unpaid invoices");
    }

    await ctx.db.patch(args.customerId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
      status: "archived",
    });

    await createAuditLog(ctx, {
      companyId: customer.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "customer",
      entityId: args.customerId,
      metadata: { displayName: customer.displayName, reason: args.reason },
    });

    return { success: true };
  },
});

/**
 * Update customer metrics (internal - called after job/invoice changes)
 */
export const updateMetrics = internalMutation({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db.get(args.customerId);
    if (!customer) return;

    // Calculate metrics from related data
    const [jobs, invoices, payments] = await Promise.all([
      ctx.db
        .query("jobs")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("invoices")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect(),
      ctx.db
        .query("payments")
        .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
        .filter((q) =>
          q.and(
            q.eq(q.field("deletedAt"), undefined),
            q.eq(q.field("status"), "completed")
          )
        )
        .collect(),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalJobs = jobs.length;
    const totalInvoices = invoices.length;
    const averageJobValue = totalJobs > 0 ? Math.round(totalRevenue / totalJobs) : 0;

    const unpaidInvoices = invoices.filter((inv) =>
      ["sent", "partial", "overdue"].includes(inv.status)
    );
    const outstandingBalance = unpaidInvoices.reduce((sum, inv) => sum + inv.amountDue, 0);

    const completedJobs = jobs.filter((j) => j.status === "completed" || j.status === "paid");
    const lastJobDate = completedJobs.length > 0
      ? Math.max(...completedJobs.map((j) => j.actualEnd || j._creationTime))
      : undefined;

    const paidInvoices = invoices.filter((inv) => inv.paidAt);
    const lastInvoiceDate = paidInvoices.length > 0
      ? Math.max(...paidInvoices.map((inv) => inv._creationTime))
      : undefined;

    const lastPaymentDate = payments.length > 0
      ? Math.max(...payments.map((p) => p.completedAt || p._creationTime))
      : undefined;

    await ctx.db.patch(args.customerId, {
      totalRevenue,
      totalJobs,
      totalInvoices,
      averageJobValue,
      outstandingBalance,
      lastJobDate,
      lastInvoiceDate,
      lastPaymentDate,
    });
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import customer from Supabase migration
 */
export const importFromSupabase = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    type: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    companyName: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    totalRevenue: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Find company by Supabase ID mapping
    const companyMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "companies").eq("supabaseId", args.companySupabaseId)
      )
      .unique();

    if (!companyMapping) {
      throw new Error(`Company not found for Supabase ID: ${args.companySupabaseId}`);
    }

    // Check if already migrated
    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "customers").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    const displayName = args.companyName
      ? `${args.companyName} (${args.firstName} ${args.lastName})`
      : `${args.firstName} ${args.lastName}`;

    const customerId = await ctx.db.insert("customers", {
      companyId: companyMapping.convexId as any,
      type: args.type as any,
      firstName: args.firstName,
      lastName: args.lastName,
      companyName: args.companyName,
      displayName,
      email: args.email.toLowerCase(),
      phone: args.phone,
      address: args.address,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      status: (args.status as any) || "active",
      tags: args.tags || [],
      notes: args.notes,
      totalRevenue: args.totalRevenue || 0,
      totalJobs: 0,
      totalInvoices: 0,
      averageJobValue: 0,
      outstandingBalance: 0,
      portalEnabled: false,
      taxExempt: false,
      metadata: args.metadata,
      searchText: generateSearchText({
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        phone: args.phone,
        companyName: args.companyName,
        address: args.address,
        city: args.city,
        notes: args.notes,
      }),
    });

    await ctx.db.insert("migrationMappings", {
      tableName: "customers",
      supabaseId: args.supabaseId,
      convexId: customerId,
      migratedAt: Date.now(),
    });

    return customerId;
  },
});
