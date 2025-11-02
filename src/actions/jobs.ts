/**
 * Jobs Server Actions
 *
 * Handles job/work order management with comprehensive CRUD operations,
 * status transitions, scheduling, and assignment logic.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
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
import { createClient } from "@/lib/supabase/server";
import { notifyJobCreated } from "@/lib/notifications/triggers";

// Validation Schemas
const createJobSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  customerId: z.string().uuid("Invalid customer ID").optional(),
  title: z.string().min(1, "Job title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  jobType: z
    .enum(["service", "installation", "repair", "maintenance", "inspection", "consultation"])
    .optional(),
  scheduledStart: z.string().optional(),
  scheduledEnd: z.string().optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional(),
  notes: z.string().optional(),
});

const updateJobSchema = z.object({
  title: z.string().min(1, "Job title is required").optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  jobType: z
    .enum(["service", "installation", "repair", "maintenance"])
    .optional(),
  notes: z.string().optional(),
  totalAmount: z.number().min(0).optional(),
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
  companyId: string
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
  const match = latestJob.job_number.match(/JOB-\d{4}-(\d+)/);
  if (match) {
    const nextNumber = Number.parseInt(match[1]) + 1;
    return `JOB-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, "0")}`;
  }

  // Fallback
  return `JOB-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
}

/**
 * Create a new job
 */
export async function createJob(
  formData: FormData
): Promise<ActionResult<string>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
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
        403
      );
    }

    // Use customer from property if not provided
    const customerId = data.customerId || property.customer_id;

    // Generate unique job number
    const jobNumber = await generateJobNumber(supabase, teamMember.company_id);

    // Create job
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
        scheduled_start: data.scheduledStart,
        scheduled_end: data.scheduledEnd,
        notes: data.notes,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create job"),
        ERROR_CODES.DB_QUERY_ERROR
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
        priority: data.priority === "urgent" ? "urgent" : data.priority === "high" ? "high" : "medium",
        actionUrl: `/dashboard/work`,
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
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
      );
    }

    // Get job with related data
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select(
        `
				*,
				property:properties(*),
				customer:users!customer_id(*),
				assigned:users!assigned_to(*)
			`
      )
      .eq("id", jobId)
      .single();

    if (jobError) {
      throw new ActionError(
        ERROR_MESSAGES.notFound("Job"),
        ERROR_CODES.DB_RECORD_NOT_FOUND,
        404
      );
    }

    assertExists(job, "Job");

    // Verify job belongs to company
    if (job.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("job"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
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
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
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
        403
      );
    }

    // Prevent editing completed or cancelled jobs
    if (
      existingJob.status === "completed" ||
      existingJob.status === "cancelled"
    ) {
      throw new ActionError(
        `Cannot edit ${existingJob.status} jobs`,
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    const data = updateJobSchema.parse({
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      priority: formData.get("priority") || undefined,
      jobType: formData.get("jobType") || undefined,
      notes: formData.get("notes") || undefined,
      totalAmount: formData.get("totalAmount")
        ? Number.parseInt(formData.get("totalAmount") as string)
        : undefined,
    });

    // Update job
    const { error: updateError } = await supabase
      .from("jobs")
      .update(data)
      .eq("id", jobId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update job"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/work/jobs");
    revalidatePath(`/dashboard/work/jobs/${jobId}`);
  });
}

/**
 * Update job status with validation
 */
export async function updateJobStatus(
  jobId: string,
  newStatus: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
      );
    }

    // Validate status value
    const validStatuses = [
      "quoted",
      "scheduled",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new ActionError(
        "Invalid job status",
        ERROR_CODES.VALIDATION_FAILED
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
        403
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
        ERROR_CODES.OPERATION_NOT_ALLOWED
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
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/work/jobs");
    revalidatePath(`/dashboard/work/jobs/${jobId}`);
  });
}

/**
 * Assign job to a technician
 */
export async function assignJob(
  jobId: string,
  technicianId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
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
        403
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
        404
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
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/work/jobs");
    revalidatePath(`/dashboard/work/jobs/${jobId}`);
  });
}

/**
 * Schedule a job
 */
export async function scheduleJob(
  jobId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
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
        403
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
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/work/schedule");
    revalidatePath(`/dashboard/work/jobs/${jobId}`);
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
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
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
        403
      );
    }

    // Can only start scheduled jobs
    if (existingJob.status !== "scheduled" && existingJob.status !== "quoted") {
      throw new ActionError(
        "Job must be scheduled before starting",
        ERROR_CODES.OPERATION_NOT_ALLOWED
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
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/work/jobs");
    revalidatePath(`/dashboard/work/jobs/${jobId}`);
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
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
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
        403
      );
    }

    // Can only complete in-progress jobs
    if (existingJob.status !== "in_progress") {
      throw new ActionError(
        "Job must be in progress to complete",
        ERROR_CODES.OPERATION_NOT_ALLOWED
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
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/work/jobs");
    revalidatePath(`/dashboard/work/jobs/${jobId}`);
  });
}

/**
 * Cancel a job
 */
export async function cancelJob(
  jobId: string,
  reason?: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
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
        403
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
        403
      );
    }

    // Cannot cancel completed jobs
    if (existingJob.status === "completed") {
      throw new ActionError(
        "Cannot cancel completed jobs",
        ERROR_CODES.OPERATION_NOT_ALLOWED
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
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/work/jobs");
    revalidatePath(`/dashboard/work/jobs/${jobId}`);
  });
}
