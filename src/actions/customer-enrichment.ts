/**
 * Customer Enrichment Server Actions
 *
 * Server-side actions for enriching customer data with external APIs:
 * - Trigger enrichment for a customer
 * - Get cached enrichment data
 * - Refresh expired enrichment
 * - Check enrichment quota/limits
 * - Get usage statistics
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
  type ActionResult,
  assertAuthenticated,
  assertExists,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { customerEnrichmentService } from "@/lib/services/customer-enrichment";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const enrichCustomerSchema = z.object({
  customerId: z.string().uuid(),
  forceRefresh: z.boolean().optional().default(false),
});

// ============================================================================
// ENRICHMENT OPERATIONS
// ============================================================================

/**
 * Enrich customer data with external APIs
 */
export async function enrichCustomerData(
  customerId: string,
  forceRefresh = false
): Promise<ActionResult<any>> {
  return await withErrorHandling(async () => {
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

    // Get the active company ID
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError("No active company", ERROR_CODES.AUTH_UNAUTHORIZED);
    }

    // Verify user has access to the active company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("company_id", activeCompanyId)
      .eq("status", "active")
      .maybeSingle();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "User not in active company",
        ERROR_CODES.AUTH_UNAUTHORIZED
      );
    }

    // Get customer with company verification
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .single();

    assertExists(customer, "Customer");

    // Check if enrichment already exists and is valid
    if (!forceRefresh) {
      const { data: existingEnrichment } = await supabase
        .from("customer_enrichment_data")
        .select("*")
        .eq("customer_id", customerId)
        .eq("data_type", "combined")
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (existingEnrichment) {
        return existingEnrichment.enrichment_data;
      }
    }

    // Check enrichment quota
    const { data: canEnrich } = await supabase.rpc("can_enrich_customer", {
      p_company_id: teamMember.company_id,
    });

    if (!canEnrich) {
      throw new ActionError(
        "Enrichment limit reached for this month. Upgrade your plan for more enrichments.",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Perform enrichment
    const enrichmentResult = await customerEnrichmentService.enrichCustomer({
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      companyName: customer.company_name,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zip_code,
    });

    if (enrichmentResult.enrichmentStatus === "failed") {
      throw new ActionError(
        "Failed to enrich customer data from all sources",
        ERROR_CODES.SERVICE_INTEGRATION_ERROR
      );
    }

    // Store enrichment data
    const { error: insertError } = await supabase
      .from("customer_enrichment_data")
      .insert({
        customer_id: customerId,
        data_type: "combined",
        source: enrichmentResult.sources.join(","),
        enrichment_data: enrichmentResult as any,
        confidence_score: enrichmentResult.overallConfidence,
        cached_at: new Date().toISOString(),
        expires_at: enrichmentResult.expiresAt,
        status: "active",
      });

    if (insertError) {
      console.error("Error storing enrichment:", insertError);
    }

    // Increment usage counter
    await supabase.rpc("increment_enrichment_usage", {
      p_company_id: teamMember.company_id,
      p_api_cost: 0, // Could track actual API costs here
    });

    // Revalidate customer pages
    revalidatePath(`/dashboard/customers/${customerId}`);
    revalidatePath("/dashboard/customers");

    return enrichmentResult;
  });
}

/**
 * Get cached enrichment data for a customer
 */
export async function getEnrichmentData(
  customerId: string
): Promise<ActionResult<any>> {
  return await withErrorHandling(async () => {
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

    // Get the active company ID
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError("No active company", ERROR_CODES.AUTH_UNAUTHORIZED);
    }

    // Verify user has access to the active company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("company_id", activeCompanyId)
      .eq("status", "active")
      .maybeSingle();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "User not in active company",
        ERROR_CODES.AUTH_UNAUTHORIZED
      );
    }

    // Verify customer belongs to company
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("id", customerId)
      .eq("company_id", teamMember.company_id)
      .single();

    if (!customer) {
      throw new ActionError(
        "Customer not found",
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    // Get all enrichment data for customer (optional, non-critical)
    const { data: enrichmentRows, error: enrichmentError } = await supabase
      .from("customer_enrichment_data")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    // If enrichment data fetch fails, return null instead of throwing
      // Enrichment is optional and shouldn't block page load
      console.warn(
        `[getEnrichmentData] Failed to fetch enrichment for customer ${customerId}:`,
        enrichmentError
      );
      return null;
    }

    if (!enrichmentRows || enrichmentRows.length === 0) {
      // If no enrichment data exists, return null
      return null;
    }

    // Group by data type
    const grouped = {
      combined: enrichmentRows.find((e) => e.data_type === "combined"),
      person: enrichmentRows.find((e) => e.data_type === "person"),
      business: enrichmentRows.find((e) => e.data_type === "business"),
      social: enrichmentRows.find((e) => e.data_type === "social"),
      property: enrichmentRows.filter((e) => e.data_type === "property"),
    };

    return grouped;
  });
}

