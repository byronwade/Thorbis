/**
 * Job Domain Schemas
 *
 * Zod validation schemas for job domain tables after refactoring.
 * The jobs table has been split into 11 focused domain tables for:
 * - Better performance (smaller queries)
 * - Improved security (fine-grained RLS)
 * - Easier maintenance (isolated domains)
 * - Better scalability (targeted optimizations)
 */

import { z } from "zod";

// ============================================================================
// JOB_FINANCIAL - Financial and billing information
// ============================================================================

const jobFinancialInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	total_amount: z.number().int().default(0),
	paid_amount: z.number().int().default(0),
	deposit_amount: z.number().int().default(0),
	deposit_paid_at: z.date().optional().nullable(),
	payment_terms: z.string().max(200).optional().nullable(),
	payment_due_date: z.date().optional().nullable(),
	invoice_generated_at: z.date().optional().nullable(),
});

const jobFinancialUpdateSchema = jobFinancialInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobFinancialSelectSchema = jobFinancialInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobFinancialInsert = z.infer<typeof jobFinancialInsertSchema>;
export type JobFinancialUpdate = z.infer<typeof jobFinancialUpdateSchema>;
export type JobFinancialSelect = z.infer<typeof jobFinancialSelectSchema>;

// ============================================================================
// JOB_WORKFLOW - Workflow and template information
// ============================================================================

const jobWorkflowInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	template_id: z.string().uuid().optional().nullable(),
	workflow_stage: z.string().max(100).optional().nullable(),
	workflow_completed_stages: z.array(z.any()).default([]),
	workflow_stage_changed_at: z.date().optional().nullable(),
});

const jobWorkflowUpdateSchema = jobWorkflowInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobWorkflowSelectSchema = jobWorkflowInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobWorkflowInsert = z.infer<typeof jobWorkflowInsertSchema>;
export type JobWorkflowUpdate = z.infer<typeof jobWorkflowUpdateSchema>;
export type JobWorkflowSelect = z.infer<typeof jobWorkflowSelectSchema>;

// ============================================================================
// JOB_TIME_TRACKING - Time tracking and labor hours
// ============================================================================

const jobTimeTrackingInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	technician_clock_in: z.date().optional().nullable(),
	technician_clock_out: z.date().optional().nullable(),
	actual_start: z.date().optional().nullable(),
	actual_end: z.date().optional().nullable(),
	total_labor_hours: z.number().default(0),
	estimated_labor_hours: z.number().optional().nullable(),
	break_time_minutes: z.number().int().default(0),
});

const jobTimeTrackingUpdateSchema = jobTimeTrackingInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobTimeTrackingSelectSchema = jobTimeTrackingInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobTimeTrackingInsert = z.infer<typeof jobTimeTrackingInsertSchema>;
export type JobTimeTrackingUpdate = z.infer<typeof jobTimeTrackingUpdateSchema>;
export type JobTimeTrackingSelect = z.infer<typeof jobTimeTrackingSelectSchema>;

// ============================================================================
// JOB_CUSTOMER_APPROVAL - Customer signatures and approval
// ============================================================================

const jobCustomerApprovalInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	customer_signature: z.any().optional().nullable(),
	customer_approval_status: z
		.enum(["pending", "approved", "rejected"])
		.default("pending"),
	customer_approval_timestamp: z.date().optional().nullable(),
	customer_notes: z.string().optional().nullable(),
});

const jobCustomerApprovalUpdateSchema = jobCustomerApprovalInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobCustomerApprovalSelectSchema = jobCustomerApprovalInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobCustomerApprovalInsert = z.infer<
	typeof jobCustomerApprovalInsertSchema
>;
export type JobCustomerApprovalUpdate = z.infer<
	typeof jobCustomerApprovalUpdateSchema
>;
export type JobCustomerApprovalSelect = z.infer<
	typeof jobCustomerApprovalSelectSchema
>;

// ============================================================================
// JOB_EQUIPMENT_SERVICE - Equipment service tracking
// ============================================================================

const jobEquipmentServiceInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	primary_equipment_id: z.string().uuid().optional().nullable(),
	equipment_service_history: z.array(z.any()).default([]),
	equipment_serviced: z.array(z.any()).default([]),
	job_warranty_info: z.any().optional().nullable(),
	job_service_agreement_id: z.string().uuid().optional().nullable(),
	job_recurrence_id: z.string().uuid().optional().nullable(),
});

const jobEquipmentServiceUpdateSchema = jobEquipmentServiceInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobEquipmentServiceSelectSchema = jobEquipmentServiceInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobEquipmentServiceInsert = z.infer<
	typeof jobEquipmentServiceInsertSchema
