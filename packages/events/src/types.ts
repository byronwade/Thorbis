import type { StorageAdapter } from "./storage/StorageManager";

export interface ElementData {
	tag: string;
	id?: string;
	className?: string;
	text?: string;
	href?: string;
	dimensions?: {
		width: number;
		height: number;
		x: number;
		y: number;
	};
	attributes?: Record<string, string>;
}

export interface SessionData {
	sessionId: string;
	userId: string;
	startTime: number;
	lastActive: number;
	events: EventData[];
	currentPath: string;
	referrer: string;
	device: {
		userAgent: string;
		viewport: {
			width: number;
			height: number;
		};
	};
}

export interface UserData {
	[userId: string]: {
		profile: {
			firstSeen: number;
			lastSeen: number;
			totalSessions: number;
			currentSessionId: string;
		};
		stats: {
			clicks: {
				total: number;
				locations: Array<{ x: number; y: number; timestamp: number }>;
				elements: Record<string, number>; // element type -> count
			};
			hovers: {
				total: number;
				averageDuration: number;
				elements: Record<
					string,
					{
						count: number;
						totalDuration: number;
						lastHover: number;
					}
				>;
			};
			scrolls: {
				total: number;
				maxDepth: number;
				averageDepth: number;
				patterns: Array<{
					direction: "up" | "down";
					distance: number;
					duration: number;
				}>;
			};
			idles: {
				total: number;
				durations: number[];
				averageDuration: number;
				lastIdle: number;
			};
			forms: {
				interactions: number;
				completions: number;
				abandonments: number;
				averageFillingTime: number;
			};
		};
		performance: {
			pageLoads: Array<{
				timestamp: number;
				duration: number;
				path: string;
			}>;
			resources: Array<{
				type: string;
				duration: number;
				size: number;
			}>;
			errors: Array<{
				timestamp: number;
				type: string;
				message: string;
			}>;
		};
		behavior: {
			paths: string[];
			interests: Record<string, number>;
			commonElements: Array<{
				selector: string;
				interactions: number;
			}>;
			timeOnPage: Record<string, number>;
		};
		live_events: EventData[]; // Recent events, limited to last N events
	};
}

export interface EventData {
	type: string;
	timestamp: number;
	sessionId: string;
	userId: string;
	url?: string;
	name?: string;
	score?: number;
	query?: string;
	position?: {
		x: number;
		y: number;
	};
	clicks?: number;
	timespan?: number;
	positions?: Array<{ x: number; y: number }>;
	timing?: {
		ttfb: { raw: number; formatted: string };
		domInteractive: { raw: number; formatted: string };

		domComplete: { raw: number; formatted: string };
		loadComplete: { raw: number; formatted: string };
	};
	element?: ElementData;
	duration?: {
		raw: number;
		formatted: string;
	};
	metadata?: {
		elementType?: string;
		elementContent?: string;
		formatted?: string;
		referrer?: string;
		path?: string;
		from?: string;
		to?: string;
		category?: string;
		interactable?: boolean;
		attributes?: Record<string, string>;
		summary?: {
			totalLoadTime: string;
			timeToInteractive: string;
			timeToFirstByte: string;
		};
	};
}

export interface ThorbisEventOptions {
	debug?: boolean;
	sampleRate?: number;
	excludeElements?: string[];
	onEvent?: (events: any[]) => void;
	batchSize?: number;
	batchInterval?: number;
	userId?: string;
	storageAdapter?: StorageAdapter;
}

export const DEFAULT_EVENT_OPTIONS: ThorbisEventOptions = {
	debug: false,
	sampleRate: 1,
	excludeElements: [],
	onEvent: () => {},
	batchSize: 50,
	batchInterval: 2000,
};

export interface UserProfile {
	userId: string;
	firstSeen: number;
	lastSeen: number;
	sessions: string[];
	interactions: {
		clicks: number;
		hovers: number;
		scrolls: number;
		formInteractions: number;
	};
	behavior: {
		avgTimeOnPage: number;
		avgScrollDepth: number;
		commonPaths: string[];
	};
	interests: Record<string, number>;
	profile: {
		lastSeen: number;
		firstSeen: number;
		totalTimeOnSite: number;
		patterns: {
			visitTimes: Record<string, number>;
			weekdayActivity: Record<string, number>;
			interactionPatterns: Array<{
				sequence: string[];
				count: number;
			}>;
		};
		behavior: {
			interests: Record<
				string,
				{
					weight: number;
					lastSeen: number;
					occurrences: number;
				}
			>;
		};
	};
	currentSession: {
		id: string;
		startTime: number;
		lastActive: number;
		interactions: EventData[];
		path: {
			current: string;
			previous: string[];
		};
	};
}
