/**
 * Service Plan Management Server Actions
 *
 * Recurring maintenance contract management with:
 * - Service plan CRUD operations
 * - Auto-generated plan numbers (SP-2025-001)
 * - Contract lifecycle management (active, paused, cancelled, expired)
 * - Service scheduling and auto-job generation
 * - Customer signatures and contract terms
 * - Performance metrics tracking
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

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const servicePlanSchema = z.object({
  customerId: z.string().uuid("Customer is required"),
  propertyId: z.string().uuid().optional().nullable(),
  name: z.string().min(1, "Plan name is required").max(200),
  description: z.string().optional(),
  type: z
    .enum(["preventive", "warranty", "subscription", "contract"])
    .default("preventive"),
  frequency: z
    .enum([
      "weekly",
      "bi_weekly",
      "monthly",
      "quarterly",
      "semi_annually",
      "annually",
    ])
    .default("annually"),
  visitsPerTerm: z.number().int().min(1).default(1),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  renewalType: z.enum(["auto", "manual", "none"]).default("manual"),
  renewalNoticeDays: z.number().int().min(0).default(30),
  price: z.number().int().min(0).default(0), // In cents
  billingFrequency: z
    .enum(["monthly", "quarterly", "annually", "one_time"])
    .default("annually"),
  taxable: z.boolean().default(true),
  includedServices: z
    .array(z.string())
    .min(1, "At least one service must be included"),
  includedEquipmentTypes: z.array(z.string()).optional(),
  priceBookItemIds: z.array(z.string().uuid()).optional(),
  autoGenerateJobs: z.boolean().default(false),
  assignedTechnician: z.string().uuid().optional().nullable(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate unique service plan number in format: SP-YYYY-###
 */
async function generatePlanNumber(
  supabase: any,
  companyId: string
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `SP-${year}-`;

  const { data: latestPlan } = await supabase
    .from("service_plans")
    .select("plan_number")
    .eq("company_id", companyId)
    .like("plan_number", `${prefix}%`)
    .order("plan_number", { ascending: false })
    .limit(1)
    .single();

  let nextNumber = 1;
  if (latestPlan?.plan_number) {
    const currentNumber = Number.parseInt(
      latestPlan.plan_number.split("-")[2],
      10
    );
    nextNumber = currentNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
}

/**
 * Calculate next service due date based on frequency
 */
function calculateNextServiceDue(startDate: Date, frequency: string): Date {
  const nextDue = new Date(startDate);

  switch (frequency) {
    case "weekly":
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case "bi_weekly":
      nextDue.setDate(nextDue.getDate() + 14);
      break;
    case "monthly":
      nextDue.setMonth(nextDue.getMonth() + 1);
      break;
    case "quarterly":
      nextDue.setMonth(nextDue.getMonth() + 3);
      break;
    case "semi_annually":
      nextDue.setMonth(nextDue.getMonth() + 6);
      break;
    case "annually":
      nextDue.setFullYear(nextDue.getFullYear() + 1);
      break;
  }

  return nextDue;
}

// ============================================================================
// SERVICE PLAN CRUD OPERATIONS
// ============================================================================

/**
 * Create a new service plan
 */
export async function createServicePlan(
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

    // Parse JSON fields
    let includedServices: string[] = [];
    let includedEquipmentTypes: string[] | undefined;
    let priceBookItemIds: string[] | undefined;

    try {
      includedServices = JSON.parse(formData.get("includedServices") as string);
    } catch {}

    try {
      const equipmentTypesString = formData.get("includedEquipmentTypes");
      if (equipmentTypesString) {
        includedEquipmentTypes = JSON.parse(equipmentTypesString as string);
      }
    } catch {}

    try {
      const itemIdsString = formData.get("priceBookItemIds");
      if (itemIdsString) {
        priceBookItemIds = JSON.parse(itemIdsString as string);
      }
    } catch {}

    // Validate input
    const data = servicePlanSchema.parse({
      customerId: formData.get("customerId"),
      propertyId: formData.get("propertyId") || null,
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      type: formData.get("type") || "preventive",
      frequency: formData.get("frequency") || "annually",
      visitsPerTerm: formData.get("visitsPerTerm")
        ? Number(formData.get("visitsPerTerm"))
        : 1,
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string)
        : null,
      renewalType: formData.get("renewalType") || "manual",
      renewalNoticeDays: formData.get("renewalNoticeDays")
        ? Number(formData.get("renewalNoticeDays"))
        : 30,
      price: formData.get("price") ? Number(formData.get("price")) : 0,
      billingFrequency: formData.get("billingFrequency") || "annually",
      taxable: formData.get("taxable") === "true",
      includedServices,
      includedEquipmentTypes,
      priceBookItemIds,
      autoGenerateJobs: formData.get("autoGenerateJobs") === "true",
      assignedTechnician: formData.get("assignedTechnician") || null,
      terms: formData.get("terms") || undefined,
      notes: formData.get("notes") || undefined,
      customerNotes: formData.get("customerNotes") || undefined,
    });

    // Verify customer exists and belongs to company
    const { data: customer } = await supabase
      .from("customers")
      .select("id, company_id")
      .eq("id", data.customerId)
      .is("deleted_at", null)
      .single();

    assertExists(customer, "Customer");

    if (customer.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Customer not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Generate plan number
    const planNumber = await generatePlanNumber(
      supabase,
      teamMember.company_id
    );

    // Calculate next service due date
    const nextServiceDue = calculateNextServiceDue(
      data.startDate,
      data.frequency
    );

    // Create service plan
    const { data: plan, error: createError } = await supabase
      .from("service_plans")
      .insert({
        company_id: teamMember.company_id,
        customer_id: data.customerId,
        property_id: data.propertyId,
        plan_number: planNumber,
        name: data.name,
        description: data.description,
        type: data.type,
        frequency: data.frequency,
        visits_per_term: data.visitsPerTerm,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate ? data.endDate.toISOString() : null,
        renewal_type: data.renewalType,
        renewal_notice_days: data.renewalNoticeDays,
        price: data.price,
        billing_frequency: data.billingFrequency,
        taxable: data.taxable,
        included_services: data.includedServices,
        included_equipment_types: data.includedEquipmentTypes,
        price_book_item_ids: data.priceBookItemIds,
        next_service_due: nextServiceDue.toISOString(),
        auto_generate_jobs: data.autoGenerateJobs,
        assigned_technician: data.assignedTechnician,
        terms: data.terms,
        notes: data.notes,
        customer_notes: data.customerNotes,
        status: "active",
        total_visits_completed: 0,
        total_revenue: 0,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create service plan"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/service-plans");
    revalidatePath(`/dashboard/customers/${data.customerId}`);
    return plan.id;
  });
}

