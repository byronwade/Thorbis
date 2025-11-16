/**
 * Jobs Server Actions
 *
 * Handles job/work order management with comprehensive CRUD operations,
 * status transitions, scheduling, and assignment logic.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	ActionError,
	ERROR_CODES,
	ERROR_MESSAGES,
} from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { notifyJobCreated } from "@/lib/notifications/triggers";
import { createClient } from "@/lib/supabase/server";

// Regex constants
const JOB_NUMBER_REGEX = /JOB-\d{4}-(\d+)/;

// Validation Schemas
const createJobSchema = z.object({
	propertyId: z.string().uuid("Invalid property ID"),
	customerId: z.string().uuid("Invalid customer ID").optional(),
	title: z.string().min(1, "Job title is required"),
	description: z.string().optional(),
	priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
	jobType: z
		.enum([
			"service",
			"installation",
			"repair",
			"maintenance",
			"inspection",
			"consultation",
		])
		.optional(),
	scheduledStart: z.string().optional(),
	scheduledEnd: z.string().optional(),
	assignedTo: z.string().uuid("Invalid user ID").optional(),
	notes: z.string().optional(),
	// Enhanced scheduling fields
	isRecurring: z.boolean().optional(),
	schedulingMode: z.enum(["specific", "window"]).optional(),
	timeWindow: z.string().optional(),
	recurrenceType: z
		.enum(["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"])
		.optional(),
	recurrenceEndDate: z.string().optional(),
	recurrenceCount: z.number().int().min(1).max(365).optional(),
});

const updateJobSchema = z.object({
	title: z.string().min(1, "Job title is required").optional(),
	description: z.string().optional(),
	status: z
		.enum([
			"quoted",
			"scheduled",
			"in_progress",
			"on_hold",
			"completed",
			"cancelled",
		])
		.optional(),
	priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
	jobType: z
		.enum([
			"service",
			"installation",
			"repair",
			"maintenance",
			"inspection",
			"consultation",
		])
		.optional(),
	notes: z.string().optional(),
	// Financial fields (moved to job_financial table)
	totalAmount: z.number().min(0).optional(),
	paidAmount: z.number().min(0).optional(),
	depositAmount: z.number().min(0).optional(),
	scheduledStart: z.string().optional(),
	scheduledEnd: z.string().optional(),
	assignedTo: z.string().uuid("Invalid user ID").optional().nullable(),
	customerId: z.string().uuid("Invalid customer ID").optional().nullable(),
	propertyId: z.string().uuid("Invalid property ID").optional().nullable(),
});

const scheduleJobSchema = z.object({
	scheduledStart: z.string(),
	scheduledEnd: z.string(),
});

/**
 * Generate unique job number
 */
