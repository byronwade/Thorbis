/**
 * Convex Schema Definition
 * Migrated from Supabase PostgreSQL (131 tables)
 *
 * This schema includes all core business entities with:
 * - Multi-tenant isolation via companyId
 * - Soft delete support (deletedAt, archivedAt)
 * - Audit fields (createdBy, updatedBy)
 * - Full-text search indexes
 */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  userRole,
  teamMemberStatus,
  customerType,
  customerStatus,
  jobStatus,
  jobPriority,
  jobType,
  estimateStatus,
  invoiceStatus,
  paymentMethod,
  paymentStatus,
  paymentType,
  cardBrand,
  communicationType,
  communicationDirection,
  communicationStatus,
  communicationPriority,
  equipmentType,
  equipmentCondition,
  equipmentStatus,
  servicePlanType,
  servicePlanFrequency,
  servicePlanStatus,
  renewalType,
  scheduleType,
  scheduleStatus,
  inventoryStatus,
  priceBookItemType,
  purchaseOrderStatus,
  vendorCategory,
  vendorPaymentTerms,
  tagCategory,
  attachmentEntityType,
  attachmentCategory,
  propertyType,
  subscriptionStatus,
  softDeleteFields,
  auditFields,
} from "./lib/validators";

// ============================================================================
// SCHEMA DEFINITION
// ============================================================================

