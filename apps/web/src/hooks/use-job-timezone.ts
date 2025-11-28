"use client";

import { useMemo, useState, useEffect } from "react";
import type { Job } from "@/components/schedule/schedule-types";

interface TimeZoneInfo {
	timeZoneId: string;
	localTime: string;
	utcOffsetString: string;
}

interface UseJobTimezoneResult {
	userTimezone: string | null;
	jobTimezone: TimeZoneInfo | null;
	isDifferent: boolean;
	isLoading: boolean;
	formatJobTime: (date: Date) => string;
}

/**
 * Hook to get timezone information for a job location
 * and compare it with the user's timezone.
 * Only fetches job timezone if coordinates are available.
 */
export function useJobTimezone(
	job: Job | null,
): UseJobTimezoneResult {
	const [userTimezone, setUserTimezone] = useState<string | null>(null);
	const [jobTimezone, setJobTimezone] = useState<TimeZoneInfo | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch user timezone on mount
	useEffect(() => {
		async function fetchUserTimezone() {
			try {
				const response = await fetch("/api/user/preferences");
				if (response.ok) {
					const data = await response.json();
					setUserTimezone(data.timezone || "America/New_York");
				} else {
					// Fallback to browser timezone or default
					setUserTimezone(
						Intl.DateTimeFormat().resolvedOptions().timeZone ||
							"America/New_York",
					);
				}
			} catch (error) {
				console.error("Failed to fetch user timezone:", error);
				setUserTimezone(
					Intl.DateTimeFormat().resolvedOptions().timeZone ||
						"America/New_York",
				);
			}
		}

		fetchUserTimezone();
	}, []);

	// Fetch job location timezone when job coordinates are available
	useEffect(() => {
		async function fetchJobTimezone() {
			if (!job?.location?.coordinates) {
				setJobTimezone(null);
				return;
			}

			const { lat, lng } = job.location.coordinates;

			if (!lat || !lng) {
				setJobTimezone(null);
				return;
			}

			setIsLoading(true);
			try {
				const response = await fetch(
					`/api/timezone?lat=${lat}&lng=${lng}&timestamp=${new Date().toISOString()}`,
				);

				if (response.ok) {
					const data = await response.json();
					if (data.success && data.data) {
						setJobTimezone({
							timeZoneId: data.data.timeZoneId,
							localTime: data.data.localTime,
							utcOffsetString: data.data.utcOffsetString,
						});
					} else {
						setJobTimezone(null);
					}
				} else {
					setJobTimezone(null);
				}
			} catch (error) {
				console.error("Failed to fetch job timezone:", error);
				setJobTimezone(null);
			} finally {
				setIsLoading(false);
			}
		}

		fetchJobTimezone();
	}, [job?.location?.coordinates?.lat, job?.location?.coordinates?.lng]);

	// Check if timezones are different
	const isDifferent = useMemo(() => {
		if (!userTimezone || !jobTimezone) {
			return false;
		}
		// Compare timezone IDs (e.g., "America/New_York" vs "America/Los_Angeles")
		return userTimezone !== jobTimezone.timeZoneId;
	}, [userTimezone, jobTimezone]);

	// Format time in job's timezone
	const formatJobTime = (date: Date): string => {
		if (!jobTimezone || !isDifferent) {
			return "";
		}

		try {
			return new Intl.DateTimeFormat("en-US", {
				timeZone: jobTimezone.timeZoneId,
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			}).format(date);
		} catch (error) {
			console.error("Failed to format job time:", error);
			return "";
		}
	};

	return {
		userTimezone,
		jobTimezone,
		isDifferent,
		isLoading,
		formatJobTime,
	};
}

