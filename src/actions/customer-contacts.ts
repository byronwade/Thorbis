"use server";

/**
 * Customer Contacts Server Actions
 *
 * Manages additional contacts for customers:
 * - Multiple emails and phone numbers
 * - Contact titles and roles
 * - Primary/billing/emergency contact flags
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CustomerContact {
  id: string;
  company_id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  title?: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  is_primary: boolean;
  is_billing_contact: boolean;
  is_emergency_contact: boolean;
  preferred_contact_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all contacts for a customer
 */
export async function getCustomerContacts(customerId: string) {
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
      .from("customer_contacts")
      .select("*")
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching customer contacts:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getCustomerContacts:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch contacts",
      data: [],
    };
  }
}

/**
 * Add a new contact
 */
export async function addCustomerContact({
  customerId,
  firstName,
  lastName,
  title,
  email,
  phone,
  secondaryPhone,
  isPrimary = false,
  isBillingContact = false,
  isEmergencyContact = false,
  preferredContactMethod,
  notes,
}: {
  customerId: string;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  isPrimary?: boolean;
  isBillingContact?: boolean;
  isEmergencyContact?: boolean;
  preferredContactMethod?: string;
  notes?: string;
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
      .from("customer_contacts")
      .insert({
        company_id: teamMember.company_id,
        customer_id: customerId,
        first_name: firstName,
        last_name: lastName,
        title,
        email,
        phone,
        secondary_phone: secondaryPhone,
        is_primary: isPrimary,
        is_billing_contact: isBillingContact,
        is_emergency_contact: isEmergencyContact,
        preferred_contact_method: preferredContactMethod,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding customer contact:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in addCustomerContact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add contact",
    };
  }
}

/**
 * Update a contact
 */
export async function updateCustomerContact({
  contactId,
  ...updateData
}: {
  contactId: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  isPrimary?: boolean;
  isBillingContact?: boolean;
  isEmergencyContact?: boolean;
  preferredContactMethod?: string;
  notes?: string;
}) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const updates: any = {};
    if (updateData.firstName !== undefined)
      updates.first_name = updateData.firstName;
    if (updateData.lastName !== undefined)
      updates.last_name = updateData.lastName;
    if (updateData.title !== undefined) updates.title = updateData.title;
    if (updateData.email !== undefined) updates.email = updateData.email;
    if (updateData.phone !== undefined) updates.phone = updateData.phone;
    if (updateData.secondaryPhone !== undefined)
      updates.secondary_phone = updateData.secondaryPhone;
    if (updateData.isPrimary !== undefined)
      updates.is_primary = updateData.isPrimary;
    if (updateData.isBillingContact !== undefined)
      updates.is_billing_contact = updateData.isBillingContact;
    if (updateData.isEmergencyContact !== undefined)
      updates.is_emergency_contact = updateData.isEmergencyContact;
    if (updateData.preferredContactMethod !== undefined)
      updates.preferred_contact_method = updateData.preferredContactMethod;
    if (updateData.notes !== undefined) updates.notes = updateData.notes;

    const { data, error } = await supabase
      .from("customer_contacts")
      .update(updates)
      .eq("id", contactId)
      .select()
      .single();

    if (error) {
      console.error("Error updating customer contact:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateCustomerContact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update contact",
    };
  }
}

/**
 * Remove a contact (soft delete)
 */
export async function removeCustomerContact(contactId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const { error } = await supabase
      .from("customer_contacts")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", contactId);

    if (error) {
      console.error("Error removing customer contact:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in removeCustomerContact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to remove contact",
    };
  }
}