export default defineSchema({
  // ==========================================================================
  // CORE: Users & Authentication
  // ==========================================================================

  users: defineTable({
    // Auth identity (from Convex Auth)
    tokenIdentifier: v.string(),

    // Profile
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    phone: v.optional(v.string()),

    // Status
    isActive: v.boolean(),
    emailVerified: v.optional(v.boolean()),
    lastLoginAt: v.optional(v.number()),

    // Migrated from Supabase (optional for data migration)
    _migratedFromSupabase: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  // ==========================================================================
  // CORE: Companies & Teams
  // ==========================================================================

  companies: defineTable({
    // Company info
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),

    // Contact
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),

    // Address
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),

    // Branding
    logo: v.optional(v.string()),
    primaryColor: v.optional(v.string()),

    // Billing/Subscription
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(subscriptionStatus),
    subscriptionPlan: v.optional(v.string()),
    trialEndsAt: v.optional(v.number()),

    // Settings (flexible JSONB replacement)
    settings: v.optional(v.any()),

    // Onboarding
    onboardingCompleted: v.boolean(),
    onboardingCompletedAt: v.optional(v.number()),
    onboardingProgress: v.optional(v.any()),

    // Integrations
    twilioAccountSid: v.optional(v.string()),
    sendgridApiKey: v.optional(v.string()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  teamMembers: defineTable({
    companyId: v.id("companies"),
    userId: v.id("users"),

    // Role and permissions
    role: userRole,
    customRoleId: v.optional(v.id("customRoles")),
    permissions: v.optional(v.any()), // Custom permission overrides

    // Organization
    department: v.optional(v.string()),
    jobTitle: v.optional(v.string()),

    // Status
    status: teamMemberStatus,
    invitedAt: v.optional(v.number()),
    invitedBy: v.optional(v.id("users")),
    joinedAt: v.optional(v.number()),

    // Work settings
    hourlyRate: v.optional(v.number()), // cents
    commissionRate: v.optional(v.number()), // percentage

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_user", ["userId"])
    .index("by_company_user", ["companyId", "userId"])
    .index("by_company_role", ["companyId", "role"])
    .index("by_company_status", ["companyId", "status"]),

  teamInvitations: defineTable({
    companyId: v.id("companies"),
    email: v.string(),
    role: userRole,
    token: v.string(),
    invitedBy: v.id("users"),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    acceptedBy: v.optional(v.id("users")),
  })
    .index("by_company", ["companyId"])
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  customRoles: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    description: v.optional(v.string()),
    permissions: v.any(), // Permission map
    isDefault: v.boolean(),
    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_name", ["companyId", "name"]),

  // ==========================================================================
  // CUSTOMERS & PROPERTIES
  // ==========================================================================

  customers: defineTable({
    companyId: v.id("companies"),
    userId: v.optional(v.id("users")), // For portal access

    // Customer type
    type: customerType,

    // Basic info
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.optional(v.string()),
    displayName: v.string(),

    // Contact
    email: v.string(),
    phone: v.string(),
    secondaryPhone: v.optional(v.string()),

    // Address (primary)
    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),

    // Classification
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    referredBy: v.optional(v.id("customers")),

    // Preferences
    communicationPreferences: v.optional(v.any()),
    preferredContactMethod: v.optional(v.string()),
    preferredTechnician: v.optional(v.id("users")),

    // Billing
    billingEmail: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    creditLimit: v.optional(v.number()), // cents
    taxExempt: v.boolean(),
    taxExemptNumber: v.optional(v.string()),

    // Metrics (denormalized for performance)
    totalRevenue: v.optional(v.number()), // cents
    totalJobs: v.optional(v.number()),
    totalInvoices: v.optional(v.number()),
    averageJobValue: v.optional(v.number()), // cents
    outstandingBalance: v.optional(v.number()), // cents
    lastJobDate: v.optional(v.number()),
    lastInvoiceDate: v.optional(v.number()),
    lastPaymentDate: v.optional(v.number()),

    // Status
    status: customerStatus,
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),

    // Portal
    portalEnabled: v.boolean(),
    portalInvitedAt: v.optional(v.number()),
    portalLastLoginAt: v.optional(v.number()),

    // Metadata
    metadata: v.optional(v.any()),
    customFields: v.optional(v.any()),

    // Full-text search
    searchText: v.optional(v.string()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_company_email", ["companyId", "email"])
    .index("by_company_phone", ["companyId", "phone"])
    .index("by_company_type", ["companyId", "type"])
    .index("by_user", ["userId"])
    .searchIndex("search_customers", {
      searchField: "searchText",
      filterFields: ["companyId", "status", "type"],
    }),

  properties: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),

    // Property type
    type: propertyType,

    // Address
    name: v.optional(v.string()),
    address: v.string(),
    address2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    country: v.optional(v.string()),

    // Property details
    squareFootage: v.optional(v.number()),
    yearBuilt: v.optional(v.number()),
    numberOfUnits: v.optional(v.number()),

    // Location
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),

    // Status
    isPrimary: v.boolean(),
    isActive: v.boolean(),

    // Access
    accessNotes: v.optional(v.string()),
    gateCode: v.optional(v.string()),

    notes: v.optional(v.string()),
    customFields: v.optional(v.any()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_customer", ["customerId"])
    .index("by_company_customer", ["companyId", "customerId"])
    .index("by_company_active", ["companyId", "isActive"]),

  // ==========================================================================
  // JOBS & WORK MANAGEMENT
  // ==========================================================================

  jobs: defineTable({
    companyId: v.id("companies"),
    propertyId: v.optional(v.id("properties")),
    customerId: v.optional(v.id("customers")),
    assignedTo: v.optional(v.id("users")),

    // Job identification
    jobNumber: v.string(),
    title: v.string(),
    description: v.optional(v.string()),

    // Classification
    status: jobStatus,
    priority: jobPriority,
    jobType: v.optional(jobType),
    serviceType: v.optional(v.string()),

    // AI-powered fields
    aiCategories: v.optional(v.array(v.string())),
    aiEquipment: v.optional(v.array(v.string())),
    aiServiceType: v.optional(v.string()),
    aiPriorityScore: v.optional(v.number()),
    aiTags: v.optional(v.array(v.string())),
    aiProcessedAt: v.optional(v.number()),

    // Scheduling
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
    actualStart: v.optional(v.number()),
    actualEnd: v.optional(v.number()),

    // Financial (money in cents)
    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    totalAmount: v.optional(v.number()),

    // Completion
    completionNotes: v.optional(v.string()),
    customerSignature: v.optional(v.string()),
    technicianSignature: v.optional(v.string()),

    // Internal
    internalNotes: v.optional(v.string()),
    recurringJobId: v.optional(v.id("jobs")),
    source: v.optional(v.string()),

    customFields: v.optional(v.any()),
    metadata: v.optional(v.any()),

    // Search
    searchText: v.optional(v.string()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_company_priority", ["companyId", "priority"])
    .index("by_customer", ["customerId"])
    .index("by_property", ["propertyId"])
    .index("by_assigned", ["assignedTo"])
    .index("by_job_number", ["companyId", "jobNumber"])
    .index("by_company_scheduled", ["companyId", "scheduledStart"])
    .searchIndex("search_jobs", {
      searchField: "searchText",
      filterFields: ["companyId", "status", "priority", "assignedTo"],
    }),

  jobFinancial: defineTable({
    jobId: v.id("jobs"),
    subtotal: v.number(), // cents
    taxRate: v.number(),
    taxAmount: v.number(),
    discountAmount: v.number(),
    totalAmount: v.number(),
    paidAmount: v.number(),
    depositAmount: v.optional(v.number()),
    ...auditFields,
  })
    .index("by_job", ["jobId"]),

  jobTimeTracking: defineTable({
    jobId: v.id("jobs"),
    actualStart: v.optional(v.number()),
    actualEnd: v.optional(v.number()),
    totalMinutes: v.optional(v.number()),
    billableMinutes: v.optional(v.number()),
    ...auditFields,
  })
    .index("by_job", ["jobId"]),

  jobTeamAssignments: defineTable({
    jobId: v.id("jobs"),
    userId: v.id("users"),
    role: v.optional(v.string()), // lead, helper, etc.
    assignedAt: v.number(),
    assignedBy: v.id("users"),
    ...softDeleteFields,
  })
    .index("by_job", ["jobId"])
    .index("by_user", ["userId"]),

  jobEquipment: defineTable({
    jobId: v.id("jobs"),
    equipmentId: v.id("equipment"),
    notes: v.optional(v.string()),
    ...auditFields,
  })
    .index("by_job", ["jobId"])
    .index("by_equipment", ["equipmentId"]),

  jobMaterials: defineTable({
    jobId: v.id("jobs"),
    priceBookItemId: v.optional(v.id("priceBookItems")),
    name: v.string(),
    description: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(), // cents
    totalPrice: v.number(), // cents
    ...auditFields,
  })
    .index("by_job", ["jobId"]),

  jobNotes: defineTable({
    jobId: v.id("jobs"),
    userId: v.id("users"),
    content: v.string(),
    isInternal: v.boolean(),
    ...softDeleteFields,
  })
    .index("by_job", ["jobId"]),

  // ==========================================================================
  // ESTIMATES
  // ==========================================================================

  estimates: defineTable({
    companyId: v.id("companies"),
    customerId: v.optional(v.id("customers")),
    propertyId: v.optional(v.id("properties")),
    jobId: v.optional(v.id("jobs")),

    estimateNumber: v.string(),
    title: v.string(),
    description: v.optional(v.string()),

    status: estimateStatus,

    // Financial (cents)
    subtotal: v.number(),
    taxRate: v.optional(v.number()),
    taxAmount: v.number(),
    discountAmount: v.number(),
    totalAmount: v.number(),

    validUntil: v.optional(v.number()),

    // Line items
    lineItems: v.array(v.any()),

    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),

    sentAt: v.optional(v.number()),
    viewedAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
    declinedAt: v.optional(v.number()),
    declineReason: v.optional(v.string()),

    customFields: v.optional(v.any()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_customer", ["customerId"])
    .index("by_job", ["jobId"])
    .index("by_estimate_number", ["companyId", "estimateNumber"]),

  // ==========================================================================
  // INVOICES
  // ==========================================================================

  invoices: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    propertyId: v.optional(v.id("properties")),
    jobId: v.optional(v.id("jobs")),
    estimateId: v.optional(v.id("estimates")),

    invoiceNumber: v.string(),
    title: v.string(),
    description: v.optional(v.string()),

    status: invoiceStatus,

    // Financial (cents)
    subtotal: v.number(),
    taxRate: v.optional(v.number()),
    taxAmount: v.number(),
    discountAmount: v.number(),
    totalAmount: v.number(),
    amountPaid: v.number(),
    amountDue: v.number(),

    dueDate: v.optional(v.number()),
    paymentTerms: v.optional(v.string()),

    lineItems: v.array(v.any()),

    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),

    sentAt: v.optional(v.number()),
    viewedAt: v.optional(v.number()),
    paidAt: v.optional(v.number()),

    customFields: v.optional(v.any()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_customer", ["customerId"])
    .index("by_job", ["jobId"])
    .index("by_invoice_number", ["companyId", "invoiceNumber"])
    .index("by_company_due_date", ["companyId", "dueDate"]),

  // ==========================================================================
  // PAYMENTS
  // ==========================================================================

  payments: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    invoiceId: v.optional(v.id("invoices")),
    jobId: v.optional(v.id("jobs")),

    paymentNumber: v.string(),
    referenceNumber: v.optional(v.string()),

    amount: v.number(), // cents
    paymentMethod: paymentMethod,
    paymentType: paymentType,

    // Card details
    cardBrand: v.optional(cardBrand),
    cardLast4: v.optional(v.string()),
    cardExpMonth: v.optional(v.number()),
    cardExpYear: v.optional(v.number()),
    checkNumber: v.optional(v.string()),
    bankName: v.optional(v.string()),

    // Processing
    status: paymentStatus,
    failureCode: v.optional(v.string()),
    failureMessage: v.optional(v.string()),

    // Processor
    processorName: v.optional(v.string()),
    processorTransactionId: v.optional(v.string()),
    processorFee: v.optional(v.number()), // cents
    netAmount: v.optional(v.number()), // cents
    processorMetadata: v.optional(v.any()),

    // Refund tracking
    refundedAmount: v.optional(v.number()), // cents
    refundReason: v.optional(v.string()),
    refundedAt: v.optional(v.number()),
    originalPaymentId: v.optional(v.id("payments")),

    // Receipt
    receiptUrl: v.optional(v.string()),
    receiptNumber: v.optional(v.string()),
    receiptEmailed: v.boolean(),
    receiptEmailedAt: v.optional(v.number()),

    // Team tracking
    processedBy: v.optional(v.id("users")),
    approvedBy: v.optional(v.id("users")),

    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),

    // Reconciliation
    isReconciled: v.boolean(),
    reconciledAt: v.optional(v.number()),
    reconciledBy: v.optional(v.id("users")),
    bankDepositDate: v.optional(v.number()),

    processedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_customer", ["customerId"])
    .index("by_invoice", ["invoiceId"])
    .index("by_payment_number", ["companyId", "paymentNumber"])
    .index("by_processor_transaction", ["processorTransactionId"]),

  // ==========================================================================
  // EQUIPMENT & SERVICE PLANS
  // ==========================================================================

  equipment: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    propertyId: v.id("properties"),

    equipmentNumber: v.string(),
    name: v.string(),
    type: equipmentType,
    category: v.optional(v.string()),

    // Manufacturer
    manufacturer: v.optional(v.string()),
    model: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    modelYear: v.optional(v.number()),

    // Installation
    installDate: v.optional(v.number()),
    installedBy: v.optional(v.id("users")),
    installJobId: v.optional(v.id("jobs")),

    // Warranty
    warrantyExpiration: v.optional(v.number()),
    warrantyProvider: v.optional(v.string()),
    warrantyNotes: v.optional(v.string()),
    isUnderWarranty: v.boolean(),

    // Service
    lastServiceDate: v.optional(v.number()),
    lastServiceJobId: v.optional(v.id("jobs")),
    nextServiceDue: v.optional(v.number()),
    serviceIntervalDays: v.optional(v.number()),
    servicePlanId: v.optional(v.id("servicePlans")),

    // Specifications
    capacity: v.optional(v.string()),
    efficiency: v.optional(v.string()),
    fuelType: v.optional(v.string()),
    location: v.optional(v.string()),

    // Condition
    condition: equipmentCondition,
    status: equipmentStatus,
    replacedDate: v.optional(v.number()),
    replacedByEquipmentId: v.optional(v.id("equipment")),

    // Media
    photos: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.any())),

    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),

    // Metrics
    totalServiceCount: v.optional(v.number()),
    totalServiceCost: v.optional(v.number()), // cents
    averageServiceCost: v.optional(v.number()), // cents

    searchText: v.optional(v.string()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_customer", ["customerId"])
    .index("by_property", ["propertyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_company_type", ["companyId", "type"])
    .index("by_equipment_number", ["companyId", "equipmentNumber"])
    .index("by_service_due", ["companyId", "nextServiceDue"])
    .searchIndex("search_equipment", {
      searchField: "searchText",
      filterFields: ["companyId", "status", "type"],
    }),

  servicePlans: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    propertyId: v.optional(v.id("properties")),

    planNumber: v.string(),
    name: v.string(),
    description: v.optional(v.string()),

    type: servicePlanType,
    frequency: servicePlanFrequency,
    visitsPerTerm: v.number(),

    // Dates
    startDate: v.number(),
    endDate: v.optional(v.number()),
    renewalType: renewalType,
    renewalNoticeDays: v.optional(v.number()),

    // Pricing (cents)
    price: v.number(),
    billingFrequency: v.optional(v.string()),
    taxable: v.boolean(),

    // Services
    includedServices: v.array(v.any()),
    includedEquipmentTypes: v.optional(v.array(v.string())),
    priceBookItemIds: v.optional(v.array(v.id("priceBookItems"))),

    // Scheduling
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.number(),
    autoGenerateJobs: v.boolean(),
    assignedTechnician: v.optional(v.id("users")),

    // Status
    status: servicePlanStatus,
    pausedAt: v.optional(v.number()),
    pausedReason: v.optional(v.string()),
    cancelledAt: v.optional(v.number()),
    cancelledReason: v.optional(v.string()),
    completedAt: v.optional(v.number()),

    // Terms
    terms: v.optional(v.string()),
    customerSignature: v.optional(v.string()),
    signedAt: v.optional(v.number()),
    signedByName: v.optional(v.string()),

    // Metrics
    totalVisitsCompleted: v.optional(v.number()),
    totalRevenue: v.optional(v.number()), // cents

    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_customer", ["customerId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_plan_number", ["companyId", "planNumber"])
    .index("by_next_service", ["companyId", "nextServiceDue"]),

  // ==========================================================================
  // COMMUNICATIONS
  // ==========================================================================

  communications: defineTable({
    companyId: v.id("companies"),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    estimateId: v.optional(v.id("estimates")),
    invoiceId: v.optional(v.id("invoices")),

    type: communicationType,
    direction: communicationDirection,
    channel: v.optional(v.string()),

    // From/To
    fromAddress: v.optional(v.string()),
    fromName: v.optional(v.string()),
    toAddress: v.string(),
    toName: v.optional(v.string()),
    ccAddresses: v.optional(v.array(v.string())),
    bccAddresses: v.optional(v.array(v.string())),

    // Content
    subject: v.optional(v.string()),
    body: v.string(),
    bodyHtml: v.optional(v.string()),
    bodyPlain: v.optional(v.string()),

    // Attachments
    attachments: v.optional(v.array(v.any())),
    attachmentCount: v.optional(v.number()),

    // Threading
    threadId: v.optional(v.string()),
    parentId: v.optional(v.id("communications")),
    isThreadStarter: v.boolean(),

    // Status
    status: communicationStatus,
    failureReason: v.optional(v.string()),
    retryCount: v.optional(v.number()),

    // Tracking
    readAt: v.optional(v.number()),
    openedAt: v.optional(v.number()),
    clickedAt: v.optional(v.number()),
    openCount: v.optional(v.number()),
    clickCount: v.optional(v.number()),

    // Phone specific
    callDuration: v.optional(v.number()),
    callRecordingUrl: v.optional(v.string()),
    callTranscript: v.optional(v.string()),
    callSentiment: v.optional(v.string()),

    // Team
    sentBy: v.optional(v.id("users")),
    assignedTo: v.optional(v.id("users")),

    // Provider
    providerMessageId: v.optional(v.string()),
    providerStatus: v.optional(v.string()),
    providerMetadata: v.optional(v.any()),

    cost: v.optional(v.number()), // cents

    // Automation
    templateId: v.optional(v.string()),
    automationWorkflowId: v.optional(v.string()),
    isAutomated: v.boolean(),

    // Categorization
    category: v.optional(v.string()),
    priority: communicationPriority,
    tags: v.optional(v.array(v.string())),

    isInternal: v.boolean(),
    isArchived: v.boolean(),

    sentAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_type", ["companyId", "type"])
    .index("by_customer", ["customerId"])
    .index("by_job", ["jobId"])
    .index("by_thread", ["threadId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_sent_by", ["sentBy"])
    .index("by_assigned", ["assignedTo"]),

  // ==========================================================================
  // NOTIFICATIONS
  // ==========================================================================

  notifications: defineTable({
    userId: v.id("users"),
    companyId: v.id("companies"),

    type: v.string(),
    title: v.string(),
    message: v.string(),

    // Related entity
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),

    // Action
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),

    // Status
    readAt: v.optional(v.number()),
    dismissedAt: v.optional(v.number()),

    // Additional data
    data: v.optional(v.any()),

    ...softDeleteFields,
  })
    .index("by_user", ["userId"])
    .index("by_company", ["companyId"])
    .index("by_user_unread", ["userId", "readAt"]),

  // ==========================================================================
  // SCHEDULING
  // ==========================================================================

  schedules: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    propertyId: v.id("properties"),
    jobId: v.optional(v.id("jobs")),
    servicePlanId: v.optional(v.id("servicePlans")),
    assignedTo: v.optional(v.id("users")),

    type: scheduleType,
    title: v.string(),
    description: v.optional(v.string()),

    // Time
    startTime: v.number(),
    endTime: v.number(),
    duration: v.number(), // minutes
    allDay: v.boolean(),

    // Dispatch
    dispatchTime: v.optional(v.number()),

    // Recurrence
    isRecurring: v.boolean(),
    recurrenceRule: v.optional(v.any()),
    parentScheduleId: v.optional(v.id("schedules")),
    recurrenceEndDate: v.optional(v.number()),

    // Status
    status: scheduleStatus,
    confirmedAt: v.optional(v.number()),
    confirmedBy: v.optional(v.string()),

    // Completion
    actualStartTime: v.optional(v.number()),
    actualEndTime: v.optional(v.number()),
    actualDuration: v.optional(v.number()),
    completedBy: v.optional(v.id("users")),

    // Reminders
    reminderSent: v.boolean(),
    reminderSentAt: v.optional(v.number()),
    reminderMethod: v.optional(v.string()),
    reminderHoursBefore: v.optional(v.number()),

    // Service
    serviceTypes: v.optional(v.array(v.string())),
    estimatedCost: v.optional(v.number()), // cents

    // Location
    location: v.optional(v.string()),
    accessInstructions: v.optional(v.string()),

    // Cancellation
    cancelledAt: v.optional(v.number()),
    cancelledBy: v.optional(v.id("users")),
    cancellationReason: v.optional(v.string()),
    rescheduledFromId: v.optional(v.id("schedules")),
    rescheduledToId: v.optional(v.id("schedules")),

    notes: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    metadata: v.optional(v.any()),
    color: v.optional(v.string()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_time", ["companyId", "startTime"])
    .index("by_assigned", ["assignedTo", "startTime"])
    .index("by_customer", ["customerId"])
    .index("by_job", ["jobId"])
    .index("by_company_status", ["companyId", "status"]),

  // ==========================================================================
  // INVENTORY & PRICE BOOK
  // ==========================================================================

  priceBookItems: defineTable({
    companyId: v.id("companies"),

    sku: v.string(),
    name: v.string(),
    description: v.optional(v.string()),

    type: priceBookItemType,
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),

    // Pricing (cents)
    unitPrice: v.number(),
    costPrice: v.optional(v.number()),
    laborHours: v.optional(v.number()),

    // Tax
    taxable: v.boolean(),
    taxRate: v.optional(v.number()),

    // Stock
    trackInventory: v.boolean(),

    // Status
    isActive: v.boolean(),

    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),

    searchText: v.optional(v.string()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_sku", ["companyId", "sku"])
    .index("by_company_type", ["companyId", "type"])
    .index("by_company_category", ["companyId", "category"])
    .searchIndex("search_price_book", {
      searchField: "searchText",
      filterFields: ["companyId", "type", "category", "isActive"],
    }),

  inventory: defineTable({
    companyId: v.id("companies"),
    priceBookItemId: v.id("priceBookItems"),

    // Stock
    quantityOnHand: v.number(),
    quantityReserved: v.number(),
    quantityAvailable: v.number(),
    minimumQuantity: v.optional(v.number()),
    maximumQuantity: v.optional(v.number()),
    reorderPoint: v.optional(v.number()),
    reorderQuantity: v.optional(v.number()),

    // Location
    warehouseLocation: v.optional(v.string()),
    primaryLocation: v.optional(v.string()),
    secondaryLocations: v.optional(v.array(v.string())),

    // Costing (cents)
    costPerUnit: v.optional(v.number()),
    totalCostValue: v.optional(v.number()),
    lastPurchaseCost: v.optional(v.number()),

    // Movement tracking
    lastRestockDate: v.optional(v.number()),
    lastRestockQuantity: v.optional(v.number()),
    lastRestockPurchaseOrderId: v.optional(v.id("purchaseOrders")),
    lastStockCheckDate: v.optional(v.number()),
    lastUsedDate: v.optional(v.number()),
    lastUsedJobId: v.optional(v.id("jobs")),

    // Alerts
    isLowStock: v.boolean(),
    lowStockAlertSent: v.boolean(),
    lowStockAlertSentAt: v.optional(v.number()),

    status: inventoryStatus,

    notes: v.optional(v.string()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_price_book_item", ["priceBookItemId"])
    .index("by_company_low_stock", ["companyId", "isLowStock"])
    .index("by_company_status", ["companyId", "status"]),

  purchaseOrders: defineTable({
    companyId: v.id("companies"),
    jobId: v.optional(v.id("jobs")),
    vendorId: v.optional(v.id("vendors")),

    poNumber: v.string(),
    vendor: v.string(),
    vendorEmail: v.optional(v.string()),
    vendorPhone: v.optional(v.string()),

    title: v.string(),
    description: v.optional(v.string()),

    status: purchaseOrderStatus,
    priority: jobPriority,

    requestedBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),

    lineItems: v.array(v.any()),

    // Financial (cents)
    subtotal: v.number(),
    taxAmount: v.number(),
    shippingAmount: v.number(),
    totalAmount: v.number(),

    expectedDelivery: v.optional(v.number()),
    actualDelivery: v.optional(v.number()),
    deliveryAddress: v.optional(v.string()),

    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    autoGenerated: v.boolean(),

    approvedAt: v.optional(v.number()),
    orderedAt: v.optional(v.number()),
    receivedAt: v.optional(v.number()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_job", ["jobId"])
    .index("by_vendor", ["vendorId"])
    .index("by_po_number", ["companyId", "poNumber"]),

  vendors: defineTable({
    companyId: v.id("companies"),

    name: v.string(),
    displayName: v.string(),
    vendorNumber: v.string(),

    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    secondaryPhone: v.optional(v.string()),
    website: v.optional(v.string()),

    address: v.optional(v.string()),
    address2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    country: v.optional(v.string()),

    taxId: v.optional(v.string()),
    paymentTerms: vendorPaymentTerms,
    creditLimit: v.optional(v.number()), // cents
    preferredPaymentMethod: v.optional(v.string()),

    category: v.optional(vendorCategory),

    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("active"), v.literal("inactive")),

    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    customFields: v.optional(v.any()),

    ...softDeleteFields,
    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_status", ["companyId", "status"])
    .index("by_vendor_number", ["companyId", "vendorNumber"]),

  // ==========================================================================
  // TAGS & ATTACHMENTS
  // ==========================================================================

  tags: defineTable({
    companyId: v.id("companies"),

    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),

    category: v.optional(tagCategory),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),

    usageCount: v.number(),
    lastUsedAt: v.optional(v.number()),

    isActive: v.boolean(),
    isSystem: v.boolean(),

    ...auditFields,
  })
    .index("by_company", ["companyId"])
    .index("by_company_slug", ["companyId", "slug"])
    .index("by_company_category", ["companyId", "category"]),

  attachments: defineTable({
    companyId: v.id("companies"),

    entityType: attachmentEntityType,
    entityId: v.string(), // Generic ID reference

    fileName: v.string(),
    originalFileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    fileExtension: v.optional(v.string()),

    // Convex file storage
    storageId: v.id("_storage"),

    // Metadata
    isImage: v.boolean(),
    isDocument: v.boolean(),
    isVideo: v.boolean(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    duration: v.optional(v.number()),
    thumbnailStorageId: v.optional(v.id("_storage")),

    category: v.optional(attachmentCategory),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),

    isPublic: v.boolean(),
    isInternal: v.boolean(),

    uploadedBy: v.id("users"),
    uploadedAt: v.number(),

    metadata: v.optional(v.any()),

    ...softDeleteFields,
  })
    .index("by_company", ["companyId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_uploaded_by", ["uploadedBy"]),

  // ==========================================================================
  // AUDIT & SYSTEM
  // ==========================================================================

  auditLogs: defineTable({
    companyId: v.id("companies"),
    userId: v.id("users"),

    action: v.string(), // "create", "update", "delete", "archive", etc.
    entityType: v.string(), // "customer", "job", etc.
    entityId: v.string(),

    changes: v.optional(v.any()), // { field: { old: x, new: y } }
    metadata: v.optional(v.any()),

    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_company", ["companyId"])
    .index("by_user", ["userId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_company_action", ["companyId", "action"]),

  roleChangeLogs: defineTable({
    teamMemberId: v.id("teamMembers"),
    changedBy: v.id("users"),
    oldRole: v.optional(userRole),
    newRole: userRole,
    reason: v.optional(v.string()),
  })
    .index("by_team_member", ["teamMemberId"]),

  // ==========================================================================
  // MIGRATION TRACKING
  // ==========================================================================

  migrationMappings: defineTable({
    tableName: v.string(),
    supabaseId: v.string(),
    convexId: v.string(),
    migratedAt: v.number(),
  })
    .index("by_table", ["tableName"])
    .index("by_supabase_id", ["tableName", "supabaseId"]),
});
