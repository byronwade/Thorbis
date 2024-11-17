import { analytics } from "../core";
import { logger } from "../utils/logger";

export async function trackUserIdentify(userId: string, traits: Record<string, any> = {}) {
	try {
		await analytics.identify(userId, traits);
		logger.info("User identified", { userId, traits });
	} catch (error) {
		logger.error("Failed to identify user", error);
	}
}
