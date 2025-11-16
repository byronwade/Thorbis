/**
 * Estimates Server Actions
 *
 * Handles estimate/quote management with CRUD operations, status transitions,
 * customer interactions, and conversion to jobs.
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
  assertSupabase,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// Validation Schemas
const MIN_LINE_ITEM_QUANTITY = 0.01;
const MAX_TAX_RATE_PERCENT = 100;
const DEFAULT_VALID_DAYS = 30;
const ESTIMATE_NUMBER_PADDING_LENGTH = 3;
const JOB_NUMBER_PADDING_LENGTH = 3;
const PERCENT_DENOMINATOR = 100;
const CENTS_PER_DOLLAR = 100;
const HTTP_STATUS_FORBIDDEN = 403;
const ARCHIVE_RETENTION_DAYS = 90;
const SECONDS_PER_DAY = 24 * 60 * 60;
const MS_TO_SECONDS = 1000;
const MS_PER_DAY = SECONDS_PER_DAY * MS_TO_SECONDS;

const ESTIMATE_NUMBER_REGEX = /EST-\d{4}-(\d+)/;
const JOB_NUMBER_REGEX = /JOB-\d{4}-(\d+)/;

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z
    .number()
    .min(MIN_LINE_ITEM_QUANTITY, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Price must be positive"),
  total: z.number().min(0, "Total must be positive"),
});

const createEstimateSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
  propertyId: z.string().uuid("Invalid property ID").optional(),
  title: z.string().min(1, "Estimate title is required"),
  description: z.string().optional(),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
  taxRate: z.number().min(0).max(MAX_TAX_RATE_PERCENT).default(0),
  discountAmount: z.number().min(0).default(0),
  validDays: z.number().min(1).default(DEFAULT_VALID_DAYS),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

const updateEstimateSchema = z.object({
  title: z.string().min(1, "Estimate title is required").optional(),
  description: z.string().optional(),
  lineItems: z.array(lineItemSchema).optional(),
  taxRate: z.number().min(0).max(MAX_TAX_RATE_PERCENT).optional(),
  discountAmount: z.number().min(0).optional(),
  validDays: z.number().min(1).optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Generate unique estimate number
 */
import type { SupabaseClient } from "@supabase/supabase-js";

async function generateEstimateNumber(
  supabase: SupabaseClient,
  companyId: string
): Promise<string> {
  const { data: latestEstimate } = await supabase
    .from("estimates")
    .select("estimate_number")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!latestEstimate) {
    return `EST-${new Date().getFullYear()}-001`;
  }

  const match = latestEstimate.estimate_number.match(ESTIMATE_NUMBER_REGEX);
  if (match) {
    const nextNumber = Number.parseInt(match[1], 10) + 1;
    return `EST-${new Date().getFullYear()}-${nextNumber
      .toString()
      .padStart(ESTIMATE_NUMBER_PADDING_LENGTH, "0")}`;
  }

  return `EST-${new Date().getFullYear()}-${Date.now()
    .toString()
    .slice(-ESTIMATE_NUMBER_PADDING_LENGTH)}`;
}

/**
 * Calculate estimate totals
 */
function calculateTotals(
  lineItems: { total: number }[],
  taxRate: number,
  discountAmount: number
) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = Math.round((subtotal * taxRate) / PERCENT_DENOMINATOR);
  const totalAmount = subtotal + taxAmount - discountAmount;

  return {
    subtotal: Math.round(subtotal * CENTS_PER_DOLLAR), // Convert to cents
    taxAmount: Math.round(taxAmount * CENTS_PER_DOLLAR),
    discountAmount: Math.round(discountAmount * CENTS_PER_DOLLAR),
    totalAmount: Math.round(totalAmount * CENTS_PER_DOLLAR),
  };
}

/**
 * Create a new estimate
 */
export function createEstimate(
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const companyId = await requireEstimateCompanyId(supabase, user.id);
    const lineItems = parseEstimateLineItems(formData.get("lineItems"));
    const data = parseCreateEstimateFormData(formData, lineItems);

    const totals = calculateTotals(
      data.lineItems,
      data.taxRate,
      data.discountAmount
    );

    const validUntilIso = calculateValidUntilIso(data.validDays);
    const estimateNumber = await generateEstimateNumber(supabase, companyId);

    const insertPayload = buildCreateEstimateInsertPayload({
      companyId,
      data,
      totals,
      validUntilIso,
      estimateNumber,
    });

    const { data: newEstimate, error: createError } = await supabase
      .from("estimates")
      .insert(insertPayload)
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    return newEstimate.id;
  });
}

