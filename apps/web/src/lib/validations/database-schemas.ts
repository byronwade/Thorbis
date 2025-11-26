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

const customerInsertSchema = z.object({
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

const customerUpdateSchema = customerInsertSchema
	.partial()
	.omit({ company_id: true });

const customerSelectSchema = customerInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
	deleted_at: z.date().nullable(),
	deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// COMMUNICATIONS
// ============================================================================

const communicationInsertSchema = z.object({
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

const communicationUpdateSchema = communicationInsertSchema
	.partial()
	.omit({ company_id: true });

const communicationSelectSchema = communicationInsertSchema.extend({
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
	processor_name: z.string().max(50).optional().nullable(),
	processor_transaction_id: z.string().max(200).optional().nullable(),
	processor_fee: z.number().int().default(0),
	net_amount: z.number().int().default(0),
	processor_metadata: z.record(z.string(), z.unknown()).optional().nullable(),
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

const paymentSelectSchema = paymentInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
	deleted_at: z.date().nullable(),
	deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// EQUIPMENT
// ============================================================================

const equipmentInsertSchema = z.object({
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

const equipmentUpdateSchema = equipmentInsertSchema
	.partial()
	.omit({ company_id: true, equipment_number: true });

const equipmentSelectSchema = equipmentInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
	deleted_at: z.date().nullable(),
	deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// SCHEDULES
// ============================================================================

const scheduleInsertSchema = z.object({
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
	// Dispatch and completion tracking
	dispatch_time: z.union([z.date(), z.string()]).optional().nullable(),
	actual_start_time: z.union([z.date(), z.string()]).optional().nullable(),
	actual_end_time: z.union([z.date(), z.string()]).optional().nullable(),
	actual_duration: z.number().int().optional().nullable(),
});

const scheduleUpdateSchema = scheduleInsertSchema
	.partial()
	.omit({ company_id: true });

const scheduleSelectSchema = scheduleInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
	deleted_at: z.date().nullable(),
	deleted_by: z.string().uuid().nullable(),
});

// ============================================================================
// TAGS
// ============================================================================

const tagInsertSchema = z.object({
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

const tagUpdateSchema = tagInsertSchema
	.partial()
	.omit({ company_id: true, slug: true });

const tagSelectSchema = tagInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

// ============================================================================
// ATTACHMENTS
// ============================================================================

const attachmentInsertSchema = z.object({
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

const attachmentUpdateSchema = attachmentInsertSchema
	.partial()
	.omit({ company_id: true, entity_type: true, entity_id: true });

const attachmentSelectSchema = attachmentInsertSchema.extend({
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

// ============================================================================
// JOB TIME ENTRIES
// ============================================================================

const jobTimeEntryInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	user_id: z.string().uuid(),
	clock_in: z.date(),
	clock_out: z.date().optional().nullable(),
	break_minutes: z.number().int().min(0).max(1439).default(0),
	clock_in_location: z
		.object({
			lat: z.number(),
			lng: z.number(),
			accuracy: z.number().optional(),
			address: z.string().optional(),
		})
		.optional()
		.nullable(),
	clock_out_location: z
		.object({
			lat: z.number(),
			lng: z.number(),
			accuracy: z.number().optional(),
			address: z.string().optional(),
		})
		.optional()
		.nullable(),
	gps_verified: z.boolean().default(false),
	entry_type: z.enum(["manual", "auto", "gps"]).default("manual"),
	notes: z.string().optional().nullable(),
	is_overtime: z.boolean().default(false),
	is_billable: z.boolean().default(true),
	hourly_rate: z.number().int().optional().nullable(),
	metadata: z.any().optional().nullable(),
});

const jobTimeEntryUpdateSchema = jobTimeEntryInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true, user_id: true });

const jobTimeEntrySelectSchema = jobTimeEntryInsertSchema.extend({
	id: z.string().uuid(),
	total_hours: z.number().optional().nullable(),
	created_at: z.date(),
	updated_at: z.date(),
});

// ============================================================================
// JOB PHOTOS
// ============================================================================

const jobPhotoInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	uploaded_by: z.string().uuid(),
	storage_path: z.string().min(1, "Storage path is required"),
	thumbnail_path: z.string().optional().nullable(),
	file_name: z.string().min(1, "File name is required").max(255),
	file_size: z.number().int().min(1).max(52_428_800), // 50MB max
	mime_type: z.string().optional().nullable(),
	category: z.enum([
		"before",
		"during",
		"after",
		"issue",
		"equipment",
		"completion",
		"other",
	]),
	subcategory: z.string().max(100).optional().nullable(),
	title: z.string().max(200).optional().nullable(),
	description: z.string().optional().nullable(),
	is_customer_visible: z.boolean().default(true),
	is_required_photo: z.boolean().default(false),
	photo_location: z
		.object({
			lat: z.number(),
			lng: z.number(),
			accuracy: z.number().optional(),
			address: z.string().optional(),
		})
		.optional()
		.nullable(),
	taken_at: z.date().optional().nullable(),
	device_info: z.any().optional().nullable(),
	exif_data: z.any().optional().nullable(),
	annotations: z.array(z.any()).optional().nullable(),
	tags: z.array(z.string()).optional().nullable(),
	display_order: z.number().int().default(0),
	metadata: z.any().optional().nullable(),
});

const jobPhotoUpdateSchema = jobPhotoInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true, uploaded_by: true });

const jobPhotoSelectSchema = jobPhotoInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

// ============================================================================
// JOB WORKFLOW STAGES
// ============================================================================

const jobWorkflowStageInsertSchema = z.object({
	company_id: z.string().uuid(),
	stage_name: z.string().min(1, "Stage name is required").max(100),
	stage_key: z.string().min(1, "Stage key is required").max(100),
	display_order: z.number().int().min(0).default(0),
	stage_color: z.string().max(20).optional().nullable(),
	stage_icon: z.string().max(50).optional().nullable(),
	is_start_stage: z.boolean().default(false),
	is_end_stage: z.boolean().default(false),
	requires_approval: z.boolean().default(false),
	approval_roles: z.array(z.any()).optional().nullable(),
	required_fields: z.array(z.string()).optional().nullable(),
	required_photos_count: z.number().int().min(0).default(0),
	required_time_entry: z.boolean().default(false),
	auto_send_email: z.boolean().default(false),
	email_template_id: z.string().uuid().optional().nullable(),
	auto_send_sms: z.boolean().default(false),
	sms_template_id: z.string().uuid().optional().nullable(),
	auto_create_invoice: z.boolean().default(false),
	allowed_next_stages: z.array(z.string()).optional().nullable(),
	industry_type: z.string().max(50).optional().nullable(),
	is_active: z.boolean().default(true),
	metadata: z.any().optional().nullable(),
});

const jobWorkflowStageUpdateSchema = jobWorkflowStageInsertSchema
	.partial()
	.omit({ company_id: true });

const jobWorkflowStageSelectSchema = jobWorkflowStageInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

// ============================================================================
// JOB SIGNATURES
// ============================================================================

const jobSignatureInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	signature_type: z.enum([
		"customer",
		"technician",
		"inspector",
		"supervisor",
		"other",
	]),
	signer_name: z.string().min(1, "Signer name is required").max(200),
	signer_email: z.string().email().optional().nullable(),
	signer_phone: z.string().max(20).optional().nullable(),
	signer_role: z.string().max(100).optional().nullable(),
	signature_data_url: z.string().min(1, "Signature data is required"),
	signature_hash: z.string().optional().nullable(),
	signed_at: z.date().default(() => new Date()),
	signed_location: z
		.object({
			lat: z.number(),
			lng: z.number(),
			accuracy: z.number().optional(),
			address: z.string().optional(),
		})
		.optional()
		.nullable(),
	ip_address: z.string().max(45).optional().nullable(),
	user_agent: z.string().optional().nullable(),
	device_info: z.any().optional().nullable(),
	document_type: z.enum([
		"job_completion",
		"estimate",
		"change_order",
		"work_authorization",
		"inspection",
		"other",
	]),
	document_content: z.any().optional().nullable(),
	agreement_text: z.string().optional().nullable(),
	is_verified: z.boolean().default(false),
	verified_at: z.date().optional().nullable(),
	verified_by: z.string().uuid().optional().nullable(),
	metadata: z.any().optional().nullable(),
});

const jobSignatureUpdateSchema = jobSignatureInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobSignatureSelectSchema = jobSignatureInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
});

