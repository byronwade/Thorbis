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

export interface TrackingEvent {
	id?: number;
	type: string;
	timestamp: number;
	data: Record<string, any>;
	url?: string;
}