/**
 * Update an estimate
 */
export function updateEstimate(
  estimateId: string,
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const companyId = await requireEstimateCompanyId(supabase, user.id);
    const existingEstimate = await getEstimateForCompanyOrThrow(
      supabase,
      estimateId,
      companyId
    );

    if (existingEstimate.status !== "draft") {
      throw new ActionError(
        "Only draft estimates can be edited",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    const lineItems = parseEstimateLineItems(formData.get("lineItems"), true);
    const data = parseUpdateEstimateFormData(formData, lineItems);

    const updateData = buildUpdateEstimatePayload(data);

    // Update estimate
    const { error: updateError } = await supabase
      .from("estimates")
      .update(updateData)
      .eq("id", estimateId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath(`/dashboard/work/estimates/${estimateId}`);
  });
}

type CreateEstimateParsed = z.infer<typeof createEstimateSchema>;
type UpdateEstimateParsed = z.infer<typeof updateEstimateSchema>;

async function requireEstimateCompanyId(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  userId: string
): Promise<string> {
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", userId)
    .single();

  if (!teamMember?.company_id) {
    throw new ActionError(
      "You must be part of a company",
      ERROR_CODES.AUTH_FORBIDDEN,
      HTTP_STATUS_FORBIDDEN
    );
  }

  return teamMember.company_id;
}

function parseEstimateLineItems(
  value: FormDataEntryValue | null,
  optional = false
): { total: number }[] | undefined {
  if (!value || typeof value !== "string") {
    return optional ? undefined : [];
  }

  try {
    return JSON.parse(value) as { total: number }[];
  } catch {
    throw new ActionError(
      "Invalid line items data",
      ERROR_CODES.VALIDATION_FAILED
    );
  }
}

function parseCreateEstimateFormData(
  formData: FormData,
  lineItems: { total: number }[]
): CreateEstimateParsed {
  return createEstimateSchema.parse({
    customerId: formData.get("customerId"),
    propertyId: formData.get("propertyId") || undefined,
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    lineItems,
    taxRate: formData.get("taxRate")
      ? Number.parseFloat(formData.get("taxRate") as string)
      : 0,
    discountAmount: formData.get("discountAmount")
      ? Number.parseFloat(formData.get("discountAmount") as string)
      : 0,
    validDays: formData.get("validDays")
      ? Number.parseInt(formData.get("validDays") as string, 10)
      : DEFAULT_VALID_DAYS,
    terms: formData.get("terms") || undefined,
    notes: formData.get("notes") || undefined,
  });
}

function calculateValidUntilIso(validDays: number): string {
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validDays);
  return validUntil.toISOString();
}

type CreateEstimateInsertParams = {
  companyId: string;
  data: CreateEstimateParsed;
  totals: ReturnType<typeof calculateTotals>;
  validUntilIso: string;
  estimateNumber: string;
};

function buildCreateEstimateInsertPayload(
  params: CreateEstimateInsertParams
): Record<string, unknown> {
  const { companyId, data, totals, validUntilIso, estimateNumber } = params;

  return {
    company_id: companyId,
    customer_id: data.customerId,
    property_id: data.propertyId,
    estimate_number: estimateNumber,
    title: data.title,
    description: data.description,
    status: "draft",
    subtotal: totals.subtotal,
    tax_amount: totals.taxAmount,
    discount_amount: totals.discountAmount,
    total_amount: totals.totalAmount,
    valid_until: validUntilIso,
    line_items: data.lineItems,
    terms: data.terms,
    notes: data.notes,
  };
}

