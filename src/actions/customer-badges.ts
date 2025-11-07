"use server";

/**
 * Customer Badges Server Actions
 *
 * Manages customer profile badges including:
 * - Custom badges
 * - Premade badges (DO NOT SERVICE, VIP, etc.)
 * - Auto-generated badges (payment status, past due, etc.)
 *
 * NOTE: Types and constants moved to @/types/customer-badges
 * to comply with Next.js 16 "use server" file restrictions.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Get customer badges
 */
export async function getCustomerBadges(customerId: string) {
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

    const { data, error } = await supabase
      .from("customer_badges")
      .select("*")
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customer badges:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getCustomerBadges:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch badges",
    };
  }
}

/**
 * Generate auto-badges based on customer data
 */
export async function generateAutoBadges(customerId: string) {
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

    // Get customer data
    const { data: customer } = await supabase
      .from("customers")
      .select("*, invoices:invoices!customer_id(*)")
      .eq("id", customerId)
      .single();

    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    const autoBadges: Array<{
      label: string;
      variant: "default" | "destructive" | "warning" | "success" | "secondary" | "outline";
      auto_generated_key: string;
      metadata?: any;
    }> = [];

    // Past Due Badge
    if (customer.outstanding_balance && customer.outstanding_balance > 0) {
      autoBadges.push({
        label: `Past Due $${(customer.outstanding_balance / 100).toFixed(2)}`,
        variant: "destructive",
        auto_generated_key: "past_due",
        metadata: { amount: customer.outstanding_balance },
      });
    }

    // Always Pays On Time Badge (if no late invoices)
    const invoices = customer.invoices || [];
    const hasLatePayments = invoices.some((inv: any) => inv.is_overdue);
    const paidInvoicesCount = invoices.filter((inv: any) => inv.status === "paid").length;

    if (paidInvoicesCount >= 5 && !hasLatePayments) {
      autoBadges.push({
        label: "Always Pays On Time",
        variant: "success",
        auto_generated_key: "always_pays_on_time",
      });
    }

    // High Value Customer (total revenue > $10k)
    if (customer.total_revenue && customer.total_revenue > 1000000) {
      autoBadges.push({
        label: `High Value $${(customer.total_revenue / 100).toFixed(0)}`,
        variant: "success",
        auto_generated_key: "high_value",
        metadata: { revenue: customer.total_revenue },
      });
    }

    // Remove existing auto-generated badges
    await supabase
      .from("customer_badges")
      .delete()
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .eq("badge_type", "auto_generated");

    // Insert new auto-generated badges
    if (autoBadges.length > 0) {
      const { error } = await supabase.from("customer_badges").insert(
        autoBadges.map((badge, index) => ({
          customer_id: customerId,
          company_id: teamMember.company_id,
          badge_type: "auto_generated" as const,
          label: badge.label,
          variant: badge.variant,
          auto_generated_key: badge.auto_generated_key,
          metadata: badge.metadata,
          display_order: 1000 + index, // Auto badges come after manual ones
        }))
      );

      if (error) {
        console.error("Error creating auto badges:", error);
      }
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
    return { success: true, data: autoBadges };
  } catch (error) {
    console.error("Error in generateAutoBadges:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate badges",
    };
  }
}

/**
 * Add a badge to a customer
 */
export async function addCustomerBadge({
  customerId,
  label,
  variant = "default",
  badgeType = "custom",
  icon,
}: {
  customerId: string;
  label: string;
  variant?: "default" | "destructive" | "warning" | "success" | "secondary" | "outline";
  badgeType?: "custom" | "premade";
  icon?: string;
}) {
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

    const { data, error } = await supabase
      .from("customer_badges")
      .insert({
        customer_id: customerId,
        company_id: teamMember.company_id,
        badge_type: badgeType,
        label,
        variant,
        icon,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding customer badge:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in addCustomerBadge:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add badge",
    };
  }
}

/**
 * Remove a badge
 */
export async function removeCustomerBadge(badgeId: string, customerId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const { error } = await supabase
      .from("customer_badges")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", badgeId);

    if (error) {
      console.error("Error removing customer badge:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in removeCustomerBadge:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove badge",
    };
  }
}
