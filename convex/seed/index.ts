/**
 * Convex Seed Module
 *
 * Main entry point for seeding the Convex database with sample data.
 * Use the `seedDatabase` action to populate all tables with demo data.
 *
 * After adding this file, run `npx convex dev` to regenerate types,
 * then use `npx convex run seed/index:seedDatabase` to seed.
 */
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";
import {
    seedCompany,
    seedCustomers,
    seedEquipment,
    seedEstimates,
    seedInvoices,
    seedJobs,
    seedPayments,
    seedPriceBookItems,
    seedProperties,
    seedPurchaseOrders,
    seedTeamRoles,
    seedUsers,
    seedVendors,
} from "./data";

// ============================================================================
// MAIN SEED ACTION
// ============================================================================

// Type for seed result
type SeedResult = {
  success: boolean;
  message: string;
  stats?: {
    users: number;
    company: number;
    teamMembers: number;
    customers: number;
    properties: number;
    equipment: number;
    priceBookItems: number;
    vendors: number;
    jobs: number;
    estimates: number;
    invoices: number;
    payments: number;
    purchaseOrders: number;
  };
};

/**
 * Seed the entire database with sample data
 *
 * This action orchestrates the seeding of all tables in the correct order
 * to maintain referential integrity.
 *
 * Usage: npx convex run seed/index:seedDatabase
 */
