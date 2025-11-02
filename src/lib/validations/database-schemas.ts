/**
 * Zod Validation Schemas for Database Tables
 *
 * Provides type-safe validation for all database operations.
 * Use these schemas to validate user input before database operations.
 *
 * Usage:
 * ```typescript
 * import { customerInsertSchema } from "@/lib/validations/database-schemas";
 *
 * const result = customerInsertSchema.safeParse(formData);
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 */

import { z } from "zod";

// ============================================================================
// CUSTOMERS
// ============================================================================

export const customerInsertSchema = z.object({
  company_id: z.string().uuid(),
  user_id: z.string().uuid().optional().nullable(),
  type: z
    .enum(["residential", "commercial", "industrial"])
    .default("residential"),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  company_name: z.string().max(200).optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  alternate_phone: z.string().max(20).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(2).optional().nullable(),
  zip: z.string().max(10).optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  status: z.enum(["active", "inactive", "blocked"]).default("active"),
  source: z.string().max(100).optional().nullable(),
  referred_by: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  total_revenue: z.number().int().default(0),
  total_jobs: z.number().int().default(0),
  outstanding_balance: z.number().int().default(0),
  lifetime_value: z.number().int().default(0),
  average_job_value: z.number().int().default(0),
  last_job_date: z.date().optional().nullable(),
  next_service_due: z.date().optional().nullable(),
  portal_enabled: z.boolean().default(false),
  portal_invited_at: z.date().optional().nullable(),
  portal_last_login: z.date().optional().nullable(),
  billing_same_as_service: z.boolean().default(true),
  billing_address: z.string().max(500).optional().nullable(),
  billing_city: z.string().max(100).optional().nullable(),
  billing_state: z.string().max(2).optional().nullable(),
  billing_zip: z.string().max(10).optional().nullable(),
  tax_exempt: z.boolean().default(false),
  tax_id: z.string().max(50).optional().nullable(),
  preferred_contact_method: z
    .enum(["email", "phone", "sms", "any"])
    .optional()
    .nullable(),
  do_not_disturb: z.boolean().default(false),
  marketing_opt_in: z.boolean().default(true),
});

export const customerUpdateSchema = customerInsertSchema
  .partial()
  .omit({ company_id: true });

export const customerSelectSchema = customerInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// COMMUNICATIONS
// ============================================================================

