"use server";

/**
 * Notifications Server Actions
 *
 * Server-side operations for the notifications system including:
 * - Fetching notifications with filtering and pagination
 * - Creating new notifications
 * - Marking notifications as read/unread
 * - Deleting notifications
 * - Managing notification preferences
 *
 * Performance optimizations:
 * - Server-side data fetching and validation
 * - Efficient database queries with proper indexes
 * - RLS policies for security
 * - Zod validation for all inputs
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  NotificationTypeSchema,
  NotificationPrioritySchema,
  CreateNotificationSchema,
  GetNotificationsSchema,
  NotificationPreferenceSchema,
  type NotificationType,
  type NotificationPriority,
  type CreateNotificationInput,
  type GetNotificationsInput,
  type NotificationPreference,
} from "@/lib/notifications/types";

// Re-export types for convenience (types are allowed)
export type {
  NotificationType,
  NotificationPriority,
  CreateNotificationInput,
  GetNotificationsInput,
  NotificationPreference,
};

const UpdateNotificationPreferencesSchema = z.array(NotificationPreferenceSchema);

// =====================================================================================
// Helper Functions
// =====================================================================================

/**
 * Get authenticated user and company context
 */
async function getAuthContext() {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Supabase client not configured");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Get user's active company from team_members
  const { data: teamMember, error: teamError } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (teamError || !teamMember) {
    throw new Error("No active company found");
  }

  return {
    userId: user.id,
    companyId: teamMember.company_id,
    supabase,
  };
}

// =====================================================================================
// Notification CRUD Operations
// =====================================================================================

/**
 * Get notifications for the current user
 *
 * @param options - Filtering and pagination options
 * @returns Array of notifications and total count
 */
export async function getNotifications(options?: Partial<GetNotificationsInput>) {
  try {
    const { userId, supabase } = await getAuthContext();

    // Validate input
    const validatedOptions = GetNotificationsSchema.parse(options || {});

    // Build query
    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Apply filters
    if (validatedOptions.unreadOnly) {
      query = query.eq("read", false);
    }

    if (validatedOptions.type) {
      query = query.eq("type", validatedOptions.type);
    }

    if (validatedOptions.priority) {
      query = query.eq("priority", validatedOptions.priority);
    }

    // Apply pagination
    query = query
      .range(
        validatedOptions.offset,
        validatedOptions.offset + validatedOptions.limit - 1
      );

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        error: "Failed to fetch notifications",
        data: [],
        count: 0,
      };
    }

    return {
      success: true,
      data: data || [],
      count: count || 0,
    };
  } catch (error) {
    console.error("Error in getNotifications:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
        data: [],
        count: 0,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
      data: [],
      count: 0,
    };
  }
}

/**
 * Get unread notification count for the current user
 *
 * @returns Number of unread notifications
 */
export async function getUnreadCount() {
  try {
    const { userId, supabase } = await getAuthContext();

    // Use the database function for optimized counting
    const { data, error } = await supabase.rpc("get_unread_notification_count", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Error fetching unread count:", error);
      return { success: false, error: "Failed to fetch unread count", count: 0 };
    }

    return { success: true, count: data || 0 };
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
      count: 0,
    };
  }
}

/**
 * Create a new notification
 *
 * @param input - Notification data
 * @returns Created notification
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    const { supabase } = await getAuthContext();

    // Validate input
    const validatedData = CreateNotificationSchema.parse(input);

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: validatedData.userId,
        company_id: validatedData.companyId,
        type: validatedData.type,
        priority: validatedData.priority,
        title: validatedData.title,
        message: validatedData.message,
        action_url: validatedData.actionUrl,
        action_label: validatedData.actionLabel,
        metadata: validatedData.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return { success: false, error: "Failed to create notification" };
    }

    // Revalidate paths where notifications appear
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return { success: true, data };
  } catch (error) {
    console.error("Error in createNotification:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Mark a notification as read
 *
 * @param notificationId - ID of the notification to mark as read
 * @returns Success status
 */
export async function markAsRead(notificationId: string) {
  try {
    const { userId, supabase } = await getAuthContext();

    // Validate UUID
    const idSchema = z.string().uuid("Invalid notification ID");
    const validatedId = idSchema.parse(notificationId);

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", validatedId)
      .eq("user_id", userId); // Ensure user owns the notification

    if (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: "Failed to mark notification as read" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error in markAsRead:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Mark all notifications as read for the current user
 *
 * @returns Number of notifications marked as read
 */
export async function markAllAsRead() {
  try {
    const { userId, supabase } = await getAuthContext();

    // Use the database function for bulk operation
    const { data, error } = await supabase.rpc("mark_all_notifications_read", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return {
        success: false,
        error: "Failed to mark all notifications as read",
        count: 0,
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return { success: true, count: data || 0 };
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
      count: 0,
    };
  }
}

/**
 * Mark a notification as unread
 *
 * @param notificationId - ID of the notification to mark as unread
 * @returns Success status
 */
export async function markAsUnread(notificationId: string) {
  try {
    const { userId, supabase } = await getAuthContext();

    // Validate UUID
    const idSchema = z.string().uuid("Invalid notification ID");
    const validatedId = idSchema.parse(notificationId);

    const { error } = await supabase
      .from("notifications")
      .update({ read: false })
      .eq("id", validatedId)
      .eq("user_id", userId); // Ensure user owns the notification

    if (error) {
      console.error("Error marking notification as unread:", error);
      return { success: false, error: "Failed to mark notification as unread" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error in markAsUnread:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Delete a notification
 *
 * @param notificationId - ID of the notification to delete
 * @returns Success status
 */
export async function deleteNotification(notificationId: string) {
  try {
    const { userId, supabase } = await getAuthContext();

    // Validate UUID
    const idSchema = z.string().uuid("Invalid notification ID");
    const validatedId = idSchema.parse(notificationId);

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", validatedId)
      .eq("user_id", userId); // Ensure user owns the notification

    if (error) {
      console.error("Error deleting notification:", error);
      return { success: false, error: "Failed to delete notification" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// =====================================================================================
// Notification Preferences Operations
// =====================================================================================

/**
 * Get notification preferences for the current user
 *
 * @returns Array of notification preferences
 */
export async function getNotificationPreferences() {
  try {
    const { userId, companyId, supabase } = await getAuthContext();

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .eq("company_id", companyId);

    if (error) {
      console.error("Error fetching notification preferences:", error);
      return {
        success: false,
        error: "Failed to fetch notification preferences",
        data: [],
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getNotificationPreferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
      data: [],
    };
  }
}

/**
 * Update notification preferences for the current user
 *
 * @param preferences - Array of notification preference settings
 * @returns Success status
 */
export async function updateNotificationPreferences(
  preferences: NotificationPreference[]
) {
  try {
    const { userId, companyId, supabase } = await getAuthContext();

    // Validate input
    const validatedPreferences = UpdateNotificationPreferencesSchema.parse(preferences);

    // Delete existing preferences
    await supabase
      .from("notification_preferences")
      .delete()
      .eq("user_id", userId)
      .eq("company_id", companyId);

    // Insert new preferences
    const preferencesToInsert = validatedPreferences.map((pref) => ({
      user_id: userId,
      company_id: companyId,
      channel: pref.channel,
      event_type: pref.eventType,
      enabled: pref.enabled,
    }));

    const { error } = await supabase
      .from("notification_preferences")
      .insert(preferencesToInsert);

    if (error) {
      console.error("Error updating notification preferences:", error);
      return {
        success: false,
        error: "Failed to update notification preferences",
      };
    }

    revalidatePath("/dashboard/settings/profile/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error in updateNotificationPreferences:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
