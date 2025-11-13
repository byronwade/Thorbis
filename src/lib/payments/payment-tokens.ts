/**
 * Payment Token Utilities
 *
 * Secure token generation and validation for invoice payment links
 *
 * Features:
 * - Generate secure payment tokens with expiration
 * - Validate tokens before allowing payment
 * - Track token usage and prevent reuse
 * - IP address tracking for security
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { emailConfig } from "@/lib/email/resend-client";

export interface PaymentToken {
  token: string;
  expiresAt: string;
  paymentLink: string;
}

export interface TokenValidation {
  isValid: boolean;
  invoiceId: string | null;
  message: string;
}

/**
 * Generate a secure payment token for an invoice
 *
 * @param invoiceId - UUID of the invoice
 * @param expiryHours - How many hours until token expires (default 72 hours / 3 days)
 * @param maxUses - Maximum number of times token can be used (default 1)
 * @returns Payment token details including the full payment link
 */
export async function generatePaymentToken(
  invoiceId: string,
  expiryHours: number = 72,
  maxUses: number = 1
): Promise<PaymentToken | null> {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      console.error("Unable to connect to database");
      return null;
    }

    // Call database function to generate token
    const { data, error } = await supabase.rpc("generate_invoice_payment_token", {
      p_invoice_id: invoiceId,
      p_expiry_hours: expiryHours,
      p_max_uses: maxUses,
    });

    if (error || !data || data.length === 0) {
      console.error("Error generating payment token:", error);
      return null;
    }

    const tokenData = data[0];
    const paymentLink = `${emailConfig.appUrl}/pay/${invoiceId}?token=${tokenData.token}`;

    return {
      token: tokenData.token,
      expiresAt: tokenData.expires_at,
      paymentLink,
    };
  } catch (error) {
    console.error("Exception generating payment token:", error);
    return null;
  }
}

/**
 * Check a payment token (does NOT increment use count)
 * Use this for viewing the payment page
 *
 * @param token - The payment token to check
 * @returns Validation result with invoice ID if valid
 */
export async function validatePaymentToken(
  token: string,
  ipAddress?: string
): Promise<TokenValidation> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return {
        isValid: false,
        invoiceId: null,
        message: "Unable to connect to database",
      };
    }

    const { data, error } = await supabase.rpc("check_payment_token", {
      p_token: token,
    });

    if (error || !data || data.length === 0) {
      console.error("Error validating payment token:", error);
      return {
        isValid: false,
        invoiceId: null,
        message: "Invalid payment token",
      };
    }

    const validation = data[0];

    return {
      isValid: validation.is_valid,
      invoiceId: validation.invoice_id,
      message: validation.message,
    };
  } catch (error) {
    console.error("Exception validating payment token:", error);
    return {
      isValid: false,
      invoiceId: null,
      message: "Error validating payment token",
    };
  }
}

/**
 * Mark a payment token as used (called after successful payment)
 * This deactivates the token so it cannot be used again
 *
 * @param token - The payment token to mark as used
 * @param ipAddress - Optional IP address for security tracking
 */
export async function markTokenAsUsed(token: string, ipAddress?: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      console.error("Unable to connect to database");
      return false;
    }

    const { data: existingTokens, error: fetchError } = await supabase
      .from("invoice_payment_tokens")
      .select("use_count")
      .eq("token", token)
      .limit(1);

    if (fetchError || !existingTokens || existingTokens.length === 0) {
      console.error("Unable to fetch token before marking as used:", fetchError);
      return false;
    }

    const currentUseCount = existingTokens[0]?.use_count ?? 0;

    const { error } = await supabase
      .from("invoice_payment_tokens")
      .update({
        is_active: false,
        used_at: new Date().toISOString(),
        used_by_ip: ipAddress || null,
        use_count: currentUseCount + 1,
      })
      .eq("token", token);

    if (error) {
      console.error("Error marking token as used:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception marking token as used:", error);
    return false;
  }
}

/**
 * Get all active payment tokens for an invoice
 *
 * Useful for admin purposes or showing existing payment links
 *
 * @param invoiceId - UUID of the invoice
 * @returns Array of active payment tokens
 */
export async function getInvoicePaymentTokens(
  invoiceId: string
): Promise<PaymentToken[]> {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      console.error("Unable to connect to database");
      return [];
    }

    const { data, error } = await supabase
      .from("invoice_payment_tokens")
      .select("token, expires_at")
      .eq("invoice_id", invoiceId)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching payment tokens:", error);
      return [];
    }

    return data.map((row) => ({
      token: row.token,
      expiresAt: row.expires_at,
      paymentLink: `${emailConfig.appUrl}/pay/${invoiceId}?token=${row.token}`,
    }));
  } catch (error) {
    console.error("Exception fetching payment tokens:", error);
    return [];
  }
}

