import {
  boolean as pgBoolean,
  integer as pgInteger,
  json as pgJson,
  pgTable,
  text as pgText,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Users table - works with both SQLite (dev) and PostgreSQL (prod)
 */
export const users = isProduction
  ? pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: pgText("name").notNull(),
      email: pgText("email").notNull().unique(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("users", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      name: text("name").notNull(),
      email: text("email").notNull().unique(),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Example posts table - works with both SQLite (dev) and PostgreSQL (prod)
 */
export const posts = isProduction
  ? pgTable("posts", {
      id: uuid("id").primaryKey().defaultRandom(),
      title: pgText("title").notNull(),
      content: pgText("content").notNull(),
      published: pgText("published").notNull().default("false"),
      authorId: uuid("author_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("posts", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      title: text("title").notNull(),
      content: text("content").notNull(),
      published: text("published").notNull().default("false"),
      authorId: text("author_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Chats table - AI chat conversations
 */
export const chats = isProduction
  ? pgTable("chats", {
      id: uuid("id").primaryKey().defaultRandom(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      title: pgText("title").notNull(),
      userId: uuid("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      visibility: pgText("visibility").notNull().default("private"), // 'public' | 'private'
    })
  : sqliteTable("chats", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      title: text("title").notNull(),
      userId: text("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      visibility: text("visibility").notNull().default("private"),
    });

/**
 * Messages table - chat messages with parts and attachments
 */
export const messages = isProduction
  ? pgTable("messages_v2", {
      id: uuid("id").primaryKey().defaultRandom(),
      chatId: uuid("chat_id")
        .notNull()
        .references(() => chats.id as any, { onDelete: "cascade" }),
      role: pgText("role").notNull(), // 'user' | 'assistant' | 'system'
      parts: pgJson("parts").notNull(), // JSON array of message parts
      attachments: pgJson("attachments").notNull(), // JSON array of attachments
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("messages_v2", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      chatId: text("chat_id")
        .notNull()
        .references(() => chats.id as any, { onDelete: "cascade" }),
      role: text("role").notNull(),
      parts: text("parts").notNull(), // JSON string
      attachments: text("attachments").notNull(), // JSON string
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Documents table - artifacts (code, text, images, sheets)
 */
export const documents = isProduction
  ? pgTable("documents", {
      id: uuid("id").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      title: pgText("title").notNull(),
      content: pgText("content"),
      kind: pgText("kind").notNull().default("text"), // 'text' | 'code' | 'image' | 'sheet'
      userId: uuid("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
    })
  : sqliteTable("documents", {
      id: text("id").notNull(),
      createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
      title: text("title").notNull(),
      content: text("content"),
      kind: text("kind").notNull().default("text"),
      userId: text("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
    });

/**
 * Suggestions table - AI suggestions for documents
 */
export const suggestions = isProduction
  ? pgTable("suggestions", {
      id: uuid("id").primaryKey().defaultRandom(),
      documentId: uuid("document_id")
        .notNull()
        .references(() => documents.id as any, { onDelete: "cascade" }),
      originalText: pgText("original_text").notNull(),
      suggestedText: pgText("suggested_text").notNull(),
      description: pgText("description"),
      isResolved: pgBoolean("is_resolved").notNull().default(false),
      userId: uuid("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("suggestions", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      documentId: text("document_id")
        .notNull()
        .references(() => documents.id as any, { onDelete: "cascade" }),
      originalText: text("original_text").notNull(),
      suggestedText: text("suggested_text").notNull(),
      description: text("description"),
      isResolved: integer("is_resolved", { mode: "boolean" })
        .notNull()
        .default(false),
      userId: text("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Votes table - message voting (upvote/downvote)
 */
export const votes = isProduction
  ? pgTable("votes_v2", {
      chatId: uuid("chat_id")
        .notNull()
        .references(() => chats.id as any, { onDelete: "cascade" }),
      messageId: uuid("message_id")
        .notNull()
        .references(() => messages.id as any, { onDelete: "cascade" }),
      isUpvoted: pgBoolean("is_upvoted").notNull(),
    })
  : sqliteTable("votes_v2", {
      chatId: text("chat_id")
        .notNull()
        .references(() => chats.id as any, { onDelete: "cascade" }),
      messageId: text("message_id")
        .notNull()
        .references(() => messages.id as any, { onDelete: "cascade" }),
      isUpvoted: integer("is_upvoted", { mode: "boolean" }).notNull(),
    });

/**
 * Streams table - resumable streams for chat
 */
export const streams = isProduction
  ? pgTable("streams", {
      id: uuid("id").primaryKey().defaultRandom(),
      chatId: uuid("chat_id")
        .notNull()
        .references(() => chats.id as any, { onDelete: "cascade" }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("streams", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      chatId: text("chat_id")
        .notNull()
        .references(() => chats.id as any, { onDelete: "cascade" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Companies/Organizations table
 */
export const companies = isProduction
  ? pgTable("companies", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: pgText("name").notNull(),
      slug: pgText("slug").notNull().unique(),
      logo: pgText("logo"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("companies", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      name: text("name").notNull(),
      slug: text("slug").notNull().unique(),
      logo: text("logo"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Departments/Teams table
 */
export const departments = isProduction
  ? pgTable("departments", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: pgText("name").notNull(),
      description: pgText("description"),
      color: pgText("color"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("departments", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      description: text("description"),
      color: text("color"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Custom Roles table - User-defined permission roles
 */
export const customRoles = isProduction
  ? pgTable("custom_roles", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: pgText("name").notNull(),
      description: pgText("description"),
      permissions: pgJson("permissions").notNull(), // JSON object of permissions
      color: pgText("color"),
      isSystem: pgBoolean("is_system").notNull().default(false), // System roles cannot be deleted
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("custom_roles", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      description: text("description"),
      permissions: text("permissions").notNull(), // JSON string
      color: text("color"),
      isSystem: integer("is_system", { mode: "boolean" })
        .notNull()
        .default(false),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Team Members table - Links users to companies with roles and departments
 */
export const teamMembers = isProduction
  ? pgTable("team_members", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      userId: uuid("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      roleId: uuid("role_id").references(() => customRoles.id as any, {
        onDelete: "set null",
      }),
      departmentId: uuid("department_id").references(
        () => departments.id as any,
        { onDelete: "set null" }
      ),
      status: pgText("status").notNull().default("active"), // 'active' | 'invited' | 'suspended'
      jobTitle: pgText("job_title"),
      phone: pgText("phone"),
      invitedBy: uuid("invited_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      invitedAt: timestamp("invited_at"),
      joinedAt: timestamp("joined_at"),
      lastActiveAt: timestamp("last_active_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("team_members", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      userId: text("user_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      roleId: text("role_id").references(() => customRoles.id as any, {
        onDelete: "set null",
      }),
      departmentId: text("department_id").references(
        () => departments.id as any,
        { onDelete: "set null" }
      ),
      status: text("status").notNull().default("active"),
      jobTitle: text("job_title"),
      phone: text("phone"),
      invitedBy: text("invited_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      invitedAt: integer("invited_at", { mode: "timestamp" }),
      joinedAt: integer("joined_at", { mode: "timestamp" }),
      lastActiveAt: integer("last_active_at", { mode: "timestamp" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Company Settings table - Stores company profile settings (hours, service area, etc.)
 */
export const companySettings = isProduction
  ? pgTable("company_settings", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .unique()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      hoursOfOperation: pgJson("hours_of_operation").notNull(), // JSON object of weekly hours
      serviceAreaType: pgText("service_area_type")
        .notNull()
        .default("locations"), // 'radius' | 'locations'
      serviceRadius: pgInteger("service_radius").default(25), // Miles from business address
      serviceAreas: pgJson("service_areas"), // JSON array of location strings
      address: pgText("address"),
      address2: pgText("address2"),
      city: pgText("city"),
      state: pgText("state"),
      zipCode: pgText("zip_code"),
      country: pgText("country"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("company_settings", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .unique()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      hoursOfOperation: text("hours_of_operation").notNull(), // JSON string
      serviceAreaType: text("service_area_type").notNull().default("locations"),
      serviceRadius: integer("service_radius").default(25),
      serviceAreas: text("service_areas"), // JSON string
      address: text("address"),
      address2: text("address2"),
      city: text("city"),
      state: text("state"),
      zipCode: text("zip_code"),
      country: text("country"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Properties table - Customer properties/locations
 */
export const properties = isProduction
  ? pgTable("properties", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: uuid("customer_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      name: pgText("name").notNull(),
      address: pgText("address").notNull(),
      address2: pgText("address2"),
      city: pgText("city").notNull(),
      state: pgText("state").notNull(),
      zipCode: pgText("zip_code").notNull(),
      country: pgText("country").notNull().default("USA"),
      propertyType: pgText("property_type"), // 'residential' | 'commercial' | 'industrial'
      squareFootage: pgInteger("square_footage"),
      yearBuilt: pgInteger("year_built"),
      notes: pgText("notes"),
      metadata: pgJson("metadata"), // Additional property-specific data
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("properties", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: text("customer_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      name: text("name").notNull(),
      address: text("address").notNull(),
      address2: text("address2"),
      city: text("city").notNull(),
      state: text("state").notNull(),
      zipCode: text("zip_code").notNull(),
      country: text("country").notNull().default("USA"),
      propertyType: text("property_type"),
      squareFootage: integer("square_footage"),
      yearBuilt: integer("year_built"),
      notes: text("notes"),
      metadata: text("metadata"), // JSON string
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Jobs table - Work orders/projects
 */
export const jobs = isProduction
  ? pgTable("jobs", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      propertyId: uuid("property_id")
        .notNull()
        .references(() => properties.id as any, { onDelete: "cascade" }),
      customerId: uuid("customer_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      assignedTo: uuid("assigned_to").references(() => users.id as any, {
        onDelete: "set null",
      }),
      jobNumber: pgText("job_number").notNull().unique(),
      title: pgText("title").notNull(),
      description: pgText("description"),
      status: pgText("status").notNull().default("quoted"), // 'quoted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
      priority: pgText("priority").notNull().default("medium"), // 'low' | 'medium' | 'high' | 'urgent'
      jobType: pgText("job_type"), // 'service' | 'installation' | 'repair' | 'maintenance'
      scheduledStart: timestamp("scheduled_start"),
      scheduledEnd: timestamp("scheduled_end"),
      actualStart: timestamp("actual_start"),
      actualEnd: timestamp("actual_end"),
      totalAmount: pgInteger("total_amount").default(0), // In cents
      paidAmount: pgInteger("paid_amount").default(0), // In cents
      notes: pgText("notes"),
      metadata: pgJson("metadata"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("jobs", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      propertyId: text("property_id")
        .notNull()
        .references(() => properties.id as any, { onDelete: "cascade" }),
      customerId: text("customer_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      assignedTo: text("assigned_to").references(() => users.id as any, {
        onDelete: "set null",
      }),
      jobNumber: text("job_number").notNull().unique(),
      title: text("title").notNull(),
      description: text("description"),
      status: text("status").notNull().default("quoted"),
      priority: text("priority").notNull().default("medium"),
      jobType: text("job_type"),
      scheduledStart: integer("scheduled_start", { mode: "timestamp" }),
      scheduledEnd: integer("scheduled_end", { mode: "timestamp" }),
      actualStart: integer("actual_start", { mode: "timestamp" }),
      actualEnd: integer("actual_end", { mode: "timestamp" }),
      totalAmount: integer("total_amount").default(0),
      paidAmount: integer("paid_amount").default(0),
      notes: text("notes"),
      metadata: text("metadata"), // JSON string
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Estimates table - Job quotes/proposals
 */
export const estimates = isProduction
  ? pgTable("estimates", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: uuid("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      propertyId: uuid("property_id").references(() => properties.id as any, {
        onDelete: "set null",
      }),
      customerId: uuid("customer_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      estimateNumber: pgText("estimate_number").notNull().unique(),
      title: pgText("title").notNull(),
      description: pgText("description"),
      status: pgText("status").notNull().default("draft"), // 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
      subtotal: pgInteger("subtotal").notNull().default(0), // In cents
      taxAmount: pgInteger("tax_amount").notNull().default(0), // In cents
      discountAmount: pgInteger("discount_amount").notNull().default(0), // In cents
      totalAmount: pgInteger("total_amount").notNull().default(0), // In cents
      validUntil: timestamp("valid_until"),
      lineItems: pgJson("line_items").notNull(), // Array of line items
      terms: pgText("terms"),
      notes: pgText("notes"),
      sentAt: timestamp("sent_at"),
      viewedAt: timestamp("viewed_at"),
      respondedAt: timestamp("responded_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("estimates", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: text("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      propertyId: text("property_id").references(() => properties.id as any, {
        onDelete: "set null",
      }),
      customerId: text("customer_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      estimateNumber: text("estimate_number").notNull().unique(),
      title: text("title").notNull(),
      description: text("description"),
      status: text("status").notNull().default("draft"),
      subtotal: integer("subtotal").notNull().default(0),
      taxAmount: integer("tax_amount").notNull().default(0),
      discountAmount: integer("discount_amount").notNull().default(0),
      totalAmount: integer("total_amount").notNull().default(0),
      validUntil: integer("valid_until", { mode: "timestamp" }),
      lineItems: text("line_items").notNull(), // JSON string
      terms: text("terms"),
      notes: text("notes"),
      sentAt: integer("sent_at", { mode: "timestamp" }),
      viewedAt: integer("viewed_at", { mode: "timestamp" }),
      respondedAt: integer("responded_at", { mode: "timestamp" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Invoices table - Billing documents
 */
export const invoices = isProduction
  ? pgTable("invoices", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: uuid("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      customerId: uuid("customer_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      invoiceNumber: pgText("invoice_number").notNull().unique(),
      title: pgText("title").notNull(),
      description: pgText("description"),
      status: pgText("status").notNull().default("draft"), // 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled'
      subtotal: pgInteger("subtotal").notNull().default(0), // In cents
      taxAmount: pgInteger("tax_amount").notNull().default(0), // In cents
      discountAmount: pgInteger("discount_amount").notNull().default(0), // In cents
      totalAmount: pgInteger("total_amount").notNull().default(0), // In cents
      paidAmount: pgInteger("paid_amount").notNull().default(0), // In cents
      balanceAmount: pgInteger("balance_amount").notNull().default(0), // In cents
      dueDate: timestamp("due_date"),
      lineItems: pgJson("line_items").notNull(), // Array of line items
      terms: pgText("terms"),
      notes: pgText("notes"),
      sentAt: timestamp("sent_at"),
      viewedAt: timestamp("viewed_at"),
      paidAt: timestamp("paid_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("invoices", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: text("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      customerId: text("customer_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      invoiceNumber: text("invoice_number").notNull().unique(),
      title: text("title").notNull(),
      description: text("description"),
      status: text("status").notNull().default("draft"),
      subtotal: integer("subtotal").notNull().default(0),
      taxAmount: integer("tax_amount").notNull().default(0),
      discountAmount: integer("discount_amount").notNull().default(0),
      totalAmount: integer("total_amount").notNull().default(0),
      paidAmount: integer("paid_amount").notNull().default(0),
      balanceAmount: integer("balance_amount").notNull().default(0),
      dueDate: integer("due_date", { mode: "timestamp" }),
      lineItems: text("line_items").notNull(), // JSON string
      terms: text("terms"),
      notes: text("notes"),
      sentAt: integer("sent_at", { mode: "timestamp" }),
      viewedAt: integer("viewed_at", { mode: "timestamp" }),
      paidAt: integer("paid_at", { mode: "timestamp" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

// Export types for use in your application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// Chat types
export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type Suggestion = typeof suggestions.$inferSelect;
export type NewSuggestion = typeof suggestions.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
export type Stream = typeof streams.$inferSelect;
export type NewStream = typeof streams.$inferInsert;

// Team management types
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type CustomRole = typeof customRoles.$inferSelect;
export type NewCustomRole = typeof customRoles.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type CompanySettings = typeof companySettings.$inferSelect;
export type NewCompanySettings = typeof companySettings.$inferInsert;

// Work management types
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Estimate = typeof estimates.$inferSelect;
export type NewEstimate = typeof estimates.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
