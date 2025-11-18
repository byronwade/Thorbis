import type { Database } from "@/types/supabase";

type UserPreferencesRow =
	| Database["public"]["Tables"]["user_preferences"]["Row"]
	| null;

export type ThemeOption = "light" | "dark" | "system";

export type PreferenceSettings = {
	theme: ThemeOption;
	language: string;
	timezone: string;
	dateFormat: string;
	timeFormat: "12h" | "24h";
	currency: string;
	compactMode: boolean;
	showAnimations: boolean;
	autoSaveForms: boolean;
	sidebarPosition: "left" | "right";
	tableView: "default" | "compact";
};

export const DEFAULT_PREFERENCE_SETTINGS: PreferenceSettings = {
	theme: "system",
	language: "en-US",
	timezone: "America/New_York",
	dateFormat: "MM/dd/yyyy",
	timeFormat: "12h",
	currency: "USD",
	compactMode: false,
	showAnimations: true,
	autoSaveForms: true,
	sidebarPosition: "right",
	tableView: "default",
};

export function mapPreferencesFromDb(
	data: UserPreferencesRow,
): PreferenceSettings {
	return {
		...DEFAULT_PREFERENCE_SETTINGS,
		theme:
			(data?.theme === "light" ||
			data?.theme === "dark" ||
			data?.theme === "system"
				? data.theme
				: DEFAULT_PREFERENCE_SETTINGS.theme) ??
			DEFAULT_PREFERENCE_SETTINGS.theme,
		language: data?.language ?? DEFAULT_PREFERENCE_SETTINGS.language,
		timezone: data?.timezone ?? DEFAULT_PREFERENCE_SETTINGS.timezone,
		dateFormat: data?.date_format ?? DEFAULT_PREFERENCE_SETTINGS.dateFormat,
		timeFormat:
			data?.time_format === "24h"
				? "24h"
				: data?.time_format === "12h"
					? "12h"
					: DEFAULT_PREFERENCE_SETTINGS.timeFormat,
		tableView:
			data?.default_page_size === 10
				? "compact"
				: DEFAULT_PREFERENCE_SETTINGS.tableView,
	};
}
