/**
 * Activity Tracking Types
 *
 * Comprehensive type definitions for the activity tracking system
 * Used across jobs, customers, invoices, estimates, and all other entities
 */

// Entity types that support activity tracking
export type EntityType =
  | "job"
  | "customer"
  | "invoice"
  | "estimate"
  | "property"
  | "purchase_order"
  | "user"
  | "company"
  | "team_member";

// Activity types (what kind of change happened)
export type ActivityType =
  | "created"
  | "deleted"
  | "status_change"
  | "field_update"
  | "note_added"
  | "photo_added"
  | "document_added"
  | "ai_insight"
  | "automation"
  | "assignment_change"
  | "communication"
  | "payment"
  | "scheduled"
  | "completed"
  | "cancelled";

// Activity category (who/what triggered the activity)
export type ActivityCategory = "system" | "user" | "ai" | "automation";

// Actor type (who performed the action)
export type ActorType = "user" | "system" | "ai" | "automation";

// Attachment types
export type AttachmentType = "photo" | "document" | "video" | null;

// Activity data structure (matches database schema)
export type Activity = {
  id: string;
  // Entity references
  entityType: EntityType;
  entityId: string;
  companyId: string;
  // Activity metadata
  activityType: ActivityType;
  action: string;
  category: ActivityCategory;
  // Actor
  actorId: string | null;
  actorType: ActorType;
  actorName: string | null;
  // Change details
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  // Additional context
  description: string | null;
  metadata: Record<string, unknown> | null;
  // Related entities
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  // Attachments
  attachmentType: AttachmentType;
  attachmentUrl: string | null;
  attachmentName: string | null;
  // AI/Automation
  aiModel: string | null;
  automationWorkflowId: string | null;
  automationWorkflowName: string | null;
  // Visibility
  isImportant: boolean;
  isSystemGenerated: boolean;
  isVisible: boolean;
  // Timestamps
  occurredAt: Date;
  createdAt: Date;
};

// Data to create a new activity
export type CreateActivityData = {
  // Required
  entityType: EntityType;
  entityId: string;
  companyId: string;
  activityType: ActivityType;
  action: string;
  category: ActivityCategory;
  // Optional - Actor
  actorId?: string | null;
  actorType?: ActorType;
  actorName?: string | null;
  // Optional - Change details
  fieldName?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  // Optional - Additional context
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  // Optional - Related entities
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  // Optional - Attachments
  attachmentType?: AttachmentType;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  // Optional - AI/Automation
  aiModel?: string | null;
  automationWorkflowId?: string | null;
  automationWorkflowName?: string | null;
  // Optional - Visibility
  isImportant?: boolean;
  isSystemGenerated?: boolean;
  isVisible?: boolean;
  // Optional - Custom timestamp
  occurredAt?: Date;
};

// Activity filter options
export type ActivityFilters = {
  entityType?: EntityType;
  entityId?: string;
  companyId?: string;
  activityType?: ActivityType | ActivityType[];
  category?: ActivityCategory | ActivityCategory[];
  actorId?: string;
  startDate?: Date;
  endDate?: Date;
  isImportant?: boolean;
  isSystemGenerated?: boolean;
  limit?: number;
};

// Activity timeline view model (for UI display)
export type ActivityTimelineItem = {
  id: string;
  // Display data
  icon: string;
  iconColor: string;
  title: string;
  description: string | null;
  timestamp: Date;
  // Actor info
  actorName: string;
  actorAvatar?: string | null;
  actorType: ActorType;
  // Optional attachments
  attachment?: {
    type: AttachmentType;
    url: string;
    name: string;
  } | null;
  // Flags
  isImportant: boolean;
  isSystemGenerated: boolean;
  // Metadata
  metadata?: Record<string, unknown>;
};

// Helper type for status changes
export type StatusChangeActivity = {
  oldStatus: string;
  newStatus: string;
  reason?: string;
};

// Helper type for field updates
export type FieldUpdateActivity = {
  fieldName: string;
  fieldLabel: string;
  oldValue: string | null;
  newValue: string | null;
};

// Helper type for assignment changes
export type AssignmentChangeActivity = {
  oldAssignee?: {
    id: string;
    name: string;
  } | null;
  newAssignee: {
    id: string;
    name: string;
  };
};

// Helper type for AI insights
export type AIInsightActivity = {
  model: string;
  insightType: string;
  confidence?: number;
  data: Record<string, unknown>;
};

// Helper type for automation activities
export type AutomationActivity = {
  workflowId: string;
  workflowName: string;
  triggerType: string;
  actionType: string;
  result: "success" | "failure" | "partial";
  details?: Record<string, unknown>;
};
