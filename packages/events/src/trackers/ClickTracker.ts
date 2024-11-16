import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";
import { throttle } from "../utils/performance";

export class ClickTracker extends BaseTracker {
	private clickHistory: Array<{
		timestamp: number;
		position: { x: number; y: number };
	}> = [];
	private readonly RAGE_CLICK_THRESHOLD = 3;
	private readonly RAGE_CLICK_INTERVAL = 1000;
	private readonly DEBOUNCE_THRESHOLD = 50; // ms
	private readonly MAX_HISTORY_SIZE = 50; // Limit history size
	private boundClickHandler: (e: MouseEvent) => void;
	private lastClickTimestamp = 0;

	constructor(options: ThorbisEventOptions) {
		super(options);
		// Throttle the click handler for better performance
		this.boundClickHandler = throttle(this.handleClick.bind(this), this.DEBOUNCE_THRESHOLD);
	}

	initialize(): void {
		if (typeof window === "undefined") return;

		document.addEventListener("click", this.boundClickHandler, {
			capture: true,
			passive: true, // Improve performance by marking as passive
		});
	}

	private handleClick(e: MouseEvent): void {
		const now = Date.now();
		if (now - this.lastClickTimestamp < this.DEBOUNCE_THRESHOLD) {
			return;
		}
		this.lastClickTimestamp = now;

		const target = e.target as HTMLElement;
		if (!target || !(target instanceof HTMLElement)) return;

		// Get element data with caching
		const elementData = this.getElementData(target);

		// Track regular click with minimal data
		this.trackEvent("click", {
			element: elementData,
			position: {
				x: Math.round(e.clientX),
				y: Math.round(e.clientY),
			},
			timestamp: now,
		});

		// Manage click history with size limit
		this.updateClickHistory({
			timestamp: now,
			position: {
				x: Math.round(e.clientX),
				y: Math.round(e.clientY),
			},
		});

		this.checkForRageClicks(now);
	}

	private updateClickHistory(click: { timestamp: number; position: { x: number; y: number } }): void {
		this.clickHistory.push(click);

		// Keep history size limited
		if (this.clickHistory.length > this.MAX_HISTORY_SIZE) {
			this.clickHistory = this.clickHistory.slice(-this.MAX_HISTORY_SIZE);
		}
	}

	private checkForRageClicks(now: number): void {
		// Filter clicks within the rage click interval
		const recentClicks = this.clickHistory.filter((click) => now - click.timestamp < this.RAGE_CLICK_INTERVAL);

		// Update history with only recent clicks
		this.clickHistory = recentClicks;

		if (recentClicks.length >= this.RAGE_CLICK_THRESHOLD) {
			const avgInterval = this.calculateAverageInterval(recentClicks);
			const pattern = this.analyzeClickPattern(recentClicks);

			this.trackEvent("rage_click", {
				clicks: recentClicks.length,
				timespan: now - recentClicks[0].timestamp,
				positions: recentClicks.map((click) => click.position),
				metadata: {
					summary: {
						averageInterval: `${avgInterval}ms`,
						pattern,
						clickCount: recentClicks.length,
					},
				},
			});
		}
	}

	private calculateAverageInterval(clicks: Array<{ timestamp: number }>): number {
		if (clicks.length < 2) return 0;

		const intervals = clicks.slice(1).map((click, index) => click.timestamp - clicks[index].timestamp);

		return Math.round(intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length);
	}

	private analyzeClickPattern(clicks: Array<{ position: { x: number; y: number } }>): string {
		if (clicks.length < 2) return "single";

		// Calculate if clicks are in roughly the same position
		const isStationary = clicks.every((click, index) => {
			if (index === 0) return true;
			const prevClick = clicks[index - 1];
			const distance = Math.sqrt(Math.pow(click.position.x - prevClick.position.x, 2) + Math.pow(click.position.y - prevClick.position.y, 2));
			return distance < 10; // 10px threshold
		});

		return isStationary ? "stationary" : "moving";
	}

	destroy(): void {
		if (typeof window === "undefined") return;

		document.removeEventListener("click", this.boundClickHandler, { capture: true });
		this.clickHistory = [];
		super.destroy();
	}
}
