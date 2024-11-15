import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class PerformanceTracker extends BaseTracker {
	private hasTrackedInitialMetrics = false;

	initialize(): void {
		if (typeof window === "undefined") return;

		// Wait for load event to ensure all metrics are available
		if (document.readyState === "complete") {
			this.captureMetrics();
		} else {
			window.addEventListener("load", () => {
				setTimeout(() => this.captureMetrics(), 0);
			});
		}
	}

	private captureMetrics(): void {
		if (this.hasTrackedInitialMetrics) return;

		// Track Navigation Timing
		const entries = performance.getEntriesByType("navigation");
		if (entries.length > 0) {
			const navEntry = entries[0] as PerformanceNavigationTiming;
			this.trackEvent("page_performance", {
				type: "navigation",
				timing: {
					ttfb: {
						raw: navEntry.responseStart - navEntry.requestStart,
						formatted: this.formatTime(navEntry.responseStart - navEntry.requestStart),
					},
					domInteractive: {
						raw: navEntry.domInteractive,
						formatted: this.formatTime(navEntry.domInteractive),
					},
					domComplete: {
						raw: navEntry.domComplete,
						formatted: this.formatTime(navEntry.domComplete),
					},
					loadComplete: {
						raw: navEntry.loadEventEnd,
						formatted: this.formatTime(navEntry.loadEventEnd),
					},
				},
				metadata: {
					summary: {
						totalLoadTime: this.formatTime(navEntry.loadEventEnd),
						timeToInteractive: this.formatTime(navEntry.domInteractive),
						timeToFirstByte: this.formatTime(navEntry.responseStart - navEntry.requestStart),
					},
				},
			});

			if (this.options.debug) {
				console.log("[Thorbis] Performance metrics captured:", {
					ttfb: this.formatTime(navEntry.responseStart - navEntry.requestStart),
					domInteractive: this.formatTime(navEntry.domInteractive),
					domComplete: this.formatTime(navEntry.domComplete),
					loadComplete: this.formatTime(navEntry.loadEventEnd),
				});
			}
		}

		// Track Paint Timing
		const paintObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			entries.forEach((entry) => {
				this.trackEvent("paint", {
					name: entry.name,
					duration: {
						raw: entry.startTime,
						formatted: this.formatTime(entry.startTime),
					},
				});
			});
			paintObserver.disconnect();
		});

		try {
			paintObserver.observe({ entryTypes: ["paint"] });
		} catch (e) {
			if (this.options.debug) {
				console.warn("[Thorbis] Paint timing not supported");
			}
		}

		// Track Layout Shifts
		let totalShiftScore = 0;
		const clsObserver = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry: any) => {
				totalShiftScore += entry.value;
			});

			this.trackEvent("cumulative_layout_shift", {
				score: totalShiftScore,
				metadata: {
					formatted: totalShiftScore.toFixed(4),
				},
			});
		});

		try {
			clsObserver.observe({ entryTypes: ["layout-shift"] });
		} catch (e) {
			if (this.options.debug) {
				console.warn("[Thorbis] Layout Shift measurement not supported");
			}
		}

		this.hasTrackedInitialMetrics = true;
	}

	private formatTime(ms: number): string {
		if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
		if (ms < 1000) return `${ms.toFixed(2)}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	}

	destroy(): void {
		// Cleanup if needed
	}
}
