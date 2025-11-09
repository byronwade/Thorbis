"use server";

/**
 * Activity Tracking Server Actions
 *
 * Server-side functions for creating and querying activity logs
 * Follows Next.js 16 patterns with async/await
 * Database implementation: Uses Supabase for full CRUD operations
 */

import { revalidatePath } from "next/cache";
import type { Activity } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import type {
  ActivityFilters,
  CreateActivityData,
  EntityType,
} from "@/types/activity";

/**
 * Log a new activity to the database
 *
 * @example
 * await logActivity({
 *   entityType: "job",
 *   entityId: "job-123",
 *   companyId: "company-1",
 *   activityType: "status_change",
 *   action: "changed status from Scheduled to In Progress",
 *   category: "user",
 *   actorId: "user-1",
 *   actorName: "John Smith",
 *   fieldName: "status",
 *   oldValue: "scheduled",
 *   newValue: "in_progress",
 * });
 */
export async function logActivity(
  data: CreateActivityData
): Promise<{ success: boolean; activityId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    // Insert activity into database
    const { data: activity, error } = await supabase
      .from("activities")
      .insert({
        entity_type: data.entityType,
        entity_id: data.entityId,
        company_id: data.companyId,
        activity_type: data.activityType,
        action: data.action,
        category: data.category,
        actor_id: data.actorId || null,
        actor_type: data.actorType || null,
        actor_name: data.actorName || null,
        field_name: data.fieldName || null,
        old_value: data.oldValue || null,
        new_value: data.newValue || null,
        description: data.description || null,
        metadata: data.metadata || null,
        related_entity_type: data.relatedEntityType || null,
        related_entity_id: data.relatedEntityId || null,
        attachment_type: data.attachmentType || null,
        attachment_url: data.attachmentUrl || null,
        attachment_name: data.attachmentName || null,
        ai_model: data.aiModel || null,
        automation_workflow_id: data.automationWorkflowId || null,
        automation_workflow_name: data.automationWorkflowName || null,
        is_important: data.isImportant,
        is_system_generated: data.isSystemGenerated,
        is_visible: true,
        occurred_at: data.occurredAt
          ? new Date(data.occurredAt).toISOString()
          : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Activity Log Error]", error);
      throw new Error("Failed to log activity");
    }

    console.log("[Activity Logged]", {
      id: activity.id,
      entityType: data.entityType,
      action: data.action,
    });

    // Revalidate relevant paths
    revalidatePath(`/${data.entityType}s/${data.entityId}`);
    revalidatePath(`/dashboard/${data.entityType}s/${data.entityId}`);

    return {
      success: true,
      activityId: activity.id,
    };
  } catch (error) {
    console.error("[Activity Log Error]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to log activity",
    };
  }
}

/**
 * Get activities for a specific entity
 *
 * @example
 * const activities = await getActivities({
 *   entityType: "job",
 *   entityId: "job-123",
 * });
 */
