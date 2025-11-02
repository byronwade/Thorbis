"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type CommunicationInsert,
  type CommunicationUpdate,
  communicationInsertSchema,
  communicationUpdateSchema,
} from "@/lib/validations/database-schemas";

/**
 * Server Actions for Communication Management
 *
 * Handles multi-channel communication (email, SMS, phone, chat) with:
 * - Server-side validation using Zod
 * - Supabase database operations
 * - Threading support
 * - Read tracking
 * - Company-based multi-tenancy via RLS
 */

// ============================================================================
// CREATE
// ============================================================================

export async function createCommunication(
  data: CommunicationInsert
): Promise<{ success: boolean; error?: string; communicationId?: string }> {
  try {
    const validated = communicationInsertSchema.parse(data);
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data: communication, error } = await supabase
      .from("communications")
      .insert(validated)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/communication");
    return { success: true, communicationId: communication.id };
  } catch (error) {
    console.error("Create communication error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create communication" };
  }
}

// ============================================================================
// READ
// ============================================================================

export async function getCommunication(
  communicationId: string
): Promise<{ success: boolean; error?: string; communication?: any }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data: communication, error } = await supabase
      .from("communications")
      .select("*")
      .eq("id", communicationId)
      .is("deleted_at", null)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, communication };
  } catch (error) {
    console.error("Get communication error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to get communication" };
  }
}

export async function getCommunications(filters?: {
  type?: string;
  direction?: string;
  status?: string;
  customerId?: string;
  jobId?: string;
  threadId?: string;
}): Promise<{ success: boolean; error?: string; communications?: any[] }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    let query = supabase
      .from("communications")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }
    if (filters?.direction) {
      query = query.eq("direction", filters.direction);
    }
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters?.customerId) {
      query = query.eq("customer_id", filters.customerId);
    }
    if (filters?.jobId) {
      query = query.eq("job_id", filters.jobId);
    }
    if (filters?.threadId) {
      query = query.eq("thread_id", filters.threadId);
    }

    const { data: communications, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, communications };
  } catch (error) {
    console.error("Get communications error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to get communications" };
  }
}

// ============================================================================
// UPDATE
// ============================================================================

export async function updateCommunication(
  communicationId: string,
  data: CommunicationUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = communicationUpdateSchema.parse(data);
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { error } = await supabase
      .from("communications")
      .update(validated)
      .eq("id", communicationId)
      .is("deleted_at", null);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/communication");
    return { success: true };
  } catch (error) {
    console.error("Update communication error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update communication" };
  }
}

export async function markAsRead(
  communicationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { error } = await supabase
      .from("communications")
      .update({
        read_at: new Date().toISOString(),
        status: "read",
      })
      .eq("id", communicationId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/communication");
    return { success: true };
  } catch (error) {
    console.error("Mark as read error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to mark as read" };
  }
}

// ============================================================================
// DELETE
// ============================================================================

export async function deleteCommunication(
  communicationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("communications")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq("id", communicationId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/communication");
    return { success: true };
  } catch (error) {
    console.error("Delete communication error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete communication" };
  }
}
