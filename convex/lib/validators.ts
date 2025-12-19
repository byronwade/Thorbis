/**
 * Shared validators for Convex schema
 * Converts PostgreSQL ENUMs to Convex v.union(v.literal(...)) patterns
 */
import { v } from "convex/values";

// ============================================================================
// SOFT DELETE FIELDS - Add to all tables
// ============================================================================
export const softDeleteFields = {
  deletedAt: v.optional(v.number()), // Unix timestamp in milliseconds
  deletedBy: v.optional(v.id("users")),
  archivedAt: v.optional(v.number()),
  archivedBy: v.optional(v.id("users")),
};

// ============================================================================
// AUDIT FIELDS - Add to all tables
// ============================================================================
export const auditFields = {
  createdBy: v.optional(v.id("users")),
  updatedBy: v.optional(v.id("users")),
};

// ============================================================================
// USER & TEAM ENUMS
// ============================================================================
export const userRole = v.union(
  v.literal("owner"),
  v.literal("admin"),
  v.literal("manager"),
  v.literal("dispatcher"),
  v.literal("technician"),
  v.literal("csr")
);

export const userStatus = v.union(
  v.literal("online"),
  v.literal("available"),
  v.literal("busy"),
  v.literal("offline")
);

export const teamMemberStatus = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("pending"),
  v.literal("suspended")
);

// ============================================================================
// CUSTOMER ENUMS
// ============================================================================
export const customerType = v.union(
  v.literal("residential"),
  v.literal("commercial"),
  v.literal("industrial")
);

export const customerStatus = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("archived"),
  v.literal("blocked")
);

// ============================================================================
// JOB ENUMS
// ============================================================================
export const jobStatus = v.union(
  v.literal("quoted"),
  v.literal("scheduled"),
  v.literal("in_progress"),
  v.literal("on_hold"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("invoiced"),
  v.literal("paid"),
  v.literal("archived")
);

export const jobPriority = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("urgent")
);

export const jobType = v.union(
  v.literal("service"),
  v.literal("installation"),
  v.literal("repair"),
  v.literal("maintenance"),
  v.literal("inspection"),
  v.literal("consultation"),
  v.literal("emergency"),
  v.literal("other")
);

// ============================================================================
// ESTIMATE ENUMS
// ============================================================================
export const estimateStatus = v.union(
  v.literal("draft"),
  v.literal("sent"),
  v.literal("viewed"),
  v.literal("accepted"),
  v.literal("declined"),
  v.literal("expired")
);

// ============================================================================
// INVOICE ENUMS
// ============================================================================
export const invoiceStatus = v.union(
  v.literal("draft"),
  v.literal("sent"),
  v.literal("viewed"),
  v.literal("partial"),
  v.literal("paid"),
  v.literal("overdue"),
  v.literal("cancelled"),
  v.literal("refunded")
);

// ============================================================================
// PAYMENT ENUMS
// ============================================================================
export const paymentMethod = v.union(
  v.literal("cash"),
  v.literal("check"),
  v.literal("credit_card"),
  v.literal("debit_card"),
  v.literal("ach"),
  v.literal("wire"),
  v.literal("venmo"),
  v.literal("paypal"),
  v.literal("other")
);

export const paymentStatus = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("refunded"),
  v.literal("partially_refunded"),
  v.literal("cancelled")
);

export const paymentType = v.union(
  v.literal("payment"),
  v.literal("refund"),
  v.literal("credit")
);

export const cardBrand = v.union(
  v.literal("visa"),
  v.literal("mastercard"),
  v.literal("amex"),
  v.literal("discover"),
  v.literal("other")
);

// ============================================================================
// COMMUNICATION ENUMS
// ============================================================================
export const communicationType = v.union(
  v.literal("email"),
  v.literal("sms"),
  v.literal("phone"),
  v.literal("chat"),
  v.literal("note")
);

export const communicationDirection = v.union(
  v.literal("inbound"),
  v.literal("outbound")
);

export const communicationStatus = v.union(
  v.literal("draft"),
  v.literal("queued"),
  v.literal("sending"),
  v.literal("sent"),
  v.literal("delivered"),
  v.literal("failed"),
  v.literal("read")
);

export const communicationPriority = v.union(
  v.literal("low"),
  v.literal("normal"),
  v.literal("high"),
  v.literal("urgent")
);

// ============================================================================
// EQUIPMENT ENUMS
// ============================================================================
export const equipmentType = v.union(
  v.literal("hvac"),
  v.literal("plumbing"),
  v.literal("electrical"),
  v.literal("appliance"),
  v.literal("water_heater"),
  v.literal("furnace"),
  v.literal("ac_unit"),
  v.literal("other")
);

