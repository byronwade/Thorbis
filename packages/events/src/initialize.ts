import { StorageManager } from "./storage/StorageManager";
import { LocalStorageAdapter } from "./storage/LocalStorageAdapter";
import type { ThorbisEventOptions } from "./types";
import { createTracker } from "./trackers";

interface ThorbisInstance {
	trackers: Map<string, any>;
	storage: StorageManager | null;
	destroy: () => Promise<void>;
	getEvents: () => any[];
}

export function initializeTrackers(options: ThorbisEventOptions = {}): ThorbisInstance {
	if (typeof window === "undefined") {
		return {
			trackers: new Map(),
			storage: null,
			destroy: async () => {},
			getEvents: () => [],
		};
	}

	if (window.__THORBIS_INITIALIZED__ && window.__THORBIS_INSTANCE__) {
		return window.__THORBIS_INSTANCE__;
	}

	const trackers = new Map();
	const storageManager = new StorageManager(options.storageAdapter || new LocalStorageAdapter());

	// Initialize all trackers
	const trackerTypes = ["click", "error", "form", "hover", "idle", "interaction", "navigation", "performance_metrics", "session", "user", "search"];

	if (options.debug) {
		console.log("[Thorbis] Initializing trackers...");
	}

	trackerTypes.forEach((type) => {
		try {
			const tracker = createTracker(type, {
				...options,
				onEvent: async (events) => {
					await storageManager.addEvents(events);
					options.onEvent?.(events);
				},
			});

			tracker.initialize();
			trackers.set(type, tracker);
		} catch (error) {
			console.error(`[Thorbis] Failed to initialize ${type} tracker:`, error);
		}
	});

	const instance = {
		trackers,
		storage: storageManager,
		destroy: async () => {
			trackers.forEach((tracker) => tracker.destroy());
			await storageManager.destroy();
			trackers.clear();
			delete window.__THORBIS_INITIALIZED__;
			delete window.__THORBIS_INSTANCE__;
		},
		getEvents: () => {
			const allEvents: any[] = [];
			trackers.forEach((tracker) => {
				allEvents.push(...tracker.getEvents());
			});
			return allEvents;
		},
	};

	window.__THORBIS_INITIALIZED__ = true;
	window.__THORBIS_INSTANCE__ = instance;

	return instance;
}

declare global {
	interface Window {
		__THORBIS_INITIALIZED__?: boolean;
		__THORBIS_INSTANCE__?: ThorbisInstance;
	}
}
