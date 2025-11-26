/**
 * Shared Notification Types
 *
 * Extracted to separate file to avoid circular dependencies between:
 * - notifications-store.ts
 * - communication-notifications-store.ts
 */

export type NotificationType =
	| "message"
	| "alert"
	| "payment"
	| "job"
	| "team"
	| "system";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export type Notification = {
	id: string;
	user_id: string;
	company_id: string;
	type: NotificationType;
	priority: NotificationPriority;
	title: string;
	message: string;
	read: boolean;
	read_at: string | null;
	action_url: string | null;
	action_label: string | null;
	metadata: Record<string, any> | null;
	created_at: string;
	updated_at: string;
};
