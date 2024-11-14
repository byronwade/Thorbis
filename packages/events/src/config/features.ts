export interface ExperimentalFeatures {
	profileAnalytics?: boolean;
	performanceMetrics?: boolean;
	behaviorTracking?: boolean;
	interestMapping?: boolean;
	sessionReplay?: boolean;
	heatmaps?: boolean;
	aiSuggestions?: boolean;
}

export interface ThorbisConfig {
	experimental?: ExperimentalFeatures;
}

export const DEFAULT_CONFIG: ThorbisConfig = {
	experimental: {
		profileAnalytics: false,
		performanceMetrics: true,
		behaviorTracking: true,
		interestMapping: false,
		sessionReplay: false,
		heatmaps: false,
		aiSuggestions: false,
	},
};
