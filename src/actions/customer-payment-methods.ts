"use server";

/**
 * Customer Payment Methods Server Actions
 *
 * Handles payment method management for customers:
 * - Get payment methods for a customer
 * - Set default payment method
 * - Remove payment method
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Get payment methods for a customer
 */
export async function getCustomerPaymentMethods(customerId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed", data: [] };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated", data: [] };
    }

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "No company found", data: [] };
    }

    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customer payment methods:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getCustomerPaymentMethods:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch payment methods",
      data: [],
    };
  }
}

/**
 * Set a payment method as default for a customer
 */
export async function setDefaultCustomerPaymentMethod(paymentMethodId: string, customerId: string) {
  try {
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

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "No company found" };
    }

    // First, unset all default flags for this customer
    const { error: unsetError } = await supabase
      .from("payment_methods")
      .update({ is_default: false })
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id);

    if (unsetError) {
      console.error("Error unsetting default payment methods:", unsetError);
      return { success: false, error: "Failed to update payment methods" };
    }

    // Then set the selected one as default
    const { error: setError } = await supabase
      .from("payment_methods")
      .update({ is_default: true })
      .eq("id", paymentMethodId)
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id);

    if (setError) {
      console.error("Error setting default payment method:", setError);
      return { success: false, error: "Failed to set default payment method" };
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in setDefaultCustomerPaymentMethod:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set default",
    };
  }
}

/**
 * Remove a customer payment method
 */
export async function removeCustomerPaymentMethod(paymentMethodId: string, customerId: string) {
  try {
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

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "No company found" };
    }

    // Get payment method details
    const { data: paymentMethod } = await supabase
      .from("payment_methods")
      .select("is_default")
      .eq("id", paymentMethodId)
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .single();

    if (!paymentMethod) {
      return { success: false, error: "Payment method not found" };
    }

    // Check if there are other payment methods
    const { count } = await supabase
      .from("payment_methods")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .eq("is_active", true);

    if (count === 1 && paymentMethod.is_default) {
      return {
        success: false,
        error: "Cannot remove the only payment method. Add another one first.",
      };
    }

    // Soft delete (set is_active to false)
    const { error: deleteError } = await supabase
      .from("payment_methods")
      .update({ is_active: false })
      .eq("id", paymentMethodId)
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id);

    if (deleteError) {
      console.error("Error removing payment method:", deleteError);
      return { success: false, error: "Failed to remove payment method" };
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in removeCustomerPaymentMethod:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove payment method",
    };
  }
}
