import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";

interface PageViewData {
	url: string;
	referrer: string;
	title: string;
	timestamp: number;
	timeOnPage?: number;
	pageLoadTime?: number;
	viewport?: {
		width: number;
		height: number;
	};
	screenSize?: {
		width: number;
		height: number;
	};
}

let pageViewStartTime: number | null = null;
let lastPageUrl: string | null = null;

export function initPageTracking() {
	if (typeof window === "undefined") return;

	// Track initial page view
	trackPageView();

	// Track page visibility changes
	document.addEventListener("visibilitychange", handleVisibilityChange);

	// Track page unload
	window.addEventListener("beforeunload", handleBeforeUnload);

	// Track history changes for SPA navigation
	window.addEventListener("popstate", trackPageView);

	logger.debug("Page tracking initialized");
}

async function trackPageView() {
	try {
		const now = Date.now();
		const data: PageViewData = {
			url: window.location.href,
			referrer: document.referrer || lastPageUrl || "",
			title: document.title,
			timestamp: now,
			pageLoadTime: window.performance?.timing?.loadEventEnd - window.performance?.timing?.navigationStart,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
			screenSize: {
				width: window.screen.width,
				height: window.screen.height,
			},
		};

		// Track time spent on previous page if exists
		if (pageViewStartTime && lastPageUrl) {
			const timeOnPreviousPage = now - pageViewStartTime;
			await trackTimeOnPage(lastPageUrl, timeOnPreviousPage);
		}

		// Update tracking state
		pageViewStartTime = now;
		lastPageUrl = window.location.href;

		await analytics.track("page_view", data);

		logger.debug("Page view tracked", {
			url: data.url,
			referrer: data.referrer,
			loadTime: data.pageLoadTime,
		});
	} catch (error) {
		logger.error("Failed to track page view", error);
	}
}

async function trackTimeOnPage(url: string, duration: number) {
	try {
		await analytics.track("time_on_page", {
			url,
			duration,
			timestamp: Date.now(),
			isVisible: !document.hidden,
			readPercentage: calculateReadPercentage(),
		});

		logger.debug("Time on page tracked", {
			url,
			duration: `${Math.round(duration / 1000)}s`,
		});
	} catch (error) {
		logger.error("Failed to track time on page", error);
	}
}

function handleVisibilityChange() {
	if (document.hidden) {
		// Page is hidden, track time spent
		if (pageViewStartTime && lastPageUrl) {
			const timeSpent = Date.now() - pageViewStartTime;
			trackTimeOnPage(lastPageUrl, timeSpent);
		}
	} else {
		// Page is visible again, reset timer
		pageViewStartTime = Date.now();
	}
}

function handleBeforeUnload() {
	if (pageViewStartTime && lastPageUrl) {
		const timeSpent = Date.now() - pageViewStartTime;
		// Use sendBeacon for more reliable tracking on page unload
		const data = {
			url: lastPageUrl,
			duration: timeSpent,
			timestamp: Date.now(),
			readPercentage: calculateReadPercentage(),
		};
		navigator.sendBeacon("/analytics", JSON.stringify(data));
	}
}

function calculateReadPercentage(): number {
	try {
		const windowHeight = window.innerHeight;
		const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
		const scrolled = window.scrollY + windowHeight;
		return Math.min(Math.round((scrolled / documentHeight) * 100), 100);
	} catch {
		return 0;
	}
}
