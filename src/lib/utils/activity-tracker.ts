/**
 * Activity Tracking Utilities
 *
 * Helper functions for creating and managing activity tracking entries
 * Provides type-safe helpers for common activity patterns
 */

import {
	Bot,
	Calendar,
	CheckCircle2,
	FileText,
	Image,
	type LucideIcon,
	Mail,
	MessageSquare,
	Settings,
	Sparkles,
	UserPlus,
	Zap,
} from "lucide-react";
import type {
	Activity,
	ActivityTimelineItem,
	ActivityType,
	AIInsightActivity,
	AssignmentChangeActivity,
	AutomationActivity,
	CreateActivityData,
	FieldUpdateActivity,
	StatusChangeActivity,
} from "@/types/activity";

/**
 * Create a status change activity
 */
export function createStatusChangeActivity(
	data: Omit<CreateActivityData, "activityType" | "action"> & {
		metadata: StatusChangeActivity;
	}
): CreateActivityData {
	const { oldStatus, newStatus } = data.metadata;
	return {
		...data,
		activityType: "status_change",
		action: `changed status from ${oldStatus} to ${newStatus}`,
		fieldName: "status",
		oldValue: oldStatus,
		newValue: newStatus,
	};
}

/**
 * Create a field update activity
 */
export function createFieldUpdateActivity(
	data: Omit<CreateActivityData, "activityType" | "action"> & {
		metadata: FieldUpdateActivity;
	}
): CreateActivityData {
	const { fieldName, fieldLabel, oldValue, newValue } = data.metadata;
	return {
		...data,
		activityType: "field_update",
		action: `updated ${fieldLabel}`,
		fieldName,
		oldValue: oldValue || null,
		newValue: newValue || null,
	};
}

/**
 * Create a note added activity
 */
export function createNoteActivity(
	data: Omit<CreateActivityData, "activityType" | "action" | "description"> & {
		noteContent: string;
	}
): CreateActivityData {
	return {
		...data,
		activityType: "note_added",
		action: "added a note",
		description: data.noteContent,
	};
}

/**
 * Create a photo added activity
 */
export function createPhotoActivity(
	data: Omit<
		CreateActivityData,
		"activityType" | "action" | "attachmentType" | "attachmentUrl" | "attachmentName"
	> & {
		photoUrl: string;
		photoName: string;
	}
): CreateActivityData {
	return {
		...data,
		activityType: "photo_added",
		action: "uploaded a photo",
		attachmentType: "photo",
		attachmentUrl: data.photoUrl,
		attachmentName: data.photoName,
	};
}

/**
 * Create a document added activity
 */
export function createDocumentActivity(
	data: Omit<
		CreateActivityData,
		"activityType" | "action" | "attachmentType" | "attachmentUrl" | "attachmentName"
	> & {
		documentUrl: string;
		documentName: string;
	}
): CreateActivityData {
	return {
		...data,
		activityType: "document_added",
		action: "uploaded a document",
		attachmentType: "document",
		attachmentUrl: data.documentUrl,
		attachmentName: data.documentName,
	};
}

/**
 * Create an assignment change activity
 */
export function createAssignmentActivity(
	data: Omit<CreateActivityData, "activityType" | "action"> & {
		metadata: AssignmentChangeActivity;
	}
): CreateActivityData {
	const { oldAssignee, newAssignee } = data.metadata;
	const action = oldAssignee
		? `reassigned from ${oldAssignee.name} to ${newAssignee.name}`
		: `assigned to ${newAssignee.name}`;

	return {
		...data,
		activityType: "assignment_change",
		action,
		fieldName: "assignedTo",
		oldValue: oldAssignee?.id || null,
		newValue: newAssignee.id,
		relatedEntityType: "user",
		relatedEntityId: newAssignee.id,
	};
}

/**
 * Create an AI insight activity
 */
export function createAIInsightActivity(
	data: Omit<CreateActivityData, "activityType" | "action"> & {
		metadata: AIInsightActivity;
	}
): CreateActivityData {
	const { model, insightType, confidence } = data.metadata;
	return {
		...data,
		activityType: "ai_insight",
		action: `generated ${insightType} insight`,
		category: "ai",
		actorType: "ai",
		actorName: "AI Assistant",
		aiModel: model,
		description: confidence ? `Confidence: ${Math.round(confidence * 100)}%` : undefined,
		isSystemGenerated: true,
	};
}

/**
 * Create an automation activity
 */
