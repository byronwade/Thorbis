/**
 * Time Zone Service
 *
 * Fetches time zone information for a location
 * - Time zone ID
 * - Time zone name
 * - UTC offset
 * - DST offset
 *
 * API: Google Time Zone API
 * Free Tier: UNLIMITED (no charge)
 * Docs: https://developers.google.com/maps/documentation/timezone
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

export const TimeZoneSchema = z.object({
  timeZoneId: z.string(), // e.g., "America/New_York"
  timeZoneName: z.string(), // e.g., "Eastern Daylight Time"
  rawOffset: z.number(), // Offset from UTC in seconds (not including DST)
  dstOffset: z.number(), // DST offset in seconds
  totalOffset: z.number(), // Total offset in seconds (rawOffset + dstOffset)
  totalOffsetHours: z.number(), // Total offset in hours (for display)
  isDST: z.boolean(), // Whether DST is currently in effect
  dataSource: z.string(),
  enrichedAt: z.string(),
});

export type TimeZoneInfo = z.infer<typeof TimeZoneSchema>;

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const SECONDS_TO_HOURS = 3600;
const MS_TO_SECONDS = 1000;
const COORDINATE_PRECISION = 4;

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
export class TimeZoneService {
  private readonly apiKey: string | undefined;
  private readonly cache: Map<
    string,
    { data: TimeZoneInfo; timestamp: number }
  > = new Map();
  private readonly cacheTTL = CACHE_TTL_MS;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  }

  async getTimeZone(lat: number, lon: number): Promise<TimeZoneInfo | null> {
    if (!this.apiKey) {
      console.log("[Time Zone] Google Maps API key not configured");
      return null;
    }

    const cacheKey = `timezone:${lat.toFixed(COORDINATE_PRECISION)},${lon.toFixed(COORDINATE_PRECISION)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log(`[Time Zone] Using cached data for: ${lat}, ${lon}`);
      return cached.data;
    }

    try {
      // Google Time Zone API requires a timestamp to calculate DST correctly
      const timestamp = Math.floor(Date.now() / MS_TO_SECONDS);

      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestamp}&key=${this.apiKey}`;

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        console.warn(`[Time Zone] API request failed: ${res.status}`);
        return null;
      }

      const data = await res.json();

      if (data.status !== "OK") {
        console.log(`[Time Zone] API status: ${data.status}`);
        return null;
      }

      const totalOffset = data.rawOffset + data.dstOffset;
      const totalOffsetHours = totalOffset / SECONDS_TO_HOURS;
      const isDST = data.dstOffset !== 0;

      const timeZone: TimeZoneInfo = {
        timeZoneId: data.timeZoneId,
        timeZoneName: data.timeZoneName,
        rawOffset: data.rawOffset,
        dstOffset: data.dstOffset,
        totalOffset,
        totalOffsetHours,
        isDST,
        dataSource: "google-timezone",
        enrichedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, { data: timeZone, timestamp: Date.now() });
      console.log(
        `[Time Zone] ${timeZone.timeZoneId} (UTC${totalOffsetHours >= 0 ? "+" : ""}${totalOffsetHours})`
      );

      return timeZone;
    } catch (error) {
      console.error("[Time Zone] Error:", error);
      return null;
    }
  }

  /**
   * Format time zone offset for display
   */
  formatOffset(totalOffsetHours: number): string {
    const sign = totalOffsetHours >= 0 ? "+" : "-";
    const absHours = Math.abs(totalOffsetHours);
    const hours = Math.floor(absHours);
    const minutes = Math.round((absHours - hours) * 60);

    if (minutes === 0) {
      return `UTC${sign}${hours}`;
    }
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  /**
   * Get current local time for a timezone
   */
  getCurrentLocalTime(timeZoneId: string): Date {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: timeZoneId })
    );
  }

  /**
   * Check if location is in same timezone as user
   */
  isSameTimeZone(locationTimeZoneId: string): boolean {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return locationTimeZoneId === userTimeZone;
  }
}

export const timeZoneService = new TimeZoneService();
