import { storage } from "./storage";
import { logger } from "../utils/logger";
import type { EnhancedBehaviorData, UserSession } from "../types";

function calculateEngagement(interactions: Partial<UserSession["interactions"]>) {
	return {
		timeOnPage: interactions?.clicks?.length ? interactions.clicks.length * 1000 : 0,
		scrollDepth: 0,
		interactions: (interactions?.clicks?.length || 0) + (interactions?.forms?.length || 0) + (interactions?.navigation?.length || 0),
	};
}

function calculatePerformance(metrics: Partial<UserSession["metrics"]>) {
	return {
		loadTime: metrics?.performance?.loadTime || 0,
		errors: metrics?.performance?.errors || 0,
	};
}

export async function getSessionBehaviorData(): Promise<EnhancedBehaviorData> {
	const data = await storage.getCurrentSession();
	logger.debug("Getting session behavior data", data);

	const defaultInteractions = {
		clicks: [],
		forms: [],
		navigation: [],
	};

	const defaultMetrics = {
		engagement: {
			timeOnPage: 0,
			scrollDepth: 0,
			interactions: 0,
		},
		performance: {
			loadTime: 0,
			errors: 0,
		},
	};

	return {
		metrics: {
			engagement: calculateEngagement(data?.interactions || defaultInteractions),
			performance: calculatePerformance(data?.metrics || defaultMetrics),
		},
		interactions: {
			clicks: data?.interactions?.clicks || [],
			forms: data?.interactions?.forms || [],
			navigation: data?.interactions?.navigation || [],
		},
	};
}
