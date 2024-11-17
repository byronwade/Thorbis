import Analytics from "analytics";
import { logger } from "./utils/logger";
import { storage } from "./services/storage";
import { getDB } from "./core/db";
import { enhancedInitBehaviorTracking } from "./services/trackers";
import { initAnalytics } from "./init";
import type { BaseEvent, BehaviorData, UserSession, EventData, UserProfile, AnalyticsConfig, TrackingEvent, EnhancedBehaviorData, AnalyticsDBSchema, SessionData } from "./types";

// Export all types
export type { BaseEvent, BehaviorData, UserSession, EventData, UserProfile, AnalyticsConfig, TrackingEvent, EnhancedBehaviorData, AnalyticsDBSchema, SessionData };

// Export services and utilities
export { storage };
export { enhancedInitBehaviorTracking };
export { initAnalytics };
export { logger };
export { getDB };
export { dataService } from "./services/data";

// Analytics instance
export const analytics = Analytics({
	app: "thorbis",
	version: "1.0.0",
	plugins: [],
});

// Event tracking
export const trackEvent = async (eventName: string, data: Record<string, any> = {}): Promise<EventData> => {
	logger.info(`Tracking event: ${eventName}`, data);
	await analytics.track(eventName, data);
	return {
		type: eventName,
		timestamp: Date.now(),
		data,
	};
};

// Debug utilities
export const getEvents = async () => {
	const db = await getDB();
	return db ? db.getAll("events") : [];
};

export const debugEvents = async () => {
	try {
		logger.info("Starting debug event retrieval");
		const db = await getDB();
		if (!db) {
			logger.warn("No database connection available for debug");
			return null;
		}

		const events = await getEvents();
		const debugData = {
			total: events.length,
			events: events.slice(-10),
			timestamp: new Date().toISOString(),
		};

		logger.info("Debug events retrieved", debugData);
		return debugData;
	} catch (error) {
		logger.error("Failed to retrieve debug events", error);
		return null;
	}
};
