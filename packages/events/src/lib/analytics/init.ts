import { storage } from "./services/storage";
import { logger } from "./utils/logger";

let initPromise: Promise<any> | null = null;

export async function initAnalytics() {
	if (initPromise) return initPromise;

	initPromise = (async () => {
		try {
			await storage.init();
			logger.info("Analytics initialized successfully");
			return { isInitialized: true, timestamp: new Date().toISOString() };
		} catch (error) {
			logger.error("Failed to initialize analytics", error);
			return {
				isInitialized: false,
				error,
				timestamp: new Date().toISOString(),
			};
		}
	})();

	return initPromise;
}

if (typeof window !== "undefined") {
	const scheduleInit = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
	scheduleInit(() => {
		initAnalytics().catch((error) => logger.error("Failed to initialize analytics", error));
	});
}
