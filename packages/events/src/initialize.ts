import { createTracker } from "./trackers";
import type { ThorbisEventOptions, ThorbisInstance } from "./types";

export function initializeTrackers(options: ThorbisEventOptions): ThorbisInstance {
	const trackers = new Map();

	// Prioritize certain trackers that should start immediately
	const priorityTrackers = [
		"mouse", // Track mouse movement immediately
		"hover", // Track hovers immediately
		"click", // Track clicks immediately
		"idle", // Start idle tracking immediately
		"session", // Start session tracking immediately
	];

	// Initialize priority trackers first
	priorityTrackers.forEach((type) => {
		const tracker = createTracker(type, options);
		tracker.initialize();
		trackers.set(type, tracker);
	});

	// Initialize remaining trackers
	["error", "form", "interaction", "navigation", "performance_metrics", "user", "search"].forEach((type) => {
		const tracker = createTracker(type, options);
		// Use requestIdleCallback for non-priority trackers if available
		if (window.requestIdleCallback) {
			window.requestIdleCallback(() => {
				tracker.initialize();
			});
		} else {
			// Fallback to setTimeout
			setTimeout(() => tracker.initialize(), 0);
		}
		trackers.set(type, tracker);
	});

	return {
		trackers,
		destroy: () => {
			trackers.forEach((tracker) => tracker.destroy());
			trackers.clear();
		},
	};
}

declare global {
	interface Window {
		__THORBIS_INITIALIZED__?: boolean;
		__THORBIS_INSTANCE__?: ThorbisInstance;
	}
}
