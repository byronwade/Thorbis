/**
 * Google Time Zone Service
 *
 * Gets timezone information for any location.
 * - Timezone ID and name
 * - UTC offset (with DST handling)
 * - Local time at location
 * - Useful for scheduling jobs across time zones
 *
 * API: Google Time Zone API
 * Free Tier: $200/month credit = ~40,000 requests
 * Docs: https://developers.google.com/maps/documentation/timezone
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Time Zone API response schema
 */
const TimeZoneResponseSchema = z.object({
	status: z.enum([
		"OK",
		"INVALID_REQUEST",
		"OVER_DAILY_LIMIT",
		"OVER_QUERY_LIMIT",
		"REQUEST_DENIED",
		"UNKNOWN_ERROR",
		"ZERO_RESULTS",
	]),
	dstOffset: z.number().optional(), // DST offset in seconds
	rawOffset: z.number().optional(), // Raw UTC offset in seconds
	timeZoneId: z.string().optional(), // IANA timezone ID (e.g., "America/New_York")
	timeZoneName: z.string().optional(), // Display name (e.g., "Eastern Daylight Time")
	errorMessage: z.string().optional(),
});

export type TimeZoneResponse = z.infer<typeof TimeZoneResponseSchema>;

/**
 * Processed timezone result
 */
export interface TimeZoneResult {
	timeZoneId: string;
	timeZoneName: string;
	rawOffsetSeconds: number;
	dstOffsetSeconds: number;
	totalOffsetSeconds: number;
	totalOffsetHours: number;
	utcOffsetString: string; // e.g., "UTC-05:00"
	isDST: boolean;
	localTime: Date;
	localTimeString: string;
}

/**
 * Location input
 */
export interface TimeZoneLocation {
	latitude: number;
	longitude: number;
}

/**
 * Business hours in a specific timezone
 */
export interface BusinessHours {
	timeZoneId: string;
	openTime: string; // HH:mm format
	closeTime: string; // HH:mm format
	isCurrentlyOpen: boolean;
	opensIn?: string; // Duration until opens
	closesIn?: string; // Duration until closes
	localTime: string;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days (timezones rarely change)

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleTimeZoneService {
	private readonly apiKey: string | undefined;
	private readonly cache: Map<
		string,
		{ data: TimeZoneResult; timestamp: number }
	> = new Map();
	private readonly cacheTTL = CACHE_TTL_MS;

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Generate cache key
	 */
	private generateCacheKey(lat: number, lng: number): string {
		// Round to 2 decimal places for caching (same timezone within ~1km)
		return `tz:${lat.toFixed(2)},${lng.toFixed(2)}`;
	}

	/**
	 * Format offset as UTC string
	 */
	private formatUtcOffset(offsetSeconds: number): string {
		const hours = Math.floor(Math.abs(offsetSeconds) / 3600);
		const minutes = Math.floor((Math.abs(offsetSeconds) % 3600) / 60);
		const sign = offsetSeconds >= 0 ? "+" : "-";
		return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	}

	/**
	 * Get timezone for a location
	 */
	async getTimeZone(
		location: TimeZoneLocation,
		timestamp?: Date,
	): Promise<TimeZoneResult | null> {
		if (!this.apiKey) {
			console.warn("Google Time Zone API key not configured");
			return null;
		}

		const cacheKey = this.generateCacheKey(
			location.latitude,
			location.longitude,
		);
		const cached = this.cache.get(cacheKey);

		// For cached results, recalculate local time but keep timezone info
		if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
			const now = timestamp || new Date();
			const localTime = new Date(
				now.getTime() + cached.data.totalOffsetSeconds * 1000,
			);
			return {
				...cached.data,
				localTime,
				localTimeString: localTime.toISOString().replace("Z", ""),
			};
		}

		try {
			const requestTimestamp = timestamp || new Date();
			const unixTimestamp = Math.floor(requestTimestamp.getTime() / 1000);

			const params = new URLSearchParams({
				location: `${location.latitude},${location.longitude}`,
				timestamp: String(unixTimestamp),
				key: this.apiKey,
			});

			const url = `https://maps.googleapis.com/maps/api/timezone/json?${params.toString()}`;
			const response = await fetch(url, {
				headers: { "User-Agent": USER_AGENT },
			});

			if (!response.ok) {
				console.error("Time Zone API error:", response.status);
				return null;
			}

			const data = await response.json();

			if (data.status !== "OK") {
				console.error("Time Zone API status:", data.status, data.errorMessage);
				return null;
			}

			const rawOffset = data.rawOffset || 0;
			const dstOffset = data.dstOffset || 0;
			const totalOffset = rawOffset + dstOffset;

			// Calculate local time
			const localTime = new Date(
				requestTimestamp.getTime() + totalOffset * 1000,
			);

			const result: TimeZoneResult = {
				timeZoneId: data.timeZoneId,
				timeZoneName: data.timeZoneName,
				rawOffsetSeconds: rawOffset,
				dstOffsetSeconds: dstOffset,
				totalOffsetSeconds: totalOffset,
				totalOffsetHours: totalOffset / 3600,
				utcOffsetString: this.formatUtcOffset(totalOffset),
				isDST: dstOffset !== 0,
				localTime,
				localTimeString: localTime.toISOString().replace("Z", ""),
			};

			// Cache the result
			this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

			return result;
		} catch (error) {
			console.error("Time Zone API error:", error);
			return null;
		}
	}