>;
export type JobEquipmentServiceUpdate = z.infer<
	typeof jobEquipmentServiceUpdateSchema
>;
export type JobEquipmentServiceSelect = z.infer<
	typeof jobEquipmentServiceSelectSchema
>;

// ============================================================================
// JOB_DISPATCH - Dispatch and routing information
// ============================================================================

const jobDispatchInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	dispatch_zone: z.string().max(100).optional().nullable(),
	travel_time_minutes: z.number().int().optional().nullable(),
	route_order: z.number().int().optional().nullable(),
	previous_job_id: z.string().uuid().optional().nullable(),
	next_job_id: z.string().uuid().optional().nullable(),
});

const jobDispatchUpdateSchema = jobDispatchInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobDispatchSelectSchema = jobDispatchInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobDispatchInsert = z.infer<typeof jobDispatchInsertSchema>;
export type JobDispatchUpdate = z.infer<typeof jobDispatchUpdateSchema>;
export type JobDispatchSelect = z.infer<typeof jobDispatchSelectSchema>;

// ============================================================================
// JOB_QUALITY - Quality metrics and inspections
// ============================================================================

const jobQualityInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	inspection_required: z.boolean().default(false),
	inspection_completed_at: z.date().optional().nullable(),
	quality_score: z.number().int().min(0).max(100).optional().nullable(),
	customer_satisfaction_rating: z
		.number()
		.int()
		.min(1)
		.max(5)
		.optional()
		.nullable(),
	quality_notes: z.string().optional().nullable(),
	internal_priority_score: z.number().int().optional().nullable(),
});

const jobQualityUpdateSchema = jobQualityInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobQualitySelectSchema = jobQualityInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobQualityInsert = z.infer<typeof jobQualityInsertSchema>;
export type JobQualityUpdate = z.infer<typeof jobQualityUpdateSchema>;
export type JobQualitySelect = z.infer<typeof jobQualitySelectSchema>;

// ============================================================================
// JOB_SAFETY - Safety and compliance information
// ============================================================================

const jobSafetyInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	requires_permit: z.boolean().default(false),
	permit_obtained_at: z.date().optional().nullable(),
	hazards_identified: z.string().optional().nullable(),
	safety_notes: z.string().optional().nullable(),
});

const jobSafetyUpdateSchema = jobSafetyInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobSafetySelectSchema = jobSafetyInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobSafetyInsert = z.infer<typeof jobSafetyInsertSchema>;
export type JobSafetyUpdate = z.infer<typeof jobSafetyUpdateSchema>;
export type JobSafetySelect = z.infer<typeof jobSafetySelectSchema>;

// ============================================================================
// JOB_AI_ENRICHMENT - AI-powered analysis
// ============================================================================

const jobAiEnrichmentInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	ai_categories: z.any().optional().nullable(),
	ai_equipment: z.any().optional().nullable(),
	ai_service_type: z.string().optional().nullable(),
	ai_priority_score: z.number().int().optional().nullable(),
	ai_tags: z.any().optional().nullable(),
	ai_processed_at: z.date().optional().nullable(),
});

const jobAiEnrichmentUpdateSchema = jobAiEnrichmentInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobAiEnrichmentSelectSchema = jobAiEnrichmentInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobAiEnrichmentInsert = z.infer<typeof jobAiEnrichmentInsertSchema>;
export type JobAiEnrichmentUpdate = z.infer<typeof jobAiEnrichmentUpdateSchema>;
export type JobAiEnrichmentSelect = z.infer<typeof jobAiEnrichmentSelectSchema>;

// ============================================================================
// JOB_MULTI_ENTITY - Multi-customer/property support
// ============================================================================

const jobMultiEntityInsertSchema = z.object({
	job_id: z.string().uuid(),
	company_id: z.string().uuid(),
	primary_customer_id: z.string().uuid().optional().nullable(),
	primary_property_id: z.string().uuid().optional().nullable(),
	requires_multiple_properties: z.boolean().default(false),
	requires_multiple_customers: z.boolean().default(false),
	deleted_by: z.string().uuid().optional().nullable(),
	permanent_delete_scheduled_at: z.date().optional().nullable(),
});

const jobMultiEntityUpdateSchema = jobMultiEntityInsertSchema
	.partial()
	.omit({ job_id: true, company_id: true });

