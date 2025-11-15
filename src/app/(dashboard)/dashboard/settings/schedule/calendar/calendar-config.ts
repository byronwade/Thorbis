import type { Database } from "@/types/supabase";

type CalendarRow =
  | Database["public"]["Tables"]["schedule_calendar_settings"]["Row"]
  | null;

export type CalendarSettingsState = {
  defaultView: "day" | "week" | "month";
  startDayOfWeek: "sunday" | "monday";
  timeSlotDurationMinutes: number;
  showTechnicianColors: boolean;
  showJobStatusColors: boolean;
  showTravelTime: boolean;
  showCustomerName: boolean;
  showJobType: boolean;
  syncWithGoogleCalendar: boolean;
  syncWithOutlook: boolean;
};

export const DEFAULT_CALENDAR_SETTINGS: CalendarSettingsState = {
  defaultView: "week",
  startDayOfWeek: "monday",
  timeSlotDurationMinutes: 30,
  showTechnicianColors: true,
  showJobStatusColors: true,
  showTravelTime: true,
  showCustomerName: true,
  showJobType: true,
  syncWithGoogleCalendar: false,
  syncWithOutlook: false,
};

export function mapCalendarSettings(
  row: CalendarRow
): Partial<CalendarSettingsState> {
  if (!row) {
    return {};
  }

  return {
    defaultView:
      (row.default_view as CalendarSettingsState["defaultView"]) ?? "week",
    startDayOfWeek: (row.start_day_of_week ?? 1) === 0 ? "sunday" : "monday",
    timeSlotDurationMinutes: row.time_slot_duration_minutes ?? 30,
    showTechnicianColors: row.show_technician_colors ?? true,
    showJobStatusColors: row.show_job_status_colors ?? true,
    showTravelTime: row.show_travel_time ?? true,
    showCustomerName: row.show_customer_name ?? true,
    showJobType: row.show_job_type ?? true,
    syncWithGoogleCalendar: row.sync_with_google_calendar ?? false,
    syncWithOutlook: row.sync_with_outlook ?? false,
  };
}
