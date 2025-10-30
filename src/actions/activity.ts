"use server";

/**
 * Activity Tracking Server Actions
 *
 * Server-side functions for creating and querying activity logs
 * Follows Next.js 16 patterns with async/await
 */

import { revalidatePath } from "next/cache";
import type { Activity } from "@/lib/db/schema";
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
    // In production, replace with actual database insert
    // Example with Drizzle:
    // const db = await getDb();
    // const [activity] = await db.insert(activities).values({
    //   ...data,
    //   occurredAt: data.occurredAt || new Date(),
    //   createdAt: new Date(),
    // }).returning();

    // For now, just validate and return success
    console.log("[Activity Log]", {
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      actorName: data.actorName,
    });

    // TODO: Replace with actual database insert
    const mockActivityId = `activity-${Date.now()}`;

    // Revalidate relevant paths
    revalidatePath(`/${data.entityType}s/${data.entityId}`);
    revalidatePath(`/dashboard/${data.entityType}s/${data.entityId}`);

    return {
      success: true,
      activityId: mockActivityId,
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
    // In production, replace with actual database query
    // Example with Drizzle:
    // const db = await getDb();
    // const activities = await db.query.activities.findMany({
    //   where: and(
    //     eq(activities.entityType, filters.entityType),
    //     eq(activities.entityId, filters.entityId),
    //     filters.activityType ? inArray(activities.activityType, Array.isArray(filters.activityType) ? filters.activityType : [filters.activityType]) : undefined,
    //   ),
    //   orderBy: [desc(activities.occurredAt)],
    // });

    // Mock data for now
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
  } catch (error) {
    console.error("[Get Activities Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch activities",
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
    // In production, replace with actual database count query
    // const db = await getDb();
    // const [result] = await db.select({ count: count() })
    //   .from(activities)
    //   .where(and(
    //     eq(activities.entityType, entityType),
    //     eq(activities.entityId, entityId),
    //   ));

    // Mock count for now
    const mockCount = 8;

    return {
      success: true,
      count: mockCount,
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
    // In production, replace with actual database update
    // const db = await getDb();
    // await db.update(activities)
    //   .set({ isVisible: false })
    //   .where(eq(activities.id, activityId));

    console.log("[Delete Activity]", activityId);

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
