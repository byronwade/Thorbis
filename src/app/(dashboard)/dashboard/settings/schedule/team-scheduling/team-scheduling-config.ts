import type { Database } from "@/types/supabase";

type TeamRulesRow =
	| Database["public"]["Tables"]["schedule_team_rules"]["Row"]
	| null;

export type TeamSchedulingSettingsState = {
	maxJobsPerDay: number;
	maxJobsPerWeek: number;
	allowOvertime: boolean;
	preferSameTechnician: boolean;
	balanceWorkload: boolean;
	optimizeForTravelTime: boolean;
	maxTravelTimeMinutes: number;
	requireBreaks: boolean;
	breakAfterHours: number;
	breakDurationMinutes: number;
};

export const DEFAULT_TEAM_SCHEDULING_SETTINGS: TeamSchedulingSettingsState = {
	maxJobsPerDay: 8,
	maxJobsPerWeek: 40,
	allowOvertime: false,
	preferSameTechnician: true,
	balanceWorkload: true,
	optimizeForTravelTime: true,
	maxTravelTimeMinutes: 60,
	requireBreaks: true,
	breakAfterHours: 4,
	breakDurationMinutes: 15,
};

export function mapTeamSchedulingSettings(
	row: TeamRulesRow,
): Partial<TeamSchedulingSettingsState> {
	if (!row) {
		return {};
	}

	return {
		maxJobsPerDay: row.max_jobs_per_day ?? 8,
		maxJobsPerWeek: row.max_jobs_per_week ?? 40,
		allowOvertime: row.allow_overtime ?? false,
		preferSameTechnician: row.prefer_same_technician ?? true,
		balanceWorkload: row.balance_workload ?? true,
		optimizeForTravelTime: row.optimize_for_travel_time ?? true,
		maxTravelTimeMinutes: row.max_travel_time_minutes ?? 60,
		requireBreaks: row.require_breaks ?? true,
		breakAfterHours: row.break_after_hours ?? 4,
		breakDurationMinutes: row.break_duration_minutes ?? 15,
	};
}