export function createAutomationActivity(
	data: Omit<CreateActivityData, "activityType" | "action"> & {
		metadata: AutomationActivity;
	}
): CreateActivityData {
	const { workflowName, actionType, result } = data.metadata;
	return {
		...data,
		activityType: "automation",
		action: `${actionType} (${result})`,
		category: "automation",
		actorType: "automation",
		actorName: workflowName,
		automationWorkflowId: data.metadata.workflowId,
		automationWorkflowName: workflowName,
		isSystemGenerated: true,
	};
}

/**
 * Create a communication activity
 */
export function createCommunicationActivity(
	data: Omit<CreateActivityData, "activityType" | "action"> & {
		communicationType: "email" | "sms" | "call" | "chat";
		subject?: string;
	}
): CreateActivityData {
	const typeLabels = {
		email: "sent an email",
		sms: "sent an SMS",
		call: "made a call",
		chat: "sent a message",
	};

	return {
		...data,
		activityType: "communication",
		action: typeLabels[data.communicationType],
		description: data.subject || undefined,
		metadata: {
			communicationType: data.communicationType,
			...data.metadata,
		},
	};
}

/**
 * Create an entity creation activity
 */
export function createEntityCreatedActivity(
	data: Omit<CreateActivityData, "activityType" | "action">
): CreateActivityData {
	return {
		...data,
		activityType: "created",
		action: `created ${data.entityType}`,
		isImportant: true,
	};
}

/**
 * Convert activity to timeline item for UI display
 */
export function activityToTimelineItem(activity: Activity): ActivityTimelineItem {
	const icon = getActivityIcon(activity.activityType);
	const iconColor = getActivityIconColor(activity.category);

	return {
		id: activity.id,
		icon: icon.name || "Circle",
		iconColor,
		title: activity.action,
		description: activity.description,
		timestamp: activity.occurredAt,
		actorName: activity.actorName || "System",
		actorType: activity.actorType,
		attachment:
			activity.attachmentUrl && activity.attachmentType
				? {
						type: activity.attachmentType,
						url: activity.attachmentUrl,
						name: activity.attachmentName || "Attachment",
					}
				: null,
		isImportant: activity.isImportant,
		isSystemGenerated: activity.isSystemGenerated,
		metadata: activity.metadata as Record<string, unknown> | undefined,
	};
}

/**
 * Get icon for activity type
 */
export function getActivityIcon(activityType: ActivityType): LucideIcon {
	const iconMap: Record<ActivityType, LucideIcon> = {
		created: Sparkles,
		deleted: Zap,
		status_change: CheckCircle2,
		field_update: Settings,
		note_added: MessageSquare,
		photo_added: Image,
		document_added: FileText,
		ai_insight: Bot,
		automation: Zap,
		assignment_change: UserPlus,
		communication: Mail,
		payment: CheckCircle2,
		scheduled: Calendar,
		completed: CheckCircle2,
		cancelled: Zap,
	};

	return iconMap[activityType] || Settings;
}

/**
 * Get color for activity category
 */
export function getActivityIconColor(category: "system" | "user" | "ai" | "automation"): string {
	const colorMap = {
		system: "text-blue-500",
		user: "text-green-500",
		ai: "text-purple-500",
		automation: "text-orange-500",
	};

	return colorMap[category] || "text-gray-500";
}

/**
 * Format activity timestamp for display
 */
export function formatActivityTimestamp(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	const diffHours = Math.floor(diffMs / 3_600_000);
	const diffDays = Math.floor(diffMs / 86_400_000);

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < 60) {
		return `${diffMins}m ago`;
	}
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	if (diffDays < 7) {
		return `${diffDays}d ago`;
	}

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
	});
}

/**
 * Group activities by date
 */
export function groupActivitiesByDate(activities: Activity[]): Map<string, Activity[]> {
	const grouped = new Map<string, Activity[]>();

	for (const activity of activities) {
		const dateKey = activity.occurredAt.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		if (!grouped.has(dateKey)) {
			grouped.set(dateKey, []);
		}
		grouped.get(dateKey)?.push(activity);
	}

	return grouped;
}

/**
 * Filter activities by type
 */
export function filterActivitiesByType(activities: Activity[], types: ActivityType[]): Activity[] {
	return activities.filter((activity) => types.includes(activity.activityType));
}

/**
 * Get recent activities (last N)
 */
export function getRecentActivities(activities: Activity[], count: number): Activity[] {
	return activities.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()).slice(0, count);
}
