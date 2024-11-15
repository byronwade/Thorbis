import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class IdleTracker extends BaseTracker {
	private readonly IDLE_THRESHOLD = 30000; // 30 seconds
	private idleTimeout: number | null = null;
	private lastActivity: number = Date.now();
	private isIdle: boolean = false;
	private idleStartTime: number | null = null;
	private debugLogElement: HTMLElement | null = null;

	initialize(): void {
		this.setupIdleTracking();
		if (this.options.debug) {
			this.createDebugLogElement();
		}
	}

	private createDebugLogElement() {
		if (typeof document === "undefined") return;

		this.debugLogElement = document.createElement("div");
		this.debugLogElement.id = "thorbis-idle-log";
		this.debugLogElement.style.display = "none";
		document.body.appendChild(this.debugLogElement);
	}

	private setupIdleTracking(): void {
		const events = ["mousemove", "keypress", "scroll", "click", "touchstart"];
		events.forEach((event) => {
			document.addEventListener(event, this.handleActivity);
		});

		this.checkIdle();
	}

	private handleActivity = (): void => {
		const now = Date.now();
		if (this.isIdle) {
			const idleTime = now - (this.idleStartTime || now);
			this.trackEvent("idle_end", {
				duration: {
					raw: idleTime,
					formatted: this.formatDuration(idleTime),
				},
				metadata: {
					eventTime: this.formatTimestamp(now),
					startTime: this.formatTimestamp(this.idleStartTime || now),
					endTime: this.formatTimestamp(now),
				},
			});
			this.isIdle = false;
			this.idleStartTime = null;
		}
		this.lastActivity = now;
	};

	private checkIdle = (): void => {
		const now = Date.now();
		const idleTime = now - this.lastActivity;

		if (idleTime >= this.IDLE_THRESHOLD) {
			if (!this.isIdle) {
				this.isIdle = true;
				this.idleStartTime = this.lastActivity;
			}

			if (this.options.debug) {
				// Update existing log instead of creating new one
				const idleEvent = {
					type: "idle",
					duration: this.formatDuration(idleTime),
					startTime: this.formatTimestamp(this.idleStartTime || now),
					currentTime: this.formatTimestamp(now),
				};

				if (this.debugLogElement) {
					// Update or create the log entry
					if (!this.debugLogElement.textContent) {
						console.log("[Thorbis] Idle started:", idleEvent);
					}
					this.debugLogElement.textContent = JSON.stringify(idleEvent, null, 2);
				}
			}

			// Only track the event once when idle starts
			if (this.idleStartTime === this.lastActivity) {
				this.trackEvent("idle", {
					duration: {
						raw: idleTime,
						formatted: this.formatDuration(idleTime),
					},
					metadata: {
						eventTime: this.formatTimestamp(now),
						startTime: this.formatTimestamp(this.idleStartTime),
						endTime: this.formatTimestamp(now),
					},
				});
			}
		}
		this.idleTimeout = window.setTimeout(this.checkIdle, 1000);
	};

	destroy(): void {
		if (this.idleTimeout) {
			window.clearTimeout(this.idleTimeout);
		}
		const events = ["mousemove", "keypress", "scroll", "click", "touchstart"];
		events.forEach((event) => {
			document.removeEventListener(event, this.handleActivity);
		});
		if (this.debugLogElement) {
			this.debugLogElement.remove();
		}
	}
}
