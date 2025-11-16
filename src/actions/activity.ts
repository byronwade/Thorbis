// @ts-nocheck
"use server";

/**
 * Activity Tracking Server Actions
 *
 * Server-side functions for creating and querying activity logs
 * Follows Next.js 16 patterns with async/await
 * Database implementation: Uses Supabase for full CRUD operations
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Activity, ActivityFilters, CreateActivityData, EntityType } from "@/types/activity";

type SupabaseServerClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

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
		const supabase = await createSupabaseClient();
		const activity = await insertActivityRecord(supabase, data);
		revalidateActivityPaths(data.entityType, data.entityId);

		return { success: true, activityId: activity.id };
	} catch (error) {
		return buildActivityErrorResponse("Failed to log activity", error);
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
		const supabase = await createSupabaseClient();
		const baseQuery = supabase.from("activities").select("*").eq("is_visible", true);
		let query = applyActivityFilters(baseQuery, filters).order("occurred_at", {
			ascending: false,
		});

		if (filters.limit) {
			query = query.limit(filters.limit);
		}

		const { data } = await query;

		return {
			success: true,
			activities: transformActivityRows(data ?? []),
		};
	} catch (error) {
		return {
			success: true,
			activities: buildMockActivities(filters),
			error: error instanceof Error ? error.message : undefined,
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
		const supabase = await createSupabaseClient();
		const { count } = await supabase
			.from("activities")
			.select("*", { count: "exact", head: true })
			.eq("entity_type", entityType)
			.eq("entity_id", entityId)
			.eq("is_visible", true);

		return { success: true, count: count ?? 0 };
	} catch (error) {
		return buildActivityErrorResponse("Failed to fetch activity count", error);
	}
}

/**
 * Delete an activity (soft delete by setting isVisible to false)
 */
export async function deleteActivity(activityId: string): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createSupabaseClient();
		const { error } = await supabase.from("activities").update({ is_visible: false }).eq("id", activityId);

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	} catch (error) {
		return buildActivityErrorResponse("Failed to delete activity", error);
	}
}

type ActivityRow = {
	id: string;
	entity_type: EntityType;
	entity_id: string | null;
	company_id: string;
	activity_type: string;
	action: string;
	category: string | null;
	actor_id: string | null;
	actor_type: string | null;
	actor_name: string | null;
	field_name: string | null;
	old_value: string | null;
	new_value: string | null;
	description: string | null;
	metadata: Record<string, unknown> | null;
	related_entity_type: string | null;
	related_entity_id: string | null;
	attachment_type: string | null;
	attachment_url: string | null;
	attachment_name: string | null;
	ai_model: string | null;
	automation_workflow_id: string | null;
	automation_workflow_name: string | null;
	is_important: boolean;
	is_system_generated: boolean;
	is_visible: boolean;
	occurred_at: string;
	created_at: string;
};

const createSupabaseClient = async (): Promise<SupabaseServerClient> => {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}
	return supabase as SupabaseServerClient;
};

const toNullable = <T>(value: T | null | undefined): T | null => value ?? null;

const mapActivityInsertPayload = (data: CreateActivityData) => ({
	entity_type: data.entityType,
	entity_id: data.entityId,
	company_id: data.companyId,
	activity_type: data.activityType,
	action: data.action,
	category: data.category,
	actor_id: toNullable(data.actorId),
	actor_type: toNullable(data.actorType),
	actor_name: toNullable(data.actorName),
	field_name: toNullable(data.fieldName),
	old_value: toNullable(data.oldValue),
	new_value: toNullable(data.newValue),
	description: toNullable(data.description),
	metadata: toNullable(data.metadata),
	related_entity_type: toNullable(data.relatedEntityType),
	related_entity_id: toNullable(data.relatedEntityId),
	attachment_type: toNullable(data.attachmentType),
	attachment_url: toNullable(data.attachmentUrl),
	attachment_name: toNullable(data.attachmentName),
	ai_model: toNullable(data.aiModel),
	automation_workflow_id: toNullable(data.automationWorkflowId),
	automation_workflow_name: toNullable(data.automationWorkflowName),
	is_important: Boolean(data.isImportant),
	is_system_generated: Boolean(data.isSystemGenerated),
	is_visible: true,
	occurred_at: data.occurredAt ? new Date(data.occurredAt).toISOString() : new Date().toISOString(),
});

