import type { TrackingEvent } from "./events";

export interface UserProfile {
	userId: string;
	lastSeen: number;
	preferences: Record<string, any>;
	behaviors: Record<string, any>;
}

export interface UserSession {
	id: string;
	startTime: number;
	lastActive: number;
	interactions: {
		clicks: TrackingEvent[];
		forms: TrackingEvent[];
		navigation: TrackingEvent[];
	};
	metrics: {
		engagement: {
			timeOnPage: number;
			scrollDepth: number;
			interactions: number;
		};
		performance: {
			loadTime: number;
			errors: number;
		};
	};
}