// ============================================================================
// ENHANCED JOBS SCHEMA
// ============================================================================

/**
 * Job Insert Schema - REFACTORED
 *
 * After domain table refactoring, this schema only includes core job fields.
 * Domain-specific fields have been moved to separate tables and schemas:
 * - job_financial - Financial data
 * - job_workflow - Workflow/template data
 * - job_time_tracking - Time tracking data
 * - job_customer_approval - Customer signatures/approval
 * - job_equipment_service - Equipment service tracking
 * - job_dispatch - Dispatch/routing data
 * - job_quality - Quality metrics
 * - job_safety - Safety/compliance data
 * - job_ai_enrichment - AI analysis
 * - job_multi_entity - Multi-customer/property support
 *
 * See /src/lib/validations/job-domain-schemas.ts for domain schemas
 */
const jobInsertSchema = z.object({
	// Core identity
	company_id: z.string().uuid(),
	job_number: z.string().min(1, "Job number is required").max(50),
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().optional().nullable(),

	// Classification
	status: z
		.enum([
			"quoted",
			"scheduled",
			"in_progress",
			"on_hold",
			"completed",
			"cancelled",
			"archived",
		])
		.default("quoted"),
	priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
	job_type: z.string().max(100).optional().nullable(),
	service_type: z.string().max(100).optional().nullable(),

	// Primary relationships
	property_id: z.string().uuid().optional().nullable(),
	customer_id: z.string().uuid().optional().nullable(),
	assigned_to: z.string().uuid().optional().nullable(),

	// Scheduling (core scheduling only - actual times moved to job_time_tracking)
	scheduled_start: z.date().optional().nullable(),
	scheduled_end: z.date().optional().nullable(),

	// Flexible data
	notes: z.string().optional().nullable(),
	metadata: z.any().optional().nullable(),
});

