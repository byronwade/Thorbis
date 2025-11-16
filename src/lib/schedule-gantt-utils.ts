/**
 * Gantt Scheduler Utilities
 * Helper functions for time calculations, positioning, and date manipulation
 */

import {
  addMinutes,
  format,
  getHours,
  getMinutes,
  setHours,
  startOfDay,
} from "date-fns";

/**
 * Generate hourly time slots for a given day
 * @param date - The date to generate hours for
 * @param startHour - Starting hour (0-23), default 7
 * @param endHour - Ending hour (0-23), default 19
 * @returns Array of Date objects representing each hour
 */
export function generateHourlySlots(
  date: Date,
  startHour = 7,
  endHour = 19
): Date[] {
  const slots: Date[] = [];
  const dayStart = startOfDay(date);

  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(setHours(dayStart, hour));
  }

  return slots;
}

/**
 * Calculate the pixel position for a given time within a time range
 * @param time - The time to position
 * @param startTime - Start of the time range
 * @param endTime - End of the time range
 * @param totalWidth - Total width in pixels
 * @returns Pixel position from the left
 */
export function calculateTimePosition(
  time: Date,
  startTime: Date,
  endTime: Date,
  totalWidth: number
): number {
  const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  const timeMinutes = (time.getTime() - startTime.getTime()) / (1000 * 60);
  const percentage = timeMinutes / totalMinutes;
  return percentage * totalWidth;
}

/**
 * Calculate the width of a job block in pixels
 * @param startTime - Job start time
 * @param endTime - Job end time
 * @param startRange - Start of the visible time range
 * @param endRange - End of the visible time range
 * @param totalWidth - Total width in pixels
 * @returns Width in pixels
 */
export function calculateJobWidth(
  startTime: Date,
  endTime: Date,
  startRange: Date,
  endRange: Date,
  totalWidth: number
): number {
  const totalMinutes =
    (endRange.getTime() - startRange.getTime()) / (1000 * 60);
  const jobMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  const percentage = jobMinutes / totalMinutes;
  return percentage * totalWidth;
}

/**
 * Format time for display in hourly grid
 * @param date - Date to format
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export function formatHourLabel(date: Date): string {
  return format(date, "h:mm a");
}

/**
 * Format time range for display
 * @param start - Start time
 * @param end - End time
 * @returns Formatted range string (e.g., "9:00 AM - 11:00 AM")
 */
export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
}

/**
 * Get the current time position indicator
 * @param startRange - Start of the visible time range
 * @param endRange - End of the visible time range
 * @param totalWidth - Total width in pixels
 * @returns Pixel position for current time, or null if outside range
 */
export function getCurrentTimePosition(
  startRange: Date,
  endRange: Date,
  totalWidth: number
): number | null {
  const now = new Date();
  if (now < startRange || now > endRange) {
    return null;
  }
  return calculateTimePosition(now, startRange, endRange, totalWidth);
}

/**
 * Check if a job overlaps with a time range
 * @param jobStart - Job start time
 * @param jobEnd - Job end time
 * @param rangeStart - Range start time
 * @param rangeEnd - Range end time
 * @returns True if job overlaps with range
 */
export function jobOverlapsRange(
  jobStart: Date,
  jobEnd: Date,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  return jobStart < rangeEnd && jobEnd > rangeStart;
}

/**
 * Clamp a time to be within a range
 * @param time - Time to clamp
 * @param min - Minimum time
 * @param max - Maximum time
 * @returns Clamped time
 */
export function clampTime(time: Date, min: Date, max: Date): Date {
  if (time < min) {
    return min;
  }
  if (time > max) {
    return max;
  }
  return time;
}

/**
 * Get minutes from start of day
 * @param date - Date to get minutes from
 * @returns Minutes from midnight (0-1439)
 */
export function getMinutesFromMidnight(date: Date): number {
  return getHours(date) * 60 + getMinutes(date);
}

/**
 * Create a date from minutes since midnight
 * @param baseDate - Base date (day)
 * @param minutes - Minutes since midnight
 * @returns Date object
 */
export function dateFromMinutes(baseDate: Date, minutes: number): Date {
  const dayStart = startOfDay(baseDate);
  return addMinutes(dayStart, minutes);
}
