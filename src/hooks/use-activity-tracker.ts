"use client";

/**
 * Activity Tracker Hook
 *
 * Custom React hook for tracking activities throughout the application
 * Provides type-safe helpers for logging common activity patterns
 */

import { useCallback } from "react";
import { logActivity } from "@/actions/activity";
import {
  createAIInsightActivity,
  createAssignmentActivity,
  createAutomationActivity,
  createCommunicationActivity,
  createDocumentActivity,
  createEntityCreatedActivity,
  createFieldUpdateActivity,
  createNoteActivity,
  createPhotoActivity,
  createStatusChangeActivity,
} from "@/lib/utils/activity-tracker";
import type {
  AIInsightActivity,
  AssignmentChangeActivity,
  AutomationActivity,
  CreateActivityData,
  EntityType,
  FieldUpdateActivity,
  StatusChangeActivity,
} from "@/types/activity";

interface UseActivityTrackerOptions {
  entityType: EntityType;
  entityId: string;
  companyId: string;
  actorId?: string;
  actorName?: string;
}

/**
 * Hook for tracking activities
 *
 * @example
 * const { logStatusChange, logNote } = useActivityTracker({
 *   entityType: "job",
 *   entityId: "job-123",
 *   companyId: "company-1",
 *   actorId: "user-1",
 *   actorName: "John Smith",
 * });
 *
 * await logStatusChange({ oldStatus: "scheduled", newStatus: "in_progress" });
 */
export function useActivityTracker(options: UseActivityTrackerOptions) {
  const { entityType, entityId, companyId, actorId, actorName } = options;

  /**
   * Log a raw activity
   */
  const logRawActivity = useCallback(
    async (
      data: Omit<CreateActivityData, "entityType" | "entityId" | "companyId">
    ) =>
      await logActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        ...data,
      }),
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log a status change
   */
  const logStatusChange = useCallback(
    async (data: StatusChangeActivity & { reason?: string }) => {
      const activity = createStatusChangeActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        category: "user",
        description: data.reason,
        metadata: data as Record<string, unknown> & StatusChangeActivity,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log a field update
   */
  const logFieldUpdate = useCallback(
    async (data: FieldUpdateActivity) => {
      const activity = createFieldUpdateActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        category: "user",
        metadata: data as Record<string, unknown> & FieldUpdateActivity,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log a note
   */
  const logNote = useCallback(
    async (noteContent: string) => {
      const activity = createNoteActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        category: "user",
        noteContent,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log a photo upload
   */
  const logPhoto = useCallback(
    async (photoUrl: string, photoName: string, description?: string) => {
      const activity = createPhotoActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        category: "user",
        photoUrl,
        photoName,
        description,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log a document upload
   */
  const logDocument = useCallback(
    async (documentUrl: string, documentName: string, description?: string) => {
      const activity = createDocumentActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        category: "user",
        documentUrl,
        documentName,
        description,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log an assignment change
   */
  const logAssignment = useCallback(
    async (data: AssignmentChangeActivity) => {
      const activity = createAssignmentActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        category: "user",
        metadata: data as Record<string, unknown> & AssignmentChangeActivity,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log an AI insight (for system-generated insights)
   */
  const logAIInsight = useCallback(
    async (data: AIInsightActivity) => {
      const activity = createAIInsightActivity({
        entityType,
        entityId,
        companyId,
        category: "ai",
        metadata: data as Record<string, unknown> & AIInsightActivity,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId]
  );

  /**
   * Log an automation activity
   */
  const logAutomation = useCallback(
    async (data: AutomationActivity) => {
      const activity = createAutomationActivity({
        entityType,
        entityId,
        companyId,
        category: "automation",
        metadata: data as Record<string, unknown> & AutomationActivity,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId]
  );

  /**
   * Log a communication
   */
  const logCommunication = useCallback(
    async (
      communicationType: "email" | "sms" | "call" | "chat",
      subject?: string,
      description?: string
    ) => {
      const activity = createCommunicationActivity({
        entityType,
        entityId,
        companyId,
        actorId,
        actorName,
        category: "user",
        communicationType,
        subject,
        description,
      });

      return await logActivity(activity);
    },
    [entityType, entityId, companyId, actorId, actorName]
  );

  /**
   * Log entity creation
   */
  const logEntityCreated = useCallback(async () => {
    const activity = createEntityCreatedActivity({
      entityType,
      entityId,
      companyId,
      actorId,
      actorName,
      category: "user",
    });

    return await logActivity(activity);
  }, [entityType, entityId, companyId, actorId, actorName]);

  return {
    logRawActivity,
    logStatusChange,
    logFieldUpdate,
    logNote,
    logPhoto,
    logDocument,
    logAssignment,
    logAIInsight,
    logAutomation,
    logCommunication,
    logEntityCreated,
  };
}
