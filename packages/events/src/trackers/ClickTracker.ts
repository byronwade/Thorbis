import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class ClickTracker extends BaseTracker {
	private clickHistory: { timestamp: number; position: { x: number; y: number } }[] = [];
	private readonly RAGE_CLICK_THRESHOLD = 3;
	private readonly RAGE_CLICK_INTERVAL = 1000;
	private lastClickTimestamp = 0;
	private readonly DEBOUNCE_THRESHOLD = 50; // ms

	constructor(options: ThorbisEventOptions) {
		super(options);
	}

	initialize(): void {
		this.setupClickTracking();
	}

	private setupClickTracking(): void {
		document.addEventListener(
			"click",
			(e: MouseEvent) => {
				// Prevent duplicate events
				const now = Date.now();
				if (now - this.lastClickTimestamp < this.DEBOUNCE_THRESHOLD) {
					return;
				}
				this.lastClickTimestamp = now;

				const target = e.target as HTMLElement;

				// Track regular click
				this.trackEvent("click", {
					element: this.getElementData(target),
					position: { x: e.clientX, y: e.clientY },
					timestamp: now,
				});

				// Track rage clicks
				this.clickHistory.push({
					timestamp: now,
					position: { x: e.clientX, y: e.clientY },
				});

				this.checkForRageClicks();
			},
			{ capture: true }
		); // Use capture phase to prevent bubbling
	}

	private checkForRageClicks(): void {
		const now = Date.now();
		this.clickHistory = this.clickHistory.filter((click) => now - click.timestamp < this.RAGE_CLICK_INTERVAL);

		if (this.clickHistory.length >= this.RAGE_CLICK_THRESHOLD) {
			this.trackEvent("rage_click", {
				clicks: this.clickHistory.length,
				timespan: now - this.clickHistory[0].timestamp,
				positions: this.clickHistory.map((click) => click.position),
			});
		}
	}

	destroy(): void {
		document.removeEventListener("click", this.setupClickTracking);
		this.clickHistory = [];
	}
}