export const equipmentCondition = v.union(
  v.literal("excellent"),
  v.literal("good"),
  v.literal("fair"),
  v.literal("poor"),
  v.literal("needs_replacement")
);

export const equipmentStatus = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("retired"),
  v.literal("replaced")
);

// ============================================================================
// SERVICE PLAN ENUMS
// ============================================================================
export const servicePlanType = v.union(
  v.literal("preventive"),
  v.literal("warranty"),
  v.literal("subscription"),
  v.literal("contract")
);

export const servicePlanFrequency = v.union(
  v.literal("weekly"),
  v.literal("bi_weekly"),
  v.literal("monthly"),
  v.literal("quarterly"),
  v.literal("semi_annually"),
  v.literal("annually")
);

export const servicePlanStatus = v.union(
  v.literal("draft"),
  v.literal("active"),
  v.literal("paused"),
  v.literal("cancelled"),
  v.literal("expired"),
  v.literal("completed")
);

export const renewalType = v.union(
  v.literal("auto"),
  v.literal("manual"),
  v.literal("none")
);

// ============================================================================
// SCHEDULE ENUMS
// ============================================================================
export const scheduleType = v.union(
  v.literal("appointment"),
  v.literal("recurring"),
  v.literal("on_call"),
  v.literal("emergency")
);

export const scheduleStatus = v.union(
  v.literal("scheduled"),
  v.literal("confirmed"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("no_show"),
  v.literal("rescheduled")
);

// ============================================================================
// INVENTORY ENUMS
// ============================================================================
export const inventoryStatus = v.union(
  v.literal("active"),
  v.literal("discontinued"),
  v.literal("on_order")
);

export const priceBookItemType = v.union(
  v.literal("service"),
  v.literal("material"),
  v.literal("labor"),
  v.literal("equipment"),
  v.literal("flat_rate")
);

// ============================================================================
// PURCHASE ORDER ENUMS
// ============================================================================
export const purchaseOrderStatus = v.union(
  v.literal("draft"),
  v.literal("pending_approval"),
  v.literal("approved"),
  v.literal("ordered"),
  v.literal("partially_received"),
  v.literal("received"),
  v.literal("cancelled")
);

// ============================================================================
// VENDOR ENUMS
// ============================================================================
export const vendorCategory = v.union(
  v.literal("supplier"),
  v.literal("distributor"),
  v.literal("manufacturer"),
  v.literal("service_provider"),
  v.literal("other")
);

export const vendorPaymentTerms = v.union(
  v.literal("net_15"),
  v.literal("net_30"),
  v.literal("net_60"),
  v.literal("due_on_receipt"),
  v.literal("custom")
);

// ============================================================================
// TAG ENUMS
// ============================================================================
export const tagCategory = v.union(
  v.literal("customer"),
  v.literal("job"),
  v.literal("equipment"),
  v.literal("general"),
  v.literal("status"),
  v.literal("priority")
);

// ============================================================================
// ATTACHMENT ENUMS
// ============================================================================
export const attachmentEntityType = v.union(
  v.literal("job"),
  v.literal("customer"),
  v.literal("invoice"),
  v.literal("estimate"),
  v.literal("equipment"),
  v.literal("property"),
  v.literal("communication")
);

export const attachmentCategory = v.union(
  v.literal("photo"),
  v.literal("document"),
  v.literal("receipt"),
  v.literal("manual"),
  v.literal("warranty"),
  v.literal("other")
);

// ============================================================================
// PROPERTY ENUMS
// ============================================================================
export const propertyType = v.union(
  v.literal("residential"),
  v.literal("commercial"),
  v.literal("industrial"),
  v.literal("mixed_use")
);

// ============================================================================
// SUBSCRIPTION ENUMS
// ============================================================================
export const subscriptionStatus = v.union(
  v.literal("trialing"),
  v.literal("active"),
  v.literal("past_due"),
  v.literal("cancelled"),
  v.literal("paused"),
  v.literal("incomplete")
);

// ============================================================================
// HELPER TYPE EXPORTS
// ============================================================================
export type UserRole = "owner" | "admin" | "manager" | "dispatcher" | "technician" | "csr";
export type TeamMemberStatus = "active" | "inactive" | "pending" | "suspended";
export type CustomerType = "residential" | "commercial" | "industrial";
export type JobStatus = "quoted" | "scheduled" | "in_progress" | "on_hold" | "completed" | "cancelled" | "invoiced" | "paid" | "archived";
export type JobPriority = "low" | "medium" | "high" | "urgent";
export type PaymentMethod = "cash" | "check" | "credit_card" | "debit_card" | "ach" | "wire" | "venmo" | "paypal" | "other";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded" | "cancelled";
export type CommunicationType = "email" | "sms" | "phone" | "chat" | "note";
export type CommunicationDirection = "inbound" | "outbound";
