import { BaseTracker } from "./BaseTracker";

export class PerformanceTracker extends BaseTracker {
	private metrics = {
		navigationStart: typeof performance !== "undefined" ? performance.timeOrigin : Date.now(),
		loadComplete: 0,
		firstPaint: 0,
		firstContentfulPaint: 0,
		domInteractive: 0,
		domComplete: 0,
		resources: new Map<string, PerformanceResourceTiming>(),
		longTasks: [] as PerformanceEntry[],
		layoutShifts: [] as any[],
	};
	private observers: PerformanceObserver[] = [];
	private updateInterval: NodeJS.Timeout | null = null;

	initialize() {
		if (typeof window === "undefined") return;
		this.trackNavigationTiming();
		this.trackPaintTiming();
		this.trackResourceTiming();
		this.trackLongTasks();
		this.trackLayoutShifts();
		this.startPeriodicUpdates();
	}

	private trackNavigationTiming() {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				if (entry.entryType === "navigation") {
					const navEntry = entry as PerformanceNavigationTiming;
					this.metrics.loadComplete = navEntry.loadEventEnd;
					this.metrics.domInteractive = navEntry.domInteractive;
					this.metrics.domComplete = navEntry.domComplete;

					this.trackEvent("navigation_timing", {
						type: navEntry.type,
						timing: {
							ttfb: navEntry.responseStart - navEntry.requestStart,
							domInteractive: navEntry.domInteractive,
							domComplete: navEntry.domComplete,
							loadComplete: navEntry.loadEventEnd,
						},
					});
				}
			});
		});

		try {
			observer.observe({ entryTypes: ["navigation"] });
		} catch (e) {
			console.warn("Navigation timing not supported");
		}
	}

	private trackPaintTiming() {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				const metric = entry.name === "first-paint" ? "firstPaint" : "firstContentfulPaint";
				this.metrics[metric] = entry.startTime;

				this.trackEvent("paint_timing", {
					type: entry.name,
					startTime: entry.startTime,
				});
			});
		});

		try {
			observer.observe({ entryTypes: ["paint"] });
		} catch (e) {
			console.warn("Paint timing not supported");
		}
	}

	private trackResourceTiming() {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				const resource = entry as PerformanceResourceTiming;
				this.metrics.resources.set(resource.name, resource);

				this.trackEvent("resource_timing", {
					name: resource.name,
					type: resource.initiatorType,
					duration: resource.duration,
					size: resource.transferSize,
				});
			});
		});

		try {
			observer.observe({ entryTypes: ["resource"] });
		} catch (e) {
			console.warn("Resource timing not supported");
		}
	}

	private trackLongTasks() {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				this.metrics.longTasks.push(entry);
				this.trackEvent("long_task", {
					duration: entry.duration,
					startTime: entry.startTime,
				});
			});
		});

		try {
			observer.observe({ entryTypes: ["longtask"] });
		} catch (e) {
			console.warn("Long tasks not supported");
		}
	}

	private trackLayoutShifts() {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				this.metrics.layoutShifts.push(entry);
				this.trackEvent("layout_shift", {
					value: (entry as any).value,
					startTime: entry.startTime,
				});
			});
		});

		try {
			observer.observe({ entryTypes: ["layout-shift"] });
		} catch (e) {
			console.warn("Layout shifts not supported");
		}
	}

	private startPeriodicUpdates() {
		this.updateInterval = setInterval(() => {
			this.trackEvent("performance_metrics", {
				metrics: {
					...this.metrics,
					resources: Array.from(this.metrics.resources.values()),
				},
			});
		}, 10000);
	}

	destroy(): void {
		this.observers.forEach((observer) => observer.disconnect());
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
		}
	}
}
