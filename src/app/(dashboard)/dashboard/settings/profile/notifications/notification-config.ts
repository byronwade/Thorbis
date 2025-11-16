import type { Database } from "@/types/supabase";

type NotificationPreferencesRow = Database["public"]["Tables"]["user_notification_preferences"]["Row"] | null;

export type NotificationPreferencesState = {
	emailNewJobs: boolean;
	emailJobUpdates: boolean;
	emailMentions: boolean;
	emailMessages: boolean;
	pushNewJobs: boolean;
	pushJobUpdates: boolean;
	pushMentions: boolean;
	pushMessages: boolean;
	smsUrgentJobs: boolean;
	smsScheduleChanges: boolean;
	inAppAll: boolean;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferencesState = {
	emailNewJobs: true,
	emailJobUpdates: true,
	emailMentions: true,
	emailMessages: true,
	pushNewJobs: true,
	pushJobUpdates: true,
	pushMentions: true,
	pushMessages: true,
	smsUrgentJobs: false,
	smsScheduleChanges: false,
	inAppAll: true,
};

export function mapNotificationPreferences(data: NotificationPreferencesRow): NotificationPreferencesState {
	return {
		emailNewJobs: data?.email_new_jobs ?? DEFAULT_NOTIFICATION_PREFERENCES.emailNewJobs,
		emailJobUpdates: data?.email_job_updates ?? DEFAULT_NOTIFICATION_PREFERENCES.emailJobUpdates,
		emailMentions: data?.email_mentions ?? DEFAULT_NOTIFICATION_PREFERENCES.emailMentions,
		emailMessages: data?.email_messages ?? DEFAULT_NOTIFICATION_PREFERENCES.emailMessages,
		pushNewJobs: data?.push_new_jobs ?? DEFAULT_NOTIFICATION_PREFERENCES.pushNewJobs,
		pushJobUpdates: data?.push_job_updates ?? DEFAULT_NOTIFICATION_PREFERENCES.pushJobUpdates,
		pushMentions: data?.push_mentions ?? DEFAULT_NOTIFICATION_PREFERENCES.pushMentions,
		pushMessages: data?.push_messages ?? DEFAULT_NOTIFICATION_PREFERENCES.pushMessages,
		smsUrgentJobs: data?.sms_urgent_jobs ?? DEFAULT_NOTIFICATION_PREFERENCES.smsUrgentJobs,
		smsScheduleChanges: data?.sms_schedule_changes ?? DEFAULT_NOTIFICATION_PREFERENCES.smsScheduleChanges,
		inAppAll: data?.in_app_all ?? DEFAULT_NOTIFICATION_PREFERENCES.inAppAll,
	};
}
