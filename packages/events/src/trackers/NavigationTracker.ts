import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class NavigationTracker extends BaseTracker {
	private lastPath: string = typeof window !== "undefined" ? window.location.pathname : "/";
	private navigationHistory: string[] = [];

	initialize(): void {
		if (typeof window === "undefined") return;

		this.trackInitialNavigation();
		this.setupNavigationTracking();
	}

	private trackInitialNavigation(): void {
		this.trackEvent("navigation", {
			url: window.location.href,
			timestamp: Date.now(),
			metadata: {
				referrer: document.referrer,
				path: window.location.pathname,
			},
		});
	}

	private setupNavigationTracking(): void {
		const handleNavigation = () => this.handleNavigation();
		window.addEventListener("popstate", handleNavigation);

		// Track history changes
		const originalPushState = window.history.pushState;
		window.history.pushState = (...args) => {
			originalPushState.apply(window.history, args);
			handleNavigation();
		};
	}

	private handleNavigation(): void {
		const currentPath = window.location.pathname;
		if (currentPath !== this.lastPath) {
			this.trackEvent("navigation", {
				url: window.location.href,
				timestamp: Date.now(),
				metadata: {
					from: this.lastPath,
					to: currentPath,
					referrer: document.referrer,
				},
			});
			this.navigationHistory.push(currentPath);
			this.lastPath = currentPath;
		}
	}

	destroy(): void {
		if (typeof window !== "undefined") {
			window.removeEventListener("popstate", this.handleNavigation);
		}
	}
}