const jobUpdateSchema = jobInsertSchema.partial().omit({ company_id: true });

const jobSelectSchema = jobInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
	deleted_at: z.date().nullable(),
	archived_at: z.date().nullable(),
	search_vector: z.any().nullable(),
});

// ============================================================================
// HELPER TYPES
// ============================================================================

export type JobTimeEntryInsert = z.infer<typeof jobTimeEntryInsertSchema>;
export type JobTimeEntryUpdate = z.infer<typeof jobTimeEntryUpdateSchema>;
export type JobTimeEntrySelect = z.infer<typeof jobTimeEntrySelectSchema>;

export type JobPhotoInsert = z.infer<typeof jobPhotoInsertSchema>;
export type JobPhotoUpdate = z.infer<typeof jobPhotoUpdateSchema>;
export type JobPhotoSelect = z.infer<typeof jobPhotoSelectSchema>;

export type JobWorkflowStageInsert = z.infer<
	typeof jobWorkflowStageInsertSchema
>;
export type JobWorkflowStageUpdate = z.infer<
	typeof jobWorkflowStageUpdateSchema
>;
export type JobWorkflowStageSelect = z.infer<
	typeof jobWorkflowStageSelectSchema
>;

export type JobSignatureInsert = z.infer<typeof jobSignatureInsertSchema>;
export type JobSignatureUpdate = z.infer<typeof jobSignatureUpdateSchema>;
export type JobSignatureSelect = z.infer<typeof jobSignatureSelectSchema>;

export type JobInsert = z.infer<typeof jobInsertSchema>;
export type JobUpdate = z.infer<typeof jobUpdateSchema>;
export type JobSelect = z.infer<typeof jobSelectSchema>;

// ============================================================================
// VENDORS
// ============================================================================

