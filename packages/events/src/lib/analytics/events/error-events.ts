import { analytics } from "../core";
import { logger } from "../utils/logger";

export async function trackError(error: Error) {
	try {
		await analytics.track("error", {
			message: error.message,
			stack: error.stack,
			timestamp: Date.now(),
		});
	} catch (err) {
		logger.error("Failed to track error", err);
	}
}