	/**
	 * Get timezone by address (requires geocoding first)
	 */
	async getTimeZoneByAddress(address: string): Promise<TimeZoneResult | null> {
		// This would need to geocode the address first
		// For now, return null - can be implemented with Places/Geocoding service
		console.warn("getTimeZoneByAddress requires geocoding integration");
		return null;
	}

	/**
	 * Convert a time from one timezone to another
	 */
	async convertTime(
		sourceTime: Date,
		sourceLocation: TimeZoneLocation,
		targetLocation: TimeZoneLocation,
	): Promise<{
		sourceTime: Date;
		targetTime: Date;
		sourceTz: TimeZoneResult;
		targetTz: TimeZoneResult;
	} | null> {
		const sourceTz = await this.getTimeZone(sourceLocation, sourceTime);
		const targetTz = await this.getTimeZone(targetLocation, sourceTime);

		if (!sourceTz || !targetTz) {
			return null;
		}

		// Calculate the offset difference
		const offsetDiff =
			targetTz.totalOffsetSeconds - sourceTz.totalOffsetSeconds;

		// Convert source time to target timezone
		const targetTime = new Date(sourceTime.getTime() + offsetDiff * 1000);

		return {
			sourceTime,
			targetTime,
			sourceTz,
			targetTz,
		};
	}

	/**
	 * Check if a business is currently open based on location and hours
	 */
	async checkBusinessHours(
		location: TimeZoneLocation,
		openTime: string, // "HH:mm" format (e.g., "08:00")
		closeTime: string, // "HH:mm" format (e.g., "17:00")
	): Promise<BusinessHours | null> {
		const tz = await this.getTimeZone(location);
		if (!tz) return null;

		const localTime = tz.localTime;
		const localTimeString = localTime.toTimeString().slice(0, 5); // "HH:mm"

		// Parse times
		const [openHour, openMin] = openTime.split(":").map(Number);
		const [closeHour, closeMin] = closeTime.split(":").map(Number);
		const [currentHour, currentMin] = localTimeString.split(":").map(Number);

		const openMinutes = openHour * 60 + openMin;
		const closeMinutes = closeHour * 60 + closeMin;
		const currentMinutes = currentHour * 60 + currentMin;

		const isOpen =
			currentMinutes >= openMinutes && currentMinutes < closeMinutes;

		let opensIn: string | undefined;
		let closesIn: string | undefined;

		if (isOpen) {
			const minutesUntilClose = closeMinutes - currentMinutes;
			closesIn = this.formatDuration(minutesUntilClose);
		} else if (currentMinutes < openMinutes) {
			const minutesUntilOpen = openMinutes - currentMinutes;
			opensIn = this.formatDuration(minutesUntilOpen);
		} else {
			// After closing - opens tomorrow
			const minutesUntilOpen = 24 * 60 - currentMinutes + openMinutes;
			opensIn = this.formatDuration(minutesUntilOpen);
		}

		return {
			timeZoneId: tz.timeZoneId,
			openTime,
			closeTime,
			isCurrentlyOpen: isOpen,
			opensIn,
			closesIn,
			localTime: localTimeString,
		};
	}

	/**
	 * Format duration in minutes to human readable string
	 */
	private formatDuration(minutes: number): string {
		if (minutes < 60) {
			return `${minutes} min`;
		}
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (mins === 0) {
			return `${hours}h`;
		}
		return `${hours}h ${mins}m`;
	}

	/**
	 * Get current time at multiple locations
	 */
	async getTimeAtLocations(
		locations: Array<{ id: string; location: TimeZoneLocation }>,
	): Promise<Array<{ id: string; timezone: TimeZoneResult | null }>> {
		const results = await Promise.all(
			locations.map(async ({ id, location }) => ({
				id,
				timezone: await this.getTimeZone(location),
			})),
		);
		return results;
	}

	/**
	 * Calculate arrival time in destination timezone
	 */
	async calculateArrivalTime(
		departureTime: Date,
		departureLocation: TimeZoneLocation,
		arrivalLocation: TimeZoneLocation,
		travelDurationMinutes: number,
	): Promise<{
		departureLocal: Date;
		arrivalLocal: Date;
		departureTz: string;
		arrivalTz: string;
	} | null> {
		const departureTz = await this.getTimeZone(
			departureLocation,
			departureTime,
		);

		// Calculate arrival time in UTC
		const arrivalTimeUtc = new Date(
			departureTime.getTime() + travelDurationMinutes * 60 * 1000,
		);

		const arrivalTz = await this.getTimeZone(arrivalLocation, arrivalTimeUtc);

		if (!departureTz || !arrivalTz) {
			return null;
		}

		return {
			departureLocal: departureTz.localTime,
			arrivalLocal: arrivalTz.localTime,
			departureTz: departureTz.timeZoneId,
			arrivalTz: arrivalTz.timeZoneId,
		};
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

export const googleTimeZoneService = new GoogleTimeZoneService();