export const vendorInsertSchema = z.object({
	company_id: z.string().uuid(),
	name: z.string().min(1, "Vendor name is required").max(200),
	display_name: z.string().min(1, "Display name is required").max(200),
	vendor_number: z.string().min(1, "Vendor number is required").max(50),
	email: z.string().email("Invalid email address").optional().nullable(),
	phone: z.string().max(20).optional().nullable(),
	secondary_phone: z.string().max(20).optional().nullable(),
	website: z.string().url("Invalid URL").optional().nullable(),
	address: z.string().max(500).optional().nullable(),
	address2: z.string().max(500).optional().nullable(),
	city: z.string().max(100).optional().nullable(),
	state: z.string().max(100).optional().nullable(),
	zip_code: z.string().max(20).optional().nullable(),
	country: z.string().max(100).default("USA"),
	tax_id: z.string().max(50).optional().nullable(),
	payment_terms: z
		.enum(["net_15", "net_30", "net_60", "due_on_receipt", "custom"])
		.default("net_30"),
	credit_limit: z.number().int().min(0).default(0), // In cents
	preferred_payment_method: z
		.enum(["check", "ach", "credit_card", "wire"])
		.optional()
		.nullable(),
	category: z
		.enum([
			"supplier",
			"distributor",
			"manufacturer",
			"service_provider",
			"other",
		])
		.optional()
		.nullable(),
	tags: z.array(z.string()).optional().nullable(),
	status: z.enum(["active", "inactive"]).default("active"),
	notes: z.string().optional().nullable(),
	internal_notes: z.string().optional().nullable(),
	custom_fields: z.record(z.string(), z.any()).optional().nullable(),
});

export const vendorUpdateSchema = vendorInsertSchema
	.partial()
	.omit({ company_id: true });

const vendorSelectSchema = vendorInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
	deleted_at: z.date().optional().nullable(),
	deleted_by: z.string().uuid().optional().nullable(),
});

// ============================================================================
// PURCHASE ORDERS
// ============================================================================

const purchaseOrderLineItemSchema = z.object({
	id: z.string().uuid().optional(),
	description: z.string().min(1, "Description is required"),
	quantity: z.number().positive("Quantity must be positive"),
	unit_price: z.number().nonnegative("Unit price must be non-negative"), // In cents
	total: z.number().nonnegative("Total must be non-negative"), // In cents
});

export const purchaseOrderInsertSchema = z.object({
	company_id: z.string().uuid(),
	job_id: z.string().uuid().optional().nullable(),
	estimate_id: z.string().uuid().optional().nullable(),
	invoice_id: z.string().uuid().optional().nullable(),
	requested_by: z.string().uuid(),
	approved_by: z.string().uuid().optional().nullable(),
	vendor_id: z.string().uuid().optional().nullable(),
	vendor: z.string().min(1, "Vendor name is required").max(200),
	vendor_email: z.string().email("Invalid email address").optional().nullable(),
	vendor_phone: z.string().max(20).optional().nullable(),
	po_number: z.string().min(1, "PO number is required").max(100),
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().optional().nullable(),
	status: z
		.enum([
			"draft",
			"pending_approval",
			"approved",
			"ordered",
			"partially_received",
			"received",
			"cancelled",
		])
		.default("draft"),
	priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
	line_items: z
		.array(purchaseOrderLineItemSchema)
		.min(1, "At least one line item is required"),
	subtotal: z.number().int().nonnegative().default(0), // In cents
	tax_amount: z.number().int().nonnegative().default(0), // In cents
	shipping_amount: z.number().int().nonnegative().default(0), // In cents
	total_amount: z.number().int().nonnegative().default(0), // In cents
	expected_delivery: z.date().optional().nullable(),
	actual_delivery: z.date().optional().nullable(),
	delivery_address: z.string().max(500).optional().nullable(),
	notes: z.string().optional().nullable(),
	internal_notes: z.string().optional().nullable(),
	auto_generated: z.boolean().default(false),
});

const purchaseOrderUpdateSchema = purchaseOrderInsertSchema
	.partial()
	.omit({ company_id: true });

const purchaseOrderSelectSchema = purchaseOrderInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
	approved_at: z.date().optional().nullable(),
	ordered_at: z.date().optional().nullable(),
	received_at: z.date().optional().nullable(),
});

// ============================================================================
// HELPER TYPES
// ============================================================================

export type VendorInsert = z.infer<typeof vendorInsertSchema>;
export type VendorUpdate = z.infer<typeof vendorUpdateSchema>;
export type VendorSelect = z.infer<typeof vendorSelectSchema>;

export type PurchaseOrderLineItem = z.infer<typeof purchaseOrderLineItemSchema>;
export type PurchaseOrderInsert = z.infer<typeof purchaseOrderInsertSchema>;
export type PurchaseOrderUpdate = z.infer<typeof purchaseOrderUpdateSchema>;
export type PurchaseOrderSelect = z.infer<typeof purchaseOrderSelectSchema>;
