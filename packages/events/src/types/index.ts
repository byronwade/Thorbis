export interface ThorbisEventOptions {
	debug?: boolean;
	onEvent?: (eventName: string, data: Record<string, any>) => void;
}

export interface TrackerOptions {
	phase?: "critical" | "high" | "medium" | "low";
}

export interface EventData {
	type: string;
	timestamp: number;
	data: Record<string, any>;
}

export interface UserProfile {
	id: string;
	preferences: Record<string, any>;
	behaviors: Record<string, any>;
}

export * from "../lib/analytics/types";