async function generateJobNumber(
	supabase: any,
	companyId: string,
): Promise<string> {
	// Get the latest job number for this company
	const { data: latestJob } = await supabase
		.from("jobs")
		.select("job_number")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (!latestJob) {
		return `JOB-${new Date().getFullYear()}-001`;
	}

	// Extract number from format: JOB-YYYY-NNN
	const match = latestJob.job_number.match(JOB_NUMBER_REGEX);
	if (match) {
		const nextNumber = Number.parseInt(match[1], 10) + 1;
		return `JOB-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, "0")}`;
	}

	// Fallback
	return `JOB-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
}

/**
 * Calculate next recurrence date
 */
function calculateNextRecurrence(
	currentDate: Date,
	recurrenceType: string,
): Date {
	const nextDate = new Date(currentDate);

	switch (recurrenceType) {
		case "daily":
			nextDate.setDate(nextDate.getDate() + 1);
			break;
		case "weekly":
			nextDate.setDate(nextDate.getDate() + 7);
			break;
		case "biweekly":
			nextDate.setDate(nextDate.getDate() + 14);
			break;
		case "monthly":
			nextDate.setMonth(nextDate.getMonth() + 1);
			break;
		case "quarterly":
			nextDate.setMonth(nextDate.getMonth() + 3);
			break;
		case "yearly":
			nextDate.setFullYear(nextDate.getFullYear() + 1);
			break;
		default:
			// Default to monthly if unknown type
			nextDate.setMonth(nextDate.getMonth() + 1);
			break;
	}

	return nextDate;
}

/**
 * Create recurring jobs
 */
async function createRecurringJobs(
	supabase: any,
	companyId: string,
	baseJob: any,
	recurrenceType: string,
	recurrenceEndDate?: string,
	recurrenceCount?: number,
): Promise<void> {
	if (!baseJob.scheduled_start) {
		return; // Can't create recurring jobs without a start date
	}

	const startDate = new Date(baseJob.scheduled_start);
	const endDate = new Date(baseJob.scheduled_end || baseJob.scheduled_start);
	const duration = endDate.getTime() - startDate.getTime();

	// Determine how many occurrences to create
	const maxOccurrences = recurrenceCount || 52; // Default to 1 year of weekly jobs
	const endDateLimit = recurrenceEndDate ? new Date(recurrenceEndDate) : null;

	const recurringJobs: (typeof baseJob)[] = [];
	let currentDate = new Date(startDate);

	for (let i = 0; i < maxOccurrences - 1; i++) {
		// -1 because we already created the first job
		currentDate = calculateNextRecurrence(currentDate, recurrenceType);

		// Stop if we've reached the end date
		if (endDateLimit && currentDate > endDateLimit) {
			break;
		}

		const currentEndDate = new Date(currentDate.getTime() + duration);

		// Generate a unique job number for this occurrence
		const jobNumber = await generateJobNumber(supabase, companyId);

		recurringJobs.push({
			...baseJob,
			job_number: jobNumber,
			scheduled_start: currentDate.toISOString(),
			scheduled_end: currentEndDate.toISOString(),
			title: `${baseJob.title} (${i + 2}/${maxOccurrences})`, // Add occurrence number
		});

		// Create jobs in batches of 10 to avoid memory issues
		if (recurringJobs.length >= 10) {
			await supabase.from("jobs").insert(recurringJobs);
			recurringJobs.length = 0; // Clear array
		}
	}

	// Insert any remaining jobs
	if (recurringJobs.length > 0) {
		await supabase.from("jobs").insert(recurringJobs);
	}
}

/**
 * Create a new job
 */
export async function createJob(
	formData: FormData,
): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		const data = createJobSchema.parse({
			propertyId: formData.get("propertyId"),
			customerId: formData.get("customerId") || undefined,
			title: formData.get("title"),
			description: formData.get("description") || undefined,
			priority: formData.get("priority") || "medium",
			jobType: formData.get("jobType") || undefined,
			scheduledStart: formData.get("scheduledStart") || undefined,
			scheduledEnd: formData.get("scheduledEnd") || undefined,
			assignedTo: formData.get("assignedTo") || undefined,
			notes: formData.get("notes") || undefined,
			// Enhanced scheduling fields
			isRecurring: formData.get("isRecurring") === "true",
			schedulingMode: (formData.get("schedulingMode") as any) || undefined,
			timeWindow: formData.get("timeWindow") || undefined,
			recurrenceType: (formData.get("recurrenceType") as any) || undefined,
			recurrenceEndDate: formData.get("recurrenceEndDate") || undefined,
			recurrenceCount: formData.get("recurrenceCount")
				? Number.parseInt(formData.get("recurrenceCount") as string, 10)
				: undefined,
		});

		// Verify property belongs to company
		const { data: property } = await supabase
			.from("properties")
			.select("company_id, customer_id, address")
			.eq("id", data.propertyId)
			.single();

		assertExists(property, "Property");

		if (property.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("property"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Use customer from property if not provided
		const customerId = data.customerId || property.customer_id;

		// Generate unique job number
		const jobNumber = await generateJobNumber(supabase, teamMember.company_id);

		// Add time window info to notes if applicable
		let jobNotes = data.notes || "";
		if (data.schedulingMode === "window" && data.timeWindow) {
			const windowInfo = `\n\n[Scheduling] Customer preferred time window: ${data.timeWindow.charAt(0).toUpperCase() + data.timeWindow.slice(1)}`;
			jobNotes = jobNotes ? `${jobNotes}${windowInfo}` : windowInfo.trim();
		}

		// Create core job record
		const { data: newJob, error: createError } = await supabase
			.from("jobs")
			.insert({
				company_id: teamMember.company_id,
				property_id: data.propertyId,
				customer_id: customerId,
				assigned_to: data.assignedTo,
				job_number: jobNumber,
				title: data.title,
				description: data.description,
				status: "quoted",
				priority: data.priority,
				job_type: data.jobType,
				service_type: data.jobType, // Default service_type to job_type
				scheduled_start: data.scheduledStart,
				scheduled_end: data.scheduledEnd,
				notes: jobNotes,
			})
			.select("id")
			.single();

		if (createError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		// Create domain records (parallel inserts for performance)
		const domainInserts = await Promise.all([
			// Financial domain - always create with defaults
			supabase
				.from("job_financial")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					total_amount: 0,
					paid_amount: 0,
					deposit_amount: 0,
				}),

			// Workflow domain - always create
			supabase
				.from("job_workflow")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					workflow_completed_stages: [],
				}),

			// Time tracking - always create
			supabase
				.from("job_time_tracking")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					total_labor_hours: 0,
					break_time_minutes: 0,
				}),

			// Customer approval - always create with pending
			supabase
				.from("job_customer_approval")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					customer_approval_status: "pending",
				}),

			// Equipment service - always create
			supabase
				.from("job_equipment_service")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					equipment_service_history: [],
					equipment_serviced: [],
				}),

			// Dispatch - always create
			supabase
				.from("job_dispatch")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
				}),

			// Quality - always create
			supabase
				.from("job_quality")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					inspection_required: false,
				}),

			// Safety - always create
			supabase
				.from("job_safety")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					requires_permit: false,
				}),

			// AI enrichment - create empty for future processing
			supabase
				.from("job_ai_enrichment")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
				}),

			// Multi-entity - always create
			supabase
				.from("job_multi_entity")
				.insert({
					job_id: newJob.id,
					company_id: teamMember.company_id,
					requires_multiple_properties: false,
					requires_multiple_customers: false,
				}),
		]);

		// Check for any domain insert errors
		const domainErrors = domainInserts.filter((result) => result.error);
		if (domainErrors.length > 0) {
			// Rollback - delete the job (CASCADE will delete domain records)
			await supabase.from("jobs").delete().eq("id", newJob.id);
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create job domains"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		// Create recurring jobs if requested
		if (data.isRecurring && data.recurrenceType && data.scheduledStart) {
			const baseJob = {
				company_id: teamMember.company_id,
				property_id: data.propertyId,
				customer_id: customerId,
				assigned_to: data.assignedTo,
				title: data.title,
				description: data.description,
				status: "quoted",
				priority: data.priority,
				job_type: data.jobType,
				scheduled_start: data.scheduledStart,
				scheduled_end: data.scheduledEnd,
				notes: data.notes,
			};

			await createRecurringJobs(
				supabase,
				teamMember.company_id,
				baseJob,
				data.recurrenceType,
				data.recurrenceEndDate,
				data.recurrenceCount,
			);
		}

		// Send notification to assigned user if job is assigned
		if (data.assignedTo && data.assignedTo !== user.id) {
			await notifyJobCreated({
				userId: data.assignedTo,
				companyId: teamMember.company_id,
				jobId: newJob.id,
				jobTitle: data.title,
				address: property.address || "Unknown address",
				priority:
					data.priority === "urgent"
						? "urgent"
						: data.priority === "high"
							? "high"
							: "medium",
				actionUrl: "/dashboard/work",
			});
		}

		revalidatePath("/dashboard/work");
		revalidatePath("/dashboard/work/jobs");
		return newJob.id;
	});
}

/**
 * Get a single job by ID
 */
export async function getJob(jobId: string): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Get job with all domain data and relationships
		const { data: job, error: jobError } = await supabase
			.from("jobs")
			.select(
				`
				*,
				property:properties(*),
				customer:users!customer_id(*),
				assigned:users!assigned_to(*),
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
			`,
			)
			.eq("id", jobId)
			.single();

		if (jobError) {
			throw new ActionError(
				ERROR_MESSAGES.notFound("Job"),
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		assertExists(job, "Job");

		// Verify job belongs to company
		if (job.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		return job;
	});
}

/**
 * Update job details
 */
export async function updateJob(
	jobId: string,
	formData: FormData,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get active company ID
		const activeCompanyId = await getActiveCompanyId();
		if (!activeCompanyId) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Get user's role to check if they're admin/owner
		const { data: teamMember } = await supabase
			.from("team_members")
			.select(`
        role_id,
        custom_roles!role_id(name, is_system)
      `)
			.eq("user_id", user.id)
			.eq("company_id", activeCompanyId)
			.eq("status", "active")
			.maybeSingle();

		const role = Array.isArray(teamMember?.custom_roles)
			? teamMember.custom_roles[0]
			: teamMember?.custom_roles;

		const isAdminOrOwner =
			role?.name === "Admin" ||
			role?.name === "Owner" ||
			role?.is_system === true;

		// Verify job belongs to company
		const { data: existingJob } = await supabase
			.from("jobs")
			.select("company_id, status")
			.eq("id", jobId)
			.single();

		assertExists(existingJob, "Job");

		if (existingJob.company_id !== activeCompanyId) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Prevent editing completed or cancelled jobs (unless admin/owner)
		if (
			!isAdminOrOwner &&
			(existingJob.status === "completed" || existingJob.status === "cancelled")
		) {
			throw new ActionError(
				`Cannot edit ${existingJob.status} jobs`,
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		const customerIdValue = formData.get("customerId");
		const propertyIdValue = formData.get("propertyId");

		// Handle customerId: empty string or "null" string means remove (set to null)
		// undefined means don't change it
		let parsedCustomerId: string | null | undefined;
		if (customerIdValue === null || customerIdValue === undefined) {
			parsedCustomerId = undefined; // Don't change
		} else if (customerIdValue === "" || customerIdValue === "null") {
			parsedCustomerId = null; // Remove customer
		} else {
			parsedCustomerId = customerIdValue as string; // Set to this customer
		}

		// Handle propertyId: empty string means remove (set to null), undefined means don't change
		let parsedPropertyId: string | null | undefined;
		if (propertyIdValue === null || propertyIdValue === undefined) {
			parsedPropertyId = undefined; // Don't change
		} else if (propertyIdValue === "" || propertyIdValue === "null") {
			parsedPropertyId = null; // Remove property
		} else {
			parsedPropertyId = propertyIdValue as string; // Set to this property
		}

		const data = updateJobSchema.parse({
			title: formData.get("title") || undefined,
			description: formData.get("description") || undefined,
			status: formData.get("status") || undefined,
			priority: formData.get("priority") || undefined,
			jobType: formData.get("jobType") || undefined,
			notes: formData.get("notes") || undefined,
			totalAmount: formData.get("totalAmount")
				? Number.parseInt(formData.get("totalAmount") as string, 10)
				: undefined,
			scheduledStart: formData.get("scheduledStart") || undefined,
			scheduledEnd: formData.get("scheduledEnd") || undefined,
			assignedTo: formData.get("assignedTo") || null,
			customerId: parsedCustomerId,
			propertyId: parsedPropertyId,
		});

		// Build update object with only defined values
		const updateData: any = {};
		if (data.title !== undefined) {
			updateData.title = data.title;
		}
		if (data.description !== undefined) {
			updateData.description = data.description;
		}
		if (data.status !== undefined) {
			updateData.status = data.status;
		}
		if (data.priority !== undefined) {
			updateData.priority = data.priority;
		}
		if (data.jobType !== undefined) {
			updateData.job_type = data.jobType;
		}
		if (data.notes !== undefined) {
			updateData.notes = data.notes;
		}
		if (data.totalAmount !== undefined) {
			updateData.total_amount = data.totalAmount;
		}
		if (data.scheduledStart !== undefined) {
			updateData.scheduled_start = data.scheduledStart;
		}
		if (data.scheduledEnd !== undefined) {
			updateData.scheduled_end = data.scheduledEnd;
		}
		if (data.assignedTo !== undefined) {
			updateData.assigned_to = data.assignedTo;
		}
		if (data.customerId !== undefined) {
			updateData.customer_id = data.customerId;
		}
		if (data.propertyId !== undefined) {
			updateData.property_id = data.propertyId;
			// If property is being set (not null), verify it belongs to the customer (if customer is set)
			if (
				data.propertyId !== null &&
				data.customerId !== undefined &&
				data.customerId !== null
			) {
				const { data: property } = await supabase
					.from("properties")
					.select("customer_id")
					.eq("id", data.propertyId)
					.single();

				if (property && property.customer_id !== data.customerId) {
					throw new ActionError(
						"Property does not belong to the selected customer",
						ERROR_CODES.VALIDATION_FAILED,
					);
				}
			}
		}

		// Update job
		const { error: updateError } = await supabase
			.from("jobs")
			.update(updateData)
			.eq("id", jobId);

		if (updateError) {
			throw new ActionError(
				`${ERROR_MESSAGES.operationFailed("update job")}: ${updateError.message}`,
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/${jobId}`);
	});
}