/**
 * Refresh enrichment data (force refresh even if not expired)
 */
export async function refreshEnrichment(
  customerId: string
): Promise<ActionResult<any>> {
  return enrichCustomerData(customerId, true);
}

/**
 * Get enrichment usage statistics for company
 */
export async function getEnrichmentUsageStats(): Promise<
  ActionResult<
    Array<{
      month_year: string;
      enrichments_count: number;
      enrichments_limit: number | null;
      api_costs: number;
      tier: string;
      percentage_used: number;
    }>
  >
> {
  return await withErrorHandling(async () => {
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

    // Get the active company ID
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError("No active company", ERROR_CODES.AUTH_UNAUTHORIZED);
    }

    // Verify user has access to the active company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("company_id", activeCompanyId)
      .eq("status", "active")
      .maybeSingle();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "User not in active company",
        ERROR_CODES.AUTH_UNAUTHORIZED
      );
    }

    // Get usage stats
    const { data, error } = await supabase.rpc("get_enrichment_stats", {
      p_company_id: teamMember.company_id,
    });

    if (error) {
      throw new ActionError(
        "Failed to fetch usage stats",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return data || [];
  });
}

/**
 * Check if company can enrich more customers this month
 */
export async function checkEnrichmentQuota(): Promise<
  ActionResult<{
    canEnrich: boolean;
    current: number;
    limit: number | null;
    tier: string;
  }>
> {
  return await withErrorHandling(async () => {
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

    // Get the active company ID
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError("No active company", ERROR_CODES.AUTH_UNAUTHORIZED);
    }

    // Verify user has access to the active company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("company_id", activeCompanyId)
      .eq("status", "active")
      .maybeSingle();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "User not in active company",
        ERROR_CODES.AUTH_UNAUTHORIZED
      );
    }

    // Check if can enrich
    const { data: canEnrich } = await supabase.rpc("can_enrich_customer", {
      p_company_id: teamMember.company_id,
    });

    // Get current usage
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const { data: usage } = await supabase
      .from("customer_enrichment_usage")
      .select("*")
      .eq("company_id", teamMember.company_id)
      .eq("month_year", currentMonth)
      .single();

    return {
      canEnrich,
      current: usage?.enrichments_count || 0,
      limit: usage?.enrichments_limit || null,
      tier: usage?.tier || "free",
    };
  });
}

/**
 * Update enrichment tier limits (admin only)
 */
export async function updateEnrichmentTier(
  tier: "free" | "pro" | "enterprise"
): Promise<ActionResult<void>> {
  return await withErrorHandling(async () => {
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

    // Get the active company ID
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError("No active company", ERROR_CODES.AUTH_UNAUTHORIZED);
    }

    // Verify user has access to the active company and get role
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id, role")
      .eq("user_id", user.id)
      .eq("company_id", activeCompanyId)
      .eq("status", "active")
      .maybeSingle();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "User not in active company",
        ERROR_CODES.AUTH_UNAUTHORIZED
      );
    }

    // Check if user is admin/owner
    if (!["owner", "admin"].includes(teamMember.role)) {
      throw new ActionError(
        "Only admins can update enrichment tier",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Set limits based on tier
    const limits = {
      free: 50,
      pro: 500,
      enterprise: null, // Unlimited
    };

    const currentMonth = new Date().toISOString().slice(0, 7);

    // Upsert usage record with new tier
    const { error } = await supabase.from("customer_enrichment_usage").upsert({
      company_id: teamMember.company_id,
      month_year: currentMonth,
      tier,
      enrichments_limit: limits[tier],
    });

    if (error) {
      throw new ActionError(
        "Failed to update tier",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/subscriptions");
  });
}

/**
 * Delete enrichment data for a customer
 */
export async function deleteEnrichmentData(
  customerId: string
): Promise<ActionResult<void>> {
  return await withErrorHandling(async () => {
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

    // Delete enrichment data (RLS will ensure user has access)
    const { error } = await supabase
      .from("customer_enrichment_data")
      .delete()
      .eq("customer_id", customerId);

    if (error) {
      throw new ActionError(
        "Failed to delete enrichment data",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
  });
}
