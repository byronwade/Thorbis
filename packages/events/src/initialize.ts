import type { ThorbisEventOptions } from "./types";
import { createTracker } from "./trackers";

export function initializeTrackers(options: ThorbisEventOptions = {}) {
	const trackers = new Map();

	// Initialize all trackers
	const trackerTypes = ["click", "error", "form", "idle", "interaction", "navigation", "network", "performance", "session", "user"];

	trackerTypes.forEach((type) => {
		const tracker = createTracker(type, options);
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
