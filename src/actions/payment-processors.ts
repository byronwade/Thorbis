"use server";

/**
 * Payment Processor Management Actions
 *
 * Handles configuration and management of payment processors for companies:
 * - Adyen setup and configuration
 * - Plaid bank account linking
 * - ProfitStars ACH setup
 * - Trust score management
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import { withErrorHandling } from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const adyenConfigSchema = z.object({
  accountId: z.string().min(1),
  apiKey: z.string().min(1),
  merchantAccount: z.string().min(1),
  webhookUsername: z.string().optional(),
  webhookPassword: z.string().optional(),
  liveMode: z.boolean().default(false),
});

const plaidConfigSchema = z.object({
  clientId: z.string().min(1),
  secret: z.string().min(1),
  environment: z
    .enum(["sandbox", "development", "production"])
    .default("sandbox"),
});

const profitstarsConfigSchema = z.object({
  merchantId: z.string().min(1),
  apiKey: z.string().min(1),
  routingNumber: z.string().length(9),
});

const processorConfigSchema = z.object({
  processorType: z.enum(["adyen", "plaid", "profitstars"]),
  maxPaymentAmount: z.number().int().positive().optional(),
  maxDailyVolume: z.number().int().positive().optional(),
  requiresApprovalAbove: z.number().int().positive().optional(),
});

// ============================================================================
// CREATE/UPDATE PROCESSOR CONFIGURATION
// ============================================================================

export async function configurePaymentProcessor(
  formData: FormData
): Promise<{ success: boolean; error?: string; processorId?: string }> {
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
    if (!user) {
      throw new ActionError(
        "Not authenticated",
        ERROR_CODES.AUTH_UNAUTHORIZED,
        401
      );
    }

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id, role")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (!["owner", "admin", "finance_manager"].includes(teamMember.role)) {
      throw new ActionError(
        "Insufficient permissions",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const processorType = formData.get("processorType") as string;
    const configData: any = {
      company_id: teamMember.company_id,
      processor_type: processorType,
      status: "pending",
    };

    // Configure based on processor type
    if (processorType === "adyen") {
      const adyenConfig = adyenConfigSchema.parse({
        accountId: formData.get("adyenAccountId"),
        apiKey: formData.get("adyenApiKey"),
        merchantAccount: formData.get("adyenMerchantAccount"),
        webhookUsername: formData.get("adyenWebhookUsername") || undefined,
        webhookPassword: formData.get("adyenWebhookPassword") || undefined,
        liveMode: formData.get("adyenLiveMode") === "true",
      });

      // TODO: Encrypt sensitive data before storing
      configData.adyen_account_id = adyenConfig.accountId;
      configData.adyen_api_key_encrypted = adyenConfig.apiKey; // Should be encrypted
      configData.adyen_merchant_account = adyenConfig.merchantAccount;
      configData.adyen_webhook_username = adyenConfig.webhookUsername;
      configData.adyen_webhook_password_encrypted = adyenConfig.webhookPassword; // Should be encrypted
      configData.adyen_live_mode = adyenConfig.liveMode;
    } else if (processorType === "plaid") {
      const plaidConfig = plaidConfigSchema.parse({
        clientId: formData.get("plaidClientId"),
        secret: formData.get("plaidSecret"),
        environment: formData.get("plaidEnvironment") || "sandbox",
      });

      configData.plaid_client_id = plaidConfig.clientId;
      configData.plaid_secret_encrypted = plaidConfig.secret; // Should be encrypted
      configData.plaid_environment = plaidConfig.environment;
    } else if (processorType === "profitstars") {
      const profitstarsConfig = profitstarsConfigSchema.parse({
        merchantId: formData.get("profitstarsMerchantId"),
        apiKey: formData.get("profitstarsApiKey"),
        routingNumber: formData.get("profitstarsRoutingNumber"),
      });

      configData.profitstars_merchant_id = profitstarsConfig.merchantId;
      configData.profitstars_api_key_encrypted = profitstarsConfig.apiKey; // Should be encrypted
      configData.profitstars_routing_number = profitstarsConfig.routingNumber;
    }

    // Add trust/risk settings
    const maxPaymentAmount = formData.get("maxPaymentAmount");
    if (maxPaymentAmount) {
      configData.max_payment_amount = Math.round(
        Number.parseFloat(maxPaymentAmount as string) * 100
      ); // Convert to cents
    }

    const maxDailyVolume = formData.get("maxDailyVolume");
    if (maxDailyVolume) {
      configData.max_daily_volume = Math.round(
        Number.parseFloat(maxDailyVolume as string) * 100
      );
    }

    const requiresApprovalAbove = formData.get("requiresApprovalAbove");
    if (requiresApprovalAbove) {
      configData.requires_approval_above = Math.round(
        Number.parseFloat(requiresApprovalAbove as string) * 100
      );
    }

    // Check if processor already exists
    const { data: existing } = await supabase
      .from("company_payment_processors")
      .select("id")
      .eq("company_id", teamMember.company_id)
      .eq("processor_type", processorType)
      .single();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("company_payment_processors")
        .update(configData)
        .eq("id", existing.id)
        .select("id")
        .single();

      if (error)
        throw new ActionError(error.message, ERROR_CODES.DB_QUERY_ERROR);
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from("company_payment_processors")
        .insert(configData)
        .select("id")
        .single();

      if (error)
        throw new ActionError(error.message, ERROR_CODES.DB_QUERY_ERROR);
      result = data;
    }

    revalidatePath("/dashboard/settings/payments");
    return { success: true, processorId: result.id };
  });
}

// ============================================================================
// GET PROCESSOR CONFIGURATION
// ============================================================================

export async function getPaymentProcessorConfig(
  processorType?: string
): Promise<{ success: boolean; error?: string; processors?: any[] }> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "You must be part of a company" };
    }

    let query = supabase
      .from("company_payment_processors")
      .select("*")
      .eq("company_id", teamMember.company_id);

    if (processorType) {
      query = query.eq("processor_type", processorType);
    }

    const { data: processors, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    // Don't return encrypted fields in full - just indicate if they're set
    const sanitized = processors?.map((p) => ({
      ...p,
      adyen_api_key_encrypted: p.adyen_api_key_encrypted ? "***" : null,
      plaid_secret_encrypted: p.plaid_secret_encrypted ? "***" : null,
      profitstars_api_key_encrypted: p.profitstars_api_key_encrypted
        ? "***"
        : null,
    }));

    return { success: true, processors: sanitized };
  });
}

// ============================================================================
// GET TRUST SCORE
// ============================================================================

export async function getTrustScore(): Promise<{
  success: boolean;
  error?: string;
  trustScore?: any;
}> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "You must be part of a company" };
    }

    const { data: trustScore, error } = await supabase
      .from("payment_trust_scores")
      .select("*")
      .eq("company_id", teamMember.company_id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = not found, which is okay
      return { success: false, error: error.message };
    }

    return { success: true, trustScore: trustScore || null };
  });
}

// ============================================================================
// ACTIVATE/DEACTIVATE PROCESSOR
// ============================================================================

export async function updateProcessorStatus(
  processorId: string,
  status: "active" | "suspended" | "inactive"
): Promise<{ success: boolean; error?: string }> {
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
    if (!user) {
      throw new ActionError(
        "Not authenticated",
        ERROR_CODES.AUTH_UNAUTHORIZED,
        401
      );
    }

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id, role")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    if (!["owner", "admin", "finance_manager"].includes(teamMember.role)) {
      throw new ActionError(
        "Insufficient permissions",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify processor belongs to company
    const { data: processor } = await supabase
      .from("company_payment_processors")
      .select("company_id")
      .eq("id", processorId)
      .single();

    if (!processor || processor.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Processor not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const { error } = await supabase
      .from("company_payment_processors")
      .update({ status })
      .eq("id", processorId);

    if (error) {
      throw new ActionError(error.message, ERROR_CODES.DB_QUERY_ERROR);
    }

    revalidatePath("/dashboard/settings/payments");
    return { success: true };
  });
}
