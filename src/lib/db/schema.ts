import {
  boolean as pgBoolean,
  doublePrecision as pgDoublePrecision,
  integer as pgInteger,
  json as pgJson,
  pgTable,
  text as pgText,
  real,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Production Supabase (PostgreSQL) only - SQLite support removed
const isProduction = true; // Always use PostgreSQL/Supabase

// Type-safe fallback for SQLite (will never be used in production)
// This allows the code to compile but throws if SQLite is ever attempted
const sqliteTable = (...args: any[]): any => {
  throw new Error(
    "SQLite is not supported. This project uses Supabase (PostgreSQL) only."
  );
};
const sqliteInteger = (...args: any[]): any => {
  throw new Error(
    "SQLite is not supported. This project uses Supabase (PostgreSQL) only."
  );
};
const sqliteText = (...args: any[]): any => {
  throw new Error(
    "SQLite is not supported. This project uses Supabase (PostgreSQL) only."
  );
};
const text = (...args: any[]): any => {
  throw new Error(
    "SQLite is not supported. This project uses Supabase (PostgreSQL) only."
  );
};
const integer = (...args: any[]): any => {
  throw new Error(
    "SQLite is not supported. This project uses Supabase (PostgreSQL) only."
  );
};

/**
 * Users table - works with both SQLite (dev) and PostgreSQL (prod)
 *
 * Note: This syncs with Supabase Auth users (auth.users table)
 * The id should match the Supabase Auth user ID for proper RLS policies
 *
 * Auth fields are managed by Supabase Auth separately:
 * - Email/password authentication
 * - OAuth providers (Google, Facebook, etc.)
 * - Email verification
 * - Password reset
 */
export const users = isProduction
  ? pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(), // Should match Supabase Auth user ID
      name: pgText("name").notNull(),
      email: pgText("email").notNull().unique(),
      avatar: pgText("avatar"), // Profile picture URL
      bio: pgText("bio"), // User biography
      phone: pgText("phone"), // Phone number
      emailVerified: pgBoolean("email_verified").default(false), // Email verification status
      lastLoginAt: timestamp("last_login_at"), // Last login timestamp
      isActive: pgBoolean("is_active").default(true).notNull(), // Account status
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
      avatar: text("avatar"), // Profile picture URL
      bio: text("bio"), // User biography
      phone: text("phone"), // Phone number
      emailVerified: integer("email_verified", { mode: "boolean" }).default(
        false
      ), // Email verification status
      lastLoginAt: integer("last_login_at", { mode: "timestamp" }), // Last login timestamp
      isActive: integer("is_active", { mode: "boolean" })
        .default(true)
        .notNull(), // Account status
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
      customerId: uuid("customer_id").references(() => customers.id as any, {
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
      lat: pgDoublePrecision("lat"), // Latitude for geocoding/enrichment
      lon: pgDoublePrecision("lon"), // Longitude for geocoding/enrichment
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
      customerId: text("customer_id").references(() => customers.id as any, {
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
      lat: real("lat"), // Latitude for geocoding/enrichment
      lon: real("lon"), // Longitude for geocoding/enrichment
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
 * Customers table - Dedicated customer records (separate from team members/users)
 *
 * This table stores customer information independently from the users table.
 * Team members are in the users table, customers are here.
 * A customer MAY have a userId if they have portal access, but it's optional.
 */
export const customers: any = isProduction
  ? pgTable("customers", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      userId: uuid("user_id").references(() => users.id as any, {
        onDelete: "set null",
      }), // Optional - only if customer has portal access
      // Customer type
      type: pgText("type").notNull().default("residential"), // 'residential' | 'commercial' | 'industrial'
      // Basic information
      firstName: pgText("first_name").notNull(),
      lastName: pgText("last_name").notNull(),
      companyName: pgText("company_name"), // For commercial customers
      displayName: pgText("display_name").notNull(), // Auto-generated: "FirstName LastName" or companyName
      // Contact information
      email: pgText("email").notNull(),
      phone: pgText("phone").notNull(),
      secondaryPhone: pgText("secondary_phone"),
      // Address (primary)
      address: pgText("address"),
      address2: pgText("address2"),
      city: pgText("city"),
      state: pgText("state"),
      zipCode: pgText("zip_code"),
      country: pgText("country").default("USA"),
      // Customer classification
      tags: pgJson("tags"), // Array of tag strings: ["VIP", "Repeat Customer"]
      source: pgText("source"), // How they found us: 'referral' | 'google' | 'facebook' | 'direct' | 'other'
      referredBy: uuid("referred_by").references(() => customers.id as any, {
        onDelete: "set null",
      }),
      // Customer preferences
      communicationPreferences: pgJson("communication_preferences"), // { email: true, sms: true, phone: false }
      preferredContactMethod: pgText("preferred_contact_method").default(
        "email"
      ), // 'email' | 'phone' | 'sms'
      preferredTechnician: uuid("preferred_technician").references(
        () => users.id as any,
        { onDelete: "set null" }
      ),
      // Billing information
      billingEmail: pgText("billing_email"), // Separate billing email if different
      paymentTerms: pgText("payment_terms").default("due_on_receipt"), // 'due_on_receipt' | 'net_15' | 'net_30' | 'net_60'
      creditLimit: pgInteger("credit_limit").default(0), // In cents
      taxExempt: pgBoolean("tax_exempt").notNull().default(false),
      taxExemptNumber: pgText("tax_exempt_number"),
      // Customer metrics (denormalized for performance)
      totalRevenue: pgInteger("total_revenue").default(0), // In cents - lifetime value
      totalJobs: pgInteger("total_jobs").default(0),
      totalInvoices: pgInteger("total_invoices").default(0),
      averageJobValue: pgInteger("average_job_value").default(0), // In cents
      outstandingBalance: pgInteger("outstanding_balance").default(0), // In cents
      lastJobDate: timestamp("last_job_date"),
      lastInvoiceDate: timestamp("last_invoice_date"),
      lastPaymentDate: timestamp("last_payment_date"),
      // Status and notes
      status: pgText("status").notNull().default("active"), // 'active' | 'inactive' | 'archived' | 'blocked'
      notes: pgText("notes"), // Internal notes about the customer
      internalNotes: pgText("internal_notes"), // Private notes (not visible to customer)
      // Portal access
      portalEnabled: pgBoolean("portal_enabled").notNull().default(false),
      portalInvitedAt: timestamp("portal_invited_at"),
      portalLastLoginAt: timestamp("portal_last_login_at"),
      // Metadata
      metadata: pgJson("metadata"), // Additional custom fields
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("customers", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      userId: text("user_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      type: text("type").notNull().default("residential"),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      companyName: text("company_name"),
      displayName: text("display_name").notNull(),
      email: text("email").notNull(),
      phone: text("phone").notNull(),
      secondaryPhone: text("secondary_phone"),
      address: text("address"),
      address2: text("address2"),
      city: text("city"),
      state: text("state"),
      zipCode: text("zip_code"),
      country: text("country").default("USA"),
      tags: text("tags"), // JSON string
      source: text("source"),
      referredBy: text("referred_by").references(() => customers.id as any, {
        onDelete: "set null",
      }),
      communicationPreferences: text("communication_preferences"), // JSON string
      preferredContactMethod: text("preferred_contact_method").default("email"),
      preferredTechnician: text("preferred_technician").references(
        () => users.id as any,
        { onDelete: "set null" }
      ),
      billingEmail: text("billing_email"),
      paymentTerms: text("payment_terms").default("due_on_receipt"),
      creditLimit: integer("credit_limit").default(0),
      taxExempt: integer("tax_exempt", { mode: "boolean" })
        .notNull()
        .default(false),
      taxExemptNumber: text("tax_exempt_number"),
      totalRevenue: integer("total_revenue").default(0),
      totalJobs: integer("total_jobs").default(0),
      totalInvoices: integer("total_invoices").default(0),
      averageJobValue: integer("average_job_value").default(0),
      outstandingBalance: integer("outstanding_balance").default(0),
      lastJobDate: integer("last_job_date", { mode: "timestamp" }),
      lastInvoiceDate: integer("last_invoice_date", { mode: "timestamp" }),
      lastPaymentDate: integer("last_payment_date", { mode: "timestamp" }),
      status: text("status").notNull().default("active"),
      notes: text("notes"),
      internalNotes: text("internal_notes"),
      portalEnabled: integer("portal_enabled", { mode: "boolean" })
        .notNull()
        .default(false),
      portalInvitedAt: integer("portal_invited_at", { mode: "timestamp" }),
      portalLastLoginAt: integer("portal_last_login_at", { mode: "timestamp" }),
      metadata: text("metadata"), // JSON string
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
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
      propertyId: uuid("property_id").references(() => properties.id as any, {
        onDelete: "set null",
      }),
      customerId: uuid("customer_id").references(() => customers.id as any, {
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
      // AI-powered auto-tagging fields
      aiCategories: pgJson("ai_categories"), // AI-extracted categories: ["HVAC", "Plumbing", "Electrical"]
      aiEquipment: pgJson("ai_equipment"), // AI-extracted equipment: ["Furnace", "Water Heater"]
      aiServiceType: pgText("ai_service_type"), // AI-detected: 'emergency' | 'routine' | 'preventive' | 'warranty'
      aiPriorityScore: pgInteger("ai_priority_score"), // AI-calculated priority score (0-100)
      aiTags: pgJson("ai_tags"), // AI-generated tags for search/filtering
      aiProcessedAt: timestamp("ai_processed_at"), // When AI last analyzed this job
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
      propertyId: text("property_id").references(() => properties.id as any, {
        onDelete: "set null",
      }),
      customerId: text("customer_id").references(() => customers.id as any, {
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
      // AI-powered auto-tagging fields
      aiCategories: text("ai_categories"), // JSON string: AI-extracted categories
      aiEquipment: text("ai_equipment"), // JSON string: AI-extracted equipment
      aiServiceType: text("ai_service_type"), // AI-detected service type
      aiPriorityScore: integer("ai_priority_score"), // AI-calculated priority score (0-100)
      aiTags: text("ai_tags"), // JSON string: AI-generated tags
      aiProcessedAt: integer("ai_processed_at", { mode: "timestamp" }), // When AI last analyzed
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
      customerId: uuid("customer_id").references(() => customers.id as any, {
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
      customerId: text("customer_id").references(() => customers.id as any, {
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

/**
 * Contracts table - Digital contract management
 *
 * Note: Contracts are linked to estimates/invoices, NOT directly to customers.
 * Customer information is derived from the linked estimate/invoice.
 * For standalone contracts sent via email, only signer email is required.
 */
export const contracts = isProduction
  ? pgTable("contracts", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: uuid("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      estimateId: uuid("estimate_id").references(() => estimates.id as any, {
        onDelete: "set null",
      }),
      invoiceId: uuid("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      contractNumber: pgText("contract_number").notNull().unique(),
      title: pgText("title").notNull(),
      description: pgText("description"),
      content: pgText("content").notNull(), // Contract body/terms
      status: pgText("status").notNull().default("draft"), // 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired' | 'cancelled'
      contractType: pgText("contract_type").notNull().default("service"), // 'service' | 'maintenance' | 'custom'
      // Signing information
      signerName: pgText("signer_name"),
      signerEmail: pgText("signer_email"),
      signerTitle: pgText("signer_title"),
      signerCompany: pgText("signer_company"),
      signature: pgText("signature"), // Base64 encoded signature image
      signedAt: timestamp("signed_at"),
      ipAddress: pgText("ip_address"), // IP address when signed
      // Validity and terms
      validFrom: timestamp("valid_from"),
      validUntil: timestamp("valid_until"),
      terms: pgText("terms"),
      notes: pgText("notes"),
      // Metadata
      templateId: uuid("template_id"), // Reference to contract template
      metadata: pgJson("metadata"), // Additional contract-specific data
      // Tracking
      sentAt: timestamp("sent_at"),
      viewedAt: timestamp("viewed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("contracts", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: text("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      estimateId: text("estimate_id").references(() => estimates.id as any, {
        onDelete: "set null",
      }),
      invoiceId: text("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      contractNumber: text("contract_number").notNull().unique(),
      title: text("title").notNull(),
      description: text("description"),
      content: text("content").notNull(),
      status: text("status").notNull().default("draft"),
      contractType: text("contract_type").notNull().default("service"),
      // Signing information
      signerName: text("signer_name"),
      signerEmail: text("signer_email"),
      signerTitle: text("signer_title"),
      signerCompany: text("signer_company"),
      signature: text("signature"),
      signedAt: integer("signed_at", { mode: "timestamp" }),
      ipAddress: text("ip_address"),
      // Validity and terms
      validFrom: integer("valid_from", { mode: "timestamp" }),
      validUntil: integer("valid_until", { mode: "timestamp" }),
      terms: text("terms"),
      notes: text("notes"),
      // Metadata
      templateId: text("template_id"),
      metadata: text("metadata"), // JSON string
      // Tracking
      sentAt: integer("sent_at", { mode: "timestamp" }),
      viewedAt: integer("viewed_at", { mode: "timestamp" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Vendors table - Vendor management system
 */
export const vendors = isProduction
  ? pgTable("vendors", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: pgText("name").notNull(),
      displayName: pgText("display_name").notNull(),
      vendorNumber: pgText("vendor_number").notNull(),
      // Contact information
      email: pgText("email"),
      phone: pgText("phone"),
      secondaryPhone: pgText("secondary_phone"),
      website: pgText("website"),
      // Address
      address: pgText("address"),
      address2: pgText("address2"),
      city: pgText("city"),
      state: pgText("state"),
      zipCode: pgText("zip_code"),
      country: pgText("country").default("USA"),
      // Business information
      taxId: pgText("tax_id"),
      paymentTerms: pgText("payment_terms").default("net_30"), // 'net_15' | 'net_30' | 'net_60' | 'due_on_receipt' | 'custom'
      creditLimit: pgInteger("credit_limit").default(0), // In cents
      preferredPaymentMethod: pgText("preferred_payment_method"), // 'check' | 'ach' | 'credit_card' | 'wire'
      // Classification
      category: pgText("category"), // 'supplier' | 'distributor' | 'manufacturer' | 'service_provider' | 'other'
      tags: pgJson("tags"), // Array of tag strings
      status: pgText("status").notNull().default("active"), // 'active' | 'inactive'
      // Metadata
      notes: pgText("notes"),
      internalNotes: pgText("internal_notes"),
      customFields: pgJson("custom_fields"), // JSON object for custom fields
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("vendors", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      displayName: text("display_name").notNull(),
      vendorNumber: text("vendor_number").notNull(),
      email: text("email"),
      phone: text("phone"),
      secondaryPhone: text("secondary_phone"),
      website: text("website"),
      address: text("address"),
      address2: text("address2"),
      city: text("city"),
      state: text("state"),
      zipCode: text("zip_code"),
      country: text("country").default("USA"),
      taxId: text("tax_id"),
      paymentTerms: text("payment_terms").default("net_30"),
      creditLimit: integer("credit_limit").default(0),
      preferredPaymentMethod: text("preferred_payment_method"),
      category: text("category"),
      tags: text("tags"), // JSON string
      status: text("status").notNull().default("active"),
      notes: text("notes"),
      internalNotes: text("internal_notes"),
      customFields: text("custom_fields"), // JSON string
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Purchase Orders table - Material ordering system
 */
export const purchaseOrders = isProduction
  ? pgTable("purchase_orders", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: uuid("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      estimateId: uuid("estimate_id").references(() => estimates.id as any, {
        onDelete: "set null",
      }),
      invoiceId: uuid("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      requestedBy: uuid("requested_by")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      approvedBy: uuid("approved_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      vendorId: uuid("vendor_id").references(() => vendors.id as any, {
        onDelete: "set null",
      }),
      vendor: pgText("vendor").notNull(), // Denormalized for historical records
      vendorEmail: pgText("vendor_email"), // Denormalized for historical records
      vendorPhone: pgText("vendor_phone"), // Denormalized for historical records
      poNumber: pgText("po_number").notNull().unique(),
      title: pgText("title").notNull(),
      description: pgText("description"),
      status: pgText("status").notNull().default("draft"), // 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'partially_received' | 'received' | 'cancelled'
      priority: pgText("priority").notNull().default("normal"), // 'low' | 'normal' | 'high' | 'urgent'
      lineItems: pgJson("line_items").notNull(), // Array of items to purchase
      subtotal: pgInteger("subtotal").notNull().default(0), // In cents
      taxAmount: pgInteger("tax_amount").notNull().default(0), // In cents
      shippingAmount: pgInteger("shipping_amount").notNull().default(0), // In cents
      totalAmount: pgInteger("total_amount").notNull().default(0), // In cents
      expectedDelivery: timestamp("expected_delivery"),
      actualDelivery: timestamp("actual_delivery"),
      deliveryAddress: pgText("delivery_address"),
      notes: pgText("notes"),
      internalNotes: pgText("internal_notes"),
      autoGenerated: pgBoolean("auto_generated").notNull().default(false), // Was this PO auto-generated by the system?
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      approvedAt: timestamp("approved_at"),
      orderedAt: timestamp("ordered_at"),
      receivedAt: timestamp("received_at"),
    })
  : sqliteTable("purchase_orders", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      jobId: text("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      estimateId: text("estimate_id").references(() => estimates.id as any, {
        onDelete: "set null",
      }),
      invoiceId: text("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      requestedBy: text("requested_by")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      approvedBy: text("approved_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      vendorId: text("vendor_id").references(() => vendors.id as any, {
        onDelete: "set null",
      }),
      vendor: text("vendor").notNull(), // Denormalized for historical records
      vendorEmail: text("vendor_email"), // Denormalized for historical records
      vendorPhone: text("vendor_phone"), // Denormalized for historical records
      poNumber: text("po_number").notNull().unique(),
      title: text("title").notNull(),
      description: text("description"),
      status: text("status").notNull().default("draft"),
      priority: text("priority").notNull().default("normal"),
      lineItems: text("line_items").notNull(), // JSON string
      subtotal: integer("subtotal").notNull().default(0),
      taxAmount: integer("tax_amount").notNull().default(0),
      shippingAmount: integer("shipping_amount").notNull().default(0),
      totalAmount: integer("total_amount").notNull().default(0),
      expectedDelivery: integer("expected_delivery", { mode: "timestamp" }),
      actualDelivery: integer("actual_delivery", { mode: "timestamp" }),
      deliveryAddress: text("delivery_address"),
      notes: text("notes"),
      internalNotes: text("internal_notes"),
      autoGenerated: integer("auto_generated", { mode: "boolean" })
        .notNull()
        .default(false),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      approvedAt: integer("approved_at", { mode: "timestamp" }),
      orderedAt: integer("ordered_at", { mode: "timestamp" }),
      receivedAt: integer("received_at", { mode: "timestamp" }),
    });

/**
 * PO Settings table - Purchase order system configuration
 */
export const poSettings = isProduction
  ? pgTable("po_settings", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .unique()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      enabled: pgBoolean("enabled").notNull().default(false),
      requireApproval: pgBoolean("require_approval").notNull().default(true),
      approvalThreshold: pgInteger("approval_threshold").default(50_000), // In cents, null = all POs require approval
      autoGenerateEnabled: pgBoolean("auto_generate_enabled")
        .notNull()
        .default(false),
      autoGenerateThreshold: pgInteger("auto_generate_threshold").default(
        10_000
      ), // In cents
      defaultVendors: pgJson("default_vendors"), // Array of frequently used vendors
      notificationEmails: pgJson("notification_emails"), // Emails to notify on new POs
      approvers: pgJson("approvers"), // User IDs who can approve POs
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("po_settings", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .unique()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
      requireApproval: integer("require_approval", { mode: "boolean" })
        .notNull()
        .default(true),
      approvalThreshold: integer("approval_threshold").default(50_000),
      autoGenerateEnabled: integer("auto_generate_enabled", { mode: "boolean" })
        .notNull()
        .default(false),
      autoGenerateThreshold: integer("auto_generate_threshold").default(10_000),
      defaultVendors: text("default_vendors"), // JSON string
      notificationEmails: text("notification_emails"), // JSON string
      approvers: text("approvers"), // JSON string
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Activity Tracking table - Comprehensive audit log for all entities
 *
 * This table tracks all changes and activities across the system:
 * - Status changes
 * - Field updates
 * - Notes added
 * - Photos/documents uploaded
 * - AI-generated insights
 * - Automation workflow notifications
 * - Assignment changes
 * - Communications sent
 * - And more...
 */
export const activities = isProduction
  ? pgTable("activities", {
      id: uuid("id").primaryKey().defaultRandom(),
      // Entity references (polymorphic - one will be set, others null)
      entityType: pgText("entity_type").notNull(), // 'job' | 'customer' | 'invoice' | 'estimate' | 'property' | 'purchase_order'
      entityId: uuid("entity_id").notNull(), // The ID of the entity being tracked
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Activity metadata
      activityType: pgText("activity_type").notNull(), // 'status_change' | 'field_update' | 'note_added' | 'photo_added' | 'document_added' | 'ai_insight' | 'automation' | 'assignment_change' | 'communication' | 'created' | 'deleted'
      action: pgText("action").notNull(), // Human-readable action (e.g., "changed status from Scheduled to In Progress")
      category: pgText("category").notNull(), // 'system' | 'user' | 'ai' | 'automation'
      // Actor (who performed the action)
      actorId: uuid("actor_id").references(() => users.id as any, {
        onDelete: "set null",
      }), // null for system/AI actions
      actorType: pgText("actor_type").notNull().default("user"), // 'user' | 'system' | 'ai' | 'automation'
      actorName: pgText("actor_name"), // Display name for the actor
      // Change details
      fieldName: pgText("field_name"), // Field that was changed (if applicable)
      oldValue: pgText("old_value"), // Previous value (stringified)
      newValue: pgText("new_value"), // New value (stringified)
      // Additional context
      description: pgText("description"), // Detailed description of the activity
      metadata: pgJson("metadata"), // Flexible JSON for storing additional context
      // References to related entities
      relatedEntityType: pgText("related_entity_type"), // Related entity (e.g., 'user' for assignment changes)
      relatedEntityId: uuid("related_entity_id"), // Related entity ID
      // File attachments
      attachmentType: pgText("attachment_type"), // 'photo' | 'document' | 'video' | null
      attachmentUrl: pgText("attachment_url"), // URL to the attachment
      attachmentName: pgText("attachment_name"), // Filename
      // AI/Automation specific
      aiModel: pgText("ai_model"), // AI model used (e.g., 'gpt-4')
      automationWorkflowId: uuid("automation_workflow_id"), // Reference to automation workflow
      automationWorkflowName: pgText("automation_workflow_name"),
      // Visibility and importance
      isImportant: pgBoolean("is_important").notNull().default(false), // Highlight important activities
      isSystemGenerated: pgBoolean("is_system_generated")
        .notNull()
        .default(false),
      isVisible: pgBoolean("is_visible").notNull().default(true), // Hide/show in timeline
      // Timestamps
      occurredAt: timestamp("occurred_at").notNull().defaultNow(), // When the activity occurred
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("activities", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      // Entity references
      entityType: text("entity_type").notNull(),
      entityId: text("entity_id").notNull(),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Activity metadata
      activityType: text("activity_type").notNull(),
      action: text("action").notNull(),
      category: text("category").notNull(),
      // Actor
      actorId: text("actor_id").references(() => users.id as any, {
        onDelete: "set null",
      }),
      actorType: text("actor_type").notNull().default("user"),
      actorName: text("actor_name"),
      // Change details
      fieldName: text("field_name"),
      oldValue: text("old_value"),
      newValue: text("new_value"),
      // Additional context
      description: text("description"),
      metadata: text("metadata"), // JSON string
      // References to related entities
      relatedEntityType: text("related_entity_type"),
      relatedEntityId: text("related_entity_id"),
      // File attachments
      attachmentType: text("attachment_type"),
      attachmentUrl: text("attachment_url"),
      attachmentName: text("attachment_name"),
      // AI/Automation specific
      aiModel: text("ai_model"),
      automationWorkflowId: text("automation_workflow_id"),
      automationWorkflowName: text("automation_workflow_name"),
      // Visibility and importance
      isImportant: integer("is_important", { mode: "boolean" })
        .notNull()
        .default(false),
      isSystemGenerated: integer("is_system_generated", { mode: "boolean" })
        .notNull()
        .default(false),
      isVisible: integer("is_visible", { mode: "boolean" })
        .notNull()
        .default(true),
      // Timestamps
      occurredAt: integer("occurred_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Price Book Categories table - Infinite nested categories using Materialized Path pattern
 *
 * Materialized Path Pattern Benefits:
 * - Easy to query all descendants: WHERE path LIKE '1.3.%'
 * - Fast breadcrumb navigation
 * - Simple to understand and implement
 * - Good performance for most use cases
 *
 * Example structure:
 * HVAC (path: "1", level: 0)
 *   └─ Heating (path: "1.1", level: 1)
 *      └─ Furnaces (path: "1.1.1", level: 2)
 *         └─ Gas Furnaces (path: "1.1.1.1", level: 3)
 */
export const priceBookCategories = isProduction
  ? pgTable("price_book_categories", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Core fields
      name: pgText("name").notNull(),
      slug: pgText("slug").notNull(), // URL-friendly name
      description: pgText("description"),
      // Hierarchy fields (Materialized Path pattern)
      parentId: uuid("parent_id").references(
        (): any => priceBookCategories.id,
        {
          onDelete: "cascade",
        }
      ), // null = root level
      path: pgText("path").notNull(), // e.g., "1.3.5" - dot-separated IDs from root to this node
      level: pgInteger("level").notNull().default(0), // 0 = root, 1 = first level, etc.
      // Ordering
      sortOrder: pgInteger("sort_order").notNull().default(0), // For custom ordering within same level
      // UI/Display
      icon: pgText("icon"), // Lucide icon name
      color: pgText("color"), // Hex color for badge/visualization
      // Counts (denormalized for performance)
      itemCount: pgInteger("item_count").notNull().default(0), // Direct items in this category
      descendantItemCount: pgInteger("descendant_item_count")
        .notNull()
        .default(0), // Items in this + all descendants
      // Status
      isActive: pgBoolean("is_active").notNull().default(true),
      // Metadata
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("price_book_categories", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      slug: text("slug").notNull(),
      description: text("description"),
      parentId: text("parent_id").references(
        (): any => priceBookCategories.id,
        {
          onDelete: "cascade",
        }
      ),
      path: text("path").notNull(),
      level: integer("level").notNull().default(0),
      sortOrder: integer("sort_order").notNull().default(0),
      icon: text("icon"),
      color: text("color"),
      itemCount: integer("item_count").notNull().default(0),
      descendantItemCount: integer("descendant_item_count")
        .notNull()
        .default(0),
      isActive: integer("is_active", { mode: "boolean" })
        .notNull()
        .default(true),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Price Book Items table - Services, materials, and packages
 */
export const priceBookItems = isProduction
  ? pgTable("price_book_items", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Category relationship (NEW - replaces text category/subcategory)
      categoryId: uuid("category_id")
        .notNull()
        .references(() => priceBookCategories.id as any, {
          onDelete: "restrict",
        }), // Can't delete category with items
      // Core fields
      itemType: pgText("item_type").notNull(), // 'service' | 'material' | 'package'
      name: pgText("name").notNull(),
      description: pgText("description"),
      sku: pgText("sku"), // Stock keeping unit / item code
      // Legacy fields (DEPRECATED - use categoryId instead)
      category: pgText("category"), // Keep for migration
      subcategory: pgText("subcategory"), // Keep for migration
      // Pricing
      cost: pgInteger("cost").default(0), // In cents - what you pay
      price: pgInteger("price").notNull().default(0), // In cents - what customer pays
      markupPercent: pgInteger("markup_percent").default(0), // Markup percentage
      // Unit and quantity
      unit: pgText("unit").notNull().default("each"), // 'each' | 'hour' | 'linear_ft' | 'sq_ft' | etc
      minimumQuantity: pgInteger("minimum_quantity").default(1),
      // Status and visibility
      isActive: pgBoolean("is_active").notNull().default(true),
      isTaxable: pgBoolean("is_taxable").notNull().default(true),
      // Supplier information
      supplierId: uuid("supplier_id").references(
        () => supplierIntegrations.id as any,
        { onDelete: "set null" }
      ),
      supplierSku: pgText("supplier_sku"), // Supplier's SKU/item number
      supplierLastSyncAt: timestamp("supplier_last_sync_at"),
      // Media and documentation
      imageUrl: pgText("image_url"),
      images: pgJson("images"), // Array of additional images
      documents: pgJson("documents"), // Array of document URLs
      // Tags and search
      tags: pgJson("tags"), // Array of tag strings for filtering
      // Metadata
      metadata: pgJson("metadata"), // Flexible additional data
      notes: pgText("notes"), // Internal notes
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("price_book_items", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Category relationship
      categoryId: text("category_id")
        .notNull()
        .references(() => priceBookCategories.id as any, {
          onDelete: "restrict",
        }),
      itemType: text("item_type").notNull(),
      name: text("name").notNull(),
      description: text("description"),
      sku: text("sku"),
      // Legacy fields (DEPRECATED)
      category: text("category"),
      subcategory: text("subcategory"),
      cost: integer("cost").default(0),
      price: integer("price").notNull().default(0),
      markupPercent: integer("markup_percent").default(0),
      unit: text("unit").notNull().default("each"),
      minimumQuantity: integer("minimum_quantity").default(1),
      isActive: integer("is_active", { mode: "boolean" })
        .notNull()
        .default(true),
      isTaxable: integer("is_taxable", { mode: "boolean" })
        .notNull()
        .default(true),
      supplierId: text("supplier_id").references(
        () => supplierIntegrations.id as any,
        { onDelete: "set null" }
      ),
      supplierSku: text("supplier_sku"),
      supplierLastSyncAt: integer("supplier_last_sync_at", {
        mode: "timestamp",
      }),
      imageUrl: text("image_url"),
      images: text("images"), // JSON string
      documents: text("documents"), // JSON string
      tags: text("tags"), // JSON string
      metadata: text("metadata"), // JSON string
      notes: text("notes"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Price History table - Track price changes over time
 */
export const priceHistory = isProduction
  ? pgTable("price_history", {
      id: uuid("id").primaryKey().defaultRandom(),
      itemId: uuid("item_id")
        .notNull()
        .references(() => priceBookItems.id as any, { onDelete: "cascade" }),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Price change details
      oldCost: pgInteger("old_cost"), // In cents
      newCost: pgInteger("new_cost"), // In cents
      oldPrice: pgInteger("old_price"), // In cents
      newPrice: pgInteger("new_price"), // In cents
      oldMarkupPercent: pgInteger("old_markup_percent"),
      newMarkupPercent: pgInteger("new_markup_percent"),
      // Change metadata
      changeType: pgText("change_type").notNull(), // 'manual' | 'bulk_update' | 'supplier_sync' | 'auto_markup'
      changeReason: pgText("change_reason"), // Optional reason for the change
      changedBy: uuid("changed_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      effectiveDate: timestamp("effective_date").notNull().defaultNow(), // When change took effect
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("price_history", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      itemId: text("item_id")
        .notNull()
        .references(() => priceBookItems.id as any, { onDelete: "cascade" }),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      oldCost: integer("old_cost"),
      newCost: integer("new_cost"),
      oldPrice: integer("old_price"),
      newPrice: integer("new_price"),
      oldMarkupPercent: integer("old_markup_percent"),
      newMarkupPercent: integer("new_markup_percent"),
      changeType: text("change_type").notNull(),
      changeReason: text("change_reason"),
      changedBy: text("changed_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      effectiveDate: integer("effective_date", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Service Packages table - Bundled items with materials and custom items
 */
export const servicePackages = isProduction
  ? pgTable("service_packages", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      priceBookItemId: uuid("price_book_item_id")
        .notNull()
        .references(() => priceBookItems.id as any, { onDelete: "cascade" }),
      name: pgText("name").notNull(),
      description: pgText("description"),
      // Package configuration
      packageType: pgText("package_type").notNull().default("flat_rate"), // 'flat_rate' | 'time_materials'
      // Included items
      includedItems: pgJson("included_items").notNull(), // Array of { itemId, quantity, notes }
      laborHours: pgInteger("labor_hours").default(0), // Estimated labor hours (in minutes)
      // Pricing
      totalCost: pgInteger("total_cost").default(0), // In cents - calculated from materials + labor
      packagePrice: pgInteger("package_price").notNull().default(0), // In cents - what customer pays
      // Metadata
      notes: pgText("notes"),
      isActive: pgBoolean("is_active").notNull().default(true),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("service_packages", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      priceBookItemId: text("price_book_item_id")
        .notNull()
        .references(() => priceBookItems.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      description: text("description"),
      packageType: text("package_type").notNull().default("flat_rate"),
      includedItems: text("included_items").notNull(), // JSON string
      laborHours: integer("labor_hours").default(0),
      totalCost: integer("total_cost").default(0),
      packagePrice: integer("package_price").notNull().default(0),
      notes: text("notes"),
      isActive: integer("is_active", { mode: "boolean" })
        .notNull()
        .default(true),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Pricing Rules table - Dynamic pricing logic based on conditions
 */
export const pricingRules = isProduction
  ? pgTable("pricing_rules", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: pgText("name").notNull(),
      description: pgText("description"),
      // Rule configuration
      ruleType: pgText("rule_type").notNull(), // 'markup' | 'discount' | 'minimum_charge' | 'tiered_pricing'
      priority: pgInteger("priority").notNull().default(0), // Higher priority rules apply first
      // Conditions
      appliesTo: pgText("applies_to").notNull(), // 'all' | 'category' | 'item' | 'customer_type'
      categoryFilter: pgJson("category_filter"), // Array of category names
      itemFilter: pgJson("item_filter"), // Array of item IDs
      // Pricing adjustment
      adjustmentType: pgText("adjustment_type").notNull(), // 'percentage' | 'fixed_amount'
      adjustmentValue: pgInteger("adjustment_value").notNull(), // Percentage or amount in cents
      // Time-based rules
      validFrom: timestamp("valid_from"),
      validUntil: timestamp("valid_until"),
      daysOfWeek: pgJson("days_of_week"), // Array of day numbers (0-6)
      timeRanges: pgJson("time_ranges"), // Array of { start, end } time ranges
      // Status
      isActive: pgBoolean("is_active").notNull().default(true),
      metadata: pgJson("metadata"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("pricing_rules", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      description: text("description"),
      ruleType: text("rule_type").notNull(),
      priority: integer("priority").notNull().default(0),
      appliesTo: text("applies_to").notNull(),
      categoryFilter: text("category_filter"), // JSON string
      itemFilter: text("item_filter"), // JSON string
      adjustmentType: text("adjustment_type").notNull(),
      adjustmentValue: integer("adjustment_value").notNull(),
      validFrom: integer("valid_from", { mode: "timestamp" }),
      validUntil: integer("valid_until", { mode: "timestamp" }),
      daysOfWeek: text("days_of_week"), // JSON string
      timeRanges: text("time_ranges"), // JSON string
      isActive: integer("is_active", { mode: "boolean" })
        .notNull()
        .default(true),
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
 * Labor Rates table - Flexible labor rate configuration
 */
export const laborRates = isProduction
  ? pgTable("labor_rates", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: pgText("name").notNull(), // E.g., "Standard Rate", "Emergency Rate", "Apprentice Rate"
      description: pgText("description"),
      // Rate configuration
      rateType: pgText("rate_type").notNull(), // 'hourly' | 'flat_rate' | 'minimum_charge'
      rate: pgInteger("rate").notNull(), // In cents per hour or flat rate
      minimumCharge: pgInteger("minimum_charge").default(0), // In cents
      minimumHours: pgInteger("minimum_hours").default(0), // Minimum billable hours (in minutes)
      // Modifiers
      overtimeMultiplier: pgInteger("overtime_multiplier").default(150), // 150 = 1.5x
      weekendMultiplier: pgInteger("weekend_multiplier").default(150), // 150 = 1.5x
      holidayMultiplier: pgInteger("holiday_multiplier").default(200), // 200 = 2x
      emergencyMultiplier: pgInteger("emergency_multiplier").default(200), // 200 = 2x
      // Applicability
      appliesTo: pgText("applies_to").notNull().default("all"), // 'all' | 'specific_services' | 'specific_techs'
      serviceCategories: pgJson("service_categories"), // Array of category names
      technicianIds: pgJson("technician_ids"), // Array of user IDs
      // Time-based applicability
      validFrom: timestamp("valid_from"),
      validUntil: timestamp("valid_until"),
      // Status
      isDefault: pgBoolean("is_default").notNull().default(false), // Is this the default labor rate?
      isActive: pgBoolean("is_active").notNull().default(true),
      metadata: pgJson("metadata"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("labor_rates", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      description: text("description"),
      rateType: text("rate_type").notNull(),
      rate: integer("rate").notNull(),
      minimumCharge: integer("minimum_charge").default(0),
      minimumHours: integer("minimum_hours").default(0),
      overtimeMultiplier: integer("overtime_multiplier").default(150),
      weekendMultiplier: integer("weekend_multiplier").default(150),
      holidayMultiplier: integer("holiday_multiplier").default(200),
      emergencyMultiplier: integer("emergency_multiplier").default(200),
      appliesTo: text("applies_to").notNull().default("all"),
      serviceCategories: text("service_categories"), // JSON string
      technicianIds: text("technician_ids"), // JSON string
      validFrom: integer("valid_from", { mode: "timestamp" }),
      validUntil: integer("valid_until", { mode: "timestamp" }),
      isDefault: integer("is_default", { mode: "boolean" })
        .notNull()
        .default(false),
      isActive: integer("is_active", { mode: "boolean" })
        .notNull()
        .default(true),
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
 * Supplier Integrations table - API connection tracking for material suppliers
 */
export const supplierIntegrations = isProduction
  ? pgTable("supplier_integrations", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Supplier identification
      supplierName: pgText("supplier_name").notNull(), // 'ferguson' | 'fastenal' | 'grainger' | etc
      displayName: pgText("display_name").notNull(), // "Ferguson Enterprises"
      // API configuration
      apiEnabled: pgBoolean("api_enabled").notNull().default(false),
      apiKey: pgText("api_key"), // Encrypted API key
      apiSecret: pgText("api_secret"), // Encrypted API secret
      apiEndpoint: pgText("api_endpoint"), // Custom API endpoint if needed
      accountNumber: pgText("account_number"), // Supplier account number
      // Sync configuration
      syncEnabled: pgBoolean("sync_enabled").notNull().default(false),
      syncFrequency: pgText("sync_frequency").default("daily"), // 'hourly' | 'daily' | 'weekly' | 'manual'
      lastSyncAt: timestamp("last_sync_at"),
      lastSyncStatus: pgText("last_sync_status"), // 'success' | 'error' | 'in_progress'
      lastSyncError: pgText("last_sync_error"),
      nextSyncAt: timestamp("next_sync_at"),
      // Sync statistics
      totalItemsImported: pgInteger("total_items_imported").default(0),
      totalItemsUpdated: pgInteger("total_items_updated").default(0),
      totalItemsFailed: pgInteger("total_items_failed").default(0),
      // Webhook configuration
      webhookEnabled: pgBoolean("webhook_enabled").notNull().default(false),
      webhookUrl: pgText("webhook_url"),
      webhookSecret: pgText("webhook_secret"),
      // Import preferences
      autoImportNewItems: pgBoolean("auto_import_new_items").default(false),
      autoUpdatePrices: pgBoolean("auto_update_prices").default(false),
      defaultMarkupPercent: pgInteger("default_markup_percent").default(0),
      categoryMappings: pgJson("category_mappings"), // Map supplier categories to internal categories
      // Status and metadata
      status: pgText("status").notNull().default("disconnected"), // 'connected' | 'disconnected' | 'error' | 'syncing'
      metadata: pgJson("metadata"),
      notes: pgText("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("supplier_integrations", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      supplierName: text("supplier_name").notNull(),
      displayName: text("display_name").notNull(),
      apiEnabled: integer("api_enabled", { mode: "boolean" })
        .notNull()
        .default(false),
      apiKey: text("api_key"),
      apiSecret: text("api_secret"),
      apiEndpoint: text("api_endpoint"),
      accountNumber: text("account_number"),
      syncEnabled: integer("sync_enabled", { mode: "boolean" })
        .notNull()
        .default(false),
      syncFrequency: text("sync_frequency").default("daily"),
      lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
      lastSyncStatus: text("last_sync_status"),
      lastSyncError: text("last_sync_error"),
      nextSyncAt: integer("next_sync_at", { mode: "timestamp" }),
      totalItemsImported: integer("total_items_imported").default(0),
      totalItemsUpdated: integer("total_items_updated").default(0),
      totalItemsFailed: integer("total_items_failed").default(0),
      webhookEnabled: integer("webhook_enabled", { mode: "boolean" })
        .notNull()
        .default(false),
      webhookUrl: text("webhook_url"),
      webhookSecret: text("webhook_secret"),
      autoImportNewItems: integer("auto_import_new_items", {
        mode: "boolean",
      }).default(false),
      autoUpdatePrices: integer("auto_update_prices", {
        mode: "boolean",
      }).default(false),
      defaultMarkupPercent: integer("default_markup_percent").default(0),
      categoryMappings: text("category_mappings"), // JSON string
      status: text("status").notNull().default("disconnected"),
      metadata: text("metadata"), // JSON string
      notes: text("notes"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Email Logs table - Track all emails sent via Resend
 *
 * Features:
 * - Logs all sent emails for audit trail
 * - Tracks email status (sent, failed, delivered, opened, clicked)
 * - Stores email metadata and template information
 * - Supports retry logic for failed sends
 */
export const emailLogs = isProduction
  ? pgTable("email_logs", {
      id: uuid("id").primaryKey().defaultRandom(),
      // Email details
      to: pgText("to").notNull(), // Recipient email address
      from: pgText("from").notNull(), // Sender email address
      subject: pgText("subject").notNull(),
      templateType: pgText("template_type").notNull(), // e.g., 'welcome', 'password-reset', 'invoice-sent'
      // Resend integration
      resendId: pgText("resend_id"), // Resend email ID for tracking
      status: pgText("status").notNull().default("pending"), // 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'opened' | 'clicked'
      error: pgText("error"), // Error message if failed
      // Template data
      templateData: pgJson("template_data"), // Props passed to template
      tags: pgJson("tags"), // Tags for categorization
      // Tracking
      sentAt: timestamp("sent_at"),
      deliveredAt: timestamp("delivered_at"),
      openedAt: timestamp("opened_at"),
      clickedAt: timestamp("clicked_at"),
      bouncedAt: timestamp("bounced_at"),
      // Retry logic
      retryCount: pgInteger("retry_count").default(0),
      maxRetries: pgInteger("max_retries").default(3),
      nextRetryAt: timestamp("next_retry_at"),
      // Relations
      userId: uuid("user_id"), // Optional: user who triggered the email
      customerId: uuid("customer_id"), // Optional: customer recipient
      jobId: uuid("job_id"), // Optional: related job
      invoiceId: uuid("invoice_id"), // Optional: related invoice
      // Metadata
      metadata: pgJson("metadata"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("email_logs", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      to: text("to").notNull(),
      from: text("from").notNull(),
      subject: text("subject").notNull(),
      templateType: text("template_type").notNull(),
      resendId: text("resend_id"),
      status: text("status").notNull().default("pending"),
      error: text("error"),
      templateData: text("template_data"), // JSON string
      tags: text("tags"), // JSON string
      sentAt: integer("sent_at", { mode: "timestamp" }),
      deliveredAt: integer("delivered_at", { mode: "timestamp" }),
      openedAt: integer("opened_at", { mode: "timestamp" }),
      clickedAt: integer("clicked_at", { mode: "timestamp" }),
      bouncedAt: integer("bounced_at", { mode: "timestamp" }),
      retryCount: integer("retry_count").default(0),
      maxRetries: integer("max_retries").default(3),
      nextRetryAt: integer("next_retry_at", { mode: "timestamp" }),
      userId: text("user_id"),
      customerId: text("customer_id"),
      jobId: text("job_id"),
      invoiceId: text("invoice_id"),
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
 * Verification Tokens table - Custom email verification tokens
 *
 * Features:
 * - Store verification tokens for email confirmation
 * - Secure token generation with expiration
 * - One-time use tokens that expire after 24 hours
 * - Replaces Supabase's built-in email verification
 */
export const verificationTokens = isProduction
  ? pgTable("verification_tokens", {
      id: uuid("id").primaryKey().defaultRandom(),
      // Token details
      token: pgText("token").notNull().unique(), // Secure random token
      email: pgText("email").notNull(),
      type: pgText("type").notNull().default("email_verification"), // 'email_verification' | 'password_reset' | 'magic_link'
      // User relation
      userId: uuid("user_id"), // Optional: user ID if already created
      // Token status
      used: pgBoolean("used").notNull().default(false),
      usedAt: timestamp("used_at"),
      // Expiration
      expiresAt: timestamp("expires_at").notNull(),
      // Metadata
      metadata: pgJson("metadata"), // Additional data (name, redirect URL, etc.)
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("verification_tokens", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      token: text("token").notNull().unique(),
      email: text("email").notNull(),
      type: text("type").notNull().default("email_verification"),
      userId: text("user_id"),
      used: integer("used", { mode: "boolean" }).notNull().default(false),
      usedAt: integer("used_at", { mode: "timestamp" }),
      expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
      metadata: text("metadata"), // JSON string
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Communications table - Multi-channel communication history (email, SMS, phone, chat)
 *
 * Tracks all customer communications across channels with threading support
 */
export const communications = isProduction
  ? pgTable("communications", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Customer and job relationships
      customerId: uuid("customer_id").references(() => customers.id as any, {
        onDelete: "cascade",
      }),
      jobId: uuid("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      estimateId: uuid("estimate_id").references(() => estimates.id as any, {
        onDelete: "set null",
      }),
      invoiceId: uuid("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      // Communication metadata
      type: pgText("type").notNull(), // 'email' | 'sms' | 'phone' | 'chat' | 'note'
      direction: pgText("direction").notNull(), // 'inbound' | 'outbound'
      channel: pgText("channel"), // Specific channel: 'twilio' | 'sendgrid' | 'gmail' | 'internal'
      // From/To information
      fromAddress: pgText("from_address"), // Email address or phone number
      fromName: pgText("from_name"),
      toAddress: pgText("to_address").notNull(), // Email address or phone number
      toName: pgText("to_name"),
      ccAddresses: pgJson("cc_addresses"), // Array of CC email addresses
      bccAddresses: pgJson("bcc_addresses"), // Array of BCC email addresses
      // Message content
      subject: pgText("subject"), // For emails
      body: pgText("body").notNull(), // Message body (plain text or HTML)
      bodyHtml: pgText("body_html"), // HTML version of email
      bodyPlain: pgText("body_plain"), // Plain text version
      // Attachments
      attachments: pgJson("attachments"), // Array of attachment URLs and metadata
      attachmentCount: pgInteger("attachment_count").default(0),
      // Threading
      threadId: uuid("thread_id"), // Group related messages
      parentId: uuid("parent_id").references((): any => communications.id, {
        onDelete: "set null",
      }), // Reply chain
      isThreadStarter: pgBoolean("is_thread_starter").notNull().default(true),
      // Status tracking
      status: pgText("status").notNull().default("draft"), // 'draft' | 'queued' | 'sending' | 'sent' | 'delivered' | 'failed' | 'read'
      failureReason: pgText("failure_reason"), // If status is 'failed'
      retryCount: pgInteger("retry_count").default(0),
      // Read tracking
      readAt: timestamp("read_at"),
      openedAt: timestamp("opened_at"), // For emails - when first opened
      clickedAt: timestamp("clicked_at"), // For emails - when link clicked
      openCount: pgInteger("open_count").default(0),
      clickCount: pgInteger("click_count").default(0),
      // Phone call specific
      callDuration: pgInteger("call_duration"), // In seconds
      callRecordingUrl: pgText("call_recording_url"),
      callTranscript: pgText("call_transcript"), // AI-generated transcript
      callSentiment: pgText("call_sentiment"), // 'positive' | 'neutral' | 'negative' | AI analysis
      // Team member tracking
      sentBy: uuid("sent_by").references(() => users.id as any, {
        onDelete: "set null",
      }), // Team member who sent
      assignedTo: uuid("assigned_to").references(() => users.id as any, {
        onDelete: "set null",
      }), // Team member assigned to respond
      // Provider information
      providerMessageId: pgText("provider_message_id"), // External provider ID (Twilio SID, SendGrid ID, etc.)
      providerStatus: pgText("provider_status"), // Status from provider
      providerMetadata: pgJson("provider_metadata"), // Additional provider data
      // Cost tracking
      cost: pgInteger("cost").default(0), // In cents - cost of sending (for SMS/phone)
      // Automation and templates
      templateId: uuid("template_id"), // If sent from template
      automationWorkflowId: uuid("automation_workflow_id"), // If sent by automation
      isAutomated: pgBoolean("is_automated").notNull().default(false),
      // Categorization
      category: pgText("category"), // 'support' | 'sales' | 'billing' | 'general'
      priority: pgText("priority").notNull().default("normal"), // 'low' | 'normal' | 'high' | 'urgent'
      tags: pgJson("tags"), // Array of tags for filtering
      // Visibility
      isInternal: pgBoolean("is_internal").notNull().default(false), // Internal note vs external message
      isArchived: pgBoolean("is_archived").notNull().default(false),
      // Timestamps
      sentAt: timestamp("sent_at"),
      deliveredAt: timestamp("delivered_at"),
      scheduledFor: timestamp("scheduled_for"), // For scheduled sends
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("communications", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: text("customer_id").references(() => customers.id as any, {
        onDelete: "cascade",
      }),
      jobId: text("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      estimateId: text("estimate_id").references(() => estimates.id as any, {
        onDelete: "set null",
      }),
      invoiceId: text("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      type: text("type").notNull(),
      direction: text("direction").notNull(),
      channel: text("channel"),
      fromAddress: text("from_address"),
      fromName: text("from_name"),
      toAddress: text("to_address").notNull(),
      toName: text("to_name"),
      ccAddresses: text("cc_addresses"), // JSON string
      bccAddresses: text("bcc_addresses"), // JSON string
      subject: text("subject"),
      body: text("body").notNull(),
      bodyHtml: text("body_html"),
      bodyPlain: text("body_plain"),
      attachments: text("attachments"), // JSON string
      attachmentCount: integer("attachment_count").default(0),
      threadId: text("thread_id"),
      parentId: text("parent_id").references((): any => communications.id, {
        onDelete: "set null",
      }),
      isThreadStarter: integer("is_thread_starter", { mode: "boolean" })
        .notNull()
        .default(true),
      status: text("status").notNull().default("draft"),
      failureReason: text("failure_reason"),
      retryCount: integer("retry_count").default(0),
      readAt: integer("read_at", { mode: "timestamp" }),
      openedAt: integer("opened_at", { mode: "timestamp" }),
      clickedAt: integer("clicked_at", { mode: "timestamp" }),
      openCount: integer("open_count").default(0),
      clickCount: integer("click_count").default(0),
      callDuration: integer("call_duration"),
      callRecordingUrl: text("call_recording_url"),
      callTranscript: text("call_transcript"),
      callSentiment: text("call_sentiment"),
      sentBy: text("sent_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      assignedTo: text("assigned_to").references(() => users.id as any, {
        onDelete: "set null",
      }),
      providerMessageId: text("provider_message_id"),
      providerStatus: text("provider_status"),
      providerMetadata: text("provider_metadata"), // JSON string
      cost: integer("cost").default(0),
      templateId: text("template_id"),
      automationWorkflowId: text("automation_workflow_id"),
      isAutomated: integer("is_automated", { mode: "boolean" })
        .notNull()
        .default(false),
      category: text("category"),
      priority: text("priority").notNull().default("normal"),
      tags: text("tags"), // JSON string
      isInternal: integer("is_internal", { mode: "boolean" })
        .notNull()
        .default(false),
      isArchived: integer("is_archived", { mode: "boolean" })
        .notNull()
        .default(false),
      sentAt: integer("sent_at", { mode: "timestamp" }),
      deliveredAt: integer("delivered_at", { mode: "timestamp" }),
      scheduledFor: integer("scheduled_for", { mode: "timestamp" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Payments table - Payment transaction tracking with full history
 *
 * Tracks all payment transactions including partial payments, refunds, and payment methods
 */
export const payments = isProduction
  ? pgTable("payments", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Related entities
      customerId: uuid("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      invoiceId: uuid("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      jobId: uuid("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      // Payment identification
      paymentNumber: pgText("payment_number").notNull().unique(), // Auto-generated: PAY-001, PAY-002, etc.
      referenceNumber: pgText("reference_number"), // External reference (check number, confirmation code)
      // Payment details
      amount: pgInteger("amount").notNull(), // In cents - amount of this payment
      paymentMethod: pgText("payment_method").notNull(), // 'cash' | 'check' | 'credit_card' | 'debit_card' | 'ach' | 'wire' | 'venmo' | 'paypal' | 'other'
      paymentType: pgText("payment_type").notNull().default("payment"), // 'payment' | 'refund' | 'credit'
      // Payment method details
      cardBrand: pgText("card_brand"), // 'visa' | 'mastercard' | 'amex' | 'discover'
      cardLast4: pgText("card_last4"), // Last 4 digits of card
      cardExpMonth: pgInteger("card_exp_month"),
      cardExpYear: pgInteger("card_exp_year"),
      checkNumber: pgText("check_number"),
      bankName: pgText("bank_name"),
      // Processing information
      status: pgText("status").notNull().default("pending"), // 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled'
      failureCode: pgText("failure_code"),
      failureMessage: pgText("failure_message"),
      // Payment processor information
      processorName: pgText("processor_name"), // 'stripe' | 'square' | 'authorize_net' | 'paypal' | 'manual'
      processorTransactionId: pgText("processor_transaction_id"), // External processor transaction ID
      processorFee: pgInteger("processor_fee").default(0), // In cents - processor fee
      netAmount: pgInteger("net_amount").default(0), // In cents - amount after fees
      processorMetadata: pgJson("processor_metadata"), // Additional processor data
      // Refund tracking
      refundedAmount: pgInteger("refunded_amount").default(0), // In cents
      refundReason: pgText("refund_reason"),
      refundedAt: timestamp("refunded_at"),
      originalPaymentId: uuid("original_payment_id").references(
        (): any => payments.id,
        {
          onDelete: "set null",
        }
      ), // If this is a refund, link to original payment
      // Receipt and documentation
      receiptUrl: pgText("receipt_url"), // URL to receipt/confirmation
      receiptNumber: pgText("receipt_number"),
      receiptEmailed: pgBoolean("receipt_emailed").notNull().default(false),
      receiptEmailedAt: timestamp("receipt_emailed_at"),
      // Team member tracking
      processedBy: uuid("processed_by").references(() => users.id as any, {
        onDelete: "set null",
      }), // Team member who processed payment
      approvedBy: uuid("approved_by").references(() => users.id as any, {
        onDelete: "set null",
      }), // For refunds - who approved
      // Notes and metadata
      notes: pgText("notes"), // Internal notes
      customerNotes: pgText("customer_notes"), // Notes visible to customer
      metadata: pgJson("metadata"), // Additional payment data
      // Reconciliation
      isReconciled: pgBoolean("is_reconciled").notNull().default(false),
      reconciledAt: timestamp("reconciled_at"),
      reconciledBy: uuid("reconciled_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      bankDepositDate: timestamp("bank_deposit_date"),
      // Timestamps
      processedAt: timestamp("processed_at"),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("payments", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: text("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      invoiceId: text("invoice_id").references(() => invoices.id as any, {
        onDelete: "set null",
      }),
      jobId: text("job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      paymentNumber: text("payment_number").notNull().unique(),
      referenceNumber: text("reference_number"),
      amount: integer("amount").notNull(),
      paymentMethod: text("payment_method").notNull(),
      paymentType: text("payment_type").notNull().default("payment"),
      cardBrand: text("card_brand"),
      cardLast4: text("card_last4"),
      cardExpMonth: integer("card_exp_month"),
      cardExpYear: integer("card_exp_year"),
      checkNumber: text("check_number"),
      bankName: text("bank_name"),
      status: text("status").notNull().default("pending"),
      failureCode: text("failure_code"),
      failureMessage: text("failure_message"),
      processorName: text("processor_name"),
      processorTransactionId: text("processor_transaction_id"),
      processorFee: integer("processor_fee").default(0),
      netAmount: integer("net_amount").default(0),
      processorMetadata: text("processor_metadata"), // JSON string
      refundedAmount: integer("refunded_amount").default(0),
      refundReason: text("refund_reason"),
      refundedAt: integer("refunded_at", { mode: "timestamp" }),
      originalPaymentId: text("original_payment_id").references(
        (): any => payments.id,
        {
          onDelete: "set null",
        }
      ),
      receiptUrl: text("receipt_url"),
      receiptNumber: text("receipt_number"),
      receiptEmailed: integer("receipt_emailed", { mode: "boolean" })
        .notNull()
        .default(false),
      receiptEmailedAt: integer("receipt_emailed_at", { mode: "timestamp" }),
      processedBy: text("processed_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      approvedBy: text("approved_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      notes: text("notes"),
      customerNotes: text("customer_notes"),
      metadata: text("metadata"), // JSON string
      isReconciled: integer("is_reconciled", { mode: "boolean" })
        .notNull()
        .default(false),
      reconciledAt: integer("reconciled_at", { mode: "timestamp" }),
      reconciledBy: text("reconciled_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      bankDepositDate: integer("bank_deposit_date", { mode: "timestamp" }),
      processedAt: integer("processed_at", { mode: "timestamp" }),
      completedAt: integer("completed_at", { mode: "timestamp" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Equipment table - Asset tracking per property with maintenance schedules
 *
 * Tracks all equipment/assets at customer properties including warranty and maintenance
 */
export const equipment = isProduction
  ? pgTable("equipment", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: uuid("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      propertyId: uuid("property_id")
        .notNull()
        .references(() => properties.id as any, { onDelete: "cascade" }),
      // Equipment identification
      equipmentNumber: pgText("equipment_number").notNull().unique(), // Auto-generated: EQ-001, EQ-002, etc.
      name: pgText("name").notNull(),
      type: pgText("type").notNull(), // 'hvac' | 'plumbing' | 'electrical' | 'appliance' | 'water_heater' | 'furnace' | 'ac_unit' | 'other'
      category: pgText("category"), // More specific: 'central_ac' | 'window_unit' | 'tankless_water_heater', etc.
      // Manufacturer information
      manufacturer: pgText("manufacturer"),
      model: pgText("model"),
      serialNumber: pgText("serial_number"),
      modelYear: pgInteger("model_year"),
      // Installation details
      installDate: timestamp("install_date"),
      installedBy: uuid("installed_by").references(() => users.id as any, {
        onDelete: "set null",
      }), // Technician who installed
      installJobId: uuid("install_job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      // Warranty information
      warrantyExpiration: timestamp("warranty_expiration"),
      warrantyProvider: pgText("warranty_provider"),
      warrantyNotes: pgText("warranty_notes"),
      isUnderWarranty: pgBoolean("is_under_warranty").notNull().default(false),
      // Service and maintenance
      lastServiceDate: timestamp("last_service_date"),
      lastServiceJobId: uuid("last_service_job_id").references(
        () => jobs.id as any,
        {
          onDelete: "set null",
        }
      ),
      nextServiceDue: timestamp("next_service_due"),
      serviceIntervalDays: pgInteger("service_interval_days").default(365), // Default annual service
      servicePlanId: uuid("service_plan_id").references(
        (): any => servicePlans.id,
        {
          onDelete: "set null",
        }
      ),
      // Equipment specifications
      capacity: pgText("capacity"), // BTU, gallons, etc.
      efficiency: pgText("efficiency"), // SEER rating, energy star, etc.
      fuelType: pgText("fuel_type"), // 'electric' | 'gas' | 'propane' | 'oil' | 'dual'
      location: pgText("location"), // Location within property: 'basement' | 'attic' | 'garage' | 'utility_room'
      // Condition and status
      condition: pgText("condition").notNull().default("good"), // 'excellent' | 'good' | 'fair' | 'poor' | 'needs_replacement'
      status: pgText("status").notNull().default("active"), // 'active' | 'inactive' | 'retired' | 'replaced'
      replacedDate: timestamp("replaced_date"),
      replacedByEquipmentId: uuid("replaced_by_equipment_id").references(
        (): any => equipment.id,
        {
          onDelete: "set null",
        }
      ),
      // Photos and documentation
      photos: pgJson("photos"), // Array of photo URLs
      documents: pgJson("documents"), // Array of manual/documentation URLs
      // Notes and metadata
      notes: pgText("notes"), // Internal notes
      customerNotes: pgText("customer_notes"), // Notes visible to customer
      metadata: pgJson("metadata"), // Additional custom fields
      // Maintenance metrics
      totalServiceCount: pgInteger("total_service_count").default(0),
      totalServiceCost: pgInteger("total_service_cost").default(0), // In cents
      averageServiceCost: pgInteger("average_service_cost").default(0), // In cents
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("equipment", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: text("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      propertyId: text("property_id")
        .notNull()
        .references(() => properties.id as any, { onDelete: "cascade" }),
      equipmentNumber: text("equipment_number").notNull().unique(),
      name: text("name").notNull(),
      type: text("type").notNull(),
      category: text("category"),
      manufacturer: text("manufacturer"),
      model: text("model"),
      serialNumber: text("serial_number"),
      modelYear: integer("model_year"),
      installDate: integer("install_date", { mode: "timestamp" }),
      installedBy: text("installed_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      installJobId: text("install_job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      warrantyExpiration: integer("warranty_expiration", { mode: "timestamp" }),
      warrantyProvider: text("warranty_provider"),
      warrantyNotes: text("warranty_notes"),
      isUnderWarranty: integer("is_under_warranty", { mode: "boolean" })
        .notNull()
        .default(false),
      lastServiceDate: integer("last_service_date", { mode: "timestamp" }),
      lastServiceJobId: text("last_service_job_id").references(
        () => jobs.id as any,
        {
          onDelete: "set null",
        }
      ),
      nextServiceDue: integer("next_service_due", { mode: "timestamp" }),
      serviceIntervalDays: integer("service_interval_days").default(365),
      servicePlanId: text("service_plan_id").references(
        (): any => servicePlans.id,
        {
          onDelete: "set null",
        }
      ),
      capacity: text("capacity"),
      efficiency: text("efficiency"),
      fuelType: text("fuel_type"),
      location: text("location"),
      condition: text("condition").notNull().default("good"),
      status: text("status").notNull().default("active"),
      replacedDate: integer("replaced_date", { mode: "timestamp" }),
      replacedByEquipmentId: text("replaced_by_equipment_id").references(
        (): any => equipment.id,
        {
          onDelete: "set null",
        }
      ),
      photos: text("photos"), // JSON string
      documents: text("documents"), // JSON string
      notes: text("notes"),
      customerNotes: text("customer_notes"),
      metadata: text("metadata"), // JSON string
      totalServiceCount: integer("total_service_count").default(0),
      totalServiceCost: integer("total_service_cost").default(0),
      averageServiceCost: integer("average_service_cost").default(0),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Service Plans table - Recurring maintenance agreements/subscriptions
 *
 * Manages recurring service agreements with customers for preventive maintenance
 */
export const servicePlans = isProduction
  ? pgTable("service_plans", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: uuid("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      propertyId: uuid("property_id").references(() => properties.id as any, {
        onDelete: "set null",
      }),
      // Plan identification
      planNumber: pgText("plan_number").notNull().unique(), // Auto-generated: SP-001, SP-002, etc.
      name: pgText("name").notNull(), // "Annual HVAC Maintenance" | "Quarterly Plumbing Check"
      description: pgText("description"),
      // Plan type and configuration
      type: pgText("type").notNull().default("preventive"), // 'preventive' | 'warranty' | 'subscription' | 'contract'
      frequency: pgText("frequency").notNull().default("annually"), // 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually'
      visitsPerTerm: pgInteger("visits_per_term").notNull().default(1), // How many visits per frequency period
      // Contract dates
      startDate: timestamp("start_date").notNull(),
      endDate: timestamp("end_date"), // null for ongoing
      renewalType: pgText("renewal_type").default("manual"), // 'auto' | 'manual' | 'none'
      renewalNoticeDays: pgInteger("renewal_notice_days").default(30),
      // Pricing
      price: pgInteger("price").notNull().default(0), // In cents - price per term
      billingFrequency: pgText("billing_frequency").default("annually"), // 'monthly' | 'quarterly' | 'annually' | 'one_time'
      taxable: pgBoolean("taxable").notNull().default(true),
      // Services included
      includedServices: pgJson("included_services").notNull(), // Array of service descriptions
      includedEquipmentTypes: pgJson("included_equipment_types"), // Array of equipment types covered
      priceBookItemIds: pgJson("price_book_item_ids"), // Array of price book item IDs included
      // Service scheduling
      lastServiceDate: timestamp("last_service_date"),
      nextServiceDue: timestamp("next_service_due").notNull(),
      autoGenerateJobs: pgBoolean("auto_generate_jobs")
        .notNull()
        .default(false), // Auto-create jobs when due
      assignedTechnician: uuid("assigned_technician").references(
        () => users.id as any,
        {
          onDelete: "set null",
        }
      ),
      // Status tracking
      status: pgText("status").notNull().default("active"), // 'draft' | 'active' | 'paused' | 'cancelled' | 'expired' | 'completed'
      pausedAt: timestamp("paused_at"),
      pausedReason: pgText("paused_reason"),
      cancelledAt: timestamp("cancelled_at"),
      cancelledReason: pgText("cancelled_reason"),
      completedAt: timestamp("completed_at"),
      // Contract terms
      terms: pgText("terms"), // Legal terms and conditions
      customerSignature: pgText("customer_signature"), // Base64 signature
      signedAt: timestamp("signed_at"),
      signedByName: pgText("signed_by_name"),
      // Performance metrics
      totalVisitsCompleted: pgInteger("total_visits_completed").default(0),
      totalRevenue: pgInteger("total_revenue").default(0), // In cents
      // Notes and metadata
      notes: pgText("notes"), // Internal notes
      customerNotes: pgText("customer_notes"), // Notes visible to customer
      metadata: pgJson("metadata"), // Additional custom fields
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("service_plans", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: text("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      propertyId: text("property_id").references(() => properties.id as any, {
        onDelete: "set null",
      }),
      planNumber: text("plan_number").notNull().unique(),
      name: text("name").notNull(),
      description: text("description"),
      type: text("type").notNull().default("preventive"),
      frequency: text("frequency").notNull().default("annually"),
      visitsPerTerm: integer("visits_per_term").notNull().default(1),
      startDate: integer("start_date", { mode: "timestamp" }).notNull(),
      endDate: integer("end_date", { mode: "timestamp" }),
      renewalType: text("renewal_type").default("manual"),
      renewalNoticeDays: integer("renewal_notice_days").default(30),
      price: integer("price").notNull().default(0),
      billingFrequency: text("billing_frequency").default("annually"),
      taxable: integer("taxable", { mode: "boolean" }).notNull().default(true),
      includedServices: text("included_services").notNull(), // JSON string
      includedEquipmentTypes: text("included_equipment_types"), // JSON string
      priceBookItemIds: text("price_book_item_ids"), // JSON string
      lastServiceDate: integer("last_service_date", { mode: "timestamp" }),
      nextServiceDue: integer("next_service_due", {
        mode: "timestamp",
      }).notNull(),
      autoGenerateJobs: integer("auto_generate_jobs", { mode: "boolean" })
        .notNull()
        .default(false),
      assignedTechnician: text("assigned_technician").references(
        () => users.id as any,
        {
          onDelete: "set null",
        }
      ),
      status: text("status").notNull().default("active"),
      pausedAt: integer("paused_at", { mode: "timestamp" }),
      pausedReason: text("paused_reason"),
      cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
      cancelledReason: text("cancelled_reason"),
      completedAt: integer("completed_at", { mode: "timestamp" }),
      terms: text("terms"),
      customerSignature: text("customer_signature"),
      signedAt: integer("signed_at", { mode: "timestamp" }),
      signedByName: text("signed_by_name"),
      totalVisitsCompleted: integer("total_visits_completed").default(0),
      totalRevenue: integer("total_revenue").default(0),
      notes: text("notes"),
      customerNotes: text("customer_notes"),
      metadata: text("metadata"), // JSON string
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Schedules table - Appointment and scheduling system with recurrence support
 *
 * Manages all scheduled appointments including one-time and recurring appointments
 */
export const schedules = isProduction
  ? pgTable("schedules", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: uuid("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      propertyId: uuid("property_id")
        .notNull()
        .references(() => properties.id as any, { onDelete: "cascade" }),
      jobId: uuid("job_id").references(() => jobs.id as any, {
        onDelete: "cascade",
      }), // Link to job if converted
      servicePlanId: uuid("service_plan_id").references(
        () => servicePlans.id as any,
        {
          onDelete: "set null",
        }
      ), // If part of service plan
      // Scheduling
      assignedTo: uuid("assigned_to").references(() => users.id as any, {
        onDelete: "set null",
      }), // Technician assigned
      // Appointment details
      type: pgText("type").notNull().default("appointment"), // 'appointment' | 'recurring' | 'on_call' | 'emergency'
      title: pgText("title").notNull(),
      description: pgText("description"),
      // Time scheduling
      startTime: timestamp("start_time").notNull(),
      endTime: timestamp("end_time").notNull(),
      duration: pgInteger("duration").notNull(), // In minutes
      allDay: pgBoolean("all_day").notNull().default(false),
      // Recurrence
      isRecurring: pgBoolean("is_recurring").notNull().default(false),
      recurrenceRule: pgJson("recurrence_rule"), // iCal RRULE format: { frequency: 'WEEKLY', interval: 1, byDay: ['MO', 'WE'], until: date }
      parentScheduleId: uuid("parent_schedule_id").references(
        (): any => schedules.id,
        {
          onDelete: "cascade",
        }
      ), // For instances of recurring events
      recurrenceEndDate: timestamp("recurrence_end_date"),
      // Status tracking
      status: pgText("status").notNull().default("scheduled"), // 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'
      confirmedAt: timestamp("confirmed_at"),
      confirmedBy: pgText("confirmed_by"), // Customer name or method
      // Dispatch and completion tracking
      dispatchTime: timestamp("dispatch_time"), // When appointment was dispatched/assigned
      actualStartTime: timestamp("actual_start_time"), // When technician arrived
      actualEndTime: timestamp("actual_end_time"), // When appointment was closed/completed
      actualDuration: pgInteger("actual_duration"), // In minutes
      completedBy: uuid("completed_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      // Reminder settings
      reminderSent: pgBoolean("reminder_sent").notNull().default(false),
      reminderSentAt: timestamp("reminder_sent_at"),
      reminderMethod: pgText("reminder_method"), // 'email' | 'sms' | 'both'
      reminderHoursBefore: pgInteger("reminder_hours_before").default(24),
      // Service details
      serviceTypes: pgJson("service_types"), // Array of service type strings
      estimatedCost: pgInteger("estimated_cost").default(0), // In cents
      // Location and access
      location: pgText("location"), // Specific location within property
      accessInstructions: pgText("access_instructions"), // Gate codes, parking, etc.
      // Cancellation/Rescheduling
      cancelledAt: timestamp("cancelled_at"),
      cancelledBy: uuid("cancelled_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      cancellationReason: pgText("cancellation_reason"),
      rescheduledFromId: uuid("rescheduled_from_id").references(
        (): any => schedules.id,
        {
          onDelete: "set null",
        }
      ),
      rescheduledToId: uuid("rescheduled_to_id").references(
        (): any => schedules.id,
        {
          onDelete: "set null",
        }
      ),
      // Notes and metadata
      notes: pgText("notes"), // Internal notes
      customerNotes: pgText("customer_notes"), // Notes visible to customer
      metadata: pgJson("metadata"), // Additional custom fields
      // Color coding for calendar views
      color: pgText("color"), // Hex color for calendar display
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("schedules", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      customerId: text("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      propertyId: text("property_id")
        .notNull()
        .references(() => properties.id as any, { onDelete: "cascade" }),
      jobId: text("job_id").references(() => jobs.id as any, {
        onDelete: "cascade",
      }),
      servicePlanId: text("service_plan_id").references(
        () => servicePlans.id as any,
        {
          onDelete: "set null",
        }
      ),
      assignedTo: text("assigned_to").references(() => users.id as any, {
        onDelete: "set null",
      }),
      type: text("type").notNull().default("appointment"),
      title: text("title").notNull(),
      description: text("description"),
      startTime: integer("start_time", { mode: "timestamp" }).notNull(),
      endTime: integer("end_time", { mode: "timestamp" }).notNull(),
      duration: integer("duration").notNull(),
      allDay: integer("all_day", { mode: "boolean" }).notNull().default(false),
      isRecurring: integer("is_recurring", { mode: "boolean" })
        .notNull()
        .default(false),
      recurrenceRule: text("recurrence_rule"), // JSON string
      parentScheduleId: text("parent_schedule_id").references(
        (): any => schedules.id,
        {
          onDelete: "cascade",
        }
      ),
      recurrenceEndDate: integer("recurrence_end_date", { mode: "timestamp" }),
      status: text("status").notNull().default("scheduled"),
      confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
      confirmedBy: text("confirmed_by"),
      dispatchTime: integer("dispatch_time", { mode: "timestamp" }), // When appointment was dispatched/assigned
      actualStartTime: integer("actual_start_time", { mode: "timestamp" }), // When technician arrived
      actualEndTime: integer("actual_end_time", { mode: "timestamp" }), // When appointment was closed/completed
      actualDuration: integer("actual_duration"),
      completedBy: text("completed_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      reminderSent: integer("reminder_sent", { mode: "boolean" })
        .notNull()
        .default(false),
      reminderSentAt: integer("reminder_sent_at", { mode: "timestamp" }),
      reminderMethod: text("reminder_method"),
      reminderHoursBefore: integer("reminder_hours_before").default(24),
      serviceTypes: text("service_types"), // JSON string
      estimatedCost: integer("estimated_cost").default(0),
      location: text("location"),
      accessInstructions: text("access_instructions"),
      cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
      cancelledBy: text("cancelled_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
      cancellationReason: text("cancellation_reason"),
      rescheduledFromId: text("rescheduled_from_id").references(
        (): any => schedules.id,
        {
          onDelete: "set null",
        }
      ),
      rescheduledToId: text("rescheduled_to_id").references(
        (): any => schedules.id,
        {
          onDelete: "set null",
        }
      ),
      notes: text("notes"),
      customerNotes: text("customer_notes"),
      metadata: text("metadata"), // JSON string
      color: text("color"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Inventory table - Stock tracking and management
 *
 * Tracks inventory levels for materials and parts with reorder points
 */
export const inventory = isProduction
  ? pgTable("inventory", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      priceBookItemId: uuid("price_book_item_id")
        .notNull()
        .references(() => priceBookItems.id as any, { onDelete: "restrict" }), // Can't delete item with inventory
      // Stock tracking
      quantityOnHand: pgInteger("quantity_on_hand").notNull().default(0),
      quantityReserved: pgInteger("quantity_reserved").notNull().default(0), // Reserved for pending jobs
      quantityAvailable: pgInteger("quantity_available").notNull().default(0), // onHand - reserved
      minimumQuantity: pgInteger("minimum_quantity").default(0), // Alert threshold
      maximumQuantity: pgInteger("maximum_quantity"), // Max stock level
      reorderPoint: pgInteger("reorder_point").default(0), // Trigger PO when below this
      reorderQuantity: pgInteger("reorder_quantity").default(0), // How many to order
      // Location tracking
      warehouseLocation: pgText("warehouse_location"), // Bin/shelf location
      primaryLocation: pgText("primary_location"), // Main warehouse
      secondaryLocations: pgJson("secondary_locations"), // Other locations if multi-warehouse
      // Costing
      costPerUnit: pgInteger("cost_per_unit").default(0), // In cents - average cost
      totalCostValue: pgInteger("total_cost_value").default(0), // In cents - quantityOnHand * costPerUnit
      lastPurchaseCost: pgInteger("last_purchase_cost").default(0), // In cents - most recent purchase price
      // Stock movement tracking
      lastRestockDate: timestamp("last_restock_date"),
      lastRestockQuantity: pgInteger("last_restock_quantity"),
      lastRestockPurchaseOrderId: uuid(
        "last_restock_purchase_order_id"
      ).references(() => purchaseOrders.id as any, { onDelete: "set null" }),
      lastStockCheckDate: timestamp("last_stock_check_date"),
      lastUsedDate: timestamp("last_used_date"),
      lastUsedJobId: uuid("last_used_job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      // Low stock tracking
      isLowStock: pgBoolean("is_low_stock").notNull().default(false), // Auto-set when below minimum
      lowStockAlertSent: pgBoolean("low_stock_alert_sent")
        .notNull()
        .default(false),
      lowStockAlertSentAt: timestamp("low_stock_alert_sent_at"),
      // Status
      status: pgText("status").notNull().default("active"), // 'active' | 'discontinued' | 'on_order'
      // Notes
      notes: pgText("notes"),
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("inventory", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      priceBookItemId: text("price_book_item_id")
        .notNull()
        .references(() => priceBookItems.id as any, { onDelete: "restrict" }),
      quantityOnHand: integer("quantity_on_hand").notNull().default(0),
      quantityReserved: integer("quantity_reserved").notNull().default(0),
      quantityAvailable: integer("quantity_available").notNull().default(0),
      minimumQuantity: integer("minimum_quantity").default(0),
      maximumQuantity: integer("maximum_quantity"),
      reorderPoint: integer("reorder_point").default(0),
      reorderQuantity: integer("reorder_quantity").default(0),
      warehouseLocation: text("warehouse_location"),
      primaryLocation: text("primary_location"),
      secondaryLocations: text("secondary_locations"), // JSON string
      costPerUnit: integer("cost_per_unit").default(0),
      totalCostValue: integer("total_cost_value").default(0),
      lastPurchaseCost: integer("last_purchase_cost").default(0),
      lastRestockDate: integer("last_restock_date", { mode: "timestamp" }),
      lastRestockQuantity: integer("last_restock_quantity"),
      lastRestockPurchaseOrderId: text(
        "last_restock_purchase_order_id"
      ).references(() => purchaseOrders.id as any, { onDelete: "set null" }),
      lastStockCheckDate: integer("last_stock_check_date", {
        mode: "timestamp",
      }),
      lastUsedDate: integer("last_used_date", { mode: "timestamp" }),
      lastUsedJobId: text("last_used_job_id").references(() => jobs.id as any, {
        onDelete: "set null",
      }),
      isLowStock: integer("is_low_stock", { mode: "boolean" })
        .notNull()
        .default(false),
      lowStockAlertSent: integer("low_stock_alert_sent", { mode: "boolean" })
        .notNull()
        .default(false),
      lowStockAlertSentAt: integer("low_stock_alert_sent_at", {
        mode: "timestamp",
      }),
      status: text("status").notNull().default("active"),
      notes: text("notes"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Tags table - Centralized tag management across all entities
 *
 * Manages tags that can be applied to jobs, customers, equipment, etc.
 */
export const tags = isProduction
  ? pgTable("tags", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Tag identification
      name: pgText("name").notNull(),
      slug: pgText("slug").notNull(), // URL-friendly version
      description: pgText("description"),
      // Categorization
      category: pgText("category"), // 'customer' | 'job' | 'equipment' | 'general' | 'status' | 'priority'
      color: pgText("color"), // Hex color for badges
      icon: pgText("icon"), // Lucide icon name
      // Usage tracking
      usageCount: pgInteger("usage_count").notNull().default(0), // Denormalized for performance
      lastUsedAt: timestamp("last_used_at"),
      // Status
      isActive: pgBoolean("is_active").notNull().default(true),
      isSystem: pgBoolean("is_system").notNull().default(false), // System tags can't be deleted
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("tags", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      name: text("name").notNull(),
      slug: text("slug").notNull(),
      description: text("description"),
      category: text("category"),
      color: text("color"),
      icon: text("icon"),
      usageCount: integer("usage_count").notNull().default(0),
      lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
      isActive: integer("is_active", { mode: "boolean" })
        .notNull()
        .default(true),
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
 * Customer Tags junction table - Many-to-many relationship
 */
export const customerTags = isProduction
  ? pgTable("customer_tags", {
      customerId: uuid("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      tagId: uuid("tag_id")
        .notNull()
        .references(() => tags.id as any, { onDelete: "cascade" }),
      addedAt: timestamp("added_at").defaultNow().notNull(),
      addedBy: uuid("added_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("customer_tags", {
      customerId: text("customer_id")
        .notNull()
        .references(() => customers.id as any, { onDelete: "cascade" }),
      tagId: text("tag_id")
        .notNull()
        .references(() => tags.id as any, { onDelete: "cascade" }),
      addedAt: integer("added_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      addedBy: text("added_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Job Tags junction table - Many-to-many relationship
 */
export const jobTags = isProduction
  ? pgTable("job_tags", {
      jobId: uuid("job_id")
        .notNull()
        .references(() => jobs.id as any, { onDelete: "cascade" }),
      tagId: uuid("tag_id")
        .notNull()
        .references(() => tags.id as any, { onDelete: "cascade" }),
      addedAt: timestamp("added_at").defaultNow().notNull(),
      addedBy: uuid("added_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("job_tags", {
      jobId: text("job_id")
        .notNull()
        .references(() => jobs.id as any, { onDelete: "cascade" }),
      tagId: text("tag_id")
        .notNull()
        .references(() => tags.id as any, { onDelete: "cascade" }),
      addedAt: integer("added_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      addedBy: text("added_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Equipment Tags junction table - Many-to-many relationship
 */
export const equipmentTags = isProduction
  ? pgTable("equipment_tags", {
      equipmentId: uuid("equipment_id")
        .notNull()
        .references(() => equipment.id as any, { onDelete: "cascade" }),
      tagId: uuid("tag_id")
        .notNull()
        .references(() => tags.id as any, { onDelete: "cascade" }),
      addedAt: timestamp("added_at").defaultNow().notNull(),
      addedBy: uuid("added_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("equipment_tags", {
      equipmentId: text("equipment_id")
        .notNull()
        .references(() => equipment.id as any, { onDelete: "cascade" }),
      tagId: text("tag_id")
        .notNull()
        .references(() => tags.id as any, { onDelete: "cascade" }),
      addedAt: integer("added_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      addedBy: text("added_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Attachments table - Polymorphic file attachments for all entities
 *
 * Supports attaching files to jobs, customers, invoices, equipment, etc.
 */
export const attachments = isProduction
  ? pgTable("attachments", {
      id: uuid("id").primaryKey().defaultRandom(),
      companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      // Polymorphic relationship
      entityType: pgText("entity_type").notNull(), // 'job' | 'customer' | 'invoice' | 'estimate' | 'equipment' | 'property' | 'communication'
      entityId: uuid("entity_id").notNull(), // ID of the entity
      // File information
      fileName: pgText("file_name").notNull(),
      originalFileName: pgText("original_file_name").notNull(),
      fileSize: pgInteger("file_size").notNull(), // In bytes
      mimeType: pgText("mime_type").notNull(),
      fileExtension: pgText("file_extension"),
      // Storage
      storageProvider: pgText("storage_provider").notNull().default("supabase"), // 'supabase' | 's3' | 'cloudinary'
      storageUrl: pgText("storage_url").notNull(), // Full URL to file
      storagePath: pgText("storage_path").notNull(), // Path within storage
      storageBucket: pgText("storage_bucket"), // Bucket/container name
      // File metadata
      isImage: pgBoolean("is_image").notNull().default(false),
      isDocument: pgBoolean("is_document").notNull().default(false),
      isVideo: pgBoolean("is_video").notNull().default(false),
      width: pgInteger("width"), // For images/videos
      height: pgInteger("height"), // For images/videos
      duration: pgInteger("duration"), // For videos/audio in seconds
      thumbnailUrl: pgText("thumbnail_url"), // Thumbnail for images/videos
      // Categorization
      category: pgText("category"), // 'photo' | 'document' | 'receipt' | 'manual' | 'warranty' | 'other'
      tags: pgJson("tags"), // Array of tag strings
      description: pgText("description"),
      // Visibility and access
      isPublic: pgBoolean("is_public").notNull().default(false), // Publicly accessible URL
      isInternal: pgBoolean("is_internal").notNull().default(false), // Internal use only
      // Upload tracking
      uploadedBy: uuid("uploaded_by")
        .notNull()
        .references(() => users.id as any, { onDelete: "set null" }),
      uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
      // Metadata
      metadata: pgJson("metadata"), // Additional file-specific data
      // Timestamps
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      // Soft delete
      deletedAt: timestamp("deleted_at"),
      deletedBy: uuid("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    })
  : sqliteTable("attachments", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      companyId: text("company_id")
        .notNull()
        .references(() => companies.id as any, { onDelete: "cascade" }),
      entityType: text("entity_type").notNull(),
      entityId: text("entity_id").notNull(),
      fileName: text("file_name").notNull(),
      originalFileName: text("original_file_name").notNull(),
      fileSize: integer("file_size").notNull(),
      mimeType: text("mime_type").notNull(),
      fileExtension: text("file_extension"),
      storageProvider: text("storage_provider").notNull().default("supabase"),
      storageUrl: text("storage_url").notNull(),
      storagePath: text("storage_path").notNull(),
      storageBucket: text("storage_bucket"),
      isImage: integer("is_image", { mode: "boolean" })
        .notNull()
        .default(false),
      isDocument: integer("is_document", { mode: "boolean" })
        .notNull()
        .default(false),
      isVideo: integer("is_video", { mode: "boolean" })
        .notNull()
        .default(false),
      width: integer("width"),
      height: integer("height"),
      duration: integer("duration"),
      thumbnailUrl: text("thumbnail_url"),
      category: text("category"),
      tags: text("tags"), // JSON string
      description: text("description"),
      isPublic: integer("is_public", { mode: "boolean" })
        .notNull()
        .default(false),
      isInternal: integer("is_internal", { mode: "boolean" })
        .notNull()
        .default(false),
      uploadedBy: text("uploaded_by")
        .notNull()
        .references(() => users.id as any, { onDelete: "set null" }),
      uploadedAt: integer("uploaded_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      metadata: text("metadata"), // JSON string
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      deletedAt: integer("deleted_at", { mode: "timestamp" }),
      deletedBy: text("deleted_by").references(() => users.id as any, {
        onDelete: "set null",
      }),
    });

/**
 * Knowledge Base Categories - Hierarchical category structure
 */
export const kbCategories = isProduction
  ? pgTable("kb_categories", {
      id: uuid("id").primaryKey().defaultRandom(),
      slug: pgText("slug").notNull().unique(),
      title: pgText("title").notNull(),
      description: pgText("description"),
      icon: pgText("icon"), // Icon name or emoji
      parentId: uuid("parent_id").references((): any => kbCategories.id, {
        onDelete: "cascade",
      }),
      order: pgInteger("order").default(0).notNull(),
      isActive: pgBoolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("kb_categories", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      slug: text("slug").notNull().unique(),
      title: text("title").notNull(),
      description: text("description"),
      icon: text("icon"),
      parentId: text("parent_id").references((): any => kbCategories.id, {
        onDelete: "cascade",
      }),
      order: integer("order").default(0).notNull(),
      isActive: integer("is_active", { mode: "boolean" })
        .default(true)
        .notNull(),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Knowledge Base Tags - Tag system for cross-categorization
 */
export const kbTags = isProduction
  ? pgTable("kb_tags", {
      id: uuid("id").primaryKey().defaultRandom(),
      slug: pgText("slug").notNull().unique(),
      name: pgText("name").notNull(),
      description: pgText("description"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("kb_tags", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      slug: text("slug").notNull().unique(),
      name: text("name").notNull(),
      description: text("description"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Knowledge Base Articles - Article content with metadata
 */
export const kbArticles = isProduction
  ? pgTable("kb_articles", {
      id: uuid("id").primaryKey().defaultRandom(),
      slug: pgText("slug").notNull(),
      title: pgText("title").notNull(),
      excerpt: pgText("excerpt"), // Brief description for SEO and previews
      content: pgText("content").notNull(), // Markdown content
      htmlContent: pgText("html_content"), // Rendered HTML (cached)
      categoryId: uuid("category_id")
        .notNull()
        .references((): any => kbCategories.id, { onDelete: "cascade" }),
      featuredImage: pgText("featured_image"), // URL to featured image
      author: pgText("author"), // Author name
      featured: pgBoolean("featured").default(false).notNull(),
      published: pgBoolean("published").default(false).notNull(),
      publishedAt: timestamp("published_at"),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
      viewCount: pgInteger("view_count").default(0).notNull(),
      helpfulCount: pgInteger("helpful_count").default(0).notNull(),
      notHelpfulCount: pgInteger("not_helpful_count").default(0).notNull(),
      // SEO metadata
      metaTitle: pgText("meta_title"), // Custom SEO title
      metaDescription: pgText("meta_description"), // Custom SEO description
      keywords: pgJson("keywords"), // Array of keywords
      // Full-text search vector
      searchVector: pgText("search_vector"), // tsvector for full-text search
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("kb_articles", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      slug: text("slug").notNull(),
      title: text("title").notNull(),
      excerpt: text("excerpt"),
      content: text("content").notNull(),
      htmlContent: text("html_content"),
      categoryId: text("category_id")
        .notNull()
        .references((): any => kbCategories.id, { onDelete: "cascade" }),
      featuredImage: text("featured_image"),
      author: text("author"),
      featured: integer("featured", { mode: "boolean" })
        .default(false)
        .notNull(),
      published: integer("published", { mode: "boolean" })
        .default(false)
        .notNull(),
      publishedAt: integer("published_at", { mode: "timestamp" }),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
      viewCount: integer("view_count").default(0).notNull(),
      helpfulCount: integer("helpful_count").default(0).notNull(),
      notHelpfulCount: integer("not_helpful_count").default(0).notNull(),
      metaTitle: text("meta_title"),
      metaDescription: text("meta_description"),
      keywords: text("keywords"), // JSON string
      searchVector: text("search_vector"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Knowledge Base Article Tags - Many-to-many relationship
 */
export const kbArticleTags = isProduction
  ? pgTable("kb_article_tags", {
      articleId: uuid("article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      tagId: uuid("tag_id")
        .notNull()
        .references((): any => kbTags.id, { onDelete: "cascade" }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("kb_article_tags", {
      articleId: text("article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      tagId: text("tag_id")
        .notNull()
        .references((): any => kbTags.id, { onDelete: "cascade" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Knowledge Base Related Articles - Related articles relationships
 */
export const kbArticleRelated = isProduction
  ? pgTable("kb_article_related", {
      articleId: uuid("article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      relatedArticleId: uuid("related_article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      order: pgInteger("order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("kb_article_related", {
      articleId: text("article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      relatedArticleId: text("related_article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      order: integer("order").default(0).notNull(),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    });

/**
 * Knowledge Base Feedback - User feedback (helpful/not helpful, comments)
 */
export const kbFeedback = isProduction
  ? pgTable("kb_feedback", {
      id: uuid("id").primaryKey().defaultRandom(),
      articleId: uuid("article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      helpful: pgBoolean("helpful"), // true = helpful, false = not helpful, null = comment only
      comment: pgText("comment"),
      userEmail: pgText("user_email"), // Optional user email
      userAgent: pgText("user_agent"), // Browser user agent
      ipAddress: pgText("ip_address"), // IP address (for analytics)
      createdAt: timestamp("created_at").defaultNow().notNull(),
    })
  : sqliteTable("kb_feedback", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      articleId: text("article_id")
        .notNull()
        .references((): any => kbArticles.id, { onDelete: "cascade" }),
      helpful: integer("helpful", { mode: "boolean" }),
      comment: text("comment"),
      userEmail: text("user_email"),
      userAgent: text("user_agent"),
      ipAddress: text("ip_address"),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
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

// Customer Management types
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

// Customer Enrichment types
export type CustomerEnrichmentData = any; // Will be defined after migration
export type NewCustomerEnrichmentData = any;
export type CustomerEnrichmentUsage = any;
export type NewCustomerEnrichmentUsage = any;

// Communication types
export type Communication = typeof communications.$inferSelect;
export type NewCommunication = typeof communications.$inferInsert;

// Payment types
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// Equipment types
export type Equipment = typeof equipment.$inferSelect;
export type NewEquipment = typeof equipment.$inferInsert;

// Service Plan types
export type ServicePlan = typeof servicePlans.$inferSelect;
export type NewServicePlan = typeof servicePlans.$inferInsert;

// Schedule types
export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;

// Inventory types
export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;

// Tag types
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type CustomerTag = typeof customerTags.$inferSelect;
export type NewCustomerTag = typeof customerTags.$inferInsert;
export type JobTag = typeof jobTags.$inferSelect;
export type NewJobTag = typeof jobTags.$inferInsert;
export type EquipmentTag = typeof equipmentTags.$inferSelect;
export type NewEquipmentTag = typeof equipmentTags.$inferInsert;

// Attachment types
export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;

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
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;
export type POSettings = typeof poSettings.$inferSelect;
export type NewPOSettings = typeof poSettings.$inferInsert;

// Activity tracking types
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

// Price book types
export type PriceBookCategory = typeof priceBookCategories.$inferSelect;
export type NewPriceBookCategory = typeof priceBookCategories.$inferInsert;
export type PriceBookItem = typeof priceBookItems.$inferSelect;
export type NewPriceBookItem = typeof priceBookItems.$inferInsert;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type NewPriceHistory = typeof priceHistory.$inferInsert;
export type ServicePackage = typeof servicePackages.$inferSelect;
export type NewServicePackage = typeof servicePackages.$inferInsert;
export type PricingRule = typeof pricingRules.$inferSelect;
export type NewPricingRule = typeof pricingRules.$inferInsert;
export type LaborRate = typeof laborRates.$inferSelect;
export type NewLaborRate = typeof laborRates.$inferInsert;
export type SupplierIntegration = typeof supplierIntegrations.$inferSelect;
export type NewSupplierIntegration = typeof supplierIntegrations.$inferInsert;

// Email logs types
export type EmailLog = typeof emailLogs.$inferSelect;
export type NewEmailLog = typeof emailLogs.$inferInsert;

// Verification tokens types
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;

// Knowledge Base types
export type KBCategory = typeof kbCategories.$inferSelect;
export type NewKBCategory = typeof kbCategories.$inferInsert;
export type KBTag = typeof kbTags.$inferSelect;
export type NewKBTag = typeof kbTags.$inferInsert;
export type KBArticle = typeof kbArticles.$inferSelect;
export type NewKBArticle = typeof kbArticles.$inferInsert;
export type KBArticleTag = typeof kbArticleTags.$inferSelect;
export type NewKBArticleTag = typeof kbArticleTags.$inferInsert;
export type KBArticleRelated = typeof kbArticleRelated.$inferSelect;
export type NewKBArticleRelated = typeof kbArticleRelated.$inferInsert;
export type KBFeedback = typeof kbFeedback.$inferSelect;
export type NewKBFeedback = typeof kbFeedback.$inferInsert;