export const seedDatabase = internalAction({
  args: {},
  handler: async (ctx): Promise<SeedResult> => {
    console.log("Starting database seed...");

    // Check if already seeded
    const { isSeeded } = await ctx.runQuery(internal.seed.mutations.checkIfSeeded, {});
    if (isSeeded) {
      console.log("Database already seeded. Use clearAndSeed to reset.");
      return { success: false, message: "Database already seeded" };
    }

    try {
      // 1. Seed Users
      console.log("Seeding users...");
      const userIds: Id<"users">[] = await ctx.runMutation(internal.seed.mutations.seedUsers, {
        users: seedUsers,
      });
      console.log(`Created ${userIds.length} users`);

      // 2. Seed Company (owner is first user)
      console.log("Seeding company...");
      const companyId: Id<"companies"> = await ctx.runMutation(internal.seed.mutations.seedCompany, {
        ownerId: userIds[0],
        company: seedCompany,
      });
      console.log(`Created company: ${companyId}`);

      // 3. Seed Team Members
      console.log("Seeding team members...");
      const teamMembers = seedTeamRoles.map((member) => ({
        userId: userIds[member.userIndex],
        role: member.role,
        department: member.department,
        jobTitle: member.jobTitle,
      }));
      const teamMemberIds: Id<"teamMembers">[] = await ctx.runMutation(internal.seed.mutations.seedTeamMembers, {
        companyId,
        members: teamMembers,
      });
      console.log(`Created ${teamMemberIds.length} team members`);

      // 4. Seed Customers
      console.log("Seeding customers...");
      const customerIds: Id<"customers">[] = await ctx.runMutation(internal.seed.mutations.seedCustomers, {
        companyId,
        createdBy: userIds[0],
        customers: seedCustomers,
      });
      console.log(`Created ${customerIds.length} customers`);

      // 5. Seed Properties
      console.log("Seeding properties...");
      const propertyData = seedProperties.map((p) => ({
        customerId: customerIds[p.customerIndex],
        name: p.name,
        type: p.type,
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zipCode,
        isPrimary: p.isPrimary,
        squareFootage: p.squareFootage,
        yearBuilt: p.yearBuilt,
      }));
      const propertyIds: Id<"properties">[] = await ctx.runMutation(internal.seed.mutations.seedProperties, {
        companyId,
        createdBy: userIds[0],
        properties: propertyData,
      });
      console.log(`Created ${propertyIds.length} properties`);

      // 6. Seed Equipment
      console.log("Seeding equipment...");
      const equipmentData = seedEquipment.map((e) => ({
        customerId: customerIds[seedProperties[e.propertyIndex].customerIndex],
        propertyId: propertyIds[e.propertyIndex],
        name: e.name,
        type: e.type,
        manufacturer: e.manufacturer,
        model: e.model,
        serialNumber: e.serialNumber,
        installDate: e.installDate,
        condition: e.condition,
        status: e.status,
      }));
      const equipmentIds: Id<"equipment">[] = await ctx.runMutation(internal.seed.mutations.seedEquipment, {
        companyId,
        createdBy: userIds[0],
        equipment: equipmentData,
      });
      console.log(`Created ${equipmentIds.length} equipment items`);

      // 7. Seed Price Book Items
      console.log("Seeding price book items...");
      const priceBookIds: Id<"priceBookItems">[] = await ctx.runMutation(internal.seed.mutations.seedPriceBookItems, {
        companyId,
        createdBy: userIds[0],
        items: seedPriceBookItems,
      });
      console.log(`Created ${priceBookIds.length} price book items`);

      // 8. Seed Vendors
      console.log("Seeding vendors...");
      const vendorIds: Id<"vendors">[] = await ctx.runMutation(internal.seed.mutations.seedVendors, {
        companyId,
        createdBy: userIds[0],
        vendors: seedVendors,
      });
      console.log(`Created ${vendorIds.length} vendors`);

      // 9. Seed Jobs
      console.log("Seeding jobs...");
      const jobData = seedJobs.map((j) => ({
        customerId: customerIds[j.customerIndex],
        propertyId: propertyIds[j.propertyIndex],
        assignedTo: j.technicianIndex !== undefined ? userIds[j.technicianIndex] : undefined,
        jobNumber: j.jobNumber,
        title: j.title,
        description: j.description,
        status: j.status,
        priority: j.priority,
        jobType: j.jobType,
        scheduledStart: j.scheduledStart,
        scheduledEnd: j.scheduledEnd,
        actualStart: j.actualStart,
        actualEnd: j.actualEnd,
        totalAmount: j.totalAmount,
      }));
      const jobIds: Id<"jobs">[] = await ctx.runMutation(internal.seed.mutations.seedJobs, {
        companyId,
        createdBy: userIds[0],
        jobs: jobData,
      });
      console.log(`Created ${jobIds.length} jobs`);

      // 10. Seed Estimates
      console.log("Seeding estimates...");
      const estimateData: Array<{
        customerId: Id<"customers">;
        propertyId: Id<"properties">;
        estimateNumber: string;
        title: string;
        description?: string;
        status: string;
        lineItems: Array<unknown>;
        subtotal: number;
        taxRate?: number;
        taxAmount: number;
        discountAmount: number;
        totalAmount: number;
        validUntil?: number;
        sentAt?: number;
        acceptedAt?: number;
      }> = seedEstimates.map((e) => ({
        customerId: customerIds[e.customerIndex],
        propertyId: propertyIds[e.propertyIndex],
        estimateNumber: e.estimateNumber,
        title: e.title,
        description: e.description,
        status: e.status,
        lineItems: e.lineItems,
        subtotal: e.subtotal,
        taxRate: e.taxRate,
        taxAmount: e.taxAmount,
        discountAmount: e.discountAmount,
        totalAmount: e.totalAmount,
        validUntil: e.validUntil,
        sentAt: e.sentAt,
        acceptedAt: e.acceptedAt,
      }));
      const estimateIds: Id<"estimates">[] = await ctx.runMutation(internal.seed.mutations.seedEstimates, {
        companyId,
        createdBy: userIds[0],
        estimates: estimateData,
      });
      console.log(`Created ${estimateIds.length} estimates`);

      // 11. Seed Invoices
      console.log("Seeding invoices...");
      const invoiceData: Array<{
        customerId: Id<"customers">;
        propertyId: Id<"properties">;
        jobId?: Id<"jobs">;
        invoiceNumber: string;
        title: string;
        status: string;
        lineItems: Array<unknown>;
        subtotal: number;
        taxRate?: number;
        taxAmount: number;
        discountAmount: number;
        totalAmount: number;
        amountPaid: number;
        amountDue: number;
        dueDate?: number;
        sentAt?: number;
        paidAt?: number;
      }> = seedInvoices.map((inv) => ({
        customerId: customerIds[inv.customerIndex],
        propertyId: propertyIds[inv.propertyIndex],
        jobId: inv.jobIndex !== undefined ? jobIds[inv.jobIndex] : undefined,
        invoiceNumber: inv.invoiceNumber,
        title: inv.title,
        status: inv.status,
        lineItems: inv.lineItems,
        subtotal: inv.subtotal,
        taxRate: inv.taxRate,
        taxAmount: inv.taxAmount,
        discountAmount: inv.discountAmount,
        totalAmount: inv.totalAmount,
        amountPaid: inv.amountPaid,
        amountDue: inv.amountDue,
        dueDate: inv.dueDate,
        sentAt: inv.sentAt,
        paidAt: inv.paidAt,
      }));
      const invoiceIds: Id<"invoices">[] = await ctx.runMutation(internal.seed.mutations.seedInvoices, {
        companyId,
        createdBy: userIds[0],
        invoices: invoiceData,
      });
      console.log(`Created ${invoiceIds.length} invoices`);

      // 12. Seed Payments
      console.log("Seeding payments...");
      const paymentData: Array<{
        customerId: Id<"customers">;
        invoiceId: Id<"invoices">;
        paymentNumber: string;
        amount: number;
        paymentMethod: string;
        paymentType: string;
        cardBrand?: string;
        cardLast4?: string;
        bankName?: string;
        status: string;
        receiptEmailed: boolean;
        isReconciled: boolean;
        processedAt?: number;
        completedAt?: number;
      }> = seedPayments.map((p) => ({
        customerId: customerIds[p.customerIndex],
        invoiceId: invoiceIds[p.invoiceIndex],
        paymentNumber: p.paymentNumber,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        paymentType: p.paymentType,
        cardBrand: p.cardBrand,
        cardLast4: p.cardLast4,
        bankName: p.bankName,
        status: p.status,
        receiptEmailed: p.receiptEmailed,
        isReconciled: p.isReconciled,
        processedAt: p.processedAt,
        completedAt: p.completedAt,
      }));
      const paymentIds: Id<"payments">[] = await ctx.runMutation(internal.seed.mutations.seedPayments, {
        companyId,
        createdBy: userIds[0],
        payments: paymentData,
      });
      console.log(`Created ${paymentIds.length} payments`);

      // 13. Seed Purchase Orders
      console.log("Seeding purchase orders...");
      const poData = seedPurchaseOrders.map((po) => {
        return {
          vendorId: vendorIds[po.vendorIndex],
          poNumber: po.poNumber,
          title: po.title,
          status: po.status,
          priority: po.priority,
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
        };
      });
      const poIds: Id<"purchaseOrders">[] = await ctx.runMutation(internal.seed.mutations.seedPurchaseOrders, {
        companyId,
        createdBy: userIds[0],
        purchaseOrders: poData,
      });
      console.log(`Created ${poIds.length} purchase orders`);

      console.log("Database seed completed successfully!");

      return {
        success: true,
        message: "Database seeded successfully",
        stats: {
          users: userIds.length,
          company: 1,
          teamMembers: teamMemberIds.length,
          customers: customerIds.length,
          properties: propertyIds.length,
          equipment: equipmentIds.length,
          priceBookItems: priceBookIds.length,
          vendors: vendorIds.length,
          jobs: jobIds.length,
          estimates: estimateIds.length,
          invoices: invoiceIds.length,
          payments: paymentIds.length,
          purchaseOrders: poIds.length,
        },
      };
    } catch (error) {
      console.error("Seed error:", error);
      throw error;
    }
  },
});

/**
 * Clear all data and reseed
 * WARNING: This deletes ALL data - use only in development
 *
 * Usage: npx convex run seed/index:clearAndSeed
 */
export const clearAndSeed = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing all data...");
    await ctx.runMutation(internal.seed.mutations.clearAllData, {});
    console.log("Data cleared. Now seeding...");
    const result = await ctx.runAction(internal.seed.index.seedDatabase, {});
    return result;
  },
});

// Re-export mutations for direct access
export * from "./mutations";