/**
 * Update service plan
 */
export async function updateServicePlan(
  planId: string,
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

    // Verify plan exists and belongs to company
    const { data: plan } = await supabase
      .from("service_plans")
      .select("id, company_id, customer_id, status")
      .eq("id", planId)
      .is("deleted_at", null)
      .single();

    assertExists(plan, "Service plan");

    if (plan.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Service plan not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Cannot edit completed or cancelled plans
    if (plan.status === "completed" || plan.status === "cancelled") {
      throw new ActionError(
        `Cannot edit ${plan.status} service plan`,
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Parse JSON fields (similar to create)
    let includedServices: string[] = [];
    let includedEquipmentTypes: string[] | undefined;
    let priceBookItemIds: string[] | undefined;

    try {
      includedServices = JSON.parse(formData.get("includedServices") as string);
    } catch {}

    try {
      const equipmentTypesString = formData.get("includedEquipmentTypes");
      if (equipmentTypesString) {
        includedEquipmentTypes = JSON.parse(equipmentTypesString as string);
      }
    } catch {}

    try {
      const itemIdsString = formData.get("priceBookItemIds");
      if (itemIdsString) {
        priceBookItemIds = JSON.parse(itemIdsString as string);
      }
    } catch {}

    // Validate input
    const data = servicePlanSchema.parse({
      customerId: plan.customer_id,
      propertyId: formData.get("propertyId") || null,
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      type: formData.get("type") || "preventive",
      frequency: formData.get("frequency") || "annually",
      visitsPerTerm: formData.get("visitsPerTerm")
        ? Number(formData.get("visitsPerTerm"))
        : 1,
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string)
        : null,
      renewalType: formData.get("renewalType") || "manual",
      renewalNoticeDays: formData.get("renewalNoticeDays")
        ? Number(formData.get("renewalNoticeDays"))
        : 30,
      price: formData.get("price") ? Number(formData.get("price")) : 0,
      billingFrequency: formData.get("billingFrequency") || "annually",
      taxable: formData.get("taxable") === "true",
      includedServices,
      includedEquipmentTypes,
      priceBookItemIds,
      autoGenerateJobs: formData.get("autoGenerateJobs") === "true",
      assignedTechnician: formData.get("assignedTechnician") || null,
      terms: formData.get("terms") || undefined,
      notes: formData.get("notes") || undefined,
      customerNotes: formData.get("customerNotes") || undefined,
    });

    // Update service plan
    const { error: updateError } = await supabase
      .from("service_plans")
      .update({
        property_id: data.propertyId,
        name: data.name,
        description: data.description,
        type: data.type,
        frequency: data.frequency,
        visits_per_term: data.visitsPerTerm,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate ? data.endDate.toISOString() : null,
        renewal_type: data.renewalType,
        renewal_notice_days: data.renewalNoticeDays,
        price: data.price,
        billing_frequency: data.billingFrequency,
        taxable: data.taxable,
        included_services: data.includedServices,
        included_equipment_types: data.includedEquipmentTypes,
        price_book_item_ids: data.priceBookItemIds,
        auto_generate_jobs: data.autoGenerateJobs,
        assigned_technician: data.assignedTechnician,
        terms: data.terms,
        notes: data.notes,
        customer_notes: data.customerNotes,
      })
      .eq("id", planId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update service plan"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/service-plans");
    revalidatePath(`/dashboard/customers/${plan.customer_id}`);
  });
}

