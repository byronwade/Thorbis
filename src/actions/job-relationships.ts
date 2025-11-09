/**
 * Job Relationships Server Actions
 *
 * Manages many-to-many relationships between jobs and other entities:
 * - Multiple customers per job
 * - Multiple properties per job
 * - Equipment serviced per job
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

const addCustomerToJobSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
  role: z
    .enum(["primary", "secondary", "billing", "property_owner"])
    .default("secondary"),
  isPrimary: z.boolean().default(false),
  isBillingContact: z.boolean().default(false),
  billingPercentage: z.number().min(0).max(100).default(100),
});

const addPropertyToJobSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  role: z.enum(["primary", "secondary", "related"]).default("secondary"),
  isPrimary: z.boolean().default(false),
  workDescription: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
});

const addEquipmentToJobSchema = z.object({
  equipmentId: z.string().uuid("Invalid equipment ID"),
  serviceType: z.string().optional(),
  serviceDescription: z.string().optional(),
  hoursSpent: z.number().min(0).optional(),
});

// ============================================================================
// JOB CUSTOMER RELATIONSHIPS
// ============================================================================

/**
 * Add customer to job
 */
export async function addCustomerToJob(
  jobId: string,
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

    const data = addCustomerToJobSchema.parse({
      customerId: formData.get("customerId"),
      role: formData.get("role") || "secondary",
      isPrimary: formData.get("isPrimary") === "true",
      isBillingContact: formData.get("isBillingContact") === "true",
      billingPercentage: formData.get("billingPercentage")
        ? Number.parseFloat(formData.get("billingPercentage") as string)
        : 100,
    });

    // Verify job belongs to company
    const { data: job } = await supabase
      .from("jobs")
      .select("company_id")
      .eq("id", jobId)
      .single();

    assertExists(job, "Job");

    if (job.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("job"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify customer belongs to company
    const { data: customer } = await supabase
      .from("customers")
      .select("company_id")
      .eq("id", data.customerId)
      .single();

    assertExists(customer, "Customer");

    if (customer.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("customer"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // If setting as primary, unset other primaries
    if (data.isPrimary) {
      await supabase
        .from("job_customers")
        .update({ is_primary: false })
        .eq("job_id", jobId);

      // Update job's primary_customer_id
      await supabase
        .from("jobs")
        .update({ primary_customer_id: data.customerId })
        .eq("id", jobId);
    }

    // Add customer to job
    const { data: jobCustomer, error: createError } = await supabase
      .from("job_customers")
      .insert({
        company_id: teamMember.company_id,
        job_id: jobId,
        customer_id: data.customerId,
        role: data.role,
        is_primary: data.isPrimary,
        is_billing_contact: data.isBillingContact,
        billing_percentage: data.billingPercentage,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("add customer to job"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/work/${jobId}`);
    return jobCustomer.id;
  });
}

/**
 * Remove customer from job
 */
export async function removeCustomerFromJob(
  jobId: string,
  customerId: string
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

    // Verify job belongs to company
    const { data: job } = await supabase
      .from("jobs")
      .select("company_id")
      .eq("id", jobId)
      .single();

    assertExists(job, "Job");

    if (job.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("job"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Check if this is the only customer
    const { data: customerCount } = await supabase
      .from("job_customers")
      .select("id", { count: "exact" })
      .eq("job_id", jobId);

    if (customerCount && customerCount.length <= 1) {
      throw new ActionError(
        "Cannot remove the only customer from a job",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Delete customer from job
    const { error: deleteError } = await supabase
      .from("job_customers")
      .delete()
      .eq("job_id", jobId)
      .eq("customer_id", customerId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("remove customer from job"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/work/${jobId}`);
  });
}

/**
 * Set primary customer for job
 */
export async function setPrimaryCustomer(
  jobId: string,
  customerId: string
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

    // Unset all primaries for this job
    await supabase
      .from("job_customers")
      .update({ is_primary: false })
      .eq("job_id", jobId);

    // Set new primary
    const { error: updateError } = await supabase
      .from("job_customers")
      .update({ is_primary: true })
      .eq("job_id", jobId)
      .eq("customer_id", customerId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("set primary customer"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Update job's primary_customer_id
    await supabase
      .from("jobs")
      .update({ primary_customer_id: customerId })
      .eq("id", jobId);

    revalidatePath(`/dashboard/work/${jobId}`);
  });
}

// ============================================================================
// JOB PROPERTY RELATIONSHIPS
// ============================================================================

/**
 * Add property to job
 */
export async function addPropertyToJob(
  jobId: string,
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

    const data = addPropertyToJobSchema.parse({
      propertyId: formData.get("propertyId"),
      role: formData.get("role") || "secondary",
      isPrimary: formData.get("isPrimary") === "true",
      workDescription: formData.get("workDescription") || undefined,
      estimatedHours: formData.get("estimatedHours")
        ? Number.parseFloat(formData.get("estimatedHours") as string)
        : undefined,
    });

    // Verify job belongs to company
    const { data: job } = await supabase
      .from("jobs")
      .select("company_id")
      .eq("id", jobId)
      .single();

    assertExists(job, "Job");

    if (job.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("job"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify property belongs to company
    const { data: property } = await supabase
      .from("properties")
      .select("company_id")
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

    // If setting as primary, unset other primaries
    if (data.isPrimary) {
      await supabase
        .from("job_properties")
        .update({ is_primary: false })
        .eq("job_id", jobId);

      // Update job's primary_property_id
      await supabase
        .from("jobs")
        .update({ primary_property_id: data.propertyId })
        .eq("id", jobId);
    }

    // Add property to job
    const { data: jobProperty, error: createError } = await supabase
      .from("job_properties")
      .insert({
        company_id: teamMember.company_id,
        job_id: jobId,
        property_id: data.propertyId,
        role: data.role,
        is_primary: data.isPrimary,
        work_description: data.workDescription,
        estimated_hours: data.estimatedHours,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("add property to job"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/work/${jobId}`);
    return jobProperty.id;
  });
}

/**
 * Remove property from job
 */
export async function removePropertyFromJob(
  jobId: string,
  propertyId: string
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

    // Check if this is the only property
    const { data: propertyCount } = await supabase
      .from("job_properties")
      .select("id", { count: "exact" })
      .eq("job_id", jobId);

    if (propertyCount && propertyCount.length <= 1) {
      throw new ActionError(
        "Cannot remove the only property from a job",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Delete property from job
    const { error: deleteError } = await supabase
      .from("job_properties")
      .delete()
      .eq("job_id", jobId)
      .eq("property_id", propertyId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("remove property from job"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/work/${jobId}`);
  });
}

/**
 * Set primary property for job
 */
export async function setPrimaryProperty(
  jobId: string,
  propertyId: string
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

    // Unset all primaries for this job
    await supabase
      .from("job_properties")
      .update({ is_primary: false })
      .eq("job_id", jobId);

    // Set new primary
    const { error: updateError } = await supabase
      .from("job_properties")
      .update({ is_primary: true })
      .eq("job_id", jobId)
      .eq("property_id", propertyId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("set primary property"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Update job's primary_property_id
    await supabase
      .from("jobs")
      .update({ primary_property_id: propertyId })
      .eq("id", jobId);

    revalidatePath(`/dashboard/work/${jobId}`);
  });
}

/**
 * Get all customers for a job
 */
export async function getJobCustomers(
  jobId: string
): Promise<ActionResult<any[]>> {
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

    const { data: jobCustomers, error } = await supabase
      .from("job_customers")
      .select(`
        *,
        customer:customers(*)
      `)
      .eq("job_id", jobId)
      .eq("company_id", teamMember.company_id)
      .order("is_primary", { ascending: false });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch job customers"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return jobCustomers || [];
  });
}

/**
 * Get all properties for a job
 */
export async function getJobProperties(
  jobId: string
): Promise<ActionResult<any[]>> {
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

    const { data: jobProperties, error } = await supabase
      .from("job_properties")
      .select(`
        *,
        property:properties(*)
      `)
      .eq("job_id", jobId)
      .eq("company_id", teamMember.company_id)
      .order("is_primary", { ascending: false });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch job properties"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return jobProperties || [];
  });
}