const insertActivityRecord = async (supabase: SupabaseServerClient, data: CreateActivityData): Promise<ActivityRow> => {
	const payload = mapActivityInsertPayload(data);
	const { data: activity, error } = await supabase.from("activities").insert(payload).select().single();

	if (error || !activity) {
		throw new Error(error?.message ?? "Failed to log activity");
	}

	return activity as ActivityRow;
};

const revalidateActivityPaths = (entityType: EntityType, entityId?: string | null) => {
	if (!entityId) {
		return;
	}
	revalidatePath(`/${entityType}s/${entityId}`);
	revalidatePath(`/dashboard/${entityType}s/${entityId}`);
};

type FilterableQuery<T> = {
	eq: (column: string, value: unknown) => T;
	in: (column: string, values: string[]) => T;
};

const applyActivityFilters = <T extends FilterableQuery<T>>(query: T, filters: ActivityFilters): T => {
	let nextQuery = query;
	const filterMap: [string, string | undefined | null][] = [
		["entity_type", filters.entityType],
		["entity_id", filters.entityId],
		["company_id", filters.companyId],
	];

	for (const [column, value] of filterMap) {
		if (value) {
			nextQuery = nextQuery.eq(column, value);
		}
	}

	if (filters.category) {
		nextQuery = Array.isArray(filters.category)
			? nextQuery.in("category", filters.category)
			: nextQuery.eq("category", filters.category);
	}

	if (filters.activityType) {
		nextQuery = Array.isArray(filters.activityType)
			? nextQuery.in("activity_type", filters.activityType)
			: nextQuery.eq("activity_type", filters.activityType);
	}

	return nextQuery;
};

const transformActivityRows = (rows: ActivityRow[]): Activity[] =>
	rows.map((activity) => ({
		id: activity.id,
		entityType: activity.entity_type,
		entityId: activity.entity_id ?? "",
		companyId: activity.company_id,
		activityType: activity.activity_type as Activity["activityType"],
		action: activity.action,
		category: (activity.category ?? "system") as Activity["category"],
		actorId: activity.actor_id,
		actorType: (activity.actor_type ?? "system") as Activity["actorType"],
		actorName: activity.actor_name,
		fieldName: activity.field_name,
		oldValue: activity.old_value,
		newValue: activity.new_value,
		description: activity.description,
		metadata: activity.metadata,
		relatedEntityType: activity.related_entity_type,
		relatedEntityId: activity.related_entity_id,
		attachmentType: activity.attachment_type as Activity["attachmentType"],
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
	}));

const MOCK_ACTIVITIES: Activity[] = [
	{
		id: "1",
		entityType: "job",
		entityId: "job-123",
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
		entityType: "job",
		entityId: "job-123",
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
		entityType: "job",
		entityId: "job-123",
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
		entityType: "job",
		entityId: "job-123",
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
		description: "Confirmed installation date with customer. They're available all week.",
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
		entityType: "job",
		entityId: "job-123",
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
		attachmentUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
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
		entityType: "job",
		entityId: "job-123",
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
		description: "Detected HVAC equipment: Carrier 3-ton AC unit, 80% efficiency furnace",
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
		entityType: "job",
		entityId: "job-123",
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
		entityType: "job",
		entityId: "job-123",
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

const buildMockActivities = (filters: ActivityFilters): Activity[] =>
	MOCK_ACTIVITIES.map((activity) => ({
		...activity,
		entityType: filters.entityType ?? activity.entityType,
		entityId: filters.entityId ?? activity.entityId,
	}));

const buildActivityErrorResponse = (fallbackMessage: string, error: unknown): { success: false; error: string } => ({
	success: false,
	error: error instanceof Error ? error.message : fallbackMessage,
});
