export interface BaseEvent {
	timestamp: number;
	data: Record<string, any>;
}

export interface EventData extends BaseEvent {
	type: string;
	id?: number;
	url?: string;
	eventName?: string;
}

export interface BehaviorData {
	type: "click" | "scroll" | "hover" | "navigation" | "form" | "custom";
	timestamp: number;
	data: Record<string, any>;
}

export interface TrackingEvent extends EventData {
	sessionId?: string;
	userId?: string;
}

export interface UserProfile {
	userId: string;
	lastSeen: number;
	preferences: Record<string, any>;
	behaviors: Record<string, any>;
}

export interface UserSession {
	id: string;
	userId: string;
	startTime: number;
	lastActive: number;
	endTime?: number;
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

export interface AnalyticsConfig {
	appId: string;
	version: string;
	debug?: boolean;
}

export interface AnalyticsDBSchema {
	events: {
		key: number;
		value: EventData;
		indexes: ["timestamp"];
	};
	profiles: {
		key: string;
		value: UserProfile;
		indexes: ["lastSeen"];
	};
}

export interface EnhancedBehaviorData {
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
	interactions: {
		clicks: TrackingEvent[];
		forms: TrackingEvent[];
		navigation: TrackingEvent[];
	};
}

export interface SessionData {
	behaviorData: BehaviorData[];
	session: UserSession;
}
