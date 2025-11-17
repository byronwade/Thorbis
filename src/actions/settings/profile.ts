/**
 * User Profile Settings Server Actions
 *
 * Handles user-specific preferences and notification settings
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// USER NOTIFICATION PREFERENCES
// ============================================================================

const notificationPreferencesSchema = z.object({
	// Email Notifications
	emailNewJobs: z.boolean().default(true),
	emailJobUpdates: z.boolean().default(true),
	emailMentions: z.boolean().default(true),
	emailMessages: z.boolean().default(true),

	// Push Notifications
	pushNewJobs: z.boolean().default(true),
	pushJobUpdates: z.boolean().default(true),
	pushMentions: z.boolean().default(true),
	pushMessages: z.boolean().default(true),

	// SMS Notifications
	smsUrgentJobs: z.boolean().default(false),
	smsScheduleChanges: z.boolean().default(false),

	// In-App Notifications
	inAppAll: z.boolean().default(true),

	// Digest Settings
	digestEnabled: z.boolean().default(false),
	digestFrequency: z.enum(["realtime", "hourly", "daily", "weekly"]).default("daily"),
});

export async function updateNotificationPreferences(
	formData: FormData
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const data = notificationPreferencesSchema.parse({
			emailNewJobs: formData.get("emailNewJobs") !== "false",
			emailJobUpdates: formData.get("emailJobUpdates") !== "false",
			emailMentions: formData.get("emailMentions") !== "false",
			emailMessages: formData.get("emailMessages") !== "false",
			pushNewJobs: formData.get("pushNewJobs") !== "false",
			pushJobUpdates: formData.get("pushJobUpdates") !== "false",
			pushMentions: formData.get("pushMentions") !== "false",
			pushMessages: formData.get("pushMessages") !== "false",
			smsUrgentJobs: formData.get("smsUrgentJobs") === "true",
			smsScheduleChanges: formData.get("smsScheduleChanges") === "true",
			inAppAll: formData.get("inAppAll") !== "false",
			digestEnabled: formData.get("digestEnabled") === "true",
			digestFrequency: formData.get("digestFrequency") || "daily",
		});

		const { error } = await supabase.from("user_notification_preferences").upsert({
			user_id: user.id,
			email_new_jobs: data.emailNewJobs,
			email_job_updates: data.emailJobUpdates,
			email_mentions: data.emailMentions,
			email_messages: data.emailMessages,
			push_new_jobs: data.pushNewJobs,
			push_job_updates: data.pushJobUpdates,
			push_mentions: data.pushMentions,
			push_messages: data.pushMessages,
			sms_urgent_jobs: data.smsUrgentJobs,
			sms_schedule_changes: data.smsScheduleChanges,
			in_app_all: data.inAppAll,
			digest_enabled: data.digestEnabled,
			digest_frequency: data.digestFrequency,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update notification preferences"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/profile/notifications");
	});
}

export async function getNotificationPreferences(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data, error } = await supabase
			.from("user_notification_preferences")
			.select("*")
			.eq("user_id", user.id)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch notification preferences"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// USER PREFERENCES (Display, Localization)
// ============================================================================

const userPreferencesSchema = z.object({
	// Display Preferences
	theme: z.enum(["light", "dark", "system"]).default("system"),
	language: z.string().default("en"),
	timezone: z.string().default("America/New_York"),
	dateFormat: z.string().default("MM/DD/YYYY"),
	timeFormat: z.enum(["12h", "24h"]).default("12h"),

	// Dashboard Preferences
	defaultDashboardView: z.string().optional(),
	showWelcomeBanner: z.boolean().default(true),

	// Table/List Preferences
	defaultPageSize: z.enum(["10", "25", "50", "100"]).default("25"),

	// Calendar Preferences
	calendarView: z.string().default("week"),
	calendarStartDay: z.coerce.number().min(0).max(6).default(0),
});

export async function updateUserPreferences(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const data = userPreferencesSchema.parse({
			theme: formData.get("theme") || "system",
			language: formData.get("language") || "en",
			timezone: formData.get("timezone") || "America/New_York",
			dateFormat: formData.get("dateFormat") || "MM/DD/YYYY",
			timeFormat: formData.get("timeFormat") || "12h",
			defaultDashboardView: formData.get("defaultDashboardView") || undefined,
			showWelcomeBanner: formData.get("showWelcomeBanner") !== "false",
			defaultPageSize: formData.get("defaultPageSize") || "25",
			calendarView: formData.get("calendarView") || "week",
			calendarStartDay: formData.get("calendarStartDay") || "0",
		});

		const { error } = await supabase.from("user_preferences").upsert({
			user_id: user.id,
			theme: data.theme,
			language: data.language,
			timezone: data.timezone,
			date_format: data.dateFormat,
			time_format: data.timeFormat,
			default_dashboard_view: data.defaultDashboardView,
			show_welcome_banner: data.showWelcomeBanner,
			default_page_size: Number.parseInt(data.defaultPageSize, 10),
			calendar_view: data.calendarView,
			calendar_start_day: data.calendarStartDay,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update user preferences"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/profile/preferences");
	});
}

export async function getUserPreferences(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data, error } = await supabase
			.from("user_preferences")
			.select("*")
			.eq("user_id", user.id)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch user preferences"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// PERSONAL INFORMATION (from users table)
// ============================================================================

const personalInfoSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	avatar: z.string().optional(),
});

export async function updatePersonalInfo(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const data = personalInfoSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			phone: formData.get("phone") || undefined,
			avatar: formData.get("avatar") || undefined,
		});

		// Update users table
		const { error: userError } = await supabase
			.from("users")
			.update({
				name: data.name,
				email: data.email,
				phone: data.phone,
				avatar: data.avatar,
			})
			.eq("id", user.id);

		if (userError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update personal information"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		// If email changed, update auth email too
		if (data.email !== user.email) {
			const { error: authError } = await supabase.auth.updateUser({
				email: data.email,
			});

			if (authError) {
				throw new ActionError(
					"Failed to update authentication email",
					ERROR_CODES.AUTH_UNAUTHORIZED
				);
			}
		}

		revalidatePath("/dashboard/settings/profile/personal");
	});
}

export async function getPersonalInfo(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data, error } = await supabase
			.from("users")
			.select("id, name, email, phone, avatar")
			.eq("id", user.id)
			.single();

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch personal information"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data;
	});
}

// ============================================================================
// PASSWORD UPDATE
// ============================================================================

const passwordUpdateSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export async function updatePassword(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const data = passwordUpdateSchema.parse({
			currentPassword: formData.get("currentPassword"),
			newPassword: formData.get("newPassword"),
			confirmPassword: formData.get("confirmPassword"),
		});

		// Update password via Supabase Auth
		const { error } = await supabase.auth.updateUser({
			password: data.newPassword,
		});

		if (error) {
			throw new ActionError("Failed to update password", ERROR_CODES.AUTH_UNAUTHORIZED);
		}

		revalidatePath("/dashboard/settings/profile/security/password");
	});
}