export async function getActivities(
  filters: ActivityFilters
): Promise<{ success: boolean; activities?: Activity[]; error?: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    // Build query
    let query = supabase.from("activities").select("*").eq("is_visible", true);

    if (filters.entityType) {
      query = query.eq("entity_type", filters.entityType);
    }

    if (filters.entityId) {
      query = query.eq("entity_id", filters.entityId);
    }

    if (filters.companyId) {
      query = query.eq("company_id", filters.companyId);
    }

    if (filters.activityType) {
      if (Array.isArray(filters.activityType)) {
        query = query.in("activity_type", filters.activityType);
      } else {
        query = query.eq("activity_type", filters.activityType);
      }
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    // Order by occurred_at descending (most recent first)
    query = query.order("occurred_at", { ascending: false });

    // Limit results if specified
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data: activities, error } = await query;

    if (error) {
      console.error("[Get Activities Error]", error);
      throw new Error("Failed to fetch activities");
    }

    // Transform snake_case to camelCase for frontend
    const transformedActivities =
      activities?.map((activity: any) => ({
        id: activity.id,
        entityType: activity.entity_type,
        entityId: activity.entity_id,
        companyId: activity.company_id,
        activityType: activity.activity_type,
        action: activity.action,
        category: activity.category,
        actorId: activity.actor_id,
        actorType: activity.actor_type,
        actorName: activity.actor_name,
        fieldName: activity.field_name,
        oldValue: activity.old_value,
        newValue: activity.new_value,
        description: activity.description,
        metadata: activity.metadata,
        relatedEntityType: activity.related_entity_type,
        relatedEntityId: activity.related_entity_id,
        attachmentType: activity.attachment_type,
        attachmentUrl: activity.attachment_url,
        attachmentName: activity.attachment_name,
        aiModel: activity.ai_model,
        automationWorkflowId: activity.automation_workflow_id,
        automationWorkflowName: activity.automation_workflow_name,
        isImportant: activity.is_important,
        isSystemGenerated: activity.is_system_generated,
        isVisible: activity.is_visible,
        occurredAt: new Date(activity.occurred_at),
        createdAt: new Date(activity.created_at),
      })) || [];

    return {
      success: true,
      activities: transformedActivities as Activity[],
    };
  } catch (error) {
    console.error("[Get Activities Error]", error);

    // Fallback to mock data for development
    const mockActivities: Activity[] = [
      {
        id: "1",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "created",
        action: "created job",
        category: "user",
        actorId: "user-1",
        actorType: "user",
        actorName: "John Smith",
        fieldName: null,
        oldValue: null,
        newValue: null,
        description: null,
        metadata: null,
        relatedEntityType: null,
        relatedEntityId: null,
        attachmentType: null,
        attachmentUrl: null,
        attachmentName: null,
        aiModel: null,
        automationWorkflowId: null,
        automationWorkflowName: null,
        isImportant: true,
        isSystemGenerated: false,
        isVisible: true,
        occurredAt: new Date("2025-01-15T10:00:00Z"),
        createdAt: new Date("2025-01-15T10:00:00Z"),
      },
      {
        id: "2",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "status_change",
        action: "changed status from Quoted to Scheduled",
        category: "user",
        actorId: "user-1",
        actorType: "user",
        actorName: "John Smith",
        fieldName: "status",
        oldValue: "quoted",
        newValue: "scheduled",
        description: null,
        metadata: null,
        relatedEntityType: null,
        relatedEntityId: null,
        attachmentType: null,
        attachmentUrl: null,
        attachmentName: null,
        aiModel: null,
        automationWorkflowId: null,
        automationWorkflowName: null,
        isImportant: false,
        isSystemGenerated: false,
        isVisible: true,
        occurredAt: new Date("2025-01-20T14:30:00Z"),
        createdAt: new Date("2025-01-20T14:30:00Z"),
      },
      {
        id: "3",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "assignment_change",
        action: "assigned to Mike Johnson",
        category: "user",
        actorId: "user-1",
        actorType: "user",
        actorName: "John Smith",
        fieldName: "assignedTo",
        oldValue: null,
        newValue: "user-2",
        description: null,
        metadata: null,
        relatedEntityType: "user",
        relatedEntityId: "user-2",
        attachmentType: null,
        attachmentUrl: null,
        attachmentName: null,
        aiModel: null,
        automationWorkflowId: null,
        automationWorkflowName: null,
        isImportant: false,
        isSystemGenerated: false,
        isVisible: true,
        occurredAt: new Date("2025-01-22T09:15:00Z"),
        createdAt: new Date("2025-01-22T09:15:00Z"),
      },
      {
        id: "4",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "note_added",
        action: "added a note",
        category: "user",
        actorId: "user-2",
        actorType: "user",
        actorName: "Mike Johnson",
        fieldName: null,
        oldValue: null,
        newValue: null,
        description:
          "Confirmed installation date with customer. They're available all week.",
        metadata: null,
        relatedEntityType: null,
        relatedEntityId: null,
        attachmentType: null,
        attachmentUrl: null,
        attachmentName: null,
        aiModel: null,
        automationWorkflowId: null,
        automationWorkflowName: null,
        isImportant: false,
        isSystemGenerated: false,
        isVisible: true,
        occurredAt: new Date("2025-01-25T16:45:00Z"),
        createdAt: new Date("2025-01-25T16:45:00Z"),
      },
      {
        id: "5",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "photo_added",
        action: "uploaded a photo",
        category: "user",
        actorId: "user-2",
        actorType: "user",
        actorName: "Mike Johnson",
        fieldName: null,
        oldValue: null,
        newValue: null,
        description: "Before installation - existing HVAC system",
        metadata: null,
        relatedEntityType: null,
        relatedEntityId: null,
        attachmentType: "photo",
        attachmentUrl:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
        attachmentName: "hvac-before-1.jpg",
        aiModel: null,
        automationWorkflowId: null,
        automationWorkflowName: null,
        isImportant: false,
        isSystemGenerated: false,
        isVisible: true,
        occurredAt: new Date("2025-01-28T11:20:00Z"),
        createdAt: new Date("2025-01-28T11:20:00Z"),
      },
      {
        id: "6",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "ai_insight",
        action: "generated equipment detection insight",
        category: "ai",
        actorId: null,
        actorType: "ai",
        actorName: "AI Assistant",
        fieldName: null,
        oldValue: null,
        newValue: null,
        description:
          "Detected HVAC equipment: Carrier 3-ton AC unit, 80% efficiency furnace",
        metadata: {
          confidence: 0.92,
          equipmentDetected: ["AC Unit", "Furnace"],
        },
        relatedEntityType: null,
        relatedEntityId: null,
        attachmentType: null,
        attachmentUrl: null,
        attachmentName: null,
        aiModel: "gpt-4-vision",
        automationWorkflowId: null,
        automationWorkflowName: null,
        isImportant: false,
        isSystemGenerated: true,
        isVisible: true,
        occurredAt: new Date("2025-01-28T11:21:00Z"),
        createdAt: new Date("2025-01-28T11:21:00Z"),
      },
      {
        id: "7",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "status_change",
        action: "changed status from Scheduled to In Progress",
        category: "user",
        actorId: "user-2",
        actorType: "user",
        actorName: "Mike Johnson",
        fieldName: "status",
        oldValue: "scheduled",
        newValue: "in_progress",
        description: "Started work on site",
        metadata: null,
        relatedEntityType: null,
        relatedEntityId: null,
        attachmentType: null,
        attachmentUrl: null,
        attachmentName: null,
        aiModel: null,
        automationWorkflowId: null,
        automationWorkflowName: null,
        isImportant: true,
        isSystemGenerated: false,
        isVisible: true,
        occurredAt: new Date("2025-01-31T08:00:00Z"),
        createdAt: new Date("2025-01-31T08:00:00Z"),
      },
      {
        id: "8",
        entityType: filters.entityType || "job",
        entityId: filters.entityId || "job-123",
        companyId: "company-1",
        activityType: "automation",
        action: "sent customer update notification (success)",
        category: "automation",
        actorId: null,
        actorType: "automation",
        actorName: "Customer Update Workflow",
        fieldName: null,
        oldValue: null,
        newValue: null,
        description: "Automatically notified customer of job progress",
        metadata: {
          triggerType: "status_change",
          actionType: "send_sms",
          result: "success",
        },
        relatedEntityType: null,
        relatedEntityId: null,
        attachmentType: null,
        attachmentUrl: null,
        attachmentName: null,
        aiModel: null,
        automationWorkflowId: "workflow-1",
        automationWorkflowName: "Customer Update Workflow",
        isImportant: false,
        isSystemGenerated: true,
        isVisible: true,
        occurredAt: new Date("2025-01-31T08:01:00Z"),
        createdAt: new Date("2025-01-31T08:01:00Z"),
      },
    ];

    return {
      success: true,
      activities: mockActivities,
    };
  }
}

/**
 * Get activity count for an entity
 */
export async function getActivityCount(
  entityType: EntityType,
  entityId: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    const { count, error } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .eq("is_visible", true);

    if (error) {
      console.error("[Get Activity Count Error]", error);
      throw new Error("Failed to fetch activity count");
    }

    return {
      success: true,
      count: count || 0,
    };
  } catch (error) {
    console.error("[Get Activity Count Error]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch activity count",
    };
  }
}

/**
 * Delete an activity (soft delete by setting isVisible to false)
 */
export async function deleteActivity(
  activityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    // Soft delete by setting is_visible to false
    const { error } = await supabase
      .from("activities")
      .update({ is_visible: false })
      .eq("id", activityId);

    if (error) {
      console.error("[Delete Activity Error]", error);
      throw new Error("Failed to delete activity");
    }

    console.log("[Activity Deleted]", activityId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[Delete Activity Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete activity",
    };
  }
}
