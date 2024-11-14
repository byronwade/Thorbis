import { BaseTracker } from "./BaseTracker";

export class NavigationTracker extends BaseTracker {
	private lastPath: string = typeof window !== "undefined" ? window.location.pathname : "/";
	private navigationHistory: string[] = [];
	private originalPushState: typeof history.pushState = window?.history?.pushState;

	private handleNavigation = () => {
		const currentPath = window.location.pathname;
		if (currentPath !== this.lastPath) {
			this.trackEvent("navigation", {
				from: this.lastPath,
				to: currentPath,
				timestamp: Date.now(),
			});

			this.navigationHistory.push(currentPath);
			this.lastPath = currentPath;
		}
	};

	initialize() {
		if (typeof window === "undefined") return;

		// Track initial page load
		this.navigationHistory.push(window.location.pathname);

		// Track history changes
		window.history.pushState = (...args) => {
			this.originalPushState.apply(window.history, args);
			this.handleNavigation();
		};

		window.addEventListener("popstate", this.handleNavigation);
		this.trackNavigationTiming();
		this.trackBackForward();
	}

	private trackNavigationTiming() {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				if (entry.entryType === "navigation") {
					const navEntry = entry as PerformanceNavigationTiming;
					this.trackEvent("navigation_timing", {
						type: navEntry.type,
						redirectCount: navEntry.redirectCount,
						timing: {
							redirect: navEntry.redirectEnd - navEntry.redirectStart,
							dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
							tcp: navEntry.connectEnd - navEntry.connectStart,
							request: navEntry.responseStart - navEntry.requestStart,
							response: navEntry.responseEnd - navEntry.responseStart,
							dom: navEntry.domComplete - navEntry.domInteractive,
							load: navEntry.loadEventEnd - navEntry.loadEventStart,
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

	private trackBackForward() {
		window.addEventListener("popstate", () => {
			const currentIndex = this.navigationHistory.indexOf(window.location.pathname);
			if (currentIndex !== -1) {
				const isBack = currentIndex < this.navigationHistory.length - 1;
				this.trackEvent("navigation_direction", {
					type: isBack ? "back" : "forward",
					path: window.location.pathname,
				});
			}
		});
	}

	destroy(): void {
		if (this.originalPushState) {
			window.history.pushState = this.originalPushState;
		}
		window.removeEventListener("popstate", this.handleNavigation);
	}
}