/**
 * Update job status with validation
 */
export async function updateJobStatus(
	jobId: string,
	newStatus: string,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Validate status value
		const validStatuses = [
			"quoted",
			"scheduled",
			"in_progress",
			"on_hold",
			"completed",
			"cancelled",
		];
		if (!validStatuses.includes(newStatus)) {
			throw new ActionError(
				"Invalid job status",
				ERROR_CODES.VALIDATION_FAILED,
			);
		}

		// Verify job belongs to company
		const { data: existingJob } = await supabase
			.from("jobs")
			.select("company_id, status")
			.eq("id", jobId)
			.single();

		assertExists(existingJob, "Job");

		if (existingJob.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Prevent changing from completed or cancelled
		if (
			(existingJob.status === "completed" ||
				existingJob.status === "cancelled") &&
			existingJob.status !== newStatus
		) {
			throw new ActionError(
				`Cannot change status of ${existingJob.status} job`,
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		// Update status
		const { error: updateError } = await supabase
			.from("jobs")
			.update({ status: newStatus })
			.eq("id", jobId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update job status"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/${jobId}`);
	});
}

/**
 * Assign job to a technician
 */
export async function assignJob(
	jobId: string,
	technicianId: string,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: existingJob } = await supabase
			.from("jobs")
			.select("company_id")
			.eq("id", jobId)
			.single();

		assertExists(existingJob, "Job");

		if (existingJob.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify technician belongs to company
		const { data: technician } = await supabase
			.from("team_members")
			.select("user_id")
			.eq("user_id", technicianId)
			.eq("company_id", teamMember.company_id)
			.single();

		if (!technician) {
			throw new ActionError(
				"Technician not found in your company",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		// Assign job
		const { error: updateError } = await supabase
			.from("jobs")
			.update({ assigned_to: technicianId })
			.eq("id", jobId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("assign job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/${jobId}`);
	});
}

/**
 * Schedule a job
 */
export async function scheduleJob(
	jobId: string,
	formData: FormData,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		const data = scheduleJobSchema.parse({
			scheduledStart: formData.get("scheduledStart"),
			scheduledEnd: formData.get("scheduledEnd"),
		});

		// Verify job belongs to company
		const { data: existingJob } = await supabase
			.from("jobs")
			.select("company_id, status")
			.eq("id", jobId)
			.single();

		assertExists(existingJob, "Job");

		if (existingJob.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Update schedule and status
		const { error: updateError } = await supabase
			.from("jobs")
			.update({
				scheduled_start: data.scheduledStart,
				scheduled_end: data.scheduledEnd,
				status:
					existingJob.status === "quoted" ? "scheduled" : existingJob.status,
			})
			.eq("id", jobId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("schedule job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath("/dashboard/schedule");
		revalidatePath(`/dashboard/work/${jobId}`);
	});
}

/**
 * Start a job
 */
export async function startJob(jobId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: existingJob } = await supabase
			.from("jobs")
			.select("company_id, status")
			.eq("id", jobId)
			.single();

		assertExists(existingJob, "Job");

		if (existingJob.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Can only start scheduled jobs
		if (existingJob.status !== "scheduled" && existingJob.status !== "quoted") {
			throw new ActionError(
				"Job must be scheduled before starting",
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		// Start job
		const { error: updateError } = await supabase
			.from("jobs")
			.update({
				status: "in_progress",
				actual_start: new Date().toISOString(),
			})
			.eq("id", jobId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("start job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/${jobId}`);
	});
}

/**
 * Complete a job
 */
export async function completeJob(jobId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: existingJob } = await supabase
			.from("jobs")
			.select("company_id, status")
			.eq("id", jobId)
			.single();

		assertExists(existingJob, "Job");

		if (existingJob.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Can only complete in-progress jobs
		if (existingJob.status !== "in_progress") {
			throw new ActionError(
				"Job must be in progress to complete",
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		// Complete job
		const { error: updateError } = await supabase
			.from("jobs")
			.update({
				status: "completed",
				actual_end: new Date().toISOString(),
			})
			.eq("id", jobId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("complete job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/${jobId}`);
	});
}

/**
 * Cancel a job
 */
export async function cancelJob(
	jobId: string,
	reason?: string,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: existingJob } = await supabase
			.from("jobs")
			.select("company_id, status, notes")
			.eq("id", jobId)
			.single();

		assertExists(existingJob, "Job");

		if (existingJob.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Cannot cancel completed jobs
		if (existingJob.status === "completed") {
			throw new ActionError(
				"Cannot cancel completed jobs",
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		// Add cancellation reason to notes
		const updatedNotes = reason
			? `${existingJob.notes || ""}\n\n[CANCELLED]: ${reason}`.trim()
			: existingJob.notes;

		// Cancel job
		const { error: updateError } = await supabase
			.from("jobs")
			.update({
				status: "cancelled",
				notes: updatedNotes,
			})
			.eq("id", jobId);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("cancel job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/${jobId}`);
	});
}

/**
 * Search jobs with full-text search and ranking
 *
 * Searches across: job_number, title, description, notes, job_type, status, priority, ai_service_type
 * Returns results ordered by relevance (best matches first)
 *
 * @example
 * const results = await searchJobs("HVAC repair");
 * // Returns jobs matching "HVAC" AND "repair" ranked by relevance
 */
export async function searchJobs(
	searchTerm: string,
	options?: { limit?: number; offset?: number },
): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Use full-text search with ranking for best matches
		const { searchJobsFullText } = await import(
			"@/lib/search/full-text-search"
		);

		const jobs = await searchJobsFullText(
			supabase,
			teamMember.company_id,
			searchTerm,
			{
				limit: options?.limit || 50,
				offset: options?.offset || 0,
			},
		);

		return jobs;
	});
}

/**
 * Universal search across all entities
 *
 * Searches customers, jobs, properties, equipment, and price book items
 * Returns top 5 results from each entity type
 *
 * @example
 * const results = await searchAll("furnace");
 * // Returns { customers: [...], jobs: [...], properties: [...], equipment: [...], priceBookItems: [...] }
 */
export async function searchAll(
	searchTerm: string,
): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Use universal search RPC function
		const { data, error } = await supabase.rpc("search_all_entities", {
			company_id_param: teamMember.company_id,
			search_query: searchTerm,
			per_entity_limit: 5,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("search"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		return data;
	});
}

// ============================================================================
// JOB ARCHIVE & RESTORE
// ============================================================================

/**
 * Archive job (soft delete)
 *
 * Archives a job instead of permanently deleting.
 * Archived jobs can be restored within 90 days.
 */
export async function archiveJob(jobId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: job } = await supabase
			.from("jobs")
			.select("company_id, status")
			.eq("id", jobId)
			.single();

		assertExists(job, "Job");

		if (job.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Cannot archive completed/paid jobs (business rule)
		if (job.status === "completed" || job.status === "invoiced") {
			throw new ActionError(
				"Cannot archive completed or invoiced jobs. These must be retained for records.",
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		// Archive job (soft delete)
		const now = new Date().toISOString();
		const scheduledDeletion = new Date(
			Date.now() + 90 * 24 * 60 * 60 * 1000,
		).toISOString();

		const { error: archiveError } = await supabase
			.from("jobs")
			.update({
				deleted_at: now,
				deleted_by: user.id,
				archived_at: now,
				permanent_delete_scheduled_at: scheduledDeletion,
				status: "archived",
			})
			.eq("id", jobId);

		if (archiveError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("archive job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath("/dashboard/schedule");
		revalidatePath("/dashboard/settings/archive");
	});
}

/**
 * Restore archived job
 */
export async function restoreJob(jobId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company and is archived
		const { data: job } = await supabase
			.from("jobs")
			.select("company_id, deleted_at, status")
			.eq("id", jobId)
			.single();

		assertExists(job, "Job");

		if (job.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("job"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		if (!job.deleted_at) {
			throw new ActionError(
				"Job is not archived",
				ERROR_CODES.OPERATION_NOT_ALLOWED,
			);
		}

		// Restore job
		const { error: restoreError } = await supabase
			.from("jobs")
			.update({
				deleted_at: null,
				deleted_by: null,
				archived_at: null,
				permanent_delete_scheduled_at: null,
				status: job.status === "archived" ? "scheduled" : job.status,
			})
			.eq("id", jobId);

		if (restoreError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("restore job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		revalidatePath("/dashboard/work");
		revalidatePath("/dashboard/schedule");
		revalidatePath("/dashboard/settings/archive");
	});
}

/**
 * Remove team assignment from job
 * Deletes the job_team_assignments junction table record
 * Updates both team member and job views
 *
 * Note: If your schema uses a simple assigned_to field instead of a junction table,
 * use updateJob() to set assigned_to to NULL instead.
 */
export async function removeTeamAssignment(
	assignmentId: string,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError(
				"You must be part of a company",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Get the junction record to find job_id for revalidation
		const { data: record, error: fetchError } = await supabase
			.from("job_team_assignments")
			.select("id, job_id, company_id")
			.eq("id", assignmentId)
			.single();

		if (fetchError || !record) {
			throw new ActionError(
				"Team assignment not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
			);
		}

		if (record.company_id !== teamMember.company_id) {
			throw new ActionError(
				ERROR_MESSAGES.forbidden("team assignment"),
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		const jobId = record.job_id;

		// Delete junction table row
		const { error: deleteError } = await supabase
			.from("job_team_assignments")
			.delete()
			.eq("id", assignmentId);

		if (deleteError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("remove team assignment from job"),
				ERROR_CODES.DB_QUERY_ERROR,
			);
		}

		// Revalidate job page and schedule
		if (jobId) {
			revalidatePath(`/dashboard/work/${jobId}`);
		}
		revalidatePath("/dashboard/schedule");
		revalidatePath("/dashboard/work");
	});
}