async function getEstimateForCompanyOrThrow(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  estimateId: string,
  companyId: string
) {
  const { data: existingEstimate } = await supabase
    .from("estimates")
    .select("company_id, status")
    .eq("id", estimateId)
    .single();

  assertExists(existingEstimate, "Estimate");

  if (existingEstimate.company_id !== companyId) {
    throw new ActionError(
      ERROR_MESSAGES.forbidden("estimate"),
      ERROR_CODES.AUTH_FORBIDDEN,
      HTTP_STATUS_FORBIDDEN
    );
  }

  return existingEstimate;
}

function parseUpdateEstimateFormData(
  formData: FormData,
  lineItems: { total: number }[] | undefined
): UpdateEstimateParsed {
  return updateEstimateSchema.parse({
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    lineItems,
    taxRate: formData.get("taxRate")
      ? Number.parseFloat(formData.get("taxRate") as string)
      : undefined,
    discountAmount: formData.get("discountAmount")
      ? Number.parseFloat(formData.get("discountAmount") as string)
      : undefined,
    validDays: formData.get("validDays")
      ? Number.parseInt(formData.get("validDays") as string, 10)
      : undefined,
    terms: formData.get("terms") || undefined,
    notes: formData.get("notes") || undefined,
  });
}

function buildUpdateEstimatePayload(
  data: UpdateEstimateParsed
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {};
  if (data.title) {
    updateData.title = data.title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  if (data.terms !== undefined) {
    updateData.terms = data.terms;
  }
  if (data.notes !== undefined) {
    updateData.notes = data.notes;
  }

  if (data.lineItems) {
    const taxRate = data.taxRate ?? 0;
    const discountAmount = data.discountAmount ?? 0;
    const totals = calculateTotals(data.lineItems, taxRate, discountAmount);

    updateData.line_items = data.lineItems;
    updateData.subtotal = totals.subtotal;
    updateData.tax_amount = totals.taxAmount;
    updateData.discount_amount = totals.discountAmount;
    updateData.total_amount = totals.totalAmount;
  }

  if (data.validDays) {
    updateData.valid_until = calculateValidUntilIso(data.validDays);
  }

  return updateData;
}

/**
 * Send estimate to customer
 */
export async function sendEstimate(estimateId: string): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const companyId = await requireEstimateCompanyId(supabase, user.id);

    // Verify estimate belongs to company
    const { data: existingEstimate } = await supabase
      .from("estimates")
      .select("company_id, status, customer_id")
      .eq("id", estimateId)
      .single();

    assertExists(existingEstimate, "Estimate");

    if (existingEstimate.company_id !== companyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("estimate"),
        ERROR_CODES.AUTH_FORBIDDEN,
        HTTP_STATUS_FORBIDDEN
      );
    }

    // Can only send draft or rejected estimates
    if (
      existingEstimate.status !== "draft" &&
      existingEstimate.status !== "rejected"
    ) {
      throw new ActionError(
        "Estimate has already been sent",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // TODO: Send email to customer with estimate PDF
    // await sendEstimateEmail(estimateId, existingEstimate.customer_id);

    // Update status to sent
    const { error: updateError } = await supabase
      .from("estimates")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", estimateId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("send estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath(`/dashboard/work/estimates/${estimateId}`);
  });
}

/**
 * Mark estimate as viewed (customer opened it)
 */
export function markEstimateViewed(
  estimateId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // This can be called publicly by customer, so no auth check
    // Just verify estimate exists
    const { data: estimate } = await supabase
      .from("estimates")
      .select("status, viewed_at")
      .eq("id", estimateId)
      .single();

    assertExists(estimate, "Estimate");

    // Only mark as viewed if sent and not already viewed
    if (estimate.status === "sent" && !estimate.viewed_at) {
      const { error: updateError } = await supabase
        .from("estimates")
        .update({
          status: "viewed",
          viewed_at: new Date().toISOString(),
        })
        .eq("id", estimateId);

      if (updateError) {
        throw new ActionError(
          ERROR_MESSAGES.operationFailed("mark estimate as viewed"),
          ERROR_CODES.DB_QUERY_ERROR
        );
      }
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath(`/dashboard/work/estimates/${estimateId}`);
  });
}

/**
 * Accept estimate (customer approval)
 */
