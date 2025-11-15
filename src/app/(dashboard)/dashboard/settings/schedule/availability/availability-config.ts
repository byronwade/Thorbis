import type { Database } from "@/types/supabase";

type AvailabilityRow =
  | Database["public"]["Tables"]["schedule_availability_settings"]["Row"]
  | null;

export type DayAvailability = {
  key: string;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};

export type AvailabilitySettingsState = {
  week: DayAvailability[];
  defaultAppointmentDurationMinutes: number;
  bufferTimeMinutes: number;
  minBookingNoticeHours: number;
  maxBookingAdvanceDays: number;
  lunchBreakEnabled: boolean;
  lunchBreakStart: string;
  lunchBreakDurationMinutes: number;
};

const DAYS: Array<{ key: string; label: string }> = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const DEFAULT_WEEK = DAYS.map((day) => ({
  key: day.key,
  label: day.label,
  enabled: day.key !== "saturday" && day.key !== "sunday",
  start: "08:00",
  end: "17:00",
}));

export const DEFAULT_AVAILABILITY_SETTINGS: AvailabilitySettingsState = {
  week: DEFAULT_WEEK,
  defaultAppointmentDurationMinutes: 60,
  bufferTimeMinutes: 15,
  minBookingNoticeHours: 24,
  maxBookingAdvanceDays: 90,
  lunchBreakEnabled: true,
  lunchBreakStart: "12:00",
  lunchBreakDurationMinutes: 60,
};

export function mapAvailabilitySettings(
  row: AvailabilityRow
): Partial<AvailabilitySettingsState> {
  if (!row) {
    return {};
  }

  const workHours =
    (row.default_work_hours as Record<
      string,
      { start?: string; end?: string; enabled?: boolean }
    > | null) ?? null;

  const week = DAYS.map((day) => {
    const record = workHours?.[day.key];
    return {
      key: day.key,
      label: day.label,
      enabled:
        record?.enabled ??
        DEFAULT_WEEK.find((d) => d.key === day.key)?.enabled ??
        true,
      start: record?.start ?? "08:00",
      end: record?.end ?? "17:00",
    };
  });

  return {
    week,
    defaultAppointmentDurationMinutes:
      row.default_appointment_duration_minutes ?? 60,
    bufferTimeMinutes: row.buffer_time_minutes ?? 15,
    minBookingNoticeHours: row.min_booking_notice_hours ?? 24,
    maxBookingAdvanceDays: row.max_booking_advance_days ?? 90,
    lunchBreakEnabled: row.lunch_break_enabled ?? true,
    lunchBreakStart: row.lunch_break_start ?? "12:00",
    lunchBreakDurationMinutes: row.lunch_break_duration_minutes ?? 60,
  };
}

export function serializeWorkHours(week: DayAvailability[]) {
  return JSON.stringify(
    week.reduce<
      Record<string, { start: string; end: string; enabled: boolean }>
    >((acc, day) => {
      acc[day.key] = {
        start: day.start,
        end: day.end,
        enabled: day.enabled,
      };
      return acc;
    }, {})
  );
}
