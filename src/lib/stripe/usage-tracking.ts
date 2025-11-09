/**
 * Stripe Usage Tracking - Meter Event Recording
 *
 * This module handles tracking usage events to Stripe for billing purposes.
 * All functions are server-side only and use the Stripe Billing Meter Events API.
 *
 * Usage events are aggregated by Stripe and billed at the end of each billing period.
 *
 * Performance optimizations:
 * - Server-side only (secure)
 * - Async/await for non-blocking operations
 * - Error handling with fallback
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "./server";

/**
 * Meter event names matching Stripe Dashboard configuration
 */
export type MeterEvent =
  | "thorbis_team_members"
  | "thorbis_invoices"
  | "thorbis_estimates"
  | "thorbis_sms"
  | "thorbis_emails"
  | "thorbis_video_minutes"
  | "thorbis_phone_minutes"
  | "thorbis_storage_gb"
  | "thorbis_payments"
  | "thorbis_workflows"
  | "thorbis_api_calls";

/**
 * Track usage event in Stripe
 *
 * Sends a meter event to Stripe for billing purposes.
 * Events are aggregated based on the meter's configuration (sum, count, or last).
 *
 * @param customerId - Stripe customer ID (from users.stripe_customer_id)
 * @param eventName - Meter event name
 * @param value - Usage value (numeric)
 * @returns Success status
 *
 * @example
 * // Track invoice creation
 * await trackUsage(stripeCustomerId, "thorbis_invoices", 1);
 *
 * @example
 * // Track storage usage (last value reported)
 * await trackUsage(stripeCustomerId, "thorbis_storage_gb", 12.5);
 *
 * @example
 * // Track video call minutes
 * await trackUsage(stripeCustomerId, "thorbis_video_minutes", 45);
 */
export async function trackUsage(
  customerId: string,
  eventName: MeterEvent,
  value: number
): Promise<{ success: boolean; error?: string }> {
  if (!stripe) {
    console.error("Stripe not configured - cannot track usage");
    return { success: false, error: "Stripe not configured" };
  }

  if (!customerId) {
    console.error("No customer ID provided for usage tracking");
    return { success: false, error: "No customer ID" };
  }

  if (value < 0) {
    console.error(`Invalid usage value: ${value}. Must be non-negative.`);
    return { success: false, error: "Invalid value" };
  }

  try {
    await stripe.billing.meterEvents.create({
      event_name: eventName,
      payload: {
        stripe_customer_id: customerId,
        value: value.toString(),
      },
      // Optional: Add timestamp for when event occurred
      // timestamp: Math.floor(Date.now() / 1000),
    });

    return { success: true };
  } catch (error) {
    console.error(`Error tracking usage for ${eventName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user's Stripe customer ID from database
 *
 * Helper function to retrieve the Stripe customer ID for the current user
 * Use this before calling trackUsage() if you only have the user ID.
 *
 * @param userId - User ID from auth session
 * @returns Stripe customer ID or null
 */
export async function getUserStripeCustomerId(
  userId: string
): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) {
    console.error("Supabase not configured");
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (error || !data?.stripe_customer_id) {
    console.error("No Stripe customer ID found for user:", userId);
    return null;
  }

  return data.stripe_customer_id;
}

/**
 * Convenience functions for common usage tracking scenarios
 */

/**
 * Track invoice creation
 */
export async function trackInvoiceCreated(
  customerId: string
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_invoices", 1);
}

/**
 * Track estimate/quote creation
 */
export async function trackEstimateCreated(
  customerId: string
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_estimates", 1);
}

/**
 * Track SMS sent
 */
export async function trackSmsSent(
  customerId: string,
  count = 1
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_sms", count);
}

/**
 * Track email sent
 */
export async function trackEmailSent(
  customerId: string,
  count = 1
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_emails", count);
}

/**
 * Track video call minutes
 */
export async function trackVideoCall(
  customerId: string,
  minutes: number
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_video_minutes", minutes);
}

/**
 * Track phone call minutes
 */
export async function trackPhoneCall(
  customerId: string,
  minutes: number
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_phone_minutes", minutes);
}

/**
 * Track storage usage (GB)
 * This should be called daily or when storage changes significantly
 * The meter will use the LAST value reported for billing
 */
export async function trackStorageUsage(
  customerId: string,
  gigabytes: number
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_storage_gb", gigabytes);
}

/**
 * Track payment collected
 */
export async function trackPaymentCollected(
  customerId: string
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_payments", 1);
}

/**
 * Track automated workflow execution
 */
export async function trackWorkflowExecuted(
  customerId: string,
  count = 1
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_workflows", count);
}

/**
 * Track API call
 */
export async function trackApiCall(
  customerId: string,
  count = 1
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_api_calls", count);
}

/**
 * Track team member count
 * This should be called daily or when team size changes
 * The meter will use the LAST value reported for billing
 */
export async function trackTeamMemberCount(
  customerId: string,
  memberCount: number
): Promise<{ success: boolean; error?: string }> {
  return trackUsage(customerId, "thorbis_team_members", memberCount);
}

/**
 * Batch track multiple usage events at once
 *
 * More efficient than calling trackUsage() multiple times sequentially
 *
 * @example
 * await trackUsageBatch(customerId, [
 *   { event: "thorbis_invoices", value: 1 },
 *   { event: "thorbis_emails", value: 3 },
 * ]);
 */
export async function trackUsageBatch(
  customerId: string,
  events: Array<{ event: MeterEvent; value: number }>
): Promise<{ success: boolean; errors?: string[] }> {
  const errors: string[] = [];

  const results = await Promise.allSettled(
    events.map(({ event, value }) => trackUsage(customerId, event, value))
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      errors.push(`Failed to track ${events[index].event}: ${result.reason}`);
    } else if (!result.value.success) {
      errors.push(
        `Failed to track ${events[index].event}: ${result.value.error}`
      );
    }
  });

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