export const communicationInsertSchema = z.object({
  company_id: z.string().uuid(),
  customer_id: z.string().uuid().optional().nullable(),
  job_id: z.string().uuid().optional().nullable(),
  invoice_id: z.string().uuid().optional().nullable(),
  user_id: z.string().uuid().optional().nullable(),
  type: z.enum(["email", "sms", "phone", "chat", "note"]),
  direction: z.enum(["inbound", "outbound"]),
  status: z
    .enum(["draft", "queued", "sending", "sent", "delivered", "failed", "read"])
    .default("draft"),
  subject: z.string().max(500).optional().nullable(),
  body: z.string().optional().nullable(),
  from_email: z.string().email().optional().nullable(),
  to_email: z.string().email().optional().nullable(),
  from_phone: z.string().max(20).optional().nullable(),
  to_phone: z.string().max(20).optional().nullable(),
  cc: z.array(z.string().email()).optional().nullable(),
  bcc: z.array(z.string().email()).optional().nullable(),
  thread_id: z.string().uuid().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  scheduled_for: z.date().optional().nullable(),
  sent_at: z.date().optional().nullable(),
  delivered_at: z.date().optional().nullable(),
  read_at: z.date().optional().nullable(),
  failed_at: z.date().optional().nullable(),
  failure_reason: z.string().optional().nullable(),
  retry_count: z.number().int().default(0),
  open_count: z.number().int().default(0),
  click_count: z.number().int().default(0),
  call_duration: z.number().int().optional().nullable(),
  call_recording_url: z.string().url().optional().nullable(),
  call_transcription: z.string().optional().nullable(),
  internal_note: z.boolean().default(false),
  pinned: z.boolean().default(false),
  tags: z.array(z.string()).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const communicationUpdateSchema = communicationInsertSchema
  .partial()
  .omit({ company_id: true });

export const communicationSelectSchema = communicationInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// PAYMENTS
// ============================================================================

export const paymentInsertSchema = z.object({
  company_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  invoice_id: z.string().uuid().optional().nullable(),
  job_id: z.string().uuid().optional().nullable(),
  payment_number: z.string().min(1, "Payment number is required").max(50),
  amount: z.number().int().min(1, "Amount must be greater than 0"), // In cents
  currency: z.string().length(3).default("USD"),
  payment_method: z.enum([
    "cash",
    "check",
    "credit_card",
    "debit_card",
    "ach",
    "wire",
    "venmo",
    "paypal",
    "other",
  ]),
  payment_type: z.enum(["payment", "refund", "credit"]).default("payment"),
  status: z
    .enum([
      "pending",
      "processing",
      "completed",
      "failed",
      "refunded",
      "partially_refunded",
      "cancelled",
    ])
    .default("pending"),
  card_brand: z
    .enum(["visa", "mastercard", "amex", "discover"])
    .optional()
    .nullable(),
  card_last4: z.string().length(4).optional().nullable(),
  card_exp_month: z.number().int().min(1).max(12).optional().nullable(),
  card_exp_year: z.number().int().min(2024).optional().nullable(),
  check_number: z.string().max(50).optional().nullable(),
  transaction_id: z.string().max(200).optional().nullable(),
  processor: z.string().max(50).optional().nullable(),
  processor_response: z.record(z.string(), z.unknown()).optional().nullable(),
  refunded_amount: z.number().int().default(0),
  original_payment_id: z.string().uuid().optional().nullable(),
  refund_reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_reconciled: z.boolean().default(false),
  reconciled_at: z.date().optional().nullable(),
  reconciled_by: z.string().uuid().optional().nullable(),
  deposit_date: z.date().optional().nullable(),
  bank_account_id: z.string().uuid().optional().nullable(),
  processed_at: z.date().optional().nullable(),
  processed_by: z.string().uuid().optional().nullable(),
});

export const paymentUpdateSchema = paymentInsertSchema
  .partial()
  .omit({ company_id: true, payment_number: true });

export const paymentSelectSchema = paymentInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// EQUIPMENT
// ============================================================================

export const equipmentInsertSchema = z.object({
  company_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  property_id: z.string().uuid().optional().nullable(),
  equipment_number: z.string().min(1, "Equipment number is required").max(50),
  type: z.enum(["hvac", "plumbing", "electrical", "appliance", "other"]),
  category: z.string().max(100).optional().nullable(),
  manufacturer: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  serial_number: z.string().max(100).optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  install_date: z.date().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  size: z.string().max(50).optional().nullable(),
  capacity: z.string().max(50).optional().nullable(),
  fuel_type: z.string().max(50).optional().nullable(),
  efficiency_rating: z.string().max(50).optional().nullable(),
  warranty_expiration: z.date().optional().nullable(),
  is_under_warranty: z.boolean().default(false),
  warranty_provider: z.string().max(100).optional().nullable(),
  warranty_notes: z.string().optional().nullable(),
  purchase_price: z.number().int().optional().nullable(),
  current_value: z.number().int().optional().nullable(),
  status: z
    .enum(["active", "inactive", "retired", "warranty", "needs_service"])
    .default("active"),
  condition: z
    .enum(["excellent", "good", "fair", "poor"])
    .optional()
    .nullable(),
  last_service_date: z.date().optional().nullable(),
  next_service_due: z.date().optional().nullable(),
  service_interval_months: z.number().int().optional().nullable(),
  service_plan_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const equipmentUpdateSchema = equipmentInsertSchema
  .partial()
  .omit({ company_id: true, equipment_number: true });

export const equipmentSelectSchema = equipmentInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// SCHEDULES
// ============================================================================

export const scheduleInsertSchema = z.object({
  company_id: z.string().uuid(),
  customer_id: z.string().uuid().optional().nullable(),
  job_id: z.string().uuid().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
  type: z
    .enum(["appointment", "task", "event", "block", "callback"])
    .default("appointment"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  start_time: z.date(),
  end_time: z.date(),
  duration: z.number().int().min(15), // In minutes
  all_day: z.boolean().default(false),
  status: z
    .enum([
      "scheduled",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "no_show",
    ])
    .default("scheduled"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  location: z.string().max(500).optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  is_recurring: z.boolean().default(false),
  recurrence_rule: z.record(z.string(), z.unknown()).optional().nullable(),
  parent_schedule_id: z.string().uuid().optional().nullable(),
  color: z.string().max(7).optional().nullable(),
  reminder_enabled: z.boolean().default(true),
  reminder_sent: z.boolean().default(false),
  reminder_hours_before: z.number().int().default(24),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const scheduleUpdateSchema = scheduleInsertSchema
  .partial()
  .omit({ company_id: true });

export const scheduleSelectSchema = scheduleInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// TAGS
// ============================================================================

export const tagInsertSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(1, "Tag name is required").max(50),
  slug: z.string().min(1).max(60),
  description: z.string().max(500).optional().nullable(),
  category: z
    .enum(["customer", "job", "equipment", "communication", "general"])
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
    .optional()
    .nullable(),
  icon: z.string().max(50).optional().nullable(),
  usage_count: z.number().int().default(0),
  is_system: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const tagUpdateSchema = tagInsertSchema
  .partial()
  .omit({ company_id: true, slug: true });

export const tagSelectSchema = tagInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

// ============================================================================
// ATTACHMENTS
// ============================================================================

export const attachmentInsertSchema = z.object({
  company_id: z.string().uuid(),
  entity_type: z.enum([
    "job",
    "customer",
    "invoice",
    "equipment",
    "communication",
    "estimate",
    "other",
  ]),
  entity_id: z.string().uuid(),
  file_name: z.string().min(1, "File name is required").max(255),
  file_size: z.number().int().min(1, "File size must be greater than 0"),
  mime_type: z.string().min(1, "MIME type is required").max(100),
  storage_url: z.string().url("Invalid storage URL"),
  storage_path: z.string().max(500).optional().nullable(),
  bucket: z.string().max(100).optional().nullable(),
  is_image: z.boolean().default(false),
  is_document: z.boolean().default(false),
  is_public: z.boolean().default(false),
  thumbnail_url: z.string().url().optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  alt_text: z.string().max(200).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  uploaded_by: z.string().uuid().optional().nullable(),
  uploaded_at: z.date().optional().nullable(),
});

export const attachmentUpdateSchema = attachmentInsertSchema
  .partial()
  .omit({ company_id: true, entity_type: true, entity_id: true });

export const attachmentSelectSchema = attachmentInsertSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// HELPER TYPES
// ============================================================================

export type CustomerInsert = z.infer<typeof customerInsertSchema>;
export type CustomerUpdate = z.infer<typeof customerUpdateSchema>;
export type CustomerSelect = z.infer<typeof customerSelectSchema>;

export type CommunicationInsert = z.infer<typeof communicationInsertSchema>;
export type CommunicationUpdate = z.infer<typeof communicationUpdateSchema>;
export type CommunicationSelect = z.infer<typeof communicationSelectSchema>;

export type PaymentInsert = z.infer<typeof paymentInsertSchema>;
export type PaymentUpdate = z.infer<typeof paymentUpdateSchema>;
export type PaymentSelect = z.infer<typeof paymentSelectSchema>;

export type EquipmentInsert = z.infer<typeof equipmentInsertSchema>;
export type EquipmentUpdate = z.infer<typeof equipmentUpdateSchema>;
export type EquipmentSelect = z.infer<typeof equipmentSelectSchema>;

export type ScheduleInsert = z.infer<typeof scheduleInsertSchema>;
export type ScheduleUpdate = z.infer<typeof scheduleUpdateSchema>;
export type ScheduleSelect = z.infer<typeof scheduleSelectSchema>;

export type TagInsert = z.infer<typeof tagInsertSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;
export type TagSelect = z.infer<typeof tagSelectSchema>;

export type AttachmentInsert = z.infer<typeof attachmentInsertSchema>;
export type AttachmentUpdate = z.infer<typeof attachmentUpdateSchema>;
export type AttachmentSelect = z.infer<typeof attachmentSelectSchema>;
