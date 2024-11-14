import { BaseTracker } from "./BaseTracker";

export class IdleTracker extends BaseTracker {
	private idleThreshold = 1000;
	private lastActivity = Date.now();
	private idleCheckInterval: NodeJS.Timeout | null = null;

	initialize() {
		this.setupIdleTracking();
	}

	private handleActivity = () => {
		const now = Date.now();
		const idleTime = now - this.lastActivity;

		if (idleTime > this.idleThreshold) {
			this.trackEvent("idle_end", {
				duration: idleTime,
				previousActivity: this.lastActivity,
			});
		}

		this.lastActivity = now;
	};

	private setupIdleTracking() {
		const events = ["mousemove", "keypress", "scroll", "click", "touchstart"];

		events.forEach((event) => {
			document.addEventListener(event, this.handleActivity, { passive: true });
		});

		// Check for idle periods
		this.idleCheckInterval = setInterval(() => {
			const idleTime = Date.now() - this.lastActivity;
			if (idleTime > this.idleThreshold) {
				this.trackEvent("idle", {
					duration: idleTime,
					lastActivity: this.lastActivity,
				});
			}
		}, 5000);
	}

	destroy(): void {
		if (this.idleCheckInterval) {
			clearInterval(this.idleCheckInterval);
		}
		["mousemove", "keypress", "scroll", "click", "touchstart"].forEach((event) => {
			document.removeEventListener(event, this.handleActivity);
		});
	}
}
