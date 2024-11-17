import { storage } from "./services/storage";
import { logger } from "./utils/logger";
import type { BehaviorData, UserSession } from "./types";

/**
 * Service for handling analytics data operations
 */
export class DataService {
	/**
	 * Store behavior data
	 */
	async storeBehaviorData(data: Partial<BehaviorData>) {
		try {
			const behaviorData: BehaviorData = {
				type: "custom",
				timestamp: Date.now(),
				data: data.data || {},
				...data,
			};

			await storage.storeBehaviorData(behaviorData);
			logger.info("Stored behavior data", behaviorData);
		} catch (error) {
			logger.error("Failed to store behavior data", error);
			throw error;
		}
	}

	/**
	 * Get current session data
	 */
	async getCurrentSession(): Promise<UserSession | null> {
		try {
			return await storage.getCurrentSession();
		} catch (error) {
			logger.error("Failed to get current session", error);
			return null;
		}
	}

	/**
	 * Get behavior data for current session
	 */
	async getSessionBehaviorData(): Promise<BehaviorData[]> {
		try {
			return await storage.getSessionBehaviorData();
		} catch (error) {
			logger.error("Failed to get session behavior data", error);
			return [];
		}
	}
}

export const dataService = new DataService();
