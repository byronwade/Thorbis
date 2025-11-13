/**
 * Payment Processor Abstraction Layer
 *
 * Provides a unified interface for multiple payment processors:
 * - Stripe: For platform billing (subscriptions)
 * - Adyen: For high-value contractor payments (card-present, ACH)
 * - Plaid: For bank account linking and ACH
 * - ProfitStars: For ACH/check processing
 *
 * This abstraction allows contractors to process high-value payments
 * without Stripe's limitations while maintaining a consistent API.
 */

import { createClient } from "@/lib/supabase/server";
import type {
  PaymentChannel,
  PaymentProcessor,
  PaymentProcessorConfig,
  PaymentProcessorType,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from "./processor-types";

// Re-export all types to maintain API compatibility
export type {
  PaymentProcessorType,
  PaymentChannel,
  PaymentProcessorConfig,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
  PaymentProcessor,
};

/**
 * Get the appropriate payment processor for a company
 *
 * Determines which processor to use based on:
 * 1. Company's configured processor
 * 2. Payment amount (high-value payments use Adyen)
 * 3. Payment channel (card-present uses Adyen, ACH uses Plaid/ProfitStars)
 */
export async function getPaymentProcessor(
  companyId: string,
  options?: {
    amount?: number;
    channel?: PaymentChannel;
    forceProcessor?: PaymentProcessorType;
  }
): Promise<PaymentProcessor | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  // Check if company has at least one bank account (required for payments)
  const { data: bankAccounts } = await supabase
    .from("finance_bank_accounts")
    .select("id")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .limit(1);

  if (!bankAccounts || bankAccounts.length === 0) {
    console.warn(
      `No bank account configured for company ${companyId}. Payments cannot be processed without a bank account.`
    );
    return null;
  }

  // Get company's payment processor configuration
  const { data: processors } = await supabase
    .from("company_payment_processors")
    .select("*")
    .eq("company_id", companyId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (!processors || processors.length === 0) {
    // No processor configured, use Stripe as fallback (for platform billing only)
    console.warn(`No payment processor configured for company ${companyId}`);
    return null;
  }

  // If force processor specified, use it
  if (options?.forceProcessor) {
    const processor = processors.find(
      (p) => p.processor_type === options.forceProcessor
    );
    if (processor) {
      return createProcessorInstance(processor);
    }
  }

  // Determine processor based on payment characteristics
  const amount = options?.amount || 0;
  const channel = options?.channel || "online";

  // High-value payments (>$10k) should use Adyen
  if (
    amount > 1_000_000 &&
    processors.some((p) => p.processor_type === "adyen")
  ) {
    const adyenProcessor = processors.find((p) => p.processor_type === "adyen");
    if (adyenProcessor) {
      return createProcessorInstance(adyenProcessor);
    }
  }

  // Card-present or tap-to-pay should use Adyen
  if (
    (channel === "card_present" || channel === "tap_to_pay") &&
    processors.some((p) => p.processor_type === "adyen")
  ) {
    const adyenProcessor = processors.find((p) => p.processor_type === "adyen");
    if (adyenProcessor) {
      return createProcessorInstance(adyenProcessor);
    }
  }

  // ACH payments should use Plaid or ProfitStars
  if (channel === "ach") {
    const plaidProcessor = processors.find((p) => p.processor_type === "plaid");
    if (plaidProcessor) {
      return createProcessorInstance(plaidProcessor);
    }
    const profitstarsProcessor = processors.find(
      (p) => p.processor_type === "profitstars"
    );
    if (profitstarsProcessor) {
      return createProcessorInstance(profitstarsProcessor);
    }
  }

  // Default to first active processor
  return createProcessorInstance(processors[0]);
}

/**
 * Create a processor instance from database configuration
 */
async function createProcessorInstance(
  config: any
): Promise<PaymentProcessor | null> {
  switch (config.processor_type) {
    case "adyen": {
      const { AdyenProcessor } = await import("./processors/adyen");
      return new AdyenProcessor({
        companyId: config.company_id,
        accountId: config.adyen_account_id,
        apiKey: config.adyen_api_key_encrypted, // Will need decryption
        merchantAccount: config.adyen_merchant_account,
        liveMode: config.adyen_live_mode,
      });
    }
    case "plaid": {
      const { PlaidProcessor } = await import("./processors/plaid");
      return new PlaidProcessor({
        companyId: config.company_id,
        clientId: config.plaid_client_id,
        secret: config.plaid_secret_encrypted, // Will need decryption
        environment: config.plaid_environment || "sandbox",
      });
    }
    case "profitstars": {
      const { ProfitStarsProcessor } = await import("./processors/profitstars");
      return new ProfitStarsProcessor({
        companyId: config.company_id,
        merchantId: config.profitstars_merchant_id,
        apiKey: config.profitstars_api_key_encrypted, // Will need decryption
        routingNumber: config.profitstars_routing_number,
      });
    }
    case "stripe": {
      const { StripeProcessor } = await import("./processors/stripe");
      return new StripeProcessor({
        companyId: config.company_id,
        liveMode: config.adyen_live_mode,
      });
    }
    default:
      return null;
  }
}

/**
 * Calculate trust score for a payment
 *
 * Higher trust scores allow larger payments without flagging
 */
export async function calculatePaymentTrustScore(
  companyId: string,
  amount: number
): Promise<{
  score: number;
  allowed: boolean;
  requiresApproval: boolean;
  reason?: string;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      score: 0,
      allowed: false,
      requiresApproval: true,
      reason: "Database unavailable",
    };
  }

  // Get company's trust score
  const { data: trustScore } = await supabase
    .from("payment_trust_scores")
    .select("*")
    .eq("company_id", companyId)
    .single();

  if (!trustScore) {
    return {
      score: 50,
      allowed: false,
      requiresApproval: true,
      reason: "No trust score found",
    };
  }

  const score = Number(trustScore.overall_score);

  // Get processor configuration
  const { data: processor } = await supabase
    .from("company_payment_processors")
    .select("max_payment_amount, requires_approval_above")
    .eq("company_id", companyId)
    .eq("status", "active")
    .single();

  const maxAmount = processor?.max_payment_amount || 100_000; // Default $1,000
  const approvalThreshold = processor?.requires_approval_above || 50_000; // Default $500

  // Calculate if payment is allowed based on trust score
  // Trust score 90+: Allow up to configured max
  // Trust score 70-89: Allow up to 50% of max
  // Trust score 50-69: Allow up to 25% of max
  // Trust score <50: Require approval for any payment > $100

  let allowedAmount = maxAmount;
  if (score >= 90) {
    allowedAmount = maxAmount;
  } else if (score >= 70) {
    allowedAmount = Math.floor(maxAmount * 0.5);
  } else if (score >= 50) {
    allowedAmount = Math.floor(maxAmount * 0.25);
  } else {
    allowedAmount = 10_000; // $100 minimum
  }

  const allowed = amount <= allowedAmount;
  const requiresApproval = amount > approvalThreshold || score < 70;

  return {
    score,
    allowed,
    requiresApproval,
    reason: allowed
      ? requiresApproval
        ? "Payment requires manual approval"
        : undefined
      : `Payment amount exceeds allowed limit for trust score. Max allowed: $${allowedAmount / 100}`,
  };
}

