"use server";

/**
 * Billing Server Actions - Stripe Subscription Management
 *
 * Features:
 * - Multi-organization subscription support
 * - Checkout session creation for new subscriptions
 * - Billing portal access for existing subscriptions
 * - Subscription status checks
 * - Cancel/reactivate subscriptions
 *
 * Performance optimizations:
 * - Server Actions for secure Stripe API calls
 * - Proper error handling with user-friendly messages
 * - Database queries optimized with indexes
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createBillingPortalSession,
  createCheckoutSession,
  getOrCreateStripeCustomer,
  getSubscription,
  cancelSubscription as stripeCancel,
  reactivateSubscription as stripeReactivate,
} from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

// Internal return type (not exported - Next.js 16 "use server" restriction)
type BillingActionResult = {
  success: boolean;
  error?: string;
  url?: string;
  data?: any;
};

/**
 * Create Checkout Session for New Organization
 *
 * Creates a Stripe checkout session for subscribing to a new organization
 * Handles both first organization (base plan) and additional organizations (base + $100)
 */
export async function createOrganizationCheckoutSession(
  companyId: string,
  successUrl?: string,
  cancelUrl?: string,
  phoneNumber?: string
): Promise<BillingActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    // Get user's email for Stripe customer
    const { data: userData } = await supabase
      .from("users")
      .select("email, name, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Get or create Stripe customer
    let customerId = userData.stripe_customer_id;
    if (!customerId) {
      customerId = await getOrCreateStripeCustomer(
        user.id,
        userData.email,
        userData.name || undefined
      );

      if (!customerId) {
        return {
          success: false,
          error: "Failed to create billing customer",
        };
      }

      // Save customer ID to database
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Check if this is an additional organization
    const { data: existingMemberships } = await supabase
      .from("team_members")
      .select("company_id, companies!inner(stripe_subscription_status)")
      .eq("user_id", user.id)
      .eq("status", "active");

    // Count organizations with active subscriptions
    const activeOrgsCount =
      existingMemberships?.filter(
        (m: any) => m.companies?.stripe_subscription_status === "active"
      ).length || 0;

    const isAdditionalOrg = activeOrgsCount > 0;

    // Create checkout session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const checkoutUrl = await createCheckoutSession({
      customerId,
      companyId,
      isAdditionalOrg,
      successUrl:
        successUrl ||
        `${siteUrl}/dashboard/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: cancelUrl || `${siteUrl}/dashboard/welcome`,
      phoneNumber,
    });

    if (!checkoutUrl) {
      return {
        success: false,
        error: "Failed to create checkout session",
      };
    }

    return {
      success: true,
      url: checkoutUrl,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create checkout session",
    };
  }
}

/**
 * Create Billing Portal Session
 *
 * Creates a Stripe billing portal session for managing subscription
 * Users can update payment methods, view invoices, and cancel subscription
 */
export async function createBillingPortal(
  companyId?: string
): Promise<BillingActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    // Get user's Stripe customer ID
    const { data: userData } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!userData?.stripe_customer_id) {
      return {
        success: false,
        error: "No billing account found",
      };
    }

    // Create billing portal session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const returnUrl = companyId
      ? `${siteUrl}/dashboard/settings/billing?company=${companyId}`
      : `${siteUrl}/dashboard/settings/billing`;

    const portalUrl = await createBillingPortalSession(
      userData.stripe_customer_id,
      returnUrl
    );

    if (!portalUrl) {
      return {
        success: false,
        error: "Failed to create billing portal session",
      };
    }

    return {
      success: true,
      url: portalUrl,
    };
  } catch (error) {
    console.error("Error creating billing portal:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to access billing portal",
    };
  }
}

/**
 * Get Company Subscription Status
 *
 * Returns the current subscription status for a company
 */
export async function getCompanySubscriptionStatus(
  companyId: string
): Promise<BillingActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    // Verify user has access to this company
    const { data: membership } = await supabase
      .from("team_members")
      .select("role_id")
      .eq("company_id", companyId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!membership) {
      return {
        success: false,
        error: "You don't have access to this organization",
      };
    }

    // Get company subscription data
    const { data: company } = await supabase
      .from("companies")
      .select(
        `
        stripe_subscription_id,
        stripe_subscription_status,
        subscription_current_period_start,
        subscription_current_period_end,
        subscription_cancel_at_period_end,
        trial_ends_at
      `
      )
      .eq("id", companyId)
      .single();

    if (!company) {
      return { success: false, error: "Organization not found" };
    }

    // Get detailed subscription info from Stripe if we have a subscription ID
    let stripeSubscription = null;
    if (company.stripe_subscription_id) {
      stripeSubscription = await getSubscription(
        company.stripe_subscription_id
      );
    }

    return {
      success: true,
      data: {
        ...company,
        stripe_details: stripeSubscription,
      },
    };
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get subscription status",
    };
  }
}

/**
 * Cancel Company Subscription
 *
 * Cancels subscription at the end of the current billing period
 */
export async function cancelCompanySubscription(
  companyId: string
): Promise<BillingActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    // Verify user is owner of this company
    const { data: membership } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!inner(name)")
      .eq("company_id", companyId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!membership || (membership as any).custom_roles?.name !== "Owner") {
      return {
        success: false,
        error: "Only organization owners can cancel subscriptions",
      };
    }

    // Get subscription ID
    const { data: company } = await supabase
      .from("companies")
      .select("stripe_subscription_id")
      .eq("id", companyId)
      .single();

    if (!company?.stripe_subscription_id) {
      return { success: false, error: "No active subscription found" };
    }

    // Cancel in Stripe
    const cancelled = await stripeCancel(company.stripe_subscription_id);

    if (!cancelled) {
      return { success: false, error: "Failed to cancel subscription" };
    }

    // Update database
    await supabase
      .from("companies")
      .update({ subscription_cancel_at_period_end: true })
      .eq("id", companyId);

    revalidatePath("/dashboard/settings/billing");

    return {
      success: true,
      data: { message: "Subscription will be canceled at period end" },
    };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to cancel subscription",
    };
  }
}

/**
 * Reactivate Company Subscription
 *
 * Removes the cancellation flag from a subscription
 */
export async function reactivateCompanySubscription(
  companyId: string
): Promise<BillingActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    // Verify user is owner
    const { data: membership } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!inner(name)")
      .eq("company_id", companyId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!membership || (membership as any).custom_roles?.name !== "Owner") {
      return {
        success: false,
        error: "Only organization owners can reactivate subscriptions",
      };
    }

    // Get subscription ID
    const { data: company } = await supabase
      .from("companies")
      .select("stripe_subscription_id")
      .eq("id", companyId)
      .single();

    if (!company?.stripe_subscription_id) {
      return { success: false, error: "No subscription found" };
    }

    // Reactivate in Stripe
    const reactivated = await stripeReactivate(company.stripe_subscription_id);

    if (!reactivated) {
      return { success: false, error: "Failed to reactivate subscription" };
    }

    // Update database
    await supabase
      .from("companies")
      .update({ subscription_cancel_at_period_end: false })
      .eq("id", companyId);

    revalidatePath("/dashboard/settings/billing");

    return {
      success: true,
      data: { message: "Subscription reactivated successfully" },
    };
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to reactivate subscription",
    };
  }
}