/**
 * Delete service plan (soft delete)
 */
export async function deleteServicePlan(
  planId: string
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

    // Verify plan exists and belongs to company
    const { data: plan } = await supabase
      .from("service_plans")
      .select("id, company_id, customer_id, status")
      .eq("id", planId)
      .is("deleted_at", null)
      .single();

    assertExists(plan, "Service plan");

    if (plan.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Service plan not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from("service_plans")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
        status: "cancelled",
      })
      .eq("id", planId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete service plan"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/service-plans");
    revalidatePath(`/dashboard/customers/${plan.customer_id}`);
  });
}

// ============================================================================
// SERVICE PLAN LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Pause service plan
 */
export async function pauseServicePlan(
  planId: string,
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
        403
      );
    }

    // Verify plan exists and belongs to company
    const { data: plan } = await supabase
      .from("service_plans")
      .select("id, company_id, status")
      .eq("id", planId)
      .is("deleted_at", null)
      .single();

    assertExists(plan, "Service plan");

    if (plan.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Service plan not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (plan.status !== "active") {
      throw new ActionError(
        "Can only pause active service plans",
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Pause plan
    const { error: updateError } = await supabase
      .from("service_plans")
      .update({
        status: "paused",
        paused_at: new Date().toISOString(),
        paused_reason: reason,
      })
      .eq("id", planId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("pause service plan"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/service-plans");
  });
}

/**
 * Resume paused service plan
 */
export async function resumeServicePlan(
  planId: string
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

    // Verify plan exists and belongs to company
    const { data: plan } = await supabase
      .from("service_plans")
      .select("id, company_id, status")
      .eq("id", planId)
      .is("deleted_at", null)
      .single();

    assertExists(plan, "Service plan");

    if (plan.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Service plan not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (plan.status !== "paused") {
      throw new ActionError(
        "Can only resume paused service plans",
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Resume plan
    const { error: updateError } = await supabase
      .from("service_plans")
      .update({
        status: "active",
        paused_at: null,
        paused_reason: null,
      })
      .eq("id", planId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("resume service plan"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/service-plans");
  });
}

/**
 * Cancel service plan
 */
export async function cancelServicePlan(
  planId: string,
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
        403
      );
    }

    // Verify plan exists and belongs to company
    const { data: plan } = await supabase
      .from("service_plans")
      .select("id, company_id, status")
      .eq("id", planId)
      .is("deleted_at", null)
      .single();

    assertExists(plan, "Service plan");

    if (plan.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Service plan not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (plan.status === "cancelled" || plan.status === "completed") {
      throw new ActionError(
        `Service plan is already ${plan.status}`,
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Cancel plan
    const { error: updateError } = await supabase
      .from("service_plans")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_reason: reason,
      })
      .eq("id", planId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("cancel service plan"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/service-plans");
  });
}

/**
 * Complete service visit and update metrics
 */
export async function completeServiceVisit(
  planId: string,
  jobId: string,
  revenue: number
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

    // Verify plan exists and belongs to company
    const { data: plan } = await supabase
      .from("service_plans")
      .select(
        "id, company_id, total_visits_completed, total_revenue, frequency"
      )
      .eq("id", planId)
      .is("deleted_at", null)
      .single();

    assertExists(plan, "Service plan");

    if (plan.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Service plan not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Calculate next service due date
    const nextServiceDue = calculateNextServiceDue(new Date(), plan.frequency);

    // Update plan metrics
    const { error: updateError } = await supabase
      .from("service_plans")
      .update({
        total_visits_completed: plan.total_visits_completed + 1,
        total_revenue: plan.total_revenue + revenue,
        last_service_date: new Date().toISOString(),
        next_service_due: nextServiceDue.toISOString(),
      })
      .eq("id", planId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("complete service visit"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/service-plans");
  });
}

/**
 * Get service plans due for renewal
 */
export async function getServicePlansDueForRenewal(): Promise<
  ActionResult<any[]>
> {
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

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60); // Look ahead 60 days

    // Get plans expiring within 60 days
    const { data: plans, error } = await supabase
      .from("service_plans")
      .select(
        `
        *,
        customer:customers(id, display_name, email, phone)
      `
      )
      .eq("company_id", teamMember.company_id)
      .eq("status", "active")
      .is("deleted_at", null)
      .not("end_date", "is", null)
      .gte("end_date", now.toISOString())
      .lte("end_date", futureDate.toISOString())
      .order("end_date", { ascending: true });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch plans due for renewal"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return plans || [];
  });
}
