export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type HoursEntry = {
  enabled: boolean;
  openTime: string;
  closeTime: string;
};

export type HoursOfOperation = Record<
  (typeof DAYS_OF_WEEK)[number],
  HoursEntry
>;

export const DEFAULT_HOURS: HoursOfOperation = DAYS_OF_WEEK.reduce(
  (acc, day) => {
    const isWeekend = day === "saturday" || day === "sunday";
    acc[day] = {
      enabled: !isWeekend,
      openTime: isWeekend ? "" : "08:00",
      closeTime: isWeekend ? "" : "17:00",
    };
    return acc;
  },
  {} as HoursOfOperation
);

type StoredHoursEntry = {
  open?: string | null;
  close?: string | null;
};

export type StoredHoursOfOperation = Record<string, StoredHoursEntry>;

export function normalizeHoursFromSettings(
  raw?: StoredHoursOfOperation | null
): HoursOfOperation {
  return DAYS_OF_WEEK.reduce((acc, day) => {
    const entry = raw?.[day];
    const enabled = Boolean(entry?.open && entry?.close);
    acc[day] = {
      enabled,
      openTime: entry?.open ?? DEFAULT_HOURS[day].openTime,
      closeTime: entry?.close ?? DEFAULT_HOURS[day].closeTime,
    };
    return acc;
  }, {} as HoursOfOperation);
}

export function convertHoursToSettings(
  hours: HoursOfOperation
): StoredHoursOfOperation {
  return DAYS_OF_WEEK.reduce((acc, day) => {
    const entry = hours[day] ?? DEFAULT_HOURS[day];
    acc[day] = {
      open: entry.enabled ? entry.openTime || null : null,
      close: entry.enabled ? entry.closeTime || null : null,
    };
    return acc;
  }, {} as StoredHoursOfOperation);
}