export function acceptEstimate(
  estimateId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Verify estimate exists and can be accepted
    const { data: estimate } = await supabase
      .from("estimates")
      .select("status, valid_until")
      .eq("id", estimateId)
      .single();

    assertExists(estimate, "Estimate");

    // Can only accept sent or viewed estimates
    if (estimate.status !== "sent" && estimate.status !== "viewed") {
      throw new ActionError(
        "Estimate cannot be accepted",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Check if estimate is expired
    if (estimate.valid_until && new Date(estimate.valid_until) < new Date()) {
      throw new ActionError(
        "Estimate has expired",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Update status to accepted
    const { error: updateError } = await supabase
      .from("estimates")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", estimateId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("accept estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath(`/dashboard/work/estimates/${estimateId}`);
  });
}

/**
 * Reject estimate (customer rejection)
 */
export function rejectEstimate(
  estimateId: string,
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

    // Verify estimate exists
    const { data: estimate } = await supabase
      .from("estimates")
      .select("status, notes")
      .eq("id", estimateId)
      .single();

    assertExists(estimate, "Estimate");

    // Can only reject sent or viewed estimates
    if (estimate.status !== "sent" && estimate.status !== "viewed") {
      throw new ActionError(
        "Estimate cannot be rejected",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Add rejection reason to notes
    const updatedNotes = reason
      ? `${estimate.notes || ""}\n\n[REJECTED]: ${reason}`.trim()
      : estimate.notes;

    // Update status to rejected
    const { error: updateError } = await supabase
      .from("estimates")
      .update({
        status: "rejected",
        notes: updatedNotes,
      })
      .eq("id", estimateId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("reject estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath(`/dashboard/work/estimates/${estimateId}`);
  });
}

/**
 * Convert estimate to job
 */
export function convertEstimateToJob(
  estimateId: string
): Promise<ActionResult<string>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const companyId = await requireEstimateCompanyId(supabase, user.id);

    // Get estimate
    const { data: estimate } = await supabase
      .from("estimates")
      .select(
        "company_id, customer_id, property_id, title, description, total_amount, status"
      )
      .eq("id", estimateId)
      .single();

    assertExists(estimate, "Estimate");

    if (estimate.company_id !== companyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("estimate"),
        ERROR_CODES.AUTH_FORBIDDEN,
        HTTP_STATUS_FORBIDDEN
      );
    }

    // Only accepted estimates can be converted
    if (estimate.status !== "accepted") {
      throw new ActionError(
        "Only accepted estimates can be converted to jobs",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Generate job number
    const { data: latestJob } = await supabase
      .from("jobs")
      .select("job_number")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let jobNumber: string;
    if (latestJob) {
      const match = latestJob.job_number.match(JOB_NUMBER_REGEX);
      if (match) {
        const nextNumber = Number.parseInt(match[1], 10) + 1;
        jobNumber = `JOB-${new Date().getFullYear()}-${nextNumber
          .toString()
          .padStart(JOB_NUMBER_PADDING_LENGTH, "0")}`;
      } else {
        jobNumber = `JOB-${new Date().getFullYear()}-${Date.now()
          .toString()
          .slice(-JOB_NUMBER_PADDING_LENGTH)}`;
      }
    } else {
      jobNumber = `JOB-${new Date().getFullYear()}-001`;
    }

    // Create job from estimate
    const { data: newJob, error: createError } = await supabase
      .from("jobs")
      .insert({
        company_id: estimate.company_id,
        customer_id: estimate.customer_id,
        property_id: estimate.property_id,
        job_number: jobNumber,
        title: estimate.title,
        description: estimate.description,
        status: "scheduled",
        priority: "medium",
        total_amount: estimate.total_amount,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create job from estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Link estimate to job
    const { error: linkError } = await supabase
      .from("estimates")
      .update({ job_id: newJob.id })
      .eq("id", estimateId);

    if (linkError) {
      // Job created but linking failed - return error while keeping job
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("link estimate to job"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath("/dashboard/work/jobs");
    return newJob.id;
  });
}

/**
 * Archive estimate (soft delete)
 *
 * Replaces deleteEstimate - now archives instead of permanently deleting.
 * Archived estimates can be restored within 90 days.
 */
export function archiveEstimate(
  estimateId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const companyId = await requireEstimateCompanyId(supabase, user.id);

    // Verify estimate belongs to company
    const { data: estimate } = await supabase
      .from("estimates")
      .select("company_id, status")
      .eq("id", estimateId)
      .single();

    assertExists(estimate, "Estimate");

    if (estimate.company_id !== companyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("estimate"),
        ERROR_CODES.AUTH_FORBIDDEN,
        HTTP_STATUS_FORBIDDEN
      );
    }

    // Cannot archive accepted estimates (business rule)
    if (estimate.status === "accepted") {
      throw new ActionError(
        "Cannot archive accepted estimates. Accepted estimates must be retained for records.",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Archive estimate (soft delete)
    const now = new Date().toISOString();
    const scheduledDeletion = new Date(
      Date.now() + ARCHIVE_RETENTION_DAYS * MS_PER_DAY
    ).toISOString();

    const { error: archiveError } = await supabase
      .from("estimates")
      .update({
        deleted_at: now,
        deleted_by: user.id,
        archived_at: now,
        permanent_delete_scheduled_at: scheduledDeletion,
        status: "archived",
      })
      .eq("id", estimateId);

    if (archiveError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("archive estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath("/dashboard/settings/archive");
  });
}

/**
 * Restore archived estimate
 */
export function restoreEstimate(
  estimateId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const companyId = await requireEstimateCompanyId(supabase, user.id);

    // Verify estimate belongs to company and is archived
    const { data: estimate } = await supabase
      .from("estimates")
      .select("company_id, deleted_at, status")
      .eq("id", estimateId)
      .single();

    assertExists(estimate, "Estimate");

    if (estimate.company_id !== companyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("estimate"),
        ERROR_CODES.AUTH_FORBIDDEN,
        HTTP_STATUS_FORBIDDEN
      );
    }

    if (!estimate.deleted_at) {
      throw new ActionError(
        "Estimate is not archived",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Restore estimate
    const { error: restoreError } = await supabase
      .from("estimates")
      .update({
        deleted_at: null,
        deleted_by: null,
        archived_at: null,
        permanent_delete_scheduled_at: null,
        status: estimate.status === "archived" ? "draft" : estimate.status,
      })
      .eq("id", estimateId);

    if (restoreError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("restore estimate"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/estimates");
    revalidatePath("/dashboard/settings/archive");
  });
}

/**
 * Unlink estimate from job
 * Removes the job association from the estimate (sets job_id to NULL)
 * This is a bidirectional operation - estimate no longer shows on job, job no longer shows on estimate
 */
export function unlinkEstimateFromJob(
  estimateId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    assertSupabase(supabase);

    // Get current estimate to verify it exists and get job_id for revalidation
    const { data: estimate, error: fetchError } = await supabase
      .from("estimates")
      .select("id, job_id")
      .eq("id", estimateId)
      .single();

    if (fetchError || !estimate) {
      throw new ActionError(
        "Estimate not found",
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    const previousJobId = estimate.job_id;

    // Unlink estimate from job (set job_id to NULL)
    const { error: unlinkError } = await supabase
      .from("estimates")
      .update({ job_id: null })
      .eq("id", estimateId);

    if (unlinkError) {
      throw new ActionError(
        "Failed to unlink estimate from job",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate both the estimate and the job pages
    revalidatePath(`/dashboard/work/estimates/${estimateId}`);
    if (previousJobId) {
      revalidatePath(`/dashboard/work/${previousJobId}`);
    }
    revalidatePath("/dashboard/work/estimates");
  });
}

/**
 * Unlink job from estimate (convenience wrapper)
 *
 * This is a convenience function that calls unlinkEstimateFromJob.
 * Provided for clearer naming when calling from the estimate detail page.
 * The implementation is the same - it removes the job_id from the estimate.
 *
 * @param estimateId - ID of the estimate to unlink from its job
 * @returns Promise<ActionResult<void>>
 */
export function unlinkJobFromEstimate(
  estimateId: string
): Promise<ActionResult<void>> {
  // Just call the main function - same implementation
  return unlinkEstimateFromJob(estimateId);
}

/**
 * Delete estimate (legacy - deprecated)
 * @deprecated Use archiveEstimate() instead
 */
export function deleteEstimate(
  estimateId: string
): Promise<ActionResult<void>> {
  return archiveEstimate(estimateId);
}
