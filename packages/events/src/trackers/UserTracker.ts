import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions, UserData } from "../types";

export class UserTracker extends BaseTracker {
	private userId: string;
	private userData: UserData = {};
	private lastUpdate: number = Date.now();
	private updateInterval: number | null = null;
	private readonly UPDATE_INTERVAL_MS = 5000; // 5 seconds

	constructor(options: ThorbisEventOptions) {
		super(options);
		this.userId = this.generateUserId();
		this.startPeriodicUpdates();
	}

	initialize() {
		this.setupUserTracking();
	}

	private generateUserId(): string {
		if (typeof window === "undefined") {
			return `user_${Math.random().toString(36).substr(2, 9)}`;
		}

		const stored = localStorage.getItem("thorbis_user_id");
		if (stored) return stored;

		const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem("thorbis_user_id", newId);
		return newId;
	}

	getUserId(): string {
		return this.userId;
	}

	getUserData(): UserData {
		return this.userData;
	}

	private setupUserTracking() {
		// Initialize user data if it doesn't exist
		if (!this.userData[this.userId]) {
			this.userData[this.userId] = {
				profile: {
					firstSeen: Date.now(),
					lastSeen: Date.now(),
					totalSessions: 1,
					currentSessionId: "",
				},
				stats: {
					clicks: { total: 0, locations: [], elements: {} },
					hovers: { total: 0, averageDuration: 0, elements: {} },
					scrolls: { total: 0, maxDepth: 0, averageDepth: 0, patterns: [] },
					idles: { total: 0, durations: [], averageDuration: 0, lastIdle: Date.now() },
					forms: { interactions: 0, completions: 0, abandonments: 0, averageFillingTime: 0 },
				},
				performance: { pageLoads: [], resources: [], errors: [] },
				behavior: { paths: [], interests: {}, commonElements: [], timeOnPage: {} },
				live_events: [],
			};
		}
	}

	private startPeriodicUpdates() {
		this.updateInterval = window.setInterval(() => {
			const now = Date.now();
			if (this.userData[this.userId]) {
				this.userData[this.userId].profile.lastSeen = now;
				this.updateUserMetrics();
			}
		}, this.UPDATE_INTERVAL_MS);
	}

	private updateUserMetrics() {
		const userData = this.userData[this.userId];
		if (!userData) return;

		const sessionDuration = Date.now() - userData.profile.firstSeen;
		const now = Date.now();

		this.trackEvent("user_metrics_update", {
			type: "user_metrics_update",
			timestamp: now,
			userId: this.userId,
			metrics: {
				interactions: userData.stats,
				performance: userData.performance,
				behavior: userData.behavior,
			},
			duration: {
				raw: sessionDuration,
				formatted: this.formatDuration(sessionDuration),
			},
			metadata: {
				startTime: this.formatTimestamp(userData.profile.firstSeen),
				eventTime: this.formatTimestamp(now),
			},
		});
	}

	destroy(): void {
		if (this.updateInterval) {
			window.clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
	}
}
