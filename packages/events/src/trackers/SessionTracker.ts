import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions, SessionData } from "../types";

export class SessionTracker extends BaseTracker {
	private userId: string;
	private sessionId: string;
	private lastActivityTime: number = Date.now();
	private sessionTimeout: NodeJS.Timeout | null = null;

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
		this.trackEvent("session_start", {
			sessionId: this.sessionId,
			startTime: Date.now(),
			referrer: document.referrer,
			userAgent: navigator.userAgent,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
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
						// 30 seconds
						this.trackEvent("session_resume", {
							inactivityDuration: timeSinceLastActivity,
						});
					}

					this.lastActivityTime = now;
				},
				{ passive: true }
			);
		});
	}

	private setupSessionTimeout() {
		setInterval(() => {
			const inactiveTime = Date.now() - this.lastActivityTime;
			if (inactiveTime > 1800000) {
				// 30 minutes
				this.trackEvent("session_timeout", {
					duration: inactiveTime,
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
			clearInterval(this.sessionTimeout);
		}
		this.trackEvent("session_end", {
			sessionId: this.sessionId,
			duration: Date.now() - this.lastActivityTime,
		});
	}
}
