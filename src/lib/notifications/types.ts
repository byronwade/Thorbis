/**
 * Notification Types and Schemas
 *
 * Zod schemas and TypeScript types for the notifications system.
 * Separated from server actions to comply with Next.js "use server" restrictions.
 */

import { z } from "zod";

// ============================================================================
// SCHEMAS
// ============================================================================

export const NotificationTypeSchema = z.enum([
	"message",
	"alert",
	"payment",
	"job",
	"team",
	"system",
]);

export const NotificationPrioritySchema = z.enum([
	"low",
	"medium",
	"high",
	"urgent",
]);

export const CreateNotificationSchema = z.object({
	userId: z.string().uuid("Invalid user ID"),
	companyId: z.string().uuid("Invalid company ID"),
	type: NotificationTypeSchema,
	priority: NotificationPrioritySchema.default("medium"),
	title: z.string().min(1, "Title is required").max(200),
	message: z.string().min(1, "Message is required").max(500),
	actionUrl: z.string().url().optional().or(z.literal("")),
	actionLabel: z.string().max(50).optional(),
	metadata: z.record(z.string(), z.any()).optional(),
});

export const GetNotificationsSchema = z.object({
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
	unreadOnly: z.boolean().default(false),
	type: NotificationTypeSchema.optional(),
	priority: NotificationPrioritySchema.optional(),
});

export const NotificationPreferenceSchema = z.object({
	channel: z.enum(["in_app", "email", "sms", "push"]),
	eventType: z.string(),
	enabled: z.boolean(),
});

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type GetNotificationsInput = z.infer<typeof GetNotificationsSchema>;
export type NotificationPreference = z.infer<
	typeof NotificationPreferenceSchema
>;
