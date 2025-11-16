"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Update user status action
 * Allows users to change their availability status (online, available, busy)
 */

export type UserStatus = "online" | "available" | "busy";

export async function updateUserStatus(status: UserStatus) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        error: "Database connection failed",
      };
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Update user status
    const { error: updateError } = await supabase
      .from("users")
      .update({ status })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user status:", updateError);
      return {
        success: false,
        error: "Failed to update status",
      };
    }

    // Revalidate all pages to reflect the new status
    revalidatePath("/", "layout");

    return {
      success: true,
      status,
    };
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
