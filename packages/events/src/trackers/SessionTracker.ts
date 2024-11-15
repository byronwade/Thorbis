import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions, SessionData } from "../types";

export class SessionTracker extends BaseTracker {
	private userId: string;
	private sessionId: string;
	private lastActivityTime: number = Date.now();
	private sessionTimeout: number | null = null;

	constructor(options: ThorbisEventOptions) {
		super(options);
		this.userId = options.userId || "anonymous";
		this.sessionId = this.generateSessionId();
	}

	private generateSessionId(): string {
		return `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
	}

	initialize() {
		this.trackSessionStart();
		this.trackSessionActivity();
		this.setupSessionTimeout();
	}

	private trackSessionStart() {
		const now = Date.now();
		this.trackEvent("session_start", {
			sessionId: this.sessionId,
			startTime: now,
			referrer: document.referrer,
			userAgent: navigator.userAgent,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
			metadata: {
				eventTime: this.formatTimestamp(now),
				startTime: this.formatTimestamp(now),
			},
		});
	}

	private trackSessionActivity() {
		["click", "scroll", "mousemove", "keypress"].forEach((eventType) => {
			document.addEventListener(
				eventType,
				() => {
					const now = Date.now();
					const timeSinceLastActivity = now - this.lastActivityTime;

					if (timeSinceLastActivity > 30000) {
						this.trackEvent("session_resume", {
							inactivityDuration: timeSinceLastActivity,
							duration: {
								raw: timeSinceLastActivity,
								formatted: this.formatDuration(timeSinceLastActivity),
							},
							metadata: {
								eventTime: this.formatTimestamp(now),
								startTime: this.formatTimestamp(this.lastActivityTime),
							},
						});
					}

					this.lastActivityTime = now;
				},
				{ passive: true }
			);
		});
	}

	private setupSessionTimeout() {
		this.sessionTimeout = window.setInterval(() => {
			const inactiveTime = Date.now() - this.lastActivityTime;
			if (inactiveTime > 1800000) {
				// 30 minutes
				this.trackEvent("session_timeout", {
					duration: {
						raw: inactiveTime,
						formatted: this.formatDuration(inactiveTime),
					},
				});
				this.sessionId = this.generateSessionId(); // Start new session
				this.trackSessionStart();
			}
		}, 60000); // Check every minute
	}

	getSessionId(): string {
		return this.sessionId;
	}

	getSessionData(): SessionData {
		return {
			sessionId: this.sessionId,
			userId: this.userId,
			startTime: Date.now(),
			lastActive: this.lastActivityTime,
			events: [],
			currentPath: window.location.pathname,
			referrer: document.referrer,
			device: {
				userAgent: navigator.userAgent,
				viewport: {
					width: window.innerWidth,
					height: window.innerHeight,
				},
			},
		};
	}

	destroy(): void {
		if (this.sessionTimeout) {
			window.clearInterval(this.sessionTimeout);
			this.sessionTimeout = null;
		}
		this.trackEvent("session_end", {
			sessionId: this.sessionId,
			duration: {
				raw: Date.now() - this.lastActivityTime,
				formatted: this.formatDuration(Date.now() - this.lastActivityTime),
			},
		});
	}
}
