import { analytics } from "../core";
import { logger } from "../utils/logger";
import type { EventData } from "../types/events";

export const eventTracker = {
	track: async (eventName: string, data: Record<string, any> = {}): Promise<EventData | null> => {
		try {
			await analytics.track(eventName, data);
			logger.info(`Event tracked: ${eventName}`, data);
			return {
				type: eventName,
				timestamp: Date.now(),
				data,
			};
		} catch (error) {
			logger.error(`Failed to track event: ${eventName}`, error);
			return null;
		}
	},
};
