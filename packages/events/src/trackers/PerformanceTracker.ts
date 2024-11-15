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

		try {
			// Track Navigation Timing
			if ("performance" in window && "getEntriesByType" in performance) {
				const entries = performance.getEntriesByType("navigation");
				if (entries.length > 0) {
					const navEntry = entries[0] as PerformanceNavigationTiming;
					const now = Date.now();

					this.trackEvent("page_performance", {
						type: "navigation",
						timing: {
							ttfb: {
								raw: navEntry.responseStart - navEntry.requestStart,
								formatted: this.formatDuration(navEntry.responseStart - navEntry.requestStart),
							},
							domInteractive: {
								raw: navEntry.domInteractive,
								formatted: this.formatDuration(navEntry.domInteractive),
							},
							domComplete: {
								raw: navEntry.domComplete,
								formatted: this.formatDuration(navEntry.domComplete),
							},
							loadComplete: {
								raw: navEntry.loadEventEnd,
								formatted: this.formatDuration(navEntry.loadEventEnd),
							},
						},
						metadata: {
							eventTime: this.formatTimestamp(now),
							startTime: this.formatTimestamp(navEntry.startTime),
							summary: {
								totalLoadTime: this.formatDuration(navEntry.loadEventEnd),
								timeToInteractive: this.formatDuration(navEntry.domInteractive),
								timeToFirstByte: this.formatDuration(navEntry.responseStart - navEntry.requestStart),
							},
						},
					});

					if (this.options.debug) {
						console.log("[Thorbis] Performance metrics captured:", {
							ttfb: this.formatDuration(navEntry.responseStart - navEntry.requestStart),
							domInteractive: this.formatDuration(navEntry.domInteractive),
							domComplete: this.formatDuration(navEntry.domComplete),
							loadComplete: this.formatDuration(navEntry.loadEventEnd),
						});
					}
				}
			}

			// Track Paint Timing
			if ("PerformanceObserver" in window) {
				this.setupPaintObserver();
				this.setupLayoutShiftObserver();
			}
		} catch (error) {
			if (this.options.debug) {
				console.warn("[Thorbis] Error capturing performance metrics:", error);
			}
		}

		this.hasTrackedInitialMetrics = true;
	}

	private setupPaintObserver(): void {
		try {
			const paintObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					this.trackEvent("paint", {
						metadata: {
							paintType: entry.name,
							category: "paint",
						},
						duration: {
							raw: entry.startTime,
							formatted: this.formatDuration(entry.startTime),
						},
					});
				});
				paintObserver.disconnect();
			});
			paintObserver.observe({ entryTypes: ["paint"] });
		} catch (error) {
			if (this.options.debug) {
				console.warn("[Thorbis] Paint timing not supported:", error);
			}
		}
	}

	private setupLayoutShiftObserver(): void {
		try {
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
			clsObserver.observe({ entryTypes: ["layout-shift"] });
		} catch (error) {
			if (this.options.debug) {
				console.warn("[Thorbis] Layout Shift measurement not supported:", error);
			}
		}
	}

	protected formatDuration(ms: number): string {
		// For microseconds (less than 1ms)
		if (ms < 1) {
			return `${(ms * 1000).toFixed(2)}μs`;
		}

		// For milliseconds (less than 1 second)
		if (ms < 1000) {
			return `${ms.toFixed(2)}ms`;
		}

		// For seconds (less than 1 minute)
		if (ms < 60000) {
			const seconds = ms / 1000;
			return `${seconds.toFixed(2)}s`;
		}

		// For minutes
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(2);
		return `${minutes}m ${seconds}s`;
	}

	destroy(): void {
		// Cleanup if needed
	}
}
