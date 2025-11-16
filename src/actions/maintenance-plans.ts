/**
 * Maintenance Plans Server Actions
 *
 * Handles recurring maintenance plan management with comprehensive CRUD operations,
 * service scheduling, billing, and customer relationship management.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
  type ActionResult,
  assertAuthenticated,
  assertExists,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// Validation Schemas
const createMaintenancePlanSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
  propertyId: z.string().uuid("Invalid property ID").optional(),
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  frequency: z.enum([
    "weekly",
    "biweekly",
    "monthly",
    "quarterly",
    "semiannual",
    "annual",
    "custom",
  ]),
  customFrequencyDays: z.number().int().min(1).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  amount: z.number().min(0).optional(),
  currency: z.string().default("USD"),
  billingFrequency: z
    .enum(["monthly", "quarterly", "annual", "one_time"])
    .optional(),
  autoRenew: z.boolean().default(true),
  servicesIncluded: z.array(z.any()).optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

const updateMaintenancePlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").optional(),
  description: z.string().optional(),
  status: z
    .enum(["draft", "active", "paused", "expired", "cancelled"])
    .optional(),
  frequency: z
    .enum([
      "weekly",
      "biweekly",
      "monthly",
      "quarterly",
      "semiannual",
      "annual",
      "custom",
    ])
    .optional(),
  customFrequencyDays: z.number().int().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
  amount: z.number().min(0).optional(),
  billingFrequency: z
    .enum(["monthly", "quarterly", "annual", "one_time"])
    .optional(),
  autoRenew: z.boolean().optional(),
  servicesIncluded: z.array(z.any()).optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Generate unique maintenance plan number using database function
 */
async function generateMaintenancePlanNumber(
  supabase: any,
  companyId: string
): Promise<string> {
  const { data, error } = await supabase.rpc(
    "generate_maintenance_plan_number",
    {
      p_company_id: companyId,
    }
  );

  if (error || !data) {
    // Fallback to manual generation
    const { data: latestPlan } = await supabase
      .from("maintenance_plans")
      .select("plan_number")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!latestPlan) {
      return "MP-000001";
    }

    const match = latestPlan.plan_number.match(/MP-(\d+)/);
    if (match) {
      const nextNumber = Number.parseInt(match[1], 10) + 1;
      return `MP-${nextNumber.toString().padStart(6, "0")}`;
    }

    return `MP-${Date.now().toString().slice(-6)}`;
  }

  return data;
}

/**
 * Calculate next service date based on frequency
 */
async function calculateNextServiceDate(
  supabase: any,
  lastServiceDate: string,
  frequency: string,
  customFrequencyDays?: number
): Promise<string> {
  const { data, error } = await supabase.rpc("calculate_next_service_date", {
    p_last_service_date: lastServiceDate,
    p_frequency: frequency,
    p_custom_frequency_days: customFrequencyDays,
  });

  if (error || !data) {
    // Fallback calculation
    const date = new Date(lastServiceDate);

    switch (frequency) {
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "biweekly":
        date.setDate(date.getDate() + 14);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "semiannual":
        date.setMonth(date.getMonth() + 6);
        break;
      case "annual":
        date.setFullYear(date.getFullYear() + 1);
        break;
      case "custom":
        if (customFrequencyDays) {
          date.setDate(date.getDate() + customFrequencyDays);
        }
        break;
    }

    return date.toISOString().split("T")[0];
  }

  return data;
}

/**
 * Validate maintenance plan dates
 */
