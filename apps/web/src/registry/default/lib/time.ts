/**
 * Time formatting utilities for media players
 */

/**
 * Format a duration in seconds to a timestamp string
 * @param seconds - Duration in seconds
 * @param showHours - Whether to show hours (HH:MM:SS vs MM:SS)
 * @returns Formatted timestamp string
 */
export function formatTimestamp(seconds: number, showHours = false): string {
	if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
		return showHours ? "00:00:00" : "00:00";
	}

	const totalSeconds = Math.floor(seconds);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const secs = totalSeconds % 60;

	if (showHours || hours > 0) {
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}

	return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Convert a duration to an ISO 8601 duration string for datetime attribute
 * @param seconds - Duration in seconds
 * @param seekRange - Optional seek range from player
 * @returns ISO 8601 duration string (e.g., "PT1H30M45S")
 */
export function durationDateTime(
	seconds: number,
	seekRange?: { start: number; end: number } | null,
): string {
	if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
		return "PT0S";
	}

	// If seekRange is provided, use it to calculate the actual duration
	let duration = seconds;
	if (seekRange) {
		duration = seekRange.end - seekRange.start;
	}

	const totalSeconds = Math.floor(duration);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const secs = totalSeconds % 60;

	let durationString = "PT";

	if (hours > 0) {
		durationString += `${hours}H`;
	}
	if (minutes > 0) {
		durationString += `${minutes}M`;
	}
	if (secs > 0 || durationString === "PT") {
		durationString += `${secs}S`;
	}

	return durationString;
}



