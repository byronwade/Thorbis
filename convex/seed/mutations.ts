/**
 * Seed Internal Mutations
 *
 * Internal mutations for seeding Convex database with sample data.
 * These are only accessible from other Convex functions, not from clients.
 */
import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// ============================================================================
// CLEAR DATA (for development only)
// ============================================================================

/**
 * Clear all seed data from the database
 * WARNING: This deletes ALL data - use only in development
 */
export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; message: string }> => {
    const tables = [
      "payments",
      "invoices",
      "estimates",
      "jobs",
      "purchaseOrders",
      "equipment",
      "properties",
      "customers",
      "vendors",
      "priceBookItems",
      "teamMembers",
      "companies",
      "users",
      "auditLogs",
      "notifications",
      "communications",
      "schedules",
      "inventory",
      "servicePlans",
      "tags",
      "attachments",
      "roleChangeLogs",
      "teamInvitations",
      "customRoles",
    ] as const;

    for (const table of tables) {
      const records = await ctx.db.query(table as any).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
    }

    return { success: true, message: "All data cleared" };
  },
});

// ============================================================================
// SEED USERS
// ============================================================================

export const seedUsers = internalMutation({
  args: {
    users: v.array(
      v.object({
        tokenIdentifier: v.string(),
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        isActive: v.boolean(),
        emailVerified: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userIds: Id<"users">[] = [];

    for (const user of args.users) {
      // Check if user already exists
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", user.email))
        .unique();

      if (existing) {
        userIds.push(existing._id);
      } else {
        const userId = await ctx.db.insert("users", {
          ...user,
          lastLoginAt: Date.now(),
        });
        userIds.push(userId);
      }
    }

    return userIds;
  },
});

// ============================================================================
// SEED COMPANY
// ============================================================================

export const seedCompany = internalMutation({
  args: {
    ownerId: v.id("users"),
    company: v.object({
      name: v.string(),
      slug: v.string(),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      zipCode: v.optional(v.string()),
      country: v.optional(v.string()),
      onboardingCompleted: v.boolean(),
      settings: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    // Check if company already exists
    const existing = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", args.company.slug))
      .unique();

    if (existing) {
      return existing._id;
    }

    const companyId = await ctx.db.insert("companies", {
      ...args.company,
      ownerId: args.ownerId,
      createdBy: args.ownerId,
      updatedBy: args.ownerId,
    });

    return companyId;
  },
});

// ============================================================================
// SEED TEAM MEMBERS
// ============================================================================

// Type for team member input
type TeamMemberInput = {
  userId: Id<"users">;
  role: string;
  department?: string;
  jobTitle?: string;
};

export const seedTeamMembers = internalMutation({
  args: {
    companyId: v.id("companies"),
    members: v.array(
      v.object({
        userId: v.id("users"),
        role: v.string(),
        department: v.optional(v.string()),
        jobTitle: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args: { companyId: Id<"companies">; members: TeamMemberInput[] }): Promise<Id<"teamMembers">[]> => {
    const memberIds: Id<"teamMembers">[] = [];

    for (const member of args.members) {
      // Check if already exists
      const existing = await ctx.db
        .query("teamMembers")
        .withIndex("by_company_user", (q) =>
          q.eq("companyId", args.companyId).eq("userId", member.userId)
        )
        .unique();

      if (existing) {
        memberIds.push(existing._id);
      } else {
        const memberId = await ctx.db.insert("teamMembers", {
          companyId: args.companyId,
          userId: member.userId,
          role: member.role as "owner" | "admin" | "manager" | "dispatcher" | "technician" | "csr",
          department: member.department,
          jobTitle: member.jobTitle,
          status: "active",
          joinedAt: Date.now(),
          createdBy: member.userId,
          updatedBy: member.userId,
        });
        memberIds.push(memberId);
      }
    }

    return memberIds;
  },
});

// ============================================================================
// SEED CUSTOMERS
// ============================================================================

export const seedCustomers = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    customers: v.array(
      v.object({
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
        status: v.string(),
        tags: v.optional(v.array(v.string())),
        notes: v.optional(v.string()),
        totalRevenue: v.optional(v.number()),
        source: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const customerIds: Id<"customers">[] = [];

    for (const customer of args.customers) {
      // Check if already exists
      const existing = await ctx.db
        .query("customers")
        .withIndex("by_company_email", (q) =>
          q.eq("companyId", args.companyId).eq("email", customer.email.toLowerCase())
        )
        .unique();

      if (existing) {
        customerIds.push(existing._id);
      } else {
        const displayName = customer.companyName
          ? `${customer.companyName} (${customer.firstName} ${customer.lastName})`
          : `${customer.firstName} ${customer.lastName}`;

        const searchText = [
          customer.firstName,
          customer.lastName,
          customer.companyName,
          customer.email,
          customer.phone,
          customer.address,
          customer.city,
        ]
          .filter(Boolean)
          .join(" ");

        const customerId = await ctx.db.insert("customers", {
          companyId: args.companyId,
          type: customer.type as any,
          firstName: customer.firstName,
          lastName: customer.lastName,
          companyName: customer.companyName,
          displayName,
          email: customer.email.toLowerCase(),
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
          status: customer.status as any,
          tags: customer.tags || [],
          notes: customer.notes,
          totalRevenue: customer.totalRevenue || 0,
          totalJobs: 0,
          totalInvoices: 0,
          averageJobValue: 0,
          outstandingBalance: 0,
          portalEnabled: false,
          taxExempt: false,
          source: customer.source,
          searchText,
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        customerIds.push(customerId);
      }
    }

    return customerIds;
  },
});

// ============================================================================
// SEED PROPERTIES
// ============================================================================

export const seedProperties = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    properties: v.array(
      v.object({
        customerId: v.id("customers"),
        name: v.optional(v.string()),
        type: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        isPrimary: v.boolean(),
        squareFootage: v.optional(v.number()),
        yearBuilt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const propertyIds: Id<"properties">[] = [];

    for (const property of args.properties) {
      const propertyId = await ctx.db.insert("properties", {
        companyId: args.companyId,
        customerId: property.customerId,
        name: property.name,
        type: property.type as any,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        isPrimary: property.isPrimary,
        isActive: true,
        squareFootage: property.squareFootage,
        yearBuilt: property.yearBuilt,
        createdBy: args.createdBy,
        updatedBy: args.createdBy,
      });
      propertyIds.push(propertyId);
    }

    return propertyIds;
  },
});

// ============================================================================
// SEED EQUIPMENT
// ============================================================================

export const seedEquipment = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    equipment: v.array(
      v.object({
        customerId: v.id("customers"),
        propertyId: v.id("properties"),
        name: v.string(),
        type: v.string(),
        manufacturer: v.optional(v.string()),
        model: v.optional(v.string()),
        serialNumber: v.optional(v.string()),
        installDate: v.optional(v.number()),
        condition: v.string(),
        status: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const equipmentIds: Id<"equipment">[] = [];
    let counter = 1;

    for (const equip of args.equipment) {
      const equipmentNumber = `EQ-${String(counter++).padStart(4, "0")}`;

      const equipmentId = await ctx.db.insert("equipment", {
        companyId: args.companyId,
        customerId: equip.customerId,
        propertyId: equip.propertyId,
        equipmentNumber,
        name: equip.name,
        type: equip.type as any,
        manufacturer: equip.manufacturer,
        model: equip.model,
        serialNumber: equip.serialNumber,
        installDate: equip.installDate,
        condition: equip.condition as any,
        status: equip.status as any,
        isUnderWarranty: false,
        searchText: [equip.name, equip.manufacturer, equip.model, equip.serialNumber]
          .filter(Boolean)
          .join(" "),
        createdBy: args.createdBy,
        updatedBy: args.createdBy,
      });
      equipmentIds.push(equipmentId);
    }

    return equipmentIds;
  },
});

// ============================================================================
// SEED PRICE BOOK
// ============================================================================

export const seedPriceBookItems = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    items: v.array(
      v.object({
        sku: v.string(),
        name: v.string(),
        type: v.string(),
        category: v.optional(v.string()),
        unitPrice: v.number(),
        costPrice: v.optional(v.number()),
        laborHours: v.optional(v.number()),
        taxable: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const itemIds: Id<"priceBookItems">[] = [];

    for (const item of args.items) {
      // Check if already exists
      const existing = await ctx.db
        .query("priceBookItems")
        .withIndex("by_company_sku", (q) =>
          q.eq("companyId", args.companyId).eq("sku", item.sku)
        )
        .unique();

      if (existing) {
        itemIds.push(existing._id);
      } else {
        const itemId = await ctx.db.insert("priceBookItems", {
          companyId: args.companyId,
          sku: item.sku,
          name: item.name,
          type: item.type as any,
          category: item.category,
          unitPrice: item.unitPrice,
          costPrice: item.costPrice,
          laborHours: item.laborHours,
          taxable: item.taxable,
          trackInventory: false,
          isActive: true,
          searchText: [item.sku, item.name, item.category].filter(Boolean).join(" "),
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        itemIds.push(itemId);
      }
    }

    return itemIds;
  },
});

// ============================================================================
// SEED VENDORS
// ============================================================================

export const seedVendors = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    vendors: v.array(
      v.object({
        name: v.string(),
        displayName: v.string(),
        vendorNumber: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        zipCode: v.optional(v.string()),
        paymentTerms: v.string(),
        category: v.optional(v.string()),
        status: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const vendorIds: Id<"vendors">[] = [];

    for (const vendor of args.vendors) {
      // Check if already exists
      const existing = await ctx.db
        .query("vendors")
        .withIndex("by_vendor_number", (q) =>
          q.eq("companyId", args.companyId).eq("vendorNumber", vendor.vendorNumber)
        )
        .unique();

      if (existing) {
        vendorIds.push(existing._id);
      } else {
        const vendorId = await ctx.db.insert("vendors", {
          companyId: args.companyId,
          name: vendor.name,
          displayName: vendor.displayName,
          vendorNumber: vendor.vendorNumber,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          city: vendor.city,
          state: vendor.state,
          zipCode: vendor.zipCode,
          paymentTerms: vendor.paymentTerms as any,
          category: vendor.category as any,
          status: vendor.status as any,
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        vendorIds.push(vendorId);
      }
    }

    return vendorIds;
  },
});

// ============================================================================
// SEED JOBS
// ============================================================================

export const seedJobs = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    jobs: v.array(
      v.object({
        customerId: v.id("customers"),
        propertyId: v.id("properties"),
        assignedTo: v.optional(v.id("users")),
        jobNumber: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.string(),
        priority: v.string(),
        jobType: v.optional(v.string()),
        scheduledStart: v.optional(v.number()),
        scheduledEnd: v.optional(v.number()),
        actualStart: v.optional(v.number()),
        actualEnd: v.optional(v.number()),
        totalAmount: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const jobIds: Id<"jobs">[] = [];

    for (const job of args.jobs) {
      // Check if already exists
      const existing = await ctx.db
        .query("jobs")
        .withIndex("by_job_number", (q) =>
          q.eq("companyId", args.companyId).eq("jobNumber", job.jobNumber)
        )
        .unique();

      if (existing) {
        jobIds.push(existing._id);
      } else {
        const jobId = await ctx.db.insert("jobs", {
          companyId: args.companyId,
          customerId: job.customerId,
          propertyId: job.propertyId,
          assignedTo: job.assignedTo,
          jobNumber: job.jobNumber,
          title: job.title,
          description: job.description,
          status: job.status as any,
          priority: job.priority as any,
          jobType: job.jobType as any,
          scheduledStart: job.scheduledStart,
          scheduledEnd: job.scheduledEnd,
          actualStart: job.actualStart,
          actualEnd: job.actualEnd,
          totalAmount: job.totalAmount,
          searchText: [job.jobNumber, job.title, job.description].filter(Boolean).join(" "),
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        jobIds.push(jobId);
      }
    }

    return jobIds;
  },
});

// ============================================================================
// SEED ESTIMATES
// ============================================================================

export const seedEstimates = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    estimates: v.array(
      v.object({
        customerId: v.id("customers"),
        propertyId: v.id("properties"),
        jobId: v.optional(v.id("jobs")),
        estimateNumber: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.string(),
        lineItems: v.array(v.any()),
        subtotal: v.number(),
        taxRate: v.optional(v.number()),
        taxAmount: v.number(),
        discountAmount: v.number(),
        totalAmount: v.number(),
        validUntil: v.optional(v.number()),
        sentAt: v.optional(v.number()),
        acceptedAt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const estimateIds: Id<"estimates">[] = [];

    for (const estimate of args.estimates) {
      // Check if already exists
      const existing = await ctx.db
        .query("estimates")
        .withIndex("by_estimate_number", (q) =>
          q.eq("companyId", args.companyId).eq("estimateNumber", estimate.estimateNumber)
        )
        .unique();

      if (existing) {
        estimateIds.push(existing._id);
      } else {
        const estimateId = await ctx.db.insert("estimates", {
          companyId: args.companyId,
          customerId: estimate.customerId,
          propertyId: estimate.propertyId,
          jobId: estimate.jobId,
          estimateNumber: estimate.estimateNumber,
          title: estimate.title,
          description: estimate.description,
          status: estimate.status as any,
          lineItems: estimate.lineItems,
          subtotal: estimate.subtotal,
          taxRate: estimate.taxRate,
          taxAmount: estimate.taxAmount,
          discountAmount: estimate.discountAmount,
          totalAmount: estimate.totalAmount,
          validUntil: estimate.validUntil,
          sentAt: estimate.sentAt,
          acceptedAt: estimate.acceptedAt,
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        estimateIds.push(estimateId);
      }
    }

    return estimateIds;
  },
});

// ============================================================================
// SEED INVOICES
// ============================================================================

export const seedInvoices = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    invoices: v.array(
      v.object({
        customerId: v.id("customers"),
        propertyId: v.id("properties"),
        jobId: v.optional(v.id("jobs")),
        invoiceNumber: v.string(),
        title: v.string(),
        status: v.string(),
        lineItems: v.array(v.any()),
        subtotal: v.number(),
        taxRate: v.optional(v.number()),
        taxAmount: v.number(),
        discountAmount: v.number(),
        totalAmount: v.number(),
        amountPaid: v.number(),
        amountDue: v.number(),
        dueDate: v.optional(v.number()),
        sentAt: v.optional(v.number()),
        paidAt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const invoiceIds: Id<"invoices">[] = [];

    for (const invoice of args.invoices) {
      // Check if already exists
      const existing = await ctx.db
        .query("invoices")
        .withIndex("by_invoice_number", (q) =>
          q.eq("companyId", args.companyId).eq("invoiceNumber", invoice.invoiceNumber)
        )
        .unique();

      if (existing) {
        invoiceIds.push(existing._id);
      } else {
        const invoiceId = await ctx.db.insert("invoices", {
          companyId: args.companyId,
          customerId: invoice.customerId,
          propertyId: invoice.propertyId,
          jobId: invoice.jobId,
          invoiceNumber: invoice.invoiceNumber,
          title: invoice.title,
          status: invoice.status as any,
          lineItems: invoice.lineItems,
          subtotal: invoice.subtotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountAmount: invoice.discountAmount,
          totalAmount: invoice.totalAmount,
          amountPaid: invoice.amountPaid,
          amountDue: invoice.amountDue,
          dueDate: invoice.dueDate,
          sentAt: invoice.sentAt,
          paidAt: invoice.paidAt,
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        invoiceIds.push(invoiceId);
      }
    }

    return invoiceIds;
  },
});

// ============================================================================
// SEED PAYMENTS
// ============================================================================

export const seedPayments = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    payments: v.array(
      v.object({
        customerId: v.id("customers"),
        invoiceId: v.id("invoices"),
        paymentNumber: v.string(),
        amount: v.number(),
        paymentMethod: v.string(),
        paymentType: v.string(),
        cardBrand: v.optional(v.string()),
        cardLast4: v.optional(v.string()),
        bankName: v.optional(v.string()),
        status: v.string(),
        receiptEmailed: v.boolean(),
        isReconciled: v.boolean(),
        processedAt: v.optional(v.number()),
        completedAt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const paymentIds: Id<"payments">[] = [];

    for (const payment of args.payments) {
      // Check if already exists
      const existing = await ctx.db
        .query("payments")
        .withIndex("by_payment_number", (q) =>
          q.eq("companyId", args.companyId).eq("paymentNumber", payment.paymentNumber)
        )
        .unique();

      if (existing) {
        paymentIds.push(existing._id);
      } else {
        const paymentId = await ctx.db.insert("payments", {
          companyId: args.companyId,
          customerId: payment.customerId,
          invoiceId: payment.invoiceId,
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod as any,
          paymentType: payment.paymentType as any,
          cardBrand: payment.cardBrand as any,
          cardLast4: payment.cardLast4,
          bankName: payment.bankName,
          status: payment.status as any,
          receiptEmailed: payment.receiptEmailed,
          isReconciled: payment.isReconciled,
          processedAt: payment.processedAt,
          completedAt: payment.completedAt,
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        paymentIds.push(paymentId);
      }
    }

    return paymentIds;
  },
});

// ============================================================================
// SEED PURCHASE ORDERS
// ============================================================================

export const seedPurchaseOrders = internalMutation({
  args: {
    companyId: v.id("companies"),
    createdBy: v.id("users"),
    purchaseOrders: v.array(
      v.object({
        vendorId: v.id("vendors"),
        poNumber: v.string(),
        title: v.string(),
        status: v.string(),
        priority: v.string(),
        lineItems: v.array(v.any()),
        subtotal: v.number(),
        taxAmount: v.number(),
        shippingAmount: v.number(),
        totalAmount: v.number(),
        expectedDelivery: v.optional(v.number()),
        actualDelivery: v.optional(v.number()),
        orderedAt: v.optional(v.number()),
        receivedAt: v.optional(v.number()),
        autoGenerated: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const poIds: Id<"purchaseOrders">[] = [];

    for (const po of args.purchaseOrders) {
      // Check if already exists
      const existing = await ctx.db
        .query("purchaseOrders")
        .withIndex("by_po_number", (q) =>
          q.eq("companyId", args.companyId).eq("poNumber", po.poNumber)
        )
        .unique();

      if (existing) {
        poIds.push(existing._id);
      } else {
        // Get vendor name
        const vendor = await ctx.db.get(po.vendorId);

        const poId = await ctx.db.insert("purchaseOrders", {
          companyId: args.companyId,
          vendorId: po.vendorId,
          vendor: vendor?.name || "Unknown Vendor",
          poNumber: po.poNumber,
          title: po.title,
          status: po.status as any,
          priority: po.priority as any,
          lineItems: po.lineItems,
          subtotal: po.subtotal,
          taxAmount: po.taxAmount,
          shippingAmount: po.shippingAmount,
          totalAmount: po.totalAmount,
          expectedDelivery: po.expectedDelivery,
          actualDelivery: po.actualDelivery,
          orderedAt: po.orderedAt,
          receivedAt: po.receivedAt,
          autoGenerated: po.autoGenerated,
          requestedBy: args.createdBy,
          createdBy: args.createdBy,
          updatedBy: args.createdBy,
        });
        poIds.push(poId);
      }
    }

    return poIds;
  },
});

// ============================================================================
// CHECK IF SEEDED
// ============================================================================

export const checkIfSeeded = internalQuery({
  args: {},
  handler: async (ctx): Promise<{ isSeeded: boolean }> => {
    const company = await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", "demo-hvac-services"))
      .unique();

    return { isSeeded: !!company };
  },
});