/**
 * Update trust score after payment
 */
export async function updateTrustScoreAfterPayment(
  companyId: string,
  success: boolean,
  amount: number
): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return;

  const { data: trustScore } = await supabase
    .from("payment_trust_scores")
    .select("*")
    .eq("company_id", companyId)
    .single();

  if (!trustScore) return;

  // Update metrics
  const updates: any = {
    total_payments_count: (trustScore.total_payments_count || 0) + 1,
    total_payments_volume: (trustScore.total_payments_volume || 0) + amount,
    last_calculated_at: new Date().toISOString(),
  };

  if (success) {
    updates.successful_payments_count =
      (trustScore.successful_payments_count || 0) + 1;
  } else {
    updates.failed_payments_count = (trustScore.failed_payments_count || 0) + 1;
  }

  // Update largest payment
  if (amount > (trustScore.largest_payment_amount || 0)) {
    updates.largest_payment_amount = amount;
  }

  // Recalculate overall score
  const totalPayments = updates.total_payments_count;
  const successfulPayments =
    updates.successful_payments_count ||
    trustScore.successful_payments_count ||
    0;
  const failedPayments =
    updates.failed_payments_count || trustScore.failed_payments_count || 0;

  // Success rate (0-100)
  const successRate =
    totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 50;

  // Volume factor (higher volume = higher trust, capped at 100)
  const volumeFactor = Math.min(
    100,
    Math.log10((updates.total_payments_volume || 0) / 100 + 1) * 20
  );

  // Account age factor (older accounts = higher trust)
  const accountAgeDays = trustScore.account_age_days || 0;
  const ageFactor = Math.min(100, (accountAgeDays / 30) * 10); // 100 points after 300 days

  // Calculate weighted overall score
  const overallScore =
    successRate * 0.4 + // 40% weight on success rate
    volumeFactor * 0.3 + // 30% weight on volume
    ageFactor * 0.2 + // 20% weight on account age
    (trustScore.business_verified ? 10 : 0) + // 10% for verification
    (trustScore.bank_account_verified ? 5 : 0) +
    (trustScore.identity_verified ? 5 : 0);

  updates.overall_score = Math.min(100, Math.max(0, overallScore));
  updates.refund_rate =
    totalPayments > 0
      ? ((trustScore.refunded_amount || 0) / updates.total_payments_volume) *
        100
      : 0;

  await supabase
    .from("payment_trust_scores")
    .update(updates)
    .eq("company_id", companyId);
}
