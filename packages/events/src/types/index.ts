export interface ThorbisEventOptions {
	debug?: boolean;
	sampleRate?: number;
	excludeElements?: string[];
	onEvent?: (events: any[]) => void;
	batchSize?: number;
	batchInterval?: number;
	userId?: string;
}

export const DEFAULT_EVENT_OPTIONS: ThorbisEventOptions = {
	debug: false,
	sampleRate: 1,
	excludeElements: [],
	onEvent: () => {},
	batchSize: 50,
	batchInterval: 2000,
};

export interface TrackerInstance {
	initialize: () => void;
	destroy: () => void;
	getEvents: () => any[];
}

export interface TrackersManager {
	trackers: Map<string, TrackerInstance>;
	destroy: () => void;
	getEvents: () => any[];
}

// Add other type exports here
