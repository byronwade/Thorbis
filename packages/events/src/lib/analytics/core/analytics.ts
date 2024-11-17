import Analytics from "analytics";
import { logger } from "../utils/logger";
import type { EventData } from "../types";

interface AnalyticsInstance {
	track: (eventName: string, data: any) => Promise<void>;
	identify: (userId: string, traits: any) => Promise<void>;
	page: (data: any) => Promise<void>;
}

let analyticsInstance: AnalyticsInstance | null = null;

export const initializeAnalytics = () => {
	if (analyticsInstance) return analyticsInstance;

	logger.info("🚀 Initializing Analytics Core");

	analyticsInstance = Analytics({
		app: "thorbis",
		version: "1.0.0",
		plugins: [],
		debug: true,
	}) as AnalyticsInstance;

	// Add debug logging for all analytics events
	const originalTrack = analyticsInstance.track;
	analyticsInstance.track = async (eventName: string, data: any) => {
		logger.debug(`📊 Event Tracked: ${eventName}`, data);
		return originalTrack.call(analyticsInstance, eventName, data);
	};

	const originalIdentify = analyticsInstance.identify;
	analyticsInstance.identify = async (userId: string, traits: any) => {
		logger.debug(`👤 User Identified: ${userId}`, traits);
		return originalIdentify.call(analyticsInstance, userId, traits);
	};

	const originalPage = analyticsInstance.page;
	analyticsInstance.page = async (data: any) => {
		logger.debug(`📄 Page View`, data);
		return originalPage.call(analyticsInstance, data);
	};

	logger.info("✅ Analytics Core Initialized");
	return analyticsInstance;
};

export const analytics = {
	track: async (eventName: string, data: any) => {
		const instance = initializeAnalytics();
		try {
			await instance.track(eventName, data);
			return true;
		} catch (error) {
			logger.error(`Failed to track event: ${eventName}`, error);
			return false;
		}
	},
	identify: async (userId: string, traits: any) => {
		const instance = initializeAnalytics();
		try {
			await instance.identify(userId, traits);
			return true;
		} catch (error) {
			logger.error(`Failed to identify user: ${userId}`, error);
			return false;
		}
	},
	page: async (data: any) => {
		const instance = initializeAnalytics();
		try {
			await instance.page(data);
			return true;
		} catch (error) {
			logger.error(`Failed to track page view`, error);
			return false;
		}
	},
};

export const trackEvent = async (eventName: string, data: Record<string, any> = {}): Promise<EventData> => {
	logger.debug(`📊 Tracking Event: ${eventName}`, data);

	await analytics.track(eventName, {
		...data,
		url: window.location.href,
		timestamp: new Date().toISOString(),
	});

	return {
		type: eventName,
		timestamp: Date.now(),
		data,
	};
};

export const getEvents = async () => {
	logger.debug("📊 Retrieving events");
	// Implementation
};

export const debugEvents = async () => {
	logger.debug("🔍 Debug events requested");
	// Implementation
};

export const initAnalytics = async () => {
	logger.info("🚀 Initializing analytics");
	return initializeAnalytics();
};