const jobMultiEntitySelectSchema = jobMultiEntityInsertSchema.extend({
	id: z.string().uuid(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type JobMultiEntityInsert = z.infer<typeof jobMultiEntityInsertSchema>;
export type JobMultiEntityUpdate = z.infer<typeof jobMultiEntityUpdateSchema>;
export type JobMultiEntitySelect = z.infer<typeof jobMultiEntitySelectSchema>;

// ============================================================================
// COMPOSITE TYPE - Complete job with all domains
// ============================================================================

const jobCompleteSchema = z.object({
	// Core job
	id: z.string().uuid(),
	company_id: z.string().uuid(),
	job_number: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	status: z.enum([
		"quoted",
		"scheduled",
		"in_progress",
		"on_hold",
		"completed",
		"cancelled",
		"archived",
	]),
	priority: z.enum(["low", "medium", "high", "urgent"]),
	job_type: z.string().nullable(),
	service_type: z.string().nullable(),
	property_id: z.string().uuid().nullable(),
	customer_id: z.string().uuid().nullable(),
	assigned_to: z.string().uuid().nullable(),
	scheduled_start: z.date().nullable(),
	scheduled_end: z.date().nullable(),
	notes: z.string().nullable(),
	metadata: z.any().nullable(),
	created_at: z.date(),
	updated_at: z.date(),
	deleted_at: z.date().nullable(),
	archived_at: z.date().nullable(),
	search_vector: z.any().nullable(),

	// Domain data (all optional - may not be loaded)
	financial: jobFinancialSelectSchema.optional().nullable(),
	workflow: jobWorkflowSelectSchema.optional().nullable(),
	timeTracking: jobTimeTrackingSelectSchema.optional().nullable(),
	customerApproval: jobCustomerApprovalSelectSchema.optional().nullable(),
	equipmentService: jobEquipmentServiceSelectSchema.optional().nullable(),
	dispatch: jobDispatchSelectSchema.optional().nullable(),
	quality: jobQualitySelectSchema.optional().nullable(),
	safety: jobSafetySelectSchema.optional().nullable(),
	aiEnrichment: jobAiEnrichmentSelectSchema.optional().nullable(),
	multiEntity: jobMultiEntitySelectSchema.optional().nullable(),
});

export type JobComplete = z.infer<typeof jobCompleteSchema>;

// ============================================================================
// HELPER FUNCTIONS - Build complete job queries
// ============================================================================

/**
 * Get the Supabase select string for a complete job with all domains
 *
 * Usage:
 * ```typescript
 * const { data } = await supabase
 *   .from('jobs')
 *   .select(getJobCompleteSelect())
 *   .eq('id', jobId)
 *   .single();
 * ```
 */
function getJobCompleteSelect(): string {
	return `
		*,
		financial:job_financial(*),
		workflow:job_workflow(*),
		timeTracking:job_time_tracking(*),
		customerApproval:job_customer_approval(*),
		equipmentService:job_equipment_service(*),
		dispatch:job_dispatch(*),
		quality:job_quality(*),
		safety:job_safety(*),
		aiEnrichment:job_ai_enrichment(*),
		multiEntity:job_multi_entity(*)
	`
		.trim()
		.replace(/\s+/g, " ");
}

/**
 * Get a minimal job select (for list views)
 * Only includes core fields + financial for display
 */
function getJobListSelect(): string {
	return `
		*,
		financial:job_financial(total_amount, paid_amount)
	`
		.trim()
		.replace(/\s+/g, " ");
}

/**
 * Get job select for specific domains
 *
 * @param domains - Array of domain names to include
 *
 * Usage:
 * ```typescript
 * getJobWithDomains(['financial', 'workflow', 'timeTracking'])
 * ```
 */
export function getJobWithDomains(
	domains: Array<
		| "financial"
		| "workflow"
		| "timeTracking"
		| "customerApproval"
		| "equipmentService"
		| "dispatch"
		| "quality"
		| "safety"
		| "aiEnrichment"
		| "multiEntity"
	>,
): string {
	const domainMap = {
		financial: "financial:job_financial(*)",
		workflow: "workflow:job_workflow(*)",
		timeTracking: "timeTracking:job_time_tracking(*)",
		customerApproval: "customerApproval:job_customer_approval(*)",
		equipmentService: "equipmentService:job_equipment_service(*)",
		dispatch: "dispatch:job_dispatch(*)",
		quality: "quality:job_quality(*)",
		safety: "safety:job_safety(*)",
		aiEnrichment: "aiEnrichment:job_ai_enrichment(*)",
		multiEntity: "multiEntity:job_multi_entity(*)",
	};

	const selects = ["*", ...domains.map((d) => domainMap[d])];
	return selects.join(", ");
}
