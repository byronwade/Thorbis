import { initAnalytics } from "./lib/analytics/init";
import { logger } from "./lib/analytics/utils/logger";

if (typeof window !== "undefined") {
	try {
		console.group("🚀 Analytics Initialization");
		console.log("Starting initialization...");

		const init = async () => {
			const result = await initAnalytics();
			console.log("Initialization result:", result);
			console.groupEnd();
			return result;
		};

		// Use requestIdleCallback for better performance
		if (window.requestIdleCallback) {
			window.requestIdleCallback(() => init());
		} else {
			setTimeout(() => init(), 1);
		}
	} catch (error) {
		console.error("❌ Analytics initialization failed:", error);
		logger.error("Analytics initialization failed", error);
	}
}
