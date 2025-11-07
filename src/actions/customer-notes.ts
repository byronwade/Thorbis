"use server";

/**
 * Customer Notes Server Actions
 *
 * Handles CRUD operations for customer notes with:
 * - Pagination support
 * - Note type filtering (customer vs internal)
 * - Pinned notes
 * - Soft delete
 *
 * NOTE: Types moved to @/types/customer-notes
 * to comply with Next.js 16 "use server" file restrictions.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface GetNotesOptions {
  customerId: string;
  noteType?: "customer" | "internal" | "all";
  limit?: number;
  offset?: number;
}

/**
 * Get customer notes with pagination
 */
export async function getCustomerNotes({
  customerId,
  noteType = "all",
  limit = 50,
  offset = 0,
}: GetNotesOptions) {
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

    let query = supabase
      .from("customer_notes")
      .select(
        `
        *,
        user:users!user_id(name, email, avatar)
      `,
        { count: "exact" }
      )
      .eq("customer_id", customerId)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (noteType !== "all") {
      query = query.eq("note_type", noteType);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching customer notes:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data || [],
      count: count || 0,
    };
  } catch (error) {
    console.error("Error in getCustomerNotes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch notes",
    };
  }
}

/**
 * Create a new customer note
 */
export async function createCustomerNote({
  customerId,
  content,
  noteType,
  isPinned = false,
}: {
  customerId: string;
  content: string;
  noteType: "customer" | "internal";
  isPinned?: boolean;
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
      .from("customer_notes")
      .insert({
        customer_id: customerId,
        company_id: teamMember.company_id,
        user_id: user.id,
        note_type: noteType,
        content,
        is_pinned: isPinned,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating customer note:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/customers/${customerId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in createCustomerNote:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create note",
    };
  }
}

/**
 * Update a customer note
 */
export async function updateCustomerNote({
  noteId,
  content,
  isPinned,
}: {
  noteId: string;
  content?: string;
  isPinned?: boolean;
}) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const updateData: any = {};
    if (content !== undefined) updateData.content = content;
    if (isPinned !== undefined) updateData.is_pinned = isPinned;

    const { data, error } = await supabase
      .from("customer_notes")
      .update(updateData)
      .eq("id", noteId)
      .select()
      .single();

    if (error) {
      console.error("Error updating customer note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateCustomerNote:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update note",
    };
  }
}

/**
 * Delete a customer note (soft delete)
 */
export async function deleteCustomerNote(noteId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const { error } = await supabase
      .from("customer_notes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", noteId);

    if (error) {
      console.error("Error deleting customer note:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteCustomerNote:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete note",
    };
  }
}