function validateMaintenancePlanDates(
  startDate: string,
  endDate?: string
): void {
  const start = new Date(startDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (start < now) {
    throw new ActionError(
      "Start date cannot be in the past",
      ERROR_CODES.VALIDATION_FAILED
    );
  }

  if (endDate) {
    const end = new Date(endDate);
    if (end <= start) {
      throw new ActionError(
        "End date must be after start date",
        ERROR_CODES.VALIDATION_FAILED
      );
    }
  }
}

/**
 * Create a new maintenance plan
 */
export async function createMaintenancePlan(
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
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Parse services included if provided
    let servicesIncluded: any[] = [];
    const servicesStr = formData.get("servicesIncluded") as string;
    if (servicesStr) {
      try {
        servicesIncluded = JSON.parse(servicesStr);
      } catch {
        // Ignore parse errors, use empty array
      }
    }

    // Parse and validate form data
    const rawData = {
      customerId: formData.get("customerId") as string,
      propertyId: (formData.get("propertyId") as string) || undefined,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      frequency: formData.get("frequency") as string,
      customFrequencyDays: formData.get("customFrequencyDays")
        ? Number.parseInt(formData.get("customFrequencyDays") as string, 10)
        : undefined,
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || undefined,
      amount: formData.get("amount")
        ? Number.parseFloat(formData.get("amount") as string)
        : undefined,
      currency: (formData.get("currency") as string) || "USD",
      billingFrequency:
        (formData.get("billingFrequency") as string) || undefined,
      autoRenew: formData.get("autoRenew") === "true",
      servicesIncluded,
      terms: (formData.get("terms") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    };

    const validatedData = createMaintenancePlanSchema.parse(rawData);

    // Validate dates
    validateMaintenancePlanDates(
      validatedData.startDate,
      validatedData.endDate
    );

    // Validate custom frequency
    if (
      validatedData.frequency === "custom" &&
      !validatedData.customFrequencyDays
    ) {
      throw new ActionError(
        "Custom frequency days is required for custom frequency",
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Calculate next service date
    const nextServiceDate = await calculateNextServiceDate(
      supabase,
      validatedData.startDate,
      validatedData.frequency,
      validatedData.customFrequencyDays
    );

    // Generate plan number
    const planNumber = await generateMaintenancePlanNumber(supabase, companyId);

    // Create maintenance plan
    const { data: plan, error } = await supabase
      .from("maintenance_plans")
      .insert({
        company_id: companyId,
        customer_id: validatedData.customerId,
        property_id: validatedData.propertyId,
        plan_number: planNumber,
        name: validatedData.name,
        description: validatedData.description,
        frequency: validatedData.frequency,
        custom_frequency_days: validatedData.customFrequencyDays,
        start_date: validatedData.startDate,
        end_date: validatedData.endDate,
        next_service_date: nextServiceDate,
        amount: validatedData.amount,
        currency: validatedData.currency,
        billing_frequency: validatedData.billingFrequency,
        auto_renew: validatedData.autoRenew,
        services_included: validatedData.servicesIncluded,
        terms: validatedData.terms,
        notes: validatedData.notes,
        status: "active",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      throw new ActionError(
        `Failed to create maintenance plan: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/maintenance-plans");
    revalidatePath("/dashboard/customers");

    return plan.id;
  });
}

/**
 * Update an existing maintenance plan
 */
export async function updateMaintenancePlan(
  planId: string,
  formData: FormData
): Promise<ActionResult<boolean>> {
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
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Verify plan exists and belongs to company
    const { data: existingPlan, error: fetchError } = await supabase
      .from("maintenance_plans")
      .select("id, company_id")
      .eq("id", planId)
      .eq("company_id", companyId)
      .single();

    if (fetchError || !existingPlan) {
      throw new ActionError(
        "Maintenance plan not found",
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    // Parse and validate form data
    const rawData: any = {};
    const fields = [
      "name",
      "description",
      "status",
      "frequency",
      "customFrequencyDays",
      "startDate",
      "endDate",
      "nextServiceDate",
      "amount",
      "billingFrequency",
      "autoRenew",
      "servicesIncluded",
      "terms",
      "notes",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null && value !== undefined && value !== "") {
        if (field === "amount") {
          rawData[field] = Number.parseFloat(value as string);
        } else if (field === "customFrequencyDays") {
          rawData[field] = Number.parseInt(value as string, 10);
        } else if (field === "autoRenew") {
          rawData[field] = value === "true";
        } else if (field === "servicesIncluded") {
          try {
            rawData[field] = JSON.parse(value as string);
          } catch {
            // Ignore parse errors
          }
        } else {
          rawData[field] = value;
        }
      }
    });

    const validatedData = updateMaintenancePlanSchema.parse(rawData);

    // Validate dates if both are provided
    if (validatedData.startDate && validatedData.endDate) {
      validateMaintenancePlanDates(
        validatedData.startDate,
        validatedData.endDate
      );
    }

    // Convert camelCase to snake_case for database
    const dbUpdateData: any = {};
    Object.entries(validatedData).forEach(([key, value]) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      dbUpdateData[snakeKey] = value;
    });

    // Update maintenance plan
    const { error } = await supabase
      .from("maintenance_plans")
      .update(dbUpdateData)
      .eq("id", planId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to update maintenance plan: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/maintenance-plans");
    revalidatePath(`/dashboard/work/maintenance-plans/${planId}`);

    return true;
  });
}

/**
 * Activate a maintenance plan
 */
export async function activateMaintenancePlan(
  planId: string
): Promise<ActionResult<boolean>> {
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
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Update plan status to active
    const { error } = await supabase
      .from("maintenance_plans")
      .update({ status: "active" })
      .eq("id", planId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to activate maintenance plan: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/maintenance-plans");
    revalidatePath(`/dashboard/work/maintenance-plans/${planId}`);

    return true;
  });
}

/**
 * Pause a maintenance plan
 */
export async function pauseMaintenancePlan(
  planId: string
): Promise<ActionResult<boolean>> {
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
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Update plan status to paused
    const { error } = await supabase
      .from("maintenance_plans")
      .update({ status: "paused" })
      .eq("id", planId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to pause maintenance plan: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/maintenance-plans");
    revalidatePath(`/dashboard/work/maintenance-plans/${planId}`);

    return true;
  });
}

/**
 * Cancel a maintenance plan
 */
export async function cancelMaintenancePlan(
  planId: string
): Promise<ActionResult<boolean>> {
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
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Update plan status to cancelled
    const { error } = await supabase
      .from("maintenance_plans")
      .update({ status: "cancelled" })
      .eq("id", planId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to cancel maintenance plan: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/maintenance-plans");
    revalidatePath(`/dashboard/work/maintenance-plans/${planId}`);

    return true;
  });
}

/**
 * Delete a maintenance plan
 */
export async function deleteMaintenancePlan(
  planId: string
): Promise<ActionResult<boolean>> {
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
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Delete maintenance plan
    const { error } = await supabase
      .from("maintenance_plans")
      .delete()
      .eq("id", planId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to delete maintenance plan: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/maintenance-plans");

    return true;
  });
}

/**
 * Search maintenance plans
 */
export async function searchMaintenancePlans(
  searchQuery: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<ActionResult<any[]>> {
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
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Use the RPC function for ranked search
    const { data, error } = await supabase.rpc(
      "search_maintenance_plans_ranked",
      {
        p_company_id: companyId,
        p_search_query: searchQuery,
        p_limit: options?.limit || 50,
        p_offset: options?.offset || 0,
      }
    );

    if (error) {
      throw new ActionError(
        `Search failed: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return data || [];
  });
}

/**
 * Archive a maintenance plan (soft delete)
 */
export async function archiveMaintenancePlan(
  planId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("maintenance_plans")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", planId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/work/maintenance-plans");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
