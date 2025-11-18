/**
 * Notification Queue Management
 *
 * Handles asynchronous notification delivery through a database queue.
 * Supports:
 * - Email, SMS, Push, and In-app notifications
 * - Automatic retry with exponential backoff
 * - Scheduled delivery
 * - Batch processing
 * - Priority handling
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export type NotificationChannel = "email" | "sms" | "push" | "in_app";

export type QueueStatus = "pending" | "sending" | "sent" | "failed" | "cancelled";

export interface EnqueueNotificationParams {
  companyId: string;
  userId?: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  body: string;
  templateId?: string;
  templateData?: Record<string, any>;
  priority?: "low" | "medium" | "high" | "urgent";
  scheduledFor?: Date;
  maxAttempts?: number;
  metadata?: Record<string, any>;
}

export interface QueuedNotification {
  id: string;
  company_id: string;
  user_id: string | null;
  channel: NotificationChannel;
  recipient: string;
  subject: string | null;
  body: string;
  template_id: string | null;
  template_data: Record<string, any> | null;
  status: QueueStatus;
  attempts: number;
  max_attempts: number;
  error_message: string | null;
  scheduled_for: string;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any> | null;
}

/**
 * Add a notification to the queue
 */
export async function enqueueNotification(
  params: EnqueueNotificationParams
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  try {
    const supabase = createServiceSupabaseClient();

    const { data, error } = await supabase
      .from("notification_queue")
      .insert({
        company_id: params.companyId,
        user_id: params.userId || null,
        channel: params.channel,
        recipient: params.recipient,
        subject: params.subject || null,
        body: params.body,
        template_id: params.templateId || null,
        template_data: params.templateData || null,
        status: "pending",
        attempts: 0,
        max_attempts: params.maxAttempts || 3,
        scheduled_for: params.scheduledFor?.toISOString() || new Date().toISOString(),
        metadata: params.metadata || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error enqueueing notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, notificationId: data.id };
  } catch (error) {
    console.error("Error enqueueing notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get pending notifications ready to be sent
 */
export async function getPendingNotifications(
  limit: number = 100
): Promise<QueuedNotification[]> {
  try {
    const supabase = createServiceSupabaseClient();

    const { data, error } = await supabase
      .from("notification_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching pending notifications:", error);
      return [];
    }

    return (data as QueuedNotification[]) || [];
  } catch (error) {
    console.error("Error fetching pending notifications:", error);
    return [];
  }
}

/**
 * Update notification status
 */
export async function updateNotificationStatus(
  notificationId: string,
  status: QueueStatus,
  errorMessage?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabaseClient();

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "sent") {
      updateData.sent_at = new Date().toISOString();
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { error } = await supabase
      .from("notification_queue")
      .update(updateData)
      .eq("id", notificationId);

    if (error) {
      console.error("Error updating notification status:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating notification status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Increment attempt count and update status
 */
export async function incrementAttempts(
  notificationId: string,
  errorMessage?: string
): Promise<{ success: boolean; shouldRetry: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabaseClient();

    // Get current notification
    const { data: notification, error: fetchError } = await supabase
      .from("notification_queue")
      .select("attempts, max_attempts")
      .eq("id", notificationId)
      .single();

    if (fetchError || !notification) {
      return { success: false, shouldRetry: false, error: "Notification not found" };
    }

    const newAttempts = notification.attempts + 1;
    const shouldRetry = newAttempts < notification.max_attempts;

    // Calculate next retry time with exponential backoff
    // First retry: 5 minutes, second: 15 minutes, third: 45 minutes, etc.
    const retryDelay = Math.pow(3, newAttempts - 1) * 5 * 60 * 1000;
    const nextRetryAt = new Date(Date.now() + retryDelay);

    const updateData: any = {
      attempts: newAttempts,
      status: shouldRetry ? "pending" : "failed",
      error_message: errorMessage || null,
      updated_at: new Date().toISOString(),
    };

    if (shouldRetry) {
      updateData.scheduled_for = nextRetryAt.toISOString();
    }

    const { error: updateError } = await supabase
      .from("notification_queue")
      .update(updateData)
      .eq("id", notificationId);

    if (updateError) {
      console.error("Error incrementing attempts:", updateError);
      return { success: false, shouldRetry: false, error: updateError.message };
    }

    return { success: true, shouldRetry };
  } catch (error) {
    console.error("Error incrementing attempts:", error);
    return {
      success: false,
      shouldRetry: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Cancel a pending notification
 */
export async function cancelNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabaseClient();

    const { error } = await supabase
      .from("notification_queue")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", notificationId)
      .in("status", ["pending", "failed"]);

    if (error) {
      console.error("Error cancelling notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error cancelling notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get notification by ID
 */
export async function getNotificationById(
  notificationId: string
): Promise<QueuedNotification | null> {
  try {
    const supabase = createServiceSupabaseClient();

    const { data, error } = await supabase
      .from("notification_queue")
      .select("*")
      .eq("id", notificationId)
      .single();

    if (error) {
      console.error("Error fetching notification:", error);
      return null;
    }

    return data as QueuedNotification;
  } catch (error) {
    console.error("Error fetching notification:", error);
    return null;
  }
}

/**
 * Get recent notifications for a company
 */
export async function getRecentNotifications(
  companyId: string,
  limit: number = 100,
  channel?: NotificationChannel
): Promise<QueuedNotification[]> {
  try {
    const supabase = createServiceSupabaseClient();

    let query = supabase
      .from("notification_queue")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (channel) {
      query = query.eq("channel", channel);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching recent notifications:", error);
      return [];
    }

    return (data as QueuedNotification[]) || [];
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    return [];
  }
}

/**
 * Get notification statistics for a company
 */
export async function getNotificationStats(companyId: string) {
  try {
    const supabase = createServiceSupabaseClient();

    // Get stats for the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("notification_queue")
      .select("channel, status")
      .eq("company_id", companyId)
      .gte("created_at", twentyFourHoursAgo);

    if (error || !data) {
      console.error("Error fetching notification stats:", error);
      return null;
    }

    // Calculate stats
    const stats = {
      total: data.length,
      byChannel: {} as Record<NotificationChannel, { sent: number; failed: number; pending: number; total: number }>,
      byStatus: {
        pending: data.filter((n) => n.status === "pending").length,
        sending: data.filter((n) => n.status === "sending").length,
        sent: data.filter((n) => n.status === "sent").length,
        failed: data.filter((n) => n.status === "failed").length,
        cancelled: data.filter((n) => n.status === "cancelled").length,
      },
    };

    // Calculate stats by channel
    const channels: NotificationChannel[] = ["email", "sms", "push", "in_app"];
    channels.forEach((channel) => {
      const channelData = data.filter((n) => n.channel === channel);
      stats.byChannel[channel] = {
        total: channelData.length,
        sent: channelData.filter((n) => n.status === "sent").length,
        failed: channelData.filter((n) => n.status === "failed").length,
        pending: channelData.filter((n) => n.status === "pending").length,
      };
    });

    return stats;
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    return null;
  }
}

/**
 * Cleanup old notifications (older than 30 days and completed)
 */
export async function cleanupOldNotifications(): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  try {
    const supabase = createServiceSupabaseClient();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error, count } = await supabase
      .from("notification_queue")
      .delete({ count: "exact" })
      .in("status", ["sent", "cancelled"])
      .lt("created_at", thirtyDaysAgo);

    if (error) {
      console.error("Error cleaning up old notifications:", error);
      return { success: false, deletedCount: 0, error: error.message };
    }

    return { success: true, deletedCount: count || 0 };
  } catch (error) {
    console.error("Error cleaning up old notifications:", error);
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
