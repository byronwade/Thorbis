import type { ThorbisEventOptions } from "./types";
import { DEFAULT_EVENT_OPTIONS } from "./types";
import { createTracker } from "./trackers";

/**
 * Initialize all trackers and return the tracker instances
 * @param options Configuration options for the trackers
 * @returns Object containing all initialized trackers
 */
export function initializeTrackers(options: Partial<ThorbisEventOptions> = {}) {
	const mergedOptions = { ...DEFAULT_EVENT_OPTIONS, ...options };
	const trackers = new Map();

	// Initialize all trackers
	const trackerTypes = ["click", "error", "form", "idle", "interaction", "navigation", "network", "performance", "session", "user"];

	trackerTypes.forEach((type) => {
		const tracker = createTracker(type, mergedOptions);
		tracker.initialize();
		trackers.set(type, tracker);
	});

	return {
		trackers,
		destroy: () => {
			trackers.forEach((tracker) => tracker.destroy());
			trackers.clear();
		},
		getEvents: () => {
			const allEvents: any[] = [];
			trackers.forEach((tracker) => {
				allEvents.push(...tracker.getEvents());
			});
			return allEvents;
		},
	};
}

// Export types and constants
export type { ThorbisEventOptions };
export { DEFAULT_EVENT_OPTIONS };

// Export all trackers for direct access if needed
export * from "./trackers";
