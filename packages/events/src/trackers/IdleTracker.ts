import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class IdleTracker extends BaseTracker {
	private readonly IDLE_THRESHOLD = 30000; // 30 seconds
	private idleTimeout: NodeJS.Timeout | null = null;
	private lastActivity: number = Date.now();

	initialize(): void {
		this.setupIdleTracking();
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
		const idleTime = now - this.lastActivity;

		if (idleTime > this.IDLE_THRESHOLD) {
			this.trackEvent("idle_end", {
				duration: {
					raw: idleTime,
					formatted: this.formatDuration(idleTime),
				},
			});
		}

		this.lastActivity = now;
	};

	private checkIdle = (): void => {
		const idleTime = Date.now() - this.lastActivity;
		if (idleTime >= this.IDLE_THRESHOLD) {
			this.trackEvent("idle", {
				duration: {
					raw: idleTime,
					formatted: this.formatDuration(idleTime),
				},
			});
		}
		this.idleTimeout = setTimeout(this.checkIdle, 1000);
	};

	destroy(): void {
		if (this.idleTimeout) {
			clearTimeout(this.idleTimeout);
		}
		const events = ["mousemove", "keypress", "scroll", "click", "touchstart"];
		events.forEach((event) => {
			document.removeEventListener(event, this.handleActivity);
		});
	}
}
